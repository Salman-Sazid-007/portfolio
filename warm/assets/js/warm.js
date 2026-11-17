/* ============================================================
   Salman Sazid — Warm edition
   Dependency-free. Reveals, counters, chart, smooth anchors.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var hidden = false;
  try { hidden = document.hidden; } catch (e) {}

  var raf = typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : function (cb) { return window.setTimeout(function () { cb(Date.now()); }, 16); };
  var hasRaf = typeof window.requestAnimationFrame === 'function';

  /* ---------- footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- reveal on scroll ---------- */
  var items = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- projects: mark in-view for the drawing chart ---------- */
  var projects = $$('.project');
  if ('IntersectionObserver' in window && !reduced) {
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); pio.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    projects.forEach(function (p) { pio.observe(p); });
  } else {
    projects.forEach(function (p) { p.classList.add('in'); });
  }

  /* ---------- counters: always settle on the true value ---------- */
  function animateCount(el) {
    var target   = parseFloat(el.getAttribute('data-count') || '0');
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix   = el.getAttribute('data-suffix') || '';
    var label    = target.toFixed(decimals) + suffix;

    // Static environments (reduced motion, no rAF, background tab): just show it.
    if (reduced || !hasRaf || hidden) { el.textContent = label; return; }

    var dur = 1400;
    var start = null;
    var done = false;
    var settle = function () { el.textContent = label; };

    function step(now) {
      if (start === null) start = now;
      var t = Math.min(1, Math.max(0, (now - start) / dur));
      var eased = 1 - Math.pow(1 - t, 3);
      var v = target * eased;
      if (v < 0) v = 0;                       // never render a negative number
      el.textContent = v.toFixed(decimals) + suffix;
      if (t < 1) { raf(step); }
      else { done = true; settle(); }
    }

    raf(step);

    // Guarantees: hidden mid-tween, or rAF never fires again.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !done) { done = true; settle(); }
    });
    setTimeout(function () { if (!done) { done = true; settle(); } }, dur + 600);
  }

  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window && !reduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.45 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = parseFloat(el.getAttribute('data-count')).toFixed(
        parseInt(el.getAttribute('data-decimals') || '0', 10)
      ) + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- smooth in-page anchors ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var t = document.getElementById(id.slice(1));
      if (!t) return;
      ev.preventDefault();
      t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      try { history.replaceState(null, '', id); } catch (e) {}
    });
  });
})();
