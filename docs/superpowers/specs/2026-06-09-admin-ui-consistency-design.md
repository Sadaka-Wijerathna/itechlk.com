# Design Spec: Admin UI Consistency (Order Info Container)

**Date:** 2026-06-09
**Topic:** UI Consistency for Admin Dashboard
**Status:** Approved

## Goal
Ensure the main content containers in `/admin/orders` and `/admin/users` match the visual style of `/admin/products`.

## Implementation Details
The `order__info` div in the following files will be updated to include consistent inline styling:
`style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}`

### Target Files
1. `src/app/admin/orders/page.tsx`
2. `src/app/admin/users/page.tsx`

## Success Criteria
- Both pages have a white background, 25px padding, and a light border around the main table area.
- The UI feels consistent across all admin tabs.
