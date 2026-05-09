# Personalize Projects + Add Competitions Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three placeholder portfolio projects (HyperLedger, Nebula OS, Amber Flow) with three real projects (Kalinga, Zero to Agent Manila, GreenProof), and add a new Competitions timeline section between Projects and Stack.

**Architecture:** Static site (HTML + CSS + vanilla JS, no build step). All content edits are inline in `index.html` and `script.js`. New section reuses the existing `.experience__timeline` visual pattern with new BEM-style classes (`.competitions__timeline`, `.competition-item__*`, `.status-badge--*`). Cross-linking from competitions to projects uses the existing smooth-scroll anchor handler plus a small JS routine that briefly highlights the matching project card.

**Tech Stack:** HTML5, CSS3 (Material Design tokens already defined in `:root`), Vanilla JavaScript. No package manager, no test runner — verification is manual in the browser.

**Verification approach:** This project has no automated test suite. Each task ends with a manual browser-check step describing exactly what to look at and what should happen.

**Working branch:** `feature/projects-competitions` (already created off `main`).

---

## File Map

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | Modify | Nav link order, section number labels, project card content (3), new `#competitions` section |
| `script.js` | Modify | Replace `projectData` entries; add cross-link highlight handler |
| `styles.css` | Modify | Append `.competitions__timeline`, `.competition-item__*`, `.status-badge--*`, `.project-card--highlight` styles |
| `assets/project-kalinga.png` | (Optional, user supplies later) | Card/modal image for Kalinga |
| `assets/project-02a-manila.png` | (Optional, user supplies later) | Card/modal image for Zero to Agent Manila |
| `assets/project-greenproof.png` | (Optional, user supplies later) | Card/modal image for GreenProof |

The three old asset files (`project-hyperledger.png`, `project-nebula.png`, `project-amberflow.png`) are temporarily reused as fallbacks — see Task 9.

---

## Task 1: Update navigation links + add Competitions entry

**Files:**
- Modify: `index.html` (the `<div class="nav__links" id="navLinks">` block, around lines 20-27)

- [ ] **Step 1: Edit `index.html` nav links**

Replace the existing `<div class="nav__links" id="navLinks">…</div>` block with:

```html
      <div class="nav__links" id="navLinks">
        <a href="#home" class="nav__link active" data-nav="home">Home</a>
        <a href="#projects" class="nav__link" data-nav="projects">Projects</a>
        <a href="#competitions" class="nav__link" data-nav="competitions">Competitions</a>
        <a href="#stack" class="nav__link" data-nav="stack">Stack</a>
        <a href="#experience" class="nav__link" data-nav="experience">Experience</a>
        <a href="#certifications" class="nav__link" data-nav="certifications">Certifications</a>
        <a href="#contact" class="nav__cta" data-nav="contact">> Get in Touch</a>
      </div>
```

- [ ] **Step 2: Verify in browser**

