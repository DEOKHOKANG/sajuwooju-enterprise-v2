# Production Database Setup Guide
**사주우주 엔터프라이즈 - 프로덕션 데이터베이스 설정**

생성일: 2025-11-17
문제: `/saju` 페이지가 404를 표시 (데이터베이스에 데이터가 없음)
해결: 프로덕션 데이터베이스에 마이그레이션 및 시드 실행

---

## 🔍 문제 진단

### 증상
- `/saju` 페이지 접속 시 "페이지를 찾을 수 없습니다" 표시
- 카테고리 클릭 시 무한 로딩
- E2E 테스트 실패 (4/29 통과)

### 원인
프로덕션 데이터베이스가 비어있음:
- `SajuCategory` 테이블: 0개
- `SajuTemplate` 테이블: 0개
- `SajuContent` 테이블: 0개

---

## 🚀 해결 방법

### 옵션 1: 로컬에서 프로덕션 DB에 접속 (권장)

#### 1단계: Vercel Postgres 연결 정보 가져오기

```bash
# Vercel Dashboard에서:
1. Storage → sajuwooju-db 클릭
2. .env.local 탭 선택
3. "Show secret" 클릭
4. POSTGRES_PRISMA_URL 복사
```

#### 2단계: 로컬 환경에 연결 정보 설정

```bash
cd sajuwooju-enterprise

# .env.production 파일 생성
echo "DATABASE_URL=<복사한-POSTGRES_PRISMA_URL>" > .env.production
```

**예시**:
```env
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGci...
```

#### 3단계: 마이그레이션 실행

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 적용
DATABASE_URL="<프로덕션-URL>" npx prisma db push

# 결과 확인
✅ Your database is now in sync with your Prisma schema.
```

#### 4단계: 시드 데이터 생성

##### 옵션 A: 기본 시드 (풀 데이터)
```bash
DATABASE_URL="<프로덕션-URL>" npx prisma db seed

# 생성되는 데이터:
# - 관리자 계정 (admin/admin123!)
# - 카테고리 8개
# - 제품 12개
# - 기타 샘플 데이터
```

##### 옵션 B: 테스트 시드 (최소 데이터)
```bash
DATABASE_URL="<프로덕션-URL>" npx tsx scripts/create-test-saju-data.ts

# 생성되는 데이터:
# - 카테고리 3개 (연애운, 재물운, 직업운)
# - 템플릿 3개
# - 콘텐츠 4개
```

#### 5단계: 결과 확인

```bash
# Vercel Postgres Data 탭에서 확인
Vercel Dashboard → Storage → sajuwooju-db → Data

# 확인사항:
✅ SajuCategory: 3-8개
✅ SajuTemplate: 3개 이상
✅ SajuContent: 4개 이상 (status = 'published')
```

---

### 옵션 2: Vercel CLI 사용

```bash
# 1. Vercel CLI 설치 및 로그인
npm install -g vercel
vercel login --token QeozRVkagSj3QzumQNFkO8iO

# 2. 프로덕션 환경에서 명령 실행
vercel env pull .env.production

# 3. 마이그레이션 및 시드
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma db push
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma db seed
```

---

### 옵션 3: Vercel Postgres 직접 접속

#### SQL로 수동 생성 (최후의 수단)

```sql
-- Vercel Dashboard → Storage → sajuwooju-db → Query 탭

-- 1. 카테고리 생성
INSERT INTO "SajuCategory" (
  id, name, slug, description, "shortDesc", icon, color, gradient,
  "order", "isActive", "createdAt", "updatedAt"
) VALUES
  (
    gen_random_uuid(),
    '연애운',
    'love-fortune',
    '사랑과 인연에 대한 운세를 확인하세요',
    '당신의 연애운을 확인해보세요',
    '💕',
    '#FF6B9D',
    'from-pink-500 to-rose-500',
    1,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '재물운',
    'wealth-fortune',
    '금전과 재물에 대한 운세를 확인하세요',
    '당신의 재물운을 확인해보세요',
    '💰',
    '#FFD700',
    'from-amber-400 to-yellow-500',
    2,
    true,
    NOW(),
    NOW()
  );

