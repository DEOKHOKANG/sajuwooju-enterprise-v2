/**
 * 사주 결과 공유 버튼들
 */

"use client";

import { useState } from "react";

interface ShareButtonsProps {
  sessionId: string;
  name: string;
  category: string;
}

export function ShareButtons({ sessionId, name, category }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // 결과 페이지 URL
  const resultUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/saju/result/${sessionId}`
      : "";

  // 링크 복사
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("링크 복사에 실패했습니다.");
    }
  };

  // 카카오톡 공유 (Web Share API 사용)
  const handleKakaoShare = async () => {
    const shareData = {
      title: `${name}님의 ${category} 결과`,
      text: "AI 사주 분석 결과를 확인해보세요!",
      url: resultUrl,
    };

    // Web Share API 지원 확인
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // 사용자가 취소한 경우는 에러 표시하지 않음
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Web Share API 미지원 시 링크 복사
      handleCopyLink();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 링크 복사 */}
      <button
        onClick={handleCopyLink}
        className="py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        {copied ? (
          <>
            <svg
              className="w-5 h-5"
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
            링크 복사 완료!
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            링크 복사
          </>
        )}
      </button>

      {/* 카카오톡 공유 */}
      <button
        onClick={handleKakaoShare}
        className="py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 00-.656-.678l-1.928 1.866V9.282a.472.472 0 00-.944 0v2.557a.471.471 0 000 .222V13.5a.472.472 0 00.944 0v-1.363l.427-.413 1.428 2.033a.472.472 0 10.773-.543l-1.514-2.155zm-2.958 1.924h-1.46V9.297a.472.472 0 00-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 100-.944zm-5.857-1.092l.696-1.707.638 1.707H9.092zm2.523.488l.002-.016a.469.469 0 00-.127-.32l-1.046-2.8a.69.69 0 00-.627-.474.696.696 0 00-.653.447l-1.661 4.075a.472.472 0 10.874.357l.33-.813h2.07l.299.785a.472.472 0 10.884-.337l-.345-.904zM8.293 9.302a.472.472 0 00-.471-.472H4.577a.472.472 0 100 .944h1.16v3.736a.472.472 0 00.944 0V9.774h1.14a.472.472 0 00.472-.472z"/>
        </svg>
        공유하기
      </button>
    </div>
  );
}
