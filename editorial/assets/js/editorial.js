/* ============================================================
   Salman Sazid — Editorial edition
   Minimal, dependency-free. Reveals + scroll affordances only.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---- footer year ---- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- tag content for reveal ---- */
  var targets = [
    ['.statement .lede', 0],
    ['.statement-grid', 90],
    ['.facts', 140],
    ['.entry', 0],
    ['.work-row', 0],
    ['.cap', 0],
    ['.closing-title', 0],
    ['.closing-grid', 90]
  ];

  targets.forEach(function (pair) {
    $$(pair[0]).forEach(function (el, i) {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', '');
        if (pair[1]) el.style.setProperty('--d', (pair[1] + i * 60) + 'ms');
        else if (i) el.style.setProperty('--d', (i * 60) + 'ms');
      }
    });
  });

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

  /* ---- smooth in-page links (respect reduced motion) ---- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      try { history.replaceState(null, '', id); } catch (e) {}
    });
  });

  /* ---- subtle pointer response on the portrait (desktop only) ---- */
  var subject = $('.subject img');
  var finePointer = false;
  try { finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
  if (subject && finePointer && !reduced) {
    var raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('pointermove', function (ev) {
      tx = (ev.clientX / window.innerWidth - 0.5) * 7;
      ty = (ev.clientY / window.innerHeight - 0.5) * 5;
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });

    function step() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      subject.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(step);
      } else {
        raf = null;
      }
    }
  }
})();
