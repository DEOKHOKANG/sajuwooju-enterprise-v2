"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, Heart, Calendar } from "lucide-react";

/**
 * Personalized Recommendations
 * 개인화 추천 섹션 (생년월일 기반)
 */

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  gradient: string;
  reason: string;
}

export function PersonalizedRecommendations() {
  const [hasUserData, setHasUserData] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    // Check if user entered birth date
    const storedBirthDate = localStorage.getItem("userBirthDate");
    if (storedBirthDate) {
      setHasUserData(true);
      setBirthDate(storedBirthDate);
      generateRecommendations(storedBirthDate);
    } else {
      // Show default recommendations
      setRecommendations(DEFAULT_RECOMMENDATIONS);
    }
  }, []);

  const generateRecommendations = (birthDateStr: string) => {
    // Simple zodiac/element based recommendations
    const year = parseInt(birthDateStr.split("-")[0]);
    const zodiacIndex = year % 12;
    const zodiacs = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
    const userZodiac = zodiacs[zodiacIndex];

    // Generate personalized recommendations
    const personalizedRecs: Recommendation[] = [
      {
        id: "love",
        title: `${userZodiac}띠 연애운`,
        description: `${userZodiac}띠에게 딱 맞는 연애 조언`,
        icon: "💕",
        href: "/category/3",
        gradient: "from-pink-400 to-rose-500",
        reason: `${userZodiac}띠 맞춤`,
      },
      {
        id: "wealth",
        title: "오늘의 재물운",
        description: "당신의 금전 운세 확인",
        icon: "💰",
        href: "/category/6",
        gradient: "from-green-400 to-emerald-500",
        reason: "인기 급상승",
      },
      {
        id: "match",
        title: "궁합 매칭",
        description: `${userZodiac}띠와 잘 맞는 띠 찾기`,
        icon: "❤️",
        href: "/match",
        gradient: "from-red-400 to-pink-500",
        reason: "추천",
      },
    ];

    setRecommendations(personalizedRecs);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-star-gold" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {hasUserData ? "맞춤 추천" : "인기 추천"}
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            {hasUserData
              ? "당신을 위한 특별한 운세"
              : "가장 많이 찾는 운세를 먼저 확인하세요"}
          </p>
        </div>
        {hasUserData && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-md text-xs font-medium text-gray-700">
            <Calendar className="w-3.5 h-3.5" />
            <span>{birthDate.split("-")[0]}년생</span>
          </div>
        )}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {recommendations.map((rec, index) => (
          <Link key={rec.id} href={rec.href}>
            <div
              className="group relative bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-gray-200 cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${rec.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
              ></div>

              {/* Reason badge */}
              {rec.reason && (
                <div className="absolute top-3 right-3">
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${rec.gradient} shadow-lg`}>
                    {rec.reason}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  {rec.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {rec.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {rec.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-medium text-cosmic-purple group-hover:text-nebula-pink transition-colors">
                  <span>자세히 보기</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Today's Popular */}
      <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">오늘의 인기</p>
              <p className="text-xs text-gray-600">실시간 조회수 기준</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-bold text-amber-600">1위</span>
            <span>연애운</span>
            <span className="text-amber-600">🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default recommendations for users without birth date
const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "love",
    title: "연애운",
    description: "오늘의 사랑 운세 확인하기",
    icon: "💕",
    href: "/category/3",
    gradient: "from-pink-400 to-rose-500",
    reason: "인기 1위",
  },
  {
    id: "wealth",
    title: "재물운",
    description: "금전 운세와 재테크 조언",
    icon: "💰",
    href: "/category/6",
    gradient: "from-green-400 to-emerald-500",
    reason: "급상승",
  },
  {
    id: "match",
    title: "궁합",
    description: "운명적인 인연 찾기",
    icon: "❤️",
    href: "/match",
    gradient: "from-red-400 to-pink-500",
    reason: "추천",
  },
];
