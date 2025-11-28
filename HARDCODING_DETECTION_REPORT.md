# 🔍 하드코딩 탐지 보고서

**검사 일시**: 2025-11-15
**검사 대상**: https://sajuwooju-enterprise-ejtxz7761-kevinglecs-projects.vercel.app
**검사 도구**: Playwright E2E + Manual Analysis

---

## 🚨 Critical Issues (치명적)

### 1. **데이터베이스 연결 실패로 인한 무한 로딩**
- **심각도**: 🔴 CRITICAL
- **위치**: 모든 페이지
- **증상**:
  - 페이지가 `networkidle` 상태에 도달하지 못함 (30초 타임아웃)
  - 스켈레톤 UI만 표시되고 실제 데이터 렌더링 안 됨
  - `HeroSliderSkeleton`, `CategoryIconSkeleton`, `ProductCardSkeleton`만 표시

```html
<!-- 홈페이지 실제 렌더링 상태 -->
<div className="py-4 sm:py-6 md:py-8">
  <HeroSliderSkeleton />  <!-- 무한 로딩 -->
</div>

<div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
  <CategoryIconSkeleton key="0" />  <!-- 11개 스켈레톤만 표시 -->
  <CategoryIconSkeleton key="1" />
  ...
</div>

<div className="space-y-3 sm:space-y-4">
  <ProductCardSkeleton key="0" />  <!-- 5개 스켈레톤만 표시 -->
  <ProductCardSkeleton key="1" />
  ...
</div>
```

**원인**:
1. DATABASE_URL 환경 변수 미설정
2. API 엔드포인트가 데이터베이스 연결 실패로 응답하지 못함
3. Client 컴포넌트가 무한 로딩 상태에 빠짐

**해결책**:
```bash
# Vercel 대시보드에서 환경 변수 설정 필요
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
등등 (DEPLOYMENT_SUCCESS.md 참고)
```

---

### 2. **메타데이터 하드코딩 (localhost URL)**
- **심각도**: 🔴 CRITICAL
- **위치**: 모든 페이지 메타데이터
- **증상**:

```html
<meta property="og:url" content="http://localhost:3000"/>
<meta property="og:image" content="http://localhost:3000/opengraph-image?eb097c45b55486c2"/>
<meta property="og:image" content="http://localhost:3000/og-image.jpg"/>
```

**문제점**:
- 프로덕션 배포 환경에서 `localhost:3000` URL 사용
- SNS 공유 시 잘못된 이미지/링크 표시
- SEO 최적화 실패

**원인**:
- `NEXT_PUBLIC_SITE_URL` 환경 변수 미설정
- `next.config.js` 또는 `app/layout.tsx`에서 하드코딩된 `localhost` 사용

**해결책**:
```typescript
// app/layout.tsx 또는 metadata 생성 부분
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    url: siteUrl,
    images: [`${siteUrl}/og-image.jpg`],
  },
};
```

---

## 🟠 High Priority Issues

### 3. **API 엔드포인트 응답 없음**
- **심각도**: 🟠 HIGH
- **위치**: `/api/products`, `/api/categories`, `/api/slider`
- **증상**: API 호출은 되지만 응답이 없거나 에러 반환

**테스트 결과**:
```bash
# 제품 API 확인
curl https://sajuwooju-enterprise-ejtxz7761-kevinglecs-projects.vercel.app/api/products
# 예상: 데이터베이스 연결 에러 또는 빈 응답
```

**원인**:
- Prisma Client가 DATABASE_URL 없이 초기화되지 못함
- API 라우트에서 `prisma.product.findMany()` 실행 실패

**해결책**:
1. DATABASE_URL 설정
2. Prisma 마이그레이션 실행
3. 시드 데이터 삽입

---

### 4. **하드코딩된 404 페이지 링크**
- **심각도**: 🟠 HIGH
- **위치**: 404 Not Found 페이지
- **증상**:

```tsx
// 404 페이지에 하드코딩된 링크들
<Link href="/coupons">쿠폰함</Link>
<Link href="/reports">상담 내역</Link>
<Link href="/support">고객센터</Link>
<Link href="/settings">설정</Link>
<Link href="/privacy">개인정보</Link>
<Link href="/terms">이용약관</Link>
```

**문제점**:
- 이 페이지들이 실제로 존재하지 않음
- 사용자가 클릭 시 또 다른 404 페이지로 이동
- 데이터베이스에서 동적으로 가져와야 할 메뉴 링크를 하드코딩

**해결책**:
1. 존재하지 않는 링크 제거
2. 또는 해당 페이지들 구현
3. 메뉴 링크를 데이터베이스 기반으로 변경

---

## 🟡 Medium Priority Issues

### 5. **정적 이미지 경로 하드코딩 가능성**
- **심각도**: 🟡 MEDIUM
- **위치**: 제품 카드, 슬라이더 이미지
- **증상**: 현재 로딩되지 않아 확인 불가능하지만, 데이터가 있을 경우 정적 경로 사용 가능성 높음

