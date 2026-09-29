// Cast sheet (dev clip, not in the film): every character as cut glass on a glazier's light table, in the pose
// each chapter needs. Preview: node preview.mjs cast 0.5 --cols 1 --w 1600
window.CLIP = {
  id: 'cast',
  duration: 1,
  uses: ['_glass'],
  timing: { fadeIn: [-1, -.9], fade: [99, 100] },
  glyphs: '光之窗角色設定亞當夏娃挪亞伯拉罕摩西大衛歌利蛇鴿子橄欖枝',
  glyphsEn: 'WINDOWSOFLIGHTCASTSHEETADAMEVENOAHABRAHAMMOSESDAVIDGOLIATHSERPENTDOVE',
  render(t, E) {
    const { Lc, L, comp, Pass, COL, circle, drawFigure, drawKnight, FPOSE, POSE, CAST, archPanel, drawPanel } = E, GX = window.GX;
    const { G, S, R, O } = Lc;
    for (const c of [G, S, R, O]) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1920, 1080); }
    S.fillStyle = '#2e2b28'; S.fillRect(0, 0, 1920, 1080);
    const P = new Pass(G, S), I = new DOMMatrix();
    const label = (x, y, t1, t2) => {
      O.textAlign = 'center'; O.fillStyle = '#e9dcc0'; O.font = '600 22px Cinzel, "Noto Serif TC"'; O.fillText(t1, x, y);
      if (t2) { O.fillStyle = 'rgba(233,220,192,.72)'; O.font = 'italic 18px "IM Fell English"'; O.fillText(t2, x, y + 24); }
    };
    const inPanel = (x, y, w, h, seed, fn) => {
      const pn = archPanel(x, y, w, h, seed); P.setTransform(I); drawPanel(P, pn);
      P.g.save(); P.s.save(); P.g.clip(pn.inner); P.s.clip(pn.inner); fn(); P.setTransform(I); P.g.restore(); P.s.restore();
    };
    const fig = (x, y, w, h, pose, cast, sc, dx = 0, flip = false) => {
      const p = FPOSE[pose];
      drawFigure(P, I.translate(x + w / 2 + dx, y + h - 22 - 182 * sc + (p.rootDy || 0) * sc).scale(flip ? -sc : sc, sc), p, cast);
    };
    O.textAlign = 'left'; O.fillStyle = '#efe2c4'; O.font = '700 34px Cinzel, "Noto Serif TC"'; O.fillText('光之窗 · WINDOWS OF LIGHT — 角色設定 CAST SHEET v2', 44, 52);
    O.font = 'italic 21px "IM Fell English"'; O.fillStyle = 'rgba(239,226,196,.75)';
    O.fillText('One glass rig for everyone (the demo knight’s skeleton): cut pieces, lead cames, grisaille faces. God is never drawn — only light.', 44, 82);
    // row 1: the people, each in the pose their chapter needs
    const row = [
      ['stand', 'adam', 'ADAM · 亞當', 'II · Eden — leaf girdle', .9, false],
      ['offer', 'eve', 'EVE · 夏娃', 'II · Eden — holds the fruit', .9, true],
      ['pray', 'noah', 'NOAH · 挪亞', 'III · Flood — the dove returns to his hands', .9, false],
      ['lookUp', 'abraham', 'ABRAHAM · 亞伯拉罕', 'IV · counts the stars', .86, false],
      ['raiseStaff', 'moses', 'MOSES · 摩西', 'V · rod raised, face shining', .7, false],
    ];
    row.forEach(([pose, who, t1, t2, sc, flip], i) => {
      const x = 36 + i * 250, y = 104, w = 232, h = 450;
      inPanel(x, y, w, h, 11 + i, () => fig(x, y, w, h, pose, CAST[who], sc, flip ? 6 : -6, flip));
      label(x + w / 2, y + h + 30, t1, t2);
    });
    // David and Goliath share a panel, to show the scale
    { const x = 1290, y = 104, w = 594, h = 450;
      inPanel(x, y, w, h, 21, () => {
        const sc = 1.02; E.drawGoliath(P, I.translate(x + 410, y + h - 22 - 182 * sc).scale(-sc, sc), { ...POSE.guard, wF: 40 * Math.PI / 180 });
        fig(x, y, 260, h, 'sling', CAST.david, .6, 50);
      });
      label(x + w / 2, y + h + 30, 'DAVID · 大衛  &  GOLIATH · 歌利亞', 'VI · ruddy shepherd with a sling · the giant in brass and mail'); }
    // row 2: serpent, dove, faces
    { const x = 36, y = 640, w = 360, h = 380;
      inPanel(x, y, w, h, 31, () => { GX.bigTree(E, P, x + w / 2, y + h + 40, .95, 800); GX.serpent(E, P, x + w / 2, y + h - 110, 1.15, 830); });
      label(x + w / 2, y + h + 30, 'SERPENT · 蛇', 'gold & umber, never green on green'); }
    { const x = 416, y = 640, w = 300, h = 380;
      inPanel(x, y, w, h, 32, () => {
        P.setTransform(I.translate(x + w / 2, y + h / 2 - 20).scale(2.6).translate(-(x + w / 2), -(y + h / 2 - 20)));
        E.dove(P, x + w / 2, y + h / 2 - 20, 0, 850);
        P.piece(E.smooth([[x + w / 2 + 26, y + h / 2 - 22], [x + w / 2 + 40, y + h / 2 - 30], [x + w / 2 + 48, y + h / 2 - 24], [x + w / 2 + 36, y + h / 2 - 18]]), COL.green, { id: 860, lead: 2.4, mat: false });
      });
      label(x + w / 2, y + h + 30, 'DOVE · 鴿子', 'III · returns with an olive leaf'); }
    // faces, large: expressions live in brows and mouth (swap the face piece, never morph)
    const faces = [['noah', 'gentle', 'Noah'], ['moses', 'fierce', 'Moses'], ['eve', 'wonder', 'Eve'], ['david', 'resolute', 'David'], ['abraham', 'wonder', 'Abraham'], ['adam', 'gentle', 'Adam']];
    faces.forEach(([who, face, n], i) => {
      const cx = 830 + i * 176, cy = 800, r = 74;
      P.setTransform(I); P.piece(circle(cx, cy, r + 10), COL.ruby, { id: 900 + i, lead: 6, mat: false });
      P.piece(circle(cx, cy, r), COL.cobalt, { id: 910 + i, lead: 6, matW: 14 });
      P.g.save(); P.s.save(); P.g.clip(circle(cx, cy, r)); P.s.clip(circle(cx, cy, r));
      const sc = 1.55; drawFigure(P, I.translate(cx - 16 * sc, cy + 150 * sc).scale(sc), { ...FPOSE.stand, face, neck: 0 }, { ...CAST[who], item: null, mantle: null });
      P.setTransform(I); P.g.restore(); P.s.restore();
      O.textAlign = 'center'; O.fillStyle = 'rgba(233,220,192,.8)'; O.font = 'italic 19px "IM Fell English"'; O.fillText(`${n} · ${face}`, cx, cy + r + 28);
    });
    comp.render(L, { cam: [960, 540, 1], lb: 1, amb: .45, ambCol: [.9, .86, .8], haze: .04, bloom: .22, thr: .7, expo: 1.0, vign: .25, texK: 1 });
  },
};
