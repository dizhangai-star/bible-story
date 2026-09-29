// 05 · 出埃及 Exodus — at night, lit only by the pillar of fire (Ex 14:20): lancet I is the pillar between Egypt's
// chariot and Israel, the pane burning by its own light; the camera trucks right from it to Moses (lancet II), who
// raises the rod over the sea as the rays on his head light; one long pull back to the extreme wide as the fire's
// light opens across the window and the sea's pieces slide apart along the leads (III–IV), a dry road between two
// walls of water, and Israel walks into it. Beats (TREATMENT §4), one continuous camera: 05-1 truck → · 05-2 Moses ·
// 05-3 pull back, the sea parts.
const FIRE = [1, .52, .2];
window.CLIP = {
  id: '05-exodus',
  uses: ['_glass', '06-david'],
  duration: 20.8,
  timing: { fadeIn: [-1, 0], fade: [20.8, 20.8] },   // no fades: the joints hand the picture over (Sprint 6)
  caps: [
    [0.9, 4.6, 'And the LORD went before them by night in a pillar of fire, to give them light.', '夜間，耶和華在火柱中光照他們。'],
    [5.3, 8.9, 'And Moses stretched out his hand over the sea; and the waters were divided.', '摩西向海伸杖，水便分開。'],
    [10.8, 16.6, 'And the children of Israel went into the midst of the sea upon the dry ground.', '以色列人下海中走乾地，水在他們的左右作了牆垣。'],
    [17.4, 20.2, 'The Sixth Window · David', '第六扇窗 · 大衛'],   // the next chapter's name, while its glass comes (Sprint 6)
  ],
  // the fire's roar; the rod raised (rising notes), the rays; the east wind as the sea opens; a bell on the dry road
  sfx: [[0.2, 'air', { d: 4.4, v: .9 }], [5.4, 'glass', { m: 62, v: .5 }], [5.9, 'glass', { m: 67, v: .5 }], [6.4, 'glass', { m: 71, v: .55 }],
    [6.8, 'glass', { m: 86, v: .8 }], [6.8, 'bell', { m: 50, v: .6 }], [8.4, 'air', { d: 4.6, v: 1.1 }],
    ...[0, 1, 2, 3, 4].map((k) => [8.8 + k * .7, 'glass', { m: [55, 57, 60, 62, 67][k], v: .45 }]), [12.4, 'bell', { m: 43, v: .8 }],
    [17.8, 'air', { d: 2.2, v: .5 }], [18.6, 'bell', { m: 55, v: .35 }]],   // J5: morning wind, a far bell at dawn
  T: { moses: 4.8, raise: 5.3, rays: 6.8, pull: 8.2, part: 8.6, open: 12.4, walk: 11.0, wide: 15.2 },
  // J5 · the crossing → the valley of Elah (night → day): "the sea returned at the morning appearing" (Ex 14:27)
  J: { next: '06-david', t0: 17.0,
    // dawn over the sea: the fire goes out, a pale dawn band crosses the window left to right, re-glazing each
    // lancet before it reaches it, warms to afternoon and settles on Goliath's lancet as the camera trucks to him
    A(E, a, b, u) {
      const { ss, seg, key, LX } = E, GX = window.GX;
      // the fire's band narrows and leaves the window to the left; for a moment the hall is black (the glass changes
      // there, unseen); then the dawn band comes in from the left and crosses to Goliath
      const x = key(u, [[0, a.sunU], [.28, LX[0] - 480], [.42, LX[0] - 480], [.88, LX[3]], [1, b.sunU]]);
      const k = Math.sin(Math.PI * seg(u, .22, .48));
      const o = GX.blackout(GX.mixState(a, b, ss(seg(u, .1, 1)), () => u >= .35), k);
      o.sunU = x; o.bandW = key(u, [[0, a.bandW], [.28, 380], [.88, 380], [1, b.bandW]]);
      o.sunCol = key(u, [[0, a.sunCol], [.3, [.8, .6, .6]], [.55, [.8, .86, 1]], [1, b.sunCol]]);
      return o;
    } },
  HEAD: [-172, 318],   // Moses' head (world): the rays light here

  // pillar of fire: an outer amber flame and a gold core; the outline licks in held steps (8 fps)
  pillar(E, P, x, s, id) {
    const { smooth, COL, mulberry } = E, r = mulberry(id + Math.round(s * 8) * 7), w = (a) => a + (r() - .5) * 14;
    const out = [[x - 46, 640, 1], [w(x - 58), 420], [w(x - 44), 200], [w(x - 34), 0], [w(x - 18), -160], [x + w(0) * 0 + (r() - .5) * 20, -260], [w(x + 20), -150], [w(x + 36), 10], [w(x + 46), 210], [w(x + 58), 430], [x + 46, 640, 1]];
    P.piece(smooth(out), COL.amber, { id, lead: 5, mat: false, flat: true, paint: (g) => {   // tongues of flame in grisaille
      for (let k = 0; k < 7; k++) { const y = 560 - k * 110 + (r() - .5) * 30, dx = (k % 2 ? 1 : -1) * (20 + r() * 12); E.brush(g, [[x + dx, y], [x + dx * .6, y - 40], [x + dx * .2, y - 80]], 2.4, { color: 'rgba(150,40,10,.5)' }); }
    } });
    P.piece(smooth([[x - 18, 630, 1], [w(x - 24), 380], [w(x - 12), 120], [x + (r() - .5) * 10, -60], [w(x + 12), 120], [w(x + 24), 380], [x + 18, 630, 1]]), '#ffd66a', { id: id + 1, lead: 4, mat: false, flat: true });
  },
  // Pharaoh's chariot, behind the fire (on the dark side): wheel, car, spears
  chariot(E, P, x, y, id) {
    const { smooth, circle, COL } = E;
    for (let k = 0; k < 3; k++) P.piece(smooth([[x - 30 + k * 22, y - 40, 1], [x - 24 + k * 22, y - 40, 1], [x - 8 + k * 22, y - 190, 1]]), COL.steel2, { id: id + 10 + k, lead: 2.6, mat: false });
    P.piece(smooth([[x - 50, y - 36, 1], [x + 34, y - 36, 1], [x + 40, y + 6, 1], [x - 56, y + 6, 1]]), COL.ruby2, { id, lead: 5, matW: 6 });
    P.piece(circle(x - 6, y + 12, 30), COL.gold, { id: id + 1, lead: 5, matW: 6, paint: (g) => {
      g.strokeStyle = 'rgba(44,26,12,.85)'; g.lineWidth = 3; for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; g.beginPath(); g.moveTo(x - 6, y + 12); g.lineTo(x - 6 + Math.cos(a) * 26, y + 12 + Math.sin(a) * 26); g.stroke(); }
    } });
  },
  // the sea in one lancet: the dry road (sand) under five bands of water. As the sea opens (u 0→1) the bands slide
  // apart along their leads and heap up into two walls; the road between them narrows toward the horizon.
  HZ: 330,
  sea(E, P, cx, u, t, id) {
    const { smooth, COL, lerp } = E, HZ = this.HZ, B = 660;
    P.piece(smooth([[cx - 160, HZ, 1], [cx + 160, HZ, 1], [cx + 160, B, 1], [cx - 160, B, 1]]), COL.gold, { id, lead: 5, matW: 12, paint: (g) => {
      for (let k = 0; k < 6; k++) { const y = HZ + 30 + k * k * 9, w = 4 + k * 5; E.brush(g, [[cx - w, y], [cx + w, y + 2]], 1.4, { color: 'rgba(90,50,10,.35)' }); }
    } });
    const cols = ['#5fa0c8', COL.teal, COL.blue2, COL.cobalt, COL.deepblue];
    const top = HZ - 10 - 190 * u;                                    // the walls rise above the horizon
    const half = (y) => u * (10 + 83 * Math.max(0, (y - HZ) / (B - HZ)));   // road half-width: wider near us
    const edge = (k) => lerp(top, B, k / 5);
    for (let k = 0; k < 5; k++) {
      const y0 = edge(k), y1 = k === 4 ? B + 10 : edge(k + 1);
      for (const side of [-1, 1]) {
        const xo = cx + side * 172, xi = (y) => cx + side * half(y), pts = [];
        for (let j = 0; j <= 6; j++) {   // wavy top edge, outer → inner; the wave moves while the sea is still open water
          const v = j / 6, x = lerp(xo, xi(y0), v), a = Math.sin(j * 1.5 + k * 1.9 + side + t * 1.3 * (1 - u)) * 7;
          pts.push([x, y0 + a - (k === 0 ? 14 * u * v : 0)]);
        }
        for (let j = 1; j <= 4; j++) { const y = lerp(y0, y1, j / 4); pts.push([xi(y) + side * Math.sin(j * 2 + k) * 4 * u, y]); }   // the wall face
        pts.push([xo, y1, 1]);
        P.piece(smooth(pts), cols[k], { id: id + 10 + k * 2 + (side > 0), lead: 5, matW: 10, paint: (g) => {   // foam lines on the wall face
          if (u > .15) E.brush(g, [[xi(y0) + side * 4, y0 + 6], [xi(y0) + side * 18, y0 + 16], [xi(y0) + side * 34, y0 + 12]], 2, { color: `rgba(235,245,255,${.55 * u})` });
        } });
      }
    }
  },
  // one of Israel, walking up the road away from us (smaller with distance)
  walker(E, P, b, x, y, s, k, st) {
    const C = E.COL, robe = [C.brown, C.ruby2, C.cobalt, C.olive, C.purple][k % 5];
    const who = { id: 700 + k * 20, torso: robe, skirt: robe, skirtLen: 1.4, sleeve: robe, head: 'cloth', cloth: [C.white, C.gold, C.steel][k % 3], band: C.ruby, beard: k % 2 ? 20 : 0, beardCol: C.brown };
    const p = window.GX.pose(E, (Math.floor(st * 4) + k) % 2 ? 'walk' : 'walkB');
    E.drawFigure(P, b.translate(x, y - 182 * s + (p.rootDy || 0) * s).scale(k % 2 ? -s : s, s), p, who);
  },

  panes(E, t) {
    const { COL, step, seg, ss, lerp } = E, GX = window.GX, T = this.T, s = step(t);
    const glass = GX.glass(E, 'exodus');
    // Moses stretches the rod out over the sea: arm forward and up (Ex 14:21), clear of his face
    E.FPOSE.stretch = E.FPOSE.stretch || { ...E.FPOSE.raiseStaff, sF: -138 * Math.PI / 180, eF: -4 * Math.PI / 180, neck: -10 * Math.PI / 180 };
    const u = ss(seg(t, T.part, T.open));   // the sea opens smoothly (natural motion, not stepped)
    const raise = ss(seg(s, T.raise, T.rays));
    const road = (P, cx, b, i) => {
      this.sea(E, P, cx, u, t, 8500 + i * 100);
      // Israel walks in once the road is open: each walker climbs the road, shrinking with distance
      for (let k = 0; k < 4; k++) {
        const v = (s - T.walk - k * 1.3 - i * .6) * .16;   // staggered, climbing away from us
        if (v >= 0 && v <= 1) this.walker(E, P, b, cx + (k % 2 ? 8 : -8) * (1 - v), lerp(650, this.HZ + 30, v), lerp(.3, .08, v), k + i * 4, s);
      }
    };
    return [
      { glass, content: (P, cx) => { E.hills(P, cx, 560, [{ y: 0, a: 8, ph: 2, c: COL.gold }], 8310); this.chariot(E, P, cx - 88, 560, 8320); this.pillar(E, P, cx + 30, s, 8300); } },
      { glass, content: (P, cx, b) => { E.hills(P, cx, 560, [{ y: 0, a: 8, ph: 1, c: COL.gold }], 8410); GX.fig(E, P, cx, b, 'moses', ['stand', 'stretch', raise], -10, .72); } },
      { glass, content: (P, cx, b) => road(P, cx, b, 0) },
      { glass, content: (P, cx, b) => road(P, cx, b, 1) },
    ];
  },

  state(t, E) {
    const { key, seg, ss, lerp, LX } = E, T = this.T, [hx, hy] = this.HEAD;
    // one camera, no cuts: on the fire and the chariot → truck right to Moses (push in) → hold as he raises the rod →
    // one long pull back and truck to centre as the sea opens → extreme wide
    const cam = key(t, [[0, [LX[0] - 40, 330, 1.25]], [1.2, [LX[0] - 20, 330, 1.25]], [T.moses, [LX[1] - 10, 390, 1.7]], [T.pull, [LX[1] + 10, 380, 1.75]],
      [T.wide, [60, 270, .6]], [18, [60, 265, .58]]]);
    // the only light is the fire: the band sits on lancet I (flickering), then opens rightward over the window as
    // the sea parts; the rest of the glass is dim moonlit night
    const u = ss(seg(t, T.pull, T.open + 1)), W = lerp(680, 1420, u);   // I (the fire) + II (Israel, lit) → the sea
    const fl = .88 + .08 * Math.sin(t * 13.1) + .06 * Math.sin(t * 7.3 + 1) + .04 * Math.sin(t * 23.7);
    const st = window.GX.light(E, 'night', { cam, sunU: LX[0] - 165 + W / 2, bandW: W, sunCol: [FIRE[0], lerp(FIRE[1], .72, u), lerp(FIRE[2], .42, u)],
      sunI: 2.2 * fl, skyI: .07, skyCol: [.5, .58, .95], amb: .05, ambCol: [.75, .6, .55], roseI: key(t, [[T.pull, .12], [T.wide, .35]]), roseCol: [1, .6, .3], raysK: .45 });
    st.lancets = this.panes(E, t); st.time = t;
    // the fire's glow on the stone, the rays on Moses' head as he lifts the rod
    const r = ss(seg(t, T.rays - .2, T.rays + .6));
    st.pts = [[LX[0] + 30, 380, 150, 1.6 * fl, FIRE], [LX[0] + 30, 60, 110, 1.1 * fl, FIRE]];
    if (r > 0) st.pts.push([hx, hy, 26 + 20 * r, 3.4 * r * (1 - .35 * ss(seg(t, T.rays + .6, T.wide))), [1, .92, .6]]);
    return window.GX.joint(E, this, st, t);
  },
};
(window.CLIPS ||= {})[window.CLIP.id] = window.CLIP;   // chapter joints: the previous chapter's tail reads this one
