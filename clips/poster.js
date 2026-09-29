// poster (dev clip): 01-genesis's wide after "Let there be light" (the whole window, the sun's shafts, FIAT · LVX
// carved), the title set in the dark to the left. Render: node render.mjs poster --silent, then take its first frame.
window.CLIP = {
  id: 'poster',
  uses: ['_glass', '01-genesis', '02-eden'],
  duration: .25,
  timing: { fadeIn: [-1, 0], fade: [.25, .25] },
  glyphs: '光之窗舊約七扇',
  glyphsEn: 'WINDOWS OF LIGHT THE OLD TESTAMENT IN SEVEN WINDOWS',
  caps: [],

  state(t, E) {
    const st = window.CLIPS['01-genesis'].state(12.6, E);
    st.cam = [60, 300, .56];   // the window a little right of centre: room for the title on the left
    st.overlay = (O) => {
      O.save(); O.setTransform(1, 0, 0, 1, 0, 0); O.textAlign = 'center'; O.textBaseline = 'middle';
      O.shadowColor = 'rgba(255,200,120,.4)'; O.shadowBlur = 36; O.fillStyle = '#ecd9a8';
      O.font = '600 120px "Noto Serif TC"'; ['光', '之', '窗'].forEach((c, k) => O.fillText(c, 330, 330 + k * 150));
      O.shadowBlur = 0; O.fillStyle = '#d9c28e'; O.font = '600 30px Cinzel'; O.fillText('WINDOWS OF LIGHT', 330, 790);
      O.fillStyle = '#bfae8a'; O.font = '500 24px "Noto Serif TC"'; O.fillText('舊約 · 七扇窗', 330, 846);
      O.font = '600 16px Cinzel'; O.fillText('THE OLD TESTAMENT IN SEVEN WINDOWS', 330, 882);
      O.restore();
    };
    return st;
  },
};
