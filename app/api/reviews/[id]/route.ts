/**
 * Review Detail API
 * 개별 리뷰 조회, 수정, 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/reviews/[id] - 리뷰 상세 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
          },
        },
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Failed to fetch review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews/[id] - 리뷰 수정
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, rating, title, comment } = body;

    // Get existing review
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingReview.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own reviews' },
        { status: 403 }
      );
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment && comment.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Update review
    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(title !== undefined && { title: title?.trim() || null }),
        ...(comment && { comment: comment.trim() }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update product stats if rating changed
    if (rating && rating !== existingReview.rating && existingReview.productId) {
      const stats = await prisma.review.aggregate({
        where: {
          productId: existingReview.productId,
          status: 'active',
        },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: existingReview.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Failed to update review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - 리뷰 삭제 (소프트 삭제)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get existing review
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check ownership (or admin)
    if (existingReview.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    // Soft delete
    await prisma.review.update({
      where: { id },
      data: { status: 'deleted' },
    });

    // Update product stats
    if (existingReview.productId) {
      const stats = await prisma.review.aggregate({
        where: {
          productId: existingReview.productId,
          status: 'active',
        },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: existingReview.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
