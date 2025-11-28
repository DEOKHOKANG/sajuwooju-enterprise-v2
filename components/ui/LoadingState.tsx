/**
 * LoadingState Component - 사주우주 로딩 상태 UI
 *
 * Reusable loading state components
 * - Spinner (default circular spinner)
 * - Skeleton (content placeholder)
 * - Progress Bar
 * - Page Loader (full page)
 *
 * Usage:
 * ```tsx
 * <Spinner size="lg" />
 * <Skeleton className="h-20 w-full" />
 * <ProgressBar progress={50} />
 * <PageLoader />
 * ```
 *
 * Phase 1.5: Error Handling Implementation
 */

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ========================================
// Spinner Component
// ========================================

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
}

export function Spinner({
  size = "md",
  color = "text-purple-600",
  className = "",
}: SpinnerProps) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2
      className={cn("animate-spin", color, sizeClasses[size], className)}
    />
  );
}

// ========================================
// Loading Message with Spinner
// ========================================

interface LoadingProps {
  message?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Loading({
  message = "로딩 중...",
  size = "md",
  className = "",
}: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <Spinner size={size} />
      <p className="mt-4 text-slate-600 text-sm">{message}</p>
    </div>
  );
}

// ========================================
// Skeleton Component (Content Placeholder)
// ========================================

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  animation = "pulse",
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  return (
    <div
      className={cn(
        "bg-slate-200",
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  );
}

// ========================================
// Skeleton Presets
// ========================================

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-6" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-10" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ========================================
// Progress Bar
// ========================================

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = false,
  color = "bg-gradient-to-r from-purple-600 to-pink-600",
  className = "",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-slate-600">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-slate-700">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300 ease-out", color)}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// ========================================
// Page Loader (Full Page)
// ========================================

interface PageLoaderProps {
  message?: string;
  logo?: boolean;
}

export function PageLoader({
  message = "로딩 중입니다...",
  logo = true,
}: PageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Logo or Icon */}
        {logo && (
          <div className="mb-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-white text-2xl font-bold">사</span>
          </div>
        )}

        {/* Spinner */}
        <Spinner size="lg" />

        {/* Message */}
        {message && (
          <p className="mt-4 text-slate-600 text-base font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

// ========================================
// Inline Loader (for buttons, etc.)
// ========================================

interface InlineLoaderProps {
  text?: string;
  size?: "xs" | "sm" | "md";
}

export function InlineLoader({ text = "처리 중...", size = "sm" }: InlineLoaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={size} />
      <span className="text-sm text-slate-600">{text}</span>
    </div>
  );
}

// ========================================
// Suspense Fallback (for React.Suspense)
// ========================================

export function SuspenseFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loading />
    </div>
  );
}
