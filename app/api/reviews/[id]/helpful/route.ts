/**
 * Review Helpful API
 * 리뷰 도움이 됐어요 기능
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/reviews/[id]/helpful - 도움이 됐어요 증가
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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
        { success: false, error: 'Cannot interact with this review' },
        { status: 400 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isHelpful: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedReview.id,
        isHelpful: updatedReview.isHelpful,
      },
    });
  } catch (error) {
    console.error('Failed to mark review as helpful:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
