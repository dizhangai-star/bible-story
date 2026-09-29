// 07 · 應許 Promise — night, moonlight only. The window still carries its two real wounds: Eden's glass broken
// from the fruit (I, Eve with her face in her hands) and Goliath's from the brow (III, the giant on his knees); between
// them the ark under the bow (II), whole — the covenant; the lamp's pane (IV) dark. The camera leaves the still wide,
// pushes onto Eden's break: the shards slide back into place one by one, and new lead welds over the cracks from the
// break outward, a spark on the beat — the scars stay, the pane is whole and bright again. It trucks past the ark to
// Goliath's pane and mends it the same way; at IV the lamp kindles and the pane shines by its own light (Isa 9:2).
// The camera pulls back to the opening chapter's framing as a pale dawn ray touches lancet I again and the rose's
// centre sparks, as it did at the very beginning.
// Beats (TREATMENT §4), one continuous camera: 07-1 wide hold · 07-2 mend I → truck past II → mend III ·
// 07-3 push on the lamp · 07-4 pull back to 01's wide.
window.CLIP = {
  id: '07-promise',
  uses: ['_glass'],
  duration: 20,
  timing: { fadeIn: [-1, 0], fade: [19.2, 20] },   // enters from 06's tail (J6); the film ends on this fade
  caps: [
    [3.6, 8.0, 'A bruised reed shall he not break.', '壓傷的蘆葦，他不折斷。'],
    [12.4, 16.0, 'The people that walked in darkness have seen a great light.', '在黑暗中行走的百姓看見了大光。'],
    [16.6, 19.2, 'Arise, shine; for thy light is come.', '興起，發光！因為你的光已經來到。'],
  ],
  // the mends (lancet index → start): shards seat for SEAT s (outside in), then the lead welds for WELDD s
  MEND: { 0: 4.3, 2: 8.2 }, SEAT: 1.1, WELDD: 1.2,
  T: { push: 3.0, lamp: 12.0, pull: 15.0, dawn: 16.4, wide: 19.0 },
  // room tone; soft taps as the shards seat, a spark on each weld beat; the lamp kindles (bell, low); near-silence
  // 14.4–16.4; the last bell as the dawn ray lands
  sfx: [[0.3, 'air', { d: 3.0, v: .5 }],
    ...[[4.3, 0], [8.2, 1]].flatMap(([w, i]) => [[w + .2, 'glass', { m: 74 + i * 2, v: .3 }], [w + .6, 'glass', { m: 79 + i * 2, v: .3 }],
      [w + 1.1, 'glass', { m: [86, 91][i], v: .7 }], [w + 1.85, 'glass', { m: [93, 98][i], v: .55 }]]),
    [12.0, 'bell', { m: 45, v: .7 }], [12.0, 'glass', { m: 81, v: .5 }], [16.4, 'bell', { m: 50, v: .9 }], [16.4, 'glass', { m: 86, v: .6 }], [16.6, 'air', { d: 2.4, v: .6 }]],
  // the real breaks, as they were made (same crack seeds): Eden at the fruit (02), Goliath at the brow (06);
  // [dx from the lancet centre, y, seed, cracks]
  BREAK: { 0: [-104, 400, 31, 9], 2: [12, 282, 55, 11] },
  LAMP: [510, 330],   // the flame (world)

  // the lamp: a gold bowl, a flame that flickers in held steps once kindled
  lamp(E, P, cx, lit, s, id) {
    const { smooth, COL, mulberry } = E, [, fy] = this.LAMP, r = mulberry(id + Math.round(s * 8) * 5);
    P.piece(smooth([[cx - 44, fy + 90, 1], [cx + 44, fy + 90, 1], [cx + 30, fy + 50], [cx - 30, fy + 50]]), COL.gold, { id, lead: 4.5, matW: 6, paint: (g) => E.brush(g, [[cx - 30, fy + 70], [cx + 30, fy + 70]], 1.6, { color: 'rgba(90,50,10,.5)' }) });
    P.piece(smooth([[cx - 6, fy + 90, 1], [cx + 6, fy + 90, 1], [cx + 14, fy + 140, 1], [cx - 14, fy + 140, 1]]), COL.brown, { id: id + 1, lead: 4, matW: 4 });
    const j = lit > 0 ? (r() - .5) * 6 : 0, h = 30 + 40 * lit;
    P.piece(smooth([[cx, fy + 48 - h], [cx + 20 + j, fy + 20], [cx, fy + 48], [cx - 20 + j, fy + 20]]), lit > 0 ? COL.gold2 : COL.amber, { id: id + 2, lead: 3.4, mat: false, flat: true });
    if (lit > 0) P.piece(smooth([[cx + j * .5, fy + 44 - h * .6], [cx + 8, fy + 30], [cx, fy + 44], [cx - 8, fy + 30]]), '#fff4d0', { id: id + 3, lead: 2.4, mat: false, flat: true });
  },

  panes(E, t) {
    const { COL, roundel, hills, step, seg } = E, GX = window.GX, s = step(t), D = Math.PI / 180;
    const glass = GX.glass(E, 'promise');
    const broken = (i, fn) => ({ glass, content: (P, cx, b) => {
      fn(P, cx, b);
      const [dx, y, seed, n] = this.BREAK[i];
      GX.drawBreak(E, P, b, GX.breakAt(E, cx, cx + dx, y, seed, n), t, null, [this.MEND[i], this.SEAT, this.WELDD]);
    } });
    const lit = E.ss(seg(s, this.T.lamp, this.T.lamp + 1));
    const DOWN = { ...E.POSE.kneel, lean: 26 * D, neck: 34 * D, sF: -10 * D, eF: -20 * D, face: 'fierce' };   // Goliath as 06 leaves him
    return [
      broken(0, (P, cx, b) => {   // Eden after the fall (02's lancet III)
        roundel(P, cx, -150, 78, COL.sky, 7400); GX.garden(E, P, cx, 7410); GX.bigTree(E, P, cx + 100, 600, .8, 7420);
        GX.serpent(E, P, cx + 128, 470, .9, 7440); GX.fig(E, P, cx, b, 'eve', 'weep', 25, .8, true, { item: null });
      }),
      { glass, content: (P, cx) => {   // the covenant: the ark under the bow, whole
        roundel(P, cx, -150, 78, COL.deepblue, 9200); GX.rainbow(E, P, cx, 470, 96, 14, 9240);
        GX.waves(E, P, cx, 480, 1 + Math.sin(t * .8) * .3, 9210); GX.ark(E, P, cx, 478 + Math.sin(t * 1.1) * 4, 1, 9230);
      } },
      broken(2, (P, cx, b) => {   // the giant fallen (06's lancet IV)
        roundel(P, cx, -150, 78, COL.ruby, 9000); hills(P, cx, 560, [{ y: 0, a: 8, ph: 1, c: COL.brown }], 9010);
        E.drawGoliath(P, b.translate(cx + 10, 604 - 182 + DOWN.rootDy).scale(-1, 1), DOWN);
      }),
      { glass, content: (P, cx) => {
        roundel(P, cx, -150, 78, COL.deepblue, 9400);
        for (let k = 0; k < 6; k++) GX.star(E, P, cx + Math.cos(k * 1.05) * 50, -150 + Math.sin(k * 1.05) * 50, 8, 9410 + k, COL.white);
        hills(P, cx, 540, [{ y: 0, a: 10, ph: 2, c: COL.green2 }, { y: 40, a: 8, ph: 4, c: COL.brown }], 9460);
        this.lamp(E, P, cx, lit, s, 9450);
      } },
    ];
  },

  state(t, E) {
    const { key, seg, ss, lerp, LX, ROSE } = E, T = this.T, W = [0, 300, .5], [lx, ly] = this.LAMP;
    // one camera: the still night wide → push onto Eden's break, hold while it mends → truck past the ark → hold on
    // Goliath's pane while it mends → push on the lamp → pull back to the opening chapter's wide
    const M0 = this.MEND[0], M2 = this.MEND[2], done = this.SEAT + this.WELDD;
    const cam = key(t, [[0, W], [T.push, W], [M0, [LX[0], 330, 1.6]], [M0 + done, [LX[0] + 10, 320, 1.64]], [M0 + done + .8, [LX[1], 300, 1.55]],
      [M2, [LX[2], 290, 1.6]], [M2 + done, [LX[2] + 10, 290, 1.64]], [T.lamp, [LX[3], 360, 1.8]], [T.pull, [LX[3], 370, 2.0]], [T.wide, W], [20, [0, 300, .49]]]);
    // one light that travels: cold moonlight on lancets I–III → it gathers onto the lamp's pane as the lamp kindles
    // (the pane now lit from within, warm) → at dawn a pale thin ray on lancet I, where the film began
    const lit = ss(seg(t, T.lamp, T.lamp + 1.2)), fl = .92 + .05 * Math.sin(t * 9.3) + .03 * Math.sin(t * 17.1);
    const dawn = ss(seg(t, T.dawn, T.wide)), pre = t < T.dawn - .2;
    const st = window.GX.light(E, 'night', { cam, sunU: pre ? lerp(LX[1], LX[3], lit) : lerp(LX[3], LX[0], ss(seg(t, T.dawn - .2, T.dawn))),
      bandW: pre ? lerp(1020, 330, lit) : 330,
      sunI: pre ? lerp(1.0, 1.9 * fl, lit) - .5 * Math.sin(Math.PI * lit) : lerp(0, 1.8, dawn),
      sunCol: pre ? [lerp(.62, 1, lit), .7, lerp(1, .35, lit)] : [.85, .9, 1], sx: 0, sz: 1.2,
      skyI: .07, amb: .05, roseI: key(t, [[0, .15], [T.dawn, .15], [T.wide, .7]]), raysK: .45, time: t,
      inscription: window.GX.TITLE, gild: key(t, [[0, .08], [T.dawn, .08], [T.wide, .18]]) });
    // the rose's centre sparks again at dawn (the opening image); its petals stay dim
    const spark = ss(seg(t, T.dawn, T.dawn + .6));
    st.rose = { lit: (q) => q.petal < 0 ? .1 + .9 * spark : .12 + .3 * dawn };
    st.lancets = this.panes(E, t);
    st.pts = [];
    // a spark at each break while its lead welds, flaring on the beat
    for (const i of [0, 2]) {
      const w = this.MEND[i] + this.SEAT, u = seg(t, w, w + this.WELDD); if (u <= 0 || u >= 1) continue;
      const beat = (t - w) % .75 / .75, [dx, y] = this.BREAK[i];
      st.pts.push([LX[i] + dx, y, 16 + 10 * (1 - beat), 5 * (1 - beat) * (1 - beat) + .6, [1, .8, .5]]);
    }
    // the lamp's glow on the glass and stone once kindled
    if (lit > 0) st.pts.push([lx, ly, 70 + 60 * lit, 2.4 * lit * fl, [1, .66, .3]]);
    // when the light moves on to the dawn, the lamp's pane keeps shining by its own light
    const own = ss(seg(t, T.dawn - .6, T.dawn + .4));
    if (own > 0) st.pts.push([lx, 180, 280, 1.5 * own * fl, [1, .62, .28]]);
    if (spark > 0) st.pts.push([0, ROSE.y, 30 + 20 * spark, 1.6 * spark, [1, .88, .6]]);
    return st;
  },
};
(window.CLIPS ||= {})[window.CLIP.id] = window.CLIP;   // chapter joints: the previous chapter's tail reads this one
