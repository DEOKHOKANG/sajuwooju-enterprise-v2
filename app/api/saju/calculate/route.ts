/**
 * POST /api/saju/calculate
 * Phase 8.6: Saju Calculation API Endpoint
 * Calculates saju pillars and creates consultation record
 *
 * NOTE: Temporarily disabled - Prisma not configured for deployment
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: '사주 계산 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}
