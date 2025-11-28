'use client';

/**
 * Follow Button Component
 * 재사용 가능한 팔로우 버튼 컴포넌트
 *
 * Features:
 * - 팔로우/언팔로우 토글
 * - 낙관적 업데이트 (Optimistic Update)
 * - 서버에서 초기 상태 로딩 (옵션)
 * - 로딩 상태
 * - 에러 처리
 * - 여러 스타일 변형
 */

import { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  fetchInitialState?: boolean; // 서버에서 초기 상태를 가져올지 여부
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export function FollowButton({
  userId,
  initialIsFollowing = false,
  fetchInitialState = false,
  variant = 'default',
  size = 'md',
  onFollowChange,
  className = ''
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(fetchInitialState);

  // 서버에서 초기 팔로우 상태 가져오기
  useEffect(() => {
    if (!fetchInitialState) return;

    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(`/api/follow/${userId}/status`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsFollowing(data.isFollowing);
          }
        }
      } catch (error) {
        console.error('Failed to fetch follow status:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchFollowStatus();
  }, [userId, fetchInitialState]);

  // 스타일 변형
  const variantStyles = {
    default: isFollowing
      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
    outline: isFollowing
      ? 'border-2 border-slate-300 hover:border-slate-400 bg-white text-slate-700'
      : 'border-2 border-purple-500 hover:border-purple-600 bg-white text-purple-600 hover:bg-purple-50',
    ghost: isFollowing
      ? 'hover:bg-slate-100 text-slate-700'
      : 'hover:bg-purple-50 text-purple-600'
  };

  // 크기 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const handleClick = async () => {
    if (isLoading) return;

    // 낙관적 업데이트 (UI 먼저 변경)
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);
    setIsLoading(true);

    try {
      // API 엔드포인트: POST /api/follow/[userId]
      const response = await fetch(`/api/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle follow');
      }

      const data = await response.json();

      // 서버 응답으로 최종 상태 업데이트
      // API Response: { success: true, isFollowing: boolean, message: string }
      setIsFollowing(data.isFollowing);

      // 콜백 실행
      if (onFollowChange) {
        onFollowChange(data.isFollowing);
      }

    } catch (error) {
      // 에러 발생 시 이전 상태로 롤백
      console.error('Follow toggle error:', error);
      setIsFollowing(previousState);

      // 사용자에게 에러 메시지 표시
      const errorMessage = error instanceof Error ? error.message : '팔로우 처리 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩 중이면 스켈레톤 표시
  if (isInitialLoading) {
    return (
      <button
        disabled
        className={`
          inline-flex items-center justify-center gap-2
          font-semibold rounded-lg
          transition-all duration-200
          bg-slate-200 text-slate-400 cursor-wait
          ${sizeStyles[size]}
          ${className}
        `}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>로딩중...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>처리중...</span>
        </>
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          <span>팔로잉</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>팔로우</span>
        </>
      )}
    </button>
  );
}
