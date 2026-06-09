# Admin UI Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize the `order__info` container styles across admin pages.

**Architecture:** Apply inline styles to match `/admin/products`.

**Tech Stack:** React, Next.js.

---

### Task 1: Update Orders Page
**Files:**
- Modify: `src/app/admin/orders/page.tsx:86`

- [ ] **Step 1: Apply style to `order__info`**
```tsx
// src/app/admin/orders/page.tsx
<div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
```

- [ ] **Step 2: Commit changes**
```bash
git add src/app/admin/orders/page.tsx
git commit -m "style: add consistent padding and border to orders page container"
```

### Task 2: Update Users Page
**Files:**
- Modify: `src/app/admin/users/page.tsx:12`

- [ ] **Step 1: Apply style to `order__info`**
```tsx
// src/app/admin/users/page.tsx
<div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
```

- [ ] **Step 2: Commit changes**
```bash
git add src/app/admin/users/page.tsx
git commit -m "style: add consistent padding and border to users page container"
```
