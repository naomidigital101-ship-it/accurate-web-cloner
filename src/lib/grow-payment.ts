// Only successful Grow payment notifications become orders.
// Never persist card information or transaction tokens (see redactGrowPayload).
type RecordValue = Record<string, unknown>;
const record = (v: unknown): RecordValue => v && typeof v === "object" && !Array.isArray(v) ? v as RecordValue : {};
const text = (v: unknown, max = 500) => typeof v === "string" || typeof v === "number" ? String(v).slice(0, max) : "";

// Provider IDs are opaque strings, not slugs. Do not truncate or discard
// punctuation: either would reject legitimate IDs or merge distinct payments.
function transactionKey(v: unknown): string | null {
  if (typeof v !== "string" && typeof v !== "number") return null;
  const key = String(v).trim();
  return key.length > 0 && key.length <= 256 && !/[\u0000-\u001f\u007f]/.test(key) ? key : null;
}

function decodeContainers(input: unknown): unknown {
  const root = record(input);
  const decode = (v: unknown) => {
    if (typeof v !== "string") return v;
    try { return JSON.parse(v); } catch { return v; }
  };
  if (root.data !== undefined) root.data = decode(root.data);
  const payment = root.data !== undefined ? record(root.data) : root;
  for (const key of ["shipping", "productData", "purchaseCustomField", "dynamicFields"]) {
    if (payment[key] !== undefined) payment[key] = decode(payment[key]);
  }
  return input;
}

