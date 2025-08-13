(function () {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');

  // Mobile menu toggle
  if (menuToggle && header) {
    menuToggle.addEventListener('click', () => {
      const open = header.getAttribute('data-menu-open') === 'true';
      header.setAttribute('data-menu-open', String(!open));
      menuToggle.setAttribute('aria-expanded', String(!open));
    });
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.getAttribute('data-menu-open') === 'true') {
        header.setAttribute('data-menu-open', 'false');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  }

  // Smooth anchor scroll enhancement (respect reduced motion)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id.length === 1) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    setTimeout(() => { target.removeAttribute('tabindex'); }, 1000);
  });

  // IntersectionObserver: reveal on scroll
  const revealNodes = document.querySelectorAll('[data-reveal]');
  if (revealNodes.length) {
    const io = new IntersectionObserver((entries, ob) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          ob.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.16 });
    revealNodes.forEach((el) => io.observe(el));
  }

  // Simple accordion
  document.querySelectorAll('.accordion').forEach((acc) => {
    acc.addEventListener('click', (e) => {
      const btn = e.target.closest('.accordion-trigger');
      if (!btn) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) {
        if (expanded) panel.setAttribute('hidden', '');
        else panel.removeAttribute('hidden');
      }
    });

    // Keyboard toggle with Enter/Space
    acc.addEventListener('keydown', (e) => {
      const btn = e.target.closest('.accordion-trigger');
      if (!btn) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Forms: validation + async submit
  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
  }

  function setStatus(form, message, isError = false) {
    const status = form.querySelector('.form-status');
    if (status) {
      status.textContent = message || '';
      status.style.color = isError ? 'var(--brand-mandy)' : 'var(--neutral-700)';
    }
  }

  document.querySelectorAll('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(form, '');
      let valid = true;

      // Per-field checks
      const email = form.querySelector('input[type="email"]');
      if (email) {
        const hint = email.parentElement.querySelector('.field-hint');
        if (!validateEmail(email.value)) {
          valid = false;
          if (hint) hint.textContent = 'Enter a valid email.';
          email.setAttribute('aria-invalid', 'true');
          email.focus();
        } else {
          if (hint) hint.textContent = '';
          email.removeAttribute('aria-invalid');
        }
      }

      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          const hint = field.parentElement.querySelector('.field-hint');
          if (hint) hint.textContent = 'This field is required.';
          field.setAttribute('aria-invalid', 'true');
        } else {
          const hint = field.parentElement.querySelector('.field-hint');
          if (hint) hint.textContent = '';
          field.removeAttribute('aria-invalid');
        }
      });

      if (!valid) {
        setStatus(form, 'Please correct the highlighted fields.', true);
        return;
      }

      // Submit to Formspree (placeholder)
      try {
        const formData = new FormData(form);
        const res = await fetch(form.action, {
          method: form.method || 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (res.ok) {
          setStatus(form, 'Thanks! We’ll be in touch soon.');
          form.reset();
        } else {
          setStatus(form, 'Something went wrong. Try email instead?', true);
        }
      } catch (err) {
        setStatus(form, 'Network error. Try again or email us.', true);
      }
    });
  });

    // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
 
  // Dropdown menus (for Company)
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  function closeAllDropdowns() { dropdownToggles.forEach((btn) => btn.setAttribute('aria-expanded', 'false')); }
  if (dropdownToggles.length) {
    dropdownToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns();
        btn.setAttribute('aria-expanded', String(!expanded));
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { btn.setAttribute('aria-expanded', 'false'); btn.blur(); }
        if (e.key === 'ArrowDown') {
          btn.setAttribute('aria-expanded', 'true');
          const firstLink = btn.nextElementSibling && btn.nextElementSibling.querySelector('a');
          if (firstLink) firstLink.focus();
        }
      });
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.has-dropdown')) closeAllDropdowns(); });
  }
 
  // 3D Tilt + idle animation
  const allowMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches || root.hasAttribute('data-allow-motion');
  if (allowMotion) {
    const tiltElements = document.querySelectorAll('.tilt-card');
    if (tiltElements.length) {
      tiltElements.forEach((card) => {
        const rect = () => card.getBoundingClientRect();
        let rafId = null;
        card.__userActive = false;
 
        function setTransform(x, y) {
          const r = rect();
          const cx = x - r.left;
          const cy = y - r.top;
          const px = (cx / r.width) - 0.5;
          const py = (cy / r.height) - 0.5;
          const maxTilt = 20; // degrees (interactive)
          const rx = (-py * maxTilt).toFixed(2);
          const ry = (px * maxTilt).toFixed(2);
          card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
          card.style.setProperty('--glare-x', `${(px + 0.5) * 100}%`);
          card.style.setProperty('--glare-y', `${(py + 0.5) * 100}%`);
        }
 
        function reset() {
          card.classList.remove('is-tilting');
          card.classList.remove('is-idle-tilting');
          card.__userActive = false;
        }
 
        function onMove(e) {
          const p = e.touches ? e.touches[0] : e;
          if (!rafId) {
            rafId = requestAnimationFrame(() => {
              setTransform(p.clientX, p.clientY);
              rafId = null;
            });
          }
        }
 
        // User interaction
        card.addEventListener('pointerenter', () => { card.classList.add('is-tilting'); card.__userActive = true; });
        card.addEventListener('pointermove', (e) => { card.__userActive = true; onMove(e); });
        card.addEventListener('pointerleave', reset);
        card.addEventListener('touchstart', (e) => { card.classList.add('is-tilting'); card.__userActive = true; onMove(e); }, { passive: true });
        card.addEventListener('touchmove', (e) => { card.__userActive = true; onMove(e); }, { passive: true });
        card.addEventListener('touchend', reset);
 
        // Idle tilt animation
        let idleStart = performance.now();
        function idleLoop(now) {
          if (card.__userActive) return; // pause idle while user active
          const t = (now - idleStart) / 1000; // seconds
                   const idleX = Math.sin(t * 1) * 6; // deg
         const idleY = Math.cos(t * 2) * 6; // deg
          card.style.transform = `perspective(800px) rotateX(${idleX}deg) rotateY(${idleY}deg)`;
          card.classList.add('is-idle-tilting');
          requestAnimationFrame(idleLoop);
        }
        requestAnimationFrame(idleLoop);
      });
    }
  }
 
  // Carousel controls
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track || !prev || !next) return;
    const slideWidth = () => track.querySelector('.carousel-slide')?.getBoundingClientRect().width || 320;
    prev.addEventListener('click', () => { track.scrollBy({ left: -slideWidth() - 14, behavior: 'smooth' }); });
    next.addEventListener('click', () => { track.scrollBy({ left: slideWidth() + 14, behavior: 'smooth' }); });
  });
})(); 