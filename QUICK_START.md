# 🚀 사주우주 엔터프라이즈 - 빠른 시작 가이드

**목적**: 환경 변수 설정 후 프로덕션 배포를 완료합니다.

**현재 상태**:
- ✅ 코드 빌드 완료
- ✅ Vercel 배포 완료
- ❌ 환경 변수 미설정 (DATABASE_URL 등)
- ❌ 사이트 비정상 동작 (무한 로딩)

**소요 시간**: 10-15분

---

## 📋 단계별 가이드

### 1단계: 환경 변수 자동 생성 (3분)

#### Windows 사용자 (PowerShell):
```powershell
cd D:\saju\sajuwooju-enterprise
.\scripts\setup-env.ps1
```

#### Linux/Mac/Git Bash 사용자:
```bash
cd sajuwooju-enterprise
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

**결과**: `.env.production` 파일이 생성됩니다.

---

### 2단계: 생성된 환경 변수 확인 (1분)

생성된 `.env.production` 파일을 열어서 다음 값들이 있는지 확인하세요:

```env
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=...
NEXT_PUBLIC_SITE_URL=https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app
NEXTAUTH_SECRET=(자동 생성된 32자 랜덤 키)
JWT_SECRET=(자동 생성된 32자 랜덤 키)
CSRF_SECRET=(자동 생성된 32자 랜덤 키)
ADMIN_PASSWORD=(자동 생성된 24자 랜덤 키)
```

⚠️ **중요**: `ADMIN_PASSWORD` 값을 별도로 복사해두세요. 관리자 로그인 시 필요합니다.

---

### 3단계: Vercel에 환경 변수 설정 (5분)

#### 3.1 Vercel 대시보드 접속
```
https://vercel.com/kevinglecs-projects/sajuwooju-enterprise
```

#### 3.2 Settings → Environment Variables 이동

#### 3.3 환경 변수 추가
`.env.production` 파일의 **모든 내용**을 복사하여 한 번에 붙여넣기:

1. **"Add New" 버튼** 클릭
2. **"Bulk Edit"** 클릭 (여러 개 한 번에 입력)
3. `.env.production` 파일 내용 전체 복사 → 붙여넣기
4. **Environment**: `Production` 선택
5. **"Save" 버튼** 클릭

#### 3.4 확인
15개 환경 변수가 모두 추가되었는지 확인:
- DATABASE_URL
- NEXT_PUBLIC_SITE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- JWT_SECRET
- CSRF_SECRET
- ADMIN_USERNAME
- ADMIN_PASSWORD
- JWT_EXPIRES_IN
- RATE_LIMIT_WINDOW
- RATE_LIMIT_MAX_REQUESTS
- NODE_ENV
- (Optional) KAKAO_CLIENT_ID
- (Optional) KAKAO_CLIENT_SECRET
- (Optional) GOOGLE_CLIENT_ID
- (Optional) GOOGLE_CLIENT_SECRET

---

### 4단계: 재배포 (2분)

#### 자동 재배포 (권장)
Vercel은 환경 변수 변경 시 **자동으로 재배포**됩니다.
- Vercel 대시보드에서 "Deployments" 탭 확인
- 새로운 배포가 시작되었는지 확인 (약 2-3분 소요)

#### 수동 재배포 (필요 시)
```bash
cd D:\saju\sajuwooju-enterprise
npx vercel --prod --token QeozRVkagSj3QzumQNFkO8iO
```

---

### 5단계: 배포 확인 (2분)

#### 5.1 사이트 접속
```
https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app
```

#### 5.2 체크리스트
- [ ] 홈페이지가 **30초 이내**에 로딩 완료 (무한 로딩 ❌)
- [ ] 제품 카드가 **실제 데이터**로 표시 (스켈레톤 UI만 ❌)
- [ ] 카테고리 아이콘이 표시됨
- [ ] 슬라이더가 동작함

#### 5.3 메타데이터 확인
브라우저에서 **페이지 소스 보기** (Ctrl+U):

```html
<!-- ✅ 올바른 예시 -->
<meta property="og:url" content="https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app"/>

