// Build the word database (data/lexicon.db) from sources/lexicon.xlsx, then export public/data.json for the site.
//   node tools/build-db.js
// The spreadsheet's 词条 sheet has one row per word in a word-formation group (前缀 / 后缀 / 词根):
//   序号, 类别, 构词分组, 分义, 单词, 音标, 原书星级, 词性及释义, 构词记忆, 例句及译文, 用法搭配, 词源故事, 词义溯源, 引申路径（记忆法）
process.removeAllListeners('warning');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { DatabaseSync } = require('node:sqlite');

const ROOT_DIR = path.join(__dirname, '..');
const SRC = path.join(ROOT_DIR, 'sources', 'lexicon.xlsx');
const DB_FILE = path.join(ROOT_DIR, 'data', 'lexicon.db');
const CAT = { 前缀: 'p', 后缀: 's', 词根: 'r' };

const clean = s => String(s ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const zh = s => /[一-龥]/.test(s || '');
const lev = (a, b) => {
  const d = [...Array(a.length + 1)].map((_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] !== b[j - 1]));
  return d[a.length][b.length];
};
// split `word` into parts.length contiguous segments closest to the given spellings
function align(word, parts) {
  const k = parts.length, n = word.length, INF = 1e9;
  if (k > n) return null;
  const dp = [...Array(k + 1)].map(() => Array(n + 1).fill(INF)), bk = [...Array(k + 1)].map(() => Array(n + 1).fill(0));
  dp[0][0] = 0;
  for (let i = 1; i <= k; i++) for (let e = i; e <= n; e++) for (let s = i - 1; s < e; s++) {
    if (dp[i - 1][s] >= INF) continue;
    const c = dp[i - 1][s] + lev(word.slice(s, e), parts[i - 1]);
    if (c < dp[i][e]) { dp[i][e] = c; bk[i][e] = s; }
  }
  if (dp[k][n] >= INF) return null;
  const segs = []; let e = n;
  for (let i = k; i >= 1; i--) { segs.unshift(word.slice(bk[i][e], e)); e = bk[i][e]; }
  return { cost: dp[k][n], segs };
}

// ---------- 1. read the workbook ----------
const wb = XLSX.readFile(SRC);
const sheetRows = name => XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: null }).slice(1);
const rows = sheetRows('词条').filter(r => r[4]);
const exampleRows = sheetRows('例句');
const examplesById = new Map();
for (const r of exampleRows) if (r[0] != null && r[2]) { const id = Number(r[0]); if (!examplesById.has(id)) examplesById.set(id, { en: clean(r[2]), zh: clean(r[3]) }); }

// ---------- 2. groups: "12. agr(i), agr(o)=field, land 表示“田地”，引申为“农业”" ----------
const quoted = s => { const m = String(s || '').match(/“([^”]+)”/); return m ? m[1] : ''; };
function parseHeader(header, cat) {
  // normalise full-width brackets and equals signs, drop "(=dis-)" style notes, join "magn(i) -"
  let h = clean(header).replace(/（/g, '(').replace(/）/g, ')').replace(/＝/g, '=').replace(/\(=[^)]*\)/g, '').replace(/\s+-/g, '-').replace(/\//g, ', ');
  const notes = [];
  h = h.replace(/\(([^)]*[\u4e00-\u9fa5][^)]*)\)/g, (m, x) => { notes.push(x); return ''; }); // "(在同辅音词根前)" is a note, not a spelling
  const m = h.match(/^(\d+)\.\s*(.*)$/);
  const num = m ? Number(m[1]) : 0;
  let rest = m ? m[2] : h;
  // morpheme list: letters, hyphens, brackets, commas, spaces — up to "=", "表" or the first Chinese character
  const cut = rest.search(/=|表|等|[一-龥“]/);
  const morphText = (cut < 0 ? rest : rest.slice(0, cut)).replace(/[,，\s]+$/, '').trim();
  rest = cut < 0 ? '' : rest.slice(cut);
  let en = '';
  if (rest.startsWith('=')) { const e = rest.slice(1).search(/表|[一-龥“]/); en = clean(e < 0 ? rest.slice(1) : rest.slice(1, e + 1)); rest = e < 0 ? '' : rest.slice(e + 1); }
  const desc = clean([rest, ...notes.map(n => `（${n}）`)].join(' '));
  const forms = morphText.split(/[,，]/).map(x => x.trim()).filter(Boolean);
  const variants = [];
  for (const f of forms) {
    const bare = f.replace(/-/g, '').toLowerCase();
    const o = bare.match(/^([a-z]+)\(([a-z]+)\)([a-z]*)$/); // acr(o) -> acr, acro
    if (o) { variants.push(o[1] + o[3], o[1] + o[2] + o[3]); continue; }
    if (/^[a-z]+$/.test(bare)) variants.push(bare);
  }
  let short = quoted(desc);
  if (!short && desc) short = desc.replace(/^表示?/, '').split(/[，,；;]/)[0];
  if (!short && cat === 's' && /表(名词|形容词|动词|副词)/.test(desc)) short = desc.match(/表(名词|形容词|动词|副词)/)[1] + '后缀';
  return { num, display: morphText, variants: [...new Set(variants)], en, desc, short: clean(short) };
}
function parseSense(text) {
  const t = clean(text);
  const en = (t.match(/=([^表一-龥“]+)/) || [])[1] || '';
  let short = quoted(t);
  if (!short) short = t.replace(/^[①-⑳]\s*/, '').replace(/^表示?/, '').split(/[，,；;]/)[0];
  return { text: t, en: clean(en), short: clean(short) };
}

