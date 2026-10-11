# MobFix Software Requirements Specification

## 1. Purpose

This document defines the requirements for MobFix, a device-repair booking and
operations platform. It is written for the capstone project review and should be
read together with the architecture, data model, testing, and evaluation
documents in this directory.

## 2. Problem statement

Small repair operations often manage appointments, estimates, technician work,
and customer updates through phone calls, spreadsheets, and chat messages. That
approach makes it difficult to prevent scheduling conflicts, track ownership,
and give customers a reliable view of repair progress.

MobFix provides one workflow for service discovery, appointment booking,
quoting, technician assignment, and status tracking.

## 3. Stakeholders and roles

| Role | Goal |
|---|---|
| Customer | Book a repair and understand its price and progress |
| Administrator | Operate the repair queue and manage staff |
| Technician | Complete assigned repairs and record progress |
| Repair business owner | Gain operational visibility and accountability |

## 4. Scope

### In scope

- Customer registration and authentication
- Repair-service catalog and search
- Appointment slots with configurable capacity
- Booking creation, cancellation, and customer history
- Staff quotes and customer quote approval
- Technician assignment and status updates
- Status history visible to customers
- Role-based authorization and operational health endpoints

### Out of scope for the current release

- Online payments
- Multi-location scheduling
- Parts inventory management
- Persistent audit-log reporting
- Automated diagnosis or image-based recommendations
- Native mobile applications

## 5. Functional requirements

| ID | Requirement | Acceptance measure |
|---|---|---|
| REQ-001 | The system shall allow a customer to register and authenticate securely. | Valid credentials create a session; invalid credentials are rejected without revealing sensitive details. |
| REQ-002 | The system shall display repair services with category, price, estimated time, warranty, and rating information. | A customer can search and filter the service catalog and open a service detail view. |
| REQ-003 | The system shall expose appointment availability for a selected future date. | Each configured slot reports capacity and remaining availability. |
| REQ-004 | The system shall prevent a booking from exceeding the configured slot capacity. | Concurrent or repeated requests cannot create an active booking after capacity is reached. |
| REQ-005 | The system shall validate booking ownership on customer operations. | A customer cannot read, edit, cancel, or approve a booking owned by another customer. |
| REQ-006 | The system shall support a controlled repair lifecycle. | Invalid status transitions are rejected and valid transitions are recorded. |
| REQ-007 | The system shall allow administrators to issue quotes and assign technicians. | An authorized administrator can update quote data and technician assignment for a booking. |
| REQ-008 | The system shall allow a customer to approve a quote only when a quote has been issued. | Approval changes the booking state and records the approval timestamp. |
| REQ-009 | The system shall allow a technician to update only assigned repairs. | An unassigned technician request is rejected. |
| REQ-010 | The system shall preserve status history with actor, note, and timestamp. | Customers and staff can inspect the sequence of recorded repair events. |
| REQ-011 | The system shall return operational health and readiness information. | Liveness and database-readiness checks return distinct results. |
| REQ-012 | The system shall provide useful validation errors without exposing stack traces. | Invalid input receives a structured client-safe error response and a request identifier. |

## 6. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-001 | Usability | A first-time customer should be able to find a service and reach the booking form without assistance. |
| NFR-002 | Performance | The catalog and availability views should respond within 2 seconds at the 95th percentile under the evaluation load. |
| NFR-003 | Reliability | A failed dependency should produce an explicit readiness failure rather than a false healthy result. |
| NFR-004 | Security | Protected endpoints must enforce authentication, role checks, ownership checks, and bounded input. |
| NFR-005 | Maintainability | Domain rules should remain separated into routes, middleware, models, and reusable services. |
| NFR-006 | Deployability | The frontend must support direct navigation and refresh on client-side routes in the hosted environment. |

## 7. Assumptions

- A booking belongs to one customer, one service, and one appointment slot.
- Appointment capacity is configured per slot for the current single-location release.
- Final repair price may differ from the initial service estimate and requires a quote.
- A staff member may be an administrator or technician.
- Email and payment integrations are optional extensions, not prerequisites for the core booking workflow.

## 8. Traceability

The requirements in this document are linked to the test evidence and evaluation
documents. Requirements marked as implemented are based on the current source
and test suite; performance and user-feedback targets require the evaluation
activities described in their respective documents.
