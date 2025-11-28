# 결제 후 사주 분석 플로우 가이드

## 📋 개요

결제 완료 후 사용자가 생년월일 정보를 입력하고, AI 기반 사주 분석을 받아 화려한 결과 페이지에서 확인할 수 있는 완전한 플로우입니다.

## 🔄 전체 플로우

```
1. 사주 콘텐츠 선택 및 결제
   ↓
2. 결제 성공 페이지 (/payment/success)
   ↓
3. 사주 정보 입력 (/saju/input/[orderId])
   ↓
4. AI 분석 처리 (/api/saju/analyze-purchase)
   ↓
5. 분석 결과 표시 (/saju/result/[analysisId])
   ↓
6. 공유 & 이미지 저장
```

## 📁 구현된 파일

### 1. 결제 성공 페이지
**파일**: `app/payment/success/page.tsx`

**변경사항**:
- "사주 정보 입력하기" 버튼 추가
- `/saju/input/${orderId}` 로 연결

### 2. 사용자 정보 입력 페이지
**파일**: `app/saju/input/[orderId]/page.tsx`

**수집 정보**:
- 이름 (필수)
- 생년월일: 년/월/일 (필수)
- 출생시간: 시/분 (선택)
- 성별 (필수)
- 음력/양력 선택 (필수)

**기능**:
- 유효성 검증
- 로딩 상태 표시
- 에러 처리
- API 호출 후 결과 페이지 리다이렉트

### 3. AI 분석 API
**파일**: `app/api/saju/analyze-purchase/route.ts`

**처리 과정**:
1. 결제 정보 검증 (`orderId`로 Payment 조회)
2. 결제 완료 상태 확인 (`status === 'done'`)
3. 음력/양력 변환 (lunar-javascript)
4. 사주팔자 계산 (년주/월주/일주/시주)
5. OpenAI GPT-4o-mini로 AI 분석 요청
6. 분석 결과 DB 저장 (SajuAnalysis 테이블)
7. `analysisId` 반환

**분석 내용**:
- 기본 성격 및 성향 (300자 이상)
- 연애운 및 인연 (300자 이상)
- 직업운 및 재물운 (300자 이상)
- 건강운 (200자 이상)
- 올해의 운세 (200자 이상)
- 조언 및 개선 방향 (200자 이상)

**Mock 모드**:
- OpenAI API 키가 없을 경우 자동으로 Mock 분석 생성
- 개발/테스트에 유용

### 4. 분석 조회 API (수정됨)
**파일**: `app/api/saju/analyses/[id]/route.ts`

**변경사항**:
- 인증 없이도 구매 기반 분석 조회 가능
- `isPremium && category === 'purchase'` 조건 추가
- 조회수 자동 증가

### 5. 결과 페이지
**파일**: `app/saju/result/[analysisId]/page.tsx`

**디자인 특징**:
- 그라데이션 배경 (purple-pink-blue)
- 카드 스타일 레이아웃
- Fixed 액션 바 (공유/저장 버튼)
- 반응형 디자인

**표시 정보**:
- 사주 헤더 (이름, 생년월일)
- 사주팔자 (년주/월주/일주/시주)
- 섹션별 분석 결과 (아이콘 포함)
- 생성 일시 및 푸터 정보

**기능**:
- 공유하기 (Web Share API / 클립보드 복사)
- 이미지로 저장 (html2canvas)

## 🧪 테스트 방법

### 1. 환경 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env

# 필수 환경 변수 설정
DATABASE_URL="your_database_url"
OPENAI_API_KEY="your_openai_key"  # 또는 Mock 모드로 테스트

# Mock 모드로 테스트 (OpenAI 키 없이)
# .env에서 OPENAI_API_KEY를 주석 처리하면 자동으로 Mock 분석 생성
```

### 2. 개발 서버 실행

```bash
cd sajuwooju-enterprise-simplified
npm install
npm run dev
```

### 3. 수동 테스트

#### Step 1: 결제 데이터 준비
데이터베이스에 테스트 결제 데이터를 직접 삽입하거나, 실제 결제 프로세스를 거칩니다.

```sql
-- 테스트용 결제 데이터 예시
INSERT INTO payments (
  id, orderId, status, amount, orderName,
  customerName, productId, createdAt, updatedAt
) VALUES (
  'test-payment-id',
  'ORDER-TEST-001',
  'done',
  39000,
  '2025년 신년운세',
  '홍길동',
  'product-id',
  NOW(),
  NOW()
);
```

#### Step 2: 정보 입력 페이지 접속
```
http://localhost:3000/saju/input/ORDER-TEST-001
```

#### Step 3: 정보 입력
- 이름: 홍길동
- 생년월일: 1990년 1월 1일
- 출생시간: 14시 30분 (선택)
- 성별: 남성
- 양력 선택

#### Step 4: 분석 시작
"AI 사주 분석 시작" 버튼 클릭

#### Step 5: 결과 확인
자동으로 `/saju/result/[analysisId]` 페이지로 리다이렉트

#### Step 6: 기능 테스트
- 공유하기 버튼 클릭
- 이미지로 저장 버튼 클릭

### 4. API 테스트

#### 분석 API 직접 호출
```bash
curl -X POST http://localhost:3000/api/saju/analyze-purchase \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER-TEST-001",
    "name": "홍길동",
    "birthYear": "1990",
    "birthMonth": "1",
    "birthDay": "1",
    "birthHour": "14",
    "birthMinute": "30",
    "gender": "male",
    "solarCalendar": true
  }'
