/**
 * Friends Saju Analyses API - 친구들의 공유된 사주 분석
 * GET /api/saju/friends
 *
 * 기능: 친구들이 공유한 사주 분석 조회 (visibility: friends 또는 public)
 * 인증: 필수
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

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

    const currentUserId = session.user.id;

    // URL 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 1. 내 친구 목록 조회 (accepted 상태)
    const myFriends = await prisma.friend.findMany({
      where: {
        AND: [
          { status: 'accepted' },
          {
            OR: [
              { requesterId: currentUserId },
              { addresseeId: currentUserId },
            ],
          },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    // 친구 ID 목록 추출 (나를 제외한)
    const friendIds = myFriends.map((friend) =>
      friend.requesterId === currentUserId
        ? friend.addresseeId
        : friend.requesterId
    );

    if (friendIds.length === 0) {
      // 친구가 없으면 빈 배열 반환
      return NextResponse.json({
        success: true,
        analyses: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false,
        },
      });
    }

    // 2. 친구들의 공유된 사주 분석 조회
    const [analyses, total] = await Promise.all([
      prisma.sajuAnalysis.findMany({
        where: {
          AND: [
            { userId: { in: friendIds } }, // 친구들의 분석만
            {
              OR: [
                { visibility: 'friends' }, // 친구 공개
                { visibility: 'public' },  // 전체 공개
              ],
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.sajuAnalysis.count({
        where: {
          AND: [
            { userId: { in: friendIds } },
            {
              OR: [
                { visibility: 'friends' },
                { visibility: 'public' },
              ],
            },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      analyses: analyses.map((analysis) => ({
        id: analysis.id,
        category: analysis.category,
        title: analysis.title,
        birthDate: analysis.birthDate.toISOString(),
        birthTime: analysis.birthTime,
        isLunar: analysis.isLunar,
        visibility: analysis.visibility,
        viewCount: analysis.viewCount,
        likeCount: analysis.likeCount,
        shareCount: analysis.shareCount,
        isPremium: analysis.isPremium,
        createdAt: analysis.createdAt.toISOString(),
        updatedAt: analysis.updatedAt.toISOString(),
        user: analysis.user,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('[Friends Saju Analyses Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '친구 사주 분석 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
