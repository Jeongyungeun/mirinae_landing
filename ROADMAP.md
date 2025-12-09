# 미리내약 랜딩 페이지 개발 로드맵

## 프로젝트 개요
GitHub Pages에 배포할 영양제 추천 서비스 **"미리내약"** 랜딩 페이지

### 기술 스택
- HTML5
- **Tailwind CSS** (CDN)
- Vanilla JavaScript
- 반응형 디자인 (모바일 퍼스트)
- 스크롤 애니메이션 (Intersection Observer API)

---

## Phase 1: 프로젝트 셋업

### 1.1 폴더 구조 생성
```
mirinae_landing/
├── index.html
├── js/
│   └── main.js
├── images/
│   └── (플레이스홀더 이미지)
└── ROADMAP.md
```

### 1.2 기본 파일 생성
- [ ] index.html 기본 구조 (HTML5 보일러플레이트)
- [ ] Tailwind CSS CDN 연결
- [ ] main.js 기본 설정

### 1.3 Tailwind CDN 설정
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#2ECC71',
          'primary-dark': '#27AE60',
          secondary: '#3498DB',
          danger: '#E74C3C',
        },
        fontFamily: {
          sans: ['Pretendard', 'Noto Sans KR', 'sans-serif'],
        }
      }
    }
  }
