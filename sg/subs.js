// Subtitles as a parchment banderole (scroll ribbon) that unfurls from the centre.
import { clamp, ss, seg } from './lib.js';
export function drawBanderole(O, subs, t) {
  const s = subs.find(q => t >= q.t0 - .05 && t < q.t1 + .3); if (!s) return;
  const open = ss(seg(t, s.t0 - .05, s.t0 + .28)), close = 1 - ss(seg(t, s.t1, s.t1 + .28)), k = Math.min(open, close);
  if (k <= 0) return;
  // bible-story: "中文\nEnglish" → two lines (繁體 in Noto Serif TC above, English in IM Fell English below)
  const lines = s.text.split('\n'), two = lines.length > 1;
  const FZ = '500 38px "Noto Serif TC"', FE = two ? 'italic 31px "IM Fell English"' : '44px "IM Fell English"';
  O.save(); O.font = FE; let tw = O.measureText(lines[lines.length - 1]).width;
  if (two) { O.font = FZ; tw = Math.max(tw, O.measureText(lines[0]).width); }
  const W = (tw + 150) * (.25 + .75 * k), H = two ? 100 : 64, cx = 960, cy = two ? 950 : 968;
  const x0 = cx - W / 2, x1 = cx + W / 2, sag = 7;
  O.globalAlpha = clamp(k * 1.4);
  // curled ends (behind): darker folded parchment
  const end = (x, dir) => { O.fillStyle = '#b39a6c'; O.beginPath(); O.moveTo(x, cy - H / 2 + 6); O.lineTo(x + dir * 34, cy - H / 2 + 14); O.lineTo(x + dir * 20, cy); O.lineTo(x + dir * 34, cy + H / 2 + 10); O.lineTo(x, cy + H / 2 + 2); O.closePath(); O.fill();
    O.fillStyle = '#8c7348'; O.beginPath(); O.ellipse(x + dir * 2, cy + 4, 6, H / 2 - 2, 0, 0, 7); O.fill(); };
  end(x0 + 4, -1); end(x1 - 4, 1);
  // ribbon body with a gentle sag
  O.shadowColor = 'rgba(0,0,0,.45)'; O.shadowBlur = 14; O.shadowOffsetY = 4;
  O.beginPath(); O.moveTo(x0, cy - H / 2); O.quadraticCurveTo(cx, cy - H / 2 + sag, x1, cy - H / 2); O.lineTo(x1, cy + H / 2); O.quadraticCurveTo(cx, cy + H / 2 + sag, x0, cy + H / 2); O.closePath();
  const gr = O.createLinearGradient(0, cy - H / 2, 0, cy + H / 2); gr.addColorStop(0, '#f3e6c6'); gr.addColorStop(.5, '#ecdcb6'); gr.addColorStop(1, '#d9c497');
  O.fillStyle = gr; O.fill(); O.shadowColor = 'transparent';
  O.strokeStyle = 'rgba(110,80,40,.55)'; O.lineWidth = 1.5; O.stroke();
  O.strokeStyle = 'rgba(140,40,30,.5)'; O.lineWidth = 1.2; O.beginPath(); O.moveTo(x0 + 10, cy - H / 2 + 7); O.quadraticCurveTo(cx, cy - H / 2 + sag + 7, x1 - 10, cy - H / 2 + 7); O.moveTo(x0 + 10, cy + H / 2 - 6); O.quadraticCurveTo(cx, cy + H / 2 + sag - 6, x1 - 10, cy + H / 2 - 6); O.stroke();
  // text (clipped while unfurling)
  O.save(); O.beginPath(); O.rect(x0 + 8, cy - H, W - 16, H * 2); O.clip();
  O.globalAlpha = clamp((k - .75) / .25);   // text appears only once the ribbon is (almost) fully open
  O.fillStyle = '#3a2412'; O.textAlign = 'center'; O.textBaseline = 'middle';
  if (two) { O.font = FZ; O.fillText(lines[0], cx, cy - 16); O.font = FE; O.fillStyle = '#5a3a1e'; O.fillText(lines[1], cx, cy + 27); }
  else O.fillText(s.text, cx, cy + 5);
  O.restore(); O.restore();
}
