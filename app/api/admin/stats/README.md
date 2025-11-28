# Admin Statistics API Documentation

관리자 대시보드용 실시간 통계 API 문서

## 개요

관리자 패널에서 사용할 수 있는 4개의 통계 API 엔드포인트를 제공합니다.
모든 API는 JWT 기반 인증이 필요하며, `read` 권한 이상이 있어야 접근할 수 있습니다.

## 인증

모든 API 요청에는 다음 중 하나의 방식으로 JWT 토큰을 포함해야 합니다:

### 1. Authorization Header (권장)
```bash
Authorization: Bearer <JWT_TOKEN>
```

### 2. Cookie
```bash
Cookie: admin_token=<JWT_TOKEN>
```

## 권한

- **super_admin**: 모든 API 접근 가능
- **editor**: 모든 통계 API 접근 가능 (read 권한)
- **viewer**: 모든 통계 API 접근 가능 (read 권한)

---

## API 엔드포인트

### 1. Overview Statistics (전체 개요)

**Endpoint**: `GET /api/admin/stats/overview`

**설명**: 관리자 대시보드 메인 화면에 표시할 핵심 통계 데이터

**권한**: `read`

**응답 예시**:
```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 1250,
      "active": 342,
      "thisMonth": 87,
      "lastMonth": 65,
      "growthRate": 33.85
    },
    "products": {
      "total": 31,
      "active": 30,
      "inactive": 1
    },
    "categories": {
      "total": 11
    },
    "analyses": {
      "total": 5678,
      "thisMonth": 456,
      "lastMonth": 389,
      "growthRate": 17.22
    },
    "orders": {
      "total": 0,
      "thisMonth": 0,
      "lastMonth": 0,
      "growthRate": 0
    },
    "revenue": {
      "total": 0,
      "thisMonth": 0,
      "lastMonth": 0,
      "growthRate": 0
    }
  },
  "timestamp": "2025-01-15T12:34:56.789Z"
}
```

**필드 설명**:
- `users`: 사용자 통계
  - `total`: 전체 사용자 수
  - `active`: 활성 사용자 수 (최근 30일 로그인)
  - `thisMonth`: 이번달 신규 가입자
  - `lastMonth`: 지난달 신규 가입자
  - `growthRate`: 전월 대비 성장률 (%)
- `products`: 제품 통계
  - `total`: 전체 제품 수
  - `active`: 활성 제품 수
  - `inactive`: 비활성 제품 수
- `categories`: 카테고리 통계
- `analyses`: 사주 분석 통계
- `orders`: 주문 통계 (추후 구현)
- `revenue`: 매출 통계 (추후 구현)

**캐싱**: 5분 (`Cache-Control: private, s-maxage=300`)

---

### 2. User Statistics (사용자 통계)

**Endpoint**: `GET /api/admin/stats/users`

**설명**: 사용자 관련 상세 통계 및 차트 데이터

**권한**: `read`

**쿼리 파라미터**:
- `period`: 조회 기간 (선택)
  - `7d`: 최근 7일
  - `30d`: 최근 30일 (기본값)
  - `90d`: 최근 90일
  - `1y`: 최근 1년

**요청 예시**:
```bash
GET /api/admin/stats/users?period=30d
```

**응답 예시**:
```json
{
  "success": true,
  "stats": {
    "overview": {
      "total": 1250,
      "new": 87,
      "active": 342,
      "period": "30d"
    },
    "providers": [
      {
        "provider": "kakao",
        "count": 856
      },
      {
        "provider": "google",
        "count": 394
      }
    ],
    "growthChart": [
      {
        "date": "2025-01-01",
        "count": 12
      },
      {
        "date": "2025-01-02",
        "count": 8
      }
    ],
    "recentUsers": [
      {
        "id": "user_123",
        "name": "홍길동",
        "email": "hong@example.com",
        "image": "https://...",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "lastLoginAt": "2025-01-15T12:00:00.000Z"
      }
    ],
    "topUsers": [
      {
        "user": {
          "id": "user_456",
          "name": "김철수",
          "email": "kim@example.com",
          "image": "https://..."
        },
        "analysisCount": 45
      }
    ]
  },
  "timestamp": "2025-01-15T12:34:56.789Z"
}
```

