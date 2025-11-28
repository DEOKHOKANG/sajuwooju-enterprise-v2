'use client';

import { useState, useEffect } from 'react';
import { ProgressBar, CircularProgress } from './ui/progress-bar';
import {
  LOADING_MESSAGES,
  SHORT_LOADING_MESSAGES,
  getMessageByTime,
  LoadingMessage,
} from '@/lib/loading-messages';

/**
 * SajuLoader Component
 * Complete loading experience with progress (3D removed for optimization)
 * 완전한 사주 분석 로딩 경험 (프로그레스)
 */

interface SajuLoaderProps {
  isLoading?: boolean;
  onComplete?: () => void;
  variant?: 'full' | 'short'; // 전체 메시지 또는 짧은 버전
  mode?: 'simple'; // Simple mode only (3D removed)
}

export function SajuLoader({
  isLoading = true,
  onComplete,
  variant = 'full',
  mode = 'simple',
}: SajuLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<LoadingMessage | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  const messages =
    variant === 'full' ? LOADING_MESSAGES : SHORT_LOADING_MESSAGES;

  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);

      const result = getMessageByTime(elapsed, messages);
      if (result) {
        setCurrentMessage(result.message);
        setProgress(result.message.progress);

        // Complete when reaching 100%
        if (result.message.progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, messages, onComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950">
      <div className="w-full max-w-md px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent mb-4">
            사주우주
          </h1>
          <p className="text-slate-300 text-lg">
            우주의 법칙으로 읽는 나의 운명
          </p>
        </div>

        <div className="text-center mb-8">
          <CircularProgress progress={progress} size={120} />
        </div>

        <p className="text-center text-slate-200 text-lg mb-6 animate-pulse">
          {currentMessage?.text || '분석 중...'}
        </p>

        <ProgressBar
          progress={progress}
          variant="gradient"
          showPercentage={true}
        />

        {/* Loading indicator */}
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-6">
          <span className="animate-pulse">●</span>
          <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>
            ●
          </span>
          <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>
            ●
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * SimpleSajuLoader
 * Lightweight version without 3D
 */
export function SimpleSajuLoader({
  isLoading = true,
  onComplete,
}: Omit<SajuLoaderProps, 'mode' | 'variant'>) {
  return (
    <SajuLoader
      isLoading={isLoading}
      onComplete={onComplete}
      variant="short"
      mode="simple"
    />
  );
}
