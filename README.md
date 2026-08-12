# Learn to Work Smarter With AI — University Lecturer Edition

A premium, accessible, mobile-first **static sales website** for the *Learn to Work Smarter With AI — University Lecturer Edition* digital guide, built for GitHub Pages.

- **Canonical URL:** https://worksmarterai.github.io/
- **Repository:** https://github.com/worksmarterai/worksmarterai.github.io.git
- **Product:** 700+ page practical working system for Nigerian university lecturers using ChatGPT and Claude
- **Author:** Vincent Chimaobi Obasiochie (V.C Obasiochie)

## Stack

Pure static HTML + CSS + vanilla JavaScript. **No server-side runtime, no database, no build step, no framework.** This is intentional: GitHub Pages serves the files directly, the page renders without a custom backend, and the predefined AI Sales Assistant works entirely client-side.

- `index.html` — the landing page
- `privacy.html`, `terms.html` — legal pages
- `css/styles.css` — the complete advanced styling system (locked colour palette, typography, frames, badges, backlight/hover, section rhythm, responsive breakpoints, accessibility states, motion discipline)
- `js/app.js` — lightweight client behaviour (AI Sales Assistant, sticky header, mobile nav, mobile purchase bar, FAQ accordion, reveal-on-scroll)
- `data/knowledge-base.json` — the approved predefined-answer knowledge source for the assistant
- `assets/` — supplied product assets + generated OG image + favicons

## Run locally

Because this is a static site, you can serve it with any static file server. The repo root *is* the site root on GitHub Pages.

```bash
# from the repository root
python3 -m http.server 8080
# then open http://localhost:8080/
```

Or simply open `index.html` in a browser (some features such as the assistant's `fetch` of the knowledge base require `http://` rather than `file://`).

## Deploy to GitHub Pages

This repository is a user/org Pages repo (`worksmarterai.github.io`), so the `main` (or `master`) branch root is served directly at `https://worksmarterai.github.io/`.

1. Clone the repo.
2. Copy the contents of this static site into the repo root.
3. Commit and push.
4. In GitHub Settings → Pages, ensure "Deploy from a branch" is on with the root of the default branch.

No GitHub Actions workflow is required for a plain static Pages repo.

## Locked commercial facts

| Control | Locked Value |
|---|---|
| Product | LEARN TO WORK SMARTER WITH AI |
| Edition | University Lecturer Edition |
| Reference price | ₦15,000 |
| Promotional price | ₦7,700 |
| Discount | 49% OFF |
| Purchase route | https://selar.com/k7j717m263 |
| WhatsApp Business support | https://wa.me/message/BS2I4XH5NM3CH1 |
| WhatsApp Channel | https://whatsapp.com/channel/0029VbDoGeyF1YlYCD3PCh3W |
| Referral threshold | 5 successful attributable buyers (manual via WhatsApp Business) |
| Product depth | 700+ pages · 15 chapters · 7 Parts · 90+ Prompt-Templates · 63 Toolkit prompts · 12 categories |

## What is intentionally omitted (per the controlling DOCX)

- No GitHub tokens, API keys or secrets anywhere in the source.
- No GA4, Meta Pixel or other analytics identifiers.
- No testimonials, reviews or ratings (none approved).
- No countdown timers, fake scarcity or fabricated deadlines.
- No refund/guarantee marketing copy.
- No Facebook outbound links.
- No live external AI provider — the assistant is predefined local answers only.

## Files

See `ASSET-MAP.md` for the complete asset and file register, `BUILD-NOTES.md` for the implementation notes, and `CHANGELOG.md` for the version history.
