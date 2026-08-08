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

export const listLeads = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().optional(),
      status: z.enum(["all", "new", "in_progress", "done", "spam"]).default("all"),
      kind: z.enum(["all", "request", "donate"]).default("all"),
    }),
  )
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    let q = adminDb().from("leads").select("*").order("created_at", { ascending: false }).limit(500);
    if (data.status !== "all") q = q.eq("status", data.status);
    if (data.kind !== "all") q = q.eq("kind", data.kind);
    const { data: rows, error } = await q;
    if (error) throw new Error("load_failed");
    return rows ?? [];
  });

export const updateLead = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().optional(),
      id: z.string().uuid(),
      status: z.enum(["new", "in_progress", "done", "spam"]).optional(),
      notes: z.string().max(4000).optional(),
    }),
  )
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.status) patch.status = data.status;
    if (data.notes !== undefined) patch.notes = data.notes;
    const { error } = await adminDb().from("leads").update(patch).eq("id", data.id);
    if (error) throw new Error("update_failed");
    return { ok: true as const };
  });
