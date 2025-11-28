# Phase 10: 통합 테스트 및 프로덕션 준비

**프로젝트**: 사주우주(SajuWooju) Enterprise
**Phase**: 10 - 통합 테스트 및 프로덕션 준비
**예상 기간**: 5-7일
**목표**: 프로덕션 배포 준비 완료

---

## 📋 Phase 10 개요

Phase 1-9에서 백엔드 API와 관리자 UI를 모두 완성했습니다. Phase 10에서는 통합 테스트, 성능 최적화, 보안 강화를 진행하고 프로덕션 환경에 배포할 준비를 합니다.

---

## 🎯 Phase 10.1: 환경 설정 및 시드 데이터

**예상 소요**: 1일 (4-6시간)

### 작업 목록

#### 1.1 환경 변수 정리
- [ ] `.env.example` 파일 생성
- [ ] 모든 환경 변수 문서화
- [ ] 민감 정보 제거 확인
- [ ] 개발/스테이징/프로덕션 환경별 설정

**파일**: `.env.example`
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sajuwooju"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI (선택)
OPENAI_API_KEY="sk-..."

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-password"
JWT_SECRET="your-jwt-secret-here"
JWT_EXPIRES_IN="7d"

# 기타
NODE_ENV="development"
```

---

#### 1.2 Prisma 시드 스크립트
개발 및 테스트용 샘플 데이터 생성

**파일**: `prisma/seed.ts`
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. 관리자 계정 생성
  const hashedPassword = await bcrypt.hash('admin123!', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'System Admin',
      email: 'admin@sajuwooju.com',
      isActive: true,
    },
  });
  console.log('✅ Admin created:', admin.username);

  // 2. 카테고리 생성 (11개)
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '연애운',
        slug: 'love-fortune',
        description: '당신의 연애운을 상세히 분석합니다.',
        icon: '💖',
        color: '#FF6B9D',
        gradient: 'from-pink-500 to-rose-500',
        order: 1,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '재물운',
        slug: 'wealth-fortune',
        description: '재물과 금전 운을 분석합니다.',
        icon: '💰',
        color: '#FFD700',
        gradient: 'from-amber-500 to-orange-500',
        order: 2,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '직업운',
        slug: 'career-fortune',
        description: '직업과 커리어 운을 분석합니다.',
        icon: '💼',
        color: '#4169E1',
        gradient: 'from-blue-500 to-indigo-500',
        order: 3,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '건강운',
        slug: 'health-fortune',
        description: '건강과 체력 운을 분석합니다.',
        icon: '🏥',
        color: '#32CD32',
        gradient: 'from-green-500 to-emerald-500',
        order: 4,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '학업운',
        slug: 'study-fortune',
        description: '학업과 학습 운을 분석합니다.',
        icon: '📚',
        color: '#9370DB',
        gradient: 'from-purple-500 to-violet-500',
        order: 5,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '가족운',
        slug: 'family-fortune',
        description: '가족 관계 운을 분석합니다.',
        icon: '👨‍👩‍👧‍👦',
        color: '#FFA500',
        gradient: 'from-orange-500 to-amber-500',
        order: 6,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '궁합',
        slug: 'compatibility',
        description: '두 사람의 궁합을 분석합니다.',
        icon: '💑',
        color: '#FF1493',
        gradient: 'from-rose-500 to-pink-500',
        order: 7,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '연운',
        slug: 'yearly-fortune',
        description: '올해의 전반적인 운세를 분석합니다.',
        icon: '🗓️',
        color: '#00CED1',
        gradient: 'from-cyan-500 to-blue-500',
        order: 8,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '월운',
        slug: 'monthly-fortune',
        description: '이번 달 운세를 분석합니다.',
        icon: '📅',
        color: '#48D1CC',
        gradient: 'from-teal-500 to-cyan-500',
        order: 9,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '종합운',
        slug: 'comprehensive-fortune',
        description: '전체적인 운세를 종합 분석합니다.',
        icon: '🔮',
        color: '#8A2BE2',
        gradient: 'from-violet-500 to-purple-500',
        order: 10,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: '특수분석',
        slug: 'special-analysis',
        description: '특별한 질문에 대한 맞춤 분석입니다.',
        icon: '✨',
        color: '#FFD700',
        gradient: 'from-yellow-500 to-amber-500',
        order: 11,
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // 3. 제품 생성 (카테고리당 2-3개씩)
  const products = await Promise.all([
    // 연애운 제품
    prisma.product.create({
      data: {
        title: '2025 연애운 종합 패키지',
        slug: '2025-love-fortune-package',
        shortDescription: '올해의 연애운을 상세히 분석하고 좋은 인연을 만나는 방법을 알려드립니다.',
        fullDescription: '당신의 사주를 바탕으로 2025년 연애운을 깊이 있게 분석합니다. 언제 좋은 인연을 만날 수 있는지, 어떤 스타일의 이성과 잘 맞는지, 주의해야 할 시기는 언제인지 모두 알려드립니다.',
        features: [
          '2025년 연애운 흐름 분석',
          '좋은 인연을 만나는 시기',
          '이상형 분석 및 궁합',
          '연애 시 주의사항',
          '행운의 데이트 장소',
        ],
        price: 39000,
        discountPrice: 29000,
        views: 0,
        isActive: true,
        isFeatured: true,
        categories: {
          connect: [{ id: categories[0].id }],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: '짝사랑 성공률 분석',
        slug: 'crush-success-analysis',
        shortDescription: '좋아하는 사람과의 관계 발전 가능성을 분석합니다.',
        fullDescription: '현재 짝사랑하고 있는 상대와의 궁합, 고백 성공률, 최적의 어프로치 방법을 알려드립니다.',
        features: [
          '상대방과의 기본 궁합',
          '고백 성공률 분석',
          '최적의 어프로치 타이밍',
          '관계 발전 전략',
        ],
        price: 29000,
        discountPrice: null,
        views: 0,
        isActive: true,
        isFeatured: false,
        categories: {
          connect: [{ id: categories[0].id }],
        },
      },
    }),

    // 재물운 제품
    prisma.product.create({
      data: {
        title: '2025 재물운 완벽 가이드',
        slug: '2025-wealth-fortune-guide',
        shortDescription: '올해의 재물운과 투자 운을 분석하고 부자가 되는 방법을 알려드립니다.',
        fullDescription: '2025년 한 해 동안의 재물 흐름을 상세히 분석합니다. 투자 적기, 저축 방법, 수입 증대 전략까지 모두 담았습니다.',
        features: [
          '2025년 재물운 흐름',
          '투자 적기 및 피해야 할 시기',
          '수입 증대 방법',
          '저축 및 재테크 조언',
          '사업 운 분석',
        ],
        price: 49000,
        discountPrice: 39000,
        views: 0,
        isActive: true,
        isFeatured: true,
        categories: {
          connect: [{ id: categories[1].id }],
        },
      },
    }),

    // 직업운 제품
    prisma.product.create({
      data: {
        title: '커리어 전환 타이밍 분석',
        slug: 'career-change-timing',
        shortDescription: '이직이나 창업의 최적 시기를 분석합니다.',
        fullDescription: '현재 직장을 옮길 것인지, 창업을 할 것인지 고민이신가요? 당신의 사주를 바탕으로 커리어 전환의 최적 시기를 알려드립니다.',
        features: [
          '이직 운 분석',
          '창업 성공 가능성',
          '최적의 전환 시기',
          '적성에 맞는 직업',
          '승진 및 성공 운',
        ],
        price: 35000,
        discountPrice: null,
        views: 0,
        isActive: true,
        isFeatured: false,
        categories: {
          connect: [{ id: categories[2].id }],
        },
      },
    }),

    // 종합운 제품
    prisma.product.create({
      data: {
        title: '프리미엄 종합 운세',
        slug: 'premium-comprehensive-fortune',
        shortDescription: '연애, 재물, 직업, 건강 등 모든 운을 종합 분석하는 프리미엄 패키지입니다.',
        fullDescription: '연애운, 재물운, 직업운, 건강운, 가족운 등 모든 분야의 운세를 한 번에 분석하는 가장 상세한 패키지입니다. 2025년 한 해를 완벽하게 준비하세요.',
        features: [
          '연애운 상세 분석',
          '재물운 및 투자 운',
          '직업운 및 커리어',
          '건강운 및 주의사항',
          '가족운 및 인간관계',
          '월별 운세 달력',
          '행운의 색상 및 숫자',
        ],
        price: 99000,
        discountPrice: 79000,
        views: 0,
        isActive: true,
        isFeatured: true,
        categories: {
          connect: [
            { id: categories[0].id },
            { id: categories[1].id },
            { id: categories[2].id },
            { id: categories[9].id },
          ],
        },
      },
    }),
  ]);
  console.log('✅ Products created:', products.length);

  // 4. 테스트 사용자 생성 (3명)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: '김철수',
        email: 'test1@example.com',
        image: null,
        accounts: {
          create: {
            type: 'oauth',
            provider: 'kakao',
            providerAccountId: 'kakao-test-1',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: '이영희',
        email: 'test2@example.com',
        image: null,
        accounts: {
          create: {
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-test-2',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: '박민수',
        email: 'test3@example.com',
        image: null,
        accounts: {
          create: [
            {
              type: 'oauth',
              provider: 'kakao',
              providerAccountId: 'kakao-test-3',
            },
            {
              type: 'oauth',
              provider: 'google',
              providerAccountId: 'google-test-3',
            },
          ],
        },
      },
    }),
  ]);
  console.log('✅ Users created:', users.length);

  // 5. 샘플 분석 데이터 생성 (각 사용자당 2-3개)
  const analyses = await Promise.all([
    prisma.analysis.create({
      data: {
        sessionId: `sess_${Date.now()}_1`,
        userId: users[0].id,
        categoryId: categories[0].id, // 연애운
        birthDate: '1990-05-15',
        birthTime: '14:30',
        gender: 'male',
        aiResponse: {
          overall: '2025년 연애운은 매우 좋습니다.',
          details: ['봄철에 좋은 인연이 있을 것입니다.'],
        },
        viewCount: 5,
        shareCount: 1,
        isShared: true,
      },
    }),
    prisma.analysis.create({
      data: {
        sessionId: `sess_${Date.now()}_2`,
        userId: users[1].id,
        categoryId: categories[1].id, // 재물운
        birthDate: '1985-12-20',
        birthTime: '09:00',
        gender: 'female',
        aiResponse: {
          overall: '올해 재물운은 상승세입니다.',
          details: ['하반기에 투자 기회가 있을 것입니다.'],
        },
        viewCount: 12,
        shareCount: 3,
        isShared: true,
      },
    }),
    prisma.analysis.create({
      data: {
        sessionId: `sess_${Date.now()}_3`,
        userId: null, // 비회원
        categoryId: categories[2].id, // 직업운
        birthDate: '1995-03-08',
        birthTime: null,
        gender: 'male',
        aiResponse: {
          overall: '커리어 전환에 좋은 시기입니다.',
          details: ['새로운 도전을 해보세요.'],
        },
        viewCount: 3,
        shareCount: 0,
        isShared: false,
      },
    }),
  ]);
  console.log('✅ Analyses created:', analyses.length);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**package.json에 추가**:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**실행 명령**:
```bash
npm install -D ts-node
npx prisma db seed
```

---

#### 1.3 데이터베이스 마이그레이션 검증
- [ ] 모든 마이그레이션 파일 검토
- [ ] 롤백 테스트
- [ ] 프로덕션 마이그레이션 시뮬레이션

**명령어**:
```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 적용 (프로덕션)
npx prisma migrate deploy

