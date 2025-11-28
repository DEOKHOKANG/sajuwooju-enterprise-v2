#!/bin/bash

# 🔧 Vercel 환경 변수 자동 설정 스크립트
#
# 사용 방법:
#   bash scripts/setup-env.sh
#
# 이 스크립트는:
# 1. 랜덤 시크릿 키 생성
# 2. .env.production 파일 생성
# 3. Vercel CLI로 환경 변수 자동 설정

set -e  # 에러 발생 시 스크립트 중단

echo "🔧 사주우주 엔터프라이즈 - Vercel 환경 변수 설정"
echo "=================================================="
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. openssl 설치 확인
if ! command -v openssl &> /dev/null; then
    echo -e "${RED}❌ OpenSSL이 설치되지 않았습니다.${NC}"
    echo "   설치 방법:"
    echo "   - Windows: Git Bash 사용 또는 https://slproweb.com/products/Win32OpenSSL.html"
    echo "   - Mac: 기본 설치되어 있음"
    echo "   - Linux: sudo apt-get install openssl"
    exit 1
fi

echo -e "${GREEN}✅ OpenSSL 설치 확인 완료${NC}"

# 2. Vercel CLI 설치 확인
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI가 설치되지 않았습니다.${NC}"
    echo "   설치 중..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI 설치 완료${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI 설치 확인 완료${NC}"
fi

echo ""
echo "🔐 랜덤 시크릿 키 생성 중..."

# 3. 랜덤 시크릿 키 생성
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
CSRF_SECRET=$(openssl rand -base64 32)
ADMIN_PASSWORD=$(openssl rand -base64 24)

echo -e "${GREEN}✅ 시크릿 키 생성 완료${NC}"
echo ""

# 4. 배포 URL 설정
DEPLOYMENT_URL="https://sajuwooju-enterprise-j9wbxgoec-kevinglecs-projects.vercel.app"

echo "📝 생성된 환경 변수:"
echo "=================================================="
echo -e "${YELLOW}NEXTAUTH_SECRET:${NC} $NEXTAUTH_SECRET"
echo -e "${YELLOW}JWT_SECRET:${NC} $JWT_SECRET"
echo -e "${YELLOW}CSRF_SECRET:${NC} $CSRF_SECRET"
echo -e "${YELLOW}ADMIN_PASSWORD:${NC} $ADMIN_PASSWORD"
echo "=================================================="
echo ""

# 5. .env.production 파일 생성
echo "📄 .env.production 파일 생성 중..."

cat > .env.production << EOF
# 🔐 Production Environment Variables
# 자동 생성된 환경 변수 파일
# 생성 일시: $(date)

# ============================================
# 🔴 필수 환경 변수
# ============================================

# 1. DATABASE_URL - Prisma Accelerate
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19XRGVRbmNCb0FheG9Gb2E4bGtzY3oiLCJhcGlfa2V5IjoiMDFLOUtZRUNaWldHM1AwMzVTUTI5SllRVDQiLCJ0ZW5hbnRfaWQiOiJkNTdmOTEwYzZiYjVjYTdjNTc1N2U1Y2YzOTdhYWJlNDkwODFlZjZiMjYyOTkyOWI0MTJmMzllZTYwZmY1MTAzIiwiaW50ZXJuYWxfc2VjcmV0IjoiYzI4OTQ4OTctZjYyMy00OTczLThmMGItNTMzNGYwOTgwMGZkIn0.ZjGfuzAsHygqOwKZnvKWlcI45GFbO2TixX0PqF_Gn98

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

EOF

echo -e "${GREEN}✅ .env.production 파일 생성 완료${NC}"
echo ""

