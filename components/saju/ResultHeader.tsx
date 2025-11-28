/**
 * 사주 결과 페이지 헤더
 */

"use client";

import { CATEGORY_CONFIG } from "@/lib/types/saju-result";
import { FortuneCategory } from "@/lib/prompts";

interface ResultHeaderProps {
  name: string;
  category: FortuneCategory;
  calendarType: "solar" | "lunar";
  year: number;
  month: number;
  day: number;
  birthHour: string;
  gender: "male" | "female";
}

export function ResultHeader({
  name,
  category,
  calendarType,
  year,
  month,
  day,
  birthHour,
  gender,
}: ResultHeaderProps) {
  const config = CATEGORY_CONFIG[category];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Category Badge */}
        <div className="flex justify-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-full shadow-lg`}
          >
            <span className="text-2xl">{config.icon}</span>
            <span className="text-lg font-bold">{config.title}</span>
          </div>
        </div>

        {/* Name */}
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {name}님의 {config.title}
        </h1>

        {/* Birth Info */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">생년월일</span>
            <span className="text-sm">
              {year}년 {month}월 {day}일 ({calendarType === "solar" ? "☀️ 양력" : "🌙 음력"})
            </span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">출생시간</span>
            <span className="text-sm">{birthHour}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">성별</span>
            <span className="text-sm">{gender === "male" ? "남성" : "여성"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
