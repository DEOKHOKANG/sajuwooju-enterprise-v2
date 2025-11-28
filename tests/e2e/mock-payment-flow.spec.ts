import { test, expect } from '@playwright/test';

/**
 * Mock 결제 플로우 E2E 테스트
 * test_ 키로 시작하는 경우 Mock 모드로 동작
 */

test.describe('Mock 결제 플로우 테스트', () => {
  test('결제 버튼 클릭 시 Mock 모드로 성공 페이지 이동', async ({ page }) => {
    const consoleLogs: string[] = [];

    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // 결제 페이지 로드
    await page.goto('/payment/reunion-possibility');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // 테스트 모드 안내가 표시되는지 확인 (첫 번째 요소만 선택)
    const testModeNotice = page.locator('text=테스트 모드').first();
    await expect(testModeNotice).toBeVisible({ timeout: 10000 });
    console.log('Test mode notice is visible');

    // 결제 버튼 찾기
    const paymentButton = page.locator('button:has-text("결제")');
    await expect(paymentButton).toBeVisible();
    console.log('Payment button is visible');

    // 결제 버튼 클릭
    await paymentButton.click();
    console.log('Payment button clicked');

    // 성공 페이지로 이동 확인 (5초 대기)
    await page.waitForURL('**/payment/success**', { timeout: 10000 });
    console.log('Redirected to success page');

    // 성공 페이지 확인
    const successTitle = page.locator('text=결제가 완료되었습니다');
    await expect(successTitle).toBeVisible({ timeout: 10000 });
    console.log('Success message is visible');

    // Mock 결제 안내 확인 (첫 번째 요소만 선택)
    const mockNotice = page.locator('text=테스트 결제').first();
    await expect(mockNotice).toBeVisible();
    console.log('Mock payment notice is visible');

    // 콘솔 로그 출력
    console.log('\n=== Console Logs ===');
    consoleLogs.forEach(log => console.log(log));

    // Mock 결제 로그 확인
    const hasMockLog = consoleLogs.some(log =>
      log.includes('Mock payment') || log.includes('mock payment')
    );
    expect(hasMockLog).toBe(true);

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/mock-payment-success.png', fullPage: true });
  });

  test('Mock 결제 성공 페이지에 주문 정보가 표시되어야 한다', async ({ page }) => {
    // 결제 페이지 로드
    await page.goto('/payment/reunion-possibility');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // 결제 버튼 클릭
    const paymentButton = page.locator('button:has-text("결제")');
    await paymentButton.click();

    // 성공 페이지로 이동 대기
    await page.waitForURL('**/payment/success**', { timeout: 10000 });

    // 주문번호 표시 확인
    const orderIdLabel = page.locator('text=주문번호');
    await expect(orderIdLabel).toBeVisible();

    // 결제금액 표시 확인
    const amountLabel = page.locator('text=결제금액');
    await expect(amountLabel).toBeVisible();

    // 승인시간 표시 확인
    const approvedAtLabel = page.locator('text=승인시간');
    await expect(approvedAtLabel).toBeVisible();

    // 이용 안내 확인
    const guideSection = page.locator('text=이용 안내');
    await expect(guideSection).toBeVisible();

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/mock-payment-details.png', fullPage: true });
  });
});
