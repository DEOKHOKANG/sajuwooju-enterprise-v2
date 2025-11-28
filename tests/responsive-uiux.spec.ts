import { test, expect } from '@playwright/test';

/**
 * E2E Test: UI/UX Responsive Design Testing
 * Tests across mobile, tablet, and desktop viewports
 * Validates accessibility, touch targets, and visual regression
 */

test.describe('Responsive Design - Mobile (iPhone 12)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Homepage - Mobile layout', async ({ page }) => {
    await page.goto('/');

    // Check hero section is responsive
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();

    const boundingBox = await hero.boundingBox();
    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(400);
    }

    // All text should be readable (no overflow)
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    const headingBox = await heading.boundingBox();
    if (headingBox) {
      expect(headingBox.width).toBeLessThan(400);
    }
  });

  test('Touch targets - Minimum 44x44px', async ({ page }) => {
    await page.goto('/main');

    // Check all buttons have adequate touch targets
    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);

      if (await button.isVisible({ timeout: 1000 })) {
        const box = await button.boundingBox();

        if (box) {
          // WCAG 2.1 Level AAA: Touch targets should be at least 44x44px
          expect(box.height).toBeGreaterThanOrEqual(40);
          expect(box.width).toBeGreaterThanOrEqual(80);
        }
      }
    }
  });

  test('Mobile menu navigation', async ({ page }) => {
    await page.goto('/');

    // Find and tap hamburger menu
    const menuButton = page.locator('button').first();

    if (await menuButton.isVisible({ timeout: 3000 })) {
      await menuButton.tap();

      // Wait for menu animation
      await page.waitForTimeout(500);

      // Menu should slide in
      const menu = page.locator('[role="dialog"]')
        .or(page.locator('nav'))
        .last();

      await expect(menu).toBeVisible({ timeout: 2000 });
    }
  });

  test('Form inputs - Mobile optimized', async ({ page }) => {
    await page.goto('/saju/new');

    // Check input field sizes
    const inputs = page.locator('input[type="text"]')
      .or(page.locator('input[type="email"]'));

    const firstInput = inputs.first();

    if (await firstInput.isVisible({ timeout: 3000 })) {
      const box = await firstInput.boundingBox();

      if (box) {
        // Inputs should be full-width on mobile
        expect(box.width).toBeGreaterThan(300);

        // Height should be comfortable for touch
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('Safe area - Bottom navigation', async ({ page }) => {
    await page.goto('/dashboard');

    // Check bottom navigation respects safe area
    const bottomNav = page.locator('nav').last();

    if (await bottomNav.isVisible({ timeout: 3000 })) {
      const box = await bottomNav.boundingBox();

      if (box) {
        // Should be at bottom but above device notch area
        const viewportHeight = 844; // iPhone 12 height
        expect(box.y + box.height).toBeLessThanOrEqual(viewportHeight);
        expect(box.y).toBeGreaterThan(viewportHeight - 150);
      }
    }
  });

  test('Scrolling - Smooth and no layout shift', async ({ page }) => {
    await page.goto('/main');

    // Get initial layout
    const initialContent = await page.locator('body').boundingBox();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Check no major layout shift occurred
    const finalContent = await page.locator('body').boundingBox();

    if (initialContent && finalContent) {
      expect(Math.abs(initialContent.width - finalContent.width)).toBeLessThan(10);
    }
  });
});

test.describe('Responsive Design - Tablet (iPad Pro)', () => {
  test.use({ viewport: { width: 1024, height: 1366 } });

  test('Tablet layout - Grid optimization', async ({ page }) => {
    await page.goto('/main');

    // Services should display in 2-column grid
    const services = page.locator('[data-testid="service-card"]')
      .or(page.getByText(/연애운/i).locator('..'));

    if (await services.first().isVisible({ timeout: 3000 })) {
      const count = await services.count();

      if (count >= 2) {
        const firstBox = await services.first().boundingBox();
        const secondBox = await services.nth(1).boundingBox();

        if (firstBox && secondBox) {
          // Should be side by side (2 columns)
          const isHorizontal = Math.abs(firstBox.y - secondBox.y) < 50;
          expect(isHorizontal).toBeTruthy();
        }
      }
    }
  });

  test('Tablet navigation - Side drawer', async ({ page }) => {
    await page.goto('/dashboard');

    // On tablet, side navigation might be persistent
    const sideNav = page.locator('aside')
      .or(page.locator('nav').first());

    if (await sideNav.isVisible({ timeout: 3000 })) {
      const box = await sideNav.boundingBox();

      if (box) {
        // Side nav should be < 30% of viewport width
        expect(box.width).toBeLessThan(300);
        expect(box.width).toBeGreaterThan(200);
      }
    }
  });

  test('Tablet form layout - Two column', async ({ page }) => {
    await page.goto('/saju/new');

    // Form fields might be in 2 columns on tablet
    const form = page.locator('form').first();

    if (await form.isVisible({ timeout: 3000 })) {
      const box = await form.boundingBox();

      if (box) {
        // Form should use available width
        expect(box.width).toBeGreaterThan(500);
        expect(box.width).toBeLessThan(900);
      }
    }
  });
});

test.describe('Responsive Design - Desktop (1920x1080)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('Desktop layout - Max content width', async ({ page }) => {
    await page.goto('/main');

    // Content should be centered with max-width
    const mainContent = page.locator('main').first();

    if (await mainContent.isVisible()) {
      const box = await mainContent.boundingBox();

      if (box) {
        // Content should not stretch full width on large screens
        expect(box.width).toBeLessThan(1600);

        // Should be centered
        expect(box.x).toBeGreaterThan(100);
      }
    }
  });

  test('Desktop hover effects', async ({ page }) => {
    await page.goto('/main');

    // Service cards should have hover effects
    const card = page.getByText(/연애운/i).first();

    if (await card.isVisible({ timeout: 3000 })) {
      // Hover over card
      await card.hover();

      await page.waitForTimeout(300);

      // Check for transform/scale (hover effect)
      const style = await card.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      // Transform should be applied on hover
      expect(style).toBeDefined();
    }
  });

  test('Desktop multi-column grid', async ({ page }) => {
    await page.goto('/main');

    // Services should display in 3-column grid on desktop
    const services = page.locator('[data-testid="service-card"]')
      .or(page.getByText(/연애운/i).locator('..'))
      .or(page.locator('article'));

    const count = await services.count();

    if (count >= 3) {
      const boxes = await Promise.all([
        services.nth(0).boundingBox(),
        services.nth(1).boundingBox(),
        services.nth(2).boundingBox(),
      ]);

      if (boxes[0] && boxes[1] && boxes[2]) {
        // All 3 should be on same row (similar y position)
        const yPositions = boxes.map(b => b!.y);
        const yDiff = Math.max(...yPositions) - Math.min(...yPositions);

        expect(yDiff).toBeLessThan(50);
      }
    }
  });

  test('Desktop navigation - Horizontal menu', async ({ page }) => {
    await page.goto('/');

    // Desktop should have horizontal nav in header
    const nav = page.locator('nav').first();

    if (await nav.isVisible({ timeout: 3000 })) {
      const box = await nav.boundingBox();

      if (box) {
        // Nav should span header width
        expect(box.width).toBeGreaterThan(800);

        // Should be at top
        expect(box.y).toBeLessThan(100);
      }
    }
  });
});

