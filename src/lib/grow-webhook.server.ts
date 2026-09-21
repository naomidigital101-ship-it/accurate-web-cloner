import { adminDb } from "./supabase.server";
import { parseGrowPayment } from "./grow-payment";

const reply = (status: number, result: string) => Response.json({ result }, {
  status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
});

export async function handleGrowWebhook(request: Request): Promise<Response> {
  if (request.method !== "POST") return reply(405, "method_not_allowed");
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!/^[a-f0-9]{64}$/.test(key)) return reply(401, "unauthorized");
  try {
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key))))
      .map((v) => v.toString(16).padStart(2, "0")).join("");
    const db = adminDb();
    const { data: config, error } = await db.from("payment_webhook_config")
      .select("id").eq("id", "grow").eq("secret_hash", hash).maybeSingle();
    if (error) return reply(503, "temporarily_unavailable");
    if (!config) return reply(401, "unauthorized");
    if (!request.headers.get("content-type")?.includes("application/json")) return reply(415, "json_required");
    // Bound the stream, including chunked requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, "empty_body");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 65536) { await reader.cancel(); return reply(413, "too_large"); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let body: unknown;
    try { body = JSON.parse(new TextDecoder().decode(bytes)); }
    catch { return reply(400, "invalid_json"); }
    const payment = parseGrowPayment(body);
    if (!payment) return reply(422, "not_a_successful_payment");
    const { error: insertError } = await db.from("book_orders").upsert(payment, {
      onConflict: "provider_transaction_id", ignoreDuplicates: true,
    });
    if (insertError) return reply(503, "temporarily_unavailable");
    await db.from("payment_webhook_config").update({ last_received_at: new Date().toISOString() }).eq("id", "grow");
    return reply(200, "ok");
  } catch {
    // Do not log the URL (bearer credential) or the customer's payload.
    return reply(503, "temporarily_unavailable");
  }
}
