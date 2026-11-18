const service = require('../services/bookService');

function parseId(value) {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function getAllBooks(req, res) {
  const books = service.listBooks();
  return res.status(200).json({ success: true, count: books.length, data: books });
}

function getBookById(req, res) {
  const id = parseId(req.params.id);
  const book = id === null ? undefined : service.getBook(id);
  if (!book) return res.status(404).json({ success: false, message: `Book with ID ${req.params.id} not found.` });
  return res.status(200).json({ success: true, data: book });
}

function addBook(req, res) {
  if (!req.body || Array.isArray(req.body) || typeof req.body !== 'object') {
    return res.status(400).json({ success: false, message: 'Request body must be a JSON object.' });
  }
  const result = service.createBook(req.body);
  if (result.errors) return res.status(400).json({ success: false, message: 'Invalid book data.', errors: result.errors });
  if (result.duplicate) return res.status(409).json({ success: false, message: 'A book with this title and author already exists.' });
  return res.status(201).json({ success: true, data: result.book });
}

function updateAvailability(available) {
  return (req, res) => {
    const id = parseId(req.params.id);
    const result = id === null ? { status: 'not-found' } : service.changeAvailability(id, available);
    if (result.status === 'not-found') return res.status(404).json({ success: false, message: `Book with ID ${req.params.id} not found.` });
    if (result.status === 'conflict') {
      const operation = available ? 'already available' : 'already issued';
      return res.status(409).json({ success: false, message: `Book with ID ${id} is ${operation}.` });
    }
    return res.status(200).json({ success: true, data: result.book });
  };
}

module.exports = { getAllBooks, getBookById, addBook, issueBook: updateAvailability(false), returnBook: updateAvailability(true) };
