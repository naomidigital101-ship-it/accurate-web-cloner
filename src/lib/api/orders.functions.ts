import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb, requireStaff } from "../supabase.server";
import type { GrowPayment } from "../grow-payment";

export type OrderStatus = "new" | "processing" | "fulfilled";
export type BookOrder = GrowPayment & { id: string; received_at: string; fulfillment: OrderStatus };
const Status = z.enum(["new", "processing", "fulfilled"]);

async function staff(accessToken?: string) {
  if (!await requireStaff(accessToken)) throw new Error("unauthorized");
}

export const listOrders = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    accessToken: z.string().optional(), page: z.number().int().min(0).max(100000).default(0),
    status: z.union([z.literal("all"), Status]).default("new"),
    search: z.string().trim().max(200).optional(), limit: z.number().int().min(1).max(20000).default(50),
  }))
  .handler(async ({ data }) => {
    await staff(data.accessToken);
    const db = adminDb();
    let query = db.from("book_orders").select("*", { count: "exact" });
    if (data.status !== "all") query = query.eq("fulfillment", data.status);
    const safe = data.search?.replace(/[%_,()]/g, " ").trim();
    if (safe) query = query.or([
      `full_name.ilike.%${safe}%`, `phone.ilike.%${safe}%`, `email.ilike.%${safe}%`,
      `provider_transaction_id.ilike.%${safe}%`, `description.ilike.%${safe}%`, `address.ilike.%${safe}%`,
    ].join(","));
    const from = data.page * data.limit;
    const { data: rows, count, error } = await query.order("received_at", { ascending: false }).order("id")
      .range(from, from + data.limit - 1);
    if (error) throw new Error("load_failed");
    const { data: config } = await db.from("payment_webhook_config").select("last_received_at").eq("id", "grow").maybeSingle();
    return { orders: (rows ?? []) as BookOrder[], count: count ?? 0, lastReceived: config?.last_received_at as string | null };
  });

export const orderCounts = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional() }))
  .handler(async ({ data }) => {
    await staff(data.accessToken);
    const db = adminDb();
    const count = async (status?: OrderStatus) => {
      let query = db.from("book_orders").select("id", { count: "exact", head: true });
      if (status) query = query.eq("fulfillment", status);
      const result = await query;
      if (result.error) throw new Error("count_failed");
      return result.count ?? 0;
    };
    const [newCount, processing, fulfilled, all] = await Promise.all([count("new"), count("processing"), count("fulfilled"), count()]);
    return { new: newCount, processing, fulfilled, all };
  });

export const updateOrder = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().optional(), id: z.string().uuid(), fulfillment: Status }))
  .handler(async ({ data }) => {
    await staff(data.accessToken);
    const { error } = await adminDb().from("book_orders").update({ fulfillment: data.fulfillment }).eq("id", data.id);
    if (error) throw new Error("update_failed");
    return { ok: true };
  });
