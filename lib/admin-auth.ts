/**
 * Admin Authentication Helper
 * 관리자 인증 및 권한 검증 유틸리티
 */

import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

// JWT Secret
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-super-secret-admin-jwt-key-change-this-in-production'
);

// JWT Payload 타입
export interface AdminJWTPayload {
  adminId: string;
  email: string;
  role: string;
}

// 관리자 역할 타입
export type AdminRole = 'super_admin' | 'editor' | 'viewer';

// 역할별 권한 정의
export const ADMIN_PERMISSIONS = {
  super_admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
  editor: ['read', 'write'],
  viewer: ['read'],
} as const;

/**
 * 요청에서 JWT 토큰 추출
 */
export function extractToken(request: NextRequest): string | null {
  // 1. Authorization 헤더에서 추출
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 2. 쿠키에서 추출
  const cookieToken = request.cookies.get('admin_token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * JWT 토큰 검증 및 payload 반환
 */
export async function verifyAdminToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminJWTPayload;
  } catch (error) {
    console.error('[JWT Verify Error]', error);
    return null;
  }
}

/**
 * 요청에서 관리자 인증 정보 가져오기
 */
export async function getAdminFromRequest(request: NextRequest): Promise<{
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
} | null> {
  const token = extractToken(request);
  if (!token) {
    return null;
  }

  const payload = await verifyAdminToken(token);
  if (!payload) {
    return null;
  }

  // 데이터베이스에서 관리자 정보 확인 (토큰 발급 후 비활성화 여부 체크)
  const admin = await prisma.admin.findUnique({
    where: { id: payload.adminId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  return admin;
}

/**
 * 관리자 권한 확인
 */
export function hasPermission(role: string, permission: string): boolean {
  const permissions = ADMIN_PERMISSIONS[role as AdminRole];
  if (!permissions) return false;

  return permissions.includes(permission as any);
}

/**
 * 관리자 인증 필수 미들웨어
 * 사용법: API route 시작 부분에서 호출
 */
export async function requireAdmin(request: NextRequest) {
  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return {
      error: '관리자 인증이 필요합니다.',
      status: 401,
      admin: null,
    };
  }

  return {
    error: null,
    status: 200,
    admin,
  };
}

/**
 * 특정 권한 필수 미들웨어
 */
export async function requirePermission(request: NextRequest, permission: string) {
  const result = await requireAdmin(request);

  if (result.error || !result.admin) {
    return result;
  }

  if (!hasPermission(result.admin.role, permission)) {
    return {
      error: '권한이 부족합니다.',
      status: 403,
      admin: null,
    };
  }

  return {
    error: null,
    status: 200,
    admin: result.admin,
  };
}

/**
 * 관리자 로그아웃 (토큰 무효화)
 */
export function createLogoutResponse() {
  const response = new Response(
    JSON.stringify({
      success: true,
      message: '로그아웃되었습니다.',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  // 쿠키 삭제
  response.headers.set(
    'Set-Cookie',
    'admin_token=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0'
  );

  return response;
}
