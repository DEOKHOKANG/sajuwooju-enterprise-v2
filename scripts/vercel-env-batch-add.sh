#!/bin/bash

# 🔐 Vercel Environment Variables Batch Add Script
# Based on: vercel-env-manager skill
# Version: 1.0.0
# Created: 2025-11-15

# Configuration
VERCEL_TOKEN="${VERCEL_TOKEN:-$1}"
ENV_FILE="${ENV_FILE:-${2:-.env.production}}"
ENVIRONMENT="${ENVIRONMENT:-${3:-production}}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Error handling
set -e
trap 'echo -e "${RED}❌ Script failed at line $LINENO${NC}"' ERR

# Validation
if [ -z "$VERCEL_TOKEN" ]; then
  echo -e "${RED}❌ Error: VERCEL_TOKEN not provided${NC}"
  echo ""
  echo "Usage:"
  echo "  ./scripts/vercel-env-batch-add.sh <VERCEL_TOKEN> [ENV_FILE] [ENVIRONMENT]"
  echo ""
  echo "Example:"
  echo "  ./scripts/vercel-env-batch-add.sh QeozRVkagSj3QzumQNFkO8iO .env.production production"
  echo ""
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Error: File $ENV_FILE not found${NC}"
  exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
  echo -e "${GREEN}✅ Vercel CLI installed${NC}"
fi

# Verify token
echo -e "${CYAN}🔐 Verifying Vercel token...${NC}"
if ! vercel whoami --token "$VERCEL_TOKEN" &> /dev/null; then
  echo -e "${RED}❌ Error: Invalid Vercel token${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Token verified${NC}"
echo ""

# Display configuration
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}🚀 Vercel Environment Variable Batch Add${NC}"
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}📁 File: ${ENV_FILE}${NC}"
echo -e "${CYAN}🌍 Environment: ${ENVIRONMENT}${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Initialize counters
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
TOTAL_COUNT=0

# Backup existing variables
echo -e "${YELLOW}📋 Backing up existing environment variables...${NC}"
vercel env ls "$ENVIRONMENT" --token "$VERCEL_TOKEN" > "vercel-env-backup-$(date +%Y%m%d-%H%M%S).txt" 2>/dev/null || true
echo ""

# Read and process .env file
while IFS='=' read -r key value || [ -n "$key" ]; do
  # Skip comments
  if [[ "$key" =~ ^#.*$ ]]; then
    continue
  fi

  # Skip empty lines
  if [[ -z "$key" ]]; then
    continue
  fi

  # Trim whitespace from key
  key=$(echo "$key" | xargs)

  # Skip if key is empty after trimming
  if [[ -z "$key" ]]; then
    continue
  fi

  # Trim whitespace from value
  value=$(echo "$value" | xargs)

  # Remove quotes from value (both single and double)
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")

  TOTAL_COUNT=$((TOTAL_COUNT + 1))

  echo -e "${CYAN}⏳ [$TOTAL_COUNT] Adding: ${key}${NC}"

  # Add to Vercel (hide output, only show errors)
  if echo "$value" | vercel env add "$key" "$ENVIRONMENT" --token "$VERCEL_TOKEN" --yes > /dev/null 2>&1; then
    echo -e "${GREEN}✅ [$TOTAL_COUNT] Added: ${key}${NC}"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    # Try to get error details
    ERROR_MSG=$(echo "$value" | vercel env add "$key" "$ENVIRONMENT" --token "$VERCEL_TOKEN" --yes 2>&1 || true)

    if echo "$ERROR_MSG" | grep -q "already exists"; then
      echo -e "${YELLOW}⚠️  [$TOTAL_COUNT] Skipped (already exists): ${key}${NC}"
      SKIP_COUNT=$((SKIP_COUNT + 1))
    else
      echo -e "${RED}❌ [$TOTAL_COUNT] Failed: ${key}${NC}"
      echo -e "${RED}   Error: ${ERROR_MSG:0:100}${NC}"
      FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
  fi

  echo ""

done < "$ENV_FILE"

# Summary
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}📊 Batch Add Complete${NC}"
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Total Variables: ${TOTAL_COUNT}${NC}"
echo -e "${GREEN}✅ Successfully Added: ${SUCCESS_COUNT}${NC}"
echo -e "${YELLOW}⚠️  Skipped (Already Exist): ${SKIP_COUNT}${NC}"
echo -e "${RED}❌ Failed: ${FAIL_COUNT}${NC}"
echo ""

# Verify uploaded variables
echo -e "${CYAN}🔍 Verifying uploaded environment variables...${NC}"
echo ""
vercel env ls "$ENVIRONMENT" --token "$VERCEL_TOKEN" 2>/dev/null || true
echo ""

# Final status
if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}🎉 All environment variables processed successfully!${NC}"
  echo -e "${GREEN}========================================${NC}"
  echo ""
  echo -e "${YELLOW}⚡ Next steps:${NC}"
  echo -e "${YELLOW}   1. Verify variables in Vercel dashboard${NC}"
  echo -e "${YELLOW}   2. Redeploy: vercel --prod --token <TOKEN>${NC}"
  echo -e "${YELLOW}   3. Test deployment URL${NC}"
  echo ""
  exit 0
else
  echo -e "${YELLOW}========================================${NC}"
  echo -e "${YELLOW}⚠️  Some environment variables failed to add${NC}"
  echo -e "${YELLOW}========================================${NC}"
  echo ""
  echo -e "${YELLOW}Please check the errors above and retry manually if needed.${NC}"
  echo ""
  exit 1
fi
