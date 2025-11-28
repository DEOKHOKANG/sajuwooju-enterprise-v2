"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Calendar } from "lucide-react";

/**
 * Birth Date Quick Modal
 * 첫 방문자 생년월일 입력 모달 (상용화급)
 */

interface BirthDateQuickModalProps {
  onComplete: (birthDate: string, calendarType: "solar" | "lunar") => void;
}

export function BirthDateQuickModal({ onComplete }: BirthDateQuickModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");

  useEffect(() => {
    // 쿠키 체크: 이미 입력한 적 있는지 확인
    const hasVisited = localStorage.getItem("hasEnteredBirthDate");
    if (!hasVisited) {
      // 3초 후 모달 표시 (자연스러운 타이밍)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = () => {
    if (!year || !month || !day) {
      alert("생년월일을 모두 입력해주세요");
      return;
    }

    const birthDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    localStorage.setItem("hasEnteredBirthDate", "true");
    localStorage.setItem("userBirthDate", birthDate);
    localStorage.setItem("userCalendarType", calendarType);

    onComplete(birthDate, calendarType);
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem("hasEnteredBirthDate", "skipped");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-cosmic-purple to-nebula-pink p-6 text-white relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <button
              onClick={handleSkip}
              className="absolute top-0 right-0 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-2">
              🎯 나에게 맞는 운세 추천 받기
            </h2>
            <p className="text-center text-sm text-white/90">
              생년월일을 입력하면 맞춤 운세를 추천해드려요
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Calendar Type Toggle */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCalendarType("solar")}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                calendarType === "solar"
                  ? "bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              양력
            </button>
            <button
              onClick={() => setCalendarType("lunar")}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                calendarType === "lunar"
                  ? "bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              음력
            </button>
          </div>

          {/* Date Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  년도
                </label>
                <input
                  type="number"
                  placeholder="1990"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-all outline-none text-center font-semibold"
                  min="1900"
                  max="2024"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  월
                </label>
                <input
                  type="number"
                  placeholder="01"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-all outline-none text-center font-semibold"
                  min="1"
                  max="12"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  일
                </label>
                <input
                  type="number"
                  placeholder="01"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-all outline-none text-center font-semibold"
                  min="1"
                  max="31"
                />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 bg-cosmic-purple rounded-full"></div>
              <span className="font-medium">맞춤 운세 추천</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 bg-nebula-pink rounded-full"></div>
              <span className="font-medium">오늘의 운세 미리보기</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 bg-star-gold rounded-full"></div>
              <span className="font-medium">궁합 좋은 띠 확인</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white font-bold rounded-xl hover:shadow-xl transition-all active:scale-98"
            >
              ✨ 1분만에 시작하기
            </button>
            <button
              onClick={handleSkip}
              className="w-full py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
            >
              나중에 할게요
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center">
            💡 입력하신 정보는 맞춤 추천에만 사용되며 안전하게 보관됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
