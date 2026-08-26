import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminDb, requireStaff } from "../supabase.server";
import { leadEmailHtml, leadEmailText, leadSubject } from "../email/lead-notification";
import { mailConfigured, sendMail } from "../email/send.server";

const LeadInput = z.object({
  kind: z.enum(["request", "donate"]),
  lang: z.enum(["he", "en"]).default("he"),
  first_name: z.string().trim().max(120).optional(),
  last_name: z.string().trim().max(120).optional(),
  full_name: z.string().trim().max(240).optional(),
  phone: z.string().trim().max(60).optional(),
  email: z.string().trim().max(200).optional(),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(120).optional(),
  target: z.string().trim().max(120).optional(),
  hand: z.string().trim().max(60).optional(),
  delivery: z.string().trim().max(200).optional(),
  condition: z.string().trim().max(120).optional(),
  dedication: z.string().trim().max(2000).optional(),
  // מלכודת לבוטים: שדה מוסתר שאדם לעולם לא ימלא
  website: z.string().max(200).optional(),
});

/**
 * ציבורי בכוונה - כל אחד רשאי לשלוח טופס.
 * ה-RLS מתיר לאנונימי INSERT בלבד ל-leads, ולא SELECT, כך שאי אפשר לקרוא פניות של אחרים.
 */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(LeadInput)
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const }; // בוט - מדווח הצלחה ולא שומר

    const { website: _drop, ...lead } = data;
    const hasContact = Boolean(lead.phone?.trim() || lead.email?.trim());
    if (!hasContact) throw new Error("missing_contact");

    const fullName =
      lead.full_name?.trim() ||
      [lead.first_name, lead.last_name].filter(Boolean).join(" ").trim() ||
      null;

    // מזהה השורה נדרש כמפתח ייחודיות למייל ההתראה
    const { data: row, error } = await adminDb()
      .from("leads")
      .insert({ ...lead, full_name: fullName, status: "new" })
      .select("id")
      .single();
    if (error) throw new Error("save_failed");

    /**
     * ממתינים להתראה, לא שולחים אותה ברקע.
     *
     * ב-Cloudflare Workers כל עבודה אסינכרונית שלא ממתינים לה נהרגת ברגע
     * שהתשובה נשלחת - האיזולט פשוט מפסיק לרוץ. הגרסה הקודמת השתמשה ב-void
     * ולכן ההתראה מעולם לא הספיקה לרוץ: הפנייה נשמרה, ובטבלת היומן לא הופיעה
     * אפילו שורה אחת. ctx.waitUntil היה הפתרון הנכון אילו היה לנו גישה ל-ctx
     * בתוך server function, ואין.
     *
     * המחיר הוא כמה מאות מילישניות בשליחת הטופס. זה עדיף על אובדן כל ההתראות.
     * שגיאה בשליחה נרשמת ביומן ולעולם לא מפילה את הפנייה - פנייה שנשמרה
     * חשובה יותר ממייל שיצא.
     */
    try {
      await notifyNewLead({ ...lead, full_name: fullName, id: row?.id });
    } catch (e) {
      await mailLog("notify", "threw", e instanceof Error ? `${e.name}: ${e.message}` : String(e));
    }

    return { ok: true as const };
  });

async function staffOrThrow(accessToken: string | undefined) {
  const staff = await requireStaff(accessToken);
  if (!staff) throw new Error("unauthorized");
  return staff;
}

const ListInput = z.object({
  accessToken: z.string().optional(),
  status: z.enum(["all", "new", "in_progress", "done", "spam"]).default("all"),
  kind: z.enum(["all", "request", "donate"]).default("all"),
  search: z.string().trim().max(120).optional(),
  limit: z.number().min(1).max(20000).default(500),
});

/**
 * `leads_admin` הוא ה-view שמוסיף repeat_count - כמה פעמים פנה אותו טלפון,
 * מחושב בפוסטגרס על כל הטבלה. חישוב בצד השרת לא אפשרי כאן: PostgREST מחזיר
 * לכל היותר 1,000 שורות לבקשה, ולכן ספירה על מה שחזר הייתה מפספסת פונים חוזרים.
 */
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export const listLeads = createServerFn({ method: "POST" })
  .inputValidator(ListInput)
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);

    const PAGE = 1000; // התקרה הקשיחה של PostgREST
    const out: Record<string, JsonValue>[] = [];
    for (let from = 0; from < data.limit; from += PAGE) {
      let q = adminDb()
        .from("leads_admin")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, Math.min(from + PAGE, data.limit) - 1);
      if (data.status !== "all") q = q.eq("status", data.status);
      if (data.kind !== "all") q = q.eq("kind", data.kind);
      if (data.search) {
        const s = data.search.replace(/[%,()]/g, " ").trim();
        if (s) q = q.or(`full_name.ilike.%${s}%,phone.ilike.%${s}%,email.ilike.%${s}%,city.ilike.%${s}%`);
      }
      const { data: rows, error } = await q;
      if (error) throw new Error("load_failed");
      out.push(...(rows ?? []));
      if (!rows || rows.length < PAGE) break;
    }
    return out;
  });

