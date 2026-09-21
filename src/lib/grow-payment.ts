// Only documented, successful Grow payment notifications are accepted.
// Never persist card information, transaction tokens or the raw webhook body.
type RecordValue = Record<string, unknown>;
const record = (v: unknown): RecordValue => v && typeof v === "object" && !Array.isArray(v) ? v as RecordValue : {};
const text = (v: unknown, max = 500) => typeof v === "string" || typeof v === "number" ? String(v).slice(0, max) : "";
export function cents(v: unknown): number | null {
  const s = text(v).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const n = Math.round(Number(s) * 100);
  return Number.isSafeInteger(n) && n <= 100000000 ? n : null;
}
export function parseGrowPayment(input: unknown) {
  const root = record(input);
  const nested = root.data !== undefined;
  const d = nested ? record(root.data) : root;
  if (nested && (text(root.status) !== "1" || text(d.statusCode) !== "2")) return null;
  if (!nested && (d.statusCode !== undefined && text(d.statusCode) !== "2")) return null;
  if (!nested && (d.status !== undefined && !["שולם", "2"].includes(text(d.status)))) return null;
  if (!nested && !d.transactionCode) return null;
  const transactionId = text(d.transactionId ?? d.transactionCode, 120);
  const amount = cents(d.sum ?? d.paymentSum);
  if (!transactionId || !/^[\w-]+$/.test(transactionId) || amount === null || amount <= 0) return null;
  const shipping = record(d.shipping);
  const products = (Array.isArray(d.productData) ? d.productData : []).slice(0, 50).map((p) => {
    const product = record(p);
    return { name: text(product.name, 250), quantity: text(product.quantity, 10), price: text(product.price, 30) };
  });
  return {
    provider_transaction_id: transactionId,
    amount_agorot: amount,
    shipping_agorot: cents(shipping.amount),
    shipping_method: text(shipping.type, 250),
    full_name: text(d.fullName, 200),
    phone: text(d.payerPhone, 50),
    email: text(d.payerEmail, 254),
    address: text(d.address, 500),
    description: text(d.description ?? d.paymentDesc ?? d.purchasePageTitle, 500),
    provider_payment_date: text(d.paymentDate, 50),
    payment_method: text(d.transactionType ?? d.transactionTypeId, 100),
    products,
  };
}
export type GrowPayment = NonNullable<ReturnType<typeof parseGrowPayment>>;
