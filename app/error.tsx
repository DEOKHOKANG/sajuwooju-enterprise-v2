'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary
 * Phase 10.2: Global Error Handling
 * https://nextjs.org/docs/app/api-reference/file-conventions/error
 *
 * Features:
 * - Cosmic-themed error UI with space background
 * - Error logging capability
 * - Development mode error details
 * - Responsive mobile-first design
 * - Clear call-to-action buttons
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Phase 1.5: Use centralized error handler
    const { logError } = require('@/lib/utils/errorHandler');
    logError(error, {
      digest: error.digest,
      page: 'global-error',
      timestamp: new Date().toISOString(),
    });

    // TODO: 실제 배포 시 에러 추적 서비스 연동
    // if (process.env.NODE_ENV === 'production') {
    //   logToExternalService(error, { digest: error.digest });
    // }
  }, [error]);

  return (
    <div className="min-h-screen bg-space relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* 떠다니는 오브 - 배경 장식 */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-nebula-pink rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" />
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-cosmic-purple rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" style={{ animationDelay: '-7s' }} />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-nebula-blue rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" style={{ animationDelay: '-14s' }} />

        {/* 별 배경 */}
        <div className="absolute inset-0 stars-background" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Error Icon / Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            {/* 외부 원형 glow */}
            <div className="absolute inset-0 rounded-full border-2 border-cosmic-purple/30 animate-pulse" />
            <div className="absolute inset-2 rounded-full border border-cosmic-purple/20 animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* 중앙 경고 심볼 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-bounce">⚠️</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="glass rounded-2xl p-8 mb-8 border border-ui-border">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-nebula mb-3 text-center">
            오류가 발생했습니다
          </h1>

          <p className="text-text-secondary text-center text-sm sm:text-base mb-4">
            일시적인 우주 장애가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-6 border-t border-ui-border">
              <p className="text-xs text-status-warning mb-3 font-semibold uppercase tracking-wider">
                개발자 정보
              </p>
              <div className="bg-space-dark/50 rounded-lg p-4 overflow-auto max-h-48 border border-status-error/20">
                <p className="text-xs font-mono text-status-error break-all mb-2">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-status-warning">
                    Error ID: <span className="font-mono">{error.digest}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:flex sm:gap-3 sm:space-y-0">
          <button
            onClick={reset}
            className="w-full sm:flex-1 px-6 py-3 bg-cosmic-purple hover:bg-cosmic-purple/90 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-cosmic-purple/50 flex items-center justify-center gap-2"
          >
            <span>다시 시도</span>
            <span className="text-lg">↻</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 px-6 py-3 glass hover:bg-ui-glass-hover text-text-primary font-semibold rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>홈으로 돌아가기</span>
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-10 text-center">
          <p className="text-text-tertiary text-xs sm:text-sm mb-3">
            문제가 계속되면 아래에서 운세를 다시 확인해보세요
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/saju/love-fortune"
              className="text-comet-cyan hover:text-comet-cyan/80 text-sm font-medium transition-colors"
            >
              연애운
            </Link>
            <span className="text-text-tertiary">•</span>
            <Link
              href="/saju/wealth-fortune"
              className="text-comet-cyan hover:text-comet-cyan/80 text-sm font-medium transition-colors"
            >
              재물운
            </Link>
            <span className="text-text-tertiary">•</span>
            <Link
              href="/saju/career-fortune"
              className="text-comet-cyan hover:text-comet-cyan/80 text-sm font-medium transition-colors"
            >
              직장운
            </Link>
          </div>
        </div>

        {/* Error Code Badge */}
        <div className="mt-8 flex justify-center">
          <div className="glass px-4 py-2 rounded-full border border-ui-border">
            <p className="text-xs text-text-tertiary font-mono">
              Error: {error.digest?.slice(0, 8) || 'UNKNOWN'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
