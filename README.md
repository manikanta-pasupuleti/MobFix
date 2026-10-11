# MobFix

MobFix is a device-repair booking and operations platform. Customers can find a repair service, choose an appointment, receive a quote, and follow the repair through completion. Staff use the same system to manage bookings, assign technicians, and update repair progress.

The application is built with Angular, Node.js, Express, and MongoDB. It is currently in active product development: the core booking and staff workflows are in place, while notifications, persistent audit logs, and intelligent diagnosis remain planned work.

## Live Application

| Component | Link | Current check |
|---|---|---|
| Customer application | [mobfix-frontend.onrender.com](https://mobfix-frontend.onrender.com/) | Responding |
| Services page | [Browse services](https://mobfix-frontend.onrender.com/services) | Requires SPA deployment fix |
| Registration page | [Create an account](https://mobfix-frontend.onrender.com/register) | Requires SPA deployment fix |
| Backend API | [mobfix-backend.onrender.com](https://mobfix-backend.onrender.com/) | Deployed |
| Service catalog API | [GET /api/services](https://mobfix-backend.onrender.com/api/services) | Responding with live data |

The service catalog API is currently responding with live data. The direct frontend routes (`/services` and `/register`) currently return Render `404 Not Found` responses in the deployed environment. This is a deployment issue, not an application route that should be treated as unavailable; the Render SPA rewrite and the frontend deployment need to be aligned before those links are production-ready.

## Product Overview

The product is built around a straightforward operational model: each repair has an appointment, an owner, a quote, and a visible status history.

### Customer workflow

1. Browse and filter repair services.
2. Select a repair service and provide device and issue details.
3. Choose an available appointment slot.
4. Track the booking from the customer dashboard.
5. Review and approve a staff-provided quote.
6. Follow technician status updates through completion.

### Staff workflow

- Administrators manage services, bookings, quotes, and technician assignments.
- Technicians see assigned repairs and update operational status.
- Customers receive a persistent status history instead of an opaque single status value.

## Capabilities

### Identity and access

- JWT-based authentication
- bcrypt password hashing
- Protected customer, administrator, and technician workflows
- Role-aware frontend navigation and route guards
- Configurable CORS allowlist
- Rate limiting on registration and login endpoints

### Service catalog

- Searchable repair catalog
- Platform and category filters
- Bounded pagination
- Price, rating, and popularity sorting
- Service price, warranty, and estimated repair-time metadata

### Appointment scheduling

- Five standard two-hour appointment slots
- Configurable per-slot capacity
- Availability lookup before booking
- Server-side capacity enforcement to prevent overbooking
- Cancelled bookings release slot capacity
- Future-date and allowed-slot validation

### Quote and repair operations

- Quote minimum and maximum range
- Staff quote notes
- Customer quote approval
- Technician assignment
- Controlled technician status transitions
- Booking status history with actor, note, and timestamp
- Customer-facing repair progress timeline

### Reliability and observability foundations

- `/health` liveness endpoint
- `/ready` database-readiness endpoint
- Request IDs in API responses and error logs
- Structured error response shape
- Helmet security headers
- Morgan HTTP request logging
- Payload-size limits

## System Architecture

```text
┌──────────────────────┐
│ Angular 20 Frontend  │
│ Customer + Staff UI  │
└──────────┬───────────┘
           │ HTTPS / REST
           ▼
┌──────────────────────┐
│ Express API          │
│ Auth, bookings,      │
│ quotes, staff ops    │
└───────┬───────┬──────┘
        │       │
        │       └── SMTP provider
        │
        ▼
┌──────────────────────┐
│ MongoDB + Mongoose   │
│ Users, services,     │
│ bookings, reviews    │
└──────────────────────┘
```

## Technology Stack

| Layer | Technology |
|---|---|
| Client | Angular 20, TypeScript, RxJS |
| API | Node.js, Express.js |
| Persistence | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Security middleware | Helmet, CORS, express-rate-limit |
| Email | Nodemailer / SMTP |
| Testing | Node test runner, Jasmine, Karma, Chrome Headless |
| Deployment | Render |

## Repository Structure

```text
.
├── backend/
│   ├── config/          Database configuration
│   ├── middleware/      Authentication and validation middleware
│   ├── models/          Mongoose domain models
│   ├── routes/          REST API route modules
│   ├── services/        Reusable domain services
│   ├── test/            Backend tests
│   └── server.js        API entry point
├── mobfix-frontend/
│   └── src/app/         Angular standalone components and services
├── render.yaml          Render service definitions
└── README.md
```

## Local Development

### Prerequisites

- Node.js 20 or later
- npm 10 or later
- MongoDB 6 or later, local or hosted
- A configured SMTP provider for welcome emails

### Start the backend

```powershell
cd backend
npm ci
copy .env.example .env
npm run dev
```

The API listens on `http://localhost:5000` by default.

### Start the frontend

```powershell
cd mobfix-frontend
npm ci
npm start
```

The Angular development server listens on `http://localhost:4200` by default.

## Configuration

Create `backend/.env` locally. Never commit `.env` files or credentials.

| Variable | Required | Description |
|---|---:|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign authentication tokens |
| `FRONTEND_URL` | Yes | Comma-separated allowed frontend origins |
| `APPOINTMENT_SLOT_CAPACITY` | No | Active bookings allowed per slot; defaults to `2` |
| `PORT` | No | API port; defaults to `5000` |
| `NODE_ENV` | No | Runtime environment |
| `SMTP_HOST` | For email | SMTP hostname |
| `SMTP_PORT` | For email | SMTP port |
| `SMTP_SECURE` | For email | Whether SMTP uses TLS |
| `SMTP_USER` | For email | SMTP username |
| `SMTP_PASS` | For email | SMTP password |
| `MAIL_FROM` | For email | Sender address |
| `ADMIN_USERNAME` | For admin tooling | Administrative seed username |
| `ADMIN_PASSWORD` | For admin tooling | Administrative seed password |

## API Surface

### Public and system endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness check |
| `GET` | `/ready` | MongoDB readiness check |
| `GET` | `/api/services` | Service catalog |
| `GET` | `/api/bookings/availability?date=YYYY-MM-DD` | Appointment capacity |

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/users/register` | Register a customer |
| `POST` | `/api/users/login` | Authenticate a customer or staff member |
| `GET` | `/api/users/me` | Read the authenticated user |

### Customer bookings

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/bookings` | Create a repair booking |
| `GET` | `/api/bookings/mine` | List the customer's bookings |
| `GET` | `/api/bookings/:id` | Read one owned booking |
| `PUT` | `/api/bookings/:id` | Edit a pending booking |
| `PUT` | `/api/bookings/:id/cancel` | Cancel an eligible booking |
| `POST` | `/api/bookings/:id/quote/approve` | Approve an issued quote |

### Staff operations

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/technician/bookings` | List assigned technician bookings |
| `PUT` | `/api/technician/bookings/:id/status` | Update an assigned repair |
| `GET` | `/api/admin/technicians` | List technicians |
| `PUT` | `/api/admin/bookings/:id/assign` | Assign a technician |
| `PUT` | `/api/admin/bookings/:id/quote` | Issue or update a quote |
| `PUT` | `/api/admin/bookings/:id/status` | Update a booking as an administrator |

### Booking status lifecycle

```text
Pending → Quoted → Confirmed → In Progress → Ready for Pickup → Completed
    └──────────────────────────────→ Cancelled
```

## Quality Checks

Run backend tests:

```powershell
cd backend
npm test
```

Run Angular tests:

```powershell
cd mobfix-frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

Build the Angular application:

```powershell
cd mobfix-frontend
npm run build
```

The production build currently completes successfully. Angular reports non-blocking bundle and component-style budget warnings that are tracked for a later performance pass.

## Deployment

Render configuration is defined in [`render.yaml`](./render.yaml):

- The backend runs from `backend/`.
- The frontend builds from `mobfix-frontend/`.
- The static frontend rewrites client-side routes to `index.html`.
- Secrets are configured in Render environment settings rather than committed to Git.

Before production deployment:

1. Configure `MONGO_URI` and `JWT_SECRET`.
2. Set `FRONTEND_URL` to the exact deployed frontend origin.
3. Set `API_URL` for the frontend service to the deployed backend origin.
4. Set `APPOINTMENT_SLOT_CAPACITY` for the desired operational capacity.
5. Confirm `/health`, `/ready`, and a direct Angular route such as `/services`.
6. Review Render logs after deployment.

## Security Principles

- Secrets belong in environment configuration, never source control.
- All booking ownership checks are enforced server-side.
- Staff endpoints require role-aware authentication.
- User input is bounded and validated before persistence.
- CORS should remain an explicit origin allowlist in production.
- JWT secrets should be long, random, and rotated through deployment configuration.
- Production errors should expose request IDs, not internal stack traces.

## Roadmap

### Near term

- Persistent audit-log model and staff activity history
- Transactional notifications for quote and status changes
- OpenAPI specification and generated API contract tests
- Broader API integration tests
- Appointment resource modeling for multiple locations and technician schedules
- Resolve bundle-size and component-style budget warnings

### Intelligent repair assistance

- Structured diagnosis intake
- Issue-to-service recommendations
- Explainable estimated repair ranges
- Confidence scoring
- Optional image-assisted device inspection with explicit consent and privacy controls

## Contributing

Keep changes focused and testable. For feature work:

1. Preserve existing API contracts unless a versioned change is documented.
2. Add or update tests for validation and workflow behavior.
3. Run backend tests, Angular tests, and the production build.
4. Do not commit secrets, local environment files, or generated build output.
5. Document user-visible workflow changes in this README.

## License

This project is currently maintained as a private product-development codebase. Add the applicable license before distributing it outside the owning organization.
