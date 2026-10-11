# MobFix Performance Evaluation

## Objective

Measure whether common customer and staff actions remain responsive under a
representative workload. The evaluation is deliberately repeatable: the same
environment, dataset, request mix, and concurrency levels should be used for
each release candidate.

## Scenarios

| Scenario | Request | User outcome |
|---|---|---|
| Catalog browse | `GET /api/services` | Services appear quickly |
| Availability lookup | `GET /api/bookings/availability?date=...` | A customer sees usable slots |
| Authentication | Register and login | A customer can begin a booking |
| Booking creation | `POST /api/bookings` | A valid booking is created without overbooking |
| Staff queue | Technician booking list | Staff can load assigned work |

## Acceptance targets

- 95th percentile response time below 2 seconds for catalog and availability.
- 95th percentile response time below 3 seconds for authenticated booking creation.
- Zero accepted bookings beyond configured slot capacity.
- Error rate below 1 percent for valid requests during the test window.
- No data loss or duplicate status-history events after repeated requests.

## Method

1. Seed a representative service catalog and booking dataset.
2. Run a warm-up period before collecting measurements.
3. Test at 1, 5, 10, and 25 concurrent clients.
4. Record p50, p95, p99 latency, throughput, and error rate.
5. Repeat each scenario three times and report the median run.
6. Record deployment region, database tier, dataset size, and test date.

No benchmark result is claimed here until the evaluation is run against a
declared environment. The targets above are the capstone acceptance criteria.

## Initial live smoke measurement

On 2026-10-11, twenty sequential requests were sent from the development
workstation to the deployed catalog endpoint
`https://mobfix-backend.onrender.com/api/services`. All twenty requests
succeeded. Observed latency was 536 ms at p50, 691 ms at p95, with a 509 ms
minimum and 1,216 ms maximum.

This is an initial availability and latency smoke measurement, not a load test:
it used one client, a sequential request mix, and an unknown production
dataset size. The concurrency matrix above remains pending.
