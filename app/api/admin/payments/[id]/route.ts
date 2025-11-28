/**
 * Admin Payment Detail API
 * GET /api/admin/payments/[id] - 결제 상세 조회
 * POST /api/admin/payments/[id] - 결제 취소/환불
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cancelTossPayment, getTossPayment } from '@/lib/payments/toss-client';
import { revokeContentAccess } from '@/lib/payments/purchase-service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/payments/[id] - 결제 상세
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        purchases: {
          select: {
            id: true,
            userId: true,
            productId: true,
            contentId: true,
            contentSlug: true,
            isActive: true,
            accessGranted: true,
            accessExpires: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Toss Payments에서 최신 정보 조회 (paymentKey가 있는 경우)
    let tossPaymentInfo = null;
    if (payment.paymentKey && process.env.TOSS_SECRET_KEY) {
      try {
        tossPaymentInfo = await getTossPayment(payment.paymentKey);
      } catch (error) {
        console.error('[Admin Payment] Failed to fetch Toss payment info:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...payment,
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt.toISOString(),
        approvedAt: payment.approvedAt?.toISOString() || null,
        canceledAt: payment.canceledAt?.toISOString() || null,
        tossPaymentInfo,
      },
    });
  } catch (error) {
    console.error('[Admin Payment Detail Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}

// POST /api/admin/payments/[id] - 결제 취소/환불
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, cancelReason, cancelAmount } = body;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (action === 'cancel' || action === 'refund') {
      // 결제 취소 가능 여부 확인
      if (payment.status !== 'done') {
        return NextResponse.json(
          { success: false, error: '완료된 결제만 취소할 수 있습니다.' },
          { status: 400 }
        );
      }

      if (!payment.paymentKey) {
        return NextResponse.json(
          { success: false, error: 'Payment key가 없어 취소할 수 없습니다.' },
          { status: 400 }
        );
      }

      // Mock 결제인 경우 DB만 업데이트
      if (payment.method === 'MOCK') {
        await prisma.payment.update({
          where: { id },
          data: {
            status: 'canceled',
            canceledAt: new Date(),
            failureMessage: cancelReason || '관리자 취소',
          },
        });

        // 콘텐츠 접근 권한 회수
        await revokeContentAccess({
          paymentId: payment.id,
          reason: cancelReason || '관리자 취소',
        });

        return NextResponse.json({
          success: true,
          message: 'Mock 결제가 취소되었습니다.',
        });
      }

      // Toss Payments API 호출
      try {
        const tossResult = await cancelTossPayment(
          payment.paymentKey,
          cancelReason || '관리자 취소',
          cancelAmount
        );

        // DB 업데이트
        await prisma.payment.update({
          where: { id },
          data: {
            status: 'canceled',
            canceledAt: new Date(),
            failureMessage: cancelReason || '관리자 취소',
            metadata: JSON.stringify({
              ...JSON.parse(payment.metadata || '{}'),
              cancelInfo: tossResult,
            }),
          },
        });

        // 콘텐츠 접근 권한 회수
        await revokeContentAccess({
          paymentId: payment.id,
          reason: cancelReason || '관리자 취소',
        });

        return NextResponse.json({
          success: true,
          message: '결제가 취소되었습니다.',
          data: tossResult,
        });
      } catch (tossError: any) {
        return NextResponse.json(
          {
            success: false,
            error: `Toss Payments 취소 실패: ${tossError.message}`,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Admin Payment Action Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment action' },
      { status: 500 }
    );
  }
}
