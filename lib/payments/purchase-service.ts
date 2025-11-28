/**
 * Purchase Service - 구매 및 콘텐츠 접근 권한 관리
 * Toss Payments MCP 스펙 기반
 */

import { prisma } from '@/lib/prisma';

/**
 * 구매 완료 후 콘텐츠 접근 권한 부여
 */
export async function grantContentAccess(params: {
  userId: string;
  paymentId: string;
  productId?: string;
  contentId?: string;
  contentSlug?: string;
  accessDuration?: number; // days, null = permanent
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; purchaseId?: string; error?: string }> {
  try {
    const { userId, paymentId, productId, contentId, contentSlug, accessDuration, metadata } = params;

    // 중복 구매 확인
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_paymentId: { userId, paymentId },
      },
    });

    if (existingPurchase) {
      return { success: true, purchaseId: existingPurchase.id };
    }

    // 만료일 계산
    const accessExpires = accessDuration
      ? new Date(Date.now() + accessDuration * 24 * 60 * 60 * 1000)
      : null;

    // 구매 기록 생성
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        paymentId,
        productId,
        contentId,
        contentSlug,
        accessExpires,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return { success: true, purchaseId: purchase.id };
  } catch (error) {
    console.error('[Grant Content Access Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 콘텐츠 접근 권한 확인
 */
export async function checkContentAccess(params: {
  userId: string;
  contentSlug?: string;
  contentId?: string;
  productId?: string;
}): Promise<{ hasAccess: boolean; purchase?: any; expiresAt?: Date | null }> {
  try {
    const { userId, contentSlug, contentId, productId } = params;

    const where: any = {
      userId,
      isActive: true,
      OR: [
        { accessExpires: null }, // 영구 접근
        { accessExpires: { gt: new Date() } }, // 아직 만료되지 않음
      ],
    };

    if (contentSlug) {
      where.contentSlug = contentSlug;
    } else if (contentId) {
      where.contentId = contentId;
    } else if (productId) {
      where.productId = productId;
    } else {
      return { hasAccess: false };
    }

    const purchase = await prisma.purchase.findFirst({
      where,
      include: {
        payment: {
          select: {
            orderId: true,
            amount: true,
            approvedAt: true,
          },
        },
      },
    });

    if (!purchase) {
      return { hasAccess: false };
    }

    return {
      hasAccess: true,
      purchase,
      expiresAt: purchase.accessExpires,
    };
  } catch (error) {
    console.error('[Check Content Access Error]', error);
    return { hasAccess: false };
  }
}

/**
 * 사용자의 구매 내역 조회
 */
export async function getUserPurchases(params: {
  userId: string;
  limit?: number;
  offset?: number;
  activeOnly?: boolean;
}): Promise<{ purchases: any[]; total: number }> {
  try {
    const { userId, limit = 20, offset = 0, activeOnly = false } = params;

    const where: any = { userId };

    if (activeOnly) {
      where.isActive = true;
      where.OR = [
        { accessExpires: null },
        { accessExpires: { gt: new Date() } },
      ];
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        include: {
          payment: {
            select: {
              orderId: true,
              orderName: true,
              amount: true,
              method: true,
              approvedAt: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.purchase.count({ where }),
    ]);

    return { purchases, total };
  } catch (error) {
    console.error('[Get User Purchases Error]', error);
    return { purchases: [], total: 0 };
  }
}

/**
 * 콘텐츠 접근 권한 취소 (환불 시)
 */
export async function revokeContentAccess(params: {
  paymentId: string;
  reason?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { paymentId, reason } = params;

    await prisma.purchase.updateMany({
      where: { paymentId },
      data: {
        isActive: false,
        metadata: reason ? JSON.stringify({ revokedReason: reason, revokedAt: new Date() }) : undefined,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[Revoke Content Access Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 만료된 구매 접근 권한 비활성화 (배치 작업용)
 */
export async function deactivateExpiredPurchases(): Promise<{ count: number }> {
  try {
    const result = await prisma.purchase.updateMany({
      where: {
        isActive: true,
        accessExpires: { lte: new Date() },
      },
      data: {
        isActive: false,
      },
    });

    return { count: result.count };
  } catch (error) {
    console.error('[Deactivate Expired Purchases Error]', error);
    return { count: 0 };
  }
}
