/**
 * Library Management System HTTP server.
 * 
 * Loads environment configuration and starts the HTTP server.
 */

require('dotenv').config();

const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

console.log('[Library API] Server starting...');

const server = app.listen(PORT, HOST, () => {
  console.log(`[Library API] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Library API] Listening on http://${HOST}:${PORT}`);
  console.log(`[Library API] Books: http://localhost:${PORT}/books`);
});

// Handle port conflicts and listener errors gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Library API] Port ${PORT} is already in use. Set a different PORT or stop the other process.`);
    process.exit(1);
  } else {
    console.error(`[Library API] Server error: ${err.message}`);
    process.exit(1);
  }
});

// Graceful shutdown handling for container and process managers
function handleShutdown(signal) {
  console.log(`[Library API] Received ${signal}; shutting down.`);
  server.close(() => {
    console.log('[Library API] HTTP server closed.');
    process.exit(0);
  });

  // Force close after 5 seconds if connections remain open
  setTimeout(() => {
    console.error('[Library API] Forced shutdown after timeout.');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = server;