**필드 설명**:
- `overview`: 전체 개요
  - `total`: 전체 사용자 수
  - `new`: 기간 내 신규 가입자
  - `active`: 기간 내 활성 사용자
  - `period`: 조회 기간
- `providers`: OAuth 제공자별 분포
- `growthChart`: 일별 신규 가입자 차트 데이터
- `recentUsers`: 최근 가입 사용자 (최대 10명)
- `topUsers`: 최다 사주 분석 사용자 TOP 10

**캐싱**: 5분

---

### 3. Product Statistics (제품 통계)

**Endpoint**: `GET /api/admin/stats/products`

**설명**: 제품 관련 상세 통계

**권한**: `read`

**응답 예시**:
```json
{
  "success": true,
  "stats": {
    "overview": {
      "total": 31,
      "active": 30,
      "inactive": 1
    },
    "categories": [
      {
        "category": {
          "id": "cat_1",
          "name": "연애운",
          "slug": "love",
          "icon": "💖",
          "color": "#FF6B9D"
        },
        "productCount": 8
      }
    ],
    "topProducts": [
      {
        "id": "prod_1",
        "title": "2025 신년운세 특별 패키지",
        "slug": "2025-fortune",
        "price": 50000,
        "discountPrice": 39000,
        "views": 1234,
        "isActive": true,
        "createdAt": "2024-12-01T00:00:00.000Z",
        "categories": [
          {
            "id": "cat_1",
            "name": "연애운",
            "slug": "love"
          }
        ]
      }
    ],
    "recentProducts": []
  },
  "timestamp": "2025-01-15T12:34:56.789Z"
}
```

**필드 설명**:
- `overview`: 전체 개요
- `categories`: 카테고리별 제품 분포
- `topProducts`: 인기 제품 TOP 10 (조회수 기준)
- `recentProducts`: 최근 추가된 제품 (최대 10개)

**캐싱**: 5분

---

### 4. Analysis Statistics (사주 분석 통계)

**Endpoint**: `GET /api/admin/stats/analyses`

**설명**: 사주 분석 관련 상세 통계

**권한**: `read`

**쿼리 파라미터**:
- `period`: 조회 기간 (선택)
  - `7d`: 최근 7일
  - `30d`: 최근 30일 (기본값)
  - `90d`: 최근 90일
  - `1y`: 최근 1년

**요청 예시**:
```bash
GET /api/admin/stats/analyses?period=30d
```

**응답 예시**:
```json
{
  "success": true,
  "stats": {
    "overview": {
      "total": 5678,
      "period": 456,
      "periodLabel": "30d"
    },
    "types": {
      "recentAnalysis": {
        "total": 5678,
        "period": 456
      },
      "mySaju": {
        "total": 3456,
        "period": 278
      },
      "sharedSaju": {
        "total": 1234,
        "period": 89
      }
    },
    "dailyChart": [
      {
        "date": "2025-01-01",
        "count": 45
      },
      {
        "date": "2025-01-02",
        "count": 38
      }
    ],
    "categories": [
      {
        "category": "연애운",
        "count": 1234
      },
      {
        "category": "재물운",
        "count": 987
      }
    ],
    "recentAnalyses": [
      {
        "id": "analysis_123",
        "category": "연애운",
        "birthDate": "1990-05-15",
        "birthTime": "14:30",
        "user": {
          "id": "user_123",
          "name": "홍길동",
          "email": "hong@example.com",
          "image": "https://..."
        },
        "createdAt": "2025-01-15T12:00:00.000Z"
      }
    ]
  },
  "timestamp": "2025-01-15T12:34:56.789Z"
}
```

**필드 설명**:
- `overview`: 전체 개요
  - `total`: 전체 분석 수
  - `period`: 기간 내 분석 수
  - `periodLabel`: 조회 기간
- `types`: 분석 유형별 통계
  - `recentAnalysis`: 일반 분석
  - `mySaju`: 내 사주 저장
  - `sharedSaju`: 공유된 사주
