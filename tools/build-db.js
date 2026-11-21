// Build the word database (data/lexicon.db) from the source files, then export public/data.js for static hosting.
//   node tools/build-db.js
// Sources, in priority order:
//   sources/vol1.md                    上册，全部词根
//   sources/vol2.md                    下册，全部词根
process.removeAllListeners('warning');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { parseAll, tidy } = require('./parse-sources');

const ROOT_DIR = path.join(__dirname, '..');
const DB_FILE = path.join(ROOT_DIR, 'data', 'lexicon.db');

// Obvious spelling slips in the sources.
const CORRECTIONS = { operatta: 'operetta', proprietory: 'proprietary' };

// Fallback glosses for affixes the book never glosses explicitly.
const BUILTIN = {
  p: { un: '不', in: '不；向内', im: '不；向内', il: '不', ir: '不', dis: '不；分开', non: '非', mis: '错误', re: '再；回', de: '去掉；向下', pre: '提前', pro: '向前', ex: '出', e: '出', con: '共同', com: '共同', co: '共同', sub: '下面', super: '超过', sur: '超过', inter: '之间', trans: '穿过', anti: '反对', counter: '反', over: '过度', under: '下面', out: '超过', semi: '半', multi: '多', auto: '自己', tele: '远', micro: '小', ab: '离开', abs: '离开', ad: '去；强调', ac: '强调', af: '强调', ag: '强调', al: '强调', an: '强调', ap: '强调', ar: '强调', as: '强调', at: '强调', col: '共同', cor: '共同', ob: '反；对着', oc: '强调', of: '反', op: '反', sup: '下面', suf: '下面', sug: '下面', sus: '下面', di: '分开', dif: '分开', se: '分开', en: '使', em: '使', per: '贯穿；完全', post: '后', fore: '前', mal: '坏', bi: '二', tri: '三', uni: '单一', self: '自我' },
  s: { tion: '名词后缀', ion: '名词后缀', ation: '名词后缀', ment: '名词后缀', ness: '名词后缀', ity: '名词后缀', ty: '名词后缀', ance: '名词后缀', ence: '名词后缀', ancy: '名词后缀', ency: '名词后缀', ure: '名词后缀', ism: '主义', ist: '人', er: '人；物', or: '人；物', ee: '被……的人', ant: '……的；人', ent: '……的', ive: '形容词后缀', ous: '形容词后缀', ious: '形容词后缀', al: '形容词后缀', ial: '形容词后缀', ic: '形容词后缀', ical: '形容词后缀', ary: '形容词后缀', ory: '形容词后缀', able: '能……的', ible: '能……的', ful: '充满……的', less: '无……的', ly: '副词后缀', ize: '动词后缀', ise: '动词后缀', ify: '动词后缀', fy: '动词后缀', ate: '动词后缀', en: '使', ing: '动名词', ed: '……的', s: '复数', y: '名词后缀', ship: '名词后缀', hood: '名词后缀', dom: '名词后缀', some: '……的', ish: '……的' },
};

