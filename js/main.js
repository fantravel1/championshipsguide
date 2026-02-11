/* ============================================================
   ChampionshipsGuide.com — Main JavaScript
   Navigation, Animations, Interactions
   ============================================================ */

(function() {
  'use strict';

  /* ---------- Navigation ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');

  // Scroll effect
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll Animations ---------- */
  var animatedEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

  if ('IntersectionObserver' in window && animatedEls.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    animatedEls.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item__question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-item__answer');
      var isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('active');
        i.querySelector('.faq-item__answer').style.maxHeight = null;
      });

      // Open clicked (if it was closed)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Back to Top ---------- */
  var backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Filter Pills ---------- */
  document.querySelectorAll('.filter-row').forEach(function(row) {
    var pills = row.querySelectorAll('.filter-pill');
    pills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        pills.forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');

        var filterVal = pill.getAttribute('data-filter');
        var targetGrid = document.querySelector(pill.closest('.filter-row').getAttribute('data-target') || '.card-grid');

        if (targetGrid) {
          targetGrid.querySelectorAll('[data-category]').forEach(function(card) {
            if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });

  /* ---------- Smooth Anchor Scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight + 20 : 20;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Calendar Filter ---------- */
  var calendarFilters = document.querySelectorAll('[data-calendar-filter]');
  calendarFilters.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var sport = btn.getAttribute('data-calendar-filter');
      calendarFilters.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      document.querySelectorAll('.calendar-event').forEach(function(event) {
        if (sport === 'all' || event.getAttribute('data-sport') === sport) {
          event.style.display = '';
        } else {
          event.style.display = 'none';
        }
      });
    });
  });

  /* ---------- Lazy load images ---------- */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imgObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imgObserver.observe(img);
    });
  }

  /* ---------- Coming Soon Particles ---------- */
  var particleContainer = document.querySelector('.coming-soon-hero__particles');
  if (particleContainer) {
    for (var i = 0; i < 40; i++) {
      var particle = document.createElement('div');
      particle.classList.add('coming-soon-hero__particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 8 + 4) + 's';
      particle.style.animationDelay = (Math.random() * 6) + 's';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particleContainer.appendChild(particle);
    }
  }

})();
