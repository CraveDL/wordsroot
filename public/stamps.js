// Procedural reward stamps: station postmarks (per level) and carved chapter seals.
(() => {
  let uid = 0;
  const TAU = Math.PI * 2;
  const seedOf = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const polar = (fn, n = 240) => {
    let d = '';
    for (let i = 0; i < n; i++) { const a = i / n * TAU - Math.PI / 2, r = fn(a); d += (i ? 'L' : 'M') + (100 + r * Math.cos(a)).toFixed(1) + ' ' + (100 + r * Math.sin(a)).toFixed(1); }
    return d + 'Z';
  };
  const poly = n => a => { const s = TAU / n, t = (((a + Math.PI / 2 + s / 2) % s) + s) % s - s / 2; return 1.05 * Math.cos(Math.PI / n) / Math.cos(t); };
  const SHAPES = {
    circle: () => 1,
    scallop: a => 0.975 + 0.025 * Math.cos(18 * a),
    oct: poly(8),
    flower: a => 0.94 + 0.06 * Math.abs(Math.cos(4 * a)),
    dodec: poly(12),
    cog: a => 0.97 + 0.03 * Math.sign(Math.cos(24 * a)),
  };
  const SHAPE_KEYS = Object.keys(SHAPES);
  const star = (cx, cy, r) => { let p = ''; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU - Math.PI / 2, q = i % 2 ? r * 0.42 : r; p += (cx + q * Math.cos(a)).toFixed(1) + ',' + (cy + q * Math.sin(a)).toFixed(1) + ' '; } return `<polygon points="${p}"/>`; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Station postmark. o = {label, sub, no, stars, ink, date, rough}
  function station(o) {
    const id = 'st' + (++uid), seed = seedOf(o.label + o.no), stars = o.stars || 1;
    const shape = SHAPES[SHAPE_KEYS[seed % SHAPE_KEYS.length]];
    const ring = (R, w) => `<path d="${polar(a => R * shape(a))}" fill="none" stroke-width="${w}"/>`;
    let g = ring(94, 3.4) + ring(87.5, 1);
    if (stars >= 3) { // milled edge for a perfect run
      let t = ''; for (let i = 0; i < 72; i++) { const a = i / 72 * TAU, r1 = 88.6 * shape(a - Math.PI / 2 + Math.PI / 2), c = Math.cos(a - Math.PI / 2), s = Math.sin(a - Math.PI / 2); t += `M${(100 + 88.8 * c).toFixed(1)} ${(100 + 88.8 * s).toFixed(1)}L${(100 + 92 * c).toFixed(1)} ${(100 + 92 * s).toFixed(1)}`; }
      g += `<path d="${t}" stroke-width="1" fill="none"/>`;
    }
    g += `<circle cx="100" cy="100" r="64" fill="none" stroke-width="1.3"/>`;
    if (stars >= 2) { // guilloche band, unique per station
      const k = 9 + seed % 12, m = 4 + (seed >> 5) % 3;
      for (let j = 0; j < m; j++) g += `<path d="${polar(a => 56.5 + 5.2 * Math.sin(k * a + j * TAU / m), 360)}" fill="none" stroke-width=".55"/>`;
      g += `<circle cx="100" cy="100" r="49" fill="none" stroke-width=".8"/>`;
    } else g += `<circle cx="100" cy="100" r="60" fill="none" stroke-width=".6" stroke-dasharray="1.5 3"/>`;
    // dots that split the lettering band
    g += `<circle cx="20.5" cy="100" r="2.2" stroke="none"/><circle cx="179.5" cy="100" r="2.2" stroke="none"/>`;
    const len = o.label.length, fs = Math.min(34, 86 / (0.56 * len));
    const text = `<defs><path id="${id}a" d="M28 100A72 72 0 0 1 172 100"/><path id="${id}b" d="M18 100A82 82 0 0 0 182 100"/></defs>
      <g stroke="none" font-family="'Bricolage Grotesque','Avenir Next','Segoe UI',sans-serif">
      <text font-size="12.5" font-weight="700" letter-spacing="3.2"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">ROOT STATION</textPath></text>
      <text font-size="10.5" font-weight="600" letter-spacing="1.6"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">No.${String(o.no).padStart(3, '0')}${o.date ? ' · ' + esc(o.date) : ''}</textPath></text>
      <text x="100" y="${106 + fs * 0.08}" text-anchor="middle" font-size="${fs.toFixed(1)}" font-weight="800" letter-spacing="-.5">${esc(o.label)}</text>
      <text x="100" y="126" text-anchor="middle" font-size="11" font-weight="700" font-family="'Noto Serif SC','Songti SC',serif">${esc((o.sub || '').slice(0, 7))}</text>
      <g>${[...Array(stars)].map((_, i) => star(100 + (i - (stars - 1) / 2) * 13, 76, 5.2)).join('')}</g></g>`;
    return `<svg class="stamp ink-${o.ink || 'red'}" viewBox="0 0 200 200" role="img" aria-label="${esc(o.label)} 站章，${stars} 星"><g stroke="currentColor" fill="currentColor" ${o.rough ? 'filter="url(#ink)"' : ''}>${g}${text}</g></svg>`;
  }

  // Chapter seal: a carved square seal, four characters read right column first. Three stars turns it into a solid (white-text) seal.
  function seal(o) {
    const c = [...o.text], solid = (o.stars || 1) >= 3;
    const pos = [[139, 88], [139, 164], [61, 88], [61, 164]];
    const chars = c.slice(0, 4).map((ch, i) => `<text x="${pos[i][0]}" y="${pos[i][1]}" text-anchor="middle" font-size="70" font-weight="900" font-family="'Noto Serif SC','Songti SC','STSong',serif">${esc(ch)}</text>`).join('');
    const body = solid
      ? `<rect x="10" y="10" width="180" height="180" rx="13" fill="currentColor"/><g class="seal-cut">${chars}<path d="M100 24V176" stroke-width="2.5" fill="none" class="seal-cut-line"/></g>`
      : `<rect x="14" y="14" width="172" height="172" rx="11" fill="none" stroke="currentColor" stroke-width="9"/><g fill="currentColor">${chars}</g>`;
    return `<svg class="stamp seal ink-red" viewBox="0 0 200 200" role="img" aria-label="章节印 ${esc(o.text)}"><g ${o.rough ? 'filter="url(#ink)"' : ''}>${body}</g></svg>`;
  }
  window.RQ_STAMPS = { station, seal };
})();
