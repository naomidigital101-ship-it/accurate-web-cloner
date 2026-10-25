import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import * as payment from '../src/lib/grow-payment.ts';

// Exercise the actual HTTP handler with in-memory database/mail adapters.
// No production records, mail or payment services are touched by these tests.
function harness() {
  const orders = new Map();
  const logs = [];
  const sent = [];
  const state = { mailFails: false };
  const key = 'a'.repeat(64);
  let expectedHash;
  const db = { async rpc(name, {payment: incoming}) {
    assert.equal(name, 'record_grow_order');
    const id = incoming.provider_transaction_id;
    if (!orders.has(id)) orders.set(id, {...incoming, fulfillment:'new', delivery_revision:0});
    const saved = orders.get(id);
    let changed = false;
    for (const field of ['address', 'shipping_method', 'shipping_agorot']) {
      if ((saved[field] === null || saved[field] === '') && incoming[field] !== null && incoming[field] !== '') {
        saved[field] = incoming[field]; changed = true;
      }
    }
    if (changed) saved.delivery_revision++;
    return {data:{...saved},error:null};
  }, from(table) {
    const filters = {};
    const query = {
      select() { return query; },
      eq(k, v) { filters[k] = v; return query; },
      limit() { return query; },
      async maybeSingle() {
        if (table === 'payment_webhook_config') return { data: filters.secret_hash === expectedHash ? {id:'grow'} : null };
        if (table === 'site_settings') return {data:null};
        return {data:logs.find(row => Object.entries(filters).every(([k,v]) => row[k] === v)) ?? null};
      },
      async upsert(row, options) {
        assert.equal(options.onConflict, 'provider_transaction_id');
        assert.equal(options.ignoreDuplicates, true);
        if (!orders.has(row.provider_transaction_id)) orders.set(row.provider_transaction_id, {...row, fulfillment:'new'});
        return {error:null};
      },
      async insert(row) { logs.push({id:logs.length+1,...row}); return {error:null}; },
      update() { return {eq:async () => ({error:null})}; },
    };
    return query;
  }};
  const modules = {
    './supabase.server': {adminDb:() => db},
    './grow-payment': payment,
    './email/send.server': {mailConfigured:() => true, sendMail:async input => {
      sent.push(input);
      return state.mailFails ? {sent:false,error:'test failure'} : {sent:true};
    }},
    './order-communication': {orderEmailSubject:(_,updated) => updated ? 'updated' : 'new', orderEmailHtml:p => p.address, orderEmailText:p => p.address},
  };
  const source = readFileSync(new URL('../src/lib/grow-webhook.server.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const exports = {};
  new Function('require', 'exports', js)(name => {
    assert.ok(modules[name], `Unexpected dependency: ${name}`);
    return modules[name];
  }, exports);
  return {orders, logs, sent, state, async post(body, authenticated = true) {
    expectedHash = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))).toString('hex');
    return exports.handleGrowWebhook(new Request(`https://example.test/api/grow-webhook?key=${authenticated ? key : 'b'.repeat(64)}`, {
      method:'POST', body, headers:{'Content-Type':'application/json'},
    }));
  }};
}

test('HTTP handler records one order and one notification across encoding variants and retries', async () => {
  const h = harness();
  const data = {transactionId:'test-http',statusCode:'2',sum:'163',description:'ספר',shipping:{amount:'20',type:'משלוח'}};
  for (const body of [JSON.stringify(data), JSON.stringify({status:'1',data:JSON.stringify(data)}),
    new URLSearchParams({status:'1','data[transactionId]':'test-http','data[statusCode]':'2','data[sum]':'163'}).toString()]) {
    assert.equal((await h.post(body)).status, 200);
    h.orders.get('test-http').fulfillment = 'processing';
  }
  assert.equal(h.orders.size, 1);
  assert.equal(h.orders.get('test-http').fulfillment, 'processing');
  assert.equal(h.orders.get('test-http').shipping_agorot, 2000);
  assert.equal(h.sent.length, 1);
  assert.equal(h.sent[0].to, 'Ae.nehora@gmail.com');
});

