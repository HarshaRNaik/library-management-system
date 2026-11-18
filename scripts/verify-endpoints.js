const app = require('../src/app');

async function verify() {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const check = async (method, path, expectedStatus, body) => {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await response.json();
    if (response.status !== expectedStatus) throw new Error(`${method} ${path}: expected ${expectedStatus}, got ${response.status}`);
    console.log(`${method} ${path} -> ${response.status}`, JSON.stringify(data));
    return data;
  };

  try {
    await check('GET', '/books', 200);
    await check('GET', '/books/1', 200);
    await check('GET', '/books/9999', 404);
    const added = await check('POST', '/books', 201, { title: 'Smoke Test', author: 'Verifier', category: 'Test' });
    const id = added.data.id;
    await check('PUT', `/books/${id}/issue`, 200);
    await check('PUT', `/books/${id}/issue`, 409);
    await check('PUT', `/books/${id}/return`, 200);
    await check('PUT', `/books/${id}/return`, 409);
    await check('POST', '/books', 400, { title: ' ' });
    console.log('Endpoint verification completed successfully.');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

verify().catch((error) => {
  console.error('Endpoint verification failed:', error.message);
  process.exitCode = 1;
});
