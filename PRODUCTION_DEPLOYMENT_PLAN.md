# 상용화급 배포 계획 (Production Deployment Plan)

**프로젝트**: 사주우주(SajuWooju) 엔터프라이즈 플랫폼
**작성일**: 2025-11-15
**배포 목표일**: 2025-11-16
**담당자**: DevOps Team

---

## 📋 배포 개요

### 배포 전략
- **Phase 1**: Pre-deployment (사전 준비) - 1시간
- **Phase 2**: Database Setup (데이터베이스 구축) - 30분
- **Phase 3**: Application Deployment (애플리케이션 배포) - 1시간
- **Phase 4**: Post-deployment (배포 후 검증) - 1시간
- **Phase 5**: Monitoring Setup (모니터링 설정) - 30분

**총 예상 시간**: 4시간

---

## Phase 1: Pre-deployment (사전 준비)

### 1.1 환경 준비

#### Vercel 계정 설정
- [ ] Vercel 계정 생성/로그인
- [ ] GitHub 레포지토리 연동
- [ ] Vercel CLI 설치
  ```bash
  npm install -g vercel
  ```

#### 환경 변수 준비
- [ ] `.env.production` 파일 생성
- [ ] 모든 필수 환경 변수 확인

**필수 환경 변수 체크리스트**:
```env
✅ DATABASE_URL
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL
✅ KAKAO_CLIENT_ID
✅ KAKAO_CLIENT_SECRET
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ ADMIN_USERNAME
✅ ADMIN_PASSWORD
✅ JWT_SECRET
✅ CSRF_SECRET
```

### 1.2 코드 검증

#### 빌드 테스트
```bash
# TypeScript 타입 체크
npm run type-check

# ESLint 검사
npm run lint

# 로컬 빌드 테스트
npm run build
```

#### 테스트 실행
```bash
# 단위 테스트
npm run test

# E2E 테스트 (선택)
npm run test:e2e
```

### 1.3 데이터베이스 준비

#### PostgreSQL 프로바이더 선택

**Option A: Vercel Postgres (권장)**
- 장점: Vercel 완전 통합
- 가격: Free tier 있음
- 설정: 자동

**Option B: Supabase**
- 장점: 무료 500MB
- 가격: Free tier 넉넉함
- 설정: 5분

**Option C: Railway**
- 장점: 간단한 설정
- 가격: $5/month
- 설정: 3분

**선택**: Vercel Postgres (권장)

---

## Phase 2: Database Setup (데이터베이스 구축)

### 2.1 Vercel Postgres 생성

```bash
# Vercel 프로젝트 연동
vercel link

# Postgres 생성
vercel postgres create sajuwooju-db

# 연결 정보 확인
vercel env pull .env.local
```

### 2.2 데이터베이스 마이그레이션

```bash
# Prisma Client 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate deploy

# 시드 데이터 생성
npx prisma db seed
```

### 2.3 데이터베이스 검증

```bash
# Prisma Studio로 확인
npx prisma studio

# 데이터 확인
# - 관리자 계정: 1개
# - 카테고리: 11개
# - 제품: 5개
# - 테스트 사용자: 3명
```

---

## Phase 3: Application Deployment (애플리케이션 배포)

### 3.1 Vercel 프로젝트 설정

#### CLI로 배포
```bash
# 프로젝트 초기화
vercel

# 환경 변수 설정 (Vercel Dashboard)
# 또는 CLI로 설정
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
# ... 나머지 환경 변수
```

#### Dashboard로 배포
1. Vercel Dashboard 접속
2. "Add New Project" 클릭
3. GitHub 레포지토리 선택
4. Framework: Next.js (자동 감지)
5. Root Directory: `./`
6. Build Command: `npm run build`
7. Output Directory: `.next`
8. Install Command: `npm install`

### 3.2 환경 변수 설정

**Vercel Dashboard → Settings → Environment Variables**

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=생성된-랜덤-시크릿-키
NEXTAUTH_URL=https://sajuwooju.vercel.app

# OAuth - Kakao
KAKAO_CLIENT_ID=카카오-클라이언트-ID
KAKAO_CLIENT_SECRET=카카오-시크릿

# OAuth - Google
GOOGLE_CLIENT_ID=구글-클라이언트-ID
GOOGLE_CLIENT_SECRET=구글-시크릿

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=강력한-비밀번호-여기에
JWT_SECRET=생성된-JWT-시크릿
JWT_EXPIRES_IN=7d

# Security
CSRF_SECRET=생성된-CSRF-시크릿

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100

# Feature Flags
FEATURE_AI_ANALYSIS=true
FEATURE_SOCIAL_SHARING=true
FEATURE_PAYMENT=false

