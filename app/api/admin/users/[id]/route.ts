/**
 * Admin Users API - 개별 사용자 관리
 * GET /api/admin/users/[id] - 사용자 상세 조회
 * DELETE /api/admin/users/[id] - 사용자 삭제 (계정 비활성화)
 *
 * 권한: read (GET), delete (DELETE)
 * 참고: 사용자 정보 수정은 사용자 본인만 가능 (PATCH 없음)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET - 사용자 상세 조회
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'read');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 파라미터 추출
    const { id } = await context.params;

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        // OAuth 계정 정보
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
            type: true,
          },
        },
        // 사주 분석 통계
        _count: {
          select: {
            sajuAnalyses: true,
            notifications: true,
          },
        },
        // 최근 사주 분석 (5개)
        sajuAnalyses: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            category: true,
            birthDate: true,
            birthTime: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 응답 데이터 포맷팅
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        accounts: user.accounts.map((acc) => ({
          provider: acc.provider,
          providerAccountId: acc.providerAccountId,
          type: acc.type,
        })),
        stats: {
          analysisCount: user._count.sajuAnalyses,
          notificationCount: user._count.notifications,
        },
        recentAnalyses: user.sajuAnalyses.map((analysis) => ({
          id: analysis.id,
          category: analysis.category,
          birthDate: analysis.birthDate ? analysis.birthDate.toISOString() : null,
          birthTime: analysis.birthTime,
          createdAt: analysis.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error('[Admin User GET Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사용자 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - 사용자 삭제
 * 참고: Cascade 설정에 따라 관련 데이터도 함께 삭제됨
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'delete');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 파라미터 추출
    const { id } = await context.params;

    // 사용자 존재 확인
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            sajuAnalyses: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 사용자 삭제 (CASCADE로 관련 데이터 자동 삭제)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `사용자 "${user.name}" (${user.email})이(가) 삭제되었습니다.`,
      deletedData: {
        userId: user.id,
        analysisCount: user._count.sajuAnalyses,
      },
    });
  } catch (error) {
    console.error('[Admin User DELETE Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사용자 삭제 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