Open `index.html` in a browser. Confirm:
- "Competitions" appears between "Projects" and "Stack" in the nav.
- Clicking the link does nothing yet (anchor target doesn't exist) — that's expected.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(nav): add Competitions link between Projects and Stack"
```

---

## Task 2: Renumber section labels

**Files:**
- Modify: `index.html` (`section-header__label` text in `#stack`, `#experience`, `#certifications`, `#contact`)

- [ ] **Step 1: Update Stack label from `03 // Stack` to `04 // Stack`**

Find in `index.html`:

```html
        <p class="section-header__label">03 // Stack</p>
```

Replace with:

```html
        <p class="section-header__label">04 // Stack</p>
```

- [ ] **Step 2: Update Experience label from `04 // Experience` to `05 // Experience`**

Find:

```html
        <p class="section-header__label">04 // Experience</p>
```

Replace with:

```html
        <p class="section-header__label">05 // Experience</p>
```

- [ ] **Step 3: Update Certifications label from `05 // Certifications` to `06 // Certifications`**

Find:

```html
        <p class="section-header__label">05 // Certifications</p>
```

Replace with:

```html
        <p class="section-header__label">06 // Certifications</p>
```

- [ ] **Step 4: Update Contact label from `06 // Contact` to `07 // Contact`**

Find:

```html
        <p class="section-header__label">06 // Contact</p>
```

Replace with:

```html
        <p class="section-header__label">07 // Contact</p>
```

- [ ] **Step 5: Verify in browser**

Reload `index.html`. Scroll through; section numbers now read `01 // … 02 // Projects` then jump directly to `04 // Stack` (because `03` is reserved for the not-yet-built Competitions section). Confirm only the four labels above changed.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(sections): renumber labels to reserve 03 for Competitions"
```

---

## Task 3: Replace Project 1 card with Kalinga

**Files:**
- Modify: `index.html` (the `<!-- Project 1 -->` block, currently `data-project="hyperledger"`)

- [ ] **Step 1: Replace the Project 1 card**

Find the entire block starting with `<!-- Project 1 -->` and ending at the corresponding closing `</div>` of `<div class="project-card …">` (the block currently containing `data-project="hyperledger"`). Replace with:

```html
        <!-- Project 1 -->
        <div class="project-card reveal reveal-delay-1" data-project="kalinga" id="project-kalinga">
          <div class="project-card__image-wrap">
            <img src="assets/project-kalinga.png" alt="Kalinga Mental Wellness App" class="project-card__image" loading="lazy" onerror="this.src='assets/project-hyperledger.png'" />
          </div>
          <div class="project-card__body">
            <div class="project-card__tags">
              <span class="project-card__tag">React Native</span>
              <span class="project-card__tag">Expo</span>
              <span class="project-card__tag">TypeScript</span>
              <span class="project-card__tag">NativeWind</span>
              <span class="project-card__tag">Supabase</span>
            </div>
            <h3 class="project-card__title">Kalinga</h3>
            <p class="project-card__desc">Mobile mental wellness app for graveyard-shift BPO agents — guided check-ins, mood tracking, and AI-powered support tailored to night-shift cycles.</p>
            <div class="project-card__links">
              <a href="https://github.com/lauurnce/habi-4.0-ws-2026" target="_blank" rel="noopener noreferrer" class="project-card__link" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                Source
              </a>
            </div>
          </div>
        </div>
```

(Note: `id="project-kalinga"` enables the cross-link target. `onerror=` falls back to the existing image so layout doesn't break before the user supplies the new asset. No Live Demo link because none exists yet.)

- [ ] **Step 2: Verify in browser**

Reload. The first card in Projects should now read **Kalinga** with the new tags and description. Image either shows the kalinga PNG (if user already added it) or falls back to the hyperledger one. Source button opens the GitHub repo in a new tab.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(projects): replace card 1 with Kalinga"
```

---

## Task 4: Replace Project 2 card with Zero to Agent Manila

**Files:**
- Modify: `index.html` (the `<!-- Project 2 -->` block, currently `data-project="nebula"`)

- [ ] **Step 1: Replace the Project 2 card**

Find the `<!-- Project 2 -->` block (currently `data-project="nebula"`) and replace it with:

```html
        <!-- Project 2 -->
        <div class="project-card reveal reveal-delay-2" data-project="02a-manila" id="project-02a-manila">
          <div class="project-card__image-wrap">
            <img src="assets/project-02a-manila.png" alt="Zero to Agent Manila Official Website" class="project-card__image" loading="lazy" onerror="this.src='assets/project-nebula.png'" />
          </div>
          <div class="project-card__body">
            <div class="project-card__tags">
              <span class="project-card__tag">Next.js</span>
              <span class="project-card__tag">TypeScript</span>
              <span class="project-card__tag">Tailwind CSS</span>
              <span class="project-card__tag">Vercel</span>
            </div>
            <h3 class="project-card__title">Zero to Agent Manila — Official Website</h3>
            <p class="project-card__desc">Official event site for Zero to Agent Manila 2026 — Vercel-hosted Next.js landing for the AI agent-building community gathering.</p>
            <div class="project-card__links">
              <a href="https://github.com/lauurnce/02a-manila-2026" target="_blank" rel="noopener noreferrer" class="project-card__link" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                Source
              </a>
              <a href="https://02a-manila-2026.vercel.app" target="_blank" rel="noopener noreferrer" class="project-card__link" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Live Demo
              </a>
            </div>
          </div>
        </div>
```

- [ ] **Step 2: Verify in browser**

Reload. Second card now shows **Zero to Agent Manila — Official Website** with both Source and Live Demo links opening in new tabs.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(projects): replace card 2 with Zero to Agent Manila"
```

---

## Task 5: Replace Project 3 card with GreenProof

**Files:**
- Modify: `index.html` (the `<!-- Project 3 -->` block, currently `data-project="amberflow"`)

- [ ] **Step 1: Replace the Project 3 card**

Find the `<!-- Project 3 -->` block (currently `data-project="amberflow"`) and replace it with:

```html
        <!-- Project 3 -->
        <div class="project-card reveal reveal-delay-3" data-project="greenproof" id="project-greenproof">
          <div class="project-card__image-wrap">
            <img src="assets/project-greenproof.png" alt="GreenProof Recycle-to-Earn" class="project-card__image" loading="lazy" onerror="this.src='assets/project-amberflow.png'" />
          </div>
          <div class="project-card__body">
            <div class="project-card__tags">
              <span class="project-card__tag">Rust</span>
              <span class="project-card__tag">Stellar</span>
              <span class="project-card__tag">Soroban</span>
              <span class="project-card__tag">Web3</span>
              <span class="project-card__tag">TypeScript</span>
            </div>
            <h3 class="project-card__title">GreenProof</h3>
            <p class="project-card__desc">Stellar Soroban smart contract powering a Recycle-to-Earn waste management system that rewards Filipino residents with XLM for verified plastic recycling.</p>
            <div class="project-card__links">
              <a href="https://github.com/lauurnce/greenproof-ph" target="_blank" rel="noopener noreferrer" class="project-card__link" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                Source
              </a>
              <a href="https://stellar.expert/explorer/testnet/contract/CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG" target="_blank" rel="noopener noreferrer" class="project-card__link" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                On-chain Contract
              </a>
            </div>
          </div>
        </div>
```

- [ ] **Step 2: Verify in browser**

Reload. Third card now reads **GreenProof** with the Stellar Expert contract link opening in a new tab.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(projects): replace card 3 with GreenProof"
```

---

## Task 6: Replace `projectData` modal entries

**Files:**
- Modify: `script.js` lines 433-480 (the `projectData = { hyperledger, nebula, amberflow }` object)

- [ ] **Step 1: Replace the `projectData` block**

In `script.js`, find the block:

```js
  // ─── Project Modal ───
  const projectData = {
    hyperledger: {
      …
    },
    nebula: {
      …
    },
    amberflow: {
      …
    },
  };
```

Replace the entire object literal (keep the `// ─── Project Modal ───` comment line above) with:

```js
  // ─── Project Modal ───
  const projectData = {
    kalinga: {
      title: 'Kalinga',
      desc: 'Kalinga (Filipino for "care") is a React Native app addressing unique mental health challenges faced by BPO agents working overnight shifts. Combines mood tracking, guided breathing exercises, sleep logging, and AI-driven peer support to help users build resilience against burnout, isolation, and circadian disruption.',
      image: 'assets/project-kalinga.png',
      tags: ['React Native', 'Expo', 'TypeScript', 'NativeWind', 'Supabase'],
      features: [
        'Mood + sleep tracking with night-shift-aware analytics',
        'Guided breathing & grounding exercises',
        'AI companion for late-night check-ins',
        'Anonymous peer support community',
        'Supabase-backed secure profile + history',
      ],
      liveUrl: '',
      sourceUrl: 'https://github.com/lauurnce/habi-4.0-ws-2026',
    },
    '02a-manila': {
      title: 'Zero to Agent Manila — Official Website',
      desc: 'Built and shipped the official Next.js site for Zero to Agent Manila 2026, an AI/agent developer event in the Philippines. Designed for fast load, mobile-first browsing, and conversion-driven CTAs covering schedule, speakers, venue, and registration.',
      image: 'assets/project-02a-manila.png',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      features: [
        'Responsive event landing with hero + agenda',
        'Speaker and sponsor showcase',
        'Registration CTA flow',
        'Optimized SEO + OpenGraph cards',
        'Deployed on Vercel edge',
      ],
      liveUrl: 'https://02a-manila-2026.vercel.app',
      sourceUrl: 'https://github.com/lauurnce/02a-manila-2026',
    },
    greenproof: {
      title: 'GreenProof',
      desc: 'GreenProof tackles Quezon City\'s 2,500-metric-ton daily waste problem by incentivizing recycling at the barangay level. Residents earn Stellar XLM for verified plastic deposits (1kg = 1 Impact Point), with all transactions recorded on a transparent on-chain ledger. Barangays and LGUs manage collection points and verification, turning waste segregation into a community-owned economic system.',
      image: 'assets/project-greenproof.png',
      tags: ['Rust', 'Stellar', 'Soroban', 'Web3', 'TypeScript'],
      features: [
        'On-chain Impact Points ledger (Stellar Testnet)',
        '1kg plastic = 1 XLM reward smart contract logic',
        'Barangay/LGU verification + collection point management',
        'Resident dashboard for tracking contributions',
        'Transparent auditable rewards via Soroban',
      ],
      liveUrl: 'https://stellar.expert/explorer/testnet/contract/CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG',
      sourceUrl: 'https://github.com/lauurnce/greenproof-ph',
    },
  };
```

- [ ] **Step 2: Patch the modal-open handler so empty `liveUrl` hides the Live button**

Locate the click handler that follows `projectData`, currently:

```js
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.project;
      const data = projectData[key];
      if (!data) return;

      document.getElementById('modalImage').src = data.image;
      document.getElementById('modalImage').alt = data.title;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalDesc').textContent = data.desc;
      document.getElementById('modalLive').href = data.liveUrl;
      document.getElementById('modalSource').href = data.sourceUrl;
```

Replace those last two `getElementById` lines with:

```js
      const modalLive = document.getElementById('modalLive');
      const modalSource = document.getElementById('modalSource');
      if (data.liveUrl) {
        modalLive.href = data.liveUrl;
        modalLive.style.display = '';
      } else {
        modalLive.style.display = 'none';
      }
      if (data.sourceUrl) {
        modalSource.href = data.sourceUrl;
        modalSource.style.display = '';
      } else {
        modalSource.style.display = 'none';
      }
```

- [ ] **Step 3: Verify in browser**

Reload. Click each project card:
- **Kalinga** modal: title, description, 5 tags, 5 features, Source button visible, Live Demo button hidden.
- **Zero to Agent Manila** modal: both buttons visible with correct URLs.
- **GreenProof** modal: both buttons visible with correct URLs.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat(modal): swap project data to real projects + handle missing live URLs"
```

---

## Task 7: Add Competitions section HTML

**Files:**
- Modify: `index.html` — insert a new `<section id="competitions">` immediately after the closing `</section>` of `#projects` (currently at line 158) and before `<!-- ========== TECH STACK ========== -->`.

- [ ] **Step 1: Insert the Competitions section**

After the line `</section>` that closes `#projects` (right before the `<!-- ========== TECH STACK ========== -->` comment), insert:

```html
  <!-- ========== COMPETITIONS ========== -->
  <section class="section" id="competitions">
    <div class="container">
      <div class="section-header reveal">
        <p class="section-header__label">03 // Competitions</p>
        <h2 class="section-header__title text-display-md">Wins &amp; Arenas</h2>
        <p class="section-header__desc">Hackathons, bootcamps, and innovation challenges where ideas were tested under pressure.</p>
      </div>

      <div class="competitions__timeline">
        <article class="competition-item reveal">
          <div class="competition-item__dot"></div>
          <p class="competition-item__period">Apr 2026</p>
          <div class="competition-item__header">
            <h3 class="competition-item__name">Presidential Annual Innovation Hackathon (HABI 4.0)</h3>
            <span class="status-badge status-badge--silver">2nd Place</span>
          </div>
          <p class="competition-item__role">Team</p>
          <p class="competition-item__desc">Built Kalinga, a React Native mental wellness app for graveyard-shift BPO agents. Awarded 2nd Place at the Presidential Annual Innovation Hackathon.</p>
          <a href="#project-kalinga" class="competition-item__project-link" data-project-link="kalinga">&rarr; Project: Kalinga</a>
        </article>

        <article class="competition-item reveal reveal-delay-1">
          <div class="competition-item__dot"></div>
          <p class="competition-item__period">Mar 2026</p>
          <div class="competition-item__header">
            <h3 class="competition-item__name">Zero Vector Ventures Hackathon</h3>
            <span class="status-badge status-badge--bronze">3rd Place</span>
          </div>
          <p class="competition-item__role">Duo</p>
          <p class="competition-item__desc">Competed in the first venture capital hackathon in the Philippines as a duo, securing 3rd Place.</p>
        </article>

        <article class="competition-item reveal reveal-delay-2">
          <div class="competition-item__dot"></div>
          <p class="competition-item__period">Mar 2026</p>
          <div class="competition-item__header">
            <h3 class="competition-item__name">Stellar PH Online Bootcamp</h3>
            <span class="status-badge status-badge--gold">Winner</span>
          </div>
          <p class="competition-item__desc">Won the Stellar Philippines Web3/Blockchain bootcamp by shipping GreenProof, a Recycle-to-Earn smart contract on Stellar Soroban.</p>
          <a href="#project-greenproof" class="competition-item__project-link" data-project-link="greenproof">&rarr; Project: GreenProof</a>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Verify in browser**

Reload. Below the Projects section there is now a Competitions section with three entries (HABI 4.0 / Zero Vector / Stellar PH). The cross-link pills are visible but unstyled — that's fine, styling comes next. Click "Competitions" in nav; smooth-scroll lands on the section.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(competitions): add Competitions timeline section"
```

---

## Task 8: Add Competitions + status-badge CSS

**Files:**
- Modify: `styles.css` — append a new section at the end of the file.

- [ ] **Step 1: Append CSS rules**

Add the following block to the end of `styles.css`:

```css
/* ============================================================
   COMPETITIONS
   ============================================================ */
.competitions__timeline {
  position: relative;
  padding-left: var(--space-2xl);
}

.competitions__timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 11px;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary-container), var(--outline-variant), transparent);
}

.competition-item {
  position: relative;
  padding-bottom: var(--space-3xl);
}

.competition-item:last-child {
  padding-bottom: 0;
}

.competition-item__dot {
  position: absolute;
  left: calc(-1 * var(--space-2xl) + 4px);
  top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--primary-container);
  box-shadow: 0 0 0 4px var(--surface);
  transition: background var(--transition-base), box-shadow var(--transition-base);
}

.competition-item:hover .competition-item__dot {
  background: var(--primary-container);
  box-shadow: 0 0 0 4px var(--surface), 0 0 12px var(--primary-container);
}

.competition-item__period {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--primary);
  margin-bottom: var(--space-xs);
}

.competition-item__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.competition-item__name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--on-surface);
  margin: 0;
}

.competition-item__role {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--on-surface-variant);
  margin-bottom: var(--space-sm);
  font-style: italic;
}

.competition-item__desc {
  color: var(--on-surface-variant);
  font-size: 0.9375rem;
  line-height: 1.7;
  max-width: 600px;
  margin-bottom: var(--space-sm);
}

.competition-item__project-link {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--primary);
  text-decoration: none;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--outline-variant);
  border-radius: 999px;
  transition: background var(--transition-base), border-color var(--transition-base);
}

.competition-item__project-link:hover {
  background: rgba(255, 140, 0, 0.1);
  border-color: var(--primary-container);
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-badge--gold {
  background: rgba(255, 196, 0, 0.15);
  color: #ffc400;
  border: 1px solid rgba(255, 196, 0, 0.4);
}

.status-badge--silver {
  background: rgba(200, 200, 220, 0.15);
  color: #c8c8dc;
  border: 1px solid rgba(200, 200, 220, 0.4);
}

.status-badge--bronze {
  background: rgba(205, 127, 50, 0.18);
  color: #e0a172;
  border: 1px solid rgba(205, 127, 50, 0.45);
}

.status-badge--neutral {
  background: rgba(255, 255, 255, 0.06);
  color: var(--on-surface-variant);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Project highlight pulse (triggered from competition cross-link) */
.project-card--highlight {
  outline: 2px solid var(--primary-container);
  outline-offset: 4px;
  box-shadow: 0 0 0 6px rgba(255, 140, 0, 0.15), 0 0 24px rgba(255, 140, 0, 0.4);
  transition: outline var(--transition-base), box-shadow var(--transition-base);
}

@media (prefers-reduced-motion: reduce) {
  .project-card--highlight {
    transition: none;
  }
}
```

- [ ] **Step 2: Verify in browser**

Reload. Confirm:
- Competitions timeline renders with the same vertical line + dots styling as Experience.
- "2nd Place" badge appears silver, "3rd Place" bronze, "Winner" gold.
- "→ Project: Kalinga" / "→ Project: GreenProof" pills are styled as rounded outlined buttons matching the site's amber theme.
- Hover on a competition dot makes it glow.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat(styles): add competitions timeline + status badges + project highlight"
```

---

## Task 9: Add cross-link highlight handler

**Files:**
- Modify: `script.js` — add a new handler block. Place it inside the existing `DOMContentLoaded` IIFE/scope, near the project-modal section so related logic stays together.

- [ ] **Step 1: Add the handler**

Find the line in `script.js` that opens the Project Modal block:

```js
  // ─── Project Modal ───
```

Immediately **before** that comment, insert:

```js
  // ─── Competition → Project cross-link highlight ───
  document.querySelectorAll('.competition-item__project-link').forEach(link => {
    link.addEventListener('click', () => {
      const key = link.dataset.projectLink;
      if (!key) return;
      const card = document.querySelector(`.project-card[data-project="${key}"]`);
      if (!card) return;
      // Smooth-scroll handler is already wired for anchor[href^="#"], so we
      // just need to add the pulse class after the scroll begins.
      window.setTimeout(() => {
        card.classList.add('project-card--highlight');
        window.setTimeout(() => {
          card.classList.remove('project-card--highlight');
        }, 1500);
      }, 400);
    });
  });
```

- [ ] **Step 2: Verify in browser**

Reload. From the Competitions section, click "→ Project: Kalinga". The page scrolls smoothly to the Projects section and the Kalinga card briefly pulses with an amber outline (~1.5s) then fades. Repeat with "→ Project: GreenProof" — the GreenProof card pulses.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat(script): highlight target project card on competition cross-link"
```

---

## Task 10: Final smoke test + push branch

**Files:** none modified

- [ ] **Step 1: Full-site walkthrough**

Open `index.html` in a browser (or run a local server — `python -m http.server` in the project root, then visit `http://localhost:8000`). Walk through:

1. Hero loads, no console errors.
2. Nav order: Home → Projects → Competitions → Stack → Experience → Certifications → Get in Touch.
3. Click each nav link; smooth-scroll lands correctly on each section.
4. Section headers count cleanly: 01, 02, 03, 04, 05, 06, 07.
5. Each project card opens its modal with correct title, tags, description, features, and link buttons.
6. Modal Live Demo button is hidden for Kalinga (no live URL), visible for the other two.
7. Competitions timeline shows three entries, latest (HABI 4.0) on top.
8. Each cross-link pill scrolls to the right card and pulses it.
9. Mobile width (DevTools responsive mode at 375px): nav collapses correctly, competition cards stack cleanly, badges don't overflow.
10. Source links + Live Demo links open the right URLs in new tabs.

- [ ] **Step 2: Push the branch (do NOT merge to main yet)**

```bash
git push -u origin feature/projects-competitions
```

The user can then preview in a browser, share the branch with others, or open a PR when ready. Do not merge to `main` until the user explicitly approves.

- [ ] **Step 3: Report completion to the user**

Tell the user:
- All ten tasks complete.
- Branch `feature/projects-competitions` pushed.
- Reminder: project images (`project-kalinga.png`, `project-02a-manila.png`, `project-greenproof.png`) still pending — fallbacks display the old hyperledger/nebula/amberflow PNGs until real assets are dropped into `assets/`.
- Awaiting user approval before merging to `main`.

---

## Self-Review Notes

- **Spec coverage:** All Section 3 content (3 projects + 3 competitions) maps to Tasks 3-7. Section 4.1 (nav) → Task 1; section 4.1 (renumbering) → Task 2; section 4.2 (markup) → Task 7; section 4.3 (badges) → Task 8; section 4.4 (cross-link) → Tasks 7+9; section 4.5 (modal data) → Task 6.
- **Open items:** Project images are explicitly handled via `onerror` fallbacks (Tasks 3-5) and a final reminder in Task 10 — no silent placeholder.
- **Type/key consistency:** `data-project` values (`kalinga`, `02a-manila`, `greenproof`) match `projectData` keys (Task 6) and `data-project-link` values (Task 7) and `id="project-<key>"` selectors (Tasks 3-5, 9).
- **No automated tests:** acknowledged up front — manual browser verification is built into every task.
