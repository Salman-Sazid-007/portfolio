/* ============================================================
   MD Salman Sazid — Portfolio
   Vanilla JS · no dependencies
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------- Hero parallax (hoisted: used by scroll handler) ---------------- */
  function dropParallax(y) {
    const el = document.getElementById('heroTilt');
    if (!el || prefersReduced || window.innerWidth < 981) return;
    el.style.setProperty('--py', Math.min(y * 0.03, 30) + 'px');
  }

  /* ---------------- Theme ---------------- */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  const storedTheme = (() => {
    try { return localStorage.getItem('ss-theme'); } catch (e) { return null; }
  })();
  const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = storedTheme || (systemLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initialTheme);
  const themeColorMeta = $('meta[name="theme-color"]');
  const syncThemeColor = () => {
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', root.getAttribute('data-theme') === 'light' ? '#f6f8fc' : '#070b14');
    }
  };
  syncThemeColor();

  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ss-theme', next); } catch (e) { /* ignore */ }
    syncThemeColor();
    particles.rebuild();
  });

  /* ---------------- Preloader ---------------- */
  const preloader = $('#preloader');
  const hidePreloader = () => {
    preloader?.classList.add('done');
    document.body.classList.remove('is-locked');
    setTimeout(() => preloader?.remove(), 800);
  };
  document.body.classList.add('is-locked');
  window.addEventListener('load', () => setTimeout(hidePreloader, 450));
  // Safety net in case load never fires
  setTimeout(hidePreloader, 3200);

  /* ---------------- Scroll progress + nav state ---------------- */
  const progress = $('#scrollProgress');
  const navWrap = $('.nav-wrap');
  const toTop = $('#toTop');

  const onScroll = () => {
    try {
      const st = window.scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (st / h) * 100 : 0;
      if (progress) progress.style.width = pct + '%';
      navWrap?.classList.toggle('scrolled', st > 24);
      toTop?.classList.toggle('show', st > 600);
      dropParallax(st);
    } catch (e) { /* never let scroll handling break the page */ }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  /* ---------------- Mobile menu ---------------- */
  const burger = $('#burger');
  const navLinks = $('#navLinks');
  const closeMenu = () => {
    navLinks?.classList.remove('open');
    burger?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
  };
  burger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-link').forEach((a) => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });

  /* ---------------- Active nav link ---------------- */
  const sections = $$('main section[id]');
  const links = $$('.nav-link');
  const spy = () => {
    const y = window.scrollY + window.innerHeight * 0.32;
    let current = sections[0]?.id;
    sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = $$('[data-reveal]');
  revealEls.forEach((el) => {
    const d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--d', d + 'ms');
  });

  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => revealIO.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------------- Count-up numbers ---------------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1500;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    if (prefersReduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
    requestAnimationFrame(step);
  };

  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => countIO.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------------- Typewriter ---------------- */
  const typeEl = $('#typewriter');
  const phrases = [
    'Mobile App Developer',
    'React Native Specialist',
    'JavaScript Developer',
    'E-Commerce App Builder'
  ];
  if (typeEl) {
    if (prefersReduced) {
      typeEl.textContent = phrases[0];
    } else {
      let p = 0, i = 0, deleting = false;
      const tick = () => {
        const word = phrases[p];
        typeEl.textContent = word.slice(0, i);
        if (!deleting && i < word.length) {
          i++; setTimeout(tick, 62);
        } else if (!deleting && i === word.length) {
          deleting = true; setTimeout(tick, 1700);
        } else if (deleting && i > 0) {
          i--; setTimeout(tick, 30);
        } else {
          deleting = false; p = (p + 1) % phrases.length; setTimeout(tick, 320);
        }
      };
      setTimeout(tick, 900);
    }
  }

  /* ---------------- Skill bars ---------------- */
  const bars = $$('.skill-bar');
  if ('IntersectionObserver' in window) {
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const fill = $('.sb-fill', e.target);
        if (fill) fill.style.width = (e.target.dataset.level || 0) + '%';
        barIO.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => barIO.observe(b));
  } else {
    bars.forEach((b) => { const f = $('.sb-fill', b); if (f) f.style.width = b.dataset.level + '%'; });
  }

  /* ---------------- Timeline line ---------------- */
  const timeline = $('.timeline');
  if (timeline) {
    if ('IntersectionObserver' in window) {
      const tlIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); tlIO.unobserve(e.target); } });
      }, { threshold: 0.05 });
      tlIO.observe(timeline);
    } else { timeline.classList.add('in'); }
  }

  /* ---------------- Project cards: in-view + filters + pointer glow ---------------- */
  const cards = $$('.project-card');
  if ('IntersectionObserver' in window) {
    const cardIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); cardIO.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    cards.forEach((c) => cardIO.observe(c));
  } else { cards.forEach((c) => c.classList.add('in')); }

  const filterBtns = $$('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hide', !show);
      });
    });
  });

  if (!isTouch) {
    cards.forEach((card) => {
      card.addEventListener('pointermove', (ev) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((ev.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((ev.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------------- 3D tilt ---------------- */
  const tiltEls = $$('.tilt');
  if (!isTouch && !prefersReduced) {
    tiltEls.forEach((el) => {
      const max = el.classList.contains('project-card') ? 6 : 10;
      el.addEventListener('pointermove', (ev) => {
        const r = el.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width - 0.5;
        const py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg)`;
        el.style.transition = 'transform .1s linear';
      });
      const reset = () => {
        el.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1)';
        el.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
      };
      el.addEventListener('pointerleave', reset);
      el.addEventListener('blur', reset);
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (!isTouch && !prefersReduced) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (ev) => {
        const r = btn.getBoundingClientRect();
        const x = (ev.clientX - r.left - r.width / 2) * 0.18;
        const y = (ev.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = `translate(${x}px, ${y - 2}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
        btn.style.transform = '';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ---------------- Custom cursor ---------------- */
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  if (dot && ring && !isTouch) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', (ev) => {
      mx = ev.clientX; my = ev.clientY;
      dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
    }, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx - 17}px, ${ry - 17}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverables = 'a, button, .project-card, .info-item, .chip, .tag, input, textarea, .skill-panel';
    document.addEventListener('pointerover', (ev) => {
      if (ev.target.closest(hoverables)) ring.classList.add('hover');
    });
    document.addEventListener('pointerout', (ev) => {
      if (ev.target.closest(hoverables)) ring.classList.remove('hover');
    });
  }

  /* ---------------- Toast + copy email ---------------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  $$('.copy-mail').forEach((el) => {
    el.addEventListener('click', async () => {
      const mail = el.dataset.mail || 'salmansazid70@gmail.com';
      try {
        await navigator.clipboard.writeText(mail);
        showToast('Email copied — ' + mail);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = mail;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showToast('Email copied — ' + mail); }
        catch (e2) { showToast('Email: ' + mail); }
        ta.remove();
      }
    });
  });

  /* ---------------- Contact form ---------------- */
  const form = $('#contactForm');
  form?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const fields = ['name', 'email', 'message'].map((id) => $('#' + id, form));
    let valid = true;
    fields.forEach((f) => {
      if (!f) return;
      const wrap = f.closest('.field');
      const ok = f.value.trim().length > 1 && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      wrap?.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) { showToast('Please fill in all fields correctly.'); return; }

    const name = $('#name', form).value.trim();
    const email = $('#email', form).value.trim();
    const message = $('#message', form).value.trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
    window.location.href = `mailto:salmansazid70@gmail.com?subject=${subject}&body=${body}`;
    showToast('Opening your email app…');
  });

  // Clear invalid state while typing
  $$('#contactForm input, #contactForm textarea').forEach((f) => {
    f.addEventListener('input', () => f.closest('.field')?.classList.remove('invalid'));
  });

  /* ---------------- Footer year ---------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Particles canvas ---------------- */
  const particles = (function () {
    const canvas = $('#particles');
    if (!canvas || prefersReduced) return { rebuild() {} };
    let ctx = null;
    try { ctx = canvas.getContext('2d'); } catch (e) { ctx = null; }
    if (!ctx) return { rebuild() {} };
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pts = [];
    let raf = null;
    let mouse = { x: -9999, y: -9999 };

    const palette = () => {
      const light = root.getAttribute('data-theme') === 'light';
      return light
        ? ['rgba(13,148,136,.55)', 'rgba(91,108,255,.45)', 'rgba(219,39,119,.35)']
        : ['rgba(94,234,212,.75)', 'rgba(124,140,255,.65)', 'rgba(255,122,198,.5)'];
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    function build() {
      const count = Math.min(88, Math.round((w * h) / 16000));
      const colors = palette();
      pts = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.7 + 0.5,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        c: colors[i % colors.length],
        a: Math.random() * 0.5 + 0.3
      }));
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;

        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          p.x += (dx / dist) * 0.55;
          p.y += (dy / dist) * 0.55;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 118) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = p.c;
            ctx.globalAlpha = (1 - d / 118) * 0.14;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', (ev) => { mouse.x = ev.clientX; mouse.y = ev.clientY; }, { passive: true });
    window.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', () => { clearTimeout(canvas._t); canvas._t = setTimeout(resize, 180); });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) draw();
    });

    resize();
    draw();

    return { rebuild: () => build() };
  })();

  /* ---------------- Smooth anchor scroll w/ offset ---------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------------- Konami-ish easter egg (type "hi") ---------------- */
  if (!prefersReduced) {
    let buf = '';
    window.addEventListener('keydown', (e) => {
      if (e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-12);
      if (buf.includes('sazid')) {
        document.body.animate(
          [{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(360deg)' }],
          { duration: 1800, easing: 'ease-in-out' }
        );
        showToast('👋 Thanks for stopping by!');
        buf = '';
      }
    });
  }
})();
