/**
 * 사주 분석 로딩 화면 (상용화급)
 * 3D 행성 공전 애니메이션 + 프로그레스 바
 */

"use client";

import { useEffect, useState } from "react";
import { Sparkles, Stars } from "lucide-react";

interface AnalysisLoadingProps {
  progress: number; // 0-100
  estimatedTime?: number; // seconds
  userName?: string;
}

// 로딩 메시지 (순환)
const LOADING_MESSAGES = [
  "우주의 별들이 당신의 운명을 읽고 있습니다...",
  "천체의 움직임을 분석하고 있습니다...",
  "음양오행의 균형을 계산하고 있습니다...",
  "사주팔자를 해석하고 있습니다...",
  "AI가 당신의 운명을 풀어내고 있습니다...",
  "천간지지를 정렬하고 있습니다...",
  "오행의 조화를 살펴보고 있습니다...",
  "당신만의 우주 지도를 그리고 있습니다...",
];

export function AnalysisLoading({
  progress,
  estimatedTime = 30,
  userName,
}: AnalysisLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 메시지 순환 (3초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 경과 시간 카운터
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 남은 시간 계산
  const remainingTime = Math.max(0, estimatedTime - elapsedTime);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black relative overflow-hidden">
      {/* 별 배경 애니메이션 */}
      <div className="absolute inset-0">
        <StarField />
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* 3D 행성 공전 애니메이션 */}
        <div className="mb-12">
          <OrbitingPlanets progress={progress} />
        </div>

        {/* 사용자 이름 */}
        {userName && (
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            {userName}님의 사주를 분석하고 있습니다
          </h2>
        )}

        {/* 로딩 메시지 */}
        <div className="mb-8 h-16 flex items-center">
          <p className="text-purple-200 text-lg text-center animate-fadeIn">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full max-w-md mb-6">
          <CosmicProgressBar progress={progress} />
        </div>

        {/* 진행률 & 남은 시간 */}
        <div className="flex items-center gap-6 text-purple-300 text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{Math.round(progress)}% 완료</span>
          </div>
          {remainingTime > 0 && (
            <div className="flex items-center gap-2">
              <Stars className="w-4 h-4" />
              <span>약 {remainingTime}초 남음</span>
            </div>
          )}
        </div>

        {/* 힌트 메시지 */}
        <div className="mt-12 p-4 bg-purple-900/30 backdrop-blur-sm rounded-lg border border-purple-500/30 max-w-md">
          <p className="text-purple-200 text-sm text-center">
            💡 정확한 사주 분석을 위해 AI가 천체 데이터를 계산하고 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 별 배경 애니메이션 (50개 별)
 */
function StarField() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 행성 공전 애니메이션 (CSS 기반, 3D 없이)
 */
function OrbitingPlanets({ progress }: { progress: number }) {
  // 진행률에 따라 행성 개수 표시 (0-5개)
  const visiblePlanets = Math.min(5, Math.floor(progress / 20));

  const planets = [
    { name: "수성", color: "bg-gray-300", size: "w-3 h-3", orbit: 60, speed: 4 },
    { name: "금성", color: "bg-yellow-300", size: "w-4 h-4", orbit: 80, speed: 6 },
    { name: "지구", color: "bg-blue-400", size: "w-5 h-5", orbit: 100, speed: 8 },
    { name: "화성", color: "bg-red-500", size: "w-4 h-4", orbit: 120, speed: 10 },
    { name: "목성", color: "bg-orange-400", size: "w-6 h-6", orbit: 140, speed: 12 },
  ];

  return (
    <div className="relative w-80 h-80">
      {/* 태양 (중심) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-[0_0_30px_rgba(251,191,36,0.8)] animate-pulse" />
      </div>

      {/* 궤도 및 행성 */}
      {planets.slice(0, visiblePlanets).map((planet, index) => (
        <div key={planet.name} className="absolute inset-0">
          {/* 궤도 링 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/30"
            style={{
              width: `${planet.orbit * 2}px`,
              height: `${planet.orbit * 2}px`,
            }}
          />

          {/* 행성 */}
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              animation: `orbit ${planet.speed}s linear infinite`,
            }}
          >
            <div
              className={`${planet.size} ${planet.color} rounded-full shadow-lg`}
              style={{
                transform: `translateX(${planet.orbit}px) translateY(-50%)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 우주 테마 프로그레스 바
 */
function CosmicProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative">
      {/* 배경 */}
      <div className="h-3 bg-purple-950/50 rounded-full border border-purple-500/30 overflow-hidden backdrop-blur-sm">
        {/* 진행 바 */}
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 relative transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* 반짝이는 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* 진행률 숫자 (바 끝에 표시) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
        style={{ left: `${Math.max(0, progress - 5)}%` }}
      >
        <div className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-purple-600 animate-spin" />
        </div>
      </div>
    </div>
  );
}
