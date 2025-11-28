/**
 * Admin Stats API - Overview Statistics
 * GET /api/admin/stats/overview
 *
 * 기능: 관리자 대시보드 메인 통계 조회
 * 권한: admin (read 권한 필요)
 * 응답:
 *   - totalUsers: 전체 사용자 수
 *   - activeUsers: 활성 사용자 수 (최근 30일)
 *   - totalProducts: 전체 제품 수
 *   - activeProducts: 활성 제품 수
 *   - totalOrders: 전체 주문 수 (추후 구현)
 *   - totalRevenue: 총 매출 (추후 구현)
 *   - recentAnalyses: 최근 사주 분석 수
 *   - growthRate: 전월 대비 성장률
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 인증 및 권한 확인 (read 권한 필요)
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

    // 현재 날짜 및 기간 계산
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 병렬로 통계 데이터 조회
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalCategories,
      totalRecentAnalyses,
      lastMonthUsers,
      thisMonthUsers,
      lastMonthAnalyses,
      thisMonthAnalyses,
    ] = await Promise.all([
      // 전체 사용자 수
      prisma.user.count(),

      // 활성 사용자 수 (최근 30일 로그인)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      // 전체 제품 수
      prisma.product.count(),

      // 활성 제품 수
      prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      // 전체 카테고리 수
      prisma.category.count({
        where: {
          isActive: true,
        },
      }),

      // 전체 사주 분석 수
      prisma.sajuAnalysis.count(),

      // 지난달 신규 사용자 수
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // 이번달 신규 사용자 수
      prisma.user.count({
        where: {
          createdAt: {
            gte: thisMonthStart,
          },
        },
      }),

      // 지난달 사주 분석 수
      prisma.sajuAnalysis.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // 이번달 사주 분석 수
      prisma.sajuAnalysis.count({
        where: {
          createdAt: {
            gte: thisMonthStart,
          },
        },
      }),
    ]);

    // 성장률 계산
    const userGrowthRate =
      lastMonthUsers > 0
        ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
        : thisMonthUsers > 0
        ? 100
        : 0;

    const analysisGrowthRate =
      lastMonthAnalyses > 0
        ? ((thisMonthAnalyses - lastMonthAnalyses) / lastMonthAnalyses) * 100
        : thisMonthAnalyses > 0
        ? 100
        : 0;

    // 응답 데이터 구성
    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        thisMonth: thisMonthUsers,
        lastMonth: lastMonthUsers,
        growthRate: Math.round(userGrowthRate * 100) / 100,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: totalProducts - activeProducts,
      },
      categories: {
        total: totalCategories,
      },
      analyses: {
        total: totalRecentAnalyses,
        thisMonth: thisMonthAnalyses,
        lastMonth: lastMonthAnalyses,
        growthRate: Math.round(analysisGrowthRate * 100) / 100,
      },
      // 추후 구현될 기능들 (placeholder)
      orders: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        growthRate: 0,
      },
      revenue: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        growthRate: 0,
      },
    };

    return NextResponse.json(
      {
        success: true,
        stats,
        timestamp: now.toISOString(),
      },
      {
        headers: {
          // 5분간 캐시 (통계 데이터는 자주 변경되지 않음)
          'Cache-Control': 'private, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[Admin Stats Overview Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '통계 데이터 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
