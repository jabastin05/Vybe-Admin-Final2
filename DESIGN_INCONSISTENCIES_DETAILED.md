# Design Inconsistencies - Detailed Audit

## 🔴 Critical Inconsistencies Found

### 1. CTA Button Colors (PRIMARY ISSUE)

#### Current State:
- **Emerald CTA**: `bg-emerald-500 hover:bg-emerald-400`
  - Used in: SideNav, Dashboard "Add Property", CaseManagement
- **Black/White CTA**: `bg-black dark:bg-white text-white dark:text-black`
  - Used in: Dashboard "Request Services", MarketIntelligence
- **Mixed Usage**: No clear pattern

#### Recommended Fix:
**Primary CTA (Main Actions)**: Use Emerald-500 (brand color)
- Add Property
- Request Service
- Upload Property
- Submit forms

**Secondary CTA (Navigation/View)**: Use Black/White
- View Details
- Back buttons
- Secondary actions

---

### 2. Card Border Radius (HIGH PRIORITY)

#### Current Inconsistencies:
- `rounded-2xl` (16px) - Most cards
- `rounded-lg` (8px) - ExecutionDashboard stats cards
- `rounded-xl` (12px) - Some buttons/cards
- `rounded-[24px]` (24px) - PropertyDetail cards
- `rounded-[32px]` (32px) - Dashboard hero section

#### Glass-Data Framework Says:
- **Radius Lg**: 24px (Main Cards)
- **Radius Md**: 12px (Inner Modules/Buttons)
- **Radius Sm**: 4px (Tags/Data Indicators)

#### Recommended Standard:
- **Main Cards**: `rounded-3xl` (24px) - All property cards, service cards
- **Small Cards/Modules**: `rounded-2xl` (16px) - Stats cards, sub-sections
- **Buttons**: `rounded-xl` (12px) - All CTAs
- **Badges/Tags**: `rounded-lg` (8px) - Status badges
- **Small Pills**: `rounded-full` - Notification dots

---

### 3. Card Padding (MEDIUM PRIORITY)

#### Current Inconsistencies:
- `p-6` - ExecutionDashboard cards, CaseManagement cards
- `p-8` - PropertyDetail cards, most main cards
- `p-16` - Dashboard hero section

#### Recommended Standard:
- **Main Cards**: `p-8` (32px) - Property cards, service cards
- **Small Cards**: `p-6` (24px) - Stats cards, quick info cards
- **Hero Sections**: `p-12` or `p-16` (48-64px) - Landing sections only

---

### 4. Font Weight Hierarchy (HIGH PRIORITY)

#### Current Inconsistencies:
- Page titles: Mix of `font-bold` and no weight
- Section headers: Mix of `font-semibold`, `font-medium`, `font-bold`
- Body text: Mix of no weight and `font-medium`
- Data/Numbers: Mix of `font-semibold`, `font-bold`, `font-light`

#### Recommended Standard:
```tsx
// Headers
Page Title (H1): font-semibold  // text-[32px] font-semibold
Section Header (H2): (no weight) // text-[24px] - let default apply
Card Header (H3): font-medium    // text-[18px] font-medium OR text-[14px] font-medium

// Data
Large Data: font-semibold        // text-[32px] font-semibold
Medium Data: font-medium         // text-[18px] font-medium

// Text
Body: (no weight)                // text-[14px] - default
Labels: font-bold                // text-[10px] font-bold uppercase
Badges: font-medium              // text-[11px] font-medium

// Special
Emphasis: font-medium
Strong: font-semibold
Hero: font-bold (only in marketing)
```

---

### 5. Header Section Layout (MEDIUM PRIORITY)

#### Current Inconsistencies:

**CaseDetail.tsx**:
```tsx
<Link className="inline-flex items-center gap-2 text-[14px]...">
  <ArrowLeft className="w-4 h-4" />
  Back to Case Management
</Link>
```

**PropertyDetail.tsx**:
```tsx
<Link className="inline-flex items-center gap-2.5...">
  <ArrowLeft className="w-4 h-4" />
</Link>
```

**Different gaps, different text, different styling**

#### Recommended Standard:
```tsx
// Standard Back Button
<Link 
  to="/back-route"
  className="inline-flex items-center gap-2 text-[14px] text-black/60 dark:text-white/60 
             hover:text-black dark:hover:text-white transition-colors mb-6"
>
  <ArrowLeft className="w-4 h-4" />
  Back to [Page Name]
</Link>

// Standard Page Header
<div className="mb-8">
  <div className="text-[10px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40 mb-2">
    [Section Label]
  </div>
  <h1 className="text-[32px] tracking-tight font-semibold text-black dark:text-white leading-none">
    [Page Title]
  </h1>
</div>
```

---

### 6. Status Badge Styling (LOW PRIORITY)

#### Current Inconsistencies:
- Different padding: `px-3 py-1.5`, `px-4 py-2`
- Different border radius: `rounded-lg`, `rounded-md`, `rounded-xl`
- Different font sizes: `text-[11px]`, `text-[12px]`, `text-[13px]`

#### Recommended Standard:
```tsx
// Standard Status Badge
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-medium">
  <Icon className="w-3.5 h-3.5" />
  Status Text
</div>
```

---

## 🎯 Priority Fix List

### Phase 1 (Critical - Do Now):
1. ✅ Standardize all CTA button colors (Emerald for primary, Black/White for secondary)
2. ✅ Fix all card border radius to follow Glass-Data (24px main, 16px stats, 12px buttons)
3. ✅ Standardize font weights across all headers and data

### Phase 2 (High - Do Next):
4. ✅ Standardize all header section layouts (back button + page title)
5. ✅ Fix card padding consistency
6. ✅ Standardize status badges

### Phase 3 (Polish - Do Last):
7. Create reusable components for common patterns
8. Add Storybook for design system
9. ESLint rules to prevent future inconsistencies
