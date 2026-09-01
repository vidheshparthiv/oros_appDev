# Oros UI — Frontend

This frontend is a Vite + React app that connects to your Spring Boot backend.

Local setup

1. Install dependencies

```bash
cd frontend/oros_ui
npm install
```

2. Set API base (optional)

Create a `.env` in `frontend/oros_ui` with (optional):

```
VITE_API_BASE=http://localhost:8080
```

If you don't set `VITE_API_BASE`, the frontend defaults to `http://localhost:8080`.

3. Run dev server

```bash
npm run dev
```

Frontend routes and what backend endpoints they call

- `/login` — POST `/api/auth/login` (expects `{username,password}`), stores JWT in `localStorage` key `token`.
 - `/login` — POST `/api/auth/login` (expects `{username,password}`), stores JWT in `localStorage` key `token`.
 - `/register` — POST `/api/auth/register` (common payload `{username,password,email}`), will store JWT if backend returns one.
- `/vendors` — GET `/api/vendors`
- `/vendors/new` — POST `/api/vendors` (create vendor)
- `/vendors/:id` — GET `/api/vendors/{id}` and DELETE `/api/vendors/{id}`
- `/vendors/:id/edit` — PUT `/api/vendors/{id}`

- `/products` — GET `/api/products`
- `/products/:id` — GET `/api/products/{id}` and DELETE `/api/products/{id}`
- `/products/new/:vendorId` — POST `/api/products/{vendorId}`
- `/products/:id/edit` — PUT `/api/products/{id}`

- `/users` — GET `/users`

- `/orders` — GET `/api/orders`
- `/orders/:id` — GET `/api/orders/{id}`

Notes

- The `api` client is in `src/services/api.js`. It reads `VITE_API_BASE` and sends `Authorization: Bearer <token>` when `token` is present in `localStorage`.
- Adjust backend endpoint paths if your API prefixes differ. The frontend expects the endpoints under `/api` by default.
- The UI is minimal and aims to demonstrate integration and routes. You can expand forms and validations as needed.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
