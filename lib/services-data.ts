/**
 * Services Data for Main Page
 * 6 Saju service categories with 음양오행 (Five Elements) based color system
 */

export interface SajuService {
  id: string;
  name: string;
  icon: string;
  element: '木' | '火' | '土' | '金' | '水' | '五行';
  description: string;
  gradient: string;
  bgColor: string;
  href: string;
}

export const SAJU_SERVICES: SajuService[] = [
  {
    id: 'love',
    name: '연애운',
    icon: '💕',
    element: '火',
    description: '사랑과 인연의 흐름을 읽어드립니다',
    gradient: 'from-pink-400 via-rose-400 to-pink-500',
    bgColor: '#FF6EC7',
    href: '/category/3', // 솔로/연애 category
  },
  {
    id: 'wealth',
    name: '재물운',
    icon: '💰',
    element: '金',
    description: '금전운과 재물의 기운을 분석합니다',
    gradient: 'from-amber-400 via-orange-400 to-amber-500',
    bgColor: '#FFB340',
    href: '/category/6', // 재물/사업 category
  },
  {
    id: 'career',
    name: '직업운',
    icon: '💼',
    element: '木',
    description: '직장과 커리어의 방향을 제시합니다',
    gradient: 'from-violet-400 via-purple-400 to-violet-500',
    bgColor: '#7B68EE',
    href: '/category/5', // 직장/취업 category
  },
  {
    id: 'compatibility',
    name: '궁합',
    icon: '💑',
    element: '水',
    description: '두 사람의 인연과 조화를 봅니다',
    gradient: 'from-blue-400 via-cyan-400 to-blue-500',
    bgColor: '#4FD0E7',
    href: '/category/2', // 궁합 category
  },
  {
    id: 'yearly',
    name: '연운',
    icon: '📅',
    element: '土',
    description: '올해의 운세와 흐름을 예측합니다',
    gradient: 'from-emerald-400 via-teal-400 to-emerald-500',
    bgColor: '#10B981',
    href: '/category/8', // 월별운세 category
  },
  {
    id: 'comprehensive',
    name: '종합분석',
    icon: '🌟',
    element: '五行',
    description: '사주 전체를 종합적으로 분석합니다',
    gradient: 'from-indigo-400 via-purple-400 to-indigo-500',
    bgColor: '#6366F1',
    href: '/category/9', // 종합운 category
  },
];
