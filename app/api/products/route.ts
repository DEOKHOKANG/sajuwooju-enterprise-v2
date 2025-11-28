/**
 * Products API - 제품 목록 조회
 * GET /api/products
 *
 * 기능: 활성화된 제품 목록 조회 (카테고리 포함)
 * 인증: 선택 (비로그인 사용자도 조회 가능)
 * 쿼리 파라미터:
 *   - search: 검색어 (제목, 설명에서 검색)
 *   - category: 카테고리 slug (선택)
 *   - featured: 추천 제품만 조회 (true/false)
 *   - minPrice: 최소 가격 필터
 *   - maxPrice: 최대 가격 필터
 *   - limit: 결과 개수 제한 (기본: 50)
 *   - offset: 페이지네이션 오프셋 (기본: 0)
 *   - page: 페이지 번호 (1부터 시작, offset 대체)
 *   - sortBy: 정렬 기준 (newest, popular, rating, price, price-desc)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();
    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');
    // page가 있으면 page 기반 offset 계산, 없으면 직접 offset 사용
    const offset = page > 0 ? (page - 1) * limit : parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'newest';

    // 쿼리 조건 구성
    const where: any = {
      isActive: true,
    };

    // 검색어 필터링 (제목, 부제목, 설명에서 검색)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { fullDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured) {
      where.isFeatured = true;
    }

    // 가격 범위 필터링
    if (minPrice || maxPrice) {
      where.AND = where.AND || [];
      if (minPrice) {
        where.AND.push({
          OR: [
            { discountPrice: { gte: parseInt(minPrice) } },
            { AND: [{ discountPrice: null }, { price: { gte: parseInt(minPrice) } }] },
          ],
        });
      }
      if (maxPrice) {
        where.AND.push({
          OR: [
            { discountPrice: { lte: parseInt(maxPrice) } },
            { AND: [{ discountPrice: null }, { price: { lte: parseInt(maxPrice) } }] },
          ],
        });
      }
    }

    // 카테고리 필터링
    if (categorySlug) {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
            isActive: true,
          },
        },
      };
    }

    // 정렬 기준
    let orderBy: any = { createdAt: 'desc' }; // 기본: 최신순
    switch (sortBy) {
      case 'popular':
        orderBy = { views: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'price':
      case 'price-asc':
        orderBy = [
          { discountPrice: 'asc' },
          { price: 'asc' },
        ];
        break;
      case 'price-desc':
        orderBy = [
          { discountPrice: 'desc' },
          { price: 'desc' },
        ];
        break;
      case 'purchases':
        orderBy = { purchaseCount: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
    }

    // 제품 조회 (카테고리 정보 포함)
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  icon: true,
                  color: true,
                  gradient: true,
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // 응답 데이터 포맷팅
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      shortDescription: product.shortDescription,
      price: product.price,
      discount: product.discount,
      discountPrice: product.discountPrice,
      finalPrice: product.discountPrice ?? product.price,
      rating: product.rating,
      reviewCount: product.reviewCount,
      views: product.views,
      viewCount: product.views,
      purchaseCount: product.purchaseCount,
      imageUrl: product.imageUrl,
      thumbnailUrl: product.thumbnailUrl,
      images: product.images,
      isFeatured: product.isFeatured,
      isPremium: product.isPremium,
      categories: product.categories.map((pc) => pc.category),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    // 페이지 정보 계산
    const totalPages = Math.ceil(total / limit);
    const currentPage = page > 0 ? page : Math.floor(offset / limit) + 1;

    return NextResponse.json(
      {
        success: true,
        products: formattedProducts,
        pagination: {
          total,
          limit,
          offset,
          page: currentPage,
          totalPages,
          hasMore: offset + limit < total,
          hasPrevious: currentPage > 1,
          hasNext: currentPage < totalPages,
        },
        meta: {
          search: search || null,
          category: categorySlug || null,
          sortBy,
          filters: {
            featured: featured || null,
            minPrice: minPrice ? parseInt(minPrice) : null,
            maxPrice: maxPrice ? parseInt(maxPrice) : null,
          },
        },
      },
      {
        headers: {
          'Cache-Control': search ? 'private, no-cache' : 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('[Products API Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 목록 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
