# 🔧 Vercel 환경 변수 자동 설정 스크립트 (PowerShell)
#
# 사용 방법:
#   powershell -ExecutionPolicy Bypass -File scripts\setup-env.ps1
#
# 또는 PowerShell에서:
#   cd sajuwooju-enterprise
#   .\scripts\setup-env.ps1

Write-Host "🔧 사주우주 엔터프라이즈 - Vercel 환경 변수 설정" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Node.js 설치 확인
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js가 설치되지 않았습니다." -ForegroundColor Red
    Write-Host "   https://nodejs.org 에서 다운로드하세요."
    exit 1
}

Write-Host "✅ Node.js 설치 확인 완료" -ForegroundColor Green

# 2. Vercel CLI 설치 확인
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Vercel CLI가 설치되지 않았습니다." -ForegroundColor Yellow
    Write-Host "   설치 중..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI 설치 완료" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI 설치 확인 완료" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔐 랜덤 시크릿 키 생성 중..." -ForegroundColor Cyan

# 3. 랜덤 시크릿 키 생성 함수
function Get-RandomSecret {
    param (
        [int]$Length = 32
    )
    $bytes = New-Object byte[] $Length
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
    $rng.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

# 시크릿 키 생성
$NEXTAUTH_SECRET = Get-RandomSecret
$JWT_SECRET = Get-RandomSecret
$CSRF_SECRET = Get-RandomSecret
$ADMIN_PASSWORD = Get-RandomSecret -Length 24

Write-Host "✅ 시크릿 키 생성 완료" -ForegroundColor Green
Write-Host ""

# 4. 배포 URL 설정
$DEPLOYMENT_URL = "https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app"
$DATABASE_URL = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19XRGVRbmNCb0FheG9Gb2E4bGtzY3oiLCJhcGlfa2V5IjoiMDFLOUtZRUNaWldHM1AwMzVTUTI5SllRVDQiLCJ0ZW5hbnRfaWQiOiJkNTdmOTEwYzZiYjVjYTdjNTc1N2U1Y2YzOTdhYWJlNDkwODFlZjZiMjYyOTkyOWI0MTJmMzllZTYwZmY1MTAzIiwiaW50ZXJuYWxfc2VjcmV0IjoiYzI4OTQ4OTctZjYyMy00OTczLThmMGItNTMzNGYwOTgwMGZkIn0.ZjGfuzAsHygqOwKZnvKWlcI45GFbO2TixX0PqF_Gn98"

Write-Host "📝 생성된 환경 변수:" -ForegroundColor Yellow
Write-Host "=================================================="
Write-Host "NEXTAUTH_SECRET: $NEXTAUTH_SECRET" -ForegroundColor Yellow
Write-Host "JWT_SECRET: $JWT_SECRET" -ForegroundColor Yellow
Write-Host "CSRF_SECRET: $CSRF_SECRET" -ForegroundColor Yellow
Write-Host "ADMIN_PASSWORD: $ADMIN_PASSWORD" -ForegroundColor Yellow
Write-Host "=================================================="
Write-Host ""

# 5. .env.production 파일 생성
Write-Host "📄 .env.production 파일 생성 중..." -ForegroundColor Cyan

$envContent = @"
# 🔐 Production Environment Variables
# 자동 생성된 환경 변수 파일
# 생성 일시: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# ============================================
# 🔴 필수 환경 변수
# ============================================

# 1. DATABASE_URL - Prisma Accelerate
DATABASE_URL=$DATABASE_URL

# 2. NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SITE_URL=$DEPLOYMENT_URL

# 3. NEXTAUTH_SECRET (자동 생성)
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# 4. NEXTAUTH_URL
NEXTAUTH_URL=$DEPLOYMENT_URL

# 5. JWT_SECRET (자동 생성)
JWT_SECRET=$JWT_SECRET

# 6. CSRF_SECRET (자동 생성)
CSRF_SECRET=$CSRF_SECRET

# 7. ADMIN_PASSWORD (자동 생성)
ADMIN_PASSWORD=$ADMIN_PASSWORD

# ============================================
# 🟡 권장 환경 변수
# ============================================

ADMIN_USERNAME=admin
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
NODE_ENV=production

"@

Set-Content -Path ".env.production" -Value $envContent -Encoding UTF8

Write-Host "✅ .env.production 파일 생성 완료" -ForegroundColor Green
Write-Host ""

# 6. 완료 메시지
Write-Host "=================================================="
Write-Host "🎉 환경 변수 생성 완료!" -ForegroundColor Green
Write-Host "=================================================="
Write-Host ""
Write-Host "📋 생성된 파일:" -ForegroundColor Cyan
Write-Host "   - .env.production (환경 변수 파일)"
Write-Host ""
Write-Host "🔐 중요 정보:" -ForegroundColor Yellow
Write-Host "   - 관리자 아이디: admin"
Write-Host "   - 관리자 비밀번호: $ADMIN_PASSWORD"
Write-Host ""
Write-Host "⚠️  .env.production 파일을 안전한 곳에 백업하세요!" -ForegroundColor Red
Write-Host "⚠️  Git에 커밋하지 마세요!" -ForegroundColor Red
Write-Host ""
Write-Host "📚 다음 단계:" -ForegroundColor Cyan
Write-Host "1. Vercel 대시보드 접속: https://vercel.com/kevinglecs-projects/sajuwooju-enterprise"
Write-Host "2. Settings → Environment Variables 이동"
Write-Host "3. .env.production 파일의 내용을 복사하여 설정"
Write-Host "4. 재배포: vercel --prod"
Write-Host ""
Write-Host "📖 자세한 가이드: VERCEL_ENV_SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

# 7. .env.production 파일을 클립보드에 복사 (선택)
$copyToClipboard = Read-Host "📋 .env.production 내용을 클립보드에 복사하시겠습니까? (y/n)"

if ($copyToClipboard -eq "y" -or $copyToClipboard -eq "Y") {
    Get-Content ".env.production" | Set-Clipboard
    Write-Host "✅ 클립보드에 복사되었습니다!" -ForegroundColor Green
    Write-Host "   Vercel 대시보드에서 Ctrl+V로 붙여넣기 하세요." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "설정을 완료했습니다! 🚀" -ForegroundColor Green
