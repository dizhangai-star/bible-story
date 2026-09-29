// The film's soundtrack. Music is written in code, per clip, in audio/score.mjs (organ, recorder, harp; clips not
// scored yet get a quiet drone). Suno was tried and dropped (2026-09-30).
// Glass foley is code-built (STYLE.md §6 of lemo-opuscar's stained-glass): struck glass modal partials
// 1 : 2.32 : 4.25 : 6.63 : 9.38, crack (snap + pane thump + tinkles), air on light moves, a long-reverb bell,
// and a stone-hall room tone. Clips cue it with sfx: [[t, kind, {v, m, d}]].
// Usage: node audio/music.mjs → audio/build/film.wav (48 kHz stereo, peak −1 dBFS). mix.mjs calls it.
import { film, rel } from '../../_kit/lib/film.mjs';
import { rng, voices, freeverb, hpf, level, writeWav, hz } from '../../_kit/audio/dsp.mjs';
import { score } from './score.mjs';

const SR = 48000, F = film(), END = F.duration, N = Math.ceil(END * SR);
const L = new Float32Array(N), R = new Float32Array(N), MUS = [L, R];
const SL = new Float32Array(N), SRt = new Float32Array(N), SFX = [SL, SRt];
const { rnd, jit } = rng(20260929);
const V = voices({ sr: SR, n: N, rnd, music: MUS, sfx: SFX });
const { partials, noise, glide } = V;

// ---------- music: the code score, per clip (audio/score.mjs) ----------
const scored = score({ SR, rnd, bus: MUS, F });
const musicSrc = `score (${scored.length}/${F.clips.length} clips: ${scored.join(', ') || 'none'})`;

// ---------- glass foley ----------
const RATIOS = [1, 2.32, 4.25, 6.63, 9.38];
const glass = (t, v, m = 86, pan = 0) => { const f = hz(m); partials(t, RATIOS.map((r, k) => [f * r * (1 + jit(.002)), v * [1, .5, .3, .18, .1][k], [1.6, .9, .45, .25, .15][k]]), pan, 3, SFX, .001); };
const KINDS = {
  glass: (t, v, o) => glass(t, .22 * v, o.m ?? 86, o.pan ?? 0),
  crack: (t, v, o) => {   // o.snap scales the first transient (06: kept under the limiter, or AAC overshoots the true peak)
    noise(t, .08, .6 * v * (o.snap ?? 1), 0, SFX, { bp: 3500, q: .5, dec: .015 });                                    // snap
    glide(t, .6, .5 * v, (u) => 95 - 45 * u, 0, (u) => Math.exp(-u * 7), SFX);                       // the pane's body
    for (let k = 0; k < 16; k++) glass(t + .05 + rnd() * .7, .05 * v * (1 - k / 20), 96 + Math.floor(rnd() * 14), rnd() * 1.4 - .7);   // tinkles
  },
  air: (t, v, o) => { const d = o.d ?? 1.6; noise(t, d, .06 * v, 0, SFX, { sweep: [300, 1800], q: 1.2, atk: .02, shape: (u) => Math.sin(Math.PI * u) ** 1.5 }); },
  bell: (t, v, o) => { const f = hz(o.m ?? 50); partials(t, [.5, 1, 1.19, 1.56, 2, 2.51, 3.01].map((r, k) => [f * r, .16 * v * [.6, 1, .5, .35, .3, .15, .1][k], [9, 7, 5, 4, 3, 2, 1.5][k]]), 0, 10, SFX, .001); },
};
let sfxN = 0;
for (const c of F.clips) for (const [t, kind, o = {}] of c.A.sfx ?? []) {
  if (!KINDS[kind]) throw new Error(`${c.id}: unknown sfx ${kind}`);
  KINDS[kind](c.start + t, o.v ?? 1, o); sfxN++;
}
// stone-hall room tone under everything (very low, filtered)
noise(0, END, .012, 0, SFX, { bp: 220, q: .4, atk: 1.5 });

// ---------- mix: glass rings in a big stone hall ----------
const GM = 0.9, GS = 1.6, WET = 0.7;
[L, R, SL, SRt].forEach((a) => hpf(a, 28, SR));
if (process.env.BUS) { const st = (a, g) => { const l = level(a, g); return `rms ${l.rms.toFixed(1)} dB, peak ${l.peak.toFixed(1)} dB`; }; console.log(`music ${st(L, GM)} | sfx ${st(SL, GS)}`); }
const send = L.map((v, i) => (v + R[i]) * 0.5 * GM + (SL[i] + SRt[i]) * 0.5 * GS * 0.6);
hpf(send, 180, SR);
const hall = { sr: SR, room: 0.93, damp: 0.35, pre: 0.04 };
const wl = freeverb(send, 0, hall), wr = freeverb(send, 23, hall);
for (let i = 0; i < N; i++) { L[i] = L[i] * GM + SL[i] * GS + wl[i] * WET; R[i] = R[i] * GM + SRt[i] * GS + wr[i] * WET; }
for (let i = Math.floor((END - 0.8) * SR); i < N; i++) { const g = (N - i) / (0.8 * SR); L[i] *= g; R[i] *= g; }
await writeWav(rel('audio/build/film.wav'), L, R, SR);
console.log(`film: music = ${musicSrc}, ${sfxN} sfx, ${END}s → audio/build/film.wav`);
