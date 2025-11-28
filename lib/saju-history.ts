/**
 * 사주 분석 히스토리 관리 (LocalStorage)
 */

import { SajuResultData } from "./types/saju-result";

const HISTORY_KEY = "saju-history";
const MAX_HISTORY = 20; // 최대 20개까지 저장

interface HistoryItem {
  sessionId: string;
  name: string;
  category: string;
  year: number;
  month: number;
  day: number;
  calendarType: "solar" | "lunar";
  analyzedAt: string;
}

/**
 * 히스토리에 결과 추가
 */
export function addToHistory(result: SajuResultData, sessionId: string): void {
  if (typeof window === "undefined") return;

  const history = getHistory();

  // 중복 제거 (같은 sessionId가 이미 있으면 제거)
  const filteredHistory = history.filter((item) => item.sessionId !== sessionId);

  // 새 항목 추가 (최신 항목이 맨 앞에)
  const newItem: HistoryItem = {
    sessionId,
    name: result.name,
    category: result.category,
    year: result.year,
    month: result.month,
    day: result.day,
    calendarType: result.calendarType,
    analyzedAt: result.analyzedAt,
  };

  filteredHistory.unshift(newItem);

  // 최대 개수 제한
  const limitedHistory = filteredHistory.slice(0, MAX_HISTORY);

  // LocalStorage에 저장
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (err) {
    console.error("Failed to save history:", err);
  }
}

/**
 * 히스토리 조회
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    if (!historyStr) return [];
    return JSON.parse(historyStr) as HistoryItem[];
  } catch (err) {
    console.error("Failed to load history:", err);
    return [];
  }
}

/**
 * 특정 항목 삭제
 */
export function removeFromHistory(sessionId: string): void {
  if (typeof window === "undefined") return;

  const history = getHistory();
  const filteredHistory = history.filter((item) => item.sessionId !== sessionId);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (err) {
    console.error("Failed to remove from history:", err);
  }
}

/**
 * 전체 히스토리 삭제
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
}
