import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb, requireStaff } from "../supabase.server";
import type { GrowPayment } from "../grow-payment";

export type BookOrder = GrowPayment & {
  id: string; received_at: string; fulfillment: "new" | "processing" | "fulfilled";
};
export const listOrders = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), page: z.number().int().min(0).max(100000).default(0) }))
  .handler(async ({ data }) => {
    if (!await requireStaff(data.accessToken)) throw new Error("unauthorized");
    const db = adminDb();
    const { data: rows, count, error } = await db.from("book_orders")
      .select("*", { count: "exact" }).order("received_at", { ascending: false }).order("id")
      .range(data.page * 50, data.page * 50 + 49);
    if (error) throw new Error("לא ניתן לטעון את הרכישות כרגע");
    const { data: config } = await db.from("payment_webhook_config").select("last_received_at").eq("id", "grow").maybeSingle();
    return { orders: (rows ?? []) as BookOrder[], count: count ?? 0, lastReceived: config?.last_received_at as string | null };
  });
export const updateOrder = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), id: z.string().uuid(), fulfillment: z.enum(["new", "processing", "fulfilled"]) }))
  .handler(async ({ data }) => {
    if (!await requireStaff(data.accessToken)) throw new Error("unauthorized");
    const { error } = await adminDb().from("book_orders").update({ fulfillment: data.fulfillment }).eq("id", data.id);
    if (error) throw new Error("שמירת הסטטוס נכשלה");
    return { ok: true };
  });
