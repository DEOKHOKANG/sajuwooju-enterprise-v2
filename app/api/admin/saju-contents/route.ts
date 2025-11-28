/**
 * Admin Saju Contents API
 * Phase 1.7: Admin Content Editor
 *
 * Endpoints:
 * - GET /api/admin/saju-contents - List all contents
 * - POST /api/admin/saju-contents - Create new content
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// ========================================
// Validation Schema
// ========================================

const createContentSchema = z.object({
  templateId: z.string().uuid('유효한 템플릿 ID가 필요합니다'),
  title: z.string().min(1, '제목은 필수입니다'),
  slug: z.string().min(1, 'Slug는 필수입니다').regex(/^[a-z0-9-]+$/, 'Slug는 소문자, 숫자, 하이픈만 사용 가능합니다'),
  excerpt: z.string().optional(),
  data: z.record(z.string(), z.any()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
  featuredImage: z.string().url().optional().or(z.literal('')),
  ogImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  createdBy: z.string().optional(),
});

type CreateContentInput = z.infer<typeof createContentSchema>;

// ========================================
// GET /api/admin/saju-contents
// ========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const templateId = searchParams.get('templateId');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    if (templateId) {
      where.templateId = templateId;
    }

    if (status) {
      where.status = status;
    }

    // Fetch contents with template info
    const [contents, total] = await Promise.all([
      prisma.sajuContent.findMany({
        where,
        include: {
          template: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.sajuContent.count({ where }),
    ]);

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch saju contents:', error);
    return NextResponse.json(
      { error: '컨텐츠 목록을 가져오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// POST /api/admin/saju-contents
// ========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createContentSchema.parse(body);

    // Check if template exists
    const template = await prisma.sajuTemplate.findUnique({
      where: { id: validatedData.templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.sajuContent.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: '이미 사용 중인 slug입니다' },
        { status: 400 }
      );
    }

    // Set publishedAt if status is published
    const publishedAt = validatedData.status === 'published' ? new Date() : null;

    // Create content
    const content = await prisma.sajuContent.create({
      data: {
        ...validatedData,
        data: validatedData.data as Prisma.InputJsonValue,
        publishedAt,
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to create saju content:', error);
    return NextResponse.json(
      { error: '컨텐츠 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}
