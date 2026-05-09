# Personalize Projects + Add Competitions Section — Design Spec

**Date:** 2026-05-09
**Owner:** Lawrence
**Files affected:** `index.html`, `styles.css`, `script.js`

---

## 1. Goal

Replace placeholder portfolio projects (HyperLedger, Nebula OS, Amber Flow) with three real projects, and introduce a new Competitions section that highlights wins and participations. Cross-link competitions to the projects they produced.

## 2. Scope

**In scope**
- Replace project cards (3) and modal data (3) with real content.
- Add a new `#competitions` section to `index.html`.
- Add navigation entry and reorder section labels (`02 // Projects`, `03 // Competitions`, `04 // Stack`, `05 // Experience`, `06 // Certifications`, `07 // Contact`).
- Add CSS for status badges and (optional) reuse of timeline styles.
- Cross-link competitions ↔ projects via on-card pill that scrolls to the project card.

**Out of scope**
- Project images (user will supply later; keep `placeholder` filenames).
- Backend or CMS changes — content stays inline in `index.html` / `script.js`.
- Mobile redesign beyond what current responsive rules already cover.
- Refactoring unrelated sections.

## 3. Content

### 3.1 Projects (replace existing 3)

#### Project 1 — Kalinga
- **Card desc:** Mobile mental wellness app for graveyard-shift BPO agents — guided check-ins, mood tracking, and AI-powered support tailored to night-shift cycles.
- **Modal desc:** Kalinga (Filipino for "care") is a React Native app addressing unique mental health challenges faced by BPO agents working overnight shifts. Combines mood tracking, guided breathing exercises, sleep logging, and AI-driven peer support to help users build resilience against burnout, isolation, and circadian disruption.
- **Tags:** React Native, Expo, TypeScript, NativeWind, Supabase
- **Source:** https://github.com/lauurnce/habi-4.0-ws-2026
- **Live:** none
- **Image:** `assets/project-kalinga.png` (placeholder until supplied)
- **Features:**
  - Mood + sleep tracking with night-shift-aware analytics
  - Guided breathing & grounding exercises
  - AI companion for late-night check-ins
  - Anonymous peer support community
  - Supabase-backed secure profile + history
- **Linked competition:** Presidential Annual Innovation Hackathon (HABI 4.0)

#### Project 2 — Zero to Agent Manila — Official Website
- **Card desc:** Official event site for Zero to Agent Manila 2026 — Vercel-hosted Next.js landing for the AI agent-building community gathering.
- **Modal desc:** Built and shipped the official Next.js site for Zero to Agent Manila 2026, an AI/agent developer event in the Philippines. Designed for fast load, mobile-first browsing, and conversion-driven CTAs covering schedule, speakers, venue, and registration.
- **Tags:** Next.js, TypeScript, Tailwind CSS, Vercel
- **Source:** https://github.com/lauurnce/02a-manila-2026
- **Live:** https://02a-manila-2026.vercel.app
- **Image:** `assets/project-02a-manila.png` (placeholder until supplied)
- **Features:**
  - Responsive event landing with hero + agenda
  - Speaker/sponsor showcase
  - Registration CTA flow
  - Optimized SEO + OpenGraph cards
  - Deployed on Vercel edge
- **Linked competition:** none

#### Project 3 — GreenProof
- **Card desc:** Stellar Soroban smart contract powering a Recycle-to-Earn waste management system that rewards Filipino residents with XLM for verified plastic recycling.
- **Modal desc:** GreenProof tackles Quezon City's 2,500-metric-ton daily waste problem by incentivizing recycling at the barangay level. Residents earn Stellar XLM for verified plastic deposits (1kg = 1 Impact Point), with all transactions recorded on a transparent on-chain ledger. Barangays and LGUs manage collection points and verification, turning waste segregation into a community-owned economic system.
- **Tags:** Rust, Stellar, Soroban, Web3, TypeScript, JavaScript
- **Source:** https://github.com/lauurnce/greenproof-ph
- **Live:** https://stellar.expert/explorer/testnet/contract/CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG
- **Image:** `assets/project-greenproof.png` (placeholder until supplied)
- **Features:**
  - On-chain Impact Points ledger (Stellar Testnet)
  - 1kg plastic = 1 XLM reward smart contract logic
  - Barangay/LGU verification + collection point management
  - Resident dashboard for tracking contributions
  - Transparent auditable rewards via Soroban
- **Linked competition:** Stellar PH Online Bootcamp

### 3.2 Competitions (new section, latest first)

