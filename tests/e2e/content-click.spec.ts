import { test, expect } from '@playwright/test';

/**
 * Content Click Functionality Test
 * Verifies that content cards are clickable and navigate to detail pages
 */

test.describe('Content Click Functionality', () => {
  test('should navigate to content detail page when clicking on content card', async ({ page }) => {
    // Navigate to love-fortune category page
    await page.goto('/saju/love-fortune');

    // Wait for content cards to load
    await page.waitForSelector('a[href*="/saju/love-fortune/"]', { timeout: 15000 });

    // Find the first content link
    const firstContentLink = page.locator('a[href*="/saju/love-fortune/"]').first();

    // Get the href for verification
    const href = await firstContentLink.getAttribute('href');
    console.log('First content link href:', href);

    // Click on the content card
    await firstContentLink.click();

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle', { timeout: 45000 });

    // Verify we're on the detail page
    expect(page.url()).toContain('/saju/love-fortune/');
    expect(page.url()).not.toBe('/saju/love-fortune');

    // Verify content detail page elements are present
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // Check for view count icon
    await expect(page.locator('[class*="lucide-eye"]').or(page.getByText('조회'))).toBeVisible({ timeout: 10000 });

    // Verify back link is present
    await expect(page.locator('a[href="/saju/love-fortune"]')).toBeVisible({ timeout: 10000 });

    console.log('✅ Content click and navigation successful!');
  });

  test('should display content data on detail page', async ({ page }) => {
    // Navigate directly to a known content slug
    await page.goto('/saju/love-fortune/2025-01-love-fortune');

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 45000 });

    // Verify title is visible
    const title = page.locator('h1');
    await expect(title).toBeVisible({ timeout: 15000 });
    const titleText = await title.textContent();
    console.log('Content title:', titleText);

    // Verify view count is displayed
    const viewCount = page.locator('text=/조회|Eye/i').or(page.locator('[class*="lucide-eye"]'));
    await expect(viewCount.first()).toBeVisible({ timeout: 10000 });

    // Verify category badge is displayed
    const categoryBadge = page.locator('text=/연애운/i');
    await expect(categoryBadge.first()).toBeVisible({ timeout: 10000 });

    console.log('✅ Content detail page loaded successfully!');
  });

  test('should navigate back to category page from content detail', async ({ page }) => {
    // Go to content detail page
    await page.goto('/saju/love-fortune/2025-01-love-fortune');

    // Wait for page load
    await page.waitForLoadState('networkidle', { timeout: 45000 });

    // Click back link
    const backLink = page.locator('a[href*="/saju/love-fortune"]').first();
    await backLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle', { timeout: 45000 });

    // Verify we're back on category page
    expect(page.url()).toMatch(/\/saju\/love-fortune(\?.*)?$/);

    // Verify category page content is visible
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    console.log('✅ Back navigation successful!');
  });
});
