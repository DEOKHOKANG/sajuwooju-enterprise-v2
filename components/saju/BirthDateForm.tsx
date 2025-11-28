/**
 * Step 3: 생년월일 입력 컴포넌트 (상용화급)
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema } from "@/lib/validation/saju-input";
import { z } from "zod";
import { useState, useEffect } from "react";

type BirthDateData = z.infer<typeof step3Schema>;

interface BirthDateFormProps {
  value: BirthDateData | null;
  onChange: (data: BirthDateData) => void;
  onNext: () => void;
}

export function BirthDateForm({ value, onChange, onNext }: BirthDateFormProps) {
  const currentYear = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BirthDateData>({
    resolver: zodResolver(step3Schema),
    defaultValues: value || {
      calendarType: "solar",
      year: 0,
      month: 0,
      day: 0,
    },
  });

  const onSubmit = (data: BirthDateData) => {
    onChange(data);
    onNext();
  };

  const calendarType = watch("calendarType");
  const selectedYear = watch("year");
  const selectedMonth = watch("month");
  const selectedDay = watch("day");

  // 월별 일수 계산 (윤년 고려)
  const getDaysInMonth = (year: number, month: number): number => {
    if (!year || !month) return 31;

    if (month === 2) {
      // 윤년 계산
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      return isLeapYear ? 29 : 28;
    }

    if ([4, 6, 9, 11].includes(month)) {
      return 30;
    }

    return 31;
  };

  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 월이 변경되면 일자가 유효한지 확인하고 조정
  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setValue("day", daysInMonth);
    }
  }, [selectedMonth, selectedYear, selectedDay, daysInMonth, setValue]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">생년월일을 알려주세요</h2>
        <p className="text-gray-600">정확한 분석을 위해 필요합니다</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Calendar Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border-2 border-gray-200 p-1 bg-white">
            <button
              type="button"
              onClick={() => setValue("calendarType", "solar")}
              className={`
                px-6 py-2 rounded-md transition-all font-medium
                ${
                  calendarType === "solar"
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              ☀️ 양력
            </button>
            <button
              type="button"
              onClick={() => setValue("calendarType", "lunar")}
              className={`
                px-6 py-2 rounded-md transition-all font-medium
                ${
                  calendarType === "lunar"
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              🌙 음력
            </button>
          </div>
        </div>

        {/* 양력/음력 설명 */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            {calendarType === "solar" ? (
              <>
                <span className="font-semibold">양력:</span> 일반적으로 사용하는 생일 (주민등록상 생년월일)
              </>
            ) : (
              <>
                <span className="font-semibold">음력:</span> 전통적인 음력 생일 (설날, 추석 등을 기준으로 하는 달력)
              </>
            )}
          </p>
        </div>

        {/* Date Selectors */}
        <div className="grid grid-cols-3 gap-3">
          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              년도
            </label>
            <select
              id="year"
              {...register("year", { valueAsNumber: true })}
              className={`
                w-full px-3 py-3 rounded-lg border-2 transition-colors
                ${
                  errors.year
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-200 focus:border-purple-500"
                }
                focus:outline-none focus:ring-4
                ${errors.year ? "focus:ring-red-100" : "focus:ring-purple-100"}
              `}
            >
              <option value={0}>선택</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
            {errors.year && (
              <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>
            )}
          </div>

          {/* Month */}
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              월
            </label>
            <select
              id="month"
              {...register("month", { valueAsNumber: true })}
              className={`
                w-full px-3 py-3 rounded-lg border-2 transition-colors
                ${
                  errors.month
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-200 focus:border-purple-500"
                }
                focus:outline-none focus:ring-4
                ${errors.month ? "focus:ring-red-100" : "focus:ring-purple-100"}
              `}
            >
              <option value={0}>선택</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
            {errors.month && (
              <p className="mt-1 text-xs text-red-600">{errors.month.message}</p>
            )}
          </div>

          {/* Day */}
          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">
              일
            </label>
            <select
              id="day"
              {...register("day", { valueAsNumber: true })}
              disabled={!selectedYear || !selectedMonth}
              className={`
                w-full px-3 py-3 rounded-lg border-2 transition-colors
                ${
                  errors.day
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-200 focus:border-purple-500"
                }
                focus:outline-none focus:ring-4
                ${errors.day ? "focus:ring-red-100" : "focus:ring-purple-100"}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <option value={0}>선택</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}일
                </option>
              ))}
            </select>
            {errors.day && (
              <p className="mt-1 text-xs text-red-600">{errors.day.message}</p>
            )}
          </div>
        </div>

        {/* Hidden input for calendarType validation */}
        <input type="hidden" {...register("calendarType")} />

        {/* Selected Date Display */}
        {selectedYear > 0 && selectedMonth > 0 && selectedDay > 0 && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <p className="text-purple-700 font-semibold text-lg">
                {selectedYear}년 {selectedMonth}월 {selectedDay}일
              </p>
              <p className="text-purple-600 text-sm mt-1">
                {calendarType === "solar" ? "☀️ 양력" : "🌙 음력"}
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          다음 단계로
        </button>
      </form>
    </div>
  );
}
