/**
 * Admin Payments API
 * GET /api/admin/payments - 결제 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const status = searchParams.get('status'); // pending, ready, done, canceled, failed
    const search = searchParams.get('search')?.trim();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const sortBy = searchParams.get('sortBy') || 'newest'; // newest, oldest, amount-high, amount-low
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { orderName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate + 'T23:59:59.999Z');
      }
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) {
        where.amount.gte = parseInt(minAmount);
      }
      if (maxAmount) {
        where.amount.lte = parseInt(maxAmount);
      }
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'amount-high':
        orderBy = { amount: 'desc' };
        break;
      case 'amount-low':
        orderBy = { amount: 'asc' };
        break;
    }

    // Get payments
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          purchases: {
            select: {
              id: true,
              isActive: true,
              accessExpires: true,
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    // Get statistics
    const stats = await prisma.payment.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { amount: true },
    });

    const statusStats: Record<string, { count: number; totalAmount: number }> = {};
    stats.forEach((s) => {
      statusStats[s.status] = {
        count: s._count.id,
        totalAmount: s._sum.amount || 0,
      };
    });

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStats = await prisma.payment.aggregate({
      where: {
        status: 'done',
        approvedAt: { gte: today },
      },
      _count: { id: true },
      _sum: { amount: true },
    });

    return NextResponse.json({
      success: true,
      data: payments.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        approvedAt: p.approvedAt?.toISOString() || null,
        canceledAt: p.canceledAt?.toISOString() || null,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + payments.length < total,
      },
      stats: {
        byStatus: statusStats,
        today: {
          count: todayStats._count.id,
          totalAmount: todayStats._sum.amount || 0,
        },
      },
    });
  } catch (error) {
    console.error('[Admin Payments API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
