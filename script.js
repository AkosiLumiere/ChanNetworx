/* ==========================================================================
   Christian Abuyan — Portfolio
   Vanilla JS: navigation, theme toggle, scroll reveal, form validation
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'ca-portfolio-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', function () {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------------- Mobile hamburger nav ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---------------- Smooth scrolling ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  document.getElementById('scrollCue').addEventListener('click', function () {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  function setActiveLink() {
    const navHeight = document.getElementById('nav').offsetHeight;
    let currentId = sections[0].id;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 40;
      if (window.pageYOffset >= sectionTop) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------------- Back to top button ---------------- */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTop.classList.toggle('show', window.pageYOffset > 600);
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Nav background on scroll + scroll listeners ---------------- */
  const navEl = document.getElementById('nav');

  function onScroll() {
    navEl.style.boxShadow = window.pageYOffset > 10 ? '0 1px 0 var(--line)' : 'none';
    setActiveLink();
    toggleBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Contact form validation ---------------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const validators = {
    name: function (value) {
      return value.trim().length >= 2 ? '' : 'Please enter your name.';
    },
    email: function (value) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value.trim()) ? '' : 'Please enter a valid email address.';
    },
    subject: function (value) {
      return value.trim().length >= 3 ? '' : 'Please add a short subject.';
    },
    message: function (value) {
      return value.trim().length >= 10 ? '' : 'Message should be at least 10 characters.';
    }
  };

  function validateField(field) {
    const value = field.value;
    const errorEl = document.getElementById('err-' + field.name);
    const errorMsg = validators[field.name] ? validators[field.name](value) : '';

    field.closest('.form-row').classList.toggle('has-error', Boolean(errorMsg));
    if (errorEl) errorEl.textContent = errorMsg;

    return !errorMsg;
  }

  ['name', 'email', 'subject', 'message'].forEach(function (fieldName) {
    const field = form.elements[fieldName];
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.closest('.form-row').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successMsg.classList.remove('show');

    let isValid = true;
    ['name', 'email', 'subject', 'message'].forEach(function (fieldName) {
      const field = form.elements[fieldName];
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      const firstError = form.querySelector('.has-error input, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // No backend is wired up — this simulates a successful send.
    successMsg.classList.add('show');
    form.reset();

    setTimeout(function () {
      successMsg.classList.remove('show');
    }, 6000);
  });

})();
