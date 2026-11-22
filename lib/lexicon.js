// Read the word database and shape it for the site and the API.
process.removeAllListeners('warning'); // node:sqlite prints an ExperimentalWarning on load
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

const LEGACY = path.join(__dirname, '..', 'data', 'legacy.json');

// Everything the game needs, as one compact JSON document.
function bundle(file) {
  const db = new DatabaseSync(file, { readOnly: true });
  try {
    const groups = db.prepare('SELECT id, category, num, morphemes, variants, english, description, meaning FROM groups ORDER BY id').all();
    const gIndex = new Map(groups.map((g, i) => [g.id, i]));
    const senses = db.prepare('SELECT id, group_id, seq, text, english, meaning FROM senses ORDER BY group_id, seq').all();
    const sIndex = new Map();
    const outGroups = groups.map(g => ({ c: g.category, n: g.num, m: g.morphemes, v: JSON.parse(g.variants), en: g.english, zh: g.meaning, d: g.description, ss: [] }));
    for (const s of senses) { const og = outGroups[gIndex.get(s.group_id)]; sIndex.set(s.id, og.ss.length); og.ss.push({ t: s.text, en: s.english, zh: s.meaning }); }
    const entries = db.prepare('SELECT * FROM entries ORDER BY id').all();
    const eIndex = new Map(entries.map((e, i) => [e.id, i]));
    const stations = db.prepare('SELECT id, key, category FROM stations ORDER BY seq').all();
    const sg = db.prepare('SELECT group_id FROM station_groups WHERE station_id = ? ORDER BY group_id');
    const se = db.prepare('SELECT entry_id FROM station_entries WHERE station_id = ? ORDER BY seq');
    const meta = Object.fromEntries(db.prepare('SELECT key, value FROM meta').all().map(m => [m.key, m.value]));
    const out = {
      built: meta.built,
      quotes: JSON.parse(meta.quotes || '[]'),
      groups: outGroups,
      entries: entries.map(e => {
        const o = { w: e.word, ph: e.phonetic, st: e.stars, d: e.meaning, g: gIndex.get(e.group_id), p: JSON.parse(e.tiles) };
        if (e.sense_id != null) o.se = sIndex.get(e.sense_id);
        if (e.story) o.s = e.story;
        if (e.mnemonic) o.mn = e.mnemonic;
        if (e.example_en) { o.e = e.example_en; o.z = e.example_cn; }
        if (e.usage) o.u = e.usage;
        if (e.etymology) o.y = e.etymology;
        if (e.origin) o.o = e.origin;
        return o;
      }),
      stations: stations.map(s => ({ k: s.key, c: s.category, g: sg.all(s.id).map(x => gIndex.get(x.group_id)), e: se.all(s.id).map(x => eIndex.get(x.entry_id)) })),
    };
    // identifies this station layout; saves record it, so a later layout can carry them over word by word
    out.layout = crypto.createHash('sha1').update(out.stations.map(s => s.k + ':' + s.e.length).join('|')).digest('hex').slice(0, 10);
    try { const lg = JSON.parse(fs.readFileSync(LEGACY, 'utf8')); delete lg.note; out.legacy = lg; } catch { /* no old saves to carry over */ }
    return out;
  } finally { db.close(); }
}
const exportData = file => JSON.stringify(bundle(file));

// Small read-only queries for the API.
function openLexicon(file) {
  const db = new DatabaseSync(file, { readOnly: true });
  const q = {
    groups: db.prepare(`SELECT g.category, g.num, g.morphemes, g.english, g.meaning, COUNT(e.id) AS words
      FROM groups g LEFT JOIN entries e ON e.group_id = g.id WHERE (? = '' OR g.category = ?) GROUP BY g.id ORDER BY g.id`),
    ofGroup: db.prepare(`SELECT e.word, e.phonetic, e.stars, e.meaning, e.mnemonic, e.story, e.tiles, e.example_en, e.example_cn, e.usage
      FROM entries e JOIN groups g ON g.id = e.group_id WHERE g.category = ? AND g.num = ? ORDER BY e.id`),
    search: db.prepare(`SELECT e.word, e.meaning, g.category, g.morphemes FROM entries e JOIN groups g ON g.id = e.group_id
      WHERE e.word LIKE ? ESCAPE '\\' OR e.meaning LIKE ? ESCAPE '\\' ORDER BY length(e.word), e.word LIMIT 50`),
  };
  const esc = t => t.replace(/[\\%_]/g, c => '\\' + c);
  return {
    groups: cat => q.groups.all(cat || '', cat || ''),
    wordsOfGroup: (cat, num) => q.ofGroup.all(cat, num).map(w => Object.assign(w, { tiles: JSON.parse(w.tiles) })),
    search: text => q.search.all(esc(text) + '%', '%' + esc(text) + '%'),
    close: () => db.close(),
  };
}

module.exports = { bundle, exportData, openLexicon };
