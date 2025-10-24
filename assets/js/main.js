/**
* Template Name: iConstruction
* Template URL: https://bootstrapmade.com/iconstruction-bootstrap-construction-template/
* Updated: Jul 27 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Normalize header nav links to root-absolute paths to avoid relative 404s
   * Skips when running via file:// to preserve local preview behavior
   */
  function normalizeHeaderNavLinks() {
    if (location.protocol === 'file:') return;
    document.querySelectorAll('#navmenu a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const isHash = href.startsWith('#');
      const isAbsoluteUrl = /^(?:[a-z]+:)?\/\//i.test(href);
      const isTelOrMail = href.startsWith('tel:') || href.startsWith('mailto:');
      const isAbsolutePath = href.startsWith('/');

      if (isHash || isAbsoluteUrl || isTelOrMail || isAbsolutePath) return;

      link.setAttribute('href', '/' + href.replace(/^\/+/, ''));
    });
  }
  window.addEventListener('DOMContentLoaded', normalizeHeaderNavLinks);

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Hero Video Cycling
   */
  function initHeroVideoCycling() {
    const heroVideos = document.querySelectorAll('.hero-video');
    if (heroVideos.length === 0) return;

    let currentVideoIndex = 0;
    const videoDuration = 8000; // 8 seconds per video

    function showNextVideo() {
      // Remove active class from current video
      heroVideos[currentVideoIndex].classList.remove('active');
      
      // Move to next video
      currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;
      
      // Add active class to next video
      heroVideos[currentVideoIndex].classList.add('active');
    }

    // Start cycling after a delay to let the first video play
    setTimeout(() => {
      setInterval(showNextVideo, videoDuration);
    }, videoDuration);
  }

  window.addEventListener("load", initHeroVideoCycling);

  /**
   * Before/After slider init
   * Expects markup:
   * <div class="ba-compare" data-ratio="0.625">
   *   <img class="ba-after" src="...">
   *   <img class="ba-before" src="...">
   *   <div class="ba-handle"></div>
   *   <div class="ba-grip"><i class="bi bi-arrows-expand"></i></div>
   *   <span class="ba-label before">Önce</span>
   *   <span class="ba-label after">Sonra</span>
   * </div>
   */
  function initBeforeAfter() {
    const components = document.querySelectorAll('.ba-compare');
    if (!components.length) return;

    components.forEach((wrap) => {
      const beforeImg = wrap.querySelector('.ba-before');
      const handle = wrap.querySelector('.ba-handle');
      const grip = wrap.querySelector('.ba-grip');
      if (!beforeImg || !handle) return;

      // Optional aspect ratio control via data-ratio
      const ratio = parseFloat(wrap.getAttribute('data-ratio'));
      if (!Number.isNaN(ratio) && ratio > 0) {
        wrap.style.paddingBottom = (ratio * 100) + '%';
      }

      let isDown = false;

      function setPosition(clientX) {
        const rect = wrap.getBoundingClientRect();
        let x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const pct = (x / rect.width) * 100;
        beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = pct + '%';
        if (grip) grip.style.left = pct + '%';
      }

      function down(e) {
        isDown = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setPosition(clientX);
      }

      function move(e) {
        if (!isDown) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setPosition(clientX);
      }

      function up() { isDown = false; }

      wrap.addEventListener('mousedown', down);
      wrap.addEventListener('touchstart', down, { passive: true });
      window.addEventListener('mousemove', move);
      window.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
    });
  }

  window.addEventListener('load', initBeforeAfter);

})();