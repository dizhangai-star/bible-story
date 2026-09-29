// Storyboard (dev clip, not in the film): shot i is drawn at t = i + 0.5 with the real engine — its key frame,
// with the camera move marked on top. tools/storyboard.mjs lays the shots out on one page (docs/storyboard.png).
const D = Math.PI / 180;
const SHOTS = [
  // [id, 景别/角度, 运镜, 光, 画面/情绪, move]
  ['01-1', '玫瑰窗大特寫', '緩慢拉遠', '全黑中一點火光', '起初 · 靜、懸念', 'pull'],
  ['01-2', '整個玫瑰窗', '繼續拉遠', '花瓣逐對亮起 = 六日', '創造 · 期待', 'pull'],
  ['01-3', '大全景 · 四窗 + 地面', '下搖 → 緩推', '細光帶掃過四窗，光柱落地', '要有光 · 莊嚴', 'tiltD'],
  ['02-1', '中景 · 亞當與夏娃', '固定', '午後金光', '伊甸 · 寧靜', 'static'],
  ['02-2', '近景 · 夏娃的手與果子', '緩推到果子', '光聚在果子上', '誘惑 · 緊張', 'push'],
  ['02-3', '同一構圖（不切）', '不動，讓碎裂成為事件', '白光一閃，裂縫透光', '第一道裂痕 · 震驚', 'static'],
  ['02-4', '中景', '固定', '光離開，人物凍結在暗處', '逐出 · 失落', 'static'],
  ['03-1', '全景', '橫移 →', '冷藍晨光', '洪水 · 壓迫', 'panR'],
  ['03-2', '中景 · 方舟', '固定', '藍玻璃沿鉛條一格格上漲', '洶湧', 'static'],
  ['03-3', '挪亞近景', '緩推', '鴿子飛回他手中', '盼望', 'push'],
  ['03-4', '窗面 → 地面', '下搖', '正午陽光', '轉折', 'tiltD'],
  ['03-5', '俯拍地板', '緩推', '彩虹投在石板上', '立約 · 安慰', 'push'],
  ['04-1', '仰拍 · 亞伯拉罕', '緩慢上搖', '月光', '渺小', 'tiltU'],
  ['04-2', '滿窗星', '緩慢拉遠', '星 = 透光的針孔', '數算眾星 · 敬畏', 'pull'],
  ['05-1', '全景', '右移 →', '夜 · 火柱照亮（出 14:20）', '出埃及 · 逼近', 'panR'],
  ['05-2', '中景 · 摩西舉杖', '固定', '頭上光芒亮起', '權柄', 'static'],
  ['05-3', '大全景', '緩慢拉遠', '海沿鉛條分開，火柱自發光', '神蹟', 'pull'],
  ['06-1', '仰拍 · 歌利亞', '緩推', '頂光壓下', '恐懼', 'push'],
  ['06-2', '大衛小小的身影', '快速甩鏡 ←', '逆光', '勇氣', 'whip'],
  ['06-3', '歌利亞中景', '固定', '石中 → 裂縫貫穿巨人，靜音', '逆轉', 'static'],
  ['07-1', '夜 · 大全景', '固定', '只有月光', '應許 · 寂靜', 'static'],
  ['07-2', '近景 · 裂縫', '逐格橫移 →', '新鉛焊上，火花落在節拍', '修復', 'panR'],
  ['07-3', '那盞燈的窗', '緩推', '窗自己發光', '希望', 'push'],
  ['07-4', '回到 01 的全景', '拉遠', '淡藍晨光再照第一格', '首尾呼應', 'pull'],
];
const CHAPTERS = [['01', '起初 Genesis'], ['02', '伊甸 Eden'], ['03', '洪水 Flood'], ['04', '亞伯拉罕 Abraham'], ['05', '出埃及 Exodus'], ['06', '大衛 David'], ['07', '應許 Promise']];

