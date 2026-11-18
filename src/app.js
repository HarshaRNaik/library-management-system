/**
 * Library Management System Express application.
 */

const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({ success: true, message: 'Welcome to the Library Management System API', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'Library Management System API'
  });
});

app.use('/books', bookRoutes);

// Catch-all 404 handler for undefined routes
app.use(notFound);

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
