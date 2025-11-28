/**
 * 사주우주 디자인 토큰 시스템
 *
 * 이 파일은 디자인 시스템의 핵심 토큰들을 정의합니다.
 * Tailwind Config와 함께 사용되어 일관된 디자인을 유지합니다.
 */

export const colors = {
  // Primary - 주 색상 (우드/그린 계열)
  primary: {
    DEFAULT: "#14B856",
    50: "#E8F9EF",
    100: "#D1F3DF",
    200: "#A3E7BF",
    300: "#75DB9F",
    400: "#47CF7F",
    500: "#14B856",
    600: "#109345",
    700: "#0C6E34",
    800: "#084923",
    900: "#042412",
  },

  // Secondary - 보조 색상 (파이어/레드 계열)
  secondary: {
    DEFAULT: "#FF5D5D",
    50: "#FFE5E5",
    100: "#FFCCCC",
    200: "#FF9999",
    300: "#FF6666",
    400: "#FF5D5D",
    500: "#FF3333",
    600: "#CC0000",
    700: "#990000",
    800: "#660000",
    900: "#330000",
  },

  // Success
  success: {
    DEFAULT: "rgba(23, 219, 78, 1)",
    light: "rgba(23, 219, 78, 0.1)",
    dark: "rgba(18, 175, 62, 1)",
  },

  // Destructive
  destructive: {
    DEFAULT: "rgba(255, 0, 0, 1)",
    light: "rgba(255, 0, 0, 0.1)",
    dark: "rgba(204, 0, 0, 1)",
  },

  // Neutral (그레이스케일)
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
} as const;

export const spacing = {
  xs: "0.25rem",    // 4px
  sm: "0.5rem",     // 8px
  md: "1rem",       // 16px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
  "2xl": "3rem",    // 48px
  "3xl": "4rem",    // 64px
  "4xl": "6rem",    // 96px
} as const;

export const typography = {
  fontFamily: {
    sans: ["var(--font-pretendard)", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "sans-serif"],
    display: ["var(--font-ownglyph)", "Ownglyph Saehayan", "serif"],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],        // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }],    // 14px
    base: ["1rem", { lineHeight: "1.5rem" }],       // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }],    // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }],     // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],      // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],   // 36px
    "5xl": ["3rem", { lineHeight: "1" }],           // 48px
    "6xl": ["3.75rem", { lineHeight: "1" }],        // 60px
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const borderRadius = {
  none: "0",
  sm: "0.25rem",   // 4px
  DEFAULT: "0.5rem", // 8px
  md: "0.5rem",    // 8px
  lg: "0.75rem",   // 12px
  xl: "1rem",      // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const animations = {
  // 타이핑 효과
  typing: {
    duration: "4s",
    timingFunction: "steps(60, end)",
    delay: "0.5s",
  },
  // 페이드 인
  fadeIn: {
    duration: "0.3s",
    timingFunction: "ease-in",
  },
  // 슬라이드 업
  slideUp: {
    duration: "0.4s",
    timingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;
