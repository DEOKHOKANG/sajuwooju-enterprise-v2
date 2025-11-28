/**
 * Reviews API
 * 리뷰 목록 조회 및 생성
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reviews - 리뷰 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const productId = searchParams.get('productId');
    const contentId = searchParams.get('contentId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') || 'active';
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sortBy') || 'recent'; // recent, helpful, rating-high, rating-low
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');
    const page = parseInt(searchParams.get('page') || '0');

    // Calculate offset from page if provided
    const effectiveOffset = page > 0 ? (page - 1) * limit : offset;

    // Build where clause
    const where: Record<string, unknown> = {
      status,
    };

    if (productId) {
      where.productId = productId;
    }

    if (contentId) {
      where.contentId = contentId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (rating) {
      where.rating = parseInt(rating);
    }

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (sortBy) {
      case 'helpful':
        orderBy = { isHelpful: 'desc' };
        break;
      case 'rating-high':
        orderBy = { rating: 'desc' };
        break;
      case 'rating-low':
        orderBy = { rating: 'asc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get total count
    const total = await prisma.review.count({ where });

    // Get reviews
    const reviews = await prisma.review.findMany({
      where,
      orderBy,
      take: limit,
      skip: effectiveOffset,
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

    // Calculate stats
    const stats = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        ...(productId && { productId }),
        ...(contentId && { contentId }),
        status: 'active',
      },
      _count: {
        rating: true,
      },
    });

    const ratingStats = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRating = 0;
    let ratingCount = 0;

    stats.forEach((s) => {
      ratingStats[s.rating as keyof typeof ratingStats] = s._count.rating;
      totalRating += s.rating * s._count.rating;
      ratingCount += s._count.rating;
    });

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    return NextResponse.json({
      success: true,
      data: reviews,
      meta: {
        total,
        limit,
        offset: effectiveOffset,
        page: page > 0 ? page : Math.floor(effectiveOffset / limit) + 1,
        totalPages: Math.ceil(total / limit),
        hasMore: effectiveOffset + reviews.length < total,
      },
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: ratingCount,
        ratingDistribution: ratingStats,
      },
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - 새 리뷰 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, contentId, rating, title, comment } = body;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!productId && !contentId) {
      return NextResponse.json(
        { success: false, error: 'Product ID or Content ID is required' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product/content
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        ...(productId && { productId }),
        ...(contentId && { contentId }),
        status: { not: 'deleted' },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this item' },
        { status: 409 }
      );
    }

    // Check if user has purchased the product (for verified review)
    let isVerified = false;
    if (productId) {
      const payment = await prisma.payment.findFirst({
        where: {
          userId,
          productId,
          status: 'done',
        },
      });
      isVerified = !!payment;
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        productId: productId || null,
        contentId: contentId || null,
        rating,
        title: title?.trim() || null,
        comment: comment.trim(),
        isVerified,
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

    // Update product/content review stats
    if (productId) {
      const stats = await prisma.review.aggregate({
        where: {
          productId,
          status: 'active',
        },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: review,
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
