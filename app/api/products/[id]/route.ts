/**
 * Product Detail API - 제품 상세 조회
 * GET /api/products/[id]
 *
 * 기능: 단일 제품의 상세 정보 조회 (카테고리 포함)
 * 인증: 선택 (비로그인 사용자도 조회 가능)
 * 부가 기능: 조회수 자동 증가
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 제품 조회
    const product = await prisma.product.findUnique({
      where: { id },
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
                description: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // 제품이 없거나 비활성화된 경우
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: '제품을 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: '해당 제품은 현재 이용할 수 없습니다.',
        },
        { status: 410 }
      );
    }

    // 조회수 증가 (비동기, 실패해도 응답 반환)
    prisma.product
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch((error) => {
        console.error('[Product View Count Error]', error);
      });

    // 응답 데이터 포맷팅
    const formattedProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      subtitle: product.subtitle,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      features: product.features,
      price: product.price,
      discountPrice: product.discountPrice,
      discount: product.discount,
      rating: product.rating,
      reviewCount: product.reviewCount,
      views: product.views,
      purchaseCount: product.purchaseCount,
      imageUrl: product.imageUrl,
      thumbnailUrl: product.thumbnailUrl,
      images: product.images,
      isFeatured: product.isFeatured,
      isPremium: product.isPremium,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      seoKeywords: product.seoKeywords,
      categories: product.categories.map((pc) => pc.category),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      publishedAt: product.publishedAt?.toISOString() || null,
    };

    return NextResponse.json(
      {
        success: true,
        product: formattedProduct,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('[Product Detail Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 상세 정보 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