**예상 문제**:
```typescript
// 하드코딩 예시 (제품 데이터)
{
  image: '/images/products/product1.jpg',  // ❌ 정적 경로
  // 올바른 방법:
  image: 'https://cdn.example.com/products/uuid-123.jpg'  // ✅ CDN URL
}
```

**해결책**:
1. 이미지 CDN 사용 (Cloudinary, ImageKit 등)
2. Prisma 스키마의 `imageUrl` 필드를 CDN URL로 저장
3. Next.js Image Optimization 활용

---

### 6. **클라이언트 측 필터링 로직 (추정)**
- **심각도**: 🟡 MEDIUM
- **위치**: 카테고리 페이지, 검색 페이지
- **증상**: 현재 로딩되지 않아 확인 불가능

**예상 문제**:
- 모든 제품 데이터를 클라이언트로 전송 후 필터링
- 서버 측 API 필터링 미사용

**해결책**:
```typescript
// ❌ 클라이언트 측 필터링
const filteredProducts = products.filter(p => p.category === selectedCategory);

// ✅ 서버 측 API 호출
const response = await fetch(`/api/products?category=${selectedCategory}`);
```

---

### 7. **페이지네이션 미구현 가능성**
- **심각도**: 🟡 MEDIUM
- **위치**: 제품 목록 페이지
- **증상**: Playwright 테스트에서 페이지네이션 버튼을 찾지 못함

**예상 문제**:
- 모든 제품을 한 번에 로딩 (성능 저하)
- 무한 스크롤만 사용 (접근성 문제)

**해결책**:
```typescript
// API 라우트에 페이지네이션 추가
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
}
```

---

## 🟢 Low Priority Issues

### 8. **리뷰/댓글 시스템 미구현**
- **심각도**: 🟢 LOW
- **위치**: 제품 상세 페이지
- **증상**: 리뷰 섹션을 찾지 못함

**현재 상태**: 리뷰 기능 자체가 구현되지 않음
**우선순위**: 낮음 (핵심 기능 아님)

---

### 9. **실시간 알림 시스템 미구현**
- **심각도**: 🟢 LOW
- **위치**: 헤더 알림 아이콘
- **증상**: WebSocket 연결 없음, 폴링 없음

**현재 상태**: 알림 기능 미구현
**우선순위**: 낮음 (향후 추가 기능)

---

### 10. **이미지 Lazy Loading 미적용**
- **심각도**: 🟢 LOW
- **위치**: 모든 이미지
- **증상**: 현재 이미지가 로딩되지 않아 확인 불가

**해결책**:
```tsx
// Next.js Image 컴포넌트 사용
<Image
  src={product.imageUrl}
  loading="lazy"  // Lazy loading
  alt={product.title}
/>
```

---

## 📊 요약 통계

| 심각도 | 개수 | 이슈 |
|--------|------|------|
| 🔴 Critical | 2 | 데이터베이스 미연결, 메타데이터 localhost 하드코딩 |
| 🟠 High | 2 | API 응답 없음, 404 페이지 하드코딩 링크 |
| 🟡 Medium | 3 | 정적 이미지, 클라이언트 필터링, 페이지네이션 미구현 |
| 🟢 Low | 3 | 리뷰 미구현, 알림 미구현, Lazy Loading 미적용 |
| **합계** | **10** | |

---

## 🎯 즉시 조치 사항 (Critical)

### 1️⃣ 환경 변수 설정 (최우선)
```bash
# Vercel 대시보드에서 다음 환경 변수 추가
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://sajuwooju-enterprise-ejtxz7761-kevinglecs-projects.vercel.app
NEXTAUTH_SECRET=...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=...
JWT_SECRET=...
CSRF_SECRET=...
```

### 2️⃣ 데이터베이스 마이그레이션 및 시딩
```bash
# 로컬에서 실행 후 배포
npx prisma migrate deploy
npx prisma db seed
```

### 3️⃣ 메타데이터 수정
```typescript
// app/layout.tsx
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                'http://localhost:3000');
```

### 4️⃣ 재배포
```bash
cd sajuwooju-enterprise
npx vercel --prod
```

---

## 📋 검증 체크리스트

환경 변수 설정 후 다음 항목들을 확인하세요:

- [ ] 홈페이지가 30초 이내에 로딩 완료
- [ ] 제품 카드가 실제 데이터로 렌더링됨 (스켈레톤 아님)
- [ ] 카테고리 아이콘이 표시됨
- [ ] 슬라이더가 동작함
- [ ] 메타 태그의 URL이 `localhost`가 아닌 실제 도메인
- [ ] `/api/products` 엔드포인트가 200 응답
- [ ] `/api/categories` 엔드포인트가 200 응답
- [ ] 제품 클릭 시 상세 페이지 이동
- [ ] 관리자 로그인 가능
- [ ] 관리자 대시보드 통계 표시

---

**보고서 생성**: 2025-11-15
**검사자**: Claude Code (Playwright E2E Testing)
