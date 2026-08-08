import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
  "media",
] as const;
const TableName = z.enum(TABLES);
type TableName = z.infer<typeof TableName>;

const ORDER: Record<TableName, { col: string; asc: boolean }> = {
  stories: { col: "sort_order", asc: true },
  rabbi_letters: { col: "sort_order", asc: true },
  press_items: { col: "sort_order", asc: true },
  gallery_images: { col: "sort_order", asc: true },
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
      return { ok: true as const, id: data.id };
    }
    const { data: row, error } = await db.from(data.table).insert(values).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true as const, id: row.id as string };
  });

export const deleteRow = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), table: TableName, id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const staff = await staffOrThrow(data.accessToken);
    if (!staff.isAdmin) throw new Error("admin_only");
    const { error } = await adminDb().from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
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
    return { ok: true as const, saved: data.changes.length };
  });

/** קריאה ציבורית של ההגדרות - זה מה שמזין את הפרונט */
export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data: rows } = await publicDb().from("site_settings").select("key,value");
  const out: Record<string, string> = {};
  for (const r of rows ?? []) {
    if (r.key && !String(r.key).startsWith("__") && r.value) out[r.key as string] = r.value as string;
  }
  return out;
});
