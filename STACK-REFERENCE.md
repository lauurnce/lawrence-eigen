# Stack & Execution Reference — extracted from `law-21` ("North Star")

> **Purpose of this file.** It is a portable description of the tech stack and
> conventions of an existing project, written to be handed to an AI agent in a
> *different* repository as a reference. Drop it in the new repo as `CLAUDE.md`,
> or paste it into a chat and say "use this as the reference stack."
>
> **Source project:** a static, single-page, scroll-driven cinematic tribute site
> (real-time WebGL aurora scene + choreographed scroll narrative). Versions below
> are the *resolved installed* versions, verified by `npm ls`, not the caret
> ranges in `package.json`.

---

## 0. Read this before copying the stack

The source is a **one-page narrative experience**, not a conventional
application. It has no routes beyond `/`, no server, no database, no auth, no
client-side state management, and no tests. That shape drives most of the
choices below.

So the stack splits into two groups:

| | Portable to almost any project | Specific to a scroll-narrative one-pager |
|---|---|---|
| | Astro + TypeScript strict, design-token CSS, `sharp` image pipeline, `public/_headers` security/CSP, static deploy, progressive-enhancement discipline | `three.js` world, GSAP ScrollTrigger pins, Lenis smooth scroll, the preloader, `output: 'static'` with no adapter |

**If the new project is an actual application** (multiple routes, forms, data
fetching, persisted state, users), then:

- Keep: Astro, TypeScript config, the CSS token system, the image pipeline, the
  headers/CSP file, the progressive-enhancement rules, the deploy flow.
- Change: `output: 'static'` → `output: 'server'` **plus an adapter**
  (`@astrojs/cloudflare` to stay on Cloudflare). This is a real change, not a
  flag flip — SSR pages, endpoints, and `Astro.request` only exist in that mode.
- Reconsider: three.js/GSAP/Lenis are ~600 KB of the 693 KB bundle. Justify them
  per-project rather than inheriting them. Lenis in particular (hijacked scroll)
  fights native behavior in form- and list-heavy UIs.
- Add: Astro islands with a UI framework (`@astrojs/react`/`svelte`/`vue`) if
  the app needs interactive components. The source has **zero** UI framework —
  all interactivity is hand-written TypeScript against the DOM, which is
  sustainable for one page and painful for an app.

---

## 1. Tech stack (resolved versions)

### Runtime & tooling
| Thing | Version | Notes |
|---|---|---|
| Node | 24.18.0 | Verified working. Astro 5 needs ≥18.17.1. |
| npm | 11.16.0 | See the install-scripts note in §3. |
| TypeScript | via `astro/tsconfigs/strict` | No standalone `typescript` dep; Astro provides it. |
| Vite | 6.4.3 | Transitive via Astro. Not configured directly. |

### Framework
| Package | Version | Role |
|---|---|---|
| `astro` | 5.18.2 | Static site generator. `output: 'static'`, no SSR adapter. |
| `@astrojs/sitemap` | 3.7.3 | Emits `sitemap-index.xml` at build. Requires `site` in config. |

### Motion & 3D
| Package | Version | Role |
|---|---|---|
| `three` | 0.169.0 | Full-screen WebGL scene: custom GLSL shaders, `EffectComposer` + `RenderPass` + `UnrealBloomPass` from `three/examples/jsm/postprocessing/`. |
| `gsap` | 3.15.0 | Animation + `ScrollTrigger` (pins, scrubs) + `gsap.matchMedia()` for responsive choreography. Free plugins only — no Club/SplitText; line splitting is hand-rolled. |
| `lenis` | 1.3.23 | Smooth scroll. Driven from GSAP's ticker, not its own RAF: `gsap.ticker.add(t => lenis.raf(t * 1000))` and `lenis.on('scroll', ScrollTrigger.update)`. This single-ticker wiring is the important detail — two RAF loops desync. |

### Type
| Package | Version | Role |
|---|---|---|
| `@fontsource-variable/space-grotesk` | 5.2.10 | Display face. |
| `@fontsource-variable/fraunces` | 5.2.9 | Body face (variable axes `opsz`/`SOFT`/`WONK` are actually used). |

Self-hosted via npm and imported in the layout — no Google Fonts request, which
is what lets `font-src 'self'` hold in the CSP.

### Build-time & deploy (devDependencies)
| Package | Version | Role |
|---|---|---|
| `sharp` | 0.33.5 | Offline image pipeline (`scripts/process-images.mjs`) **and** Astro's image service. |
| `wrangler` | 4.103.0 | Cloudflare Pages deploy CLI. |

### Deliberately absent
No test runner, no ESLint/Prettier, no CSS framework (Tailwind etc.), no UI
framework, no state library, no CI config. Styling is hand-written CSS with
custom properties. Treat these as gaps to fill in a new project, not as
endorsements — a real application wants at least a linter, formatter, and tests.

---

## 2. Repository layout

