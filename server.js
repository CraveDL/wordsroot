// 词根驿站 — zero-dependency server: static files, word data from SQLite, accounts and progress in SQLite.
// Run: node server.js   (PORT and DATA_DIR are optional environment variables; needs Node 22.13+)
process.removeAllListeners('warning'); // node:sqlite prints an ExperimentalWarning on load
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const { exportData, openLexicon } = require('./lib/lexicon');
const { sendMail, mailConfigured } = require('./lib/mailer');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const LEXICON_DB = path.join(__dirname, 'data', 'lexicon.db');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const APP_DB = path.join(DATA_DIR, 'app.db');
const SESSION_DAYS = 30;
// Behind a hosting platform's HTTPS proxy (Render, a cloud load balancer, nginx): read the client address and scheme from its headers.
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
const clientIp = req => (TRUST_PROXY && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress;
const isHttps = req => process.env.COOKIE_SECURE === '1' || (TRUST_PROXY && req.headers['x-forwarded-proto'] === 'https');
const cookie = (req, value, maxAge) => `rq_sid=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${isHttps(req) ? '; Secure' : ''}`;

if (!fs.existsSync(LEXICON_DB)) { console.error('缺少词库 data/lexicon.db，请先运行 node tools/build-db.js'); process.exit(1); }
const lexicon = openLexicon(LEXICON_DB);
const DATA_JSON = Buffer.from(exportData(LEXICON_DB)); // the site's word data, built from the database at start
const zlib = require('zlib');
const DATA_GZ = zlib.gzipSync(DATA_JSON);

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
// Email sign-up (added later): an email column on users, and one pending code per address and purpose.
if (!db.prepare("SELECT 1 FROM pragma_table_info('users') WHERE name = 'email'").get()) db.exec('ALTER TABLE users ADD COLUMN email TEXT');
db.exec(`
CREATE UNIQUE INDEX IF NOT EXISTS users_email ON users(email) WHERE email IS NOT NULL;
CREATE TABLE IF NOT EXISTS email_codes (
  email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires INTEGER NOT NULL,
  sent INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (email, purpose)
);
`);
const Q = {
  userByKey: db.prepare('SELECT * FROM users WHERE name_key = ?'),
  userById: db.prepare('SELECT id, name, email FROM users WHERE id = ?'),
  userByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  addEmailUser: db.prepare('INSERT INTO users (name, name_key, email, salt, hash, created) VALUES (?, ?, ?, ?, ?, ?)'),
  setPassword: db.prepare('UPDATE users SET salt = ?, hash = ? WHERE id = ?'),
  setEmail: db.prepare('UPDATE users SET email = ? WHERE id = ?'),
  dropUserSessions: db.prepare('DELETE FROM sessions WHERE user_id = ?'),
  code: db.prepare('SELECT * FROM email_codes WHERE email = ? AND purpose = ?'),
  putCode: db.prepare('INSERT INTO email_codes (email, purpose, code_hash, expires, sent, attempts) VALUES (?, ?, ?, ?, ?, 0) ON CONFLICT(email, purpose) DO UPDATE SET code_hash = excluded.code_hash, expires = excluded.expires, sent = excluded.sent, attempts = 0'),
  codeAttempt: db.prepare('UPDATE email_codes SET attempts = attempts + 1 WHERE email = ? AND purpose = ?'),
  dropCode: db.prepare('DELETE FROM email_codes WHERE email = ? AND purpose = ?'),
  dropOldCodes: db.prepare('DELETE FROM email_codes WHERE expires < ?'),
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
function newSession(req, res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  Q.addSession.run(tokenKey(token), userId, Date.now() + SESSION_DAYS * 864e5);
  res.setHeader('Set-Cookie', cookie(req, token, SESSION_DAYS * 86400));
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
const publicUser = id => { const u = Q.userById.get(id); return { name: u.name, email: u.email || null }; };
const normEmail = v => { const e = String(v || '').trim().toLowerCase(); return e.length <= 254 && /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : null; };
const codeHash = (email, code) => crypto.createHash('sha256').update(email + '|' + code).digest('hex');
// Returns an error message, or null when the code is right (and then uses it up). Five wrong tries void the code.
function checkCode(email, purpose, code) {
  const row = Q.code.get(email, purpose);
  if (!row || row.expires < Date.now()) return '验证码已过期，请重新获取';
  if (row.attempts >= 5) return '验证码错误次数太多，请重新获取';
  const given = codeHash(email, String(code || '').trim());
  if (!crypto.timingSafeEqual(Buffer.from(given, 'hex'), Buffer.from(row.code_hash, 'hex'))) { Q.codeAttempt.run(email, purpose); return '验证码不正确'; }
  Q.dropCode.run(email, purpose);
  return null;
}
// at most 10 code emails per network address per hour
const sends = new Map();
function allowSend(ip) { const now = Date.now(), list = (sends.get(ip) || []).filter(t => now - t < 36e5); if (list.length >= 10) return false; list.push(now); sends.set(ip, list); return true; }

// slow down password guessing: 8 failed tries per name+address per 10 minutes
const fails = new Map();
function tooMany(key) { const f = fails.get(key); return f && f.n >= 8 && Date.now() - f.t < 6e5; }
function failed(key) { const f = fails.get(key); if (!f || Date.now() - f.t > 6e5) fails.set(key, { n: 1, t: Date.now() }); else f.n++; }

async function api(req, res, route, url) {
  const sameOrigin = !req.headers.origin || req.headers.origin.replace(/^https?:\/\//, '') === req.headers.host;
  if (req.method !== 'GET' && !sameOrigin) return send(res, 403, { error: '请求来源不被允许' });

  // word data (read-only)
  if (req.method === 'GET' && route === 'groups') {
    const cat = url.searchParams.get('category') || '';
    if (cat && !['p', 's', 'r'].includes(cat)) return send(res, 400, { error: 'category 只能是 p、s 或 r' });
    return send(res, 200, { groups: lexicon.groups(cat) });
  }
  if (req.method === 'GET' && route === 'words') {
    const cat = url.searchParams.get('category'), num = Number(url.searchParams.get('group')), q = (url.searchParams.get('q') || '').trim();
    if (cat && num) return send(res, 200, { words: lexicon.wordsOfGroup(cat, num) });
    if (q) return send(res, 200, { words: lexicon.search(q.slice(0, 40)) });
    return send(res, 400, { error: '请提供 category 和 group，或 q 参数' });
  }

  const me = currentUser(req);
  const body = req.method === 'POST' ? await readBody(req) : {};
  const ip = clientIp(req);

  if (route === 'me' && req.method === 'GET') {
    const features = { email: true, mailReady: mailConfigured() };
    if (!me) return send(res, 200, { user: null, features });
    return send(res, 200, { user: publicUser(me.id), progress: loadProgress(me.id), features });
  }

  // 1. ask for a 6-digit code: purpose register | reset | bind
  if (route === 'email-code' && req.method === 'POST') {
    const email = normEmail(body.email), purpose = String(body.purpose || '');
    if (!email) return send(res, 400, { error: '请填写正确的邮箱地址' });
    if (!['register', 'reset', 'bind'].includes(purpose)) return send(res, 400, { error: '请求格式不正确' });
    if (purpose === 'bind' && !me) return send(res, 401, { error: '登录已过期，请重新登录' });
    const owner = Q.userByEmail.get(email);
    if (purpose === 'register' && owner) return send(res, 409, { error: '这个邮箱已经注册过了，请直接登录' });
    if (purpose === 'bind' && owner) return send(res, 409, { error: '这个邮箱已经被其他账号使用' });
    const last = Q.code.get(email, purpose);
    if (last && Date.now() - last.sent < 60e3) return send(res, 429, { error: `发送太频繁，请 ${Math.ceil((60e3 - (Date.now() - last.sent)) / 1000)} 秒后再试` });
    if (!allowSend(ip)) return send(res, 429, { error: '这个网络发送验证码太多了，请一小时后再试' });
    // For a reset to an unknown address, answer the same way but send nothing, so the form does not reveal who has an account.
    if (purpose === 'reset' && !owner) return send(res, 200, { ok: true, mailReady: mailConfigured() });
    const code = String(crypto.randomInt(0, 1e6)).padStart(6, '0');
    Q.putCode.run(email, purpose, codeHash(email, code), Date.now() + 10 * 60e3, Date.now());
    const what = { register: '注册账号', reset: '重设密码', bind: '绑定邮箱' }[purpose];
    try {
      await sendMail({
        to: email, subject: `词根驿站验证码 ${code}`,
        text: `你正在${what}，验证码是 ${code}，10 分钟内有效。\n如果不是你本人操作，请忽略这封邮件。`,
        html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.7"><p>你正在${what}，验证码是：</p><p style="font-size:30px;font-weight:800;letter-spacing:6px;color:#CF3526">${code}</p><p>10 分钟内有效。如果不是你本人操作，请忽略这封邮件。</p><p style="color:#5C6780">词根驿站</p></div>`,
      });
    } catch (e) {
      console.error('[mail] 发送失败：', e.message);
      Q.dropCode.run(email, purpose);
      return send(res, 502, { error: '验证码邮件没有发出去，请稍后再试' });
    }
    return send(res, 200, { ok: true, mailReady: mailConfigured() });
  }

  // 2. register with email + code
  if (route === 'register' && req.method === 'POST') {
    const email = normEmail(body.email), name = String(body.name || '').trim(), pw = String(body.password || '');
    if (!email) return send(res, 400, { error: '请填写正确的邮箱地址' });
    if (!/^[\w一-龥·.\- ]{1,16}$/.test(name)) return send(res, 400, { error: '昵称需为 1–16 位的中文、字母、数字' });
    if (pw.length < 6 || pw.length > 72) return send(res, 400, { error: '密码需为 6–72 位' });
    if (Q.userByEmail.get(email)) return send(res, 409, { error: '这个邮箱已经注册过了，请直接登录' });
    const bad = checkCode(email, 'register', body.code);
    if (bad) return send(res, 400, { error: bad });
    const salt = crypto.randomBytes(16).toString('hex');
    const { lastInsertRowid } = Q.addEmailUser.run(name, '@' + email, email, salt, hash(pw, salt), Date.now());
    newSession(req, res, Number(lastInsertRowid));
    return send(res, 200, { user: publicUser(Number(lastInsertRowid)), progress: null });
  }

  // 3. log in with email, or with the username of an account made before email sign-up
  if (route === 'login' && req.method === 'POST') {
    const account = String(body.account || body.username || '').trim().toLowerCase(), pw = String(body.password || '');
    const who = account + '|' + ip;
    if (tooMany(who)) return send(res, 429, { error: '尝试次数过多，请 10 分钟后再试' });
    const u = account.includes('@') ? Q.userByEmail.get(normEmail(account) || '') : Q.userByKey.get(account);
    const ok = u && crypto.timingSafeEqual(Buffer.from(hash(pw, u.salt), 'hex'), Buffer.from(u.hash, 'hex'));
    if (!ok) { failed(who); return send(res, 401, { error: '账号或密码不正确' }); }
    newSession(req, res, u.id);
    return send(res, 200, { user: publicUser(u.id), progress: loadProgress(u.id) });
  }

  // 4. forgotten password: email + code + new password; signs out every other device
  if (route === 'reset-password' && req.method === 'POST') {
    const email = normEmail(body.email), pw = String(body.password || '');
    if (!email) return send(res, 400, { error: '请填写正确的邮箱地址' });
    if (pw.length < 6 || pw.length > 72) return send(res, 400, { error: '新密码需为 6–72 位' });
    const bad = checkCode(email, 'reset', body.code);
    if (bad) return send(res, 400, { error: bad });
    const u = Q.userByEmail.get(email);
    if (!u) return send(res, 400, { error: '验证码不正确' });
    const salt = crypto.randomBytes(16).toString('hex');
    Q.setPassword.run(salt, hash(pw, salt), u.id);
    Q.dropUserSessions.run(u.id);
    newSession(req, res, u.id);
    return send(res, 200, { user: publicUser(u.id), progress: loadProgress(u.id) });
  }

  // 5. accounts made with a username can add an email for email login and password reset
  if (route === 'bind-email' && req.method === 'POST') {
    if (!me) return send(res, 401, { error: '登录已过期，请重新登录' });
    const email = normEmail(body.email);
    if (!email) return send(res, 400, { error: '请填写正确的邮箱地址' });
    if (Q.userByEmail.get(email)) return send(res, 409, { error: '这个邮箱已经被其他账号使用' });
    const bad = checkCode(email, 'bind', body.code);
    if (bad) return send(res, 400, { error: bad });
    Q.setEmail.run(email, me.id);
    return send(res, 200, { user: publicUser(me.id) });
  }

  if (route === 'logout' && req.method === 'POST') {
    if (me) Q.dropSession.run(me.key);
    res.setHeader('Set-Cookie', cookie(req, '', 0));
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

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) {
    return api(req, res, url.pathname.slice(5), url).catch(() => send(res, 400, { error: '请求格式不正确' }));
  }
  if (url.pathname === '/healthz') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
  if (url.pathname === '/data.json') { // word data straight from the database
    const gz = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache', ...(gz ? { 'Content-Encoding': 'gzip' } : {}) });
    return res.end(gz ? DATA_GZ : DATA_JSON);
  }
  const file = path.normalize(path.join(PUB, url.pathname === '/' ? 'index.html' : url.pathname));
  if (!file.startsWith(PUB + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': (TYPES[ext] || 'application/octet-stream') + (ext === '.woff2' ? '' : '; charset=utf-8'), 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600' });
    res.end(buf);
  });
}).listen(PORT, () => {
  console.log(`词根驿站 running at http://localhost:${PORT}`);
  if (!mailConfigured()) console.log('提示：没有配置 SMTP，验证码不会真的发出，只会打印在这里。正式上线前请设置 SMTP_HOST 等环境变量。');
});

// Close cleanly when the platform stops or redeploys the service, so the account database is not left mid-write.
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => { server.close(() => { db.close(); process.exit(0); }); setTimeout(() => process.exit(0), 5000).unref(); });

setInterval(() => { Q.dropExpired.run(Date.now()); Q.dropOldCodes.run(Date.now()); }, 36e5).unref(); // drop expired sessions and codes hourly
