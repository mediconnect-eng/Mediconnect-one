# Mediconnect - Healthcare Access Platform

## Overview

Mediconnect is a WhatsApp-first healthcare platform designed to connect patients with medical professionals and services. The application follows a Healthcare-as-a-Service (HaaS) model where General Practitioners (GPs) serve as the primary point of contact, managing consultations and providing curated referrals to specialists. The platform supports digital prescriptions with QR code verification, diagnostic test ordering, and a multi-portal system serving patients, GPs, specialists, pharmacies, and diagnostic centers.

The current implementation is a modular, extensible skeleton built with a ports-and-adapters (hexagonal) architecture, enabling easy replacement of stub implementations with real integrations in the future.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, utilizing Vite as the build tool

**Routing**: Wouter for client-side routing with role-based portal separation

**UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling

**State Management**: TanStack Query (React Query) for server state management

**Design System**: Material Design 3 foundation with healthcare-specific adaptations, emphasizing clinical clarity, accessibility (WCAG AAA compliance), and trust. The color palette uses medical blue as primary (HSL 210 85% 45%), healthcare green as accent (HSL 150 60% 45%), with semantic colors for different healthcare contexts (prescription purple, diagnostics cyan, consult orange).

**Typography**: Inter font family for body text and headings, JetBrains Mono for data/IDs

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**Architecture Pattern**: Hexagonal/Ports-and-Adapters pattern with clear separation between domain logic and infrastructure concerns

**Domain Ports** (interfaces in `shared/ports.ts`):
- AuthPort: Authentication and OTP handling
- ConsultPort: Consultation management
- ReferralPort: Specialist referral handling
- PrescriptionPort: Prescription and QR code management
- PharmacyPort: Pharmacy QR verification
- DiagnosticsPort: Lab order management
- NotificationPort: Messaging notifications
- StoragePort: File storage
- AuditPort: Audit logging

**Adapters** (stub implementations in `server/adapters/`):
- WhatsAppAuthStub: Mock authentication accepting any OTP code
- WhatsAppMessagingStub: Console-logged notifications
- QRLocalStub: Local QR token generation and validation
- StorageLocalStub: In-memory file storage
- AuditStub: In-memory audit logging

**Configuration-Driven Module System**: Feature flags and adapter registry in `shared/config.ts` allow enabling/disabling features and swapping implementations without code changes

### Data Storage Solutions

**Current Implementation**: PostgreSQL database with Drizzle ORM (`DatabaseStorage` class in `server/storage.ts`) implementing the `IStorage` interface

**Database Schema** (defined in `shared/schema.ts` using Drizzle ORM):
- **users**: User accounts with role-based access (patient, gp, specialist, pharmacy, diagnostics), email UNIQUE constraint, nullable phone field
- **consults**: Patient consultations with intake data and status tracking, foreign key to users
- **messages**: Consultation messages, foreign keys to consults and users
- **prescriptions**: Digital prescriptions with items, QR tokens, and PDF download tracking, foreign keys to consults and users
- **referrals**: GP-to-specialist referrals with proposed specialist lists, foreign keys to users
- **diagnosticsOrders**: Lab test orders with status tracking, foreign keys to users

**Database Configuration**: PostgreSQL via Drizzle ORM with Neon serverless driver (configured in `drizzle.config.ts`)

**Design Decision**: The DatabaseStorage implements the same `IStorage` interface pattern, providing type-safe database queries with proper foreign key constraints and referential integrity

### Authentication and Authorization

**Current Approach**: Email-based authentication with mandatory WhatsApp number

**Authentication Flow**:
1. Email + WhatsApp number input (both required for new users)
2. Mock login finds existing users by email (primary identifier)
3. Phone number updated if different from stored value
4. Backend validation ensures proper email format and 10+ digit phone
5. Session-based authentication (credentials included in fetch requests)

**Authorization**: Role-based access control with five distinct user roles, each with dedicated portal routes

**Database Constraints**:
- Email: UNIQUE constraint (primary identifier)
- Phone: Nullable (no UNIQUE constraint to avoid null collision issues)

**Future Integration**: WhatsApp Business API for production OTP delivery (adapter pattern allows easy swap)

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives for accessible component foundation
- shadcn/ui for pre-built healthcare-optimized components
- Lucide React for icons

**Styling**:
- Tailwind CSS with custom healthcare color palette
- PostCSS for processing

