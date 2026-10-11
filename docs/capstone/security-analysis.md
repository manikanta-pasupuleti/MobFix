# MobFix Security Analysis

## Security controls currently present

| Area | Control |
|---|---|
| Authentication | JWT-based authentication with bcrypt password hashing |
| Authorization | Customer ownership checks and administrator or technician role middleware |
| Transport and headers | Helmet security headers and HTTPS deployment |
| Cross-origin access | Configured frontend origin allowlist |
| Abuse resistance | Rate limiting on sensitive authentication routes |
| Input handling | Shared validation helpers, bounded strings, and payload-size limits |
| Error handling | Structured errors with request identifiers instead of stack traces |
| Operations | Liveness and readiness endpoints |
| Secrets | Environment-based production configuration |

## Dependency security evidence

On 11 October 2026, the production dependency trees were scanned with npm
audit after the Render vulnerability report:

| Application | Remediation | Production audit result |
|---|---|---|
| Backend | Patched transitive Express dependencies and upgraded Nodemailer to 10.1.0 | 0 vulnerabilities |
| Frontend | Removed the unused browser MongoDB client and updated Angular within the 20.x line | 0 vulnerabilities |

The full development dependency trees may still report findings in test and
watch tooling. Those packages are not included in the production deployment;
they remain a maintenance item and are not suppressed with a forced downgrade.

## Threats and mitigations

| Threat | Risk | Mitigation | Follow-up |
|---|---|---|---|
| Unauthorized booking access | High | Server-side ownership checks | Add negative integration tests |
| Privilege escalation | High | Role-aware staff middleware | Test every staff route with each role |
| Credential attack | High | Password hashing and login rate limiting | Add progressive delay and alerting |
| Overbooking | Medium | Server-side capacity validation | Test concurrent booking attempts |
| Sensitive error leakage | Medium | Client-safe error responses | Review all route error paths |
| Secret exposure | High | Environment configuration and ignored env files | Rotate any credential ever committed |
| Malicious file upload | Future | Not currently in scope | Validate type, size, storage, and malware risk before adding uploads |

## Security review boundaries

This is an application security analysis, not a penetration-test certificate.
Before production use, run dependency scanning, authorization tests, secret
scanning, HTTPS verification, and a manual review of deployed configuration.