```
astro.config.mjs          static output, site URL, sitemap, sharp image service
tsconfig.json             extends astro/tsconfigs/strict
package.json              4 scripts: dev / build / preview / deploy
BLUEPRINT.md              design bible: palette, type, per-section intent
docs/plans/               dated implementation plans (YYYY-MM-DD-NNN-slug.md)
docs/superpowers/         specs + plans from agent-assisted sessions
scripts/process-images.mjs  offline sharp pipeline → public/img + derived JSON
src/
  pages/index.astro       the only route; composes layout + sections
  layouts/Base.astro      <head>, meta/OG, fonts, canvas, frame, preloader, entry <script>
  components/
    Chrome.astro          persistent HUD (chapter rail, sound toggle, dateline)
    Gilding.astro         scroll-progress margin line (SVG)
    Picture.astro         responsive <picture> over the baked AVIF/WebP
    sections/*.astro      one file per narrative beat, each with scoped <style>
  scripts/
    motion.ts             ENTRY POINT — orchestrates everything
    world.ts              three.js scene (largest file, ~1400 lines)
    textures.ts           pure canvas → THREE.CanvasTexture builders
    kinetic.ts            hand-rolled line-splitting + reveal
    ambient.ts            procedural Web Audio wind/drone (no asset)
    track.ts              looping music bed via Web Audio GainNode
    audio-utils.ts        shared AudioContext helpers
  styles/global.css       ALL design tokens + reset (~290 lines)
  data/copy.ts            every user-facing string, typed
  data/flag-colors.json   generated by the image script — do not hand-edit
  assets/                 SOURCE images (inputs to the pipeline)
public/
  _headers                Cloudflare security headers + CSP
  img/                    GENERATED responsive AVIF/WebP — build artifacts
  audio/, favicons, manifest.webmanifest, robots.txt
```

### Conventions worth carrying over

1. **One CSS token file, scoped styles everywhere else.** `global.css` owns the
   palette, fluid type scale (`clamp()`), spacing rhythm, and easings as custom
   properties. Every component uses Astro's scoped `<style>` and consumes tokens.
   No utility classes, no CSS-in-JS.
2. **Fluid everything.** Type and spacing are `clamp()` expressions, not
   breakpoint steps. Media queries are reserved for behavior changes, not sizing.
3. **All copy in one typed module.** `src/data/copy.ts` exports one `copy`
   object; components import it rather than hardcoding strings. Cheap i18n path
   and makes copy edits a one-file diff.
4. **Cross-layer contracts named once per side.** Example: the `has-world` class
   is a `const HAS_WORLD` in `world.ts` and a `:global(html.has-world)` selector
   in the CSS, with a comment on both sides pointing at the other.
5. **Generated assets are gitignored and rebuilt on demand**, never hand-edited.
6. **Dated plan docs.** `docs/plans/YYYY-MM-DD-NNN-slug.md` keeps design intent
   next to the code.

---

## 3. How it's executed

### Local dev — the whole setup
```bash
npm install     # only step needed; there is no .env, no service, no DB
npm run dev     # → http://localhost:4321/
```

Verified from a clean clone: `node_modules` missing → `npm install` → dev server
ready in ~85 ms, page returns HTTP 200 with the WebGL scene live and no console
errors.

**Two gotchas worth knowing (both verified, neither is a blocker):**

- **npm 11 blocks install scripts by default.** The install prints a warning
  that 8 packages' scripts (`sharp`, `esbuild`, `workerd`, `fsevents`) were not
  run. It does **not** matter here: those packages ship prebuilt platform
  binaries as `optionalDependencies`, and both load fine (`sharp` → libvips
  8.15.3, `esbuild` → `darwin-arm64` binary present). Don't reflexively run
  `npm approve-scripts` — check whether the binary actually loads first.
- **`package-lock.json` predates the caret ranges**, so installs resolve
  *forward*: `package.json` says `astro ^5.6.1`, you get 5.18.2. Fine here, but
  in a new project either commit a fresh lockfile or pin exact versions.

### Scripts
| Command | What it does |
|---|---|
| `npm run dev` | `astro dev` — HMR, localhost only (add `--host` for LAN/mobile). |
| `npm run build` | `astro build` → `dist/`. Verified: ~1.1 s. |
| `npm run preview` | `astro preview` — serves `dist/` as static files. Always check the build here before deploying; `dev` and `dist` differ. |
| `npm run deploy` | `astro build && wrangler pages deploy dist` — manual push, needs a `wrangler login`. |
| `node scripts/process-images.mjs` | **Manual, not part of the build.** Regenerates `public/img/*` + `src/data/flag-colors.json` from `src/assets/`. Run only when source images change. |

### Build output
Static `dist/`: one `index.html`, hashed `_astro/*` assets, `sitemap-index.xml`.
One JS chunk at **693 KB / 195 KB gzip**, which trips Vite's 500 KB warning —
that's three.js + GSAP, unsplit. If you inherit those libraries in a new
project, code-split them (`manualChunks` or dynamic `import()`), because here
the bundle is deliberately eager to make the preloader honest.

