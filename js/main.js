/* ============================================
   Shaji N. Karun Foundation — Main Script
   ============================================ */

(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobile-overlay');
  const heroContent = document.querySelector('.hero-content');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const sections = document.querySelectorAll('.section, .hero');

  // --- Mobile Menu ---
  hamburger.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    overlay.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  // Close mobile menu on link click
  overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Header scroll state ---
  function updateHeader() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // --- Hero parallax fade ---
  function updateHeroFade() {
    if (!heroContent) return;
    var scroll = window.scrollY;
    var vh = window.innerHeight;
    var ratio = Math.min(scroll / (vh * 0.6), 1);
    heroContent.style.opacity = 1 - ratio;
    heroContent.style.transform = 'translateY(' + (scroll * 0.15) + 'px)';
  }

  // Throttled scroll handler
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateHeader();
        updateHeroFade();
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- Scroll Reveal via IntersectionObserver ---
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Active nav link highlighting ---
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // --- Carousels ---
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var prevBtn = carousel.querySelector('.carousel-btn--prev');
    var nextBtn = carousel.querySelector('.carousel-btn--next');
    var currentIndex = 0;
    var autoplayInterval;

    function getVisibleCount() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - getVisibleCount());
    }

    function updateTrack() {
      var visibleCount = getVisibleCount();
      var gap = 8;
      var containerWidth = carousel.clientWidth - 80; // subtract padding (2.5rem * 2 ≈ 80px)
      var oneSlide = (containerWidth - gap * (visibleCount - 1)) / visibleCount;
      var offset = currentIndex * (oneSlide + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      updateTrack();
    }

    function next() {
      if (currentIndex >= getMaxIndex()) {
        goTo(0);
      } else {
        goTo(currentIndex + 1);
      }
    }

    function prev() {
      if (currentIndex <= 0) {
        goTo(getMaxIndex());
      } else {
        goTo(currentIndex - 1);
      }
    }

    nextBtn.addEventListener('click', function () {
      next();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', function () {
      prev();
      resetAutoplay();
    });

    function startAutoplay() {
      autoplayInterval = setInterval(next, 3500);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', function () {
      clearInterval(autoplayInterval);
    });

    carousel.addEventListener('mouseleave', function () {
      startAutoplay();
    });

    // Recalculate on resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
        updateTrack();
      }, 150);
    });

    // Init
    updateTrack();
    if (!reducedMotion) startAutoplay();
  });

  // Initial state
  updateHeader();
})();
