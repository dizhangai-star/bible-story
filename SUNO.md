# Music brief for Suno

The film cuts to the music, so generate the track first, then we retime clips to its beats.
Put the chosen file at `audio/suno/film.wav` (mp3 is fine too, rename or convert) → `node audio/music.mjs` lays it
under the picture with the glass foley on top. Publishing: Suno's free tier is non-commercial; use a paid plan
(Pro/Premier) if the film will be monetised or distributed commercially.

## Settings
- **Instrumental** on (no vocals — or at most wordless choir "aah", see variant B).
- Length: ask for ~2:10 (the full film is ≈ 2:00 + tail). For the sample only, the first 0:15 is used.

## Style prompt (paste into "Style of Music")
```
sacred medieval, Gregorian plainchant mood, D Dorian, 80 BPM, pipe organ drone, solo alto recorder, celtic harp arpeggios, hand chimes, tubular bells, cathedral reverb, slow build, cinematic, no drums until the middle, no piano, no pop strings
```
Variant B (more epic, film-trailer): add `wordless choir, timpani, low brass swell` and remove `no drums until the middle`.

## Structure (paste into lyrics box as meta tags, instrumental)
```
[Intro: silence, single glass chime, organ drone enters]
[Verse: recorder chant over drone, harp arpeggios]      (Creation · Eden)
[Break: sudden stop]                                     (the first crack)
[Verse 2: low, dark, organ and chimes]                   (Flood · Abraham at night)
[Build: timpani, full organ]                             (Exodus · David)
[Silence]
[Outro: single bell with long reverb, recorder reprise, fade]   (Promise)
```

## Cue map (film seconds, 80 BPM = 0.75 s/beat) — what the picture needs from the music
| t | picture | music wish |
|---|---|---|
| 0.0–0.8 | black | silence |
| 0.8 | one spark in the rose | first sound: a single high glass/chime note |
| 2.4–6.15 | six petal pairs light, one per beat-pair | a rising line, one note per 0.75 s (D E F G A B) |
| 7.0 | "Let there be light" — the sun band lands | downbeat: bell + organ swell (biggest moment of the sample) |
| 9.4–11.4 | title carved in stone lit by a sweep | sustained, warm |
| 14.3–15 | fade to black | resolve on D |
| ≈ 30 (full film) | Eden crack | **hard stop** (silence ≥ 1 s) |
| ≈ 110 (full film) | Promise: one pane keeps its light | single bell, long reverb, recorder reprise |
