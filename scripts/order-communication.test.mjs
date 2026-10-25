import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { test } from 'node:test';
const source = readFileSync(new URL('../src/lib/order-communication.ts', import.meta.url), 'utf8')
  .replace('import { SITE_URL } from "@/lib/site";', 'const SITE_URL = "https://or-hadash.org.il";');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { orderEmailHtml, orderEmailSubject, orderEmailText, shippingWhatsAppText, customerWhatsAppUrl } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const order = { full_name: 'לקוח לבדיקה', phone: '0500000000', email: 'test@example.com', address: 'רחוב לדוגמה 12\nדירה 3, ירושלים', products: [{name:'שני ספרים',quantity:'1'}], amount_agorot:13800, shipping_agorot:2000, shipping_method:'משלוח', provider_transaction_id:'test:a&b/1', provider_payment_date:'2026-10-23' };
test('delivery update is clearly an existing order, with address in HTML and text', () => {
  assert.match(orderEmailSubject(order, true), /עודכנו פרטי המשלוח/);
  for (const content of [orderEmailHtml(order,true),orderEmailText(order,true)]) {
    assert.ok(content.includes(order.address));
    assert.ok(content.includes('לא בוצע חיוב נוסף'));
  }
});
test('email preserves address lines and links to the exact authenticated order', () => {
  const html = orderEmailHtml(order);
  assert.ok(html.includes(order.address));
  assert.ok(html.includes('white-space:pre-line'));
  assert.ok(html.includes('/admin/orders?transaction=test%3Aa%26b%2F1'));
  assert.ok(html.includes('פתיחת ההזמנה להעתקת הפרטים'));
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

test('customer WhatsApp links normalize local and international Israeli numbers', () => {
  for (const phone of ['050-1234567', '+972 50 1234567', '00972501234567', '+972 (0)50 1234567']) assert.equal(customerWhatsAppUrl(phone), 'https://wa.me/972501234567');
  for (const phone of [null, '', '123', '050123', 'not a phone']) assert.equal(customerWhatsAppUrl(phone), null);
  assert.ok(orderEmailHtml(order).includes('href="https://wa.me/972500000000"'));
  assert.ok(!orderEmailHtml({...order, phone:null}).includes('https://wa.me/'));
});