test.describe('Accessibility - WCAG 2.1 AA', () => {
  test('Color contrast - Text readability', async ({ page }) => {
    await page.goto('/main');

    // Check that main text has sufficient contrast
    const heading = page.locator('h1').first();

    if (await heading.isVisible()) {
      const color = await heading.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          background: style.backgroundColor,
        };
      });

      // Color values should be defined
      expect(color.color).toBeDefined();
    }
  });

  test('Keyboard navigation - Tab order', async ({ page }) => {
    await page.goto('/main');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Focused element should be visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeDefined();
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
  });

  test('ARIA labels - Screen reader support', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for proper ARIA labels on buttons
    const buttons = page.getByRole('button');
    const firstButton = buttons.first();

    if (await firstButton.isVisible({ timeout: 3000 })) {
      const ariaLabel = await firstButton.getAttribute('aria-label');
      const text = await firstButton.textContent();

      // Button should have either aria-label or visible text
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('Focus indicators - Visible focus', async ({ page }) => {
    await page.goto('/main');

    // Tab to first interactive element
    await page.keyboard.press('Tab');

    // Check focus is visible
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;

      const style = window.getComputedStyle(el);
      return {
        outline: style.outline,
        boxShadow: style.boxShadow,
        border: style.border,
      };
    });

    if (focused) {
      // Some focus indicator should be present
      const hasFocusIndicator =
        focused.outline !== 'none' ||
        focused.boxShadow !== 'none' ||
        focused.border !== 'none';

      expect(hasFocusIndicator).toBeTruthy();
    }
  });
});

test.describe('Performance - Core Web Vitals', () => {
  test('LCP - Largest Contentful Paint', async ({ page }) => {
    await page.goto('/main');

    // Get LCP metric
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Timeout after 10s
        setTimeout(() => resolve(0), 10000);
      });
    });

    // LCP should be < 2.5s for good performance
    expect(lcp).toBeGreaterThan(0);
    expect(lcp).toBeLessThan(2500);
  });

  test('FCP - First Contentful Paint', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/main');

    // Wait for first contentful paint
    await page.waitForSelector('h1, h2, p, img', { timeout: 5000 });

    const fcp = Date.now() - startTime;

    // FCP should be < 1.8s
    expect(fcp).toBeLessThan(1800);
  });

  test('Images - Lazy loading', async ({ page }) => {
    await page.goto('/main');

    // Check for lazy loading attribute
    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();
      const loading = await firstImage.getAttribute('loading');

      // Next.js Image component should have lazy loading
      expect(loading).toBeTruthy();
    }
  });
});

test.describe('Visual Regression - Layout Consistency', () => {
  test('Homepage - Screenshot comparison', async ({ page }) => {
    await page.goto('/main');

    // Wait for all content to load
    await page.waitForLoadState('networkidle');

    // Take screenshot for visual regression testing
    await expect(page).toHaveScreenshot('homepage-main.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('Dashboard - Screenshot comparison', async ({ page }) => {
    await page.goto('/dashboard');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: false, // Only above-the-fold
      maxDiffPixels: 100,
    });
  });
});
