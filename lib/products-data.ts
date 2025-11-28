import type { Product } from '@/components/product-card';

export interface ProductWithCategory extends Product {
  categoryIds: number[]; // Multiple categories per product
}

export const FEATURED_PRODUCTS: ProductWithCategory[] = [
  // 원본 사이트 기반 제품 목록 (2025-11-06 추출)
  {
    id: 1,
    title: '그 사람도 날 좋아할까?',
    subtitle: '썸 궁합사주❣️',
    rating: 4.7,
    views: '5만+',
    discount: 46,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754643430987x714312416549847200/%E1%84%8A%E1%85%A5%E1%86%B7%E1%84%89%E1%85%A1%E1%84%8C%E1%85%AE%E1%84%80%E1%85%AE%E1%86%BC%E1%84%92%E1%85%A1%E1%86%B8.png',
    categoryIds: [1, 2, 3] // 이벤트, 궁합, 솔로/연애운
  },
  {
    id: 2,
    title: '솔로탈출 연애운 사주',
    subtitle: '내 다음 연애는 언제 시작될까? 🔥',
    rating: 4.8,
    views: '3만+',
    discount: 54,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754534243317x762570355749248900/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC%20%281%29.png',
    categoryIds: [1, 3] // 이벤트, 솔로/연애운
  },
  {
    id: 3,
    title: '내 사주 속 재회 확률 미리보기',
    subtitle: '헤어진 연인과 다시 만날 수 있을까?',
    rating: 4.9,
    views: '28만+',
    discount: 60,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754534173818x331139229945973700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png',
    categoryIds: [1, 4] // 이벤트, 이별/재회
  },
  {
    id: 4,
    title: '하반기, 기다리던 변화의 불씨',
    subtitle: '[프리미엄 하반기 종합사주✨]',
    rating: 4.9,
    views: '1만+',
    discount: 46,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754535178880x436655212809772000/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9%20%281%29.png',
    categoryIds: [1, 8] // 이벤트, 월별운세
  },
  {
    id: 5,
    title: '결혼 궁합 사주',
    subtitle: '평생 함께할 사람과의 궁합은?',
    rating: 4.7,
    views: '2만+',
    discount: 46,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754643351628x712752188335735300/%E1%84%80%E1%85%A7%E1%86%AF%E1%84%92%E1%85%A9%E1%86%AB%E1%84%80%E1%85%AE%E1%86%BC%E1%84%92%E1%85%A1%E1%86%B8.png',
    categoryIds: [1, 2, 5] // 이벤트, 궁합, 결혼운
  },
  {
    id: 6,
    title: '소름돋게 잘 맞는 2026 신년운세',
    subtitle: '[신년운세 총운]',
    rating: 4.7,
    views: '1.4만+',
    discount: 54,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1759473519135x221915343896830200/IMG%29%20%E1%84%86%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%20%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB.svg',
    categoryIds: [1, 7] // 이벤트, 신년운세
  },
  {
    id: 7,
    title: '소름돋는 2026년 재물운세',
    subtitle: '[10년 재물운 사주] 💵',
    rating: 4.8,
    views: '2.8만+',
    discount: 60,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1758263804266x430512656845871500/IMG%29%20%E1%84%86%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%20%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5.svg',
    categoryIds: [1, 7, 14] // 이벤트, 신년운세, 재물운
  },
  {
    id: 8,
    title: '이직해서 연봉 2배 올리고 싶다면',
    subtitle: '봐야할 [커리어사주]',
    rating: 4.6,
    views: '1만+',
    discount: 46,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png',
    categoryIds: [1, 9] // 이벤트, 취업/직업운
  },
  {
    id: 9,
    title: '뻔한 조언 대신 진짜 매운맛 사주!',
    subtitle: '[팩폭 사주]',
    rating: 4.6,
    views: '1만+',
    discount: 29,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1756104085369x794228958999374300/%E1%84%91%E1%85%A2%E1%86%A8%E1%84%91%E1%85%A9%E1%86%A8-1-1.svg',
    categoryIds: [1, 10] // 이벤트, 관상/타로
  },
  {
    id: 10,
    title: '2025년 8월 월간운세',
    subtitle: '월간 사주 📅',
    rating: 4.7,
    views: '1만+',
    discount: 50,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=129,f=auto,dpr=1,fit=contain/f1754467456694x186235291558504830/8%EC%9B%94%EC%9A%B4%EC%84%B8.png',
    categoryIds: [1, 8] // 이벤트, 월별운세
  },
  {
    id: 11,
    title: '재회 vs 환승? 이제 지쳤다면',
    subtitle: '[재회 환승사주]',
    rating: 4.9,
    views: '6만+',
    discount: 41,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1756104327591x195418940527699800/%E1%84%8C%E1%85%A2%E1%84%92%E1%85%AC%20%E1%84%92%E1%85%AA%E1%86%AB%E1%84%89%E1%85%B3%E1%86%BC%E1%84%89%E1%85%A1%E1%84%8C%E1%85%AE.svg',
    categoryIds: [1, 4] // 이벤트, 이별/재회
  },
  {
    id: 12,
    title: '명쾌한 10년 풀이까지 해주는',
    subtitle: '[2025년 타이트 종합사주]',
    rating: 4.7,
    views: '1만+',
    discount: 29,
    image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png',
    categoryIds: [1, 7, 8] // 이벤트, 신년운세, 월별운세
  }
];
