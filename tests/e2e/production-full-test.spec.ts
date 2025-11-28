/**
 * Production Full E2E Test Suite
 * 배포된 사이트의 모든 페이지와 버튼을 테스트합니다
 *
 * URL: https://sajuwooju-enterprise-mpyih11cm-kevinglecs-projects.vercel.app
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://sajuwooju-enterprise-mpyih11cm-kevinglecs-projects.vercel.app';

// 테스트 설정
test.use({
  baseURL: BASE_URL,
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure',
});

// ========================================
// 1. 메인 페이지 테스트
// ========================================

test.describe('메인 페이지 테스트', () => {
  test('메인 페이지 로딩 및 기본 요소 확인', async ({ page }) => {
    await page.goto('/main');

    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/사주우주/);

    // 주요 섹션 확인
    await expect(page.locator('body')).toBeVisible();

    // 스크린샷
    await page.screenshot({ path: 'test-results/screenshots/main-page.png', fullPage: true });
  });

  test('메인 페이지의 모든 링크 클릭 가능 확인', async ({ page }) => {
    await page.goto('/main');

    // 모든 링크 찾기
    const links = await page.locator('a[href]').all();
    console.log(`Found ${links.length} links on main page`);

    // 각 링크가 href 속성을 가지고 있는지 확인
    for (const link of links.slice(0, 10)) { // 처음 10개만 테스트
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('메인 페이지의 모든 버튼 찾기', async ({ page }) => {
    await page.goto('/main');

    // 모든 버튼 찾기
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons on main page`);

    // 버튼 정보 수집
    for (const button of buttons) {
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`Button: "${text?.trim()}" - Visible: ${isVisible}`);
    }
  });
});

// ========================================
// 2. 사주 메인 페이지 (/saju)
// ========================================

test.describe('사주 메인 페이지 테스트', () => {
  test('사주 메인 페이지 로딩', async ({ page }) => {
    await page.goto('/saju');

    // 헤더 확인
    await expect(page.locator('h1')).toContainText('사주 콘텐츠');

    // 카테고리 그리드 확인
    const categoryCards = page.locator('a[href^="/saju/"]');
    const count = await categoryCards.count();
    console.log(`Found ${count} category cards`);

    await page.screenshot({ path: 'test-results/screenshots/saju-main.png', fullPage: true });
  });

  test('카테고리 카드 클릭 테스트', async ({ page }) => {
    await page.goto('/saju');

    // 첫 번째 카테고리 카드 찾기
    const firstCard = page.locator('a[href^="/saju/"]').first();
    const cardHref = await firstCard.getAttribute('href');

    if (cardHref) {
      console.log(`Clicking first category card: ${cardHref}`);
      await firstCard.click();

      // 페이지 이동 확인
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/saju/');

      await page.screenshot({ path: 'test-results/screenshots/category-page.png', fullPage: true });
    }
  });
});

// ========================================
// 3. 관리자 로그인 페이지
// ========================================

test.describe('관리자 페이지 테스트', () => {
  test('관리자 로그인 페이지 로딩', async ({ page }) => {
    await page.goto('/admin');

    // 로그인 폼 확인
    await expect(page.locator('input[type="text"], input[name*="user"], input[placeholder*="아이디"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // 로그인 버튼 확인
    const loginButton = page.locator('button[type="submit"], button:has-text("로그인")').first();
    await expect(loginButton).toBeVisible();

    await page.screenshot({ path: 'test-results/screenshots/admin-login.png', fullPage: true });
  });

  test('로그인 폼 필드 입력 테스트', async ({ page }) => {
    await page.goto('/admin');

    // 사용자명 입력
    const usernameInput = page.locator('input[type="text"], input[name*="user"]').first();
    await usernameInput.fill('testuser');

    // 비밀번호 입력
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('testpassword');

    // 입력값 확인
    await expect(usernameInput).toHaveValue('testuser');
    await expect(passwordInput).toHaveValue('testpassword');

    console.log('Login form inputs working correctly');
  });
});

// ========================================
// 4. API Health Check
// ========================================

test.describe('API 엔드포인트 테스트', () => {
  test('Health Check API', async ({ page }) => {
    const response = await page.request.get('/api/health');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');

    console.log('Health check response:', data);
  });

  test('사주 카테고리 API', async ({ page }) => {
    const response = await page.request.get('/api/admin/saju-categories?limit=10');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('pagination');

    console.log(`Found ${data.categories?.length || 0} categories`);
  });
});

// ========================================
// 5. 전체 페이지 네비게이션 테스트
// ========================================

test.describe('전체 페이지 네비게이션', () => {
  const publicPages = [
    { url: '/', name: 'Home' },
    { url: '/main', name: 'Main' },
    { url: '/saju', name: 'Saju Main' },
    { url: '/saju/new', name: 'New Saju Analysis' },
    { url: '/dashboard', name: 'Dashboard' },
    { url: '/profile', name: 'Profile' },
    { url: '/match', name: 'Match' },
    { url: '/feed', name: 'Feed' },
    { url: '/ranking', name: 'Ranking' },
    { url: '/admin', name: 'Admin Login' },
  ];

  for (const pageInfo of publicPages) {
    test(`${pageInfo.name} 페이지 접근 테스트 (${pageInfo.url})`, async ({ page }) => {
      const response = await page.goto(pageInfo.url);

      // 200 OK 또는 리다이렉트 (3xx) 확인
      const status = response?.status() || 0;
      expect([200, 301, 302, 303, 307, 308]).toContain(status);

      console.log(`${pageInfo.name}: Status ${status}`);

      // 페이지 로딩 완료 대기
      await page.waitForLoadState('networkidle');

      // 스크린샷
      await page.screenshot({
        path: `test-results/screenshots/${pageInfo.name.toLowerCase().replace(/\s/g, '-')}.png`,
        fullPage: true
      });
    });
  }
});

// ========================================
// 6. 모든 버튼 클릭 테스트
// ========================================

test.describe('전체 버튼 클릭 테스트', () => {
  test('메인 페이지 모든 버튼 클릭', async ({ page }) => {
    await page.goto('/main');
    await page.waitForLoadState('networkidle');

    const buttons = await page.locator('button:visible').all();
    console.log(`Testing ${buttons.length} visible buttons on /main`);

    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
      const button = buttons[i];
      const text = await button.textContent();

      try {
        console.log(`Clicking button ${i + 1}: "${text?.trim()}"`);
        await button.click({ timeout: 3000 });
        await page.waitForTimeout(500); // 클릭 후 대기
      } catch (error) {
        console.log(`Button ${i + 1} click failed or timeout: ${error}`);
      }
    }
  });

  test('사주 페이지 CTA 버튼 클릭', async ({ page }) => {
    await page.goto('/saju');
    await page.waitForLoadState('networkidle');

    // "사주 분석 시작하기" 버튼 찾기
    const ctaButton = page.locator('a:has-text("사주 분석 시작"), a:has-text("시작하기")').first();

    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      await page.waitForLoadState('networkidle');

      console.log('CTA button clicked, navigated to:', page.url());
    }
  });
});

// ========================================
// 7. 폼 제출 테스트
// ========================================

test.describe('폼 제출 테스트', () => {
  test('관리자 로그인 폼 제출', async ({ page }) => {
    await page.goto('/admin');

    const usernameInput = page.locator('input[type="text"], input[name*="user"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await usernameInput.fill('admin');
    await passwordInput.fill('wrongpassword');

    // 네트워크 요청 감지
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/admin/auth/login'),
      { timeout: 5000 }
    ).catch(() => null);

    await submitButton.click();

    const response = await responsePromise;
    if (response) {
      const status = response.status();
      console.log('Login attempt status:', status);
    }
  });
});

// ========================================
// 8. Chrome DevTools Performance 측정
// ========================================

test.describe('Chrome DevTools 성능 분석', () => {
  test('메인 페이지 성능 측정', async ({ page }) => {
    // Performance 측정 시작
    await page.goto('/main', { waitUntil: 'networkidle' });

    // Performance metrics 수집
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
      };
    });

    console.log('Performance Metrics:', metrics);

    // 성능 기준 검증
    expect(metrics.domInteractive).toBeLessThan(3000); // 3초 이내
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // 2초 이내
  });

  test('JavaScript 에러 감지', async ({ page }) => {
    const consoleErrors: string[] = [];
    const jsErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto('/main');
    await page.waitForLoadState('networkidle');

    console.log('Console Errors:', consoleErrors);
    console.log('JavaScript Errors:', jsErrors);

    // 에러가 없어야 함
    expect(consoleErrors.length).toBe(0);
    expect(jsErrors.length).toBe(0);
  });

  test('네트워크 요청 분석', async ({ page }) => {
    const requests: { url: string; method: string; status: number }[] = [];

    page.on('response', (response) => {
      requests.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
      });
    });

    await page.goto('/saju');
    await page.waitForLoadState('networkidle');

    console.log(`Total requests: ${requests.length}`);

    // 실패한 요청 확인
    const failedRequests = requests.filter((r) => r.status >= 400);
    console.log('Failed requests:', failedRequests);

    expect(failedRequests.length).toBe(0);
  });
});

// ========================================
// 9. 반응형 디자인 테스트
// ========================================

test.describe('반응형 디자인 테스트', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`${viewport.name} 뷰포트 테스트`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/main');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: `test-results/screenshots/${viewport.name.toLowerCase()}-view.png`,
        fullPage: true,
      });

      console.log(`${viewport.name} viewport screenshot taken`);
    });
  }
});

// ========================================
// 10. SEO 메타 태그 확인
// ========================================

test.describe('SEO 메타 태그 테스트', () => {
  test('사주 메인 페이지 메타 태그', async ({ page }) => {
    await page.goto('/saju');

    // Title 확인
    const title = await page.title();
    expect(title).toContain('사주');

    // Meta description 확인
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();

    // OG tags 확인
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    console.log('SEO Meta Tags:');
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('OG Title:', ogTitle);
  });
});
