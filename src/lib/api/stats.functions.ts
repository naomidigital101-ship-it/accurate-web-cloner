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
  firstLead: string | null;
  lastLead: string | null;
};

/**
 * כל הסטטיסטיקה מחושבת מהשורות עצמן ולא נשמרת בשום מקום,
 * כדי שלא יהיה מצב של מספר שמוצג ולא תואם את הנתונים.
 */
export const getLeadStats = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), months: z.number().min(3).max(36).default(12) }))
  .handler(async ({ data }): Promise<LeadStats> => {
    await staffOrThrow(data.accessToken);
    const db = adminDb();

    const { data: rows } = await db
      .from("leads")
      .select("kind,status,city,target,delivery,phone,created_at")
      .order("created_at", { ascending: true })
      .limit(20000);
    const all = rows ?? [];

    const ym = (iso: string) => iso.slice(0, 7);
    const now = new Date();
    const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

    // סדרת חודשים רציפה - חודש בלי פניות חייב להופיע כאפס, אחרת הגרף משקר
    const keys: string[] = [];
    for (let i = data.months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    const byMonth = new Map(keys.map((k) => [k, { month: k, requests: 0, donations: 0 }]));
    for (const r of all) {
      const k = ym(r.created_at as string);
      const b = byMonth.get(k);
      if (!b) continue;
      if (r.kind === "donate") b.donations++;
      else b.requests++;
    }

    const tally = (get: (r: (typeof all)[number]) => string | null, limit: number) => {
      const m = new Map<string, number>();
      for (const r of all) {
        if (r.status === "spam") continue;
        const v = (get(r) ?? "").trim();
        if (!v) continue;
        m.set(v, (m.get(v) ?? 0) + 1);
      }
      return [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
    };

    const phones = new Map<string, number>();
    for (const r of all) {
      const p = String(r.phone ?? "").replace(/\D/g, "");
      if (p.length >= 9) phones.set(p, (phones.get(p) ?? 0) + 1);
    }

    const count = (f: (r: (typeof all)[number]) => boolean) => all.filter(f).length;

    return {
      total: all.length,
      newCount: count((r) => r.status === "new"),
      inProgress: count((r) => r.status === "in_progress"),
      done: count((r) => r.status === "done"),
      spam: count((r) => r.status === "spam"),
      requests: count((r) => r.kind === "request" && r.status !== "spam"),
      donations: count((r) => r.kind === "donate" && r.status !== "spam"),
      thisMonth: count((r) => ym(r.created_at as string) === thisKey),
      lastMonth: count((r) => ym(r.created_at as string) === prevKey),
      monthly: keys.map((k) => byMonth.get(k)!),
      cities: tally((r) => r.city as string | null, 8),
      targets: tally((r) => r.target as string | null, 6),
      delivery: tally((r) => r.delivery as string | null, 4),
      repeatContacts: [...phones.values()].filter((n) => n > 1).length,
      needsShipping: count(
        (r) => typeof r.delivery === "string" && r.delivery.includes("משלוח") && r.status !== "spam",
      ),
      firstLead: (all[0]?.created_at as string) ?? null,
      lastLead: (all[all.length - 1]?.created_at as string) ?? null,
    };
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
