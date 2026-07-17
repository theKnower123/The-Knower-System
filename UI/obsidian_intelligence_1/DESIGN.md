---
name: Obsidian Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#b9caca'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#44e2cd'
  on-secondary: '#003731'
  secondary-container: '#03c6b2'
  on-secondary-container: '#004d44'
  tertiary: '#fff8fd'
  on-tertiary: '#490080'
  tertiary-container: '#edd4ff'
  on-tertiary-container: '#872fd5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  obsidian-base: '#020617'
  obsidian-surface: '#0F172A'
  obsidian-elevated: '#1E293B'
  success-emerald: '#10B981'
  warning-amber: '#F59E0B'
  error-rose: '#F43F5E'
  info-cyan: '#06B6D4'
  ai-purple: '#A855F7'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for **The Knower OS**, a premium enterprise environment that prioritizes security, speed, and analytical depth. The visual identity sits at the intersection of **Minimalism** and **Glassmorphism**, leveraging the "developer-first" aesthetics of platforms like Linear and Vercel.

The personality is authoritative yet unobtrusive. It evokes a sense of "quiet power" through deep obsidian backgrounds, precision-engineered borders, and sophisticated motion. The interface should feel like a high-performance tool—logical, high-density, and devoid of unnecessary decoration. 

Key attributes:
- **Professional:** Rigid adherence to grid systems and alignment.
- **Secure:** Solid shapes and protective "container-within-container" structures.
- **Fast:** Reduced visual weight and high-contrast text for rapid scanning.
- **Minimal:** Color is used functionally to denote action, status, or AI-driven insights.

## Colors

This design system utilizes a **Dark Mode First** approach. The palette is anchored by "Obsidian" neutrals—deep, desaturated slates that provide the necessary contrast for high-density data.

- **Primary Action:** Bright Cyan (`#00F5FF`) is used exclusively for primary calls to action and active states.
- **Accents:** Teal (`#2DD4BF`) serves as a secondary brand touchpoint, often used for highlighting or subtle decorative elements.
- **Intelligence:** A sophisticated Purple (`#A855F7`) is reserved strictly for AI-enhanced features, insights, and predictive UI components.
- **Functional States:** Standardized semantic colors (Emerald, Amber, Rose, Cyan) ensure immediate recognition of system status.

For the Light Mode variant, the obsidian neutrals transition to high-clarity grays (`#F8FAFC`), while primary and functional colors retain their hue but adjust in saturation for legibility.

## Typography

The typography system is built on **Inter**, a typeface designed for screen legibility and high-density information. To reinforce the "OS" and developer-centric feel, **JetBrains Mono** is used for labels, metadata, and code snippets.

- **Scale:** A strict typographic scale ensures vertical rhythm. Headlines use tighter tracking (letter-spacing) to feel more cohesive at large sizes.
- **Weight:** Use `Medium (500)` and `SemiBold (600)` for emphasis. Reserve `Bold (700)` only for Display levels.
- **Monospace Integration:** All data-heavy values, timestamps, and system labels must use the `label` roles to distinguish "data" from "narrative" text.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile.

- **Rhythm:** A 4px base unit governs all spacing. Padding and margins should always be multiples of this unit (8px, 16px, 24px, etc.).
- **Density:** Information density is high, but balanced by generous outer margins. Inside cards and modules, use tighter 12px or 16px internal padding.
- **Breakpoints:**
  - **Mobile:** < 768px (16px margins)
  - **Tablet:** 768px - 1280px (32px margins)
  - **Desktop:** > 1280px (64px margins, 1440px max-width container)

## Elevation & Depth

Visual hierarchy in this design system is achieved through **Tonal Layering** and **Subtle Glassmorphism**.

1.  **Level 0 (Base):** Obsidian-base (`#020617`). The canvas.
2.  **Level 1 (Surface):** Obsidian-surface (`#0F172A`). Used for primary content containers and cards.
3.  **Level 2 (Elevated):** Obsidian-elevated (`#1E293B`). Used for hover states and secondary UI elements.
4.  **Overlays:** Modal backdrops and dropdowns use a 70% opacity blur (12px - 20px) to maintain context of the underlying data.

**Shadows:** Use extremely soft, high-spread shadows. Shadow color should be a tinted black (`hsla(222, 47%, 2%, 0.5)`). Avoid harsh, dark shadows that break the minimal aesthetic.

## Shapes

The shape language is sophisticated and modern. A standard **16px (1rem)** radius is applied to all primary cards and large containers to soften the technical nature of the OS.

- **Small Components:** Buttons, inputs, and tags use a **6px - 8px** radius to maintain a crisp, functional appearance.
- **Consistency:** Never mix sharp corners with rounded corners within the same component hierarchy.

## Components

### Buttons
- **Primary:** Solid Cyan (`#00F5FF`) with dark text. High contrast, reserved for the main action.
- **Secondary:** Transparent background with a subtle slate border. White text.
- **AI Action:** Gradient border or background using the AI Purple. Subtle glow on hover.

### Input Fields
- Dark, recessed background (`#020617`) with a 1px slate border.
- On focus: Border transitions to Cyan with a subtle 2px outer glow (0.2 opacity).
- Labels: Always use `label-sm` (Monospace) above the field.

### Cards
- **Border:** 1px solid slate (`#1E293B`) to define edges against the dark background.
- **Radius:** 16px.
- **Header:** Separate the card header with a subtle horizontal rule or a slightly different tonal background.

### Data Visualization
- High-contrast lines and bars using the primary, secondary, and status colors.
- Use semi-transparent fills for area charts to maintain the glassmorphism aesthetic.
- Grid lines in charts should be barely visible (`#1E293B` at 0.5 opacity).

### Chips & Tags
- Pill-shaped with small monospace text.
- Use background tints of status colors (e.g., 10% Emerald background with 100% Emerald text).