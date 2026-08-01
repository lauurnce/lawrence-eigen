# Handoff: portfolio work, 30 July – 1 August 2026

**Last updated:** 2026-08-01
**Status:** ALL SHIPPED AND COMMITTED. Deployed to production via Vercel from `main`.
**Blocked on:** nothing. See section 0 for what is genuinely still open.

This started as a handoff for the tiered `#community` rebuild (sections 1–10, still
accurate) and has grown to cover everything built across the three days. Newer work
is in sections 11–15.

`description.txt` at the repo root holds Lawrence's source material: the Quick Quest
curriculum for weeks 3 to 6, his LinkedIn posts for the Quick Quest kickoff and the
AWS Polar workshop, and his style rules.

---

## 0. What is still open

1. **Node graph placeholders.** Lawrence wants empty slots in the hero graph ready
   for information he has not decided on yet. See section 15 — this is the main
   thing to pick up next.
2. Accuracy pass on `bwai25`, the one Tier 3 entry with no source post (section 7).
3. The open questions in section 6.

---

## 1. Current file state

Everything below is committed as of 2026-08-01.

```
 M index.html      #community section, nav, tech stack, projects carousel,
                   events-attended toggle, hero scene markup
 M styles.css      tier CSS, stack lanes, carousel, hero scene + node card
 M script.js       data arrays, render functions, gallery, carousel controller
 A hero-scene.js   dot portrait + node graph (self-contained, ~70KB with the
                   luminance map inlined as a data URI)
 A tools-cutout.swift       Vision-framework subject cutout
 A tools-build-dotmap.py    tone-map + downsample into the inlined dotmap
 A assets/speakership/      processed event photos, 8 events
 A assets/events/           attended-event photos, 8 events
 A assets/tech/             38 stack logos
 A assets/lawrence-dotmap.png   source of the inlined map
 A description.txt, STACK-REFERENCE.md, HANDOFF-community-section.md
```

**Deliberately NOT committed** (see `.gitignore`):
- `_incoming/originals-backup/` — 11MB of untouched originals, nothing references it
- `assets/events ive attended/` — 5.1MB raw folder, superseded by `assets/events/`
- `assets/lawrence-cutout.png` — 1.6MB, only needed to regenerate the dotmap

`preview-community.html` was deleted once the feature shipped into the real site.

---

## 2. The goal (achieved)

"Community & Impact" used to be a sub-block nested inside `#experience`: a flat
`.leadership__grid` of 9 cards that flattened three different kinds of thing into one
visual weight. It is now its own `#community` section with three tiers of descending
emphasis:

1. **Speaking & Roles** - talks given, positions held
2. **Organizing Team** - events he helped run *without speaking*
3. **Events Attended** - events attended, with what he learned

All three tiers carry photos and real descriptions. Emphasis comes from **size,
orientation, and density**, not from presence or absence of imagery.

---

## 3. Decisions locked (all confirmed by Lawrence)

| # | Decision | Detail |
|---|---|---|
| 1 | **Own top-level section** | New `<section class="section" id="community">` between `#experience` and `#certifications`. Cut the sub-block out of `#experience`, leaving it a clean Career Timeline. |
| 2 | **Nav gets an 8th link** | `data-nav="community"`, placed between Experience and Certifications. Scrollspy (`script.js:151-158`) matches `data-nav` to section `id` generically, so **no JS change needed** for it to work. |
| 3 | **Progressive de-emphasis** | Tier 1 vertical photo cards (3-col) → Tier 2 horizontal cards, photo left (2-col) → Tier 3 compact rows w/ thumbnail (1-col). |
| 4 | **All tiers get photos + descriptions** | Tier 2 describes *what he contributed*; Tier 3 describes *what he learned*. |
| 5 | **Gallery on all tiers** | Any item with ≥1 image becomes clickable and opens the existing gallery overlay. Reuses `openGallery(data)` — it already takes a plain data object, no refactor needed. |
| 6 | **Data-driven arrays** | Three arrays in `script.js` + render functions, following the certifications pattern (`script.js:56`). Adding an event = appending one object. No HTML editing. |
| 7 | **Scaffold with templates** | Do not invent content. Empty tiers ship as clearly-marked template slots. |
| 8 | **Tier 1 keeps `.leadership-card`** | Renaming to `.community-card` would churn 6 CSS blocks (`styles.css:1282, 1924, 2078, 2336`) plus the cursor-hover selector at `script.js:195` for zero user-visible gain. Tiers 2 and 3 are new classes. |

