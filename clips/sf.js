// Style frames (dev clip, not in the film): 0–1 s Eden (the first crack) · 1–2 s Flood (rainbow thrown on the floor,
// top-down) · 2–3 s Promise (night; mended scars; one pane keeps its own light). Preview: node preview.mjs sf 0.5 1.5 2.5
window.CLIP = {
  id: 'sf',
  duration: 3,
  uses: ['_glass'],
  timing: { fadeIn: [-1, -.9], fade: [99, 100] },
  nosub: false,
  caps: [
    [0.05, 0.95, 'And the serpent said unto the woman, Ye shall not surely die.', '蛇對女人說：你們不一定死。'],
    [2.05, 2.95, 'The people that walked in darkness have seen a great light.', '行在黑暗中的百姓看見了大光。'],
  ],
  panes(E, t, which) {
    const { COL, roundel, sunDisc, hills, tree, dove, circle } = E, G = window.GX;
    const eden = { glass: G.glass(E, 'eden'), content: (P, cx) => {
      roundel(P, cx, -150, 78, COL.sky, 7000); sunDisc(P, cx, -150, 28, COL.gold2, 7030, 12);
      hills(P, cx, 540, [{ y: -10, a: 12, ph: 1, c: COL.olive }, { y: 40, a: 8, ph: 3, c: COL.green2 }], 7100);
      G.bigTree(E, P, cx + 10, 560, 1, 7200);
      G.serpent(E, P, cx + 10, 440, 1.15, 7300);
      if (which === 'eden') G.drawCracks(E, P, G.cracks(E, cx, cx - 50, 310, 31), 1, false);
      if (which === 'night') G.drawCracks(E, P, G.cracks(E, cx, cx - 50, 310, 31), 1, true);
    } };
    const flood = (k) => ({ glass: G.glass(E, 'flood'), content: (P, cx) => {
      P.piece(new Path2D(`M${cx - 160} -400 H${cx + 160} V660 H${cx - 160} Z`), k % 2 ? COL.blue2 : COL.cobalt, { id: 7400 + k, lead: 0, mat: false });
      G.rainbow(E, P, 0, 420, 520, 34, 7500 + k * 10);
      G.waves(E, P, cx, 470, k * 1.3, 7600 + k * 10);
      if (k === 1) G.ark(E, P, cx, 470, 1, 7700);
      if (k === 2) dove(P, cx - 10, 120, 1, 7710);
    } });
    const promise = { glass: G.glass(E, 'promise'), content: (P, cx) => {   // a lamp that keeps burning: small, centred, the only warm glass at night
      roundel(P, cx, -150, 78, COL.deepblue, 7800);
      for (let k = 0; k < 6; k++) window.GX.star(E, P, cx + Math.cos(k * 1.05) * 50, -150 + Math.sin(k * 1.05) * 50, 8, 7810 + k);
      P.piece(E.smooth([[cx - 40, 420, 1], [cx + 40, 420, 1], [cx + 26, 380], [cx - 26, 380]]), COL.gold, { id: 7850, lead: 4.5, matW: 6 });
      P.piece(E.smooth([[cx, 300], [cx + 18, 350], [cx, 378], [cx - 18, 350]]), COL.amber, { id: 7851, lead: 3.4, mat: false });
      hills(P, cx, 540, [{ y: 0, a: 10, ph: 2, c: COL.green2 }, { y: 40, a: 8, ph: 4, c: COL.brown }], 7860);
    } };
    if (which === 'flood') return [0, 1, 2, 3].map(flood);
    if (which === 'night') return [eden, flood(1), flood(2), promise];
    return [{}, {}, eden, {}];
  },
  state(t, E) {
    const { LX, SUN } = E;
    if (t < 1) {   // EDEN · close-up on lancet III in low afternoon light; the crack has just run out from the fruit
      return { cam: [LX[2], 330, 1.5], sunU: LX[2] + 10, bandW: 330, sunI: 2.4, sunCol: SUN.aft, sx: -.36, sz: 1.3, skyI: .13, skyCol: [.55, .65, .9],
        amb: .08, spill: .5, contrast: .22, vign: .6, ambCol: [.62, .64, .82], roseI: .8, floorMode: 1, floor: { camD: 2600, eyeH: 320 }, lancets: this.panes(E, t, 'eden'),
        pts: [[LX[2] - 50, 310, 90, 1.6, [1, .95, .85]]], time: 3 };
    }
    if (t < 2) {   // FLOOD · top-down: the rainbow window thrown onto the flagstones at noon
      return { cam: [0, 250, 1], sunU: 0, bandW: 3200, sunI: 2.7, sunCol: SUN.noon, sx: .05, sz: .9, skyI: .15, skyCol: [.55, .65, .9],
        amb: .1, ambCol: [.62, .64, .82], floorMode: 2, topCam: [0, 700, .75], pm: [-1000, 150, 2000, 1250], pmBlur: 2, patchK: 1.9,
        vign: .5, bloom: .65, thr: .45, lancets: this.panes(E, t, 'flood'), time: 3 };
    }
    // PROMISE · night wide: moonlight through every pane, the Eden crack mended with lead, one lamp keeps its own light
    return { cam: [0, 300, .5], sunU: 0, bandW: 3200, sunI: .5, sunCol: SUN.moon, sx: 0, sz: 1.2, skyI: .05, skyCol: [.4, .5, .9],
      amb: .06, ambCol: [.5, .55, .8], roseI: .15, floorMode: 1, floor: { camD: 2600, eyeH: 320 }, lancets: this.panes(E, t, 'night'),
      pts: [[LX[3], 350, 120, 2.6, [1, .6, .25]]], inscription: window.GX.TITLE, gild: .2, time: 3 };
  },
};
