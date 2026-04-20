# VYBE Design System - Typography & Layout Standards

## Typography Hierarchy

Based on the Glass-Data Framework from Guidelines.md

### Page Level
- **Page Label**: `text-[10px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40`
- **Page Title**: `text-[32px] tracking-tight text-black dark:text-white`
- **Page Subtitle**: `text-[14px] text-black/60 dark:text-white/60`

### Section Level
- **Section Header (H2)**: `text-[24px] text-black dark:text-white`
- **Section Label**: `text-[12px] uppercase tracking-wider text-black/40 dark:text-white/40`

### Component Level
- **Card Header (H3)**: `text-[14px] font-medium text-black dark:text-white`
- **Card Subheader**: `text-[12px] text-black/40 dark:text-white/40`

### Data Display
- **Large Data**: `text-[32px] tracking-tight font-semibold text-black dark:text-white`
- **Medium Data**: `text-[18px] font-medium text-black dark:text-white`
- **Small Data**: `text-[14px] font-medium text-black dark:text-white`

### Body & Labels
- **Body Text**: `text-[14px] text-black dark:text-white`
- **Secondary Text**: `text-[13px] text-black/60 dark:text-white/60`
- **Caption**: `text-[12px] text-black/40 dark:text-white/40`
- **Micro Label**: `text-[10px] tracking-[0.05em] uppercase font-bold`

### Badges & Status
- **Badge Text**: `text-[11px] font-medium`
- **Status Text**: `text-[13px] font-medium`

## Spacing Standards
- **Page Padding**: `pt-8 pb-24 px-8`
- **Container**: `max-w-7xl mx-auto`
- **Section Margin Bottom**: `mb-8`
- **Card Padding**: `p-8`
- **Card Gap**: `gap-6`

## Border Radius Standards
- **Cards/Containers**: `rounded-2xl` (24px - Radius Lg from guidelines)
- **Buttons/Inner Elements**: `rounded-xl` or `rounded-lg` (12px - Radius Md)
- **Badges/Tags**: `rounded-lg` (4px - Radius Sm)

## Border Standards
- **Card Border**: `border border-black/5 dark:border-white/5`
- **Glass Effect Border**: `border border-black/10 dark:border-white/10`

## Background Standards
- **Page Background**: `bg-[#F2F2F2] dark:bg-[#0F0F0F]`
- **Card Background**: `bg-white dark:bg-[#111111]`
- **Secondary Card**: `bg-black/5 dark:bg-white/5`

## Common Patterns

### Page Header
```tsx
<div className="mb-8">
  <div className="text-[10px] tracking-[0.05em] uppercase font-bold text-black/40 dark:text-white/40 mb-2">
    {label}
  </div>
  <h1 className="text-[32px] tracking-tight text-black dark:text-white leading-none">
    {title}
  </h1>
</div>
```

### Section Header
```tsx
<h2 className="text-[12px] uppercase tracking-wider text-black/40 dark:text-white/40 mb-6">
  {title}
</h2>
```

### Card Header
```tsx
<h3 className="text-[14px] font-medium text-black dark:text-white mb-4">
  {title}
</h3>
```

### Data Display
```tsx
<div>
  <div className="text-[12px] text-black/40 dark:text-white/40 mb-1">{label}</div>
  <div className="text-[32px] tracking-tight font-semibold text-black dark:text-white">{value}</div>
</div>
```