<!-- ❌ 잘못된 예시 (수정 필요) -->
<meta property="og:url" content="http://localhost:3000"/>
```

#### 5.4 관리자 로그인 테스트
```
URL: https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app/admin/login
아이디: admin
비밀번호: (2단계에서 복사한 ADMIN_PASSWORD)
```

- [ ] 로그인 성공
- [ ] 관리자 대시보드 통계 표시

---

## 🔍 문제 해결 (Troubleshooting)

### 문제 1: 여전히 무한 로딩 (스켈레톤 UI만 표시)

**원인**: 환경 변수가 제대로 설정되지 않았거나 배포가 완료되지 않음

**해결책**:
1. Vercel 대시보드에서 "Deployments" 탭 확인
2. 최신 배포가 **"Ready"** 상태인지 확인
3. "Environment Variables" 탭에서 `DATABASE_URL`이 설정되어 있는지 확인
4. 설정되어 있지 않다면 3단계 다시 진행

---

### 문제 2: 메타데이터에 여전히 localhost 표시

**원인**: `NEXT_PUBLIC_SITE_URL` 환경 변수 미설정

**해결책**:
1. Vercel 대시보드 → Environment Variables 확인
2. `NEXT_PUBLIC_SITE_URL` 값이 있는지 확인:
   ```
   https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app
   ```
3. 없다면 추가 후 재배포

---

### 문제 3: 관리자 로그인 실패

**원인**: `ADMIN_PASSWORD` 불일치 또는 `JWT_SECRET` 미설정

**해결책**:
1. `.env.production` 파일에서 `ADMIN_PASSWORD` 확인
2. Vercel 환경 변수에 정확히 동일한 값이 설정되어 있는지 확인
3. `JWT_SECRET`, `CSRF_SECRET`도 설정되어 있는지 확인

---

### 문제 4: API 엔드포인트 에러 (500 Error)

**원인**: DATABASE_URL 연결 실패 또는 Prisma 마이그레이션 미실행

**해결책**:
```bash
# 로컬에서 마이그레이션 실행
cd D:\saju\sajuwooju-enterprise
npx prisma migrate deploy

# Vercel에서 자동 실행되도록 설정 (package.json 확인)
# "build": "prisma generate && next build"
```

---

## 📊 검증 체크리스트

환경 변수 설정 및 배포 완료 후 다음 항목들을 확인하세요:

### 필수 검증 (Critical)
- [ ] **홈페이지 로딩**: 30초 이내에 완료 (무한 로딩 ❌)
- [ ] **제품 카드**: 실제 데이터로 렌더링 (스켈레톤 ❌)
- [ ] **메타데이터**: `og:url`이 실제 도메인 (localhost ❌)
- [ ] **관리자 로그인**: 성공

### 권장 검증 (High Priority)
- [ ] **카테고리 필터링**: 동작함
- [ ] **검색 기능**: 동작함
- [ ] **제품 상세 페이지**: 이동 가능
- [ ] **좋아요 기능**: 동작함

### 선택 검증 (Nice to Have)
- [ ] **API 응답 속도**: < 500ms
- [ ] **Lighthouse Performance**: > 85점
- [ ] **모바일 반응형**: 정상 동작

---

## 🎯 다음 단계

환경 변수 설정 및 배포가 완료되면:

### 1. 하드코딩 탐지 E2E 테스트 실행
```bash
cd D:\saju\sajuwooju-enterprise
npx playwright test tests/hardcoding-detection.spec.ts --reporter=list
```

**기대 결과**:
- 모든 테스트 통과 (11/11)
- 또는 일부 테스트 실패 시 보고서 확인

### 2. 보고서 확인
```bash
# 테스트 결과 HTML 보고서
npx playwright show-report

# 또는 JSON 보고서
cat test-results/hardcoding-report.json
```

### 3. 남은 이슈 수정
테스트 결과에 따라 남은 하드코딩 이슈 수정

### 4. 최종 배포
모든 이슈 수정 후 프로덕션 최종 배포

---

## 📚 추가 문서

- **상세 환경 변수 가이드**: `VERCEL_ENV_SETUP_GUIDE.md`
- **하드코딩 탐지 보고서**: `HARDCODING_DETECTION_REPORT.md`
- **하드코딩 수정 요약**: `HARDCODING_FIX_SUMMARY.md`
- **배포 성공 가이드**: `DEPLOYMENT_SUCCESS.md`

---

## 💡 팁

### 환경 변수 백업
`.env.production` 파일을 **안전한 곳에 백업**하세요:
- USB 드라이브
- 암호화된 클라우드 스토리지 (Google Drive, Dropbox)
- 비밀번호 관리 도구 (1Password, Bitwarden)

⚠️ **절대로 Git에 커밋하지 마세요!**

### 커스텀 도메인 설정 (선택)
Vercel에서 커스텀 도메인을 설정하면:
1. Vercel 대시보드 → Settings → Domains
2. `sajuwooju.com` 또는 원하는 도메인 추가
3. DNS 설정 (A 레코드 또는 CNAME)
4. `NEXT_PUBLIC_SITE_URL` 환경 변수 업데이트
5. 재배포

---

**작성자**: Claude Code (Automation Script Generator)
**작성일**: 2025-11-15
**버전**: 1.0

🚀 **지금 바로 시작하세요!** → `.\scripts\setup-env.ps1` 실행
