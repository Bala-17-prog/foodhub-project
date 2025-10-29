# Backend — quick start

This file documents the minimal environment and quick test scripts for the backend.

Required environment variables

- `MONGO_URI` — MongoDB connection string (do NOT commit credentials).
- `JWT_SECRET` — Secret used to sign JWT tokens. Use a long, random string in production.
- `PORT` — Optional. Defaults to `5000`.
- `NODE_ENV` — Set to `production` or `development`.

Use the provided `.env.example` as a template. Copy it to `.env` and fill in values for local development.

Run locally

1. Install dependencies (from `Backend/`):

```cmd
cd Backend
npm install
```

2. Start server (development):

```cmd
npm run dev
```

Deploy notes (Render / other hosts)

- Add `MONGO_URI` and `JWT_SECRET` in the service environment variables in the Render dashboard.
- Redeploy after saving environment variables.

Quick test scripts

I added three small test scripts under `Backend/scripts/` which call your deployed backend (defaults to `foodhub-backend-fghd.onrender.com`). They use HTTPS and can be run with `node`.

- `login-test.js` — POST /api/auth/login
- `create-food-test.js` — login as a restaurant and POST /api/foods with the returned token
- `place-order-test.js` — login as a user and POST /api/orders (you must replace the restaurant and food IDs)

How to run the scripts

Open a terminal in the `Backend/` folder and run:

```cmd
node scripts\login-test.js
node scripts\create-food-test.js
node scripts\place-order-test.js
```

To target a different backend host (for example local server), set the environment variable `BACKEND_HOST` before running the script (session-only):

```cmd
set BACKEND_HOST=localhost:5000
node scripts\login-test.js
```

Security reminder

- Never commit `.env` files containing secrets. Use `.env.example` for templates.
- Use the Render environment variables UI (or a secret manager) for production secrets.
