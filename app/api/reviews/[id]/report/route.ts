/**
 * Review Report API
 * 리뷰 신고 기능
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 자동 숨김 처리 기준 (신고 수)
const AUTO_HIDE_THRESHOLD = 5;

// POST /api/reviews/[id]/report - 리뷰 신고
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Report reason must be at least 5 characters' },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Cannot report this review' },
        { status: 400 }
      );
    }

    const newReportCount = review.reportCount + 1;

    // 자동 숨김 처리
    const shouldHide = newReportCount >= AUTO_HIDE_THRESHOLD;

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        reportCount: newReportCount,
        ...(shouldHide && { status: 'hidden' }),
      },
    });

    // Update product stats if review was hidden
    if (shouldHide && review.productId) {
      const stats = await prisma.review.aggregate({
        where: {
          productId: review.productId,
          status: 'active',
        },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: shouldHide
        ? 'Review has been reported and hidden for review'
        : 'Review has been reported',
      data: {
        id: updatedReview.id,
        reportCount: updatedReview.reportCount,
        status: updatedReview.status,
      },
    });
  } catch (error) {
    console.error('Failed to report review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to report review' },
      { status: 500 }
    );
  }
}
