/**
 * Raphael Rodrigues Advocacia - Main JavaScript
 * Funcionalidades: loader, menu, scroll, animações, slider, contadores
 */

(function () {
  'use strict';

  /* ========== DOM Elements ========== */
  const loader = document.getElementById('loader');
  const header = document.getElementById('header'); // .site-header
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const scrollTopBtn = document.getElementById('scrollTop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const revealElements = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('.counter');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');
  const currentYearEl = document.getElementById('currentYear');

  /* ========== Loader ========== */
  function initLoader() {
    window.addEventListener('load', function () {
      setTimeout(function () {
        if (loader) {
          loader.classList.add('hidden');
        }
        document.body.classList.remove('no-scroll');
      }, 800);
    });

    // Fallback caso load demore
    setTimeout(function () {
      if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }
    }, 3000);
  }

  /* ========== Mobile Menu ========== */
  function initMobileMenu() {
    if (!hamburger || !mobileMenu) return;

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    function toggleMenu(open) {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      overlay.classList.toggle('active', isOpen);
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    }

    hamburger.addEventListener('click', function () {
      toggleMenu();
    });

    overlay.addEventListener('click', function () {
      toggleMenu(false);
    });

    document.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMenu(false);
      });
    });
  }

  /* ========== Sticky Header ========== */
  function initStickyHeader() {
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;

      if (scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = scrollY;
    }, { passive: true });
  }

  /* ========== Scroll to Top ========== */
  function initScrollTop() {
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========== Active Nav Link on Scroll ========== */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');

    function setActiveLink() {
      const scrollPos = window.scrollY + 150;

      sections.forEach(function (section) {
        const id = section.getAttribute('id');
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();
  }

  /* ========== Smooth Scroll ========== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 148;
          const top = target.offsetTop - headerHeight;

          window.scrollTo({
            top: top,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ========== Scroll Reveal ========== */
  function initScrollReveal() {
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ========== Animated Counters ========== */
  function initCounters() {
    if (!counters.length) return;

    let countersAnimated = false;

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            counters.forEach(animateCounter);
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.getElementById('estatisticas');
    if (statsSection) {
      counterObserver.observe(statsSection);
    }
  }

  /* ========== Accordion ========== */
  function initAccordion() {
    accordionItems.forEach(function (item) {
      const headerBtn = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');
      const isLegalor = item.closest('.accordion-legalor');
      if (!headerBtn) return;

      function syncLegalorBodyHeight(open) {
        if (!isLegalor || !body) return;
        if (open) {
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          body.style.maxHeight = '0';
        }
      }

      if (item.classList.contains('active')) {
        syncLegalorBodyHeight(true);
      }

      headerBtn.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        accordionItems.forEach(function (other) {
          other.classList.remove('active');
          const otherHeader = other.querySelector('.accordion-header');
          if (otherHeader) {
            otherHeader.setAttribute('aria-expanded', 'false');
          }
          const otherBody = other.querySelector('.accordion-body');
          if (otherBody && other.closest('.accordion-legalor')) {
            otherBody.style.maxHeight = '0';
          }
        });

        if (!isActive) {
          item.classList.add('active');
          headerBtn.setAttribute('aria-expanded', 'true');
          syncLegalorBodyHeight(true);
        } else if (body && isLegalor) {
          body.style.maxHeight = '0';
        }
      });
    });
  }

  /* ========== Testimonials Slider ========== */
  function initTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialsDots');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoplayInterval;

    // Criar dots
    if (dotsContainer) {
      cards.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', function () {
          goToSlide(i);
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];

    function goToSlide(index) {
      currentIndex = (index + cards.length) % cards.length;

      cards.forEach(function (card, i) {
        card.classList.toggle('active', i === currentIndex);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    startAutoplay();

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    // Touch swipe
    let touchStartX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }

      startAutoplay();
    }, { passive: true });
  }

  /* ========== Contact Form ========== */
  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome');
      const email = document.getElementById('email');
      const mensagem = document.getElementById('mensagem');
      let valid = true;

      [nome, email, mensagem].forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Simula envio (integrar com backend posteriormente)
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = 'Mensagem Enviada!';
        btn.style.background = '#27ae60';
        contactForm.reset();

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  /* ========== Newsletter Form ========== */
  function initNewsletterForm() {
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn = newsletterForm.querySelector('button');

      if (!input.value.trim()) return;

      const originalText = btn.textContent;
      btn.textContent = '✓';
      input.value = '';

      setTimeout(function () {
        btn.textContent = originalText;
      }, 2000);
    });
  }

  /* ========== Current Year ========== */
  function initCurrentYear() {
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
  }

  /* ========== Lazy Loading Enhancement ========== */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  /* ========== Case Studies Filter ========== */
  function initCasesFilter() {
    const filterBtns = document.querySelectorAll('#casesFilter button');
    const caseItems = document.querySelectorAll('.case-item');

    if (!filterBtns.length || !caseItems.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        caseItems.forEach(function (item) {
          const cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ========== Initialize All ========== */
  function init() {
    document.body.classList.add('no-scroll');
    initLoader();
    initMobileMenu();
    initStickyHeader();
    initScrollTop();
    initActiveNav();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initAccordion();
    initCasesFilter();
    initContactForm();
    initNewsletterForm();
    initCurrentYear();
    initLazyLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
