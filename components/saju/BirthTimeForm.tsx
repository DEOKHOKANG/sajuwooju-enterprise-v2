/**
 * Step 4: 출생 시간 입력 컴포넌트 (상용화급)
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema } from "@/lib/validation/saju-input";
import { BIRTH_HOURS } from "@/lib/saju-input-data";
import { z } from "zod";
import { useState } from "react";
import { Clock, HelpCircle } from "lucide-react";

type BirthTimeData = z.infer<typeof step4Schema>;

interface BirthTimeFormProps {
  value: BirthTimeData | null;
  onChange: (data: BirthTimeData) => void;
  onSubmit: () => void;
}

export function BirthTimeForm({ value, onChange, onSubmit }: BirthTimeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BirthTimeData>({
    resolver: zodResolver(step4Schema),
    defaultValues: value || {
      birthHour: "",
    },
  });

  const selectedBirthHour = watch("birthHour");
  const [showGuide, setShowGuide] = useState(false);

  const onFormSubmit = (data: BirthTimeData) => {
    onChange(data);
    onSubmit();
  };

  // 선택한 시간대 정보 가져오기
  const selectedTimeInfo = BIRTH_HOURS.find((t) => t.value === selectedBirthHour);

  // 시간대별 그라디언트 색상 (12지지에 맞춤)
  const getTimeGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-indigo-600", // 자시 (子) - 밤
      "from-indigo-600 to-purple-700", // 축시 (丑) - 깊은 밤
      "from-purple-700 to-pink-700", // 인시 (寅) - 새벽
      "from-pink-600 to-rose-500", // 묘시 (卯) - 일출
      "from-orange-400 to-amber-500", // 진시 (辰) - 아침
      "from-amber-400 to-yellow-400", // 사시 (巳) - 오전
      "from-yellow-400 to-orange-300", // 오시 (午) - 정오
      "from-orange-300 to-amber-400", // 미시 (未) - 오후
      "from-amber-500 to-orange-500", // 신시 (申) - 늦은 오후
      "from-orange-600 to-red-600", // 유시 (酉) - 일몰
      "from-purple-600 to-indigo-700", // 술시 (戌) - 초저녁
      "from-indigo-700 to-blue-800", // 해시 (亥) - 밤
      "from-gray-400 to-gray-500", // 모름
    ];
    return gradients[index] || "from-gray-400 to-gray-500";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">출생 시간을 선택해주세요</h2>
        <p className="text-gray-600">12지지 시간대를 선택하면 정확한 사주를 확인할 수 있습니다</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* 안내 메시지 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">12지지 시간대란?</p>
            <p>
              전통 사주명리학에서 사용하는 시간 구분법입니다. 하루를 12개의 시(時)로 나누어
              각 시간대마다 고유한 의미를 부여합니다.
            </p>
          </div>
        </div>

        {/* 시간대 선택 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BIRTH_HOURS.map((timeSlot, index) => {
            const isSelected = selectedBirthHour === timeSlot.value;
            const isUnknown = timeSlot.value === "unknown";

            return (
              <button
                key={timeSlot.value}
                type="button"
                onClick={() => setValue("birthHour", timeSlot.value)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 ring-4 ring-purple-100 scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }
                  ${isUnknown ? "col-span-2 sm:col-span-3" : ""}
                `}
              >
                {/* 지지 한자 */}
                <div
                  className={`
                    text-3xl font-bold mb-1 bg-gradient-to-r ${getTimeGradient(
                      index
                    )} bg-clip-text text-transparent
                  `}
                >
                  {timeSlot.jiji}
                </div>

                {/* 시간대 이름 */}
                <div className={`font-semibold text-sm ${isSelected ? "text-purple-700" : "text-gray-900"}`}>
                  {timeSlot.label.split("(")[0].trim()}
                </div>

                {/* 시간 범위 */}
                <div className="text-xs text-gray-500 mt-1">
                  {timeSlot.label.match(/\(([^)]+)\)/)?.[1] || ""}
                </div>

                {/* 선택 표시 */}
                {isSelected && !isUnknown && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
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

                {/* 모름 옵션 특별 아이콘 */}
                {isUnknown && (
                  <HelpCircle
                    className={`w-6 h-6 ${isSelected ? "text-purple-600" : "text-gray-400"} mx-auto mt-2`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Hidden input for validation */}
        <input type="hidden" {...register("birthHour")} />

        {/* 에러 메시지 */}
        {errors.birthHour && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-600 text-center">{errors.birthHour.message}</p>
          </div>
        )}

        {/* 선택한 시간대 정보 */}
        {selectedTimeInfo && (
          <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center gap-4">
              <div className={`text-5xl bg-gradient-to-r ${getTimeGradient(
                BIRTH_HOURS.findIndex((t) => t.value === selectedBirthHour)
              )} bg-clip-text text-transparent font-bold`}>
                {selectedTimeInfo.jiji}
              </div>
              <div className="flex-1">
                <p className="text-purple-900 font-bold text-lg">{selectedTimeInfo.label}</p>
                {selectedTimeInfo.value !== "unknown" && (
                  <p className="text-purple-700 text-sm mt-1">
                    이 시간대에 태어나신 분의 사주를 분석합니다
                  </p>
                )}
                {selectedTimeInfo.value === "unknown" && (
                  <p className="text-gray-600 text-sm mt-1">
                    정확한 시간을 모를 경우 정오(午時)를 기준으로 분석합니다
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 시간대 참고 토글 */}
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="w-full py-3 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
        >
          <Clock className="w-5 h-5" />
          {showGuide ? "시간대 설명 닫기" : "시간대 상세 설명 보기"}
        </button>

        {/* 시간대 상세 설명 */}
        {showGuide && (
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-3 max-h-80 overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-3">12지지 시간대 상세 설명</h3>
            {BIRTH_HOURS.filter((t) => t.value !== "unknown").map((timeSlot, index) => (
              <div
                key={timeSlot.value}
                className="p-3 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl font-bold bg-gradient-to-r ${getTimeGradient(
                      index
                    )} bg-clip-text text-transparent`}
                  >
                    {timeSlot.jiji}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{timeSlot.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      이 시간대를 선택하세요
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedBirthHour}
          className={`
            w-full py-4 font-semibold rounded-lg transition-all shadow-lg
            ${
              selectedBirthHour
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-xl transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {selectedBirthHour ? "분석 시작하기" : "시간대를 선택해주세요"}
        </button>
      </form>
    </div>
  );
}
