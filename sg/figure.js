// bible-story: robed glass figures on the demo knight's skeleton. Same fk(), part shapes, grisaille face and
// piece logic as knight.js; the costume swaps colours and a few pieces (hair / headcloth / beard / long robe /
// staff / sling / fruit). Facing right; mirror with a negative x scale. Pelvis at origin, feet at y≈+182.
import { COL, INK, smooth, circle, ellipse, brush, line } from './glass.js';
import { SH, EXPR, fk, faceGrisaille, folds, hatch, fingers, POSE, drawKnight } from './knight.js';
import { dove } from './window.js';

const D = Math.PI / 180;
export const FPOSE = {
  stand: { ...POSE.stand, wF: 0 },
  walk: { ...POSE.walkA, wF: 0 },
  walkB: { ...POSE.walkB, wF: 0 },
  reach: { ...POSE.stand, sF: -128 * D, eF: -22 * D, neck: -12 * D, face: 'wonder' },
  offer: { ...POSE.stand, sF: -72 * D, eF: -38 * D, neck: 4 * D, face: 'gentle' },
  lookUp: { ...POSE.stand, lean: -4 * D, neck: -26 * D, sF: -30 * D, eF: -74 * D, wF: 10 * D, face: 'wonder' },
  raiseStaff: { ...POSE.raise, wF: 0, neck: -16 * D },
  sling: { ...POSE.guard, sF: -196 * D, eF: -26 * D, wF: 0, sB: -70 * D, eB: -20 * D, face: 'fierce' },
  pray: { ...POSE.kneel, sF: -64 * D, eF: -70 * D, sB: -56 * D, eB: -76 * D, neck: -8 * D, face: 'gentle', sword: undefined },
  weep: { ...POSE.stand, lean: 8 * D, neck: 22 * D, sF: -120 * D, eF: -110 * D, face: 'gentle' },
};

const HAIRLONG = smooth([[-4, -124], [-24, -118], [-36, -76], [-42, -16], [-30, 4], [-20, -30], [-12, -86]]);
const BAND = smooth([[-22, -48], [2, -60], [30, -54], [31, -48], [3, -54], [-21, -42]]);
const beardPath = (L) => smooth([[4, -21], [12, -13], [22, -11], [31, -14], [35, -9], [32, 4 + L * .3], [25, L], [14, L * .86], [4, L * .5], [-3, -4]]);
const LOCK = smooth([[8, -120], [22, -114], [28, -86], [22, -52], [14, -40], [10, -60], [12, -92]]);   // Eve: hair falling in front
const BAG = smooth([[-40, 4], [-18, 2], [-16, 26], [-28, 34], [-42, 26]]);                        // David: shepherd's bag
// Moses: two beams of light from the head (Ex 34:29, "the skin of his face shone"; medieval glass draws them as rays)
const RAY = (x0, y0, x1, y1, w) => smooth([[x0 - w, y0, 1], [x1, y1, 1], [x0 + w, y0, 1]]);
// age: forehead lines, crow's feet, a line from nose to mouth
const aged = (g) => { for (const y of [-49, -45]) brush(g, [[12, y], [20, y - 1.5], [28, y]], 1, { w0: .3, w1: .3, color: 'rgba(44,26,12,.5)' });
  brush(g, [[10, -37], [7, -35]], .9, { color: 'rgba(44,26,12,.5)' }); brush(g, [[10, -33], [7, -30]], .9, { color: 'rgba(44,26,12,.5)' });
  brush(g, [[29, -27], [26, -22], [24, -18]], 1, { w0: .3, w1: .2, color: 'rgba(44,26,12,.45)' }); g.fillStyle = 'rgba(80,44,22,.2)'; g.fill(ellipse(17, -31, 6, 2.4)); };
