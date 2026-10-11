# MobFix

MobFix is a full-stack device repair booking platform for smartphones, tablets, laptops, and web applications. It combines a modern Angular frontend with a Node.js, Express, and MongoDB backend to deliver secure authentication, service discovery, booking management, and a responsive customer experience.

## Project Highlights

- Secure user registration and login with JWT authentication
- Device repair service browsing with search, filters, sorting, and categories
- Booking creation, tracking, cancellation, and booking details
- Responsive UI designed for desktop and mobile users
- Welcome email delivery after registration via SMTP

## Tech Stack

- Frontend: Angular 20, TypeScript, RxJS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT, bcrypt
- Infrastructure: Render deployment, environment-based configuration

## Core Features

### Authentication

- User registration and login
- Protected API routes
- Authenticated user profile endpoint
- Secure password hashing
- Welcome email notification after successful signup

### Service Discovery

MobFix organizes repair services by platform:

| Platform | Supported Services |
|---|---|
| Android | Samsung, Google Pixel, OnePlus, Xiaomi |
| iOS | Screen, battery, camera, charging |
| Tablet | iPad Pro, Air, Mini, Android tablets |
| Laptop | MacBook, Dell, HP, Lenovo |
| Website | Bug fixing, optimization, maintenance |

Users can:

- Search services in real time
- Filter by platform or category
- Sort by price, rating, or popularity
- Review pricing, warranty, and estimated repair time

### Booking Management

- Create repair bookings
- View personal bookings
- Track booking status
- View booking details
- Cancel pending bookings

### User Experience

- Responsive layout for laptop and mobile screens
- Interactive service cards
- Toast notifications
- Clean, modern navigation flow

## Architecture

```text
Angular Frontend
       |
       | REST API
       v
Node.js / Express Backend
       |
       +-- JWT Authentication
       +-- MongoDB / Mongoose
       +-- SMTP Welcome Emails
```

## Getting Started

### Backend

```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend

```powershell
cd mobfix-frontend
npm install
npm start
```

## Environment Variables

Configure the backend with these values:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `FRONTEND_URL`

## API Summary

- `GET /health`
- `GET /ready`
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me`
- `GET /api/services`
- `POST /api/bookings`
- `GET /api/bookings/mine`
- `POST /api/bookings/:id/quote/approve`
- `GET /api/bookings/availability?date=YYYY-MM-DD`
- `GET /api/technician/bookings`

The service catalog supports bounded pagination and filtering through `page`, `limit`, `search`,
`platform`, `category`, and `sort` query parameters. Booking records now retain quote ranges,
technician assignment, and a status history for customer-facing tracking.
Appointment availability is capacity-aware: cancelled bookings release a slot, while active
bookings count against the configured `APPOINTMENT_SLOT_CAPACITY` limit.

## Deployment

The project includes Render deployment support through `render.yaml` and the deployment guide in `RENDER_DEPLOYMENT.md`.
The Render static service rewrites client-side Angular routes to `index.html`, so direct links such
as `/services` and `/register` continue to work after refresh.