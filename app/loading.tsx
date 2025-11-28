import { ProductCardSkeleton, CategoryIconSkeleton, HeroSliderSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-[600px] px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        {/* Hero Slider Skeleton */}
        <section className="py-4 sm:py-6 md:py-8">
          <HeroSliderSkeleton />
        </section>

        {/* Categories Skeleton */}
        <section className="py-4 sm:py-6 md:py-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-6 h-6 bg-muted rounded animate-shimmer" />
            <div className="h-6 w-24 bg-muted rounded animate-shimmer" />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(11)].map((_, i) => (
              <CategoryIconSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Products Skeleton */}
        <section className="py-4 sm:py-6 md:py-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-6 h-6 bg-muted rounded animate-shimmer" />
            <div className="h-6 w-32 bg-muted rounded animate-shimmer" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
