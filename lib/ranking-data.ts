/**
 * 사주랭킹 데이터 타입 및 Mock 데이터 (상용화급)
 * 공개된 사주에 대한 랭킹 시스템
 */

export interface RankingSaju {
  id: string;
  rank: number;
  name: string; // 익명화된 이름 (예: "김*호")
  category: "연애운" | "재물운" | "직업운" | "궁합" | "연운" | "종합분석";
  score: number; // 0-100 점수
  birthYear: number;
  zodiac: string; // 띠
  dominantElement: "木" | "火" | "土" | "金" | "水";
  isBalanced: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: string; // ISO 8601
  thumbnail?: string; // 사주판 썸네일 (옵션)
}

// 음양오행 색상 매핑
export const ELEMENT_COLORS: {
  [key in "木" | "火" | "土" | "金" | "水"]: {
    gradient: string;
    icon: string;
  };
} = {
  木: { gradient: "from-emerald-500 to-green-600", icon: "🌳" },
  火: { gradient: "from-red-500 to-orange-600", icon: "🔥" },
  土: { gradient: "from-amber-500 to-yellow-600", icon: "⛰️" },
  金: { gradient: "from-yellow-400 to-amber-500", icon: "💎" },
  水: { gradient: "from-blue-500 to-cyan-600", icon: "💧" },
};

// 카테고리 색상 매핑
export const CATEGORY_COLORS: {
  [key in RankingSaju["category"]]: string;
} = {
  연애운: "from-pink-500 to-rose-600",
  재물운: "from-amber-500 to-orange-600",
  직업운: "from-violet-500 to-purple-600",
  궁합: "from-blue-500 to-cyan-600",
  연운: "from-emerald-500 to-teal-600",
  종합분석: "from-indigo-500 to-purple-600",
};

