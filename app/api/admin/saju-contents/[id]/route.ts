/**
 * Admin Saju Content Detail API
 * Phase 1.7: Admin Content Editor
 *
 * Endpoints:
 * - GET /api/admin/saju-contents/[id] - Get content by ID
 * - PUT /api/admin/saju-contents/[id] - Update content
 * - DELETE /api/admin/saju-contents/[id] - Delete content
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// ========================================
// Validation Schema
// ========================================

const updateContentSchema = z.object({
  templateId: z.string().uuid().optional(),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().optional(),
  data: z.record(z.string(), z.any()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  featuredImage: z.string().url().optional().or(z.literal('')),
  ogImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  createdBy: z.string().optional(),
});

// ========================================
// GET /api/admin/saju-contents/[id]
// ========================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = await prisma.sajuContent.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            category: true,
            fields: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json(
        { error: '컨텐츠를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to fetch saju content:', error);
    return NextResponse.json(
      { error: '컨텐츠 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// PUT /api/admin/saju-contents/[id]
// ========================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateContentSchema.parse(body);

    // Check if content exists
    const existing = await prisma.sajuContent.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '컨텐츠를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // If templateId is being updated, check if template exists
    if (validatedData.templateId) {
      const template = await prisma.sajuTemplate.findUnique({
        where: { id: validatedData.templateId },
      });

      if (!template) {
        return NextResponse.json(
          { error: '템플릿을 찾을 수 없습니다' },
          { status: 404 }
        );
      }
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugConflict = await prisma.sajuContent.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: '이미 사용 중인 slug입니다' },
          { status: 400 }
        );
      }
    }

    // Handle publishedAt logic
    let publishedAt = existing.publishedAt;
    if (validatedData.status === 'published' && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (validatedData.status !== 'published' && existing.status === 'published') {
      publishedAt = null;
    }

    // Prepare update data
    const updateData: any = { ...validatedData, publishedAt };
    if (validatedData.data) {
      updateData.data = validatedData.data as Prisma.InputJsonValue;
    }

    // Update content
    const content = await prisma.sajuContent.update({
      where: { id },
      data: updateData,
      include: {
        template: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to update saju content:', error);
    return NextResponse.json(
      { error: '컨텐츠 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE /api/admin/saju-contents/[id]
// ========================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if content exists
    const content = await prisma.sajuContent.findUnique({
      where: { id },
    });

    if (!content) {
      return NextResponse.json(
        { error: '컨텐츠를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Delete content
    await prisma.sajuContent.delete({
      where: { id },
    });

    return NextResponse.json({ message: '컨텐츠가 삭제되었습니다' });
  } catch (error) {
    console.error('Failed to delete saju content:', error);
    return NextResponse.json(
      { error: '컨텐츠 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
