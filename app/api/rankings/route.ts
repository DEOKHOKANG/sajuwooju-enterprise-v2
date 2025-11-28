/**
 * Saju Rankings API - 사주 분석 랭킹
 * GET /api/rankings
 *
 * 기능: 공개된 사주 분석의 인기 랭킹 조회
 * 인증: 선택 (비로그인 사용자도 조회 가능)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 'all' or specific category
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 쿼리 조건 구성
    const where: any = {
      visibility: 'public', // 공개된 사주만
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    // 랭킹 점수 계산 공식:
    // score = viewCount * 1 + likeCount * 5 + shareCount * 3
    // (좋아요가 가장 중요, 공유가 다음, 조회수가 기본)

    // PostgreSQL에서 계산된 점수로 정렬
    const rankings = await prisma.$queryRaw<Array<{
      id: string;
      userId: string;
      category: string;
      title: string | null;
      birthDate: Date;
      viewCount: number;
      likeCount: number;
      shareCount: number;
      createdAt: Date;
      score: number;
    }>>`
      SELECT
        id,
        "userId",
        category,
        title,
        "birthDate",
        "viewCount",
        "likeCount",
        "shareCount",
        "createdAt",
        ("viewCount" * 1 + "likeCount" * 5 + "shareCount" * 3) as score
      FROM "saju_analyses"
      WHERE visibility = 'public'
      ${category && category !== 'all' ? prisma.$queryRawUnsafe('AND category = $1', category) : prisma.$queryRawUnsafe('')}
      ORDER BY score DESC, "createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // 사용자 정보 추가
    const rankingsWithUsers = await Promise.all(
      rankings.map(async (ranking, index) => {
        const user = await prisma.user.findUnique({
          where: { id: ranking.userId },
          select: {
            id: true,
            name: true,
            image: true,
          },
        });

        return {
          rank: offset + index + 1,
          sajuId: ranking.id,
          category: ranking.category,
          sajuTitle: ranking.title || `${ranking.category} 분석`,
          birthDate: ranking.birthDate.toISOString(),
          viewCount: ranking.viewCount,
          likeCount: ranking.likeCount,
          shareCount: ranking.shareCount,
          score: Number(ranking.score),
          createdAt: ranking.createdAt.toISOString(),
          user: {
            id: user?.id || ranking.userId,
            name: user?.name || '익명',
            image: user?.image || null,
          },
        };
      })
    );

    // 전체 개수 조회 (pagination용)
    const total = await prisma.sajuAnalysis.count({ where });

    return NextResponse.json({
      success: true,
      rankings: rankingsWithUsers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('[Rankings Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '랭킹 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