// Eve: thin high arched brows (scrape the heavy brow back to the glass colour, repaint), a touch of colour on the lips
const feminine = (g, e) => { const bh = e.bh;
  brush(g, [[11.5, -40.5 + bh + e.bo], [17.5, -42.8 + bh], [23.4, -41.4 + bh + e.bi]], 5.2, { w0: .9, w1: .9, color: 'rgba(188,138,108,.92)' });
  brush(g, [[12, -42 + bh], [17.5, -45.5 + bh], [23.5, -43.5 + bh]], 1.5, { w0: .4, w1: .3 });
  g.fillStyle = 'rgba(150,48,50,.3)'; g.fill(ellipse(27.4, -18.4, 3.6, 1.5)); };
const STAFF = smooth([[-3.6, -118, 1], [3.6, -118, 1], [3.6, 150, 1], [-3.6, 150, 1]]);
const CROOK = smooth([[-3.6, -112], [-4, -134], [8, -150], [22, -140], [22, -126, 1], [16, -126, 1], [15, -137], [7, -142], [3, -132], [3.6, -112, 1]]);

// c: { skin, torso, skirt, skirtLen, belt, mantle, sleeve, legs, feet, hair, head: 'hair'|'cloth', cloth, longHair,
//      beard (length, 0 = none), beardCol, item: 'staff'|'crook'|'sling'|'fruit', leaves, id }
export function drawFigure(P, base, p, c = {}) {
  const J = fk(p), e = EXPR[p.face || 'resolute'] || EXPR.resolute, ID = c.id || 200, LW = 6.2;
  const at = (j, sx = 1, sy = sx) => P.setTransform(base.translate(j[0], j[1]).rotate(j[2] * 180 / Math.PI).scale(sx, sy));
  const skin = c.skin || COL.flesh, sleeve = c.sleeve === 'skin' ? skin : (c.sleeve || c.torso || COL.ruby);
  const legs = c.legs === 'skin' ? skin : (c.legs || c.skirt || COL.brown), feet = c.feet === 'skin' ? skin : (c.feet || COL.brown);
  const leafy = (g) => { for (let k = 0; k < 7; k++) brush(g, [[-20 + k * 7, -2 + (k % 2) * 8], [-16 + k * 7, 26 + (k % 3) * 10], [-19 + k * 7, 40]], 1.6, { color: 'rgba(20,40,14,.55)' }); };
  // behind: mantle (the knight's cloak), long hair
  if (c.mantle) {
    at(J.cloak);
    P.piece(SH.cloak, c.mantle, { id: ID + 1, lead: LW, wash: .45, shade: [-70, 0, -10, 0, .45], paint: g => { folds(g, [[[-30, -60], [-38, 30], [-46, 132]], [[-22, -40], [-28, 50], [-36, 136]], [[-44, -20], [-54, 70], [-62, 138]]], 2.6, true); hatch(g, -72, 60, -48, 146); } });
    P.piece(SH.cloakEdge, c.mantleEdge || COL.gold, { id: ID + 40, lead: LW * .7, mat: false });
  }
  if (c.longHair) { at(J.torso); P.piece(HAIRLONG, c.hair, { id: ID + 45, lead: LW * .8, matW: 8, paint: g => { for (let k = 0; k < 5; k++) brush(g, [[-10 - k * 4, -110], [-22 - k * 3, -60], [-24 - k * 2, -8]], 1.4, { color: 'rgba(60,34,10,.55)' }); } }); }
  // far arm
  at(J.upB); P.piece(SH.upper, sleeve, { id: ID + 2, lead: LW, wash: .3, paint: g => folds(g, [[[-4, 6], [-2, 30], [-5, 54]]], 1.8) });
  at(J.foB); P.piece(SH.fore, sleeve, { id: ID + 3, lead: LW, wash: .3 });
  at(J.haB, 1.15); P.piece(SH.fist, skin, { id: ID + 4, lead: LW * .8, matW: 5, paint: fingers });
  // legs
  for (const [s, k] of [['B', 0], ['F', 1]]) {
    at(J['th' + s]); P.piece(SH.thigh, legs, { id: ID + 5 + k * 3, lead: LW, shade: [-13, 0, 13, 0, .3] });
    at(J['sh' + s]); P.piece(SH.shin, legs, { id: ID + 6 + k * 3, lead: LW, shade: [-10, 0, 10, 0, .3] });
    at(J['ft' + s]); P.piece(SH.foot, feet, { id: ID + 7 + k * 3, lead: LW, paint: g => brush(g, [[-2, -2], [8, 4], [18, 8]], 1.3, { color: 'rgba(44,26,12,.5)' }) });
  }
  // skirt / robe (scaled down to the ankles for a long robe)
  const sy = c.skirtLen ?? 1, skirt = c.skirt || c.torso || COL.ruby;
  at(J.skirt, 1, sy);
  P.piece(SH.skirtB, skirt, { id: ID + 12, lead: LW, wash: .4, shade: [-50, 0, 5, 0, .4], paint: g => { if (c.leaves) return leafy(g); folds(g, [[[-6, 10], [-8, 60], [-10, 106]], [[-18, 12], [-24, 60], [-27, 104]], [[-28, 20], [-38, 70], [-44, 106]]], 2.5, true); } });
  P.piece(SH.skirtF, skirt, { id: ID + 13, lead: LW, wash: .35, shade: [5, 0, 45, 0, .2], paint: g => { if (c.leaves) return leafy(g); folds(g, [[[14, 10], [20, 60], [24, 100]], [[24, 20], [32, 64], [38, 98]]], 2.5, true); } });
  if (c.hem !== false) { P.piece(SH.hemB, c.hem || COL.gold, { id: ID + 41, lead: LW * .7, mat: false }); P.piece(SH.hemF, c.hem || COL.gold, { id: ID + 42, lead: LW * .7, mat: false }); }
  if (c.bag) { P.piece(BAG, c.bag, { id: ID + 48, lead: LW * .8, matW: 6, paint: g => brush(g, [[-38, 8], [-28, 12], [-18, 8]], 1.4, { color: 'rgba(44,26,12,.6)' }) }); }
  // torso
  at(J.torso);
  const torso = c.torso || COL.ruby;
  P.piece(SH.torso, torso, { id: ID + 14, lead: LW, wash: torso === skin ? .2 : .4, shade: [-30, 0, 20, 0, .4], paint: g => { if (torso === skin) { brush(g, [[-12, -80], [2, -74], [16, -80]], 1.6, { color: 'rgba(80,44,22,.45)' }); return; } if (c.leaves) return leafy(g); folds(g, [[[-14, -20], [-18, -60], [-12, -96]], [[6, -24], [10, -60], [8, -90]], [[-24, -26], [-2, -38], [22, -26]]], 2.3, true); hatch(g, -32, -90, -18, -20); } });
  if (c.belt) P.piece(SH.belt, c.belt, { id: ID + 15, lead: LW * .8, mat: false });
  if (c.bag) { const st = new Path2D(); st.moveTo(20, -104); st.lineTo(-24, -2); P.lead(st, 3.4); }
  if (c.collar !== false && torso !== skin) P.piece(SH.neck, c.collar || COL.gold, { id: ID + 43, lead: LW * .7, mat: false });
  // head: hair cap or headcloth (the knight's coif shape), face, beard
  at(J.head, 1.16);
  if (c.head === 'cloth') {
    P.piece(SH.coif, c.cloth || COL.white, { id: ID + 17, lead: LW / 1.16, shade: [-25, 0, 20, 0, .42], paint: g => folds(g, [[[-8, -60], [-18, -30], [-16, 2]], [[4, -62], [-6, -34], [-6, -4]]], 1.8, true) });
    P.piece(BAND, c.band || COL.gold, { id: ID + 46, lead: LW * .6, mat: false });
  } else {
    P.piece(SH.coif, c.hair || COL.brown, { id: ID + 17, lead: LW / 1.16, shade: [-25, 0, 20, 0, .42], paint: g => { for (let k = 0; k < 6; k++) brush(g, [[-2 + k * 4, -64], [-14 + k * 3, -34], [-14 + k * 3, -2]], 1.5, { color: 'rgba(50,28,10,.5)' }); } });
  }
  P.piece(SH.face, skin, { id: ID + 18, vary: .04, lead: LW * .75, matW: 5, matA: .9, paint: g => { faceGrisaille(g, e); if (c.old) aged(g); if (c.fem) feminine(g, e); } });
  if (c.rays) { P.piece(RAY(2, -62, -12, -126, 7.5), COL.gold2, { id: ID + 49, lead: 3.4, mat: false }); P.piece(RAY(18, -60, 36, -122, 7.5), COL.gold2, { id: ID + 50, lead: 3.4, mat: false }); }
  if (c.beard) {
    P.piece(beardPath(c.beard), c.beardCol || c.hair || COL.white, { id: ID + 47, lead: LW * .6, matW: 5, paint: g => { for (let k = 0; k < 5; k++) brush(g, [[8 + k * 5, -10], [9 + k * 4.5, c.beard * .5], [8 + k * 4, c.beard * .85]], 1.2, { color: 'rgba(60,40,20,.5)' }); brush(g, [[21, -20.5], [27, -22.5], [34, -19.5]], 2.8, { w0: .3, w1: .3 }); } });
  }
  // item in the near hand (rides on the sword joint, so pose.wF tilts it)
  if (c.item === 'staff' || c.item === 'crook') {
    at(J.sword);
    P.piece(STAFF, c.staffCol || COL.brown, { id: ID + 22, lead: LW * .7, mat: false, paint: g => line(g, [[0, -110], [0, 146]], 1, 'rgba(44,26,12,.45)') });
    if (c.item === 'crook') P.piece(CROOK, c.staffCol || COL.brown, { id: ID + 23, lead: LW * .7, mat: false });
  }
  at(J.upF); P.piece(SH.upper, sleeve, { id: ID + 26, lead: LW, wash: .3, shade: [-12, 0, 12, 0, .3], paint: g => folds(g, [[[4, 6], [2, 30], [5, 54]]], 1.8) });
  at(J.foF); P.piece(SH.fore, sleeve, { id: ID + 27, lead: LW, wash: .3, shade: [-10, 0, 10, 0, .3] });
  at(J.haF, 1.15);
  if (c.item === 'sling') {   // two cords (lead lines) hanging to a pouch with the stone
    const cord = new Path2D(); cord.moveTo(2, 14); cord.quadraticCurveTo(-12, 44, -4, 70); cord.moveTo(6, 16); cord.quadraticCurveTo(14, 46, 6, 72); P.lead(cord, 2.4);
    P.piece(ellipse(1, 74, 9, 6), COL.brown, { id: ID + 24, lead: 3, mat: false }); P.piece(circle(1, 70, 4.5), COL.steel2, { id: ID + 25, lead: 2.4, mat: false });
  }
  P.piece(SH.fist, skin, { id: ID + 28, lead: LW * .8, matW: 5, paint: fingers }); P.piece(SH.thumb, skin, { id: ID + 44, lead: LW * .6, mat: false });
  if (c.item === 'dove') { P.setTransform(base.translate(J.haF[0], J.haF[1]).translate(-2, -30).scale(1.5)); dove(P, 0, 0, 1, ID + 60); }
  if (c.item === 'fruit') P.piece(circle(8, -8, 9), COL.ruby, { id: ID + 29, lead: 3.4, matW: 4, paint: g => brush(g, [[8, -17], [11, -21]], 1.4, { color: 'rgba(30,40,10,.8)' }) });
  if (c.longHair) { at(J.torso); P.piece(LOCK, c.hair, { id: ID + 51, lead: LW * .6, matW: 5, paint: g => { brush(g, [[14, -110], [18, -84], [12, -56]], 1.2, { color: 'rgba(60,34,10,.55)' }); } }); }
  return J;
}

