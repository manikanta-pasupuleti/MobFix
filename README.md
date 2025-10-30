# MobFix

> MobFix — a demo mobile repair booking system (backend: Express + MongoDB, frontend: Angular).

This repository contains a simple MEAN-style demo app used for development and demos. It includes a backend API (Express + Mongoose) and an Angular frontend with a small Playwright e2e harness for screenshots.

## Contents
- `backend/` — Express API, models, routes, and seed scripts.
- `mobfix-frontend/` — Angular application (standalone components pattern) and e2e scripts.

## Prerequisites
- Node.js (16+ recommended)
- npm
- MongoDB running locally (or update `MONGO_URI` in `.env`)

## Quick start (development)

1. Backend

```powershell
Set-Location .\backend
npm install
# Create a .env file or review the one in the repo. Required vars:
# PORT, MONGO_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD
# Example .env:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/mobfix
# JWT_SECRET=some-long-secret
npm start
```

The backend exposes API endpoints under `http://localhost:5000/api` by default (users, services, bookings).

2. Frontend (dev or serve built files)

Dev (if you prefer live-reload):

```powershell
Set-Location .\mobfix-frontend
npm install
npx ng serve --port 4200 --host 127.0.0.1
```

Or build and serve the static output (used by our e2e/screenshot scripts):

```powershell
Set-Location .\mobfix-frontend
npm install
npx ng build --configuration development
# Serve the built `dist/mobfix-frontend/browser` directory, for example:
npx http-server ./dist/mobfix-frontend/browser -p 4200 -a 127.0.0.1 -s
```

Open the app at `http://localhost:4200`.

3. Playwright e2e / screenshots

From `mobfix-frontend` you can run the included screenshot helper.

```powershell
Set-Location .\mobfix-frontend
# Ensure the frontend static server is serving the build on :4200 and the backend is running
node .\e2e\screenshot.js
# Or run the flow script (register -> booking -> verify):
node .\e2e\run.js
```

## Environment / Secrets
- Do NOT commit secrets. The root `.gitignore` ignores `.env` files. Provide a `.env` locally with a random `JWT_SECRET`.

## Git and CI
- This repo has been initialized and pushed to the remote you provided.
- If you'd like a GitHub Actions workflow to run frontend build/tests and backend lint/tests, I can add a minimal CI file.

## Deploy to Render (quick guide)

There's a `render.yaml` at the repo root that declares two services: `mobfix-backend` (Web Service) and `mobfix-frontend` (Static Site). The `render.yaml` leaves your sensitive values (Mongo URI and JWT secret) un-synced so you must set them in the Render dashboard.

Steps to deploy on Render

1. Sign in to https://dashboard.render.com and connect your GitHub account.
2. Import this repository (MobFix) into Render.
3. When Render reads `render.yaml` it will propose creating two services. Review them and create the services.
4. Set the required environment variables for the backend service (Render → your service → Environment):

	 - MONGO_URI = your MongoDB connection string (use MongoDB Atlas for production; DO NOT use `mongodb://localhost:27017` on Render)
	 - JWT_SECRET = a secure random string (use Render's secret generator)
	 - PORT = 5000 (optional; Render will assign a port if you omit this)
	 - ADMIN_USERNAME = admin (or your chosen admin username)
	 - ADMIN_PASSWORD = admin123 (or your chosen admin password)
	 - FRONTEND_URL = https://your-frontend-domain (optional — helpful for CORS or link generation)

Notes about `MONGO_URI` and `.env`

- Your local `backend/.env` currently contains `MONGO_URI=mongodb://localhost:27017/mobfix` (good for local dev). For Render, use an Atlas connection string (mongodb+srv://...) and set it as the `MONGO_URI` environment variable in Render.
- Do not commit production secrets to git. The repo `.gitignore` already ignores `.env`.

Seeding the database

- The repo includes simple seed scripts under `backend/scripts/` (for example `seedAdmin.js` and `promoteToAdmin.js`). After your backend is deployed and has a working `MONGO_URI`, either:

	- Run the seed script locally (targeting your production Atlas URI):

		```powershell
		Set-Location .\backend
		# ensure NODE_ENV or env vars point to your Atlas DB
		node scripts/seedAdmin.js
		```

	- Or use Render's Dashboard Console for your backend service to run the script once:
		- Open the backend service in Render → Shell/Console → run `node scripts/seedAdmin.js`.

CORS and FRONTEND_URL

- If the backend enforces CORS, set `FRONTEND_URL` to your frontend site (Render will give you the site URL after deployment) and update the backend CORS config to allow that origin.

Troubleshooting

- Build failures: check render logs. Ensure Node version compatibility and that `publishPath` in `render.yaml` matches the Angular build output configured in `mobfix-frontend/angular.json`.
- Backend errors: ensure `MONGO_URI` and `JWT_SECRET` are set correctly in the Render environment.
- Still seeing local DB URL: double-check you set the env var in the Render dashboard and that the deployed service restarted after you set it.

If you'd like, I can update this README with a one-click checklist tailored to your Render account (or commit `render.yaml` updates for a different branch). Let me know and I'll commit that change.

## Contributing
- Open issues and PRs are welcome. Small enhancements to the README or adding seed data to the backend are good next steps.

## Helpful scripts (summary)
- Backend: `npm start` (from `backend/`)
- Frontend dev: `npx ng serve` (from `mobfix-frontend/`)
- Frontend build: `npx ng build --configuration development` (from `mobfix-frontend/`)
- Serve static build: `npx http-server ./dist/mobfix-frontend/browser -p 4200 -a 127.0.0.1 -s`
- E2E screenshot: `node .\e2e\screenshot.js` (from `mobfix-frontend/`)

---

If you'd like, I can now:
- add a minimal GitHub Actions workflow that builds frontend + runs a smoke check,
- seed the backend with the sample services used in the frontend fallback, or
- add a `CONTRIBUTING.md` and more detailed run instructions.

Tell me which of those you'd like next.

---
© MobFix demo
