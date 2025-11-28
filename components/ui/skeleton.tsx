'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'circle';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const variantClasses = {
    default: 'h-4 w-full',
    card: 'h-48 w-full',
    text: 'h-4 w-3/4',
    circle: 'h-12 w-12 rounded-full'
  };

  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] rounded-md',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-muted-100 p-3 sm:p-4" style={{ borderRadius: '16px' }}>
      <div className="flex gap-3 sm:gap-4">
        <Skeleton variant="circle" className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Category Icon Skeleton
export function CategoryIconSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <Skeleton variant="circle" className="w-12 h-12 sm:w-14 sm:h-14" />
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

// Hero Slider Skeleton
export function HeroSliderSkeleton() {
  return (
    <Skeleton className="w-full h-32 sm:h-40 rounded-2xl" />
  );
}
