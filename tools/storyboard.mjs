// One-page storyboard: renders every shot of clips/board.js with the real engine and lays them out by chapter,
// with the shot notes under each thumbnail. Usage (in the film folder): node tools/storyboard.mjs → docs/storyboard.png
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { chrome, engineUrl, rel } from '../../_kit/lib/film.mjs';
const puppeteer = createRequire(new URL('../../_kit/package.json', import.meta.url))('puppeteer-core');   // the kit's copy

const browser = await puppeteer.launch({ executablePath: chrome(), headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(engineUrl('board'));
await page.waitForFunction('window.sceneReady === true', { timeout: 60000 });
const png = await page.evaluate(async () => {
  const A = window.CLIP, S = A.SHOTS, CH = A.CHAPTERS;
  const TW = 336, TH = 189, CW = 350, X0 = 170, HEAD = 128, RH = TH + 118, W = 1920, H = HEAD + CH.length * RH + 20;
  const g = document.createElement('canvas'); g.width = W; g.height = H; const c = g.getContext('2d');
  c.fillStyle = '#16140f'; c.fillRect(0, 0, W, H);
  const zh = (s, w = 500) => `${w} ${s}px "Noto Serif TC", Cinzel`;
  c.fillStyle = '#efe2c4'; c.font = '700 34px Cinzel, "Noto Serif TC"'; c.fillText('光之窗 · WINDOWS OF LIGHT — 分鏡圖 STORYBOARD v1', 40, 54);
  c.font = zh(19); c.fillStyle = 'rgba(239,226,196,.72)';
  c.fillText('7 章 · 24 鏡頭 · 約 2:00 · 每個鏡頭只有一個運鏡、一個主要動作 · 縮略圖由真實引擎渲染（打光、角色、玻璃均為成片效果）', 40, 88);
  // legend of the camera marks
  c.fillText('標記：虛線框 + 向內箭頭 = 推　向外 = 拉　長箭頭 = 橫移 / 搖　框 + 十字 = 固定　雙線箭頭 = 甩鏡', 40, 114);
  let row = -1, col = 0, prev = '';
  for (let i = 0; i < S.length; i++) {
    const [id, size, move, light, mood] = S[i], ch = id.slice(0, 2);
    if (ch !== prev) { row++; col = 0; prev = ch;
      const y = HEAD + row * RH, name = CH.find((q) => q[0] === ch)[1];
      c.fillStyle = 'rgba(214,168,74,.9)'; c.fillRect(40, y + 6, 4, TH - 12);
      c.fillStyle = '#e9dcc0'; c.font = '700 40px Cinzel'; c.fillText(ch, 56, y + 50);
      const [zhN, enN] = [name.split(' ')[0], name.split(' ').slice(1).join(' ')];
      c.font = zh(24, 600); c.fillText(zhN, 56, y + 88); c.font = 'italic 19px "IM Fell English"'; c.fillStyle = 'rgba(233,220,192,.7)'; c.fillText(enN, 56, y + 114);
    }
    const x = X0 + col * CW, y = HEAD + row * RH;
    window.renderAt(i + .5);
    c.drawImage(document.getElementById('cv'), x, y, TW, TH);
    c.strokeStyle = 'rgba(233,220,192,.25)'; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, TW - 1, TH - 1);
    const t = (s, dy, f, col) => { c.font = f; c.fillStyle = col; c.fillText(s, x + 2, y + TH + dy); };
    t(`${id}  ${size}`, 26, zh(18, 600), '#efe2c4');
    t(`運鏡　${move}`, 50, zh(16), 'rgba(239,226,196,.85)');
    t(`光　　${light}`, 72, zh(16), 'rgba(239,226,196,.85)');
    t(`情緒　${mood}`, 94, zh(16), 'rgba(214,168,74,.95)');
    col++;
  }
  return g.toDataURL('image/png').split(',')[1];
});
await browser.close();
fs.mkdirSync(rel('docs'), { recursive: true });
fs.writeFileSync(rel('docs/storyboard.png'), Buffer.from(png, 'base64'));
console.log('wrote docs/storyboard.png');
