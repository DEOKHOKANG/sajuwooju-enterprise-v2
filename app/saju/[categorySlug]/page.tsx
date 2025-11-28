/**
 * Saju Category Content List Page
 * Shows 5-8 compelling content items per category
 * Each item is clickable and leads to detail page with payment
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, TrendingUp, Heart, Zap, Star, Clock, Shield, DollarSign, Briefcase, Activity, Users, Calendar, Moon } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// ========================================
// Category Content Data
// ========================================

const CATEGORY_CONTENTS = {
  'love-fortune': [
    {
      slug: '2025-love-fortune',
      title: '2025년 나의 연애운',
      subtitle: '올해 사랑이 찾아올까?',
      description: 'AI 기반 정밀 분석으로 당신의 2025년 연애 운세를 상세히 알려드립니다. 언제, 어디서, 어떤 사람을 만날지 구체적으로 확인하세요.',
      price: 29000,
      originalPrice: 39000,
      discount: 26,
      icon: Heart,
      gradient: 'from-pink-500 to-rose-600',
      badge: '인기',
      highlights: [
        '월별 연애운 상세 분석',
        '이상형 만날 시기 예측',
        '연애 성공 전략 제시',
        '피해야 할 시기 알림'
      ],
      testimonial: {
        text: '정확도가 너무 높아서 깜짝 놀랐어요! 예측한 시기에 정말 좋은 사람 만났습니다.',
        author: '김**',
        rating: 5
      }
    },
    {
      slug: 'reunion-possibility',
      title: '이별 후 재회 가능성',
      subtitle: '다시 만날 수 있을까?',
      description: '헤어진 연인과의 재회 가능성을 사주 기반으로 정밀 분석합니다. 재회 시기, 성공 확률, 주의사항까지 모두 알려드립니다.',
      price: 24000,
      originalPrice: 34000,
      discount: 29,
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-500',
      badge: '추천',
      highlights: [
        '재회 가능성 % 제시',
        '최적의 연락 시기',
        '관계 회복 전략',
        '피해야 할 행동 가이드'
      ],
      testimonial: {
        text: '조언대로 했더니 정말 다시 연락이 왔어요. 너무 감사합니다!',
        author: '이**',
        rating: 5
      }
    },
    {
      slug: 'crush-success-rate',
      title: '짝사랑 성공률 분석',
      subtitle: '고백해도 될까?',
      description: '당신의 짝사랑 성공 가능성을 사주로 분석합니다. 고백 최적 시기, 성공 전략, 실패 리스크까지 모두 확인하세요.',
      price: 19000,
      originalPrice: 29000,
      discount: 34,
      icon: Star,
      gradient: 'from-red-500 to-pink-600',
      badge: '특가',
      highlights: [
        '성공 확률 정밀 계산',
        '고백 최적 타이밍',
        '호감도 높이는 방법',
        '실패 시 대처법'
      ],
      testimonial: {
        text: '추천받은 날짜에 고백했는데 성공했어요! 대박입니다.',
        author: '박**',
        rating: 5
      }
    },
    {
      slug: 'marriage-timing',
      title: '결혼 운세 분석',
      subtitle: '언제 결혼할 수 있을까?',
      description: '당신의 결혼 시기를 정밀 예측합니다. 최적의 결혼 타이밍, 이상형 배우자상, 결혼 후 생활까지 모두 알려드립니다.',
      price: 34000,
      originalPrice: 44000,
      discount: 23,
      icon: Heart,
      gradient: 'from-rose-500 to-red-600',
      badge: '프리미엄',
      highlights: [
        '결혼 최적 시기 예측',
        '배우자 특징 분석',
        '결혼 생활 운세',
        '주의사항 및 조언'
      ],
      testimonial: {
        text: '예측한 시기에 프러포즈 받았어요. 신기할 정도로 정확해요!',
        author: '최**',
        rating: 5
      }
    },
    {
      slug: 'ideal-type-finder',
      title: '나의 이상형 찾기',
      subtitle: '어떤 사람이 나와 맞을까?',
      description: '사주 기반으로 당신과 가장 잘 맞는 이상형을 찾아드립니다. 외모, 성격, 직업까지 구체적으로 알려드립니다.',
      price: 22000,
      originalPrice: 32000,
      discount: 31,
      icon: Sparkles,
      gradient: 'from-pink-400 to-purple-500',
      badge: null,
      highlights: [
        '이상형 상세 프로필',
        '만날 수 있는 장소',
        '첫 만남 시기 예측',
        '관계 발전 조언'
      ],
      testimonial: {
        text: '설명해준 그대로인 사람을 만나서 놀랐어요. 진짜 신기합니다.',
        author: '정**',
        rating: 5
      }
    },
    {
      slug: 'relationship-compatibility',
      title: '연애 궁합 분석',
      subtitle: '지금 만나는 사람, 나와 맞을까?',
      description: '현재 만나고 있는 사람과의 궁합을 정밀 분석합니다. 장기 관계 가능성, 갈등 요소, 해결 방법까지 모두 제시합니다.',
      price: 27000,
      originalPrice: 37000,
      discount: 27,
      icon: Heart,
      gradient: 'from-red-400 to-pink-600',
      badge: '인기',
      highlights: [
        '궁합 점수 제시',
        '장단점 분석',
        '갈등 해결 전략',
        '관계 발전 로드맵'
      ],
      testimonial: {
        text: '조언대로 했더니 관계가 훨씬 좋아졌어요. 감사합니다!',
        author: '강**',
        rating: 5
      }
    },
    {
      slug: 'love-crisis-solution',
      title: '연애 위기 해결법',
      subtitle: '관계가 흔들릴 때 어떻게 해야 할까?',
      description: '현재 겪고 있는 연애 위기를 극복하는 방법을 알려드립니다. 위기의 원인, 해결 시기, 구체적 행동 가이드를 제시합니다.',
      price: 26000,
      originalPrice: 36000,
      discount: 28,
      icon: Shield,
      gradient: 'from-orange-500 to-red-600',
      badge: null,
      highlights: [
        '위기 원인 분석',
        '회복 가능성 진단',
        '단계별 해결 전략',
        '재발 방지 조언'
      ],
      testimonial: {
        text: '거의 헤어질 뻔했는데 이 분석 덕분에 관계를 회복했어요.',
        author: '윤**',
        rating: 5
      }
    },
    {
      slug: 'soulmate-meeting',
      title: '운명의 상대 만날 시기',
      subtitle: '내 소울메이트는 언제 나타날까?',
      description: '당신의 운명적인 상대를 만날 시기를 정밀 예측합니다. 만남의 장소, 상황, 첫인상까지 상세히 알려드립니다.',
      price: 31000,
      originalPrice: 41000,
      discount: 24,
      icon: Zap,
      gradient: 'from-purple-600 to-pink-600',
      badge: '프리미엄',
      highlights: [
        '운명적 만남 시기',
        '만남 장소 및 상황',
        '상대방 특징 분석',
        '관계 발전 예측'
      ],
      testimonial: {
        text: '정확하게 그 시기에 운명 같은 사람을 만났어요. 놀라워요!',
        author: '송**',
        rating: 5
      }
    }
  ],
  'wealth-fortune': [
    {
      slug: '2025-wealth-fortune',
      title: '2025년 재물운',
      subtitle: '올해 돈 벌 수 있을까?',
      description: 'AI 기반 정밀 분석으로 당신의 2025년 재물운을 상세히 알려드립니다. 투자 타이밍, 수입 증가 시기, 주의사항까지 모두 확인하세요.',
      price: 32000,
      originalPrice: 42000,
      discount: 24,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-yellow-600',
      badge: '인기',
      highlights: [
        '월별 재물운 분석',
        '투자 최적 시기',
        '수입 증가 예측',
        '금전 손실 주의 시기'
      ],
      testimonial: {
        text: '추천받은 시기에 투자해서 큰 수익 냈어요. 대박입니다!',
        author: '김**',
        rating: 5
      }
    },
    {
      slug: 'investment-timing',
      title: '투자 타이밍 분석',
      subtitle: '지금 투자해도 될까?',
      description: '사주 기반으로 당신의 최적 투자 타이밍을 분석합니다. 주식, 부동산, 코인 등 분야별 투자 시기를 알려드립니다.',
      price: 28000,
      originalPrice: 38000,
      discount: 26,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      badge: '추천',
      highlights: [
        '분야별 투자 타이밍',
        '수익 가능성 예측',
        '리스크 분석',
        '포트폴리오 조언'
      ],
      testimonial: {
        text: '조언대로 투자했더니 정말 수익이 났어요. 감사합니다!',
        author: '이**',
        rating: 5
      }
    },
    {
      slug: 'business-success',
      title: '사업 성공 운세',
      subtitle: '창업해도 될까?',
      description: '창업 또는 사업 확장의 성공 가능성을 분석합니다. 최적 창업 시기, 유망 업종, 주의사항까지 모두 알려드립니다.',
      price: 35000,
      originalPrice: 45000,
      discount: 22,
      icon: Sparkles,
      gradient: 'from-blue-500 to-indigo-600',
      badge: '프리미엄',
      highlights: [
        '창업 최적 시기',
        '유망 업종 추천',
        '성공 확률 분석',
        '리스크 관리 전략'
      ],
      testimonial: {
        text: '조언받은 시기에 창업해서 지금 잘되고 있어요!',
        author: '박**',
        rating: 5
      }
    },
    {
      slug: 'salary-negotiation',
      title: '연봉 협상 타이밍',
      subtitle: '연봉 인상 요구해도 될까?',
      description: '연봉 협상의 최적 타이밍을 알려드립니다. 성공 확률, 협상 전략, 주의사항까지 상세히 제시합니다.',
      price: 23000,
      originalPrice: 33000,
      discount: 30,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-blue-600',
      badge: null,
      highlights: [
        '협상 최적 시기',
        '성공 확률 예측',
        '협상 전략 제시',
        '대안 제시'
      ],
      testimonial: {
        text: '추천받은 시기에 협상해서 원하는 만큼 올렸어요!',
        author: '최**',
        rating: 5
      }
    },
    {
      slug: 'windfall-fortune',
      title: '횡재수 분석',
      subtitle: '갑자기 돈 들어올 일 있을까?',
      description: '예상치 못한 금전적 행운이 찾아올 시기를 예측합니다. 복권, 상금, 유산 등 횡재수를 분석합니다.',
      price: 25000,
      originalPrice: 35000,
      discount: 29,
      icon: Star,
      gradient: 'from-yellow-400 to-orange-600',
      badge: '특가',
      highlights: [
        '횡재 가능 시기',
        '횡재 유형 분석',
        '확률 높이는 방법',
        '주의사항'
      ],
      testimonial: {
        text: '예측한 시기에 정말 뜻밖의 돈이 생겼어요. 신기해요!',
        author: '정**',
        rating: 5
      }
    },
    {
      slug: 'debt-resolution',
      title: '빚 탕감 운세',
      subtitle: '언제 빚에서 벗어날 수 있을까?',
      description: '현재 부채 상황에서 벗어날 시기와 방법을 알려드립니다. 상환 계획, 주의사항, 재기 시기까지 제시합니다.',
      price: 27000,
      originalPrice: 37000,
      discount: 27,
      icon: Shield,
      gradient: 'from-red-500 to-orange-600',
      badge: null,
      highlights: [
        '빚 탕감 가능 시기',
        '상환 전략',
        '재기 시점 예측',
        '금전 관리 조언'
      ],
      testimonial: {
        text: '조언대로 했더니 생각보다 빨리 빚을 갚았어요.',
        author: '강**',
        rating: 5
      }
    }
  ],
  'career-fortune': [
    {
      slug: '2025-career-fortune',
      title: '2025년 직장운',
      subtitle: '올해 승진할 수 있을까?',
      description: 'AI 기반으로 당신의 2025년 커리어 운세를 상세히 분석합니다. 승진, 이직, 연봉 협상 최적 타이밍을 모두 알려드립니다.',
      price: 30000,
      originalPrice: 40000,
      discount: 25,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-indigo-600',
      badge: '인기',
      highlights: [
        '월별 직장운 분석',
        '승진 가능 시기',
        '이직 최적 타이밍',
        '주의해야 할 시기'
      ],
      testimonial: {
        text: '예측한 시기에 정말 승진했어요. 너무 정확해서 놀랐습니다!',
        author: '김**',
        rating: 5
      }
    },
    {
      slug: 'job-change-timing',
      title: '이직 타이밍 분석',
      subtitle: '지금 이직해도 될까?',
      description: '최적의 이직 타이밍과 성공 확률을 분석합니다. 업종, 직무, 회사 규모까지 상세히 조언드립니다.',
      price: 27000,
      originalPrice: 37000,
      discount: 27,
      icon: Sparkles,
      gradient: 'from-purple-500 to-blue-600',
      badge: '추천',
      highlights: [
        '이직 최적 시기',
        '유망 업종 추천',
        '성공 확률 분석',
        '면접 준비 조언'
      ],
      testimonial: {
        text: '추천받은 시기에 이직해서 연봉도 올리고 만족해요!',
        author: '이**',
        rating: 5
      }
    },
    {
      slug: 'promotion-possibility',
      title: '승진 가능성 진단',
      subtitle: '올해 승진 할 수 있을까?',
      description: '당신의 승진 가능성과 최적 타이밍을 분석합니다. 승진 확률, 준비사항, 주의점까지 모두 알려드립니다.',
      price: 25000,
      originalPrice: 35000,
      discount: 29,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      badge: null,
      highlights: [
        '승진 확률 계산',
        '최적 타이밍',
        '준비사항 체크리스트',
        '상사 대처법'
      ],
      testimonial: {
        text: '조언대로 준비했더니 정말 승진했어요. 감사합니다!',
        author: '박**',
        rating: 5
      }
    },
    {
      slug: 'startup-success',
      title: '창업 성공 운세',
      subtitle: '퇴사하고 창업해도 될까?',
      description: '창업의 성공 가능성과 최적 시기를 분석합니다. 유망 아이템, 파트너 선택, 주의사항까지 제시합니다.',
      price: 33000,
      originalPrice: 43000,
      discount: 23,
      icon: Star,
      gradient: 'from-orange-500 to-red-600',
      badge: '프리미엄',
      highlights: [
        '창업 최적 시기',
        '성공 가능 아이템',
        '파트너 궁합 분석',
        '리스크 관리'
      ],
      testimonial: {
        text: '추천받은 시기에 창업해서 지금 잘 되고 있어요!',
        author: '최**',
        rating: 5
      }
    },
    {
      slug: 'workplace-compatibility',
      title: '직장 상사/동료 궁합',
      subtitle: '상사와 잘 맞을까?',
      description: '직장 내 인간관계 궁합을 분석합니다. 상사, 동료와의 관계 개선 방법과 주의사항을 알려드립니다.',
      price: 22000,
      originalPrice: 32000,
      discount: 31,
      icon: Heart,
      gradient: 'from-pink-500 to-purple-600',
      badge: null,
      highlights: [
        '궁합 점수 제시',
        '관계 개선 전략',
        '갈등 해결 방법',
        '협업 팁'
      ],
      testimonial: {
        text: '조언대로 했더니 상사와 관계가 훨씬 좋아졌어요.',
        author: '정**',
        rating: 5
      }
    },
    {
      slug: 'burnout-prevention',
      title: '번아웃 예방 및 극복',
      subtitle: '언제 쉬어야 할까?',
      description: '번아웃 위험 시기와 예방 방법을 알려드립니다. 최적의 휴식 타이밍과 에너지 관리 전략을 제시합니다.',
      price: 24000,
      originalPrice: 34000,
      discount: 29,
      icon: Shield,
      gradient: 'from-blue-400 to-cyan-600',
      badge: '특가',
      highlights: [
        '번아웃 위험 시기',
        '휴식 최적 타이밍',
        '에너지 관리 전략',
        '회복 방법'
      ],
      testimonial: {
        text: '추천받은 시기에 휴가 써서 완전히 회복했어요!',
        author: '강**',
        rating: 5
      }
    }
  ],
  'health-fortune': [
    {
      slug: '2025-health-fortune',
      title: '2025년 건강운',
      subtitle: '올해 건강 어떨까?',
      description: 'AI 기반으로 당신의 2025년 건강운을 상세히 분석합니다. 주의해야 할 시기, 건강 관리 방법, 질병 예방법을 알려드립니다.',
      price: 28000,
      originalPrice: 38000,
      discount: 26,
      icon: Heart,
      gradient: 'from-green-500 to-emerald-600',
      badge: '인기',
      highlights: [
        '월별 건강운 분석',
        '주의 질환 예측',
        '건강 관리 방법',
        '최적 치료 시기'
      ],
      testimonial: {
        text: '경고받은 시기에 검진받았더니 조기 발견했어요. 감사합니다!',
        author: '김**',
        rating: 5
      }
    },
    {
      slug: 'disease-prevention',
      title: '질병 예방 운세',
      subtitle: '어떤 질병을 조심해야 할까?',
      description: '사주 기반으로 주의해야 할 질병과 예방 방법을 알려드립니다. 정기 검진 시기, 생활 습관 조언까지 제시합니다.',
      price: 26000,
      originalPrice: 36000,
      discount: 28,
      icon: Shield,
      gradient: 'from-red-500 to-orange-600',
      badge: '추천',
      highlights: [
        '주의 질환 분석',
        '예방 방법 제시',
        '검진 최적 시기',
        '생활 습관 조언'
      ],
      testimonial: {
        text: '조언대로 검진받고 관리해서 건강해졌어요!',
        author: '이**',
        rating: 5
      }
    },
    {
      slug: 'energy-balance',
      title: '에너지 밸런스 분석',
      subtitle: '왜 항상 피곤할까?',
      description: '당신의 에너지 상태를 분석하고 최적의 관리 방법을 알려드립니다. 휴식 타이밍, 영양 조언, 운동 방법까지 제시합니다.',
      price: 23000,
      originalPrice: 33000,
      discount: 30,
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-600',
      badge: null,
      highlights: [
        '에너지 상태 진단',
        '휴식 최적 타이밍',
        '영양 섭취 조언',
        '운동 방법 추천'
      ],
      testimonial: {
        text: '조언대로 했더니 피로가 확 줄었어요. 너무 좋아요!',
        author: '박**',
        rating: 5
      }
    },
    {
      slug: 'mental-health',
      title: '정신 건강 운세',
      subtitle: '마음의 평화를 찾을 수 있을까?',
      description: '정신 건강 상태를 분석하고 스트레스 관리 방법을 알려드립니다. 우울감 극복, 불안 해소 전략을 제시합니다.',
      price: 25000,
      originalPrice: 35000,
      discount: 29,
      icon: Heart,
      gradient: 'from-purple-500 to-pink-600',
      badge: '특가',
      highlights: [
        '정신 건강 진단',
        '스트레스 관리법',
        '우울감 극복 전략',
        '마음 치유 시기'
      ],
      testimonial: {
        text: '조언받은 방법으로 마음이 많이 편해졌어요.',
        author: '최**',
        rating: 5
      }
    },
    {
      slug: 'recovery-timing',
      title: '회복 타이밍 분석',
      subtitle: '언제 건강이 회복될까?',
      description: '현재 질병이나 부상의 회복 시기를 예측합니다. 최적의 치료 방법, 주의사항, 재발 방지법을 알려드립니다.',
      price: 27000,
      originalPrice: 37000,
      discount: 27,
      icon: TrendingUp,
      gradient: 'from-green-400 to-emerald-600',
      badge: null,
      highlights: [
        '회복 예상 시기',
        '치료 방법 조언',
        '재발 방지 전략',
        '건강 유지 팁'
      ],
      testimonial: {
        text: '예측한 시기에 정말 건강이 회복됐어요!',
        author: '정**',
        rating: 5
      }
    },
    {
      slug: 'diet-exercise',
      title: '다이어트/운동 성공 운세',
      subtitle: '언제 시작해야 성공할까?',
      description: '다이어트와 운동의 최적 시작 시기를 알려드립니다. 성공 확률, 추천 운동, 식단 조언까지 제시합니다.',
      price: 24000,
      originalPrice: 34000,
      discount: 29,
      icon: Star,
      gradient: 'from-orange-500 to-red-600',
      badge: null,
      highlights: [
        '시작 최적 시기',
        '성공 확률 예측',
        '추천 운동 종류',
        '식단 관리 조언'
      ],
      testimonial: {
        text: '추천받은 시기에 시작해서 목표 체중 달성했어요!',
        author: '강**',
        rating: 5
      }
    }
  ],
  'monthly-fortune': [
    {
      slug: '2025-january-fortune',
      title: '2025년 1월 운세',
      subtitle: '새해 첫 달, 어떻게 시작할까?',
      description: '2025년 1월 한 달간의 종합 운세를 상세히 알려드립니다. 연애, 재물, 건강, 직장운을 모두 분석합니다.',
      price: 19000,
      originalPrice: 29000,
      discount: 34,
      icon: Calendar,
      gradient: 'from-blue-500 to-indigo-600',
      badge: '인기',
      highlights: [
        '일별 운세 분석',
        '중요 날짜 표시',
        '분야별 운세',
        '주의사항 알림'
      ],
      testimonial: {
        text: '매일 확인하면서 생활하니까 좋은 일이 많아졌어요!',
        author: '김**',
        rating: 5
      }
    },
    {
      slug: 'monthly-planning',
      title: '이달의 계획 수립',
      subtitle: '언제 무엇을 해야 할까?',
      description: '이번 달 최적의 일정을 계획하는데 도움을 드립니다. 중요한 결정, 시작, 만남의 타이밍을 알려드립니다.',
      price: 21000,
      originalPrice: 31000,
      discount: 32,
      icon: Clock,
      gradient: 'from-purple-500 to-pink-600',
      badge: '추천',
      highlights: [
        '일정 최적화',
        '중요 결정 타이밍',
        '만남 추천 날짜',
        '피해야 할 날짜'
      ],
      testimonial: {
        text: '조언받은 날짜에 중요한 일 잡으니까 잘 풀려요!',
        author: '이**',
        rating: 5
      }
    },
    {
      slug: 'lucky-days',
      title: '이달의 행운의 날',
      subtitle: '언제가 나의 럭키데이?',
      description: '이번 달 당신에게 행운이 찾아올 날을 알려드립니다. 복권, 투자, 고백, 면접 등 중요한 일의 최적 날짜를 제시합니다.',
      price: 18000,
      originalPrice: 28000,
      discount: 36,
      icon: Star,
      gradient: 'from-yellow-500 to-orange-600',
      badge: '특가',
      highlights: [
        '행운의 날짜',
        '분야별 럭키데이',
        '행운 높이는 방법',
        '주의할 날짜'
      ],
      testimonial: {
        text: '럭키데이에 복권 사서 당첨됐어요. 진짜 놀라워요!',
        author: '박**',
        rating: 5
      }
    },
    {
      slug: 'monthly-caution',
      title: '이달의 주의사항',
      subtitle: '무엇을 조심해야 할까?',
      description: '이번 달 주의해야 할 사항과 위험 요소를 미리 알려드립니다. 건강, 금전, 인간관계 등 전방위 주의사항을 제시합니다.',
      price: 20000,
      originalPrice: 30000,
      discount: 33,
      icon: Shield,
      gradient: 'from-red-500 to-orange-600',
      badge: null,
      highlights: [
        '위험 시기 알림',
        '분야별 주의사항',
        '예방 방법',
        '대처 전략'
      ],
      testimonial: {
        text: '경고받은 일 조심했더니 큰 손실을 막았어요!',
        author: '최**',
        rating: 5
      }
    },
    {
      slug: 'monthly-opportunities',
      title: '이달의 기회',
      subtitle: '어떤 기회가 올까?',
      description: '이번 달 찾아올 기회와 포착 방법을 알려드립니다. 연애, 돈, 직장 등 다양한 기회를 놓치지 마세요.',
      price: 22000,
      originalPrice: 32000,
      discount: 31,
      icon: Sparkles,
      gradient: 'from-green-500 to-emerald-600',
      badge: null,
      highlights: [
        '기회 도래 시기',
        '분야별 기회',
        '포착 방법',
        '성공 전략'
      ],
      testimonial: {
        text: '알려준 기회를 잡아서 인생이 바뀌었어요!',
        author: '정**',
        rating: 5
      }
    }
  ],
  'compatibility': [
    {
      slug: 'love-compatibility',
      title: '연애 궁합 프리미엄',
      subtitle: '우리 정말 잘 맞을까?',
      description: '두 사람의 사주를 기반으로 정밀한 궁합 분석을 제공합니다. 장기 관계 가능성, 결혼 적합도, 갈등 요소까지 모두 분석합니다.',
      price: 39000,
      originalPrice: 49000,
      discount: 20,
      icon: Heart,
      gradient: 'from-pink-500 to-rose-600',
      badge: '프리미엄',
      highlights: [
        '정밀 궁합 점수',
        '결혼 적합도 분석',
        '갈등 요소 파악',
        '관계 발전 로드맵'
      ],
      testimonial: {
        text: '분석 보고 결혼 결심했어요. 지금 너무 행복합니다!',
        author: '김**',
        rating: 5
      }
    },
    {
      slug: 'business-partnership',
      title: '사업 파트너 궁합',
      subtitle: '같이 사업해도 될까?',
      description: '사업 파트너와의 궁합을 정밀 분석합니다. 협업 가능성, 역할 분담, 갈등 예방법을 알려드립니다.',
      price: 42000,
      originalPrice: 52000,
      discount: 19,
      icon: Sparkles,
      gradient: 'from-blue-500 to-indigo-600',
      badge: '인기',
      highlights: [
        '사업 궁합 점수',
        '역할 분담 제안',
        '갈등 예방법',
        '성공 전략'
      ],
      testimonial: {
        text: '분석 덕분에 좋은 파트너와 성공적으로 사업하고 있어요!',
        author: '이**',
        rating: 5
      }
    },
    {
      slug: 'friendship-compatibility',
      title: '친구 궁합 분석',
      subtitle: '평생 친구로 지낼 수 있을까?',
      description: '친구와의 장기적 관계 가능성을 분석합니다. 우정의 깊이, 상호 보완성, 갈등 해결 방법을 제시합니다.',
      price: 29000,
      originalPrice: 39000,
      discount: 26,
      icon: Heart,
      gradient: 'from-purple-500 to-pink-600',
      badge: null,
      highlights: [
        '우정 궁합 점수',
        '상호 보완성',
        '갈등 해결법',
        '우정 유지 팁'
      ],
      testimonial: {
        text: '분석 보고 친구 관계를 더 소중히 하게 됐어요.',
        author: '박**',
        rating: 5
      }
    },
    {
      slug: 'family-compatibility',
      title: '가족 궁합 분석',
      subtitle: '가족과 잘 지낼 수 있을까?',
      description: '가족 구성원과의 궁합을 분석합니다. 갈등 원인, 해결 방법, 가족 화합 전략을 알려드립니다.',
      price: 35000,
      originalPrice: 45000,
      discount: 22,
      icon: Heart,
      gradient: 'from-orange-500 to-red-600',
      badge: '추천',
      highlights: [
        '가족 궁합 분석',
        '갈등 원인 파악',
        '화합 전략',
        '소통 방법'
      ],
      testimonial: {
        text: '조언대로 했더니 가족 관계가 훨씬 좋아졌어요!',
        author: '최**',
        rating: 5
      }
    },
    {
      slug: 'team-compatibility',
      title: '팀워크 궁합 분석',
      subtitle: '팀원들과 잘 맞을까?',
      description: '직장 팀원들과의 궁합을 분석합니다. 협업 효율, 역할 분담, 갈등 예방법을 제시합니다.',
      price: 32000,
      originalPrice: 42000,
      discount: 24,
      icon: Sparkles,
      gradient: 'from-green-500 to-emerald-600',
      badge: null,
      highlights: [
        '팀워크 궁합',
        '역할 최적화',
        '협업 전략',
        '갈등 예방'
      ],
      testimonial: {
        text: '분석 덕분에 팀 분위기가 훨씬 좋아졌어요!',
        author: '정**',
        rating: 5
      }
    }
  ]
};

// Default content for categories without specific data
const DEFAULT_CONTENTS = [
  {
    slug: 'general-fortune-1',
    title: '종합 운세 분석',
    subtitle: '나의 전반적인 운세는?',
    description: '당신의 전반적인 운세를 상세히 분석합니다. 현재 상황과 앞으로의 전망을 알려드립니다.',
    price: 25000,
    originalPrice: 35000,
    discount: 29,
    icon: Star,
    gradient: 'from-purple-500 to-pink-600',
    badge: null,
    highlights: [
      '종합 운세 분석',
      '월별 전망',
      '주요 이벤트 예측',
      '행운 요소 파악'
    ],
    testimonial: {
      text: '전반적인 운세를 알 수 있어서 도움이 많이 됐어요!',
      author: '김**',
      rating: 5
    }
  }
];

// ========================================
// Helper Functions
// ========================================

function getCategoryContents(categorySlug: string) {
  return CATEGORY_CONTENTS[categorySlug as keyof typeof CATEGORY_CONTENTS] || DEFAULT_CONTENTS;
}

// ========================================
// Metadata
// ========================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;

  const categoryNames: Record<string, string> = {
    'love-fortune': '연애운',
    'wealth-fortune': '재물운',
    'career-fortune': '직장운',
    'health-fortune': '건강운',
    'monthly-fortune': '월간운세',
    'compatibility': '궁합',
  };

  const categoryName = categoryNames[categorySlug] || '사주 콘텐츠';

  return {
    title: `${categoryName} | 사주우주`,
    description: `${categoryName} 관련 프리미엄 콘텐츠를 확인하세요. AI 기반 정밀 분석으로 당신의 운세를 상세히 알려드립니다.`,
    openGraph: {
      title: `${categoryName} | 사주우주`,
      description: `${categoryName} 관련 프리미엄 콘텐츠를 확인하세요.`,
      type: 'website',
    },
  };
}

// ========================================
// Main Component
// ========================================

export default async function SajuCategoryListPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const categoryInfo: Record<string, { name: string; icon: string; gradient: string; description: string }> = {
    'love-fortune': {
      name: '연애운',
      icon: '💗',
      gradient: 'from-pink-500 to-rose-600',
      description: '사랑과 인연에 관한 모든 것을 알려드립니다'
    },
    'wealth-fortune': {
      name: '재물운',
      icon: '💰',
      gradient: 'from-amber-500 to-yellow-600',
      description: '재물과 금전운에 관한 정밀 분석을 제공합니다'
    },
    'career-fortune': {
      name: '직장운',
      icon: '💼',
      gradient: 'from-blue-500 to-indigo-600',
      description: '커리어와 직장생활의 성공을 위한 가이드'
    },
    'health-fortune': {
      name: '건강운',
      icon: '🏥',
      gradient: 'from-green-500 to-emerald-600',
      description: '건강과 생활 에너지 관리 조언'
    },
    'monthly-fortune': {
      name: '월간운세',
      icon: '📅',
      gradient: 'from-purple-500 to-indigo-600',
      description: '이번 달 운세와 계획 수립 가이드'
    },
    'compatibility': {
      name: '궁합',
      icon: '🔗',
      gradient: 'from-rose-500 to-fuchsia-600',
      description: '두 사람의 궁합을 정밀하게 분석합니다'
    }
  };

  const category = categoryInfo[categorySlug];
  if (!category) {
    notFound();
  }

  const contents = getCategoryContents(categorySlug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${category.gradient} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/saju"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            전체 카테고리
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
              {category.icon}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{category.name}</h1>
              <p className="text-lg text-white/90">{category.description}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              ✨ AI 기반 정밀 분석
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              🎯 95% 이상 만족도
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              ⚡ 즉시 확인 가능
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust Indicators */}
        <div className="mb-12 text-center">
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>평균 평점 4.8/5.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>누적 구매 50,000+</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>100% 환불 보장</span>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents.map((content) => {
            const Icon = content.icon;
            return (
              <Link
                key={content.slug}
                href={`/saju/${categorySlug}/${content.slug}`}
                className="group"
              >
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                  {/* Badge */}
                  {content.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        content.badge === '인기' ? 'bg-red-500' :
                        content.badge === '추천' ? 'bg-blue-500' :
                        content.badge === '특가' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`}>
                        {content.badge}
                      </div>
                    </div>
                  )}

                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-r ${content.gradient} p-8 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="relative z-10">
                      <Icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                        {content.title}
                      </h3>
                      <p className="text-white/90 text-sm">{content.subtitle}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-shrink-0">
                      {content.description}
                    </p>

                    {/* Highlights */}
                    <div className="mb-6 flex-1">
                      <div className="space-y-2">
                        {content.highlights.slice(0, 3).map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(content.testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                        &quot;{content.testimonial.text}&quot;
                      </p>
                      <p className="text-xs text-gray-500">- {content.testimonial.author}</p>
                    </div>

                    {/* Price */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">
                              ₩{content.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-red-500 font-bold text-sm">
                              {content.discount}% OFF
                            </span>
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mt-1">
                            ₩{content.price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className={`w-full py-3 bg-gradient-to-r ${content.gradient} text-white rounded-xl font-semibold group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                        <span>자세히 보기</span>
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              아직 고민 중이신가요?
            </h3>
            <p className="text-gray-600 mb-6">
              지금 구매하시면 7일 이내 100% 환불 보장!
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>안전 결제</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>즉시 확인</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                <span>만족도 95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