// ---------- helpers ----------
const zh = s => /[一-龥]/.test(s || '');
const lev = (a, b) => {
  const d = [...Array(a.length + 1)].map((_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] !== b[j - 1]));
  return d[a.length][b.length];
};
// Split `word` into parts.length contiguous segments, closest to the given spellings.
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
const cleanGloss = g => tidy(String(g || '')
  .replace(/(名词|动词|形容词|副词)?(前缀|后缀)[：:]?/, (m, a) => (a ? a + '后缀 ' : ''))
  .replace(/庙缀/g, '后缀').replace(/表示?/g, '').replace(/[“”"]/g, '').replace(/拼音[：:]?/, '谐音 ').replace(/连接字母/, '连接')
  .replace(/^[：:\s]+|[：:\s]+$/g, ''));

// ---------- 1. gather ----------
const parsed = parseAll();
const vol1Roots = parsed.roots.filter(r => r.volume === 1);
const roots = parsed.roots.map(r => Object.assign(r, { source: r.volume === 1 ? 'vol1' : 'vol2' }));
roots.forEach((r, i) => { r.seq = i + 1; });
const rootByKey = new Map(roots.map(r => [r.key, r]));
const rawWords = parsed.words.map(w => Object.assign(w, { source: w.volume === 1 ? 'vol1' : 'vol2' }));

// ---------- 2. one record per word; extra roots go to word_roots ----------
const words = [], byWord = new Map(), extraRoots = [];
for (const w of rawWords) {
  w.word = CORRECTIONS[w.word.toLowerCase()] || w.word;
  if (!/^[A-Za-z][A-Za-z' -]*[A-Za-z]$/.test(w.word) || !zh(w.meaning) || !rootByKey.has(w.root)) continue;
  const k = w.word.toLowerCase();
  const prev = byWord.get(k);
  if (prev) {
    if (prev.root !== w.root) extraRoots.push([k, w.root]);
    // keep the richer entry's fields
    for (const f of ['mnemonic', 'example_en', 'example_cn', 'phonetic', 'level']) if (!prev[f] && w[f]) { prev[f] = w[f]; if (f === 'example_en') prev.example_cn = w.example_cn; }
    continue;
  }
  byWord.set(k, w);
  words.push(w);
}

// ---------- 3. morpheme tiles ----------
const variantsOf = key => rootByKey.get(key).variants.slice().sort((a, b) => b.length - a.length);
function fromMnemonic(w) {
  const mn = (w.mnemonic || '').replace(/^(拆|联想|读|记)[：:]\s*/, '');
  const cut = mn.search(/→/);
  const head = (cut < 0 ? mn : mn.slice(0, cut)).replace(/十/g, '+').replace(/\^/g, '');
  if (!/\+/.test(head)) return null;
  const pieces = head.split('+').map(s => s.trim()).filter(Boolean).map(s => {
    const m = s.match(/^([A-Za-z-]+)\s*(?:[（(](.*?)[）)]?)?\s*$/);
    return m ? { t: m[1].toLowerCase().replace(/-/g, ''), g: m[2] || '' } : null;
  });
  if (!pieces.every(Boolean) || pieces.length > 6 || pieces.length < 2) return null;
  const word = w.word.toLowerCase();
  let al = align(word, pieces.map(p => p.t));
  const ok = a => a && a.cost <= Math.min(2, Math.floor(word.length / 4)) && a.segs.every(s => s.length);
  let tail = '';
  if (!ok(al)) {
    // the note may cover only the front of the word (sur+rog for surrogate): match a prefix, the rest becomes suffix tiles
    al = null;
    const len = pieces.reduce((n, p) => n + p.t.length, 0);
    if (len >= 3 && len < word.length) for (const cut of [len, len - 1, len + 1]) {
      const a = align(word.slice(0, cut), pieces.map(p => p.t));
      if (a && a.cost === 0 && a.segs.every(s => s.length)) { al = a; tail = w.word.slice(cut); break; }
    }
    if (!al) return null;
  }
  const vs = variantsOf(w.root);
  const parts = pieces.map((p, i) => {
    let k = 'x';
    if (/前缀/.test(p.g)) k = 'p'; else if (/后缀/.test(p.g)) k = 's';
    const at = sliceStart(al.segs, i);
    return { t: w.word.slice(at, at + al.segs[i].length), g: cleanGloss(p.g), k };
  });
  let ri = parts.findIndex(p => p.k === 'x' && vs.some(v => p.t.toLowerCase() === v || (p.t.toLowerCase().startsWith(v) && p.t.length <= v.length + 2)));
  if (ri < 0) ri = parts.findIndex(p => p.k === 'x' && vs.some(v => p.t.toLowerCase().includes(v)));
  if (ri < 0) { // spelled differently in the book (ecut for secut): fall back to the piece glossed with the root's meaning
    const rm = new Set([...rootByKey.get(w.root).meaning].filter(c => /[\u4e00-\u9fa5]/.test(c)));
    ri = parts.findIndex(p => p.k === 'x' && p.t.length >= 2 && [...p.g].some(c => rm.has(c)));
  }
  if (ri >= 0) parts[ri].k = 'r';
  parts.forEach((p, i) => {
    if (p.k !== 'x') return;
    if (/连接/.test(p.g) || (p.t.length <= 1 && (i > 0 || !p.g))) { p.k = 'c'; return; }
    if (ri >= 0) p.k = i < ri ? 'p' : 's';
  });
  if (tail) parts.push(...affixTiles(tail, 's'));
  const story = cut < 0 ? '' : tidy(mn.slice(cut).replace(/^→\s*/, ''));
  return { parts, story };
}
const sliceStart = (segs, i) => segs.slice(0, i).reduce((n, s) => n + s.length, 0);

// affix glossary (filled after the first pass)
const gloss = { p: new Map(), s: new Map() };
function addGloss(k, t, g) {
  if (!g || /谐音|形似|联想|单词|读|[A-Za-z]/.test(g) || g.length > 12) return;
  const m = gloss[k].get(t) || new Map();
  m.set(g, (m.get(g) || 0) + 1);
  gloss[k].set(t, m);
}
const bestGloss = (k, t) => {
  const m = gloss[k].get(t);
  if (m) return [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
  return BUILTIN[k][t] || '';
};
const known = k => new Set([...Object.keys(BUILTIN[k]), ...[...gloss[k].entries()].filter(([, m]) => [...m.values()].reduce((a, b) => a + b, 0) >= 2).map(([t]) => t)]);
// split a stretch of letters into known affixes (prefixes left-to-right, suffixes right-to-left); one plain tile if that fails
function affixTiles(seg, k) {
  if (!seg) return [];
  const set = known(k), lower = seg.toLowerCase();
  const memo = new Map();
  const go = s => {
    if (!s) return [];
    if (memo.has(s)) return memo.get(s);
    let best = null;
    for (let n = Math.min(s.length, 7); n >= 1; n--) {
      const piece = k === 'p' ? s.slice(0, n) : s.slice(s.length - n);
      if (!set.has(piece) || (piece.length === 1 && s.length > 1 && k === 'p')) continue;
      const rest = go(k === 'p' ? s.slice(n) : s.slice(0, s.length - n));
      if (rest) { best = k === 'p' ? [piece, ...rest] : [...rest, piece]; break; }
    }
    memo.set(s, best);
    return best;
  };
  const split = go(lower);
  let at = 0;
  if (split && split.length <= 3) return split.map(t => { const o = seg.slice(at, at + t.length); at += t.length; return { t: o, g: bestGloss(k, t), k: t.length === 1 && !bestGloss(k, t) ? 'c' : k }; });
  return [{ t: seg, g: bestGloss(k, lower), k }];
}
// derive from another analysed word of the same root: in+capacity, captivat+ion
function fromBase(w, analysed) {
  const word = w.word, lower = word.toLowerCase();
  let best = null;
  for (const b of analysed) {
    if (b === w || b.root !== w.root || !b.parts || b.parts.length < 2) continue;
    const bw = b.word.toLowerCase();
    if (bw.length < 4 || bw.length >= lower.length) continue;
    const stems = [bw];
    if (/e$/.test(bw)) stems.push(bw.slice(0, -1));
    if (/y$/.test(bw)) stems.push(bw.slice(0, -1) + 'i', bw.slice(0, -1));
    for (const st of stems) {
      const i = lower.indexOf(st);
      if (i < 0 || i > 6 || lower.length - i - st.length > 9) continue;
      if (!best || st.length > best.st.length) best = { b, st, i };
      break;
    }
  }
  if (!best) return null;
  const { b, st, i } = best;
  let cut = b.word.length - st.length;
  const core = b.parts.map(p => ({ ...p }));
  while (cut > 0 && core.length) {
    const last = core[core.length - 1];
    const take = Math.min(cut, last.t.length);
    last.t = last.t.slice(0, last.t.length - take); cut -= take;
    if (!last.t) core.pop();
  }
  // re-case to this word's spelling
  let at = i;
  core.forEach(p => { p.t = word.slice(at, at + p.t.length); at += p.t.length; });
  const parts = [...affixTiles(word.slice(0, i), 'p'), ...core, ...affixTiles(word.slice(i + st.length), 's')];
  return { parts, base: b.word };
}
function fromRoot(w) {
  const lower = w.word.toLowerCase();
  const v = variantsOf(w.root).find(v => lower.includes(v));
  if (!v) return [{ t: w.word, g: '', k: 'x' }];
  const i = lower.indexOf(v);
  return [...affixTiles(w.word.slice(0, i), 'p'), { t: w.word.slice(i, i + v.length), g: '', k: 'r' }, ...affixTiles(w.word.slice(i + v.length), 's')];
}

// pass 1: the book's own breakdowns
for (const w of words) {
  const r = fromMnemonic(w);
  if (r) { w.parts = r.parts; w.story = r.story; continue; }
  w.story = w.mnemonic || '';
}
for (const w of words) if (w.parts) w.parts.forEach(p => { if (p.k === 'p' || p.k === 's') addGloss(p.k, p.t.toLowerCase(), p.g); });
// pass 2: derive from analysed relatives, repeating so chains (capture -> recapture) resolve
for (let round = 0; round < 3; round++) {
  const analysed = words.filter(w => w.parts && w.parts.length > 1);
  let changed = 0;
  for (const w of words) {
    if (w.parts) continue;
    const r = fromBase(w, analysed);
    if (r) { w.parts = r.parts; w.base = r.base; w.derived = true; changed++; }
  }
  if (!changed) break;
}
// pass 3: locate the root inside the word
for (const w of words) if (!w.parts) { w.parts = fromRoot(w); w.derived = true; }
// fill the root tile's meaning and check the tiles spell the word
for (const w of words) {
  const r = rootByKey.get(w.root);
  w.parts.forEach(p => {
    if (p.k === 'r' && !p.g) p.g = r.meaning.replace(/[（(].*?[）)]/g, '').split(/[，；、]/)[0];
    if ((p.k === 'p' || p.k === 's') && !p.g) p.g = bestGloss(p.k, p.t.toLowerCase());
  });
  if (w.parts.map(p => p.t).join('').toLowerCase() !== w.word.toLowerCase()) throw new Error('tiles do not spell ' + w.word + ': ' + JSON.stringify(w.parts));
}

// ---------- 4. stations: one or more neighbouring roots, 8–12 words each ----------
const wordsByRoot = new Map();
words.forEach((w, i) => { if (!wordsByRoot.has(w.root)) wordsByRoot.set(w.root, []); wordsByRoot.get(w.root).push(i); });
const levels = [], starts = [];
for (const vol of [1, 2]) {
  starts.push(levels.length);
  let buf = { roots: [], words: [] };
  const flush = () => { if (buf.words.length) { levels.push(buf); buf = { roots: [], words: [] }; } };
  for (const r of roots.filter(r => r.volume === vol)) {
    const ws = wordsByRoot.get(r.key);
    if (!ws) continue;
    if (ws.length >= 13) {
      flush();
      const k = Math.ceil(ws.length / 10), size = Math.ceil(ws.length / k);
      for (let i = 0, n = 1; i < ws.length; i += size, n++) levels.push({ roots: [r.key], words: ws.slice(i, i + size), part: n, of: k });
      continue;
    }
    if (buf.words.length + ws.length > 12) flush();
    buf.roots.push(r.key); buf.words.push(...ws);
    if (buf.words.length >= 8) flush();
  }
  flush();
}
// fold very small stations into the one before when the result stays short
for (let i = levels.length - 1; i > 0; i--) {
  const a = levels[i - 1], b = levels[i];
  if (starts.includes(i) || b.words.length >= 6 || a.words.length + b.words.length > 14 || a.of || b.of) continue;
  a.roots.push(...b.roots.filter(r => !a.roots.includes(r))); a.words.push(...b.words); levels.splice(i, 1);
  for (let s = 0; s < starts.length; s++) if (starts[s] > i) starts[s]--;
}
levels.forEach(l => { l.key = l.roots.join('+') + (l.of ? '~' + l.part : ''); });

// ---------- 5. write SQLite ----------
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
for (const f of [DB_FILE, DB_FILE + '-wal', DB_FILE + '-shm']) fs.rmSync(f, { force: true });
const db = new DatabaseSync(DB_FILE);
db.exec(`
PRAGMA journal_mode = DELETE;
CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE roots (
  id INTEGER PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,          -- variants joined by commas, e.g. "cap,cip,cup"
  display TEXT NOT NULL,             -- as printed in the book, e.g. "cap, cip, cup"
  variants TEXT NOT NULL,            -- JSON array
  meaning TEXT NOT NULL,             -- 含义
  mnemonic TEXT NOT NULL DEFAULT '', -- 巧记
  volume INTEGER NOT NULL,           -- 1 上册, 2 下册
  seq INTEGER NOT NULL,
  source TEXT NOT NULL               -- vol1 | vol2
);
CREATE TABLE words (
  id INTEGER PRIMARY KEY,
  word TEXT NOT NULL UNIQUE COLLATE NOCASE,
  root_id INTEGER NOT NULL REFERENCES roots(id),
  base_word TEXT,                    -- the word this one is built from, when known
  pos TEXT NOT NULL DEFAULT '',      -- "n." / "v./n."
  meaning TEXT NOT NULL,             -- "n. 能力；容量"
  phonetic TEXT NOT NULL DEFAULT '',
  exam_level TEXT NOT NULL DEFAULT '', -- 初 四 六 研 托 G …
  mnemonic TEXT NOT NULL DEFAULT '', -- the book's 记 text
  story TEXT NOT NULL DEFAULT '',    -- the part of the mnemonic after the breakdown
  parts TEXT NOT NULL,               -- JSON [{t, g, k}] k: p prefix, r root, s suffix, c link, x other
  parts_from TEXT NOT NULL,          -- book | derived
  example_en TEXT NOT NULL DEFAULT '',
  example_cn TEXT NOT NULL DEFAULT '',
  volume INTEGER NOT NULL,
  seq INTEGER NOT NULL,
  source TEXT NOT NULL
);
CREATE TABLE word_roots (word_id INTEGER NOT NULL REFERENCES words(id), root_id INTEGER NOT NULL REFERENCES roots(id), PRIMARY KEY (word_id, root_id));
CREATE TABLE affixes (kind TEXT NOT NULL CHECK (kind IN ('p','s')), text TEXT NOT NULL, gloss TEXT NOT NULL, uses INTEGER NOT NULL, PRIMARY KEY (kind, text));
CREATE TABLE levels (id INTEGER PRIMARY KEY, key TEXT NOT NULL UNIQUE, seq INTEGER NOT NULL, volume INTEGER NOT NULL);
CREATE TABLE level_roots (level_id INTEGER NOT NULL REFERENCES levels(id), root_id INTEGER NOT NULL REFERENCES roots(id), PRIMARY KEY (level_id, root_id));
CREATE TABLE level_words (level_id INTEGER NOT NULL REFERENCES levels(id), word_id INTEGER NOT NULL REFERENCES words(id), seq INTEGER NOT NULL, PRIMARY KEY (level_id, word_id));
CREATE INDEX words_root ON words(root_id);
`);
db.exec('BEGIN');
const insRoot = db.prepare('INSERT INTO roots (id,key,display,variants,meaning,mnemonic,volume,seq,source) VALUES (?,?,?,?,?,?,?,?,?)');
roots.forEach((r, i) => { r.id = i + 1; insRoot.run(r.id, r.key, r.display, JSON.stringify(r.variants), r.meaning, r.mnemonic || '', r.volume, r.seq, r.source); });
const insWord = db.prepare('INSERT INTO words (id,word,root_id,base_word,pos,meaning,phonetic,exam_level,mnemonic,story,parts,parts_from,example_en,example_cn,volume,seq,source) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
const insWR = db.prepare('INSERT OR IGNORE INTO word_roots (word_id, root_id) VALUES (?,?)');
words.forEach((w, i) => {
  w.id = i + 1;
  insWord.run(w.id, w.word, rootByKey.get(w.root).id, w.base || null, w.pos || '', w.meaning, w.phonetic || '', w.level || '', w.mnemonic || '', w.story || '', JSON.stringify(w.parts), w.derived ? 'derived' : 'book', w.example_en || '', w.example_cn || '', w.volume, i + 1, w.source);
  insWR.run(w.id, rootByKey.get(w.root).id);
});
for (const [k, root] of extraRoots) insWR.run(byWord.get(k).id, rootByKey.get(root).id);
const insAff = db.prepare('INSERT INTO affixes (kind,text,gloss,uses) VALUES (?,?,?,?)');
for (const k of ['p', 's']) {
  const uses = new Map();
  words.forEach(w => w.parts.forEach(p => { if (p.k === k && p.t.length > 1) uses.set(p.t.toLowerCase(), (uses.get(p.t.toLowerCase()) || 0) + 1); }));
  for (const [t, n] of uses) { const g = bestGloss(k, t); if (n >= 3 && g) insAff.run(k, t, g, n); }
}
const insLv = db.prepare('INSERT INTO levels (id,key,seq,volume) VALUES (?,?,?,?)');
const insLR = db.prepare('INSERT INTO level_roots (level_id, root_id) VALUES (?,?)');
const insLW = db.prepare('INSERT INTO level_words (level_id, word_id, seq) VALUES (?,?,?)');
levels.forEach((l, i) => {
  insLv.run(i + 1, l.key, i + 1, rootByKey.get(l.roots[0]).volume);
  l.roots.forEach(r => insLR.run(i + 1, rootByKey.get(r).id));
  l.words.forEach((wi, n) => insLW.run(i + 1, words[wi].id, n + 1));
});
const insMeta = db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)');
insMeta.run('schema', '1');
insMeta.run('built', new Date().toISOString());
insMeta.run('volume_starts', JSON.stringify(starts));
db.exec('COMMIT');
db.close();

// ---------- 6. export the static bundle from the database ----------
const { exportBundle } = require('../lib/lexicon');
const js = exportBundle(DB_FILE);
fs.writeFileSync(path.join(ROOT_DIR, 'public', 'data.js'), js);

const count = (f, v) => words.filter(w => f(w) && (v == null || w.volume === v)).length;
console.log(`roots ${roots.length} (上册 ${vol1Roots.length}, 下册 ${roots.length - vol1Roots.length})`);
console.log(`words ${words.length} (上册 ${count(() => true, 1)}, 下册 ${count(() => true, 2)}), extra root links ${extraRoots.length}`);
console.log(`tiles from book ${count(w => !w.derived)}, derived from a relative ${count(w => w.derived && w.base)}, root only ${count(w => w.derived && !w.base && w.parts.length > 1)}, unsplit ${count(w => w.parts.length < 2)}`);
console.log(`examples ${count(w => w.example_en)}, phonetics ${count(w => w.phonetic)}, exam tags ${count(w => w.level)}`);
console.log(`stations ${levels.length} (volume starts ${starts.join(', ')}), sizes ${Math.min(...levels.map(l => l.words.length))}–${Math.max(...levels.map(l => l.words.length))}`);
console.log(`public/data.js ${(js.length / 1024).toFixed(0)} KB`);