# 6. Vercel 환경 변수 설정 여부 확인
echo "🚀 Vercel에 환경 변수를 자동으로 설정하시겠습니까?"
echo ""
echo -e "${YELLOW}주의: Vercel 토큰이 필요합니다.${NC}"
echo "   토큰: QeozRVkagSj3QzumQNFkO8iO"
echo ""
read -p "계속하시겠습니까? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 Vercel 환경 변수 설정 중..."
    echo ""

    VERCEL_TOKEN="QeozRVkagSj3QzumQNFkO8iO"

    # 7. Vercel CLI로 환경 변수 설정
    echo "1/12: DATABASE_URL 설정 중..."
    vercel env add DATABASE_URL production <<< "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19XRGVRbmNCb0FheG9Gb2E4bGtzY3oiLCJhcGlfa2V5IjoiMDFLOUtZRUNaWldHM1AwMzVTUTI5SllRVDQiLCJ0ZW5hbnRfaWQiOiJkNTdmOTEwYzZiYjVjYTdjNTc1N2U1Y2YzOTdhYWJlNDkwODFlZjZiMjYyOTkyOWI0MTJmMzllZTYwZmY1MTAzIiwiaW50ZXJuYWxfc2VjcmV0IjoiYzI4OTQ4OTctZjYyMy00OTczLThmMGItNTMzNGYwOTgwMGZkIn0.ZjGfuzAsHygqOwKZnvKWlcI45GFbO2TixX0PqF_Gn98" --token $VERCEL_TOKEN

    echo "2/12: NEXT_PUBLIC_SITE_URL 설정 중..."
    vercel env add NEXT_PUBLIC_SITE_URL production <<< "$DEPLOYMENT_URL" --token $VERCEL_TOKEN

    echo "3/12: NEXTAUTH_SECRET 설정 중..."
    vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET" --token $VERCEL_TOKEN

    echo "4/12: NEXTAUTH_URL 설정 중..."
    vercel env add NEXTAUTH_URL production <<< "$DEPLOYMENT_URL" --token $VERCEL_TOKEN

    echo "5/12: JWT_SECRET 설정 중..."
    vercel env add JWT_SECRET production <<< "$JWT_SECRET" --token $VERCEL_TOKEN

    echo "6/12: CSRF_SECRET 설정 중..."
    vercel env add CSRF_SECRET production <<< "$CSRF_SECRET" --token $VERCEL_TOKEN

    echo "7/12: ADMIN_PASSWORD 설정 중..."
    vercel env add ADMIN_PASSWORD production <<< "$ADMIN_PASSWORD" --token $VERCEL_TOKEN

    echo "8/12: ADMIN_USERNAME 설정 중..."
    vercel env add ADMIN_USERNAME production <<< "admin" --token $VERCEL_TOKEN

    echo "9/12: JWT_EXPIRES_IN 설정 중..."
    vercel env add JWT_EXPIRES_IN production <<< "7d" --token $VERCEL_TOKEN

    echo "10/12: RATE_LIMIT_WINDOW 설정 중..."
    vercel env add RATE_LIMIT_WINDOW production <<< "60000" --token $VERCEL_TOKEN

    echo "11/12: RATE_LIMIT_MAX_REQUESTS 설정 중..."
    vercel env add RATE_LIMIT_MAX_REQUESTS production <<< "100" --token $VERCEL_TOKEN

    echo "12/12: NODE_ENV 설정 중..."
    vercel env add NODE_ENV production <<< "production" --token $VERCEL_TOKEN

    echo ""
    echo -e "${GREEN}✅ Vercel 환경 변수 설정 완료!${NC}"
    echo ""

    # 8. 재배포 여부 확인
    echo "🚀 지금 재배포하시겠습니까?"
    echo "   (환경 변수 적용을 위해 재배포가 필요합니다)"
    echo ""
    read -p "재배포하시겠습니까? (y/n): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "🔄 재배포 시작..."
        vercel --prod --token $VERCEL_TOKEN
        echo ""
        echo -e "${GREEN}✅ 재배포 완료!${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  나중에 수동으로 재배포해주세요:${NC}"
        echo "   vercel --prod"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Vercel 환경 변수 설정을 건너뛰었습니다.${NC}"
    echo ""
    echo "수동 설정 방법:"
    echo "1. Vercel 대시보드 접속: https://vercel.com/kevinglecs-projects/sajuwooju-enterprise"
    echo "2. Settings → Environment Variables 이동"
    echo "3. .env.production 파일의 내용을 복사하여 설정"
    echo ""
fi

# 9. 완료 메시지
echo ""
echo "=================================================="
echo -e "${GREEN}🎉 설정 완료!${NC}"
echo "=================================================="
echo ""
echo "📋 생성된 파일:"
echo "   - .env.production (환경 변수 파일)"
echo ""
echo "🔐 중요 정보:"
echo "   - 관리자 아이디: admin"
echo "   - 관리자 비밀번호: $ADMIN_PASSWORD"
echo ""
echo -e "${RED}⚠️  .env.production 파일을 안전한 곳에 백업하세요!${NC}"
echo -e "${RED}⚠️  Git에 커밋하지 마세요!${NC}"
echo ""
echo "📚 다음 단계:"
echo "1. 배포 확인: $DEPLOYMENT_URL"
echo "2. Health Check: $DEPLOYMENT_URL/api/health"
echo "3. 관리자 로그인: $DEPLOYMENT_URL/admin/login"
echo ""
echo "📖 자세한 가이드: VERCEL_ENV_SETUP_GUIDE.md"
echo ""
