const books = require('../data/books');

function listBooks() { return books; }
function getBook(id) { return books.find((book) => book.id === id); }

function createBook(input) {
  const normalized = {
    title: typeof input.title === 'string' ? input.title.trim() : '',
    author: typeof input.author === 'string' ? input.author.trim() : '',
    category: typeof input.category === 'string' ? input.category.trim() : ''
  };
  const errors = [];
  for (const field of ['title', 'author', 'category']) {
    if (!normalized[field]) errors.push(`${field} is required and must be a non-empty string.`);
  }
  if (errors.length) return { errors };
  const duplicate = books.find((book) => book.title.toLowerCase() === normalized.title.toLowerCase()
    && book.author.toLowerCase() === normalized.author.toLowerCase());
  if (duplicate) return { duplicate };
  const book = { id: books.reduce((max, item) => Math.max(max, item.id), 0) + 1, ...normalized, available: true };
  books.push(book);
  return { book };
}

function changeAvailability(id, available) {
  const book = getBook(id);
  if (!book) return { status: 'not-found' };
  if (book.available === available) return { status: 'conflict', book };
  book.available = available;
  return { status: 'ok', book };
}

module.exports = { listBooks, getBook, createBook, changeAvailability };
