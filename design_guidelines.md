# Mediconnect Design Guidelines

## Design Approach: Healthcare-Optimized Design System

**Selected Approach**: Material Design 3 foundation with healthcare-specific adaptations
**Rationale**: Healthcare applications demand trust, clarity, and accessibility. Material Design provides robust patterns for data-dense interfaces while maintaining visual polish for patient-facing experiences.

## Core Design Principles

1. **Clinical Clarity**: Information hierarchy optimized for quick scanning and decision-making
2. **Trust & Professionalism**: Clean, medical-grade aesthetics that inspire confidence
3. **Role-Adaptive UI**: Distinct visual treatments for patient vs. professional portals
4. **Accessibility First**: WCAG AAA compliance for healthcare contexts

## Color Palette

### Light Mode
- **Primary Brand**: 210 85% 45% (Medical Blue - trust, professionalism)
- **Primary Variant**: 210 75% 35% (Deeper blue for emphasis)
- **Secondary/Accent**: 150 60% 45% (Healthcare Green - health, vitality)
- **Background**: 210 20% 98% (Soft clinical white)
- **Surface**: 0 0% 100% (Pure white for cards/containers)
- **Error**: 0 70% 50% (Medical red - alerts, critical info)
- **Warning**: 40 95% 50% (Amber - caution states)
- **Success**: 150 65% 45% (Consistent with accent green)

### Dark Mode
- **Primary Brand**: 210 80% 60% (Lighter blue for contrast)
- **Background**: 210 15% 12% (Deep blue-tinted dark)
- **Surface**: 210 12% 16% (Elevated surface tone)
- **Text Primary**: 210 5% 95%
- **Text Secondary**: 210 5% 70%

### Semantic Colors
- **Prescription Status**: 260 60% 55% (Purple - pharmacy)
- **Diagnostics Status**: 190 70% 50% (Cyan - lab work)
- **Consult Active**: 25 90% 55% (Orange - urgent attention)
- **Completed/Archived**: 210 10% 60% (Neutral gray)

## Typography

### Font Families
- **Primary (UI/Body)**: Inter (Google Fonts - exceptional readability, medical contexts)
- **Headings**: Inter (same family, weight variation for hierarchy)
- **Monospace (Data/IDs)**: JetBrains Mono (patient IDs, reference numbers)

### Type Scale
- **Display (Hero)**: text-5xl md:text-6xl, font-bold (Patient-facing headlines)
- **H1 (Page Titles)**: text-3xl md:text-4xl, font-semibold
- **H2 (Section Headers)**: text-2xl md:text-3xl, font-semibold
- **H3 (Card Titles)**: text-xl font-medium
- **Body Large**: text-base md:text-lg (Patient instructions, important info)
- **Body**: text-sm md:text-base (Default interface text)
- **Caption**: text-xs md:text-sm (Metadata, timestamps)
- **Label (Form/Buttons)**: text-sm font-medium, uppercase tracking-wide

## Layout System

### Spacing Primitives
**Core Units**: 4, 8, 12, 16, 24, 32 (e.g., p-4, gap-8, mt-12, py-16, mb-24, pt-32)
- Micro spacing: 4-8 (component internal)
- Standard spacing: 12-16 (between related elements)
- Section spacing: 24-32 (major content separation)

### Grid & Containers
- **Max Width**: max-w-7xl (1280px) for main content
- **Portal Layouts**: max-w-6xl (professional interfaces)
- **Reading Content**: max-w-3xl (patient instructions, legal text)
- **Grid Patterns**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 (feature cards, prescription items)

### Responsive Breakpoints
- Mobile: base (< 768px) - single column, bottom nav
- Tablet: md (768px+) - 2-column layouts, side nav optional
- Desktop: lg (1024px+) - full multi-column, persistent side navigation

## Component Library

### Navigation
- **Patient App**: Bottom tab navigation (mobile), top nav bar (desktop) with AI assistant quick access
- **Partner Portals**: Side navigation (desktop), collapsible hamburger (mobile) with role indicator badge
- **Tab Navigation**: Underline active state with smooth slide animation, primary color accent