**State and Data Fetching**:
- TanStack Query for server state, caching, and optimistic updates
- React Hook Form with Zod resolvers for form validation

**Date Handling**:
- date-fns for date formatting and manipulation

**PDF Generation**:
- PDFKit for server-side prescription PDF generation

**Database and ORM**:
- Drizzle ORM for type-safe database queries
- @neondatabase/serverless for PostgreSQL connection
- Drizzle-Zod for schema validation

**Development Tools**:
- Vite plugins for Replit integration (cartographer, dev banner, runtime error overlay)
- TypeScript for type safety across the stack

**Key Architectural Decisions**:

1. **Hexagonal Architecture**: Chosen to enable independent testing of business logic and easy replacement of external service implementations (WhatsApp, payment gateways, mapping services)

2. **Monorepo-Ready Structure**: While currently a single app, the codebase is organized with clear package boundaries (`shared/`, `server/`, `client/`) to facilitate future monorepo migration

3. **Stub-First Development**: All external integrations use stub implementations with console logging, allowing full application flow testing without third-party dependencies

4. **Type-Safe Contracts**: Shared TypeScript types and Zod schemas ensure consistency between frontend and backend

5. **Feature Flag System**: Enables gradual feature rollout and A/B testing without code deployment

## Recent Changes (October 2025)

### Completed Features (Latest)
- ✅ **PostgreSQL Database Migration**: Replaced in-memory storage with DatabaseStorage using Drizzle ORM, added foreign key constraints and relations, migrated all seed data to persistent database
- ✅ **Email Authentication with Mandatory WhatsApp**: Implemented email as primary identifier with required WhatsApp number, backend validation (email format + 10+ digit phone), UNIQUE constraint on email
- ✅ Complete schema-first architecture with TypeScript interfaces and domain contracts
- ✅ All five role-based portals (Patient, GP, Specialist, Pharmacy, Diagnostics) with full UI
- ✅ Backend API with Express routes, PostgreSQL storage, and stub adapters
- ✅ Frontend-backend integration with React Query (no mock data)
- ✅ Digital prescription PDF generation with PDFKit
- ✅ QR-disable policy: PDF download disables QR code via adapter
- ✅ Pharmacy item-only view: NO patient PII exposed
- ✅ Safe localStorage helper with error handling
- ✅ All critical bugs fixed (React hooks, nested anchors, JSON parsing, auth flow)

### Core User Journeys (Verified)
1. **Patient Flow**: Login with email+phone → View prescriptions → Download PDF (QR disabled)
2. **Pharmacy Flow**: Login with email+phone → Scan QR → View items only (no PII) → Reject disabled QR
3. **GP Flow**: Login with email+phone → View consultations → Manage patient care
4. **Specialist Flow**: Login with email+phone → View referrals → Manage appointments
5. **Diagnostics Flow**: Login with email+phone → View lab orders → Upload results

### Technical Implementation
- **Database**: PostgreSQL with Drizzle ORM, foreign key constraints, seed script with test credentials
- **Auth Flow**: Email + WhatsApp number input, backend validation (400 errors for invalid inputs), email as primary identifier
- **PDF Generation**: Real PDFKit PDFs with prescription details and disabled status
- **Storage Helper**: Safe `getUserFromStorage()` with try-catch error handling
- **Adapter Swappability**: Config-driven registry enables production integrations
- **Seed Data**: PostgreSQL database with test patient (email: patient@demo.com, phone: 1234567890), prescription (QR: QR-ABC123XYZ789)

### Known Limitations (MVP v1)
- Stub adapters for all external services (planned: real WhatsApp, payment, mapping APIs)
- Local QR token generation (planned: secure cloud-based QR service)
- Mock file storage (planned: S3/GCS integration)

### Next Steps for Production
1. ✅ ~~Migrate to PostgreSQL database with Drizzle ORM~~ (COMPLETED)
2. ✅ ~~Email authentication with WhatsApp number~~ (COMPLETED)
3. Implement cloud storage for diagnostic results and prescription PDFs (S3/GCS)
4. Implement secure QR code generation service (QR Code Monkey/GoQR)
5. Add video consultation feature (Twilio Video/Daily.co)
6. Implement real WhatsApp Business API integration
7. Add payment gateway integration (Stripe/Razorpay)
8. Add comprehensive error monitoring and logging
9. Set up automated backups and disaster recovery