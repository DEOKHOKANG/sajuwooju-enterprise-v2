/**
 * Admin Stats API - Product Statistics
 * GET /api/admin/stats/products
 *
 * 기능: 제품 관련 상세 통계 조회
 * 권한: admin (read 권한 필요)
 * 응답:
 *   - totalProducts: 전체 제품 수
 *   - activeProducts: 활성 제품 수
 *   - productsByCategory: 카테고리별 제품 분포
 *   - topProducts: 인기 제품 순위 (조회수 기준)
 *   - recentProducts: 최근 추가된 제품
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

    // 병렬 쿼리 실행
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      productsByCategory,
      recentProducts,
      topProducts,
    ] = await Promise.all([
      // 전체 제품 수
      prisma.product.count(),

      // 활성 제품 수
      prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      // 비활성 제품 수
      prisma.product.count({
        where: {
          isActive: false,
        },
      }),

      // 카테고리별 제품 수
      prisma.productCategory.groupBy({
        by: ['categoryId'],
        _count: {
          productId: true,
        },
      }),

      // 최근 추가된 제품 (10개)
      prisma.product.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          discountPrice: true,
          views: true,
          isActive: true,
          createdAt: true,
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),

      // 인기 제품 TOP 10 (조회수 기준)
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          discountPrice: true,
          views: true,
          createdAt: true,
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: {
          views: 'desc',
        },
        take: 10,
      }),
    ]);

    // 카테고리 정보 조회
    const categoryIds = productsByCategory.map((item) => item.categoryId);
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        color: true,
      },
    });

    // 카테고리별 제품 분포 데이터 구성
    const categoryStats = productsByCategory.map((item) => {
      const category = categories.find((c) => c.id === item.categoryId);
      return {
        category: category || null,
        productCount: item._count.productId,
      };
    });

    // 제품 데이터 포맷팅
    const formatProduct = (product: any) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      views: product.views,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      categories: product.categories.map((pc: any) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
    });

    // 응답 데이터 구성
    const stats = {
      overview: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
      },
      categories: categoryStats,
      topProducts: topProducts.map(formatProduct),
      recentProducts: recentProducts.map(formatProduct),
    };

    return NextResponse.json(
      {
        success: true,
        stats,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[Admin Product Stats Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 통계 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
