/**
 * Loading Messages for AI Saju Analysis
 * AI 사주 분석 중 표시할 메시지 시스템
 */

export interface LoadingMessage {
  text: string;
  duration: number; // milliseconds
  progress: number; // 0-100
}

/**
 * AI 분석 메시지 배열
 * 우주와 사주의 신비를 담은 메시지
 */
export const LOADING_MESSAGES: LoadingMessage[] = [
  {
    text: '우주의 별빛을 모으고 있습니다...',
    duration: 2000,
    progress: 5,
  },
  {
    text: '9개 행성의 배치를 확인하는 중...',
    duration: 2500,
    progress: 12,
  },
  {
    text: '수성(水)의 지혜를 불러오고 있습니다',
    duration: 2000,
    progress: 18,
  },
  {
    text: '금성(金)의 사랑과 조화를 분석 중...',
    duration: 2200,
    progress: 25,
  },
  {
    text: '지구(土)의 안정성을 계산하고 있습니다',
    duration: 2000,
    progress: 32,
  },
  {
    text: '화성(火)의 열정을 측정하는 중...',
    duration: 2300,
    progress: 40,
  },
  {
    text: '목성(木)의 확장 에너지를 탐색 중...',
    duration: 2100,
    progress: 48,
  },
  {
    text: '토성(土)의 책임감을 해석하고 있습니다',
    duration: 2000,
    progress: 55,
  },
  {
    text: '천왕성(水)의 혁신을 분석 중...',
    duration: 2200,
    progress: 62,
  },
  {
    text: '해왕성(水)의 직관을 읽고 있습니다',
    duration: 2000,
    progress: 68,
  },
  {
    text: '명왕성(土)의 변화를 감지하는 중...',
    duration: 2300,
    progress: 75,
  },
  {
    text: '음양오행의 균형을 계산 중...',
    duration: 2500,
    progress: 82,
  },
  {
    text: '천간지지를 해석하고 있습니다',
    duration: 2000,
    progress: 88,
  },
  {
    text: '사주팔자를 분석하는 중...',
    duration: 2200,
    progress: 92,
  },
  {
    text: '운세를 정리하고 있습니다',
    duration: 2000,
    progress: 96,
  },
  {
    text: '결과를 준비하는 중...',
    duration: 1500,
    progress: 100,
  },
];

/**
 * 짧은 버전 (빠른 로딩용)
 */
export const SHORT_LOADING_MESSAGES: LoadingMessage[] = [
  {
    text: '우주의 별빛을 모으고 있습니다...',
    duration: 1500,
    progress: 10,
  },
  {
    text: '9개 행성의 배치를 확인하는 중...',
    duration: 1500,
    progress: 30,
  },
  {
    text: '음양오행을 분석하고 있습니다',
    duration: 1500,
    progress: 50,
  },
  {
    text: '사주팔자를 계산하는 중...',
    duration: 1500,
    progress: 70,
  },
  {
    text: '운세를 정리하고 있습니다',
    duration: 1500,
    progress: 90,
  },
  {
    text: '결과를 준비하는 중...',
    duration: 1000,
    progress: 100,
  },
];

/**
 * 랜덤 우주 메시지 (배경 장식용)
 */
export const COSMIC_MESSAGES = [
  '별들이 당신의 운명을 노래합니다',
  '우주는 모든 것을 알고 있습니다',
  '행성들이 조화를 이루고 있습니다',
  '당신의 사주에 숨겨진 비밀을 찾는 중...',
  '우주의 법칙이 당신을 안내합니다',
  '별자리가 당신의 길을 밝힙니다',
  '태양계가 당신의 이야기를 들려줍니다',
  '우주의 신비가 펼쳐지고 있습니다',
];

/**
 * Get loading message by progress
 */
export function getMessageByProgress(progress: number): LoadingMessage | null {
  return (
    LOADING_MESSAGES.find((msg) => msg.progress >= progress) ||
    LOADING_MESSAGES[LOADING_MESSAGES.length - 1]
  );
}

/**
 * Get random cosmic message
 */
export function getRandomCosmicMessage(): string {
  return COSMIC_MESSAGES[Math.floor(Math.random() * COSMIC_MESSAGES.length)];
}

/**
 * Calculate total loading duration
 */
export function getTotalDuration(
  messages: LoadingMessage[] = LOADING_MESSAGES
): number {
  return messages.reduce((total, msg) => total + msg.duration, 0);
}

/**
 * Get message index by elapsed time
 */
export function getMessageByTime(
  elapsedTime: number,
  messages: LoadingMessage[] = LOADING_MESSAGES
): { message: LoadingMessage; index: number } | null {
  let accumulated = 0;

  for (let i = 0; i < messages.length; i++) {
    accumulated += messages[i].duration;
    if (elapsedTime < accumulated) {
      return { message: messages[i], index: i };
    }
  }

  return {
    message: messages[messages.length - 1],
    index: messages.length - 1,
  };
}
