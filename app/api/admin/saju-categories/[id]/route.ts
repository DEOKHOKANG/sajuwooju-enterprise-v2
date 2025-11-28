/**
 * Admin Saju Category Detail API
 * Phase 1.7: Admin Content Editor
 *
 * Endpoints:
 * - GET /api/admin/saju-categories/[id] - Get category by ID
 * - PUT /api/admin/saju-categories/[id] - Update category
 * - DELETE /api/admin/saju-categories/[id] - Delete category
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ========================================
// Validation Schema
// ========================================

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  gradient: z.string().optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// ========================================
// GET /api/admin/saju-categories/[id]
// ========================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.sajuCategory.findUnique({
      where: { id },
      include: {
        templates: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { templates: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: '카테고리를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to fetch saju category:', error);
    return NextResponse.json(
      { error: '카테고리 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// PUT /api/admin/saju-categories/[id]
// ========================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateCategorySchema.parse(body);

    // Check if category exists
    const existing = await prisma.sajuCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '카테고리를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugConflict = await prisma.sajuCategory.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: '이미 사용 중인 slug입니다' },
          { status: 400 }
        );
      }
    }

    // Update category
    const category = await prisma.sajuCategory.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to update saju category:', error);
    return NextResponse.json(
      { error: '카테고리 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE /api/admin/saju-categories/[id]
// ========================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if category exists
    const category = await prisma.sajuCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { templates: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: '카테고리를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Check if category has templates
    if (category._count.templates > 0) {
      return NextResponse.json(
        {
          error: '템플릿이 연결된 카테고리는 삭제할 수 없습니다',
          details: `${category._count.templates}개의 템플릿이 연결되어 있습니다`,
        },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.sajuCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: '카테고리가 삭제되었습니다' });
  } catch (error) {
    console.error('Failed to delete saju category:', error);
    return NextResponse.json(
      { error: '카테고리 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
