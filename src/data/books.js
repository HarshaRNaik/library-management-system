// In-memory catalog. Changes are reset whenever the Node.js process restarts.
module.exports = [
  { id: 1, title: 'The Hobbit', author: 'J. R. R. Tolkien', category: 'Fantasy', available: true },
  { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', available: true },
  { id: 3, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', available: true }
];
