// 06 · 大衛 David — afternoon over the valley of Elah: Israel's tents (I), the brook with its five smooth stones (II),
// David small (III), Goliath filling lancet IV. Low on the giant, a slow push up to his brass helmet under a light
// pressing down from above as he lifts his spear; a whip pan left to David, backlit, whirling the sling; the stone
// leaves as a point of light, the camera rides it back to Goliath; it strikes his brow and a crack runs down through
// the giant (silence); he sinks to his knees, and the light opens over the whole window as the camera pulls back.
// Beats (TREATMENT §4), one continuous camera: 06-1 push · 06-2 whip pan ← · 06-3 the stone, the crack, pull back.
window.CLIP = {
  id: '06-david',
  uses: ['_glass', '07-promise'],
  duration: 18.3,
  timing: { fadeIn: [-1, 0], fade: [18.3, 18.3] },   // no fades: the joints hand the picture over (Sprint 6)
  caps: [
    [0.8, 4.9, 'And there went out a champion out of the camp of the Philistines, named Goliath.', '從非利士營中出來一個討戰的人，名叫歌利亞。'],
    [6.2, 9.4, 'I come to thee in the name of the LORD of hosts.', '我來攻擊你，是靠著萬軍之耶和華的名。'],
    [12.0, 15.2, 'So David prevailed over the Philistine with a sling and with a stone.', '這樣，大衛用機弦甩石，勝了那非利士人。'],
    [15.8, 18.0, 'The Seventh Window · The Promise', '第七扇窗 · 應許'],   // the next chapter's name, while its glass comes (Sprint 6)
  ],
  // the giant's low bell and spear; the whip (air); the sling whirs (rising glass); the stone flies; the crack — then
  // silence until the light opens (bell)
  sfx: [[0.4, 'bell', { m: 31, v: .9 }], [2.6, 'glass', { m: 50, v: .55 }], [3.4, 'glass', { m: 49, v: .5 }], [5.2, 'air', { d: .8, v: 1.1 }],
    ...[0, 1, 2, 3, 4, 5].map((k) => [6.2 + k * .5, 'glass', { m: [74, 76, 79, 81, 83, 86][k], v: .35 + k * .05 }]),
    [9.4, 'air', { d: .7, v: .9 }], [10.0, 'crack', { v: 1.3, snap: .25 }], [10.0, 'glass', { m: 98, v: .7 }], [12.2, 'bell', { m: 43, v: .9 }], [12.4, 'air', { d: 2.6, v: .7 }],
    [16.2, 'air', { d: 2.2, v: .45 }]],   // J6: evening air as the light leaves
  T: { whip: 5.2, onDavid: 5.9, spin: 6.2, release: 9.4, hit: 10.0, fall: 10.7, pull: 12.2, wide: 15.2 },
  // J6 · the giant fallen → the night of the promise: the day ends, the camera pulls back to the opening wide
  J: { next: '07-promise', t0: 15.3,
    // A · sunset: the light reddens and slides off the window right to left (as it left Eden); in the dark the glass
    // becomes the promise's window, and the moon comes
    A(E, a, b, u) {
      const { ss, seg, key, lerp, SUN } = E, GX = window.GX, s = ss(seg(u, .05, .6));
      const eve = { ...a, sunCol: key(u, [[0, a.sunCol], [.3, SUN.dusk], [.6, [.8, .4, .45]]]), sunU: lerp(a.sunU, -2700, s), sunI: a.sunI * (1 - .4 * s) };
      const o = GX.mixState(eve, GX.dark(b, 1 - ss(seg(u, .66, 1))), ss(seg(u, .55, 1)), () => u >= .6);
      o.cam = GX.camMix(a.cam, b.cam, ss(u));
      return GX.blackout(o, Math.sin(Math.PI * seg(u, .5, .7)));   // a moment of full dark: the glass changes there
    },
    // B · into the dark: the light fades while the camera pulls back; the moon comes on the new glass
    B(E, a, b, u) {
      const { ss, seg } = E, GX = window.GX;
      return GX.mixState(GX.dark(a, ss(seg(u, 0, .45))), GX.dark(b, 1 - ss(seg(u, .55, 1))), ss(u), () => u >= .5);
    } },
  HAND: [215, 420],    // David's sling hand at the release (world)
  BROW: [522, 282],    // Goliath's brow: the stone strikes here, the crack starts here

  // Israel's camp: tents on the hill, spears standing by them
  tents(E, P, cx, id) {
    const { smooth, COL } = E;
    [[-70, 520, 1], [40, 505, .8], [100, 540, .9]].forEach(([dx, y, s], k) => {
      const x = cx + dx;
      P.piece(smooth([[x - 52 * s, y, 1], [x, y - 70 * s, 1], [x + 52 * s, y, 1]]), [COL.white, COL.gold, COL.ruby2][k], { id: id + k, lead: 4.5, matW: 8, paint: (g) => { g.fillStyle = 'rgba(44,26,12,.75)'; g.beginPath(); g.moveTo(x, y - 40 * s); g.lineTo(x - 12 * s, y); g.lineTo(x + 12 * s, y); g.fill(); } });
      E.brush(P.g, [[x + 60 * s, y], [x + 64 * s, y - 110 * s]], 2, { color: 'rgba(44,26,12,.7)' });
    });
  },
  // the brook of the valley and its five smooth stones (1 Sam 17:40)
  brook(E, P, cx, t, id) {
    const { smooth, circle, COL } = E;
    const pts = [];
    for (let j = 0; j <= 8; j++) pts.push([cx - 160 + j * 40, 560 + Math.sin(j * 1.3 + t * 1.6) * 6]);
    P.piece(smooth([...pts.map(([x, y]) => [x, y - 40]), ...pts.slice().reverse()]), COL.teal, { id, lead: 5, matW: 10, paint: (g) => {
      for (let k = 0; k < 4; k++) E.brush(g, [[cx - 120 + k * 70, 540 + (k % 2) * 8], [cx - 90 + k * 70, 538 + (k % 2) * 8]], 1.4, { color: 'rgba(235,245,255,.5)' });
    } });
    [[-80, 600], [-30, 612], [20, 596], [70, 610], [110, 598]].forEach(([dx, y], k) => P.piece(circle(cx + dx, y, 9), [COL.white, COL.steel, '#c9c4b0'][k % 3], { id: id + 10 + k, lead: 3, matW: 3 }));
  },

  panes(E, t) {
    const { COL, roundel, hills, step, seg, ss } = E, GX = window.GX, T = this.T, s = step(t), D = Math.PI / 180;
    const glass = GX.glass(E, 'david');
    // David: sling up and whirling (the wrist turns a quarter per glass step), then the arm snaps forward at the release
    E.FPOSE.throw = E.FPOSE.throw || { ...E.FPOSE.sling, sF: -92 * D, eF: -8 * D, wF: 0, sB: -40 * D, eB: -50 * D };
    const whirl = s >= T.spin && s < T.release ? { ...E.FPOSE.sling, wF: (Math.round((s - T.spin) * 8) % 4) * 90 * D } : null;
    const david = whirl || (s < T.spin ? ['stand', 'sling', ss(seg(s, T.onDavid - .3, T.spin))] : 'throw');
    // Goliath: guard → lifts the spear (defiance) → after the stone sinks to his knees, head bowed (held steps)
    const P0 = { ...E.POSE.guard, rootDy: 0 }, UP = { ...E.POSE.raise, face: 'fierce', rootDy: 0 };
    const DOWN = { ...E.POSE.kneel, lean: 26 * D, neck: 34 * D, sF: -10 * D, eF: -20 * D, face: 'fierce' };
    const mix = (A, B, u) => { const o = { ...(u < .5 ? A : B) }; for (const k in A) if (typeof A[k] === 'number' && typeof B[k] === 'number') o[k] = A[k] + (B[k] - A[k]) * u; return o; };
    const up = ss(seg(s, 2.2, 3.6)) * (1 - ss(seg(s, T.hit, T.hit + .5)));
    const fall = ss(seg(s, T.fall, T.fall + 1.4));
    const gp = fall > 0 ? mix(mix(P0, UP, up), DOWN, fall) : mix(P0, UP, up);
    const brk = GX.breakAt(E, E.LX[3], this.BROW[0], this.BROW[1], 55, 11);   // the same break is mended in 07
    return [
      { glass, content: (P, cx) => { roundel(P, cx, -150, 78, COL.sky, 8700); hills(P, cx, 540, [{ y: 0, a: 14, ph: 1, c: COL.olive }, { y: 50, a: 8, ph: 3, c: COL.brown }], 8710); this.tents(E, P, cx, 8720); } },
      { glass, content: (P, cx) => { roundel(P, cx, -150, 78, COL.sky, 8800); hills(P, cx, 470, [{ y: 0, a: 14, ph: 2, c: COL.olive }], 8810); this.brook(E, P, cx, t, 8830); } },
      { glass, content: (P, cx, b) => { roundel(P, cx, -150, 78, COL.sky, 8900); hills(P, cx, 540, [{ y: 0, a: 10, ph: 3, c: COL.olive }], 8910); GX.fig(E, P, cx, b, 'david', david, -20, .55); } },
      { glass, content: (P, cx, b) => {
        roundel(P, cx, -150, 78, COL.ruby, 9000); hills(P, cx, 560, [{ y: 0, a: 8, ph: 1, c: COL.brown }], 9010);
        E.drawGoliath(P, b.translate(cx + 10, 604 - 182 + (gp.rootDy || 0)).scale(-1, 1), gp);
        if (t >= T.hit) GX.drawBreak(E, P, b, brk, t, T.hit);   // the giant's glass shatters from the brow
      } },
    ];
  },

  state(t, E) {
    const { key, seg, ss, lerp, LX } = E, T = this.T, [bx, by] = this.BROW, [hx, hy] = this.HAND;
    // one camera: low on the giant → slow push up to his helmet → whip pan left to David → hold, slight push as the
    // sling whirls → ride the stone back to Goliath → hold on the crack → pull back over the lit window
    const whip = (u) => u * u * (3 - 2 * u) * (u < .5 ? 1 : 1);   // smoothstep: fast in the middle
    const cam = key(t, [[0, [LX[3] + 10, 470, 1.55]], [.6, [LX[3] + 10, 462, 1.57]], [T.whip, [LX[3] + 20, 230, 2.0], whip], [T.onDavid, [LX[2] - 20, 420, 1.95]],
      [T.release, [LX[2] - 10, 400, 2.15]], [T.hit, [LX[3], 270, 1.75]], [T.pull, [LX[3] - 20, 340, 1.7]], [T.wide, [340, 330, .92]], [16, [340, 330, .9]]]);
    // light: pressing down on Goliath's lancet (a narrow band on IV), widening over David at the whip; after the fall
    // it opens over the whole window
    const w = ss(seg(t, T.whip, T.onDavid + .4)), o = ss(seg(t, T.pull, T.wide));
    const st = window.GX.light(E, 'aft', { cam, sunU: lerp(lerp(LX[3], (LX[2] + LX[3]) / 2, w), 0, o), bandW: lerp(lerp(330, 680, w), 3200, o),
      sunI: key(t, [[0, 2.5], [T.hit, 2.5], [T.hit + .3, 1.9], [T.pull, 1.9], [T.wide, 2.4]]), sx: lerp(.06, -.36, w), sz: lerp(.62, 1.3, w),
      amb: key(t, [[0, .075], [T.hit, .075], [T.hit + .4, .055], [T.pull, .055], [T.wide, .075]]), time: t });
    st.lancets = this.panes(E, t);
    st.pts = [];
    // backlight: David's lancet glows behind him while he whirls the sling
    const bl = ss(seg(t, T.whip + .3, T.spin)) * (1 - ss(seg(t, T.hit, T.pull)));
    if (bl > 0) st.pts.push([LX[2] - 20, 330, 150, 1.1 * bl, [1, .85, .55]]);
    // the stone: a point of light arcing from David's hand to the giant's brow
    const f = seg(t, T.release, T.hit);
    if (f > 0 && f < 1) st.pts.push([lerp(hx, bx, f), lerp(hy, by, f) - Math.sin(f * Math.PI) * 60, 14, 4.5, [1, .95, .8]]);
    // the strike: a white flash, then the crack glows
    const fl = seg(t, T.hit, T.hit + .6);
    if (fl > 0 && fl < 1) st.pts.push([bx, by, 60 + 240 * fl, 4 * (1 - fl) * (1 - fl), [1, .97, .9]]);
    return window.GX.joint(E, this, st, t);
  },
};
(window.CLIPS ||= {})[window.CLIP.id] = window.CLIP;   // chapter joints: the previous chapter's tail reads this one
