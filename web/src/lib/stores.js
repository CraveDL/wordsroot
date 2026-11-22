// Where accounts and progress live:
//   server  the bundled Node server: email accounts, progress in SQLite
//   claude  a claude.ai artifact: the viewer's Claude identity, progress in the artifact's private db
//   local   no backend: username accounts kept in this browser only
async function api(path, method = 'GET', body) {
  const r = await fetch('api/' + path, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  let j = {};
  try { j = await r.json(); } catch { /* not our server */ }
  if (!r.ok) throw new Error(j.error || '服务器没有响应，请稍后再试');
  return j;
}
const LS = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
async function sha(text) {
  if (globalThis.crypto && crypto.subtle) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  let x = 5381; for (const c of text) x = (x * 33) ^ c.charCodeAt(0); return 'w' + (x >>> 0).toString(16);
}

function serverStore(first) {
  return {
    mode: 'server', email: true, mailReady: !!(first.features && first.features.mailReady),
    note: '进度保存在你的账号里，换设备登录也能继续。',
    session: first.user ? { user: first.user, saved: first.progress } : null,
    sendCode: (email, purpose) => api('email-code', 'POST', { email, purpose }),
    register: async f => { const j = await api('register', 'POST', { email: f.email, code: f.code, name: f.name, password: f.password }); return { user: j.user, saved: j.progress }; },
    login: async f => { const j = await api('login', 'POST', { account: f.account, password: f.password }); return { user: j.user, saved: j.progress }; },
    reset: async f => { const j = await api('reset-password', 'POST', { email: f.email, code: f.code, password: f.password }); return { user: j.user, saved: j.progress }; },
    bindEmail: async (email, code) => (await api('bind-email', 'POST', { email, code })).user,
    logout: () => api('logout', 'POST').catch(() => {}),
    save: progress => api('progress', 'PUT', { progress }),
  };
}

function localStore() {
  const accounts = () => LS.get('rq_accounts') || {};
  const open = rec => { LS.set('rq_session', rec.name.toLowerCase()); return { user: { name: rec.name }, saved: LS.get('rq_prog_' + rec.name.toLowerCase()) }; };
  const k = LS.get('rq_session');
  let current = k && accounts()[k] ? accounts()[k].name : null;
  return {
    mode: 'local', email: false,
    note: '账号和进度只保存在这台设备的这个浏览器里。',
    session: current ? { user: { name: current }, saved: LS.get('rq_prog_' + current.toLowerCase()) } : null,
    async register(f) {
      const name = f.account.trim(), key = name.toLowerCase(), all = accounts();
      if (!/^[\w一-龥]{2,16}$/.test(name)) throw new Error('用户名需为 2–16 位的中文、字母、数字或下划线');
      if (f.password.length < 6) throw new Error('密码至少 6 位');
      if (all[key]) throw new Error('这个用户名已被注册，换一个试试');
      const salt = Math.random().toString(36).slice(2);
      all[key] = { name, salt, hash: await sha(salt + f.password) };
      if (!LS.set('rq_accounts', all)) throw new Error('这个浏览器不允许保存数据，请关闭无痕模式后重试');
      current = name; return open(all[key]);
    },
    async login(f) {
      const rec = accounts()[f.account.trim().toLowerCase()];
      if (!rec || rec.hash !== await sha(rec.salt + f.password)) throw new Error('用户名或密码不正确');
      current = rec.name; return open(rec);
    },
    logout: async () => { LS.del('rq_session'); current = null; },
    save: async progress => { if (current) LS.set('rq_prog_' + current.toLowerCase(), progress); },
  };
}

async function claudeStore() {
  const use = n => window.claude.use(n).catch(() => null);
  const [db, cu, tts] = await Promise.all([use('db'), use('user'), use('tts')]);
  if (!db || !cu) return null;
  const id = await cu.id();
  if (!id) return null;
  const ref = db.collection('data/users/' + id).doc('progress');
  const snap = await Promise.race([ref.get(), new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 10000))]);
  let saved = null;
  try { saved = snap.exists ? JSON.parse(snap.data().json) : null; } catch { /* start fresh */ }
  const me = await cu.me().catch(() => null);
  let chain = Promise.resolve();
  return {
    mode: 'claude', email: false, tts,
    note: '已用你的 Claude 账号登录，进度自动保存到云端，只有你自己能看到。',
    session: { user: { name: (me && me.name) || '旅人' }, saved },
    save: progress => (chain = chain.then(() => ref.set({ json: JSON.stringify(progress), updated: Date.now() }))),
  };
}

export async function openStore() {
  if (window.claude && window.claude.use) { try { const s = await claudeStore(); if (s) return s; } catch { /* fall through */ } }
  try { const me = await api('me'); if (me && me.features) return serverStore(me); } catch { /* no server */ }
  return localStore();
}
