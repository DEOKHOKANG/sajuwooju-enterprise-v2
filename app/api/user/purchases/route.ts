/**
 * User Purchases API
 * GET /api/user/purchases - 사용자 구매 내역 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPurchases, checkContentAccess } from '@/lib/payments/purchase-service';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const { purchases, total } = await getUserPurchases({
      userId: session.user.id,
      limit,
      offset,
      activeOnly,
    });

    return NextResponse.json({
      success: true,
      data: purchases.map((p) => ({
        ...p,
        accessGranted: p.accessGranted.toISOString(),
        accessExpires: p.accessExpires?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + purchases.length < total,
      },
    });
  } catch (error) {
    console.error('[User Purchases API Error]', error);
    return NextResponse.json(
      { success: false, error: '구매 내역 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/purchases - 콘텐츠 접근 권한 확인
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contentSlug, contentId, productId } = body;

    if (!contentSlug && !contentId && !productId) {
      return NextResponse.json(
        { success: false, error: 'contentSlug, contentId, 또는 productId가 필요합니다.' },
        { status: 400 }
      );
    }

    const result = await checkContentAccess({
      userId: session.user.id,
      contentSlug,
      contentId,
      productId,
    });

    return NextResponse.json({
      success: true,
      hasAccess: result.hasAccess,
      expiresAt: result.expiresAt?.toISOString() || null,
      purchase: result.purchase ? {
        id: result.purchase.id,
        accessGranted: result.purchase.accessGranted.toISOString(),
        accessExpires: result.purchase.accessExpires?.toISOString() || null,
      } : null,
    });
  } catch (error) {
    console.error('[Content Access Check Error]', error);
    return NextResponse.json(
      { success: false, error: '접근 권한 확인에 실패했습니다.' },
      { status: 500 }
    );
  }
}
