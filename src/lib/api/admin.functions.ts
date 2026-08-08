import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminDb, requireStaff } from "../supabase.server";

/** כל פונקציה כאן מאמתת צוות בעצמה. אין הסתמכות על בדיקה בצד הלקוח. */
async function staffOrThrow(accessToken: string | undefined) {
  const staff = await requireStaff(accessToken);
  if (!staff) throw new Error("unauthorized");
  return staff;
}

export const getAdminOverview = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional() }))
  .handler(async ({ data }) => {
    await staffOrThrow(data.accessToken);
    const db = adminDb();
    const tables = [
      "leads",
      "stories",
      "rabbi_letters",
      "press_items",
      "certificates",
      "gallery_images",
      "services",
      "faqs",
      "media",
    ] as const;

    const entries = await Promise.all(
      tables.map(async (t) => {
        const { count } = await db.from(t).select("id", { count: "exact", head: true });
        return [t, count ?? 0] as const;
      }),
    );

    const { count: newLeads } = await db
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");

    return { ...Object.fromEntries(entries), leads_new: newLeads ?? 0 } as Record<string, number>;
  });
