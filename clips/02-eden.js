// 02 · 伊甸 Eden — afternoon gold on the garden (Adam in lancet II, Eve by the tree in III); push to the fruit as Eve
// raises it and Adam reaches; near-silence; the glass cracks from the fruit (white flash); the figures turn away,
// hands to their faces, as the camera pulls back and the light leaves the window right to left.
// Shots (TREATMENT §4), one continuous camera — no cuts: 02-1 MS hold · 02-2 slow push to the fruit · 02-3 the crack
// (hold) · 02-4 pull back to the MS while the light leaves.
window.CLIP = {
  id: '02-eden',
  uses: ['_glass', '03-flood'],
  duration: 19.2,
  timing: { fadeIn: [-1, 0], fade: [19.2, 19.2] },   // no fades: the joints hand the picture over (Sprint 6)
  caps: [
    [0.9, 4.8, 'But of the tree of the knowledge of good and evil, thou shalt not eat of it.', '只是分別善惡樹上的果子，你不可吃。'],
    [5.6, 9.3, 'She took of the fruit thereof, and did eat, and gave also unto her husband.', '就摘下果子來吃了，又給她丈夫。'],
    [12.8, 16.9, 'Therefore the LORD God sent him forth from the garden of Eden.', '耶和華神便打發他出伊甸園去。'],
    [17.1, 19.1, 'The Third Window · The Flood', '第三扇窗 · 洪水'],   // the next chapter's name, while its glass comes (Sprint 6)
  ],
  // calm glass notes; tension swell as the fruit is raised; near-silence 9.5–10.2; the crack; a low bell as the light leaves
  sfx: [[0.9, 'glass', { m: 74, v: .5 }], [2.6, 'glass', { m: 78, v: .35 }], [7.0, 'glass', { m: 79, v: .6 }], [7.4, 'air', { d: 2.0, v: .8 }],
    [8.6, 'glass', { m: 80, v: .6 }], [10.2, 'crack', { v: 1.25 }], [10.2, 'glass', { m: 98, v: .7 }], [12.2, 'bell', { m: 38, v: .9 }],
    [12.6, 'air', { d: 3.2, v: .7 }],
    [17.6, 'air', { d: 2.4, v: .8 }]],   // J2: the storm's rain is heard before it is seen
  T: { push: 3.0, crack: 10.2, turn: 10.8, pull: 11.2, out: 12.2 },
  // J2 · the fall → the flood: in the dark after the expulsion the window becomes the storm
  J: { next: '03-flood', t0: 16.9,
    // rain in the dark: the glass changes unlit, the camera pulls back to the wide, rain first, then cold dawn
    A(E, a, b, u) {
      const { ss, seg } = E, GX = window.GX;
      return GX.mixState(GX.dark(a, ss(seg(u, 0, .3))), GX.dark(b, 1 - ss(seg(u, .45, 1))), ss(u), (i) => u >= .3 + i * .03);
    } },
  FRUIT: [66, 400],   // world position of the fruit in Eve's raised hand (crack origin, light gathers here)

  panes(E, t) {
    const { COL, roundel, sunDisc, tree, ss, seg, step } = E, GX = window.GX, T = this.T, s = step(t);
    const glass = GX.glass(E, 'eden'), w = ss(seg(s, T.turn, T.turn + 1)), fell = w >= .5;
    // Eve raises the fruit, then Adam reaches for it; after the crack both turn to cover their faces (Gen 3:8),
    // in held glass steps; the fruit falls from Eve's hand halfway through the turn
    const eve = w > 0 ? ['offer', 'weep', w] : ['stand', 'offer', ss(seg(s, 5.6, 7.2))];
    const adam = w > 0 ? ['offer', 'weep', w] : ['stand', 'offer', ss(seg(s, 7.0, 8.6))];
    const brk = GX.breakAt(E, E.LX[2], this.FRUIT[0], this.FRUIT[1], 31);   // the same break is mended in 07
    const sway = Math.sin(s * 2.1) * 3;   // the serpent's head, in held steps
    return [
      { glass, content: (P, cx) => { roundel(P, cx, -150, 78, COL.sky, 7000); sunDisc(P, cx, -150, 28, COL.gold2, 7030); GX.garden(E, P, cx, 7100); tree(P, cx - 50, 520, 1.2, 7120); tree(P, cx + 60, 530, 1, 7124); } },
      { glass, content: (P, cx, b) => { roundel(P, cx, -150, 78, COL.sky, 7200); GX.garden(E, P, cx, 7210); GX.fig(E, P, cx, b, 'adam', adam, 5, .8); } },
      { glass, content: (P, cx, b) => {
        roundel(P, cx, -150, 78, COL.sky, 7400); GX.garden(E, P, cx, 7410); GX.bigTree(E, P, cx + 100, 600, .8, 7420);
        GX.serpent(E, P, cx + 128 + sway, 470, .9, 7440);   // right of Eve, head turned to her ear
        GX.fig(E, P, cx, b, 'eve', eve, 25, .8, true, fell ? { item: null } : null);
        if (t >= T.crack) GX.drawBreak(E, P, b, brk, t, T.crack);   // the glass shatters from the fruit and stays broken
      } },
      { glass, content: (P, cx) => { roundel(P, cx, -150, 78, COL.purple, 7600); GX.garden(E, P, cx, 7610); tree(P, cx, 520, 1.3, 7620); } },
    ];
  },

  state(t, E) {
    const { key, seg, ss, lerp } = E, T = this.T, [fx, fy] = this.FRUIT;
    const MS = [0, 400, 1.8];
    // one camera, no cuts: MS hold → slow push onto the fruit → hold through the crack → pull back to the MS
    const cam = key(t, [[0, MS], [T.push, MS], [T.crack - .3, [fx - 30, fy - 10, 2.9]], [T.pull, [fx - 30, fy - 10, 2.9]], [14.6, MS]]);
    const st = window.GX.light(E, 'aft', { cam, lancets: this.panes(E, t), time: t });
    // light gathers on the fruit as it is raised
    const gather = ss(seg(t, 6.6, T.crack));
    st.pts = gather > 0 && t < T.crack + .1 ? [[fx, fy, 30 + 20 * gather, 1.6 * gather, [1, .82, .5]]] : [];
    // the crack: a white flash from the fruit, then light pours through the cracks
    const fl = seg(t, T.crack, T.crack + .6);
    if (fl > 0 && fl < 1) st.pts.push([fx, fy, 80 + 260 * fl, 4 * (1 - fl) * (1 - fl), [1, .97, .9]]);
    if (t >= T.crack && t < T.out) { st.sunI = 2.35 * (1 - .25 * ss(seg(t, T.crack, T.out))); st.amb = key(t, [[T.crack, .075], [T.out, .06]]); }
    // expulsion: the sun band slides off the window to the left (IV, III, II, I go dark), the hall turns cold
    if (t >= T.out) {
      const u = ss(seg(t, T.out + .4, 16.4));
      st.sunU = lerp(0, -2500, u);
      st.sunI = 2.35 * (1 - .75 * u);
      st.sunCol = key(t, [[T.out, E.SUN.aft], [16.2, E.SUN.dusk]]);
      st.amb = key(t, [[T.out, .06], [16.5, .045]]); st.ambCol = [.5, .56, .8];
      st.roseI = key(t, [[T.out, .8], [16.5, .1]]); st.skyI = key(t, [[T.out, .1], [16.5, .08]]);
    }
    return window.GX.joint(E, this, st, t);
  },
};
(window.CLIPS ||= {})[window.CLIP.id] = window.CLIP;   // chapter joints: the previous chapter's tail reads this one
