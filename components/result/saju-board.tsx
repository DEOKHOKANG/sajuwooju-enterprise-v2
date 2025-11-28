/**
 * Saju Board Component
 * Phase 8.11: Display Four Pillars (사주팔자)
 */

'use client';

interface SajuPillar {
  heaven: string;
  earth: string;
}

interface SajuBoardProps {
  pillars: {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    time: SajuPillar;
  };
}

const ELEMENT_COLORS: Record<string, string> = {
  목: 'bg-green-100 text-green-800 border-green-300',
  화: 'bg-red-100 text-red-800 border-red-300',
  토: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  금: 'bg-gray-100 text-gray-800 border-gray-300',
  수: 'bg-blue-100 text-blue-800 border-blue-300',
};

const FIVE_ELEMENTS: Record<string, string> = {
  갑: '목', 을: '목',
  병: '화', 정: '화',
  무: '토', 기: '토',
  경: '금', 신: '금',
  임: '수', 계: '수',
  자: '수', 축: '토', 인: '목', 묘: '목', 진: '토', 사: '화',
  오: '화', 미: '토', 유: '금', 술: '토', 해: '수',
};

function getElementColor(char: string): string {
  const element = FIVE_ELEMENTS[char];
  return element ? ELEMENT_COLORS[element] : 'bg-gray-100 text-gray-800 border-gray-300';
}

function PillarCard({ title, pillar }: { title: string; pillar: SajuPillar }) {
  const heavenColor = getElementColor(pillar.heaven);
  const earthColor = getElementColor(pillar.earth);

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {/* Title */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-3">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>

        {/* Pillars */}
        <div className="p-4 space-y-3">
          {/* Heaven Stem (천간) */}
          <div>
            <div className="text-xs text-gray-500 mb-1 text-center">천간</div>
            <div
              className={`text-4xl font-bold text-center py-4 rounded-lg border-2 ${heavenColor}`}
            >
              {pillar.heaven}
            </div>
          </div>

          {/* Earth Branch (지지) */}
          <div>
            <div className="text-xs text-gray-500 mb-1 text-center">지지</div>
            <div
              className={`text-4xl font-bold text-center py-4 rounded-lg border-2 ${earthColor}`}
            >
              {pillar.earth}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SajuBoard({ pillars }: SajuBoardProps) {
  return (
    <div className="space-y-6">
      {/* Desktop View - Horizontal */}
      <div className="hidden md:flex gap-4">
        <PillarCard title="시주 (時柱)" pillar={pillars.time} />
        <PillarCard title="일주 (日柱)" pillar={pillars.day} />
        <PillarCard title="월주 (月柱)" pillar={pillars.month} />
        <PillarCard title="년주 (年柱)" pillar={pillars.year} />
      </div>

      {/* Mobile View - 2x2 Grid */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        <PillarCard title="년주" pillar={pillars.year} />
        <PillarCard title="월주" pillar={pillars.month} />
        <PillarCard title="일주" pillar={pillars.day} />
        <PillarCard title="시주" pillar={pillars.time} />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
          오행 (五行) 색상 구분
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-300"></div>
            <span className="text-sm text-gray-700">목 (木)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-300"></div>
            <span className="text-sm text-gray-700">화 (火)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-100 border-2 border-yellow-300"></div>
            <span className="text-sm text-gray-700">토 (土)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-100 border-2 border-gray-300"></div>
            <span className="text-sm text-gray-700">금 (金)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-sm text-gray-700">수 (水)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
