/* ============================================================
   ChampionshipsGuide.com — Main JavaScript v2.0
   Navigation, Animations, Interactions, Counter animations
   ============================================================ */

(function() {
  'use strict';

  /* ---------- Navigation ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var mobileMenu = document.querySelector('.nav__mobile');

  // Scroll effect with throttle
  var lastScroll = 0;
  var ticking = false;

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  }, { passive: true });

  handleNavScroll();

  // Mobile toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function() {
      var isActive = toggle.classList.contains('active');
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', !isActive);
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
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
      threshold: 0.08,
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

  /* ---------- Counter Animation ---------- */
  var statNumbers = document.querySelectorAll('.stat-card__number');

  function animateCounter(el) {
    var text = el.textContent.trim();
    var suffix = text.replace(/[\d,.]/g, '');
    var target = parseInt(text.replace(/[^\d]/g, ''), 10);

    if (isNaN(target)) return;

    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = text;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(el) {
      counterObserver.observe(el);
    });
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item__question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-item__answer');
      var icon = btn.querySelector('.faq-item__icon');
      var isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('active');
        i.querySelector('.faq-item__answer').style.maxHeight = null;
        i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if it was closed)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
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
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            } else {
              card.style.opacity = '0';
              card.style.transform = 'scale(0.95)';
              setTimeout(function() {
                if (card.style.opacity === '0') card.style.display = 'none';
              }, 250);
            }
          });
        }
      });
    });
  });

  /* ---------- Smooth Anchor Scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
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

  /* ---------- Card tilt on hover (desktop only) ---------- */
  if (window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -3;
        var rotateY = (x - centerX) / centerX * 3;
        card.style.transform = 'translateY(-6px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Score meter animation ---------- */
  if ('IntersectionObserver' in window) {
    var meters = document.querySelectorAll('.score-meter__fill');
    if (meters.length) {
      var meterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var fill = entry.target;
            var width = fill.getAttribute('data-width') || fill.style.width;
            fill.style.width = '0%';
            requestAnimationFrame(function() {
              fill.style.width = width;
            });
            meterObserver.unobserve(fill);
          }
        });
      }, { threshold: 0.3 });

      meters.forEach(function(m) { meterObserver.observe(m); });
    }
  }

})();