### Notable design consequence
The gallery data is **derived from the arrays**, killing `speakingGalleryData` (`script.js:562`) as a
separately-maintained object. Today the ACM and AI Maxxin cards duplicate their copy across `index.html`
*and* that object, and the two can drift. After this, each item is defined once:

```js
const communityGallery = {};
[...speaking, ...organizing, ...attended].forEach(item => {
  if (item.images?.length) communityGallery[item.id] = { ... };
});
```

---

## 4. How to run it

```bash
cd /Users/lauurnce/projects/lawrence-eigen
python3 -m http.server 8765 --bind 127.0.0.1
# http://127.0.0.1:8765/index.html  -> the Community nav link
```
NOTE: `python3 -m http.server` does not send cache-busting headers. After editing
`styles.css` the browser will happily serve a stale copy. Hard-reload, or append
`?cb=<timestamp>` to the stylesheet href, or you will debug a phantom bug. This
already cost time once this session.

**Verified in Chrome:** section renders between Experience and Certifications; nav
highlights Community on scroll; tiers read **9 items / 4 items / 3 slots**; all 37
image refs resolve with zero broken images; gallery opens from BOTH Tier 1 and Tier 2
with correct title, story and thumbnails, Escape and arrow keys work; reveal
animations fire on all tiers; no console errors; no horizontal overflow at 500px or
1440px; Tier 2 collapses to a stacked column below 768px.

`script.js` is cached by the browser the same way `styles.css` is. Reloading the page
is not always enough after a JS edit, use `location.reload()` or a hard reload.

---

## 5. Resolved

1. **Photoless Tier 1 cards left dead space** - `align-items: start` on
   `.leadership__grid`, so cards size to content instead of the row height.
2. **AI Lead card showed the GitHub logo** - replaced with a chip icon.
3. **Responsive rules landed in the wrong breakpoint.** Appended next to the existing
   `.leadership__grid` rule, which lives in `@media (max-width: 480px)`, but designed
   for 768px. Moved. CHECK WHICH `@media` BLOCK YOU LAND IN when adding more.
4. **Cover photos cropped badly.** `.leadership-card__img-wrap` was a fixed 150px
   strip against roughly 3:2 sources. Now `aspect-ratio: 16 / 10` with
   `object-position: center`.
5. **Tier 2 thumbnails stretched to card height,** because the flex parent's default
   `align-items: stretch` overrides `aspect-ratio`. Fixed with
   `align-self: flex-start` on `.organizing-card__img-wrap`.

---

## 6. OPEN QUESTIONS - ask Lawrence, do not decide unilaterally

1. **Tier placement of two older items.** Both sit in Tier 1 but read as organizing:
   - **Zero to Agent Manila** - *"Led technical sessions"* is speaking, but if he was
     organizing-side and someone else presented, it belongs in Tier 2.
   - **Deputy Head for Research & Extension** - *"coordinated over 12 student groups"*
     is organizing work wearing a role title.
   Note he HAS since confirmed the Quick Quest split (weeks 1 and 6 speaking, 2 to 5
   organizing), so he is willing to make this call. Just ask.
2. **Quick Quest Week 2 topic.** Its curriculum was not in his paste, so `qq-w2` covers
   his role only. Extend it to match the others once he supplies the topic.
3. **Exact dates for Quick Quest W2, W3, W4.** Currently "Week N of 6".
4. **Photos for `ailead` and `z2a`**, the two Tier 1 cards with no imagery.
5. **Accuracy review** of the `awspolar`, `qq-w1` and `qq-w6` copy. It is derived from
   his own LinkedIn posts and curriculum, but he has not read it back yet.

---

## 7. Content status

### DONE - Tier 1, Speaking & Roles (9 items)
| id | title | photos |
|---|---|---|
| `awspolar` | Resource Speaker · AWS Learning Club Polar | 3 |
| `qq-w1` | Speaker · Build Nights: Quick Quest Kickoff | 4 |
| `qq-w6` | Speaker · Quick Quest Week 6 | 5 |
| `acm` | Resource Speaker · ACM Core VerteX | 1 |
| `aimaxxin` | Technical Speaker · AI Maxxin | 1 |
| `ailead` | Department of AI Lead | 0 |
| `startupdev` | Associate Start Up Dev Director | 1 |
| `research` | Deputy Head for Research and Extension | 1 |
| `z2a` | Technical Lead · Zero to Agent Manila | 0 |

### DONE - Tier 2, Organizing Team (4 items)
Quick Quest weeks 2 to 5. Lawrence was technical and curriculum handler and led the
speaker lineup, so these are organizing rather than speaking.

