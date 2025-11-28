// Type definitions
export type HeroImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CategoryData = {
  id: number;
  label: string;
  icon: string;
  image?: string;
};

// Auto-generated image mapping from original site
export const IMAGE_MAP: {
  hero: HeroImage[];
  categories: CategoryData[];
} = {
  "hero": [
    {
      "src": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754535134851x293098760825501600/IMG%29%20%EB%A9%94%EC%9D%B8%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%287%29.png",
      "alt": "여우솔탈-하반기",
      "width": 330,
      "height": 331
    },
    {
      "src": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754535178880x436655212809772000/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9%20%281%29.png",
      "alt": "하반기종합",
      "width": 330,
      "height": 330
    },
    {
      "src": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png",
      "alt": "썸사주궁합",
      "width": 600,
      "height": 600
    },
    {
      "src": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
      "alt": "재회",
      "width": 330,
      "height": 330
    },
    {
      "src": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1759473519135x221915343896830200/IMG%29%20%E1%84%86%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%20%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB.svg",
      "alt": "신년 인터뷰",
      "width": 600,
      "height": 600
    },
    {
      "src": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
      "alt": "궁합사주",
      "width": 330,
      "height": 330
    }
  ],
  "categories": [
    {
      "id": 1,
      "label": "이벤트!",
      "icon": "🎫",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1758627216749x929285169986016800/%E1%84%8E%E1%85%B5%E1%86%AB%E1%84%80%E1%85%AE%E1%84%8E%E1%85%A9%E1%84%83%E1%85%A2.svg"
    },
    {
      "id": 2,
      "label": "궁합",
      "icon": "💖",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png"
    },
    {
      "id": 3,
      "label": "솔로/연애운",
      "icon": "🤡",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1756104327591x195418940527699800/%E1%84%8C%E1%85%A2%E1%84%92%E1%85%AC%20%E1%84%92%E1%85%AA%E1%86%AB%E1%84%89%E1%85%B3%E1%86%BC%E1%84%89%E1%85%A1%E1%84%8C%E1%85%AE.svg"
    },
    {
      "id": 4,
      "label": "이별/재회",
      "icon": "💝",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png"
    },
    {
      "id": 5,
      "label": "결혼운",
      "icon": "💍",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png"
    },
    {
      "id": 6,
      "label": "임신/자녀운",
      "icon": "👶",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png"
    },
    {
      "id": 7,
      "label": "신년운세",
      "icon": "🍀",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png"
    },
    {
      "id": 8,
      "label": "월별운세",
      "icon": "📅",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1755096595963x896724663128204200/%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB%E1%84%89%E1%85%A1%E1%84%8C%E1%85%AE.png"
    },
    {
      "id": 9,
      "label": "취업/직업운",
      "icon": "💼",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1756104085369x794228958999374300/%E1%84%91%E1%85%A2%E1%86%A8%E1%84%91%E1%85%A9%E1%86%A8-1-1.svg"
    },
    {
      "id": 10,
      "label": "관상/타로",
      "icon": "🎨",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1759473519135x221915343896830200/IMG%29%20%E1%84%86%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%20%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB.svg"
    },
    {
      "id": 14,
      "label": "재물운",
      "icon": "💵",
      "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png"
    }
  ]
};
