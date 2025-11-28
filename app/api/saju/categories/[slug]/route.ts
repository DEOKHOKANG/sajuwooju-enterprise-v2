/**
 * Public Saju Category API
 * Phase 1.9: Public Pages
 *
 * Endpoints:
 * - GET /api/saju/categories/[slug] - Get category with published contents
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ========================================
// GET /api/saju/categories/[slug]
// ========================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Find category by slug
    const category = await prisma.sajuCategory.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        templates: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: '카테고리를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Get all published contents for this category's templates
    const templateIds = category.templates.map(t => t.id);

    const [contents, total] = await Promise.all([
      prisma.sajuContent.findMany({
        where: {
          templateId: { in: templateIds },
          status: 'published',
        },
        include: {
          template: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              thumbnail: true,
            },
          },
        },
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.sajuContent.count({
        where: {
          templateId: { in: templateIds },
          status: 'published',
        },
      }),
    ]);

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        color: category.color,
        gradient: category.gradient,
        description: category.description,
        shortDesc: category.shortDesc,
      },
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return NextResponse.json(
      { error: '카테고리 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
