import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminDb, requireStaff } from "../supabase.server";

/**
 * ציוני דרך על ציר הזמן.
 *
 * הגרף מראה כמה פניות היו בכל חודש, אבל לא למה. בלי הקשר, קפיצה או ירידה
 * הן רק מספר - ואי אפשר לדעת אם קמפיין עבד, אם שינוי באתר עזר, או אם פשוט
 * היה חג. כאן נרשם מה קרה ומתי, והגרף מסמן את זה מתחת לחודש הרלוונטי.
 *
 * הטבלה מוגנת ב-RLS בלי אף מדיניות, כלומר רק service_role נוגע בה - וכל
 * הפונקציות כאן מאמתות שהמשתמש הוא צוות לפני שהן ניגשות אליה.
 */

export const CATEGORIES = [
  { key: "site", label: "שינוי באתר" },
  { key: "marketing", label: "קמפיין / פרסום" },
  { key: "media", label: "כתבה או ראיון" },
  { key: "business", label: "שינוי בעסק" },
  { key: "external", label: "אירוע חיצוני" },
  { key: "other", label: "אחר" },
] as const;

const CategoryKey = z.enum(["site", "marketing", "media", "business", "external", "other"]);

export type TimelineEvent = {
  id: string;
  event_date: string;
  title: string;
  note: string | null;
  category: z.infer<typeof CategoryKey>;
};

async function staffOrThrow(accessToken: string | undefined) {
  const staff = await requireStaff(accessToken);
  if (!staff) throw new Error("unauthorized");
  return staff;
}

export const listTimelineEvents = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional() }))
  .handler(async ({ data }): Promise<TimelineEvent[]> => {
    await staffOrThrow(data.accessToken);
    const { data: rows, error } = await adminDb()
      .from("timeline_events")
      .select("id,event_date,title,note,category")
      .order("event_date", { ascending: false });
    if (error) throw new Error(error.message);
    return (rows ?? []) as TimelineEvent[];
  });

export const saveTimelineEvent = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().optional(),
      id: z.string().uuid().optional(),
      event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך לא תקין"),
      title: z.string().trim().min(1, "צריך כותרת").max(120),
      note: z.string().trim().max(1000).optional(),
      category: CategoryKey.default("other"),
    }),
  )
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const values = {
      event_date: data.event_date,
      title: data.title,
      note: data.note?.trim() || null,
      category: data.category,
      updated_at: new Date().toISOString(),
    };
    const db = adminDb();
    if (data.id) {
      const { error } = await db.from("timeline_events").update(values).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true as const, id: data.id };
    }
    const { data: row, error } = await db.from("timeline_events").insert(values).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true as const, id: row.id as string };
  });

export const deleteTimelineEvent = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const { error } = await adminDb().from("timeline_events").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