test('failed mail preserves the order and retries notification without duplicating the order', async () => {
  const h = harness();
  const body = JSON.stringify({transactionId:'test-retry',statusCode:'2',sum:'78'});
  h.state.mailFails = true;
  assert.equal((await h.post(body)).status, 503);
  assert.equal(h.orders.size, 1);
  h.state.mailFails = false;
  assert.equal((await h.post(body)).status, 200);
  assert.equal(h.orders.size, 1);
  assert.equal(h.logs.filter(row => row.status === 'sent').length, 1);
});

test('unauthenticated and unpaid requests cannot record orders or send mail', async () => {
  const h = harness();
  assert.equal((await h.post(JSON.stringify({transactionId:'test',statusCode:'2',sum:'78'}), false)).status, 401);
  assert.equal((await h.post(JSON.stringify({transactionId:'test',statusCode:'1',sum:'78'}))).status, 422);
  assert.equal(h.orders.size, 0);
  assert.equal(h.sent.length, 0);
});

test('payment-page webhook records the order, mails both recipients once, and stores a redacted event', async () => {
  const h = harness();
  const body = JSON.stringify({webhookKey:'k',transactionCode:'86940855',paymentSum:78,asmachta:'1',cardSuffix:'1234',fullName:'בדיקה'});
  assert.equal((await h.post(body)).status, 200);
  assert.equal((await h.post(body)).status, 200);
  assert.equal(h.orders.size, 1);
  assert.equal(h.sent.length, 1);
  const events = h.logs.filter(row => row.outcome === 'completed');
  assert.equal(events.length, 2);
  assert.equal(events[0].payload.cardSuffix, '[redacted]');
  assert.equal(events[0].transaction_id, '86940855');
});

test('an authenticated paid-looking notification that cannot be parsed alerts staff instead of vanishing', async () => {
  const h = harness();
  assert.equal((await h.post(JSON.stringify({transactionCode:'x',paymentSum:'abc'}))).status, 422);
  assert.equal(h.orders.size, 0);
  assert.equal(h.sent.length, 1);
  assert.match(h.sent[0].subject, /לא נקלט/);
  assert.equal(h.logs.filter(row => row.outcome === 'payment_rejected').length, 1);
});

test('later delivery fills missing address once, retains fulfillment and survives email failure/retries', async () => {
  const h = harness();
  const base = {transactionCode:'enrich-test',paymentSum:156,fullName:'בדיקה'};
  assert.equal((await h.post(JSON.stringify(base))).status, 200);
  h.orders.get('enrich-test').fulfillment = 'fulfilled';
  const enriched = {...base,address:'ירושלים, רחוב לדוגמה 12',shipping:{type:'משלוח',amount:0}};
  h.state.mailFails = true;
  assert.equal((await h.post(JSON.stringify(enriched))).status, 503);
  assert.equal(h.orders.get('enrich-test').address, enriched.address);
  h.state.mailFails = false;
  assert.equal((await h.post(JSON.stringify(enriched))).status, 200);
  const count = h.sent.length;
  for (const value of [enriched,base,{...enriched,address:'כתובת אחרת',paymentSum:999}]) {
    assert.equal((await h.post(JSON.stringify(value))).status, 200);
  }
  assert.equal(h.orders.size, 1);
  assert.equal(h.orders.get('enrich-test').fulfillment, 'fulfilled');
  assert.equal(h.orders.get('enrich-test').amount_agorot, 15600);
  assert.equal(h.orders.get('enrich-test').address, enriched.address);
  assert.equal(h.orders.get('enrich-test').delivery_revision, 1);
  assert.equal(h.sent.length, count);
  assert.equal(h.sent.at(-1).subject, 'updated');
  assert.equal(h.sent.at(-1).html, enriched.address);
  assert.equal(h.sent.at(-1).idempotencyKey, h.sent.at(-2).idempotencyKey);
});
