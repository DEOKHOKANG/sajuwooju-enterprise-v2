/**
 * 로깅 유틸리티
 *
 * 구조화된 로깅 및 에러 추적
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * 로그 엔트리 생성
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  /**
   * 콘솔 출력
   */
  private output(entry: LogEntry): void {
    const { timestamp, level, message, context, error } = entry;

    // 개발 환경: 색상 있는 로그
    if (this.isDevelopment) {
      const colors = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m', // Green
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
      };
      const reset = '\x1b[0m';
      const color = colors[level];

      console.log(
        `${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`
      );

      if (context) {
        console.log('Context:', context);
      }

      if (error) {
        console.error('Error:', error);
      }
    }
    // 프로덕션 환경: JSON 로그 (로그 수집 도구 호환)
    else {
      console.log(JSON.stringify(entry));
    }
  }

  /**
   * Debug 로그
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      const entry = this.createEntry('debug', message, context);
      this.output(entry);
    }
  }

  /**
   * Info 로그
   */
  info(message: string, context?: Record<string, any>): void {
    const entry = this.createEntry('info', message, context);
    this.output(entry);
  }

  /**
   * Warning 로그
   */
  warn(message: string, context?: Record<string, any>): void {
    const entry = this.createEntry('warn', message, context);
    this.output(entry);
  }

  /**
   * Error 로그
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createEntry('error', message, context, error);
    this.output(entry);

    // 프로덕션 환경에서는 에러 추적 서비스로 전송 (Sentry 등)
    if (this.isProduction) {
      this.sendToErrorTracking(entry);
    }
  }

  /**
   * API 요청 로그
   */
  apiRequest(
    method: string,
    path: string,
    options?: {
      userId?: string;
      ip?: string;
      userAgent?: string;
      duration?: number;
      statusCode?: number;
    }
  ): void {
    this.info(`API Request: ${method} ${path}`, {
      method,
      path,
      ...options,
    });
  }

  /**
   * API 응답 로그
   */
  apiResponse(
    method: string,
    path: string,
    statusCode: number,
    duration: number
  ): void {
    const context = {
      method,
      path,
      statusCode,
      duration,
    };

    if (statusCode >= 400) {
      this.error(`API Response: ${method} ${path} - ${statusCode}`, undefined, context);
    } else {
      this.info(`API Response: ${method} ${path} - ${statusCode}`, context);
    }
  }

  /**
   * 데이터베이스 쿼리 로그
   */
  dbQuery(
    operation: string,
    model: string,
    duration: number,
    options?: Record<string, any>
  ): void {
    this.debug(`DB Query: ${operation} ${model}`, {
      operation,
      model,
      duration,
      ...options,
    });
  }

  /**
   * 캐시 로그
   */
  cache(action: 'hit' | 'miss' | 'set' | 'delete', key: string): void {
    this.debug(`Cache ${action}: ${key}`, { action, key });
  }

  /**
   * 인증 로그
   */
  auth(
    event: 'login' | 'logout' | 'failed' | 'unauthorized',
    userId?: string,
    ip?: string
  ): void {
    const level = event === 'failed' || event === 'unauthorized' ? 'warn' : 'info';
    this[level](`Auth ${event}`, { event, userId, ip });
  }

  /**
   * 에러 추적 서비스로 전송 (Sentry 등)
   */
  private sendToErrorTracking(entry: LogEntry): void {
    // TODO: Sentry, LogRocket 등 에러 추적 서비스 연동
    // if (Sentry) {
    //   Sentry.captureException(entry.error);
    // }
  }
}

// 싱글톤 인스턴스
export const logger = new Logger();

/**
 * 성능 측정 유틸리티
 */
export class PerformanceTimer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = Date.now();
  }

  /**
   * 경과 시간 측정 및 로깅
   */
  end(context?: Record<string, any>): number {
    const duration = Date.now() - this.startTime;
    logger.debug(`Performance: ${this.name}`, {
      duration,
      ...context,
    });
    return duration;
  }

  /**
   * 경과 시간만 반환 (로깅 없음)
   */
  getDuration(): number {
    return Date.now() - this.startTime;
  }
}

/**
 * 함수 실행 시간 측정 데코레이터
 */
export function measurePerformance<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name?: string
): T {
  return (async (...args: any[]) => {
    const timer = new PerformanceTimer(name || fn.name);
    try {
      const result = await fn(...args);
      timer.end({ success: true });
      return result;
    } catch (error) {
      timer.end({ success: false, error: (error as Error).message });
      throw error;
    }
  }) as T;
}

/**
 * API 라우트 핸들러 래퍼 (로깅 + 에러 처리)
 */
export function withLogging<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  name: string
): T {
  return (async (...args: any[]) => {
    const timer = new PerformanceTimer(name);
    const request = args[0] as Request;

    try {
      logger.apiRequest(request.method, new URL(request.url).pathname, {
        userAgent: request.headers.get('user-agent') || undefined,
      });

      const response = await handler(...args);
      const duration = timer.getDuration();

      logger.apiResponse(
        request.method,
        new URL(request.url).pathname,
        response.status,
        duration
      );

      return response;
    } catch (error) {
      const duration = timer.getDuration();

      logger.error(`API Error: ${name}`, error as Error, {
        method: request.method,
        path: new URL(request.url).pathname,
        duration,
      });

      throw error;
    }
  }) as T;
}
