/**
 * 사주 공개 설정 토글 컴포넌트 (상용화급)
 * 사용자가 자신의 사주를 랭킹에 공개할지 여부를 선택
 */

"use client";

import { useState, useEffect } from "react";
import { Globe, Lock, Check } from "lucide-react";

interface PublicToggleProps {
  sessionId: string;
  initialIsPublic?: boolean;
  onToggle?: (isPublic: boolean) => void;
}

export function PublicToggle({
  sessionId,
  initialIsPublic = false,
  onToggle,
}: PublicToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // LocalStorage에서 공개 설정 불러오기
    const savedSetting = localStorage.getItem(`${sessionId}-public`);
    if (savedSetting !== null) {
      setIsPublic(savedSetting === "true");
    }
  }, [sessionId]);

  const handleToggle = () => {
    // 공개로 전환할 때만 확인 메시지 표시
    if (!isPublic) {
      setShowConfirm(true);
    } else {
      // 비공개로 전환
      performToggle(false);
    }
  };

  const performToggle = (newValue: boolean) => {
    setIsAnimating(true);
    setIsPublic(newValue);

    // LocalStorage에 저장
    localStorage.setItem(`${sessionId}-public`, String(newValue));

    // 콜백 호출
    onToggle?.(newValue);

    // 애니메이션 완료 후 상태 초기화
    setTimeout(() => {
      setIsAnimating(false);
      setShowConfirm(false);
    }, 600);
  };

  return (
    <div className="relative">
      {/* 메인 토글 버튼 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-purple-200 transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isPublic
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {isPublic ? (
                <Globe className="w-6 h-6" />
              ) : (
                <Lock className="w-6 h-6" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1">
                {isPublic ? "랭킹에 공개 중" : "비공개 상태"}
              </h3>
              <p className="text-sm text-gray-600">
                {isPublic
                  ? "다른 사용자들이 이 사주를 랭킹에서 볼 수 있습니다"
                  : "이 사주는 나만 볼 수 있습니다"}
              </p>
            </div>
          </div>

          {/* 토글 스위치 */}
          <button
            onClick={handleToggle}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              isPublic
                ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                : "bg-gray-300"
            } ${isAnimating ? "scale-110" : ""}`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                isPublic ? "translate-x-8" : "translate-x-0"
              }`}
            >
              {isAnimating && (
                <Check className="w-4 h-4 text-purple-500 animate-pulse" />
              )}
            </div>
          </button>
        </div>

        {/* 공개 시 추가 정보 */}
        {isPublic && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="flex items-start gap-2 text-sm text-purple-600 bg-purple-50 rounded-lg p-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium mb-1">공개 정보</p>
                <ul className="text-xs space-y-1 text-purple-700">
                  <li>• 이름은 익명화되어 표시됩니다 (예: 김*호)</li>
                  <li>• 사주 정보와 분석 결과가 공개됩니다</li>
                  <li>• 랭킹 점수는 오행 균형과 조화도로 산정됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                사주를 공개하시겠습니까?
              </h3>
              <p className="text-sm text-gray-600">
                다른 사용자들이 랭킹에서 이 사주를 볼 수 있습니다.
                <br />
                개인정보는 익명화되어 안전하게 보호됩니다.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => performToggle(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                공개하기
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
