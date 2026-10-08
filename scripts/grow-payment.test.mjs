import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGrowPayment, decodeGrowWebhookBody, diagnoseGrowPayment, cents, redactGrowPayload } from '../src/lib/grow-payment.ts';

const fixture = { status: '1', data: {
  statusCode: '2', transactionId: 'test-123', sum: '163', fullName: 'בדיקת מערכת',
  shipping: { type: 'משלוח עד הבית', amount: '20' },
  productData: [{ name: 'שני עותקים של הספר', quantity: '1', price: '143' }],
  cardSuffix: '1234', cardExp: '1127', transactionToken: 'must-not-persist',
} };

test('accepts a paid PaymentLinks record without the API envelope', () => {
  assert.equal(parseGrowPayment(fixture.data)?.amount_agorot, 16300);
  for (const statusCode of [undefined, '0', '1', '3']) {
    assert.equal(parseGrowPayment({ ...fixture.data, statusCode }), null);
  }
});

test('decodes data serialized inside a JSON envelope', () => {
  const decoded = decodeGrowWebhookBody(JSON.stringify({status: '1', data: JSON.stringify(fixture.data)}));
  assert.equal(parseGrowPayment(decoded)?.amount_agorot, 16300);
});

test('decodes bracket-encoded form fields including products and shipping', () => {
  const raw = new URLSearchParams({status:'1', 'data[statusCode]':'2',
    'data[transactionId]':'form-123', 'data[sum]':'163',
    'data[shipping][type]':'משלוח', 'data[shipping][amount]':'20',
    'data[productData][0][name]':'שני ספרים',
    'data[productData][0][quantity]':'1', 'data[productData][0][price]':'143',
  }).toString();
  const payment = parseGrowPayment(decodeGrowWebhookBody(raw));
  assert.equal(payment?.amount_agorot, 16300);
  assert.equal(payment?.shipping_agorot, 2000);
  assert.equal(payment?.products[0].name, 'שני ספרים');
});
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

test('opaque transaction codes preserve punctuation and normalize surrounding whitespace', () => {
  for (const id of [' abc/def+ghi= ', '{transaction:123}', 'payment.123:456']) {
    const body = {transactionCode:id,paymentSum:'1'};
    assert.equal(parseGrowPayment(body)?.provider_transaction_id, id.trim());
    assert.equal(diagnoseGrowPayment(body).transaction_id_valid, true);
  }
  for (const id of ['', '   ', 'a\u0000b', 'a'.repeat(257)]) {
    assert.equal(parseGrowPayment({transactionCode:id,paymentSum:'1'}), null);
  }
});

test('decodes Grow JSON and form-encoded webhook bodies', () => {
  const payload = { status: '1', data: { statusCode: '2', transactionId: 'TX123', sum: '163' } };
  assert.deepEqual(decodeGrowWebhookBody(JSON.stringify(payload)), payload);
  const encoded = new URLSearchParams({ status: '1', data: JSON.stringify(payload.data) }).toString();
  assert.deepEqual(decodeGrowWebhookBody(encoded), payload);
  assert.equal(decodeGrowWebhookBody(''), null);
});

test('diagnostics identify validation failures without retaining customer or payment data', () => {
  const diagnostic = diagnoseGrowPayment({ ...fixture, data: { ...fixture.data,
    statusCode: '1', fullName: 'private-name', payerEmail: 'private@example.test',
    sum: 'invalid-money', transactionToken: 'private-secret',
  } });
  assert.equal(diagnostic.payment_status_success, false);
  assert.equal(diagnostic.positive_amount, false);
  assert.equal(diagnostic.transaction_id_valid, true);
  assert.equal(/private|must-not-persist|1234|test-123/.test(JSON.stringify(diagnostic)), false);
  assert.equal(diagnoseGrowPayment({data: []}).data_type, 'array');
  assert.equal(diagnoseGrowPayment({data: '{}'}).data_type, 'string');
});

test('malformed, conflicting and prototype-related form keys cannot bypass validation', () => {
  for (const raw of [
    'data[statusCode]=1&data[statusCode]=2',
    'data=garbage&data[statusCode]=2',
    'data[statusCode]=2&data=garbage',
    '__proto__[polluted]=true', 'data[constructor][prototype][polluted]=true',
    'data[productData][999999][name]=bad',
    'data[statusCode]=2&data[transactionId]=abc&data[sum]=78&status=0',
  ]) assert.equal(parseGrowPayment(decodeGrowWebhookBody(raw)), null);
  assert.equal({}.polluted, undefined);
});

test('all supported encodings reject pending or declined payments', () => {
  for (const code of ['0', '1', '3']) {
    const data = { ...fixture.data, statusCode: code };
    for (const raw of [
      JSON.stringify({status:'1', data}),
      JSON.stringify({status:'1', data:JSON.stringify(data)}),
      JSON.stringify(data),
      new URLSearchParams({status:'1','data[statusCode]':code,'data[transactionId]':'abc','data[sum]':'78'}).toString(),
    ]) assert.equal(parseGrowPayment(decodeGrowWebhookBody(raw)), null);
  }
});

// Dashboard webhook for a Grow payment page: transactionCode, paymentSum, no envelope/status.
const pagePayload = {
  webhookKey: 'secret-key', transactionCode: '86940855', transactionType: 'bit', paymentSum: 78,
  paymentsNum: 1, paymentType: 'רגיל', paymentDate: '07/10/2026', asmachta: '176973981',
  paymentDesc: 'ספר - עותק בודד', fullName: 'בדיקת מערכת', payerPhone: '0500000000',
  payerEmail: 'test@test.com', cardSuffix: '1234', cardBrand: 'Mastercard',
  purchasePageKey: 'abc', purchasePageTitle: 'ספר - עותק בודד',
  purchaseCustomField: { 'אופן משלוח': 'איסוף עצמי', 'עיר': 'בית אל' },
};

test('accepts the static payment-page webhook with numeric sum and custom fields', () => {
  const p = parseGrowPayment(pagePayload);
  assert.equal(p.provider_transaction_id, '86940855');
  assert.equal(p.amount_agorot, 7800);
  assert.equal(p.products[0].name, 'ספר - עותק בודד');
  assert.match(p.address, /אופן משלוח: איסוף עצמי/);
  assert.equal(p.payment_method, 'bit');
});

test('empty transactionCode falls back to asmachta, then to a body digest', () => {
  assert.equal(parseGrowPayment({ ...pagePayload, transactionCode: '' })?.provider_transaction_id, 'asmachta:176973981');
  assert.equal(parseGrowPayment({ ...pagePayload, transactionCode: '  ', asmachta: '' }, 'abc')?.provider_transaction_id, 'body:abc');
  assert.equal(parseGrowPayment({ ...pagePayload, transactionCode: '', asmachta: '' }), null);
});

test('explicitly unpaid payment-page notifications are rejected', () => {
  assert.equal(parseGrowPayment({ ...pagePayload, statusCode: '1' }), null);
  assert.equal(parseGrowPayment({ ...pagePayload, status: 'נכשל' }), null);
});

test('stored copy redacts card data, tokens and the webhook key', () => {
  const r = redactGrowPayload({ ...pagePayload, transactionToken: 't', cardExp: '1127' });
  for (const k of ['webhookKey', 'cardSuffix', 'cardBrand', 'transactionToken', 'cardExp']) assert.equal(r[k], '[redacted]');
  assert.equal(r.transactionCode, '86940855');
});
