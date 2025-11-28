/**
 * User Profile API - 사용자 프로필 정보 조회
 * GET /api/user/profile
 *
 * 기능: 현재 로그인한 사용자의 상세 프로필 정보 반환
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

    // 사용자 프로필 조회
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profileImage: true,
        level: true,
        role: true,
        followerCount: true,
        followingCount: true,
        friendCount: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // joinDate 계산 (가입일로부터 경과 일수)
    const joinDate = user.createdAt.toISOString().split('T')[0];
    const daysSinceJoin = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name || '사용자',
        email: user.email || '',
        profileImage: user.image || user.profileImage || '',
        level: user.level,
        role: user.role,
        joinDate,
        daysSinceJoin,
        // Social stats
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        friendCount: user.friendCount,
        // Metadata
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('[User Profile Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '프로필 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * User Profile Update API - 사용자 프로필 수정
 * PATCH /api/user/profile
 *
 * 기능: 사용자 이름, 프로필 이미지 업데이트
 * 인증: 필수
 */
export async function PATCH(request: NextRequest) {
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
    const { name, profileImage } = body;

    // 입력 검증
    if (name && (name.length < 2 || name.length > 20)) {
      return NextResponse.json(
        { success: false, error: '이름은 2-20자 사이여야 합니다.' },
        { status: 400 }
      );
    }

    // 업데이트할 데이터 구성
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // 프로필 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profileImage: true,
        level: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: '프로필이 업데이트되었습니다.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.image || updatedUser.profileImage,
        level: updatedUser.level,
      },
    });
  } catch (error) {
    console.error('[User Profile Update Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '프로필 업데이트 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
