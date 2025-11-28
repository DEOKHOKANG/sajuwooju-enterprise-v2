'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * StatsSection Component
 * 통계 카운트업 섹션 with 우주 별 배경
 *
 * Features:
 * - 3가지 통계 카운트업 애니메이션
 * - IntersectionObserver로 viewport 진입 시 시작
 * - Glassmorphism 카드 디자인
 * - 별 배경 with twinkle animation
 */

interface StatItem {
  id: string;
  label: string;
  target: number;
  gradient: string;
  glowRgb: string;
}

const STATS: StatItem[] = [
  {
    id: 'wealth',
    label: '재물운',
    target: 127543,
    gradient: 'from-amber-500 to-orange-600',
    glowRgb: '245, 158, 11',
  },
  {
    id: 'compatibility',
    label: '궁합',
    target: 89267,
    gradient: 'from-pink-500 to-rose-600',
    glowRgb: '236, 72, 153',
  },
  {
    id: 'reunion',
    label: '재회운',
    target: 203891,
    gradient: 'from-violet-500 to-purple-600',
    glowRgb: '139, 92, 246',
  },
];

export function StatsSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{
      background: 'radial-gradient(ellipse at center, rgba(15, 15, 35, 1) 0%, rgba(0, 0, 0, 1) 100%)'
    }}>
      {/* Cosmic Stars Background */}
      <div className="absolute inset-0 z-0">
        {/* Large stars */}
        <div className="absolute top-[10%] left-[15%] w-2 h-2 bg-star-gold rounded-full animate-twinkle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[40%] left-[10%] w-1 h-1 bg-cosmic-purple rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[60%] right-[15%] w-2 h-2 bg-nebula-pink rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[80%] left-[25%] w-1.5 h-1.5 bg-star-gold rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />

        {/* Small stars */}
        <div className="absolute top-[15%] left-[40%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-[35%] right-[30%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-[55%] left-[60%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1.3s' }} />
        <div className="absolute top-[75%] right-[40%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1.8s' }} />
        <div className="absolute top-[25%] left-[80%] w-1 h-1 bg-cosmic-purple rounded-full animate-twinkle" style={{ animationDelay: '2.3s' }} />
        <div className="absolute top-[45%] right-[70%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2.8s' }} />
        <div className="absolute top-[65%] left-[50%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '3.3s' }} />
        <div className="absolute top-[85%] right-[60%] w-1 h-1 bg-star-gold rounded-full animate-twinkle" style={{ animationDelay: '3.8s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            많은 분들이 경험하셨습니다
          </h2>
          <p className="text-lg text-white/80">
            AI가 분석한 정확한 사주 운세
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STATS.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * StatCard Component
 * 개별 통계 카드 with countup animation
 */
interface StatCardProps {
  stat: StatItem;
}

function StatCard({ stat }: StatCardProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for triggering countup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Countup animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const increment = stat.target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.target) {
        setCount(stat.target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, stat.target]);

  return (
    <div
      ref={cardRef}
      className="stat-card group"
    >
      {/* Card Background with Glassmorphism */}
      <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Number */}
          <div
            className={`text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
          >
            {count.toLocaleString()}
            {isVisible && count === stat.target && '+'}
          </div>

          {/* Label */}
          <div className="text-xl text-slate-300 font-medium">{stat.label}</div>
        </div>

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}
