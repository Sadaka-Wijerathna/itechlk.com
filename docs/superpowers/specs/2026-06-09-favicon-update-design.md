# Design Spec: Website Favicon Update

**Date:** 2026-06-09
**Topic:** Website Favicon and Manifest Update
**Status:** Approved

## Goal
Update the website's favicon, apple-touch icons, and web manifest using a set of provided images in the `public/` directory.

## Implementation Details

### 1. Cleanup & File Organization
- **Delete** `src/app/favicon.ico`: Remove the default Next.js App Router favicon to avoid conflicts with the new files in `public/`.
- **Merge Manifests**: Merge the icons and settings from `public/site.webmanifest` into the existing `public/manifest.json`.
- **Delete** `public/site.webmanifest`: Once merged, delete the original generator file.

### 2. Manifest Merging Strategy
Update `public/manifest.json` to include:
- `android-chrome-192x192.png` (192x192)
- `android-chrome-512x512.png` (512x512)
- Ensure `name`, `short_name`, and `theme_color` match the application branding.

### 3. Layout Metadata Update
Update `src/app/layout.tsx` `metadata` object:
```typescript
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
```

## Success Criteria
- Favicons display correctly across different browsers (Chrome, Safari, Firefox).
- The Apple touch icon is correctly set for iOS devices.
- The web app manifest is valid and includes the correct high-resolution icons.
- No duplicate or conflicting favicon files remain in the repository.
