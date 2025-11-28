import { test, expect } from '@playwright/test';

/**
 * SDK v2 결제 페이지 테스트
 */

test.describe('SDK v2 결제 페이지 테스트', () => {
  test('결제 페이지가 에러 없이 로드되어야 한다', async ({ page }) => {
    // 콘솔 로그 캡처
    const consoleLogs: string[] = [];
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 페이지 로드
    await page.goto('/payment/reunion-possibility');
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // 콘솔 로그 출력
    console.log('\n=== Console Logs ===');
    consoleLogs.forEach(log => console.log(log));

    // 에러 확인
    console.log('\n=== Console Errors ===');
    consoleErrors.forEach(err => console.log(err));

    // 페이지 제목 확인
    const title = await page.title();
    console.log('Page title:', title);
    expect(title).not.toMatch(/Internal Server Error/i);

    // 결제 버튼 확인
    const paymentButton = page.locator('button:has-text("결제")');
    await expect(paymentButton).toBeVisible({ timeout: 10000 });
    console.log('Payment button is visible');

    // 버튼 텍스트 확인
    const buttonText = await paymentButton.textContent();
    console.log('Payment button text:', buttonText);
    expect(buttonText).toContain('결제');

    // "인증되지 않은" 에러가 없어야 함
    const hasAuthError = consoleErrors.some(err =>
      err.includes('인증되지 않은') ||
      err.includes('TossPaymentsError')
    );

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/sdk-v2-payment-page.png', fullPage: true });

    expect(hasAuthError).toBe(false);
  });

  test('결제 버튼 클릭 시 SDK가 로드되어야 한다', async ({ page }) => {
    const consoleLogs: string[] = [];

    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    await page.goto('/payment/reunion-possibility');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // 결제 버튼 찾기
    const paymentButton = page.locator('button:has-text("결제")');
    await expect(paymentButton).toBeVisible();

    // 결제 버튼 클릭 (결제창이 열리기 전에 SDK 로드 로그 확인)
    await paymentButton.click();

    // 잠시 대기
    await page.waitForTimeout(3000);

    // SDK 로드 로그 확인
    console.log('\n=== Console Logs after click ===');
    consoleLogs.forEach(log => console.log(log));

    // SDK가 로드되었는지 확인 (로그에 'Loading TossPayments SDK' 또는 유사 메시지)
    const sdkLoaded = consoleLogs.some(log =>
      log.includes('Loading TossPayments') ||
      log.includes('Requesting payment')
    );

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/sdk-v2-after-click.png', fullPage: true });

    // SDK 로드 성공 또는 결제창이 열렸는지 확인
    expect(sdkLoaded).toBe(true);
  });
});
