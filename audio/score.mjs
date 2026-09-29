// The film's music, written in code per clip (Suno dropped 2026-09-30). Each clip is scored in its own buffer, in
// clip seconds, cut by the clip's fade and laid at its start in the film (tails never ring into the next chapter; the
// hall reverb in music.mjs still carries across the cut). The glass foley (clip sfx: chimes, bells, cracks) is part of
// the music, so a score leaves those notes to it and plays around them.
// Instruments: pipe organ, alto recorder, harp. Home key D Dorian, 80 BPM = 0.75 s/beat.
// MIDI: G1 31, D2 38, G2 43, A2 45, D3 50, G3 55, A3 57, D4 62, G4 67, A4 69, B4 71, D5 74.
import { panG, hz, voices } from '../../_kit/audio/dsp.mjs';

const SCORES = {
  // Opening card: an open D in the dark under the title (the glass note at 0.9 is its spark), gone before 01's spark.
  '00-title'({ organ, harp }) {
    organ(.6, 5.0, [38, 45], .016, { atk: 2.0, amp: (u) => 1 - .5 * u }); harp(1.6, 62, .06); harp(2.35, 69, .05); harp(3.1, 74, .05);
  },
  // End card: after the dawn's D major, a low D and a G that does not resolve (the question stays open).
  '08-end'({ organ, recorder }) {
    organ(.4, 5.6, [38, 50, 57], .016, { atk: 1.2 }); organ(2.4, 3.6, [43, 55, 59], .012, { atk: 1.5 }); recorder(2.6, 2.4, 71, .035);
  },
  // Darkness; the glass foley has the spark (0.8), the six day notes D5…B5 and the bell on the light (7.0).
  '01-genesis'({ organ, recorder, harp }, A) {
    organ(1.0, 6.0, [38, 45], .028, { atk: 2.5, amp: (u) => .5 + .5 * u });                    // drone grows under the days
    const LINE = [62, 64, 65, 67, 69, 71];                                                        // recorder an octave under the glass
    A.DAYS.forEach((t, k) => { recorder(t, .7, LINE[k], .045 + .006 * k); harp(t, k % 2 ? 45 : 50, .08 + .01 * k); });
    // "Let there be light": D major (the light is a Picardy third), full organ swell, harp arpeggio, recorder on D5
    organ(7.0, 2.4, [38, 50, 57, 62, 66, 69], .045, { atk: .25, amp: (u) => 1 - .25 * u });
    recorder(7.0, 2.2, 74, .1);
    [50, 57, 62, 66, 69, 74].forEach((m, k) => harp(7.0 + k * .375, m, .15));
    // the title sweep: G (IV) → C (bVII) → home on D, open fifth, fading with the picture
    organ(9.4, 1.4, [43, 55, 59, 62], .024); recorder(9.4, .7, 71, .07); recorder(10.15, .6, 69, .065);
    organ(10.8, 1.4, [48, 55, 60, 64], .022); recorder(10.8, 1.3, 67, .065);
    organ(12.2, 2.6, [38, 50, 57, 62], .024, { amp: (u) => 1 - .4 * u }); recorder(12.2, 2.0, 62, .06);
    [50, 57, 62].forEach((m, k) => harp(12.2 + k * .375, m, .12));
    // J1 (Sprint 6): under the cloud the harmony moves to G, the garden's key; the recorder leads to 02's D5
    organ(14.6, 2.8, [43, 50, 55], .016, { atk: 1.4 }); harp(15.2, 55, .07); harp(15.95, 59, .06); harp(16.7, 62, .06);
    recorder(16.3, .9, 71, .04);
  },

  // G major pastoral (glass D5 · F#5 · G5) → the push darkens to E7 under the glass G#5 (8.6) → the music cuts at 9.4
  // (near-silence) → the crack (10.2) → silence → the bell (D2, 12.2) → D minor lament, falling, as the light leaves.
  '02-eden'({ organ, recorder, harp, line, arp }, A) {
    const T = A.T;
    organ(.4, 5.2, [43, 50, 55, 59], .022, { atk: 1.2 });                                        // G
    for (let k = 0; k < 5; k++) arp(.9 + k * 1.5, [43, 50, 55, 59], .375, .1 - .01 * k, -.35, k < 4 ? 3.5 : 1.2);   // thinning with the push
    line([[1.2, .7, 74], [1.95, .33, 71], [2.3, .33, 69], [2.65, .72, 67], [3.4, .72, 69], [4.15, 1.15, 71], [5.35, 1.1, 74]], .06);
    organ(5.6, 1.4, [40, 52, 55, 59], .024);                                                     // Em — "she took of the fruit"
    organ(7.0, 1.6, [36, 48, 55, 60, 64], .026);                                                 // C under the glass G5
    organ(8.6, .8, [40, 50, 56, 62], .03, { rel: .12, amp: (u) => .8 + .4 * u });                // E7 under G#5, cut at 9.4
    recorder(5.6, 1.3, 76, .055); recorder(7.0, 1.5, 72, .06); recorder(8.6, .8, 74, .065, { rel: .1 });
    // 9.4 → 12.2: nothing but the crack (foley) and its ring
    organ(T.out - .2, 17.2 - T.out, [38, 50, 53, 57], .022, { atk: 1.8, amp: (u) => 1 - .3 * u });   // D minor, low
    harp(T.out, 50, .1); harp(13.7, 45, .08); harp(15.2, 50, .07);
    line([[12.8, .72, 69], [13.55, .72, 67], [14.3, .72, 65], [15.05, .72, 64], [15.8, 1.4, 62]], .055);   // falls to D
    // J2 (Sprint 6): a low D pedal holds in the dark, into the storm's D minor
    organ(17.0, 2.4, [38, 45], .014, { atk: 1.2 });
  },

  // Oppression → surging water (a harp ostinato in eighths, D minor → Bb → C) → hope: F with Noah, the dove lands on
  // D5 (glass D6, 10.5) → a half cadence on A → the bow: open D (bell 12.4, glass D E F G A) → G, B natural (comfort).
  '03-flood'({ organ, recorder, harp, line, arp }, A) {
    organ(.3, 4.5, [38, 45, 50], .02, { atk: 2 });                                               // Dm
    organ(4.6, 3.2, [34, 46, 50, 53], .024, { atk: .4 });                                        // Bb — the ark
    organ(7.8, .6, [36, 48, 52, 55], .028, { rel: .5 });                                         // C — the water bears it up
    const OST = [38, 45, 50, 45];
    for (let k = 0; k < 20; k++) { const t = .8 + k * .375, bar = t < 4.6 ? 0 : t < 7.8 ? -4 : -2;   // follow the bass
      harp(t, OST[k % 4] + bar, .06 + .004 * k, -.45); }
    organ(8.2, 2.3, [41, 53, 57, 60], .02, { atk: .6 });                                         // F — Noah, hope
    organ(10.5, 1.1, [46, 53, 58, 62], .02);                                                     // Bb — the dove lands
    organ(11.6, .8, [45, 52, 57, 61], .022, { rel: .4 });                                        // A — half cadence
    line([[8.6, .72, 69], [9.35, .72, 67], [10.1, .38, 69], [10.5, 1.3, 74]], .06);
    organ(12.4, 1.8, [38, 50, 57, 62], .026, { atk: .3 });                                       // the bow: open D
    arp(12.4, [50, 57, 62, 69], .375, .1);
    organ(14.2, 1.8, [43, 55, 59, 62], .024);                                                    // G (Dorian IV)
    arp(14.2, [43, 50, 55, 59, 62], .375, .09);
    organ(16.0, 3.4, [38, 50, 57, 62, 69], .024, { amp: (u) => 1 - .35 * u });                   // home, to the floor
    line([[14.4, 1.0, 71], [15.4, .72, 69], [16.15, .72, 67], [16.9, .72, 69], [17.65, 1.6, 74]], .055);
    // J3 (Sprint 6): the sun sets on the floor (G, recorder falling), then night: a low open G, Abraham's key
    organ(19.2, 1.8, [43, 55, 59, 62], .018, { atk: .6, amp: (u) => 1 - .4 * u }); line([[19.3, .9, 71], [20.2, 1.2, 67]], .04);
    organ(20.8, 2.6, [31, 43], .016, { atk: 1.2 }); harp(21.6, 50, .06); harp(22.35, 55, .05);
  },

  // Night, G major: the stars are the melody (glass G pentatonic climbing from 1.8); the score stays low and slow —
  // a G drone, one recorder phrase under the gaze, C → Em → D as the stars multiply, full G on the bell (10.4).
  '04-abraham'({ organ, recorder, harp, line }, A) {
    organ(.4, 6.0, [43, 50], .02, { atk: 2.5 });                                                 // G open fifth, alone
    line([[1.4, 1.5, 62], [2.9, 1.5, 67], [4.4, 1.2, 66], [5.6, 1.0, 62]], .045);                // D · G · F# · D, under the stars
    harp(1.8, 43, .07); harp(4.8, 50, .06);
    organ(6.4, 1.6, [36, 48, 55, 60, 64], .02, { atk: .8 });                                     // C — "so shall thy seed be"
    organ(8.0, 1.2, [40, 52, 55, 59], .02);                                                      // Em
    organ(9.2, 1.2, [38, 50, 54, 57], .022);                                                     // D
    organ(10.4, 3.9, [43, 50, 55, 59, 62, 67], .026, { atk: .5, amp: (u) => 1 - .35 * u });      // G — righteousness
    line([[6.4, 1.5, 71], [7.9, .72, 69], [8.65, .72, 67], [9.4, .95, 69], [10.4, 1.5, 74], [11.9, 2.2, 71]], .055);
    [43, 50, 55, 59, 62].forEach((m, k) => harp(10.4 + k * .375, m, .08));
    // J4 (Sprint 6): the last star (glass, clip sfx) over a G that darkens to D minor as it becomes the fire
    organ(14.4, 1.4, [43, 50], .014, { atk: .8 }); organ(15.6, 2.0, [38, 45, 50], .016, { atk: 1.0, amp: (u) => .7 + .5 * u });
  },

  // Pursuit: a driving low harp ostinato (dotted, D minor → Bb → C) under a dark organ, crescendo; Moses (4.8): it stops;
  // G under the glass D-G-B (5.4); D major on the rays + bell (6.8); the sea parts on a rising bass C → D (the glass
  // G3 A3 C4 D4 G4); the walls stand on full G (bell 12.4) and the recorder sings Israel through.
  '05-exodus'({ organ, recorder, harp, line, arp }, A) {
    const T = A.T;
    organ(.2, 2.4, [38, 45, 50], .02, { atk: 1.2 });                                             // Dm
    organ(2.6, 1.4, [34, 46, 50, 53], .022);                                                     // Bb
    organ(4.0, .8, [36, 48, 52, 55], .026, { rel: .4, amp: (u) => .8 + .4 * u });               // C, pushing
    const PAT = [[0, 38, 1], [.5625, 38, .6], [.75, 45, .8], [1.125, 50, .7]];                   // one 0.75-s beat pair, dotted
    for (let t0 = .6; t0 < T.moses - .3; t0 += 1.5) for (const [dt, m, a] of PAT) {
      const t = t0 + dt, shift = t < 2.6 ? 0 : t < 4.0 ? -4 : -2;
      harp(t, m + shift, (.06 + .012 * t) * a, -.4);
    }
    organ(T.raise, 1.4, [43, 55, 59], .022, { atk: .5 });                                        // G — the rod rises
    organ(T.rays, 1.4, [38, 50, 57, 62, 66, 69], .034, { atk: .15 });                            // D major — the rays
    organ(8.6, 1.6, [36, 48, 55, 60, 64], .022, { atk: .6 });                                    // C — the sea parts
    organ(10.2, .7, [40, 52, 55, 59], .022);                                                     // Em
    organ(10.9, 1.5, [38, 50, 54, 57, 62], .026);                                                // D
    arp(8.8, [48, 55, 60, 64], .35, .07); arp(10.9, [50, 54, 57, 62], .35, .08);
    organ(T.open, 4.9, [43, 50, 55, 59, 62, 67], .034, { atk: .3, amp: (u) => 1 - .35 * u });    // G — the walls stand
    arp(T.open, [43, 50, 55, 59, 62, 67], .375, .1);
    line([[12.4, 1.5, 74], [13.9, .72, 71], [14.65, .72, 72], [15.4, .72, 69], [16.15, 1.1, 67]], .07);
    // J5 (Sprint 6): dawn after the crossing: G → G minor → Bb, 06's dark key, as the band settles on the giant
    organ(17.3, 1.5, [43, 55, 58, 62], .018, { atk: .5 }); recorder(17.4, 1.3, 70, .045);
    organ(18.8, 2.4, [34, 46, 53], .018, { atk: .8 }); harp(18.8, 46, .07); harp(19.55, 53, .06);
  },

  // Fear: heavy low steps (harp, every 1.5 s) under a Bb → A-major organ that swells to the whip pan (5.2) and cuts;
  // courage: D major, harp eighths then sixteenths as the sling whirls (glass D E G A B D rising); all stops at the
  // release (9.4); the crack (10.0) in silence; the bell (12.2) → G major, the recorder home.
  '06-david'({ organ, recorder, harp, line, arp }, A) {
    const T = A.T;
    organ(.4, 3.0, [34, 41, 50], .024, { atk: 1.5 });                                            // Bb (dark, low)
    organ(3.4, T.whip - 3.4, [33, 40, 49, 52], .028, { rel: .1, amp: (u) => .7 + .6 * u });      // A — tension to the whip
    for (let t = .8; t < T.whip; t += 1.5) harp(t, 38, .09, -.2);                                // the giant's steps
    for (let k = 0, t = T.spin; t < T.release - .05; k++) {                                      // the sling whirls faster
      harp(t, [50, 54, 57, 62][k % 4], .06 + .005 * k, .3, T.release - t + .1); t += t < 7.7 ? .375 : .1875; }
    for (let t = T.spin; t < T.release - .2; t += .75) organ(t, .55, [38, 50, 54, 57], .016 + .002 * (t - T.spin), { atk: .04, rel: .15 });
    recorder(7.7, 1.6, 74, .06, { rel: .08 }); recorder(8.45, .9, 78, .07, { rel: .08 });
    // release → crack → fall: silence (foley only)
    organ(T.pull, 3.0, [43, 50, 55, 59, 62], .026, { atk: .8, amp: (u) => 1 - .3 * u });          // G — the giant kneels
    arp(T.pull, [43, 50, 55, 59, 62], .375, .08);
    line([[12.6, 1.0, 71], [13.6, .72, 69], [14.35, 1.0, 67]], .055);
    // J6 (Sprint 6): sunset: G → Em as the light slides off, then the night's low D (07's drone)
    organ(15.2, 1.5, [43, 50, 55, 59], .018, { amp: (u) => 1 - .3 * u }); organ(16.4, 1.2, [40, 52, 55, 59], .016);
    recorder(15.4, .9, 66, .04); recorder(16.4, 1.3, 64, .035); organ(17.2, 2.2, [38, 45], .016, { atk: 1.0 });
  },

  // Night stillness (D drone); the mends: G under the first (glass D G D A), Em under the second (E A G D), a soft harp
  // on each weld beat; the lamp (bell A2, 12.0): the Genesis line returns on the recorder, D E F G A over F → C → Bb → A;
  // near-silence; the dawn bell (D3, 16.4): D major, as at "Let there be light", the harp arpeggio and D5 again.
  '07-promise'({ organ, recorder, harp, line, arp }, A) {
    const T = A.T, M0 = A.MEND[0], M2 = A.MEND[2];
    organ(.4, M0 - .4, [38, 45], .022, { atk: 2.5 });                                            // night
    organ(M0, 3.9, [43, 50, 55, 59], .02, { atk: .6 });                                          // G — Eden mended
    for (let k = 0; k < 4; k++) harp(M0 + k * .75, [50, 55, 50, 57][k], .07);
    line([[M0, 1.85, 71], [6.15, 1.9, 69]], .045);
    organ(M2, 1.85, [40, 52, 55, 59], .02);                                                      // Em — Goliath mended
    organ(10.05, 1.95, [45, 52, 57], .02);                                                       // A (open)
    for (let k = 0; k < 4; k++) harp(M2 + k * .75, [52, 57, 52, 59][k], .07);
    line([[8.4, 1.5, 67], [9.9, 1.9, 64]], .045);
    // the lamp: the six-day line comes back, one per beat
    organ(T.lamp, 1.5, [41, 53, 57, 60], .024, { atk: .4 });                                     // F
    organ(13.5, .75, [36, 48, 55, 60, 64], .024);                                                // C
    organ(14.25, .75, [34, 46, 53, 58, 62], .024);                                               // Bb
    organ(15.0, .55, [33, 45, 52, 57, 61], .026, { rel: .35 });                                  // A — then near-silence
    line([[12.0, .72, 62], [12.75, .72, 64], [13.5, .72, 65], [14.25, .72, 67], [15.0, .6, 69]], .06);
    // dawn: "Arise, shine"
    organ(T.dawn, 2.8, [38, 50, 57, 62, 66, 69], .04, { atk: .25, amp: (u) => 1 - .3 * u });
    recorder(T.dawn, 2.6, 74, .09);
    [50, 57, 62, 66, 69, 74].forEach((m, k) => harp(T.dawn + k * .375, m, .13));
  },
};

