/**
 * Public Saju Content API
 * Phase 1.9: Public Pages
 *
 * Endpoints:
 * - GET /api/saju/contents/[slug] - Get published content by slug
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ========================================
// GET /api/saju/contents/[slug]
// ========================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Find published content by slug
    const content = await prisma.sajuContent.findUnique({
      where: {
        slug,
        status: 'published',
      },
      include: {
        template: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
                gradient: true,
                icon: true,
              },
            },
            fields: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json(
        { error: '콘텐츠를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Increment view count (fire and forget)
    prisma.sajuContent.update({
      where: { id: content.id },
      data: { viewCount: { increment: 1 } },
    }).catch(err => console.error('Failed to increment view count:', err));

    // Get related contents from same template
    const relatedContents = await prisma.sajuContent.findMany({
      where: {
        templateId: content.templateId,
        status: 'published',
        id: { not: content.id },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        viewCount: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    });

    return NextResponse.json({
      content,
      relatedContents,
    });
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json(
      { error: '콘텐츠 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