export function decodeGrowWebhookBody(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try { return decodeContainers(JSON.parse(trimmed)); } catch { /* Form-encoded payload. */ }

  const params = new URLSearchParams(trimmed);
  if (!params.size || params.size > 512) return null;
  const body: RecordValue = {};
  for (const [key, value] of params) {
    // Support PHP-style data[statusCode] and data[productData][0][name].
    // Bound nesting/indices and reject duplicate or conflicting assignments.
    if (!/^[A-Za-z_][\w]*(?:\[(?:[A-Za-z_][\w]*|\d+)\]){0,3}$/.test(key)) return null;
    const path = key.replace(/\]/g, "").split("[");
    if (path.some((part) => ["__proto__", "constructor", "prototype"].includes(part))) return null;
    let target: RecordValue | unknown[] = body;
    for (let i = 0; i < path.length; i++) {
      const part = path[i];
      const numeric = /^\d+$/.test(part);
      if (numeric && Number(part) >= 50) return null;
      if (Array.isArray(target) !== numeric) return null;
      const container = target as RecordValue;
      if (i === path.length - 1) {
        if (Object.hasOwn(container, part)) return null;
        container[part] = value;
      } else {
        const nextIsIndex = /^\d+$/.test(path[i + 1]);
        if (!Object.hasOwn(container, part)) container[part] = nextIsIndex ? [] : {};
        const next = container[part];
        if (!next || typeof next !== "object" || Array.isArray(next) !== nextIsIndex) return null;
        target = next as RecordValue | unknown[];
      }
    }
  }
  return decodeContainers(body);
}
export function cents(v: unknown): number | null {
  const s = text(v).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const n = Math.round(Number(s) * 100);
  return Number.isSafeInteger(n) && n <= 100000000 ? n : null;
}
// Diagnostics deliberately contain only fixed field names, types and validation
// outcomes. Never include payload values, customer details or payment credentials.
export function diagnoseGrowPayment(input: unknown) {
  const root = record(input);
  const nested = root.data !== undefined;
  const d = nested ? record(root.data) : root;
  const shape = (v: unknown) => v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
  const amount = cents(paymentAmount(d));
  const rawId = d.transactionId ?? d.transactionCode;
  const transactionId = resolveTransactionId(d);
  return {
    root_type: shape(input), data_type: shape(root.data), nested,
    envelope_success: text(root.status) === "1",
    payment_status_success: text(d.statusCode) === "2",
    legacy_status_success: d.status === undefined || ["שולם", "2"].includes(text(d.status)),
    transaction_id_type: shape(d.transactionId), transaction_code_type: shape(d.transactionCode),
    transaction_id_valid: transactionId !== null,
    transaction_id_length: typeof rawId === "string" ? rawId.length : null,
    transaction_id_blank: typeof rawId === "string" && !rawId.trim(),
    asmachta_present: transactionKey(d.asmachta) !== null,
    sum_type: shape(d.sum), payment_sum_type: shape(d.paymentSum), amount_type: shape(d.amount),
    explicitly_unpaid: explicitlyUnpaid(root),
    positive_amount: amount !== null && amount > 0,
  };
}
// Grow sends different shapes per product: PaymentLinks (transactionId, often in a
// {status, data} envelope), API and static payment pages (transactionCode, paymentSum,
// purchaseCustomField). The dashboard webhook only fires after a completed transaction,
// so only an explicit non-paid status rejects a notification.
function paymentAmount(d: RecordValue): unknown {
  return d.paymentSum ?? d.sum ?? d.amount;
}
export function explicitlyUnpaid(input: unknown): boolean {
  const root = record(input);
  const nested = root.data !== undefined;
  const d = nested ? record(root.data) : root;
  if (nested && text(root.status) !== "1") return true;
  if (d.statusCode !== undefined && d.statusCode !== "" && text(d.statusCode) !== "2") return true;
  if (d.status !== undefined && d.status !== "" && !["שולם", "2"].includes(text(d.status))) return true;
  // PaymentLinks records (transactionId, no transactionCode) must carry statusCode 2.
  return !d.transactionCode && d.transactionId !== undefined && text(d.statusCode) !== "2";
}
// The provider transaction code is the canonical key (it is what Grow shows as the
// transaction number). When a shape carries no usable code, fall back to the bank
// approval number, then to the process id, so a paid notification is never dropped.
function resolveTransactionId(d: RecordValue): string | null {
  const direct = transactionKey(d.transactionId) ?? transactionKey(d.transactionCode);
  if (direct) return direct;
  const asmachta = transactionKey(d.asmachta);
  if (asmachta) return `asmachta:${asmachta}`;
  const process = transactionKey(d.processId) ?? transactionKey(d.paymentLinkProcessId);
  return process ? `process:${process}` : null;
}
function customFields(d: RecordValue): string {
  const lines: string[] = [];
  const custom = d.purchaseCustomField;
  if (custom && typeof custom === "object" && !Array.isArray(custom)) {
    for (const [k, v] of Object.entries(custom as RecordValue).slice(0, 30)) {
      const value = text(v, 300).trim();
      if (value) lines.push(`${text(k, 80)}: ${value}`);
    }
  }
  for (const f of (Array.isArray(d.dynamicFields) ? d.dynamicFields : []).slice(0, 30)) {
    const field = record(f);
    const value = text(field.field_value ?? field.option_label, 300).trim();
    if (value) lines.push(`${text(field.label ?? field.key, 80)}: ${value}`);
  }
  return lines.join("\n");
}
/** `fallbackId` (a digest of the body) keeps idempotency when Grow sends no identifier. */
export function parseGrowPayment(input: unknown, fallbackId?: string) {
  const root = record(input);
  const d = root.data !== undefined ? record(root.data) : root;
  if (explicitlyUnpaid(input)) return null;
  const transactionId = resolveTransactionId(d) ?? (fallbackId ? `body:${fallbackId}` : null);
  const amount = cents(paymentAmount(d));
  if (!transactionId || amount === null || amount <= 0) return null;
  const shipping = record(d.shipping);
  const products = (Array.isArray(d.productData) ? d.productData : []).slice(0, 50).map((p) => {
    const product = record(p);
    return { name: text(product.name, 250), quantity: text(product.quantity, 10), price: text(product.price, 30) };
  });
  const pageTitle = text(d.purchasePageTitle, 250);
  if (!products.length && pageTitle) products.push({ name: pageTitle, quantity: "1", price: text(paymentAmount(d), 30) });
  const address = [text(d.address, 500), customFields(d)].filter(Boolean).join("\n");
  return {
    provider_transaction_id: transactionId,
    amount_agorot: amount,
    shipping_agorot: cents(shipping.amount),
    shipping_method: text(shipping.type, 250),
    full_name: text(d.fullName, 200),
    phone: text(d.payerPhone, 50),
    email: text(d.payerEmail, 254),
    address: address.slice(0, 2000),
    description: text(d.description ?? d.paymentDesc ?? d.purchasePageTitle, 500),
    provider_payment_date: text(d.paymentDate, 50),
    payment_method: text(d.transactionType ?? d.transactionTypeId, 100),
    products,
  };
}
// Stored copy of a notification for diagnosis: payment credentials and tokens removed.
export function redactGrowPayload(input: unknown, depth = 0): unknown {
  if (depth > 5) return null;
  if (Array.isArray(input)) return input.slice(0, 50).map((v) => redactGrowPayload(v, depth + 1));
  if (input && typeof input === "object") {
    const out: RecordValue = {};
    for (const [k, v] of Object.entries(input as RecordValue).slice(0, 100)) {
      out[k] = /card|token|webhookkey|cvv|exp$|password|secret/i.test(k) ? "[redacted]" : redactGrowPayload(v, depth + 1);
    }
    return out;
  }
  return typeof input === "string" ? input.slice(0, 1000) : input;
}
export type GrowPayment = NonNullable<ReturnType<typeof parseGrowPayment>>;