# Analytics (선택)
GOOGLE_ANALYTICS_ID=
SENTRY_DSN=
```

### 3.3 비밀 키 생성

```bash
# NEXTAUTH_SECRET 생성
openssl rand -base64 32

# JWT_SECRET 생성
openssl rand -base64 32

# CSRF_SECRET 생성
openssl rand -base64 32
```

### 3.4 프로덕션 배포

```bash
# 프로덕션 배포
vercel --prod

# 배포 확인
vercel ls
```

---

## Phase 4: Post-deployment (배포 후 검증)

### 4.1 Health Check

```bash
# Health Check API 확인
curl https://sajuwooju.vercel.app/api/health

# 예상 응답:
# {
#   "status": "ok",
#   "timestamp": "2025-11-16T00:00:00.000Z",
#   "service": "sajuwooju-api",
#   "version": "1.0.0",
#   "database": "connected"
# }
```

### 4.2 관리자 로그인 테스트

```bash
# 관리자 로그인 API 테스트
curl -X POST https://sajuwooju.vercel.app/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'

# 예상 응답:
# {
#   "success": true,
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "admin": {...}
# }
```

### 4.3 보안 헤더 검증

```bash
# 보안 헤더 확인
curl -I https://sajuwooju.vercel.app

# 확인 항목:
# ✅ X-Frame-Options: DENY
# ✅ X-Content-Type-Options: nosniff
# ✅ X-XSS-Protection: 1; mode=block
# ✅ Content-Security-Policy: ...
# ✅ Strict-Transport-Security: max-age=31536000
```

### 4.4 Rate Limiting 테스트

```bash
# 연속 요청으로 Rate Limit 테스트
for i in {1..15}; do
  curl -X POST https://sajuwooju.vercel.app/api/admin/auth \
    -H "Content-Type: application/json" \
    -d '{"username":"wrong","password":"wrong"}'
  echo "Request $i"
done

# 11번째 요청부터 429 응답 확인
```

### 4.5 기능 테스트

#### 관리자 패널 접속
1. **로그인**: https://sajuwooju.vercel.app/admin
   - Username: admin
   - Password: (설정한 비밀번호)

2. **대시보드 확인**
   - 통계 카드 표시 확인
   - 데이터 로딩 확인

3. **카테고리 관리**
   - 목록 조회
   - 생성/수정/삭제 테스트

4. **제품 관리**
   - 목록 조회
   - Featured 토글 테스트

### 4.6 성능 테스트

#### Lighthouse 점수 측정
```bash
# Chrome DevTools → Lighthouse
# 또는 CLI
npm install -g lighthouse
lighthouse https://sajuwooju.vercel.app --view
```

**목표 점수**:
- Performance: 85+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

#### 응답 시간 측정
```bash
# API 응답 시간 측정
curl -w "@curl-format.txt" -o /dev/null -s https://sajuwooju.vercel.app/api/admin/categories
```

**curl-format.txt**:
```
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_appconnect:  %{time_appconnect}\n
time_pretransfer:  %{time_pretransfer}\n
time_redirect:  %{time_redirect}\n
time_starttransfer:  %{time_starttransfer}\n
----------\n
time_total:  %{time_total}\n
```

---

## Phase 5: Monitoring Setup (모니터링 설정)

### 5.1 Vercel Analytics 설정

```bash
# Vercel Analytics 설치
npm install @vercel/analytics
```

**app/layout.tsx 수정**:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 5.2 Sentry 에러 추적 (선택)

```bash
# Sentry 설치
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**sentry.client.config.ts**:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 5.3 로그 모니터링

**Vercel Dashboard → Logs**
- Real-time Logs 확인
- Error Logs 필터링
- 알림 설정

### 5.4 Uptime 모니터링

**추천 서비스**:
- UptimeRobot (무료)
- Pingdom
- StatusCake

**설정**:
- URL: https://sajuwooju.vercel.app/api/health
- Interval: 5분
- Alert: Email/SMS

---

## 배포 체크리스트

### Pre-deployment
- [ ] Vercel 계정 생성
- [ ] GitHub 레포지토리 연동
- [ ] 환경 변수 준비
- [ ] 빌드 테스트 성공
- [ ] 단위 테스트 통과

### Database
- [ ] PostgreSQL 프로바이더 선택
- [ ] 데이터베이스 생성
- [ ] 마이그레이션 실행
- [ ] 시드 데이터 생성
- [ ] 데이터 검증 완료

### Deployment
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정 (15개)
- [ ] 비밀 키 생성
- [ ] 프로덕션 배포 성공
- [ ] 배포 URL 확인

### Post-deployment
- [ ] Health Check 성공
- [ ] 관리자 로그인 성공
- [ ] 보안 헤더 확인
- [ ] Rate Limiting 작동
- [ ] 기능 테스트 통과
- [ ] Lighthouse 점수 85+

