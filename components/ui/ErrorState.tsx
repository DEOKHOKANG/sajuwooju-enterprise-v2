/**
 * ErrorState Component - 사주우주 에러 상태 UI
 *
 * Reusable error state components for different scenarios
 * - Generic error state
 * - 404 Not Found
 * - 403 Forbidden
 * - 500 Server Error
 * - Network Error
 *
 * Usage:
 * ```tsx
 * <ErrorState
 *   title="에러 발생"
 *   description="문제가 발생했습니다"
 *   onRetry={() => refetch()}
 * />
 *
 * <NotFoundError />
 * <ServerError />
 * ```
 *
 * Phase 1.5: Error Handling Implementation
 */

import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  FileQuestion,
  RefreshCw,
  Home,
  ServerCrash,
  WifiOff,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ErrorStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
  retryLabel?: string;
  homeLabel?: string;
  className?: string;
}

/**
 * Generic Error State Component
 */
export function ErrorState({
  icon: Icon = AlertCircle,
  title,
  description,
  iconColor = "text-red-600",
  iconBgColor = "bg-red-100",
  onRetry,
  onGoHome,
  showHomeButton = true,
  retryLabel = "다시 시도",
  homeLabel = "메인으로",
  className = "",
}: ErrorStateProps) {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = "/main";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      {/* Icon */}
      <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">
        {title}
      </h2>

      {/* Description */}
      <p className="text-slate-600 text-center mb-6 max-w-md">{description}</p>

      {/* Actions */}
      <div className="flex gap-3">
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {retryLabel}
          </Button>
        )}

        {showHomeButton && (
          <Button
            variant={onRetry ? "outline" : "primary"}
            onClick={handleGoHome}
            leftIcon={<Home className="w-4 h-4" />}
          >
            {homeLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 404 Not Found Error
 */
export function NotFoundError({
  title = "페이지를 찾을 수 없습니다",
  description = "요청하신 페이지가 존재하지 않거나 이동되었습니다.",
  onGoHome,
}: Partial<ErrorStateProps>) {
  return (
    <ErrorState
      icon={FileQuestion}
      title={title}
      description={description}
      iconColor="text-purple-600"
      iconBgColor="bg-purple-100"
      onGoHome={onGoHome}
      showHomeButton={true}
      homeLabel="메인으로 돌아가기"
    />
  );
}

/**
 * 403 Forbidden Error
 */
export function ForbiddenError({
  title = "접근 권한이 없습니다",
  description = "이 페이지에 접근할 권한이 없습니다. 로그인이 필요하거나 권한이 부족할 수 있습니다.",
  onGoHome,
}: Partial<ErrorStateProps>) {
  return (
    <ErrorState
      icon={Ban}
      title={title}
      description={description}
      iconColor="text-orange-600"
      iconBgColor="bg-orange-100"
      onGoHome={onGoHome}
      showHomeButton={true}
    />
  );
}

/**
 * 500 Server Error
 */
export function ServerError({
  title = "서버 오류가 발생했습니다",
  description = "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  onRetry,
  onGoHome,
}: Partial<ErrorStateProps>) {
  return (
    <ErrorState
      icon={ServerCrash}
      title={title}
      description={description}
      iconColor="text-red-600"
      iconBgColor="bg-red-100"
      onRetry={onRetry}
      onGoHome={onGoHome}
      showHomeButton={true}
    />
  );
}

/**
 * Network Error
 */
export function NetworkError({
  title = "네트워크 연결 오류",
  description = "인터넷 연결을 확인하고 다시 시도해주세요.",
  onRetry,
}: Partial<ErrorStateProps>) {
  return (
    <ErrorState
      icon={WifiOff}
      title={title}
      description={description}
      iconColor="text-slate-600"
      iconBgColor="bg-slate-100"
      onRetry={onRetry}
      showHomeButton={false}
      retryLabel="다시 연결"
    />
  );
}

/**
 * API Error (Generic)
 */
export function ApiError({
  title = "데이터를 불러올 수 없습니다",
  description = "데이터를 가져오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  onRetry,
}: Partial<ErrorStateProps>) {
  return (
    <ErrorState
      icon={AlertTriangle}
      title={title}
      description={description}
      iconColor="text-yellow-600"
      iconBgColor="bg-yellow-100"
      onRetry={onRetry}
      showHomeButton={false}
    />
  );
}

/**
 * Empty State (for no results, not technically an error)
 */
export function EmptyState({
  icon: Icon = FileQuestion,
  title = "결과가 없습니다",
  description = "검색 결과가 없습니다. 다른 검색어를 시도해보세요.",
  iconColor = "text-slate-400",
  iconBgColor = "bg-slate-100",
  action,
  actionLabel = "새로고침",
}: Partial<ErrorStateProps> & {
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>

      <h2 className="text-xl font-semibold text-slate-700 mb-2 text-center">
        {title}
      </h2>

      <p className="text-slate-500 text-center mb-6 max-w-md">{description}</p>

      {action && (
        <Button variant="secondary" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
