import { test, expect } from '@playwright/test';

/**
 * E2E Test: Saju Analysis Complete Flow
 * Tests the entire user journey from homepage → input → analysis → results
 */

test.describe('Saju Analysis Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Complete saju analysis flow - Love Fortune', async ({ page }) => {
    // Step 1: Homepage - Navigate to analysis
    await expect(page.locator('h1')).toContainText('사주우주');

    // Click "무료로 시작하기" button
    await page.getByRole('button', { name: /무료로 시작하기/i }).first().click();

    // Wait for navigation to saju input page
    await expect(page).toHaveURL(/\/saju\/new/);

    // Step 2: Saju Input Form - Fill in basic information
    await expect(page.locator('h1')).toContainText('사주 분석');

    // Select category (연애운 - Love Fortune)
    await page.getByText('연애운').click();

    // Fill in name
    await page.getByLabel(/이름/i).fill('홍길동');

    // Select gender
    await page.getByLabel(/남성/i).check();

    // Fill in birth date
    await page.getByLabel(/생년월일/i).fill('1990-01-01');

    // Select calendar type (양력)
    await page.getByLabel(/양력/i).check();

    // Fill in birth time
    await page.getByLabel(/출생시간/i).fill('14:30');

    // Submit form
    await page.getByRole('button', { name: /분석 시작/i }).click();

    // Step 3: Loading state - Verify 3D animation is displayed
    await expect(page.locator('[data-testid="loading-animation"]').or(page.locator('canvas'))).toBeVisible({ timeout: 5000 });

    // Step 4: Results page - Verify analysis results
    await expect(page).toHaveURL(/\/saju\/result\//, { timeout: 30000 });

    // Check that saju board is displayed
    await expect(page.locator('[data-testid="saju-board"]').or(page.getByText(/사주판/i))).toBeVisible();

    // Check that analysis results are displayed
    await expect(page.getByText(/연애운/i)).toBeVisible();
    await expect(page.getByText(/전반적인/i).or(page.getByText(/분석/i))).toBeVisible();

    // Check save button exists
    await expect(page.getByRole('button', { name: /저장/i })).toBeVisible();

    // Check share buttons exist
    await expect(page.getByRole('button', { name: /공유/i }).or(page.getByText(/공유/i))).toBeVisible();
  });

  test('Category selection - All 6 categories', async ({ page }) => {
    await page.goto('/main');

    const categories = [
      '연애운',
      '재물운',
      '직업운',
      '궁합',
      '연운',
      '종합분석'
    ];

    for (const category of categories) {
      const categoryCard = page.getByText(category).first();
      await expect(categoryCard).toBeVisible();
    }
  });

  test('Form validation - Required fields', async ({ page }) => {
    await page.goto('/saju/new');

    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: /분석 시작/i });

    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Check for validation error messages
      const errorMessage = page.locator('[role="alert"]').or(page.getByText(/필수/i));
      await expect(errorMessage.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('Loading animation - Visual verification', async ({ page }) => {
    // Fill form quickly
    await page.goto('/saju/new');

    // Quick form fill (assumes form is visible)
    const nameInput = page.getByLabel(/이름/i);
    if (await nameInput.isVisible()) {
      await nameInput.fill('테스트');

      const submitButton = page.getByRole('button', { name: /분석 시작/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Check loading state appears
        await expect(
          page.locator('[data-testid="loading"]').or(
            page.getByText(/분석 중/i)
          ).or(
            page.locator('canvas')
          )
        ).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

test.describe('Saju Analysis - Mobile Flow', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Mobile saju analysis flow', async ({ page }) => {
    await page.goto('/main');

    // Tap service card (mobile touch)
    await page.getByText('연애운').first().tap();

    // Check mobile-optimized form layout
    await expect(page.locator('form')).toBeVisible();

    // Mobile viewport form should be stack layout
    const form = page.locator('form');
    const boundingBox = await form.boundingBox();

    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(400);
    }
  });

  test('Bottom navigation - 5 tabs visible', async ({ page }) => {
    await page.goto('/dashboard');

    // Check 5 tabs in bottom navigation
    const navTabs = ['홈', '사주분석', 'AI채팅', '저장함', '마이'];

    for (const tab of navTabs) {
      await expect(page.getByText(tab)).toBeVisible();
    }
  });
});
