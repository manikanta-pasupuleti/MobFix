# MobFix Backend

This is the backend for MobFix — a mobile repair booking system. It is built with Node.js, Express and MongoDB (Mongoose).

Features:
- JWT authentication for users
- User registration/login
- Welcome emails sent via SMTP after registration
- CRUD services (admin)
- Booking creation/editing/cancelling with quote approval and status history
- Technician assignment and staff booking workflow
- Health and readiness probes

Getting started

1. Copy the env file:

   - Create a `.env` file in `backend/` with values from `.env.example`.
   - Add valid SMTP values so registration can send a welcome email in production.

2. Install dependencies:

   - In PowerShell:

```
cd backend; npm install
```

3. Seed an admin (optional):

```
npm run seed-admin
```

4. Start server

```
npm run dev
```

API Endpoints (summary)

- GET /health
- GET /ready
- POST /api/users/register { name, email, password, phone }
- POST /api/users/login { email, password }
- GET /api/users/me (auth)
- GET /api/services
- GET /api/services?page=1&limit=20&search=screen&platform=iOS&category=Screen&sort=popular
- GET /api/bookings/availability?date=2026-10-12
- POST /api/services (admin)
- PUT /api/services/:id (admin)
- DELETE /api/services/:id (admin)
- POST /api/bookings (auth)
- GET /api/bookings/mine (auth)
- GET /api/bookings/:id (auth)
- PUT /api/bookings/:id (auth/admin)
- POST /api/bookings/:id/quote/approve (auth)
- GET /api/admin/technicians (admin)
- PUT /api/admin/bookings/:id/status (admin)
- PUT /api/admin/bookings/:id/assign (admin)
- PUT /api/admin/bookings/:id/quote (admin)
- GET /api/technician/bookings (staff)
- PUT /api/technician/bookings/:id/status (staff)

Frontend

This repo contains the backend only. For the Angular frontend (Angular 18+), run `ng new mobfix-frontend` and implement components: Login/Register, ServicesList, BookingForm, MyBookings, AdminDashboard.

You can wire the frontend to the backend using the endpoints above. Prefer storing JWT in memory or secure cookie for production.

Production notes:

- Set `FRONTEND_URL` to the exact deployed frontend origin. Multiple comma-separated origins are supported.
- Set `APPOINTMENT_SLOT_CAPACITY` to the maximum active bookings allowed per two-hour slot (default: 2).
- Keep `JWT_SECRET`, database credentials, SMTP credentials, and admin credentials in Render secret environment variables.
- Deploy the root `render.yaml` so static Angular deep links rewrite to `index.html`.
