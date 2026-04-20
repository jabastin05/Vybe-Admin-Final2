**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design System Guidelines: "Glass-Data" Framework
**Inspired by Ron Design Lab**

This document serves as the technical specification for building a high-density, glassmorphic UI kit in Figma. It prioritizes spatial depth, data clarity, and "soft-tech" aesthetics.

---

## 1. Foundation & Variables

### 🎨 Color Palette
| Category | Variable Name | Hex Code | Opacity | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Neutral** | `sys-bg-canvas` | `#F2F2F2` | 100% | Main background |
| **Surface** | `sys-bg-glass` | `#FFFFFF` | 85-95% | Card/Module backgrounds |
| **Primary** | `sys-accent-gold` | `#FFC700` | 100% | Real Estate / Solar themes |
| **Primary** | `sys-accent-green` | `#28FF6E` | 100% | Logistics / Success states |
| **Text** | `sys-text-high` | `#1A1A1A` | 100% | Headings and primary data |
| **Text** | `sys-text-low` | `#8E8E93` | 100% | Labels, units, and timestamps |

### 📐 Spacing & Radius
- **Base Unit:** 8px
- **Radius Lg:** 24px (Main Cards)
- **Radius Md:** 12px (Inner Modules/Buttons)
- **Radius Sm:** 4px (Tags/Data Indicators)

---

## 2. Typography Styles
*Font Suggestion: Inter, Plus Jakarta Sans, or Geist.*

| Style Name | Size/Weight | Letter Spacing | Case |
| :--- | :--- | :--- | :--- |
| **Display/Data** | 32px / Bold | -2% | Sentence |
| **Heading/H1** | 24px / Regular | -1% | Sentence |
| **Body/Main** | 14px / Regular | 0% | Sentence |
| **Label/Micro** | 10px / Bold | +5% | ALL CAPS |
| **Mono/Data** | 12px / Medium | 0% | N/A |

---

## 3. Visual Effects (Figma Styles)

### ✨ Glassmorphism Effect
- **Background Blur:** 20px - 40px.
- **Stroke:** 1px Inside, `rgba(255, 255, 255, 0.4)` (Top) to `rgba(0, 0, 0, 0.05)` (Bottom).

### 🌑 Shadow Stack (Layered)
- **Drop Shadow 1:** Y: 2, Blur: 4, Spread: 0, Color: `rgba(0,0,0, 0.02)`.
- **Drop Shadow 2:** Y: 20, Blur: 40, Spread: -5, Color: `rgba(0,0,0, 0.05)`.

---

## 4. Component Spec: Property Revenue Chart

### Structure
1.  **Header Row:**
    * Title: `Body/Main` (Semibold).
    * Segmented Picker: Text-only links with a 2px "active" underline.
2.  **Chart Canvas:**
    * **Background:** 4x horizontal grid lines (0.5px thickness).
    * **Bars:** Fixed width (16px), 4px top-radius.
    * **Ghost Bars:** Background fill `#F0F0F0` at 10% to show potential/max capacity.
3.  **The "Current" Indicator:**
    * **Vertical Line:** 1px dashed `sys-text-low`.
    * **Tooltip:** Pill shape, `sys-accent-green` fill, white `Label/Micro` text.
4.  **X-Axis:**
    * Auto-layout row, `Label/Micro` text, centered under bars.

---

## 5. UI Elements & Layout

### 🛰️ Side Navigation Rail
- **Width:** 72px.
- **Blur:** 30px Background Blur.
- **Active State:** Soft circular glow behind icon (10% opacity of accent color).

### 🏷️ Status Badges
- **Shape:** Pill.
- **Style:** "Soft Tint" (e.g., Green text on 10% Green background).
- **Detail:** Include a 1px upward/downward arrow for MOM (Month-over-Month) changes.

---

## 6. Iconography
- **Weight:** 2px Stroke.
- **Style:** Geometric, non-fill (Outline).
- **Active State:** Switches to "Solid" or gains an outer "Soft Glow."

---

## 7. Imagery & 3D Specs
- **Masking:** Always use `Radius Lg` for image containers.
- **Overlay:** Apply a 10% linear gradient from the bottom to ensure white text remains legible over images.
- **Detailing:** Use thin "leader lines" (1px solid) to connect data tooltips to specific points on 3D building/cargo renders.

---
**Next Step:** Would you like me
