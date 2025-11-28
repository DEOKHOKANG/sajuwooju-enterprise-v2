import { test, expect } from '@playwright/test';

test.describe('관리자 로그인', () => {
  test.beforeEach(async ({ page }) => {
    // 관리자 로그인 페이지로 이동
    await page.goto('http://localhost:3000/admin');
  });

  test('로그인 페이지가 올바르게 렌더링됨', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/관리자 로그인|Admin/);

    // 로그인 폼 요소 확인
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('빈 폼 제출 시 에러 표시', async ({ page }) => {
    // 로그인 버튼 클릭
    await page.locator('button[type="submit"]').click();

    // 에러 메시지 확인 (브라우저 기본 validation)
    const usernameInput = page.locator('input[name="username"]');
    await expect(usernameInput).toHaveAttribute('required', '');
  });

  test('잘못된 인증 정보로 로그인 실패', async ({ page }) => {
    // 잘못된 정보 입력
    await page.locator('input[name="username"]').fill('wronguser');
    await page.locator('input[name="password"]').fill('wrongpass');
    await page.locator('button[type="submit"]').click();

    // 에러 메시지 확인
    await expect(page.locator('text=/로그인 실패|인증.*실패|Invalid/i')).toBeVisible({
      timeout: 5000,
    });
  });

  test('올바른 인증 정보로 로그인 성공', async ({ page }) => {
    // 올바른 정보 입력
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('admin123!');
    await page.locator('button[type="submit"]').click();

    // 대시보드로 리다이렉션 확인
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 5000 });

    // 대시보드 요소 확인
    await expect(
      page.locator('text=/대시보드|Dashboard|통계|Statistics/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('로그인 후 localStorage에 토큰 저장됨', async ({ page }) => {
    // 로그인
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('admin123!');
    await page.locator('button[type="submit"]').click();

    // 대시보드로 이동 확인
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 5000 });

    // localStorage 토큰 확인
    const token = await page.evaluate(() => localStorage.getItem('adminToken'));
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token?.length).toBeGreaterThan(20);
  });

  test('로그인 후 다른 관리자 페이지 접근 가능', async ({ page }) => {
    // 로그인
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('admin123!');
    await page.locator('button[type="submit"]').click();

    // 대시보드 확인
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 5000 });

    // 카테고리 페이지로 이동
    await page.goto('http://localhost:3000/admin/categories');
    await expect(page.locator('text=/카테고리|Category/i')).toBeVisible({
      timeout: 5000,
    });

    // 제품 페이지로 이동
    await page.goto('http://localhost:3000/admin/products');
    await expect(page.locator('text=/제품|Product/i')).toBeVisible({
      timeout: 5000,
    });
  });

  test('토큰 없이 관리자 페이지 접근 시 로그인 페이지로 리다이렉션', async ({
    page,
  }) => {
    // localStorage 클리어
    await page.evaluate(() => localStorage.clear());

    // 대시보드 직접 접근 시도
    await page.goto('http://localhost:3000/admin/dashboard');

    // 로그인 페이지로 리다이렉션 확인
    await expect(page).toHaveURL(/\/admin($|\?|#)/, { timeout: 5000 });
  });

  test('로그아웃 기능 동작', async ({ page }) => {
    // 로그인
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('admin123!');
    await page.locator('button[type="submit"]').click();

    // 대시보드 확인
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 5000 });

    // 로그아웃 버튼 찾기 및 클릭
    const logoutButton = page.locator('text=/로그아웃|Logout/i');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // 로그인 페이지로 리다이렉션 확인
      await expect(page).toHaveURL(/\/admin($|\?|#)/, { timeout: 5000 });

      // localStorage 토큰 제거 확인
      const token = await page.evaluate(() =>
        localStorage.getItem('adminToken')
      );
      expect(token).toBeNull();
    }
  });
});
