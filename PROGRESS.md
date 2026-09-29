# 光之窗 · Windows of Light: Progress

**Resume here:** read this file (and `TREATMENT.md`), then continue from **Next step**.

## Next step
**Cast sheet v1 delivered (2026-09-29), waiting for approval:** `frames/castsheet.png` (also `docs/`), dev clip
`clips/cast.js`, rig `sg/figure.js` (costumes in `CAST`, poses in `FPOSE`). After approval: **Sprint 2 · 02-eden,
03-flood** (see TREATMENT clip list), then compile a silent draft for review. User is making the Suno track.
Sample approved; darker hall look approved (user left it to Claude; see Decisions). Code on GitHub:
https://github.com/dizhangai-star/bible-story (renders not in git; `../_kit` required).

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
- **God is never drawn; God is the light.** Art all drawn in code.

## Sprints
- [x] **0 · Brief + look + sample**: engine adapter, 01-genesis, style frames, SUNO.md
- [ ] **1 · Cast sheet** v1 done → approval
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
- Gold gilding on sunlit stone is unreadable: keep `gild` ≤ .15 in daylight (dark incised letters read).
- `raysK` .45 in wide shots, or the shafts wash out lancet IV and the title.
- Unlit rose pieces: dim transmittance to ~3 % (`rose.lit`), otherwise the petals don't read as lighting one by one.
- Serpent on a green crown disappears (colour on colour): serpent is gold/umber.
- `compile.mjs --out` skips the film mix; for a one-clip sample use `out/<id>.mp4` (it has the film track slice).