// Mock 데이터 (50개)
export const MOCK_RANKING_DATA: RankingSaju[] = [
  {
    id: "r001",
    rank: 1,
    name: "김*호",
    category: "종합분석",
    score: 98,
    birthYear: 1990,
    zodiac: "말띠",
    dominantElement: "火",
    isBalanced: true,
    viewCount: 15234,
    likeCount: 3421,
    createdAt: "2025-01-10T14:30:00Z",
  },
  {
    id: "r002",
    rank: 2,
    name: "이*영",
    category: "재물운",
    score: 97,
    birthYear: 1988,
    zodiac: "용띠",
    dominantElement: "金",
    isBalanced: true,
    viewCount: 13892,
    likeCount: 3102,
    createdAt: "2025-01-09T09:15:00Z",
  },
  {
    id: "r003",
    rank: 3,
    name: "박*수",
    category: "직업운",
    score: 96,
    birthYear: 1992,
    zodiac: "원숭이띠",
    dominantElement: "木",
    isBalanced: false,
    viewCount: 12456,
    likeCount: 2876,
    createdAt: "2025-01-08T16:45:00Z",
  },
  {
    id: "r004",
    rank: 4,
    name: "최*민",
    category: "연애운",
    score: 95,
    birthYear: 1995,
    zodiac: "돼지띠",
    dominantElement: "水",
    isBalanced: true,
    viewCount: 11234,
    likeCount: 2654,
    createdAt: "2025-01-07T11:20:00Z",
  },
  {
    id: "r005",
    rank: 5,
    name: "정*아",
    category: "종합분석",
    score: 94,
    birthYear: 1991,
    zodiac: "양띠",
    dominantElement: "土",
    isBalanced: true,
    viewCount: 10567,
    likeCount: 2431,
    createdAt: "2025-01-06T13:50:00Z",
  },
  {
    id: "r006",
    rank: 6,
    name: "강*현",
    category: "재물운",
    score: 93,
    birthYear: 1989,
    zodiac: "뱀띠",
    dominantElement: "火",
    isBalanced: false,
    viewCount: 9876,
    likeCount: 2198,
    createdAt: "2025-01-05T10:30:00Z",
  },
  {
    id: "r007",
    rank: 7,
    name: "조*희",
    category: "연애운",
    score: 92,
    birthYear: 1993,
    zodiac: "닭띠",
    dominantElement: "金",
    isBalanced: true,
    viewCount: 9234,
    likeCount: 2043,
    createdAt: "2025-01-04T15:10:00Z",
  },
  {
    id: "r008",
    rank: 8,
    name: "윤*준",
    category: "직업운",
    score: 91,
    birthYear: 1994,
    zodiac: "개띠",
    dominantElement: "木",
    isBalanced: true,
    viewCount: 8765,
    likeCount: 1921,
    createdAt: "2025-01-03T08:40:00Z",
  },
  {
    id: "r009",
    rank: 9,
    name: "임*우",
    category: "궁합",
    score: 90,
    birthYear: 1987,
    zodiac: "토끼띠",
    dominantElement: "水",
    isBalanced: false,
    viewCount: 8234,
    likeCount: 1798,
    createdAt: "2025-01-02T12:25:00Z",
  },
  {
    id: "r010",
    rank: 10,
    name: "한*진",
    category: "종합분석",
    score: 89,
    birthYear: 1996,
    zodiac: "쥐띠",
    dominantElement: "土",
    isBalanced: true,
    viewCount: 7892,
    likeCount: 1654,
    createdAt: "2025-01-01T14:55:00Z",
  },
  {
    id: "r011",
    rank: 11,
    name: "신*미",
    category: "연애운",
    score: 88,
    birthYear: 1990,
    zodiac: "말띠",
    dominantElement: "火",
    isBalanced: true,
    viewCount: 7456,
    likeCount: 1543,
    createdAt: "2024-12-31T09:30:00Z",
  },
  {
    id: "r012",
    rank: 12,
    name: "오*석",
    category: "재물운",
    score: 87,
    birthYear: 1992,
    zodiac: "원숭이띠",
    dominantElement: "金",
    isBalanced: false,
    viewCount: 7123,
    likeCount: 1432,
    createdAt: "2024-12-30T11:15:00Z",
  },
  {
    id: "r013",
    rank: 13,
    name: "권*영",
    category: "직업운",
    score: 86,
    birthYear: 1988,
    zodiac: "용띠",
    dominantElement: "木",
    isBalanced: true,
    viewCount: 6876,
    likeCount: 1321,
    createdAt: "2024-12-29T16:40:00Z",
  },
  {
    id: "r014",
    rank: 14,
    name: "배*경",
    category: "연운",
    score: 85,
    birthYear: 1995,
    zodiac: "돼지띠",
    dominantElement: "水",
    isBalanced: true,
    viewCount: 6543,
    likeCount: 1276,
    createdAt: "2024-12-28T13:20:00Z",
  },
  {
    id: "r015",
    rank: 15,
    name: "남*훈",
    category: "종합분석",
    score: 84,
    birthYear: 1991,
    zodiac: "양띠",
    dominantElement: "土",
    isBalanced: false,
    viewCount: 6234,
    likeCount: 1198,
    createdAt: "2024-12-27T10:50:00Z",
  },
  {
    id: "r016",
    rank: 16,
    name: "홍*리",
    category: "연애운",
    score: 83,
    birthYear: 1993,
    zodiac: "닭띠",
    dominantElement: "火",
    isBalanced: true,
    viewCount: 5987,
    likeCount: 1123,
    createdAt: "2024-12-26T15:30:00Z",
  },
  {
    id: "r017",
    rank: 17,
    name: "송*준",
    category: "재물운",
    score: 82,
    birthYear: 1989,
    zodiac: "뱀띠",
    dominantElement: "金",
    isBalanced: true,
    viewCount: 5765,
    likeCount: 1067,
    createdAt: "2024-12-25T08:45:00Z",
  },
  {
    id: "r018",
    rank: 18,
    name: "고*은",
    category: "직업운",
    score: 81,
    birthYear: 1994,
    zodiac: "개띠",
    dominantElement: "木",
    isBalanced: false,
    viewCount: 5543,
    likeCount: 1012,
    createdAt: "2024-12-24T12:10:00Z",
  },
  {
    id: "r019",
    rank: 19,
    name: "문*태",
    category: "궁합",
    score: 80,
    birthYear: 1987,
    zodiac: "토끼띠",
    dominantElement: "水",
    isBalanced: true,
    viewCount: 5321,
    likeCount: 987,
    createdAt: "2024-12-23T14:35:00Z",
  },
  {
    id: "r020",
    rank: 20,
    name: "안*지",
    category: "종합분석",
    score: 79,
    birthYear: 1996,
    zodiac: "쥐띠",
    dominantElement: "土",
    isBalanced: true,
    viewCount: 5123,
    likeCount: 921,
    createdAt: "2024-12-22T09:20:00Z",
  },
  // 추가 30개 데이터
  ...Array.from({ length: 30 }, (_, i) => {
    const rank = 21 + i;
    const categories: RankingSaju["category"][] = [
      "연애운",
      "재물운",
      "직업운",
      "궁합",
      "연운",
      "종합분석",
    ];
    const elements: ("木" | "火" | "土" | "金" | "水")[] = ["木", "火", "土", "金", "水"];
    const zodiacs = [
      "쥐띠",
      "소띠",
      "호랑이띠",
      "토끼띠",
      "용띠",
      "뱀띠",
      "말띠",
      "양띠",
      "원숭이띠",
      "닭띠",
      "개띠",
      "돼지띠",
    ];
    const lastNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];

    return {
      id: `r${String(rank).padStart(3, "0")}`,
      rank,
      name: `${lastNames[rank % lastNames.length]}*${String.fromCharCode(
        44032 + Math.floor(Math.random() * 100)
      )}`,
      category: categories[rank % categories.length],
      score: 78 - Math.floor(rank / 3),
      birthYear: 1985 + (rank % 15),
      zodiac: zodiacs[rank % zodiacs.length],
      dominantElement: elements[rank % elements.length],
      isBalanced: rank % 3 === 0,
      viewCount: 5000 - rank * 50,
      likeCount: 900 - rank * 15,
      createdAt: new Date(Date.now() - rank * 86400000).toISOString(),
    } as RankingSaju;
  }),
];

// 필터링 옵션
export const CATEGORY_FILTERS = [
  { value: "all", label: "전체" },
  { value: "연애운", label: "연애운" },
  { value: "재물운", label: "재물운" },
  { value: "직업운", label: "직업운" },
  { value: "궁합", label: "궁합" },
  { value: "연운", label: "연운" },
  { value: "종합분석", label: "종합분석" },
];

export const ELEMENT_FILTERS = [
  { value: "all", label: "전체" },
  { value: "木", label: "목(木)" },
  { value: "火", label: "화(火)" },
  { value: "土", label: "토(土)" },
  { value: "金", label: "금(金)" },
  { value: "水", label: "수(水)" },
];

export const SORT_OPTIONS = [
  { value: "rank", label: "랭킹순" },
  { value: "views", label: "조회수순" },
  { value: "likes", label: "좋아요순" },
  { value: "recent", label: "최신순" },
];