- `dailyChart`: 일별 분석 수 차트 데이터
- `categories`: 카테고리별 분석 분포
- `recentAnalyses`: 최근 분석 기록 (최대 10개)

**캐싱**: 5분

---

## 에러 응답

### 인증 실패 (401)
```json
{
  "success": false,
  "error": "관리자 인증이 필요합니다."
}
```

### 권한 부족 (403)
```json
{
  "success": false,
  "error": "권한이 부족합니다."
}
```

### 서버 오류 (500)
```json
{
  "success": false,
  "error": "통계 데이터 조회 중 오류가 발생했습니다.",
  "details": "Error message..."
}
```

---

## 사용 예시

### JavaScript/TypeScript

```typescript
// Admin 토큰 가져오기
const token = localStorage.getItem('admin_token');

// 1. Overview 통계 조회
async function fetchOverviewStats() {
  const response = await fetch('/api/admin/stats/overview', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.success) {
    console.log('사용자 수:', data.stats.users.total);
    console.log('성장률:', data.stats.users.growthRate, '%');
  }
}

// 2. 사용자 통계 조회 (최근 90일)
async function fetchUserStats() {
  const response = await fetch('/api/admin/stats/users?period=90d', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.success) {
    // 차트 렌더링
    renderChart(data.stats.growthChart);

    // 최다 분석 사용자 표시
    data.stats.topUsers.forEach((item, index) => {
      console.log(`${index + 1}. ${item.user.name} - ${item.analysisCount}회`);
    });
  }
}

// 3. 제품 통계 조회
async function fetchProductStats() {
  const response = await fetch('/api/admin/stats/products', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.success) {
    console.log('활성 제품:', data.stats.overview.active);
    console.log('인기 제품 TOP 3:', data.stats.topProducts.slice(0, 3));
  }
}

// 4. 사주 분석 통계 조회
async function fetchAnalysisStats() {
  const response = await fetch('/api/admin/stats/analyses?period=30d', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.success) {
    console.log('전체 분석:', data.stats.overview.total);
    console.log('이번달 분석:', data.stats.overview.period);

    // 카테고리별 분석 순위
    data.stats.categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.category} - ${cat.count}회`);
    });
  }
}
```

---

## 캐싱 전략

모든 통계 API는 다음과 같은 캐싱 전략을 사용합니다:

```
Cache-Control: private, s-maxage=300, stale-while-revalidate=600
```

- **private**: CDN에서 캐싱하지 않음 (관리자 데이터 보호)
- **s-maxage=300**: 5분간 캐시
- **stale-while-revalidate=600**: 10분간 백그라운드 갱신 허용

이를 통해 서버 부하를 줄이면서도 실시간성을 유지합니다.

---

## 성능 최적화

### 1. 병렬 쿼리
모든 API는 `Promise.all()`을 사용하여 여러 데이터베이스 쿼리를 병렬로 실행합니다.

### 2. 선택적 필드 조회
`select` 옵션을 사용하여 필요한 필드만 조회합니다.

### 3. 인덱싱
다음 필드에 인덱스를 설정하는 것을 권장합니다:
- `User.createdAt`
- `User.lastLoginAt`
- `Product.views`
- `Product.isActive`
- `RecentAnalysis.createdAt`
- `RecentAnalysis.category`

---

## 보안 고려사항

1. **JWT 검증**: 모든 요청에서 JWT 토큰을 검증합니다.
2. **권한 확인**: RBAC 시스템으로 권한을 확인합니다.
3. **민감 정보 제외**: 비밀번호 해시 등은 응답에 포함하지 않습니다.
4. **Rate Limiting**: 향후 구현 예정 (IP 기반, 1분당 60회)

---

## 향후 개선 계획

- [ ] Redis 캐싱 도입
- [ ] Rate Limiting 구현
- [ ] WebSocket 실시간 업데이트
- [ ] 주문/매출 통계 API 구현
- [ ] CSV/Excel 내보내기 기능
- [ ] 커스텀 날짜 범위 지원

---

## 관련 파일

- `lib/admin-auth.ts`: 인증 및 권한 관리
- `app/api/admin/auth/login/route.ts`: 관리자 로그인
- `prisma/schema.prisma`: 데이터베이스 스키마
