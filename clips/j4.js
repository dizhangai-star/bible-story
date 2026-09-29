// j4 · joint dev clip (Sprint 6): 04-abraham's tail (from 1 s before the joint) + 05-exodus's first 2 s, variant A, then
// the same with variant B. Review: node preview.mjs j4 --every .25 --w 320 --cols 8 · render: node render.mjs j4 --silent
window.CLIP = (() => {
  const A = '04-abraham', B = '05-exodus', L = 4, POST = 2, ONE = L + POST;
  const C = () => window.CLIPS || {};
  const part = (t) => { const v = t < ONE ? 'A' : 'B', u = t - (v === 'B' ? ONE : 0), a = C()[A]; return { v, u, a, b: C()[B], ta: a ? a.duration - L + u : 0 }; };
  return {
    id: 'j4', uses: ['_glass', A, B], duration: 2 * ONE, timing: { fadeIn: [-1, 0], fade: [2 * ONE, 2 * ONE] },
    get caps() {
      const a = C()[A], b = C()[B]; if (!a || !b) return [];
      const s0 = a.duration - L, one = [...a.caps.filter((c) => c[1] > s0).map(([p, q, en, zh]) => [Math.max(0, p - s0), q - s0, en, zh]),
        ...b.caps.filter((c) => c[0] < POST).map(([p, q, en, zh]) => [p + L, Math.min(ONE, q + L), en, zh])];
      return [...one, ...one.map(([p, q, en, zh]) => [p + ONE, q + ONE, en, zh])];
    },
    state(t, E) {
      const { v, u, a, b, ta } = part(t); window.JV = v;
      const st = u < L ? a.state(ta, E) : b.state(u - L, E);
      st.time = st.time ?? (u < L ? ta : u - L);
      return st;
    },
  };
})();
