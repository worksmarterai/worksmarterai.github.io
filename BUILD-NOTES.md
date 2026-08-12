# Build Notes

Implementation notes for the *Learn to Work Smarter With AI — University Lecturer Edition* static sales website.

## 1. Chosen stack and architecture

**Pure static HTML + CSS + vanilla JavaScript.** No framework, no build step, no server runtime.

Rationale (per DOCX Section 0 / 45 / 49): the target is GitHub Pages at `https://worksmarterai.github.io/`; the page must render without a custom server-side runtime, database or private backend; and the DOCX explicitly permits "a simpler static approach" where it achieves the same quality. A static site is the most faithful, maintainable and deploy-simple choice for a `github.io` Pages repo. TypeScript was not required because the small amount of client behaviour is cleaner as a single dependency-free `app.js`.

## 2. Files created

- `index.html` — landing page, all approved sections in DOCX production order (1L)
- `privacy.html`, `terms.html` — legal pages (Appendix A)
- `css/styles.css` — the complete advanced styling system
- `js/app.js` — client behaviour
- `data/knowledge-base.json` — supplied knowledge base (copied verbatim)
- `assets/` — supplied product assets + generated OG image + favicons
- `favicon.*`, `apple-touch-icon.png`, `site.webmanifest`
- `README.md`, `ASSET-MAP.md`, `BUILD-NOTES.md`, `CHANGELOG.md`

## 3. Blueprint section coverage & priority-order compliance

Built in the priority order of DOCX Section 1J:

1. **P1 Product truth, commercial message, copy lock** — every locked string from Section 1F is present verbatim; identity, price (₦7,700 / ₦15,000 / 49% OFF), 700+ pages, 15 chapters, 90+ Prompt-Templates, 63 Toolkit prompts, 12 categories, author identity all consistent.
2. **P2 Conversion, payment safety, verified routes** — one purchase CTA system (`GET THE GUIDE FOR ₦7,700` → `https://selar.com/k7j717m263`); purchase, WhatsApp Business support, WhatsApp Channel and referral routes kept distinct.
3. **P3 Site-wide AI Sales Assistant** — defined before styling; fixed launcher available throughout; loads `knowledge-base.json` locally; strict fallback + WhatsApp escalation; transaction-safety notice persistent.
4. **P4 Product proof & friction reduction** — 15 chapters, 90+ Prompt-Templates, 63 Toolkit prompts, 12 categories, working method, Personal Lecturer AI System, three navigation layers, supplied video.
5. **P5 WhatsApp Channel, human support, referral** — verified Channel CTA, WhatsApp Business support, referral (5 buyers, manual).
6. **P6 Visible upcoming product family** — `OTHER EDITIONS & UPCOMING PRODUCTS` section with the three approved unavailable cards.
7. **P7 Visual styling, motion, polish** — advanced styling system applied (colour, typography, frames, badges, backlight/hover, section rhythm).
8. **P8 Responsive, accessibility, performance, QA** — breakpoint families ≤480 / 481–767 / 768–1023 / ≥1024; WCAG 2.2 AA targets; lightweight CSS/JS.

Section sequence (DOCX 1L): promo bar → header → hero → recognition → working system (7-step) → weak vs structured → 5-part task builder → product reveal + video → navigation value → capacity/pillars → beginner-to-confident → toolkit → toolkit categories → demonstrations → guide contents (7 Parts) → resources → Nigerian relevance → difference comparison → who it's for → price & offer → referral → WhatsApp Channel → FAQ → other editions → creator → final close → footer; plus mobile purchase bar + assistant launcher.

## 4. Supplied-asset mapping & native-component verification

- `front_cover.png`, `back_cover.png` used as exact flat covers in the product-reveal section (not redesigned, not cropped).
- `learntoworksmarter_front&back_cover.png` used as the dominant hero product visual.
- `Quick_glance_of_the_eBook_pro_features.mp4` integrated in a premium framed proof block titled "SEE THE EBOOK IN ACTION"; `preload="none"`, `controls` present, `poster` set to the front cover, **no autoplay**.
- `knowledge-base.json` loaded locally by the assistant via XHR.
- OG image (1200×630) generated from the front cover + brand palette (cover artwork preserved, only LANCZOS-resized).
- Favicons generated from the brand "WS" monogram on navy.
- All native components listed in Appendix A built in HTML/CSS (no external assets invented).

## 5. CTA route verification

