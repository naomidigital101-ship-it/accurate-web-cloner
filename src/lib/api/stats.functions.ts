import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminDb, requireStaff } from "../supabase.server";

async function staffOrThrow(accessToken: string | undefined) {
  const staff = await requireStaff(accessToken);
  if (!staff) throw new Error("unauthorized");
  return staff;
}

export type LeadStats = {
  total: number;
  newCount: number;
  inProgress: number;
  done: number;
  spam: number;
  requests: number;
  donations: number;
  thisMonth: number;
  lastMonth: number;
  monthly: { month: string; requests: number; donations: number }[];
  cities: { name: string; count: number }[];
  targets: { name: string; count: number }[];
  delivery: { name: string; count: number }[];
  repeatContacts: number;
  needsShipping: number;
  supplied: number;
  firstLead: string | null;
  lastLead: string | null;
};

/**
 * כל הסטטיסטיקה מחושבת בפוסטגרס (`public.lead_stats`) ולא נשמרת בשום מקום,
 * כדי שלא יהיה מצב של מספר שמוצג ולא תואם את הנתונים.
 *
 * **חובה לחשב בצד ה-DB ולא בצד השרת:** PostgREST מחזיר לכל היותר 1,000 שורות
 * לבקשה, ומתעלם מ-limit גדול יותר. חישוב על התוצאה החתוכה נתן דשבורד ששיקר -
 * הגרף הראה חודש אחד עם 32 פניות ואפס בכל השאר, כי אלה היו 1,000 הפניות
 * הישנות ביותר. אין להחזיר את הפניות לשרת רק כדי לספור אותן.
 */
export const getLeadStats = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), months: z.number().min(3).max(36).default(12) }))
  .handler(async ({ data }): Promise<LeadStats> => {
    await staffOrThrow(data.accessToken);
    const { data: stats, error } = await adminDb().rpc("lead_stats", { p_months: data.months });
    if (error) throw new Error(error.message);
    return stats as LeadStats;
  });

/* ===== ייבוא פניות מקובץ CSV של Elementor ===== */

const ImportRow = z.object({
  kind: z.enum(["request", "donate"]),
  lang: z.enum(["he", "en"]).default("he"),
  status: z.enum(["new", "in_progress", "done", "spam"]).default("done"),
  first_name: z.string().max(80).nullable().optional(),
  last_name: z.string().max(80).nullable().optional(),
  full_name: z.string().max(160).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  email: z.string().max(160).nullable().optional(),
  address: z.string().max(200).nullable().optional(),
  city: z.string().max(80).nullable().optional(),
  target: z.string().max(60).nullable().optional(),
  hand: z.string().max(30).nullable().optional(),
  delivery: z.string().max(120).nullable().optional(),
  condition: z.string().max(60).nullable().optional(),
  dedication: z.string().max(2000).nullable().optional(),
  referer_url: z.string().max(400).nullable().optional(),
  legacy_id: z.string().max(40).nullable().optional(),
  created_at: z.string(),
});

/**
 * מייבא אצווה של פניות. אידמפוטנטי: אינדקס ייחודי על (source, kind, legacy_id)
 * מונע כפילות, כך שהרצה חוזרת של אותו קובץ לא תיצור רשומות נוספות.
 */
export const importLeads = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), rows: z.array(ImportRow).max(500) }))
  .handler(async ({ data }) => {
    const staff = await staffOrThrow(data.accessToken);
    if (!staff.isAdmin) throw new Error("admin_only");

    const payload = data.rows.map((r) => ({ ...r, source: "elementor" }));
    const { error, count } = await adminDb()
      .from("leads")
      .upsert(payload, { onConflict: "source,kind,legacy_id", ignoreDuplicates: true, count: "exact" });
    if (error) throw new Error(error.message);
    return { inserted: count ?? 0, received: payload.length };
  });
