/**
 * POST /api/ai/analyze
 * Phase 8.9: AI Analysis API Endpoint
 * Analyzes saju data using OpenAI and returns structured fortune analysis
 *
 * NOTE: Temporarily disabled - Prisma not configured for deployment
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Temporarily disabled - Prisma not configured
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'AI 분석 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}

/**
 * GET /api/ai/analyze?consultationId={id}&category={category}
 * Get cached AI analysis result for a consultation
 */
export async function GET(request: NextRequest) {
  // Temporarily disabled - Prisma not configured
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'AI 분석 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}
