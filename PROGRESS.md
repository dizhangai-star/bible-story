# 光之窗 · Windows of Light: Progress

**Resume here:** read this file (and `TREATMENT.md`), then continue from **Next step**.

## Next step
**Sprint 2 (02-eden 18 s, 03-flood 20 s) SIGNED OFF by the user 2026-09-30.** Paused; next is **Sprint 3 ·
04-abraham, 05-exodus** when the user says go: shots from `clips/board.js` + TREATMENT §4, built as ONE continuous
camera per chapter (see Decisions), review with preview grids, then render each clip (`render.mjs <id> --silent`) and
send the single mp4s — do NOT compile the whole film until the delivery sprint. User is making the Suno track (SUNO.md).
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
- **Camera inside a chapter: continuous, no hard cuts between beats** (user, 2026-09-30): link beats with a slow push /
  hold / pull back so the progression reads (Eden is one camera: MS → push to the fruit → hold on the crack → pull
  back as the light leaves). Pose changes are blended in held glass steps, not swapped.
- **One window per chapter, one glass:** never swap the mosaic for flat panes (`GX.bg`) mid-chapter; new content
  (the bow) is cut over the same quarries. Natural motion (water, a floating ark) moves smoothly on `t`; the 8 fps
  step stays for figures' poses and wings.
- **No top-down floor mode** (`floorMode 2`): its blurred projection reads as a different style; show the floor light
  in the perspective view (Flood ends tilting down and pushing onto the rainbow on the flagstones).
- **Chapter transitions:** more than a fade to black — to design in the delivery sprint (ideas: the camera passes
  through the lead/stone between windows; a light wipe; the last pane's colour carrying into the next).

## Sprints
- [x] **0 · Brief + look + sample**: engine adapter, 01-genesis, style frames, SUNO.md
- [x] **1 · Cast sheet v2 · storyboard v1 · glass colour + rose** — signed off 2026-09-29
- [x] **2 · 02-eden, 03-flood** — signed off 2026-09-30 · [ ] **3 · 04-abraham, 05-exodus** · [ ] **4 · 06-david, 07-promise**
- [ ] **5 · Sound**: Suno track in, retime cuts to its beats, foley pass, mix
- [ ] **6 · Deliver**: chapter transitions (see Decisions), compile, check, srt, poster

## How it works
- `engine.html` imports `sg/*` modules; a clip's `state(t, E, T)` returns the demo's scene state
  (`cam [x, y, zoom]`, `sunU/bandW/sunI/sunCol/sx/sz`, `lancets[i].content(P, cx)`, `rose.lit(q, k)`, `roseI`, `pts`,
  `floorMode 1|2 + topCam/pm`, `inscription`, `gild`, `sweep`); the engine adds kit fades + banderole captions from
  `caps: [[t0, t1, en, zh]]` and copies the WebGL canvas onto `#cv`.
- World units: rose (0,-560) r175; lancets `LX = [-510,-170,170,510]`, 300 wide, apex −320, bottom 640; floor 900;
  carved band y 806. Wide framing `[0, 300, .5]` keeps the title clear of the banderole.
- `clips/_glass.js` (`window.GX`): star, band, serpent, bigTree, ark, rainbow, waves, cracks, drawCracks; shared scene
  helpers `light(E, 'dawn|noon|aft|dusk|night', o)`, `pose(E, name | [a, b, u])` (pose blend, face flips at .5),
  `fig(E, P, cx, base, who, pose, x, s, flip, castOverrides)`, `bg`, `garden`, `rain` (board.js delegates to them).
- Chapter clip pattern: `panes(E, t)` builds the four lancets for time t; `state(t, E)` picks the shot by t
  (hard cuts = `if` on t, moves = `key`), then sets `lancets`, `pts`, `time`. Figures move on `step(t)` (8 fps).
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
- Sprint 2 changes vs the board: Eve and the tree moved right in lancet III (her offering hand was clipped by the
  lancet border); the Eden crack starts at the fruit (66, 400) and the CU holds through it (no cut); after the fall
  both figures blend offer → `weep` (the fruit drops halfway). The serpent sits right of Eve (cx + 128),
  otherwise her body hides it. Flood lancet IV is stormy water, not a rainbow: the bow only appears at the turn (03-4),
  band by band (`GX.rainbow(..., n)`), over all four lancets while the rain fades and the water falls. Noah's hands (dove landing) are at world (245, 400).
  The dove painter faces right: mirror it (`scale(-s, s)`) when it flies left.
- After the light leaves a window keep `skyI` ≈ .08 and `amb` ≈ .045, or the figures vanish instead of "freezing in the dark".
- Content callbacks run at render time, after `state()`: compute anything `pts` needs (hand, fruit) as world
  constants, found with a `--crop` preview, not from inside the painter.
