// 词根驿站 — zero-dependency server: static files + accounts + progress.
// Run: node server.js   (PORT and DATA_DIR are optional environment variables)
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'accounts.json');
const SESSION_DAYS = 30;

fs.mkdirSync(DATA_DIR, { recursive: true });
let db = { users: {}, sessions: {} };
try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { /* first run */ }

let saveTimer = null;
function persist() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    const tmp = DB_FILE + '.tmp';
    fs.writeFile(tmp, JSON.stringify(db), err => { if (!err) fs.rename(tmp, DB_FILE, () => {}); });
  }, 200);
}

const hash = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex');
const tokenKey = t => crypto.createHash('sha256').update(t).digest('hex'); // only token hashes are stored
function newSession(res, name) {
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[tokenKey(token)] = { u: name, exp: Date.now() + SESSION_DAYS * 864e5 };
  res.setHeader('Set-Cookie', `rq_sid=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 86400}`);
}
function currentUser(req) {
  const m = /(?:^|;\s*)rq_sid=([a-f0-9]{64})/.exec(req.headers.cookie || '');
  if (!m) return null;
  const k = tokenKey(m[1]), s = db.sessions[k];
  if (!s) return null;
  if (s.exp < Date.now() || !db.users[s.u]) { delete db.sessions[k]; persist(); return null; }
  return { key: k, name: s.u, rec: db.users[s.u] };
}
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
function readBody(req) {
  return new Promise((ok, bad) => {
    let b = '';
    req.on('data', c => { b += c; if (b.length > 2e5) { bad(new Error('too large')); req.destroy(); } });
    req.on('end', () => { try { ok(JSON.parse(b || '{}')); } catch (e) { bad(e); } });
  });
}
// slow down password guessing: 8 failed tries per name+address per 10 minutes
const fails = new Map();
function tooMany(key) { const f = fails.get(key); return f && f.n >= 8 && Date.now() - f.t < 6e5; }
function failed(key) { const f = fails.get(key); if (!f || Date.now() - f.t > 6e5) fails.set(key, { n: 1, t: Date.now() }); else f.n++; }

async function api(req, res, route) {
  const sameOrigin = !req.headers.origin || req.headers.origin.replace(/^https?:\/\//, '') === req.headers.host;
  if (req.method !== 'GET' && !sameOrigin) return send(res, 403, { error: '请求来源不被允许' });
  const me = currentUser(req);
  if (route === 'me' && req.method === 'GET') {
    return send(res, 200, me ? { user: { name: me.rec.name }, progress: me.rec.progress || null } : { user: null });
  }
  if ((route === 'register' || route === 'login') && req.method === 'POST') {
    const { username, password } = await readBody(req);
    const name = String(username || '').trim(), key = name.toLowerCase(), pw = String(password || '');
    if (route === 'register') {
      if (!/^[\w一-龥]{2,16}$/.test(name)) return send(res, 400, { error: '用户名需为 2–16 位的中文、字母、数字或下划线' });
      if (pw.length < 6 || pw.length > 72) return send(res, 400, { error: '密码需为 6–72 位' });
      if (db.users[key]) return send(res, 409, { error: '这个用户名已被注册，换一个试试' });
      const salt = crypto.randomBytes(16).toString('hex');
      db.users[key] = { name, salt, hash: hash(pw, salt), created: Date.now(), progress: null };
      newSession(res, key); persist();
      return send(res, 200, { user: { name }, progress: null });
    }
    const who = key + '|' + req.socket.remoteAddress;
    if (tooMany(who)) return send(res, 429, { error: '尝试次数过多，请 10 分钟后再试' });
    const rec = db.users[key];
    const ok = rec && crypto.timingSafeEqual(Buffer.from(hash(pw, rec.salt), 'hex'), Buffer.from(rec.hash, 'hex'));
    if (!ok) { failed(who); return send(res, 401, { error: '用户名或密码不正确' }); }
    newSession(res, key); persist();
    return send(res, 200, { user: { name: rec.name }, progress: rec.progress || null });
  }
  if (route === 'logout' && req.method === 'POST') {
    if (me) { delete db.sessions[me.key]; persist(); }
    res.setHeader('Set-Cookie', 'rq_sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
    return send(res, 200, { ok: true });
  }
  if (route === 'progress' && req.method === 'PUT') {
    if (!me) return send(res, 401, { error: '登录已过期，请重新登录' });
    const { progress } = await readBody(req);
    if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return send(res, 400, { error: '进度格式不正确' });
    me.rec.progress = progress; me.rec.updated = Date.now(); persist();
    return send(res, 200, { ok: true });
  }
  send(res, 404, { error: '没有这个接口' });
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const SHELL = body => `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>${body}</body></html>`;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) {
    return api(req, res, url.pathname.slice(5)).catch(() => send(res, 400, { error: '请求格式不正确' }));
  }
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(SHELL(fs.readFileSync(path.join(PUB, 'page.html'), 'utf8')));
  }
  const file = path.normalize(path.join(PUB, url.pathname));
  if (!file.startsWith(PUB + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': (TYPES[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8' });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`词根驿站 running at http://localhost:${PORT}`));

setInterval(() => { // drop expired sessions hourly
  const now = Date.now(); let n = 0;
  for (const k in db.sessions) if (db.sessions[k].exp < now) { delete db.sessions[k]; n++; }
  if (n) persist();
}, 36e5).unref();
