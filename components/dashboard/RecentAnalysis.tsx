"use client";

import Link from "next/link";
import { Clock, ArrowRight, ChevronRight } from "lucide-react";

interface AnalysisItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  gradient: string;
}

export function RecentAnalysis() {
  // Mock recent analysis data
  const recentItems: AnalysisItem[] = [
    {
      id: "1",
      title: "2025년 연애운",
      category: "연애운",
      date: "2025-11-08",
      summary: "새로운 인연이 다가올 시기입니다. 긍정적인 마음가짐이 중요합니다.",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      id: "2",
      title: "직장운세",
      category: "직업운",
      date: "2025-11-05",
      summary: "승진이나 새로운 기회가 찾아올 수 있는 좋은 시기입니다.",
      gradient: "from-violet-400 to-purple-500",
    },
    {
      id: "3",
      title: "재물운",
      category: "재물운",
      date: "2025-11-01",
      summary: "재물운이 상승하는 시기입니다. 투자는 신중하게 결정하세요.",
      gradient: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          최근 분석 내역
        </h2>
        <Link href="/my/consultations">
          <div className="group flex items-center gap-1 text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300">
            <span>전체보기</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </Link>
      </div>

      {/* Analysis Cards - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-0">
          {recentItems.map((item, index) => (
            <Link key={item.id} href={`/result/${item.id}`}>
              <div
                className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 overflow-hidden min-w-[280px] sm:min-w-0 group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20`}
                />
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

                {/* Border with gradient */}
                <div
                  className={`absolute inset-0 rounded-2xl sm:rounded-3xl border-2 bg-gradient-to-br ${item.gradient} opacity-30`}
                />

                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                />

                <div className="relative z-10 space-y-3">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full shadow-sm">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-br ${item.gradient}`}
                    />
                    <span className="text-xs font-bold text-gray-900">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-gray-800 font-medium line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Date and Arrow */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Empty State (hidden when there are items) */}
      {recentItems.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            아직 분석 내역이 없습니다
          </p>
          <Link href="/main">
            <button className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-shadow duration-300">
              첫 분석 시작하기
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
