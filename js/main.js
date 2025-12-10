/**
 * 미리내약 랜딩 페이지 JavaScript
 * - 스크롤 애니메이션 (Intersection Observer)
 * - 플로팅 CTA 버튼
 * - 앱스토어 링크 분기
 */

(function () {
  'use strict';

  // ==================== UTM TRACKING ====================
  /**
   * UTM 파라미터를 파싱하여 세션 스토리지에 저장
   * 광고 채널별 유입 추적 (당근마켓, 인스타그램 등)
   */
  const UTMTracker = {
    // UTM 파라미터 목록
    params: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'],

    // URL에서 UTM 파라미터 추출
    parseUTM() {
      const urlParams = new URLSearchParams(window.location.search);
      const utmData = {};

      this.params.forEach((param) => {
        const value = urlParams.get(param);
        if (value) {
          utmData[param] = value;
        }
      });

      return Object.keys(utmData).length > 0 ? utmData : null;
    },

    // 세션 스토리지에 UTM 저장 (첫 방문 시에만)
    saveUTM() {
      const existingUTM = sessionStorage.getItem('utm_data');
      const currentUTM = this.parseUTM();

      // 새로운 UTM이 있으면 저장 (기존 데이터 덮어쓰기)
      if (currentUTM) {
        currentUTM.landing_time = new Date().toISOString();
        currentUTM.landing_page = window.location.pathname;
        sessionStorage.setItem('utm_data', JSON.stringify(currentUTM));
        return currentUTM;
      }

      // 기존 UTM 반환
      return existingUTM ? JSON.parse(existingUTM) : null;
    },

    // 저장된 UTM 데이터 가져오기
    getUTM() {
      const data = sessionStorage.getItem('utm_data');
      return data ? JSON.parse(data) : null;
    },

    // GA 이벤트에 UTM 정보 추가하여 전송
    sendEventWithUTM(eventName, eventParams = {}) {
      const utmData = this.getUTM();

      // UTM 데이터가 있으면 이벤트 파라미터에 추가
      const enrichedParams = { ...eventParams };
      if (utmData) {
        enrichedParams.utm_source = utmData.utm_source || '(direct)';
        enrichedParams.utm_medium = utmData.utm_medium || '(none)';
        enrichedParams.utm_campaign = utmData.utm_campaign || '(not set)';
        enrichedParams.utm_term = utmData.utm_term || '';
        enrichedParams.utm_content = utmData.utm_content || '';
        enrichedParams.traffic_source = utmData.utm_source || 'direct';
      } else {
        enrichedParams.traffic_source = 'direct';
      }

      // Google Analytics 이벤트 전송
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, enrichedParams);
      }
    },

    // 광고 소스별 레이블 반환 (한글)
    getSourceLabel() {
      const utmData = this.getUTM();
      if (!utmData) return '직접 유입';

      const sourceLabels = {
        daangn: '당근마켓',
        karrot: '당근마켓',
        instagram: '인스타그램',
        facebook: '페이스북',
        naver: '네이버',
        google: '구글',
      };

      const source = (utmData.utm_source || '').toLowerCase();
      return sourceLabels[source] || utmData.utm_source || '직접 유입';
    },
  };

  // 페이지 로드 시 UTM 저장 및 페이지뷰 이벤트 전송
  const savedUTM = UTMTracker.saveUTM();
  if (savedUTM) {
    console.log('%c📊 광고 유입 감지:', 'color: #3b82f6; font-weight: bold;', UTMTracker.getSourceLabel());
  }

  // 랜딩 페이지 방문 이벤트 (UTM 정보 포함)
  UTMTracker.sendEventWithUTM('page_view_landing', {
    event_category: 'engagement',
    event_label: 'landing_page_visit',
  });

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
        // Hero 섹션이 보이면 버튼 숨김, 안 보이면 표시
        floatingCTA.classList.toggle('visible', !entry.isIntersecting);
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
      // Google Analytics 이벤트 전송 (UTM 정보 포함)
      UTMTracker.sendEventWithUTM('click_floating_cta', {
        event_category: 'download',
        event_label: 'floating_cta_button',
      });
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
      // iOS 심사 중 - 팝업 표시
      showComingSoonModal();
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
      // Google Analytics 이벤트 전송 (UTM 정보 포함)
      UTMTracker.sendEventWithUTM('click_app_store', {
        event_category: 'download',
        event_label: 'ios_app_store_button',
        platform: 'ios',
      });
      // iOS 앱스토어 심사 중 - 팝업 표시
      showComingSoonModal();
    });
  }

  // ==================== COMING SOON MODAL ====================
  /**
   * iOS 앱스토어 출시 예정 팝업
   */
  function showComingSoonModal() {
    // 모달이 이미 있으면 표시만
    let modal = document.getElementById('coming-soon-modal');

    if (!modal) {
      // 모달 생성
      modal = document.createElement('div');
      modal.id = 'coming-soon-modal';
      modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="modal-backdrop">
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">곧 출시 예정입니다!</h3>
            <p class="text-slate-600 mb-6 leading-relaxed">
              iOS 앱이 현재 App Store 심사 중입니다.<br>
              조금만 기다려 주세요!
            </p>
            <div class="flex flex-col gap-3">
              <a href="https://play.google.com/store/apps/details?id=com.likeflameyungun.mirinae_drug_frontend" target="_blank"
                 class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Android 버전 다운로드
              </a>
              <button id="close-modal-btn" class="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                닫기
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // 닫기 버튼 이벤트
      document.getElementById('close-modal-btn').addEventListener('click', hideComingSoonModal);

      // 배경 클릭 시 닫기
      document.getElementById('modal-backdrop').addEventListener('click', (e) => {
        if (e.target.id === 'modal-backdrop') {
          hideComingSoonModal();
        }
      });

      // ESC 키로 닫기
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          hideComingSoonModal();
        }
      });
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 방지
  }

  function hideComingSoonModal() {
    const modal = document.getElementById('coming-soon-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // 스크롤 복원
    }
  }

  if (playStoreBtn) {
    playStoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Google Analytics 이벤트 전송 (UTM 정보 포함)
      UTMTracker.sendEventWithUTM('click_play_store', {
        event_category: 'download',
        event_label: 'google_play_store_button',
        platform: 'android',
      });
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
