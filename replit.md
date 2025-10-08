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

**Current Implementation**: In-memory storage (`MemStorage` class in `server/storage.ts`) implementing the `IStorage` interface

**Database Schema** (defined in `shared/schema.ts` using Drizzle ORM):
- **users**: User accounts with role-based access (patient, gp, specialist, pharmacy, diagnostics)
- **consults**: Patient consultations with intake data and status tracking
- **messages**: Consultation messages
- **prescriptions**: Digital prescriptions with items, QR tokens, and PDF download tracking
- **referrals**: GP-to-specialist referrals with proposed specialist lists
- **diagnosticsOrders**: Lab test orders with status tracking

**Planned Migration**: PostgreSQL via Drizzle ORM (configuration in `drizzle.config.ts` with Neon serverless driver)

**Design Decision**: The in-memory storage provides a drop-in replacement pattern, allowing seamless transition to a real database by implementing the same `IStorage` interface

### Authentication and Authorization

**Current Approach**: Mock authentication system with stub OTP verification

**Authentication Flow**:
1. Phone-based OTP request (currently accepts any code)
2. Mock login by identifier and role for development
3. Session-based authentication (credentials included in fetch requests)

**Authorization**: Role-based access control with five distinct user roles, each with dedicated portal routes

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

### Completed MVP Features
- ✅ Complete schema-first architecture with TypeScript interfaces and domain contracts
- ✅ All five role-based portals (Patient, GP, Specialist, Pharmacy, Diagnostics) with full UI
- ✅ Backend API with Express routes, in-memory storage, and stub adapters
- ✅ Frontend-backend integration with React Query (no mock data)
- ✅ Digital prescription PDF generation with PDFKit
- ✅ QR-disable policy: PDF download disables QR code via adapter
- ✅ Pharmacy item-only view: NO patient PII exposed
- ✅ Safe localStorage helper with error handling
- ✅ All critical bugs fixed (React hooks, nested anchors, JSON parsing, auth flow)

### Core User Journeys (Verified)
1. **Patient Flow**: Login → View prescriptions → Download PDF (QR disabled)
2. **Pharmacy Flow**: Login → Scan QR → View items only (no PII) → Reject disabled QR
3. **GP Flow**: Login → View consultations → Manage patient care
4. **Specialist Flow**: Login → View referrals → Manage appointments
5. **Diagnostics Flow**: Login → View lab orders → Upload results

### Technical Implementation
- **Auth Flow**: Mock login finds existing users by phone (prevents duplicates)
- **PDF Generation**: Real PDFKit PDFs with prescription details and disabled status
- **Storage Helper**: Safe `getUserFromStorage()` with try-catch error handling
- **Adapter Swappability**: Config-driven registry enables production integrations
- **Seed Data**: In-memory storage with test patient (phone: 1234567890), prescription (QR: QR-ABC123XYZ789)

### Known Limitations (MVP v0)
- In-memory storage resets on server restart (planned: PostgreSQL migration)
- Stub adapters for all external services (planned: real WhatsApp, payment, mapping APIs)
- UUIDs regenerate on each seed (affects test consistency but not production use)

### Next Steps for Production
1. Migrate to PostgreSQL database with Drizzle ORM
2. Implement real WhatsApp Business API integration
3. Add payment gateway integration (Stripe/Razorpay)
4. Implement real QR code generation and storage service
5. Add comprehensive error monitoring and logging
6. Set up automated backups and disaster recovery