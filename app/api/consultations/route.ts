/**
 * POST /api/consultations
 * Create a new consultation
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
        message: '상담 생성 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}

/**
 * GET /api/consultations
 * Get consultations list (with pagination and filters)
 *
 * NOTE: Temporarily disabled - Prisma not configured for deployment
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: '상담 목록 조회 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}
