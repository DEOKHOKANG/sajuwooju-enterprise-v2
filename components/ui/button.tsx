/**
 * Button Component - 사주우주 디자인 시스템
 *
 * Production-Grade Button with 사주우주 Design System
 * - 11 variants including Element-based (음양오행)
 * - 5 sizes (xs to xl)
 * - Loading state with spinner
 * - Icon support (left/right)
 * - Full accessibility (ARIA, keyboard)
 *
 * Usage:
 * ```tsx
 * <Button variant="primary" size="lg">사주 분석 시작</Button>
 * <Button variant="wood" size="sm">木 운세보기</Button>
 * <Button variant="secondary" leftIcon={<Filter />}>필터</Button>
 * <Button variant="ghost" size="icon"><X /></Button>
 * ```
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]",
  {
    variants: {
      variant: {
        // Primary Actions (주요 액션)
        primary:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40",

        // Secondary Actions (보조 액션)
        secondary:
          "bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800",

        // Outline (외곽선)
        outline:
          "border-2 border-purple-300 text-purple-700 bg-white hover:bg-purple-50 hover:border-purple-400",

        // Ghost (투명)
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900",

        // Destructive (위험 액션)
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40",

        // Success (성공 액션)
        success:
          "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40",

        // Element-based variants (음양오행)
        wood:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30",
        fire:
          "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/30",
        earth:
          "bg-gradient-to-r from-yellow-600 to-amber-600 text-white hover:from-yellow-700 hover:to-amber-700 shadow-lg shadow-yellow-500/30",
        metal:
          "bg-gradient-to-r from-slate-400 to-gray-400 text-white hover:from-slate-500 hover:to-gray-500 shadow-lg shadow-slate-500/30",
        water:
          "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30",
      },
      size: {
        xs: "h-8 px-3 text-xs rounded-md",
        sm: "h-9 px-4 text-sm rounded-md",
        md: "h-10 px-6 text-base",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-xl rounded-xl",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && leftIcon}
        {children}
        {!isLoading && rightIcon && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