| CTA | Destination | Verified |
|---|---|---|
| `GET THE GUIDE FOR ₦7,700` (hero, offer, final close, header, mobile bar, assistant) | https://selar.com/k7j717m263 | ✓ |
| `GET THE GUIDE` (header compact, mobile nav, legal pages) | https://selar.com/k7j717m263 | ✓ |
| `Join Official WhatsApp Channel and Receive Free Lecturers' AI Toolkit` (hero, toolkit, channel section) | https://whatsapp.com/channel/0029VbDoGeyF1YlYCD3PCh3W | ✓ |
| WhatsApp Business referral/support | https://wa.me/message/BS2I4XH5NM3CH1 | ✓ |
| Portfolio | https://vincentdesiigner.github.io/ | ✓ (opens new tab, `rel="noopener"`) |

All purchase CTAs resolve to the verified Selar URL. No competing purchase button style.

## 6. Sales Assistant architecture

- **Identity:** LECTURER GUIDE AI SALES ASSISTANT — PRODUCT, PURCHASE AND SUPPORT ASSISTANT. Identified as automated.
- **Knowledge source:** `data/knowledge-base.json` (the supplied file, copied verbatim). Loaded lazily via XHR on first interaction; never preloaded into the initial bundle.
- **Matching:** local keyword/pattern scoring over `approved_intents[].patterns`. Requires a minimum confidence; otherwise fallback.
- **Fallback:** exact approved string + WhatsApp escalation button (`https://wa.me/message/BS2I4XH5NM3CH1`).
- **CTA routing:** `buy` intent → Selar; `free_toolkit` → Channel; `referral` → WhatsApp Business.
- **Transaction safety:** persistent safety notice in the panel header; assistant never collects payment, bank details, or confirms transactions; never requests card/PIN/OTP.
- **Privacy:** questions are not persisted; only harmless session state (invitation count, interacted flag, open state) is stored in `sessionStorage`.
- **Graceful failure:** if the knowledge base fails to load, the assistant still offers the Selar CTA and WhatsApp escalation; the visible FAQ and purchase route remain fully usable.

## 7. Floating launcher, timed invitation, session limit, dismissal, mobile collision

- Fixed launcher lower-right; `bottom` offset respects `env(safe-area-inset-bottom)` and sits above the mobile purchase bar.
- Invitation: random 20–25s interval, max 3 per session, stops after dismissal or interaction (sessionStorage flag).
- Invitation uses only the four approved messages.
- Reduced-motion: invitation cycle is suppressed entirely.
- Mobile: invitation and panel reposition/scale to fit; panel `max-height: min(620px, calc(100vh - 140px))`.
- Launcher has an accessible name (`OPEN THE LECTURER GUIDE AI SALES ASSISTANT`); focus moves into the panel on open and returns to the launcher on close.

## 8. Responsive checks

- ≤480px: single column, ~20px side padding (clamp), 36–42px hero, full-width CTAs, stacked cards, mobile purchase bar after hero.
- 481–767px: single-column / readable 2-col micro-grids, no horizontal scroll.
- 768–1023px: two-column hero and product sections.
- ≥1024px: max content width ~1220px, readable measure ~720px for long copy, 7-column horizontal method rail, 4-column pillars.
- Mobile purchase bar only appears below 768px and only after the hero leaves the viewport.

## 9. Accessibility

- Semantic landmarks: `header`, `main`, `nav`, `section`, `footer`.
- Skip link present.
- One primary `h1` (hero); logical nested `h2`/`h3`.
- Keyboard-operable: nav drawer (Esc to close, focus return), FAQ accordion (button + `aria-expanded`/`aria-controls`), assistant (open/close/minimise, Esc, focus management), CTAs.
- Visible focus (`:focus-visible` 3px teal outline).
- `aria-live="polite"` on the assistant body.
- FAQ answers are visible without JS (`.js` class scopes the collapsed state).
- Reduced-motion: all transitions reduced to ~0ms; invitation suppressed; reveal-on-scroll falls back to visible.
- Touch targets ≥40–48px.
- Payment warning is text + icon, not colour alone.

## 10. Performance & build

