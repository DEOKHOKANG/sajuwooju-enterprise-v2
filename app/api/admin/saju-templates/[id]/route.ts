/**
 * Admin Saju Template Detail API
 * Phase 1.7: Admin Content Editor
 *
 * Endpoints:
 * - GET /api/admin/saju-templates/[id] - Get template by ID
 * - PUT /api/admin/saju-templates/[id] - Update template
 * - DELETE /api/admin/saju-templates/[id] - Delete template
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// ========================================
// Validation Schema
// ========================================

const updateTemplateSchema = z.object({
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  type: z.enum(['single', 'multi-step', 'comparison', 'timeline']).optional(),
  layout: z.object({
    sections: z.array(z.any()),
    theme: z.object({
      primaryColor: z.string().optional(),
      gradient: z.string().optional(),
    }).optional(),
  }).optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  version: z.number().int().min(1).optional(),
});

// ========================================
// GET /api/admin/saju-templates/[id]
// ========================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.sajuTemplate.findUnique({
      where: { id },
      include: {
        category: true,
        fields: {
          orderBy: { order: 'asc' },
        },
        contents: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            viewCount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            fields: true,
            contents: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to fetch saju template:', error);
    return NextResponse.json(
      { error: '템플릿 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// PUT /api/admin/saju-templates/[id]
// ========================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateTemplateSchema.parse(body);

    // Check if template exists
    const existing = await prisma.sajuTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // If categoryId is being updated, check if category exists
    if (validatedData.categoryId) {
      const category = await prisma.sajuCategory.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: '카테고리를 찾을 수 없습니다' },
          { status: 404 }
        );
      }
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugConflict = await prisma.sajuTemplate.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: '이미 사용 중인 slug입니다' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = { ...validatedData };
    if (validatedData.layout) {
      updateData.layout = validatedData.layout as Prisma.InputJsonValue;
    }

    // Update template
    const template = await prisma.sajuTemplate.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to update saju template:', error);
    return NextResponse.json(
      { error: '템플릿 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE /api/admin/saju-templates/[id]
// ========================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if template exists
    const template = await prisma.sajuTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            contents: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Check if template has contents (protected by onDelete: Restrict)
    if (template._count.contents > 0) {
      return NextResponse.json(
        {
          error: '컨텐츠가 연결된 템플릿은 삭제할 수 없습니다',
          details: `${template._count.contents}개의 컨텐츠가 연결되어 있습니다`,
        },
        { status: 400 }
      );
    }

    // Delete template (cascade deletes fields)
    await prisma.sajuTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ message: '템플릿이 삭제되었습니다' });
  } catch (error) {
    console.error('Failed to delete saju template:', error);
    return NextResponse.json(
      { error: '템플릿 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