| # | Name | Date | Status | Role | Linked Project |
|---|------|------|--------|------|----------------|
| 1 | Presidential Annual Innovation Hackathon (HABI 4.0) | Apr 2026 | 2nd Place | Team | Kalinga |
| 2 | Zero Vector Ventures Hackathon | Mar 2026 | 3rd Place | Duo | — |
| 3 | Stellar PH Online Bootcamp | Mar 2026 | Winner | — | GreenProof |

**Per-entry copy:**
- HABI 4.0 — Built Kalinga, a React Native mental wellness app for graveyard-shift BPO agents. Awarded 2nd Place at the Presidential Annual Innovation Hackathon.
- Zero Vector Ventures — Competed in the first venture capital hackathon in the Philippines as a duo, securing 3rd Place.
- Stellar PH Online Bootcamp — Won the Stellar Philippines Web3/Blockchain bootcamp by shipping GreenProof, a Recycle-to-Earn smart contract on Stellar Soroban.

## 4. Architecture

### 4.1 Section ordering and navigation

| Slot | ID | Label |
|------|----|----|
| 01 | `#home` | Home |
| 02 | `#projects` | Projects |
| 03 | `#competitions` | **Competitions (new)** |
| 04 | `#stack` | Stack |
| 05 | `#experience` | Experience |
| 06 | `#certifications` | Certifications |
| 07 | `#contact` | Contact |

Update:
- `nav__links` in `index.html` — insert `<a href="#competitions">` between Projects and Stack.
- All `section-header__label` numbers in affected sections — Stack becomes `04`, Experience `05`, Certifications `06`, Contact `07`.

### 4.2 Competitions section markup (sketch)

```html
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
        <p class="competition-item__desc">Built Kalinga…</p>
        <a href="#projects" class="competition-item__link" data-project-link="kalinga">→ Project: Kalinga</a>
      </article>
      <!-- repeat for Zero Vector + Stellar PH -->
    </div>
  </div>
</section>
```

Visual base reuses `experience__timeline` patterns to maintain stylistic consistency.

### 4.3 Status badge styles

Add to `styles.css`:

```css
.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.status-badge--gold   { background: rgba(255, 196, 0, 0.15);  color: #ffc400; border: 1px solid rgba(255, 196, 0, 0.4); }
.status-badge--silver { background: rgba(200, 200, 220, 0.15); color: #c8c8dc; border: 1px solid rgba(200, 200, 220, 0.4); }
.status-badge--bronze { background: rgba(205, 127, 50, 0.15);  color: #cd7f32; border: 1px solid rgba(205, 127, 50, 0.4); }
.status-badge--neutral{ background: rgba(255, 255, 255, 0.06); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.15); }
```

Mapping: Winner → gold, 2nd Place → silver, 3rd Place → bronze, Finalist/Participant → neutral.

### 4.4 Cross-link UX

- Each competition linked to a project includes a `→ Project: [Name]` pill that scrolls to the matching `#projects` card.
- Implementation: anchor `href="#projects"` plus `data-project-link="<key>"`. Add a small handler in `script.js` that, on click, scrolls to `#projects` and applies a brief highlight (`.project-card--highlight`) class to the matching card for ~1.5s.
- Highlight style: subtle outline / glow consistent with existing reveal animation.

### 4.5 Project modal data update (`script.js`)

Replace the `projectData` object's three entries with `kalinga`, `02a-manila` (or keep keys as `02aManila`), and `greenproof`. Update each `data-project` attribute on the corresponding card in `index.html`.

## 5. Error handling / edge cases

- Missing project images → use existing alt text + a CSS fallback background so layout never breaks.
- Cross-link clicked while `#projects` not in DOM (shouldn't happen) → handler no-ops.
- Reduced motion preference → highlight fade respects `prefers-reduced-motion: reduce` (skip transition, just set/clear class).

## 6. Testing

- Manual: load page in browser; verify nav order, smooth-scroll to all sections, modal opens with new content for each card.
- Manual: click each `→ Project:` pill; verify scroll lands on the right card and highlight pulses.
- Visual: sanity check status badge colors at desktop + mobile widths.
- Lighthouse / responsive check: section reordering should not regress accessibility or layout shift.
- Cross-browser smoke (Chrome + Firefox).

## 7. Open items

- Project images: user to supply `project-kalinga.png`, `project-02a-manila.png`, `project-greenproof.png`. Until then, current placeholder PNGs in `assets/` are renamed/duplicated or a CSS placeholder is used. Decision: keep filenames as listed above; page falls back gracefully if files absent.
