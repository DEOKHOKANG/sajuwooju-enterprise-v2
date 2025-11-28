/**
 * Features and Testimonials Data for Main Page
 */

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}

export const FEATURES: Feature[] = [
  {
    id: 'ai-analysis',
    icon: '🤖',
    title: 'AI 기반 사주 분석',
    description: '최신 인공지능 기술로 정확하고 상세한 사주 해석을 제공합니다',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    id: 'realtime',
    icon: '⚡',
    title: '실시간 운세',
    description: '언제 어디서나 즉시 확인할 수 있는 빠른 운세 분석 서비스',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'unlimited',
    icon: '♾️',
    title: '무제한 분석',
    description: '횟수 제한 없이 원하는 만큼 다양한 분야의 운세를 확인하세요',
    gradient: 'from-blue-400 to-cyan-500',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: '김서연',
    avatar: '👩',
    rating: 5,
    comment: '정말 신기할 정도로 정확해요! 특히 연애운 분석이 제 상황과 딱 맞아서 놀랐습니다. AI가 이렇게 정확할 수 있다니...',
    service: '연애운',
    date: '2025-01-10',
  },
  {
    id: 'test-2',
    name: '이준호',
    avatar: '👨',
    rating: 5,
    comment: '직장 운세를 봤는데 조언대로 했더니 실제로 좋은 결과가 있었어요. 종합분석도 상세해서 만족스럽습니다!',
    service: '직업운',
    date: '2025-01-08',
  },
  {
    id: 'test-3',
    name: '박지민',
    avatar: '👧',
    rating: 5,
    comment: '궁합 분석이 정말 도움이 되었어요. 상대방과의 관계를 이해하는 데 큰 도움이 되었습니다. 강력 추천합니다!',
    service: '궁합',
    date: '2025-01-05',
  },
];
