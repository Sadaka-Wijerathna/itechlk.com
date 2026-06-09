# Website Favicon Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up old favicon files, merge the new web manifest, and update the Next.js metadata to use the new icons.

**Architecture:** Use the `public/` directory for all favicon assets and the explicit `Metadata` API in `layout.tsx` for cross-device compatibility.

**Tech Stack:** Next.js (App Router), Metadata API.

---

### Task 1: Cleanup of default favicon
**Files:**
- Modify: `src/app/favicon.ico` (Delete)

- [ ] **Step 1: Delete the default favicon**
  Run: `rm "d:\Web Projects\outstock_ecommerce_react_next_js_template_2026_04_02_08_36_45_ut\outstock-nextjs\src\app\favicon.ico"`

- [ ] **Step 2: Commit cleanup**
  ```bash
  git add .
  git commit -m "chore: remove default app router favicon to prevent conflicts"
  ```

### Task 2: Manifest Consolidation
**Files:**
- Modify: `public/manifest.json`
- Delete: `public/site.webmanifest`

- [ ] **Step 1: Update `manifest.json` with new icons**
  Update `public/manifest.json` to include the high-resolution icons from `site.webmanifest`.
```json
{
  "name": "ITechLK Store",
  "short_name": "ITechLK",
  "description": "Premium digital subscriptions in Sri Lanka — AI Tools, Streaming, VPNs, Creative Software and more.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#D55433",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "48x48",
      "type": "image/x-icon"
    },
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["shopping", "business"],
  "lang": "en-LK",
  "scope": "/"
}
```

- [ ] **Step 2: Delete `site.webmanifest`**
  Run: `rm "d:\Web Projects\outstock_ecommerce_react_next_js_template_2026_04_02_08_36_45_ut\outstock-nextjs\public\site.webmanifest"`

- [ ] **Step 3: Commit manifest changes**
  ```bash
  git add public/manifest.json
  git commit -m "feat: update manifest with high-res icons"
  ```

### Task 3: Metadata Integration
**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update `metadata.icons` in `layout.tsx`**
  Modify the `metadata` object to point to the specific PNG favicons and apple touch icon.
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  // ... existing fields
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  // ...
};
```

- [ ] **Step 2: Run build check**
  Run: `npm run build` (optional, to verify no syntax errors)

- [ ] **Step 3: Commit layout changes**
  ```bash
  git add src/app/layout.tsx
  git commit -m "feat: integrate specialized favicons in layout metadata"
  ```
