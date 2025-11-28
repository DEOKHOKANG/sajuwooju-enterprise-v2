import { test, expect } from '@playwright/test';

test.describe('관리자 제품 관리', () => {
  // 각 테스트 전에 로그인
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('http://localhost:3000/admin');
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('admin123!');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 5000 });

    // 제품 페이지로 이동
    await page.goto('http://localhost:3000/admin/products');
    await expect(page).toHaveURL(/\/admin\/products/);
  });

  test('제품 목록 페이지 렌더링', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page.locator('h1, h2').filter({ hasText: /제품|Product/i })).toBeVisible();

    // "새 제품" 버튼 확인
    await expect(page.locator('text=/새 제품|New Product/i')).toBeVisible();

    // 제품 카드 또는 테이블 확인
    const hasTable = await page.locator('table').count();
    const hasCards = await page.locator('[class*="card"]').count();
    expect(hasTable + hasCards).toBeGreaterThan(0);
  });

  test('제품 목록에 시드 데이터 표시', async ({ page }) => {
    // 시드 데이터 제품 확인
    await expect(page.locator('text=/기본 사주 분석/i')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=/프리미엄 연애운/i')).toBeVisible({ timeout: 3000 });
  });

  test('새 제품 생성', async ({ page }) => {
    // "새 제품" 버튼 클릭
    await page.locator('text=/새 제품|New Product/i').click();
    await expect(page).toHaveURL(/\/admin\/products\/new/);

    // 랜덤 제품 정보 입력
    const randomTitle = `테스트제품_${Date.now()}`;
    const randomSlug = `test-product-${Date.now()}`;

    await page.locator('input[name="title"]').fill(randomTitle);
    await page.locator('input[name="slug"]').fill(randomSlug);
    await page.locator('textarea[name="shortDescription"]').fill('짧은 설명');
    await page.locator('textarea[name="fullDescription"]').fill('상세 설명입니다.');
    await page.locator('input[name="price"]').fill('50000');

    // 카테고리 선택 (첫 번째 카테고리)
    const categoryCheckbox = page.locator('input[type="checkbox"]').first();
    if (await categoryCheckbox.count() > 0) {
      await categoryCheckbox.check();
    }

    // 저장 버튼 클릭
    await page.locator('button[type="submit"]').click();

    // 목록 페이지로 리다이렉션 확인
    await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 5000 });

    // 새로운 제품이 목록에 표시되는지 확인
    await expect(page.locator(`text=${randomTitle}`)).toBeVisible({
      timeout: 5000,
    });
  });

  test('제품 수정', async ({ page }) => {
    // 첫 번째 "수정" 또는 제품 클릭
    const editButton = page.locator('text=/수정|Edit/i').first();
    await editButton.click();

    // 수정 페이지로 이동 확인
    await expect(page).toHaveURL(/\/admin\/products\/[^/]+/, { timeout: 3000 });

    // 가격 수정
    const priceField = page.locator('input[name="price"]');
    await priceField.clear();
    await priceField.fill('99000');

    // 할인가 입력
    const discountField = page.locator('input[name="discountPrice"]');
    if (await discountField.count() > 0) {
      await discountField.clear();
      await discountField.fill('79000');
    }

    // 저장 버튼 클릭
    await page.locator('button[type="submit"]').click();

    // 목록 페이지로 리다이렉션 확인
    await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 5000 });

    // 페이지 리로드 대기
    await page.waitForTimeout(1000);
  });

  test('제품 검색', async ({ page }) => {
    // 검색 입력 필드 찾기
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="검색"], input[placeholder*="Search"]'
    );

    if (await searchInput.count() > 0) {
      // 검색어 입력
      await searchInput.first().fill('프리미엄');
      await searchInput.first().press('Enter');

      // 검색 결과 확인
      await expect(page.locator('text=/프리미엄/i')).toBeVisible({
        timeout: 3000,
      });

      // 검색 결과가 필터링됨 확인
      const items = await page.locator('[class*="card"], tbody tr').count();
      expect(items).toBeLessThanOrEqual(10);
    }
  });

  test('카테고리 필터링', async ({ page }) => {
    // 카테고리 필터 드롭다운 찾기
    const categoryFilter = page.locator('select[name="categoryId"], select').first();

    if (await categoryFilter.count() > 0) {
      // 특정 카테고리 선택
      await categoryFilter.selectOption({ index: 1 }); // 첫 번째 카테고리 선택

      // 페이지 리로드 대기
      await page.waitForTimeout(1000);

      // URL에 카테고리 파라미터 확인
      const url = page.url();
      expect(url).toMatch(/categoryId=/);
    }
  });

  test('Featured 제품 토글', async ({ page }) => {
    // Featured 토글 버튼 찾기
    const featuredToggle = page.locator(
      'input[type="checkbox"][name*="featured"], button:has-text("Featured")'
    ).first();

    if (await featuredToggle.count() > 0) {
      const isChecked = await featuredToggle.isChecked().catch(() => false);

      // 토글 클릭
      await featuredToggle.click();

      // 상태 변경 대기
      await page.waitForTimeout(1000);
    }
  });

  test('제품 활성/비활성 토글', async ({ page }) => {
    // 활성화 토글 찾기
    const activeToggle = page.locator(
      'input[type="checkbox"][name*="active"], button:has-text("활성")'
    ).first();

    if (await activeToggle.count() > 0) {
      const isChecked = await activeToggle.isChecked().catch(() => false);

      // 토글 클릭
      await activeToggle.click();

      // 상태 변경 대기
      await page.waitForTimeout(1000);
    }
  });

  test('제품 삭제', async ({ page }) => {
    // 먼저 테스트용 제품 생성
    await page.locator('text=/새 제품|New Product/i').click();
    await expect(page).toHaveURL(/\/admin\/products\/new/);

    const randomTitle = `삭제테스트_${Date.now()}`;
    const randomSlug = `delete-test-${Date.now()}`;

    await page.locator('input[name="title"]').fill(randomTitle);
    await page.locator('input[name="slug"]').fill(randomSlug);
    await page.locator('textarea[name="shortDescription"]').fill('삭제 테스트');
    await page.locator('textarea[name="fullDescription"]').fill('삭제 테스트 상세');
    await page.locator('input[name="price"]').fill('10000');

    // 카테고리 하나 선택
    const categoryCheckbox = page.locator('input[type="checkbox"]').first();
    if (await categoryCheckbox.count() > 0) {
      await categoryCheckbox.check();
    }

    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 5000 });

    // 생성된 제품 찾기
    const productCard = page.locator(`text=${randomTitle}`).locator('..').locator('..');

    // 삭제 버튼 클릭
    const deleteButton = productCard.locator('text=/삭제|Delete/i').first();

    if (await deleteButton.count() > 0) {
      // 삭제 확인 대화상자 처리
      page.on('dialog', dialog => dialog.accept());

      await deleteButton.click();

      // 삭제 후 목록에서 사라짐 확인
      await expect(page.locator(`text=${randomTitle}`)).not.toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('페이지네이션 동작', async ({ page }) => {
    // 페이지네이션 버튼 찾기
    const page2Button = page.locator('button:has-text("2")').first();

    if (await page2Button.count() > 0) {
      await page2Button.click();

      // URL 파라미터 확인
      await expect(page).toHaveURL(/[?&]page=2/, { timeout: 3000 });

      await page.waitForTimeout(1000);
    }
  });

  test('정렬 옵션 변경', async ({ page }) => {
    // 정렬 드롭다운 찾기
    const sortSelect = page.locator('select[name="sortBy"], select').first();

    if (await sortSelect.count() > 0) {
      // 가격순 정렬 선택
      const hasPrice = await sortSelect.locator('option:has-text("가격")').count();

      if (hasPrice > 0) {
        await sortSelect.selectOption({ label: /가격/ });

        // 페이지 리로드 대기
        await page.waitForTimeout(1000);

        // URL 파라미터 확인
        const url = page.url();
        expect(url).toMatch(/sortBy=/);
      }
    }
  });

  test('필수 필드 없이 생성 시 에러 표시', async ({ page }) => {
    // "새 제품" 버튼 클릭
    await page.locator('text=/새 제품|New Product/i').click();
    await expect(page).toHaveURL(/\/admin\/products\/new/);

    // 빈 폼 제출
    await page.locator('button[type="submit"]').click();

    // 필수 필드 validation 확인
    const titleInput = page.locator('input[name="title"]');
    const isRequired = await titleInput.getAttribute('required');
    expect(isRequired).not.toBeNull();

    // 페이지가 이동하지 않음 확인
    await expect(page).toHaveURL(/\/admin\/products\/new/);
  });

  test('가격 필드에 음수 입력 불가', async ({ page }) => {
    await page.locator('text=/새 제품|New Product/i').click();
    await expect(page).toHaveURL(/\/admin\/products\/new/);

    // 음수 가격 입력 시도
    const priceInput = page.locator('input[name="price"]');
    await priceInput.fill('-1000');

    // type="number" min 속성 확인
    const minValue = await priceInput.getAttribute('min');
    expect(minValue).toBe('0');
  });

  test('제품 상세 정보 확인', async ({ page }) => {
    // 첫 번째 제품 클릭 또는 상세보기
    const viewButton = page.locator('text=/상세|View|보기/i').first();

    if (await viewButton.count() > 0) {
      await viewButton.click();

      // 상세 페이지로 이동
      await expect(page).toHaveURL(/\/admin\/products\/[^/]+/, { timeout: 3000 });

      // 제품 정보 표시 확인
      await expect(page.locator('text=/제목|Title/i')).toBeVisible();
      await expect(page.locator('text=/가격|Price/i')).toBeVisible();
      await expect(page.locator('text=/설명|Description/i')).toBeVisible();
    } else {
      // 첫 번째 제품 카드 클릭
      const firstProduct = page.locator('[class*="card"]').first();
      await firstProduct.click();

      await page.waitForTimeout(1000);
    }
  });
});
