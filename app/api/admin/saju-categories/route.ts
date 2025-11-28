/**
 * Admin Saju Categories API
 * Phase 1.7: Admin Content Editor
 *
 * Endpoints:
 * - GET /api/admin/saju-categories - List all categories
 * - POST /api/admin/saju-categories - Create new category
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ========================================
// Validation Schema
// ========================================

const createCategorySchema = z.object({
  name: z.string().min(1, '카테고리명은 필수입니다'),
  slug: z.string().min(1, 'Slug는 필수입니다').regex(/^[a-z0-9-]+$/, 'Slug는 소문자, 숫자, 하이픈만 사용 가능합니다'),
  icon: z.string().optional(),
  color: z.string().min(1, '색상은 필수입니다'),
  gradient: z.string().optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

type CreateCategoryInput = z.infer<typeof createCategorySchema>;

// ========================================
// GET /api/admin/saju-categories
// ========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Fetch categories with template count
    const [categories, total] = await Promise.all([
      prisma.sajuCategory.findMany({
        where,
        include: {
          _count: {
            select: { templates: true },
          },
        },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.sajuCategory.count({ where }),
    ]);

    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch saju categories:', error);
    return NextResponse.json(
      { error: '카테고리 목록을 가져오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// POST /api/admin/saju-categories
// ========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createCategorySchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.sajuCategory.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: '이미 사용 중인 slug입니다' },
        { status: 400 }
      );
    }

    // Create category
    const category = await prisma.sajuCategory.create({
      data: validatedData,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to create saju category:', error);
    return NextResponse.json(
      { error: '카테고리 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}
