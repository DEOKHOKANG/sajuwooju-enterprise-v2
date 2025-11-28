/**
 * Admin Analyses API - 개별 사주 분석 관리
 * GET /api/admin/analyses/[id] - 사주 분석 상세 조회
 * DELETE /api/admin/analyses/[id] - 사주 분석 삭제
 *
 * 권한: read (GET), delete (DELETE)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET - 사주 분석 상세 조회
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

    // 분석 조회
    const analysis = await prisma.sajuAnalysis.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: '사주 분석을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 응답 데이터 포맷팅
    return NextResponse.json({
      success: true,
      analysis: {
        id: analysis.id,
        category: analysis.category,
        birthDate: analysis.birthDate,
        birthTime: analysis.birthTime,
        user: analysis.user
          ? {
              id: analysis.user.id,
              name: analysis.user.name,
              email: analysis.user.email,
              image: analysis.user.image,
            }
          : null,
        createdAt: analysis.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Admin Analysis GET Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사주 분석 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - 사주 분석 삭제
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

    // 분석 존재 확인
    const analysis = await prisma.sajuAnalysis.findUnique({
      where: { id },
      select: {
        id: true,
        category: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: '사주 분석을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 분석 삭제
    await prisma.sajuAnalysis.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '사주 분석이 삭제되었습니다.',
      deletedAnalysis: {
        id: analysis.id,
        category: analysis.category,
        user: analysis.user
          ? {
              name: analysis.user.name,
              email: analysis.user.email,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('[Admin Analysis DELETE Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사주 분석 삭제 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