/** ספירת התורים לכותרות הטאבים - זול, בלי להביא שורות */
export const leadCounts = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional() }))
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const db = adminDb();
    const one = async (kind: "request" | "donate", status?: string) => {
      let q = db.from("leads").select("id", { count: "exact", head: true }).eq("kind", kind);
      if (status) q = q.eq("status", status);
      const { count } = await q;
      return count ?? 0;
    };
    const [requestsNew, donationsNew, requests, donations] = await Promise.all([
      one("request", "new"),
      one("donate", "new"),
      one("request"),
      one("donate"),
    ]);
    return { requestsNew, donationsNew, requests, donations };
  });

export const updateLead = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().optional(),
      id: z.string().uuid(),
      status: z.enum(["new", "in_progress", "done", "spam"]).optional(),
      notes: z.string().max(4000).optional(),
      supplied: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.status) patch.status = data.status;
    if (data.notes !== undefined) patch.notes = data.notes;
    // סימון "סופק" הוא גם מה שמזין את מונה הזוגות באתר, ולכן נשמר עם תאריך
    if (data.supplied !== undefined) {
      patch.supplied_at = data.supplied ? new Date().toISOString() : null;
      if (data.supplied && !data.status) patch.status = "done";
    }
    const { error } = await adminDb().from("leads").update(patch).eq("id", data.id);
    if (error) throw new Error("update_failed");
    return { ok: true as const };
  });


/**
 * מייל התראה על פנייה חדשה.
 *
 * היעד נלקח מהגדרות האתר (lead_notify_to) ואם הוא ריק - מרשימת המורשים,
 * כך שההתראה לא נעלמת רק בגלל שדה שלא מולא.
 */
/**
 * רושם שלב בשליחה ל-mail_log.
 *
 * בלי זה כשל שליחה נעלם לחלוטין: ההתראה רצה מחוץ למחזור החיים של הבקשה
 * (כדי שלא תעכב את הגולש), ולוגים של קונסולה בוורקר לא נשמרים בשום מקום
 * שאפשר להסתכל בו אחר כך. הטבלה מוגנת ב-RLS בלי מדיניות - רק service_role.
 */
async function mailLog(stage: string, status: string, detail?: string, recipient?: string) {
  try {
    await adminDb().from("mail_log").insert({ stage, status, detail: detail?.slice(0, 500), recipient });
  } catch {
    /* יומן שנכשל לא יפיל שליחה */
  }
}

async function notifyNewLead(lead: Record<string, unknown>): Promise<void> {
  if (!mailConfigured()) {
    await mailLog("config", "skipped", "mailConfigured() החזיר false - מפתח ה-API לא נראה בזמן ריצה");
    return;
  }

  const db = adminDb();
  const { data: setting } = await db
    .from("site_settings")
    .select("value")
    .eq("key", "lead_notify_to")
    .maybeSingle();

  let to = String(setting?.value ?? "").trim();
  if (!to) {
    const { data: admins } = await db.from("admin_allowlist").select("email");
    to = (admins ?? []).map((a) => a.email as string).filter(Boolean).join(",");
  }
  if (!to) {
    await mailLog("recipient", "skipped", "אין נמען: גם lead_notify_to וגם admin_allowlist ריקים");
    return;
  }

  const phone = String(lead.phone ?? "").trim();
  let repeatCount = 1;
  if (phone) {
    const { count } = await db
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone);
    repeatCount = count ?? 1;
  }

  const payload = {
    kind: lead.kind as "request" | "donate",
    lang: lead.lang as "he" | "en" | undefined,
    fullName: (lead.full_name as string) ?? null,
    phone: (lead.phone as string) ?? null,
    email: (lead.email as string) ?? null,
    city: (lead.city as string) ?? null,
    address: (lead.address as string) ?? null,
    target: (lead.target as string) ?? null,
    hand: (lead.hand as string) ?? null,
    delivery: (lead.delivery as string) ?? null,
    condition: (lead.condition as string) ?? null,
    dedication: (lead.dedication as string) ?? null,
    createdAt: new Date(),
    repeatCount,
  };

  const res = await sendMail({
    to: to.split(",").map((x) => x.trim()).filter(Boolean),
    subject: leadSubject(payload),
    html: leadEmailHtml(payload),
    text: leadEmailText(payload),
    // תשובה למייל תגיע ישירות לפונה, אם השאיר כתובת
    replyTo: (lead.email as string) || undefined,
    idempotencyKey: `lead:${String(lead.id ?? "")}`,
  });

  await mailLog("send", res.sent ? "sent" : "failed", res.error ?? res.skipped, to);
}
