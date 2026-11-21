// Read the two structured source files into one unified record shape.
//   sources/vol1.md  上册: Markdown, "### N. 词根：x" sections with "* **word** [pos] 释义 ｜ **记**：… ｜ **例句**：en (zh)"
//   sources/vol2.md  下册: Markdown, "### N. 词根 x" sections with "* **word** [音标] *n.* 释义" lines and indented 【记】/【例句】
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

// ---------- 下册 (Markdown, second layout) ----------
// "### N. 词根 x" ; "* **含义**：" ; "* **词根巧记**：" (+ indented lines) ;
// "  * **word** [phon] *n.* 释义 *v.* 释义（inline note）" — several words may share a line, split by "；**word**" ;
// "    * 【记】…" and "    * 【例句】English.（中文。）" belong to the first word of the line above.
function noteToMnemonic(note) {
  // "pass通过 + port港口" -> "pass(通过)+port(港口)"; keeps any "→ …" tail
  const cut = note.search(/→/);
  const head = cut < 0 ? note : note.slice(0, cut);
  if (!/\+/.test(head)) return note;
  const pieces = head.split('+').map(x => x.trim()).filter(Boolean).map(x => {
    const m = x.match(/^([A-Za-z]+)-?\s*(.*)$/);
    return m ? (m[2] ? `${m[1]}(${m[2].trim()})` : m[1]) : null;
  });
  if (!pieces.every(Boolean)) return note;
  return pieces.join('+') + (cut < 0 ? '' : note.slice(cut));
}
function parseVol2() {
  const lines = fs.readFileSync(path.join(SRC, 'vol2.md'), 'utf8').split('\n');
  const roots = [], words = [];
  let root = null, inTip = false, lineHead = null;
  for (const raw of lines) {
    const l = raw.trim();
    let m;
    if ((m = l.match(/^###\s*\d+\.\s*词根\s*(.+?)\s*$/))) {
      const cont = /（续）|\(续\)/.test(m[1]);
      const display = m[1].replace(/（续）|\(续\)/, '').trim();
      inTip = false; lineHead = null;
      if (cont && root && root.display === display) continue;
      const variants = rootKey(display);
      let key = variants.join(',');
      const sense = (display.match(/[（(]\s*(\d)\s*[）)]/) || [])[1];
      if (sense) key += '#' + sense; // pend, pens (1) and (2) are two different roots
      root = { key, display, variants, meaning: '', mnemonic: '', volume: 2, seq: roots.length + 1 };
      roots.push(root);
      continue;
    }
    if (!root) continue;
    if ((m = l.match(/^\*\s*\*\*含义\*\*[：:]\s*(.*)$/))) { root.meaning = tidy(m[1]); inTip = false; continue; }
    if ((m = l.match(/^\*\s*\*\*(?:词根)?巧记\*\*[：:]\s*(.*)$/))) { root.mnemonic = tidy(m[1]); inTip = true; continue; }
    if (/^\*\s*\*\*关联/.test(l)) { inTip = false; continue; }
    if (inTip && /^\*\s+[^*【]/.test(l) && /^ {2}\*/.test(raw)) { root.mnemonic = tidy((root.mnemonic ? root.mnemonic + ' ' : '') + l.replace(/^\*\s*/, '')); continue; }
    if ((m = l.match(/^\*\s*【记】\s*(.*)$/))) { if (lineHead && !lineHead.mnemonic) lineHead.mnemonic = tidy(m[1]); continue; }
    if ((m = l.match(/^\*\s*【例句】\s*(.*)$/))) {
      if (!lineHead) continue;
      const mm = m[1].match(/^(.*?)\s*[（(]([^()（）]*[一-龥][^()（）]*)[）)]\s*$/);
      if (mm) { lineHead.example_en = mm[1].trim(); lineHead.example_cn = tidy(mm[2]); }
      continue;
    }
    if (!/^\*\s*\*\*[A-Za-z]/.test(l)) continue;
    inTip = false;
    lineHead = null;
    for (const seg of l.replace(/^\*\s*/, '').split(/[；;]\s*(?=\*\*[A-Za-z])/)) {
      for (const e of parseVol2Segment(seg, root)) {
        words.push(e);
        if (!lineHead) lineHead = e;
      }
    }
  }
  return { roots, words };
}
function parseVol2Segment(seg, root) {
  // "**a** / **b** *v.* …" gives both words the same entry
  const heads = [];
  let rest = seg, m;
  while ((m = rest.match(/^\s*(?:\/\s*)?\*\*([A-Za-z][A-Za-z' -]*?)\*\*\s*/))) { heads.push(m[1].trim()); rest = rest.slice(m[0].length); }
  if (!heads.length) return [];
  rest = rest.trim();
  let phonetic = '', note = '';
  const ph = rest.match(/^\[([^\]]*)\]\s*/);
  if (ph) { phonetic = ph[1].trim(); rest = rest.slice(ph[0].length); }
  const nt = rest.match(/\s*（([^（）]*(?:（[^（）]*）[^（）]*)*)）\s*$/);
  if (nt) { note = nt[1].trim(); rest = rest.slice(0, nt.index); }
  const blocks = [], posList = [];
  const re = /\*([a-zA-Z./ ]+\.)\*\s*([^*]*)/g;
  let pm;
  while ((pm = re.exec(rest))) {
    const p = normPos(pm[1]);
    const cn = tidy(pm[2]).replace(/[；;，,]+$/, '');
    posList.push(p);
    blocks.push(cn ? `${p} ${cn}` : p);
  }
  const meaning = tidy(blocks.join(' '));
  if (!zh(meaning)) return [];
  return heads.map(word => ({ word, root: root.key, head: null, pos: [...new Set(posList)].join('/'), meaning, phonetic, level: '', mnemonic: note ? noteToMnemonic(tidy(note)) : '', example_en: '', example_cn: '', volume: 2 }));
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