# 스키마 검증
npx prisma validate
```

---

## 🧪 Phase 10.2: 통합 테스트 구축

**예상 소요**: 2-3일 (12-16시간)

### 작업 목록

#### 2.1 E2E 테스트 (Playwright)
관리자 패널의 주요 플로우를 E2E 테스트로 작성

**설치**:
```bash
npm install -D @playwright/test
npx playwright install
```

**파일**: `tests/admin/auth.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3000/admin/dashboard');
    await expect(page.locator('text=관리자 대시보드')).toBeVisible();
  });

  test('should fail login with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    await page.fill('input[name="username"]', 'wrong');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=로그인 실패')).toBeVisible();
  });
});
```

**파일**: `tests/admin/categories.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Category Management', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('http://localhost:3000/admin');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');
  });

  test('should create a new category', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/categories');
    await page.click('text=+ 새 카테고리');

    await page.fill('input[name="name"]', '테스트 카테고리');
    await page.fill('input[name="icon"]', '🧪');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=카테고리가 생성되었습니다')).toBeVisible();
  });

  test('should toggle category active status', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/categories');

    const firstToggle = page.locator('button:has-text("활성")').first();
    await firstToggle.click();

    // 상태가 변경되었는지 확인
    await expect(page.locator('button:has-text("비활성")').first()).toBeVisible();
  });
});
```

**파일**: `tests/admin/products.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');
  });

  test('should create a new product', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/products');
    await page.click('text=+ 새 제품');

    await page.fill('input[name="title"]', '테스트 제품');
    await page.fill('textarea[name="shortDescription"]', '이것은 테스트 제품입니다.');
    await page.fill('input[name="price"]', '50000');

    // 카테고리 선택
    await page.click('.category-selector >> text=연애운');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=제품이 생성되었습니다')).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/products');

    await page.fill('input[placeholder*="검색"]', '연애');
    await page.click('button:has-text("검색")');

    await expect(page.locator('text=연애운')).toBeVisible();
  });

  test('should paginate products', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/products');

    // 2페이지로 이동
    await page.click('button:has-text("2")');

    // URL 확인
    await expect(page).toHaveURL(/page=2/);
  });
});
```

**playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

#### 2.2 API 테스트 (Jest + Supertest)
백엔드 API 엔드포인트 테스트

**설치**:
```bash
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

