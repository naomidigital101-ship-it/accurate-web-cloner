import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminDb, requireStaff } from "../supabase.server";

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

    const { error } = await adminDb().from("leads").insert({
      ...lead,
      full_name:
        lead.full_name?.trim() ||
        [lead.first_name, lead.last_name].filter(Boolean).join(" ").trim() ||
        null,
      status: "new",
    });
    if (error) throw new Error("save_failed");
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
export const listLeads = createServerFn({ method: "POST" })
  .inputValidator(ListInput)
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);

    const PAGE = 1000; // התקרה הקשיחה של PostgREST
    const out: Record<string, unknown>[] = [];
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