### Deploy target
Cloudflare Pages, static. Build command `astro build`, output dir `dist`.
Two paths: the `npm run deploy` script (manual, from a machine with wrangler
auth), or Pages' git integration (push-to-deploy, configured in the dashboard).
`public/_headers` is Cloudflare-specific — on Vercel/Netlify it must be
translated to `vercel.json` headers or `netlify.toml`.

---

## 4. Runtime architecture

`Base.astro` loads exactly one module: `<script>import '../scripts/motion.ts'</script>`.
Astro bundles it; there is no other client entry. `motion.ts` then:

1. Reads media queries once: `prefers-reduced-motion`, `pointer: fine/coarse`.
2. Starts Lenis (skipped entirely under reduced-motion).
3. Calls `initWorld()` in a `try/catch` — a `null` return is a supported,
   fully-designed state, not an error path.
4. Registers ScrollTrigger timelines, wraps responsive variants in
   `gsap.matchMedia()`.
5. Wires the sound toggle, choosing the audio-file bed if reachable and the
   procedural Web Audio bed otherwise.
6. Dismisses the preloader.

### The pattern most worth stealing: layered degradation
Every capability has a designed fallback, and the fallback is styled as a real
experience rather than a broken one.

- **No JS:** `<noscript>` CSS hides the preloader so the page can't be trapped;
  content is in the HTML and visible because reveals only hide once
  `html.js` is set by an inline script.
- **Bundle fails to load:** an inline `setTimeout` dismisses the preloader after
  4.5 s regardless. The safety net is inline precisely so it can't be taken out
  by the failure it guards against.
- **No WebGL / context creation throws:** `initWorld()` returns `null`, the
  `has-world` class never lands, and each section's CSS falls back to a static
  gradient (`:global(html.has-world) .hero__fallback { display: none }` — i.e.
  the fallback is the default and the world *removes* it).
- **Reduced motion:** no pins, no parallax, content shown at final state. Plus
  an explicit "Enter the living world" button that calls `initWorld(force)` —
  treating a click as consent a media query can't give.
- **Weak or throttled GPU:** a rolling 90-frame FPS average steps quality down
  in tiers (bloom off → DPR 1.25 → DPR 1) before surrendering to the DOM
  fallback; outlier frames >250 ms are discarded so one GC pause can't tear the
  scene down. Give-ups are capped (`MAX_GIVE_UPS = 2`) so a slow device can't
  oscillate between world and fallback.
- **Tab away / focus loss / bfcache:** listens to `visibilitychange`, `focus`,
  and `pageshow`, all funnelling into one idempotent `resume()` that
  hard-restarts the RAF chain if it hasn't painted in >1 s.
- **Audio:** fades run on a Web Audio `GainNode`, not RAF, so a throttled main
  thread can't leave the track stuck at the wrong volume.

The generalizable rule: **the degraded path is the default state, and the
enhancement removes it.** Never the reverse.

### Performance techniques present
DPR capped by device class (`min(dpr, coarse && small ? 1.25 : small ? 1.5 : 2)`);
particle counts halved under 760 px; `IntersectionObserver` gates canvas RAF
loops so offscreen effects don't run; textures built once as small 2D canvases
rather than shipped as images; images baked to AVIF+WebP at build time so the
runtime never does a canvas pass.

### Accessibility present
Skip link; `aria-hidden` on every decorative canvas/frame layer; `aria-label` on
sections whose visual text is split into per-character spans; `:focus-visible`
ring with a dark companion shadow for legibility over the glow; 44 px minimum
touch targets; full reduced-motion honoring.

---

## 5. Security posture (`public/_headers`)

Worth copying nearly verbatim — it's a strict, working CSP for a static site:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
  connect-src 'self' https://ntfy.sh; worker-src 'self' blob:; base-uri 'none';
  form-action 'none'; frame-ancestors 'none'; object-src 'none';
  upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Plus `Cache-Control: public, max-age=31536000, immutable` on `/_astro/*`, which
is safe because those filenames are content-hashed.

Adapt when reusing:
- `'unsafe-inline'` on `script-src` is required by Astro's inline bootstrap
  scripts. Tighten with hashes/nonces if you can.
- `img-src 'self' data:` — `data:` is needed for the canvas-built textures.
- `connect-src` lists `https://ntfy.sh` **only** because this project pings a
  fallback-telemetry beacon. Drop it, and drop the beacon, unless you
  deliberately want that.
- `form-action 'none'` **will break any form.** A real app needs `'self'`.

---

## 6. Quick prompt for the other repo's agent

> Use `STACK-REFERENCE.md` as the reference stack. Match it on: Astro +
> TypeScript strict, design tokens as CSS custom properties in one `global.css`
> with scoped component styles, fluid `clamp()` type/spacing, all copy in a
> typed `src/data/copy.ts`, offline `sharp` image pipeline emitting AVIF+WebP,
> security headers and CSP in `public/_headers`, and layered graceful
> degradation where the fallback is the default state and the enhancement
> removes it. Do **not** carry over three.js/GSAP/Lenis, `output: 'static'`, or
> the preloader unless I ask — this project is an application, so expect an SSR
> adapter, an islands framework for interactive components, and a linter,
> formatter, and tests, none of which the reference project has.
