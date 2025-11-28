"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

interface Purchase {
  id: string;
  name: string;
  product: string;
  time: string;
  location: string;
}

const MOCK_PURCHASES: Purchase[] = [
  { id: "1", name: "김**", product: "연애운 프리미엄 사주", time: "방금 전", location: "서울" },
  { id: "2", name: "이**", product: "재물운 종합 분석", time: "1분 전", location: "부산" },
  { id: "3", name: "박**", product: "궁합 풀패키지", time: "2분 전", location: "인천" },
  { id: "4", name: "최**", product: "직업운 프리미엄", time: "3분 전", location: "대구" },
  { id: "5", name: "정**", product: "종합운 올인원", time: "4분 전", location: "광주" },
  { id: "6", name: "강**", product: "연애운 + 궁합", time: "5분 전", location: "대전" },
  { id: "7", name: "조**", product: "재물운 프리미엄", time: "6분 전", location: "울산" },
  { id: "8", name: "윤**", product: "건강운 종합", time: "7분 전", location: "수원" },
];

/**
 * PurchaseToast Component
 * 실시간 구매 알림 토스트
 * - 8초마다 새로운 구매 알림 표시
 * - 자동 사라짐 (6초 후)
 * - 수동 닫기 가능
 */
export function PurchaseToast() {
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 첫 토스트는 5초 후 시작
    const initialDelay = setTimeout(() => {
      showNextPurchase();
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNextPurchase = () => {
    const purchase = MOCK_PURCHASES[currentIndex % MOCK_PURCHASES.length];
    setCurrentPurchase(purchase);
    setIsVisible(true);
    setCurrentIndex((prev) => prev + 1);

    // 6초 후 자동 숨김
    setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    // 8초 후 다음 구매 알림 표시
    setTimeout(() => {
      showNextPurchase();
    }, 8000);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentPurchase || !isVisible) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-4 right-4 sm:left-auto sm:right-6 z-[60] animate-slide-up">
      <div className="relative max-w-sm mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600" />

        {/* Content */}
        <div className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{currentPurchase.name}</span>
              <span className="text-xs text-gray-500">({currentPurchase.location})</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                구매완료
              </span>
            </div>
            <p className="text-sm text-gray-700 font-medium truncate">
              {currentPurchase.product}
            </p>
            <p className="text-xs text-gray-500 mt-1">{currentPurchase.time}</p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 animate-progress-bar" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-progress-bar {
          animation: progress-bar 6s linear;
        }
      `}</style>
    </div>
  );
}
