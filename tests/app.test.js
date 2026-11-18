const request = require('supertest');
const app = require('../src/app');
const books = require('../src/data/books');

describe('Library Management System API', () => {
  beforeEach(() => {
    books.splice(0, books.length,
      { id: 1, title: 'The Hobbit', author: 'J. R. R. Tolkien', category: 'Fantasy', available: true },
      { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', available: true },
      { id: 3, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', available: true });
  });

  test('GET /books retrieves all books', async () => {
    const response = await request(app).get('/books');
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(3);
    expect(response.body.data[0]).toEqual({ id: 1, title: 'The Hobbit', author: 'J. R. R. Tolkien', category: 'Fantasy', available: true });
  });

  test('GET /books/:id retrieves a book', async () => {
    const response = await request(app).get('/books/2');
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Pride and Prejudice');
  });

  test('POST /books adds a book and assigns its ID and availability', async () => {
    const response = await request(app).post('/books').send({ title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction' });
    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({ id: 4, title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', available: true });
  });

  test('prevents adding the same title and author twice', async () => {
    const response = await request(app).post('/books').send({ title: 'The Hobbit', author: 'J. R. R. Tolkien', category: 'Fantasy' });
    expect(response.status).toBe(409);
  });

  test('PUT /books/:id/issue issues an available book', async () => {
    const response = await request(app).put('/books/1/issue');
    expect(response.status).toBe(200);
    expect(response.body.data.available).toBe(false);
  });

  test('prevents issuing a book twice', async () => {
    await request(app).put('/books/1/issue');
    expect((await request(app).put('/books/1/issue')).status).toBe(409);
  });

  test('PUT /books/:id/return returns an issued book', async () => {
    await request(app).put('/books/1/issue');
    const response = await request(app).put('/books/1/return');
    expect(response.status).toBe(200);
    expect(response.body.data.available).toBe(true);
  });

  test('prevents returning a book that is already available', async () => {
    expect((await request(app).put('/books/1/return')).status).toBe(409);
  });

  test('returns 404 for nonexistent and malformed IDs', async () => {
    expect((await request(app).get('/books/999')).status).toBe(404);
    expect((await request(app).get('/books/abc')).status).toBe(404);
  });

  test('rejects missing or invalid book fields', async () => {
    const response = await request(app).post('/books').send({ title: '  ', author: 4 });
    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(3);
  });

  test('returns a library API root and 404 for removed routes', async () => {
    expect((await request(app).get('/').set('Accept', 'application/json')).body.message).toContain('Library Management System');
    expect((await request(app).get('/retired-resource')).status).toBe(404);
  });
});
