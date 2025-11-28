# Production Fix Summary
**Date**: 2025-11-17
**Issue**: `/saju` route returning 404 in production deployment

---

## Problem Analysis

### Root Cause
The `/saju` page and related pages were using `fetch()` calls with `NEXT_PUBLIC_APP_URL` environment variable during server-side rendering. This variable was not set in Vercel production environment, causing fetches to fail to `http://localhost:3000` which doesn't exist in production.

### Affected Files
1. `app/saju/page.tsx` - Main saju listing page
2. `app/saju/[categorySlug]/page.tsx` - Category page
3. `app/saju/[categorySlug]/[contentSlug]/page.tsx` - Content detail page

### Error Symptoms
- E2E tests showed 404 errors on `/saju` route
- Page would show "페이지를 찾을 수 없습니다" message
- 25 out of 29 E2E tests failing
- Page loading timeouts (30+ seconds)

---

## Solution Implemented

### 1. Direct Database Access (app/saju/page.tsx)
**Change**: Replaced `fetch()` API call with direct Prisma database query

**Before**:
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/saju-categories?limit=100`,
  { next: { revalidate: 300 } }
);
```

**After**:
```typescript
const dbCategories = await prisma.sajuCategory.findMany({
  where: { isActive: true },
  select: {
    id: true,
    name: true,
    slug: true,
    // ... other fields
  },
  orderBy: { order: 'asc' },
});
```

**Benefits**:
- No network dependency during SSR
- Faster page rendering (no HTTP roundtrip)
- Works in all environments without configuration
- Added ISR caching with `export const revalidate = 300`

### 2. getBaseUrl() Utility Function (lib/utils.ts)
**Change**: Created utility to properly detect base URL in all environments

```typescript
export function getBaseUrl(): string {
  // In browser, use relative URLs
  if (typeof window !== 'undefined') {
    return '';
  }

  // In server-side rendering, use environment variable or Vercel URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to localhost for development
  return 'http://localhost:3000';
}
```

**Key Features**:
- Automatically detects `VERCEL_URL` (set by Vercel automatically)
- Falls back to `NEXT_PUBLIC_APP_URL` if set
- Uses relative URLs in browser context
- Works correctly in development, preview, and production

### 3. Updated Category and Content Pages
**Change**: Both pages now use `getBaseUrl()` for API calls

```typescript
import { getBaseUrl } from '@/lib/utils';

// In component
const baseUrl = getBaseUrl();
const response = await fetch(
  `${baseUrl}/api/saju/categories/${categorySlug}`,
  { next: { revalidate: 60 } }
);
```

---

## Files Modified

### Core Changes
1. **lib/utils.ts**
   - Added `getBaseUrl()` function
   - Lines: +21 lines

2. **app/saju/page.tsx**
   - Replaced fetch with Prisma query
   - Added type mapping (null → undefined)
   - Added ISR revalidation
   - Lines: +20, -5

3. **app/saju/[categorySlug]/page.tsx**
   - Updated to use `getBaseUrl()`
   - Lines: +3, -2

4. **app/saju/[categorySlug]/[contentSlug]/page.tsx**
   - Updated to use `getBaseUrl()`
   - Lines: +4, -2

---

## Verification Steps

### Local Build Test
```bash
cd sajuwooju-enterprise
npm run build
```

**Result**: ✅ Build successful
```
├ ○ /saju                                       5m      1y
├ ƒ /saju/[categorySlug]
├ ƒ /saju/[categorySlug]/[contentSlug]
```

### Type Safety
**Result**: ✅ No TypeScript errors
- Fixed type compatibility issue (null vs undefined)
- All routes compile successfully

---

## Deployment Instructions

### 1. Push to GitHub
```bash
cd sajuwooju-enterprise
git push origin main
```

### 2. Vercel Automatic Deployment
Vercel will automatically:
- Detect the push to main branch
- Trigger new production build
- Deploy to: https://sajuwooju-enterprise-mpyih11cm-kevinglecs-projects.vercel.app

### 3. Environment Variables (Optional)
While not required (Vercel sets `VERCEL_URL` automatically), you can optionally set:

```env
NEXT_PUBLIC_APP_URL=https://sajuwooju-enterprise-mpyih11cm-kevinglecs-projects.vercel.app
```

**Note**: The `getBaseUrl()` utility works without this variable in Vercel.

### 4. Post-Deployment Verification
After deployment completes, verify:

1. **Health Check**:
   ```bash
   curl https://sajuwooju-enterprise-mpyih11cm-kevinglecs-projects.vercel.app/api/health
   ```
   Expected: `{ "status": "ok", "timestamp": "..." }`

