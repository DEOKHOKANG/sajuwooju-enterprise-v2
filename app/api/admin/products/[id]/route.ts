/**
 * Admin Products API - 개별 제품 관리
 * GET /api/admin/products/[id] - 제품 상세 조회
 * PATCH /api/admin/products/[id] - 제품 수정
 * DELETE /api/admin/products/[id] - 제품 삭제
 *
 * 권한: read (GET), write (PATCH), delete (DELETE)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET - 제품 상세 조회
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'read');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 파라미터 추출
    const { id } = await context.params;

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
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: '제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 응답 데이터 포맷팅
    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        features: product.features,
        price: product.price,
        discountPrice: product.discountPrice,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        views: product.views,
        categories: product.categories.map((pc) => ({
          id: pc.category.id,
          name: pc.category.name,
          slug: pc.category.slug,
          icon: pc.category.icon,
          color: pc.category.color,
          gradient: pc.category.gradient,
        })),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Admin Product GET Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH - 제품 수정
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'write');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 파라미터 추출
    const { id } = await context.params;

    // 요청 본문 파싱
    const body = await request.json();
    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      features,
      price,
      discountPrice,
      isActive,
      isFeatured,
      categoryIds, // 카테고리 ID 배열 (있으면 전체 교체)
    } = body;

    // 제품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: '제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 슬러그 변경 시 중복 확인
    if (slug && slug !== existingProduct.slug) {
      const duplicateSlug = await prisma.product.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { success: false, error: '이미 존재하는 슬러그입니다.' },
          { status: 409 }
        );
      }
    }

    // 제품 수정 (트랜잭션)
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. 제품 정보 수정
      const product = await tx.product.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(slug !== undefined && { slug }),
          ...(shortDescription !== undefined && { shortDescription }),
          ...(fullDescription !== undefined && { fullDescription }),
          ...(features !== undefined && { features }),
          ...(price !== undefined && { price }),
          ...(discountPrice !== undefined && { discountPrice }),
          ...(isActive !== undefined && { isActive }),
          ...(isFeatured !== undefined && { isFeatured }),
        },
      });

      // 2. 카테고리 업데이트 (있는 경우)
      if (categoryIds && Array.isArray(categoryIds)) {
        // 기존 카테고리 연결 삭제
        await tx.productCategory.deleteMany({
          where: { productId: id },
        });

        // 새 카테고리 연결 생성
        if (categoryIds.length > 0) {
          await tx.productCategory.createMany({
            data: categoryIds.map((categoryId: string) => ({
              productId: id,
              categoryId,
            })),
          });
        }
      }

      return product;
    });

    // 수정된 제품 조회 (카테고리 포함)
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
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product!.id,
        title: product!.title,
        slug: product!.slug,
        shortDescription: product!.shortDescription,
        fullDescription: product!.fullDescription,
        features: product!.features,
        price: product!.price,
        discountPrice: product!.discountPrice,
        isActive: product!.isActive,
        isFeatured: product!.isFeatured,
        views: product!.views,
        categories: product!.categories.map((pc) => ({
          id: pc.category.id,
          name: pc.category.name,
          slug: pc.category.slug,
          icon: pc.category.icon,
          color: pc.category.color,
        })),
        createdAt: product!.createdAt.toISOString(),
        updatedAt: product!.updatedAt.toISOString(),
      },
      message: '제품이 수정되었습니다.',
    });
  } catch (error) {
    console.error('[Admin Product PATCH Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 수정 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - 제품 삭제
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'delete');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 파라미터 추출
    const { id } = await context.params;

    // 제품 존재 확인
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: '제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 제품 삭제 (트랜잭션 - cascade로 카테고리 연결도 자동 삭제)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '제품이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('[Admin Product DELETE Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 삭제 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
