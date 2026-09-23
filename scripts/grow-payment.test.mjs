import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGrowPayment, decodeGrowWebhookBody, cents } from '../src/lib/grow-payment.ts';

const fixture = { status: '1', data: {
  statusCode: '2', transactionId: 'test-123', sum: '163', fullName: 'בדיקת מערכת',
  shipping: { type: 'משלוח עד הבית', amount: '20' },
  productData: [{ name: 'שני עותקים של הספר', quantity: '1', price: '143' }],
  cardSuffix: '1234', cardExp: '1127', transactionToken: 'must-not-persist',
} };
test('preserves exact payment total and separate shipping, excludes payment credentials', () => {
  const p = parseGrowPayment(fixture);
  assert.equal(p.amount_agorot, 16300);
  assert.equal(p.shipping_agorot, 2000);
  assert.equal(p.products[0].quantity, '1');
  assert.equal('cardSuffix' in p, false);
  assert.equal(JSON.stringify(p).includes('must-not-persist'), false);
});
test('declined, pending, malformed and refund notifications cannot create paid orders', () => {
  for (const statusCode of ['0', '1', '3', '', undefined]) {
    assert.equal(parseGrowPayment({ ...fixture, data: { ...fixture.data, statusCode } }), null);
  }
  assert.equal(parseGrowPayment({ ...fixture, status: '0' }), null);
  assert.equal(parseGrowPayment({ ...fixture, data: { ...fixture.data, sum: '-163' } }), null);
  assert.equal(parseGrowPayment({ ...fixture, data: { ...fixture.data, transactionId: '' } }), null);
  assert.equal(parseGrowPayment({}), null);
});
test('same transaction produces same unique key on retry', () => {
  assert.equal(parseGrowPayment(fixture).provider_transaction_id, parseGrowPayment(structuredClone(fixture)).provider_transaction_id);
});
test('flat Grow transaction format and unknown shipping are preserved', () => {
  const p = parseGrowPayment({ transactionCode: 'ABC123', paymentSum: 78, paymentDesc: 'ספר', paymentDate: '22/09/26' });
  assert.equal(p.amount_agorot, 7800);
  assert.equal(p.shipping_agorot, null);
  assert.equal(p.description, 'ספר');
});
test('money is integer agorot and rejects malformed amounts', () => {
  assert.equal(cents('71.50'), 7150);
  for (const v of ['', null, '-1', '1.999', 'NaN', '1e3']) assert.equal(cents(v), null);
});

test('decodes Grow JSON and form-encoded webhook bodies', () => {
  const payload = { status: '1', data: { statusCode: '2', transactionId: 'TX123', sum: '163' } };
  assert.deepEqual(decodeGrowWebhookBody(JSON.stringify(payload)), payload);
  const encoded = new URLSearchParams({ status: '1', data: JSON.stringify(payload.data) }).toString();
  assert.deepEqual(decodeGrowWebhookBody(encoded), payload);
  assert.equal(decodeGrowWebhookBody(''), null);
});
