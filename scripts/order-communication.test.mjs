import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { test } from 'node:test';
const source = readFileSync(new URL('../src/lib/order-communication.ts', import.meta.url), 'utf8')
  .replace('import { SITE_URL } from "@/lib/site";', 'const SITE_URL = "https://or-hadash.org.il";');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { orderEmailHtml, shippingWhatsAppText } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const order = { full_name: 'לקוח לבדיקה', phone: '0500000000', email: 'test@example.com', address: 'רחוב לדוגמה 12\nדירה 3, ירושלים', products: [{name:'שני ספרים',quantity:'1'}], amount_agorot:13800, shipping_agorot:2000, shipping_method:'משלוח', provider_transaction_id:'test:a&b/1', provider_payment_date:'2026-10-23' };
test('email preserves address lines and links to the exact authenticated order', () => {
  const html = orderEmailHtml(order);
  assert.ok(html.includes(order.address));
  assert.ok(html.includes('white-space:pre-line'));
  assert.ok(html.includes('/admin/orders?transaction=test%3Aa%26b%2F1'));
  assert.ok(html.includes('להעתקת כל פרטי ההזמנה לוואטסאפ'));
  assert.ok(!html.includes('<script'));
});
test('WhatsApp copy includes customer, address, products, shipping, payment and reference', () => {
  const text = shippingWhatsAppText(order);
  for (const value of [order.full_name,order.phone,order.email,order.address,order.provider_transaction_id,order.provider_payment_date,'שני ספרים']) assert.ok(text.includes(value));
});
test('missing address is explicit and customer HTML cannot inject markup', () => {
  const html = orderEmailHtml({...order, address:'',full_name:'<script>alert(1)</script>'});
  assert.ok(html.includes('לא נמסרה בדיווח התשלום'));
  assert.ok(!html.includes('<script>'));
});
