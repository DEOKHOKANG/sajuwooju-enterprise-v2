# 사주우주 (SajuWooju) Enterprise

한국 전통 사주 명리학 기반의 AI 운세 분석 플랫폼

## 프로젝트 개요

사주우주는 전통 사주 명리학을 현대적인 AI 기술과 결합하여 사용자에게 정확하고 상세한 운세 분석을 제공하는 엔터프라이즈급 웹 플랫폼입니다.

### 주요 기능

- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- 🔐 **소셜 로그인**: 카카오, 구글 OAuth 인증
- 🎯 **11가지 운세 카테고리**: 연애운, 재물운, 직업운, 건강운, 학업운 등
- 🛍️ **제품 관리 시스템**: 다양한 사주 분석 패키지
- 👨‍💼 **관리자 패널**: 완벽한 CRUD 기능의 관리 시스템
- 🤖 **AI 통합 준비**: OpenAI API 연동 구조

## 기술 스택

### Frontend
- **Framework**: Next.js 16.0.2 (App Router)
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Custom component library
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js
- **API**: RESTful API (Next.js API Routes)

### DevOps
- **Deployment**: Vercel (권장)
- **Database Hosting**: Vercel Postgres / Supabase
- **Version Control**: Git

## 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- PostgreSQL 데이터베이스

### 설치

1. **레포지토리 클론**
```bash
git clone https://github.com/yourusername/sajuwooju-enterprise.git
cd sajuwooju-enterprise
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.example .env
```

`.env` 파일을 열어 필요한 환경 변수를 설정하세요:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sajuwooju"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
# ... 기타 설정
```

4. **데이터베이스 마이그레이션**
```bash
npx prisma migrate dev
```

5. **시드 데이터 생성 (선택사항)**
```bash
npx prisma db seed
```

이 명령은 다음을 생성합니다:
- 관리자 계정 (username: admin, password: admin123!)
- 11개 카테고리
- 5개 샘플 제품
- 3명 테스트 사용자
- 4개 샘플 분석 데이터

6. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 프로젝트 구조

```
sajuwooju-enterprise/
├── app/                      # Next.js 13+ App Router
│   ├── admin/               # 관리자 패널
│   │   ├── categories/      # 카테고리 관리
│   │   ├── products/        # 제품 관리
│   │   ├── users/           # 사용자 관리
│   │   └── analyses/        # 분석 관리
│   ├── api/                 # API Routes
│   │   └── admin/           # 관리자 API
│   └── page.tsx             # 메인 페이지
├── components/              # React 컴포넌트
│   ├── admin/              # 관리자 컴포넌트
│   └── ui/                 # 공통 UI 컴포넌트
├── lib/                    # 유틸리티 함수
├── prisma/                 # Prisma 스키마 및 마이그레이션
│   ├── schema.prisma       # 데이터베이스 스키마
│   └── seed.ts             # 시드 데이터
├── public/                 # 정적 파일
└── docs/                   # 문서
```

## 관리자 패널

### 접속 방법

1. [http://localhost:3000/admin](http://localhost:3000/admin) 접속
2. 기본 계정 정보:
   - Username: `admin`
   - Password: `admin123!`

### 주요 기능

#### 카테고리 관리
- 카테고리 생성/수정/삭제
- 아이콘, 색상, 순서 설정
- 활성/비활성 상태 토글

#### 제품 관리
- 제품 생성/수정/삭제
- 가격 및 할인가 설정
- 멀티 카테고리 지정
- 주요 기능 목록 관리
- 검색 및 필터링
- 페이지네이션 (20개/페이지)

#### 사용자 관리
- 사용자 목록 조회
- OAuth 제공자 확인
- 활동 통계 (분석, MySaju, 공유)
- 검색 기능

#### 분석 관리
- 분석 기록 조회
- 카테고리별 필터링
- 공유 상태 필터링
- 분석 삭제

## API 문서

### 관리자 API

모든 관리자 API는 JWT 인증이 필요합니다.

**인증 헤더**:
```
Authorization: Bearer <token>
```

### 카테고리 API

#### GET /api/admin/categories
카테고리 목록 조회

**쿼리 파라미터**:
- `includeInactive`: 비활성 카테고리 포함 (default: false)
- `includeProductCount`: 제품 수 포함 (default: false)

#### POST /api/admin/categories
카테고리 생성

**Body**:
```json
{
  "name": "연애운",
  "slug": "love-fortune",
  "description": "설명",
  "icon": "💖",
  "color": "#FF6B9D",
  "order": 1,
  "isActive": true
}
```

#### PATCH /api/admin/categories/[id]
카테고리 수정

#### DELETE /api/admin/categories/[id]
카테고리 삭제

### 제품 API

#### GET /api/admin/products
제품 목록 조회

**쿼리 파라미터**:
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 20)
- `search`: 검색어
- `isActive`: 활성 상태 필터

#### POST /api/admin/products
제품 생성

**Body**:
```json
{
  "title": "제품명",
  "slug": "product-slug",
  "shortDescription": "짧은 설명",
  "fullDescription": "상세 설명",
  "features": ["기능1", "기능2"],
  "price": 50000,
  "discountPrice": 40000,
  "isActive": true,
  "isFeatured": false,
  "categoryIds": ["uuid1", "uuid2"]
}
```

### 사용자 API

#### GET /api/admin/users
사용자 목록 조회

**쿼리 파라미터**:
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `search`: 이름 또는 이메일 검색
- `sortBy`: 정렬 기준 (default: createdAt)
- `sortOrder`: 정렬 순서 (asc/desc)

### 분석 API

#### GET /api/admin/analyses
분석 목록 조회

**쿼리 파라미터**:
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `search`: 세션 ID 또는 사용자 이름 검색
- `categoryId`: 카테고리 필터
- `isShared`: 공유 상태 필터

## 데이터베이스 스키마

주요 테이블:

- **Admin**: 관리자 계정
- **User**: 일반 사용자
- **Account**: OAuth 계정 연결
- **Category**: 운세 카테고리
- **Product**: 사주 분석 제품
- **Analysis**: 사주 분석 기록
- **MySaju**: 사용자의 저장된 사주

자세한 스키마는 `prisma/schema.prisma` 참조

## 배포

### Vercel 배포 (권장)

1. **Vercel CLI 설치**
```bash
npm i -g vercel
```

2. **프로젝트 배포**
```bash
vercel
```

3. **환경 변수 설정**
Vercel 대시보드에서 환경 변수 설정:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- OAuth 클라이언트 ID 및 시크릿

4. **프로덕션 배포**
```bash
vercel --prod
```

### Docker 배포

```bash
docker-compose up -d
```

## 개발 가이드

### 코드 스타일

- ESLint + Prettier 사용
- TypeScript strict mode
- Tailwind CSS 유틸리티 우선

### 테스트

```bash
# 유닛 테스트
npm test

# E2E 테스트
npm run test:e2e
```

### 빌드

```bash
npm run build
```

### Prisma Studio (데이터베이스 GUI)

```bash
npx prisma studio
```

## 라이선스

MIT License

## 기여

기여를 환영합니다! Pull Request를 보내주세요.

## 연락처

- 이메일: admin@sajuwooju.com
- 웹사이트: https://sajuwooju.vercel.app

---

**Made with ❤️ by SajuWooju Team**
