/**
 * 보안 헤더 미들웨어
 *
 * OWASP 권장 보안 헤더 설정
 * - XSS 보호
 * - Clickjacking 방지
 * - MIME 스니핑 방지
 * - Referrer 정책
 * - Content Security Policy
 */

import { NextResponse } from 'next/server';

/**
 * 보안 헤더 설정
 */
export function setSecurityHeaders(response: NextResponse): NextResponse {
  // X-Frame-Options: Clickjacking 방지
  response.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options: MIME 스니핑 방지
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection: XSS 필터 활성화 (레거시 브라우저용)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy: Referrer 정보 제어
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: 브라우저 기능 제한
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  );

  // Strict-Transport-Security: HTTPS 강제 (프로덕션에서만)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Content-Security-Policy: 콘텐츠 보안 정책
  // 토스페이먼츠 전체 도메인: js.tosspayments.com, api.tosspayments.com,
  // connect.tosspayments.com, apigw.tosspayments.com
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com https://*.tosspayments.com https://developers.kakao.com https://t1.kakaocdn.net https://*.kakao.com",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://*.tosspayments.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https: https://cdn.jsdelivr.net",
    "connect-src 'self' https://vercel.live https://va.vercel-scripts.com https://*.tosspayments.com wss://*.tosspayments.com https://*.kakao.com",
    "frame-src 'self' https://*.tosspayments.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.tosspayments.com",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

/**
 * CORS 헤더 설정
 */
export function setCorsHeaders(
  response: NextResponse,
  options: {
    origin?: string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  } = {}
): NextResponse {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'X-Requested-With',
    ],
    exposedHeaders = ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials = true,
    maxAge = 86400, // 24시간
  } = options;

  // Access-Control-Allow-Origin
  if (Array.isArray(origin)) {
    // 여러 origin 허용 시 (실제로는 요청 origin 확인 필요)
    response.headers.set('Access-Control-Allow-Origin', origin[0]);
  } else {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Access-Control-Allow-Methods
  response.headers.set('Access-Control-Allow-Methods', methods.join(', '));

  // Access-Control-Allow-Headers
  response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '));

  // Access-Control-Expose-Headers
  response.headers.set('Access-Control-Expose-Headers', exposedHeaders.join(', '));

  // Access-Control-Allow-Credentials
  if (credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Access-Control-Max-Age
  response.headers.set('Access-Control-Max-Age', maxAge.toString());

  return response;
}

/**
 * API 응답에 보안 헤더 추가
 */
export function secureApiResponse(response: NextResponse): NextResponse {
  setSecurityHeaders(response);

  // API 응답 캐시 방지
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

/**
 * 정적 리소스 응답 헤더 (캐싱 허용)
 */
export function staticResourceHeaders(
  response: NextResponse,
  maxAge: number = 31536000 // 1년
): NextResponse {
  setSecurityHeaders(response);

  // 캐싱 허용
  response.headers.set('Cache-Control', `public, max-age=${maxAge}, immutable`);

  return response;
}

/**
 * HTML 페이지 응답 헤더
 */
export function htmlPageHeaders(response: NextResponse): NextResponse {
  setSecurityHeaders(response);

  // 짧은 캐싱 (CDN용)
  response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');

  return response;
}

/**
 * 에러 응답 헤더 (정보 누출 방지)
 */
export function errorResponseHeaders(response: NextResponse): NextResponse {
  setSecurityHeaders(response);

  // 캐싱 방지
  response.headers.set('Cache-Control', 'no-store');

  // 서버 정보 숨기기
  response.headers.delete('Server');
  response.headers.delete('X-Powered-By');

  return response;
}
