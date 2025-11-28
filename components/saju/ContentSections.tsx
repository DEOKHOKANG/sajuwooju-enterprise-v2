/**
 * ContentSections Components - 사주 컨텐츠 섹션
 *
 * Reusable content section components for saju templates
 * - InsightSection: For displaying analysis insights
 * - FortuneCard: For fortune/luck information
 * - RecommendationList: For actionable recommendations
 *
 * Phase 1.6: Template Component Library
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { elementBadgeStyles } from '@/lib/constants/colors';

// ========================================
// Types
// ========================================

type ElementKey = keyof typeof elementBadgeStyles;

// ========================================
// InsightSection Component
// ========================================

interface InsightSectionProps {
  title?: string;
  insights: {
    icon?: string;
    label: string;
    content: string;
    element?: ElementKey;
  }[];
  className?: string;
}

export function InsightSection({
  title = '상세 분석',
  insights,
  className,
}: InsightSectionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <span className="text-cosmic-purple">✨</span>
          {title}
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const elementStyle = insight.element
            ? elementBadgeStyles[insight.element]
            : null;

          return (
            <div
              key={index}
              className="glass rounded-xl p-5 border border-ui-border hover:border-cosmic-purple/50 transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                {/* Icon */}
                {insight.icon && (
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cosmic-purple to-nebula-pink rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {insight.icon}
                  </div>
                )}

                {/* Label */}
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-text-primary mb-1">
                    {insight.label}
                  </h4>
                  {elementStyle && (
                    <span
                      className={cn(
                        'inline-block text-xs px-2 py-0.5 rounded-full',
                        elementStyle.badge
                      )}
                    >
                      {elementStyle.icon} {elementStyle.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-text-secondary leading-relaxed">
                {insight.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========================================
// FortuneCard Component
// ========================================

interface FortuneCardProps {
  element?: ElementKey;
  title: string;
  score?: number;
  summary?: string;
  highlights?: string[];
  icon?: string;
  className?: string;
}

export function FortuneCard({
  element,
  title,
  score,
  summary,
  highlights = [],
  icon = '🔮',
  className,
}: FortuneCardProps) {
  const elementStyle = element ? elementBadgeStyles[element] : null;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300',
        'bg-gradient-to-br from-white to-purple-50/30',
        'border-ui-border hover:border-cosmic-purple hover:shadow-xl hover:shadow-cosmic-purple/20',
        className
      )}
    >
      {/* Background Gradient */}
      {elementStyle && (
        <div
          className={cn(
            'absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10',
            elementStyle.bg
          )}
        />
      )}

      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{icon}</div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">{title}</h3>
              {elementStyle && (
                <span
                  className={cn(
                    'inline-block text-xs px-2 py-0.5 rounded-full mt-1',
                    elementStyle.badge
                  )}
                >
                  {elementStyle.icon} {elementStyle.label}
                </span>
              )}
            </div>
          </div>

          {/* Score Badge */}
          {score !== undefined && (
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-gradient-nebula">{score}</div>
              <div className="text-xs text-text-tertiary">점</div>
            </div>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <p className="text-sm text-text-secondary leading-relaxed bg-white/50 rounded-lg p-4">
            {summary}
          </p>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wide">
              핵심 포인트
            </h4>
            <ul className="space-y-2">
              {highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span className="text-cosmic-purple flex-shrink-0 mt-0.5">▪</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// RecommendationList Component
// ========================================

interface RecommendationListProps {
  title?: string;
  recommendations: {
    category: string;
    items: string[];
    icon?: string;
  }[];
  className?: string;
}

export function RecommendationList({
  title = '실천 가이드',
  recommendations,
  className,
}: RecommendationListProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <span className="text-comet-cyan">💡</span>
          {title}
        </h3>
      )}

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="glass rounded-xl p-5 border border-ui-border hover:border-comet-cyan/50 transition-colors"
          >
            {/* Category Header */}
            <div className="flex items-center gap-2 mb-3">
              {rec.icon && <span className="text-xl">{rec.icon}</span>}
              <h4 className="font-bold text-text-primary">{rec.category}</h4>
            </div>

            {/* Items */}
            <ul className="space-y-2">
              {rec.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex items-start gap-3 text-sm text-text-secondary"
                >
                  <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-comet-cyan to-nebula-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {itemIndex + 1}
                  </span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// ElementCircle Component (for 5 elements display)
// ========================================

interface ElementCircleProps {
  elements: {
    element: ElementKey;
    percentage: number;
    description?: string;
  }[];
  title?: string;
  className?: string;
}

export function ElementCircle({ elements, title = '오행 분포', className }: ElementCircleProps) {
  const total = elements.reduce((sum, e) => sum + e.percentage, 0);

  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <h3 className="text-xl font-bold text-text-primary text-center">{title}</h3>
      )}

      {/* Element Rings */}
      <div className="relative w-64 h-64 mx-auto">
        {/* Center Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-cosmic-purple to-nebula-pink rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            오행
          </div>
        </div>

        {/* Element Segments */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {elements.map((item, index) => {
            const elementStyle = elementBadgeStyles[item.element];
            const startAngle = elements
              .slice(0, index)
              .reduce((sum, e) => sum + (e.percentage / total) * 360, 0);
            const angle = (item.percentage / total) * 360;

            return (
              <g key={index}>
                <title>
                  {elementStyle.label}: {item.percentage}%
                </title>
                {/* Simplified arc representation - actual path calculation would be more complex */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={`var(--${item.element}-color, currentColor)`}
                  strokeWidth="8"
                  strokeDasharray={`${(angle / 360) * 251.2} 251.2`}
                  strokeDashoffset={-((startAngle / 360) * 251.2)}
                  className={cn('transition-all duration-300 hover:stroke-width-12')}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Element Legend */}
      <div className="grid grid-cols-2 gap-3">
        {elements.map((item, index) => {
          const elementStyle = elementBadgeStyles[item.element];

          return (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-ui-glass-hover transition-colors"
            >
              <div
                className={cn(
                  'w-3 h-3 rounded-full flex-shrink-0',
                  elementStyle.bg
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-text-primary truncate">
                  {elementStyle.label}
                </div>
                <div className="text-xs text-text-tertiary">{item.percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
