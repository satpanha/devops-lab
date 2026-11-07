const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { createApp } = require('../app');

async function withServer(run) {
  const server = createServer(createApp());
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test('GET /notes returns an empty list at first', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/notes`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);
  });
});

test('POST /notes creates a note', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/notes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '  Learn CI  ' })
    });
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { id: 1, text: 'Learn CI' });
  });
});

test('POST /notes without text returns 400', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/notes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'text is required' });
  });
});

test('notes are returned in creation order', async () => {
  await withServer(async (base) => {
    for (const text of ['First', 'Second']) {
      await fetch(`${base}/notes`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text })
      });
    }
    const response = await fetch(`${base}/notes`);
    assert.deepEqual(await response.json(), [
      { id: 1, text: 'First' },
      { id: 2, text: 'Second' }
    ]);
  });
});

test('unknown routes return 404', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/unknown`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: 'Not found' });
  });
});

test('malformed JSON returns 400', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/notes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{broken'
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'Invalid JSON' });
  });
});

test('unsupported methods return 405', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/notes`, { method: 'DELETE' });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('allow'), 'GET, POST');
  });
});
test('POST /notes with blank text returns 400', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/notes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '   ' })
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'text is required' });
  });
});
