/* ========================================
   IDR — Institute of Digital Risk
   JavaScript: nav, scroll, particles, form
   ======================================== */

(function () {
  'use strict';

  /* ---------- STICKY NAV ---------- */
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ---------- MOBILE NAV TOGGLE ---------- */
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ---------- ACTIVE NAV LINK ---------- */
  const sections = document.querySelectorAll('section[id]');

  const observerNavLinks = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active-nav',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: `-${header.offsetHeight}px 0px -60% 0px` });

  sections.forEach(s => observerNavLinks.observe(s));

  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Apply reveal classes dynamically
  const revealTargets = [
    { selector: '.about-text', delay: 0 },
    { selector: '.about-visual', delay: 1 },
    { selector: '.pillar-card', delay: 'stagger' },
    { selector: '.pipeline-step', delay: 'stagger' },
    { selector: '.community-card', delay: 'stagger' },
    { selector: '.contact-info', delay: 0 },
    { selector: '.contact-form-wrap', delay: 1 },
    { selector: '.section-heading.centered', delay: 0 },
    { selector: '.section-sub.centered', delay: 1 },
  ];

  revealTargets.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (delay === 'stagger') {
        el.classList.add(`reveal-delay-${(i % 5) + 1}`);
      } else if (delay > 0) {
        el.classList.add(`reveal-delay-${delay}`);
      }
      revealObserver.observe(el);
    });
  });

  /* ---------- PARTICLES ---------- */
  function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    // Prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1.5;
      const left = Math.random() * 100;
      const bottom = Math.random() * -20;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 10;
      const drift = (Math.random() - 0.5) * 80;
      const opacity = Math.random() * 0.4 + 0.1;

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: ${bottom}%;
        opacity: ${opacity};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --drift: ${drift}px;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = form.querySelector('#full-name').value.trim();
      const email = form.querySelector('#email').value.trim();

      if (!name || !email) {
        // Shake empty required fields
        if (!name) shakeField(form.querySelector('#full-name'));
        if (!email) shakeField(form.querySelector('#email'));
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        shakeField(form.querySelector('#email'));
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending…';

      setTimeout(() => {
        submitBtn.querySelector('.btn-text').textContent = 'Register Interest';
        submitBtn.disabled = false;
        successMsg.classList.add('show');
        form.reset();

        setTimeout(() => successMsg.classList.remove('show'), 6000);
      }, 1200);
    });
  }

  function shakeField(el) {
    el.style.borderColor = '#ef4444';
    el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(0)' }
    ], { duration: 350, easing: 'ease-in-out' });

    el.addEventListener('input', function resetStyle() {
      el.style.borderColor = '';
      el.style.boxShadow = '';
      el.removeEventListener('input', resetStyle);
    });
  }

  /* ---------- PILLAR CARD HOVER GLOW ---------- */
  document.querySelectorAll('.pillar-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `
        radial-gradient(
          200px circle at ${x}px ${y}px,
          rgba(232, 83, 10, 0.07),
          transparent 80%
        ),
        var(--dark-card)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ---------- COUNTER ANIMATION ---------- */
  function animateCounter(el, target, suffix = '') {
    const targetNum = parseInt(target);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetNum);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
          const raw = el.textContent;
          const num = parseInt(raw);
          const suffix = raw.replace(String(num), '');
          animateCounter(el, num, suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) statsObserver.observe(statsSection);

})();
