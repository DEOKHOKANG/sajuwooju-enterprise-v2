'use client';

import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';

/**
 * PageHeader Component (Production-Grade)
 *
 * Standardized page header for all main pages (FEED, HYPE, MATCH, MY)
 * - 3-column responsive layout: Back Button | Title | Action Button
 * - Gradient background with sticky positioning
 * - Mobile-optimized sizing and spacing
 * - Consistent styling across all pages
 *
 * Design System:
 * - Height: py-6 sm:py-8 md:py-10
 * - Grid: grid-cols-[64px_1fr_64px] sm:grid-cols-[auto_1fr_auto]
 * - Colors: bg-gradient-to-r from-purple-600 to-pink-600
 * - Position: sticky top-14 (below MobileHeader)
 *
 * Usage:
 * ```tsx
 * <PageHeader
 *   icon={Users}
 *   title="FEED"
 *   description="팔로우한 사람들의 사주 소식 · 24개 게시물"
 *   onBack={() => window.history.back()}
 *   actionButton={<FilterButton />}
 * />
 * ```
 */

export interface PageHeaderProps {
  /** Icon to display next to title */
  icon: LucideIcon;

  /** Page title */
  title: string;

  /** Optional description text below title */
  description?: string;

  /** Back button handler. If null/undefined, back button is hidden */
  onBack?: (() => void) | null;

  /** Custom back button (overrides default) */
  backButton?: ReactNode;

  /** Action button in the right slot (e.g., Filter, History, Settings) */
  actionButton?: ReactNode;

  /** Custom gradient (default: purple-600 to pink-600) */
  gradient?: string;

  /** Additional className for the header container */
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  onBack,
  backButton,
  actionButton,
  gradient = "from-purple-600 to-pink-600",
  className = "",
}: PageHeaderProps) {
  const router = useRouter();

  // Default back handler
  const handleBack = onBack || (() => window.history.back());

  return (
    <div className={`bg-gradient-to-r ${gradient} text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 sticky top-14 z-40 shadow-xl ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* 3-column layout: Back Button | Title | Action Button */}
        <div className="grid grid-cols-[64px_1fr_64px] sm:grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 mb-3 sm:mb-4">

          {/* Left: Back Button */}
          <div className="flex items-center justify-start">
            {backButton ? (
              backButton
            ) : onBack !== null ? (
              <button
                onClick={handleBack}
                className="active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center hover:bg-white/20 rounded-xl transition-colors"
                aria-label="뒤로 가기"
              >
                <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            ) : (
              <div className="min-h-[56px] min-w-[56px]" /> // Empty spacer
            )}
          </div>

          {/* Center: Title */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Icon className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h1>
          </div>

          {/* Right: Action Button */}
          <div className="flex items-center justify-end">
            {actionButton || <div className="min-h-[56px] min-w-[56px]" />}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-center text-purple-100 text-sm sm:text-base md:text-lg px-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Pre-configured action buttons for common use cases
 */
export function PageHeaderButton({
  icon: Icon,
  onClick,
  active = false,
  'aria-label': ariaLabel,
}: {
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  'aria-label'?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center rounded-xl transition-all ${
        active ? "bg-white/30" : "hover:bg-white/20"
      }`}
      aria-label={ariaLabel}
    >
      <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
    </button>
  );
}