### Monitoring
- [ ] Vercel Analytics 설정
- [ ] Sentry 설정 (선택)
- [ ] Uptime 모니터링 설정
- [ ] 알림 설정

### DNS & Domain (선택)
- [ ] 도메인 구매
- [ ] Vercel에 도메인 연결
- [ ] DNS 레코드 설정
- [ ] SSL 인증서 확인

---

## OAuth 설정 가이드

### Kakao OAuth

1. **Kakao Developers 콘솔** (https://developers.kakao.com)
2. "내 애플리케이션" → "애플리케이션 추가하기"
3. **앱 설정 → 플랫폼**
   - Web 플랫폼 등록
   - 사이트 도메인: `https://sajuwooju.vercel.app`
4. **제품 설정 → 카카오 로그인**
   - 활성화 설정 ON
   - Redirect URI: `https://sajuwooju.vercel.app/api/auth/callback/kakao`
5. **동의항목**
   - 닉네임: 필수
   - 프로필 사진: 선택
   - 이메일: 필수
6. **앱 키**
   - REST API 키 → `KAKAO_CLIENT_ID`
   - Client Secret 생성 → `KAKAO_CLIENT_SECRET`

### Google OAuth

1. **Google Cloud Console** (https://console.cloud.google.com)
2. 프로젝트 생성: "SajuWooju"
3. **API 및 서비스 → OAuth 동의 화면**
   - 외부 선택
   - 앱 이름: 사주우주
   - 지원 이메일: your-email@example.com
4. **사용자 인증 정보 → OAuth 2.0 클라이언트 ID**
   - 웹 애플리케이션
   - 승인된 리디렉션 URI: `https://sajuwooju.vercel.app/api/auth/callback/google`
5. **클라이언트 ID 및 시크릿**
   - 클라이언트 ID → `GOOGLE_CLIENT_ID`
   - 클라이언트 보안 비밀 → `GOOGLE_CLIENT_SECRET`

---

## 롤백 계획

### 즉시 롤백 (긴급)

```bash
# 이전 배포로 롤백
vercel rollback
```

### 데이터베이스 롤백

```bash
# 마이그레이션 되돌리기
npx prisma migrate resolve --rolled-back <migration-name>

# 백업에서 복원
psql -h host -U user -d database < backup.sql
```

### 점진적 롤백

1. Vercel Dashboard → Deployments
2. 이전 배포 선택
3. "Promote to Production" 클릭

---

## 긴급 연락망

### 기술 지원
- **Vercel Support**: https://vercel.com/support
- **Prisma Support**: https://www.prisma.io/docs/support
- **GitHub Issues**: https://github.com/yourusername/sajuwooju-enterprise/issues

### 모니터링 알림
- **이메일**: admin@sajuwooju.com
- **SMS**: +82-10-XXXX-XXXX
- **Slack**: #sajuwooju-alerts

---

## 성공 기준

### 기술적 기준
- [ ] Health Check 200 OK
- [ ] 관리자 로그인 성공
- [ ] 모든 API 엔드포인트 정상
- [ ] Lighthouse Performance 85+
- [ ] 응답 시간 < 500ms
- [ ] 에러율 < 1%

### 비즈니스 기준
- [ ] 관리자 패널 접근 가능
- [ ] 데이터 CRUD 정상
- [ ] 보안 헤더 적용
- [ ] Rate Limiting 작동
- [ ] 모니터링 활성화

---

## 배포 후 작업

### 즉시 (배포 당일)
1. ✅ 배포 성공 확인
2. ✅ 팀에 배포 완료 공지
3. ✅ 모니터링 대시보드 확인
4. ✅ 에러 로그 모니터링

### 1주일 내
1. ⏳ 사용자 피드백 수집
2. ⏳ 성능 지표 분석
3. ⏳ 버그 수정 배포
4. ⏳ 문서 업데이트

### 1개월 내
1. ⏳ Redis 캐싱 추가
2. ⏳ CDN 최적화
3. ⏳ 데이터베이스 인덱스 추가
4. ⏳ 로드 테스트 수행

---

## 참고 자료

### 공식 문서
- [Vercel 배포 가이드](https://vercel.com/docs/deployments)
- [Next.js 프로덕션 체크리스트](https://nextjs.org/docs/going-to-production)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

### 내부 문서
- [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
- [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)
- [PROJECT_COMPLETION_REPORT.md](./PROJECT_COMPLETION_REPORT.md)

---

**작성자**: DevOps Team
**최종 업데이트**: 2025-11-15
**문서 버전**: 1.0
**상태**: ✅ Ready for Deployment
