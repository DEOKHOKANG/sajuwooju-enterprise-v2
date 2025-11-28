/**
 * POST /api/payments/confirm
 * 상용화급 Toss Payments 결제 승인 처리
 *
 * 주요 기능:
 * - 결제 승인 요청 (Toss Payments API)
 * - 금액 검증 (위변조 방지)
 * - Purchase 레코드 생성 (접근 권한 부여)
 * - 트랜잭션 처리
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 입력 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: '필수 정보가 누락되었습니다.',
          },
        },
        { status: 400 }
      );
    }

    // 기존 결제 레코드 조회
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!existingPayment) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: '결제 정보를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 이미 처리된 결제인지 확인
    if (existingPayment.status === 'done') {
      return NextResponse.json({
        success: true,
        data: {
          orderId: existingPayment.orderId,
          paymentKey: existingPayment.paymentKey,
          status: existingPayment.status,
          method: existingPayment.method,
          approvedAt: existingPayment.approvedAt,
        },
        message: '이미 승인된 결제입니다.',
      });
    }

    // 금액 검증 (위변조 방지)
    if (existingPayment.amount !== amount) {
      console.error(`Amount mismatch: expected ${existingPayment.amount}, got ${amount}`);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AMOUNT_MISMATCH',
            message: '결제 금액이 일치하지 않습니다.',
          },
        },
        { status: 400 }
      );
    }

    // Toss Payments Secret Key 확인
    const secretKey = process.env.TOSS_SECRET_KEY;
    const isProduction = process.env.NODE_ENV === 'production';

    if (!secretKey) {
      if (isProduction) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MISSING_TOSS_SECRET',
              message: '결제 비밀 키가 설정되지 않았습니다. 관리자에게 문의하세요.',
            },
          },
          { status: 500 }
        );
      }

      // Mock 결제 모드 (개발 환경)
      if (process.env.ALLOW_MOCK_PAYMENTS !== 'true') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MOCK_PAYMENT_DISABLED',
              message: '테스트 결제 모드가 비활성화되어 있습니다.',
            },
          },
          { status: 500 }
        );
      }

      // Mock 결제 처리
      const payment = await prisma.payment.update({
        where: { orderId },
        data: {
          paymentKey,
          status: 'done',
          method: 'MOCK',
          approvedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: payment.orderId,
          paymentKey: payment.paymentKey,
          status: payment.status,
          approvedAt: payment.approvedAt,
        },
        message: 'Mock payment approved (개발 모드)',
      });
    }

    // Toss Payments API 호출
    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!tossResponse.ok) {
      const errorData = await tossResponse.json();
      console.error('Toss API Error:', errorData);

      // 결제 실패 처리
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'failed',
          failureCode: errorData.code,
          failureMessage: errorData.message,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: errorData.code || 'PAYMENT_FAILED',
            message: errorData.message || '결제 승인에 실패했습니다.',
          },
        },
        { status: 400 }
      );
    }

    const tossData = await tossResponse.json();

    // 트랜잭션으로 결제 완료 처리 + Purchase 생성
    const result = await prisma.$transaction(async (tx) => {
      // 1. 결제 상태 업데이트
      const payment = await tx.payment.update({
        where: { orderId },
        data: {
          paymentKey: tossData.paymentKey,
          status: 'done',
          method: tossData.method,
          approvedAt: new Date(tossData.approvedAt),
        },
      });

      // 2. Purchase 레코드 생성 (사용자가 있는 경우)
      let purchase = null;
      const metadata = payment.metadata ? JSON.parse(payment.metadata) : {};

      if (payment.userId) {
        purchase = await tx.purchase.create({
          data: {
            userId: payment.userId,
            paymentId: payment.id,
            productId: payment.productId || null,
            contentSlug: metadata.contentSlug || null,
            accessGranted: new Date(),
            accessExpires: null, // 영구 접근
            isActive: true,
            metadata: payment.metadata,
          },
        });
      }

      return { payment, purchase };
    });

    console.log(`Payment confirmed: ${orderId}, Purchase: ${result.purchase?.id || 'anonymous'}`);

    return NextResponse.json({
      success: true,
      data: {
        orderId: result.payment.orderId,
        paymentKey: result.payment.paymentKey,
        status: result.payment.status,
        method: result.payment.method,
        approvedAt: result.payment.approvedAt,
        purchaseId: result.purchase?.id || null,
      },
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '결제 승인 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
