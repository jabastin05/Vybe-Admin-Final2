# VYBE Typography Consistency Audit

## ✅ Updated Screens (Following Design System)

### 1. CaseDetail.tsx ✅
- Page Label: `text-[10px] tracking-[0.05em] uppercase font-bold`
- Page Title: `text-[32px] tracking-tight`  
- Badge Text: `text-[11px] font-medium`
- Section Headers: `text-[12px] uppercase tracking-wider`
- Status Badge: `text-[14px] font-medium`
- Data Display: `text-[32px] tracking-tight font-semibold`

### 2. CaseManagement.tsx ✅
- Page Label: `text-[10px] tracking-[0.05em] uppercase font-bold`
- Page Title: `text-[32px] tracking-tight`
- Body Text: `text-[14px]`
- Stats/Data: `text-[32px] tracking-tight`
- Section Text: `text-[12px] uppercase tracking-wide`
- Badge: `text-[12px] font-medium`

### 3. Settings.tsx ✅
- Page Label: `text-[12px] tracking-wider uppercase`
- Page Title: `text-[32px] tracking-tight`
- Section Headers (H2): Already using `text-[24px]` - **NEEDS UPDATE**
- Data Display: `text-[32px] tracking-tight font-light`

## 🔧 Screens Needing Updates

### High Priority
1. **Dashboard.tsx** - Multiple inconsistencies (text-[40px], text-[48px])
2. **ServiceManagement.tsx** - Uses text-[40px] for case ID
3. **HABUReport.tsx** - Uses text-[24px] for H2 headers
4. **ExecutionDashboard.tsx** - Consistent but needs verification
5. **PropertyDetail.tsx** - Needs full audit

### Medium Priority  
6. **MarketIntelligence.tsx**
7. **ExecutionTracker.tsx**
8. **Landing.tsx** (Marketing page - may have different rules)

## 📏 Standardized Typography Scale

### Page Level
```tsx
// Page Label (above title)
className="text-[10px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40"

// Page Title (H1)
className="text-[32px] tracking-tight text-black dark:text-white"

// Page Subtitle/Description  
className="text-[14px] text-black/60 dark:text-white/60"
```

### Section Level
```tsx
// Section Header (H2) - **RECOMMENDED CHANGE**
className="text-[12px] uppercase tracking-wider text-black/40 dark:text-white/40"
// OR for prominent sections:
className="text-[24px] text-black dark:text-white"
```

### Component Level
```tsx
// Card Header (H3)
className="text-[14px] font-medium text-black dark:text-white"

// Card Subheader/Label
className="text-[12px] text-black/40 dark:text-white/40"
```

### Data & Numbers
```tsx
// Large Data Display
className="text-[32px] tracking-tight font-semibold text-black dark:text-white"

// Medium Data
className="text-[18px] font-medium text-black dark:text-white"

// Small Data
className="text-[14px] font-medium text-black dark:text-white"
```

### Text & Labels
```tsx
// Body Text
className="text-[14px] text-black dark:text-white"

// Secondary Text
className="text-[13px] text-black/60 dark:text-white/60"

// Caption/Helper Text
className="text-[12px] text-black/40 dark:text-white/40"

// Micro Label (uppercase)
className="text-[10px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40"
```

### Badges & Status
```tsx
// Badge
className="text-[11px] font-medium"

// Status Indicator
className="text-[13px] font-medium"
```

## 🎨 Glass-Data Framework Compliance

### From Guidelines.md:
- **Display/Data**: 32px / Bold / -2% tracking ✅
- **Heading/H1**: 24px / Regular / -1% tracking ⚠️ (Using 32px instead)
- **Body/Main**: 14px / Regular / 0% tracking ✅  
- **Label/Micro**: 10px / Bold / +5% tracking / ALL CAPS ✅
- **Mono/Data**: 12px / Medium / 0% tracking ✅

### Design Decision:
We're using **32px for page titles** instead of the guideline's 24px to create better hierarchy and prominence for main page headers. Section headers use 12px uppercase labels for consistency with the "soft-tech" aesthetic.

## 🚀 Next Steps

1. Update Settings.tsx H2 headers from text-[24px] to text-[12px] uppercase or keep as accent headers
2. Update Dashboard.tsx hero section
3. Update ServiceManagement.tsx case ID display
4. Create reusable typography components for consistency
5. Add ESLint rules to enforce typography standards

## 💡 Recommendations

### Option A: Strict Glass-Data (Recommended)
- Page Title: 32px (Display/Data)
- Section Header: 12px uppercase (Label/Micro)
- Card Header: 14px medium (Body/Main semibold)

### Option B: Hybrid Approach
- Page Title: 32px
- Major Section Header (H2): 24px (Heading/H1 from guidelines)
- Minor Section Header: 12px uppercase
- Card Header: 14px medium

**Current Implementation**: Using Option A across CaseDetail and CaseManagement for maximum consistency.
