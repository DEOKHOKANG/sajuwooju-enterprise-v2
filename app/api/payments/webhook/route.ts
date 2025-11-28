/**
 * POST /api/payments/webhook
 * TossPayments Webhook Handler
 * 결제 상태 변경 알림 처리
 *
 * MCP 스펙:
 * - Webhook 서명 검증
 * - 결제 완료 시 콘텐츠 접근 권한 부여
 * - 결제 취소 시 접근 권한 회수
 * - 알림 발송
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateTossWebhook } from '@/lib/payments/toss-client';
import { grantContentAccess, revokeContentAccess } from '@/lib/payments/purchase-service';

export async function POST(request: NextRequest) {
  try {
    // Raw body 읽기 (서명 검증용)
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const { eventType, data } = body;

    // Webhook 서명 검증
    const signature = request.headers.get('toss-signature') || request.headers.get('x-toss-signature');
    if (!validateTossWebhook(rawBody, signature)) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('[Webhook] Event:', eventType);
    console.log('[Webhook] Data:', JSON.stringify(data, null, 2));

    // 이벤트 타입별 처리
    switch (eventType) {
      case 'PAYMENT_CONFIRMED':
        await handlePaymentConfirmed(data);
        break;

      case 'PAYMENT_CANCELED':
        await handlePaymentCanceled(data);
        break;

      case 'PAYMENT_FAILED':
        await handlePaymentFailed(data);
        break;

      case 'VIRTUAL_ACCOUNT_ISSUED':
        await handleVirtualAccountIssued(data);
        break;

      case 'VIRTUAL_ACCOUNT_DEPOSIT':
        await handleVirtualAccountDeposit(data);
        break;

      default:
        console.log('[Webhook] Unknown event type:', eventType);
    }

    // Webhook은 항상 200 OK 응답
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    // Webhook 에러도 200 OK 응답 (재시도 방지)
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

/**
 * 결제 승인 완료 처리
 */
async function handlePaymentConfirmed(data: any) {
  const { orderId, paymentKey, method, approvedAt, totalAmount } = data;

  try {
    // 데이터베이스 업데이트
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        paymentKey,
        status: 'done',
        method,
        approvedAt: new Date(approvedAt),
      },
    });

    // 콘텐츠 접근 권한 부여
    if (payment.userId) {
      const accessResult = await grantContentAccess({
        userId: payment.userId,
        paymentId: payment.id,
        productId: payment.productId,
        contentSlug: payment.metadata ? JSON.parse(payment.metadata).contentSlug : undefined,
      });

      if (!accessResult.success) {
        console.error('[Webhook] Failed to grant content access:', accessResult.error);
      }
    }

    // 알림 생성
    if (payment.userId) {
      await createPaymentNotification({
        userId: payment.userId,
        type: 'payment_success',
        title: '결제 완료',
        message: `${payment.orderName} 결제가 완료되었습니다.`,
        orderId: payment.orderId,
        amount: payment.amount,
      });
    }

    console.log(`[Webhook] Payment confirmed: ${orderId}`);
  } catch (error) {
    console.error('[Webhook] Error updating payment status:', error);
  }
}

/**
 * 결제 취소 처리
 */
async function handlePaymentCanceled(data: any) {
  const { orderId, cancelReason, canceledAt } = data;

  try {
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'canceled',
        canceledAt: new Date(canceledAt),
        failureMessage: cancelReason,
      },
    });

    // 콘텐츠 접근 권한 회수
    await revokeContentAccess({
      paymentId: payment.id,
      reason: cancelReason || '결제 취소',
    });

    // 알림 생성
    if (payment.userId) {
      await createPaymentNotification({
        userId: payment.userId,
        type: 'payment_canceled',
        title: '결제 취소',
        message: `${payment.orderName} 결제가 취소되었습니다.`,
        orderId: payment.orderId,
        amount: payment.amount,
      });
    }

    console.log(`[Webhook] Payment canceled: ${orderId}`);
  } catch (error) {
    console.error('[Webhook] Error updating payment status:', error);
  }
}

/**
 * 결제 실패 처리
 */
async function handlePaymentFailed(data: any) {
  const { orderId, code, message } = data;

  try {
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'failed',
        failureCode: code,
        failureMessage: message,
      },
    });

    // 알림 생성
    if (payment.userId) {
      await createPaymentNotification({
        userId: payment.userId,
        type: 'payment_failed',
        title: '결제 실패',
        message: `${payment.orderName} 결제가 실패했습니다. (${message})`,
        orderId: payment.orderId,
        amount: payment.amount,
      });
    }

    console.log(`[Webhook] Payment failed: ${orderId}`);
  } catch (error) {
    console.error('[Webhook] Error updating payment status:', error);
  }
}

/**
 * 가상계좌 발급 처리
 */
async function handleVirtualAccountIssued(data: any) {
  const { orderId, virtualAccount } = data;

  try {
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'ready',
        metadata: JSON.stringify({ virtualAccount }),
      },
    });

    // 알림 생성 (가상계좌 정보 포함)
    if (payment.userId) {
      await createPaymentNotification({
        userId: payment.userId,
        type: 'virtual_account_issued',
        title: '가상계좌 발급',
        message: `${virtualAccount.bankCode} ${virtualAccount.accountNumber}로 ${payment.amount.toLocaleString()}원을 입금해주세요.`,
        orderId: payment.orderId,
        amount: payment.amount,
        metadata: { virtualAccount },
      });
    }

    console.log(`[Webhook] Virtual account issued: ${orderId}`);
  } catch (error) {
    console.error('[Webhook] Error updating payment status:', error);
  }
}

/**
 * 가상계좌 입금 완료 처리
 */
async function handleVirtualAccountDeposit(data: any) {
  const { orderId, depositedAt } = data;

  try {
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'done',
        approvedAt: new Date(depositedAt),
      },
    });

    // 콘텐츠 접근 권한 부여
    if (payment.userId) {
      const accessResult = await grantContentAccess({
        userId: payment.userId,
        paymentId: payment.id,
        productId: payment.productId,
        contentSlug: payment.metadata ? JSON.parse(payment.metadata).contentSlug : undefined,
      });

      if (!accessResult.success) {
        console.error('[Webhook] Failed to grant content access:', accessResult.error);
      }

      // 알림 생성
      await createPaymentNotification({
        userId: payment.userId,
        type: 'payment_success',
        title: '입금 확인',
        message: `${payment.orderName} 입금이 확인되었습니다.`,
        orderId: payment.orderId,
        amount: payment.amount,
      });
    }

    console.log(`[Webhook] Virtual account deposit completed: ${orderId}`);
  } catch (error) {
    console.error('[Webhook] Error updating payment status:', error);
  }
}

/**
 * 결제 관련 알림 생성
 */
async function createPaymentNotification(params: {
  userId: string;
  type: string;
  title: string;
  message: string;
  orderId: string;
  amount: number;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        targetId: params.orderId,
        actionUrl: `/my/purchases`,
      },
    });
  } catch (error) {
    console.error('[Webhook] Failed to create notification:', error);
  }
}
