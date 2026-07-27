# MobfixFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

# Mobfix Frontend

This project was generated using Angular CLI and contains the frontend app plus a small Playwright-based E2E smoke test located in `e2e/run.js`.

## Development server

To start the development server:

```powershell
npx ng serve --host 0.0.0.0 --port 4200
```

Open your browser at `http://localhost:4200`.

## Build

```powershell
npx ng build --configuration development
```

## E2E smoke test (Playwright)

We provide a lightweight Playwright script that registers a user through the UI, creates a booking, and verifies it appears under "My Bookings".

Prerequisites:
- Backend API running at `http://localhost:5000`
- Dev server running at `http://localhost:4200` (or serve the built `dist/` on port 4200)

Install dependencies:

```powershell
npm install
```

Install Playwright browsers (required once):

```powershell
npx playwright install
```

Run the E2E script:

```powershell
npm run e2e
```

Notes:
- The E2E script is `e2e/run.js` and uses Playwright. It requires the browsers to be installed via `npx playwright install`.
- If running in CI, consider `npx playwright install --with-deps` for Linux containers.

## Troubleshooting

- If the test fails with a browser executable error, re-run `npx playwright install`.
- If the frontend isn't reachable, ensure the dev server is running or serve `dist/mobfix-frontend` on port 4200.

## Further improvements

- Add a proper Playwright test harness and CI job to run the `e2e` script automatically.
- Add route guards and unit tests to cover critical flows (login, bookings creation/cancel).

If you want, I can add a small README at the repo root summarizing how to run both backend and frontend together.
