/**
 * Admin Current User API
 * GET /api/admin/auth/me
 *
 * 기능: 현재 로그인한 관리자 정보 조회
 * 인증: 필수 (관리자 토큰)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // 관리자 인증 확인
  const { error, status, admin } = await requireAdmin(request);

  if (error || !admin) {
    return NextResponse.json(
      {
        success: false,
        error: error || '인증되지 않았습니다.',
      },
      { status }
    );
  }

  // 관리자 정보 반환
  return NextResponse.json(
    {
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
      },
    },
    { status: 200 }
  );
}
