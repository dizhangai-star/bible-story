// dev clip: one pane breaks into displaced shards, then is mended — shards slide back into place one by one, lead
// welds over the cracks from the break outward (spark on the beat), and the pane lights up whole again.
window.CLIP = {
  id: 'shatter-test',
  uses: ['_glass'],
  duration: 9,
  timing: { fadeIn: [0, 0.3], fade: [8.6, 9] },
  T: { hit: 1.0, seat: 3.2, weld: 5.0, whole: 6.6 },
  BREAK: [-30, 180, 31],

  state(t, E) {
    const { seg, ss, step, key, LX } = E, GX = window.GX, T = this.T, cx = LX[0];
    const ix = cx + this.BREAK[0], iy = this.BREAK[1];
    const cr = GX.cracks(E, cx, ix, iy, this.BREAK[2], 11), sh = GX.shards(E, cr, ix, iy);
    const n = sh.length, order = sh.map((s, i) => i).sort((a, b) => Math.hypot(sh[b].c[0] - ix, sh[b].c[1] - iy) - Math.hypot(sh[a].c[0] - ix, sh[a].c[1] - iy));
    const rank = []; order.forEach((i, r) => { rank[sh[i].k] = r; });
    const s8 = step(t), s12 = step(t, 12);
    // out: all shards jump at the hit; back: outer shards first, one per glass step, each settling in two steps
    const b = (k) => { const out = ss(seg(s12, T.hit, T.hit + .25)); const back = seg(s8, T.seat + rank[k] * .075, T.seat + rank[k] * .075 + .25); return out * (1 - back); };
    const grow = seg(s12, T.hit, T.hit + .4), weld = seg(s12, T.weld, T.weld + 1.5);
    const glass = GX.glass(E, 'promise');
    const pane = { glass, content: (P, c) => {
      GX.garden(E, P, c, 9110); GX.bigTree(E, P, c, 600, .8, 9120, 0);
      P.setTransform(P.g.getTransform());
      GX.shatter(E, P, sh, ix, iy, b, 77);
      if (grow > 0 && grow < 1) GX.drawCracks(E, P, cr, grow, false);   // the crack runs, then the gaps carry the light
      if (weld > 0) cr.forEach((q) => { const m = Math.max(2, Math.ceil(q.pts.length * weld)), p = new Path2D(); q.pts.slice(0, m).forEach((z, k) => k ? p.lineTo(z[0], z[1]) : p.moveTo(z[0], z[1])); P.lead(p, 3.4); });
    } };
    const whole = ss(seg(t, T.whole, T.whole + 1));
    const st = GX.light(E, 'night', { cam: key(t, [[0, [cx, 260, 1.7]], [9, [cx, 250, 1.8]]]), sunU: cx, bandW: 340, sunCol: [.62, .7, 1],
      sunI: key(t, [[0, 1.2], [T.hit, 1.2], [T.hit + .4, .8], [T.whole, .8], [T.whole + 1, 1.9]]), sx: 0, sz: 1.2, skyI: .07, amb: .05, time: t });
    st.lancets = [pane, { glass }, { glass }, { glass }];
    st.pts = [];
    const fl = seg(t, T.hit, T.hit + .5);
    if (fl > 0 && fl < 1) st.pts.push([ix, iy, 60 + 200 * fl, 3.5 * (1 - fl) * (1 - fl), [1, .97, .9]]);
    if (weld > 0 && weld < 1) { const beat = ((t - T.weld) % .75) / .75; st.pts.push([ix, iy, 16 + 10 * (1 - beat), 5 * (1 - beat) ** 2 + .6, [1, .8, .5]]); }
    if (whole > 0) st.pts.push([cx, 250, 260, .5 * whole, [.8, .85, 1]]);
    return st;
  },
};
