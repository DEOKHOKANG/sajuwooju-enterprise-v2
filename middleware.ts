/**
 * Next.js Global Middleware
 *
 * 모든 요청에 대해 실행되는 전역 미들웨어
 * - 보안 헤더 설정
 * - Rate Limiting
 * - CSRF 보호 (선택적)
 */

import { NextRequest, NextResponse } from 'next/server';
import { setSecurityHeaders } from './lib/middleware/security-headers';
import { checkRateLimit, adminLoginRateLimiter } from './lib/middleware/rate-limit';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rate Limiting 체크
  let rateLimitResponse: NextResponse | null = null;

  // 관리자 로그인 엔드포인트 - 엄격한 제한
  if (pathname === '/api/admin/auth') {
    rateLimitResponse = adminLoginRateLimiter.check(request);
  }
  // 일반 API 엔드포인트 - 일반 제한
  else if (pathname.startsWith('/api/')) {
    rateLimitResponse = checkRateLimit(request, {
      windowMs: 60 * 1000, // 1분
      maxRequests: 100, // 100 요청/분
    });
  }

  // Rate limit 초과 시 응답 반환
  if (rateLimitResponse) {
    return setSecurityHeaders(rateLimitResponse);
  }

  // 2. 정상 요청 계속 진행
  const response = NextResponse.next();

  // 3. 보안 헤더 설정
  setSecurityHeaders(response);

  // 4. API 응답 캐싱 방지
  if (pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

// 미들웨어 적용 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 경로에 적용:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public 폴더의 정적 파일들
     */
    '/((?!_next/static|_next/image|favicon.ico|textures|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
