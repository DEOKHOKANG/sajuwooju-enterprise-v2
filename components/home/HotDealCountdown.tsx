"use client";

import { useState, useEffect } from "react";
import { Clock, Flame, Zap } from "lucide-react";
import Link from "next/link";

interface HotDealCountdownProps {
  title: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
  productId: number;
  endTime?: Date;
}

/**
 * HotDealCountdown Component
 * 긴급 핫딜 카운트다운 배너
 * - 실시간 타이머
 * - 할인율 강조
 * - 긴박감 조성
 */
export function HotDealCountdown({
  title,
  originalPrice,
  discountPrice,
  discountRate,
  productId,
  endTime = new Date(Date.now() + 2 * 60 * 60 * 1000), // 기본 2시간
}: HotDealCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <Link href={`/products/${productId}`}>
      <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 p-[2px] cursor-pointer hover:scale-[1.01] transition-all duration-300 shadow-xl hover:shadow-2xl">
        {/* Inner content */}
        <div className="relative bg-gradient-to-br from-red-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-5">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-pink-400/10 to-purple-400/10 animate-pulse" />

          {/* Flame decoration */}
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-2xl opacity-50 animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: "0.5s" }} />

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Hot Deal Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg animate-bounce">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
              <span className="text-white font-bold text-xs sm:text-sm">🔥 긴급 핫딜</span>
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight text-center">
              {title}
            </h3>

            {/* Price */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1 bg-red-500 rounded-full">
                  <span className="text-white font-bold text-base sm:text-lg">{discountRate}%</span>
                </div>
                <span className="text-gray-400 line-through text-sm sm:text-base">
                  {originalPrice.toLocaleString()}원
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-red-600">
                {discountPrice.toLocaleString()}원
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="w-full">
              <div className="flex items-center justify-center gap-2 text-gray-700 font-semibold mb-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">남은 시간</span>
              </div>

              {/* Timer boxes */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-3">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-red-200">
                    <span className="text-2xl sm:text-3xl font-bold text-red-600">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5 font-medium">시간</span>
                </div>

                <div className="flex items-center text-2xl sm:text-3xl font-bold text-red-500 pb-5">:</div>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-red-200">
                    <span className="text-2xl sm:text-3xl font-bold text-red-600">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5 font-medium">분</span>
                </div>

                <div className="flex items-center text-2xl sm:text-3xl font-bold text-red-500 pb-5">:</div>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-red-200 animate-pulse">
                    <span className="text-2xl sm:text-3xl font-bold text-red-600">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5 font-medium">초</span>
                </div>
              </div>

              {/* Urgency text */}
              <div className="flex items-center justify-center gap-2 text-red-600 font-semibold text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                <span>마감 임박! 서둘러 주세요</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="relative z-10 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-red-200">
            <button className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 sm:gap-3 group-hover:animate-pulse">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>지금 바로 구매하기</span>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 blur-xl -z-10" />
      </div>
    </Link>
  );
}