```

#### 분석 조회 API
```bash
curl http://localhost:3000/api/saju/analyses/[analysisId]
```

## 📊 데이터베이스 스키마

### SajuAnalysis 테이블
```prisma
model SajuAnalysis {
  id          String   @id @default(uuid())
  userId      String   // 사용자 ID (또는 'anonymous')

  // 분석 정보
  category    String   // 'purchase' (결제 기반)
  title       String?  // 분석 제목

  // 생년월일 정보
  birthDate   DateTime
  birthTime   String?  // 출생 시간 (HH:mm)
  isLunar     Boolean  // 음력 여부
  gender      String?  // 성별

  // 사주팔자
  yearPillar  String?  // 년주
  monthPillar String?  // 월주
  dayPillar   String?  // 일주
  hourPillar  String?  // 시주

  // 분석 결과 (JSON)
  result      Json

  // 메타데이터
  visibility  String   @default("private")
  viewCount   Int      @default(0)
  isPremium   Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### result JSON 구조
```json
{
  "analysis": "마크다운 형식의 분석 결과 전체",
  "name": "홍길동",
  "birthInfo": {
    "year": "1990",
    "month": "1",
    "day": "1",
    "hour": "14",
    "minute": "30",
    "calendar": "solar"
  },
  "sajuPillars": {
    "yearPillar": "庚午",
    "monthPillar": "戊寅",
    "dayPillar": "甲子",
    "hourPillar": "辛未"
  },
  "generatedAt": "2025-01-20T10:30:00.000Z"
}
```

## 🎨 UI/UX 특징

### 색상 팔레트
- **배경**: Gradient (purple-50 → pink-50 → blue-50)
- **카드**: White with shadow-xl
- **헤더**: Gradient (purple-600 → pink-600 → blue-600)
- **버튼**: Gradient (blue-600 → purple-600)

### 아이콘 매칭
- 성격/성향: User
- 연애/인연: Heart
- 직업/재물: Briefcase
- 건강: Activity
- 운세: TrendingUp
- 조언: Star
- 기본: Sparkles

### 반응형 디자인
- Mobile: 1 column
- Tablet: 2 columns (사주팔자)
- Desktop: 4 columns (사주팔자)

## 🔧 문제 해결

### 1. OpenAI API 오류
**증상**: 분석이 실패하거나 Mock 결과가 나옴
**해결**:
- `.env` 파일에 `OPENAI_API_KEY` 확인
- OpenAI 계정 크레딧 확인
- Mock 모드로 테스트 진행

### 2. 결제 정보 없음
**증상**: "결제 정보를 찾을 수 없습니다" 에러
**해결**:
- `orderId`가 정확한지 확인
- Payment 테이블에 해당 주문 존재 확인
- `status`가 'done' 인지 확인

### 3. 날짜 변환 오류
**증상**: "올바른 날짜를 입력해주세요" 에러
**해결**:
- 유효한 날짜인지 확인 (2월 30일 등)
- 년/월/일 형식 확인

### 4. 이미지 저장 실패
**증상**: 이미지 다운로드 버튼 클릭 시 아무 동작 없음
**해결**:
- 브라우저 콘솔 확인
- html2canvas 라이브러리 로드 확인
- 팝업 차단 설정 확인

## 📚 참고 라이브러리

- **lunar-javascript**: 음력/양력 변환
- **html2canvas**: HTML을 이미지로 변환
- **lucide-react**: 아이콘 라이브러리
- **OpenAI SDK**: AI 분석

## 🚀 배포 시 체크리스트

- [ ] 환경 변수 설정 (Vercel/배포 플랫폼)
  - [ ] DATABASE_URL
  - [ ] OPENAI_API_KEY
  - [ ] NEXT_PUBLIC_SITE_URL
- [ ] 데이터베이스 마이그레이션
- [ ] 결제 시스템 연동 테스트
- [ ] 전체 플로우 E2E 테스트
- [ ] 모바일 반응형 테스트
- [ ] 이미지 저장/공유 기능 테스트
- [ ] 성능 최적화 (이미지 압축, 로딩 속도)

## 💡 개선 아이디어

### 단기
1. 분석 결과 PDF 다운로드 추가
2. 카카오톡 공유 기능 추가
3. 분석 결과 저장 및 재열람 기능
4. 음력 날짜 선택 UI 개선

### 중기
1. 분석 결과 템플릿 다양화
2. 궁합 분석 (2인 비교)
3. 연간/월간 운세 자동 업데이트
4. 사용자 프로필에 분석 히스토리 표시

### 장기
1. AI 모델 커스터마이징 (사주 전문 fine-tuning)
2. 실시간 사주 상담 챗봇
3. 사용자 커뮤니티 기능
4. 전문가 검증 서비스

---

**작성일**: 2025-11-21
**버전**: 1.0.0
**상태**: ✅ 구현 완료
