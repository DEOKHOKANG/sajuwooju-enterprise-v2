"use client";

import Link from "next/link";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function TodayFortune() {
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const formatted = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
    setTodayDate(formatted);
  }, []);

  // Mock fortune data
  const fortune = {
    summary: "오늘은 새로운 시작을 위한 좋은 날입니다. 긍정적인 에너지가 가득한 하루가 될 것입니다.",
    luckyColor: "보라색",
    luckyNumber: 7,
  };

  return (
    <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-yellow-400/20" />
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

      {/* Border */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-amber-200/50" />

      {/* Floating sparkles */}
      <Sparkles className="absolute top-4 right-4 w-5 h-5 text-amber-500 animate-pulse" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900">
              오늘의 운세
            </h3>
            {todayDate && (
              <p className="text-xs sm:text-sm text-gray-700 font-medium">{todayDate}</p>
            )}
          </div>
        </div>

        {/* Fortune content */}
        <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed mb-4">
          {fortune.summary}
        </p>

        {/* Lucky items */}
        <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm">
          <div className="px-3 py-1.5 bg-white/90 rounded-full shadow-sm">
            <span className="text-gray-900 font-medium">행운의 색:</span>{" "}
            <span className="font-bold text-purple-600">{fortune.luckyColor}</span>
          </div>
          <div className="px-3 py-1.5 bg-white/90 rounded-full shadow-sm">
            <span className="text-gray-900 font-medium">행운의 숫자:</span>{" "}
            <span className="font-bold text-amber-600">{fortune.luckyNumber}</span>
          </div>
        </div>

        {/* View detail link */}
        <Link href="/fortune/today">
          <div className="group inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors duration-300">
            <span>상세보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>
      </div>
    </div>
  );
}
