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
    abraham: { head: [['violet', .6], ['night', .4]], sky: [['night', .85], ['blue', .15]], horizon: 540, ground: [['violet', .5], ['earth', .5]], accent: ['violet'], pearl: ['night', 'violet'] },   // no gold: the stars are the only light-coloured glass
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
    const PEARL = K.pearl ? K.pearl.map((f) => F[f][0]) : [E.COL.gold, E.COL.white, E.COL.green, E.COL.sky];
    return { fine: true, quarry, pearl: (k) => PEARL[k % PEARL.length] };
  },

  // five-point star cut as one piece
  star(E, P, x, y, r, id, col = E.COL.gold2) {
    const pts = [...Array(10)].map((_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? r * .45 : r; return [x + Math.cos(a) * q, y + Math.sin(a) * q, 1]; });
    P.piece(E.smooth(pts), col, { id, lead: 3, mat: false });
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
  rainbow(E, P, cx, cy, r0, bw, id, n = 6) {   // n = how many bands (red outward) are set
    const cols = ['#a8101c', '#e0561c', '#eab640', '#2f7f36', '#2a52b0', '#632a63'];
    cols.slice(0, n).forEach((c, k) => { const R0 = r0 + k * bw, p = new Path2D(); p.arc(cx, cy, R0 + bw, Math.PI, 0); p.arc(cx, cy, R0, 0, Math.PI, true); p.closePath(); P.piece(p, c, { id: id + k, lead: 4, mat: false }); });
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

  // shards between the radial cracks (sorted by angle round the break at ix, iy); each wedge splits into an inner
  // and an outer shard at `f` of its length. → [{ p: Path2D, c: [x, y], inner, k }]
  shards(E, cr, ix, iy, f = .45) {
    const L = cr.map((c) => { const e = c.pts[c.pts.length - 1]; return { pts: c.pts, a: Math.atan2(e[1] - iy, e[0] - ix) }; }).sort((p, q) => p.a - q.a);
    const out = [], poly = (pts) => { const p = new Path2D(); pts.forEach((q, k) => k ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); p.closePath(); return p; };
    const mid = (pts) => pts.reduce((s, q) => [s[0] + q[0] / pts.length, s[1] + q[1] / pts.length], [0, 0]);
    L.forEach((A, k) => {
      const B = L[(k + 1) % L.length], a = Math.max(1, Math.round(A.pts.length * f)), b = Math.max(1, Math.round(B.pts.length * f));
      const inner = [[ix, iy], ...A.pts.slice(1, a + 1), ...B.pts.slice(1, b + 1).reverse()];
      const outer = [...A.pts.slice(a), ...B.pts.slice(b).reverse()];
      out.push({ p: poly(inner), c: mid(inner), inner: true, k: k * 2 });
      if (outer.length > 3) out.push({ p: poly(outer), c: mid(outer), inner: false, k: k * 2 + 1 });
    });
    return out;
  },
  // break the pane already drawn (mosaic + content) into those shards: each shard shifts out from the break, turns a
  // little and loses light (tilted glass), the gaps go dark. b(k) → 0..1 how far shard k is out of place.
  shatter(E, P, sh, ix, iy, b, seed) {
    const r = E.mulberry(seed), J = sh.map(() => [r(), r(), r()]);
    if (!sh.some((s) => b(s.k) > 0)) return;
    this._snap = this._snap || [];
    P.cx.forEach((c, n) => {
      const M = c.getTransform(), cv = c.canvas, isG = c === P.g;
      const S = this._snap[n] = this._snap[n] || document.createElement('canvas');
      if (S.width !== cv.width || S.height !== cv.height) { S.width = cv.width; S.height = cv.height; }
      const sg = S.getContext('2d'); sg.setTransform(1, 0, 0, 1, 0, 0); sg.clearRect(0, 0, S.width, S.height); sg.drawImage(cv, 0, 0);
      const all = new Path2D(); sh.forEach((s) => { if (b(s.k) > 0) all.addPath(s.p); });
      c.save(); c.setTransform(M);
      if (isG) { c.fillStyle = '#8e98b0'; c.fill(all); }   // the gaps let a little light through
      else { c.globalCompositeOperation = 'destination-out'; c.fill(all); }
      c.restore();
      sh.forEach((s, i) => {
        const u = b(s.k); const [j0, j1, j2] = J[i];
        const dx = s.c[0] - ix, dy = s.c[1] - iy, d = Math.hypot(dx, dy) || 1, m = u * (s.inner ? 8 : 5) * (.6 + .8 * j0);
        const T = new DOMMatrix().translate(dx / d * m, dy / d * m + u * 2.5).translate(s.c[0], s.c[1]).rotate(u * (j1 - .5) * 10).translate(-s.c[0], -s.c[1]);
        c.save(); c.setTransform(M.multiply(T)); c.clip(s.p);
        c.setTransform(M.multiply(T).multiply(M.inverse())); c.drawImage(S, 0, 0);
        if (isG && u > 0) { c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(0,0,0,${u * (.1 + .5 * j2)})`; c.fillRect(0, 0, cv.width, cv.height); }
        c.restore();
      });
    });
  },

  // a break in one lancet: cracks, shards, and each shard's rank from the outside in (the order they go back)
  breakAt(E, cx, ix, iy, seed, n = 9) {
    const K = [cx, ix, iy, seed, n].join(); this._brk = this._brk || {};
    if (this._brk[K]) return this._brk[K];
    const cr = this.cracks(E, cx, ix, iy, seed, n), sh = this.shards(E, cr, ix, iy), rank = [];
    sh.map((s, i) => i).sort((a, b) => Math.hypot(sh[b].c[0] - ix, sh[b].c[1] - iy) - Math.hypot(sh[a].c[0] - ix, sh[a].c[1] - iy)).forEach((i, r) => { rank[sh[i].k] = r; });
    return (this._brk[K] = { cr, sh, rank, ix, iy, seed, n: sh.length });
  },
  // draw a break at time t (call at the end of a pane's content): `hit` = when it shatters (the crack runs, the shards
  // jump); optional mend = [t0, seat, weld]: shards slide back from t0 (outside in, `seat` s in all), then lead
  // welds over the cracks from the break outward for `weld` s — the scars stay
  drawBreak(E, P, base, B, t, hit, mend) {
    const { seg, ss, step } = E, s8 = step(t), s12 = step(t, 12);
    const out = hit == null ? 1 : ss(seg(s12, hit, hit + .25));
    const back = (k) => mend ? seg(s8, mend[0] + B.rank[k] * mend[1] / B.n, mend[0] + B.rank[k] * mend[1] / B.n + .25) : 0;
    P.setTransform(base);
    if (out > 0) this.shatter(E, P, B.sh, B.ix, B.iy, (k) => out * (1 - back(k)), B.seed + 7);
    const grow = hit == null ? 1 : seg(s12, hit, hit + .4);
    if (grow > 0 && grow < 1) this.drawCracks(E, P, B.cr, grow, false);   // the crack runs; then the gaps carry the light
    const weld = mend ? seg(s12, mend[0] + mend[1], mend[0] + mend[1] + mend[2]) : 0;
    if (weld > 0) B.cr.forEach((q) => { const m = Math.max(2, Math.ceil(q.pts.length * weld)), p = new Path2D(); q.pts.slice(0, m).forEach((z, k) => k ? p.lineTo(z[0], z[1]) : p.moveTo(z[0], z[1])); P.lead(p, 3.4); });
    return weld;
  },

  // ---------- shared scene helpers (chapter clips + board.js) ----------
  // the carved string course (Gen 1:3, Vulgate), in every chapter: Roman capitals, letter-spaced
  TITLE: [['F\u2009I\u2009A\u2009T\u2003·\u2003L\u2009V\u2009X', 70, 0]],
  // light presets for the darker hall look; o overrides any field
  light(E, k, o = {}) {
    const { SUN } = E;
    const P = { dawn: [SUN.dawn, 2.2, .42, 1.5], noon: [SUN.noon, 2.7, .06, .62], aft: [SUN.aft, 2.35, -.36, 1.3], dusk: [SUN.dusk, 2.6, -.55, 2.1], night: [SUN.moon, .6, 0, 1.2] }[k];
    return { sunCol: P[0], sunI: P[1], sx: P[2], sz: P[3], sunU: 0, bandW: 3200, skyI: k === 'night' ? .05 : .1, skyCol: [.55, .65, .9],
      amb: k === 'night' ? .05 : .075, ambCol: [.62, .64, .82], spill: .5, contrast: .22, vign: .6, haze: .45, raysK: .55,
      roseI: k === 'night' ? .15 : .8, floorMode: 1, floor: { camD: 2600, eyeH: 320 }, time: 3, inscription: this.TITLE, ...o };
  },
  // ---------- chapter joints (Sprint 6) ----------
  // A chapter's tail hands the picture to the next chapter's frame 0, so the film's plain cut is invisible. The next
  // chapter is loaded as a `uses` entry and registered in window.CLIPS (last line of every chapter file).
  // joint(E, A, a, t): past A.J.t0 run the picked variant A.J[v](E, a, b, u, t) with b = next.state(0), u 0→1 over
  // the tail. The variant is window.JV (joint dev clips), else A.J.pick, else 'A'.
  joint(E, A, a, t) {
    const J = A.J, B = window.CLIPS && window.CLIPS[J.next];
    if (!B || t < J.t0) return a;
    const b = B.state(0, E), v = window.JV || J.pick || 'A';
    return J[v].call(A, E, a, b, E.seg(t, J.t0, A.duration), t);
  },
  // mix two states by u: numbers and number arrays mix (fields one side lacks mix against the renderer's default),
  // cam mixes x, y and log zoom, point lights cross-fade (4 max), anything else switches at u .5.
  // lancets: take(i) true → lancet i shows b's pane.
  DEF: { sweep: [0, 700, 0, 806], skew: .06, bloom: .55, thr: .5, patchK: 1.1, gild: 0, contrast: .12, vign: .4, haze: .55, spill: 1, raysK: 1 },
  mixState(a, b, u, take) {
    const num = (v) => typeof v === 'number' || (Array.isArray(v) && v.every(num));
    const mix = (p, q) => typeof p === 'number' ? p + (q - p) * u : p.map((v, j) => mix(v, q[j]));
    const o = {};
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (k === 'lancets' || k === 'pts' || k === 'cam') continue;
      const p = a[k] ?? this.DEF[k], q = b[k] ?? this.DEF[k];
      const v = p !== undefined && q !== undefined && num(p) && num(q) && (!Array.isArray(p) || p.length === q.length) ? mix(p, q) : (u < .5 ? p : q);
      if (v !== undefined) o[k] = v;
    }
    o.cam = this.camMix(a.cam, b.cam, u);
    o.pts = this.fadePts(a.pts, 1 - u).concat(this.fadePts(b.pts, u)).sort((p, q) => q[3] - p[3]).slice(0, 4);
    o.lancets = (a.lancets || []).map((L, i) => (take ? take(i) : u >= .5) ? b.lancets[i] : L);
    return o;
  },
  camMix: ([ax, ay, az], [bx, by, bz], u) => [ax + (bx - ax) * u, ay + (by - ay) * u, az * Math.pow(bz / az, u)],
  fadePts: (pts, k) => (pts || []).map((p) => [p[0], p[1], p[2], p[3] * k, p[4]]).filter((p) => p[3] > .01),
  // the unlit hall: the window dark, the stone just readable (the moment the glass can change unseen)
  dark(s, k = 1) {
    const f = 1 - k;
    return { ...s, sunI: s.sunI * f, skyI: s.skyI * (1 - .6 * k), roseI: s.roseI * (1 - .8 * k), amb: s.amb * (1 - .35 * k), pts: this.fadePts(s.pts, f) };
  },
  // pose: an FPOSE name, or [a, b, u] = blend of two poses (angles mixed, face switches at u .5); u is stepped by the caller
  pose(E, p) {
    if (typeof p === 'string') return E.FPOSE[p];
    if (!Array.isArray(p)) return p;   // a pose object as is
    const [a, b, u] = p, A = E.FPOSE[a], B = E.FPOSE[b], o = { ...(u < .5 ? A : B) };
    for (const k in A) if (typeof A[k] === 'number' && typeof B[k] === 'number') o[k] = A[k] + (B[k] - A[k]) * u;
    return o;
  },
  // a robed figure standing on the lancet floor at cx + x, scale s; cast may be a CAST name or an object
  fig(E, P, cx, base, who, pose, x, s, flip, over) {
    const p = this.pose(E, pose), c = typeof who === 'string' ? E.CAST[who] : who;
    E.drawFigure(P, base.translate(cx + x, 604 - 182 * s + (p.rootDy || 0) * s).scale(flip ? -s : s, s), p, over ? { ...c, ...over } : c);
  },
  bg(E, P, cx, col, id) { P.piece(new Path2D(`M${cx - 160} -400 H${cx + 160} V660 H${cx - 160} Z`), col, { id, lead: 0, mat: false }); },
  garden(E, P, cx, id) { E.hills(P, cx, 540, [{ y: -10, a: 12, ph: id % 7, c: E.COL.olive }, { y: 40, a: 8, ph: 3, c: E.COL.green2 }], id); },
  // rain: grisaille streaks painted on the glass, stepped (t already stepped by the caller)
  rain(E, P, cx, t, y1, id, a = .5) {
    const r = E.mulberry(id);
    for (let j = 0; j < 22; j++) {
      const x = cx - 150 + r() * 300, sp = 260 + r() * 140, L = 50 + r() * 60, y = -420 + ((r() * 1000 + t * sp) % (y1 + 420));
      E.brush(P.g, [[x, y], [x - L * .22, y + L]], 1.3 + r(), { color: `rgba(200,220,255,${a})` });
    }
  },
};
