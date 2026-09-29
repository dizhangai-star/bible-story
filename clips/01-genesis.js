// 01 · 起初 Genesis — darkness; one spark in the rose; six pairs of petals light = six days; "Let there be light":
// the sun band sweeps the four lancets (light · waters · land · life), shafts fall to the floor, the title is lit.
// World units: rose (0,-560) r175; lancets LX = [-510,-170,170,510], 300 wide, apex -320, bottom 640; floor 900.
window.CLIP = {
  id: '01-genesis',
  uses: ['_glass', '02-eden'],
  duration: 17.2,
  timing: { fadeIn: [0, 0.3], fade: [17.2, 17.2] },   // no fade out: the tail hands over to 02 (J1)
  caps: [
    [1.2, 4.9, 'In the beginning God created the heaven and the earth.', '起初，神創造天地。'],
    [5.5, 9.1, 'And God said, Let there be light: and there was light.', '神說：「要有光」，就有了光。'],
    [10.8, 14.0, 'And God saw every thing that he had made, and, behold, it was very good.', '神看著一切所造的都甚好。'],
    [14.5, 16.9, 'The Second Window · Eden', '第二扇窗 · 伊甸'],   // the next chapter's name, while its glass comes (Sprint 6)
  ],
  // glass notes climb D Dorian, one per day; the light lands with a bell; air on the light move and the title sweep
  sfx: [[0.8, 'glass', { m: 86, v: 1.2 }], [2.4, 'glass', { m: 74 }], [3.15, 'glass', { m: 76 }], [3.9, 'glass', { m: 77 }],
    [4.65, 'glass', { m: 79 }], [5.4, 'glass', { m: 81 }], [6.15, 'glass', { m: 83 }], [6.6, 'air', { d: 2.2, v: 1.2 }],
    [7.0, 'bell', { m: 50 }], [7.0, 'glass', { m: 98, v: .8 }], [9.4, 'air', { d: 2.0, v: .7 }], [10.8, 'glass', { m: 86, v: .6 }]],
  // beats (80 BPM, 0.75 s): spark 0.8 · days 2.4 … 6.15 · light 7.0 · title 9.4
  DAYS: [2.4, 3.15, 3.9, 4.65, 5.4, 6.15],
  T_LIGHT: 7.0,
  // J1 · the made world → the garden in it: the wide pushes in to 02's MS while the window is re-glazed
  J: { next: '02-eden', t0: 14.2,
    // cloud: a cloud's shadow passes over the window; under it the glass becomes the garden, the light warms
    A(E, a, b, u) {
      const { ss, seg } = E, GX = window.GX, c = Math.sin(Math.PI * seg(u, .12, .9));
      const o = GX.mixState(GX.dark(a, .75 * c), GX.dark(b, .75 * c), ss(seg(u, .05, 1)), (i) => u >= .47 + i * .02);
      return o;
    } },

  // pane content: I light (sun + moon and stars) · II waters (dove over the deep) · III land · IV life
  panes(E, t) {
    const { COL, smooth, circle, roundel, sunDisc, hills, tree, dove, step } = E;
    const flap = Math.floor(step(t) * 2) % 2;          // glass wings: two held poses, 4 per second
    const star = (P, x, y, r, id) => P.piece(smooth([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => { const a = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? r * .45 : r; return [x + Math.cos(a) * q, y + Math.sin(a) * q, 1]; })), COL.gold2, { id, lead: 3, mat: false });
    const fish = (P, x, y, s, id) => P.piece(smooth([[x - 26 * s, y], [x - 6 * s, y - 11 * s], [x + 16 * s, y - 6 * s], [x + 24 * s, y - 13 * s, 1], [x + 22 * s, y, 1], [x + 24 * s, y + 13 * s, 1], [x + 16 * s, y + 6 * s], [x - 6 * s, y + 11 * s]]), COL.gold, { id, lead: 4, matW: 5, paint: g => { g.fillStyle = 'rgba(44,26,12,.88)'; g.beginPath(); g.arc(x - 16 * s, y - 2 * s, 2, 0, 7); g.fill(); } });
    const glass = window.GX.glass(E, 'genesis');
    return [
      { glass, content: (P, cx) => {   // I · 光 — sun in the roundel, night field with the moon and stars below
        roundel(P, cx, -150, 78, COL.sky, 6000); sunDisc(P, cx, -150, 30, COL.gold2, 6030, 12);
        P.piece(circle(cx - 20, 440, 44), COL.white, { id: 6110, lead: 4.5, matW: 8 });
        P.piece(circle(cx + 2, 428, 40), COL.deepblue, { id: 6111, lead: 4.5, matW: 10 });
        [[cx + 64, 390, 11], [cx + 90, 470, 8], [cx - 84, 520, 9], [cx + 30, 560, 12], [cx - 70, 372, 7], [cx + 76, 590, 7]].forEach(([x, y, r], k) => star(P, x, y, r, 6120 + k));
      } },
      { glass, content: (P, cx) => {   // II · 水 — the Spirit (a dove) over the face of the waters
        roundel(P, cx, -150, 78, COL.deepblue, 6200); dove(P, cx - 2, -150, flap, 6230);
        hills(P, cx, 470, [{ y: -40, a: 14, ph: step(t) * 1.2, c: COL.sky }, { y: 20, a: 12, ph: 2 + step(t) * .9, c: COL.blue2 }, { y: 80, a: 10, ph: 4 + step(t) * .7, c: COL.cobalt }], 6300);
      } },
      { glass, content: (P, cx) => {   // III · 地 — dry land, grass and trees
        roundel(P, cx, -150, 78, COL.sky, 6400); sunDisc(P, cx + 26, -130, 24, COL.gold, 6430, 12);
        hills(P, cx, 520, [{ y: -30, a: 16, ph: 1, c: COL.olive }, { y: 40, a: 10, ph: 3, c: COL.green }], 6500);
        tree(P, cx - 70, 506, 1.05, 6520); tree(P, cx + 60, 520, .85, 6524);
      } },
      { glass, content: (P, cx) => {   // IV · 生 — birds of the air and fish of the sea
        roundel(P, cx, -150, 78, COL.purple, 6600); dove(P, cx - 30, -170, flap, 6630); dove(P, cx + 30, -128, 1 - flap, 6634);
        P.piece(smooth([[cx - 150, 470, 1], [cx - 40, 456], [cx + 60, 476], [cx + 150, 462, 1], [cx + 150, 660, 1], [cx - 150, 660, 1]]), COL.cobalt, { id: 6700, lead: 5.5, matW: 12 });
        fish(P, cx - 40 + Math.sin(step(t) * 1.3) * 10, 540, 1.1, 6710); fish(P, cx + 50 - Math.sin(step(t) * 1.1) * 8, 600, .8, 6711);
      } },
    ];
  },

  state(t, E) {
    const { key, seg, ss, lerp, SUN, LX, BOT, ROSE, step } = E;
    const A = this, TL = A.T_LIGHT;
    // rose: the centre sparks at 0.8; petals light in pairs, clockwise from the top, one pair per day (stepped glass)
    const spark = ss(seg(t, .8, 1.3));
    const petalLit = (i) => { const j = ((i - 9) % 12 + 12) % 12, d = A.DAYS[Math.floor(j / 2)]; return ss(seg(step(t, 12), d, d + .35)); };
    const rose = { lit: (q) => q.petal < 0 ? .1 + .9 * spark : petalLit(q.petal) * .97 + .03 * spark };
    const roseI = key(t, [[0, 0], [.8, 0], [1.3, 1.5, ss], [2.4, 1.1], [6.2, 1.4], [TL, 1.9], [9.5, 1.3], [15, 1.3]]);
    // the sun: a knife-thin band enters at the left and opens over every lancet
    const u = seg(t, TL - .2, TL + 2.4);
    const sunI = key(t, [[0, 0], [TL - .25, 0], [TL, 2.8, ss], [TL + 1.2, 2.5], [15, 2.4]]);
    const bandW = key(t, [[0, 18], [TL - .2, 18], [TL + .5, 120, ss], [TL + 2.6, 3200]]);
    const sunU = lerp(LX[0] - 90, 0, ss(u));
    const sunCol = key(t, [[0, SUN.dawn], [TL, SUN.dawn], [TL + 3, [1, .93, .8]]]);
    // camera: ECU on the spark → the whole rose → pull back and tilt down to the wide → slow push
    const W = [0, 300, .5];
    const cam = key(t, [[0, [0, ROSE.y, 2.7]], [1.6, [0, ROSE.y, 2.5]], [6.4, [0, ROSE.y + 20, 1.45]], [TL + .1, [0, ROSE.y + 30, 1.35]], [TL + 3.0, W], [15, [0, 300, .51]]]);
    const st = {
      cam, rose, roseI, roseCol: key(t, [[0, [1, .9, .7]], [TL, [1, .95, .85]]]), sunI, sunU, bandW, sunCol,
      raysK: .55, skew: key(t, [[TL, .45], [TL + 1, .06]]), sx: .2, sz: 1.35,
      skyI: key(t, [[0, .02], [TL, .04], [TL + 2, .1]]), skyCol: [.55, .65, .9],
      amb: key(t, [[0, .02], [2.4, .04], [TL, .045], [TL + 2.5, .075]]), ambCol: [.62, .64, .82], contrast: .22, haze: .45, spill: .5,
      floorMode: 1, floor: { camD: 2600, eyeH: 320 }, lancets: A.panes(E, t),
      ltint: [[.95, .8, .5], [.45, .6, 1.0], [.6, .85, .45], [.7, .55, .95]],
      inscription: window.GX.TITLE, vign: .62,
    };
    // title: a strip of light sweeps the carved string course, then rests
    const sw = seg(t, 9.4, 11.4);
    st.gild = key(t, [[0, 0], [9.4, 0], [11.0, .18]]);
    if (sw > 0 && sw < 1) st.sweep = [lerp(-1100, 1100, sw), 380, 1.1 * Math.sin(sw * Math.PI), BOT + 166];
    else if (sw >= 1) st.sweep = [0, 700, .55, BOT + 166];
    // "let there be light": a white flash in the rose as the band lands
    const fl = seg(t, TL, TL + .5);
    st.pts = fl > 0 && fl < 1 ? [[0, ROSE.y, 60 + 160 * fl, 3.2 * (1 - fl) * (1 - fl), [1, .96, .85]]] : [];
    if (spark > 0 && t < 2.4) st.pts.push([0, ROSE.y, 30, 1.4 * spark * (1 - seg(t, 1.3, 2.4)), [1, .85, .5]]);
    return window.GX.joint(E, this, st, t);
  },
};
(window.CLIPS ||= {})[window.CLIP.id] = window.CLIP;   // chapter joints: the previous chapter's tail reads this one