### Cards & Surfaces
- **Prescription Cards**: Elevated (shadow-md), rounded-lg, p-6, white background with status chip top-right
- **Consult Cards**: Border-l-4 accent (status-dependent color), bg-surface, p-5
- **Dashboard Stats**: Grid cards with large numbers (text-4xl), icon (text-primary), label below
- **QR Panel**: Centered square container (max-w-sm), border-2 border-dashed when disabled, solid when active

### Forms & Inputs
- **Text Fields**: Outlined style, focus:ring-2 ring-primary, rounded-md, p-3
- **Buttons Primary**: bg-primary text-white, px-6 py-3, rounded-md, font-medium, shadow-sm hover:shadow-md
- **Buttons Secondary**: border-2 border-primary text-primary, bg-transparent
- **Buttons on Images**: backdrop-blur-md bg-white/20 border-2 border-white text-white (no hover changes needed)

### Data Display
- **Tables (Professional Portals)**: Striped rows (bg-surface alternate), sticky header, min 3 columns visible mobile
- **Status Chips**: Rounded-full px-3 py-1 text-xs font-medium with semantic bg colors (awaiting: amber, ready: green, completed: gray)
- **Timeline (Consult History)**: Vertical line (border-l-2) with circular nodes, timestamps right-aligned
- **Item Lists (Pharmacy)**: Large touch targets (min-h-16), drug name bold, dosage/instructions text-sm text-secondary

### Overlays & Modals
- **Coming Soon**: Centered card with icon, heading, description, email capture form, backdrop-blur-sm
- **QR Scanner Modal**: Full-screen overlay (bg-black/90), camera viewport centered, torch toggle bottom
- **Confirmation Dialogs**: max-w-md, centered, shadow-2xl, critical actions use error color

### Role-Specific UI

**Patient Portal**:
- Friendly, approachable tone with rounded elements (rounded-xl)
- Large touch targets (min-h-14 buttons)
- AI Assistant hero with gradient accent (from-primary to-secondary)
- Prescription items with medication icons, large readable text

**GP/Specialist Portals**:
- Clinical efficiency focus with dense information display
- Quick action buttons (floating action pattern for common tasks)
- Patient cards with medical summary preview
- WhatsApp join buttons (disabled state with tooltip: "Coming Soon")

**Pharmacy Portal**:
- QR scanner prominent (hero position)
- Item-only display (NO patient names/details)
- Large verification feedback (success: green full-screen check, error: red X)
- Quantity and dosage emphasized (text-2xl font-bold)

**Diagnostics Portal**:
- Minimal PII tables (order ID, test type, status only)
- Upload zone with drag-drop (border-dashed border-2, hover:border-primary)
- Result preview cards with download action

## Images & Visual Assets

### Hero Images
- **Patient Home**: Warm, diverse healthcare imagery (doctor-patient interaction, modern clinic), aspect-16/9, gradient overlay
- **Role Chooser**: Abstract medical iconography or split-screen role representations
- **Coming Soon Pages**: Soft gradient backgrounds (no images) with floating icon elements

### Icons
- **Library**: Heroicons (outline for nav/actions, solid for status indicators)
- **Medical Icons**: Custom set for prescriptions (pill, syringe), diagnostics (microscope, test tube), consultations (stethoscope)
- **Sizes**: w-5 h-5 (inline), w-8 h-8 (cards), w-16 h-16 (empty states)

## Animations & Interactions

**Minimal Motion Philosophy**: Healthcare contexts require stability over flash

- **Page Transitions**: Simple fade (duration-200)
- **Status Changes**: Color transition only (transition-colors duration-300)
- **Loading States**: Subtle pulse on skeleton screens
- **Tab Switching**: Underline slide (transform-gpu translate-x)
- **NO**: Complex scroll animations, parallax, particle effects

## Accessibility Features

- **Focus Indicators**: ring-2 ring-offset-2 ring-primary on all interactive elements
- **Color Contrast**: Minimum 7:1 for clinical data (WCAG AAA)
- **Touch Targets**: Minimum 44x44px (3rem) for mobile
- **Screen Reader**: aria-labels on all icons, role="status" for dynamic updates
- **Keyboard Navigation**: Full tab order, Enter/Space activation, Escape to close modals

## Professional Portal Consistency

All four partner portals share:
- Same navigation structure (adapted to role-specific sections)
- Unified table design with role-specific columns
- Consistent action button patterns (view, edit, download)
- Shared empty state illustrations with role-specific messaging