- No external libraries; CSS + a single small `app.js`.
- Fonts: Inter via Google Fonts with `preconnect` (one family, display=swap).
- Hero image `fetchpriority="high"`; below-fold images `loading="lazy"`.
- Video `preload="none"` (lazy); poster from the front cover.
- Knowledge base loaded lazily on first assistant interaction.
- Reveal-on-scroll via a single `IntersectionObserver`.
- No expensive blur/glow systems; backlights use a single radial gradient per frame updated only on `mousemove` (pointer devices).
- LCP target ≤2.5s, INP ≤200ms, CLS ≤0.1 (static, no layout shift sources).

## 11. SEO & social metadata

- `<title>`: "Learn to Work Smarter With AI | University Lecturer Edition"
- Meta description: the approved string.
- Canonical: `https://worksmarterai.github.io/`
- OG image: `https://worksmarterai.github.io/assets/og_social_image_1200x630.png` (1200×630 confirmed).
- `twitter:card = summary_large_image`.
- Product structured data (NGN, price 7700, InStock, canonical + Selar offer URL). No review/rating structured data (none approved). No `noindex`.

## 12. Intentional upcoming-product placeholder report

Three cards shown in `OTHER EDITIONS & UPCOMING PRODUCTS`:
- Secondary School Teachers Edition — **IN PRODUCTION**
- Small Business Managers Edition — **UPCOMING**
- Final-Year Students Edition — **UPCOMING**

Each uses intentional placeholder artwork (diagonal hatch), a status badge, and a disabled `COMING SOON` / `NOT YET AVAILABLE` control. No price, cover, description, release date or destination is invented. No Polytechnic / College of Education / Basic Education cards appear. The component is data-ready for later linking.

**No required supplied file is missing.**

## 13. Production static build & GitHub Pages readiness

The static site is complete and self-contained in this directory. For a `worksmarterai.github.io` user/org Pages repo, pushing these files to the repo root serves them at `https://worksmarterai.github.io/` with no build step.

## 14. Technical interpretations (stated explicitly)

- The DOCX permits a simpler static approach; pure HTML/CSS/JS was chosen over a TypeScript/Next static export for deploy simplicity and zero-build reliability on GitHub Pages.
- The "Copy Example" action in the 5-part task builder was rendered as a static example frame (the DOCX marks the copy action optional); no copy button was added to avoid implying unverified functionality.
- The author headshot was not supplied; the creator block uses a navy monogram avatar (`VCO`) rather than a placeholder image slot, per DOCX Section 43 ("omit the image slot rather than exposing a placeholder").

## 15. Public-copy compliance

All locked copy from Section 1F is implemented verbatim (eyebrow, H1, commercial headline, body, control statement, proof strip, primary/secondary CTAs, channel CTA, microcopy, recognition heading/copy, working-system heading/copy, product reveal, navigation value, capacity, toolkit heading/copy, free channel copy, offer heading/support copy, final close heading/copy). No approved word was changed to make styling easier.

## 16. Commercial consistency

Identity, price (₦15,000 ref / ₦7,700 promo / 49% OFF), sale-tag-only treatment of the discount, 700+ page depth, 15 chapters / 7 Parts, 90+ Prompt-Templates, 63 Toolkit prompts / 12 categories, navigation terminology, and author identity are consistent across hero, proof strip, offer, final close, FAQ and assistant.

## 17. Completed-product claim map

| Claim | Evidence |
|---|---|
| 700+ pages | Product-reveal section, proof strip, offer stack, FAQ #3 |
| 15 chapters / 7 Parts | Guide-contents section (all 15 chapters listed) |
| 90+ guided Prompt-Templates | Toolkit section, resources, FAQ #4 |
| 63 Toolkit prompts / 12 categories | Toolkit section + 12-category grid |
| Three navigation layers | Navigation-value section |
| Personal Lecturer AI System | Resources, guide contents (Ch 15), outcomes |
| Real product video | "SEE THE EBOOK IN ACTION" block |
| ChatGPT + Claude coverage | Toolkit stats, FAQ #6 |

## 18. Claims excluded

No testimonials/reviews, no countdown/scarcity, no refund/guarantee, no fixed hours-saved, no journal-acceptance promise, no universal NUC checklist, no income guarantee, no Facebook outbound links, no analytics IDs.

## 19. Launch blockers

**None.** All required supplied files present; all routes verified; assistant predefined and safe; static build complete and GitHub-Pages-ready.

## 20. Future-edition component report

The `OTHER EDITIONS & UPCOMING PRODUCTS` component is reusable: each card is a self-contained block that can later receive a real cover, concise copy and sales-page URL without structural redesign. Until then, cards are visibly unavailable and contain no invented public details.