// Goliath: the demo knight, armed as 1 Sam 17:5–7 — helmet of brass, a spear "like a weaver's beam", no sword
const HELM = smooth([[-26, -38, 1], [-22, -62], [0, -92, 1], [24, -64], [32, -40, 1], [30, -34, 1], [-26, -32, 1]]);
const NASAL = smooth([[22, -40, 1], [27, -40, 1], [27, -20, 1], [22, -20, 1]]);
const SPEAR = smooth([[-5, -250, 1], [5, -250, 1], [5, 170, 1], [-5, 170, 1]]), TIP = smooth([[-9, -250, 1], [0, -300, 1], [9, -250, 1]]);
export function drawGoliath(P, base, p, id = 700) {
  const J = drawKnight(P, base, { ...p, face: 'fierce' }, { id, noSword: true });
  P.setTransform(base.translate(J.head[0], J.head[1]).rotate(J.head[2] * 180 / Math.PI).scale(1.16));
  P.piece(HELM, COL.gold, { id: id + 80, lead: 5, matW: 8, paint: g => { brush(g, [[-24, -40], [2, -44], [30, -38]], 2.2, { color: 'rgba(60,34,10,.6)' }); brush(g, [[-6, -80], [-12, -56]], 1.4, { color: 'rgba(255,240,200,.5)' }); } });
  P.setTransform(base.translate(J.haF[0], J.haF[1]).rotate((J.haF[2] + (p.wF || 0)) * 180 / Math.PI));
  P.piece(SPEAR, COL.brown, { id: id + 82, lead: 5, mat: false, paint: g => line(g, [[0, -240], [0, 160]], 1.2, 'rgba(44,26,12,.5)') });
  P.piece(TIP, COL.steel, { id: id + 83, lead: 4, mat: false });
  return J;
}

