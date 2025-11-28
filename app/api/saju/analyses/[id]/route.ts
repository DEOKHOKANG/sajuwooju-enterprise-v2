/**
 * Saju Analysis Detail API - 특정 사주 분석 상세 조회
 * GET /api/saju/analyses/[id]
 *
 * 기능: 특정 사주 분석 결과의 전체 정보 조회
 * 인증: 필수 (본인 분석만 조회 가능, 또는 공개 설정된 분석)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params (Next.js 16 requirement)
  const { id } = await params;

  try {
    // 사주 분석 조회
    const analysis = await prisma.sajuAnalysis.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: { message: '사주 분석을 찾을 수 없습니다.' } },
        { status: 404 }
      );
    }

    // 인증 확인 (선택적)
    const session = await auth();
    const isAuthenticated = !!session?.user?.id;
    const isOwner = isAuthenticated && analysis.userId === session.user.id;

    // 권한 확인:
    // 1. 본인 분석
    // 2. 공개 설정된 분석
    // 3. 프리미엄 구매 분석 (결제 후 바로 접근 가능)
    const isPublic = analysis.visibility === 'public';
    const isPurchased = analysis.isPremium && analysis.category === 'purchase';
    const isFriends = analysis.visibility === 'friends';

    if (!isOwner && !isPublic && !isPurchased) {
      // friends 설정인 경우 친구 관계 확인 (인증 필요)
      if (isFriends && isAuthenticated) {
        const friendship = await prisma.friend.findFirst({
          where: {
            AND: [
              { status: 'accepted' },
              {
                OR: [
                  { requesterId: session.user.id, addresseeId: analysis.userId },
                  { requesterId: analysis.userId, addresseeId: session.user.id },
                ],
              },
            ],
          },
        });

        if (!friendship) {
          return NextResponse.json(
            { success: false, error: { message: '친구에게만 공개된 분석입니다.' } },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, error: { message: '접근 권한이 없습니다.' } },
          { status: 403 }
        );
      }
    }

    // 조회수 증가 (본인이 아닌 경우만)
    if (!isOwner) {
      await prisma.sajuAnalysis.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        birthDate: analysis.birthDate.toISOString(),
        createdAt: analysis.createdAt.toISOString(),
        updatedAt: analysis.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Saju Analysis Detail Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '사주 분석 조회 중 오류가 발생했습니다.',
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Update Saju Analysis API - 사주 분석 수정
 * PATCH /api/saju/analyses/[id]
 *
 * 기능: 사주 분석의 title, visibility 등 수정
 * 인증: 필수 (본인 분석만 수정 가능)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params (Next.js 16 requirement)
  const { id } = await params;

  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 요청 바디 파싱
    const body = await request.json();
    const { title, visibility } = body;

    // 사주 분석 존재 여부 및 소유권 확인
    const existingAnalysis = await prisma.sajuAnalysis.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { success: false, error: '사주 분석을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (existingAnalysis.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: '수정 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 업데이트할 데이터 구성
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (visibility !== undefined) {
      const validVisibilities = ['private', 'friends', 'public'];
      if (!validVisibilities.includes(visibility)) {
        return NextResponse.json(
          { success: false, error: '유효하지 않은 공개 범위입니다.' },
          { status: 400 }
        );
      }
      updateData.visibility = visibility;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // 사주 분석 업데이트
    const updatedAnalysis = await prisma.sajuAnalysis.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        visibility: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: '사주 분석이 업데이트되었습니다.',
      analysis: {
        ...updatedAnalysis,
        updatedAt: updatedAnalysis.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Update Saju Analysis Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사주 분석 업데이트 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Delete Saju Analysis API - 사주 분석 삭제
 * DELETE /api/saju/analyses/[id]
 *
 * 기능: 사주 분석 삭제
 * 인증: 필수 (본인 분석만 삭제 가능)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params (Next.js 16 requirement)
  const { id } = await params;

  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사주 분석 존재 여부 및 소유권 확인
    const existingAnalysis = await prisma.sajuAnalysis.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { success: false, error: '사주 분석을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (existingAnalysis.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: '삭제 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 사주 분석 삭제
    await prisma.sajuAnalysis.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '사주 분석이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('[Delete Saju Analysis Error]', error);
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