**파일**: `tests/api/categories.test.ts`
```typescript
import request from 'supertest';

const API_URL = 'http://localhost:3000';
let adminToken: string;

beforeAll(async () => {
  // 관리자 로그인
  const response = await request(API_URL)
    .post('/api/admin/auth/login')
    .send({
      username: 'admin',
      password: 'admin123!',
    });

  adminToken = response.body.token;
});

describe('Category API', () => {
  test('GET /api/admin/categories - should return categories', async () => {
    const response = await request(API_URL)
      .get('/api/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.categories)).toBe(true);
  });

  test('POST /api/admin/categories - should create category', async () => {
    const newCategory = {
      name: 'API 테스트 카테고리',
      slug: 'api-test-category',
      icon: '🧪',
      color: '#FF0000',
      order: 99,
      isActive: true,
    };

    const response = await request(API_URL)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCategory);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.category.name).toBe(newCategory.name);
  });

  test('PATCH /api/admin/categories/:id - should update category', async () => {
    // 먼저 카테고리 생성
    const createResponse = await request(API_URL)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '수정 테스트',
        slug: 'update-test',
        icon: '🔧',
        order: 100,
      });

    const categoryId = createResponse.body.category.id;

    // 수정
    const updateResponse = await request(API_URL)
      .patch(`/api/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '수정됨',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.category.name).toBe('수정됨');
  });

  test('DELETE /api/admin/categories/:id - should delete category', async () => {
    // 먼저 카테고리 생성
    const createResponse = await request(API_URL)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '삭제 테스트',
        slug: 'delete-test',
        icon: '🗑️',
        order: 101,
      });

    const categoryId = createResponse.body.category.id;

    // 삭제
    const deleteResponse = await request(API_URL)
      .delete(`/api/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
  });
});
```

---

#### 2.3 컴포넌트 테스트 (React Testing Library)
UI 컴포넌트 단위 테스트

**설치**:
```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**파일**: `tests/components/Button.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/admin/ui/Button';

describe('Button Component', () => {
  test('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  test('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## ⚡ Phase 10.3: 성능 최적화 및 보안 강화

**예상 소요**: 1-2일 (6-10시간)

### 작업 목록

#### 3.1 성능 최적화
- [ ] Next.js 번들 분석
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 캐싱 전략

**번들 분석**:
```bash
npm install -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ...기존 설정
});

# 실행
ANALYZE=true npm run build
```

**이미지 최적화**:
- Next.js Image 컴포넌트 사용
- WebP 형식으로 변환
- Lazy loading 적용

**코드 스플리팅**:
```typescript
// 동적 import
const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

---

#### 3.2 보안 강화
- [ ] CSRF 토큰 구현
- [ ] Rate Limiting 강화
- [ ] XSS 방어
- [ ] SQL Injection 방어 검증
- [ ] 환경 변수 보안

**Rate Limiting (API Routes)**:
```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1분
});

export function checkRateLimit(ip: string): boolean {
  const count = rateLimit.get(ip) || 0;
  if (count >= 100) { // 분당 100회 제한
    return false;
  }
  rateLimit.set(ip, count + 1);
  return true;
}
```

**CSRF 토큰**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // POST, PUT, DELETE 요청에 CSRF 검증
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token');
    const sessionToken = request.cookies.get('csrf-token')?.value;

    if (!csrfToken || csrfToken !== sessionToken) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}
```

---

## 📚 Phase 10.4: 문서화 및 배포 준비

**예상 소요**: 1-2일 (6-10시간)

### 작업 목록

#### 4.1 API 문서화
OpenAPI/Swagger 문서 생성

**설치**:
```bash
npm install -D swagger-jsdoc swagger-ui-react
```

**파일**: `app/api-docs/route.ts`
```typescript
import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '사주우주 Admin API',
      version: '1.0.0',
      description: '사주우주 관리자 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./app/api/admin/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
```

---

#### 4.2 관리자 매뉴얼 작성
**파일**: `docs/ADMIN_MANUAL.md`

내용:
- 관리자 로그인 방법
- 카테고리 관리
- 제품 관리
- 사용자 관리
- 분석 관리
- 문제 해결 가이드

---

#### 4.3 개발자 가이드 작성
**파일**: `docs/DEVELOPER_GUIDE.md`

내용:
- 프로젝트 구조
- 개발 환경 설정
- API 엔드포인트 목록
- 데이터베이스 스키마
- 코딩 컨벤션

---

#### 4.4 Docker 설정
**파일**: `Dockerfile`
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**파일**: `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: sajuwooju
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: sajuwooju
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://sajuwooju:your_password@postgres:5432/sajuwooju"
      NEXTAUTH_SECRET: "your_secret"
      NEXTAUTH_URL: "http://localhost:3000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

#### 4.5 CI/CD 파이프라인 (GitHub Actions)
**파일**: `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Prisma migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/sajuwooju

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npx tsc --noEmit
```

---

## 📋 Phase 10 체크리스트

### 환경 설정
- [ ] `.env.example` 생성
- [ ] 시드 스크립트 작성 및 테스트
- [ ] 데이터베이스 마이그레이션 검증

### 테스트
- [ ] Playwright E2E 테스트 (최소 10개)
- [ ] Jest API 테스트 (최소 20개)
- [ ] React Testing Library 컴포넌트 테스트 (최소 10개)
- [ ] 모든 테스트 통과 확인

### 성능
- [ ] 번들 크기 < 500KB (gzip)
- [ ] Lighthouse Performance > 85
- [ ] 이미지 최적화
- [ ] 코드 스플리팅 적용

### 보안
- [ ] CSRF 토큰 구현
- [ ] Rate Limiting 적용
- [ ] XSS 방어 검증
- [ ] SQL Injection 방어 검증
- [ ] 환경 변수 보안 검증

### 문서화
- [ ] API 문서 (Swagger)
- [ ] 관리자 매뉴얼
- [ ] 개발자 가이드
- [ ] 배포 가이드
- [ ] README 업데이트

### 배포
- [ ] Dockerfile 작성
- [ ] docker-compose.yml 작성
- [ ] CI/CD 파이프라인 (GitHub Actions)
- [ ] 프로덕션 환경 변수 설정
- [ ] 모니터링 설정 (Sentry 등)

---

## 🎯 Phase 10 완료 기준

1. ✅ 모든 테스트 통과 (E2E, API, Component)
2. ✅ 성능 지표 달성 (Lighthouse > 85)
3. ✅ 보안 취약점 0개
4. ✅ 문서화 100% 완료
5. ✅ Docker 컨테이너 정상 작동
6. ✅ CI/CD 파이프라인 성공

---

**다음 단계**: Phase 11 - 프로덕션 배포 및 모니터링

---

**작성자**: Claude Code
**작성일**: 2025-01-15
**버전**: 1.0.0
