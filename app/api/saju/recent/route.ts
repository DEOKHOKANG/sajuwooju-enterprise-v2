/**
 * Recent Saju Analyses API - 최근 사주 분석
 * GET /api/saju/recent
 *
 * 기능: 현재 로그인한 사용자의 최근 3개 사주 분석 조회
 * 인증: 필수
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // URL 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');

    // 최근 사주 분석 조회
    const recentAnalyses = await prisma.sajuAnalysis.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        category: true,
        title: true,
        birthDate: true,
        visibility: true,
        viewCount: true,
        likeCount: true,
        isPremium: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      analyses: recentAnalyses.map((analysis) => ({
        ...analysis,
        birthDate: analysis.birthDate.toISOString(),
        createdAt: analysis.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('[Recent Saju Analyses Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '최근 사주 분석 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
