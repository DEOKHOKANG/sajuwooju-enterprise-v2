# Deployment Guide

사주우주(SajuWooju) 배포 가이드

---

## 📋 목차

1. [Vercel 배포](#vercel-배포-권장)
2. [Docker 배포](#docker-배포)
3. [수동 배포](#수동-배포)
4. [환경 변수 설정](#환경-변수-설정)
5. [데이터베이스 마이그레이션](#데이터베이스-마이그레이션)
6. [배포 후 확인](#배포-후-확인)
7. [트러블슈팅](#트러블슈팅)

---

## Vercel 배포 (권장)

### 1. Vercel 계정 준비

1. [Vercel](https://vercel.com) 회원가입/로그인
2. GitHub 계정 연동

### 2. 프로젝트 Import

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 디렉토리에서 실행
cd sajuwooju-enterprise
vercel

# 프로덕션 배포
vercel --prod
```

또는 **Vercel Dashboard**에서:
1. "Add New Project" 클릭
2. GitHub 레포지토리 선택
3. Framework Preset: **Next.js** 자동 감지
4. 환경 변수 설정
5. Deploy 클릭

### 3. 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables에서 추가:

```env
# Database (필수)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth (필수)
NEXTAUTH_SECRET=your-long-random-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app

# OAuth (필수)
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin (필수)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-secure-password
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Security (필수)
CSRF_SECRET=your-csrf-secret-key

# OpenAI (선택)
OPENAI_API_KEY=sk-your-openai-api-key

# Feature Flags (선택)
FEATURE_AI_ANALYSIS=true
FEATURE_SOCIAL_SHARING=true
FEATURE_PAYMENT=false
```

### 4. PostgreSQL 데이터베이스 준비

**옵션 1: Vercel Postgres**
```bash
vercel postgres create
```

**옵션 2: Supabase**
1. [Supabase](https://supabase.com) 프로젝트 생성
2. Database → Connection Pooling → Connection String 복사
3. `DATABASE_URL`에 설정

**옵션 3: Railway**
1. [Railway](https://railway.app) 프로젝트 생성
2. PostgreSQL 추가
3. Connection String 복사

### 5. 데이터베이스 마이그레이션

```bash
# Vercel CLI로 실행
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

또는 **Vercel Dashboard**:
1. Settings → Git → Deploy Hooks
2. Hook 생성 후 트리거

### 6. 빌드 설정

**vercel.json** (선택사항):
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

### 7. 도메인 연결

1. Vercel Dashboard → Settings → Domains
2. 커스텀 도메인 추가
3. DNS 레코드 업데이트:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## Docker 배포

### 1. Docker 이미지 빌드

```bash
# 로컬에서 빌드
docker build -t sajuwooju:latest .

# Docker Hub에 푸시
docker tag sajuwooju:latest your-username/sajuwooju:latest
docker push your-username/sajuwooju:latest
```

### 2. Docker Compose로 실행

```bash
# .env 파일 생성
cp .env.example .env

# 환경 변수 편집
nano .env

# Docker Compose 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f app
```

### 3. Docker Compose 구성

**docker-compose.yml**에 정의된 서비스:
- `postgres`: PostgreSQL 데이터베이스
- `app`: Next.js 애플리케이션
- `redis`: Redis (Optional, production profile)

### 4. 프로덕션 환경 설정

```bash
# Redis 포함 실행
docker-compose --profile production up -d

# 헬스체크 확인
docker-compose ps
```

### 5. 데이터베이스 초기화

```bash
# 마이그레이션 실행
docker-compose exec app npx prisma migrate deploy

# 시드 데이터 생성
docker-compose exec app npx prisma db seed
```

### 6. 볼륨 백업

```bash
# PostgreSQL 백업
docker-compose exec postgres pg_dump -U sajuwooju sajuwooju > backup.sql

# 복원
docker-compose exec -T postgres psql -U sajuwooju sajuwooju < backup.sql
```

---

## 수동 배포

### 1. 서버 준비

**최소 요구사항**:
- Node.js 20+
- PostgreSQL 16+
- 2GB RAM
- 10GB 디스크

### 2. 프로젝트 클론

```bash
git clone https://github.com/yourusername/sajuwooju-enterprise.git
cd sajuwooju-enterprise
```

### 3. 의존성 설치

```bash
npm install
```

### 4. 환경 변수 설정

```bash
cp .env.example .env
nano .env
```

### 5. 데이터베이스 설정

```bash
# 마이그레이션
npx prisma migrate deploy

# 시드 데이터
npx prisma db seed
```

### 6. 빌드

```bash
npm run build
```

### 7. 실행

**개발 모드**:
```bash
npm run dev
```

**프로덕션 모드**:
```bash
npm run start
```

### 8. PM2로 프로세스 관리

```bash
# PM2 설치
npm install -g pm2

# 애플리케이션 시작
pm2 start npm --name "sajuwooju" -- start

# 자동 재시작 설정
pm2 startup
pm2 save

# 상태 확인
pm2 status

# 로그 확인
pm2 logs sajuwooju
```

### 9. Nginx 리버스 프록시

**/etc/nginx/sites-available/sajuwooju**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx 설정 활성화
sudo ln -s /etc/nginx/sites-available/sajuwooju /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 10. SSL 인증서 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx

# 인증서 발급
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 자동 갱신 테스트
sudo certbot renew --dry-run
```

---

## 환경 변수 설정

### 필수 환경 변수

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# OAuth
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="secure-password"
JWT_SECRET="your-jwt-secret"

# Security
CSRF_SECRET="your-csrf-secret"
```

### 선택 환경 변수

```env
# OpenAI
OPENAI_API_KEY="sk-your-key"

# Rate Limiting
RATE_LIMIT_WINDOW="60000"
RATE_LIMIT_MAX_REQUESTS="100"

# Feature Flags
FEATURE_AI_ANALYSIS="true"
FEATURE_SOCIAL_SHARING="true"
FEATURE_PAYMENT="false"

# Analytics
GOOGLE_ANALYTICS_ID=""
SENTRY_DSN=""
```

### 환경별 설정

**Development (.env.development)**:
```env
NODE_ENV="development"
DATABASE_URL="postgresql://localhost:5432/sajuwooju_dev"
NEXTAUTH_URL="http://localhost:3000"
```

**Production (.env.production)**:
```env
NODE_ENV="production"
DATABASE_URL="postgresql://prod-host:5432/sajuwooju"
NEXTAUTH_URL="https://sajuwooju.com"
```

---

## 데이터베이스 마이그레이션

### 개발 환경

```bash
# 새 마이그레이션 생성
npx prisma migrate dev --name add_new_field

# 마이그레이션 리셋 (주의!)
npx prisma migrate reset
```

### 프로덕션 환경

```bash
# 마이그레이션 배포
npx prisma migrate deploy

# 상태 확인
npx prisma migrate status

# Prisma Studio (데이터 확인)
npx prisma studio
```

### 백업 & 복원

```bash
# 백업
pg_dump -U user -h host database > backup_$(date +%Y%m%d).sql

# 복원
psql -U user -h host database < backup_20251115.sql
```

---

## 배포 후 확인

### 1. 헬스 체크

```bash
curl https://your-domain.com/api/health
# 응답: {"status":"ok"}
```

### 2. 관리자 로그인 확인

```bash
curl -X POST https://your-domain.com/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### 3. 보안 헤더 확인

```bash
curl -I https://your-domain.com
# 확인: X-Frame-Options, CSP, HSTS 등
```

### 4. Rate Limiting 확인

```bash
# 20번 연속 요청
for i in {1..20}; do
  curl https://your-domain.com/api/admin/auth \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"wrong","password":"wrong"}'
done
# 11번째부터 429 응답
```

### 5. SSL 인증서 확인

```bash
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

### 6. Lighthouse 점수 확인

Chrome DevTools → Lighthouse → Generate Report

**목표 점수**:
- Performance: 85+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 트러블슈팅

### 빌드 실패

**문제**: TypeScript 에러
```bash
# 타입 체크
npm run type-check

# Prisma Client 재생성
npx prisma generate
```

**문제**: 메모리 부족
```bash
# Node 메모리 증가
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 데이터베이스 연결 실패

**문제**: Connection timeout
- PostgreSQL 방화벽 확인
- `DATABASE_URL` 형식 확인
- SSL 모드 설정: `?sslmode=require`

**문제**: Migration 충돌
```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 수동 해결
npx prisma migrate resolve --applied <migration-name>
```

### 환경 변수 미적용

**Vercel**:
- Redeploy 필요
- Environment Variables → Redeploy

**Docker**:
```bash
docker-compose down
docker-compose up -d
```

### Rate Limit 메모리 누수

**Redis 사용 권장** (프로덕션):
```typescript
// lib/middleware/rate-limit.ts
// Redis 클라이언트로 교체
import { Redis } from '@upstash/redis';
```

### CORS 에러

**next.config.js** 업데이트:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
        ],
      },
    ];
  },
};
```

---

## 모니터링 & 로깅

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
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

### Sentry 에러 추적

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### PM2 모니터링

```bash
# 대시보드 설치
pm2 install pm2-logrotate

# 웹 모니터링
pm2 web
```

---

## 성능 최적화

### 1. Next.js 설정

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
};
```

### 2. CDN 설정

Vercel은 자동 CDN 제공
CloudFlare 추가 설정 가능

### 3. 데이터베이스 최적화

```sql
-- 인덱스 추가
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_analyses_session ON analyses(session_id);
```

### 4. 캐싱 전략

- API 응답: Redis 캐싱
- 정적 페이지: CDN 캐싱
- 이미지: Next.js Image Optimization

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-11-15