| id | topic | photos |
|---|---|---|
| `qq-w2` | (no curriculum supplied) | 4 |
| `qq-w3` | Automate Repetitive Tasks with Quick Flows | 4 |
| `qq-w4` | Spaces and Memory | 2 |
| `qq-w5` | Research-in-Flows | 3 |

**Card copy vs gallery story.** `qq-w3` is the one item that splits the two: its
`contributed` is a short overview sized to match `qq-w2` (119 vs 122 chars, so the two
cards in the top row end at the same height), and the full session detail lives in
`story`, which only shows once the gallery is opened. Do the same for any future item
whose full write-up would unbalance its row.

**Split rule:** Lawrence spoke at Quick Quest weeks 1 and 6 only. Everything between
is organizing.

### Sourcing notes
- Copy is derived from `description.txt` (his LinkedIn posts and curriculum) plus
  participant counts already in the stats strip (kickoff 60, W2 69, W3 65, W4 54).
- **`qq-w2` has no curriculum in his paste**, so its copy covers his role only. If he
  supplies the Week 2 topic, extend it to match the other three.
- **Exact dates are only known for W1 (Jun 19), W5 (Jul 17), W6 (Jul 24).** W2, W3 and
  W4 use "Week N of 6" rather than an invented date. The series ran Friday nights, so
  the missing dates are inferable, but they were NOT guessed.
- Style rules he gave: no em dashes, use commas; professional and educative; real
  technical terms; emphasise the tech stack in both speaking and organizing copy;
  omit the personal names from his posts. All applied.

### DONE - Tier 3, Events Attended (8 items)
Sourced from `assets/events ive attended/events descriptions.txt` (his LinkedIn posts)
and the photos in that same folder. Ordered newest first. Photos processed into
`assets/events/<slug>/`, cover photo as `1.jpg`, same 1400px/q45 convention.

| id | event | date | photos |
|---|---|---|---|
| `sonai26` | State of the Nation in AI 2026 | Jan 2026 | 2 |
| `bwai25` | Build with AI: Gemini 2.0 and Streamlit | May 2025 | 3 |
| `awsaiml25` | AWS User Group May Meetup: AI/ML Edition | May 2025 | 2 |
| `limitless25` | LIMITLESS: National Youth Summit on Statistics | May 2025 | 3 |
| `phtcf25` | Philippine Tech Career Fest | Mar 2025 | 3 |
| `arduino25` | Arduino Day Philippines 2025 | Mar 2025 | 3 |
| `nuclear25` | Igniting Discussion on Nuclear Energy | Mar 2025 | 3 |
| `blockchain25` | Introduction to Blockchain Technology | Jan 2025 | 2 |

Each carries a short `learned` line for the row plus a longer `story` for the gallery,
the same split as `qq-w3`. Row size was deliberately left unchanged at his request.

**NEEDS HIS REVIEW: `bwai25`.** His source file says "Formulate my description here
because i didnt post it on linkedin", so both the `learned` line and the `story` for
that one event were written from the event title alone, not from anything he wrote.
The Gemini 2.0 and Streamlit specifics are plausible for that session but UNVERIFIED.
Every other entry is a summary of his own post.

## 8. Next steps

1. **Accuracy pass on `bwai25`**, the one Tier 3 entry with no source post. See section 7.
2. Resolve the open questions in section 6.
3. ~~Commit.~~ Done 2026-08-01. History is split across the three days the work
   actually happened on, and `_incoming/` is gitignored.

### Adding a new entry
Append one object to the right array in `script.js`. No HTML editing.

```js
{ id: 'unique-id', icon: 'mic',        // Tier 1 only; see COMMUNITY_ICONS
  title: '...', org: '...', date: '...',
  images: ['assets/speakership/<slug>/1.jpg'],   // 1.jpg is the card's lead photo
  desc: '...',                          // Tier 1 card copy
  contributed: '...',                   // Tier 2 instead of desc
  learned: '...',                       // Tier 3 instead of desc
  story: '...' }                        // long-form gallery text, optional
```
Any item with a non-empty `images` becomes clickable and opens the gallery. An item
with `template: true` renders as an empty dashed slot and flips the tier's counter
label from "items" to "slots".

### Processing new photos
Match the existing convention: name the lead file so it contains "cover", then resize
to max 1400px at JPEG q45 with `sips` to land near the 110-230KB of current assets.
Back originals up before overwriting.

---

## 9. Out of scope (agreed)

