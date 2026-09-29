# 光之窗 · Windows of Light: Progress

**Resume here:** read this file (and `TREATMENT.md`), then continue from **Next step**.

## Next step
**Sprint 1 (cast · storyboard · glass look) SIGNED OFF by the user 2026-09-29.** Paused; next is **Sprint 2 ·
02-eden, 03-flood** when the user says go: build each chapter clip from its shots in `clips/board.js` (key-frame state
per shot) + TREATMENT §4, then a silent draft for review. User is making the Suno track (SUNO.md).
Code: https://github.com/dizhangai-star/bible-story (renders not in git; `../_kit` required).

## Decisions (locked)
- **Style:** stained glass, lemo-opuscar renderer vendored in `sg/` (see `sg/README.md`); film-local engine, kit untouched.
  `film.config` style label is `stained-glass`; the kit has no such pack (scaffolded from cg-lab, style pack replaced).
- **Format:** 16:9, 1920×1080, 24 fps (glass figures step at 8 fps, light/camera on ones).
- **Language / captions:** 繁體中文 (和合本) above, English (KJV) below, two-line banderole. No narration.
- **Fonts:** Cinzel (carving), IM Fell English (+ italic, captions), Noto Serif TC 500/600 — Google Fonts.
- **Audio:** soundtrack 'film'. Music from Suno at `audio/suno/film.wav` (temp score until then); glass foley in code.
- **Chapters:** 7 (≈ 2:00), approved 2026-09-29.
- **Hall look (darker, sacred):** `amb` ≈ .075 after sunrise, `ambCol [.62,.64,.82]`, `spill .5` (glow thrown on the
  wall by lit panes, new compositor uniform), `contrast .22`, `vign .62`, `haze .45`, `raysK .55`. Title: `gild .18`
  with the sweep light parked on the carving (`sweep [0, 700, .55, BOT+166]`). Before/after: `docs/look-compare.png`.
- **Glass colour (approved):** fine quarries (15) coloured by what the region depicts — arch head = warm ornament,
  sky = blues (night: deep blue/violet), ground = greens/earth/sand, sea = blue/teal; ~4 % contrast accents; figures
  stand on the cool sky zone. One key per chapter: `GX.KEYS` in `clips/_glass.js`; a pane opts in with
  `{ glass: GX.glass(E, '<chapter>') }`. Pearls turn gold/white/green/sky. Before/after: `docs/glass-compare.png`.
- **Rose (approved):** petals in their creation-day colours (gold · cobalt · emerald · amber · teal · ruby, pairs
  clockwise from the top) + a 36-piece jewel ring; every rose part has `.petal` for day-by-day lighting.
- **Storyboard (approved):** TREATMENT.md §4 / `docs/storyboard.png`; Exodus at night.
- **God is never drawn; God is the light.** Art all drawn in code.

## Sprints
- [x] **0 · Brief + look + sample**: engine adapter, 01-genesis, style frames, SUNO.md
- [x] **1 · Cast sheet v2 · storyboard v1 · glass colour + rose** — signed off 2026-09-29
- [ ] **2 · 02-eden, 03-flood** · [ ] **3 · 04-abraham, 05-exodus** · [ ] **4 · 06-david, 07-promise**
- [ ] **5 · Sound**: Suno track in, retime cuts to its beats, foley pass, mix
- [ ] **6 · Deliver**: compile, check, srt, poster

## How it works
- `engine.html` imports `sg/*` modules; a clip's `state(t, E, T)` returns the demo's scene state
  (`cam [x, y, zoom]`, `sunU/bandW/sunI/sunCol/sx/sz`, `lancets[i].content(P, cx)`, `rose.lit(q, k)`, `roseI`, `pts`,
  `floorMode 1|2 + topCam/pm`, `inscription`, `gild`, `sweep`); the engine adds kit fades + banderole captions from
  `caps: [[t0, t1, en, zh]]` and copies the WebGL canvas onto `#cv`.
- World units: rose (0,-560) r175; lancets `LX = [-510,-170,170,510]`, 300 wide, apex −320, bottom 640; floor 900;
  carved band y 806. Wide framing `[0, 300, .5]` keeps the title clear of the banderole.
- `clips/_glass.js` (`window.GX`): star, band, serpent, bigTree, ark, rainbow, waves, cracks, drawCracks.
- `clips/sf.js`: style frames (dev clip). Sfx kinds in `audio/music.mjs`: glass {m}, crack, air {d}, bell {m}.

## Notes
- Cast iconography (v2, checked against the text and medieval/Doré tradition): Moses = two gold rays from the head
  (Ex 34:29), brown hair + grey beard; Goliath = `drawGoliath` (knight + brass helmet + weaver's-beam spear, no sword,
  1 Sam 17:5–7); David = ruddy/auburn hair, shepherd's bag + strap, sling (1 Sam 16:12, 17:40); Eve = `fem` face
  (thin arched brows, lip tint) + front hair lock; Noah = dove in his hands; elders = `old` age lines.
- Gold gilding on sunlit stone is unreadable: keep `gild` ≤ .15 in daylight (dark incised letters read).
- `raysK` .45 in wide shots, or the shafts wash out lancet IV and the title.
- Unlit rose pieces: dim transmittance to ~3 % (`rose.lit`), otherwise the petals don't read as lighting one by one.
- Serpent on a green crown disappears (colour on colour): serpent is gold/umber.
- `compile.mjs --out` skips the film mix; for a one-clip sample use `out/<id>.mp4` (it has the film track slice).
