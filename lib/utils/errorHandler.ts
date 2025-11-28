/**
 * Error Handler Utilities - 사주우주 에러 처리
 *
 * Centralized error handling utilities
 * - API error handling
 * - Error message formatting
 * - Error logging
 * - Error type detection
 *
 * Usage:
 * ```typescript
 * try {
 *   const response = await fetch('/api/endpoint');
 *   if (!response.ok) throw new Error('API Error');
 * } catch (error) {
 *   const errorInfo = handleApiError(error);
 *   console.error(errorInfo.message);
 *   logError(error, { context: 'API Call' });
 * }
 * ```
 *
 * Phase 1.5: Error Handling Implementation
 */

// ========================================
// Error Types & Interfaces
// ========================================

export interface ErrorInfo {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  timestamp: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export enum ErrorCode {
  // Network Errors
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",
  OFFLINE = "OFFLINE",

  // Client Errors (4xx)
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",

  // Application Errors
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  PARSE_ERROR = "PARSE_ERROR",
}

// ========================================
// Error Detection
// ========================================

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("NetworkError") ||
      error.message.includes("fetch failed") ||
      error.message.includes("Failed to fetch") ||
      error.name === "NetworkError"
    );
  }
  return false;
}

export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("timeout") ||
      error.message.includes("Timeout") ||
      error.name === "TimeoutError"
    );
  }
  return false;
}

export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    ("error" in error || "message" in error)
  );
}

// ========================================
// Error Message Formatting
// ========================================

const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_ERROR]: "네트워크 연결을 확인해주세요",
  [ErrorCode.TIMEOUT]: "요청 시간이 초과되었습니다",
  [ErrorCode.OFFLINE]: "인터넷 연결이 끊어졌습니다",
  [ErrorCode.BAD_REQUEST]: "잘못된 요청입니다",
  [ErrorCode.UNAUTHORIZED]: "로그인이 필요합니다",
  [ErrorCode.FORBIDDEN]: "접근 권한이 없습니다",
  [ErrorCode.NOT_FOUND]: "요청한 리소스를 찾을 수 없습니다",
  [ErrorCode.VALIDATION_ERROR]: "입력값을 확인해주세요",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "서버 오류가 발생했습니다",
  [ErrorCode.SERVICE_UNAVAILABLE]: "서비스를 일시적으로 사용할 수 없습니다",
  [ErrorCode.UNKNOWN_ERROR]: "알 수 없는 오류가 발생했습니다",
  [ErrorCode.PARSE_ERROR]: "데이터 처리 중 오류가 발생했습니다",
};

export function getErrorMessage(code: ErrorCode): string {
  return errorMessages[code] || errorMessages[ErrorCode.UNKNOWN_ERROR];
}

export function formatErrorMessage(error: unknown): string {
  // Error instance
  if (error instanceof Error) {
    return error.message;
  }

  // API Error Response
  if (isApiError(error)) {
    return error.message || error.error || "알 수 없는 오류";
  }

  // String error
  if (typeof error === "string") {
    return error;
  }

  // Object with message
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다";
}

// ========================================
// API Error Handling
// ========================================

export function handleApiError(error: unknown): ErrorInfo {
  const timestamp = new Date().toISOString();

  // Network Error
  if (isNetworkError(error)) {
    return {
      message: getErrorMessage(ErrorCode.NETWORK_ERROR),
      code: ErrorCode.NETWORK_ERROR,
      timestamp,
    };
  }

  // Timeout Error
  if (isTimeoutError(error)) {
    return {
      message: getErrorMessage(ErrorCode.TIMEOUT),
      code: ErrorCode.TIMEOUT,
      timestamp,
    };
  }

  // Offline
  if (!navigator.onLine) {
    return {
      message: getErrorMessage(ErrorCode.OFFLINE),
      code: ErrorCode.OFFLINE,
      timestamp,
    };
  }

  // API Error Response
  if (isApiError(error)) {
    const statusCode = error.statusCode;
    let code = ErrorCode.UNKNOWN_ERROR;

    if (statusCode) {
      if (statusCode === 400) code = ErrorCode.BAD_REQUEST;
      else if (statusCode === 401) code = ErrorCode.UNAUTHORIZED;
      else if (statusCode === 403) code = ErrorCode.FORBIDDEN;
      else if (statusCode === 404) code = ErrorCode.NOT_FOUND;
      else if (statusCode >= 500) code = ErrorCode.INTERNAL_SERVER_ERROR;
    }

    return {
      message: error.message || getErrorMessage(code),
      code: error.code || code,
      statusCode,
      details: error.details,
      timestamp,
    };
  }

  // Generic Error
  if (error instanceof Error) {
    return {
      message: error.message,
      code: ErrorCode.UNKNOWN_ERROR,
      timestamp,
    };
  }

  // Unknown Error
  return {
    message: formatErrorMessage(error),
    code: ErrorCode.UNKNOWN_ERROR,
    timestamp,
  };
}

// ========================================
// Fetch Error Handler
// ========================================

export async function handleFetchError(response: Response): Promise<ErrorInfo> {
  const timestamp = new Date().toISOString();
  let errorData: ApiErrorResponse | null = null;

  // Try to parse error response
  try {
    errorData = await response.json();
  } catch {
    // Failed to parse JSON, use default error
  }

  let code = ErrorCode.UNKNOWN_ERROR;
  let message = "요청 처리 중 오류가 발생했습니다";

  // Map status code to error code
  if (response.status === 400) {
    code = ErrorCode.BAD_REQUEST;
    message = getErrorMessage(code);
  } else if (response.status === 401) {
    code = ErrorCode.UNAUTHORIZED;
    message = getErrorMessage(code);
  } else if (response.status === 403) {
    code = ErrorCode.FORBIDDEN;
    message = getErrorMessage(code);
  } else if (response.status === 404) {
    code = ErrorCode.NOT_FOUND;
    message = getErrorMessage(code);
  } else if (response.status >= 500) {
    code = ErrorCode.INTERNAL_SERVER_ERROR;
    message = getErrorMessage(code);
  }

  // Use error message from response if available
  if (errorData?.message) {
    message = errorData.message;
  } else if (errorData?.error) {
    message = errorData.error;
  }

  return {
    message,
    code: errorData?.code || code,
    statusCode: response.status,
    details: errorData?.details,
    timestamp,
  };
}

// ========================================
// Error Logging
// ========================================

interface LogContext {
  [key: string]: unknown;
}

export function logError(
  error: Error | unknown,
  context?: LogContext
): void {
  if (process.env.NODE_ENV === "development") {
    console.group("🔴 Error Log");
    console.error("Error:", error);
    if (context) {
      console.log("Context:", context);
    }
    console.log("Timestamp:", new Date().toISOString());
    console.groupEnd();
  }

  // TODO: Send to error logging service (Sentry, LogRocket, etc.)
  // Example:
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: context });
  // }
}

// ========================================
// Error Retry Logic
// ========================================

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    onRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Don't retry on client errors (4xx)
      if (isApiError(error) && error.statusCode && error.statusCode < 500) {
        break;
      }

      // Call retry callback
      if (onRetry) {
        onRetry(attempt + 1);
      }

      // Wait before retry (with exponential backoff if enabled)
      const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// ========================================
// Safe Async Wrapper
// ========================================

export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<[T | null, ErrorInfo | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const errorInfo = handleApiError(error);
    logError(error, { errorInfo });
    return [null, errorInfo];
  }
}
