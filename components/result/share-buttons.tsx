/**
 * Share Buttons Component
 * Phase 8.11: Social sharing functionality for saju results
 */

'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  sessionId: string;
  name: string;
}

export default function ShareButtons({ sessionId, name }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';
  const shareUrl = `${siteUrl}/result/${sessionId}`;
  const shareTitle = `${name}님의 사주 분석 결과`;
  const shareDescription = '타이트사주에서 AI 기반 사주 분석 결과를 확인해보세요!';

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Share via Kakao Talk
  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      (window as any).Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle,
          description: shareDescription,
          imageUrl: `${siteUrl}/og-image.jpg`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '결과 보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      console.error('Kakao SDK not loaded');
      // Fallback to copy link
      handleCopyLink();
    }
  };

  // Share via Twitter
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareTitle
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  // Share via Facebook
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  // Native Web Share API (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          결과 공유하기
        </h3>
        <p className="text-gray-600">
          친구들과 사주 분석 결과를 공유해보세요
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
            {copied ? '✓' : '🔗'}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {copied ? '복사됨!' : '링크 복사'}
          </span>
        </button>

        {/* Kakao Talk Share */}
        <button
          onClick={handleKakaoShare}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
            💬
          </div>
          <span className="text-sm font-semibold text-gray-700">
            카카오톡
          </span>
        </button>

        {/* Facebook Share */}
        <button
          onClick={handleFacebookShare}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
            📘
          </div>
          <span className="text-sm font-semibold text-gray-700">
            페이스북
          </span>
        </button>

        {/* Twitter Share */}
        <button
          onClick={handleTwitterShare}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
        >
          <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-2xl">
            🐦
          </div>
          <span className="text-sm font-semibold text-gray-700">
            트위터
          </span>
        </button>
      </div>

      {/* Mobile Native Share (shown only on mobile with share API support) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <div className="mt-4 md:hidden">
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            <span className="text-xl">📤</span>
            <span>더 많은 방법으로 공유하기</span>
          </button>
        </div>
      )}

      {/* Share URL Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-gray-500 mb-1">공유 링크</p>
            <p className="text-sm text-gray-700 truncate font-mono">
              {shareUrl}
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            {copied ? '복사됨 ✓' : '복사'}
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <span className="text-purple-600 font-semibold">🔒 안전한 공유</span>
          <br />
          이 링크를 아는 사람만 결과를 볼 수 있습니다
        </p>
      </div>
    </div>
  );
}
