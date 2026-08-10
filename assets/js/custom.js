/* ============================================
   AZISEH BLESSING KIMASE — CUSTOM JS
   Premium Healthcare Portfolio Interactions
   ============================================ */

(function() {
  'use strict';

  // === AOS INITIALIZATION ===
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    delay: 0
  });

  // === STAT COUNTER ANIMATION ===
  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(function(counter) {
      if (counter.dataset.animated) return;
      var target = parseInt(counter.dataset.count, 10);
      var duration = 2000;
      var startTime = performance.now();

      function update(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }
      counter.dataset.animated = 'true';
      requestAnimationFrame(update);
    });
  }

  // Trigger counters when hero section is in view
  var statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

  // === SMOOTH SCROLL FOR NAV LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        var navCollapse = document.getElementById('navbarCollapse');
        if (navCollapse && navCollapse.classList.contains('show')) {
          navCollapse.classList.remove('show');
          toggleNavOverlay(false);
        }
      }
    });
  });

  // === MOBILE NAV OVERLAY ===
  var navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  function toggleNavOverlay(show) {
    if (show) {
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Mobile nav toggler
  var navToggler = document.querySelector('.navbar-toggler');
  var navCollapse = document.getElementById('navbarCollapse');

  if (navToggler && navCollapse) {
    navToggler.addEventListener('click', function() {
      var isOpen = navCollapse.classList.contains('show');
      if (isOpen) {
        navCollapse.classList.remove('show');
        toggleNavOverlay(false);
      } else {
        navCollapse.classList.add('show');
        toggleNavOverlay(true);
      }
    });

    navOverlay.addEventListener('click', function() {
      navCollapse.classList.remove('show');
      toggleNavOverlay(false);
    });
  }

  // === HEADER SCROLL EFFECT ===
  var header = document.querySelector('.header-fixed');
  window.addEventListener('scroll', function() {
    var currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.style.boxShadow = '0 2px 20px rgba(15, 33, 55, 0.06)';
      header.classList.add('scrolled');
    } else {
      header.style.boxShadow = 'none';
      header.classList.remove('scrolled');
    }
  });

  // === ACTIVE NAV LINK HIGHLIGHT ===
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function highlightNav() {
    var scrollPos = window.pageYOffset + 120;
    sections.forEach(function(section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
  highlightNav();

  // === SCROLL TO TOP BUTTON ===
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === GALLERY LIGHTBOX ===
  var lightbox = document.getElementById('galleryLightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var galleryItems = document.querySelectorAll('.gallery-item[data-gallery-index]');
  var galleryImages = [];
  var currentGalleryIndex = 0;

  // Collect all gallery images
  galleryItems.forEach(function(item) {
    var img = item.querySelector('img');
    if (img) {
      galleryImages.push(img.src);
    }
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    lightboxImage.src = galleryImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentGalleryIndex];
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentGalleryIndex];
  }

  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var index = parseInt(this.dataset.galleryIndex, 10);
      openLightbox(index);
    });
  });

  if (lightbox) {
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Close on backdrop click
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });

    // Swipe support for mobile
    var touchStartX = 0;
    var touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  // === CONTACT FORM HANDLING ===
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var originalText = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Message Sent!';
      btn.disabled = true;
      btn.style.background = '#10b981';
      btn.style.borderColor = '#10b981';
      setTimeout(function() {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // === TYPED.JS EFFECT (optional hero subtitle) ===
  if (typeof Typed !== 'undefined') {
    var typedEl = document.getElementById('typed-roles');
    if (typedEl) {
      new Typed('#typed-roles', {
        strings: [
          'Medical Virtual Assistant',
          'Healthcare Operations Pro',
          'Health & Wellness Copywriter',
          'Community Builder'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }
  }

  // === SCROLL REVEAL FADE-IN FOR CARDS ===
  var revealElements = document.querySelectorAll('.service-card, .project-card, .org-card, .testimonial-card, .blog-card, .process-card');
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

  // === RESPONSIVE NAV COLLAPSE ON RESIZE ===
  var mediaQuery = window.matchMedia('(min-width: 992px)');
  function handleResize(e) {
    if (e.matches && navCollapse) {
      navCollapse.classList.remove('show');
      toggleNavOverlay(false);
    }
  }
  mediaQuery.addEventListener('change', handleResize);

})();