</script>
```

### 1.4 SEO 메타 태그 설정
```html
<title>미리내약 - 약사가 추천하는 맞춤 영양제</title>
<meta name="description" content="운동하는 당신을 위한 맞춤 영양제 추천. 10년 경력 약사가 직접 분석해 드립니다.">
<meta property="og:title" content="미리내약 - 맞춤 영양제 추천">
<meta property="og:description" content="먹어야 하는 영양은 저희가 신경써 드리겠습니다">
```

---

## Phase 2: 디자인 시스템 (Tailwind 기반)

### 2.1 커스텀 컬러 팔레트
| 용도 | 색상 | Tailwind 클래스 |
|------|------|-----------------|
| 메인 (건강한 그린) | #2ECC71 | `bg-primary`, `text-primary` |
| 메인 다크 | #27AE60 | `bg-primary-dark` |
| 보조 (신뢰의 블루) | #3498DB | `bg-secondary`, `text-secondary` |
| 텍스트 다크 | #2C3E50 | `text-slate-800` |
| 텍스트 라이트 | #7F8C8D | `text-slate-500` |
| 배경 | #FFFFFF | `bg-white` |
| 배경 대체 | #F8F9FA | `bg-slate-50` |
| 위험/경고 | #E74C3C | `bg-danger`, `text-danger` |

### 2.2 타이포그래피
- 헤드라인: `text-3xl md:text-4xl lg:text-5xl font-bold`
- 서브헤드라인: `text-xl md:text-2xl font-semibold`
- 본문: `text-base md:text-lg leading-relaxed`

### 2.3 반응형 브레이크포인트 (Tailwind 기본값)
| 프리픽스 | 최소 너비 | 용도 |
|----------|----------|------|
| (기본) | 0px | 모바일 |
| `sm:` | 640px | 작은 태블릿 |
| `md:` | 768px | 태블릿 |
| `lg:` | 1024px | 데스크톱 |
| `xl:` | 1280px | 큰 데스크톱 |

---

## Phase 3: 섹션별 개발 (StoryBrand 7단계)

### 3.1 Hero 섹션
- [ ] 좌측 텍스트 + 우측 이미지 레이아웃
  - `flex flex-col lg:flex-row items-center`
- [ ] 헤드라인: "먹어야 하는 영양은 저희가 신경써 드리겠습니다"
- [ ] 서브 헤드라인: "당신은 이제 운동에만 신경쓰시면 됩니다"
- [ ] 배경 이미지 + 어두운 오버레이
  - `bg-cover bg-center relative`
  - `absolute inset-0 bg-black/50`
- [ ] 영양제 이미지 사선 오버랩
- [ ] 모바일 대응 (상하 배치)

### 3.2 문제 제기 섹션 (Problem)
- [ ] 제목: "이런 고민, 있으시죠?"
- [ ] 3가지 문제점 카드 그리드
  - `grid grid-cols-1 md:grid-cols-3 gap-6`
- [ ] 카드 내용:
  1. 외적: "영양제 종류가 너무 많아서 뭘 먹어야 할지 모르겠어요"
  2. 내적: "잘못 먹으면 오히려 해가 될까봐 불안해요"
  3. 철학적: "건강을 위해 노력하는데, 제대로 된 정보를 받을 자격이 있잖아요"
- [ ] 아이콘 + 텍스트 디자인
- [ ] fade-in 애니메이션 클래스

### 3.3 가이드 소개 섹션 (Guide)
- [ ] 제목: "약사가 직접 추천해 드립니다"
- [ ] 공감 메시지: "저도 처음엔 어떤 영양제를 먹어야 할지 막막했습니다"
- [ ] 권위 표시: "10년 경력 약사 / 수천 건의 상담 경험"
- [ ] 약사 프로필 이미지
  - `rounded-full w-32 h-32 object-cover`
- [ ] 자격증/경력 뱃지
  - `inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary`

### 3.4 계획 제시 섹션 (Plan)
- [ ] 제목: "3단계로 끝나는 맞춤 영양 설계"
- [ ] 3단계 프로세스 스텝퍼
  - `flex flex-col md:flex-row items-center justify-center gap-4`
- [ ] 단계 내용:
  1. "간단한 건강 설문 (30초)"
  2. "AI + 약사가 분석"
  3. "나만의 영양제 조합 추천"
- [ ] 스텝 인디케이터
  - `w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center`
- [ ] 화살표 연결선

### 3.5 행동 촉구 섹션 (Call to Action)
- [ ] 직접적 CTA 버튼
  - `bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full text-lg transition-all`
  - "지금 바로 시작하기"
- [ ] 전환적 CTA 버튼
  - `border-2 border-primary text-primary hover:bg-primary hover:text-white`
  - "먼저 어떤 영양제가 있는지 둘러보기"

### 3.6 실패 회피 섹션 (Failure)
- [ ] 배경: `bg-slate-900 text-white`
- [ ] 제목: "이대로 괜찮으신가요?"
- [ ] 경고 카드 리스트
  - "검증 안 된 정보로 엉뚱한 영양제 구매"
  - "비싼 돈 들여 효과 없는 조합"
  - "과다 복용으로 오히려 건강 악화"
- [ ] 경고 아이콘 (X 마크)
  - `text-danger`

### 3.7 성공 비전 섹션 (Success)
- [ ] 배경: `bg-gradient-to-br from-primary/5 to-secondary/5`
- [ ] 제목: "이렇게 달라질 수 있어요"
- [ ] 성공 포인트 리스트
  - "나에게 딱 맞는 영양제만 복용"
  - "불필요한 지출 절약"
  - "전문가의 지속적인 관리"
- [ ] 체크마크 아이콘
  - `text-primary`
- [ ] 고객 후기 카드 2-3개
  - `bg-white rounded-xl shadow-lg p-6`

### 3.8 Footer
- [ ] 배경: `bg-slate-800 text-white`
- [ ] 앱 다운로드 버튼
  - App Store / Play Store 아이콘
- [ ] 회사 정보
- [ ] 개인정보처리방침 링크
- [ ] SNS 링크 (선택)

---

## Phase 4: 인터랙션 개발

### 4.1 플로팅 CTA 버튼
- [ ] 스타일
  ```html
  <button class="fixed bottom-6 left-1/2 -translate-x-1/2
    bg-primary hover:bg-primary-dark text-white
    font-bold py-4 px-8 rounded-full shadow-2xl
    transition-all transform hover:scale-105
    opacity-0 translate-y-10"
    id="floating-cta">
    나에게 맞는 영양제 찾기
  </button>
  ```
- [ ] Hero 섹션 지나면 표시
- [ ] 클릭 시 앱스토어로 이동

### 4.2 스크롤 애니메이션
- [ ] 커스텀 CSS 클래스 추가
  ```html
  <style>
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease-out;
    }
    .animate-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
  ```
- [ ] Intersection Observer API 구현
- [ ] 각 섹션에 `animate-on-scroll` 클래스 적용

### 4.3 앱스토어 링크 분기
- [ ] User Agent 감지 함수
- [ ] iOS → App Store 링크
- [ ] Android → Play Store 링크
- [ ] Desktop → 선택 모달 또는 QR 코드

---

## Phase 5: 최적화 및 테스트

### 5.1 이미지 최적화
- [ ] WebP 포맷 적용
- [ ] `loading="lazy"` 속성 추가
- [ ] 플레이스홀더 이미지 준비
  - Hero 배경: Unsplash 운동 이미지
  - 영양제: SVG 일러스트
  - 프로필: 아바타 플레이스홀더

### 5.2 접근성 체크
- [ ] 버튼 최소 크기 44px
  - `min-h-[44px] min-w-[44px]`
- [ ] 색상 대비 확인
- [ ] alt 텍스트 추가
- [ ] aria 레이블 추가

### 5.3 성능 테스트
- [ ] Lighthouse 성능 점수 90+ 목표
- [ ] 모바일 가독성 확인
- [ ] 다양한 기기/브라우저 테스트

---

## Phase 6: 배포

### 6.1 GitHub Pages 설정
- [ ] 레포지토리 생성/설정
- [ ] GitHub Pages 활성화
- [ ] 커스텀 도메인 설정 (선택)

### 6.2 최종 점검
- [ ] 모든 링크 동작 확인
- [ ] 앱스토어 링크 연결 확인
- [ ] 크로스 브라우저 테스트

---

## 파일별 담당 영역

| 파일 | 담당 영역 |
|------|----------|
| `index.html` | HTML 구조, SEO 메타태그, Tailwind CDN 설정, 전체 레이아웃 |
| `js/main.js` | 플로팅 버튼, 스크롤 애니메이션, 앱스토어 분기 로직 |
| `images/` | 모든 이미지 리소스 |

---

## Tailwind 유틸리티 클래스 참고

### 자주 사용될 클래스 조합

**컨테이너**
```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**섹션 패딩**
```html
<section class="py-16 md:py-24">
```

**카드**
```html
<div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
```

**버튼 (Primary)**
```html
<button class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-all">
```

**버튼 (Secondary/Outline)**
```html
<button class="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-6 rounded-full transition-all">
```

---

## 예상 결과물

완성된 랜딩 페이지는 다음 기능을 포함합니다:

1. **Tailwind CSS 기반 모던 디자인**
2. **모바일 퍼스트 반응형 레이아웃**
3. **StoryBrand 7단계 기반 설득력 있는 구조**
4. **부드러운 스크롤 애니메이션**
5. **플랫폼별 앱스토어 자동 연결**
6. **SEO 최적화된 메타 태그**
7. **Lighthouse 90+ 성능 점수**

---

*마지막 업데이트: 2025-12-09*
