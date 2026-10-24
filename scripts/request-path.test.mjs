import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/request-path.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { invalidPathResponse } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
test('truncated Hebrew and invalid escapes return 400 before routing', () => {
  for (const path of ['/book-order%22,%228%22:%22campaign%22,%2246%22:%22%D7', '/%D', '/%ZZ', '/%C0%AF']) {
    const response = invalidPathResponse(path);
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  }
});
test('validly encoded serialized campaign suffix returns 404', () => {
  assert.equal(invalidPathResponse('/book-order%22,%228%22:%22campaign%22').status, 404);
});
test('real routes, Hebrew, assets, admin and payment API remain routable', () => {
  for (const path of ['/', '/book', '/book-order', '/book-new/', '/%D7%9E%D7%9B%D7%AA%D7%91%D7%99-%D7%AA%D7%95%D7%93%D7%94', '/api/grow-webhook', '/admin/orders', '/assets/file.js']) {
    assert.equal(invalidPathResponse(path), null);
  }
  assert.equal(invalidPathResponse(new URL('https://or-hadash.org.il/book-order?utm_content=%D&gclid=test').pathname), null);
});
