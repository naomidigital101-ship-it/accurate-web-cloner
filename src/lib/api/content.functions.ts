import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { invalidateContent } from "../content";
import { adminDb, publicDb, requireStaff } from "../supabase.server";

/** רשימה סגורה - שם טבלה מגיע מהלקוח, ובלי זה זו פרצה */
const TABLES = [
  "stories",
  "rabbi_letters",
  "press_items",
  "gallery_images",
  "services",
  "faqs",
  "certificates",
  "thank_you_letters",
  "media",
] as const;
const TableName = z.enum(TABLES);
export type TableName = z.infer<typeof TableName>;

const ORDER: Record<TableName, { col: string; asc: boolean }> = {
  stories: { col: "sort_order", asc: true },
  rabbi_letters: { col: "sort_order", asc: true },
  press_items: { col: "sort_order", asc: true },
  gallery_images: { col: "sort_order", asc: true },
  thank_you_letters: { col: "sort_order", asc: true },
  services: { col: "sort_order", asc: true },
  faqs: { col: "sort_order", asc: true },
  certificates: { col: "sort_order", asc: true },
  media: { col: "created_at", asc: false },
};

/** קריאה ציבורית - דרך publicDb, כלומר כפוף ל-RLS ומחזיר רק published */
export const listPublic = createServerFn({ method: "POST" })
  .inputValidator(z.object({ table: TableName, lang: z.enum(["he", "en"]).optional() }))
  .handler(async ({ data }) => {
    const o = ORDER[data.table];
    let q = publicDb().from(data.table).select("*").order(o.col, { ascending: o.asc });
    if (data.lang) q = q.eq("lang", data.lang);
    const { data: rows, error } = await q;
    if (error) return [];
    return rows ?? [];
  });

async function staffOrThrow(accessToken: string | undefined) {
  const staff = await requireStaff(accessToken);
  if (!staff) throw new Error("unauthorized");
  return staff;
}

/** קריאה לניהול - כולל טיוטות */
export const listAll = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), table: TableName }))
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const o = ORDER[data.table];
    const { data: rows, error } = await adminDb()
      .from(data.table)
      .select("*")
      .order(o.col, { ascending: o.asc });
    if (error) throw new Error("load_failed");
    return rows ?? [];
  });

export const saveRow = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().optional(),
      table: TableName,
      id: z.string().uuid().optional(),
      values: z.record(z.string(), z.unknown()),
    }),
  )
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const db = adminDb();
    const values = { ...data.values, updated_at: new Date().toISOString() };
    // אף פעם לא לתת ללקוח לקבוע מזהה או תאריך יצירה
    delete (values as Record<string, unknown>).id;
    delete (values as Record<string, unknown>).created_at;

    if (data.id) {
      const { error } = await db.from(data.table).update(values).eq("id", data.id);
      if (error) throw new Error(error.message);
      invalidateContent(data.table);
      return { ok: true as const, id: data.id };
    }
    const { data: row, error } = await db.from(data.table).insert(values).select("id").single();
    if (error) throw new Error(error.message);
    invalidateContent(data.table);
    return { ok: true as const, id: row.id as string };
  });

export const deleteRow = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), table: TableName, id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const staff = await staffOrThrow(data.accessToken);
    if (!staff.isAdmin) throw new Error("admin_only");
    const { error } = await adminDb().from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    invalidateContent(data.table);
    return { ok: true as const };
  });

/** שינוי סדר - שומר את כל השורות בבת אחת */
export const reorder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().optional(),
      table: TableName,
      ids: z.array(z.string().uuid()).max(500),
    }),
  )
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const db = adminDb();
    await Promise.all(
      data.ids.map((id, i) => db.from(data.table).update({ sort_order: (i + 1) * 10 }).eq("id", id)),
    );
    invalidateContent(data.table);
    return { ok: true as const };
  });

/* ===== הגדרות האתר ===== */

export const listSettings = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional() }))
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const { data: rows } = await adminDb()
      .from("site_settings")
      .select("*")
      .not("key", "like", "\\_\\_%")
      .order("group_name")
      .order("sort_order");
    return rows ?? [];
  });

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().optional(),
      changes: z.array(z.object({ key: z.string().max(80), value: z.string().max(2000).nullable() })).max(100),
    }),
  )
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const db = adminDb();
    for (const c of data.changes) {
      if (c.key.startsWith("__")) continue; // מפתחות מערכת אינם ניתנים לעריכה מהממשק
      await db.from("site_settings").update({ value: c.value, updated_at: new Date().toISOString() }).eq("key", c.key);
    }
    settingsCache = null; // שמירה מהאדמין מבטלת את המטמון מיד
    return { ok: true as const, saved: data.changes.length };
  });

/** קריאה ציבורית של ההגדרות - זה מה שמזין את הפרונט */
/**
 * ההגדרות נטענות בכל רינדור של כל עמוד, ולכן כל בקשה שילמה נסיעה לסופבייס
 * לפני שהוגש ביט אחד של HTML. זה היה חלק ניכר מזמן התגובה של השרת.
 *
 * המטמון חי בזיכרון של ה-worker, שנשמר בין בקשות. 60 שניות הן פשרה: שינוי
 * הגדרה מהאדמין מופיע באתר תוך דקה לכל היותר, ובתמורה רוב הבקשות לא נוגעות
 * ב-DB בכלל. אין כאן נתונים אישיים - רק טלפון, כתובת וקישורי תרומה.
 */
const SETTINGS_TTL_MS = 60_000;
let settingsCache: { at: number; value: Record<string, string> } | null = null;

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (settingsCache && now - settingsCache.at < SETTINGS_TTL_MS) {
    return settingsCache.value;
  }
  const { data: rows } = await publicDb().from("site_settings").select("key,value");
  const out: Record<string, string> = {};
  for (const r of rows ?? []) {
    if (r.key && !String(r.key).startsWith("__") && r.value) out[r.key as string] = r.value as string;
  }

  /**
   * מונה הזוגות שחולקו.
   * כברירת מחדל המספר ידני, בדיוק כפי שהיה. אם מפעילים pairs_delivered_auto,
   * המונה = בסיס היסטורי + כל פנייה שסומנה "סופק" באדמין, כך שהוא מתעדכן לבד.
   * כל כשל בחישוב משאיר את הערך הידני - המספר באתר לעולם לא יתרוקן.
   */
  if (out.pairs_delivered_auto === "1") {
    try {
      const base = Number(String(out.pairs_delivered_base ?? "0").replace(/\D/g, "")) || 0;
      const { count } = await adminDb()
        .from("leads")
        .select("id", { count: "exact", head: true })
        .not("supplied_at", "is", null);
      out.pairs_delivered = (base + (count ?? 0)).toLocaleString("en-US");
    } catch {
      /* נשאר הערך הידני */
    }
  }
  delete out.pairs_delivered_auto;
  delete out.pairs_delivered_base;

  settingsCache = { at: now, value: out };
  return out;
});
