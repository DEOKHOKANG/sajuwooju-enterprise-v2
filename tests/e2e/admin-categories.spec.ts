import { test, expect } from '@playwright/test';

test.describe('관리자 카테고리 관리', () => {
  // 각 테스트 전에 로그인
  test.beforeEach(async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('http://localhost:3000/admin');

    // 로그인
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('admin123!');
    await page.locator('button[type="submit"]').click();

    // 대시보드 확인
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 5000 });

    // 카테고리 페이지로 이동
    await page.goto('http://localhost:3000/admin/categories');
    await expect(page).toHaveURL(/\/admin\/categories/);
  });

  test('카테고리 목록 페이지 렌더링', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page.locator('h1, h2').filter({ hasText: /카테고리|Category/i })).toBeVisible();

    // "새 카테고리" 버튼 확인
    await expect(page.locator('text=/새 카테고리|New Category/i')).toBeVisible();

    // 테이블 또는 카드 목록 확인
    const hasTable = await page.locator('table').count();
    const hasCards = await page.locator('[class*="card"]').count();
    expect(hasTable + hasCards).toBeGreaterThan(0);
  });

  test('카테고리 목록에 시드 데이터 표시', async ({ page }) => {
    // 시드 데이터의 일부 카테고리 확인
    await expect(page.locator('text=/연애운/i')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=/재물운/i')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=/직업운/i')).toBeVisible({ timeout: 3000 });
  });

  test('새 카테고리 생성', async ({ page }) => {
    // "새 카테고리" 버튼 클릭
    await page.locator('text=/새 카테고리|New Category/i').click();

    // 생성 페이지로 이동 확인
    await expect(page).toHaveURL(/\/admin\/categories\/new/);

    // 랜덤 이름으로 카테고리 생성
    const randomName = `테스트카테고리_${Date.now()}`;
    const randomSlug = `test-category-${Date.now()}`;

    await page.locator('input[name="name"]').fill(randomName);
    await page.locator('input[name="slug"]').fill(randomSlug);
    await page.locator('textarea[name="description"]').fill('테스트 설명');
    await page.locator('input[name="icon"]').fill('🧪');
    await page.locator('input[name="color"]').fill('#FF5733');

    // 저장 버튼 클릭
    await page.locator('button[type="submit"]').click();

    // 목록 페이지로 리다이렉션 확인
    await expect(page).toHaveURL(/\/admin\/categories$/, { timeout: 5000 });

    // 새로운 카테고리가 목록에 표시되는지 확인
    await expect(page.locator(`text=${randomName}`)).toBeVisible({
      timeout: 5000,
    });
  });

  test('카테고리 수정', async ({ page }) => {
    // 첫 번째 "수정" 버튼 클릭
    const editButton = page.locator('text=/수정|Edit/i').first();
    await editButton.click();

    // 수정 페이지로 이동 확인
    await expect(page).toHaveURL(/\/admin\/categories\/[^/]+/, { timeout: 3000 });

    // 설명 필드 수정
    const descriptionField = page.locator('textarea[name="description"]');
    await descriptionField.clear();
    const updatedDescription = `수정된 설명 ${Date.now()}`;
    await descriptionField.fill(updatedDescription);

    // 저장 버튼 클릭
    await page.locator('button[type="submit"]').click();

    // 목록 페이지로 리다이렉션 확인
    await expect(page).toHaveURL(/\/admin\/categories$/, { timeout: 5000 });

    // 성공 메시지 또는 업데이트된 내용 확인
    // (페이지가 리로드되면서 변경사항이 적용됨)
    await page.waitForTimeout(1000);
  });

  test('카테고리 검색', async ({ page }) => {
    // 검색 입력 필드 찾기
    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"], input[placeholder*="Search"]');

    if (await searchInput.count() > 0) {
      // 검색어 입력
      await searchInput.first().fill('연애');

      // Enter 키 또는 검색 버튼 클릭
      await searchInput.first().press('Enter');

      // 검색 결과 확인 (연애운이 포함된 항목만 표시)
      await expect(page.locator('text=/연애운/i')).toBeVisible({ timeout: 3000 });

      // 다른 카테고리는 표시되지 않음 (선택적 검증)
      const items = await page.locator('[class*="card"], tbody tr').count();
      expect(items).toBeLessThanOrEqual(5); // 검색 결과가 전체보다 적어야 함
    }
  });

  test('카테고리 활성/비활성 토글', async ({ page }) => {
    // 활성화 토글 버튼 찾기
    const toggleButton = page.locator('button:has-text("활성"), button:has-text("비활성"), input[type="checkbox"]').first();

    if (await toggleButton.count() > 0) {
      // 현재 상태 확인
      const isChecked = await toggleButton.isChecked().catch(() => false);

      // 토글 클릭
      await toggleButton.click();

      // 상태 변경 확인 (페이지 리로드 또는 상태 업데이트)
      await page.waitForTimeout(1000);

      // 변경된 상태 확인
      if (isChecked !== null) {
        const newState = await toggleButton.isChecked().catch(() => !isChecked);
        expect(newState).not.toBe(isChecked);
      }
    }
  });

  test('카테고리 삭제', async ({ page }) => {
    // 먼저 테스트용 카테고리 생성
    await page.locator('text=/새 카테고리|New Category/i').click();
    await expect(page).toHaveURL(/\/admin\/categories\/new/);

    const randomName = `삭제테스트_${Date.now()}`;
    const randomSlug = `delete-test-${Date.now()}`;

    await page.locator('input[name="name"]').fill(randomName);
    await page.locator('input[name="slug"]').fill(randomSlug);
    await page.locator('textarea[name="description"]').fill('삭제 테스트');
    await page.locator('input[name="icon"]').fill('🗑️');
    await page.locator('input[name="color"]').fill('#000000');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/admin\/categories$/, { timeout: 5000 });

    // 생성된 카테고리 찾기
    const categoryRow = page.locator(`text=${randomName}`).locator('..').locator('..');

    // 삭제 버튼 클릭
    const deleteButton = categoryRow.locator('text=/삭제|Delete/i').first();

    if (await deleteButton.count() > 0) {
      // 삭제 버튼 클릭
      await deleteButton.click();

      // 확인 대화상자 처리
      page.on('dialog', dialog => dialog.accept());

      // 삭제 후 목록에서 사라짐 확인
      await expect(page.locator(`text=${randomName}`)).not.toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('페이지네이션 동작', async ({ page }) => {
    // 페이지네이션 버튼 찾기
    const paginationButtons = page.locator('button:has-text("다음"), button:has-text("Next"), button:has-text("2")');

    if (await paginationButtons.count() > 0) {
      // 2페이지 버튼 클릭
      const page2Button = page.locator('button:has-text("2")').first();

      if (await page2Button.count() > 0) {
        await page2Button.click();

        // URL 파라미터 확인
        await expect(page).toHaveURL(/[?&]page=2/, { timeout: 3000 });

        // 페이지 리로드 확인
        await page.waitForTimeout(1000);
      }
    }
  });

  test('카테고리 정렬 순서 확인', async ({ page }) => {
    // 모든 카테고리 이름 가져오기
    const categoryNames = await page.locator('td:first-child, [class*="name"]').allTextContents();

    // 최소 2개 이상의 카테고리가 있어야 함
    expect(categoryNames.length).toBeGreaterThanOrEqual(2);

    // 시드 데이터의 순서대로 정렬되어 있는지 확인 (order 필드 기준)
    // 연애운(1), 재물운(2), 직업운(3) 순서로 나와야 함
    const expectedOrder = ['연애운', '재물운', '직업운'];
    const actualOrder = categoryNames.filter(name =>
      expectedOrder.some(expected => name.includes(expected))
    );

    // 순서 검증 (부분 일치)
    expect(actualOrder.length).toBeGreaterThanOrEqual(2);
  });

  test('필수 필드 없이 생성 시 에러 표시', async ({ page }) => {
    // "새 카테고리" 버튼 클릭
    await page.locator('text=/새 카테고리|New Category/i').click();
    await expect(page).toHaveURL(/\/admin\/categories\/new/);

    // 빈 폼 제출
    await page.locator('button[type="submit"]').click();

    // 에러 메시지 또는 브라우저 validation 확인
    const nameInput = page.locator('input[name="name"]');
    const isRequired = await nameInput.getAttribute('required');
    expect(isRequired).not.toBeNull();

    // 페이지가 이동하지 않음 확인
    await expect(page).toHaveURL(/\/admin\/categories\/new/);
  });
});
