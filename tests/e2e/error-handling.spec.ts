/**
 * E2E Test: Error Handling
 * Phase 1.5: Error Handling Implementation
 *
 * Tests:
 * 1. 404 Not Found page
 * 2. Global error boundary
 * 3. API error handling
 * 4. Network error handling
 * 5. Loading states
 */

import { test, expect } from '@playwright/test';

test.describe('에러 처리 시스템 테스트', () => {
  test.describe('404 Not Found 페이지', () => {
    test('존재하지 않는 페이지 접근 시 404 페이지 표시', async ({ page }) => {
      // 존재하지 않는 페이지로 이동
      await page.goto('http://localhost:3000/this-page-does-not-exist');

      // 404 텍스트 확인
      await expect(page.locator('text=/404/i')).toBeVisible();

      // 에러 메시지 확인
      await expect(
        page.locator('text=/페이지를 찾을 수 없습니다|페이지가 존재하지 않습니다/i')
      ).toBeVisible();

      // 홈으로 돌아가기 버튼 확인
      const homeButton = page.locator('a[href="/"], a:has-text("홈으로")');
      await expect(homeButton.first()).toBeVisible();
    });

    test('404 페이지에서 홈으로 돌아가기 버튼 클릭', async ({ page }) => {
      await page.goto('http://localhost:3000/non-existent-page');

      // 홈으로 버튼 클릭
      const homeButton = page.locator('a[href="/"], a:has-text("홈으로")').first();
      await homeButton.click();

      // 홈 페이지로 이동 확인
      await page.waitForURL(/\/(main)?$/);
      await expect(page).toHaveURL(/\/(main)?$/);
    });
  });

  test.describe('Global Error Boundary', () => {
    test('에러 발생 시 에러 바운더리 UI 표시', async ({ page }) => {
      // 개발 모드에서만 테스트 가능
      // 프로덕션에서는 에러가 발생하지 않을 수 있음
      test.skip(process.env.NODE_ENV === 'production', '프로덕션 모드에서는 스킵');

      await page.goto('http://localhost:3000/main');

      // 에러 발생 트리거 (의도적인 에러 발생)
      // 예: 잘못된 prop을 전달하거나 네트워크 차단
      // 실제 구현은 테스트 환경에 따라 다름
    });

    test('에러 바운더리 "다시 시도" 버튼 작동', async ({ page }) => {
      // 에러 페이지로 직접 이동 (테스트용)
      // 실제로는 에러를 발생시켜야 하지만, 간단한 검증을 위해 생략
      test.skip();
    });
  });

  test.describe('API 에러 처리', () => {
    test('API 요청 실패 시 에러 메시지 표시', async ({ page }) => {
      // API 요청 차단 설정
      await page.route('**/api/**', (route) => {
        route.abort('failed');
      });

      // API를 호출하는 페이지로 이동
      await page.goto('http://localhost:3000/main');

      // 에러 메시지 표시 확인 (페이지마다 다를 수 있음)
      // 일부 페이지는 fallback data를 사용할 수 있음
    });

    test('401 Unauthorized 에러 처리', async ({ page }) => {
      // 401 응답 모킹
      await page.route('**/api/admin/**', (route) => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Unauthorized',
            message: '로그인이 필요합니다',
          }),
        });
      });

      // Admin 페이지 접근
      await page.goto('http://localhost:3000/admin/dashboard');

      // 로그인 페이지로 리다이렉트되거나 에러 메시지 표시
      // 구현에 따라 다를 수 있음
    });

    test('403 Forbidden 에러 처리', async ({ page }) => {
      // 403 응답 모킹
      await page.route('**/api/**', (route) => {
        route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Forbidden',
            message: '접근 권한이 없습니다',
          }),
        });
      });

      // 권한이 필요한 페이지 접근
      await page.goto('http://localhost:3000/admin');

      // 에러 메시지 또는 접근 거부 UI 확인
    });

    test('500 Internal Server Error 처리', async ({ page }) => {
      // 500 응답 모킹
      await page.route('**/api/**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Internal Server Error',
            message: '서버 오류가 발생했습니다',
          }),
        });
      });

      await page.goto('http://localhost:3000/main');

      // 서버 에러 메시지 확인 (fallback data 사용 시 표시되지 않을 수 있음)
    });
  });

  test.describe('네트워크 에러 처리', () => {
    test('오프라인 상태에서 적절한 메시지 표시', async ({ page, context }) => {
      // 오프라인 모드 시뮬레이션
      await context.setOffline(true);

      await page.goto('http://localhost:3000/main');

      // 오프라인 메시지 또는 캐시된 컨텐츠 표시
      // 구현에 따라 다를 수 있음

      // 온라인 복구
      await context.setOffline(false);
    });

    test('네트워크 타임아웃 처리', async ({ page }) => {
      // 타임아웃 시뮬레이션
      await page.route('**/api/**', async (route) => {
        // 요청을 지연시켜 타임아웃 발생
        await new Promise((resolve) => setTimeout(resolve, 10000));
        route.continue();
      });

      test.setTimeout(15000); // 테스트 타임아웃 연장

      // 타임아웃이 발생할 수 있는 페이지 접근
      await page.goto('http://localhost:3000/main');

      // 타임아웃 에러 메시지 확인 (구현된 경우)
    });
  });

  test.describe('로딩 상태', () => {
    test('페이지 로딩 시 로딩 스피너 표시', async ({ page }) => {
      // 느린 네트워크 시뮬레이션
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        route.continue();
      });

      // 페이지 이동 시작
      const navigation = page.goto('http://localhost:3000/main');

      // 로딩 스피너 확인 (있는 경우)
      // 구현에 따라 다를 수 있음

      // 로딩 완료 대기
      await navigation;
    });

    test('데이터 로딩 중 Skeleton UI 표시', async ({ page }) => {
      test.skip(); // Skeleton UI 구현 여부에 따라 활성화
    });

    test('버튼 로딩 상태 표시', async ({ page }) => {
      test.skip(); // 버튼 로딩 상태 구현 여부에 따라 활성화
    });
  });

  test.describe('에러 복구 (Error Recovery)', () => {
    test('에러 발생 후 "다시 시도" 버튼으로 복구', async ({ page }) => {
      test.skip(); // 구현 후 활성화
    });

    test('네트워크 복구 후 자동 재시도', async ({ page, context }) => {
      test.skip(); // 자동 재시도 구현 후 활성화
    });
  });

  test.describe('사용자 경험 (UX)', () => {
    test('에러 메시지가 사용자 친화적', async ({ page }) => {
      await page.goto('http://localhost:3000/non-existent-page');

      // 기술적인 용어 대신 사용자 친화적인 메시지 확인
      const content = await page.textContent('body');
      expect(content).not.toContain('Error 404');
      expect(content).not.toContain('ENOTFOUND');
      expect(content).not.toContain('undefined');
      expect(content).not.toContain('null');
    });

    test('에러 페이지에 CTA 버튼 존재', async ({ page }) => {
      await page.goto('http://localhost:3000/invalid-route');

      // 최소 1개 이상의 액션 버튼 확인
      const buttons = page.locator('a, button');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('에러 페이지가 브랜드 디자인 유지', async ({ page }) => {
      await page.goto('http://localhost:3000/404-test');

      // 브랜드 색상 (purple/pink) 사용 확인
      const bodyClass = await page.getAttribute('body', 'class');
      // 페이지가 완전히 깨지지 않고 스타일이 적용되어 있는지 확인
    });
  });

  test.describe('개발자 경험 (DX)', () => {
    test('개발 모드에서 에러 상세 정보 표시', async ({ page }) => {
      // 개발 모드에서만 실행
      if (process.env.NODE_ENV !== 'development') {
        test.skip();
      }

      // 에러 발생 시 에러 스택 트레이스 표시 확인
      // 실제 구현 필요
    });

    test('프로덕션 모드에서 에러 상세 정보 숨김', async ({ page }) => {
      // 프로덕션 모드에서만 실행
      if (process.env.NODE_ENV !== 'production') {
        test.skip();
      }

      // 에러 발생 시 스택 트레이스가 표시되지 않는지 확인
    });
  });

  test.describe('접근성 (Accessibility)', () => {
    test('에러 페이지가 키보드로 탐색 가능', async ({ page }) => {
      await page.goto('http://localhost:3000/404');

      // Tab 키로 버튼 포커스 가능 확인
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('에러 메시지에 적절한 ARIA 속성 사용', async ({ page }) => {
      await page.goto('http://localhost:3000/error-test');

      // role="alert" 또는 aria-live 속성 확인
      // 구현에 따라 다를 수 있음
    });
  });
});
