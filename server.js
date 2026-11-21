// 词根驿站 — zero-dependency server: static files, word data from SQLite, accounts and progress in SQLite.
// Run: node server.js   (PORT and DATA_DIR are optional environment variables; needs Node 22.13+)
process.removeAllListeners('warning'); // node:sqlite prints an ExperimentalWarning on load
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const { exportBundle, openLexicon } = require('./lib/lexicon');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const LEXICON_DB = path.join(__dirname, 'data', 'lexicon.db');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const APP_DB = path.join(DATA_DIR, 'app.db');
const SESSION_DAYS = 30;

if (!fs.existsSync(LEXICON_DB)) { console.error('缺少词库 data/lexicon.db，请先运行 node tools/build-db.js'); process.exit(1); }
const lexicon = openLexicon(LEXICON_DB);
const DATA_JS = exportBundle(LEXICON_DB);

// ---------- accounts database ----------
fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(APP_DB);
db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL UNIQUE,
  salt TEXT NOT NULL,
  hash TEXT NOT NULL,
  created INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS progress (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  json TEXT NOT NULL,
  updated INTEGER NOT NULL
);
`);
const Q = {
  userByKey: db.prepare('SELECT * FROM users WHERE name_key = ?'),
  addUser: db.prepare('INSERT INTO users (name, name_key, salt, hash, created) VALUES (?, ?, ?, ?, ?)'),
  addSession: db.prepare('INSERT INTO sessions (token_hash, user_id, expires) VALUES (?, ?, ?)'),
  session: db.prepare('SELECT s.token_hash, s.expires, u.id, u.name FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?'),
  dropSession: db.prepare('DELETE FROM sessions WHERE token_hash = ?'),
  dropExpired: db.prepare('DELETE FROM sessions WHERE expires < ?'),
  progress: db.prepare('SELECT json FROM progress WHERE user_id = ?'),
  saveProgress: db.prepare('INSERT INTO progress (user_id, json, updated) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET json = excluded.json, updated = excluded.updated'),
};

// One-time move from the old accounts.json file.
const OLD = path.join(DATA_DIR, 'accounts.json');
if (fs.existsSync(OLD)) {
  try {
    const old = JSON.parse(fs.readFileSync(OLD, 'utf8'));
    db.exec('BEGIN');
    for (const [key, u] of Object.entries(old.users || {})) {
      if (Q.userByKey.get(key)) continue;
      const { lastInsertRowid } = Q.addUser.run(u.name, key, u.salt, u.hash, u.created || Date.now());
      if (u.progress) Q.saveProgress.run(Number(lastInsertRowid), JSON.stringify(u.progress), u.updated || Date.now());
    }
    db.exec('COMMIT');
    fs.renameSync(OLD, OLD + '.migrated');
    console.log('已把 accounts.json 里的账号迁移到 app.db');
  } catch (e) { try { db.exec('ROLLBACK'); } catch { /* not in a transaction */ } console.error('迁移 accounts.json 失败：', e.message); }
}

const hash = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex');
const tokenKey = t => crypto.createHash('sha256').update(t).digest('hex'); // only token hashes are stored
function newSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  Q.addSession.run(tokenKey(token), userId, Date.now() + SESSION_DAYS * 864e5);
  res.setHeader('Set-Cookie', `rq_sid=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 86400}`);
}
function currentUser(req) {
  const m = /(?:^|;\s*)rq_sid=([a-f0-9]{64})/.exec(req.headers.cookie || '');
  if (!m) return null;
  const s = Q.session.get(tokenKey(m[1]));
  if (!s) return null;
  if (s.expires < Date.now()) { Q.dropSession.run(s.token_hash); return null; }
  return { key: s.token_hash, id: s.id, name: s.name };
}
const loadProgress = id => { const r = Q.progress.get(id); try { return r ? JSON.parse(r.json) : null; } catch { return null; } };
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
function readBody(req) {
  return new Promise((ok, bad) => {
    let b = '';
    req.on('data', c => { b += c; if (b.length > 5e5) { bad(new Error('too large')); req.destroy(); } });
    req.on('end', () => { try { ok(JSON.parse(b || '{}')); } catch (e) { bad(e); } });
  });
}
// slow down password guessing: 8 failed tries per name+address per 10 minutes
const fails = new Map();
function tooMany(key) { const f = fails.get(key); return f && f.n >= 8 && Date.now() - f.t < 6e5; }
function failed(key) { const f = fails.get(key); if (!f || Date.now() - f.t > 6e5) fails.set(key, { n: 1, t: Date.now() }); else f.n++; }

async function api(req, res, route, url) {
  const sameOrigin = !req.headers.origin || req.headers.origin.replace(/^https?:\/\//, '') === req.headers.host;
  if (req.method !== 'GET' && !sameOrigin) return send(res, 403, { error: '请求来源不被允许' });

  // word data (read-only)
  if (req.method === 'GET' && route === 'roots') return send(res, 200, { roots: lexicon.roots() });
  if (req.method === 'GET' && route === 'words') {
    const root = url.searchParams.get('root'), q = (url.searchParams.get('q') || '').trim();
    if (root) return send(res, 200, { words: lexicon.wordsOfRoot(root) });
    if (q) return send(res, 200, { words: lexicon.search(q.slice(0, 40)) });
    return send(res, 400, { error: '请提供 root 或 q 参数' });
  }

  const me = currentUser(req);
  if (route === 'me' && req.method === 'GET') {
    return send(res, 200, me ? { user: { name: me.name }, progress: loadProgress(me.id) } : { user: null });
  }
  if ((route === 'register' || route === 'login') && req.method === 'POST') {
    const { username, password } = await readBody(req);
    const name = String(username || '').trim(), key = name.toLowerCase(), pw = String(password || '');
    if (route === 'register') {
      if (!/^[\w一-龥]{2,16}$/.test(name)) return send(res, 400, { error: '用户名需为 2–16 位的中文、字母、数字或下划线' });
      if (pw.length < 6 || pw.length > 72) return send(res, 400, { error: '密码需为 6–72 位' });
      if (Q.userByKey.get(key)) return send(res, 409, { error: '这个用户名已被注册，换一个试试' });
      const salt = crypto.randomBytes(16).toString('hex');
      const { lastInsertRowid } = Q.addUser.run(name, key, salt, hash(pw, salt), Date.now());
      newSession(res, Number(lastInsertRowid));
      return send(res, 200, { user: { name }, progress: null });
    }
    const who = key + '|' + req.socket.remoteAddress;
    if (tooMany(who)) return send(res, 429, { error: '尝试次数过多，请 10 分钟后再试' });
    const u = Q.userByKey.get(key);
    const ok = u && crypto.timingSafeEqual(Buffer.from(hash(pw, u.salt), 'hex'), Buffer.from(u.hash, 'hex'));
    if (!ok) { failed(who); return send(res, 401, { error: '用户名或密码不正确' }); }
    newSession(res, u.id);
    return send(res, 200, { user: { name: u.name }, progress: loadProgress(u.id) });
  }
  if (route === 'logout' && req.method === 'POST') {
    if (me) Q.dropSession.run(me.key);
    res.setHeader('Set-Cookie', 'rq_sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
    return send(res, 200, { ok: true });
  }
  if (route === 'progress' && req.method === 'PUT') {
    if (!me) return send(res, 401, { error: '登录已过期，请重新登录' });
    const { progress } = await readBody(req);
    if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return send(res, 400, { error: '进度格式不正确' });
    Q.saveProgress.run(me.id, JSON.stringify(progress), Date.now());
    return send(res, 200, { ok: true });
  }
  send(res, 404, { error: '没有这个接口' });
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const SHELL = body => `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>${body}</body></html>`;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) {
    return api(req, res, url.pathname.slice(5), url).catch(() => send(res, 400, { error: '请求格式不正确' }));
  }
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(SHELL(fs.readFileSync(path.join(PUB, 'page.html'), 'utf8')));
  }
  if (url.pathname === '/data.js') { // word data straight from the database
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-cache' });
    return res.end(DATA_JS);
  }
  const file = path.normalize(path.join(PUB, url.pathname));
  if (!file.startsWith(PUB + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': (TYPES[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8' });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`词根驿站 running at http://localhost:${PORT}`));

setInterval(() => Q.dropExpired.run(Date.now()), 36e5).unref(); // drop expired sessions hourly
