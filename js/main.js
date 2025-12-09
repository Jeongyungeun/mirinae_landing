/**
 * 미리내약 랜딩 페이지 JavaScript
 * - 스크롤 애니메이션 (Intersection Observer)
 * - 플로팅 CTA 버튼
 * - 앱스토어 링크 분기
 */

(function () {
  'use strict';

  // ==================== DOM ELEMENTS ====================
  const floatingCTA = document.getElementById('floating-cta');
  const heroSection = document.getElementById('hero');
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const appStoreBtn = document.getElementById('app-store-btn');
  const playStoreBtn = document.getElementById('play-store-btn');

  // ==================== SCROLL ANIMATIONS ====================
  /**
   * Intersection Observer를 사용한 스크롤 애니메이션
   * 요소가 뷰포트에 들어오면 'visible' 클래스 추가
   */
  const observerOptions = {
    root: null, // 뷰포트 기준
    rootMargin: '0px 0px -100px 0px', // 하단 100px 전에 트리거
    threshold: 0.1, // 10% 보이면 트리거
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 한 번 애니메이션 후 관찰 중단 (성능 최적화)
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 모든 애니메이션 대상 요소 관찰 시작
  animatedElements.forEach((el) => {
    animationObserver.observe(el);
  });

  // ==================== FLOATING CTA BUTTON ====================
  /**
   * Hero 섹션을 지나면 플로팅 CTA 버튼 표시
   */
  const floatingCTAObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Hero 섹션이 보이면 버튼 숨김
          floatingCTA.classList.remove('visible');
          floatingCTA.classList.add('hidden');
        } else {
          // Hero 섹션이 안 보이면 버튼 표시
          floatingCTA.classList.remove('hidden');
          floatingCTA.classList.add('visible');
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    }
  );

  if (heroSection && floatingCTA) {
    floatingCTAObserver.observe(heroSection);

    // 플로팅 CTA 클릭 시 앱스토어로 이동
    floatingCTA.addEventListener('click', () => {
      redirectToAppStore();
    });
  }

  // ==================== APP STORE DETECTION ====================
  /**
   * 사용자의 디바이스를 감지하여 적절한 앱스토어로 리다이렉트
   */
  function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS 감지
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }

    // Android 감지
    if (/android/i.test(userAgent)) {
      return 'android';
    }

    // 기타 (데스크톱 등)
    return 'desktop';
  }

  /**
   * 앱스토어 URL
   */
  const appStoreURLs = {
    ios: 'https://apps.apple.com/app/id000000000', // App Store URL (출시 후 교체)
    android: 'https://play.google.com/store/apps/details?id=com.likeflameyungun.mirinae_drug_frontend',
  };

  /**
   * 디바이스에 맞는 앱스토어로 리다이렉트
   */
  function redirectToAppStore() {
    const device = detectDevice();

    if (device === 'ios') {
      window.open(appStoreURLs.ios, '_blank');
    } else if (device === 'android') {
      window.open(appStoreURLs.android, '_blank');
    } else {
      // 데스크톱: 다운로드 섹션으로 스크롤
      const downloadSection = document.getElementById('download');
      if (downloadSection) {
        downloadSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // 앱스토어 버튼 클릭 이벤트
  if (appStoreBtn) {
    appStoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(appStoreURLs.ios, '_blank');
    });
  }

  if (playStoreBtn) {
    playStoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(appStoreURLs.android, '_blank');
    });
  }

  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
  /**
   * 앵커 링크 클릭 시 부드러운 스크롤
   */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      // '#' 만 있는 경우 무시
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // ==================== NAVBAR SCROLL EFFECT (선택적) ====================
  /**
   * 스크롤 시 네비게이션 바 스타일 변경 (필요시 활성화)
   */
  // let lastScrollY = window.scrollY;
  //
  // window.addEventListener('scroll', () => {
  //   const navbar = document.getElementById('navbar');
  //   if (!navbar) return;
  //
  //   if (window.scrollY > 100) {
  //     navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-lg');
  //   } else {
  //     navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-lg');
  //   }
  //
  //   lastScrollY = window.scrollY;
  // });

  // ==================== PARALLAX EFFECT (선택적) ====================
  /**
   * 히어로 섹션 패럴랙스 효과 (성능 고려하여 기본 비활성화)
   */
  // window.addEventListener('scroll', () => {
  //   const scrolled = window.pageYOffset;
  //   const heroContent = document.querySelector('#hero .relative');
  //
  //   if (heroContent && scrolled < window.innerHeight) {
  //     heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
  //   }
  // });

  // ==================== LOADING ANIMATION ====================
  /**
   * 페이지 로드 완료 시 초기 애니메이션
   */
  window.addEventListener('load', () => {
    // 첫 번째 뷰포트의 요소들에 초기 애니메이션 적용
    document.body.classList.add('loaded');

    // Hero 섹션 요소들 순차적으로 애니메이션
    const heroElements = document.querySelectorAll('#hero .animate-on-scroll');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 100);
    });
  });

  // ==================== CONSOLE WELCOME MESSAGE ====================
  console.log(
    '%c미리내약 🌟',
    'font-size: 24px; font-weight: bold; color: #22c55e;'
  );
  console.log(
    '%c약사가 직접 추천하는 맞춤 영양제 서비스',
    'font-size: 14px; color: #64748b;'
  );
})();
