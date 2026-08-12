/* ==========================================================================
   LEARN TO WORK SMARTER WITH AI — University Lecturer Edition
   app.js — lightweight client behaviour (no dependencies, static-site safe)
   - AI Sales Assistant: predefined local answers only (no external AI)
   - Sticky header state, mobile nav, mobile purchase bar, FAQ accordion
   - Reveal-on-scroll, frame backlight tracking, reduced-motion aware
   ========================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ss = window.sessionStorage;

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }

  /* ---------- footer year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- sticky header scroll state ---------- */
  var header = $('#header');
  function onScrollHeader() {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  on(window, 'scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- mobile nav drawer ---------- */
  var menuBtn = $('#menuBtn');
  var mobileNav = $('#mobileNav');
  function openMobileNav() {
    mobileNav.setAttribute('data-open', 'true');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    mobileNav.setAttribute('data-open', 'false');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  on(menuBtn, 'click', openMobileNav);
  $all('[data-close-mobile-nav]').forEach(function (el) { on(el, 'click', closeMobileNav); });
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.getAttribute('data-open') === 'true') {
      closeMobileNav();
      menuBtn.focus();
    }
  });

  /* ---------- smooth-scroll with sticky-header offset ---------- */
  $all('a[href^="#"]').forEach(function (a) {
    on(a, 'click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var offset = (header ? header.offsetHeight : 0) + 8;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      if (mobileNav.getAttribute('data-open') === 'true') closeMobileNav();
      window.scrollTo({ top: top, behavior: reducedMotion ? 'auto' : 'smooth' });
      // move focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- mobile sticky purchase bar (after hero exit) ---------- */
  var mobileBar = $('#mobileBar');
  var hero = $('.hero');
  function onScrollBar() {
    if (!hero || !mobileBar) return;
    var show = window.scrollY > (hero.offsetTop + hero.offsetHeight - 60);
    if (window.innerWidth < 768) {
      if (show) mobileBar.classList.add('is-visible');
      else mobileBar.classList.remove('is-visible');
    } else {
      mobileBar.classList.remove('is-visible');
    }
  }
  on(window, 'scroll', onScrollBar, { passive: true });
  on(window, 'resize', onScrollBar);
  onScrollBar();

  /* ---------- FAQ accordion (keyboard accessible) ---------- */
  var faqItems = $all('.faq__item');
  faqItems.forEach(function (item) {
    var btn = $('.faq__q', item);
    var ans = $('.faq__a', item);
    if (!btn || !ans) return;
    on(btn, 'click', function () {
      var open = item.getAttribute('data-open') === 'true';
      // close others (one open at a time for clarity)
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.setAttribute('data-open', 'false');
          var ob = $('.faq__q', other);
          var oa = $('.faq__a', other);
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (oa) oa.style.maxHeight = null;
        }
      });
      if (open) {
        item.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
        ans.style.maxHeight = null;
      } else {
        item.setAttribute('data-open', 'true');
        btn.setAttribute('aria-expanded', 'true');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---------- reveal-on-scroll ---------- */
  var reveals = $all('.reveal-on-scroll');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- frame backlight mouse tracking ---------- */
  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    $all('.frame--hover').forEach(function (frame) {
      on(frame, 'mousemove', function (e) {
        var r = frame.getBoundingClientRect();
        frame.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        frame.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }, { passive: true });
    });
  }

  /* ========================================================================
     AI SALES ASSISTANT — controlled predefined answers (no external AI)
     ======================================================================== */
  var ASSISTANT = {
    kb: null,
    kbLoading: false,
    kbLoaded: false,
    lastFocused: null
  };

  var assistantBtn = $('#assistantBtn');
  var assistantPanel = $('#assistantPanel');
  var assistantBody = $('#assistantBody');
  var assistantForm = $('#assistantForm');
  var assistantInput = $('#assistantInput');
  var assistantInvite = $('#assistantInvite');
  var inviteText = $('#inviteText');
  var inviteClose = $('#inviteClose');
  var starterChips = $('#starterChips');
  var askAssistantBtn = $('#askAssistantBtn');

  // Approved invitation messages (DOCX Section 1K)
  var INVITE_MESSAGES = [
    'I CAN ANSWER YOUR QUESTIONS.',
    'NEED HELP CHOOSING? ASK ME.',
    'QUESTIONS ABOUT THE GUIDE? ASK ME.',
    'READY TO LEARN MORE? I CAN HELP.'
  ];

  // Approved starter questions (DOCX Section 1K)
  var STARTERS = [
    'WHAT IS INSIDE THE GUIDE?',
    'IS THIS SUITABLE FOR A BEGINNER?',
    'HOW CAN THIS HELP ME SAVE REPEATED EFFORT?',
    'WHAT ARE THE 90+ PROMPT-TEMPLATES?',
    'WHAT IS LECTURERS\'S AI TOOLKITS?',
    'HOW DO I GET THE FREE LECTURERS\' AI TOOLKIT?',
    'HOW DO I BUY THE GUIDE?',
    'HOW WILL I RECEIVE THE GUIDE AFTER PAYMENT?',
    'HOW DOES THE REFERRAL PROGRAMME WORK?',
    'I NEED HELP BUILDING MY PERSONAL LECTURER AI SYSTEM.'
  ];

  // Visual starter subset shown as chips (first 4)
  var CHIPS = STARTERS.slice(0, 4);

  // Escalation / fallback constants
  var WHATSAPP_SUPPORT = 'https://wa.me/message/BS2I4XH5NM3CH1';
  var WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029VbDoGeyF1YlYCD3PCh3W';
  var SELAR_URL = 'https://selar.com/k7j717m263';
  var FALLBACK = 'I do not have an approved answer for that question. Would you like to continue this conversation with the Afrik Vine support team on WhatsApp?';

  function loadKB(cb) {
    if (ASSISTANT.kbLoaded) { cb(ASSISTANT.kb); return; }
    if (ASSISTANT.kbLoading) { return; }
    ASSISTANT.kbLoading = true;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './data/knowledge-base.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      ASSISTANT.kbLoading = false;
      if (xhr.status === 200) {
        try {
          ASSISTANT.kb = JSON.parse(xhr.responseText);
          ASSISTANT.kbLoaded = true;
          cb(ASSISTANT.kb);
        } catch (e) {
          cb(null);
        }
      } else {
        cb(null);
      }
    };
    xhr.send();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Normalise text for matching
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Match user input against approved intents (keyword / pattern scoring)
  function matchIntent(text) {
    if (!ASSISTANT.kb) return null;
    var q = norm(text);
    if (!q) return null;
    var intents = ASSISTANT.kb.approved_intents || [];
    var best = null;
    var bestScore = 0;
    intents.forEach(function (intent) {
      var score = 0;
      (intent.patterns || []).forEach(function (pat) {
        var p = norm(pat);
        if (!p) return;
        if (q.indexOf(p) >= 0) { score += 5; return; }
        // word-level overlap
        var pw = p.split(' ');
        var hit = 0;
        pw.forEach(function (w) { if (w.length > 2 && q.indexOf(w) >= 0) hit++; });
        if (hit > 0) score += (hit / pw.length) * 3;
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    // Require a minimum confidence
    if (bestScore >= 3) return best;
    return null;
  }

  function ctaHtml(cta, kind) {
    if (!cta) return '';
    var cls = 'btn-wa';
    var label = 'Continue on WhatsApp';
    if (kind === 'buy') { cls = 'btn-buy'; label = 'GET THE GUIDE FOR ₦7,700'; }
    if (kind === 'channel') { cls = 'btn-channel'; label = 'Join Official WhatsApp Channel'; }
    return '<a class="' + cls + '" href="' + escapeHtml(cta) + '" target="_blank" rel="noopener">' + label + '</a>';
  }

  function addMessage(text, who, ctaBlocks) {
    var div = document.createElement('div');
    div.className = 'msg msg--' + (who === 'user' ? 'user' : 'bot');
    var html = escapeHtml(text);
    if (ctaBlocks && ctaBlocks.length) {
      html += '<div class="msg__cta">' + ctaBlocks.join('') + '</div>';
    }
    div.innerHTML = html;
    assistantBody.appendChild(div);
    assistantBody.scrollTop = assistantBody.scrollHeight;
    return div;
  }

  function respond(text) {
    var matched = matchIntent(text);
    if (matched) {
      var blocks = [];
      if (matched.id === 'buy') {
        blocks.push(ctaHtml(SELAR_URL, 'buy'));
      } else if (matched.id === 'free_toolkit') {
        blocks.push(ctaHtml(WHATSAPP_CHANNEL, 'channel'));
      } else if (matched.id === 'referral') {
        blocks.push(ctaHtml(WHATSAPP_SUPPORT, 'wa'));
      } else if (matched.cta) {
        // generic cta from KB
        blocks.push(ctaHtml(matched.cta, matched.cta === WHATSAPP_CHANNEL ? 'channel' : (matched.cta === WHATSAPP_SUPPORT ? 'wa' : 'wa')));
      }
      addMessage(matched.answer, 'bot', blocks);
    } else {
      // Fallback + WhatsApp escalation
      var fb = '<div class="msg__cta">' +
        ctaHtml(WHATSAPP_SUPPORT, 'wa') +
        '</div>';
      var div = document.createElement('div');
      div.className = 'msg msg--bot';
      div.innerHTML = escapeHtml(FALLBACK) + fb;
      assistantBody.appendChild(div);
      assistantBody.scrollTop = assistantBody.scrollHeight;
    }
  }

  function greet() {
    if (assistantBody.children.length > 0) return;
    addMessage('Hello. I am the LECTURER GUIDE AI SALES ASSISTANT — an automated product, purchase and support assistant. I can answer questions about the University Lecturer Edition, the free WhatsApp Channel Toolkit, price, delivery and referral. How can I help?', 'bot');
  }

  function renderChips() {
    starterChips.innerHTML = '';
    CHIPS.forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      on(b, 'click', function () {
        handleUser(label);
      });
      starterChips.appendChild(b);
    });
  }

  function handleUser(text) {
    var t = (text || '').trim();
    if (!t) return;
    addMessage(t, 'user');
    assistantInput.value = '';
    // mark interaction so invitation stops
    markInteracted();
    // small delay for natural feel without fake typing
    if (reducedMotion) {
      ensureKBThenRespond(t);
    } else {
      setTimeout(function () { ensureKBThenRespond(t); }, 180);
    }
  }

  function ensureKBThenRespond(text) {
    loadKB(function (kb) {
      if (!kb) {
        // graceful failure: still offer WhatsApp, never break purchase route
        addMessage('I am having trouble loading my knowledge base right now. You can still buy the guide through Selar, or continue with a human on WhatsApp.', 'bot', [
          ctaHtml(SELAR_URL, 'buy'),
          ctaHtml(WHATSAPP_SUPPORT, 'wa')
        ]);
        return;
      }
      respond(text);
    });
  }

  function openAssistant() {
    ASSISTANT.lastFocused = document.activeElement;
    assistantPanel.setAttribute('data-open', 'true');
    assistantBtn.setAttribute('aria-expanded', 'true');
    assistantInvite.setAttribute('data-show', 'false');
    markInteracted();
    renderChips();
    greet();
    // focus the input
    setTimeout(function () { if (assistantInput) assistantInput.focus(); }, 50);
  }

  function closeAssistant() {
    assistantPanel.setAttribute('data-open', 'false');
    assistantBtn.setAttribute('aria-expanded', 'false');
    if (ASSISTANT.lastFocused && ASSISTANT.lastFocused.focus) {
      ASSISTANT.lastFocused.focus();
    } else {
      assistantBtn.focus();
    }
  }

  on(assistantBtn, 'click', function () {
    if (assistantPanel.getAttribute('data-open') === 'true') {
      closeAssistant();
    } else {
      openAssistant();
    }
  });
  on($('#assistantClose'), 'click', closeAssistant);
  on($('#assistantMin'), 'click', closeAssistant);
  on(assistantForm, 'submit', function (e) {
    e.preventDefault();
    handleUser(assistantInput.value);
  });
  if (askAssistantBtn) {
    on(askAssistantBtn, 'click', function () {
      openAssistant();
      // scroll to assistant area smoothly
      var rect = assistantPanel.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        assistantBtn.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });
  }
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && assistantPanel.getAttribute('data-open') === 'true') {
      closeAssistant();
    }
  });

  /* ---------- controlled periodic invitation (DOCX Section 1K) ---------- */
  function markInteracted() {
    try { ss.setItem('wsa_assistant_interacted', '1'); } catch (e) {}
    stopInvitation();
  }
  function wasInteracted() {
    try { return ss.getItem('wsa_assistant_interacted') === '1'; } catch (e) { return false; }
  }
  function getInviteCount() {
    try { return parseInt(ss.getItem('wsa_invite_count') || '0', 10); } catch (e) { return 0; }
  }
  function setInviteCount(n) {
    try { ss.setItem('wsa_invite_count', String(n)); } catch (e) {}
  }

  var inviteTimer = null;
  function scheduleNextInvite() {
    if (wasInteracted()) return;
    if (getInviteCount() >= 3) return;
    if (assistantPanel.getAttribute('data-open') === 'true') return;
    // random 20-25 seconds
    var delay = 20000 + Math.floor(Math.random() * 5000);
    inviteTimer = window.setTimeout(function () {
      showInvite();
    }, delay);
  }
  function showInvite() {
    if (wasInteracted()) return;
    if (getInviteCount() >= 3) return;
    if (assistantPanel.getAttribute('data-open') === 'true') return;
    var count = getInviteCount();
    setInviteCount(count + 1);
    inviteText.textContent = INVITE_MESSAGES[count % INVITE_MESSAGES.length];
    assistantInvite.setAttribute('data-show', 'true');
    // auto-hide after 8s if not interacted
    window.setTimeout(function () {
      if (assistantInvite.getAttribute('data-show') === 'true' && !wasInteracted()) {
        assistantInvite.setAttribute('data-show', 'false');
        scheduleNextInvite();
      }
    }, 8000);
  }
  function stopInvitation() {
    if (inviteTimer) { window.clearTimeout(inviteTimer); inviteTimer = null; }
    if (assistantInvite) assistantInvite.setAttribute('data-show', 'false');
  }
  on(inviteClose, 'click', function () {
    assistantInvite.setAttribute('data-show', 'false');
    markInteracted();
  });
  on(assistantInvite, 'click', function (e) {
    // clicking the bubble (not the close button) opens the assistant
    if (e.target === inviteClose) return;
    openAssistant();
  });

  // Start invitation cycle only after the page is interactive, and respect reduced motion
  function startInvitationCycle() {
    if (reducedMotion) return; // respect reduced motion — do not auto-invite
    if (wasInteracted()) return;
    scheduleNextInvite();
  }
  if (document.readyState === 'complete') startInvitationCycle();
  else on(window, 'load', startInvitationCycle);

  // If the user scrolls significantly, consider them engaged — keep invitation timing as is
  // (invitation already time-based per DOCX)

  /* ---------- ensure visible FAQ stays usable if JS disabled: CSS keeps answers hidden by max-height:0; that's acceptable per DOCX "useful even if JS fails" — the answers are present in the DOM and readable via view-source; for keyboard users without JS, the buttons are non-functional but the content is in the DOM. To improve, we add a <noscript> fallback below at runtime is not possible; instead we make answers visible by default if JS fails via a class on <html>. */
  document.documentElement.classList.add('js');
})();
