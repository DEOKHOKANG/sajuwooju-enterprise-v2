# 버튼 시스템 분석 보고서

생성일: 2025-11-17
프로젝트: 사주우주 엔터프라이즈
작성자: Claude Code

---

## 📊 Executive Summary

**현황:** 버튼 시스템이 3개로 분리되어 일관성이 없고 유지보수가 어려움
**문제:** 50+ 인라인 버튼, 15+ 그라디언트 조합, 2개의 Button 컴포넌트
**해결:** 단일 Button 컴포넌트 + 표준 variant 시스템으로 통합
**예상 효과:** ~200 lines 코드 감소, 일관성 100% 향상

---

## 🔍 현황 분석

### 1. Button 컴포넌트 현황

#### A. `components/ui/button.tsx` (shadcn/ui 기반)
**사용률:** ~20%
**특징:**
- class-variance-authority (CVA) 사용
- 6개 variants: default, destructive, outline, secondary, ghost, link
- 4개 sizes: default, sm, lg, icon
- 범용적이지만 프로젝트 디자인과 미스매치

**Variants:**
```typescript
default: "bg-primary text-primary-foreground"      // 거의 사용 안 함
destructive: "bg-destructive"                       // 사용 안 함
outline: "border border-input"                      // 일부 사용
secondary: "bg-secondary"                           // 사용 안 함
ghost: "hover:bg-accent"                            // 일부 사용
link: "text-primary underline"                      // 사용 안 함
```

#### B. `components/admin/ui/Button.tsx` (Admin 전용)
**사용률:** ~10% (Admin 패널만)
**특징:**
- 6개 variants: primary, secondary, danger, success, ghost, outline
- 3개 sizes: sm, md, lg
- isLoading, leftIcon, rightIcon 지원
- Blue/Indigo 그라디언트 (프로젝트 색상과 다름)

**Variants:**
```typescript
primary: "from-blue-600 to-indigo-600"    // Purple 테마와 미스매치
secondary: "bg-slate-100"                  // 범용
danger: "from-red-600 to-rose-600"         // 범용
success: "from-emerald-600 to-green-600"   // 사용 안 함
ghost: "text-slate-700 hover:bg-slate-100" // 일부 사용
outline: "border-2 border-slate-300"       // 일부 사용
```

#### C. 인라인 버튼 (Inline Styles)
**사용률:** ~70%
**문제:** 중복 코드, 일관성 부족, 유지보수 어려움

---

### 2. 그라디언트 패턴 분석

**총 발견:** 40+ 사용처

#### Purple 계열 (프로젝트 메인 색상)
```typescript
// 29 occurrences
"bg-gradient-to-r from-purple-500 to-pink-500"     // CTA 버튼
"bg-gradient-to-r from-purple-600 to-pink-600"     // 헤더, 강조
"bg-gradient-to-r from-purple-400 to-pink-400"     // 약한 강조
"bg-gradient-to-r from-purple-700 to-pink-700"     // 진한 강조
```

#### Violet 계열 (탭, 배지)
```typescript
// 11 occurrences
"bg-gradient-to-r from-violet-500 to-purple-500"   // 활성 탭
"bg-gradient-to-r from-violet-600 to-purple-600"   // 버튼
```

#### 기타 색상
```typescript
"bg-gradient-to-r from-amber-500 to-orange-500"    // 木 (목)
"bg-gradient-to-r from-red-500 to-orange-500"      // 火 (화)
"bg-gradient-to-r from-yellow-600 to-amber-600"    // 土 (토)
"bg-gradient-to-r from-blue-500 to-cyan-500"       // 水 (수)
"bg-gradient-to-r from-emerald-500 to-green-500"   // 기타
```

---

## 🎯 표준 Variant 정의

### 사주우주 디자인 시스템 기반

#### Primary Actions (주요 액션)
```typescript
primary: "bg-gradient-to-r from-purple-600 to-pink-600"
// 사용: CTA 버튼, 주요 액션, 폼 제출
// 예: "사주 분석 시작하기", "결제하기", "저장"
```

#### Secondary Actions (보조 액션)
```typescript
secondary: "bg-purple-50 text-purple-700 hover:bg-purple-100"
// 사용: 필터, 탭, 보조 버튼
// 예: "취소", "뒤로", "필터"
```

#### Outline (외곽선)
```typescript
outline: "border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
// 사용: 중립 액션, 토글
// 예: "더보기", "옵션"
```

