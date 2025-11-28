/**
 * Rate Limiting 미들웨어
 *
 * IP 주소 기반으로 요청 빈도를 제한하여 DDoS 및 브루트포스 공격 방지
 */

import { NextRequest, NextResponse } from 'next/server';

// Rate limit 저장소 (프로덕션에서는 Redis 사용 권장)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// 설정
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW || '60000'); // 1분
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'); // 100 요청/분

/**
 * 클라이언트 IP 주소 가져오기
 */
function getClientIp(request: NextRequest): string {
  // Vercel, CloudFlare 등의 프록시 헤더 확인
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Vercel 환경
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    return vercelIp;
  }

  return 'unknown';
}

/**
 * Rate limit 키 생성
 */
function getRateLimitKey(ip: string, endpoint?: string): string {
  if (endpoint) {
    return `${ip}:${endpoint}`;
  }
  return ip;
}

/**
 * 오래된 엔트리 정리 (메모리 누수 방지)
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 10분마다 자동 정리
setInterval(cleanupExpiredEntries, 10 * 60 * 1000);

/**
 * Rate Limiting 체크
 */
export function checkRateLimit(
  request: NextRequest,
  options: {
    windowMs?: number;
    maxRequests?: number;
    endpoint?: string;
  } = {}
): NextResponse | null {
  const ip = getClientIp(request);
  const windowMs = options.windowMs || WINDOW_MS;
  const maxRequests = options.maxRequests || MAX_REQUESTS;
  const key = getRateLimitKey(ip, options.endpoint);

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // 새로운 윈도우 시작
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });

    return null; // 통과
  }

  // 요청 수 증가
  entry.count++;

  // 제한 초과 확인
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000); // 초 단위

    const response = NextResponse.json(
      {
        success: false,
        error: '요청 횟수 제한을 초과했습니다. 잠시 후 다시 시도해주세요.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter,
      },
      { status: 429 }
    );

    response.headers.set('Retry-After', retryAfter.toString());
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set(
      'X-RateLimit-Reset',
      Math.ceil(entry.resetTime / 1000).toString()
    );

    return response;
  }

  // 아직 제한 내
  return null;
}

/**
 * API 라우트에서 사용할 Rate Limiter
 */
export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private endpoint: string;

  constructor(options: {
    windowMs?: number;
    maxRequests?: number;
    endpoint: string;
  }) {
    this.windowMs = options.windowMs || WINDOW_MS;
    this.maxRequests = options.maxRequests || MAX_REQUESTS;
    this.endpoint = options.endpoint;
  }

  /**
   * Rate limit 체크
   */
  check(request: NextRequest): NextResponse | null {
    return checkRateLimit(request, {
      windowMs: this.windowMs,
      maxRequests: this.maxRequests,
      endpoint: this.endpoint,
    });
  }

  /**
   * 남은 요청 수 가져오기
   */
  getRemaining(request: NextRequest): number {
    const ip = getClientIp(request);
    const key = getRateLimitKey(ip, this.endpoint);
    const entry = rateLimitStore.get(key);

    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * 리셋 시간 가져오기
   */
  getResetTime(request: NextRequest): number {
    const ip = getClientIp(request);
    const key = getRateLimitKey(ip, this.endpoint);
    const entry = rateLimitStore.get(key);

    if (!entry) {
      return Date.now() + this.windowMs;
    }

    return entry.resetTime;
  }
}

/**
 * 엄격한 Rate Limiter (로그인, 민감한 작업용)
 */
export const strictRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15분
  maxRequests: 5, // 5번만 허용
  endpoint: 'strict',
});

/**
 * 일반 Rate Limiter (API 요청용)
 */
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1분
  maxRequests: 100, // 100번 허용
  endpoint: 'api',
});

/**
 * 관리자 Rate Limiter (관리자 로그인용)
 */
export const adminLoginRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15분
  maxRequests: 10, // 10번만 허용
  endpoint: 'admin-login',
});

/**
 * Rate limit 정보를 응답 헤더에 추가
 */
export function addRateLimitHeaders(
  response: NextResponse,
  limiter: RateLimiter,
  request: NextRequest
): NextResponse {
  const remaining = limiter.getRemaining(request);
  const resetTime = limiter.getResetTime(request);

  response.headers.set('X-RateLimit-Limit', limiter['maxRequests'].toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

  return response;
}
