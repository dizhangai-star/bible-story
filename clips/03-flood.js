// 03 · 洪水 Flood — one continuous camera over one window that changes: cold blue dawn, rain on the glass; the wide
// trucks right and pushes in to the ark as the water rises and bears it up; trucks on to Noah as the dove returns to
// his hands; pulls back as the rain stops, noon comes, the water falls and the rainbow is set band by band over all
// four lancets (same mosaic glass throughout); tilts down and pushes onto the rainbow thrown across the flagstones.
// Beats (TREATMENT §4): 03-1 wide truck → · 03-2 the ark · 03-3 Noah, the dove · 03-4 window → floor · 03-5 onto the floor.
window.CLIP = {
  id: '03-flood',
  uses: ['_glass', '04-abraham'],
  duration: 23,
  timing: { fadeIn: [-1, 0], fade: [23, 23] },   // no fades: the joints hand the picture over (Sprint 6)
  caps: [
    [0.8, 4.0, 'And the rain was upon the earth forty days and forty nights.', '四十晝夜降大雨在地上。'],
    [4.6, 7.9, 'The waters increased, and bare up the ark.', '水往上長，把方舟從地上漂起。'],
    [8.6, 12.0, 'And the dove came in to him; and, lo, in her mouth was an olive leaf.', '鴿子回到他那裡，嘴裡叼著一個橄欖葉子。'],
    [13.4, 18.6, 'Neither shall all flesh be cut off any more by the waters of a flood.', '凡有血肉的，不再被洪水滅絕。'],
    [19.4, 22.4, 'The Fourth Window · Abraham', '第四扇窗 · 亞伯拉罕'],   // the next chapter's name, while its glass comes (Sprint 6)
  ],
  // air for the storm; a long swell as the water lifts the ark; the dove lands; six rising notes = six bands of the bow
  sfx: [[0.3, 'air', { d: 3.8, v: 1.0 }], [4.6, 'air', { d: 3.4, v: .8 }], [4.6, 'glass', { m: 62, v: .5 }], [7.6, 'glass', { m: 67, v: .5 }],
    [10.5, 'glass', { m: 86, v: .8 }], [12.4, 'bell', { m: 50, v: .8 }],
    ...[0, 1, 2, 3, 4, 5].map((k) => [12.7 + k * .3, 'glass', { m: [74, 76, 77, 79, 81, 86][k], v: .6 }]), [14.4, 'air', { d: 2.8, v: .6 }],
    [21.2, 'air', { d: 2.2, v: .4 }]],   // J3: night air as the camera climbs to Abraham
  T: { ark: 4.6, rise: 7.8, noah: 8.2, bow: 12.4, top: 16.0 },
  // J3 · the bow → the stars (two signs of a covenant): the day ends on the floor, night comes, up to Abraham
  J: { next: '04-abraham', t0: 19.0,
    // sunset on the floor: the bow's light slides and stretches across the flagstones, reddens and goes out;
    // then one tilt up from the floor into lancet II, where the moonbeam finds Abraham
    A(E, a, b, u) {
      const { ss, seg, key, lerp, SUN } = E, GX = window.GX, d = ss(seg(u, 0, .5)), m = ss(seg(u, .55, 1));
      const eve = { ...a, sunCol: a.sunCol.map((v, j) => lerp(v, SUN.dusk[j], d)), sx: lerp(a.sx, -.55, d), sz: lerp(a.sz, 2.4, d) };
      const o = GX.mixState(GX.dark(eve, ss(seg(u, .25, .55))), GX.dark(b, 1 - m), m, () => u >= .5);
      o.cam = GX.camMix(key(u, [[0, a.cam], [.5, [0, 800, .84]]]), b.cam, ss(seg(u, .5, 1)));
      return GX.blackout(o, Math.sin(Math.PI * seg(u, .42, .58)));   // the lancets' foot is in frame: change them in full dark
    } },
  HANDS: [245, 400],   // Noah's raised hands (world), where the dove lands
  LAND: 10.5,   // the dove lands in Noah's hands

  // one window throughout (the flood mosaic): I rain · II the ark on the water · III Noah on the mountain · IV the deep.
  // From the bow on: the rain fades, the water falls, the rainbow is set over all four lancets, band by band.
  panes(E, t) {
    const { COL, step, seg, ss, lerp, dove, smooth } = E, GX = window.GX, T = this.T, s = step(t);
    const glass = GX.glass(E, 'flood');
    // water level: rises smoothly and lifts the ark, then falls after the bow; the ark bobs on it
    const lvl = lerp(560, 380, ss(seg(t, T.ark, T.rise))) + 110 * ss(seg(t, T.bow, T.top));
    const bob = Math.sin(t * 2.4) * 5, rainA = 1 - ss(seg(t, T.bow - .8, T.bow + .4));
    const bands = Math.floor(seg(step(t, 8), T.bow + .3, T.bow + .3 + 6 * .3) * 6 + 1e-6);   // bands appear one by one
    const bow = (P) => { if (bands > 0) GX.rainbow(E, P, 0, 420, 520, 34, 7710, bands); };
    // the dove: flies in from the right and settles in Noah's hands
    const fly = seg(s, T.noah + .6, this.LAND), flap = Math.floor(s * 4) % 2;
    return [
      { glass, content: (P, cx) => { bow(P); if (rainA > 0) GX.rain(E, P, cx, s, 660, 7900, .5 * rainA); GX.waves(E, P, cx, 480 + 40 * ss(seg(t, T.bow, T.top)), t * 1.1, 7750); } },
      { glass, content: (P, cx) => { bow(P); if (rainA > 0) GX.rain(E, P, cx, s, lvl, 7910, .35 * rainA); GX.waves(E, P, cx, lvl, t * 1.3, 7760); GX.ark(E, P, cx, lvl + bob, 1, 7800); } },
      { glass, content: (P, cx, b) => {
        bow(P);
        E.hills(P, cx, 560, [{ y: 0, a: 20, ph: 1, c: COL.olive }], 7790);
        GX.fig(E, P, cx, b, 'noah', 'pray', -10, .8, false, t < this.LAND ? { item: null } : null);
        if (t < this.LAND && fly > 0) {
          const [hx, hy] = this.HANDS, u = ss(fly), x = lerp(cx + 170, hx, u), y = lerp(200, hy - 12, u) - Math.sin(u * Math.PI) * 30;
          P.setTransform(b.translate(x, y).scale(-1.6, 1.6)); dove(P, 0, 0, flap, 7980);   // mirrored: the dove faces the way it flies (left)
          P.piece(smooth([[24, -4], [44, -16], [58, -8], [42, 4]]), COL.green, { id: 7990, lead: 2.4, mat: false });   // the olive leaf
          P.setTransform(b);
        }
      } },
      { glass, content: (P, cx) => { bow(P); if (rainA > 0) GX.rain(E, P, cx, s, 500, 7920, .3 * rainA); GX.waves(E, P, cx, 500 + 30 * ss(seg(t, T.bow, T.top)), 3.9 + t * .9, 7780); } },
    ];
  },

  state(t, E) {
    const { key, seg, ss, lerp, LX } = E, T = this.T, GX = window.GX, [hx] = this.HANDS;
    // one camera path, no cuts: wide truck → push in to the ark → hold as it rises → truck to Noah → push to his
    // hands → pull back to the whole window → tilt down to the floor → sink and push onto the rainbow
    const cam = key(t, [[0, [-330, 230, .95]], [3.0, [-150, 240, .95]], [T.ark, [LX[1], 380, 1.6]], [T.rise, [LX[1] + 10, 360, 1.7]],
      [T.noah + .6, [LX[2] + 10, 380, 1.8]], [12.0, [hx - 20, 430, 2.4]], [13.8, [0, 250, .62]], [14.3, [0, 250, .62]], [T.top, [0, 640, .62]], [20, [0, 820, .8]]]);
    // light: cold dawn storm → noon, blended (no switch)
    const D = GX.light(E, 'dawn'), N = GX.light(E, 'noon'), u = ss(seg(t, 11.6, 13.6));
    const mix = (k) => Array.isArray(D[k]) ? D[k].map((v, j) => lerp(v, N[k][j], u)) : lerp(D[k], N[k], u);
    const st = GX.light(E, 'dawn', { cam, sunCol: mix('sunCol'), sx: lerp(D.sx, .05, u), sz: lerp(D.sz, .9, u), roseI: mix('roseI'),
      sunI: key(t, [[0, 1.7], [T.ark, 1.9], [T.noah, 2.0], [11.6, 2.0], [13.6, 2.3]]), skyI: key(t, [[0, .08], [T.ark, .1]]),
      patchK: key(t, [[T.top - 1, 1.1], [T.top + 1, 1.6]]) });
    st.lancets = this.panes(E, t); st.time = t;
    // the olive leaf flashes as the dove lands
    const fl = seg(t, this.LAND, this.LAND + .5);
    st.pts = fl > 0 && fl < 1 ? [[this.HANDS[0], this.HANDS[1] - 10, 40, 1.6 * (1 - fl), [1, .95, .8]]] : [];
    return window.GX.joint(E, this, st, t);
  },
};
(window.CLIPS ||= {})[window.CLIP.id] = window.CLIP;   // chapter joints: the previous chapter's tail reads this one
