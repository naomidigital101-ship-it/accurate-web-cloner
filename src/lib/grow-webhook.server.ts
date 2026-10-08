import { adminDb } from "./supabase.server";
import { decodeGrowWebhookBody, diagnoseGrowPayment, explicitlyUnpaid, parseGrowPayment, redactGrowPayload } from "./grow-payment";
import { mailConfigured, sendMail } from "./email/send.server";
import { orderEmailHtml, orderEmailSubject, orderEmailText } from "./order-communication";

const reply = (status: number, result: string) => Response.json({ result }, {
  status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
});
const BOOK_ORDER_NOTIFY_DEFAULT = "Ae.nehora@gmail.com";

async function mailLog(stage: string, status: string, detail?: string, recipient?: string) {
  try { await adminDb().from("mail_log").insert({ stage, status, detail: detail?.slice(0, 500), recipient }); } catch { /* logging must not break payment recording */ }
}

const sha256 = async (value: string) => Array.from(new Uint8Array(
  await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
)).map((v) => v.toString(16).padStart(2, "0")).join("");

async function bookOrderRecipients(): Promise<string[]> {
  // Book purchases have their own recipient and must never inherit the address used
  // for leads or other site forms. A dedicated setting can override this default later.
  const { data: setting } = await adminDb().from("site_settings").select("value").eq("key", "book_order_notify_to").maybeSingle();
  return String(setting?.value ?? BOOK_ORDER_NOTIFY_DEFAULT).split(",").map((x) => x.trim()).filter(Boolean);
}

// An authenticated Grow notification that looks paid but cannot be turned into an order
// must never disappear silently: staff get an alert pointing at the stored event.
async function alertUnrecognized(requestId: string, digest: string) {
  if (!mailConfigured()) return;
  const stage = `grow-alert:${digest}`;
  for (const recipient of await bookOrderRecipients()) {
    const { data: alreadySent } = await adminDb().from("mail_log").select("id")
      .eq("stage", stage).eq("status", "sent").eq("recipient", recipient).limit(1).maybeSingle();
    if (alreadySent) continue;
    const body = `התקבל דיווח תשלום מ-Grow שלא נקלט אוטומטית כהזמנה. יש לבדוק את העסקה ב-Grow ולהזין אותה ידנית.\nמזהה הדיווח: ${requestId}`;
    const result = await sendMail({
      to: recipient, subject: "דיווח מ-Grow לא נקלט - נדרשת בדיקה",
      html: `<div dir="rtl"><p>${body.replace(/\n/g, "<br>")}</p></div>`, text: body, idempotencyKey: stage,
    });
    await mailLog(stage, result.sent ? "sent" : "failed", result.error ?? result.skipped, recipient);
  }
}

async function notifyOrder(payment: ReturnType<typeof parseGrowPayment>): Promise<boolean> {
  if (!payment) return false;
  const id = payment.provider_transaction_id;
  // Keep existing keys stable; encode opaque provider IDs for the email API.
  const mailId = /^[\w-]+$/.test(id) ? id : await sha256(id);
  const stage = `order:${mailId}`;
  const db = adminDb();
  if (!mailConfigured()) { await mailLog(stage, "failed", "LOVABLE_API_KEY חסר"); return false; }
  const recipients = await bookOrderRecipients();
  let sentToAll = true;
  for (const recipient of recipients) {
    const { data: alreadySent } = await db.from("mail_log").select("id")
      .eq("stage", stage).eq("status", "sent").eq("recipient", recipient).limit(1).maybeSingle();
    if (alreadySent) continue;
    const result = await sendMail({
      to: recipient,
      subject: orderEmailSubject(payment), html: orderEmailHtml(payment), text: orderEmailText(payment),
      replyTo: payment.email || undefined,
      idempotencyKey: stage,
    });
    await mailLog(stage, result.sent ? "sent" : "failed", result.error ?? result.skipped, recipient);
    if (!result.sent) sentToAll = false;
  }
  return sentToAll;
}

export async function handleGrowWebhook(request: Request): Promise<Response> {
  if (request.method !== "POST") return reply(405, "method_not_allowed");
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!/^[a-f0-9]{64}$/.test(key)) return reply(401, "unauthorized");
  const requestId = crypto.randomUUID();
  const diagnostic = (outcome: string, extra: Record<string, unknown> = {}) => {
    console.info(JSON.stringify({ event: "grow_webhook", request_id: requestId, outcome, ...extra }));
  };
  // Every authenticated delivery is kept (redacted) so a failure can be diagnosed from
  // what Grow actually sent, and so the admin can tell real deliveries from manual entry.
  const event: Record<string, unknown> = {
    request_id: requestId,
    user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    client_ip: request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null,
    content_type: request.headers.get("content-type")?.slice(0, 100) ?? null,
  };
  const recordEvent = async (outcome: string, extra: Record<string, unknown> = {}) => {
    try { await adminDb().from("grow_webhook_events").insert({ ...event, ...extra, outcome }); } catch { /* must not block payment handling */ }
  };
  try {
    const hash = await sha256(key);
    const db = adminDb();
    const { data: config, error } = await db.from("payment_webhook_config")
      .select("id").eq("id", "grow").eq("secret_hash", hash).maybeSingle();
    if (error) return reply(503, "temporarily_unavailable");
    if (!config) return reply(401, "unauthorized");
    diagnostic("authenticated");
    // Bound the stream, including chunked requests without Content-Length. Grow sends the
    // documented JSON shape, but different dashboard flows may encode it as JSON or form data.
    const reader = request.body?.getReader();
    if (!reader) { diagnostic("empty_body"); return reply(400, "empty_body"); }
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 65536) { await reader.cancel(); diagnostic("too_large"); return reply(413, "too_large"); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const raw = new TextDecoder().decode(bytes);
    const digest = await sha256(raw.trim());
    const body = decodeGrowWebhookBody(raw);
    if (!body) {
      diagnostic("invalid_body");
      await recordEvent("invalid_body", { payload: { unparsed_length: raw.length } });
      await alertUnrecognized(requestId, digest);
      return reply(400, "invalid_body");
    }
    event.payload = redactGrowPayload(body);
    const payment = parseGrowPayment(body, digest);
    if (!payment) {
      const diagnostics = diagnoseGrowPayment(body);
      diagnostic("payment_rejected", diagnostics);
      await recordEvent("payment_rejected", { diagnostics });
      if (!explicitlyUnpaid(body)) await alertUnrecognized(requestId, digest);
      return reply(422, "not_a_successful_payment");
    }
    event.transaction_id = payment.provider_transaction_id;
    const { error: insertError } = await db.from("book_orders").upsert(payment, {
      onConflict: "provider_transaction_id", ignoreDuplicates: true,
    });
    if (insertError) {
      diagnostic("order_storage_failed");
      await recordEvent("order_storage_failed");
      return reply(503, "temporarily_unavailable");
    }
    diagnostic("order_recorded");
    await db.from("payment_webhook_config").update({ last_received_at: new Date().toISOString() }).eq("id", "grow");
    // A failed email returns 503 so Grow retries. The saved order is safe, and mail_log plus
    // the provider idempotency key prevent duplicate notifications when the retry arrives.
    if (!await notifyOrder(payment)) {
      diagnostic("notification_pending");
      await recordEvent("notification_pending");
      return reply(503, "notification_pending");
    }
    diagnostic("completed");
    await recordEvent("completed");
    return reply(200, "ok");
  } catch {
    // Do not log the URL (bearer credential) or the customer's payload.
    diagnostic("processing_failed");
    await recordEvent("processing_failed");
    return reply(503, "temporarily_unavailable");
  }
}