-- 2. 템플릿 및 콘텐츠는 Prisma 시드 사용 권장
```

---

## 📋 체크리스트

### 마이그레이션 전
- [ ] Vercel Postgres 연결 정보 확인
- [ ] DATABASE_URL 환경 변수 설정
- [ ] 로컬에서 프로덕션 DB 연결 테스트

### 마이그레이션 실행
- [ ] `npx prisma generate` 성공
- [ ] `npx prisma db push` 성공
- [ ] 테이블 생성 확인 (Vercel Data 탭)

### 시드 데이터 생성
- [ ] 시드 스크립트 선택 (기본 or 테스트)
- [ ] 시드 실행 성공
- [ ] 데이터 생성 확인:
  - [ ] SajuCategory > 0
  - [ ] SajuTemplate > 0
  - [ ] SajuContent > 0 (published)

### 배포 후 검증
- [ ] `/saju` 페이지 접속 → 카테고리 표시 확인
- [ ] 카테고리 클릭 → 콘텐츠 목록 확인
- [ ] 콘텐츠 클릭 → 상세 페이지 확인
- [ ] E2E 테스트 재실행 → 통과율 85%+ 확인

---

## 🔧 트러블슈팅

### 문제 1: DATABASE_URL 연결 실패

**에러**:
```
Error: P6008: Accelerate was not able to connect to your database
```

**해결**:
1. POSTGRES_PRISMA_URL (NOT POSTGRES_URL) 사용 확인
2. Vercel Dashboard에서 최신 URL 재확인
3. IP 화이트리스트 설정 확인 (Vercel는 자동)

### 문제 2: Prisma generate 실패

**에러**:
```
Error: Schema parsing failed
```

**해결**:
```bash
# Prisma 클라이언트 재생성
rm -rf node_modules/.prisma
npm install
npx prisma generate
```

### 문제 3: 시드 데이터가 보이지 않음

**확인사항**:
1. `isActive = true` 설정 확인
2. `status = 'published'` 확인 (Content)
3. Vercel Data 탭에서 직접 쿼리:

```sql
SELECT COUNT(*) FROM "SajuCategory" WHERE "isActive" = true;
SELECT COUNT(*) FROM "SajuContent" WHERE status = 'published';
```

### 문제 4: /saju 페이지가 여전히 404

**디버깅**:
```bash
# 로컬에서 프로덕션 DB 사용해서 테스트
DATABASE_URL="<프로덕션-URL>" npm run dev

# 브라우저에서 http://localhost:3000/saju 접속
# 개발자 도구 → Network 탭 → API 요청 확인
```

**확인사항**:
1. 카테고리가 실제로 `isActive: true`인지
2. Prisma 쿼리가 데이터를 찾는지
3. 브라우저 콘솔에 에러 없는지

---

## 🎯 빠른 해결 (5분)

```bash
# 1. Vercel에서 DATABASE_URL 복사
# Vercel Dashboard → Storage → sajuwooju-db → .env.local → POSTGRES_PRISMA_URL

# 2. 환경 변수 설정 및 시드 실행
export DATABASE_URL="<복사한-URL>"
cd sajuwooju-enterprise
npx prisma generate
npx prisma db push
npx tsx scripts/create-test-saju-data.ts

# 3. Vercel에서 확인
# Storage → sajuwooju-db → Data → SajuCategory (3개 확인)

# 4. /saju 페이지 접속 테스트
# https://your-app.vercel.app/saju
```

---

## 📊 예상 결과

### 시드 전
```
SajuCategory: 0
SajuTemplate: 0
SajuContent: 0
/saju 페이지: 404 에러
E2E 테스트: 4/29 통과 (13.8%)
```

### 시드 후
```
SajuCategory: 3-8
SajuTemplate: 3+
SajuContent: 4+
/saju 페이지: ✅ 카테고리 그리드 표시
E2E 테스트: 25/29 통과 (85%+)
```

---

## 📚 관련 문서

- [DEPLOYMENT_GUIDE_VERCEL.md](./DEPLOYMENT_GUIDE_VERCEL.md) - 전체 배포 가이드
- [PRODUCTION_FIX_SUMMARY.md](./PRODUCTION_FIX_SUMMARY.md) - `/saju` 404 수정 내역
- [prisma/seed.ts](./prisma/seed.ts) - 기본 시드 스크립트
- [scripts/create-test-saju-data.ts](./scripts/create-test-saju-data.ts) - 테스트 시드 스크립트

---

**생성일**: 2025-11-17
**상태**: Ready to Execute
**예상 소요 시간**: 5-10분
**다음 단계**: DATABASE_URL 확보 후 시드 실행 🚀
