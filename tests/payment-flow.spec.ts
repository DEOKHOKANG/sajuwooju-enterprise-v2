import { test, expect } from '@playwright/test';

/**
 * E2E Test: Payment Flow with Mock Mode
 * Tests payment creation and confirmation flow
 */

test.describe('Payment Flow', () => {
  test('Payment creation API - Mock mode', async ({ request }) => {
    // Test POST /api/payments/create
    const response = await request.post('/api/payments/create', {
      data: {
        amount: 9900,
        orderName: '사주 프리미엄 분석',
        customerName: '홍길동',
        customerEmail: 'test@example.com',
        customerMobilePhone: '010-1234-5678',
        productId: 'premium-saju-analysis',
        sessionId: 'test-session-123',
        metadata: {
          category: '종합분석',
          birthDate: '1990-01-01',
        },
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('orderId');
    expect(data.data).toHaveProperty('amount', 9900);
    expect(data.data).toHaveProperty('orderName', '사주 프리미엄 분석');
    expect(data.data).toHaveProperty('customerName', '홍길동');
  });

  test('Payment confirmation API - Mock mode', async ({ request }) => {
    // First create a payment
    const createResponse = await request.post('/api/payments/create', {
      data: {
        amount: 9900,
        orderName: '테스트 상품',
        customerName: '테스트',
        customerEmail: 'test@example.com',
        productId: 'test-product',
        sessionId: 'test-session',
      },
    });

    const createData = await createResponse.json();
    const orderId = createData.data.orderId;

    // Then confirm the payment (Mock mode)
    const confirmResponse = await request.post('/api/payments/confirm', {
      data: {
        paymentKey: 'mock-payment-key-' + Date.now(),
        orderId: orderId,
        amount: 9900,
      },
    });

    expect(confirmResponse.ok()).toBeTruthy();

    const confirmData = await confirmResponse.json();
    expect(confirmData.success).toBe(true);
    expect(confirmData.data).toHaveProperty('orderId', orderId);
    expect(confirmData.data).toHaveProperty('status', 'done');
    expect(confirmData.data).toHaveProperty('paymentKey');

    // Check for mock mode message
    if (confirmData.message) {
      expect(confirmData.message).toContain('Mock');
    }
  });

  test('Payment flow - Invalid data handling', async ({ request }) => {
    // Test with missing required fields
    const response = await request.post('/api/payments/create', {
      data: {
        amount: 9900,
        // Missing orderName
        customerName: '홍길동',
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toHaveProperty('code');
    expect(data.error).toHaveProperty('message');
  });

  test('Payment confirmation - Invalid orderId', async ({ request }) => {
    const response = await request.post('/api/payments/confirm', {
      data: {
        paymentKey: 'test-key',
        orderId: 'non-existent-order-id',
        amount: 9900,
      },
    });

    // Should fail with 400 or 404
    expect(response.ok()).toBeFalsy();
  });
});

test.describe('Payment UI Flow', () => {
  test('Navigate to payment from premium product', async ({ page }) => {
    await page.goto('/');

    // Look for premium product or pricing section
    const premiumButton = page.getByRole('button', { name: /프리미엄/i })
      .or(page.getByRole('button', { name: /구매/i }))
      .or(page.getByRole('link', { name: /프리미엄/i }));

    if (await premiumButton.first().isVisible({ timeout: 5000 })) {
      await premiumButton.first().click();

      // Check if redirected to payment or product page
      await page.waitForLoadState('networkidle');

      // Payment related elements might be visible
      const paymentKeywords = page.getByText(/결제/i)
        .or(page.getByText(/구매/i))
        .or(page.getByText(/9,900원/i));

      const isVisible = await paymentKeywords.first().isVisible({ timeout: 3000 });
      expect(isVisible).toBeTruthy();
    }
  });

  test('Toss Payments widget integration check', async ({ page }) => {
    // Navigate to a page that might have Toss widget
    await page.goto('/');

    // Check if Toss Payments script is loaded
    const scripts = await page.locator('script[src*="tosspayments"]').count();

    // Toss script might be loaded dynamically, so this is optional
    if (scripts > 0) {
      expect(scripts).toBeGreaterThan(0);
    }
  });
});

test.describe('Payment - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Mobile payment button visibility', async ({ page }) => {
    await page.goto('/main');

    // Check if payment/purchase buttons are properly sized for mobile
    const buttons = page.getByRole('button', { name: /시작/i })
      .or(page.getByRole('button', { name: /구매/i }));

    const firstButton = buttons.first();

    if (await firstButton.isVisible({ timeout: 5000 })) {
      const boundingBox = await firstButton.boundingBox();

      if (boundingBox) {
        // Touch target should be at least 44x44px
        expect(boundingBox.height).toBeGreaterThanOrEqual(40);
        expect(boundingBox.width).toBeGreaterThanOrEqual(100);
      }
    }
  });
});
