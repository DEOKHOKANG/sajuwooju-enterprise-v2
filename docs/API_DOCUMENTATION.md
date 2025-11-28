# API Documentation

사주우주(SajuWooju) REST API 문서

**Version**: 1.0.0
**Base URL**: `https://sajuwooju.vercel.app/api`
**Authentication**: JWT Bearer Token (관리자 API만 해당)

---

## 📑 목차

1. [인증](#인증)
2. [관리자 API](#관리자-api)
   - [카테고리 관리](#카테고리-관리)
   - [제품 관리](#제품-관리)
   - [사용자 관리](#사용자-관리)
   - [분석 관리](#분석-관리)
3. [공개 API](#공개-api)
4. [에러 코드](#에러-코드)
5. [Rate Limiting](#rate-limiting)

---

## 인증

### 관리자 로그인

관리자 패널 접근을 위한 JWT 토큰을 발급받습니다.

```http
POST /api/admin/auth
```

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "admin-id",
    "username": "admin",
    "email": "admin@sajuwooju.com",
    "name": "Admin User"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": "인증 정보가 올바르지 않습니다."
}
```

**Rate Limit**: 15분에 10회

---

## 관리자 API

모든 관리자 API는 **Authorization 헤더**가 필요합니다:

```
Authorization: Bearer {token}
```

---

### 카테고리 관리

#### 카테고리 목록 조회

```http
GET /api/admin/categories?page=1&limit=20&search=연애&sortBy=createdAt&sortOrder=desc
```

**Query Parameters**:
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| page | number | ❌ | 페이지 번호 | 1 |
| limit | number | ❌ | 페이지 크기 | 20 |
| search | string | ❌ | 검색어 (이름) | - |
| sortBy | string | ❌ | 정렬 필드 | createdAt |
| sortOrder | string | ❌ | 정렬 순서 (asc/desc) | desc |
| isActive | boolean | ❌ | 활성화 상태 | - |

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-uuid",
      "name": "연애운",
      "slug": "love-fortune",
      "description": "사랑과 인연에 관한 운세",
      "icon": "💖",
      "color": "#FF6B9D",
      "gradient": "from-pink-500 to-rose-500",
      "order": 1,
      "isActive": true,
      "_count": {
        "products": 5
      },
      "createdAt": "2025-11-15T00:00:00.000Z",
      "updatedAt": "2025-11-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 11,
    "totalPages": 1
  }
}
```

---

#### 카테고리 생성

```http
POST /api/admin/categories
```

**Request Body**:
```json
{
  "name": "건강운",
  "slug": "health-fortune",
  "description": "건강과 웰빙에 관한 운세",
  "icon": "🏥",
  "color": "#32CD32",
  "gradient": "from-green-500 to-emerald-500",
  "order": 4,
  "isActive": true
}
```

**Validation Rules**:
- `name`: 1-50자 (필수)
- `slug`: 소문자, 숫자, 하이픈만 허용 (필수)
- `description`: 최대 500자 (선택)
- `icon`: 최대 10자 (선택)
- `color`: #RRGGBB 형식 (선택)
- `gradient`: 최대 100자 (선택)
- `order`: 0 이상 정수 (선택)
- `isActive`: boolean (선택)

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "new-cat-uuid",
    "name": "건강운",
    "slug": "health-fortune",
    ...
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Slug가 이미 존재합니다.",
  "code": "DUPLICATE_SLUG"
}
```

---

#### 카테고리 수정

```http
PATCH /api/admin/categories/{categoryId}
```

**Request Body**: 카테고리 생성과 동일 (모든 필드 선택)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "cat-uuid",
    "name": "업데이트된 이름",
    ...
  }
}
```

---

#### 카테고리 삭제

```http
DELETE /api/admin/categories/{categoryId}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "카테고리가 삭제되었습니다."
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "이 카테고리에 연결된 제품이 있습니다.",
  "code": "CATEGORY_HAS_PRODUCTS"
}
```

---

### 제품 관리

#### 제품 목록 조회

```http
GET /api/admin/products?page=1&limit=20&categoryId=cat-uuid&search=프리미엄&isFeatured=true
```

**Query Parameters**:
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| page | number | ❌ | 페이지 번호 | 1 |
| limit | number | ❌ | 페이지 크기 | 20 |
| search | string | ❌ | 검색어 (제목) | - |
| categoryId | string | ❌ | 카테고리 ID 필터 | - |
| sortBy | string | ❌ | 정렬 필드 | createdAt |
| sortOrder | string | ❌ | 정렬 순서 | desc |
| isActive | boolean | ❌ | 활성화 필터 | - |
| isFeatured | boolean | ❌ | Featured 필터 | - |

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-uuid",
      "title": "프리미엄 연애운 분석",
      "slug": "premium-love-fortune",
      "shortDescription": "AI 기반 연애운 분석",
      "fullDescription": "상세 설명...",
      "price": 30000,
      "discountPrice": 24000,
      "features": [
        "AI 기반 분석",
        "상세 리포트"
      ],
      "imageUrl": null,
      "isActive": true,
      "isFeatured": true,
      "categories": [
        {
          "id": "cat-uuid",
          "name": "연애운",
          "slug": "love-fortune"
        }
      ],
      "createdAt": "2025-11-15T00:00:00.000Z",
      "updatedAt": "2025-11-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

#### 제품 생성

```http
POST /api/admin/products
```

**Request Body**:
```json
{
  "title": "커리어 컨설팅",
  "slug": "career-consulting",
  "shortDescription": "직업운 및 진로 상담",
  "fullDescription": "상세 설명입니다...",
  "price": 40000,
  "discountPrice": 35000,
  "features": [
    "타고난 적성 분석",
    "최적 직업군 추천"
  ],
  "imageUrl": null,
  "isActive": true,
  "isFeatured": false,
  "categoryIds": ["cat-uuid-1", "cat-uuid-2"]
}
```

**Validation Rules**:
- `title`: 1-200자 (필수)
- `slug`: 소문자, 숫자, 하이픈 (필수)
- `shortDescription`: 최대 500자 (선택)
- `fullDescription`: 무제한 (선택)
- `price`: 0 이상 정수 (필수)
- `discountPrice`: 0 이상 정수 (선택)
- `features`: 문자열 배열 (선택)
- `imageUrl`: 유효한 URL (선택)
- `categoryIds`: UUID 배열 (선택)

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "new-prod-uuid",
    "title": "커리어 컨설팅",
    ...
  }
}
```

---

#### 제품 수정

```http
PATCH /api/admin/products/{productId}
```

**Request Body**: 제품 생성과 동일 (모든 필드 선택)

---

#### 제품 삭제

```http
DELETE /api/admin/products/{productId}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "제품이 삭제되었습니다."
}
```

---

### 사용자 관리

#### 사용자 목록 조회

```http
GET /api/admin/users?page=1&limit=20&search=김철수
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "name": "김철수",
      "email": "test1@example.com",
      "image": null,
      "accounts": [
        {
          "provider": "kakao",
          "providerAccountId": "kakao_123"
        }
      ],
      "_count": {
        "analyses": 5,
        "mySaju": 3,
        "sharedAnalyses": 2
      },
      "createdAt": "2025-11-15T00:00:00.000Z",
      "lastLoginAt": "2025-11-15T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

---

### 분석 관리

#### 분석 기록 목록 조회

```http
GET /api/admin/analyses?page=1&limit=20&categoryId=cat-uuid&isShared=true
```

**Query Parameters**:
- `categoryId`: 카테고리 필터
- `isShared`: 공유 여부 필터
- `search`: 세션 ID 또는 사용자 이름 검색

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "analysis-uuid",
      "sessionId": "session_123",
      "category": {
        "id": "cat-uuid",
        "name": "연애운",
        "slug": "love-fortune",
        "icon": "💖"
      },
      "user": {
        "id": "user-uuid",
        "name": "김철수",
        "email": "test@example.com"
      },
      "birthDate": "1990-05-15T00:00:00.000Z",
      "birthTime": "14:30",
      "gender": "MALE",
      "viewCount": 15,
      "shareCount": 3,
      "isShared": true,
      "createdAt": "2025-11-08T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 4,
    "totalPages": 1
  }
}
```

---

#### 분석 삭제

```http
DELETE /api/admin/analyses/{analysisId}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "분석이 삭제되었습니다."
}
```

---

## 공개 API

### 카테고리 목록 (공개)

```http
GET /api/categories
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-uuid",
      "name": "연애운",
      "slug": "love-fortune",
      "description": "사랑과 인연에 관한 운세",
      "icon": "💖",
      "color": "#FF6B9D",
      "gradient": "from-pink-500 to-rose-500"
    }
  ]
}
```

---

## 에러 코드

### HTTP 상태 코드

| 코드 | 설명 |
|------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 (Validation 실패) |
| 401 | 인증 실패 |
| 403 | 권한 없음 (CSRF, Rate Limit) |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복) |
| 429 | Rate Limit 초과 |
| 500 | 서버 에러 |

### 커스텀 에러 코드

```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE"
}
```

**에러 코드 목록**:
- `VALIDATION_ERROR`: 입력값 검증 실패
- `DUPLICATE_SLUG`: Slug 중복
- `CATEGORY_NOT_FOUND`: 카테고리 없음
- `PRODUCT_NOT_FOUND`: 제품 없음
- `CATEGORY_HAS_PRODUCTS`: 카테고리에 제품 존재
- `CSRF_TOKEN_MISSING`: CSRF 토큰 없음
- `CSRF_TOKEN_INVALID`: CSRF 토큰 무효
- `RATE_LIMIT_EXCEEDED`: Rate Limit 초과

---

## Rate Limiting

### 제한 정책

| 엔드포인트 | 제한 | 윈도우 |
|------------|------|--------|
| `/api/admin/auth` | 10회 | 15분 |
| `/api/admin/*` | 100회 | 1분 |
| 기타 API | 100회 | 1분 |

### Rate Limit 헤더

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1731654000
Retry-After: 60
```

### Rate Limit 초과 응답

```http
HTTP/1.1 429 Too Many Requests
```

```json
{
  "success": false,
  "error": "요청 횟수 제한을 초과했습니다. 잠시 후 다시 시도해주세요.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

---

## 보안

### HTTPS 필수

프로덕션 환경에서는 **HTTPS만 허용**됩니다.

### CSRF 보호

POST, PUT, PATCH, DELETE 요청 시 CSRF 토큰이 필요합니다:

```
X-CSRF-Token: {token}
Cookie: csrf-token={token}:{signature}
```

### 보안 헤더

모든 응답에 다음 보안 헤더가 포함됩니다:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy: ...`
- `Strict-Transport-Security: max-age=31536000` (HTTPS only)

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-11-15