- The stats strip (`#stats-strip`, `index.html:151-202`). Its "Workshop participants 431" breakdown
  overlaps this content, but it is deliberately untouched. Revisit only if Lawrence asks.
- `STACK-REFERENCE.md` — unrelated file, currently open in his IDE. (It is NOT empty,
  as an earlier revision of this doc claimed: it is 301 lines describing the `law-21`
  stack. Leave it alone, do not treat it as scratch.)

---

## 10. Line references (verified current)

| What | Where |
|---|---|
| `#community` section markup | `index.html:540-585` |
| Tier mount points | `index.html:557` / `569` / `581` |
| Nav links | `index.html:50-60` |
| Stats strip (out of scope) | `index.html:152-202` |
| Gallery overlay markup | `index.html:690` |
| Community CSS block | `styles.css:1280-1604` (ends where CERTIFICATIONS starts, 1606) |
| `.tier-header` / `.tier-block` | `styles.css:1286-1335` |
| `.leadership__grid` (Tier 1) | `styles.css:1337` |
| `.organizing-card` (Tier 2) | `styles.css:1354` |
| `.attended-row` (Tier 3) | `styles.css:1443` |
| `.leadership-card` base | `styles.css:1562` |
| Community responsive rules | `styles.css:2128` (`@media max-width: 768px`) |
| Design tokens | `styles.css:10-101` |
| Light theme (`html.light`) | `styles.css:2437+` |
| `communitySpeaking` (Tier 1 data) | `script.js:297` |
| `communityOrganizing` (Tier 2 data) | `script.js:398` |
| `communityAttended` (Tier 3 data) | `script.js:448` |
| Gallery data derivation | `script.js:455` |
| Render functions | `script.js:469+` |
| `openGallery(data)` | `script.js:908` |
| `[data-community]` click/keydown handler | `script.js:983` |
| Certifications data pattern | `script.js:56` |
| Scrollspy | `script.js:158` |
| Cursor hover selector | `script.js:195` |

Line numbers drift with every edit. Grep the identifier if one looks wrong.

---

## 11. Tech Stack section (31 July)

"Tech Arsenal" became "Tech Stack": three lanes of logos scrolling horizontally in
alternating directions, pausable and draggable.

- 38 logos in `assets/tech/`, referenced from the stack data in `script.js`.
- Lanes are CSS-animated tracks duplicated once so the loop is seamless. Dragging
  swaps the animation out for direct `scrollLeft` control and hands it back on release.
- The section was later scaled to 2× to sit under the display-scale header. That
  broke when `content-visibility` was applied to it — the lane height collapsed
  because the browser skipped layout for off-screen content. **`#stack` must stay
  out of any `content-visibility: auto` rule.**
- `STACK-REFERENCE.md` documents the `law-21` stack this borrows patterns from. It
  is reference material, not scratch — leave it alone.

---

## 12. Projects carousel (31 July)

The project grid became a horizontal carousel.

- Native scroll with `scroll-snap`, not a JS-positioned track, so keyboard and
  trackpad behaviour comes for free.
- `--projects-per-view` drives how many cards fit: 3 on desktop, 2 at 1024px, 1 at 768px.
- Rapid clicks **queue** a target position rather than being swallowed by the
  in-flight smooth scroll.
- Cross-links from the competitions section scroll the carousel so the referenced
  project is visible.
- Two new projects added: `survivalKitApp` and `feedy`. Order is survival kit,
  feedy, kalinga, greenproof, zero to agent.

---

## 13. Events Attended collapse (31 July)

Tier 3 renders only the 3 most recent events with a toggle revealing the other 5.
The button text carries the hidden count. Collapsing scrolls back to the section
header, but only when the section would otherwise end up above the viewport —
the target is computed *before* the DOM changes, not after.

---

## 14. Hero scene: dot portrait + node graph (31 July – 1 August)

The signature element. `hero-scene.js`, self-contained, no dependencies.

**The portrait.** A halftone print plate: an even grid of circles whose size and
colour carry the photograph's tone. The cursor repels the dots and they spring back.

- Pipeline: `tools-cutout.swift` (macOS Vision `VNGenerateForegroundInstanceMaskRequest`
  cuts the subject out) → `tools-build-dotmap.py` (tone map, two-pass unsharp,
  percentile stretch, highlight knee, downsample) → base64 inlined into
  `hero-scene.js` at the `__DOTMAP_DATA_URI__` placeholder.
