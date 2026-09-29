// Shared pane painters for bible-story (load with uses: ['_glass']). Every painter takes E (engine: sg/ glass +
// window + lib) and draws through a Pass P in world units. Pieces = cut glass; brush = grisaille paint.
window.GX = {
  // ---------- many-coloured mosaic, coloured by what each region depicts ----------
  // Real windows are not random confetti: the sky is blues, night is deep blue/violet, the ground greens and earth,
  // the sea blue/teal; the arch head carries the warm ornament; contrast pieces are rare. Figures stand in the sky
  // zone, so they read against a cool ground (medieval / Florentine practice).
  FAM: {
    blue: ['#1d3a9c', '#142a70', '#2a52b0', '#22267a', '#1a5f9e'],
    sky: ['#2a52b0', '#1a5f9e', '#3a6ac0', '#1d3a9c', '#4a7ac8'],
    night: ['#142a70', '#22267a', '#1d3a9c', '#2a2a6a', '#3a2a7a'],
    teal: ['#1f7a7a', '#2a8f9a', '#17606a', '#2f7f86', '#1a5f9e'],
    green: ['#2f7f36', '#22602e', '#4f8f2a', '#2a6a4a', '#3f7a2a'],
    earth: ['#7a4e24', '#6b7a22', '#b5781c', '#8a5a2a', '#5a4a1a'],
    sand: ['#dc9a22', '#c9a030', '#b5781c', '#d9861c', '#eab640'],
    gold: ['#dc9a22', '#eab640', '#b5781c', '#d9861c', '#c9a030'],
    red: ['#a8101c', '#860c18', '#c8452a', '#8a1030', '#b0301c'],
    violet: ['#632a63', '#4c2a5e', '#4a2a8a', '#a8356a', '#3a2a7a'],
  },
  // per chapter: head = arch-head ornament (above y −240), sky = [[family, weight]…] down to the horizon (y),
  // ground below it; accent = the rare contrast pieces
  KEYS: {
    genesis: { head: [['gold', .7], ['red', .3]], sky: [['sky', .7], ['teal', .2], ['gold', .1]], horizon: 470, ground: [['green', .6], ['teal', .4]], accent: ['gold', 'red'] },
    eden: { head: [['gold', .5], ['green', .5]], sky: [['sky', .8], ['teal', .2]], horizon: 500, ground: [['green', .7], ['earth', .3]], accent: ['red', 'gold'] },
    flood: { head: [['teal', .6], ['blue', .4]], sky: [['blue', .5], ['night', .3], ['violet', .2]], horizon: 420, ground: [['teal', .5], ['blue', .5]], accent: ['gold'] },
    abraham: { head: [['violet', .7], ['gold', .3]], sky: [['night', .75], ['violet', .25]], horizon: 540, ground: [['violet', .5], ['earth', .5]], accent: ['gold'] },
    exodus: { head: [['red', .6], ['gold', .4]], sky: [['night', .7], ['violet', .2], ['blue', .1]], horizon: 520, ground: [['sand', .7], ['earth', .3]], accent: ['red', 'gold'] },
    david: { head: [['gold', .6], ['red', .4]], sky: [['sky', .75], ['teal', .25]], horizon: 520, ground: [['earth', .6], ['green', .4]], accent: ['red'] },
    promise: { head: [['gold', .5], ['red', .5]], sky: [['night', .6], ['violet', .3], ['red', .1]], horizon: 540, ground: [['green', .5], ['earth', .5]], accent: ['gold', 'teal'] },
  },
  // → the drawLancet `glass` option: { fine, quarry(cell, i), pearl(k, i) }
  glass(E, key) {
    const K = this.KEYS[key], F = this.FAM;
    const pick = (zone, h) => { let acc = 0; for (const [f, w] of zone) { acc += w; if (h < acc) return F[f]; } return F[zone[zone.length - 1][0]]; };
    const quarry = (c) => {
      if (c.h2 > .96) { const A = F[K.accent[Math.floor(c.h * 97) % K.accent.length]]; return A[Math.floor(c.h * 13) % A.length]; }
      const y = c.c[1] + (c.h - .5) * 60;                                    // jittered borders between regions
      const zone = y < -240 ? K.head : y < K.horizon ? K.sky : K.ground;
      const fam = pick(zone, (c.h * 7.3 + c.h2 * 3.1) % 1);
      return fam[Math.floor(c.h2 * 53) % fam.length];
    };
    const PEARL = [E.COL.gold, E.COL.white, E.COL.green, E.COL.sky];
    return { fine: true, quarry, pearl: (k) => PEARL[k % 4] };
  },

  // five-point star cut as one piece
  star(E, P, x, y, r, id) {
    const pts = [...Array(10)].map((_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? r * .45 : r; return [x + Math.cos(a) * q, y + Math.sin(a) * q, 1]; });
    P.piece(E.smooth(pts), E.COL.gold2, { id, lead: 3, mat: false });
  },
  // a band of glass along a spine (serpent body, rainbow arc…): widths w(u) tapering, returns the outline points
  band(E, spine, w) {
    const L = [], R = [];
    spine.forEach((p, i) => {
      const q = spine[Math.min(i + 1, spine.length - 1)], o = spine[Math.max(i - 1, 0)];
      const dx = q[0] - o[0], dy = q[1] - o[1], n = Math.hypot(dx, dy) || 1, ww = w(i / (spine.length - 1)) / 2;
      L.push([p[0] - dy / n * ww, p[1] + dx / n * ww]); R.push([p[0] + dy / n * ww, p[1] - dx / n * ww]);
    });
    return L.concat(R.reverse());
  },
  // the serpent: an S-curve body coiled round a trunk at (x, y), head raised to the left, cut into 3 banded pieces
  serpent(E, P, x, y, s, id) {
    const { smooth, brush, COL } = E, sp = [];
    for (let k = 0; k <= 40; k++) { const u = k / 40; sp.push([x + Math.sin(u * 9.5) * 34 * s * (1 - u * .3) - u * u * 70 * s, y + 150 * s - u * 250 * s]); }
    const cut = [0, 14, 27, 40];
    for (let j = 0; j < 3; j++) {
      const seg = sp.slice(cut[j], cut[j + 1] + 1), u0 = cut[j] / 40, u1 = cut[j + 1] / 40;
      const out = this.band(E, seg, (u) => (10 + 16 * Math.sin(Math.PI * Math.min(1, (u0 + (u1 - u0) * u) * 1.15))) * s);
      P.piece(smooth(out), j % 2 ? COL.gold : '#b8741c', { id: id + j, lead: 4, matW: 6, paint: (g) => {   // scale arcs following the spine
        for (let k = 1; k < seg.length - 1; k++) { const [px, py] = seg[k]; g.strokeStyle = 'rgba(30,24,10,.55)'; g.lineWidth = 1.3; g.beginPath(); g.arc(px, py, 5 * s, .3, Math.PI - .3); g.stroke(); }
      } });
    }
    const [hx, hy] = sp[40];
    P.piece(smooth([[hx - 22 * s, hy + 2 * s], [hx - 6 * s, hy - 12 * s], [hx + 12 * s, hy - 8 * s], [hx + 14 * s, hy + 8 * s], [hx - 4 * s, hy + 12 * s]]), '#b8741c', { id: id + 5, lead: 4, matW: 5, paint: (g) => {
      g.fillStyle = 'rgba(44,26,12,.9)'; g.beginPath(); g.ellipse(hx - 6 * s, hy - 3 * s, 3 * s, 2 * s, -.3, 0, 7); g.fill();
      brush(g, [[hx - 22 * s, hy + 2 * s], [hx - 34 * s, hy - 2 * s], [hx - 40 * s, hy + 3 * s]], 2.2, { color: 'rgba(168,16,28,.9)' });   // forked tongue
    } });
  },
  // tree of knowledge: trunk, broad crown, red fruit; returns fruit centres
  bigTree(E, P, x, y, s, id, fruit = 1) {
    const { smooth, circle, brush, COL } = E;
    P.piece(smooth([[x - 12 * s, y, 1], [x + 12 * s, y, 1], [x + 8 * s, y - 120 * s], [x + 30 * s, y - 160 * s], [x - 26 * s, y - 158 * s], [x - 8 * s, y - 120 * s]]), COL.brown, { id, lead: 5, matW: 8 });
    const crown = [];
    for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2, r = (k % 2 ? 96 : 110) * s; crown.push([x + Math.cos(a) * r * 1.15, y - 230 * s + Math.sin(a) * r * .85]); }
    P.piece(smooth(crown), COL.green, { id: id + 1, lead: 5.5, matW: 14, paint: (g) => { for (let k = 0; k < 16; k++) { const a = k * 2.4, r = (20 + (k * 37 % 70)) * s; brush(g, [[x + Math.cos(a) * r, y - 230 * s + Math.sin(a) * r * .8], [x + Math.cos(a) * r * .8 + 8, y - 226 * s + Math.sin(a) * r * .7]], 2.2, { color: 'rgba(20,40,14,.55)' }); } } });
    const F = [[-60, -250], [40, -280], [70, -200], [-20, -190], [-80, -180], [10, -310]].map(([dx, dy]) => [x + dx * s, y + dy * s]);
    if (fruit) F.forEach(([fx, fy], k) => P.piece(circle(fx, fy, 11 * s), COL.ruby, { id: id + 10 + k, lead: 3.4, matW: 4 }));
    return F;
  },
  // Noah's ark: hull + house riding the waves
  ark(E, P, x, y, s, id) {
    const { smooth, COL } = E;
    P.piece(smooth([[x - 110 * s, y - 20 * s, 1], [x + 110 * s, y - 20 * s, 1], [x + 80 * s, y + 30 * s], [x - 80 * s, y + 30 * s]]), COL.brown, { id, lead: 5, matW: 10, paint: (g) => { g.strokeStyle = 'rgba(44,26,12,.6)'; g.lineWidth = 1.6; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x - 100 * s, y - 8 * s + k * 12 * s); g.lineTo(x + 100 * s, y - 8 * s + k * 12 * s); g.stroke(); } } });
    P.piece(smooth([[x - 60 * s, y - 20 * s, 1], [x - 60 * s, y - 70 * s, 1], [x + 60 * s, y - 70 * s, 1], [x + 60 * s, y - 20 * s, 1]]), COL.gold, { id: id + 1, lead: 5, matW: 8, paint: (g) => { g.fillStyle = 'rgba(44,26,12,.8)'; g.fillRect(x - 10 * s, y - 56 * s, 20 * s, 22 * s); } });
    P.piece(smooth([[x - 74 * s, y - 70 * s, 1], [x, y - 108 * s, 1], [x + 74 * s, y - 70 * s, 1]]), COL.ruby, { id: id + 2, lead: 5, matW: 6 });
  },
  // a rainbow: annular bands round (cx, cy); each band is a piece (clipped by the lancet it is drawn in)
  rainbow(E, P, cx, cy, r0, bw, id) {
    const cols = ['#a8101c', '#e0561c', '#eab640', '#2f7f36', '#2a52b0', '#632a63'];
    cols.forEach((c, k) => { const R0 = r0 + k * bw, p = new Path2D(); p.arc(cx, cy, R0 + bw, Math.PI, 0); p.arc(cx, cy, R0, 0, Math.PI, true); p.closePath(); P.piece(p, c, { id: id + k, lead: 4, mat: false }); });
  },
  // waves: horizontal bands with a wavy top edge, from y0 to the bottom of the lancet
  waves(E, P, cx, y0, ph, id) {
    E.hills(P, cx, y0, [{ y: 0, a: 12, ph, c: E.COL.sky }, { y: 40, a: 10, ph: 2 + ph * .8, c: E.COL.blue2 }, { y: 80, a: 9, ph: 4 + ph * .6, c: E.COL.cobalt }], id);
  },
  // crack network from an impact point, bounded by the lancet at cx; deterministic (seed)
  cracks(E, cx, ix, iy, seed, n = 9) {
    const rnd = E.mulberry(seed), out = [];
    for (let i = 0; i < n; i++) {
      let a = i / n * Math.PI * 2 + rnd() * .5, x = ix, y = iy; const pts = [[x, y]], L = 70 + rnd() * 170;
      for (let l = 0; l < L; l += 14) { a += (rnd() - .5) * .7; x += Math.cos(a) * 14; y += Math.sin(a) * 14; pts.push([x, y]); if (Math.abs(x - cx) > 150 || y < E.APEX || y > E.BOT) break; }
      out.push({ pts, delay: rnd() * .12, w: 2.6 + rnd() * 2 });
    }
    return out;
  },
  // draw cracks grown to `grow` (0..1): bright (light pours through) or `mended` into thin lead scars
  drawCracks(E, P, cr, grow, mended) {
    const g = P.g, s = P.s;
    cr.forEach((c) => {
      const f = E.clamp((grow - c.delay) / (1 - c.delay)); if (f <= 0) return;
      const pts = c.pts.slice(0, Math.max(2, Math.ceil(c.pts.length * f))), path = new Path2D();
      pts.forEach((q, k) => k ? path.lineTo(q[0], q[1]) : path.moveTo(q[0], q[1]));
      if (!mended) { g.strokeStyle = 'rgba(255,248,232,.95)'; g.lineWidth = c.w; g.lineJoin = 'round'; g.stroke(path); if (P.mode === 'full') { s.strokeStyle = 'rgba(20,20,24,.55)'; s.lineWidth = c.w * .5; s.stroke(path); } }
      else P.lead(path, 3.2);
    });
  },
};
