// Progress: what a learner has cleared. Saved by station key, chapter key and word text, plus the layout id of
// the word list it was made with; a save from an older word list is carried over word by word.
export const blank = D => ({ v: 3, layout: D.layout, xp: 0, stars: {}, when: {}, boss: {}, wrong: {}, streak: 0, last: '', right: 0, total: 0, sound: true });

export const day = (d = new Date()) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

export function normalize(D, saved) {
  const p = blank(D);
  if (!saved || typeof saved !== 'object') return p;
  for (const k of ['xp', 'streak', 'last', 'right', 'total', 'sound']) if (saved[k] !== undefined) p[k] = saved[k];
  if (saved.v === 3 && saved.layout === D.layout) {
    const keys = new Set(D.stations.map(s => s.k));
    for (const [k, v] of Object.entries(saved.stars || {})) if (keys.has(k)) p.stars[k] = v;
    for (const [k, v] of Object.entries(saved.when || {})) if (keys.has(k)) p.when[k] = v;
    Object.assign(p.boss, saved.boss || {});
    for (const [w, n] of Object.entries(saved.wrong || {})) if (D.wordIndex.has(w)) p.wrong[w] = n;
    return p;
  }
  return carryOver(D, saved, p);
}

// Older saves: find the words of every station cleared there, then clear each new station
// that has at least half of its words among them.
function carryOver(D, old, p) {
  const lg = D.legacy || {};
  const best = new Map(), when = new Map();
  const mark = (words, stars, date) => (words || []).forEach(w => { const k = String(w).toLowerCase(); best.set(k, Math.max(best.get(k) || 0, stars)); if (date) when.set(k, date); });
  const v1 = !old.v || old.v === 1;
  for (const [k, st] of Object.entries(old.stars || {})) {
    if (v1) { const lv = lg.v1 && lg.v1.levels[k]; if (lv) mark(lv.map(i => lg.v1.words[i]), st, old.when && old.when[k]); }
    else mark(lg.stations && lg.stations[k], st, old.when && old.when[k]);
  }
  if (best.size) for (const s of D.stations) {
    const ws = s.e.map(i => D.entries[i].w.toLowerCase());
    const hit = ws.filter(w => best.has(w));
    if (hit.length && hit.length * 2 >= ws.length) { p.stars[s.k] = Math.min(...hit.map(w => best.get(w))); p.when[s.k] = hit.map(w => when.get(w)).filter(Boolean).sort().pop() || day(); }
  }
  for (const [k, n] of Object.entries(old.wrong || {})) {
    const w = v1 ? lg.v1 && lg.v1.words[k] : k;
    if (w && D.wordIndex.has(String(w).toLowerCase())) p.wrong[String(w).toLowerCase()] = n;
  }
  if (Object.keys(old.stars || {}).length || Object.keys(old.wrong || {}).length) p.migrated = true;
  return p;
}

export function toSaved(D, p) {
  const { migrated, ...rest } = p;
  return { ...rest, v: 3, layout: D.layout };
}

// experience levels and titles
export const need = l => 200 + l * 100;
export function levelOf(xp) { let l = 1; while (xp >= need(l)) { xp -= need(l); l++; } return { l, cur: xp, need: need(l) }; }
const TITLES = [[1, '见习旅人'], [3, '词缀学徒'], [6, '拆词工匠'], [10, '词根猎手'], [15, '构词学者'], [22, '词源大师'], [30, '万词归宗']];
export const titleOf = l => TITLES.filter(t => t[0] <= l).pop()[1];

// the first station of a track not yet cleared; a station is open when it is that one or comes after a cleared one
export const nextOf = (D, P, c) => D.byTrack[c].find(s => !P.stars[s.k]) || null;
export const isOpen = (D, P, s) => { const list = D.byTrack[s.c]; const n = s.no - 1; return n === 0 || !!P.stars[s.k] || !!P.stars[list[n - 1].k]; };
export const clearedIn = (P, list) => list.reduce((n, s) => n + (P.stars[s.k] ? 1 : 0), 0);
