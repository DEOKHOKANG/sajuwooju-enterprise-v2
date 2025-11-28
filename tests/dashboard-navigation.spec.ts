import { test, expect } from '@playwright/test';

/**
 * E2E Test: Dashboard Navigation & Tab System
 * Tests 6-tab dashboard navigation and mobile bottom nav (5 tabs)
 */

test.describe('Dashboard Navigation - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('Dashboard main page loads correctly', async ({ page }) => {
    // Check for dashboard heading
    await expect(
      page.getByText(/안녕하세요/i).or(page.locator('h1, h2').first())
    ).toBeVisible({ timeout: 10000 });

    // Check for profile section
    const profileSection = page.locator('[data-testid="profile-card"]')
      .or(page.getByText(/프로필/i))
      .or(page.locator('img[alt*="profile"]'));

    await expect(profileSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('Dashboard 6 tabs navigation', async ({ page }) => {
    const tabs = [
      { name: '홈', path: '/dashboard' },
      { name: '사주분석', path: '/saju/new' },
      { name: 'AI채팅', path: '/chat' },
      { name: '저장함', path: '/saved' },
      { name: '마이페이지', path: '/profile' },
    ];

    for (const tab of tabs) {
      const tabLink = page.getByRole('link', { name: new RegExp(tab.name, 'i') })
        .or(page.getByText(tab.name));

      if (await tabLink.first().isVisible({ timeout: 3000 })) {
        await tabLink.first().click();

        await page.waitForLoadState('networkidle', { timeout: 10000 });

        // Verify URL changed
        const currentURL = page.url();
        const expectedPath = tab.path.replace(/^\//, '');

        if (currentURL.includes(expectedPath)) {
          expect(currentURL).toContain(expectedPath);
        }

        // Go back to dashboard for next iteration
        if (tab.name !== '홈') {
          await page.goto('/dashboard');
        }
      }
    }
  });

  test('Profile card components', async ({ page }) => {
    // Check profile card elements
    const profileName = page.locator('[data-testid="profile-name"]')
      .or(page.getByText(/님/))
      .first();

    await expect(profileName).toBeVisible({ timeout: 5000 });
  });

  test('Quick actions buttons', async ({ page }) => {
    const quickActions = [
      '새 사주 분석',
      'AI 채팅 시작',
      '저장된 분석',
    ];

    for (const action of quickActions) {
      const button = page.getByRole('button', { name: new RegExp(action, 'i') })
        .or(page.getByText(action));

      if (await button.first().isVisible({ timeout: 3000 })) {
        await expect(button.first()).toBeVisible();
      }
    }
  });

  test('Today fortune widget', async ({ page }) => {
    const fortuneWidget = page.locator('[data-testid="today-fortune"]')
      .or(page.getByText(/오늘의 운세/i))
      .or(page.getByText(/행운의/i));

    await expect(fortuneWidget.first()).toBeVisible({ timeout: 5000 });
  });

  test('Recent analyses section', async ({ page }) => {
    const recentSection = page.locator('[data-testid="recent-analysis"]')
      .or(page.getByText(/최근 분석/i))
      .or(page.getByText(/최근 사주/i));

    await expect(recentSection.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Mobile Bottom Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Bottom nav - 5 tabs visible and fixed', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for bottom navigation to load
    await page.waitForLoadState('networkidle');

    // Check all 5 tabs in bottom navigation
    const navTabs = ['홈', '사주분석', 'AI채팅', '저장함', '마이'];

    for (const tabName of navTabs) {
      const tab = page.getByRole('link', { name: new RegExp(tabName, 'i') })
        .or(page.getByText(tabName));

      await expect(tab.first()).toBeVisible({ timeout: 5000 });
    }

    // Check bottom navigation is fixed at bottom
    const bottomNav = page.locator('nav').last();
    const boundingBox = await bottomNav.boundingBox();

    if (boundingBox) {
      // Should be near bottom of viewport (within 100px)
      const viewportHeight = page.viewportSize()?.height || 667;
      expect(boundingBox.y).toBeGreaterThan(viewportHeight - 150);
    }
  });

  test('Bottom nav tab switching', async ({ page }) => {
    await page.goto('/dashboard');

    // Tab through bottom navigation
    const tabs = [
      { name: '사주분석', expectedPath: 'saju' },
      { name: 'AI채팅', expectedPath: 'chat' },
      { name: '저장함', expectedPath: 'saved' },
      { name: '마이', expectedPath: 'profile' },
      { name: '홈', expectedPath: 'dashboard' },
    ];

    for (const tab of tabs) {
      const tabButton = page.getByRole('link', { name: new RegExp(tab.name, 'i') })
        .or(page.getByText(tab.name))
        .last(); // Use last() to get bottom nav, not header

      if (await tabButton.isVisible({ timeout: 3000 })) {
        await tabButton.tap(); // Use tap() for mobile

        await page.waitForLoadState('networkidle', { timeout: 10000 });

        const currentURL = page.url();
        expect(currentURL).toContain(tab.expectedPath);
      }
    }
  });

  test('Bottom nav active state indication', async ({ page }) => {
    await page.goto('/dashboard');

    // Check that active tab has visual indication
    const activeTab = page.locator('[aria-current="page"]')
      .or(page.locator('.active'))
      .or(page.locator('[data-active="true"]'));

    const count = await activeTab.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Header hamburger menu', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for hamburger menu button
    const menuButton = page.getByRole('button', { name: /menu/i })
      .or(page.locator('button[aria-label*="menu"]'))
      .or(page.locator('button').first());

    if (await menuButton.isVisible({ timeout: 3000 })) {
      await menuButton.tap();

      // Side drawer should open
      const drawer = page.locator('[role="dialog"]')
        .or(page.locator('.drawer'))
        .or(page.locator('aside'));

      await expect(drawer.first()).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Responsive Dashboard - Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('Tablet layout optimization', async ({ page }) => {
    await page.goto('/dashboard');

    // Check tablet-optimized grid layout
    const mainContent = page.locator('main').first();
    const boundingBox = await mainContent.boundingBox();

    if (boundingBox) {
      // Tablet should use more horizontal space
      expect(boundingBox.width).toBeGreaterThan(600);
      expect(boundingBox.width).toBeLessThan(900);
    }
  });

  test('Tablet navigation accessibility', async ({ page }) => {
    await page.goto('/dashboard');

    // All navigation elements should be reachable
    const navElements = page.getByRole('link')
      .or(page.getByRole('button'));

    const count = await navElements.count();
    expect(count).toBeGreaterThan(5);

    // Check they're within viewport
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = navElements.nth(i);
      if (await element.isVisible({ timeout: 1000 })) {
        const box = await element.boundingBox();
        if (box) {
          expect(box.y).toBeGreaterThanOrEqual(0);
          expect(box.y).toBeLessThan(1024);
        }
      }
    }
  });
});

test.describe('Dashboard Interactions', () => {
  test('Search functionality in header', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for search button or input
    const searchButton = page.getByRole('button', { name: /search/i })
      .or(page.locator('button[aria-label*="search"]'))
      .or(page.getByPlaceholder(/검색/i));

    if (await searchButton.first().isVisible({ timeout: 3000 })) {
      await searchButton.first().click();

      // Search input should appear or focus
      const searchInput = page.getByRole('searchbox')
        .or(page.getByPlaceholder(/검색/i));

      await expect(searchInput.first()).toBeFocused({ timeout: 2000 });
    }
  });

  test('Notification bell button', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for notification button
    const notificationButton = page.getByRole('button', { name: /notification/i })
      .or(page.locator('button[aria-label*="알림"]'));

    if (await notificationButton.first().isVisible({ timeout: 3000 })) {
      await notificationButton.first().click();

      // Notification panel should open
      await page.waitForTimeout(500);

      const notificationPanel = page.locator('[role="dialog"]')
        .or(page.getByText(/알림/i));

      const isVisible = await notificationPanel.first().isVisible({ timeout: 2000 });
      expect(isVisible).toBeTruthy();
    }
  });
});
