/**
 * 사주팔자 시각화 컴포넌트 (상용화급)
 * 천간지지 (年月日時) 표시
 * 부드러운 애니메이션과 인터랙티브 효과
 */

"use client";

import { useState } from "react";
import { SajuGanZhi, getGanWuXing, getZhiWuXing } from "@/lib/lunar-calendar";

interface SajuBoardProps {
  ganZhi: SajuGanZhi;
}

// 오행 색상 매핑
const WU_XING_COLORS: { [key: string]: { bg: string; text: string; glow: string } } = {
  木: { bg: "bg-emerald-500", text: "text-emerald-100", glow: "shadow-emerald-400/50" },
  火: { bg: "bg-red-500", text: "text-red-100", glow: "shadow-red-400/50" },
  土: { bg: "bg-amber-500", text: "text-amber-100", glow: "shadow-amber-400/50" },
  金: { bg: "bg-yellow-400", text: "text-yellow-900", glow: "shadow-yellow-400/50" },
  水: { bg: "bg-blue-500", text: "text-blue-100", glow: "shadow-blue-400/50" },
};

export function SajuBoard({ ganZhi }: SajuBoardProps) {
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);

  const pillars = [
    {
      title: "時柱",
      subtitle: "시주",
      gan: ganZhi.hourGan,
      zhi: ganZhi.hourZhi,
      ganZhiString: ganZhi.hour,
      description: "출생한 시각의 기운",
    },
    {
      title: "日柱",
      subtitle: "일주",
      gan: ganZhi.dayGan,
      zhi: ganZhi.dayZhi,
      ganZhiString: ganZhi.day,
      description: "자신의 본질과 성격",
    },
    {
      title: "月柱",
      subtitle: "월주",
      gan: ganZhi.monthGan,
      zhi: ganZhi.monthZhi,
      ganZhiString: ganZhi.month,
      description: "부모와 청년기",
    },
    {
      title: "年柱",
      subtitle: "연주",
      gan: ganZhi.yearGan,
      zhi: ganZhi.yearZhi,
      ganZhiString: ganZhi.year,
      description: "조상과 노년기",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* 제목 */}
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          사주팔자
        </h2>
        <p className="text-gray-600 text-sm md:text-base">당신의 천간지지 (天干地支)</p>
      </div>

      {/* 사주판 */}
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-amber-200 transition-all duration-500 hover:shadow-3xl">
        {/* 장식 코너 - 애니메이션 */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-lg animate-pulse" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-lg animate-pulse" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-lg animate-pulse" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-lg animate-pulse" />

        {/* 네 기둥 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
              onMouseEnter={() => setHoveredPillar(pillar.title)}
              onMouseLeave={() => setHoveredPillar(null)}
            >
              <PillarColumn pillar={pillar} isHovered={hoveredPillar === pillar.title} />
            </div>
          ))}
        </div>

        {/* 띠 정보 - 애니메이션 */}
        <div className="mt-8 pt-6 border-t-2 border-amber-200 animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
          <div className="text-center">
            <span className="text-gray-600 text-sm">띠 (生肖)</span>
            <div className="text-3xl font-bold text-amber-900 mt-1 transition-transform hover:scale-110">
              {ganZhi.zodiac}
            </div>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {Object.entries(WU_XING_COLORS).map(([element, colors]) => (
          <div
            key={element}
            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-200"
          >
            <div className={`w-4 h-4 rounded-full ${colors.bg}`} />
            <span className="text-sm font-medium text-gray-700">{element}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 기둥 컬럼 (年/月/日/時)
 */
function PillarColumn({
  pillar,
  isHovered,
}: {
  pillar: {
    title: string;
    subtitle: string;
    gan: string;
    zhi: string;
    ganZhiString: string;
    description: string;
  };
  isHovered: boolean;
}) {
  const ganWuXing = getGanWuXing(pillar.gan);
  const zhiWuXing = getZhiWuXing(pillar.zhi);

  const ganColor = WU_XING_COLORS[ganWuXing] || WU_XING_COLORS["土"];
  const zhiColor = WU_XING_COLORS[zhiWuXing] || WU_XING_COLORS["土"];

  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${isHovered ? "scale-105" : ""}`}>
      {/* 제목 (時柱, 日柱, etc) */}
      <div className="text-center mb-3">
        <div className="text-lg md:text-xl font-bold text-gray-800">{pillar.title}</div>
        <div className="text-xs text-gray-500">{pillar.subtitle}</div>
        {isHovered && (
          <div className="text-xs text-purple-600 mt-1 animate-fade-in">
            {pillar.description}
          </div>
        )}
      </div>

      {/* 천간 (위) */}
      <div className="w-full mb-2">
        <div
          className={`
            relative group
            ${ganColor.bg} ${ganColor.text}
            rounded-xl p-4 md:p-6
            shadow-lg ${ganColor.glow} hover:shadow-2xl
            transition-all duration-300
            hover:scale-105
            cursor-pointer
          `}
        >
          <div className="text-3xl md:text-4xl font-bold text-center">{pillar.gan}</div>
          <div className="text-xs text-center mt-2 opacity-80">天干</div>

          {/* 호버 툴팁 */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {ganWuXing} 기운
          </div>
        </div>
      </div>

      {/* 지지 (아래) */}
      <div className="w-full">
        <div
          className={`
            relative group
            ${zhiColor.bg} ${zhiColor.text}
            rounded-xl p-4 md:p-6
            shadow-lg ${zhiColor.glow} hover:shadow-2xl
            transition-all duration-300
            hover:scale-105
            cursor-pointer
          `}
        >
          <div className="text-3xl md:text-4xl font-bold text-center">{pillar.zhi}</div>
          <div className="text-xs text-center mt-2 opacity-80">地支</div>

          {/* 호버 툴팁 */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {zhiWuXing} 기운
          </div>
        </div>
      </div>
    </div>
  );
}
