# MobFix Backend

This is the backend for MobFix — a mobile repair booking system. It is built with Node.js, Express and MongoDB (Mongoose).

Features:
- JWT authentication for users
- User registration/login
- CRUD services (admin)
- Booking creation/editing/cancelling

Getting started

1. Copy the env file:

   - Create a `.env` file in `backend/` with values from `.env.example`.

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

- POST /api/users/register { name, email, password, phone }
- POST /api/users/login { email, password }
- GET /api/users/me (auth)
- GET /api/services
- POST /api/services (admin)
- PUT /api/services/:id (admin)
- DELETE /api/services/:id (admin)
- POST /api/bookings (auth)
- GET /api/bookings/mine (auth)
- GET /api/bookings/:id (auth)
- PUT /api/bookings/:id (auth/admin)
- DELETE /api/bookings/:id (auth/admin)
- GET /api/bookings (admin)

Frontend

This repo contains the backend only. For the Angular frontend (Angular 18+), run `ng new mobfix-frontend` and implement components: Login/Register, ServicesList, BookingForm, MyBookings, AdminDashboard.

You can wire the frontend to the backend using the endpoints above. Prefer storing JWT in memory or secure cookie for production.
