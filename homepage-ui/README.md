# Hallim homepage — drop-in handoff

Files:
- `styles/hallim-theme.css` — design tokens, Pretendard font-face, grain/grid texture. Import once (e.g. from `app/globals.css`: `@import "./hallim-theme.css";` or copy its contents in).
- `components/home/hallim-homepage.tsx` — the homepage UI. Client component, self-contained, ships with mock data.
- `app/home/page.tsx` — thin server-component page wrapper; replace the commented-out block with your real session/roadmap data fetch and pass it as the `data` prop.

## Install

```
npm i lucide-react
```

(Tailwind: no config changes needed — colors are referenced via CSS variables through arbitrary-value utilities, so this works on Tailwind v3 or v4.)

## Wiring real data

Replace the `data` prop with a `HallimHomeData` object (see the exported type in `hallim-homepage.tsx`):
- `level` / the level switch is local UI state only — wire `onChange` (currently inside `LevelSwitch`) to your actual level-switch mutation/persist call.
- `continueLesson` — pull from wherever the Companion roadmap tracks "last position."
- `readinessPercent` — whatever formula you use for roadmap completion / mock-exam performance.
- `quickAccess.*` — counts/labels for each of the six sections; `nextMockExamLabel` is a free-text string so you can show whatever's most relevant ("Set 6 available", "Continue Set 4", etc).

## Design notes (v3 — layout rebuilt against the HSK-app skeleton, single accent restored)

Rebuilt the structure to match the specific reference layout: top bar (logo, level dropdown, upgrade badge, bell) → compact stats strip → promo banner → 6-up icon grid → dark "Companion" journey card → mobile-only bottom tab bar. Reverted from the v2 multi-color experiment back to one accent (celadon teal), per explicit correction.

- **Level switch is now a dropdown** (`LevelDropdown`), not a segmented pill — matches the reference's "level-selector dropdown" exactly. Click-outside-to-close via a ref + listener.
- **Top bar adds the upgrade badge and notification bell** from the reference; dropped the avatar since the reference skeleton doesn't have one.
- **"Overall readiness" and "continue where you left off" are intentionally the same element** — the Companion card's progress ring and its "Continue: Unit X · Lesson Y" line. That's how the reference app itself works (one big card serves both), and duplicating a second readiness widget elsewhere would be redundant.
- **Reinterpreted, not copied, the visual treatment**: reference's filled progress *bar* → a ring (per your no-decorative-bars constraint); reference's mountain/forest *illustration* → CSS-drawn mountain silhouettes plus a literal dotted path with unit markers, since "roadmap" is literally the feature name — the path is a functional metaphor, not decoration; reference's corner *medal/badge* → a shield-check icon ("structured curriculum," not a game reward, per the no-gamification constraint.
- **All six icon-grid tiles share the same accent color** — the reference app itself uses a different color per icon, but your constraint (one accent, not scattered per-section) overrides matching that literally.
- **Bottom tab bar is mobile-only** (`lg:hidden`) and reinterpreted for TOPIK: Home / Companion / Practice / Me — dropped HSKK since TOPIK has no equivalent spoken-exam track; "Practice" is a sensible stand-in hub for the six practice sections.
- Pagination dots on the banner: skipped, as instructed.

## Design notes (v2 — multi-color revision, superseded)

The first pass used one accent everywhere, per a "single accent" constraint. Revised on request to use color more deliberately across the page:

- **Scene**: a reading room the evening before the exam — warm lamplight (the honey-gold primary) against a cool, dusk-toned room (the canvas and neutral ramp). Composed in OKLCH throughout via `impeccable`'s palette script, seeded on an amber/honey-gold anchor.
- **Two brand hues, two distinct jobs, nothing decorative**: `--hl-primary` (honey-gold) carries every primary action and "already done" state — CTA, level switch, readiness ring, D-day badge, done-chip. `--hl-current` (dusk indigo) has exactly one job: marking the lesson section you're on *right now*, so "done" and "current" are never the same color by coincidence.
- **The six practice categories get their own committed palette** (`--hl-cat-*` tokens) — this is deliberately the one surface allowed to break from an otherwise restrained neutral chrome (product-dashboard convention: one category-coded surface earns full color; everything else stays neutral).
- **Bento hierarchy in quick access, not six identical tiles**: Vocab training and Incorrect answers are the two sections with a *daily* actionable count, so they render as large, fully tinted cards with the count itself as the headline number. Listening / Reading / Real mock exam / Mock exams are lower-frequency catalog browsing, so they stay compact and neutral-white with only the icon carrying category color.
- **Neutrals are hue-linked**, not plain grey — ink/secondary/muted carry the same cool "dusk" undertone as the canvas.
- **Two typefaces, two jobs**: Pretendard for everything read (headings, labels, Korean/English prose — chosen because Inter+Noto Sans KR mismatches Hangul/Latin metrics), IBM Plex Mono for everything measured (readiness %, streak, words learned, D-day, the two bento counts). In a real Next.js project, load Plex Mono via `next/font/google` rather than the manual `@font-face` in `hallim-theme.css` (that's there only for non-Next drop-in use).
- **No filled progress bars**: readiness uses a gradient-stroke ring (primary → a warmer glow tone); streak/words/days-remaining are plain tabular-nums numbers in Plex Mono.
- **Dropped the uppercase-tracked "eyebrow" labels** ("CONTINUE YOUR ROADMAP") from the first draft — sentence-case labels instead, since tracked-caps kickers are a recognizable AI-generated-design tell.
- **No page-load stagger animation** — dashboards shouldn't choreograph their own load; motion is reserved for real interaction (hover, level-switch toggle, focus), 150–250ms, ease-out.
- **Radius system** (intentional, not uniform): 28px for container cards, 24px for the bento tiles, 16px for compact tiles, full-pill for interactive controls (buttons, chips, level switch, avatar).