window.CLIP = {
  id: 'board',
  duration: SHOTS.length,
  uses: ['_glass'],
  nosub: true,
  timing: { fadeIn: [-1, -.9], fade: [SHOTS.length, SHOTS.length + .01] },
  SHOTS, CHAPTERS,
  glyphs: SHOTS.map((s) => s.slice(1, 5).join('')).join('') + CHAPTERS.map((c) => c[1]).join('') + '光之窗分鏡圖鏡頭景別運光畫面情緒章' +
    '7章24鏡頭約每個只有一運鏡主要動作縮略圖由真實引擎渲染打角色玻璃均為成片效果標記虛線框向內箭頭推外拉長橫移搖十字固定雙甩',

  state(t, E) {
    const i = Math.min(SHOTS.length - 1, Math.floor(t)), [id, , , , , move] = SHOTS[i];
    const st = this.shot(id, E);
    st.overlay = (O) => this.mark(O, move);
    return st;
  },

  light(E, k, o) { return window.GX.light(E, k, o); },
  fig(E, P, cx, base, who, pose, x, s, flip) { window.GX.fig(E, P, cx, base, who, pose, x, s, flip); },
  bg(E, P, cx, col, id) { window.GX.bg(E, P, cx, col, id); },
  garden(E, P, cx, id) { window.GX.garden(E, P, cx, id); },

  // ---------- pane painters ----------
  stars(E, P, cx, id, n = 18) {
    const r = E.mulberry(id);
    for (let k = 0; k < n; k++) window.GX.star(E, P, cx - 120 + r() * 240, -260 + r() * 640, 5 + r() * 8, id + 1 + k);
  },
  sea(E, P, cx, id) {   // the Red Sea standing as two walls, a dry path between
    const { COL, smooth } = E;
    P.piece(smooth([[cx - 150, 640, 1], [cx - 150, 60, 1], [cx - 90, 40], [cx - 60, 200], [cx - 70, 420], [cx - 40, 640, 1]]), COL.cobalt, { id: id + 1, lead: 5.5, matW: 14 });
    P.piece(smooth([[cx + 150, 640, 1], [cx + 150, 60, 1], [cx + 90, 40], [cx + 60, 200], [cx + 70, 420], [cx + 40, 640, 1]]), COL.blue2, { id: id + 2, lead: 5.5, matW: 14 });
    P.piece(smooth([[cx - 40, 640, 1], [cx - 20, 300], [cx + 20, 300], [cx + 40, 640, 1]]), COL.gold, { id: id + 3, lead: 5, matW: 8 });
  },
  fire(E, P, cx, id) {
    const { COL, smooth } = E;
    P.piece(smooth([[cx - 40, 620, 1], [cx - 50, 300], [cx - 20, 60], [cx, -150], [cx + 22, 60], [cx + 50, 300], [cx + 40, 620, 1]]), COL.amber, { id: id + 1, lead: 5, mat: false, flat: true });
    P.piece(smooth([[cx - 16, 600, 1], [cx - 20, 300], [cx, 60], [cx + 20, 300], [cx + 16, 600, 1]]), COL.gold2, { id: id + 2, lead: 4, mat: false, flat: true });
  },

  // ---------- windows per chapter ----------
  panes(E, ch, o = {}) {
    const { COL, roundel, sunDisc, tree, dove } = E, GX = window.GX, self = this;
    const glass = GX.glass(E, ch === 'rainbow' ? 'flood' : ch);
    const pane = (fn) => ({ glass, content: (P, cx, base) => { fn(P, cx, base); P.setTransform(base); if (o.cracks && crackAt[ch]) { const q = crackAt[ch](cx); if (q) GX.drawCracks(E, P, GX.cracks(E, cx, q[0], q[1], q[2]), 1, o.cracks === 'mended'); } } });
    // where each chapter's glass cracks (drawn after the pane's figures, in world space); null = no crack in that pane
    const { LX } = E, crackAt = {
      eden: (cx) => cx === LX[2] ? [cx - 80, 400, 31] : null,
      david: (cx) => cx === LX[3] ? [cx + 20, 170, 55] : null,
      promise: (cx) => cx === LX[3] ? null : [cx + [-30, 20, 0][LX.indexOf(cx)], [180, 150, 250][LX.indexOf(cx)], [31, 37, 57][LX.indexOf(cx)]],
    };
    if (ch === 'genesis') return [
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.sky, 6000); sunDisc(P, cx, -150, 30, COL.gold2, 6030, 12); self.stars(E, P, cx, 6100, 8); }),
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.deepblue, 6200); dove(P, cx, -150, 1, 6230); GX.waves(E, P, cx, 430, 0, 6300); }),
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.sky, 6400); self.garden(E, P, cx, 6500); tree(P, cx - 60, 510, 1, 6520); tree(P, cx + 60, 520, .85, 6524); }),
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.purple, 6600); dove(P, cx - 30, -170, 0, 6630); dove(P, cx + 30, -128, 1, 6634); GX.waves(E, P, cx, 480, 2, 6700); }),
    ];
    if (ch === 'eden') return [
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.sky, 7000); sunDisc(P, cx, -150, 28, COL.gold2, 7030); self.garden(E, P, cx, 7100); tree(P, cx - 50, 520, 1.2, 7120); tree(P, cx + 60, 530, 1, 7124); }),
      pane((P, cx, b) => { roundel(P, cx, -150, 78, COL.sky, 7200); self.garden(E, P, cx, 7210); self.fig(E, P, cx, b, 'adam', 'stand', -10, .8); }),
      pane((P, cx, b) => { roundel(P, cx, -150, 78, COL.sky, 7400); self.garden(E, P, cx, 7410); GX.bigTree(E, P, cx + 55, 600, .8, 7420); GX.serpent(E, P, cx + 55, 470, .9, 7440); self.fig(E, P, cx, b, 'eve', 'offer', -40, .8, true); }),
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.purple, 7600); self.garden(E, P, cx, 7610); tree(P, cx, 520, 1.3, 7620); }),
    ];
    if (ch === 'flood' || ch === 'rainbow') {
      const rb = ch === 'rainbow';
      return [0, 1, 2, 3].map((k) => pane((P, cx, b) => {
        if (rb) self.bg(E, P, cx, k % 2 ? COL.blue2 : COL.cobalt, 7700 + k);
        if (rb || k === 3) GX.rainbow(E, P, 0, 420, 520, 34, 7710 + k * 10);
        if (!rb && k === 0) for (let j = 0; j < 14; j++) E.brush(P.g, [[cx - 130 + j * 19, -300 + (j % 3) * 40], [cx - 150 + j * 19, 20 + (j % 4) * 50]], 1.4, { color: 'rgba(200,220,255,.5)' });
        if (k === 2 && !rb) { E.hills(P, cx, 560, [{ y: 0, a: 20, ph: 1, c: COL.olive }], 7790); self.fig(E, P, cx, b, 'noah', 'pray', -10, .8); }
        else GX.waves(E, P, cx, rb ? 470 : [330, 430, 0, 500][k], k * 1.3, 7750 + k * 10);
        if (k === 1) GX.ark(E, P, cx, rb ? 470 : 430, 1, 7800);
      }));
    }
    if (ch === 'abraham') return [0, 1, 2, 3].map((k) => pane((P, cx, b) => {
      self.stars(E, P, cx, 8000 + k * 40, 22);
      E.hills(P, cx, 560, [{ y: 0, a: 10, ph: k, c: COL.purple2 }], 8200 + k);
      if (k === 1) self.fig(E, P, cx, b, 'abraham', 'lookUp', 0, .85);
    }));
    if (ch === 'exodus') return [
      pane((P, cx) => self.fire(E, P, cx, 8300)),
      pane((P, cx, b) => { E.hills(P, cx, 560, [{ y: 0, a: 8, ph: 1, c: COL.gold }], 8410); self.fig(E, P, cx, b, 'moses', 'raiseStaff', -10, .72); }),
      pane((P, cx) => self.sea(E, P, cx, 8500)),
      pane((P, cx) => self.sea(E, P, cx, 8600)),
    ];
    if (ch === 'david') return [
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.sky, 8700); E.hills(P, cx, 520, [{ y: 0, a: 14, ph: 1, c: COL.olive }, { y: 50, a: 8, ph: 3, c: COL.brown }], 8710); }),
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.sky, 8800); E.hills(P, cx, 520, [{ y: 0, a: 14, ph: 2, c: COL.olive }, { y: 50, a: 8, ph: 4, c: COL.brown }], 8810); }),
      pane((P, cx, b) => { roundel(P, cx, -150, 78, COL.sky, 8900); E.hills(P, cx, 540, [{ y: 0, a: 10, ph: 3, c: COL.olive }], 8910); self.fig(E, P, cx, b, 'david', 'sling', -20, .55); }),
      pane((P, cx, b) => { roundel(P, cx, -150, 78, COL.ruby, 9000); E.hills(P, cx, 560, [{ y: 0, a: 8, ph: 1, c: COL.brown }], 9010);
        E.drawGoliath(P, b.translate(cx + 10, 604 - 182).scale(-1, 1), { ...E.POSE.guard, wF: 40 * D }); }),
    ];
    if (ch === 'promise') return [
      pane((P, cx) => { self.garden(E, P, cx, 9110); GX.bigTree(E, P, cx, 600, .8, 9120, 0); }),
      pane((P, cx) => { GX.waves(E, P, cx, 480, 1, 9210); GX.ark(E, P, cx, 480, 1, 9230); }),
      pane((P, cx) => { self.sea(E, P, cx, 9300); }),
      pane((P, cx) => { roundel(P, cx, -150, 78, COL.deepblue, 9400); for (let k = 0; k < 6; k++) GX.star(E, P, cx + Math.cos(k * 1.05) * 50, -150 + Math.sin(k * 1.05) * 50, 8, 9410 + k);
        P.piece(E.smooth([[cx - 40, 420, 1], [cx + 40, 420, 1], [cx + 26, 380], [cx - 26, 380]]), COL.gold, { id: 9450, lead: 4.5, matW: 6 });
        P.piece(E.smooth([[cx, 300], [cx + 18, 350], [cx, 378], [cx - 18, 350]]), COL.amber, { id: 9451, lead: 3.4, mat: false });
        E.hills(P, cx, 540, [{ y: 0, a: 10, ph: 2, c: COL.green2 }, { y: 40, a: 8, ph: 4, c: COL.brown }], 9460); }),
    ];
    return [];
  },

  // ---------- shots ----------
  shot(id, E) {
    const { LX, ROSE } = E, L = (k, o) => this.light(E, k, o), W = [0, 300, .5];
    const flash = (x, y) => [[x, y, 110, 3.2, [1, .96, .85]]];
    switch (id) {
      case '01-1': return L('dawn', { cam: [0, ROSE.y, 2.6], sunI: 0, roseI: 1.5, amb: .02, rose: { lit: (q) => q.petal < 0 ? 1 : .03 }, lancets: this.panes(E, 'genesis') });
      case '01-2': return L('dawn', { cam: [0, ROSE.y + 20, 1.45], sunI: 0, roseI: 1.4, amb: .04, lancets: this.panes(E, 'genesis') });
      case '01-3': return L('dawn', { cam: W, sx: .2, sz: 1.35, lancets: this.panes(E, 'genesis'), inscription: [['光之窗 · WINDOWS OF LIGHT', 60, 0]], gild: .18, sweep: [0, 700, .55, 806] });
      case '02-1': return L('aft', { cam: [0, 400, 1.8], lancets: this.panes(E, 'eden') });
      case '02-2': return L('aft', { cam: [95, 400, 2.8], lancets: this.panes(E, 'eden'), pts: [[88, 404, 40, 1.4, [1, .8, .5]]] });
      case '02-3': return L('aft', { cam: [0, 400, 1.8], lancets: this.panes(E, 'eden', { cracks: 'open' }), pts: flash(LX[2] - 80, 400) });
      case '02-4': return L('aft', { cam: [0, 400, 1.8], sunU: LX[0] - 60, bandW: 330, lancets: this.panes(E, 'eden', { cracks: 'open' }) });
      case '03-1': return L('dawn', { cam: [-300, 250, .8], lancets: this.panes(E, 'flood') });
      case '03-2': return L('dawn', { cam: [LX[1], 380, 1.6], lancets: this.panes(E, 'flood') });
      case '03-3': return L('dawn', { cam: [LX[2], 360, 1.8], lancets: this.panes(E, 'flood') });
      case '03-4': return L('noon', { cam: [0, 640, .62], sz: .9, sx: .05, lancets: this.panes(E, 'rainbow') });
      case '03-5': return L('noon', { cam: [0, 250, 1], sx: .05, sz: .9, amb: .1, floorMode: 2, topCam: [0, 700, .75], pm: [-1000, 150, 2000, 1250], pmBlur: 2, patchK: 1.9, bloom: .65, thr: .45, vign: .5, lancets: this.panes(E, 'rainbow') });
      case '04-1': return L('night', { cam: [LX[1], 420, 1.5], sunI: 1.5, skyI: .12, lancets: this.panes(E, 'abraham') });
      case '04-2': return L('night', { cam: [0, 200, .55], sunI: 1.5, skyI: .12, lancets: this.panes(E, 'abraham') });
      case '05-1': return L('night', { sunI: 1.2, cam: [-200, 260, .75], lancets: this.panes(E, 'exodus'), pts: [[LX[0], 250, 170, 3.2, [1, .6, .25]]] });
      case '05-2': return L('night', { sunI: 1.2, cam: [LX[1], 330, 1.6], lancets: this.panes(E, 'exodus'), pts: [[LX[1] - 5, 300, 60, 2.4, [1, .9, .6]], [LX[0], 250, 170, 3.2, [1, .6, .25]]] });
      case '05-3': return L('night', { sunI: 1.2, cam: [0, 280, .55], lancets: this.panes(E, 'exodus'), pts: [[LX[0], 250, 170, 3.2, [1, .6, .25]]] });
      case '06-1': return L('aft', { cam: [LX[3], 260, 1.45], sunU: LX[3], bandW: 330, lancets: this.panes(E, 'david') });
      case '06-2': return L('aft', { cam: [LX[2], 470, 2.0], sunU: LX[2], bandW: 330, lancets: this.panes(E, 'david') });
      case '06-3': return L('aft', { cam: [LX[3], 260, 1.45], sunU: LX[3], bandW: 330, lancets: this.panes(E, 'david', { cracks: 'open' }), pts: flash(LX[3] + 20, 170) });
      case '07-1': return L('night', { cam: W, lancets: this.panes(E, 'promise', { cracks: 'mended' }), pts: [[LX[3], 350, 120, 2.6, [1, .6, .25]]], inscription: [['光之窗 · WINDOWS OF LIGHT', 60, 0]], gild: .2 });
      case '07-2': return L('night', { cam: [LX[0], 250, 1.6], lancets: this.panes(E, 'promise', { cracks: 'mended' }), pts: [[LX[0] - 40, 230, 18, 4, [1, .8, .5]], [LX[0] + 10, 300, 14, 3, [1, .8, .5]]] });
      case '07-3': return L('night', { cam: [LX[3], 380, 1.9], lancets: this.panes(E, 'promise', { cracks: 'mended' }), pts: [[LX[3], 350, 120, 3, [1, .6, .25]]] });
      case '07-4': return L('dawn', { cam: W, sunU: LX[0], bandW: 330, sunI: 2.2, lancets: this.panes(E, 'promise', { cracks: 'mended' }), pts: [[LX[3], 350, 120, 1.6, [1, .6, .25]]], inscription: [['光之窗 · WINDOWS OF LIGHT', 60, 0]], gild: .18 });
    }
    return L('night', { cam: W });
  },

  // ---------- camera move marks (screen space, 1920×1080) ----------
  mark(O, move) {
    O.save(); O.lineCap = 'round'; O.lineJoin = 'round';
    const ink = (w) => { O.strokeStyle = 'rgba(0,0,0,.6)'; O.lineWidth = w + 6; O.stroke(); O.strokeStyle = '#ffd98a'; O.lineWidth = w; O.stroke(); };
    const arrow = (x0, y0, x1, y1, w = 7) => { const a = Math.atan2(y1 - y0, x1 - x0), h = 34; O.beginPath(); O.moveTo(x0, y0); O.lineTo(x1, y1);
      O.moveTo(x1 - h * Math.cos(a - .5), y1 - h * Math.sin(a - .5)); O.lineTo(x1, y1); O.lineTo(x1 - h * Math.cos(a + .5), y1 - h * Math.sin(a + .5)); ink(w); };
    const box = (s) => { O.setLineDash([22, 14]); O.beginPath(); O.rect(960 - 960 * s, 540 - 540 * s, 1920 * s, 1080 * s); ink(4); O.setLineDash([]); };
    if (move === 'push') { box(.55); for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) arrow(960 + sx * 900, 540 + sy * 500, 960 + sx * 560, 540 + sy * 318); }
    if (move === 'pull') { box(.55); for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) arrow(960 + sx * 560, 540 + sy * 318, 960 + sx * 880, 540 + sy * 490); }
    if (move === 'panR') arrow(620, 540, 1300, 540, 9);
    if (move === 'tiltD') arrow(960, 300, 960, 800, 9);
    if (move === 'tiltU') arrow(960, 800, 960, 300, 9);
    if (move === 'whip') { arrow(1450, 540, 470, 540, 9); for (const dy of [-60, 60]) { O.beginPath(); O.moveTo(1400, 540 + dy); O.lineTo(900, 540 + dy); ink(3); } }
    if (move === 'static') { O.beginPath(); O.rect(60, 60, 150, 110); ink(4); O.beginPath(); O.moveTo(90, 115); O.lineTo(180, 115); O.moveTo(135, 80); O.lineTo(135, 150); ink(3); }
    O.restore();
  },
};
