# 光之窗 · Windows of Light: Progress

**Resume here:** read this file (and `TREATMENT.md`), then continue from **Next step**.

## Next step
**Sprint 4 (06-david 16 s, 07-promise 20 s; 02-eden re-cut with shards) SIGNED OFF by the user 2026-09-30.**
**Sprint 5 · Sound in progress:** Suno dropped (user, 2026-09-30) → music written in code, `audio/score.mjs`, per clip.
Score 01–07 SIGNED OFF by the user 2026-09-30 (mixed into out/). Next: foley pass if needed, then Sprint 6 ·
Deliver (transitions, Latin inscription, compile, check, srt, poster). Renders are per clip in `out/` (not in git).
Code: https://github.com/dizhangai-star/bible-story (renders not in git; `../_kit` required).

## Decisions (locked)
- **Style:** stained glass, lemo-opuscar renderer vendored in `sg/` (see `sg/README.md`); film-local engine, kit untouched.
  `film.config` style label is `stained-glass`; the kit has no such pack (scaffolded from cg-lab, style pack replaced).
- **Format:** 16:9, 1920×1080, 24 fps (glass figures step at 8 fps, light/camera on ones).
- **Language / captions:** 繁體中文 (和合本) above, English (KJV) below, two-line banderole. No narration.
- **Fonts:** Cinzel (carving), IM Fell English (+ italic, captions), Noto Serif TC 500/600 — Google Fonts.
- **Audio:** soundtrack 'film'. Music **in code** (user, 2026-09-30; Suno tried and dropped: Cover of an uploaded
  guide gave a 3-min song, no instrumental switch, no usable API): `audio/score.mjs`, one score function per clip
  (clip seconds, placed at the clip's start), pipe organ + alto recorder + harp, D Dorian, 80 BPM (0.75 s/beat); the
  glass foley (sfx) carries the chimes/bells, so scores play around those notes (e.g. the recorder an octave under the
  day notes). Unscored clips get a quiet drone. The picture is the master: music is written to the cues.
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
- **Breaks are shards, not lines** (user, 2026-09-30): the pane is cut along the cracks into shards that shift out
  from the break, turn a little and lose light (tilted glass); the gaps let a little light through. A break stays
  until 07 mends it: shards slide back (outside in, 8 fps), then lead welds from the break outward (spark on the
  beat); the scars stay and the pane is brighter whole than broken. Only real breaks are mended (02 fruit, 06 brow).
- **Chapter transitions:** more than a fade to black — to design in the delivery sprint (ideas: the camera passes
  through the lead/stone between windows; a light wipe; the last pane's colour carrying into the next).

## Sprints
- [x] **0 · Brief + look + sample**: engine adapter, 01-genesis, style frames
- [x] **1 · Cast sheet v2 · storyboard v1 · glass colour + rose** — signed off 2026-09-29
- [x] **2 · 02-eden, 03-flood** — signed off 2026-09-30 · [x] **3 · 04-abraham, 05-exodus** — signed off 2026-09-30 · [x] **4 · 06-david, 07-promise** — signed off 2026-09-30
- [ ] **5 · Sound**: code score per clip (`audio/score.mjs`) — [x] 01–07 signed off 2026-09-30; foley pass, mix
- [ ] **6 · Deliver**: chapter transitions (see Decisions), compile, check, srt, poster
  - Polish (user, 2026-09-30): the carved string-course title `光之窗 · WINDOWS OF LIGHT` → Latin, as a real European
    church would carve it (Roman capitals, V for U). Options: `FENESTRAE LVCIS` (literal title) · `FIAT LVX` (Gen 1:3,
    Vulgate) · `POPVLVS QVI AMBVLABAT IN TENEBRIS VIDIT LVCEM MAGNAM` (Isa 9:2, echoes 07). Set in `inscription` of
    01-genesis, 07-promise, board.js; Chinese/English title then lives in the opening card / poster. Re-render 01, 07.

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
- Music: `audio/score.mjs` `SCORES[id](I, A)` with `I = { organ(t, d, midi|[midi], v, o), recorder(t, d, m, v, o),
  harp(t, m, v, pan) }` in clip seconds; `tone()` options atk/rel/vib/chorus/breath/amp(u). `node ../_kit/audio/mix.mjs
  <id>` rebuilds the film track and muxes the clip's slice into out/<id>.mp4. Each clip is scored in its own buffer,
  cut by its fade (no tails into the next chapter). Silences (Eden 9.4–12.2, David 9.4–12.2, Promise 15.55–16.4)
  need short harp rings (`harp(t, m, v, pan, ring)`): the default 3.5 s ring fills them.
- Chapter keys: 01 D Dorian → D major on the light · 02 G major → E7 → silence → D minor · 03 Dm/Bb/C ostinato → F
  → A → open D → G · 04 G (the stars are the melody) · 05 Dm pursuit → G → D (rays) → C–D → G · 06 Bb → A → D major
  whirl → silence → G · 07 D → G → Em → A · the Genesis line over F–C–Bb–A → silence → D major (echo of the light).

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
- Sprint 3 changes vs the board: Abraham opens low and close (feet/hill) and tilts up with his gaze; a narrow moonbeam
  on lancet II opens over the whole window during the pull back. The abraham glass key has no gold (accent/pearls
  night/violet) so the stars (`GX.star(..., col)`, white/pale-gold flat pinholes, ~600, lit in distance order) are the
  only light-coloured glass. Exodus: the fire is the only light — the sun band covers I (pillar) + II (Moses, "light
  to these") and opens rightward over the sea as it parts; `pts` add the fire glow (2) + Moses' rays (world −172, 318).
  Moses uses `stretch` (arm forward-up, defined in the clip): `raiseStaff` hides his face. The sea: five water bands
  per side over a sand road, sliding apart and heaping into walls; road half-width grows with y (perspective); Israel
  walks up the road shrinking. `GX.KEYS[k].pearl` = optional pearl families.
- `preview --crop` is in logical SCREEN units (640×360), not world: convert with the camera (x = cam.x + (3·sx − 960)/zoom).
- Only 4 `pts` point lights per frame (comp.js uniform array).
- Sprint 4 changes vs the board: David — Israel's tents (I), the brook + five stones (II); the stone is a point of
  light (`pts`) arcing from David's hand (world 215, 420) to Goliath's brow (522, 282), the camera rides it back; the
  crack starts at the brow, then Goliath blends guard → kneel (head bowed), the band opens over the whole window.
  (Superseded: crack lines → shards, see Decisions.) Poses built in the clip (`E.FPOSE.throw`, whirl = sling pose with wF turning 90° per step). `GX.pose` now accepts a
  pose object. Promise — one travelling light: cold moon band over I–III → gathers onto IV and warms as the lamp
  kindles → pale dawn ray on I; the lamp pane keeps shining by a large warm `pts` light. Welds: cracks drawn bright,
  lead laid over them from the break outward (`mend`), a spark `pts` at the break flaring on each 0.75 s beat.
  Night with moonlight only (no band) is black: always give night chapters a dim band.
- `GX.shatter` works on the pane already drawn: it snapshots the glass (g) and surface (s) canvases, clears the
  shards' area (gap colour on g, transparent on s) and redraws each shard clipped + moved. Call it LAST in a pane's
  content (figures are cut with the glass). `breakAt` caches shards per (cx, point, seed, n); the same seed in 07 as
  in the chapter gives the same break. Dev clip `shatter-test` shows one full break → mend cycle.
