// Read the word database and shape it for the game client.
process.removeAllListeners('warning'); // node:sqlite prints an ExperimentalWarning on load
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const LEGACY = path.join(__dirname, '..', 'data', 'legacy-v1.json');
const LEGACY_STATIONS = path.join(__dirname, '..', 'data', 'legacy-stations.json');

function bundle(file) {
  const db = new DatabaseSync(file, { readOnly: true });
  try {
    const roots = db.prepare('SELECT id, key, display, meaning, mnemonic, volume FROM roots ORDER BY seq').all();
    const rootKey = new Map(roots.map(r => [r.id, r.key]));
    const words = db.prepare('SELECT id, word, root_id, meaning, phonetic, exam_level, story, mnemonic, parts, parts_from, example_en, example_cn FROM words ORDER BY seq').all();
    const index = new Map(words.map((w, i) => [w.id, i]));
    const levels = db.prepare('SELECT id, key FROM levels ORDER BY seq').all();
    const lr = db.prepare('SELECT r.key FROM level_roots lr JOIN roots r ON r.id = lr.root_id WHERE lr.level_id = ? ORDER BY r.seq');
    const lw = db.prepare('SELECT word_id FROM level_words WHERE level_id = ? ORDER BY seq');
    const affix = kind => db.prepare('SELECT text t, gloss g, uses n FROM affixes WHERE kind = ? ORDER BY uses DESC, text').all(kind);
    const meta = Object.fromEntries(db.prepare('SELECT key, value FROM meta').all().map(m => [m.key, m.value]));
    const out = {
      built: meta.built,
      roots: roots.map(r => ({ r: r.key, d: r.display, m: r.meaning, j: r.mnemonic, v: r.volume })),
      words: words.map(w => {
        const o = { w: w.word, d: w.meaning, r: rootKey.get(w.root_id), p: JSON.parse(w.parts) };
        // story: what the book says after the breakdown; when the tiles were derived, show the whole 记 text
        const s = w.parts_from === 'book' ? w.story : w.mnemonic;
        if (s) o.s = s;
        if (w.example_en && w.example_cn) { o.e = w.example_en; o.z = w.example_cn; }
        if (w.phonetic) o.ph = w.phonetic;
        if (w.exam_level) o.lv = w.exam_level;
        return o;
      }),
      levels: levels.map(l => ({ k: l.key, roots: lr.all(l.id).map(x => x.key), words: lw.all(l.id).map(x => index.get(x.word_id)) })),
      starts: JSON.parse(meta.volume_starts || '[0]'),
      // identifies this station layout; saves record it so later layout changes can tell old saves apart
      layout: require('crypto').createHash('sha1').update(levels.map(l => l.key + ':' + lw.all(l.id).length).join('|')).digest('hex').slice(0, 10),
      affixes: { p: affix('p'), s: affix('s') },
    };
    try { out.legacy = JSON.parse(fs.readFileSync(LEGACY, 'utf8')); delete out.legacy.note; } catch { /* no old saves to migrate */ }
    try { out.legacyStations = JSON.parse(fs.readFileSync(LEGACY_STATIONS, 'utf8')).stations; } catch { /* nothing renamed */ }
    return out;
  } finally { db.close(); }
}

const exportBundle = file => 'window.RQ_DATA=' + JSON.stringify(bundle(file)) + ';\n';

// Small read-only query helpers for the API.
function openLexicon(file) {
  const db = new DatabaseSync(file, { readOnly: true });
  const q = {
    roots: db.prepare(`SELECT r.key, r.display, r.meaning, r.mnemonic, r.volume, COUNT(wr.word_id) AS words
      FROM roots r LEFT JOIN word_roots wr ON wr.root_id = r.id GROUP BY r.id ORDER BY r.seq`),
    byRoot: db.prepare(`SELECT w.word, w.meaning, w.phonetic, w.exam_level, w.mnemonic, w.parts, w.example_en, w.example_cn
      FROM word_roots wr JOIN words w ON w.id = wr.word_id JOIN roots r ON r.id = wr.root_id WHERE r.key = ? ORDER BY w.seq`),
    search: db.prepare(`SELECT w.word, w.meaning, r.key AS root FROM words w JOIN roots r ON r.id = w.root_id
      WHERE w.word LIKE ? ESCAPE '\\' OR w.meaning LIKE ? ESCAPE '\\' ORDER BY length(w.word), w.word LIMIT 50`),
  };
  const row = w => Object.assign(w, { parts: JSON.parse(w.parts) });
  return {
    roots: () => q.roots.all(),
    wordsOfRoot: key => q.byRoot.all(key).map(row),
    search: text => { const like = '%' + text.replace(/[\\%_]/g, c => '\\' + c) + '%'; return q.search.all(text.replace(/[\\%_]/g, c => '\\' + c) + '%', like); },
    close: () => db.close(),
  };
}

module.exports = { bundle, exportBundle, openLexicon };
