/**
 * 사주우주 Design Tokens - Color System
 * Single Source of Truth for all colors in the application
 *
 * Created: 2025-11-17
 * Phase: 1.4 - Color System Integration
 *
 * Usage:
 * ```tsx
 * import { colors, elementBadgeStyles } from '@/lib/constants/colors';
 *
 * // Brand colors
 * <Button className={colors.brand.primary.gradient}>CTA</Button>
 *
 * // Five Elements (음양오행)
 * <span className={elementBadgeStyles["木"]}>Wood</span>
 * ```
 */

// ========================================
// Core Color Palette
// ========================================

export const colors = {
  // 사주우주 브랜드 색상 (SajuWooju Brand Colors)
  brand: {
    primary: {
      gradient: 'bg-gradient-to-r from-purple-600 to-pink-600',
      gradientHover: 'hover:from-purple-700 hover:to-pink-700',
      solid: '#7B68EE',        // cosmic-purple
      light: '#F3F0FF',        // purple-50
      lighter: '#FAF5FF',      // purple-25
      text: '#6B46C1',         // purple-700
      textLight: '#9333EA',    // purple-600
    },
    secondary: {
      gradient: 'bg-gradient-to-r from-violet-600 to-purple-600',
      gradientHover: 'hover:from-violet-700 hover:to-purple-700',
      solid: '#8B5CF6',        // violet-600
      light: '#EDE9FE',        // violet-50
      text: '#7C3AED',         // violet-700
    },
  },

  // 음양오행 (Five Elements) - Standard Definition
  elements: {
    wood: {
      // 木 - Growth, Spring, East
      gradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
      gradientHover: 'hover:from-amber-600 hover:to-orange-600',
      solid: '#F59E0B',        // amber-500
      light: '#FEF3C7',        // amber-50
      lighter: '#FFFBEB',      // amber-25
      text: '#D97706',         // amber-700
      textLight: '#F59E0B',    // amber-500
      border: '#FCD34D',       // amber-300
    },
    fire: {
      // 火 - Energy, Summer, South
      gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
      gradientHover: 'hover:from-red-600 hover:to-orange-600',
      solid: '#EF4444',        // red-500
      light: '#FEE2E2',        // red-50
      lighter: '#FEF2F2',      // red-25
      text: '#DC2626',         // red-700
      textLight: '#EF4444',    // red-500
      border: '#FCA5A5',       // red-300
    },
    earth: {
      // 土 - Stability, Center, Balance
      gradient: 'bg-gradient-to-r from-yellow-600 to-amber-600',
      gradientHover: 'hover:from-yellow-700 hover:to-amber-700',
      solid: '#CA8A04',        // yellow-600
      light: '#FEF9C3',        // yellow-50
      lighter: '#FEFCE8',      // yellow-25
      text: '#A16207',         // yellow-700
      textLight: '#CA8A04',    // yellow-600
      border: '#FDE047',       // yellow-300
    },
    metal: {
      // 金 - Precision, Autumn, West
      gradient: 'bg-gradient-to-r from-slate-400 to-gray-400',
      gradientHover: 'hover:from-slate-500 hover:to-gray-500',
      solid: '#94A3B8',        // slate-400
      light: '#F1F5F9',        // slate-50
      lighter: '#F8FAFC',      // slate-25
      text: '#64748B',         // slate-600
      textLight: '#94A3B8',    // slate-400
      border: '#CBD5E1',       // slate-300
    },
    water: {
      // 水 - Wisdom, Winter, North
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      gradientHover: 'hover:from-blue-600 hover:to-cyan-600',
      solid: '#3B82F6',        // blue-500
      light: '#DBEAFE',        // blue-50
      lighter: '#EFF6FF',      // blue-25
      text: '#2563EB',         // blue-700
      textLight: '#3B82F6',    // blue-500
      border: '#93C5FD',       // blue-300
    },
  },

  // 상태 색상 (Status Colors)
  status: {
    success: {
      solid: '#00FFB3',        // aurora-green
      light: '#D1FAE5',        // green-50
      text: '#059669',         // green-600
      gradient: 'bg-gradient-to-r from-emerald-600 to-green-600',
    },
    warning: {
      solid: '#FFD700',        // star-gold
      light: '#FEF3C7',        // yellow-50
      text: '#D97706',         // yellow-700
      gradient: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    },
    error: {
      solid: '#FF4757',        // status-error
      light: '#FEE2E2',        // red-50
      text: '#DC2626',         // red-700
      gradient: 'bg-gradient-to-r from-red-600 to-rose-600',
    },
    info: {
      solid: '#4ECBFF',        // comet-cyan
      light: '#DBEAFE',        // blue-50
      text: '#2563EB',         // blue-700
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
  },

  // 우주 테마 (Cosmic Theme) - Special use cases
  cosmic: {
    space: {
      black: '#0A0E27',        // space-black
      dark: '#1A1F3A',         // space-dark
      navy: '#2D3561',         // space-navy
      midnight: '#151937',     // space-midnight
      deep: '#0D1226',         // space-deep
    },
    star: {
      gold: '#FFD700',         // star-gold
      silver: '#E8E8E8',       // star-silver
    },
    nebula: {
      pink: '#FF6EC7',         // nebula-pink
      blue: '#4ECBFF',         // nebula-blue
      purple: '#7B68EE',       // cosmic-purple
    },
    aurora: {
      green: '#00FFB3',        // aurora-green
    },
    comet: {
      cyan: '#00D9FF',         // comet-cyan
    },
  },

  // 행성 색상 (Planet Colors) - Mapped to 음양오행
  planets: {
    // 水 (Water)
    mercury: '#B8C5D6',
    uranus: '#4FD0E7',
    neptune: '#4169E1',

    // 金 (Metal)
    venus: '#FFD700',

    // 土 (Earth)
    earth: '#4169E1',
    saturn: '#DAA520',
    pluto: '#8B7355',

    // 火 (Fire)
    mars: '#DC143C',

    // 木 (Wood)
    jupiter: '#FF8C00',
  },

  // 태양 (Sun)
  sun: {
    yellow: '#FDB813',
    orange: '#FF6B35',
    core: '#FFE66D',
  },

  // 중립 색상 (Neutral Colors)
  neutral: {
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
} as const;

// ========================================
// Utility Styles - Pre-composed Classes
// ========================================

/**
 * 음양오행 배지 스타일 (Five Elements Badge Styles)
 * Replaces 4 duplicate definitions across the codebase
 *
 * Locations consolidated:
 * - globals.css (CSS variables)
 * - app/feed/page.tsx (inline styles)
 * - app/match/page.tsx (ELEMENT_COLORS constant)
 * - components/ui/button.tsx (already uses gradients)
 */
export const elementBadgeStyles = {
  木: {
    badge: 'text-amber-700 bg-amber-50 border-amber-200',
    bg: 'bg-amber-500',
    text: 'text-amber-700',
    icon: '木',
    label: '목(木)',
    color: colors.elements.wood.solid,
  },
  火: {
    badge: 'text-red-700 bg-red-50 border-red-200',
    bg: 'bg-red-500',
    text: 'text-red-700',
    icon: '火',
    label: '화(火)',
    color: colors.elements.fire.solid,
  },
  土: {
    badge: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    bg: 'bg-yellow-600',
    text: 'text-yellow-700',
    icon: '土',
    label: '토(土)',
    color: colors.elements.earth.solid,
  },
  金: {
    badge: 'text-slate-700 bg-slate-50 border-slate-200',
    bg: 'bg-slate-400',
    text: 'text-slate-700',
    icon: '金',
    label: '금(金)',
    color: colors.elements.metal.solid,
  },
  水: {
    badge: 'text-blue-700 bg-blue-50 border-blue-200',
    bg: 'bg-blue-500',
    text: 'text-blue-700',
    icon: '水',
    label: '수(水)',
    color: colors.elements.water.solid,
  },
} as const;

/**
 * Legacy string-only badge styles for backward compatibility
 * TODO: Migrate all usages to use elementBadgeStyles with .badge property
 */
export const elementBadgeClasses = {
  木: 'text-amber-700 bg-amber-50 border-amber-200',
  火: 'text-red-700 bg-red-50 border-red-200',
  土: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  金: 'text-slate-700 bg-slate-50 border-slate-200',
  水: 'text-blue-700 bg-blue-50 border-blue-200',
} as const;

/**
 * 음양오행 그라디언트 버튼 (Five Elements Gradient Buttons)
 * For use with Button component variants
 */
export const elementGradients = {
  木: colors.elements.wood.gradient,
  火: colors.elements.fire.gradient,
  土: colors.elements.earth.gradient,
  金: colors.elements.metal.gradient,
  水: colors.elements.water.gradient,
} as const;

/**
 * 음양오행 텍스트 색상 (Five Elements Text Colors)
 */
export const elementTextColors = {
  木: 'text-amber-600',
  火: 'text-red-600',
  土: 'text-yellow-600',
  金: 'text-slate-600',
  水: 'text-blue-600',
} as const;

/**
 * 음양오행 배경 색상 (Five Elements Background Colors)
 */
export const elementBackgroundColors = {
  木: 'bg-amber-50',
  火: 'bg-red-50',
  土: 'bg-yellow-50',
  金: 'bg-slate-50',
  水: 'bg-blue-50',
} as const;

// ========================================
// Type Definitions
// ========================================

export type ElementType = '木' | '火' | '土' | '金' | '水';
export type ElementKey = keyof typeof elementBadgeStyles;

// ========================================
// Helper Functions
// ========================================

/**
 * Get element badge style by element character
 * Returns the badge class string for backward compatibility
 */
export function getElementBadgeStyle(element: ElementType): string {
  const style = elementBadgeStyles[element] || elementBadgeStyles['木'];
  return style.badge;
}

/**
 * Get element gradient by element character
 */
export function getElementGradient(element: ElementType): string {
  return elementGradients[element] || elementGradients['木'];
}

/**
 * Get element text color by element character
 */
export function getElementTextColor(element: ElementType): string {
  return elementTextColors[element] || elementTextColors['木'];
}

/**
 * Get element background color by element character
 */
export function getElementBackgroundColor(element: ElementType): string {
  return elementBackgroundColors[element] || elementBackgroundColors['木'];
}

/**
 * Map English element name to Korean character
 */
export function mapElementToKorean(element: string): ElementType {
  const mapping: Record<string, ElementType> = {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水',
  };
  return mapping[element.toLowerCase()] || '木';
}

/**
 * Map Korean element character to English name
 */
export function mapElementToEnglish(element: ElementType): string {
  const mapping: Record<ElementType, string> = {
    木: 'wood',
    火: 'fire',
    土: 'earth',
    金: 'metal',
    水: 'water',
  };
  return mapping[element] || 'wood';
}
