# Phase 1: UX Consistency Refactoring

## Phase 1.1: 백업 파일 정리 ✅ COMPLETED

## 🗑️ 삭제 대상 파일 (11개)

### 1. 명확한 백업 파일 (안전하게 삭제 가능)
- [ ] `app/page.tsx.backup` - 현재 page.tsx는 /main으로 리다이렉트만 함
- [ ] `app/page-clone.tsx` - 복제본
- [ ] `app/page-original-backup.tsx` - 원본 백업
- [ ] `app/dashboard/page-old2.tsx` - 구버전
- [ ] `app/main/page.tsx.bak` - 백업
- [ ] `app/layout-wooju.tsx` - 리브랜딩 전 레이아웃
- [ ] `app/globals-original-backup.css` - 원본 CSS 백업
- [ ] `app/globals-wooju.css` - 리브랜딩 CSS
- [ ] `components/layout/mobile-header.tsx.bak` - 헤더 백업
- [ ] `components/product-card-wooju.tsx.bak` - 카드 백업

### 2. 사용 중인 파일 (유지)
- [x] `components/product-card-wooju.tsx` - **현재 main/page.tsx에서 사용 중**
- [x] `lib/products-data-wooju.ts` - **현재 main/page.tsx에서 사용 중**

## ✅ 실행 계획

### Step 1: Git 상태 확인
```bash
git status
```

### Step 2: 백업 파일 삭제
```bash
# Windows (PowerShell)
Remove-Item app/page.tsx.backup
Remove-Item app/page-clone.tsx
Remove-Item app/page-original-backup.tsx
Remove-Item app/dashboard/page-old2.tsx
Remove-Item app/main/page.tsx.bak
Remove-Item app/layout-wooju.tsx
Remove-Item app/globals-original-backup.css
Remove-Item app/globals-wooju.css
Remove-Item components/layout/mobile-header.tsx.bak
Remove-Item components/product-card-wooju.tsx.bak
```

### Step 3: Git 커밋
```bash
git add .
git commit -m "chore: remove backup and unused files

- Remove 10 backup files (.bak, -backup, -clone, -old)
- Clean up codebase for better maintainability
- Keep only production files

Part of Phase 1.1: Cleanup backup files
Ref: UX_CONSISTENCY_AUDIT_REPORT.md"
```

## 📊 예상 효과

**Before**:
- 총 파일: 225개
- 백업 파일: 11개 (4.9%)
- 혼란도: High

**After**:
- 총 파일: 215개
- 백업 파일: 0개
- 혼란도: Low
- 레포지토리 크기: -50KB (예상)

## ⚠️ 주의사항

1. **.bak, -backup 파일은 Git history에 남아있음**
   - 필요 시 `git checkout <commit> -- <file>` 로 복구 가능

2. **product-card-wooju.tsx는 유지**
   - 현재 사용 중
   - 향후 product-card.tsx로 통합 예정 (Phase 1.3)

3. **products-data-wooju.ts는 유지**
   - 현재 사용 중
   - 향후 API로 대체 예정 (Phase 2.4)

---

## Phase 1.2: 네비게이션 통합 🔄 IN PROGRESS

### Step 1: MobileAppLayout 삭제 ✅ COMPLETED
```bash
# Deleted: components/layout/MobileAppLayout.tsx (328 lines)
# Reason: Unused, conflicts with MobileBottomNav
# Commit: 024d06f
```

### Step 2: PageHeader 컴포넌트 생성 ✅ COMPLETED

**Created:** `components/layout/PageHeader.tsx`

**Features:**
- 3-column responsive layout (Back | Title | Action)
- Sticky positioning (top-14, below MobileHeader)
- Gradient background (customizable)
- Mobile-optimized sizing
- Accessibility features (aria-labels)

**Usage Example:**
```tsx
<PageHeader
  icon={Users}
  title="FEED"
  description="팔로우한 사람들의 사주 소식 · 24개 게시물"
  onBack={() => window.history.back()}
  actionButton={<PageHeaderButton icon={Filter} onClick={toggleFilter} />}
/>
```

### Step 3: Replace duplicate headers ✅ COMPLETED

**Pages updated:**
- [x] app/feed/page.tsx - Replaced with PageHeader + Filter button
- [x] app/hype/page.tsx - Replaced with PageHeader + Daily limit indicator
- [x] app/match/page.tsx - Replaced with PageHeader + Conditional back/history logic
- [x] app/profile/page.tsx - Replaced with PageHeader + Settings button

**Impact:**
- Removed ~160 lines of duplicate code (40 lines × 4 pages)
- Enforced consistent header styling across all pages
- Single source of truth for page headers
- Easier maintenance and updates

---

## Phase 1.2: 네비게이션 통합 ✅ COMPLETED

**Summary:**
- Deleted MobileAppLayout.tsx (328 lines) - unused navigation system
- Created PageHeader.tsx component (150 lines)
- Replaced duplicate headers in 4 pages (removed ~160 lines)
- **Net Result:** -338 lines of code, improved maintainability

**Next Phase:** Phase 1.3 - 버튼 시스템 통일
