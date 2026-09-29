// 08 · 片尾 End card — after the dawn, black: "to be continued — the New Testament": the question the light leaves
// (who is the light that is come?) said out loud. A single glass note, the opening spark's, answers nothing.
window.CLIP = {
  id: '08-end',
  uses: ['_glass'],
  duration: 7,
  timing: { fadeIn: [0, 0.5], fade: [6.2, 7] },
  glyphs: '未完待續下一扇窗新約光之',
  glyphsEn: 'TO BE CONTINUED THE NEXT WINDOW NEW TESTAMENT WINDOWS OF LIGHT ·',
  caps: [],
  sfx: [[1.0, 'glass', { m: 86, v: .7 }]],

  state(t, E) {
    const { ss, seg } = E;
    const st = window.GX.light(E, 'night', { cam: [0, 300, .5], sunI: 0, skyI: .012, roseI: .04, amb: .018, time: t });
    const a = ss(seg(t, .8, 1.8)), b = ss(seg(t, 2.4, 3.4)), c = ss(seg(t, 4.0, 4.8));
    st.overlay = (O) => {
      O.save(); O.setTransform(1, 0, 0, 1, 0, 0); O.textAlign = 'center'; O.textBaseline = 'middle';
      O.shadowColor = 'rgba(255,200,120,.3)'; O.shadowBlur = 24;
      O.globalAlpha = a; O.fillStyle = '#ecd9a8'; O.font = '600 76px "Noto Serif TC"'; O.fillText('未完 · 待續', 960, 430);
      O.font = '600 34px Cinzel'; O.fillStyle = '#d9c28e'; O.fillText('T O   B E   C O N T I N U E D', 960, 510);
      O.shadowBlur = 0; O.globalAlpha = b * .85; O.fillStyle = '#bfae8a';
      O.font = '500 32px "Noto Serif TC"'; O.fillText('下一扇窗 · 新約', 960, 610);
      O.font = '600 22px Cinzel'; O.fillText('THE NEXT WINDOW · THE NEW TESTAMENT', 960, 652);
      O.globalAlpha = c * .55; O.font = '600 18px Cinzel'; O.fillText('光之窗 · WINDOWS OF LIGHT', 960, 900);
      O.restore();
    };
    return st;
  },
};
