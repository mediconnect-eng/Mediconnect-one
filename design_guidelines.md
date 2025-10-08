# Mediconnect Design Guidelines

## Design Approach: Modern Healthcare Design System

**Selected Approach**: Material Design 3 foundation with healthcare-specific adaptations and modern color palette
**Rationale**: Healthcare applications demand trust, clarity, and accessibility. The updated design uses purple/indigo as the primary color for a modern, accessible interface while maintaining visual polish for patient-facing experiences.

## Core Design Principles

1. **Clinical Clarity**: Information hierarchy optimized for quick scanning and decision-making
2. **Trust & Professionalism**: Clean, medical-grade aesthetics that inspire confidence
3. **Role-Adaptive UI**: Distinct visual treatments for patient vs. professional portals
4. **Accessibility First**: WCAG AAA compliance for healthcare contexts

## Color Palette

### Light Mode
- **Primary (Purple/Indigo)**: 245 80% 60% (#5B51E8) - main actions, active states, primary buttons
- **Emergency/Danger (Red)**: 0 72% 51% (#DC2626) - emergency button, sign out, critical alerts
- **Success (Green)**: 160 84% 39% (#10B981) - "Ready", "Completed", "Paid" status badges
- **Warning (Amber)**: 38 92% 50% (#F59E0B) - "Pending" status, caution states
- **Info (Light Blue)**: 200 95% 45% - informational badges and notifications
- **Background Primary**: 0 0% 100% (White) - main background
- **Background Secondary**: 220 14% 98% (#F9FAFB) - section backgrounds, subtle contrast
- **Card**: 0 0% 100% (White) - card backgrounds with subtle shadow
- **Border**: 220 13% 91% (#E5E7EB) - default borders, dividers
- **Text Primary**: 220 13% 18% - main content text
- **Text Secondary**: 220 9% 46% - supporting text, metadata
- **Text Tertiary**: 220 9% 64% - least important text, placeholders

### Dark Mode
- **Primary (Purple/Indigo)**: 245 75% 65% - lighter for better contrast on dark backgrounds
- **Emergency/Danger (Red)**: 0 68% 55% - adjusted for dark mode visibility
- **Success (Green)**: 160 80% 45% - adjusted for dark mode
- **Warning (Amber)**: 38 88% 55% - adjusted for dark mode
- **Info (Light Blue)**: 200 90% 50%
- **Background Primary**: 220 18% 12% - deep dark with slight blue tint
- **Background Secondary**: 220 15% 16% - slightly elevated dark surface
- **Card**: 220 15% 18% - elevated card surface
- **Border**: 220 12% 24% - borders in dark mode
- **Text Primary**: 220 5% 95% - light text
- **Text Secondary**: 220 5% 70% - muted light text
- **Text Tertiary**: 220 5% 50% - very muted text

### Status Colors (Semantic)
- **Ready/Active**: Green (160 84% 39%) - available, ready states
- **Pending**: Amber (38 92% 50%) - waiting, in-progress states
- **Completed**: Green (160 84% 39%) with checkmark icon
- **Expired/Cancelled**: Red (0 72% 51%) or Gray (220 9% 46%)
- **Paid**: Green (160 84% 39%) - successful payment
- **Prescription**: Purple (260 60% 55%) - pharmacy-related
- **Diagnostics**: Cyan (190 70% 50%) - lab work, tests
- **Consult Active**: Orange (25 90% 55%) - urgent attention needed

## Typography

### Font Families
- **Primary (UI/Body)**: Inter (Google Fonts - exceptional readability, medical contexts)
- **Headings**: Inter (same family, weight variation for hierarchy)
- **Monospace (Data/IDs)**: JetBrains Mono (patient IDs, reference numbers)

### Type Scale & Weights
- **Display (Hero)**: text-5xl md:text-6xl, font-bold (700)
- **H1 (Page Titles)**: text-3xl md:text-4xl, font-semibold (600)
- **H2 (Section Headers)**: text-2xl md:text-3xl, font-semibold (600)
- **H3 (Card Titles)**: text-xl font-semibold (600)
- **Body Large**: text-base md:text-lg, font-normal (400)
- **Body**: text-sm md:text-base, font-normal (400)
- **Small/Metadata**: text-sm (14px), font-normal (400), text-secondary color
- **Caption**: text-xs, font-normal (400)
- **Label (Form/Buttons)**: text-sm font-medium (500)

## Spacing System

### Core Units
- **Container padding**: 16px (mobile - p-4), 24px (desktop - p-6)
- **Card padding**: 16px (p-4)
- **Section gaps**: 24px (gap-6)
- **Element gaps**: 12px (gap-3), 8px tight (gap-2)
- **Micro spacing**: 4px (gap-1) for very tight elements

### Spacing Scale
- **xs**: 4px (space-1)
- **sm**: 8px (space-2)
- **md**: 12px (space-3)
- **lg**: 16px (space-4)
- **xl**: 24px (space-6)
- **2xl**: 32px (space-8)

## Layout System

### Grid & Containers
- **Max Width**: max-w-7xl (1280px) for main content
- **Portal Layouts**: max-w-6xl (professional interfaces)
- **Reading Content**: max-w-3xl (patient instructions, legal text)
- **Grid Patterns**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### Layout Structure
- **Top Bar**: Fixed height ~56px (h-14), logo left, emergency + notification right
- **Bottom Tab Bar**: Fixed height ~64px (h-16), 5 evenly spaced tabs
- **Content Area**: Scrollable between top and bottom bars, overflow-y-auto

### Responsive Breakpoints
- **Mobile**: base (< 768px) - single column, bottom nav
- **Tablet**: md (768px+) - 2-column layouts, side nav optional
- **Desktop**: lg (1024px+) - full multi-column, persistent side navigation

## Component Patterns

### Status Badges
- **Shape**: Rounded pill (rounded-full)
- **Padding**: px-3 py-1
- **Typography**: text-xs font-medium
- **Variants**:
  - **Ready/Active**: Green background (bg-green-100), green text (text-green-700)
  - **Pending**: Amber background (bg-amber-100), amber text (text-amber-700)
  - **Completed**: Green background with checkmark icon
  - **Expired/Cancelled**: Red/gray background
  - **Paid**: Green background (bg-green-100), green text (text-green-700)

### Cards
- **Background**: White (bg-card)
- **Border Radius**: 12px (rounded-xl)
- **Padding**: 16px (p-4)
- **Shadow**: Subtle (shadow-sm)
- **Clickable Cards**: 
  - Hover state with slight elevation (hover:shadow-md)
  - Transition (transition-shadow duration-200)
- **Action Cards**:
  - Include icon (left)
  - Title (font-semibold)
  - Description (text-sm text-secondary)
  - Arrow/chevron (right)

### Progress Dots
- **Layout**: Horizontal flex (flex gap-2)
- **Dots**: Circular (w-2 h-2 rounded-full)
- **Completed**: Filled with primary color (bg-primary)
- **Pending**: Outlined (border-2 border-primary bg-transparent)

### Navigation

#### Bottom Navigation (Mobile)
- **Items**: 5 evenly spaced tabs
- **Layout**: Fixed bottom, flex justify-around
- **Active State**: Purple icon + text (text-primary)
- **Inactive State**: Gray icon + text (text-muted-foreground)
- **Icon + Label**: Vertical stack, icon above label
- **Height**: 64px (h-16)

#### Top Bar
- **Height**: 56px (h-14)
- **Layout**: Flex justify-between
- **Left**: Logo/brand
- **Right**: Emergency button + notifications

#### Partner Portals
- **Side Navigation**: Desktop persistent, mobile collapsible
- **Tab Navigation**: Underline active state, primary color accent

### Buttons

#### Primary Button
- **Background**: Purple (bg-primary)
- **Text**: White (text-primary-foreground)
- **Width**: Full width on mobile (w-full md:w-auto)
- **Padding**: px-6 py-3
- **Border Radius**: rounded-md
- **Font**: font-medium

#### Secondary Button
- **Background**: White/transparent (bg-transparent)
- **Border**: 2px border-primary
- **Text**: Purple (text-primary)
- **Padding**: px-6 py-3

#### Emergency Button
- **Background**: Red (bg-destructive)
- **Text**: White (text-destructive-foreground)
- **Icon**: Alert or phone icon
- **Position**: Top-right in header

### Forms & Inputs
- **Text Fields**: Outlined style, focus:ring-2 ring-primary, rounded-md, p-3
- **Labels**: text-sm font-medium, mb-1
- **Helper Text**: text-xs text-muted-foreground
- **Error State**: border-destructive, text-destructive

### Data Display
- **Tables**: Striped rows, sticky header, min 3 columns visible on mobile
- **Timeline**: Vertical line (border-l-2) with circular nodes
- **Item Lists**: Large touch targets (min-h-16), primary text bold, secondary text-sm

### Overlays & Modals
- **Modal**: Centered, max-w-md, shadow-2xl, rounded-xl
- **QR Scanner**: Full-screen overlay, camera viewport centered
- **Confirmation Dialogs**: Critical actions use destructive color

## Role-Specific UI

### Patient Portal
- Friendly, approachable with rounded elements (rounded-xl)
- Large touch targets (min-h-14 buttons)
- Bottom tab navigation (5 items)
- Purple accent for active states
- Prescription items with medication icons

### GP/Specialist Portals
- Clinical efficiency focus
- Dense information display
- Quick action buttons
- Patient cards with medical summary

### Pharmacy Portal
- QR scanner prominent
- Item-only display (NO patient names/details)
- Large verification feedback
- Quantity and dosage emphasized

### Diagnostics Portal
- Minimal PII tables
- Upload zone with drag-drop
- Result preview cards

## Accessibility Features

- **Focus Indicators**: ring-2 ring-offset-2 ring-primary
- **Color Contrast**: Minimum 7:1 for clinical data (WCAG AAA)
- **Touch Targets**: Minimum 44x44px (11rem) for mobile
- **Screen Reader**: aria-labels on all icons
- **Keyboard Navigation**: Full tab order, Enter/Space activation

## Animations & Interactions

**Minimal Motion Philosophy**: Healthcare contexts require stability

- **Page Transitions**: Simple fade (duration-200)
- **Status Changes**: Color transition (transition-colors duration-300)
- **Hover States**: Slight elevation (hover:shadow-md)
- **Loading States**: Subtle pulse on skeleton screens
- **NO**: Complex animations, parallax, particle effects
