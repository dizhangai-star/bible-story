// 04 · 亞伯拉罕 Abraham — night; a thin moonbeam finds Abraham alone on the hill in lancet II (low, close); the camera
// tilts up with his gaze as he lifts his head and the first stars light one by one above him; then one long pull back
// as the moonlight opens over the whole window and the stars multiply past counting (pinholes of light), the rose
// faintly starlit. Beats (TREATMENT §4), one continuous camera: 04-1 low on Abraham, slow tilt up · 04-2 pull back.
window.CLIP = {
  id: '04-abraham',
  uses: ['_glass', '05-exodus'],
  duration: 17.2,
  timing: { fadeIn: [-1, 0], fade: [17.2, 17.2] },   // no fades: the joints hand the picture over (Sprint 6)
  caps: [
    [0.9, 4.9, 'Look now toward heaven, and tell the stars, if thou be able to number them.', '你向天觀看，數算眾星，能數得過來麼？'],
    [5.8, 8.9, 'So shall thy seed be.', '你的後裔將要如此。'],
    [9.8, 14.0, 'And he believed in the LORD; and he counted it to him for righteousness.', '亞伯蘭信耶和華，耶和華就以此為他的義。'],
  ],
  T: { up: 1.6, first: 1.8, pull: 5.6, many: 6.4, wide: 11.6 },
  // J4 · "so shall thy seed be" → that people, fleeing: one star in lancet I becomes the pillar of fire
  J: { next: '05-exodus', t0: 14.2,
    // A · a star becomes fire: the sky goes out but one star low in lancet I, which warms and swells; under its glare
    // the window becomes the night of the Exodus and the camera arrives on the pillar
    A(E, a, b, u) {
      const { ss, seg, lerp, LX } = E, GX = window.GX, on = ss(seg(u, .05, .25)), grow = ss(seg(u, .3, .55)), off = ss(seg(u, .55, .95));
      const o = GX.mixState(GX.dark(a, ss(seg(u, 0, .45))), GX.dark(b, 1 - ss(seg(u, .5, 1))), ss(seg(u, .05, 1)), () => u >= .5);
      // the star: small and white, alone as the sky goes out; it warms and swells into the fire's glow
      const col = [1, lerp(.95, .66, grow), lerp(.85, .3, grow)];
      o.pts = [[LX[0] + 30, 380, lerp(10, 280, grow), lerp(7, 4, grow) * on * (1 - off), col], ...o.pts].slice(0, 4);
      return o;
    },
    // B · into the dark: the moonlight closes, the camera trucks left to lancet I in the dark, the fire lights
    B(E, a, b, u) {
      const { ss, seg } = E, GX = window.GX;
      return GX.mixState(GX.dark(a, ss(seg(u, 0, .45))), GX.dark(b, 1 - ss(seg(u, .55, 1))), ss(u), () => u >= .5);
    } },
  N0: 11,   // the first stars, lit one by one above Abraham

  // the sky of lancets I–IV: a few cut stars and many pinholes, in the order they light. The first N0 are over
  // Abraham (lancet II); the rest spread out from there. Deterministic, built once.
  sky(E) {
    if (this._sky) return this._sky;
    const { LX } = E, r = E.mulberry(8040), S = [];
    for (let k = 0; k < this.N0; k++) S.push({ i: 1, x: LX[1] - 110 + r() * 220, y: -250 + r() * 470, big: true, r: 13 + r() * 7 });
    for (let k = 0; k < 620; k++) {
      const i = Math.floor(r() * 4), x = LX[i] - 135 + r() * 270, y = -300 + r() * 790, big = r() < .08;
      if (y > 470 || (i === 1 && Math.abs(x - LX[1]) < 55 && y > 360)) continue;   // above the hills, clear of Abraham
      S.push({ i, x, y, big, r: big ? 7 + r() * 6 : 3.4 + r() * 2.6, d: Math.hypot(x - LX[1], (y - 100) * .8) + r() * 160 });
    }
    const rest = S.slice(this.N0).sort((a, b) => a.d - b.d);
    return (this._sky = S.slice(0, this.N0).concat(rest));
  },
  // how many stars are lit at t: one by one (stepped with the notes), then past counting
  lit(t) {
    const T = this.T;
    if (t < T.first) return 0;
    if (t < T.many) return Math.min(this.N0, 1 + Math.floor((t - T.first) / .42));
    return Math.min(this._sky.length, Math.floor(this.N0 + 560 * Math.pow(Math.min(1, (t - T.many) / (T.wide - T.many)), 1.6)));
  },

  panes(E, t) {
    const { COL, step, seg, ss, circle } = E, GX = window.GX, T = this.T, s = step(t);
    const glass = GX.glass(E, 'abraham'), sky = this.sky(E), n = this.lit(s);
    // Abraham lifts his head to the sky, blended in held glass steps
    const pose = ['stand', 'lookUp', ss(seg(s, T.up, T.up + 1.8))];
    const stars = (P, i) => {
      for (let k = 0; k < n; k++) {
        const q = sky[k]; if (q.i !== i) continue;
        const tw = Math.sin(s * 3.1 + k * 2.3) > .75;   // a few twinkle (white ↔ gold) in held steps
        if (q.big) GX.star(E, P, q.x, q.y, q.r, 8300 + k, tw ? '#ffffff' : '#fbe7a8');
        else P.piece(circle(q.x, q.y, q.r), tw ? '#fbe7a8' : '#ffffff', { id: 8300 + k, lead: 1.6, mat: false, flat: true });
      }
    };
    return [0, 1, 2, 3].map((i) => ({ glass, content: (P, cx, b) => {
      stars(P, i);
      E.hills(P, cx, 560, [{ y: 0, a: 10, ph: i, c: COL.purple2 }], 8200 + i);
      if (i === 1) GX.fig(E, P, cx, b, 'abraham', pose, 0, .85);
    } }));
  },

  state(t, E) {
    const { key, seg, ss, lerp, LX } = E, T = this.T;
    // one camera, no cuts: low and close on Abraham → tilt up with his gaze into the stars → one long pull back to the
    // whole window (rose included), drifting to centre
    const cam = key(t, [[0, [LX[1], 560, 2.7]], [T.up - .4, [LX[1], 550, 2.7]], [T.pull, [LX[1], 170, 1.9]], [T.wide + .6, [0, 110, .5]], [15, [0, 100, .48]]]);
    // the moonbeam: a narrow band on Abraham that opens over the whole window during the pull back
    const u = ss(seg(t, T.pull, T.wide));
    const st = window.GX.light(E, 'night', { cam, sunU: lerp(LX[1], 0, u), bandW: lerp(330, 3200, u), sunI: key(t, [[0, 1.2], [2, 1.5], [T.pull, 1.6], [T.wide, 2.1]]), bloom: key(t, [[T.pull, .55], [T.wide, .8]]), thr: key(t, [[T.pull, .5], [T.wide, .4]]),
      skyI: lerp(.05, .12, u), roseI: key(t, [[T.pull, .1], [T.wide, .55]]), roseCol: [.55, .6, 1], raysK: .4 });
    st.lancets = this.panes(E, t); st.time = t;
    // a soft glint where each of the first stars lights
    const sky = this.sky(E), n = this.lit(E.step(t));
    st.pts = [];
    if (n > 0 && n <= this.N0) { const q = sky[n - 1], f = (t - T.first) / .42 % 1; st.pts.push([q.x, q.y, 34, 3.2 * (1 - f) * (1 - f), [1, .95, .8]]); }
    return window.GX.joint(E, this, st, t);
  },
};
// sound: a soft glass note as each of the first stars lights (rising), a shimmer as they multiply, a low bell at the end
window.CLIP.sfx = [
  [0.4, 'air', { d: 3.0, v: .4 }],
  ...[...Array(window.CLIP.N0)].map((_, k) => [window.CLIP.T.first + k * .42, 'glass', { m: [79, 81, 83, 86, 88, 91, 93, 95, 98, 100, 103][k], v: .35 + .02 * k }]),
  [6.4, 'air', { d: 5.0, v: .7 }], ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => [6.6 + k * .55, 'glass', { m: 91 + (k * 5) % 12, v: .25 }]),
  [10.4, 'bell', { m: 43, v: .7 }],
  [14.9, 'glass', { m: 91, v: .45 }], [16.0, 'air', { d: 2.0, v: .8 }],   // J4: the last star; the fire's roar before it
];
(window.CLIPS ||= {})[window.CLIP.id] = window.CLIP;   // chapter joints: the previous chapter's tail reads this one
