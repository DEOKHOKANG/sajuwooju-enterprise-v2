/**
 * Admin Products API - 제품 관리
 * GET /api/admin/products - 전체 제품 목록 (페이지네이션)
 * POST /api/admin/products - 새 제품 생성
 *
 * 권한: read (GET), write (POST)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

/**
 * GET - 전체 제품 목록 조회 (관리자용, 페이지네이션)
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'read');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const isActive = searchParams.get('isActive');

    // 필터 조건 구성
    const where: any = {};

    // 검색어 필터
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 카테고리 필터
    if (categoryId) {
      where.categories = {
        some: {
          categoryId: categoryId,
        },
      };
    }

    // 활성 상태 필터
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    // 전체 개수 조회
    const total = await prisma.product.count({ where });

    // 제품 목록 조회
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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

    // 응답 데이터 포맷팅
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      shortDescription: product.shortDescription,
      price: product.price,
      discountPrice: product.discountPrice,
      views: product.views,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      categories: product.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
        icon: pc.category.icon,
        color: pc.category.color,
      })),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Admin Products GET Error]', error);
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

/**
 * POST - 새 제품 생성
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'write');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

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
      categoryIds, // 카테고리 ID 배열
    } = body;

    // 필수 필드 검증
    if (!title || !slug || !price) {
      return NextResponse.json(
        { success: false, error: '제목, 슬러그, 가격은 필수입니다.' },
        { status: 400 }
      );
    }

    // 슬러그 중복 확인
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 슬러그입니다.' },
        { status: 409 }
      );
    }

    // 제품 생성 (트랜잭션)
    const product = await prisma.$transaction(async (tx) => {
      // 1. 제품 생성
      const newProduct = await tx.product.create({
        data: {
          title,
          slug,
          shortDescription: shortDescription || '',
          fullDescription: fullDescription || '',
          features: features || [],
          price,
          discountPrice: discountPrice || null,
          imageUrl: '/placeholder-product.jpg', // 기본 이미지
          isActive: isActive !== undefined ? isActive : true,
          isFeatured: isFeatured || false,
          views: 0,
        },
      });

      // 2. 카테고리 연결
      if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
        await tx.productCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            productId: newProduct.id,
            categoryId,
          })),
        });
      }

      return newProduct;
    });

    // 생성된 제품 조회 (카테고리 포함)
    const createdProduct = await prisma.product.findUnique({
      where: { id: product.id },
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

    return NextResponse.json(
      {
        success: true,
        product: {
          id: createdProduct!.id,
          title: createdProduct!.title,
          slug: createdProduct!.slug,
          shortDescription: createdProduct!.shortDescription,
          fullDescription: createdProduct!.fullDescription,
          features: createdProduct!.features,
          price: createdProduct!.price,
          discountPrice: createdProduct!.discountPrice,
          isActive: createdProduct!.isActive,
          isFeatured: createdProduct!.isFeatured,
          views: createdProduct!.views,
          categories: createdProduct!.categories.map((pc) => ({
            id: pc.category.id,
            name: pc.category.name,
            slug: pc.category.slug,
            icon: pc.category.icon,
            color: pc.category.color,
          })),
          createdAt: createdProduct!.createdAt.toISOString(),
          updatedAt: createdProduct!.updatedAt.toISOString(),
        },
        message: '제품이 생성되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Admin Products POST Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '제품 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
