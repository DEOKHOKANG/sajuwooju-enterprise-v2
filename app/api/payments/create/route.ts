/**
 * POST /api/payments/create
 * Phase 8.10: Create payment order
 * 결제 주문 생성 (Toss Payments 결제 시작 전)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderName, customerName, customerEmail, productId, sessionId } = body;

    // 입력 검증
    if (!amount || !orderName || !customerName) {
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

    // orderId 생성 (고유한 주문 ID)
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Payment 레코드 생성
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount,
        orderName,
        customerName,
        customerEmail,
        customerMobilePhone: body.customerMobilePhone || null,
        productId,
        sessionId,
        status: 'pending',
        metadata: JSON.stringify(body.metadata || {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: payment.orderId,
        amount: payment.amount,
        orderName: payment.orderName,
        customerName: payment.customerName,
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '결제 생성 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