2. **/saju Route**:
   ```bash
   curl https://sajuwooju-enterprise-mpyih11cm-kevinglecs-projects.vercel.app/saju
   ```
   Expected: 200 OK with HTML content

3. **Rerun E2E Tests**:
   ```bash
   cd sajuwooju-enterprise
   npx playwright test tests/e2e/production-full-test.spec.ts
   ```
   Expected: >80% pass rate (vs previous 13.8%)

---

## Expected Test Results After Fix

### Before Fix
- **Passed**: 4/29 (13.8%)
- **Failed**: 25/29 (86.2%)
- **Main Issue**: `/saju` route 404 errors

### After Fix (Expected)
- **Passed**: ~25/29 (>85%)
- **Failed**: <5 tests (unrelated issues like admin form selectors)
- **Main Issue**: Resolved ✅

### Tests Expected to Pass
1. ✅ All `/saju` route tests (main page, category, content)
2. ✅ All page navigation tests
3. ✅ SEO meta tag tests
4. ✅ Responsive design tests
5. ✅ Performance tests

### Tests Still Requiring Work
1. ❌ Admin login form tests (selector mismatch)
2. ❌ Some API endpoint tests (may need auth)

---

## Technical Details

### Why Direct Prisma Access?
The main `/saju` page doesn't need the API layer because:
1. **Simplicity**: Just fetching active categories
2. **Performance**: Eliminates HTTP roundtrip
3. **Reliability**: No network dependency
4. **Caching**: ISR with `revalidate = 300` (5 minutes)

### Why Keep API Calls for Other Pages?
Category and content pages use existing APIs because:
1. **Complexity**: APIs handle pagination, filtering, related content
2. **Consistency**: Use the same logic as other consumers
3. **Flexibility**: Easy to switch to external CMS later
4. **Type Safety**: APIs return properly typed responses

### ISR (Incremental Static Regeneration)
```typescript
export const revalidate = 300; // Revalidate every 5 minutes
```

Benefits:
- Static page generation for speed
- Automatic updates every 5 minutes
- On-demand revalidation on first request after TTL

---

## Performance Impact

### Before Fix
- Page Load: Failed (404)
- Time to First Byte: N/A (error)
- Total Page Load: N/A (error)

### After Fix (Expected)
- Page Load: ✅ Success
- Time to First Byte: <500ms (direct DB query)
- Total Page Load: <2s (Next.js ISR)
- Build Time: ~90 routes in 30s

---

## Rollback Plan

If deployment fails, rollback steps:

1. **Revert Git Commit**:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Vercel Manual Rollback**:
   - Go to Vercel Dashboard
   - Select "Deployments"
   - Find previous working deployment
   - Click "Promote to Production"

3. **Emergency Fix**:
   Set environment variable in Vercel:
   ```
   NEXT_PUBLIC_APP_URL=https://[your-domain].vercel.app
   ```
   Then redeploy.

---

## Lessons Learned

1. **Environment Variables**: Always check which env vars are auto-set by platform
   - Vercel sets: `VERCEL_URL`, `VERCEL_ENV`
   - Use these instead of custom vars when possible

2. **SSR Fetch Calls**: Be cautious with fetch in server components
   - Consider direct DB access for simple queries
   - Use utility functions to handle environment detection

3. **Testing**: E2E tests caught this issue immediately
   - Production URL testing is critical
   - Don't rely solely on localhost tests

4. **Type Safety**: Prisma returns `null`, TypeScript expects `undefined`
   - Always map database types to interface types
   - Use nullish coalescing (`??`) for conversions

---

## Next Steps

1. ✅ **Commit Fix**: Completed
2. ⏳ **Push to GitHub**: Ready to execute
3. ⏳ **Vercel Auto-Deploy**: Will trigger on push
4. ⏳ **Verify Deployment**: Test /saju route
5. ⏳ **Rerun E2E Tests**: Verify fix success
6. ⏳ **Fix Admin Form Tests**: Update selectors
7. ⏳ **Document Final Results**: Update test report

---

## Summary

**Problem**: `/saju` pages failed in production due to environment variable dependency

**Solution**:
- Direct database access for main page
- Smart URL detection utility for API calls
- Proper type mapping and ISR caching

**Result**:
- ✅ Local build successful
- ✅ Type safety maintained
- ✅ Ready for production deployment
- ✅ Expected >85% E2E test pass rate

**Deployment**: Push to GitHub → Vercel auto-deploys → Verify → Rerun tests

---

**Generated**: 2025-11-17
**Git Commit**: d0a2cc7
**Status**: Ready for Deployment 🚀
