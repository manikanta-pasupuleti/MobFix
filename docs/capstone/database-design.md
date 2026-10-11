# MobFix Database Design

## 1. Data model overview

MobFix uses MongoDB documents for the primary operational entities. References
are used between users, services, reviews, and bookings. Booking status history
is embedded because it is read with the booking timeline and is bounded by the
repair lifecycle.

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
~~~mermaid
flowchart LR
    User1[("User")]
    Service1[("Service")]
    Booking1[("Booking")]
    Review1[("Review")]
    History1[("Status history")]

    User1 -->|"creates"| Booking1
    Service1 -->|"selected for"| Booking1
    User1 -->|"writes"| Review1
    Service1 -->|"receives"| Review1
    Booking1 -->|"embeds"| History1
    User1 -->|"assigned technician"| Booking1
~~~

## 2. Entity definitions

### User

Stores customer and staff identity data. Important attributes include email,
password hash, role, and active status. Roles are customer, technician, and
administrator.

### Service

Stores the repair catalog entry: name, description, category, platform,
estimated price, repair time, warranty, rating, and popularity.

### Booking

Stores the customer request, device details, issue description, appointment
date and slot, quote, actual cost, assigned technician, current status, and
cancellation or completion information.

### Review

Stores a customer's rating and comment for a completed service experience.

### Embedded status history

Stores each status, optional note, actor reference, and timestamp in the
booking document.

## 3. Integrity rules

- `userId` and `serviceId` are required on every booking.
- Device, issue, appointment, and contact fields are validated before persistence.
- Booking statuses are restricted to the defined lifecycle values.
- Active bookings are counted for slot capacity; cancelled bookings do not consume capacity.
- Technician actions are limited to bookings assigned to that technician.
- Customer booking operations require ownership verification.
- Quote approval is allowed only when the booking is quoted and quote data exists.

## 4. Indexing and growth considerations

The service catalog has indexes for common filtering and sorting. As usage
grows, booking indexes should cover customer history, appointment date and
slot, status, and technician assignment. A future multi-location design should
include location and resource identifiers in the booking uniqueness strategy.
