/**
 * Admin Categories API - 개별 카테고리 관리
 * GET /api/admin/categories/[id] - 카테고리 상세 조회
 * PATCH /api/admin/categories/[id] - 카테고리 수정
 * DELETE /api/admin/categories/[id] - 카테고리 삭제
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
 * GET - 카테고리 상세 조회
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

    // 카테고리 조회
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                isActive: true,
              },
            },
          },
          take: 10, // 최근 10개 제품만
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: '카테고리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 응답 데이터 포맷팅
    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
        gradient: category.gradient,
        order: category.order,
        isActive: category.isActive,
        productCount: (category as any)._count.products,
        products: category.products.map((pc) => ({
          id: pc.product.id,
          title: pc.product.title,
          isActive: pc.product.isActive,
        })),
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Admin Category GET Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '카테고리 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH - 카테고리 수정
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
    const { name, slug, description, icon, color, gradient, order, isActive } = body;

    // 카테고리 존재 확인
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: '카테고리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 슬러그 변경 시 중복 확인
    if (slug && slug !== existingCategory.slug) {
      const duplicateSlug = await prisma.category.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { success: false, error: '이미 존재하는 슬러그입니다.' },
          { status: 409 }
        );
      }
    }

    // 카테고리 수정
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(gradient !== undefined && { gradient }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      category: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        description: updatedCategory.description,
        icon: updatedCategory.icon,
        color: updatedCategory.color,
        gradient: updatedCategory.gradient,
        order: updatedCategory.order,
        isActive: updatedCategory.isActive,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString(),
      },
      message: '카테고리가 수정되었습니다.',
    });
  } catch (error) {
    console.error('[Admin Category PATCH Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '카테고리 수정 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - 카테고리 삭제
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

    // 카테고리 존재 확인 및 제품 수 체크
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: '카테고리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 연결된 제품이 있는지 확인
    const productCount = (category as any)._count.products;
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `이 카테고리에 ${productCount}개의 제품이 연결되어 있어 삭제할 수 없습니다. 먼저 제품을 다른 카테고리로 이동하거나 제거해주세요.`,
        },
        { status: 409 }
      );
    }

    // 카테고리 삭제
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '카테고리가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('[Admin Category DELETE Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '카테고리 삭제 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
