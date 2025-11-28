/**
 * Admin Categories API - 카테고리 관리
 * GET /api/admin/categories - 전체 카테고리 목록 (활성/비활성 모두)
 * POST /api/admin/categories - 새 카테고리 생성
 *
 * 권한: read (GET), write (POST)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

/**
 * GET - 전체 카테고리 목록 조회 (관리자용)
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 및 권한 확인 (read 권한)
    const { error, status, admin } = await requirePermission(request, 'read');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const includeProductCount = searchParams.get('includeProductCount') === 'true';

    // 카테고리 조회
    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { order: 'asc' },
      include: includeProductCount
        ? {
            _count: {
              select: {
                products: true,
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
      isActive: category.isActive,
      ...(includeProductCount && {
        productCount: (category as any)._count?.products || 0,
      }),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      categories: formattedCategories,
      total: categories.length,
    });
  } catch (error) {
    console.error('[Admin Categories GET Error]', error);
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

/**
 * POST - 새 카테고리 생성
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 및 권한 확인 (write 권한)
    const { error, status, admin } = await requirePermission(request, 'write');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { name, slug, description, icon, color, gradient, order, isActive } = body;

    // 필수 필드 검증
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: '카테고리 이름과 슬러그는 필수입니다.' },
        { status: 400 }
      );
    }

    // 슬러그 중복 확인
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 슬러그입니다.' },
        { status: 409 }
      );
    }

    // 카테고리 생성
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
        color: color || null,
        gradient: gradient || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(
      {
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
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        },
        message: '카테고리가 생성되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Admin Categories POST Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '카테고리 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
