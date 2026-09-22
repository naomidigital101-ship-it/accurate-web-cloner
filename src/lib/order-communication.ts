import { SITE_URL } from "@/lib/site";
import type { GrowPayment } from "@/lib/grow-payment";

type OrderDetails = GrowPayment & { received_at?: string };

const esc = (value: unknown) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const money = (agorot: number | null) => agorot === null
  ? "לא נמסר בנפרד"
  : new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 2 }).format(agorot / 100);

export function orderProducts(order: OrderDetails): string {
  return order.products.length
    ? order.products.map((p) => `${p.name || "ספר"}${p.quantity ? ` × ${p.quantity}` : ""}`).join(", ")
    : order.description || "פרטי המוצר לא נמסרו";
}

export function shippingWhatsAppText(order: OrderDetails): string {
  return [
    "הזמנה חדשה של הספר ״קשר של תפילין״",
    "",
    `שם: ${order.full_name || "לא נמסר"}`,
    `טלפון: ${order.phone || "לא נמסר"}`,
    order.email ? `מייל: ${order.email}` : "",
    `הזמנה: ${orderProducts(order)}`,
    `אופן קבלה: ${order.shipping_method || "לא נמסר"}`,
    `כתובת: ${order.address || "לא נמסרה"}`,
    `סכום ששולם: ${money(order.amount_agorot)}`,
    `דמי משלוח: ${money(order.shipping_agorot)}`,
    `אסמכתה: ${order.provider_transaction_id}`,
  ].filter(Boolean).join("\n");
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;width:34%;vertical-align:top;">${esc(label)}</td><td style="padding:10px 14px 10px 0;border-bottom:1px solid #e5e7eb;color:#1c1e2b;font-weight:700;vertical-align:top;">${esc(value)}</td></tr>`;
}

export function orderEmailSubject(order: OrderDetails): string {
  return `רכישה חדשה של הספר: ${order.full_name || order.phone || "לקוח חדש"}`;
}

export function orderEmailHtml(order: OrderDetails): string {
  const whatsapp = shippingWhatsAppText(order);
  const rows = [
    ["שם", order.full_name || "לא נמסר"], ["טלפון", order.phone || "לא נמסר"],
    ["אימייל", order.email || "לא נמסר"], ["כתובת", order.address || "לא נמסרה"],
    ["הזמנה", orderProducts(order)], ["אופן קבלה", order.shipping_method || "לא נמסר"],
    ["סכום ששולם", money(order.amount_agorot)], ["דמי משלוח", money(order.shipping_agorot)],
    ["תאריך תשלום", order.provider_payment_date || "לא נמסר"], ["אסמכתה", order.provider_transaction_id],
  ].map(([label, value]) => row(label, value)).join("");
  return `<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;"><table role="presentation" width="100%" dir="rtl" style="padding:24px 12px;background:#f3f4f6;"><tr><td align="center"><table role="presentation" width="100%" dir="rtl" style="max-width:620px;background:#fff;border-radius:14px;overflow:hidden;"><tr><td align="center" style="padding:26px 24px 16px;"><img src="${SITE_URL}/email/logo-kesher.png" width="190" alt="קשר של תפילין"></td></tr><tr><td style="padding:0 24px;"><div style="height:3px;background:#54edc3;border-radius:3px;"></div></td></tr><tr><td style="padding:22px 24px 8px;"><div style="font-size:13px;font-weight:700;color:#2d2e83;">התשלום עבר בהצלחה</div><h1 style="margin:6px 0;font-size:26px;color:#090a45;">התקבלה רכישה חדשה של הספר</h1><p style="margin:0;color:#6b7280;">פרטי הלקוח והאספקה מרוכזים כאן.</p></td></tr><tr><td style="padding:12px 24px 0;"><table role="presentation" width="100%" dir="rtl" style="border-collapse:collapse;font-size:15px;">${rows}</table></td></tr><tr><td style="padding:22px 24px;"><a href="${SITE_URL}/admin/orders" style="display:inline-block;background:#2d2e83;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px;">פתיחת ההזמנה באדמין</a></td></tr><tr><td style="padding:0 24px 24px;"><div style="font-size:13px;font-weight:700;color:#6b7280;margin-bottom:8px;">הודעה מוכנה לאחראי המשלוחים</div><pre style="margin:0;padding:14px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#1c1e2b;">${esc(whatsapp)}</pre></td></tr></table></td></tr></table></body></html>`;
}

export const orderEmailText = shippingWhatsAppText;
