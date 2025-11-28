/**
 * Admin Saju Templates API
 * Phase 1.7: Admin Content Editor
 *
 * Endpoints:
 * - GET /api/admin/saju-templates - List all templates
 * - POST /api/admin/saju-templates - Create new template
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// ========================================
// Validation Schema
// ========================================

const createTemplateSchema = z.object({
  categoryId: z.string().uuid('유효한 카테고리 ID가 필요합니다'),
  name: z.string().min(1, '템플릿명은 필수입니다'),
  slug: z.string().min(1, 'Slug는 필수입니다').regex(/^[a-z0-9-]+$/, 'Slug는 소문자, 숫자, 하이픈만 사용 가능합니다'),
  description: z.string().optional(),
  type: z.enum(['single', 'multi-step', 'comparison', 'timeline']),
  layout: z.object({
    sections: z.array(z.any()),
    theme: z.object({
      primaryColor: z.string().optional(),
      gradient: z.string().optional(),
    }).optional(),
  }),
  thumbnail: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  version: z.number().int().min(1).default(1),
});

type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

// ========================================
// GET /api/admin/saju-templates
// ========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
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

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type) {
      where.type = type;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Fetch templates with category and counts
    const [templates, total] = await Promise.all([
      prisma.sajuTemplate.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
          _count: {
            select: {
              fields: true,
              contents: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.sajuTemplate.count({ where }),
    ]);

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch saju templates:', error);
    return NextResponse.json(
      { error: '템플릿 목록을 가져오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// POST /api/admin/saju-templates
// ========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createTemplateSchema.parse(body);

    // Check if category exists
    const category = await prisma.sajuCategory.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: '카테고리를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.sajuTemplate.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: '이미 사용 중인 slug입니다' },
        { status: 400 }
      );
    }

    // Create template
    const template = await prisma.sajuTemplate.create({
      data: {
        ...validatedData,
        layout: validatedData.layout as Prisma.InputJsonValue,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to create saju template:', error);
    return NextResponse.json(
      { error: '템플릿 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}
