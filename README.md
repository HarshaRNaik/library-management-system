# Library Management System REST API

A Node.js and Express API for managing books and availability in memory. Catalog changes reset when the server restarts.

## Technology and architecture

- Node.js, Express 4, npm, Jest, and Supertest
- `src/app.js` configures the app; `src/server.js` starts the listener.
- `src/controllers/bookController.js` handles requests; `src/services/bookService.js` manages catalog operations.
- `src/data/books.js` is the in-memory sample catalog; `src/routes/bookRoutes.js` maps API routes.
- `src/middleware/` contains centralized 404 and error handlers.
- `tests/app.test.js` contains API tests; `scripts/verify-endpoints.js` performs a live smoke check.
- `Jenkinsfile` defines CI stages.

## Install and run

Requires Node.js 18 or newer and npm.

```sh
npm ci
npm start
```

The API listens on `http://localhost:5000` by default. Set `PORT` or `HOST` to change the listener. Copy `.env.example` to `.env` for local dotenv configuration.

## API

Each book has `id`, `title`, `author`, `category`, and `available`. New books start available and receive an ID from the API. Title, author, and category must be non-empty strings.

| Method | Path | Success | Purpose |
| --- | --- | --- | --- |
| GET | `/books` | 200 | List all books |
| GET | `/books/:id` | 200 | Get one book |
| POST | `/books` | 201 | Add a book |
| PUT | `/books/:id/issue` | 200 | Issue an available book |
| PUT | `/books/:id/return` | 200 | Return an issued book |

Example request:

```http
POST /books
Content-Type: application/json

{"title":"Dune","author":"Frank Herbert","category":"Science Fiction"}
```

Example response:

```json
{"success":true,"data":{"id":4,"title":"Dune","author":"Frank Herbert","category":"Science Fiction","available":true}}
```

Missing or malformed IDs return 404. Invalid book fields return 400. Duplicate issue or return transitions return 409. Errors include `success: false` and a message.

## Tests and validation

```sh
npm test
npm run test:ci
npm run build
npm run verify:endpoints
```

Jest/Supertest covers listing, lookup, creation, issuing, returning, invalid state changes, missing IDs, invalid data, and the retired paths. The smoke script checks the endpoints over local HTTP on an ephemeral port.

## Jenkins CI

The declarative pipeline has Checkout, Install Dependencies (`npm ci`), Automated Testing, Build / Validation (`npm run build` and `npm pack`), and Archive Artifacts stages. Tests write a JSON result report; Jenkins archives the report and npm package. Failed commands fail the pipeline.

SCM polling is configured once per minute. Configure the Jenkins Pipeline-from-SCM job with the real GitHub repository URL, credentials as needed, and this `Jenkinsfile`. A GitHub webhook can be used when the Jenkins GitHub integration and a reachable webhook URL are configured. Jenkins has not been run from this workspace, so execution is not claimed.

## Git setup

The provided files have no `.git` metadata or configured remote. Connect the project to its intended GitHub repository while preserving any history there, and push only after review. Jenkins also needs the actual remote URL.