const RING = 1.2;
export function score({ SR, rnd, bus, F }) {
  const [BL, BR] = bus, done = [];
  for (const c of F.clips) {
    // a clip without a fade (a joint, Sprint 6) lets its music ring RING s into the next chapter, dying away
    const [f0, f1] = c.A.timing.fade, ring = f1 > f0 ? 0 : RING;
    const n = Math.ceil((c.duration + ring) * SR), L = new Float32Array(n), R = new Float32Array(n), V = voices({ sr: SR, n, rnd, music: [L, R] });
    // Sustained additive voice: parts [[ratio, amp]], ADSR-ish (atk, rel after d), vibrato (cents, fading in after
    // .25 s), chorus (two copies ± cents), breath (low-passed noise), amp(u) = level over the note (u 0..1).
    function tone(t, d, m, o = {}) {
      const f0 = hz(m), parts = o.parts ?? [[1, 1]], v = o.v ?? .1, atk = o.atk ?? .05, rl = o.rel ?? .3;
      const s0 = Math.floor(t * SR), len = Math.min(Math.ceil((d + rl) * SR), n - s0); if (len <= 0 || s0 < 0) return;
      const [gl, gr] = panG(o.pan ?? 0), det = o.chorus ? [-o.chorus, o.chorus] : [0];
      const osc = parts.flatMap(([r, a]) => (f0 * r < SR / 2.2 ? det.map((ct) => ({ f: f0 * r * 2 ** (ct / 1200), a, ph: rnd() * 6.283 })) : []));
      const vibD = o.vib ?? 0, vibW = 2 * Math.PI * (o.vibHz ?? 5) / SR, g = v / det.length;
      let br = 0;
      for (let i = 0; i < len; i++) {
        const ts = i / SR;
        const env = Math.min(1, ts / atk) * (ts < d ? 1 : Math.max(0, 1 - (ts - d) / rl)) * (o.amp ? o.amp(Math.min(1, ts / d)) : 1);
        const fm = vibD ? 2 ** (vibD * Math.min(1, Math.max(0, (ts - .25) / .4)) * Math.sin(vibW * i) / 1200) : 1;
        let y = 0;
        for (const p of osc) { p.ph += 2 * Math.PI * p.f * fm / SR; y += p.a * Math.sin(p.ph); }
        if (o.breath) { br += .08 * (rnd() * 2 - 1 - br); y += o.breath * br * det.length; }
        y *= env * g; L[s0 + i] += y * gl; R[s0 + i] += y * gr;
      }
    }
    const recorder = (t, d, m, v = .09, o = {}) => tone(t, d, m,
      { parts: [[1, 1], [2, .07], [3, .2], [4, .03], [5, .05]], v, atk: .06, rel: .18, vib: 14, vibHz: 5.2, breath: .08, pan: .2, ...o });
    const harp = (t, m, v = .2, pan = -.35, ring = 3.5) => V.pluck({ t, m, v, pan, ring });
    const I = {
      organ: (t, d, ms, v = .03, o = {}) => [].concat(ms).forEach((m, k, all) => {
        const pan = all.length > 1 ? -.5 + k / (all.length - 1) : 0;
        tone(t, d, m, { parts: [[1, 1], [2, .5], [3, .22], [4, .16], [6, .06], [8, .04]], v, atk: .12, rel: .8, chorus: 2.5, pan, ...o });
        V.noise(t, .07, v * .35, pan, [L, R], { bp: Math.min(8000, hz(m) * 5), q: 1.2, dec: .025 });   // pipe chiff
      }),
      recorder, harp,
      line: (notes, v, o) => notes.forEach(([t, d, m]) => recorder(t, d, m, v, o)),                  // [[t, d, midi], …]
      arp: (t, ms, step, v, pan, ring) => ms.forEach((m, k) => harp(t + k * step, m, v, pan, ring)),
    };
    if (SCORES[c.id]) { SCORES[c.id](I, c.A); done.push(c.id); }
    else I.organ(.5, c.duration - 1.5, [38, 45], .02, { atk: 1.5, rel: 1 });                    // not scored yet: a quiet bed
    // the clip's fade cuts its music; lay it at the clip's start
    const s0 = Math.floor(c.start * SR);
    for (let i = 0; i < n && s0 + i < BL.length; i++) {
      const g = ring ? Math.min(1, Math.max(0, 1 - (i / SR - f1) / ring)) : Math.min(1, Math.max(0, (f1 - i / SR) / (f1 - f0)));
      BL[s0 + i] += L[i] * g; BR[s0 + i] += R[i] * g;
    }
  }
  return done;
}
