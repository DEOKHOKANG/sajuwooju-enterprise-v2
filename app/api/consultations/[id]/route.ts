/**
 * GET /api/consultations/[id]
 * Get a specific consultation by ID or sessionId
 *
 * NOTE: Temporarily disabled - Prisma not configured for deployment
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: '상담 내역 조회 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}

/**
 * PATCH /api/consultations/[id]
 * Update a consultation (mainly for updating sajuData and status)
 *
 * NOTE: Temporarily disabled - Prisma not configured for deployment
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: '상담 내역 업데이트 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}
