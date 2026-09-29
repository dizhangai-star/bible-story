// 00 · 片頭 Opening card — the title in the dark hall, then the first window's name on the banderole; 01 follows from
// black (its spark). Text on the overlay (screen units 1920×1080), faded with the scene.
window.CLIP = {
  id: '00-title',
  uses: ['_glass'],
  duration: 7.2,
  timing: { fadeIn: [0, 0.4], fade: [6.9, 7.2] },
  glyphs: '光之窗舊約七扇',
  glyphsEn: 'WINDOWS OF LIGHT THE OLD TESTAMENT IN SEVEN WINDOWS ·',
  caps: [[5.0, 6.9, 'The First Window · In the Beginning', '第一扇窗 · 起初']],
  sfx: [[0.9, 'glass', { m: 86, v: .5 }], [0.9, 'air', { d: 3.0, v: .4 }]],

  state(t, E) {
    const { ss, seg } = E;
    const st = window.GX.light(E, 'night', { cam: [0, 300, .5], sunI: 0, skyI: .012, roseI: .04, amb: .018, time: t });
    const a = ss(seg(t, .6, 1.8)) * (1 - ss(seg(t, 4.0, 4.9)));   // the title
    const b = ss(seg(t, 1.6, 2.6)) * (1 - ss(seg(t, 4.0, 4.9)));   // the line under it
    st.overlay = (O) => {
      if (a <= 0) return;
      O.save(); O.setTransform(1, 0, 0, 1, 0, 0); O.textAlign = 'center'; O.textBaseline = 'middle';
      O.shadowColor = 'rgba(255,200,120,.35)'; O.shadowBlur = 30;
      O.globalAlpha = a; O.fillStyle = '#ecd9a8'; O.font = '600 132px "Noto Serif TC"'; O.fillText('光 之 窗', 960, 440);
      O.font = '600 46px Cinzel'; O.fillStyle = '#d9c28e'; O.fillText('W I N D O W S   O F   L I G H T', 960, 560);
      O.shadowBlur = 0; O.globalAlpha = b * .8; O.fillStyle = '#bfae8a';
      O.font = '500 30px "Noto Serif TC"'; O.fillText('舊約 · 七扇窗', 960, 650);
      O.font = '600 22px Cinzel'; O.fillText('THE OLD TESTAMENT IN SEVEN WINDOWS', 960, 694);
      O.restore();
    };
    return st;
  },
};
