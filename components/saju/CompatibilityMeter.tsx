/**
 * CompatibilityMeter Component - 궁합 점수 표시
 *
 * Visual meter for displaying compatibility scores
 * - Circular progress meter
 * - Color-coded based on score
 * - Animated transitions
 *
 * Phase 1.6: Template Component Library
 */

'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// ========================================
// Types
// ========================================

interface CompatibilityMeterProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

// ========================================
// Helper Functions
// ========================================

function getScoreColor(score: number): {
  text: string;
  stroke: string;
  bg: string;
  label: string;
} {
  if (score >= 90)
    return {
      text: 'text-cosmic-purple',
      stroke: 'stroke-cosmic-purple',
      bg: 'bg-cosmic-purple/10',
      label: '천생연분',
    };
  if (score >= 75)
    return {
      text: 'text-nebula-pink',
      stroke: 'stroke-nebula-pink',
      bg: 'bg-nebula-pink/10',
      label: '환상의 조합',
    };
  if (score >= 60)
    return {
      text: 'text-comet-cyan',
      stroke: 'stroke-comet-cyan',
      bg: 'bg-comet-cyan/10',
      label: '좋은 궁합',
    };
  if (score >= 40)
    return {
      text: 'text-nebula-blue',
      stroke: 'stroke-nebula-blue',
      bg: 'bg-nebula-blue/10',
      label: '평범한 궁합',
    };
  return {
    text: 'text-status-warning',
    stroke: 'stroke-status-warning',
    bg: 'bg-status-warning/10',
    label: '노력 필요',
  };
}

function getSizeValues(size: 'sm' | 'md' | 'lg') {
  const sizes = {
    sm: { diameter: 120, strokeWidth: 8, fontSize: 'text-xl', labelSize: 'text-xs' },
    md: { diameter: 180, strokeWidth: 12, fontSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { diameter: 240, strokeWidth: 16, fontSize: 'text-5xl', labelSize: 'text-base' },
  };
  return sizes[size];
}

// ========================================
// CompatibilityMeter Component
// ========================================

export function CompatibilityMeter({
  score,
  size = 'md',
  label,
  showPercentage = true,
  className,
}: CompatibilityMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const scoreStyle = getScoreColor(clampedScore);
  const sizeValues = getSizeValues(size);

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(clampedScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [clampedScore]);

  const radius = (sizeValues.diameter - sizeValues.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Circular Progress */}
      <div className="relative">
        {/* Background Glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse',
            scoreStyle.bg
          )}
        />

        {/* SVG Circle */}
        <svg
          width={sizeValues.diameter}
          height={sizeValues.diameter}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={sizeValues.diameter / 2}
            cy={sizeValues.diameter / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeValues.strokeWidth}
            className="text-ui-border opacity-20"
          />

          {/* Progress Circle */}
          <circle
            cx={sizeValues.diameter / 2}
            cy={sizeValues.diameter / 2}
            r={radius}
            fill="none"
            strokeWidth={sizeValues.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(scoreStyle.stroke, 'transition-all duration-1000 ease-out')}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn('font-bold', scoreStyle.text, sizeValues.fontSize)}>
            {Math.round(animatedScore)}
            {showPercentage && <span className="text-sm">%</span>}
          </div>
          {label && (
            <div className={cn('font-medium mt-1', scoreStyle.text, sizeValues.labelSize)}>
              {label}
            </div>
          )}
        </div>
      </div>

      {/* Score Label */}
      <div className="text-center">
        <div
          className={cn(
            'inline-flex items-center px-4 py-2 rounded-full font-semibold',
            scoreStyle.bg,
            scoreStyle.text
          )}
        >
          {scoreStyle.label}
        </div>
      </div>
    </div>
  );
}

// ========================================
// CompatibilityBreakdown Component
// ========================================

interface CompatibilityBreakdownProps {
  scores: {
    label: string;
    score: number;
    description?: string;
  }[];
  className?: string;
}

export function CompatibilityBreakdown({
  scores,
  className,
}: CompatibilityBreakdownProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {scores.map((item, index) => {
        const scoreStyle = getScoreColor(item.score);

        return (
          <div key={index} className="space-y-2">
            {/* Label and Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
              <span className={cn('text-sm font-bold', scoreStyle.text)}>
                {item.score}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-ui-border/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-1000 ease-out rounded-full',
                  scoreStyle.bg.replace('/10', '')
                )}
                style={{ width: `${item.score}%` }}
              />
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-xs text-text-secondary">{item.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
