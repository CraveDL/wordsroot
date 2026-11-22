// Load the word data (public/data.json, exported from data/lexicon.db) and derive the structures the game uses.
export const TRACKS = [
  { c: 'p', name: '前缀', en: 'PREFIX', top: 'PREFIX STATION', ink: 'blue', blurb: '加在词首，改变方向和程度：un- 不，re- 再，trans- 穿过。' },
  { c: 'r', name: '词根', en: 'ROOT', top: 'ROOT STATION', ink: 'red', blurb: '单词的意义核心：dict 说，port 运，spect 看。' },
  { c: 's', name: '后缀', en: 'SUFFIX', top: 'SUFFIX STATION', ink: 'teal', blurb: '加在词尾，决定词性：-tion 名词，-able 可…的，-ize 使…化。' },
];
export const TRACK = Object.fromEntries(TRACKS.map(t => [t.c, t]));
export const KIND = { p: '前缀', r: '词根', s: '后缀', b: '词干', c: '连接' };
const CN = '〇一二三四五六七八九';
export const CHAPTER_SIZE = 10;

export async function loadData() {
  const res = await fetch('data.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('词库没有加载成功');
  return prepare(await res.json());
}

export function prepare(D) {
  const { groups, entries, stations } = D;
  stations.forEach((s, i) => { s.i = i; });
  const byTrack = { p: [], s: [], r: [] };
  stations.forEach(s => byTrack[s.c].push(s));
  // chapters: every 10 stations of a track
  const chapters = { p: [], s: [], r: [] };
  for (const c of ['p', 's', 'r']) {
    byTrack[c].forEach((s, n) => {
      const ci = Math.floor(n / CHAPTER_SIZE);
      if (!chapters[c][ci]) chapters[c][ci] = { c, n: ci, key: c + (ci + 1), stations: [] };
      chapters[c][ci].stations.push(s);
      s.ch = ci; s.no = n + 1;
    });
  }
  const wordIndex = new Map();
  entries.forEach((e, i) => { const k = e.w.toLowerCase(); if (!wordIndex.has(k)) wordIndex.set(k, i); });
  return Object.assign(D, { byTrack, chapters, wordIndex, words: wordIndex.size });
}

// "ab-, abs-" -> label for a stamp: keep it short
export const groupLabel = g => g.m.split(/,\s*/).slice(0, 2).join('/');
export const stationGroups = (D, s) => s.g.map(i => D.groups[i]);
export const stationTitle = (D, s) => stationGroups(D, s).map(g => g.m).join('  ·  ');
export const stationLabel = (D, s) => { const gs = stationGroups(D, s); const t = gs.map(groupLabel).join(' '); return gs.length > 1 ? gs.map(g => g.m.split(/,\s*/)[0]).join(' ') : t; };
// a big group split by sense shows the sense its words share, so the stations read differently
export const stationMeaning = (D, s) => {
  const gs = stationGroups(D, s);
  if (gs.length === 1 && gs[0].ss.length > 1) {
    const counts = new Map();
    s.e.forEach(i => { const se = D.entries[i].se; if (se != null) counts.set(se, (counts.get(se) || 0) + 1); });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top && gs[0].ss[top[0]].zh) return gs[0].ss[top[0]].zh.split(/[；]/)[0];
  }
  return gs.map(g => (g.zh || '').split(/[；，]/)[0]).filter(Boolean).join(' / ');
};
export const entrySense = (D, e) => { const g = D.groups[e.g]; return e.se != null && g.ss[e.se] ? g.ss[e.se].zh : g.zh; };
export const sealText = ch => TRACK[ch.c].name + (ch.n + 1 < 10 ? '〇' + CN[ch.n + 1] : String(ch.n + 1).split('').map(d => CN[d]).join('').slice(-2));
export const chapterRange = (D, ch) => { const a = ch.stations[0], b = ch.stations[ch.stations.length - 1]; const f = s => stationGroups(D, s)[0].m.split(/,\s*/)[0]; return a === b ? f(a) : `${f(a)} – ${f(b)}`; };
