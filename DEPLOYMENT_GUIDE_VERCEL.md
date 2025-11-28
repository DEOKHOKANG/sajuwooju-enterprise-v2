# Vercel 배포 가이드
**사주우주 엔터프라이즈 - Production Deployment Guide**

생성일: 2025-11-17
Vercel Token: `QeozRVkagSj3QzumQNFkO8iO`
GitHub Repo: `https://github.com/efuelteam/sajuwooju-enterprise`

---

## 🚀 Quick Start (5분 배포)

### 1단계: Vercel 프로젝트 생성

#### 옵션 A: Vercel Dashboard (권장)
```bash
1. https://vercel.com/new 접속
2. "Import Git Repository" 클릭
3. GitHub 레포지토리 선택: efuelteam/sajuwooju-enterprise
4. Framework Preset: Next.js 자동 감지
5. Root Directory: sajuwooju-enterprise (선택)
6. Build Command: npm run build (자동 설정됨)
7. Output Directory: .next (자동 설정됨)
```

#### 옵션 B: Vercel CLI (대안)
```bash
# 주의: 디스크 공간 부족 시 옵션 A 사용
npm install -g vercel
cd sajuwooju-enterprise
vercel login --token QeozRVkagSj3QzumQNFkO8iO
vercel --prod
```

---

## 📦 2단계: 데이터베이스 설정

### Vercel Postgres 사용 (권장)
```bash
1. Vercel Dashboard → Storage → Create Database
2. Type: Postgres 선택
3. Region: Seoul (icn1) 선택
4. Database Name: sajuwooju-db
5. "Create" 클릭

# 자동으로 환경 변수 추가됨:
# - POSTGRES_URL
# - POSTGRES_PRISMA_URL (= DATABASE_URL)
# - POSTGRES_URL_NON_POOLING
```

### 대안: 외부 PostgreSQL
```bash
# Supabase, Railway, Neon 등 사용 가능
# Vercel Dashboard → Settings → Environment Variables
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

## ⚙️ 3단계: 환경 변수 설정

### Vercel Dashboard에서 설정
```
Vercel Dashboard
→ 프로젝트 선택
→ Settings
→ Environment Variables
```

### 필수 환경 변수 (15개)

#### 1. Database
```env
DATABASE_URL=postgresql://...  # Vercel Postgres 사용 시 자동 설정
DIRECT_URL=postgresql://...     # Non-pooling connection (선택)
```

#### 2. Authentication
```bash
# 터미널에서 생성:
openssl rand -base64 32
```

```env
NEXTAUTH_SECRET=<openssl-rand-base64-32>
NEXTAUTH_URL=https://your-app.vercel.app

ADMIN_USERNAME=admin
ADMIN_PASSWORD=StrongPassword123!

JWT_SECRET=<openssl-rand-base64-32>
JWT_EXPIRES_IN=7d

CSRF_SECRET=<openssl-rand-base64-32>
```

#### 3. Rate Limiting
```env
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 4. App Configuration
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### 5. OAuth (선택 - 나중에 설정 가능)
```env
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

#### 6. OpenAI (선택)
```env
OPENAI_API_KEY=sk-...
```

### 환경 변수 설정 스크립트

#### PowerShell (Windows)
```powershell
# d:\saju\sajuwooju-enterprise\scripts\setup-vercel-env.ps1

$envVars = @{
    "NEXTAUTH_SECRET" = (openssl rand -base64 32)
    "JWT_SECRET" = (openssl rand -base64 32)
    "CSRF_SECRET" = (openssl rand -base64 32)
    "NEXTAUTH_URL" = "https://your-app.vercel.app"
    "ADMIN_USERNAME" = "admin"
    "ADMIN_PASSWORD" = "ChangeMe123!"
    "JWT_EXPIRES_IN" = "7d"
    "RATE_LIMIT_WINDOW" = "60000"
    "RATE_LIMIT_MAX_REQUESTS" = "100"
    "NODE_ENV" = "production"
    "NEXT_PUBLIC_APP_URL" = "https://your-app.vercel.app"
}

foreach ($key in $envVars.Keys) {
    Write-Host "$key=$($envVars[$key])"
    # 수동으로 Vercel Dashboard에 복사/붙여넣기
}
```

---

## 🗄️ 4단계: 데이터베이스 마이그레이션

### Vercel Postgres 연결 정보 확인
```bash
Vercel Dashboard
→ Storage
→ sajuwooju-db
→ .env.local 탭
→ "Show secret" 클릭
```

### 로컬에서 마이그레이션 실행
```bash
# 1. .env.local 파일 생성
cd sajuwooju-enterprise
echo "DATABASE_URL=postgresql://..." > .env.local

# 2. Prisma 마이그레이션
npx prisma generate
npx prisma db push

# 3. 시드 데이터 생성
npx prisma db seed
```

### 결과 확인
```bash
# Vercel Postgres Studio에서 확인
Vercel Dashboard → Storage → sajuwooju-db → Data 탭