- **Rebuild by rerunning the pipeline, never by hand-editing the base64 blob.**
- Inlined rather than fetched so `getImageData` can never trip canvas
  origin-tainting, including on `file://`.
- The map resolution must stay *ahead* of the finest dot pitch. At 148px wide with
  a ~155-column grid the map became the limit on face detail, not the pitch. It is
  210px now.
- Forces sample each dot's **rest** position, not its current one, so the field is
  a stable deformation with a guaranteed resting state.
- The portrait at rest is cached to an offscreen canvas and blitted. Without that,
  the constantly drifting nodes would force ~13,000 arcs to re-path every frame.
  Measured 1.36ms/frame under the cursor, 0.06ms idle.

**The graph.** Hub-and-spoke, in the manner of an Obsidian vault. Each cluster in
the `GRAPH` array is one hub node with its entries as leaves; every hub spokes
inward to a single point behind the portrait.

- Spokes converge on that centre, **never on his silhouette** — anchoring to his
  outline tethered the graph to his edges.
- `silhouetteHit()` trims every edge before it reaches him and fades it out. The
  dot field is mostly gaps, so a line drawn "behind" the portrait still shows
  through all of them. March by fixed 4px stride, not a fixed step count, or long
  spokes overshoot into him.
- Nodes render neutral at 40% alpha and only take their cluster colour on hover or
  click. Cluster colours are generated from one `hue` each via HSL so both themes
  stay legible without two hand-maintained palettes.
- Portrait height is matched to the copy block so both halves of the hero read as
  one composition.
- Dark mode is orange; light mode is gold, in the headline's `--primary` family.

**Two traps worth knowing about:**

1. **Anything overlaying the canvas must not eat pointer events.** `.hero__content`
   is an 860px column whose block/flex children reported full width, and it was
   swallowing hover across most of the portrait. The fix is `pointer-events: none`
   on `.hero__content`, `pointer-events: auto` + `width: fit-content` on each text
   element, and `pointer-events: none` on `.hero__scroll-hint`.
2. **Verify clickability with `document.elementFromPoint`, across the whole drift
   cycle** — never by calling `pickHover()` directly. That bypasses the DOM and will
   happily report nodes as reachable while an overlay eats the events. A node can
   also be reachable at rest and blocked mid-drift.

Layout measures the **inked** text extent (`Range.selectNodeContents`) for sizing and
the **element box** for keep-outs — the box is what captures events, and `.hero__desc`
runs ~33px wider than its longest line. A node placed in that gap looks free but is
unclickable.

**Placement rule: never place a node where it cannot be clicked.** Only node-to-node
spacing may relax; the copy keep-out never does.

---

## 15. Node graph content and placeholders — OPEN

Content lives in one `GRAPH` array at the top of `hero-scene.js`. Nothing else needs
touching to add or change an entry.

```js
{ hub: 'Film', hue: 24, items: ['Oppenheimer', 'Interstellar', 'The Prestige'] }
```

- `hub`   the cluster name; shown as the card's eyebrow and on the hub node
- `hue`   0–360, colours the whole cluster on hover/click
- `items` one leaf node each

Currently 9 clusters / 22 leaves: Film, Series, Band, Reading, Coffee, Comfort food,
Unwind, Best hours, Learning.

### What Lawrence wants next

**Placeholder slots for information not yet decided.** The graph should be able to
carry empty nodes that read as deliberate gaps rather than missing data — somewhere
to hang future answers without rebuilding the layout each time.

Design notes for whoever picks this up:

- Follow the pattern already used in the community tiers: an item with
  `template: true` renders as an empty dashed slot rather than a filled card. The
  graph wants the same idea — an outlined node instead of a filled one, no label
  until it has content.
- A placeholder must still respect the placement rules above. It is a real node
  with a real hit area, so it has to land somewhere clickable.
- Clicking one should say what it is for, not read as broken. Something like
  "Not decided yet" in the card body rather than an empty panel.
- Keep the count honest. If a cluster is 3 real items and 1 placeholder, the hub
  card should not imply four answers exist.
- Candidate clusters he has already been asked about but not answered: first gig,
  album, game, weekend, when stuck, desk, first line of code, next. Those questions
  are recorded in the conversation of 2026-08-01 and are reasonable defaults for
  the first placeholder slots.

### Adding a cluster

Append to `GRAPH`. The layout finds space for it automatically — hubs search outward
from a preferred angle until they clear both the copy and the silhouette. Watch the
node count on a 375px viewport afterwards: all hubs and leaves must still place, and
`document.elementFromPoint` must return the canvas at every node's position.
