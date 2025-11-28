/**
 * Product Reviews API
 * 특정 제품의 리뷰 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id]/reviews - 제품 리뷰 목록
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // Query parameters
    const sortBy = searchParams.get('sortBy') || 'recent';
    const rating = searchParams.get('rating');
    const verified = searchParams.get('verified');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, title: true, rating: true, reviewCount: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Build where clause
    const where: Record<string, unknown> = {
      productId: id,
      status: 'active',
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    if (verified === 'true') {
      where.isVerified = true;
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
      skip: offset,
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

    // Get rating distribution
    const ratingStats = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        productId: id,
        status: 'active',
      },
      _count: {
        rating: true,
      },
    });

    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingStats.forEach((s) => {
      distribution[s.rating as keyof typeof distribution] = s._count.rating;
    });

    return NextResponse.json({
      success: true,
      data: {
        product: {
          id: product.id,
          title: product.title,
          rating: product.rating,
          reviewCount: product.reviewCount,
        },
        reviews,
        stats: {
          total,
          averageRating: product.rating,
          distribution,
        },
      },
      meta: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + reviews.length < total,
      },
    });
  } catch (error) {
    console.error('Failed to fetch product reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
