"use client";

import { Calendar, MousePointerClick, Sparkles } from "lucide-react";

/**
 * Quick Start Guide
 * 3단계 빠른 시작 가이드 (상용화급)
 */

export function QuickStartGuide() {
  const steps = [
    {
      number: 1,
      icon: Calendar,
      title: "생년월일 입력",
      description: "양력/음력 선택",
      time: "10초",
      color: "from-blue-400 to-cyan-500",
    },
    {
      number: 2,
      icon: MousePointerClick,
      title: "카테고리 선택",
      description: "원하는 운세 선택",
      time: "5초",
      color: "from-purple-400 to-pink-500",
    },
    {
      number: 3,
      icon: Sparkles,
      title: "AI 분석 완료",
      description: "맞춤 결과 확인",
      time: "30초",
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4">
          <Sparkles className="w-4 h-4 text-star-gold" />
          <span className="text-sm font-bold text-gray-700">빠른 시작</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          💫 3단계로 시작하는 나의 운명
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          가입 불필요, 1분 이내 완료
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector Line (Desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0"></div>
              )}

              {/* Step Card */}
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group-hover:border-gray-200">
                {/* Step Number Badge */}
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg z-10`}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex justify-center mt-4 mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-3">
                  {step.description}
                </p>

                {/* Time Badge */}
                <div className="flex justify-center">
                  <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                    ⏱️ {step.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">총 소요시간</p>
              <p className="text-sm text-gray-600">1분 미만</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600 text-xl">100%</p>
            <p className="text-xs text-gray-600">무료 체험</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 text-center">
        <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-star-gold via-amber-500 to-star-gold text-space-black font-bold rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
          ✨ 지금 바로 시작하기
        </button>
      </div>
    </div>
  );
}
