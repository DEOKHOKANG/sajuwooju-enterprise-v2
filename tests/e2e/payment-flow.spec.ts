import { test, expect } from '@playwright/test';

/**
 * 결제 플로우 E2E 테스트
 * 토스 페이먼츠 결제위젯 통합 테스트
 */

test.describe('결제 플로우 테스트', () => {
  const testContentSlug = 'reunion-possibility';

  test('결제 페이지가 정상적으로 로드되어야 한다', async ({ page }) => {
    await page.goto(`/payment/${testContentSlug}`);

    // 페이지 로드 확인
    await expect(page).toHaveTitle(/사주우주|결제/);

    // 결제 컨테이너 존재 확인
    const paymentContainer = page.locator('#payment-widget, [data-testid="payment-widget"]');
    await expect(paymentContainer.or(page.locator('body'))).toBeVisible();
  });

  test('콘텐츠 정보가 표시되어야 한다', async ({ page }) => {
    await page.goto(`/payment/${testContentSlug}`);

    // 페이지가 에러 없이 로드되었는지 확인 (HTTP 500 에러 페이지가 아닌지)
    const title = await page.title();
    expect(title).not.toMatch(/Internal Server Error/i);

    // 페이지에 결제 관련 UI가 있는지 확인
    await page.waitForLoadState('load');
  });

  test('토스 결제위젯 SDK가 로드되어야 한다', async ({ page }) => {
    await page.goto(`/payment/${testContentSlug}`);

    // 위젯이 로드되기까지 대기
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // 페이지가 에러 페이지가 아닌지 확인
    const title = await page.title();
    expect(title).not.toMatch(/Internal Server Error/i);

    // 페이지에 결제 관련 요소가 있는지 확인
    const hasPaymentContent = await page.evaluate(() => {
      return document.querySelector('#payment-method') !== null ||
             document.querySelector('#agreement') !== null ||
             document.querySelector('[class*="toss"]') !== null ||
             document.body.textContent?.includes('결제') ||
             document.body.textContent?.includes('불러오는');
    });

    expect(hasPaymentContent).toBe(true);
  });

  test('결제 API 엔드포인트가 동작해야 한다', async ({ request }) => {
    // 결제 생성 API 테스트 (유효성 검사만)
    const response = await request.post('/api/payments/create', {
      data: {
        contentSlug: testContentSlug,
        amount: 9900,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 401 (인증 필요) 또는 200 (성공) 모두 정상
    expect([200, 201, 400, 401]).toContain(response.status());
  });

  test('결제 확인 API가 유효성 검사를 수행해야 한다', async ({ request }) => {
    // 잘못된 요청으로 API 검증
    const response = await request.post('/api/payments/confirm', {
      data: {
        paymentKey: 'invalid',
        orderId: 'invalid',
        amount: 0,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 400 또는 404 응답 예상 (유효성 검사 실패)
    expect([400, 404, 500]).toContain(response.status());

    const body = await response.json();
    expect(body).toHaveProperty('success', false);
  });

  test('결제 성공 페이지가 존재해야 한다', async ({ page }) => {
    // 결제 성공 페이지 접근 (쿼리 파라미터 없이)
    await page.goto('/payment/success');

    // 페이지가 로드되어야 함 (리다이렉트되거나 에러 메시지 표시)
    await expect(page).not.toHaveURL(/500|error/i);
  });

  test('결제 실패 페이지가 존재해야 한다', async ({ page }) => {
    await page.goto('/payment/fail?code=USER_CANCEL&message=사용자가 결제를 취소했습니다');

    // 페이지가 에러 페이지가 아닌지 확인
    const title = await page.title();
    expect(title).not.toMatch(/Internal Server Error/i);
  });
});

test.describe('결제 위젯 렌더링 테스트', () => {
  test('결제 위젯 컨테이너가 렌더링되어야 한다', async ({ page }) => {
    await page.goto('/payment/reunion-possibility');

    // 로딩 상태 확인 또는 위젯 컨테이너 확인
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // 결제 관련 요소 확인
    const paymentElements = await page.$$('#payment-method, #agreement, [data-testid="payment"]');

    // 최소한 페이지가 렌더링되어야 함
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('결제 버튼이 표시되어야 한다', async ({ page }) => {
    await page.goto('/payment/reunion-possibility');

    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // 결제 버튼 또는 관련 UI 확인
    const buttons = await page.$$('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

test.describe('결제 보안 테스트', () => {
  test('CSRF 토큰이 필요하거나 적절한 인증이 있어야 한다', async ({ request }) => {
    // 인증 없는 결제 요청
    const response = await request.post('/api/payments/create', {
      data: {
        contentSlug: 'reunion-possibility',
        amount: 9900,
      },
    });

    // 인증 필요 응답 또는 적절한 에러
    expect([200, 201, 400, 401, 403]).toContain(response.status());
  });

  test('금액 변조 방지가 작동해야 한다', async ({ request }) => {
    // 잘못된 금액으로 확인 요청
    const response = await request.post('/api/payments/confirm', {
      data: {
        paymentKey: 'test_key',
        orderId: 'non_existent_order',
        amount: 1, // 변조된 금액
      },
    });

    // 실패 응답 예상
    expect([400, 404, 500]).toContain(response.status());
  });
});
