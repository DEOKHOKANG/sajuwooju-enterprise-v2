# 🔧 Vercel 환경 변수 설정 완벽 가이드

**목적**: 배포된 사이트의 하드코딩 문제를 완전히 해결하기 위한 환경 변수 설정

**소요 시간**: 10-15분
**난이도**: ⭐⭐☆☆☆ (중하)

---

## 📋 설정할 환경 변수 목록 (총 15개)

### 🔴 필수 (7개) - 없으면 사이트 동작 안 함
1. `DATABASE_URL` - Prisma Accelerate 연결 (이미 생성됨)
2. `NEXT_PUBLIC_SITE_URL` - 사이트 URL (메타데이터용)
3. `NEXTAUTH_SECRET` - NextAuth.js 암호화 키
4. `NEXTAUTH_URL` - NextAuth.js 콜백 URL
5. `JWT_SECRET` - 관리자 JWT 암호화
6. `CSRF_SECRET` - CSRF 보안 토큰
7. `ADMIN_PASSWORD` - 관리자 비밀번호

### 🟡 권장 (5개) - 보안 강화
8. `ADMIN_USERNAME` - 관리자 아이디 (기본값: admin)
9. `JWT_EXPIRES_IN` - JWT 만료 시간 (기본값: 7d)
10. `RATE_LIMIT_WINDOW` - Rate Limit 윈도우 (기본값: 60000)
11. `RATE_LIMIT_MAX_REQUESTS` - 최대 요청 수 (기본값: 100)
12. `NODE_ENV` - 환경 (production)

### 🟢 선택 (3개) - OAuth 로그인용
13. `KAKAO_CLIENT_ID` - 카카오 로그인
14. `KAKAO_CLIENT_SECRET` - 카카오 로그인
15. `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - 구글 로그인

---

## 🚀 1단계: Vercel 대시보드 접속

### 1.1 Vercel 프로젝트 페이지 열기
```
https://vercel.com/kevinglecs-projects/sajuwooju-enterprise
```

### 1.2 Settings 탭 이동
1. 상단 메뉴에서 **Settings** 클릭
2. 왼쪽 사이드바에서 **Environment Variables** 클릭

---

## 🔐 2단계: 필수 환경 변수 설정

### 2.1 DATABASE_URL (가장 중요!)

**이미 생성된 Prisma Accelerate 연결 문자열 사용**:

```env
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19XRGVRbmNCb0FheG9Gb2E4bGtzY3oiLCJhcGlfa2V5IjoiMDFLOUtZRUNaWldHM1AwMzVTUTI5SllRVDQiLCJ0ZW5hbnRfaWQiOiJkNTdmOTEwYzZiYjVjYTdjNTc1N2U1Y2YzOTdhYWJlNDkwODFlZjZiMjYyOTkyOWI0MTJmMzllZTYwZmY1MTAzIiwiaW50ZXJuYWxfc2VjcmV0IjoiYzI4OTQ4OTctZjYyMy00OTczLThmMGItNTMzNGYwOTgwMGZkIn0.ZjGfuzAsHygqOwKZnvKWlcI45GFbO2TixX0PqF_Gn98
```

**설정 방법**:
1. "Add New" 버튼 클릭
2. Name: `DATABASE_URL`
3. Value: 위 연결 문자열 복사 붙여넣기
4. Environment: **Production** 체크
5. "Save" 클릭

---

### 2.2 NEXT_PUBLIC_SITE_URL

**현재 배포 URL**:
```env
NEXT_PUBLIC_SITE_URL=https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app
```

**나중에 커스텀 도메인 연결 시**:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**주의**: `NEXT_PUBLIC_` 접두사 필수 (클라이언트에서 접근 가능)

---

### 2.3 NEXTAUTH_SECRET

**생성 방법** (랜덤 32자 문자열):
```bash
# 터미널에서 실행 (Git Bash, PowerShell, WSL 등)
openssl rand -base64 32
```

**또는 온라인 생성기**:
```
https://generate-secret.vercel.app/32
```

**예시**:
```env
NEXTAUTH_SECRET=XtK9mP2qR8vL5nJ7wE4fH6gD1aS3cB0z
```

---

### 2.4 NEXTAUTH_URL

```env
NEXTAUTH_URL=https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app
```

**주의**: `NEXT_PUBLIC_SITE_URL`과 동일한 값

---

### 2.5 JWT_SECRET

**생성 방법** (NEXTAUTH_SECRET과 다른 값 사용):
```bash
openssl rand -base64 32
```

**예시**:
```env
JWT_SECRET=Y7uI8oP1qW2eR3tY4uI5oP6aS7dF8gH9
```

---

### 2.6 CSRF_SECRET

**생성 방법** (또 다른 랜덤 값):
```bash
openssl rand -base64 32
```

**예시**:
```env
CSRF_SECRET=Z9xC8vB7nM6qW5eR4tY3uI2oP1aS0dF
```

---

### 2.7 ADMIN_PASSWORD

**강력한 비밀번호 생성**:
```bash
# 최소 16자, 대소문자+숫자+특수문자
openssl rand -base64 24
```

**예시**:
```env
ADMIN_PASSWORD=Admin2025!SecureP@ssw0rd#
```

**주의**:
- 최소 16자 이상
- 대소문자, 숫자, 특수문자 모두 포함
- 개인정보 포함 금지

---

## 🔧 3단계: 권장 환경 변수 설정

### 3.1 ADMIN_USERNAME

```env
ADMIN_USERNAME=admin
```

**기본값**이 있지만 보안을 위해 변경 권장:
```env
ADMIN_USERNAME=sajuadmin2025
```

---

### 3.2 JWT_EXPIRES_IN

```env
JWT_EXPIRES_IN=7d
```

**설명**: JWT 토큰 유효 기간 (7일)
**옵션**: `1d` (1일), `30d` (30일), `1h` (1시간)

---

### 3.3 Rate Limiting

```env
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
```

**설명**:
- `RATE_LIMIT_WINDOW`: 60초 (60000ms)
- `RATE_LIMIT_MAX_REQUESTS`: 60초당 최대 100개 요청

---

### 3.4 NODE_ENV

```env
NODE_ENV=production
```

**주의**: Vercel이 자동으로 설정하지만 명시적으로 추가 권장

---

## 🎨 4단계: OAuth 설정 (선택)

### 4.1 Kakao OAuth

**설정 순서**:
1. https://developers.kakao.com 접속
2. 애플리케이션 생성
3. **Redirect URI** 설정:
   ```
   https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app/api/auth/callback/kakao
   ```
4. REST API 키 복사

**환경 변수**:
```env
KAKAO_CLIENT_ID=your_kakao_rest_api_key
KAKAO_CLIENT_SECRET=your_kakao_client_secret
```

---

### 4.2 Google OAuth

**설정 순서**:
1. https://console.cloud.google.com 접속
2. 프로젝트 생성
3. "APIs & Services" → "Credentials" 이동
4. "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: **Web application**
6. **Authorized redirect URIs** 추가:
   ```
   https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app/api/auth/callback/google
   ```
7. Client ID와 Secret 복사

**환경 변수**:
```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## ✅ 5단계: 환경 변수 설정 완료 확인

