/**
 * Admin Analyses API - 사주 분석 관리
 * GET /api/admin/analyses - 전체 사주 분석 목록 (페이지네이션)
 *
 * 권한: read
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

/**
 * GET - 전체 사주 분석 목록 조회 (페이지네이션)
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 및 권한 확인
    const { error, status, admin } = await requirePermission(request, 'read');

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: error || '인증되지 않았습니다.' },
        { status }
      );
    }

    // 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || '';
    const userId = searchParams.get('userId') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    // 필터 조건 구성
    const where: any = {};

    // 카테고리 필터
    if (category) {
      where.category = category;
    }

    // 사용자 필터
    if (userId) {
      where.userId = userId;
    }

    // 날짜 범위 필터
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    // 전체 개수 조회
    const total = await prisma.sajuAnalysis.count({ where });

    // 분석 목록 조회
    const analyses = await prisma.sajuAnalysis.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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

    // 응답 데이터 포맷팅
    const formattedAnalyses = analyses.map((analysis) => ({
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
    }));

    // 카테고리별 통계
    const categoryStats = await prisma.sajuAnalysis.groupBy({
      by: ['category'],
      where,
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    return NextResponse.json({
      success: true,
      analyses: formattedAnalyses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categoryStats: categoryStats.map((stat) => ({
        category: stat.category,
        count: stat._count.category,
      })),
    });
  } catch (error) {
    console.error('[Admin Analyses GET Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사주 분석 목록 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
