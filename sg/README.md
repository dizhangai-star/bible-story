# sg/ — vendored stained-glass renderer

From **lemo-opuscar** by LemoLab × Claude Opus 5.5 — https://github.com/lemomo-ai/lemo-opuscar/tree/main/styles/stained-glass
(code MIT, see `LICENSE-lemo-opuscar.txt`; the style guide STYLE.md and demo film are CC BY 4.0). Copied 2026-09-29.

| file | from | local changes |
|---|---|---|
| glass.js dragon.js lib.js | demo/, core/lib.js | none (import path of lib.js only) |
| window.js | demo/window.js | rose redrawn (day-coloured petals, 36-piece jewel ring, `.petal` on every part); `mosaic(P, i, {quarry, pearl, band, fillet, fine})` palette hooks (defaults = demo); painters exported; `st.content(P, cx, base)` hook for per-film pane art; `drawRose(P, {lit})` dims unlit rose pieces; carved text falls back to Noto Serif TC |
| scene.js | demo/scene.js | passes `st.rose` to drawRose; `st.ltint` overrides shaft tints; passes `st.spill` |
| comp.js | demo/comp.js | `spill` uniform (default 1 = demo) scales the glow lit panes throw on the stone |
| knight.js test.js | demo/ | shapes, grisaille helpers, panel helpers exported (used by figure.js, clips/cast.js) |
| figure.js | new | robed figures on the knight's fk skeleton: costumes `CAST`, poses `FPOSE` |
| subs.js | demo/subs.js | two-line banderole: `"中文\nEnglish"` |
| story.js | demo/story.js | reference only (not loaded): timing/crack/re-lead patterns |

The style's own rules live in its STYLE.md upstream (light is time, glass projects onto stone, crack + re-leading,
self-lit pane at night; 8 fps stepped figures; hue-preserving tone map; dark flesh glass). Its "no religious imagery"
line is a rule of the demo fable, not of the licence; this film is a Bible story by the user's brief.
