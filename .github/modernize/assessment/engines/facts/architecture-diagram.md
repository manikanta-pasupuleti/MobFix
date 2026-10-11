# Architecture Diagram

MobFix is a hosted Angular single-page application backed by an Express API and
MongoDB. The architecture separates customer and staff presentation concerns
from route authorization, domain workflow rules, and persistence.

## Application Architecture

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
~~~mermaid
flowchart TD
    subgraph Client["Client Layer"]
        Browser["Angular 20 application"]
    end
    subgraph App["Application Layer"]
        API["Express REST API"]
        Auth["JWT and role middleware"]
        Workflow["Booking and availability rules"]
    end
    subgraph Data["Data Layer"]
        Models["Mongoose models"]
        Mongo[("MongoDB")]
    end
    subgraph External["External Services"]
        Render["Render hosting"]
        SMTP["SMTP provider"]
    end

    Browser -->|"HTTPS requests"| API
    API -->|"protects routes"| Auth
    Auth -->|"authorizes"| Workflow
    Workflow -->|"reads and writes"| Models
    Models -->|"persists documents"| Mongo
    API -->|"runs on"| Render
    Workflow -.->|"optional notifications"| SMTP
~~~

### Technology Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Client | Angular | 20 | Customer and staff web application |
| API | Node.js and Express | Node 20 target, Express 4 | REST endpoints and middleware |
| Persistence | MongoDB and Mongoose | MongoDB 6 target, Mongoose 7 | Operational data and references |
| Authentication | JWT and bcrypt | Current package versions | Identity and password protection |
| Hosting | Render | Managed deployment | Frontend and backend hosting |
| Email | Nodemailer and SMTP | Current package versions | Optional transactional email |
| Testing | Node test runner, Jasmine, Karma | Current package versions | Automated verification |

### Data Storage and External Services

MongoDB stores users, services, bookings, reviews, quotes, assignments, and
embedded booking history. Render hosts the static frontend and Node.js API.
SMTP is an optional integration for transactional email; it is not required
for the core booking workflow.

### Key Architectural Decisions

- Domain rules are kept in reusable services and middleware rather than only in UI code.
- Booking history is embedded so the customer timeline can be read with the booking.
- The frontend is deployed as a static SPA with an explicit fallback to `index.html`.

## Component Relationships

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
~~~mermaid
flowchart LR
    subgraph PresentationLayer["Presentation"]
        cCustomer["Customer components"]
        cAdmin["Admin dashboard"]
        cTechnician["Technician dashboard"]
    end
    subgraph BusinessLayer["Business logic"]
        cBookingSvc["Booking service"]
        cAvailability["Availability service"]
        cAuthSvc["Authentication service"]
    end
    subgraph DataAccessLayer["Data access"]
        cRoutes["Express route modules"]
        cModels["Mongoose models"]
    end
    subgraph InfraLayer["Infrastructure"]
        cAuth["Auth middleware"]
        cStaff["Staff middleware"]
        cErrors["Error and request middleware"]
    end

    cCustomer -->|"calls"| cRoutes
    cAdmin -->|"calls"| cRoutes
    cTechnician -->|"calls"| cRoutes
    cRoutes -->|"uses"| cBookingSvc
    cRoutes -->|"uses"| cAvailability
    cRoutes -->|"uses"| cAuthSvc
    cBookingSvc -->|"reads and writes"| cModels
    cAvailability -->|"counts bookings"| cModels
    cAuth -.->|"protects"| cRoutes
    cStaff -.->|"protects staff routes"| cRoutes
    cErrors -.->|"wraps requests"| cRoutes
~~~

### Component Inventory

| Component | Layer | Type | Responsibility |
|---|---|---|---|
| Customer components | Presentation | Angular components | Browse, book, approve quotes, and track repairs |
| Admin dashboard | Presentation | Angular component | Manage bookings, quotes, and staff |
| Technician dashboard | Presentation | Angular component | View assigned repairs and update progress |
| Booking service | Business logic | Domain service and route logic | Validate booking workflow and lifecycle |
| Availability service | Business logic | Domain service | Define slots and calculate capacity |
| Authentication service | Business logic | Angular and API service | Authenticate users and manage tokens |
| Express route modules | Data access boundary | REST routes | Expose customer and staff operations |
| Mongoose models | Data access | ODM models | Map domain data to MongoDB |
| Auth middleware | Infrastructure | Middleware | Authenticate protected requests |
| Staff middleware | Infrastructure | Middleware | Enforce administrator and technician roles |
| Error and request middleware | Infrastructure | Middleware | Request IDs, limits, logging, and errors |
