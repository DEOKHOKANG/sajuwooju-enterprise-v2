/**
 * Admin Stats API - User Statistics
 * GET /api/admin/stats/users
 *
 * 기능: 사용자 관련 상세 통계 조회
 * 권한: admin (read 권한 필요)
 * 쿼리 파라미터:
 *   - period: 조회 기간 (7d, 30d, 90d, 1y) - 기본값: 30d
 * 응답:
 *   - totalUsers: 전체 사용자 수
 *   - newUsers: 기간별 신규 사용자 수
 *   - activeUsers: 활성 사용자 수
 *   - usersByProvider: OAuth 제공자별 분포
 *   - userGrowthChart: 일별 신규 가입자 차트 데이터
 *   - topUsers: 최다 분석 사용자 순위
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
      totalUsers,
      newUsers,
      activeUsers,
      usersByProvider,
      recentUsers,
      topUsersBySajuCount,
    ] = await Promise.all([
      // 전체 사용자 수
      prisma.user.count(),

      // 기간별 신규 사용자 수
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),

      // 활성 사용자 수 (기간 내 로그인)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startDate,
          },
        },
      }),

      // OAuth 제공자별 사용자 분포
      prisma.account.groupBy({
        by: ['provider'],
        _count: {
          userId: true,
        },
      }),

      // 최근 가입 사용자 (10명)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          lastLoginAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),

      // 최다 사주 분석 사용자 TOP 10
      prisma.sajuAnalysis.groupBy({
        by: ['userId'],
        _count: {
          userId: true,
        },
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // 일별 신규 가입자 차트 데이터 생성
    const userGrowthChart = await generateUserGrowthChart(startDate, now);

    // 최다 분석 사용자 정보 조회
    const topUsersIds = topUsersBySajuCount.map((item) => item.userId);
    const topUsersInfo = await prisma.user.findMany({
      where: {
        id: {
          in: topUsersIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // 사용자 정보와 분석 횟수 매핑
    const topUsers = topUsersBySajuCount.map((item) => {
      const userInfo = topUsersInfo.find((u) => u.id === item.userId);
      return {
        user: userInfo || null,
        analysisCount: item._count.userId,
      };
    });

    // OAuth 제공자 데이터 포맷팅
    const providerStats = usersByProvider.map((item) => ({
      provider: item.provider,
      count: item._count.userId,
    }));

    // 응답 데이터 구성
    const stats = {
      overview: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        period,
      },
      providers: providerStats,
      growthChart: userGrowthChart,
      recentUsers: recentUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
      })),
      topUsers,
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
    console.error('[Admin User Stats Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사용자 통계 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * 일별 신규 가입자 차트 데이터 생성
 */
async function generateUserGrowthChart(startDate: Date, endDate: Date) {
  const days: { date: string; count: number }[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);

    const count = await prisma.user.count({
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
