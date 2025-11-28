'use client';

import { useEffect, useState } from 'react';

/**
 * ProgressBar Component
 * Animated progress bar with cosmic theme
 * 우주 테마 프로그레스 바
 */

interface ProgressBarProps {
  progress: number; // 0-100
  duration?: number; // Animation duration in ms
  showPercentage?: boolean;
  className?: string;
  variant?: 'default' | 'gradient' | 'glow';
}

export function ProgressBar({
  progress,
  duration = 300,
  showPercentage = true,
  className = '',
  variant = 'gradient',
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar container */}
      <div className="relative w-full h-3 bg-space-dark rounded-full overflow-hidden border border-ui-border">
        {/* Progress fill */}
        <div
          className={`h-full transition-all ease-out ${getVariantClass(variant)}`}
          style={{
            width: `${displayProgress}%`,
            transitionDuration: `${duration}ms`,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>

        {/* Glow effect for 'glow' variant */}
        {variant === 'glow' && displayProgress > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-star-gold/50 blur-sm"
            style={{
              width: `${displayProgress}%`,
              transitionDuration: `${duration}ms`,
            }}
          />
        )}
      </div>

      {/* Percentage text */}
      {showPercentage && (
        <div className="mt-2 text-center">
          <span className="font-display text-sm font-medium text-text-secondary">
            {Math.round(displayProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Get variant class for progress bar
 */
function getVariantClass(variant: 'default' | 'gradient' | 'glow'): string {
  switch (variant) {
    case 'default':
      return 'bg-star-gold';
    case 'gradient':
      return 'bg-gradient-aurora';
    case 'glow':
      return 'bg-gradient-nebula shadow-glow';
    default:
      return 'bg-star-gold';
  }
}

/**
 * CircularProgress Component
 * Circular progress indicator
 */
interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  className = '',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* SVG Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-space-dark"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#7B68EE" />
            <stop offset="100%" stopColor="#4ECBFF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Add shimmer animation to globals.css:
 *
 * @keyframes shimmer {
 *   0% { transform: translateX(-100%); }
 *   100% { transform: translateX(100%); }
 * }
 *
 * .animate-shimmer {
 *   animation: shimmer 2s infinite;
 * }
 */
