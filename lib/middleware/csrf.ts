/**
 * CSRF (Cross-Site Request Forgery) 보호 미들웨어
 *
 * POST, PUT, PATCH, DELETE 요청에 대해 CSRF 토큰 검증
 * GET, HEAD, OPTIONS 요청은 검증하지 않음
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf-token';

/**
 * CSRF 토큰 생성
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * CSRF 토큰 서명 생성
 */
function signToken(token: string): string {
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(token);
  return hmac.digest('hex');
}

/**
 * CSRF 토큰 검증
 */
function verifyToken(token: string, signature: string): boolean {
  const expectedSignature = signToken(token);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * CSRF 보호가 필요한 메소드인지 확인
 */
function requiresCsrfProtection(method: string): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

/**
 * CSRF 미들웨어
 */
export function csrfMiddleware(request: NextRequest): NextResponse | null {
  const { method } = request;

  // CSRF 보호가 필요하지 않은 메소드는 통과
  if (!requiresCsrfProtection(method)) {
    return null;
  }

  // 헤더에서 CSRF 토큰 가져오기
  const csrfToken = request.headers.get(CSRF_HEADER_NAME);

  // 쿠키에서 서명된 토큰 가져오기
  const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  // 토큰이 없으면 에러
  if (!csrfToken || !csrfCookie) {
    return NextResponse.json(
      {
        success: false,
        error: 'CSRF 토큰이 누락되었습니다.',
        code: 'CSRF_TOKEN_MISSING',
      },
      { status: 403 }
    );
  }

  try {
    // 토큰 파싱 (token:signature 형식)
    const [token, signature] = csrfCookie.split(':');

    if (!token || !signature) {
      throw new Error('Invalid CSRF cookie format');
    }

    // 토큰 검증
    if (csrfToken !== token || !verifyToken(token, signature)) {
      return NextResponse.json(
        {
          success: false,
          error: 'CSRF 토큰이 유효하지 않습니다.',
          code: 'CSRF_TOKEN_INVALID',
        },
        { status: 403 }
      );
    }

    // 검증 성공
    return null;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'CSRF 토큰 검증 실패',
        code: 'CSRF_VERIFICATION_FAILED',
      },
      { status: 403 }
    );
  }
}

/**
 * CSRF 토큰을 응답 쿠키에 설정
 */
export function setCsrfCookie(response: NextResponse): NextResponse {
  const token = generateCsrfToken();
  const signature = signToken(token);
  const cookieValue = `${token}:${signature}`;

  response.cookies.set(CSRF_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24시간
    path: '/',
  });

  // 클라이언트가 읽을 수 있도록 헤더에도 토큰 설정
  response.headers.set(CSRF_HEADER_NAME, token);

  return response;
}

/**
 * CSRF 토큰 가져오기 API 핸들러
 */
export async function getCsrfTokenHandler(): Promise<NextResponse> {
  const token = generateCsrfToken();
  const signature = signToken(token);
  const cookieValue = `${token}:${signature}`;

  const response = NextResponse.json({
    success: true,
    csrfToken: token,
  });

  response.cookies.set(CSRF_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24시간
    path: '/',
  });

  return response;
}
