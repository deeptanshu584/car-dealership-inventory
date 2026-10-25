# API reference

Base URL: `http://localhost:4000/api`. Requests and responses are JSON. Protected routes require `Authorization: Bearer <token>`. Price values are decimal amounts in the API and integer cents in SQLite.

## Response and error conventions

- Vehicle fields: `id`, `make`, `model`, `category`, `price`, `quantity`, `createdAt`, `updatedAt`.
- Pagination: `{ "data": [ ... ], "page": 1, "limit": 12, "total": 5 }`.
- Error: `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid request body", "details": [ ... ] } }`. Details are present for Zod validation errors.
- Statuses: 400 validation, 401 authentication, 403 authorization, 404 missing record or route, 409 conflict or insufficient stock, 429 rate limit, 500 unexpected error.

## Authentication

| Method | Path | Access | Example request | Success |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Public | `{"name":"Ada","email":"ada@example.com","password":"secure123"}` | 201 `{"token":"...","user":{"id":"...","name":"Ada","email":"ada@example.com","role":"USER","createdAt":"..."}}` |
| POST | `/auth/login` | Public | `{"email":"ada@example.com","password":"secure123"}` | 200, same shape as register |

Passwords need at least eight characters, one letter, and one digit. Registration ignores any supplied role and always creates a USER. Admins are created by `npm run seed`. Unknown email and wrong password produce the same 401 message. JWTs carry `sub` and `role` and expire after one hour. Repeated auth requests are rate limited.

## Vehicles

| Method | Path | Access | Example request | Success |
| --- | --- | --- | --- | --- |
| GET | `/health` | Public | None | 200 `{"status":"ok"}` |
| POST | `/vehicles` | Authenticated | `{"make":"Toyota","model":"Camry","category":"SEDAN","price":24999.99,"quantity":3}` | 201 vehicle |
| GET | `/vehicles?page=1&limit=12` | Authenticated | Query parameters | 200 paginated vehicles, including zero stock |
| GET | `/vehicles/search?make=toy&minPrice=10000&maxPrice=30000` | Authenticated | Query parameters | 200 paginated matches |
| PUT | `/vehicles/:id` | Authenticated | `{"price":23999.99}` | 200 updated vehicle |
| DELETE | `/vehicles/:id` | ADMIN | None | 204 empty response |
| POST | `/vehicles/:id/purchase` | Authenticated | `{"quantity":1}` (optional; default 1) | 200 updated vehicle |
| POST | `/vehicles/:id/restock` | ADMIN | `{"quantity":2}` | 200 updated vehicle |

Search accepts `make` and `model` as case-insensitive partial matches, `category` as an exact match with case-insensitive input, and inclusive `minPrice` and `maxPrice`. It also accepts `page` and `limit`. Page defaults to 1; limit defaults to 12 and cannot exceed 100. An inverted price range returns 400. Categories: SEDAN, SUV, HATCHBACK, COUPE, CONVERTIBLE, TRUCK, VAN, ELECTRIC.

Purchase uses a conditional SQLite update. Two concurrent purchases of the last unit cannot both succeed; one receives 409. Restock and deletion require the ADMIN role. Unknown vehicle IDs return 404.
