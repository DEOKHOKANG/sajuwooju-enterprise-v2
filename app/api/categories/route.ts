/**
 * Categories API - 카테고리 목록 조회
 * GET /api/categories
 *
 * 기능: 활성화된 카테고리 목록 조회
 * 인증: 선택 (비로그인 사용자도 조회 가능)
 * 쿼리 파라미터:
 *   - includeProductCount: 카테고리별 제품 수 포함 (true/false)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeProductCount = searchParams.get('includeProductCount') === 'true';

    // 카테고리 조회
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: includeProductCount
        ? {
            _count: {
              select: {
                products: {
                  where: {
                    product: {
                      isActive: true,
                    },
                  },
                },
              },
            },
          }
        : undefined,
    });

    // 응답 데이터 포맷팅
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      gradient: category.gradient,
      order: category.order,
      ...(includeProductCount && {
        productCount: (category as any)._count?.products || 0,
      }),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        categories: formattedCategories,
        total: categories.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('[Categories API Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '카테고리 목록 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
