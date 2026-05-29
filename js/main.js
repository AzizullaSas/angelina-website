/* =============================================================
   Angelina — site interactions (vanilla JS, no dependencies)
   ============================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ambientOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches &&
                  window.matchMedia('(min-width: 768px)').matches;

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------------------------------------------------------
     Sticky nav: add .scrolled past a threshold (rAF-throttled)
     --------------------------------------------------------- */
  var nav = document.getElementById('site-nav');
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (nav) { nav.classList.toggle('scrolled', window.scrollY > 80); }
        updateFloat();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.setAttribute('data-open', open ? 'true' : 'false');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(nav.getAttribute('data-open') !== 'true');
    });
  }
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setMenu(false); }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.getAttribute('data-open') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------------------------------------------------------
     Scroll-reveal
     --------------------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // gentle stagger for siblings entering together
          var delay = Math.min(i * 80, 320);
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { revObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     Scroll-spy: highlight the active nav link
     --------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var linkById = {};
  navLinks.forEach(function (a) {
    var id = a.getAttribute('href').replace('#', '');
    linkById[id] = a;
  });
  var spySections = Object.keys(linkById)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && spySections.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
          var active = linkById[entry.target.id];
          if (active) { active.setAttribute('aria-current', 'true'); }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spySections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------------------------------------------------------
     Hero particles (decorative; only meaningful under the CSS gate)
     --------------------------------------------------------- */
  var particles = document.getElementById('particles');
  if (particles && ambientOK) {
    var COUNT = 16;
    for (var i = 0; i < COUNT; i++) {
      var s = document.createElement('span');
      var size = 2 + Math.random() * 4;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.setProperty('--dur', (14 + Math.random() * 9) + 's');
      s.style.animationDelay = (Math.random() * 14) + 's';
      particles.appendChild(s);
    }
  }

  /* ---------------------------------------------------------
     Gallery lightbox
     --------------------------------------------------------- */
  var galleryBtns = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCount = document.getElementById('lightbox-count');
  var lbItems = galleryBtns.map(function (b) {
    return { src: b.getAttribute('data-full'), alt: b.getAttribute('data-alt') || '' };
  });
  var lbIndex = 0;
  var lastFocused = null;

  function showLb(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    var item = lbItems[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    if (lbCount) { lbCount.textContent = (lbIndex + 1) + ' / ' + lbItems.length; }
    // preload neighbours
    [lbIndex + 1, lbIndex - 1].forEach(function (n) {
      var img = new Image();
      img.src = lbItems[(n + lbItems.length) % lbItems.length].src;
    });
  }
  function openLb(i) {
    lastFocused = document.activeElement;
    showLb(i);
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = lightbox.querySelector('.lightbox__close');
    if (closeBtn) { closeBtn.focus(); }
  }
  function closeLb() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
    if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
  }
  galleryBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { openLb(i); });
  });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      var action = e.target.closest('[data-action]');
      if (action) {
        var a = action.getAttribute('data-action');
        if (a === 'close') { closeLb(); }
        if (a === 'next') { showLb(lbIndex + 1); }
        if (a === 'prev') { showLb(lbIndex - 1); }
        return;
      }
      if (e.target === lightbox) { closeLb(); } // click backdrop
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Escape') { closeLb(); }
      else if (e.key === 'ArrowRight') { showLb(lbIndex + 1); }
      else if (e.key === 'ArrowLeft') { showLb(lbIndex - 1); }
      else if (e.key === 'Tab') {
        // simple focus trap among the lightbox buttons
        var focusable = lightbox.querySelectorAll('button');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // swipe
    var startX = 0;
    lightbox.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) { showLb(lbIndex + (dx < 0 ? 1 : -1)); }
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     Video facade: load + play only on click; single-play
     --------------------------------------------------------- */
  var activeVideo = null;
  Array.prototype.slice.call(document.querySelectorAll('.video-card__play')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.getAttribute('data-src');
      var frame = btn.closest('.video-card__frame');
      if (!frame || !src) return;
      var video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.setAttribute('playsinline', '');
      video.preload = 'metadata';
      video.addEventListener('play', function () {
        if (activeVideo && activeVideo !== video) { activeVideo.pause(); }
        activeVideo = video;
      });
      frame.innerHTML = '';
      frame.appendChild(video);
      var p = video.play();
      if (p && p.catch) { p.catch(function () {}); }
    });
  });

  /* ---------------------------------------------------------
     Offerings "Enquire" -> prefill the booking form
     --------------------------------------------------------- */
  var typeSelect = document.getElementById('f-type');
  var messageField = document.getElementById('f-message');
  var packageToType = {
    'Events & Galas': 'Corporate / Gala',
    'Private Celebration': 'Private celebration'
  };
  Array.prototype.slice.call(document.querySelectorAll('[data-package]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pkg = btn.getAttribute('data-package');
      if (messageField && !messageField.value) {
        messageField.value = 'Hi Angelina, I’d love to book the "' + pkg + '" for my event. Here are the details:\n';
      }
      if (typeSelect && packageToType[pkg]) {
        typeSelect.value = packageToType[pkg];
      }
    });
  });

  /* ---------------------------------------------------------
     Floating mobile Book button
     --------------------------------------------------------- */
  var bookFloat = document.getElementById('book-float');
  var hero = document.getElementById('hero');
  var booking = document.getElementById('booking');
  function updateFloat() {
    if (!bookFloat || !hero || !booking) return;
    if (nav && nav.getAttribute('data-open') === 'true') { bookFloat.classList.remove('is-visible'); return; }
    var pastHero = hero.getBoundingClientRect().bottom < 0;
    var bookingReached = booking.getBoundingClientRect().top < window.innerHeight;
    bookFloat.classList.toggle('is-visible', pastHero && !bookingReached);
  }
  updateFloat();

  /* ---------------------------------------------------------
     Booking form: validate, honeypot, loud-fail, submit
     --------------------------------------------------------- */
  var form = document.getElementById('booking-form');
  var status = document.getElementById('form-status');
  var PLACEHOLDER_ACTION = 'PASTE_YOUR_FORMSPREE_URL_HERE';

  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status is-visible is-' + type;
  }
  function showError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    var err = form.querySelector('[data-error-for="' + field.id + '"]');
    if (err) { err.textContent = msg; }
  }
  function clearError(field) {
    field.removeAttribute('aria-invalid');
    var err = form.querySelector('[data-error-for="' + field.id + '"]');
    if (err) { err.textContent = ''; }
  }

  function validate() {
    var ok = true;
    var required = [
      { el: document.getElementById('f-name'), msg: 'Please enter your name.' },
      { el: document.getElementById('f-email'), msg: 'Please enter your email.' },
      { el: document.getElementById('f-message'), msg: 'Please tell us a little about your event.' }
    ];
    required.forEach(function (r) {
      if (!r.el) return;
      if (!r.el.value.trim()) { showError(r.el, r.msg); ok = false; }
      else { clearError(r.el); }
    });
    var email = document.getElementById('f-email');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Please enter a valid email address.');
      ok = false;
    }
    return ok;
  }

  if (form) {
    // live-clear errors as the user types
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') { clearError(e.target); }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot — silently stop bots
      var hp = document.getElementById('f-company');
      if (hp && hp.value) { return; }

      if (!validate()) {
        setStatus('Please check the highlighted fields above.', 'error');
        return;
      }

      var action = form.getAttribute('action');

      // Form not connected yet: fail LOUD, never fake success.
      if (!action || action === PLACEHOLDER_ACTION) {
        setStatus('This form isn’t connected to email yet (see README step 3). In the meantime, please reach out using the email or WhatsApp links on this page — they work right now.', 'note');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          setStatus('Thank you! Your request has been sent — Angelina will be in touch soon.', 'success');
        } else {
          setStatus('Something went wrong sending the form. Please email us directly using the links on this page.', 'error');
        }
      }).catch(function () {
        setStatus('Could not send right now. Please email or WhatsApp us using the links on this page.', 'error');
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = originalText; }
      });
    });
  }
})();
