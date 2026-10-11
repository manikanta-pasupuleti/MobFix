# MobFix Test Evidence

## Evidence captured

The current repository contains automated checks for validation and appointment
availability. The latest verified local run recorded:

| Area | Command | Result |
|---|---|---|
| Backend | `cd backend; npm test` | 4 tests passed |
| Frontend | `cd mobfix-frontend; npm test -- --watch=false --browsers=ChromeHeadless` | 2 tests passed |
| Frontend build | `cd mobfix-frontend; npm run build` | Passed with non-blocking budget warnings |
| Syntax | Node syntax checks on changed backend files | Passed |
| Hosted API | `GET https://mobfix-backend.onrender.com/api/services` | Responded with live catalog data |

## Current coverage

The existing tests cover:

- Maximum-length string validation
- Optional string handling
- The five configured appointment slots
- UTC day-boundary calculation
- Angular application-shell behavior

## Required next test layer

The capstone evaluation should add integration tests for:

1. Registration and login
2. Booking ownership
3. Capacity enforcement
4. Quote approval
5. Technician assignment
6. Valid and invalid status transitions
7. Administrator and technician authorization boundaries
8. Health and readiness responses

The end-to-end demonstration should execute:

```text
Register -> Browse service -> Select slot -> Create booking
-> Admin issues quote -> Customer approves -> Technician updates status
-> Booking completed
```

This document separates observed evidence from proposed test work so that the
report does not claim tests that have not yet been run.