// the cast (costumes) — locked once the cast sheet is approved
export const CAST = {
  adam: { id: 300, torso: COL.flesh, skirt: COL.green, skirtLen: .56, leaves: true, hem: false, sleeve: 'skin', legs: 'skin', feet: 'skin', hair: COL.brown, beard: 6, beardCol: COL.brown },
  eve: { id: 360, fem: true, torso: COL.green2, skirt: COL.green2, skirtLen: .82, leaves: true, hem: false, collar: false, sleeve: 'skin', legs: 'skin', feet: 'skin', hair: COL.gold2, longHair: true, item: 'fruit' },
  noah: { id: 420, torso: COL.brown, skirt: COL.brown, skirtLen: 1.5, belt: COL.gold, mantle: COL.cobalt, sleeve: COL.brown, hair: COL.white, head: 'hair', beard: 38, beardCol: COL.white, item: 'dove', old: true },
  abraham: { id: 480, torso: COL.purple, skirt: COL.purple, skirtLen: 1.5, belt: COL.gold, mantle: COL.gold, mantleEdge: COL.ruby, sleeve: COL.purple, head: 'cloth', cloth: COL.white, band: COL.ruby, beard: 30, beardCol: COL.white, item: 'crook', old: true },
  moses: { id: 540, torso: COL.ruby, skirt: COL.ruby, skirtLen: 1.5, belt: COL.gold, mantle: COL.cobalt, sleeve: COL.ruby, hair: '#6a4a2a', head: 'hair', beard: 34, beardCol: COL.steel, item: 'staff', rays: true, old: true },
  david: { id: 600, torso: COL.sky, skirt: COL.sky, skirtLen: .62, belt: COL.brown, sleeve: 'skin', legs: 'skin', hair: '#b8541c', item: 'sling', bag: COL.brown },
};
