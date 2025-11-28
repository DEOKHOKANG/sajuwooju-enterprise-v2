/**
 * SajuCard Component - 사주 컨텐츠 카드
 *
 * Generic card component for displaying saju content
 * - Supports multiple layouts (vertical, horizontal, compact)
 * - Element-based styling integration
 * - Hover effects and transitions
 *
 * Phase 1.6: Template Component Library
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { elementBadgeStyles } from '@/lib/constants/colors';

// ========================================
// Types
// ========================================

type ElementKey = keyof typeof elementBadgeStyles;

interface SajuCardProps {
  title: string;
  description?: string;
  element?: ElementKey;
  category?: string;
  categoryColor?: string;
  href?: string;
  imageUrl?: string;
  layout?: 'vertical' | 'horizontal' | 'compact';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// ========================================
// SajuCard Component
// ========================================

export function SajuCard({
  title,
  description,
  element,
  category,
  categoryColor = 'purple',
  href,
  imageUrl,
  layout = 'vertical',
  children,
  className,
  onClick,
}: SajuCardProps) {
  const elementStyle = element ? elementBadgeStyles[element] : null;

  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-all duration-300',
        'bg-white hover:shadow-xl hover:shadow-purple-500/10',
        'border-ui-border hover:border-purple-300',
        layout === 'horizontal' && 'flex gap-4',
        layout === 'compact' && 'flex gap-3',
        className
      )}
      onClick={onClick}
    >
      {/* Background Gradient */}
      {elementStyle && (
        <div
          className={cn(
            'absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500',
            elementStyle.bg
          )}
        />
      )}

      {/* Image */}
      {imageUrl && (
        <div
          className={cn(
            'relative overflow-hidden',
            layout === 'vertical' && 'w-full h-48',
            layout === 'horizontal' && 'w-32 h-32 flex-shrink-0 rounded-l-2xl',
            layout === 'compact' && 'w-16 h-16 flex-shrink-0 rounded-lg'
          )}
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className={cn('relative p-6', layout === 'compact' && 'p-3')}>
        {/* Category Badge */}
        {category && (
          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                `bg-${categoryColor}-100 text-${categoryColor}-700`
              )}
            >
              {category}
            </span>
            {element && elementStyle && (
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  elementStyle.badge
                )}
              >
                {elementStyle.icon} {elementStyle.label}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3
          className={cn(
            'font-bold text-text-primary mb-2 group-hover:text-purple-600 transition-colors',
            layout === 'vertical' && 'text-xl',
            layout === 'horizontal' && 'text-lg',
            layout === 'compact' && 'text-base'
          )}
        >
          {title}
        </h3>

        {/* Description */}
        {description && layout !== 'compact' && (
          <p
            className={cn(
              'text-text-secondary line-clamp-2',
              layout === 'vertical' && 'text-sm',
              layout === 'horizontal' && 'text-xs'
            )}
          >
            {description}
          </p>
        )}

        {/* Custom Children */}
        {children && <div className="mt-4">{children}</div>}

        {/* Hover Arrow */}
        {href && (
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

// ========================================
// SajuCardGrid Component
// ========================================

interface SajuCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SajuCardGrid({
  children,
  columns = 3,
  gap = 'md',
  className,
}: SajuCardGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid', columnClasses[columns], gapClasses[gap], className)}>
      {children}
    </div>
  );
}
