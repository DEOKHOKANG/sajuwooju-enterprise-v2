/**
 * Admin Stats API - Saju Analysis Statistics
 * GET /api/admin/stats/analyses
 *
 * 기능: 사주 분석 관련 상세 통계 조회
 * 권한: admin (read 권한 필요)
 * 쿼리 파라미터:
 *   - period: 조회 기간 (7d, 30d, 90d, 1y) - 기본값: 30d
 * 응답:
 *   - totalAnalyses: 전체 분석 수
 *   - periodAnalyses: 기간별 분석 수
 *   - analysesByCategory: 카테고리별 분석 분포
 *   - dailyAnalysisChart: 일별 분석 수 차트 데이터
 *   - topCategories: 인기 카테고리 순위
 *   - recentAnalyses: 최근 분석 기록
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'read');

    if (error || !admin) {
      return NextResponse.json(
        {
          success: false,
          error: error || '인증되지 않았습니다.',
        },
        { status }
      );
    }

    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // 기간 계산
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // 병렬 쿼리 실행
    const [
      totalAnalyses,
      periodAnalyses,
      recentAnalyses,
    ] = await Promise.all([
      // 전체 분석 수 (RecentAnalysis)
      prisma.sajuAnalysis.count(),

      // 기간별 분석 수
      prisma.sajuAnalysis.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),

      // 최근 분석 기록 (10개)
      prisma.sajuAnalysis.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),
    ]);

    // 일별 분석 수 차트 데이터 생성
    const dailyChart = await generateDailyAnalysisChart(startDate, now);

    // 카테고리별 분석 분포 (Product 기반)
    const categoryAnalyses = await getCategoryAnalysisDistribution();

    // 응답 데이터 구성
    const stats = {
      overview: {
        total: totalAnalyses,
        period: periodAnalyses,
        periodLabel: period,
      },
      dailyChart,
      categories: categoryAnalyses,
      recentAnalyses: recentAnalyses.map((analysis) => ({
        id: analysis.id,
        category: analysis.category,
        birthDate: analysis.birthDate ? analysis.birthDate.toISOString() : null,
        birthTime: analysis.birthTime,
        user: analysis.user
          ? {
              id: analysis.user.id,
              name: analysis.user.name,
              email: analysis.user.email,
              image: analysis.user.image,
            }
          : null,
        createdAt: analysis.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(
      {
        success: true,
        stats,
        timestamp: now.toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[Admin Analysis Stats Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사주 분석 통계 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * 일별 분석 수 차트 데이터 생성
 */
async function generateDailyAnalysisChart(startDate: Date, endDate: Date) {
  const days: { date: string; count: number }[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);

    const count = await prisma.sajuAnalysis.count({
      where: {
        createdAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    days.push({
      date: currentDate.toISOString().split('T')[0],
      count,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

/**
 * 카테고리별 분석 분포 조회
 * RecentAnalysis의 category 필드 기반
 */
async function getCategoryAnalysisDistribution() {
  const analyses = await prisma.sajuAnalysis.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
    orderBy: {
      _count: {
        category: 'desc',
      },
    },
  });

  return analyses.map((item) => ({
    category: item.category,
    count: item._count.category,
  }));
}