const groups = [], groupByKey = new Map();
for (const r of rows) {
  const cat = CAT[clean(r[1])];
  const key = cat + '|' + clean(r[2]);
  let g = groupByKey.get(key);
  if (!g) {
    g = Object.assign(parseHeader(r[2], cat), { cat, header: clean(r[2]), senses: [], senseIndex: new Map(), entries: [] });
    groupByKey.set(key, g); groups.push(g);
  }
  const senseText = clean(r[3]);
  if (senseText && !g.senseIndex.has(senseText)) { g.senseIndex.set(senseText, g.senses.length); g.senses.push(parseSense(senseText)); }
}
for (const g of groups) if ((!g.short || g.short.startsWith('（')) && g.senses.length) g.short = g.senses.map(s => s.short).filter(Boolean).join('；');

// morpheme dictionaries from the group headers, for classifying the pieces of a breakdown
const dict = { p: new Map(), s: new Map(), r: new Map() };
for (const g of groups) for (const v of g.variants) if (!dict[g.cat].has(v)) dict[g.cat].set(v, g.short || g.senses.map(s => s.short).join('；'));

// ---------- 3. entries and their tiles ----------
// a tile only has room for the first sense: "做，造成，使；具有…的" -> "做，造成，使"
const brief = g => { const x = String(g || '').split(/[；;]/)[0].trim(); return x.length > 10 ? x.split(/[，,]/)[0] : x; };
const tidyGloss = g => clean(String(g || '').replace(/^=\s*/, '同 ').replace(/^表示?/, '').replace(/[“”"]/g, ''));
function morphFits(piece, variants) {
  return variants.some(v => piece === v || (piece.startsWith(v) && piece.length <= v.length + 2) || (v.startsWith(piece) && piece.length >= 2 && v.length <= piece.length + 1));
}
// split letters into known prefixes (left to right) or suffixes (right to left); one tile when that fails
function affixTiles(seg, kind) {
  if (!seg) return [];
  const set = dict[kind], s = seg.toLowerCase(), memo = new Map();
  const go = x => {
    if (!x) return [];
    if (memo.has(x)) return memo.get(x);
    let best = null;
    for (let n = Math.min(x.length, 8); n >= 2; n--) {
      const piece = kind === 'p' ? x.slice(0, n) : x.slice(x.length - n);
      if (!set.has(piece)) continue;
      const rest = go(kind === 'p' ? x.slice(n) : x.slice(0, x.length - n));
      if (rest) { best = kind === 'p' ? [piece, ...rest] : [...rest, piece]; break; }
    }
    memo.set(x, best);
    return best;
  };
  const split = go(s);
  if (split && split.length <= 3) { let at = 0; return split.map(t => { const o = seg.slice(at, at + t.length); at += t.length; return { t: o, g: dict[kind].get(t) || '', k: kind }; }); }
  return [{ t: seg, g: dict[kind].get(s) || '', k: seg.length <= 1 ? 'c' : kind }];
}
function tilesFromMnemonic(word, mnemonic, g, focusGloss) {
  const head = mnemonic.split('→')[0];
  if (!/[＋+]/.test(head)) return null;
  const pieces = head.split(/[＋+]/).map(x => x.trim().replace(/^\(([a-z]+)\)/, '')).filter(Boolean).map(x => { // "(s)pect": the word drops the s
    const m = x.match(/^([A-Za-z-]+(?:\([a-z]+\))?)\s*(?:[（(]([^）)]*)[）)])?\s*$/);
    return m ? { t: m[1].replace(/\(([a-z]+)\)/, '$1').replace(/-/g, '').toLowerCase(), g: m[2] || '' } : null;
  });
  if (!pieces.every(Boolean) || pieces.length < 2 || pieces.length > 7) return null;
  const lower = word.toLowerCase();
  const al = align(lower, pieces.map(p => p.t));
  if (!al || al.cost > Math.min(2, Math.floor(lower.length / 4)) || !al.segs.every(Boolean)) return null;
  let at = 0;
  const tiles = pieces.map((p, i) => { const t = word.slice(at, at + al.segs[i].length); at += al.segs[i].length; return { t, g: tidyGloss(p.g), k: '', low: al.segs[i] }; });
  // the group's own morpheme: prefixes look from the front, suffixes from the back
  const order = tiles.map((_, i) => i);
  if (g.cat === 's') order.reverse();
  let fi = order.find(i => morphFits(tiles[i].low, g.variants) || morphFits(pieces[i].t, g.variants));
  if (fi === undefined && g.cat === 'r') fi = order.find(i => g.variants.some(v => tiles[i].low.includes(v)));
  // the book wrote a variant spelling of the morpheme, "bull（=ball）" or "ceil（=cel）"
  if (fi === undefined) fi = order.find(i => /^=/.test(pieces[i].g.trim()));
  if (fi === undefined && g.cat === 'p') fi = 0;
  if (fi === undefined && g.cat === 's') fi = tiles.length - 1;
  if (fi === undefined) { let best = -1; tiles.forEach((t, i) => { if (!dict.p.has(t.low) && !dict.s.has(t.low) && (best < 0 || t.low.length > tiles[best].low.length)) best = i; }); if (best >= 0) fi = best; }
  if (fi !== undefined) { tiles[fi].k = g.cat; tiles[fi].f = 1; if (!tiles[fi].g) tiles[fi].g = focusGloss; }
  const rootAt = tiles.findIndex(t => t.k === 'r');
  tiles.forEach((t, i) => {
    if (t.k) return;
    const low = t.low;
    if (/连接|无义/.test(t.g) || (low.length <= 1 && !t.g)) { t.k = 'c'; return; }
    const beforeCore = rootAt < 0 ? i < tiles.length - 1 : i < rootAt;
    if (beforeCore && dict.p.has(low)) { t.k = 'p'; if (!t.g) t.g = dict.p.get(low); return; }
    if (!beforeCore && i > 0 && dict.s.has(low)) { t.k = 's'; if (!t.g) t.g = dict.s.get(low); return; }
    if (dict.r.has(low) && low.length >= 2) { t.k = 'r'; if (!t.g) t.g = dict.r.get(low); return; }
    if (i === tiles.length - 1 && i > 0 && dict.s.has(low)) { t.k = 's'; if (!t.g) t.g = dict.s.get(low); return; }
    t.k = 'b'; // a whole word or stem the book builds on, e.g. moral in a+moral
  });
  return tiles.map(({ t, g, k, f }) => (f ? { t, g: brief(g), k, f } : { t, g: brief(g), k }));
}
function tilesFromGroup(word, g, focusGloss) {
  const lower = word.toLowerCase();
  const vs = g.variants.slice().sort((a, b) => b.length - a.length);
  let i = -1, v = '';
  if (g.cat === 'p') { v = vs.find(x => lower.startsWith(x)) || ''; i = v ? 0 : -1; }
  else if (g.cat === 's') { v = vs.find(x => lower.endsWith(x)) || ''; i = v ? lower.length - v.length : -1; }
  else { v = vs.find(x => lower.includes(x)) || ''; i = v ? lower.indexOf(v) : -1; }
  if (i < 0) return [{ t: word, g: '', k: 'b' }];
  const before = word.slice(0, i), core = word.slice(i, i + v.length), after = word.slice(i + v.length);
  const pre = g.cat === 'p' ? [] : affixTiles(before, 'p').map(t => (t.k === 'p' && !dict.p.has(t.t.toLowerCase()) ? { ...t, k: 'b' } : t));
  const post = g.cat === 's' ? [] : affixTiles(after, 's').map(t => (t.k === 's' && !dict.s.has(t.t.toLowerCase()) ? { ...t, k: 'b' } : t));
  if (g.cat === 'p' && after) post.push(...(dict.s.size ? affixTilesTail(after) : [{ t: after, g: '', k: 'b' }]));
  if (g.cat === 's' && before) pre.push({ t: before, g: '', k: 'b' });
  return [...pre, { t: core, g: focusGloss, k: g.cat, f: 1 }, ...post].map(x => ({ ...x, g: brief(x.g) }));
}
// after a prefix: a stem, possibly with known suffixes on its end (re + act + ion)
function affixTilesTail(seg) {
  const low = seg.toLowerCase();
  for (const sfx of [...dict.s.keys()].sort((a, b) => b.length - a.length)) {
    if (sfx.length >= 2 && low.endsWith(sfx) && low.length - sfx.length >= 3) return [{ t: seg.slice(0, seg.length - sfx.length), g: dict.r.get(low.slice(0, low.length - sfx.length)) || '', k: dict.r.has(low.slice(0, low.length - sfx.length)) ? 'r' : 'b' }, { t: seg.slice(seg.length - sfx.length), g: dict.s.get(sfx), k: 's' }];
  }
  return [{ t: seg, g: dict.r.get(low) || '', k: dict.r.has(low) ? 'r' : 'b' }];
}

const entries = [];
let fromBook = 0;
for (const r of rows) {
  const g = groupByKey.get(CAT[clean(r[1])] + '|' + clean(r[2]));
  const word = clean(r[4]).replace(/[（(][a-z]+[）)]$/, ''); // distil（l） -> distil
  if (!/^\p{L}[\p{L}' .-]*$/u.test(word)) continue;
  const senseText = clean(r[3]);
  const si = senseText ? g.senseIndex.get(senseText) : -1;
  const focusGloss = si >= 0 ? g.senses[si].short : g.short;
  const mnemonic = clean(r[8]);
  let tiles = mnemonic ? tilesFromMnemonic(word, mnemonic, g, focusGloss) : null;
  const fromMn = Boolean(tiles && tiles.some(t => t.f));
  if (fromMn) fromBook++; else tiles = tilesFromGroup(word, g, focusGloss);
  const ex = examplesById.get(Number(r[0]));
  const story = clean(r[13]) || (mnemonic.includes('→') ? clean(mnemonic.slice(mnemonic.indexOf('→') + 1)) : '');
  const e = {
    id: Number(r[0]), word, phonetic: clean(r[5]), stars: (String(r[6] || '').match(/★/g) || []).length || 1,
    meaning: clean(r[7]), mnemonic, story, tiles, fromMn, sense: si,
    example_en: ex ? ex.en : '', example_cn: ex ? ex.zh : '',
    usage: clean(r[10]), etymology: clean(r[11]), origin: clean(r[12]), group: g,
  };
  entries.push(e);
  g.entries.push(e);
}

// ---------- 4. stations: a group (or one sense of a big group); very small neighbouring groups share a station ----------
const stations = [];
for (const cat of ['p', 's', 'r']) {
  const pieces = [];
  for (const g of groups.filter(x => x.cat === cat)) {
    const es = g.entries;
    if (!es.length) continue;
    if (es.length <= 14) { pieces.push({ groups: [g], entries: es }); continue; }
    const bySense = g.senses.length > 1 ? g.senses.map((_, i) => es.filter(e => e.sense === i)).concat([es.filter(e => e.sense < 0)]).filter(x => x.length) : [es];
    const chunks = [];
    for (const part of bySense) {
      const k = Math.ceil(part.length / 12), size = Math.ceil(part.length / k);
      for (let i = 0; i < part.length; i += size) chunks.push(part.slice(i, i + size));
    }
    chunks.forEach((c, i) => pieces.push({ groups: [g], entries: c, part: i + 1, of: chunks.length }));
  }
  // merge runs of tiny single-group pieces
  const merged = [];
  for (const p of pieces) {
    const last = merged[merged.length - 1];
    if (last && !last.of && !p.of && last.entries.length < 5 && p.entries.length < 5 && last.groups.length < 3 && last.entries.length + p.entries.length <= 10) {
      last.groups.push(...p.groups); last.entries = [...last.entries, ...p.entries];
    } else merged.push({ ...p });
  }
  merged.forEach(p => {
    p.cat = cat;
    p.key = cat + ':' + p.groups.map(g => g.num).join('+') + (p.of ? '~' + p.part : '');
    stations.push(p);
  });
}

// ---------- 5. SQLite ----------
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
for (const f of [DB_FILE, DB_FILE + '-wal', DB_FILE + '-shm']) fs.rmSync(f, { force: true });
const db = new DatabaseSync(DB_FILE);
db.exec(`
PRAGMA journal_mode = DELETE;
CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE groups (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('p','s','r')), -- 前缀 / 后缀 / 词根
  num INTEGER NOT NULL,              -- number within its category in the book
  header TEXT NOT NULL,              -- 构词分组 as printed
  morphemes TEXT NOT NULL,           -- e.g. "agr(i), agr(o)"
  variants TEXT NOT NULL,            -- JSON ["agr","agri","agro"]
  english TEXT NOT NULL DEFAULT '',  -- e.g. "field, land"
  description TEXT NOT NULL DEFAULT '',
  meaning TEXT NOT NULL DEFAULT ''   -- short Chinese meaning
);
CREATE TABLE senses (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES groups(id),
  seq INTEGER NOT NULL,
  text TEXT NOT NULL,                -- 分义 as printed
  english TEXT NOT NULL DEFAULT '',
  meaning TEXT NOT NULL DEFAULT ''
);
CREATE TABLE entries (
  id INTEGER PRIMARY KEY,            -- 序号 in the workbook
  group_id INTEGER NOT NULL REFERENCES groups(id),
  sense_id INTEGER REFERENCES senses(id),
  word TEXT NOT NULL COLLATE NOCASE,
  phonetic TEXT NOT NULL DEFAULT '',
  stars INTEGER NOT NULL,            -- 原书星级 1–3
  meaning TEXT NOT NULL,             -- 词性及释义
  mnemonic TEXT NOT NULL DEFAULT '', -- 构词记忆
  story TEXT NOT NULL DEFAULT '',    -- 引申路径（记忆法）
  tiles TEXT NOT NULL,               -- JSON [{t, g, k, f?}] k: p prefix, r root, s suffix, b base word, c link; f marks the group's morpheme
  tiles_from TEXT NOT NULL,          -- book | group
  example_en TEXT NOT NULL DEFAULT '',
  example_cn TEXT NOT NULL DEFAULT '',
  usage TEXT NOT NULL DEFAULT '',    -- 用法搭配
  etymology TEXT NOT NULL DEFAULT '',-- 词源故事
  origin TEXT NOT NULL DEFAULT ''    -- 词义溯源
);
CREATE INDEX entries_word ON entries(word);
CREATE INDEX entries_group ON entries(group_id);
CREATE TABLE stations (id INTEGER PRIMARY KEY, key TEXT NOT NULL UNIQUE, category TEXT NOT NULL, seq INTEGER NOT NULL);
CREATE TABLE station_groups (station_id INTEGER NOT NULL REFERENCES stations(id), group_id INTEGER NOT NULL REFERENCES groups(id), PRIMARY KEY (station_id, group_id));
CREATE TABLE station_entries (station_id INTEGER NOT NULL REFERENCES stations(id), entry_id INTEGER NOT NULL REFERENCES entries(id), seq INTEGER NOT NULL, PRIMARY KEY (station_id, entry_id));
`);
db.exec('BEGIN');
const insG = db.prepare('INSERT INTO groups (id,category,num,header,morphemes,variants,english,description,meaning) VALUES (?,?,?,?,?,?,?,?,?)');
const insS = db.prepare('INSERT INTO senses (id,group_id,seq,text,english,meaning) VALUES (?,?,?,?,?,?)');
let senseId = 0;
groups.forEach((g, i) => {
  g.id = i + 1;
  insG.run(g.id, g.cat, g.num, g.header, g.display, JSON.stringify(g.variants), g.en, g.desc, g.short);
  g.senseIds = g.senses.map((s, j) => { senseId++; insS.run(senseId, g.id, j + 1, s.text, s.en, s.short); return senseId; });
});
const insE = db.prepare('INSERT INTO entries (id,group_id,sense_id,word,phonetic,stars,meaning,mnemonic,story,tiles,tiles_from,example_en,example_cn,usage,etymology,origin) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
for (const e of entries) insE.run(e.id, e.group.id, e.sense >= 0 ? e.group.senseIds[e.sense] : null, e.word, e.phonetic, e.stars, e.meaning, e.mnemonic, e.story, JSON.stringify(e.tiles), e.fromMn ? 'book' : 'group', e.example_en, e.example_cn, e.usage, e.etymology, e.origin);
const insSt = db.prepare('INSERT INTO stations (id,key,category,seq) VALUES (?,?,?,?)');
const insSG = db.prepare('INSERT INTO station_groups (station_id, group_id) VALUES (?,?)');
const insSE = db.prepare('INSERT INTO station_entries (station_id, entry_id, seq) VALUES (?,?,?)');
stations.forEach((s, i) => {
  insSt.run(i + 1, s.key, s.cat, i + 1);
  s.groups.forEach(g => insSG.run(i + 1, g.id));
  s.entries.forEach((e, n) => insSE.run(i + 1, e.id, n + 1));
});
const insM = db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)');
insM.run('schema', '2');
insM.run('source', 'sources/lexicon.xlsx');
insM.run('built', new Date().toISOString());
const quotes = sheetRows('章节附言').map(r => clean(r[1])).filter(Boolean);
insM.run('quotes', JSON.stringify(quotes));
db.exec('COMMIT');
db.close();

// ---------- 6. export the site's data file from the database ----------
const { exportData } = require('../lib/lexicon');
const json = exportData(DB_FILE);
fs.writeFileSync(path.join(ROOT_DIR, 'public', 'data.json'), json);

const by = c => entries.filter(e => e.group.cat === c).length;
const uniq = new Set(entries.map(e => e.word.toLowerCase())).size;
console.log(`groups ${groups.length} (前缀 ${groups.filter(g => g.cat === 'p').length}, 后缀 ${groups.filter(g => g.cat === 's').length}, 词根 ${groups.filter(g => g.cat === 'r').length})`);
console.log(`entries ${entries.length} (前缀 ${by('p')}, 后缀 ${by('s')}, 词根 ${by('r')}), distinct words ${uniq}, skipped ${rows.length - entries.length}`);
console.log(`tiles from the book's breakdown ${fromBook}, from the group's morpheme ${entries.length - fromBook}, unsplit ${entries.filter(e => e.tiles.length < 2).length}`);
console.log(`examples ${entries.filter(e => e.example_en).length}, usage ${entries.filter(e => e.usage).length}, etymology ${entries.filter(e => e.etymology).length}`);
console.log(`stations ${stations.length} (前缀 ${stations.filter(s => s.cat === 'p').length}, 后缀 ${stations.filter(s => s.cat === 's').length}, 词根 ${stations.filter(s => s.cat === 'r').length}), sizes ${Math.min(...stations.map(s => s.entries.length))}–${Math.max(...stations.map(s => s.entries.length))}`);
console.log(`public/data.json ${(Buffer.byteLength(json) / 1024).toFixed(0)} KB`);
