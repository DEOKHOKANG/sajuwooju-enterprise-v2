/**
 * Admin Logout API
 * POST /api/admin/auth/logout
 *
 * 기능: 관리자 로그아웃 (토큰 무효화)
 * 인증: 필수 (관리자 토큰)
 */

import { NextRequest } from 'next/server';
import { createLogoutResponse } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  // 로그아웃 응답 생성 (쿠키 삭제)
  return createLogoutResponse();
}