### 5.1 전체 환경 변수 체크리스트

**Vercel 대시보드에서 확인**:
```
Settings → Environment Variables → Production
```

**설정되어야 할 변수**:
- [x] DATABASE_URL
- [x] NEXT_PUBLIC_SITE_URL
- [x] NEXTAUTH_SECRET
- [x] NEXTAUTH_URL
- [x] JWT_SECRET
- [x] CSRF_SECRET
- [x] ADMIN_PASSWORD
- [x] ADMIN_USERNAME (권장)
- [x] JWT_EXPIRES_IN (권장)
- [x] RATE_LIMIT_WINDOW (권장)
- [x] RATE_LIMIT_MAX_REQUESTS (권장)
- [x] NODE_ENV (권장)
- [ ] KAKAO_CLIENT_ID (선택)
- [ ] KAKAO_CLIENT_SECRET (선택)
- [ ] GOOGLE_CLIENT_ID (선택)
- [ ] GOOGLE_CLIENT_SECRET (선택)

---

## 🚀 6단계: 재배포

### 6.1 환경 변수 적용을 위한 재배포

**방법 1: Vercel 대시보드에서 재배포**
1. Deployments 탭 이동
2. 최신 배포 옆 "..." 메뉴 클릭
3. "Redeploy" 클릭

**방법 2: CLI로 재배포** (권장)
```bash
cd sajuwooju-enterprise
npx vercel --prod
```

**소요 시간**: 약 1-2분

---

## 🧪 7단계: 배포 검증

### 7.1 Health Check API 확인

```bash
curl https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app/api/health
```

**성공 응답 예시**:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-15T..."
}
```

**실패 응답 (DATABASE_URL 미설정)**:
```json
{
  "status": "error",
  "database": "disconnected"
}
```

---

### 7.2 홈페이지 로딩 확인

1. 브라우저에서 접속:
   ```
   https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app
   ```

2. **성공 징후**:
   - ✅ 30초 이내 페이지 완전 로딩
   - ✅ 제품 카드가 실제 데이터로 표시 (스켈레톤 아님)
   - ✅ 카테고리 아이콘 표시
   - ✅ 슬라이더 동작

3. **실패 징후**:
   - ❌ 무한 로딩 (스켈레톤만 계속 표시)
   - ❌ "Error loading data" 메시지
   - ❌ 빈 페이지

---

### 7.3 메타데이터 확인

```bash
curl -s https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app/ | grep "og:url"
```

**성공** (올바른 URL):
```html
<meta property="og:url" content="https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app"/>
```

**실패** (여전히 localhost):
```html
<meta property="og:url" content="http://localhost:3000"/>
```

→ `NEXT_PUBLIC_SITE_URL` 환경 변수 재확인 필요

---

### 7.4 관리자 로그인 테스트

1. 관리자 로그인 페이지 접속:
   ```
   https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app/admin/login
   ```

2. 설정한 `ADMIN_USERNAME`과 `ADMIN_PASSWORD`로 로그인

3. **성공**: 관리자 대시보드로 이동

4. **실패**:
   - "Invalid credentials" → 환경 변수 확인
   - "CSRF token mismatch" → `CSRF_SECRET` 확인
   - "Internal server error" → 로그 확인

---

## 🐛 문제 해결 (Troubleshooting)

### 문제 1: 여전히 스켈레톤만 표시

**원인**: DATABASE_URL이 잘못됨

**해결책**:
1. Vercel 대시보드에서 `DATABASE_URL` 값 확인
2. 정확히 복사되었는지 확인 (공백 없음)
3. Prisma Accelerate 연결 문자열인지 확인 (`prisma+postgres://` 시작)

