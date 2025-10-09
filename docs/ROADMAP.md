# Mediconnect Roadmap

This branch is intended for larger experiments. Use the plan below to track the final milestones that stand between the MVP and a production-ready launch.

## 1. Authentication & Security Hardening
- Replace the WhatsApp OTP stub with a real provider (e.g., WhatsApp Business API or Twilio Verify).
- Introduce secure session management (signed cookies or JWT) instead of trusting `userId` in requests.
- Add rate limiting and CSRF protection to sensitive endpoints.

## 2. Real Notifications & Messaging
- Implement persistent audit logging instead of the in-memory stub.
- Swap the messaging stub for a production-capable service (WhatsApp, SMS, or push).
- Leverage Socket.IO / Daily.co to unlock real-time consult status updates.

## 3. Payments & Billing
- Integrate a payment gateway to handle consultation fees and prescription fulfilment.
- Track payment status across prescriptions, diagnostics, and referrals.

## 4. Operational Tooling
- Add monitoring/observability (request tracing, error reporting).
- Automate database migrations and backups.
- Ship end-to-end tests that exercise the critical patient → pharmacy workflow.

## 5. Partner Experience Enhancements
- Implement video consultation using Daily.co or Twilio Video.
- Build dashboards for specialists, pharmacies, and labs with richer analytics.
- Expand QR and PDF flows with localization and accessibility improvements.

Revisit this roadmap after each milestone to keep “codex” aligned with main. When a feature is complete, move it into the changelog or documentation and prune it from here.
