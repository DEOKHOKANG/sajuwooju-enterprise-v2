/**
 * Step 1: 카테고리 선택 컴포넌트
 */

"use client";

import { SAJU_CATEGORIES, SajuCategoryId } from "@/lib/saju-input-data";

interface CategorySelectorProps {
  value: SajuCategoryId | null;
  onChange: (category: SajuCategoryId) => void;
}

export function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">어떤 운세를 보시겠어요?</h2>
        <p className="text-gray-600">원하시는 분야를 선택해주세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAJU_CATEGORIES.map((category) => {
          const isSelected = value === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onChange(category.id)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                hover:scale-105 hover:shadow-xl
                ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 shadow-lg ring-4 ring-purple-100"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
              `}
            >
              {/* Element Badge */}
              <div className="absolute top-4 right-4 text-2xl opacity-30">
                {category.element}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-3">{category.icon}</div>

              {/* Title */}
              <h3
                className={`
                text-xl font-bold mb-2
                ${isSelected ? "text-purple-700" : "text-gray-900"}
              `}
              >
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600">{category.description}</p>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute bottom-4 right-4">
                  <div
                    className={`
                    w-6 h-6 rounded-full bg-gradient-to-r ${category.gradient}
                    flex items-center justify-center
                  `}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Category Info */}
      {value && (
        <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-center text-purple-700 font-medium">
            {SAJU_CATEGORIES.find((c) => c.id === value)?.name} 분석을 시작합니다
          </p>
        </div>
      )}
    </div>
  );
}
