/**
 * Toss Payments Client Service
 * Phase 8.10: Toss Payments Integration
 */

import { TossPaymentApprovalRequest, TossPaymentApprovalResponse } from '@/lib/types/payment';

const TOSS_API_BASE_URL = 'https://api.tosspayments.com/v1';

/**
 * Toss Payments API 승인 요청
 * 결제창에서 결제를 완료한 후 서버에서 승인 처리
 */
export async function approveTossPayment(
  request: TossPaymentApprovalRequest
): Promise<TossPaymentApprovalResponse> {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    throw new Error('TOSS_SECRET_KEY is not configured');
  }

  // Base64 인코딩 (Secret Key:)
  const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    const response = await fetch(`${TOSS_API_BASE_URL}/payments/confirm`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      // Toss API 에러 처리
      throw new Error(
        `Toss Payment Approval Failed: ${data.code} - ${data.message}`
      );
    }

    return data as TossPaymentApprovalResponse;
  } catch (error: any) {
    console.error('[Toss Payment Approval Error]', error);
    throw error;
  }
}

/**
 * Toss Payments 결제 취소
 */
export async function cancelTossPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<any> {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    throw new Error('TOSS_SECRET_KEY is not configured');
  }

  const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    const response = await fetch(
      `${TOSS_API_BASE_URL}/payments/${paymentKey}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${encodedKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelReason,
          ...(cancelAmount && { cancelAmount }),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Toss Payment Cancel Failed: ${data.code} - ${data.message}`
      );
    }

    return data;
  } catch (error: any) {
    console.error('[Toss Payment Cancel Error]', error);
    throw error;
  }
}

/**
 * Toss Payments 결제 조회
 */
export async function getTossPayment(paymentKey: string): Promise<TossPaymentApprovalResponse> {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    throw new Error('TOSS_SECRET_KEY is not configured');
  }

  const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    const response = await fetch(
      `${TOSS_API_BASE_URL}/payments/${paymentKey}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${encodedKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Toss Payment Get Failed: ${data.code} - ${data.message}`
      );
    }

    return data as TossPaymentApprovalResponse;
  } catch (error: any) {
    console.error('[Toss Payment Get Error]', error);
    throw error;
  }
}

/**
 * orderId로 결제 조회
 */
export async function getTossPaymentByOrderId(orderId: string): Promise<TossPaymentApprovalResponse> {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    throw new Error('TOSS_SECRET_KEY is not configured');
  }

  const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    const response = await fetch(
      `${TOSS_API_BASE_URL}/payments/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${encodedKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Toss Payment Get Failed: ${data.code} - ${data.message}`
      );
    }

    return data as TossPaymentApprovalResponse;
  } catch (error: any) {
    console.error('[Toss Payment Get by OrderId Error]', error);
    throw error;
  }
}

/**
 * Validate Toss webhook signature
 * HMAC SHA256 서명 검증
 */
export function validateTossWebhook(
  requestBody: string,
  signature: string | null
): boolean {
  // 서명이 없으면 검증 실패
  if (!signature) {
    console.warn('[Webhook] Missing signature header');
    return false;
  }

  const webhookSecret = process.env.TOSS_WEBHOOK_SECRET;

  // Webhook 시크릿이 설정되지 않은 경우 (개발 환경에서는 허용)
  if (!webhookSecret) {
    if (process.env.NODE_ENV === 'development' || process.env.ALLOW_MOCK_PAYMENTS === 'true') {
      console.warn('[Webhook] TOSS_WEBHOOK_SECRET not set, skipping validation in dev mode');
      return true;
    }
    console.error('[Webhook] TOSS_WEBHOOK_SECRET is not configured');
    return false;
  }

  try {
    // Node.js crypto 사용
    const crypto = require('crypto');

    // HMAC SHA256 서명 생성
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(requestBody, 'utf8')
      .digest('base64');

    // 서명 비교 (timing-safe comparison)
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    console.error('[Webhook] Signature validation error:', error);
    return false;
  }
}

/**
 * Generate order ID
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORDER-${timestamp}-${random}`;
}
