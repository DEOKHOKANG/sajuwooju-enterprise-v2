/**
 * Admin Login API
 * POST /api/admin/auth/login
 *
 * 기능: 관리자 로그인 (이메일 + 비밀번호)
 * 인증: 없음 (로그인 endpoint)
 * 보안: bcrypt 비밀번호 해싱, JWT 토큰 발급
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';

// JWT Secret (환경 변수에서 가져오기)
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-super-secret-admin-jwt-key-change-this-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: '이메일과 비밀번호를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    // 관리자 계정 조회
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        passwordHash: true,
      },
    });

    // 계정이 없거나 비활성화된 경우
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: '이메일 또는 비밀번호가 올바르지 않습니다.',
        },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: '비활성화된 계정입니다. 관리자에게 문의하세요.',
        },
        { status: 403 }
      );
    }

    // 비밀번호 검증
    const isValidPassword = await compare(password, admin.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: '이메일 또는 비밀번호가 올바르지 않습니다.',
        },
        { status: 401 }
      );
    }

    // 마지막 로그인 시간 업데이트
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // JWT 토큰 생성 (24시간 유효)
    const token = await new SignJWT({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // 응답
    const response = NextResponse.json(
      {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
        token,
      },
      { status: 200 }
    );

    // HTTP-only 쿠키로도 토큰 설정 (추가 보안)
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24시간
      path: '/admin',
    });

    return response;
  } catch (error) {
    console.error('[Admin Login Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: '로그인 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