**검증**:
```bash
# Vercel 로그 확인
npx vercel logs --prod
```

---

### 문제 2: localhost URL이 여전히 표시

**원인**: `NEXT_PUBLIC_SITE_URL` 미설정 또는 재배포 안 함

**해결책**:
1. Vercel 대시보드에서 `NEXT_PUBLIC_SITE_URL` 확인
2. Environment: **Production** 체크 확인
3. 재배포 실행

---

### 문제 3: 관리자 로그인 실패

**원인**: `ADMIN_PASSWORD` 또는 `JWT_SECRET` 미설정

**해결책**:
1. 모든 필수 환경 변수 설정 확인
2. Vercel 로그에서 에러 확인:
   ```bash
   npx vercel logs --prod | grep -i "error\|admin"
   ```

---

### 문제 4: OAuth 로그인 실패

**원인**: Redirect URI 불일치

**해결책**:
1. Kakao/Google 개발자 콘솔에서 Redirect URI 확인
2. 정확히 일치해야 함:
   ```
   https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app/api/auth/callback/kakao
   ```
3. 프로토콜(`https://`), 경로(`/api/auth/callback/kakao`) 정확히 입력

---

## 📊 환경 변수 요약표

| 변수 이름 | 필수 여부 | 예시 값 | 비고 |
|-----------|----------|---------|------|
| DATABASE_URL | 🔴 필수 | `prisma+postgres://...` | Prisma Accelerate |
| NEXT_PUBLIC_SITE_URL | 🔴 필수 | `https://yourdomain.com` | 메타데이터용 |
| NEXTAUTH_SECRET | 🔴 필수 | `XtK9mP2qR8vL5nJ7...` | 32자 랜덤 |
| NEXTAUTH_URL | 🔴 필수 | `https://yourdomain.com` | SITE_URL과 동일 |
| JWT_SECRET | 🔴 필수 | `Y7uI8oP1qW2eR3tY...` | 32자 랜덤 |
| CSRF_SECRET | 🔴 필수 | `Z9xC8vB7nM6qW5eR...` | 32자 랜덤 |
| ADMIN_PASSWORD | 🔴 필수 | `Admin2025!Secure...` | 16자 이상 |
| ADMIN_USERNAME | 🟡 권장 | `admin` | 기본값 있음 |
| JWT_EXPIRES_IN | 🟡 권장 | `7d` | 기본값 7일 |
| RATE_LIMIT_WINDOW | 🟡 권장 | `60000` | 60초 |
| RATE_LIMIT_MAX_REQUESTS | 🟡 권장 | `100` | 60초당 100개 |
| NODE_ENV | 🟡 권장 | `production` | Vercel 자동 설정 |
| KAKAO_CLIENT_ID | 🟢 선택 | `abc123...` | 카카오 로그인 |
| KAKAO_CLIENT_SECRET | 🟢 선택 | `xyz789...` | 카카오 로그인 |
| GOOGLE_CLIENT_ID | 🟢 선택 | `123-abc.apps...` | 구글 로그인 |
| GOOGLE_CLIENT_SECRET | 🟢 선택 | `GOCSPX-...` | 구글 로그인 |

---

## 🎯 최종 체크리스트

환경 변수 설정 완료 후 다음을 확인하세요:

- [ ] **7개 필수 환경 변수** 모두 설정
- [ ] **Vercel 재배포** 완료
- [ ] **Health Check API** 응답 `"database": "connected"`
- [ ] **홈페이지** 30초 이내 로딩 완료
- [ ] **제품 카드** 실제 데이터 표시 (스켈레톤 아님)
- [ ] **메타데이터** `og:url`이 실제 도메인
- [ ] **관리자 로그인** 성공
- [ ] **관리자 대시보드** 통계 표시

모두 체크되면 **하드코딩 제거 완료**! 🎉

---

**작성일**: 2025-11-15
**작성자**: Claude Code
**문서 버전**: 1.0.0
