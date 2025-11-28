/**
 * 사주 분석 로딩 애니메이션 (3D 행성 공전)
 */

"use client";

import { useEffect, useState } from "react";

interface LoadingAnimationProps {
  messages?: string[];
  duration?: number; // 각 메시지 표시 시간 (ms)
}

const defaultMessages = [
  "사주를 분석하고 있습니다...",
  "천간지지를 계산하는 중...",
  "오행의 균형을 확인하는 중...",
  "운세를 풀이하는 중...",
  "분석 결과를 정리하는 중...",
];

export function LoadingAnimation({
  messages = defaultMessages,
  duration = 2000,
}: LoadingAnimationProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, duration);

    return () => clearInterval(interval);
  }, [messages.length, duration]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* 3D 행성 공전 애니메이션 */}
      <div className="relative w-64 h-64 mb-12">
        {/* 중앙 태양 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl animate-pulse">
          <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-50 animate-ping" />
        </div>

        {/* 공전 궤도 1 (빠름) */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg" />
        </div>

        {/* 공전 궤도 2 (중간) */}
        <div className="absolute inset-4 animate-[spin_5s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-lg" />
        </div>

        {/* 공전 궤도 3 (느림) */}
        <div className="absolute inset-8 animate-[spin_7s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg" />
        </div>

        {/* 공전 궤도 4 (가장 느림) */}
        <div className="absolute inset-12 animate-[spin_9s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full shadow-lg" />
        </div>

        {/* 궤도 원 (장식용) */}
        <div className="absolute inset-0 border-2 border-purple-200 rounded-full opacity-30" />
        <div className="absolute inset-4 border-2 border-pink-200 rounded-full opacity-30" />
        <div className="absolute inset-8 border-2 border-blue-200 rounded-full opacity-30" />
        <div className="absolute inset-12 border-2 border-green-200 rounded-full opacity-30" />
      </div>

      {/* 로딩 메시지 */}
      <div className="text-center space-y-4 max-w-md px-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-fadeIn">
          {messages[currentMessageIndex]}
        </h2>

        {/* 프로그레스 바 */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
        </div>

        <p className="text-sm text-gray-500">
          잠시만 기다려주세요. 우주의 기운을 읽는 중입니다.
        </p>
      </div>

      {/* 떠다니는 별 효과 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