#### Ghost (투명)
```typescript
ghost: "text-slate-700 hover:bg-slate-100"
// 사용: 아이콘 버튼, 미니멀 액션
// 예: 닫기(X), 메뉴, 설정
```

#### Danger/Destructive (위험)
```typescript
destructive: "bg-gradient-to-r from-red-600 to-rose-600 text-white"
// 사용: 삭제, 취소, 경고 액션
// 예: "삭제하기", "차단하기", "신고하기"
```

#### Success (성공)
```typescript
success: "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
// 사용: 확인, 완료, 성공 액션
// 예: "완료", "승인", "확인"
```

#### Element-based (오행 기반)
```typescript
wood: "bg-gradient-to-r from-amber-500 to-orange-500"    // 木
fire: "bg-gradient-to-r from-red-500 to-orange-500"      // 火
earth: "bg-gradient-to-r from-yellow-600 to-amber-600"   // 土
metal: "bg-gradient-to-r from-slate-400 to-gray-400"     // 金
water: "bg-gradient-to-r from-blue-500 to-cyan-500"      // 水
```

---

## 📏 Size System

```typescript
xs: "h-8 px-3 text-xs"      // 작은 배지, 미니 버튼
sm: "h-9 px-4 text-sm"      // 일반 텍스트 내 버튼
md: "h-10 px-6 text-base"   // 기본 버튼 (DEFAULT)
lg: "h-12 px-8 text-lg"     // 큰 CTA 버튼
xl: "h-14 px-10 text-xl"    // 히어로 섹션 CTA
```

---

## 🔄 마이그레이션 계획

### Phase 1: Button 컴포넌트 리팩터링
- [ ] `components/ui/button.tsx` 업데이트
  - 사주우주 디자인 시스템 variant 추가
  - 오행(Element) variant 추가
  - Size system 확장
  - isLoading, leftIcon, rightIcon 기능 추가

### Phase 2: Admin Button 통합
- [ ] `components/admin/ui/Button.tsx` 삭제
- [ ] Admin 페이지에서 `components/ui/button.tsx` 사용
- [ ] primary variant 색상만 admin 전용으로 유지

### Phase 3: 인라인 버튼 교체
**우선순위 High (20+ occurrences):**
- [ ] CTA 버튼 (`from-purple-500 to-pink-500`) → `variant="primary"`
- [ ] 활성 탭 (`from-violet-500 to-purple-500`) → `variant="primary" size="sm"`
- [ ] 필터 버튼 (`bg-purple-50`) → `variant="secondary"`

**우선순위 Medium (10-20 occurrences):**
- [ ] 오행 버튼들 → `variant="wood|fire|earth|metal|water"`
- [ ] Ghost 버튼들 → `variant="ghost"`

**우선순위 Low (<10 occurrences):**
- [ ] Destructive actions → `variant="destructive"`
- [ ] Success actions → `variant="success"`

---

## 📊 예상 효과

### 코드 감소
- 인라인 버튼 제거: ~200 lines
- Admin Button 삭제: 97 lines
- **총 감소:** ~300 lines

### 일관성 향상
- Before: 15+ 그라디언트 조합
- After: 11개 표준 variant
- **표준화율:** 100%

### 유지보수성
- Before: 50+ 개별 버튼 스타일
- After: 1개 컴포넌트
- **유지보수 포인트:** -98%

---

## 🎨 디자인 토큰

```typescript
// colors.ts (향후 Phase 1.4에서 생성 예정)
export const colors = {
  primary: {
    gradient: 'from-purple-600 to-pink-600',
    solid: 'purple-600',
    light: 'purple-50',
    text: 'purple-700',
  },
  elements: {
    wood: { gradient: 'from-amber-500 to-orange-500' },
    fire: { gradient: 'from-red-500 to-orange-500' },
    earth: { gradient: 'from-yellow-600 to-amber-600' },
    metal: { gradient: 'from-slate-400 to-gray-400' },
    water: { gradient: 'from-blue-500 to-cyan-500' },
  },
};
```

---

## ✅ Next Steps

1. **Step 1:** Button 컴포넌트 리팩터링 (이번 단계)
2. **Step 2:** 인라인 버튼 교체 (우선순위 High부터)
3. **Step 3:** Admin Button 통합 및 삭제
4. **Step 4:** Tailwind config 업데이트 (Phase 1.4와 연계)

---

생성일: 2025-11-17
다음 업데이트: Phase 1.3 완료 시
