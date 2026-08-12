/* ==========================================================================
   LEARN TO WORK SMARTER WITH AI — University Lecturer Edition
   app.js — lightweight client behaviour (no dependencies, static-site safe)
   - AI Sales Assistant: branching conversation with INLINE quick-replies
   - Proof detail modal: accessible explanations for 63 / 12 / 90+ / 2
   - Sticky header, mobile nav, mobile purchase bar, FAQ accordion, reveals
   ========================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ss = window.sessionStorage;

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
  function scrollToSection(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var offset = (header ? header.offsetHeight : 0) + 8;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    if (mobileNav.getAttribute('data-open') === 'true') closeMobileNav();
    window.scrollTo({ top: top, behavior: reducedMotion ? 'auto' : 'smooth' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  $all('a[href^="#"]').forEach(function (a) {
    on(a, 'click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      if (!document.getElementById(id.slice(1))) return;
      e.preventDefault();
      scrollToSection(id.slice(1));
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
     PROOF DETAIL MODAL — accessible interactive explanations (63/12/90+/2)
     ======================================================================== */
  var PROOF_CONTENT = {
    '63': {
      num: '63', title: 'Definitive Toolkit Prompts',
      sub: 'What this actually means for your work',
      html:
        '<div class="proof-modal__block"><div class="proof-modal__label">What it means</div>' +
        '<p>63 purpose-built prompts organised around the recurring tasks a lecturer already performs. When a specific job appears, you don&rsquo;t have to figure out what to type into ChatGPT or Claude from scratch &mdash; the Toolkit gives you a ready starting point for that task.</p></div>' +
        '<div class="proof-modal__block"><div class="proof-modal__label">What you can do with it</div>' +
        '<p>Open the Toolkit for recurring jobs such as:</p><ul>' +
        '<li>Preparing a marking guide</li><li>Improving a weak academic paragraph</li>' +
        '<li>Reviewing a project or thesis draft</li><li>Organising research papers</li>' +
        '<li>Checking whether evidence actually supports a claim</li>' +
        '<li>Verifying a suspicious reference</li><li>Organising a document</li>' +
        '<li>Preparing feedback</li><li>Structuring recurring academic work</li></ul></div>' +
        '<div class="proof-modal__block"><div class="proof-modal__label">Why the structure saves repeated effort</div>' +
        '<div class="proof-modal__flow"><span>FIND THE RELEVANT TASK</span><em>&rarr;</em><span>REPLACE THE REQUIRED DETAILS</span><em>&rarr;</em><span>SUBMIT</span><em>&rarr;</em><span>REVIEW</span><em>&rarr;</em><span>APPROVE</span><em>&rarr;</em><span>REUSE</span></div>' +
        '<p style="margin-top:.6rem">The same prompt is there next semester. You replace the details, not the thinking.</p></div>' +
        '<div class="proof-modal__result"><b>Practical result:</b> reduced repeated prompt-writing, a faster starting point, clearer instructions to AI, more reusable academic workflows, and lecturer control over the final result. AI does not make academic decisions automatically.</div>'
    },
    '12': {
      num: '12', title: 'Demand-Based Categories',
      sub: 'Why organising the Toolkit this way matters',
      html:
        '<div class="proof-modal__block"><div class="proof-modal__label">What it means</div>' +
        '<p>The 12 categories function like a practical problem-finding system. Instead of scrolling through dozens of unrelated prompts, you go directly to the type of work currently in front of you.</p></div>' +
        '<div class="proof-modal__block"><div class="proof-modal__label">The 12 categories</div><ul>' +
        '<li>AI Responses and Corrections</li><li>Documents, Tables, Designs and Printing</li>' +
        '<li>Lecture Materials and Classroom Support</li><li>Assessment, Marking and Feedback</li>' +
        '<li>Projects, Theses and Correction Tracking</li>' +
        '<li>Research-Paper Discovery, Reading and Organisation</li>' +
        '<li>Research Methods and Data Interpretation</li>' +
        '<li>References, Claims and Evidence</li>' +
        '<li>Academic Writing and Journal Preparation</li>' +
        '<li>Similarity, Plagiarism and Possible AI-Writing Review</li>' +
        '<li>Course Files and NUC-Related Evidence</li>' +
        '<li>Semester Workflows and the Reusable Lecturer AI System</li></ul></div>' +
        '<div class="proof-modal__block"><div class="proof-modal__label">How it saves effort</div>' +
        '<p>You think about the job you need to complete, find the corresponding category, then move towards the relevant working tool. Less searching, faster access, a clearer mental map of where each recurring task lives.</p></div>' +
        '<div class="proof-modal__result"><b>Practical result:</b> less time searching through unrelated prompts, faster access to the right tool, and a natural structure that mirrors how academic work actually arrives.</div>'
    },
    '90': {
      num: '90+', title: 'Chapter Prompt-Templates',
      sub: 'Different from the 63 Toolkit prompts',
      html:
        '<div class="proof-modal__block"><div class="proof-modal__label">What makes them different</div>' +
        '<p>The 90+ guided Prompt-Templates are placed <strong>inside the chapters</strong>, beside the methods, demonstrations, examples and verification steps they support. You are not simply handed a prompt &mdash; the surrounding chapter teaches the workflow around it.</p></div>' +
        '<div class="proof-modal__block"><div class="proof-modal__label">What the chapter teaches around each template</div><ul>' +
        '<li>What the task is</li><li>What information or source should be supplied</li>' +
        '<li>What must be replaced in the Prompt-Template</li>' +
        '<li>What type of output to request</li><li>What AI must not invent</li>' +
        '<li>What the lecturer must inspect</li><li>What needs verification</li>' +
        '<li>How a useful workflow can be saved and reused</li></ul></div>' +
        '<div class="proof-modal__block"><div class="proof-modal__label">Why that matters</div>' +
        '<p>You learn the method while using the tool. The 63 Toolkit prompts are refined standalone working tools; the 90+ chapter templates teach why the prompt works, so you build judgement rather than just a prompt library.</p></div>' +
        '<div class="proof-modal__result"><b>Practical result:</b> less guessing, stronger reusable workflows, and the understanding to adapt a prompt when the task changes shape.</div>'
    },
    '2': {
      num: '2', title: 'Tools Covered: ChatGPT & Claude',
      sub: 'Practical value of covering both',
      html:
        '<div class="proof-modal__block"><div class="proof-modal__label">What it means</div>' +
        '<p>The guide teaches practical workflows using both ChatGPT and Claude where relevant, without forcing permanent dependence on one AI platform. The prompting principles are transferable.</p></div>' +
        '<div class="proof-modal__block"><div class="proof-modal__label">What you can do with it</div><ul>' +
        '<li>Understand transferable prompting principles that work across assistants</li>' +
        '<li>Work across more than one major AI assistant</li>' +
        '<li>Compare outputs where useful</li>' +
        '<li>Continue the academic workflow without treating one provider as permanently superior</li></ul></div>' +
        '<div class="proof-modal__block"><div class="proof-modal__label">Why that saves effort</div>' +
        '<p>Transferable principles mean you are not locked in. You can choose the right tool for each task, and your workflows survive even if your preferred platform changes.</p></div>' +
        '<div class="proof-modal__result"><b>Practical result:</b> flexibility and continuity &mdash; your reusable workflows are not tied to a single provider.</div>'
    }
  };

  var proofModal = $('#proofModal');
  var proofNum = $('#proofNum');
  var proofTitle = $('#proofTitle');
  var proofSub = $('#proofSub');
  var proofBody = $('#proofBody');
  var proofLastFocus = null;

  function openProof(key, trigger) {
    var data = PROOF_CONTENT[key];
    if (!data || !proofModal) return;
    proofLastFocus = trigger || document.activeElement;
    proofNum.textContent = data.num;
    proofTitle.textContent = data.title;
    proofSub.textContent = data.sub;
    proofBody.innerHTML = data.html;
    proofModal.setAttribute('data-open', 'true');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // focus the close button after open
    setTimeout(function () { var c = $('#proofClose'); if (c) c.focus(); }, 60);
  }
  function closeProof() {
    if (!proofModal) return;
    proofModal.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
    // update all proof buttons aria-expanded
    $all('.toolkit-stat--btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    // return focus to the originating button
    if (proofLastFocus && proofLastFocus.focus) {
      proofLastFocus.focus();
    }
  }
  $all('.toolkit-stat--btn').forEach(function (btn) {
    on(btn, 'click', function () {
      var key = btn.getAttribute('data-proof');
      openProof(key, btn);
    });
  });

  /* ---------- Interactive info cards (nav-layer + path-card) ---------- */
  // Reuses the existing proof-modal shell; content is the exact supplied copy.
  var INFO_CARD_CONTENT = {
    nav1: {
      num: '01', title: 'CONTENTS AT A GLANCE',
      sub: 'See the whole journey before deciding where to go deeper',
      html:
        '<div class="info-modal__lead">See the whole journey before deciding where you need to go deeper.</div>' +
        '<div class="info-modal__block"><div class="info-modal__label">What it is</div>' +
        '<p>A 700+ page practical guide should not require you to search hundreds of pages just to understand where something is located.</p>' +
        '<p>CONTENTS AT A GLANCE gives you the broad map first. It shows how the seven Parts and fifteen practical chapters fit together, so you can quickly understand the journey from learning the foundations of AI to applying it to real lecturer responsibilities and eventually building reusable workflows.</p>' +
        '<p>This is especially useful when you are not yet looking for one small topic. You may simply want to answer:</p>' +
        '<p><em>&ldquo;Which part of this guide deals with the work I need to improve?&rdquo;</em></p></div>' +
        '<div class="info-modal__scenario"><div class="info-modal__label">Real-work scenario</div>' +
        '<p>Imagine that assessment preparation is consuming too much of your week.</p>' +
        '<p>Instead of browsing through the entire guide, you can first look at CONTENTS AT A GLANCE, identify the Part and chapter dealing with questions, marking guides and feedback, and then move directly towards that area.</p>' +
        '<p>The same approach works if your current priority is research, student supervision, academic writing, course-file organisation or NUC-related evidence.</p></div>' +
        '<div class="info-modal__value"><div class="info-modal__label">Why this matters</div>' +
        '<p>The size of the guide gives you depth.</p>' +
        '<p>CONTENTS AT A GLANCE helps prevent that depth from becoming overwhelming.</p>' +
        '<p>It lets you see the territory first, choose what matters now, and then move into the level of detail you actually need.</p></div>' +
        '<div class="info-modal__closing gold">SEE THE JOURNEY. CHOOSE YOUR PRIORITY. GO DEEPER WHEN NEEDED.</div>'
    },
    nav2: {
      num: '02', title: 'INTERACTIVE DETAILED CONTENTS',
      sub: 'When you know what you need, move directly to it',
      html:
        '<div class="info-modal__lead">When you know what you need, move directly to it.</div>' +
        '<div class="info-modal__block"><div class="info-modal__label">What it is</div>' +
        '<p>Once you have identified the area you want to work on, INTERACTIVE DETAILED CONTENTS gives you a more precise route.</p>' +
        '<p>Instead of repeatedly scrolling through pages, you can move directly to relevant chapters, sections, Prompt-Templates and practical resources.</p>' +
        '<p>This turns the guide from something you only read from beginning to end into something you can return to as a working reference.</p></div>' +
        '<div class="info-modal__scenario"><div class="info-modal__label">Real-work scenario</div>' +
        '<p>Suppose you have already learned the foundations, but today you need to prepare a marking guide.</p>' +
        '<p>You do not need to restart the book.</p>' +
        '<p>Use INTERACTIVE DETAILED CONTENTS to locate the relevant assessment workflow and move directly to it.</p>' +
        '<p>Next week, the task may be improving a manuscript paragraph, checking a questionable reference, organising research papers or preparing a student-supervision response.</p>' +
        '<p>Again, you can locate the relevant working section without repeating material you already understand.</p></div>' +
        '<div class="info-modal__value"><div class="info-modal__label">Why this matters</div>' +
        '<p>Academic responsibilities do not always arrive in chapter order.</p>' +
        '<p>The detailed navigation lets you use the guide according to the task in front of you.</p>' +
        '<p>Learn progressively when you are studying the system. Jump directly to the relevant resource when you are working.</p></div>' +
        '<div class="info-modal__closing gold">KNOW THE TASK. FIND THE SECTION. CONTINUE WORKING.</div>'
    },
    nav3: {
      num: '03', title: 'EXPANDABLE BOOKMARK NAVIGATION',
      sub: 'Return to the workflows and resources you use most',
      html:
        '<div class="info-modal__lead">Return to the workflows and resources you use most without searching for them again.</div>' +
        '<div class="info-modal__block"><div class="info-modal__label">What it is</div>' +
        '<p>Some parts of the guide will become resources you return to repeatedly.</p>' +
        '<p>EXPANDABLE BOOKMARK NAVIGATION provides deeper sidebar access through an organised hierarchy of Parts, chapters, sections, subsections and selected high-value resources.</p>' +
        '<p>You can expand the navigation, move deeper into the structure and return to useful working areas without manually searching through the document every time.</p></div>' +
        '<div class="info-modal__scenario"><div class="info-modal__label">Real-work scenario</div>' +
        '<p>Imagine that you regularly supervise student projects.</p>' +
        '<p>You have already studied the relevant method, so you do not need the complete explanation every time another draft arrives.</p>' +
        '<p>You can use the expandable bookmarks to move back towards the supervision workflow or resource you need, apply it to the new material, inspect the result and continue.</p>' +
        '<p>The same principle applies to recurring assessment, research, writing, document and course-file tasks.</p></div>' +
        '<div class="info-modal__value"><div class="info-modal__label">Why this matters</div>' +
        '<p>The first time you use the guide, you may be learning.</p>' +
        '<p>Later, you may simply need to retrieve a proven workflow quickly.</p>' +
        '<p>EXPANDABLE BOOKMARK NAVIGATION supports that transition from learning the system to repeatedly using the system.</p></div>' +
        '<div class="info-modal__closing gold">LEARN IT ONCE. FIND IT AGAIN. PUT IT BACK TO WORK.</div>'
    },
    path1: {
      num: '1', title: 'NEW TO AI',
      sub: 'STARTING LEVEL 1',
      html:
        '<div class="info-modal__lead">You do not need to become a programmer or prompt engineer before you can start.</div>' +
        '<div class="info-modal__block"><div class="info-modal__label">What it is</div>' +
        '<p>This starting level is for the lecturer who has little or no practical experience with ChatGPT or Claude.</p>' +
        '<p>The guide begins by helping you understand what AI can do, what should remain under your judgement, how to set up the tools, and how to communicate a real academic task clearly.</p>' +
        '<p>You begin with familiar work rather than technical theory.</p>' +
        '<p>You already understand your academic responsibility.</p>' +
        '<p>The guide teaches you how to give AI the right material, explain what you need, inspect what it produces and remain responsible for the final decision.</p></div>' +
        '<div class="info-modal__scenario"><div class="info-modal__label">Real-work scenario</div>' +
        '<p>Imagine that tomorrow&rsquo;s lecture still needs preparation.</p>' +
        '<p>You have your topic, course material and professional knowledge, but you have never used ChatGPT or Claude for serious academic work.</p>' +
        '<p>The guide shows you how to begin with the material you already trust, state the task clearly, obtain a useful working output, inspect it and correct what needs improvement.</p>' +
        '<p>You are not expected to know complicated AI terminology before beginning.</p></div>' +
        '<div class="info-modal__value"><div class="info-modal__label">What changes for the lecturer</div>' +
        '<p>Instead of wondering, &ldquo;What am I supposed to type into AI?&rdquo;, you begin learning a repeatable process for turning familiar lecturer responsibilities into clear, controlled AI-assisted tasks.</p></div>' +
        '<div class="info-modal__progression"><div class="info-modal__label" style="margin-bottom:.2rem">The progression</div>' +
        '<div class="step"><b>L1</b> UNDERSTAND AND START</div><div class="arr" aria-hidden="true">&#8595;</div>' +
        '<div class="step"><b>L2</b> IMPROVE AND CONTROL</div><div class="arr" aria-hidden="true">&#8595;</div>' +
        '<div class="step"><b>L3</b> SYSTEMATISE AND REUSE</div>' +
        '<div class="support">WHEREVER YOU ARE STARTING, THE GUIDE SHOWS YOU THE NEXT PRACTICAL STEP.</div></div>' +
        '<div class="info-modal__block"><div class="info-modal__label">Next progression</div>' +
        '<p>As you become comfortable giving AI clear material and instructions, you naturally move towards STARTING LEVEL 2, where the focus shifts from simply using AI to getting more consistent and useful results.</p></div>' +
        '<div class="info-modal__closing">START WITH THE WORK YOU ALREADY KNOW.</div>'
    },
    path2: {
      num: '2', title: 'SOME EXPERIMENTATION',
      sub: 'STARTING LEVEL 2',
      html:
        '<div class="info-modal__lead">Move from occasional AI attempts to clearer, more dependable working methods.</div>' +
        '<div class="info-modal__block"><div class="info-modal__label">What it is</div>' +
        '<p>This starting level is for the lecturer who has already tried ChatGPT, Claude or similar AI tools but finds that the quality of the results changes from one attempt to another.</p>' +
        '<p>Sometimes the response is useful.</p>' +
        '<p>Sometimes it is too general, misunderstands the task or gives information that still requires substantial correction.</p>' +
        '<p>The guide helps you improve the quality of the material you provide, define the task more clearly, specify the expected output, inspect weak areas and refine the result instead of repeatedly starting over.</p></div>' +
        '<div class="info-modal__scenario"><div class="info-modal__label">Real-work scenario</div>' +
        '<p>Suppose you ask AI:</p>' +
        '<p><em>&ldquo;Prepare questions for my students.&rdquo;</em></p>' +
        '<p>You may receive questions, but they might not match your course material, level, coverage or intended assessment.</p>' +
        '<p>The guide moves you towards a stronger process.</p>' +
        '<p>You provide the relevant material, identify the students or level, state what should be assessed, define the required question structure and inspect the resulting output against your academic judgement.</p>' +
        '<p>The difference is not simply using more words. The difference is giving AI the context and controls it needs to support the actual task.</p></div>' +
        '<div class="info-modal__value"><div class="info-modal__label">What changes for the lecturer</div>' +
        '<p>AI begins to feel less random because you stop treating every interaction as an isolated experiment.</p>' +
        '<p>Successful instructions, Prompt-Templates, files and working methods can be retained and reused.</p></div>' +
        '<div class="info-modal__progression"><div class="info-modal__label" style="margin-bottom:.2rem">The progression</div>' +
        '<div class="step"><b>L1</b> UNDERSTAND AND START</div><div class="arr" aria-hidden="true">&#8595;</div>' +
        '<div class="step"><b>L2</b> IMPROVE AND CONTROL</div><div class="arr" aria-hidden="true">&#8595;</div>' +
        '<div class="step"><b>L3</b> SYSTEMATISE AND REUSE</div>' +
        '<div class="support">WHEREVER YOU ARE STARTING, THE GUIDE SHOWS YOU THE NEXT PRACTICAL STEP.</div></div>' +
        '<div class="info-modal__block"><div class="info-modal__label">Next progression</div>' +
        '<p>Once you can produce useful results more consistently, STARTING LEVEL 3 helps you organise those successful methods into reusable systems for recurring academic work.</p></div>' +
        '<div class="info-modal__closing">MOVE FROM RANDOM RESULTS TO REPEATABLE METHODS.</div>'
    },
    path3: {
      num: '3', title: 'READY TO SYSTEMATISE',
      sub: 'STARTING LEVEL 3',
      html:
        '<div class="info-modal__lead">Stop rebuilding successful AI workflows from the beginning every time the same work returns.</div>' +
        '<div class="info-modal__block"><div class="info-modal__label">What it is</div>' +
        '<p>This starting level is for the lecturer who already uses AI occasionally and understands the basics, but now wants a more organised way to reuse what works.</p>' +
        '<p>The guide helps you move beyond isolated conversations towards a Personal Lecturer AI System built around reusable prompts, trusted files, records and recurring semester workflows.</p>' +
        '<p>The objective is to reduce unnecessary repetition around the work you already know how to do.</p></div>' +
        '<div class="info-modal__scenario"><div class="info-modal__label">Real-work scenario</div>' +
        '<p>Suppose you supervise student projects every semester.</p>' +
        '<p>You may repeatedly find yourself explaining similar requirements, reviewing recurring weaknesses, organising corrections and rebuilding instructions for AI from the beginning.</p>' +
        '<p>Once you have developed and checked a useful workflow, the guide shows you how to preserve the parts that should be reusable.</p>' +
        '<p>When another appropriate task appears, you start from a proven structure, replace the relevant details, supply the new material, review the output and adapt it to the current case.</p>' +
        '<p>The same principle can support recurring lecture preparation, assessment, marking and feedback, research organisation, academic writing, document work and course-file responsibilities.</p></div>' +
        '<div class="info-modal__value"><div class="info-modal__label">What changes for the lecturer</div>' +
        '<p>AI stops being only a tool you occasionally open.</p>' +
        '<p>Your successful methods begin becoming reusable working assets.</p>' +
        '<p>That is the purpose of the Personal Lecturer AI System.</p></div>' +
        '<div class="info-modal__progression"><div class="info-modal__label" style="margin-bottom:.2rem">The progression</div>' +
        '<div class="step"><b>L1</b> UNDERSTAND AND START</div><div class="arr" aria-hidden="true">&#8595;</div>' +
        '<div class="step"><b>L2</b> IMPROVE AND CONTROL</div><div class="arr" aria-hidden="true">&#8595;</div>' +
        '<div class="step"><b>L3</b> SYSTEMATISE AND REUSE</div>' +
        '<div class="support">WHEREVER YOU ARE STARTING, THE GUIDE SHOWS YOU THE NEXT PRACTICAL STEP.</div></div>' +
        '<div class="info-modal__closing">BUILD IT ONCE. IMPROVE IT. REUSE WHAT WORKS.</div>'
    }
  };

  function openInfoCard(key, trigger) {
    var data = INFO_CARD_CONTENT[key];
    if (!data || !proofModal) return;
    proofLastFocus = trigger || document.activeElement;
    proofNum.textContent = data.num;
    proofTitle.textContent = data.title;
    proofSub.textContent = data.sub;
    proofBody.innerHTML = data.html;
    proofModal.setAttribute('data-open', 'true');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var c = $('#proofClose'); if (c) c.focus(); }, 60);
  }

  $all('[data-info-card]').forEach(function (card) {
    on(card, 'click', function () {
      openInfoCard(card.getAttribute('data-info-card'), card);
    });
  });

  /* ---------- Hero proof badges — reuse existing scroll + proof-modal ---------- */
  $all('.proof-chip--btn').forEach(function (chip) {
    on(chip, 'click', function () {
      var go = chip.getAttribute('data-proof-go');
      var modal = chip.getAttribute('data-proof-modal');
      if (go) { scrollToSection(go); }
      else if (modal) { openProof(modal, chip); }
    });
  });
  $all('[data-close-proof]').forEach(function (el) { on(el, 'click', closeProof); });
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && proofModal.getAttribute('data-open') === 'true') {
      closeProof();
    }
  });
  // simple focus trap inside modal
  on(proofModal, 'keydown', function (e) {
    if (e.key !== 'Tab' || proofModal.getAttribute('data-open') !== 'true') return;
    var focusables = $all('a[href], button:not([disabled]), input:not([disabled])', proofModal)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ========================================================================
     AI SALES ASSISTANT — branching conversation with inline quick-replies
     ======================================================================== */
  var ASSISTANT = { kb: null, kbLoading: false, kbLoaded: false, lastFocused: null, userScrolledUp: false };

  var assistantBtn = $('#assistantBtn');
  var assistantPanel = $('#assistantPanel');
  var assistantBody = $('#assistantBody');
  var assistantForm = $('#assistantForm');
  var assistantInput = $('#assistantInput');
  var assistantInvite = $('#assistantInvite');
  var inviteText = $('#inviteText');
  var inviteClose = $('#inviteClose');
  var askAssistantBtn = $('#askAssistantBtn');

  var INVITE_MESSAGES = [
    'I CAN ANSWER YOUR QUESTIONS.',
    'NEED HELP CHOOSING? ASK ME.',
    'QUESTIONS ABOUT THE GUIDE? ASK ME.',
    'READY TO LEARN MORE? I CAN HELP.'
  ];

  var WHATSAPP_SUPPORT = 'https://wa.me/message/BS2I4XH5NM3CH1';
  var WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029VbDoGeyF1YlYCD3PCh3W';
  var SELAR_URL = 'https://selar.com/k7j717m263';
  var FALLBACK = 'I do not have an approved answer for that question. Would you like to continue this conversation with the Afrik Vine support team on WhatsApp?';

  // Branching follow-up graph — each intent id maps to a small set of follow-ups
  var FOLLOWUPS = {
    _initial: [
      'WHAT IS INSIDE THE GUIDE?',
      'IS THIS SUITABLE FOR A BEGINNER?',
      'HOW CAN THIS HELP ME SAVE REPEATED EFFORT?',
      'WHAT IS LECTURERS\'S AI TOOLKITS?'
    ],
    inside_guide: ['WHAT ARE THE 90+ PROMPT-TEMPLATES?', 'WHAT IS LECTURERS\'S AI TOOLKITS?', 'HOW DO I BUY THE GUIDE?'],
    beginner: ['WHAT IS INSIDE THE GUIDE?', 'HOW DO I BUY THE GUIDE?', 'HOW WILL I RECEIVE THE GUIDE AFTER PAYMENT?'],
    save_time: ['WHAT ARE THE 90+ PROMPT-TEMPLATES?', 'WHAT IS LECTURERS\'S AI TOOLKITS?', 'HOW DOES THE REFERRAL PROGRAMME WORK?'],
    prompt_templates: ['WHAT IS LECTURERS\'S AI TOOLKITS?', 'WHAT IS INSIDE THE GUIDE?', 'HOW DO I GET THE FREE LECTURERS\' AI TOOLKIT?'],
    toolkit: ['WHAT DO THE 63 PROMPTS HELP ME DO?', 'WHAT ARE THE 12 CATEGORIES?', 'HOW IS THIS DIFFERENT FROM THE 90+ PROMPT-TEMPLATES?'],
    free_toolkit: ['HOW DO I BUY THE GUIDE?', 'WHAT IS LECTURERS\'S AI TOOLKITS?', 'HOW DOES THE REFERRAL PROGRAMME WORK?'],
    price: ['HOW DO I BUY THE GUIDE?', 'HOW WILL I RECEIVE THE GUIDE AFTER PAYMENT?', 'HOW DOES THE REFERRAL PROGRAMME WORK?'],
    buy: ['HOW WILL I RECEIVE THE GUIDE AFTER PAYMENT?', 'WHAT IS INSIDE THE GUIDE?', 'I NEED HELP BUILDING MY PERSONAL LECTURER AI SYSTEM.'],
    delivery: ['HOW DO I BUY THE GUIDE?', 'WHAT IS INSIDE THE GUIDE?', 'HOW DOES THE REFERRAL PROGRAMME WORK?'],
    navigation: ['WHAT IS INSIDE THE GUIDE?', 'WHAT ARE THE 90+ PROMPT-TEMPLATES?', 'HOW DO I BUY THE GUIDE?'],
    chatgpt_claude: ['WHAT IS INSIDE THE GUIDE?', 'WHAT IS LECTURERS\'S AI TOOLKITS?', 'IS THIS SUITABLE FOR A BEGINNER?'],
    referral: ['HOW DO I BUY THE GUIDE?', 'HOW DO I GET THE FREE LECTURERS\' AI TOOLKIT?', 'I NEED HELP BUILDING MY PERSONAL LECTURER AI SYSTEM.'],
    human_control: ['WHAT IS INSIDE THE GUIDE?', 'WHAT IS LECTURERS\'S AI TOOLKITS?', 'HOW DO I BUY THE GUIDE?'],
    upcoming: ['WHAT IS INSIDE THE GUIDE?', 'HOW DO I BUY THE GUIDE?', 'HOW DO I GET THE FREE LECTURERS\' AI TOOLKIT?'],
    _fallback: ['WHAT IS INSIDE THE GUIDE?', 'HOW DO I BUY THE GUIDE?', 'HOW DO I GET THE FREE LECTURERS\' AI TOOLKIT?'],
    _escalation: ['WHAT IS INSIDE THE GUIDE?', 'HOW DO I BUY THE GUIDE?', 'HOW DO I GET THE FREE LECTURERS\' AI TOOLKIT?']
  };

  function loadKB(cb) {
    if (ASSISTANT.kbLoaded) { cb(ASSISTANT.kb); return; }
    if (ASSISTANT.kbLoading) return;
    ASSISTANT.kbLoading = true;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './data/knowledge-base.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      ASSISTANT.kbLoading = false;
      if (xhr.status === 200) {
        try { ASSISTANT.kb = JSON.parse(xhr.responseText); ASSISTANT.kbLoaded = true; cb(ASSISTANT.kb); }
        catch (e) { cb(null); }
      } else { cb(null); }
    };
    xhr.send();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); }

  // Match a free-text or starter question against approved intents
  function matchIntent(text) {
    if (!ASSISTANT.kb) return null;
    var q = norm(text);
    if (!q) return null;
    // Special-case escalation topics that aren't clean intent matches
    var ql = q;
    if (ql.indexOf('personal lecturer') >= 0 || ql.indexOf('build') >= 0 || ql.indexOf('implement') >= 0 || ql.indexOf('set up') >= 0 || ql.indexOf('setup') >= 0 || ql.indexOf('custom') >= 0 || ql.indexOf('institution') >= 0 || ql.indexOf('training') >= 0) {
      return { _escalation: true };
    }
    var intents = ASSISTANT.kb.approved_intents || [];
    var best = null, bestScore = 0;
    intents.forEach(function (intent) {
      var score = 0;
      (intent.patterns || []).forEach(function (pat) {
        var p = norm(pat);
        if (!p) return;
        if (q.indexOf(p) >= 0) { score += 5; return; }
        var pw = p.split(' '), hit = 0;
        pw.forEach(function (w) { if (w.length > 2 && q.indexOf(w) >= 0) hit++; });
        if (hit > 0) score += (hit / pw.length) * 3;
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return bestScore >= 3 ? best : null;
  }

  // Resolve a starter/follow-up question text to an intent + response
  function resolveQuestion(text) {
    var matched = matchIntent(text);
    var result;
    if (matched && matched._escalation) {
      result = {
        answer: 'I can connect you with the support team on WhatsApp for help with your Personal Lecturer AI System, custom workflow setup, or institutional and group training enquiries. They handle those personally.',
        cta: 'wa',
        followKey: '_escalation'
      };
    } else if (matched) {
      var cta = null, followKey = matched.id;
      if (matched.id === 'buy') cta = 'buy';
      else if (matched.id === 'free_toolkit') cta = 'channel';
      else if (matched.id === 'referral') cta = 'wa';
      else if (matched.cta) {
        cta = (matched.cta === WHATSAPP_CHANNEL) ? 'channel' : (matched.cta === WHATSAPP_SUPPORT ? 'wa' : 'wa');
      }
      result = { answer: matched.answer, cta: cta, followKey: followKey };
    } else {
      result = { answer: FALLBACK, cta: 'wa', followKey: '_fallback' };
    }
    return result;
  }

  function ctaHtml(kind) {
    if (kind === 'buy') return '<a class="btn-buy" href="' + SELAR_URL + '" target="_blank" rel="noopener">GET THE GUIDE FOR ₦7,700</a>';
    if (kind === 'channel') return '<a class="btn-channel" href="' + WHATSAPP_CHANNEL + '" target="_blank" rel="noopener">Join Official WhatsApp Channel</a>';
    if (kind === 'wa') return '<a class="btn-wa" href="' + WHATSAPP_SUPPORT + '" target="_blank" rel="noopener">Continue on WhatsApp</a>';
    return '';
  }

  function isNearBottom() {
    if (!assistantBody) return true;
    return (assistantBody.scrollHeight - assistantBody.scrollTop - assistantBody.clientHeight) < 90;
  }
  function scrollToBottom(force) {
    if (!assistantBody) return;
    if (force || !ASSISTANT.userScrolledUp) {
      assistantBody.scrollTop = assistantBody.scrollHeight;
    }
  }

  // Append a user message bubble
  function addUserMessage(text) {
    var div = document.createElement('div');
    div.className = 'msg msg--user';
    div.textContent = text;
    assistantBody.appendChild(div);
  }

  // Append a bot message bubble (with optional CTA) and return the bubble element
  function addBotMessage(text, ctaKind) {
    var div = document.createElement('div');
    div.className = 'msg msg--bot';
    var html = escapeHtml(text);
    if (ctaKind) html += '<div class="msg__cta">' + ctaHtml(ctaKind) + '</div>';
    div.innerHTML = html;
    assistantBody.appendChild(div);
    return div;
  }

  // Append inline quick-reply chips under a given reference element (or at end)
  function addQuickReplies(questions, refEl) {
    if (!questions || !questions.length) return null;
    var wrap = document.createElement('div');
    wrap.className = 'quick-replies';
    questions.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      on(b, 'click', function () { handleQuestion(q, b); });
      wrap.appendChild(b);
    });
    if (refEl && refEl.parentNode) {
      refEl.parentNode.insertBefore(wrap, refEl.nextSibling);
    } else {
      assistantBody.appendChild(wrap);
    }
    return wrap;
  }

  // Remove any existing quick-reply blocks (collapse current set before adding new)
  function clearQuickReplies() {
    $all('.quick-replies', assistantBody).forEach(function (el) { el.remove(); });
  }

  // Track whether the user has scrolled up manually
  on(assistantBody, 'scroll', function () {
    ASSISTANT.userScrolledUp = !isNearBottom();
  }, { passive: true });

  function handleQuestion(text, originBtn) {
    var t = (text || '').trim();
    if (!t) return;
    // collapse current quick replies
    clearQuickReplies();
    // add user message
    addUserMessage(t);
    ASSISTANT.userScrolledUp = false; // a new interaction — resume auto-scroll
    scrollToBottom(true);
    markInteracted();
    // resolve + respond
    var respond = function () {
      var res = resolveQuestion(t);
      var bubble = addBotMessage(res.answer, res.cta);
      var followups = FOLLOWUPS[res.followKey] || FOLLOWUPS._fallback;
      addQuickReplies(followups, bubble);
      scrollToBottom(true);
    };
    if (reducedMotion) respond();
    else setTimeout(respond, 160);
  }

  function handleFreeText(text) {
    handleQuestion(text, null);
  }

  function greet() {
    if (assistantBody.children.length > 0) return;
    var bubble = addBotMessage('Hello. I\u2019m the LECTURER GUIDE AI SALES ASSISTANT, an automated product, purchase and support assistant. Ask me about the guide, the free WhatsApp Channel Toolkit, price, delivery or referral. How can I help?', null);
    addQuickReplies(FOLLOWUPS._initial, bubble);
    scrollToBottom(true);
  }

  function openAssistant() {
    ASSISTANT.lastFocused = document.activeElement;
    assistantPanel.setAttribute('data-open', 'true');
    assistantBtn.setAttribute('aria-expanded', 'true');
    assistantInvite.setAttribute('data-show', 'false');
    markInteracted();
    greet();
    setTimeout(function () { if (assistantInput) assistantInput.focus(); }, 60);
  }
  function closeAssistant() {
    assistantPanel.setAttribute('data-open', 'false');
    assistantBtn.setAttribute('aria-expanded', 'false');
    if (ASSISTANT.lastFocused && ASSISTANT.lastFocused.focus) ASSISTANT.lastFocused.focus();
    else assistantBtn.focus();
  }

  on(assistantBtn, 'click', function () {
    if (assistantPanel.getAttribute('data-open') === 'true') closeAssistant();
    else openAssistant();
  });
  on($('#assistantClose'), 'click', closeAssistant);
  on($('#assistantMin'), 'click', closeAssistant);
  on(assistantForm, 'submit', function (e) {
    e.preventDefault();
    var v = assistantInput.value;
    if (v && v.trim()) { handleFreeText(v.trim()); assistantInput.value = ''; }
  });
  if (askAssistantBtn) {
    on(askAssistantBtn, 'click', function () {
      openAssistant();
      var rect = assistantPanel.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        assistantBtn.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });
  }
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && assistantPanel.getAttribute('data-open') === 'true') closeAssistant();
  });

  // Preload KB quietly after first open so responses are instant
  on(assistantBtn, 'click', function () { loadKB(function () {}); }, { once: true });

  /* ---------- controlled periodic invitation ---------- */
  function markInteracted() {
    try { ss.setItem('wsa_assistant_interacted', '1'); } catch (e) {}
    stopInvitation();
  }
  function wasInteracted() { try { return ss.getItem('wsa_assistant_interacted') === '1'; } catch (e) { return false; } }
  function getInviteCount() { try { return parseInt(ss.getItem('wsa_invite_count') || '0', 10); } catch (e) { return 0; } }
  function setInviteCount(n) { try { ss.setItem('wsa_invite_count', String(n)); } catch (e) {} }

  var inviteTimer = null;
  function scheduleNextInvite() {
    if (wasInteracted()) return;
    if (getInviteCount() >= 3) return;
    if (assistantPanel.getAttribute('data-open') === 'true') return;
    var delay = 20000 + Math.floor(Math.random() * 5000);
    inviteTimer = window.setTimeout(function () { showInvite(); }, delay);
  }
  function showInvite() {
    if (wasInteracted() || getInviteCount() >= 3) return;
    if (assistantPanel.getAttribute('data-open') === 'true') return;
    var count = getInviteCount();
    setInviteCount(count + 1);
    inviteText.textContent = INVITE_MESSAGES[count % INVITE_MESSAGES.length];
    assistantInvite.setAttribute('data-show', 'true');
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
  on(inviteClose, 'click', function () { assistantInvite.setAttribute('data-show', 'false'); markInteracted(); });
  on(assistantInvite, 'click', function (e) { if (e.target === inviteClose) return; openAssistant(); });

  function startInvitationCycle() {
    if (reducedMotion) return;
    if (wasInteracted()) return;
    scheduleNextInvite();
  }
  if (document.readyState === 'complete') startInvitationCycle();
  else on(window, 'load', startInvitationCycle);

  document.documentElement.classList.add('js');

  /* ========================================================================
     SST EDITION — carousel + detail modal
     ======================================================================== */
  var sstModal = $('#sstModal');
  var sstCarousel = $('#sstCarousel');
  var sstTrack = $('#sstTrack');
  var sstPrev = $('#sstPrev');
  var sstNext = $('#sstNext');
  var sstDots = $('#sstDots');
  var sstIndex = 0;
  var sstSlides = sstTrack ? $all('.sst-carousel__slide', sstTrack) : [];
  var sstLastFocus = null;

  function sstUpdate() {
    if (!sstTrack || !sstSlides.length) return;
    sstTrack.style.transform = 'translateX(' + (-sstIndex * 100) + '%)';
    $all('button', sstDots).forEach(function (d, i) {
      if (i === sstIndex) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    $all('.sst-carousel__slide', sstTrack).forEach(function (s, i) {
      s.setAttribute('aria-hidden', i === sstIndex ? 'false' : 'true');
    });
  }
  function sstBuildDots() {
    if (!sstDots || !sstSlides.length) return;
    sstDots.innerHTML = '';
    sstSlides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Go to cover ' + (i + 1));
      on(b, 'click', function (e) {
        e.stopPropagation();
        sstIndex = i;
        sstUpdate();
      });
      sstDots.appendChild(b);
    });
  }
  function sstGo(dir) {
    if (!sstSlides.length) return;
    sstIndex = (sstIndex + dir + sstSlides.length) % sstSlides.length;
    sstUpdate();
  }
  if (sstPrev) on(sstPrev, 'click', function (e) { e.stopPropagation(); sstGo(-1); });
  if (sstNext) on(sstNext, 'click', function (e) { e.stopPropagation(); sstGo(1); });

  // Keyboard support on the carousel (left/right when focused)
  if (sstCarousel) {
    sstCarousel.setAttribute('tabindex', '0');
    on(sstCarousel, 'keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); sstGo(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); sstGo(1); }
    });
  }

  // Touch / swipe support
  if (sstTrack) {
    var touchStartX = 0, touchDeltaX = 0, touching = false;
    on(sstTrack, 'touchstart', function (e) {
      touching = true;
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });
    on(sstTrack, 'touchmove', function (e) {
      if (!touching) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    on(sstTrack, 'touchend', function () {
      if (!touching) return;
      touching = false;
      if (Math.abs(touchDeltaX) > 40) {
        sstGo(touchDeltaX < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  sstBuildDots();
  sstUpdate();

  // SST modal open/close (image, card button, or SEE WHAT'S INSIDE)
  function openSST(trigger) {
    if (!sstModal) return;
    sstLastFocus = trigger || document.activeElement;
    sstModal.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
    $all('[data-sst-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    setTimeout(function () { var c = $('.sst-modal__close', sstModal); if (c) c.focus(); }, 60);
  }
  function closeSST() {
    if (!sstModal) return;
    sstModal.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
    $all('[data-sst-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (sstLastFocus && sstLastFocus.focus) sstLastFocus.focus();
  }
  $all('[data-sst-open]').forEach(function (el) {
    on(el, 'click', function (e) {
      // If the click originated on a carousel nav/dot, let that handler run
      if (e.target.closest('.sst-carousel__nav') || e.target.closest('.sst-carousel__dots')) return;
      e.preventDefault();
      openSST(el);
    });
  });
  $all('[data-close-sst]').forEach(function (el) { on(el, 'click', closeSST); });
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && sstModal.getAttribute('data-open') === 'true') closeSST();
  });
  // Focus trap inside SST modal
  on(sstModal, 'keydown', function (e) {
    if (e.key !== 'Tab' || sstModal.getAttribute('data-open') !== 'true') return;
    var focusables = $all('a[href], button:not([disabled])', sstModal)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