# 확인할 테이블:
# - User (관리자 계정)
# - SajuCategory (8개 카테고리)
# - SajuTemplate (3개 템플릿)
```

---

## 🚀 5단계: 프로덕션 배포

### Vercel Dashboard
```bash
1. Deployments 탭 클릭
2. "Redeploy" 버튼 클릭 (환경 변수 적용 후)
3. 배포 로그 확인
4. 배포 완료 시 URL 클릭
```

### 예상 배포 시간
```
Build: ~30-60초
Deploy: ~10초
Total: ~1분
```

---

## ✅ 6단계: 배포 검증

### Health Check
```bash
curl https://your-app.vercel.app/api/health

# 응답:
{
  "status": "ok",
  "timestamp": "2025-11-17T...",
  "database": "connected"
}
```

### 관리자 로그인 테스트
```bash
1. https://your-app.vercel.app/admin 접속
2. Username: admin
3. Password: (설정한 비밀번호)
4. 로그인 성공 시 대시보드 표시
```

### 공개 페이지 확인
```bash
1. https://your-app.vercel.app/saju
2. 8개 카테고리 카드 표시 확인
3. 카테고리 클릭 → 콘텐츠 목록 확인
```

### API 엔드포인트 테스트
```bash
# 카테고리 목록
curl https://your-app.vercel.app/api/admin/saju-categories

# 응답: { categories: [...], pagination: {...} }
```

---

## 🔧 트러블슈팅

### 빌드 실패
```bash
Error: Database connection failed

해결:
1. Vercel Dashboard → Settings → Environment Variables
2. DATABASE_URL 확인
3. Redeploy
```

### 환경 변수 누락
```bash
Error: NEXTAUTH_SECRET is not defined

해결:
1. .env.example 참고
2. 모든 필수 환경 변수 설정
3. Redeploy
```

### 데이터베이스 마이그레이션 실패
```bash
Error: The table `User` does not exist

해결:
1. 로컬에서 마이그레이션 실행
2. npx prisma db push
3. npx prisma db seed
```

### Prisma 에러
```bash
Error: Prisma Client not generated

해결:
vercel.json의 buildCommand 확인:
"buildCommand": "prisma generate && npm run build"
```

---

## 📊 배포 후 설정

### 1. Custom Domain (선택)
```bash
Vercel Dashboard
→ Settings
→ Domains
→ Add Domain
→ sajuwooju.com 입력
→ DNS 설정 (A record 또는 CNAME)
```

### 2. Analytics
```bash
Vercel Dashboard
→ Analytics 탭
→ Enable Analytics
→ 무료 플랜: 10,000 events/월
```

### 3. Monitoring
```bash
# Uptime Robot 설정
https://uptimerobot.com
→ Add Monitor
→ URL: https://your-app.vercel.app/api/health
→ Interval: 5분
```

### 4. SEO
```bash
# Google Search Console
https://search.google.com/search-console
→ Add Property
→ URL: https://your-app.vercel.app
→ Verify ownership (DNS or HTML tag)
```

---

## 🎯 배포 완료 체크리스트

- [ ] Vercel 프로젝트 생성
- [ ] GitHub 레포지토리 연동
- [ ] Vercel Postgres 생성
- [ ] 환경 변수 15개 설정
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL
  - [ ] ADMIN_USERNAME
  - [ ] ADMIN_PASSWORD
  - [ ] JWT_SECRET
  - [ ] JWT_EXPIRES_IN
  - [ ] CSRF_SECRET
  - [ ] RATE_LIMIT_WINDOW
  - [ ] RATE_LIMIT_MAX_REQUESTS
  - [ ] NODE_ENV
  - [ ] NEXT_PUBLIC_APP_URL
- [ ] Prisma 마이그레이션 실행
- [ ] 시드 데이터 생성 (8 categories, 3 templates)
- [ ] 프로덕션 배포
- [ ] Health Check 성공
- [ ] 관리자 로그인 테스트
- [ ] 공개 페이지 확인
- [ ] 카테고리 생성 테스트
- [ ] 템플릿 생성 테스트
- [ ] 콘텐츠 생성 및 발행 테스트

---

## 📞 지원

### Vercel 문서
- https://vercel.com/docs
- https://vercel.com/docs/storage/vercel-postgres

### Prisma 문서
- https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

### GitHub
- https://github.com/efuelteam/sajuwooju-enterprise/issues

---

## 🎉 배포 성공!

배포가 완료되면:
1. **URL 공유**: https://your-app.vercel.app
2. **관리자 페이지**: https://your-app.vercel.app/admin
3. **공개 페이지**: https://your-app.vercel.app/saju

**다음 단계**:
- 샘플 콘텐츠 생성 (관리자 페이지)
- 검색 기능 추가
- 소셜 기능 구현

---

**생성일**: 2025-11-17
**Vercel Token**: QeozRVkagSj3QzumQNFkO8iO
**GitHub Repo**: efuelteam/sajuwooju-enterprise

🚀 **Generated with [Claude Code](https://claude.com/claude-code)**
