/**
 * Admin Users API - 사용자 관리
 * GET /api/admin/users - 전체 사용자 목록 (페이지네이션)
 *
 * 권한: read
 * 참고: 사용자 생성은 일반 회원가입을 통해서만 가능 (POST 없음)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

/**
 * GET - 전체 사용자 목록 조회 (페이지네이션)
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
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt'; // createdAt, lastLoginAt, name
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc, desc

    // 필터 조건 구성
    const where: any = {};

    // 검색어 필터 (이름, 이메일)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 정렬 조건
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    // 전체 개수 조회
    const total = await prisma.user.count({ where });

    // 사용자 목록 조회
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            sajuAnalyses: true,
            accounts: true,
          },
        },
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    // 응답 데이터 포맷팅
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified?.toISOString() || null,
      providers: user.accounts.map((acc) => acc.provider),
      stats: {
        analysisCount: user._count.sajuAnalyses,
        accountsCount: user._count.accounts,
      },
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Admin Users GET Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '사용자 목록 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
