---
name: Obsidian Intelligence
colors:
  surface: '#0d1515'
  surface-dim: '#0d1515'
  surface-bright: '#323b3b'
  surface-container-lowest: '#081010'
  surface-container-low: '#151d1d'
  surface-container: '#192121'
  surface-container-high: '#232b2c'
  surface-container-highest: '#2e3637'
  on-surface: '#dce4e4'
  on-surface-variant: '#b9caca'
  inverse-surface: '#dce4e4'
  inverse-on-surface: '#2a3232'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#fff9f0'
  on-tertiary: '#3a3000'
  tertiary-container: '#ffdb3f'
  on-tertiary-container: '#736000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffe16c'
  tertiary-fixed-dim: '#e7c427'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#544600'
  background: '#0d1515'
  on-background: '#dce4e4'
  surface-variant: '#2e3637'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 4px
  gap-xs: 0.5rem
  gap-md: 1rem
  gap-lg: 2rem
  margin-desktop: 2.5rem
  margin-mobile: 1rem
  container-max: 1440px
---

## Brand & Style
The design system is an enterprise-grade framework designed for high-performance AI operations and data-intensive workflows. It adopts a **Corporate Modern** aesthetic infused with **Minimalist** and **Glassmorphic** elements to signify technical sophistication and precision.

The personality is authoritative yet frictionless, prioritizing clarity and speed. It is built as a dark-mode-first interface, utilizing deep slates and high-vibrancy accents to reduce eye strain during long-form analytical sessions. The target audience includes data scientists, enterprise administrators, and developers who require a tool that feels like a professional instrument rather than a consumer toy.

## Colors
The color architecture is optimized for a high-contrast, dark-mode environment, ensuring WCAG AA compliance across all semantic layers.

- **Primary (Cyan #00f5ff):** Reserved for primary actions, progress indicators, and active AI states.
- **Secondary (Purple):** Used for auxiliary features, secondary data sets, and creative AI outputs.
- **Semantic Palette:** Success (Emerald), Warning (Amber), and Danger (Rose) follow industry standards for immediate recognition.
- **Surface System:** Uses "Deep Slates" to create a layered hierarchy. The base layer is near-black, with nested containers using progressively lighter slates to signify elevation.
- **Interactive States:** Hover states should increase brightness by 10% or add a low-opacity glow. Pressed states should decrease opacity to 80%.

## Typography
This design system utilizes **Inter** for all UI and editorial content to maximize legibility and systematic scaling. **JetBrains Mono** is employed for code snippets, technical metadata, and AI-generated logs.

- **Scale:** A modular scale is used to ensure hierarchy.
- **Letter Spacing:** Tighter tracking is applied to display styles for a more modern, "locked-in" feel.
- **Accessibility:** Minimum body text size is 16px. Label styles use medium or semi-bold weights to maintain readability against dark backgrounds.

## Layout & Spacing
The layout relies on a **4px base grid** to ensure mathematical consistency across all components.

- **Grid System:** A 12-column fluid grid is used for desktop layouts, transitioning to a 4-column grid on mobile devices.
- **Margins:** Desktop views use a generous 40px (2.5rem) margin, while mobile views use 16px (1rem) to maximize screen real estate.
- **Gaps:** Use `gap-md` (16px) for standard component spacing and `gap-lg` (32px) for section-level separation.

## Elevation & Depth
In this dark-mode-first system, depth is communicated through **Tonal Layering** and **Glassmorphism** rather than traditional heavy shadows.

- **Surface Levels:** 
  - Level 0: Base background (#020617).
  - Level 1: Sidebar/Nav containers (#0f172a).
  - Level 2: Cards and modals (#1e293b).
- **Glass Effects:** Modals and dropdowns utilize a `backdrop-filter: blur(12px)` with a semi-transparent border (1px white at 10% opacity) to simulate physical glass overlays.
- **Shadows:** Use extremely subtle, tinted shadows (Primary color at 5% opacity) for high-elevation components like floating action buttons or active AI prompt boxes.

## Shapes
The shape language is structured and professional.
- **SM (4px):** Used for small interactive elements like checkboxes, radio buttons, and tooltips.
- **MD (8px):** The standard radius for buttons, input fields, and small cards.
- **XL (16px):** Reserved for large containers, dashboard widgets, and main AI interaction panels.

## Components
Consistent implementation details for the core component library:

- **Buttons:**
  - **Primary:** Solid Cyan background, black text for high contrast. 8px radius.
  - **Ghost:** Transparent background with Cyan border. 1px solid.
- **AI Prompt Boxes:** High-visibility components using the XL radius (16px). They should feature a subtle gradient border transition (Cyan to Purple) during "thinking" states.
- **Data Tables:** Borderless design with alternating row highlights (Surface Elevated). Headers must be sticky with a glassmorphic blur effect.
- **Charts:** Use the Primary (Cyan) and Secondary (Purple) colors for data series. Grid lines should be low-contrast (Slate 800).
- **Modals:** Center-aligned with a dark backdrop (70% opacity). Transitions use `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Inputs:** Dark slate backgrounds with 1px borders. Focus state triggers a 2px Cyan outline with a soft outer glow.

### Motion & Transitions
Use the following cubic-beziers for CSS transitions:
- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)` (300ms) - for most UI movements.
- **Entrance:** `cubic-bezier(0, 0, 0.2, 1)` (250ms) - for modals and fly-ins.
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)` (200ms) - for closing elements.
- **AI Pulse:** A slow scale and opacity oscillation (2000ms) for background processing states.