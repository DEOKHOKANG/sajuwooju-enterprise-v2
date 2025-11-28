/**
 * Saju Analyses API - 사용자의 사주 분석 목록
 * GET /api/saju/analyses
 *
 * 기능: 현재 로그인한 사용자의 사주 분석 전체 목록 조회
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

    // URL 쿼리 파라미터
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 카테고리 필터 (optional)
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 쿼리 조건 구성
    const where: any = {
      userId: session.user.id,
    };

    if (category) {
      where.category = category;
    }

    // 사주 분석 목록 조회
    const [analyses, total] = await Promise.all([
      prisma.sajuAnalysis.findMany({
        where,
        select: {
          id: true,
          category: true,
          title: true,
          birthDate: true,
          birthTime: true,
          isLunar: true,
          visibility: true,
          viewCount: true,
          likeCount: true,
          isPremium: true,
          createdAt: true,
          updatedAt: true,
          // result는 무거우니 목록에서는 제외
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.sajuAnalysis.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      analyses: analyses.map((analysis) => ({
        ...analysis,
        birthDate: analysis.birthDate.toISOString(),
        createdAt: analysis.createdAt.toISOString(),
        updatedAt: analysis.updatedAt.toISOString(),
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('[Saju Analyses List Error]', error);
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

/**
 * Create Saju Analysis API - 새 사주 분석 생성
 * POST /api/saju/analyses
 *
 * 기능: 새로운 사주 분석 결과 저장
 * 인증: 필수
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

    // 요청 바디 파싱
    const body = await request.json();
    const {
      category,
      title,
      birthDate,
      birthTime,
      isLunar,
      gender,
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      result,
      visibility,
      isPremium,
    } = body;

    // 입력 검증
    if (!category || !birthDate || !result) {
      return NextResponse.json(
        { success: false, error: 'category, birthDate, result는 필수입니다.' },
        { status: 400 }
      );
    }

    // 카테고리 검증
    const validCategories = ['연애운', '재물운', '직업운', '궁합', '연운', '종합분석'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 카테고리입니다.' },
        { status: 400 }
      );
    }

    // 생년월일 파싱
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime())) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 생년월일 형식입니다.' },
        { status: 400 }
      );
    }

    // 사주 분석 생성
    const analysis = await prisma.sajuAnalysis.create({
      data: {
        userId: session.user.id,
        category,
        title: title || `${category} 분석`,
        birthDate: birthDateObj,
        birthTime: birthTime || null,
        isLunar: isLunar || false,
        gender: gender || null,
        yearPillar: yearPillar || null,
        monthPillar: monthPillar || null,
        dayPillar: dayPillar || null,
        hourPillar: hourPillar || null,
        result,
        visibility: visibility || 'private',
        isPremium: isPremium || false,
      },
      select: {
        id: true,
        category: true,
        title: true,
        birthDate: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: '사주 분석이 저장되었습니다.',
      analysis: {
        ...analysis,
        birthDate: analysis.birthDate.toISOString(),
        createdAt: analysis.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Create Saju Analysis Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사주 분석 저장 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
