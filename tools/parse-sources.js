// Read the two structured source files into one unified record shape.
//   sources/vol1.md  上册: Markdown, "### N. 词根：x" sections with "* **word** [pos] 释义 ｜ **记**：… ｜ **例句**：en (zh)"
//   sources/vol2.md  下册: a ```json block of [{root, meaning, mnemonic, words:[{word, level, phonetic, pos, cn, analysis, derivatives[], example_en, example_cn}]}]
// Output (returned, and written to data/lexicon.json when run directly):
//   { roots: [{key, display, variants[], meaning, mnemonic, volume, seq}],
//     words: [{word, root, head, pos, meaning, phonetic, level, mnemonic, example_en, example_cn, volume, seq}] }
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'sources');
const zh = s => /[一-龥]/.test(s || '');
const tidy = s => String(s || '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([，；。：、“”）])\s*/g, '$1')
  .replace(/\s*（\s*/g, '（')
  .trim();
const POS = '(?:vt|vi|v|n|a|ad|adj|adv|prep|conj|pron|int|num|art|pl)';
const normPos = p => p.toLowerCase().replace(/\s/g, '').replace(/adj\./g, 'a.').replace(/adv\./g, 'ad.');

// "cap, cip, cup" / "ac(u)" / "pend, pens (1)" -> key "cap,cip,cup", variants ["cap","cip","cup"]
function rootKey(display) {
  const d = display.replace(/[（(]\s*\d\s*[）)]/g, '').trim();
  const vs = [];
  for (const raw of d.split(/[,，、]/)) {
    const t = raw.trim().toLowerCase();
    if (!t) continue;
    const m = t.match(/^([a-z]+)\(([a-z]+)\)$/); // ac(u) -> ac, acu
    if (m) { vs.push(m[1], m[1] + m[2]); continue; }
    if (/^[a-z]+$/.test(t)) vs.push(t);
  }
  return [...new Set(vs)];
}

// ---------- 上册 (Markdown) ----------
function parseVol1() {
  const lines = fs.readFileSync(path.join(SRC, 'vol1.md'), 'utf8').split('\n');
  const roots = [], words = [];
  let root = null;
  for (const raw of lines) {
    const l = raw.trim();
    let m;
    if ((m = l.match(/^###\s*\d+\.\s*词根[：:]\s*(.+)$/))) {
      const display = m[1].trim();
      root = { display, variants: rootKey(display), meaning: '', mnemonic: '', volume: 1, seq: roots.length + 1 };
      root.key = root.variants.join(',');
      roots.push(root);
      continue;
    }
    if (!root) continue;
    if ((m = l.match(/^\*\s*\*\*含义\*\*[：:]\s*(.+)$/))) { root.meaning = tidy(m[1]); continue; }
    if ((m = l.match(/^\*\s*\*\*巧记\*\*[：:]\s*(.+)$/))) { root.mnemonic = tidy(m[1]); continue; }
    if (!/^\*\s*\*\*[A-Za-z]/.test(l)) continue;
    parseVol1Line(l.replace(/^\*\s*/, ''), root, words);
  }
  return { roots, words };
}

// One bullet can hold several words: "**a** [n.] x ｜ **b** [a.] y", "**a** / **b** [n.] x", plus 记 / 例句 fields.
function parseVol1Line(line, root, out) {
  const segs = line.split(/\s*｜\s*/);
  const entries = [];
  for (const seg of segs) {
    let m;
    if ((m = seg.match(/^\*\*记\*\*[：:]\s*(.*)$/))) { if (entries.length) entries[entries.length - 1].mnemonic = tidy(m[1]); continue; }
    if ((m = seg.match(/^\*\*例句\*\*[：:]\s*(.*)$/))) {
      if (!entries.length) continue;
      const ex = m[1].trim();
      const mm = ex.match(/^(.*?)\s*[（(]([^()（）]*[一-龥][^()（）]*)[）)]\s*$/);
      const e = entries[entries.length - 1];
      if (mm) { e.example_en = mm[1].trim(); e.example_cn = tidy(mm[2]); } else if (ex && !zh(ex)) e.example_en = ex;
      continue;
    }
    if (!/^\*\*[A-Za-z]/.test(seg)) continue;
    // headwords at the start: **a** / **b**
    const heads = [];
    let rest = seg;
    while ((m = rest.match(/^\s*(?:\/\s*)?\*\*([A-Za-z][A-Za-z' -]*?)\*\*\s*/))) { heads.push(m[1].trim()); rest = rest.slice(m[0].length); }
    // pos blocks: [n.] 行为 [v.] 行动 ; also "[a./ad.]"
    const parts = [];
    const re = /\[([^\]]+)\]\s*([^\[]*)/g;
    let pm, posList = [];
    while ((pm = re.exec(rest))) {
      const p = normPos(pm[1]);
      let cn = tidy(pm[2].replace(/\*\*/g, ''));
      if (!/^[a-z./]+$/.test(p)) continue;
      posList.push(p);
      parts.push(cn ? `${p} ${cn}` : p);
    }
    const meaning = tidy(parts.join(' '));
    if (!heads.length || !zh(meaning)) continue;
    for (const w of heads) entries.push({ word: w, pos: [...new Set(posList)].join('/'), meaning, mnemonic: '', example_en: '', example_cn: '' });
  }
  for (const e of entries) out.push(Object.assign(e, { root: root.key, head: null, phonetic: '', level: '', volume: 1 }));
}

// ---------- 下册 (JSON) ----------
function parseVol2() {
  const t = fs.readFileSync(path.join(SRC, 'vol2.md'), 'utf8');
  const s = t.indexOf('```json') + 7;
  const data = JSON.parse(t.slice(s, t.indexOf('```', s)));
  const roots = [], words = [];
  const lv = x => (x && x !== '-' ? String(x).trim() : '');
  for (const r of data) {
    const variants = rootKey(r.root);
    let key = variants.join(',');
    const sense = (r.root.match(/[（(]\s*(\d)\s*[）)]/) || [])[1];
    if (sense) key += '#' + sense; // pend,pens (1) and (2) are two different roots
    const root = { key, display: r.root.trim(), variants, meaning: tidy(r.meaning), mnemonic: tidy(r.mnemonic), volume: 2, seq: roots.length + 1 };
    roots.push(root);
    for (const w of r.words) {
      const p = normPos(w.pos || '');
      words.push({
        word: String(w.word).trim(), root: key, head: null, pos: p, meaning: tidy(`${p} ${w.cn}`),
        phonetic: String(w.phonetic || '').replace(/^\[|\]$/g, '').trim(), level: lv(w.level),
        mnemonic: tidy(w.analysis), example_en: String(w.example_en || '').trim(), example_cn: tidy(w.example_cn), volume: 2,
      });
      for (const d of w.derivatives || []) {
        // "noted (a. 著名的 [初])"
        const m = String(d).match(/^\s*([A-Za-z][A-Za-z' -]*?)\s*[（(]\s*(.*?)\s*[）)]\s*$/);
        if (!m) continue;
        let body = m[2], level = '';
        const lm = body.match(/\s*\[([^\]]+)\]\s*$/);
        if (lm) { level = lv(lm[1]); body = body.slice(0, lm.index); }
        const pm = body.match(new RegExp('^(' + POS + '\\.(?:\\s*/\\s*' + POS + '\\.)?)\\s*(.*)$', 'i'));
        const pos = pm ? normPos(pm[1]) : '';
        const cn = pm ? pm[2] : body;
        if (!zh(cn)) continue;
        words.push({ word: m[1].trim(), root: key, head: String(w.word).trim(), pos, meaning: tidy(pos ? `${pos} ${cn}` : cn), phonetic: '', level, mnemonic: '', example_en: '', example_cn: '', volume: 2 });
      }
    }
  }
  return { roots, words };
}

function parseAll() {
  const a = parseVol1(), b = parseVol2();
  return { roots: [...a.roots, ...b.roots], words: [...a.words, ...b.words] };
}

module.exports = { parseAll, rootKey, tidy };

if (require.main === module) {
  const { roots, words } = parseAll();
  const by = v => words.filter(w => w.volume === v);
  console.log('roots', roots.length, 'words', words.length, 'vol1', by(1).length, 'vol2', by(2).length);
  console.log('with mnemonic', words.filter(w => w.mnemonic).length, 'with example', words.filter(w => w.example_en).length);
}
