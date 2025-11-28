'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface HeroSlide {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
}

export function HeroSlider({
  slides,
  autoPlayInterval = 3000,
  pauseOnHover = true
}: HeroSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (!sliderRef.current || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      if (sliderRef.current) {
        const nextIndex = (currentIndex + 1) % slides.length;
        const container = sliderRef.current;
        const slideElements = Array.from(container.children) as HTMLElement[];

        if (slideElements[nextIndex]) {
          const slideElement = slideElements[nextIndex];
          const scrollLeft = slideElement.offsetLeft - container.offsetLeft;

          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }

        setCurrentIndex(nextIndex);
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, slides.length, currentIndex]);

  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const scrollLeft = container.scrollLeft;
    const slideElements = Array.from(container.children);

    let closestIndex = 0;
    let closestDistance = Infinity;

    slideElements.forEach((slide, index) => {
      const slideElement = slide as HTMLElement;
      const slideLeft = slideElement.offsetLeft - container.offsetLeft;
      const distance = Math.abs(scrollLeft - slideLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!sliderRef.current) return;

    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      const container = sliderRef.current;
      const slideElements = Array.from(container.children) as HTMLElement[];
      
      let nextIndex = currentIndex;
      
      if (swipeDistance > 0) {
        // Swipe left - next slide
        nextIndex = Math.min(currentIndex + 1, slides.length - 1);
      } else {
        // Swipe right - previous slide
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      if (nextIndex !== currentIndex && slideElements[nextIndex]) {
        const slideElement = slideElements[nextIndex];
        const scrollLeft = slideElement.offsetLeft - container.offsetLeft;

        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });

        setCurrentIndex(nextIndex);
      }
    }

    setIsPaused(false);
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="relative w-full">
      {/* 슬라이더 컨테이너 */}
      <div
        ref={sliderRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-3 sm:-mx-4 px-3 sm:px-4 touch-pan-x"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-center overflow-hidden relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            style={{
              maxWidth: '600px'
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
              priority={i === 0}
              className="object-cover w-full h-full"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 600px"
            />

            {/* 그라디언트 오버레이 (하단) */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
