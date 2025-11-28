/**
 * E2E Test: Hardcoding Detection
 *
 * 배포된 사이트에서 하드코딩된 부분을 찾아내는 테스트
 * - 정적 데이터가 아닌 API/Database에서 가져와야 하는 데이터 확인
 * - 버튼 클릭 시 실제 비동기 동작 확인
 * - UI 상호작용 후 데이터 변경 확인
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://sajuwooju-enterprise-ejtxz7761-kevinglecs-projects.vercel.app';

// 테스트 결과 저장
const hardcodingIssues: Array<{
  page: string;
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}> = [];

function reportIssue(
  page: string,
  element: string,
  issue: string,
  severity: 'critical' | 'high' | 'medium' | 'low' = 'medium'
) {
  hardcodingIssues.push({ page, element, issue, severity });
  console.log(`[${severity.toUpperCase()}] ${page} - ${element}: ${issue}`);
}

test.describe('하드코딩 탐지 테스트', () => {

  test.beforeAll(async () => {
    console.log('\n🔍 배포된 사이트 하드코딩 탐지 시작...\n');
    console.log(`대상 URL: ${BASE_URL}\n`);
  });

  test.afterAll(async () => {
    console.log('\n\n📊 하드코딩 탐지 결과 요약\n');
    console.log('='.repeat(80));

    const critical = hardcodingIssues.filter(i => i.severity === 'critical');
    const high = hardcodingIssues.filter(i => i.severity === 'high');
    const medium = hardcodingIssues.filter(i => i.severity === 'medium');
    const low = hardcodingIssues.filter(i => i.severity === 'low');

    console.log(`\n🔴 Critical: ${critical.length}개`);
    critical.forEach(i => console.log(`  - [${i.page}] ${i.element}: ${i.issue}`));

    console.log(`\n🟠 High: ${high.length}개`);
    high.forEach(i => console.log(`  - [${i.page}] ${i.element}: ${i.issue}`));

    console.log(`\n🟡 Medium: ${medium.length}개`);
    medium.forEach(i => console.log(`  - [${i.page}] ${i.element}: ${i.issue}`));

    console.log(`\n🟢 Low: ${low.length}개`);
    low.forEach(i => console.log(`  - [${i.page}] ${i.element}: ${i.issue}`));

    console.log(`\n총 발견된 이슈: ${hardcodingIssues.length}개`);
    console.log('='.repeat(80) + '\n');
  });

  test('홈페이지 - 제품 목록 동적 로딩 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 제품 카드가 있는지 확인
    const productCards = await page.locator('[data-testid="product-card"], .product-card, article').all();

    if (productCards.length === 0) {
      reportIssue('/', '제품 목록', '제품 카드가 표시되지 않음 - 하드코딩된 데이터일 가능성', 'critical');
    }

    // 네트워크 요청 확인
    let apiCalled = false;
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/api/products') || url.includes('/api/categories')) {
        apiCalled = true;
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    if (!apiCalled) {
      reportIssue('/', '제품 목록', 'API 호출 없이 렌더링됨 - 하드코딩된 데이터 사용 중', 'critical');
    }

    // 제품 카드 클릭 테스트
    if (productCards.length > 0) {
      const firstCard = productCards[0];
      const href = await firstCard.locator('a').first().getAttribute('href');

      if (!href || href === '#' || href === 'javascript:void(0)') {
        reportIssue('/', '제품 카드 링크', '동작하지 않는 링크 - 하드코딩된 UI', 'high');
      }
    }
  });

  test('제품 상세 페이지 - 동적 데이터 확인', async ({ page }) => {
    // 먼저 홈에서 제품 링크 찾기
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const productLinks = await page.locator('a[href*="/products/"], a[href*="/product/"]').all();

    if (productLinks.length === 0) {
      reportIssue('/', '제품 링크', '제품 상세 페이지 링크가 없음', 'high');
      return;
    }

    // 첫 번째 제품 클릭
    const firstLink = productLinks[0];
    const href = await firstLink.getAttribute('href');

    if (!href || href === '#') {
      reportIssue('/', '제품 링크', '유효하지 않은 링크', 'high');
      return;
    }

    await page.goto(BASE_URL + href);
    await page.waitForLoadState('networkidle');

    // API 호출 확인
    let productApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/products/')) {
        productApiCalled = true;
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    if (!productApiCalled) {
      reportIssue(href, '제품 상세 데이터', 'API 호출 없음 - 하드코딩된 상세 정보', 'critical');
    }

    // "구매하기" 버튼 확인
    const purchaseButton = page.locator('button:has-text("구매"), button:has-text("신청"), button:has-text("시작")').first();

    if (await purchaseButton.count() > 0) {
      const isDisabled = await purchaseButton.isDisabled();
      const onClick = await purchaseButton.getAttribute('onclick');

      if (onClick && onClick.includes('alert')) {
        reportIssue(href, '구매 버튼', 'alert()만 사용 - 실제 구매 로직 없음', 'critical');
      }

      // 버튼 클릭 후 네트워크 요청 확인
      let purchaseApiCalled = false;
      page.on('request', request => {
        if (request.url().includes('/api/purchase') || request.url().includes('/api/payment')) {
          purchaseApiCalled = true;
        }
      });

      await purchaseButton.click();
      await page.waitForTimeout(2000);

      if (!purchaseApiCalled) {
        reportIssue(href, '구매 버튼', 'API 호출 없음 - 하드코딩된 동작', 'critical');
      }
    }
  });

  test('카테고리 페이지 - 필터링 동작 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 카테고리 링크 찾기
    const categoryLinks = await page.locator('a[href*="/category"], a[href*="/categories"]').all();

    if (categoryLinks.length === 0) {
      reportIssue('/', '카테고리 네비게이션', '카테고리 링크가 없음', 'medium');
      return;
    }

    const firstCategory = categoryLinks[0];
    const href = await firstCategory.getAttribute('href');

    if (!href || href === '#') {
      reportIssue('/', '카테고리 링크', '동작하지 않는 링크', 'high');
      return;
    }

    // 카테고리 페이지 이동
    await page.goto(BASE_URL + href);
    await page.waitForLoadState('networkidle');

    // API 호출 확인
    let categoryApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/categories') || request.url().includes('/api/products?category')) {
        categoryApiCalled = true;
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    if (!categoryApiCalled) {
      reportIssue(href, '카테고리 필터', 'API 호출 없음 - 하드코딩된 필터링', 'high');
    }

    // 필터 UI 확인
    const filterButtons = await page.locator('button[data-filter], .filter-button, [role="tab"]').all();

    if (filterButtons.length > 0) {
      const firstFilter = filterButtons[0];

      let filterApiCalled = false;
      page.on('request', request => {
        if (request.url().includes('/api/')) {
          filterApiCalled = true;
        }
      });

      await firstFilter.click();
      await page.waitForTimeout(1000);

      if (!filterApiCalled) {
        reportIssue(href, '필터 버튼', 'API 호출 없음 - 클라이언트 측 필터링만 사용', 'medium');
      }
    }
  });

  test('검색 기능 - 동적 검색 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 검색 입력창 찾기
    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]').first();

    if (await searchInput.count() === 0) {
      reportIssue('/', '검색 기능', '검색 입력창이 없음', 'medium');
      return;
    }

    // 검색어 입력
    await searchInput.fill('사주');

    let searchApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/search') || request.url().includes('query=')) {
        searchApiCalled = true;
      }
    });

    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    if (!searchApiCalled) {
      reportIssue('/', '검색 기능', 'API 호출 없음 - 하드코딩된 검색 결과', 'high');
    }

    // 검색 결과 확인
    const results = await page.locator('[data-testid="search-result"], .search-result').all();

    if (results.length === 0) {
      reportIssue('/', '검색 결과', '검색 결과가 표시되지 않음', 'high');
    }
  });

  test('로그인/회원가입 - 인증 플로우 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 로그인 버튼 찾기
    const loginButton = page.locator('button:has-text("로그인"), a:has-text("로그인")').first();

    if (await loginButton.count() === 0) {
      reportIssue('/', '인증', '로그인 버튼이 없음', 'low');
      return;
    }

    await loginButton.click();
    await page.waitForTimeout(1000);

    // OAuth 버튼 확인
    const kakaoButton = page.locator('button:has-text("카카오")').first();
    const googleButton = page.locator('button:has-text("구글"), button:has-text("Google")').first();

    if (await kakaoButton.count() > 0) {
      let oauthCalled = false;
      page.on('request', request => {
        if (request.url().includes('/api/auth') || request.url().includes('kakao')) {
          oauthCalled = true;
        }
      });

      await kakaoButton.click();
      await page.waitForTimeout(1000);

      if (!oauthCalled) {
        reportIssue('/login', '카카오 로그인', 'OAuth API 호출 없음 - 하드코딩된 버튼', 'critical');
      }
    }

    // 이메일 로그인 폼 확인
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      let loginApiCalled = false;
      page.on('request', request => {
        if (request.url().includes('/api/auth/signin') || request.url().includes('/api/login')) {
          loginApiCalled = true;
        }
      });

      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      await page.waitForTimeout(2000);

      if (!loginApiCalled) {
        reportIssue('/login', '로그인 폼', 'API 호출 없음 - 하드코딩된 로그인', 'critical');
      }
    }
  });

  test('페이지네이션 - 동적 로딩 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 페이지네이션 버튼 찾기
    const nextButton = page.locator('button:has-text("다음"), button:has-text("Next"), [aria-label="Next page"]').first();
    const pageButtons = await page.locator('.pagination button, [role="navigation"] button').all();

    if (pageButtons.length === 0) {
      reportIssue('/', '페이지네이션', '페이지네이션 UI가 없음', 'low');
      return;
    }

    let paginationApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('page=') || request.url().includes('offset=')) {
        paginationApiCalled = true;
      }
    });

    if (await nextButton.count() > 0) {
      await nextButton.click();
      await page.waitForTimeout(2000);

      if (!paginationApiCalled) {
        reportIssue('/', '페이지네이션', 'API 호출 없음 - 클라이언트 측 페이징만 사용', 'medium');
      }
    }
  });

  test('관리자 페이지 - 데이터 관리 확인', async ({ page }) => {
    // 관리자 로그인 페이지 접근
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');

    // 관리자 로그인 폼 확인
    const usernameInput = page.locator('input[name="username"], input[type="text"]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();

    if (await usernameInput.count() === 0 || await passwordInput.count() === 0) {
      reportIssue('/admin/login', '관리자 로그인', '로그인 폼이 없음', 'critical');
      return;
    }

    await usernameInput.fill('admin');
    await passwordInput.fill('admin123');

    let adminLoginApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/admin/login') || request.url().includes('/api/auth')) {
        adminLoginApiCalled = true;
      }
    });

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    await page.waitForTimeout(2000);

    if (!adminLoginApiCalled) {
      reportIssue('/admin/login', '관리자 로그인 API', 'API 호출 없음 - 하드코딩된 인증', 'critical');
    }

    // 관리자 대시보드 통계 확인 (로그인 성공 시)
    if (page.url().includes('/admin') && !page.url().includes('/login')) {
      let statsApiCalled = false;
      page.on('request', request => {
        if (request.url().includes('/api/admin/stats')) {
          statsApiCalled = true;
        }
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      if (!statsApiCalled) {
        reportIssue('/admin', '관리자 통계', 'API 호출 없음 - 하드코딩된 통계 데이터', 'critical');
      }
    }
  });

  test('즐겨찾기/좋아요 - 상태 변경 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 좋아요 버튼 찾기
    const likeButtons = await page.locator('button[aria-label*="좋아요"], button[aria-label*="favorite"], .like-button, .favorite-button').all();

    if (likeButtons.length === 0) {
      reportIssue('/', '좋아요 기능', '좋아요 버튼이 없음', 'low');
      return;
    }

    const firstLikeButton = likeButtons[0];

    let likeApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/favorite') || request.url().includes('/api/like')) {
        likeApiCalled = true;
      }
    });

    await firstLikeButton.click();
    await page.waitForTimeout(1000);

    if (!likeApiCalled) {
      reportIssue('/', '좋아요 버튼', 'API 호출 없음 - 로컬 상태만 변경', 'high');
    }
  });

  test('댓글/리뷰 시스템 - CRUD 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 제품 상세 페이지로 이동
    const productLinks = await page.locator('a[href*="/products/"]').all();
    if (productLinks.length === 0) return;

    const href = await productLinks[0].getAttribute('href');
    if (!href) return;

    await page.goto(BASE_URL + href);
    await page.waitForLoadState('networkidle');

    // 리뷰 섹션 확인
    const reviewSection = page.locator('[data-testid="reviews"], .reviews, #reviews').first();

    if (await reviewSection.count() === 0) {
      reportIssue(href, '리뷰 시스템', '리뷰 섹션이 없음', 'medium');
      return;
    }

    // 리뷰 작성 폼 확인
    const reviewTextarea = page.locator('textarea[placeholder*="리뷰"], textarea[name="review"]').first();

    if (await reviewTextarea.count() > 0) {
      await reviewTextarea.fill('테스트 리뷰입니다.');

      let reviewApiCalled = false;
      page.on('request', request => {
        if (request.url().includes('/api/reviews') || request.url().includes('/api/comments')) {
          reviewApiCalled = true;
        }
      });

      const submitButton = page.locator('button:has-text("등록"), button:has-text("작성")').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(2000);

        if (!reviewApiCalled) {
          reportIssue(href, '리뷰 작성', 'API 호출 없음 - 하드코딩된 리뷰', 'high');
        }
      }
    }
  });

  test('실시간 업데이트 - WebSocket/폴링 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // WebSocket 연결 확인
    let websocketConnected = false;
    page.on('websocket', ws => {
      websocketConnected = true;
      console.log('WebSocket 연결 감지:', ws.url());
    });

    await page.waitForTimeout(3000);

    // 실시간 업데이트가 필요한 요소 확인 (알림, 채팅 등)
    const notificationBell = page.locator('[aria-label*="알림"], .notification-icon').first();

    if (await notificationBell.count() > 0) {
      let pollingDetected = false;
      page.on('request', request => {
        if (request.url().includes('/api/notifications')) {
          pollingDetected = true;
        }
      });

      await page.waitForTimeout(5000);

      if (!websocketConnected && !pollingDetected) {
        reportIssue('/', '실시간 알림', 'WebSocket이나 폴링 없음 - 정적 데이터', 'medium');
      }
    }
  });

  test('이미지 최적화 - 동적 로딩 확인', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 이미지 요소 확인
    const images = await page.locator('img').all();

    let staticImageCount = 0;
    let cdnImageCount = 0;
    let lazyLoadCount = 0;

    for (const img of images) {
      const src = await img.getAttribute('src');
      const loading = await img.getAttribute('loading');

      if (src) {
        // 정적 이미지 확인
        if (src.startsWith('/') && !src.includes('/_next/')) {
          staticImageCount++;
        }

        // CDN 사용 확인
        if (src.includes('cloudinary') || src.includes('cdn') || src.includes('imagekit')) {
          cdnImageCount++;
        }

        // Lazy loading 확인
        if (loading === 'lazy') {
          lazyLoadCount++;
        }
      }
    }

    if (staticImageCount > images.length * 0.5) {
      reportIssue('/', '이미지 최적화', `정적 이미지 과다 사용 (${staticImageCount}/${images.length})`, 'medium');
    }

    if (cdnImageCount === 0 && images.length > 0) {
      reportIssue('/', '이미지 CDN', 'CDN 사용하지 않음 - 성능 저하', 'low');
    }

    if (lazyLoadCount === 0 && images.length > 5) {
      reportIssue('/', '이미지 Lazy Loading', 'Lazy loading 미사용 - 초기 로딩 느림', 'medium');
    }
  });
});
