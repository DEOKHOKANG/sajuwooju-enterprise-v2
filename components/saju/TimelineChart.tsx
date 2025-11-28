/**
 * TimelineChart Component - 타임라인 차트
 *
 * Visual timeline for displaying fortune over time periods
 * - Monthly/quarterly/yearly views
 * - Element-based color coding
 * - Interactive hover states
 *
 * Phase 1.6: Template Component Library
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { elementBadgeStyles } from '@/lib/constants/colors';

// ========================================
// Types
// ========================================

type ElementKey = keyof typeof elementBadgeStyles;

interface TimelineItem {
  period: string; // "1월", "Q1 2025", etc.
  score: number; // 0-100
  element?: ElementKey;
  label?: string;
  description?: string;
}

interface TimelineChartProps {
  data: TimelineItem[];
  title?: string;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  className?: string;
}

// ========================================
// Helper Functions
// ========================================

function getScoreHeight(score: number): string {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  return `${clampedScore}%`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-cosmic-purple';
  if (score >= 60) return 'bg-nebula-pink';
  if (score >= 40) return 'bg-comet-cyan';
  return 'bg-nebula-blue';
}

// ========================================
// TimelineChart Component (Vertical Bars)
// ========================================

export function TimelineChart({
  data,
  title,
  orientation = 'vertical',
  showLabels = true,
  className,
}: TimelineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (orientation === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {title && <h3 className="text-lg font-bold text-text-primary">{title}</h3>}

        <div className="relative">
          {/* Chart Container */}
          <div className="flex items-end gap-2 h-64 pb-8 pt-4">
            {data.map((item, index) => {
              const isHovered = hoveredIndex === index;
              const elementStyle = item.element
                ? elementBadgeStyles[item.element]
                : null;
              const scoreColor = getScoreColor(item.score);

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Bar */}
                  <div className="relative w-full flex flex-col justify-end h-full">
                    {/* Score Label (on hover) */}
                    {isHovered && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-space-dark text-white text-xs font-bold px-2 py-1 rounded">
                          {item.score}점
                        </div>
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      className={cn(
                        'w-full rounded-t-lg transition-all duration-300',
                        scoreColor,
                        isHovered ? 'opacity-100 shadow-lg' : 'opacity-80',
                        elementStyle && `hover:${elementStyle.bg}`
                      )}
                      style={{ height: getScoreHeight(item.score) }}
                    />
                  </div>

                  {/* Period Label */}
                  <div className="text-xs text-text-secondary text-center font-medium">
                    {item.period}
                  </div>

                  {/* Element Badge (if present) */}
                  {showLabels && item.element && elementStyle && (
                    <div
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full',
                        elementStyle.badge
                      )}
                    >
                      {elementStyle.icon}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hover Card */}
          {hoveredIndex !== null && data[hoveredIndex]?.description && (
            <div className="absolute bottom-full left-0 right-0 mb-4 px-4">
              <div className="glass rounded-lg p-4 border border-ui-border">
                <p className="text-sm font-semibold text-text-primary mb-1">
                  {data[hoveredIndex].label || data[hoveredIndex].period}
                </p>
                <p className="text-xs text-text-secondary">
                  {data[hoveredIndex].description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal Timeline
  return (
    <div className={cn('space-y-6', className)}>
      {title && <h3 className="text-lg font-bold text-text-primary">{title}</h3>}

      <div className="space-y-4">
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const elementStyle = item.element ? elementBadgeStyles[item.element] : null;
          const scoreColor = getScoreColor(item.score);

          return (
            <div
              key={index}
              className={cn(
                'group transition-all duration-300',
                isHovered && 'scale-102'
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Period and Score */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">
                    {item.period}
                  </span>
                  {item.element && elementStyle && (
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        elementStyle.badge
                      )}
                    >
                      {elementStyle.icon} {elementStyle.label}
                    </span>
                  )}
                </div>
                <span className={cn('text-sm font-bold', scoreColor.replace('bg-', 'text-'))}>
                  {item.score}점
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-ui-border/20 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500 ease-out rounded-full',
                    scoreColor,
                    isHovered && 'shadow-lg'
                  )}
                  style={{ width: getScoreHeight(item.score) }}
                />
              </div>

              {/* Description */}
              {showLabels && item.description && (
                <p className="text-xs text-text-secondary mt-2">{item.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========================================
// TimelineDot Component (for milestone events)
// ========================================

interface TimelineDotProps {
  items: {
    date: string;
    title: string;
    description?: string;
    element?: ElementKey;
    isHighlight?: boolean;
  }[];
  className?: string;
}

export function TimelineDot({ items, className }: TimelineDotProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cosmic-purple via-nebula-pink to-comet-cyan" />

      {/* Timeline Items */}
      <div className="space-y-8">
        {items.map((item, index) => {
          const elementStyle = item.element ? elementBadgeStyles[item.element] : null;

          return (
            <div key={index} className="relative flex gap-4">
              {/* Dot */}
              <div className="relative flex-shrink-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110',
                    item.isHighlight
                      ? 'bg-cosmic-purple'
                      : elementStyle
                      ? elementStyle.bg
                      : 'bg-nebula-blue'
                  )}
                >
                  {item.isHighlight && (
                    <span className="text-white text-xs">★</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="glass rounded-lg p-4 border border-ui-border hover:border-cosmic-purple transition-colors">
                  {/* Date */}
                  <div className="text-xs text-text-tertiary mb-1">{item.date}</div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                    {item.title}
                    {item.element && elementStyle && (
                      <span
                        className={cn('text-xs px-2 py-0.5 rounded-full', elementStyle.badge)}
                      >
                        {elementStyle.icon}
                      </span>
                    )}
                  </h4>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-text-secondary">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
