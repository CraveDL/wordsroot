// 词根驿站 — game client. Works against three stores: the bundled Node server (accounts),
// a claude.ai artifact (viewer identity + private db doc), or this browser only (local accounts).
(() => {
  const D = window.RQ_DATA, W = D.words, L = D.levels, ST = window.RQ_STAMPS;
  const ROOT = Object.fromEntries(D.roots.map(r => [r.r, r.m]));
  const RINFO = Object.fromEntries(D.roots.map(r => [r.r, r]));
  const rootName = r => (RINFO[r] && RINFO[r].d) || r.replace(/#\d$/, '').replace(/,/g, ', ');
  const STARTS = D.starts || [0];
  // chapters: every 10 stations, restarting at the first station of each volume
  const CHS = [], chOf = [];
  STARTS.forEach((s, v) => { const end = STARTS[v + 1] ?? L.length; for (let a = s; a < end; a += 10) { const b = Math.min(end, a + 10); for (let i = a; i < b; i++) chOf[i] = CHS.length; CHS.push({ a, b, v: v + 1 }); } });
  const CHN = CHS.length;
  const NAMES = ['初出茅庐', '小试牛刀', '渐入佳境', '势如破竹', '融会贯通', '游刃有余', '出类拔萃', '炉火纯青', '登堂入室', '登峰造极', '百尺竿头', '更上层楼', '乘风破浪', '厚积薄发', '触类旁通', '举一反三', '博闻强识', '学富五车', '妙笔生花', '出神入化', '循序渐进', '持之以恒', '锲而不舍', '水滴石穿', '聚沙成塔', '日积月累', '勤能补拙', '温故知新', '学以致用', '见微知著', '一目十行', '过目不忘', '博古通今', '才高八斗', '满腹经纶', '文思泉涌', '下笔成章', '口若悬河', '字字珠玑', '独占鳌头', '名列前茅', '鹏程万里', '青出于蓝', '一鸣惊人', '大显身手', '志存高远', '精益求精', '专心致志', '手不释卷', '孜孜不倦', '熟能生巧', '驾轻就熟', '得心应手', '胸有成竹', '闻鸡起舞', '囊萤映雪', '韦编三绝', '悬梁刺股', '凿壁偷光', '返璞归真'];
  const CH_NAMES = CHS.map((_, c) => (c === CHN - 1 ? '万词归宗' : NAMES[c] || `第${c + 1}章`));
  const EXAM = { 初: '初中', 四: '四级', 六: '六级', 研: '考研', 托: '托福', G: 'GRE' };
  const WIDX = new Map(W.map((w, i) => [w.w.toLowerCase(), i]));
  const LIDX = new Map(L.map((l, i) => [l.k, i]));
  const INKS = ['red', 'blue', 'teal', 'plum', 'amber', 'ink'];
  const TITLES = [[1, '见习旅人'], [3, '词根学徒'], [6, '拆词工匠'], [10, '词缀猎手'], [15, '词源学者'], [22, '词根大师'], [30, '万词归宗']];
  const KIND = { p: '前缀', r: '词根', s: '后缀', c: '连接', x: '记忆块' };
  const BOSS_PASS = 0.8;

  const $ = s => document.querySelector(s);
  const app = $('#app'), overlay = $('#overlay');
  const h = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, n);
  const day = (d = new Date()) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  const short = r => r.split(',')[0];
  const lvLabel = i => { const rs = L[i].roots.map(short); return rs.length > 2 ? rs.slice(0, 2).join('/') + '+' : rs.join('/'); };
  const lvTitle = i => L[i].roots.map(short).join(' · ');
  const lvMean = i => L[i].roots.map(r => ROOT[r].split('，')[0]).join(' / ');
  const starsHTML = n => '★'.repeat(n) + '<b>' + '★'.repeat(3 - n) + '</b>';
  const need = l => 200 + l * 100;
  const levelOf = xp => { let l = 1; while (xp >= need(l)) { xp -= need(l); l++; } return { l, cur: xp, need: need(l) }; };
  const titleOf = l => TITLES.filter(t => t[0] <= l).pop()[1];

  // ---------- state ----------
  let store = null, user = null, P = null, view = 'map', authTab = 'login', ses = null, tts = null;
  const openCh = new Set();
  const blank = () => ({ v: 2, xp: 0, stars: {}, boss: {}, when: {}, wrong: {}, streak: 0, last: '', right: 0, total: 0, sound: true });
  let orphan = { stars: {}, when: {}, boss: {}, wrong: {} }; // saved entries this word list no longer has; kept so they survive a save
  const chKey = c => L[CHS[c].a].k;
  // Saved progress (v2) is keyed by station key, chapter key and word text, so it survives changes to the word list.
  function normalize(saved) {
    const p = blank();
    orphan = { stars: {}, when: {}, boss: {}, wrong: {} };
    if (!saved || typeof saved !== 'object') return p;
    for (const k of ['xp', 'streak', 'last', 'right', 'total', 'sound']) if (saved[k] !== undefined) p[k] = saved[k];
    if (saved.v !== 2) return migrateV1(saved, p);
    const map = (from, to, idx, bin) => Object.entries(from || {}).forEach(([k, v]) => { const i = idx(k); if (i === undefined) orphan[bin][k] = v; else to[i] = v; });
    map(saved.stars, p.stars, k => LIDX.get(k), 'stars');
    map(saved.when, p.when, k => LIDX.get(k), 'when');
    const CIDX = new Map(CHS.map((_, c) => [chKey(c), c]));
    map(saved.boss, p.boss, k => CIDX.get(k), 'boss');
    map(saved.wrong, p.wrong, k => WIDX.get(k), 'wrong');
    return p;
  }
  function toSaved(p) {
    const o = { v: 2, xp: p.xp, streak: p.streak, last: p.last, right: p.right, total: p.total, sound: p.sound, stars: { ...orphan.stars }, when: { ...orphan.when }, boss: { ...orphan.boss }, wrong: { ...orphan.wrong } };
    for (const i in p.stars) o.stars[L[i].k] = p.stars[i];
    for (const i in p.when) o.when[L[i].k] = p.when[i];
    for (const c in p.boss) o.boss[chKey(c)] = p.boss[c];
    for (const i in p.wrong) o.wrong[W[i].w.toLowerCase()] = p.wrong[i];
    return o;
  }
  // First version (2000 words) saved plain indices. Map them through the old layout: a station counts as cleared
  // when at least half of its words were in stations cleared before.
  function migrateV1(old, p) {
    const lg = D.legacy;
    if (!lg) return p;
    const best = new Map(), when = new Map();
    for (const [i, st] of Object.entries(old.stars || {})) {
      const lv = lg.levels[i]; if (!lv) continue;
      for (const wi of lv) { const w = lg.words[wi]; best.set(w, Math.max(best.get(w) || 0, st)); if (old.when && old.when[i]) when.set(w, old.when[i]); }
    }
    L.forEach((l, i) => {
      const hit = l.words.map(wi => W[wi].w).filter(w => best.has(w));
      if (hit.length && hit.length * 2 >= l.words.length) { p.stars[i] = Math.min(...hit.map(w => best.get(w))); p.when[i] = hit.map(w => when.get(w)).filter(Boolean).sort().pop() || day(); }
    });
    for (const [i, n] of Object.entries(old.wrong || {})) { const w = lg.words[i]; const ni = w && WIDX.get(w.toLowerCase()); if (ni !== undefined) p.wrong[ni] = n; }
    const sealed = Math.max(0, ...Object.values(old.boss || {}));
    if (sealed) CHS.forEach((ch, c) => { let all = true; for (let i = ch.a; i < ch.b; i++) if (!p.stars[i]) all = false; if (all) p.boss[c] = sealed; });
    p.migrated = true;
    return p;
  }
  const curLevel = () => { let i = 0; while (i < L.length && P.stars[i]) i++; return i; };
  const cleared = () => Object.keys(P.stars).length;
  const learned = () => Object.keys(P.stars).reduce((n, i) => n + (L[i] ? L[i].words.length : 0), 0);

  // ---------- stores ----------
  const LS = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
  };
  async function api(path, method = 'GET', body) {
    const r = await fetch('api/' + path, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || '服务器没有响应，请稍后再试');
    return j;
  }
  function serverStore(first) {
    const take = j => { user = j.user; P = normalize(j.progress); };
    if (first.user) take(first);
    return {
      mode: 'server', note: '进度保存在你的账号里，换设备登录也能继续。',
      register: async (u, p) => take(await api('register', 'POST', { username: u, password: p })),
      login: async (u, p) => take(await api('login', 'POST', { username: u, password: p })),
      logout: () => api('logout', 'POST').catch(() => {}),
      save: p => api('progress', 'PUT', { progress: toSaved(p) }),
    };
  }
  async function sha(text) {
    if (window.crypto && crypto.subtle) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
    let x = 5381; for (const c of text) x = (x * 33) ^ c.charCodeAt(0); return 'w' + (x >>> 0).toString(16);
  }
  function localStore() {
    const enter = rec => { user = { name: rec.name }; P = normalize(LS.get('rq_prog_' + rec.name.toLowerCase())); LS.set('rq_session', rec.name.toLowerCase()); };
    const accounts = () => LS.get('rq_accounts') || {};
    const k = LS.get('rq_session'); if (k && accounts()[k]) enter(accounts()[k]);
    return {
      mode: 'local', note: '账号和进度只保存在这台设备的这个浏览器里。',
      async register(u, p) {
        const name = u.trim(), key = name.toLowerCase(), all = accounts();
        if (!/^[\w一-龥]{2,16}$/.test(name)) throw new Error('用户名需为 2–16 位的中文、字母、数字或下划线');
        if (p.length < 6) throw new Error('密码至少 6 位');
        if (all[key]) throw new Error('这个用户名已被注册，换一个试试');
        const salt = Math.random().toString(36).slice(2);
        all[key] = { name, salt, hash: await sha(salt + p) };
        if (!LS.set('rq_accounts', all)) throw new Error('这个浏览器不允许保存数据，请关闭无痕模式后重试');
        enter(all[key]);
      },
      async login(u, p) {
        const rec = accounts()[u.trim().toLowerCase()];
        if (!rec || rec.hash !== await sha(rec.salt + p)) throw new Error('用户名或密码不正确');
        enter(rec);
      },
      logout: async () => LS.del('rq_session'),
      save: async p => { LS.set('rq_prog_' + user.name.toLowerCase(), toSaved(p)); },
    };
  }
  async function claudeStore() {
    const use = n => window.claude.use(n).catch(() => null);
    const [db, cu, t] = await Promise.all([use('db'), use('user'), use('tts')]);
    tts = t;
    if (!db || !cu) return null;
    const id = await cu.id(); if (!id) return null;
    const ref = db.collection('data/users/' + id).doc('progress');
    const snap = await Promise.race([ref.get(), new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 10000))]);
    let saved = null; try { saved = snap.exists ? JSON.parse(snap.data().json) : null; } catch { /* start fresh */ }
    const me = await cu.me().catch(() => null);
    user = { name: (me && me.name) || '旅人' }; P = normalize(saved);
    let chain = Promise.resolve();
    return {
      mode: 'claude', note: '已用你的 Claude 账号登录，进度自动保存到云端，只有你自己能看到。',
      save: p => (chain = chain.then(() => ref.set({ json: JSON.stringify(toSaved(p)), updated: Date.now() }))),
    };
  }
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { store.save(P).catch(() => toast('进度没有保存成功，请检查网络后再闯一关')); }, 300);
  }

  // ---------- sound + speech ----------
  let ac = null;
  function tone(freqs, dur = 0.12, type = 'triangle', vol = 0.12) {
    if (!P || !P.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * dur * 0.9;
        o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur);
      });
    } catch { /* no audio */ }
  }
  const sfx = { ok: () => tone([660, 880]), no: () => tone([220, 160], 0.16, 'sawtooth', 0.07), tap: () => tone([520], 0.05, 'sine', 0.06), thud: () => tone([90, 60], 0.18, 'sine', 0.35), up: () => tone([523, 659, 784, 1046], 0.13) };
  function speak(text) {
    if (tts) { tts.speak(text, { language: 'en' }).catch(() => {}); return; }
    try { const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch { /* no speech here */ }
  }
  let toastTimer;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2600); }

  // ---------- shared pieces ----------
  const tile = (p, gloss = true, cls = '') => `<span class="tile ${p.k} ${cls}">${h(p.t)}${gloss && p.g ? `<small>${h(p.g)}</small>` : gloss && p.k !== 'c' ? `<small>${KIND[p.k]}</small>` : ''}</span>`;
  const tiles = (w, gloss = true) => `<div class="tiles">${w.p.map(p => tile(p, gloss)).join('<span class="plus">+</span>')}</div>`;
  const sayBtn = w => `<button class="say" data-a="say" data-w="${h(w)}" aria-label="朗读 ${h(w)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg></button>`;
  const stampFor = (i, rough) => ST.station({ label: lvLabel(i), sub: lvMean(i), no: i + 1, stars: P.stars[i] || 1, ink: INKS[chOf[i] % INKS.length], date: P.when[i], rough });
  const sealFor = (c, rough) => ST.seal({ text: CH_NAMES[c], stars: P.boss[c] || 1, rough });
  const legend = `<div class="legend"><span><i style="background:var(--blue)"></i>前缀</span><span><i style="background:var(--red)"></i>词根</span><span><i style="background:var(--teal)"></i>后缀</span><span><i style="background:var(--amber)"></i>记忆块</span></div>`;

  // ---------- shell ----------
  function render() {
    if (!user) return renderAuth();
    if (P.migrated) { delete P.migrated; save(); setTimeout(() => toast('词库已更新，旧进度已换算到新关卡'), 300); }
    const lv = levelOf(P.xp);
    const tabs = [['map', '路线'], ['album', '集章册'], ['codex', '词根图鉴'], ['me', '我的']];
    app.innerHTML = `
      <header class="top"><div class="wrap">
        <div class="top-row">
          <div class="brand"><span class="brand-seal">根</span>词根驿站</div>
          <div class="hud" title="${h(titleOf(lv.l))}，还差 ${lv.need - lv.cur} 经验升级">
            ${P.streak > 1 ? `<span class="streak">连续 ${P.streak} 天</span>` : ''}
            <span class="lvl">Lv.${lv.l}</span><span class="xpbar" aria-hidden="true"><i style="width:${Math.round(lv.cur / lv.need * 100)}%"></i></span>
          </div>
        </div>
        <nav class="tabs" aria-label="主导航">${tabs.map(([k, t]) => `<button data-a="tab" data-v="${k}" ${view === k ? 'aria-current="page"' : ''}>${t}</button>`).join('')}</nav>
      </div></header>
      <main class="wrap">${({ map: viewMap, album: viewAlbum, codex: viewCodex, me: viewMe })[view]()}</main>`;
  }

  function renderAuth() {
    const demo = W.find(w => w.w === 'predict') || W[0];
    const s1 = ST.station({ label: 'dict', sub: '说话', no: 51, stars: 3, ink: 'red', date: day(), rough: true });
    const s2 = ST.seal({ text: '初出茅庐', stars: 3, rough: true });
    app.innerHTML = `<div class="wrap auth">
      <div class="auth-hero">
        <div style="display:grid;gap:14px">
          <div class="brand"><span class="brand-seal">根</span>词根驿站</div>
          <h1>拆开 ${W.length} 个单词，一站盖一枚章</h1>
          <p class="muted">${L.length} 个词根站，${D.roots.length} 个词根，每个单词都拆成前缀、词根和后缀来记。</p>
          <div class="split">${demo.p.map(p => tile(p)).join('<span class="plus">+</span>')}<span class="plus">=</span><span>${h(demo.w)}</span></div>
          <p class="small muted">${h(demo.d)}</p>
        </div>
        <div class="demo-stamps" aria-hidden="true"><div>${s1}</div><div>${s2}</div></div>
      </div>
      <div class="card"><form class="form" id="authForm" novalidate>
        <div class="seg" role="group" aria-label="登录或注册">
          <button type="button" data-a="authTab" data-v="login" aria-pressed="${authTab === 'login'}">登录</button>
          <button type="button" data-a="authTab" data-v="register" aria-pressed="${authTab === 'register'}">注册</button>
        </div>
        <label for="au">用户名<input id="au" name="u" autocomplete="username" maxlength="16" required></label>
        <label for="ap">密码<input id="ap" name="p" type="password" autocomplete="${authTab === 'login' ? 'current-password' : 'new-password'}" maxlength="72" required></label>
        <p class="err" id="authErr" role="alert"></p>
        <button class="btn red" id="authGo">${authTab === 'login' ? '登录并继续闯关' : '注册并开始闯关'}</button>
        <p class="small muted">${h(store.note)}</p>
      </form></div>
    </div>`;
  }

  // ---------- views ----------
  function viewMap() {
    const cur = curLevel();
    const front = STARTS.filter(s => s > 0 && P.stars[s]).map(s => { let i = s; while (i < L.length && P.stars[i]) i++; return i; });
    let out = '';
    if (!cleared()) out += `<div class="card" style="margin-bottom:18px;display:grid;gap:10px"><h2>${h(user.name)}，从第 1 站出发</h2><p class="muted">每一站先认识这组词根下的单词，再闯关。通关盖站章，三星通关的章纹更完整。</p>${legend}</div>`;
    for (let c = 0; c < CHN; c++) {
      const { a, b } = CHS[c], n = b - a;
      let done = 0; for (let i = a; i < b; i++) if (P.stars[i]) done++;
      const open = openCh.has(c) || (cur >= a && cur < b) || front.some(i => i >= a && i < b) || (cur >= L.length && c === CHN - 1 && !openCh.size);
      const bossOpen = done === n;
      out += `<section class="chapter">
        <button class="ch-head" data-a="ch" data-i="${c}" aria-expanded="${open}">
          <span class="ch-seal ${P.boss[c] ? '' : 'empty'}">${P.boss[c] ? sealFor(c) : c + 1}</span>
          <span><span class="small muted">${CHS[c].v === 1 ? '上册' : '下册'} · 第 ${c + 1} 章</span><h2>${CH_NAMES[c]}</h2></span>
          <span class="ch-prog num">${done}/${n}</span>
        </button>`;
      if (open) {
        out += '<ol class="route">';
        for (let i = a; i < b; i++) {
          const st = P.stars[i], entry = STARTS.includes(i) && i > 0 && i !== cur, locked = i > cur && !entry && !P.stars[i - 1], now = !st && !locked && !entry;
          out += `<li><button class="stop ${now ? 'now' : ''}" data-a="level" data-i="${i}" ${locked ? 'disabled' : ''}>
            <span class="node">${st ? stampFor(i) : `<span class="dot">${i + 1}</span>`}</span>
            <span><span class="roots">${h(lvTitle(i))}</span><br><span class="mean small muted">${h(lvMean(i))}，${L[i].words.length} 个词</span></span>
            <span class="go">${st ? `<span class="stars">${starsHTML(st)}</span>` : entry ? '下册起点，可直接开始' : now ? '出发' : '未解锁'}</span>
          </button></li>`;
        }
        out += `<li><button class="stop ${bossOpen && !P.boss[c] ? 'now' : ''}" data-a="boss" data-i="${c}" ${bossOpen ? '' : 'disabled'}>
            <span class="node">${P.boss[c] ? sealFor(c) : '<span class="dot">印</span>'}</span>
            <span><span class="roots" style="font-family:var(--f-head)">章节考验</span><br><span class="mean small muted">混考本章 20 题，正确率 80% 得「${CH_NAMES[c]}」印</span></span>
            <span class="go">${P.boss[c] ? `<span class="stars">${starsHTML(P.boss[c])}</span>` : bossOpen ? '挑战' : '通关本章后开放'}</span>
          </button></li></ol>`;
      }
      out += '</section>';
    }
    return out;
  }

  function viewAlbum() {
    const seals = Object.keys(P.boss).length;
    let out = `<div class="section-h"><h2>章节印</h2><span class="muted num">${seals}/${CHN}</span></div><div class="album">`;
    for (let c = 0; c < CHN; c++) out += P.boss[c] ? `<button class="slot" data-a="sealView" data-i="${c}">${sealFor(c)}</button>` : `<div class="slot empty">${CH_NAMES[c]}</div>`;
    out += '</div>';
    if (!cleared()) out += `<p class="muted" style="margin-top:18px">集章册还是空的。通关第 1 站，第一枚站章就盖在这里。</p>`;
    for (let c = 0; c < CHN; c++) {
      const { a, b } = CHS[c];
      let done = 0; for (let i = a; i < b; i++) if (P.stars[i]) done++;
      out += `<div class="section-h"><h2>第 ${c + 1} 章 ${CH_NAMES[c]}</h2><span class="muted num">${done}/${b - a}</span></div><div class="album">`;
      for (let i = a; i < b; i++) out += P.stars[i] ? `<button class="slot" data-a="stampView" data-i="${i}">${stampFor(i)}</button>` : `<div class="slot empty">${String(i + 1).padStart(3, '0')}</div>`;
      out += '</div>';
    }
    return out;
  }

  function viewCodex() {
    const seen = new Set(); Object.keys(P.stars).forEach(i => L[i] && L[i].roots.forEach(r => seen.add(r)));
    const chip = (k, t, g, a, on = true, label = t) => `<button class="tile ${on ? k : 'c'}" data-a="${a}" data-v="${h(t)}">${h(label)}<small>${h(g)}</small></button>`;
    return `<p class="muted" style="margin-bottom:6px">点任意一块，看它出现在哪些单词里。亮起的词根是你已经通关的。</p>${legend}
      <div class="section-h"><h2>词根</h2><span class="muted num">${seen.size}/${D.roots.length}</span></div>
      <div class="chips">${D.roots.map(r => chip('r', r.r, r.m, 'cxRoot', seen.has(r.r), rootName(r.r))).join('')}</div>
      <div class="section-h"><h2>常见前缀</h2><span class="muted num">${D.affixes.p.length}</span></div>
      <div class="chips">${D.affixes.p.map(x => chip('p', x.t + '-', x.g, 'cxP')).join('')}</div>
      <div class="section-h"><h2>常见后缀</h2><span class="muted num">${D.affixes.s.length}</span></div>
      <div class="chips">${D.affixes.s.map(x => chip('s', '-' + x.t, x.g, 'cxS')).join('')}</div>`;
  }

  function viewMe() {
    const lv = levelOf(P.xp), wrong = Object.keys(P.wrong).map(Number).filter(i => W[i]);
    const acc = P.total ? Math.round(P.right / P.total * 100) + '%' : '暂无';
    return `<div class="card" style="display:grid;gap:6px">
        <span class="small muted">${h(titleOf(lv.l))}</span><h2 style="font-size:1.6rem">${h(user.name)}</h2>
        <div style="display:flex;align-items:center;gap:10px"><span class="lvl">Lv.${lv.l}</span><span class="xpbar" style="flex:1;width:auto"><i style="width:${Math.round(lv.cur / lv.need * 100)}%"></i></span><span class="num small muted">${lv.cur}/${lv.need}</span></div>
      </div>
      <div class="stats" style="margin-top:12px">
        <div class="stat"><b>${learned()}</b><span class="small muted">已学单词，共 ${W.length}</span></div>
        <div class="stat"><b>${cleared()}</b><span class="small muted">站章，共 ${L.length}</span></div>
        <div class="stat"><b>${acc}</b><span class="small muted">答题正确率</span></div>
        <div class="stat"><b>${P.streak || 0}</b><span class="small muted">连续学习天数</span></div>
      </div>
      <div class="section-h"><h2>错词本</h2><span class="muted num">${wrong.length}</span></div>
      ${wrong.length ? `<button class="btn red" data-a="review">错词回炉，练 ${Math.min(12, wrong.length)} 个</button>
        <ul class="wl" style="margin-top:12px">${wrong.slice(0, 60).map(i => `<li><b>${h(W[i].w)}</b><span>${h(W[i].d)}</span></li>`).join('')}</ul>`
        : '<p class="muted">答错的单词会记在这里，答对两次后移出。</p>'}
      <div class="section-h"><h2>设置</h2></div>
      <div style="display:grid;gap:12px;justify-items:start">
        <button class="btn ghost" data-a="sound">音效：${P.sound ? '开' : '关'}</button>
        <p class="small muted">${h(store.note)}</p>
        ${store.logout ? '<button class="btn ghost" data-a="logout">退出登录</button>' : ''}
      </div>`;
  }

  // ---------- overlays: level sheet, stamp detail, codex list ----------
  const openOverlay = html => { overlay.innerHTML = html; overlay.hidden = false; overlay.scrollTop = 0; document.body.style.overflow = 'hidden'; };
  const closeOverlay = () => { overlay.hidden = true; overlay.innerHTML = ''; document.body.style.overflow = ''; ses = null; };
  const sheet = inner => `<div class="sheet"><div class="play-top"><button class="x" data-a="close" aria-label="关闭">×</button></div>${inner}</div>`;
  const wordList = ids => `<ul class="wl">${ids.map(i => `<li><b>${h(W[i].w)}</b><span>${h(W[i].d)}</span></li>`).join('')}</ul>`;

  function levelSheet(i) {
    const lv = L[i], st = P.stars[i];
    openOverlay(sheet(`
      <div class="sheet-head"><div><span class="small muted num">第 ${i + 1} 站</span><h1 class="bigword">${h(lvTitle(i))}</h1></div>${st ? `<div class="mini">${stampFor(i, true)}</div>` : ''}</div>
      <div class="roots-info">${lv.roots.map(r => `<div class="root-card"><span class="tile r">${h(rootName(r))}<small>${h(ROOT[r])}</small></span>${RINFO[r].j ? `<p><span class="muted">巧记：</span>${h(RINFO[r].j)}</p>` : ''}</div>`).join('')}</div>
      <div class="row" style="justify-content:flex-start">
        <button class="btn red" data-a="start" data-i="${i}">${st ? '重新学习并闯关' : '学习并闯关'}</button>
        ${st ? `<button class="btn ghost" data-a="start" data-i="${i}" data-skip="1">直接闯关${st < 3 ? '，冲三星' : ''}</button>` : ''}
      </div>
      <div><h3 style="margin-bottom:6px">本站 ${lv.words.length} 个词</h3>${st ? wordList(lv.words) : `<p class="muted">${lv.words.slice(0, 5).map(w => W[w].w).join('、')}…</p>`}</div>`));
  }
  function stampView(i) {
    openOverlay(sheet(`<div class="result" style="padding-top:0"><div class="page-slot"><div style="width:100%;transform:rotate(-7deg)">${stampFor(i, true)}</div></div>
      <h2>${h(lvTitle(i))} 站章</h2><div class="bigstars">${starsHTML(P.stars[i])}</div><p class="muted">${P.when[i] ? P.when[i] + ' 盖章。' : ''}${P.stars[i] < 3 ? '三星通关可以换成纹样更完整的章。' : '满星章，带完整纹样和齿边。'}</p>
      <div class="row"><button class="btn red" data-a="start" data-i="${i}" data-skip="1">再闯一次</button></div></div>
      <div>${wordList(L[i].words)}</div>`));
  }
  function sealView(c) {
    openOverlay(sheet(`<div class="result" style="padding-top:0"><div class="page-slot"><div style="width:86%;transform:rotate(-4deg)">${sealFor(c, true)}</div></div>
      <h2>第 ${c + 1} 章印「${CH_NAMES[c]}」</h2><div class="bigstars">${starsHTML(P.boss[c])}</div><p class="muted">${P.boss[c] < 3 ? '考验拿到三星，朱文印会换成满红的白文印。' : '三星白文印。'}</p>
      <div class="row"><button class="btn red" data-a="boss" data-i="${c}">再考一次</button></div></div>`));
  }
  function codexList(kind, key) {
    let ids, title, sub, tip = '';
    if (kind === 'r') { ids = W.map((w, i) => (w.r === key ? i : -1)).filter(i => i >= 0); title = rootName(key); sub = ROOT[key]; tip = RINFO[key].j; }
    else { const t = key.replace(/-/g, ''); ids = W.map((w, i) => (w.p.some(p => p.k === kind && p.t === t) ? i : -1)).filter(i => i >= 0); title = key; sub = (D.affixes[kind].find(x => x.t === t) || {}).g; }
    openOverlay(sheet(`<div><span class="small muted">${KIND[kind]}，${ids.length} 个词</span><h1 class="bigword">${h(title)}</h1><p class="def">${h(sub || '')}</p>${tip ? `<p class="muted" style="margin-top:6px">巧记：${h(tip)}</p>` : ''}</div>
      <ul class="wl">${ids.map(i => `<li><b>${h(W[i].w)}</b><span>${h(W[i].d)}<br><span class="small muted">${W[i].p.map(p => h(p.t)).join(' + ')}</span></span></li>`).join('')}</ul>`));
  }

  // ---------- play ----------
  function buildQuiz(ws, roots) {
    const first = ws.map((wi, n) => ({ t: W[wi].p.length >= 2 && n % 3 !== 2 ? 'asm' : 'mean', w: wi }));
    const extra = pick(ws, Math.ceil(ws.length / 2)).map((wi, n) => {
      const rp = W[wi].p.find(p => p.k === 'r');
      return { t: n % 2 === 0 && rp && rp.t.length >= 3 && W[wi].p.length >= 2 ? 'spell' : 'word', w: wi };
    });
    return [...roots.map(r => ({ t: 'root', r })), ...shuffle(first), ...shuffle(extra)];
  }
  function mixedQuiz(ws) {
    return shuffle(ws).map((wi, n) => {
      const w = W[wi], rp = w.p.find(p => p.k === 'r'), multi = w.p.length >= 2;
      const t = ['mean', 'asm', 'word', 'spell'][n % 4];
      return { t: (t === 'asm' && !multi) || (t === 'spell' && !(multi && rp && rp.t.length >= 3)) ? 'mean' : t, w: wi };
    });
  }
  function begin(kind, i, words, queue, learn) {
    ses = { kind, i, words, queue, learn, li: 0, qi: 0, first: 0, asked: queue.length, right: 0, tries: 0, combo: 0, best: 0, xp: 0, state: null };
    openOverlay('<div class="play"><div class="play-top"><button class="x" data-a="quit" aria-label="退出本关">×</button><div class="bar" role="progressbar" aria-label="本关进度"><i id="bar"></i></div><div class="combo" id="combo"></div></div><div class="play-body" id="body"></div><div class="play-foot" id="foot"></div></div>');
    step();
  }
  const startLevel = (i, skip) => begin('level', i, L[i].words, buildQuiz(L[i].words, L[i].roots), skip ? [] : L[i].words.slice());
  function startBoss(c) { const ws = []; for (let i = CHS[c].a; i < CHS[c].b; i++) ws.push(...L[i].words); begin('boss', c, ws, mixedQuiz(pick(ws, 20)), []); }
  function startReview() { const ws = pick(Object.keys(P.wrong).map(Number).filter(i => W[i]), 12); if (ws.length) begin('review', 0, ws, mixedQuiz(ws), []); }

  function step() {
    const total = ses.learn.length + ses.queue.length, done = ses.li + ses.qi;
    $('#bar').style.width = Math.round(done / total * 100) + '%';
    $('#combo').textContent = ses.combo >= 2 ? `连对 ×${ses.combo}` : '';
    $('#foot').innerHTML = ''; overlay.scrollTop = 0;
    if (ses.li < ses.learn.length) return learnCard();
    if (ses.qi < ses.queue.length) return question();
    finish();
  }
  const others = (wi, n, pool) => pick((pool || W.map((_, i) => i)).filter(i => i !== wi && W[i].d !== W[wi].d), n);
  function meaningOpts(wi, n) {
    const near = others(wi, 1, ses.words), far = others(wi, n, null).filter(i => !near.includes(i)).slice(0, n - 1 - near.length + 1);
    return shuffle([wi, ...near, ...far].slice(0, n));
  }
  const optBtns = (ids, cls, label) => `<div class="opts">${ids.map((id, k) => `<button class="opt ${cls}" data-a="opt" data-k="${k}">${h(label(id))}</button>`).join('')}</div>`;

  function learnCard() {
    const wi = ses.learn[ses.li], w = W[wi], opts = meaningOpts(wi, 3);
    ses.state = { t: 'learn', wi, opts, answered: false };
    $('#body').innerHTML = `<div class="learn" style="display:grid;gap:18px">
      <span class="phase">认识新词 <span class="num">${ses.li + 1}/${ses.learn.length}</span></span>
      <div class="wordrow"><span class="bigword">${h(w.w)}</span>${sayBtn(w.w)}${meta(w)}</div>
      ${tiles(w)}
      <div id="guess"><p class="prompt" style="margin-bottom:10px">看拆解，猜猜它的意思</p>${optBtns(opts, '', id => W[id].d)}</div>
      <div id="reveal" hidden></div></div>`;
    speak(w.w);
  }
  const meta = w => (w.ph || EXAM[w.lv]) ? `<span class="wmeta">${w.ph ? `<span class="ph">/${h(w.ph)}/</span>` : ''}${EXAM[w.lv] ? `<span class="exam">${EXAM[w.lv]}</span>` : ''}</span>` : '';
  function note(w) {
    return `<div class="note"><p class="def">${h(w.d)}</p>${w.s ? `<p class="story">记法：${h(w.s)}</p>` : ''}${w.e ? `<p class="ex">${h(w.e)}</p><p class="small muted">${h(w.z)}</p>` : ''}</div>`;
  }

  function question() {
    const q = ses.queue[ses.qi], body = $('#body');
    const head = `<span class="phase">${ses.kind === 'boss' ? '章节考验' : ses.kind === 'review' ? '错词回炉' : '闯关'} <span class="num">${ses.qi + 1}/${ses.queue.length}</span>${q.retry ? '，再来一次' : ''}</span>`;
    if (q.t === 'root') {
      const opts = shuffle([q.r, ...pick(D.roots.filter(r => r.m !== ROOT[q.r]).map(r => r.r), 3)]);
      ses.state = { t: 'opt', q, opts, ok: opts.indexOf(q.r) };
      body.innerHTML = `${head}<p class="prompt">这个词根是什么意思？</p><div class="tiles"><span class="tile r" style="font-size:2rem;padding:12px 22px">${h(rootName(q.r))}</span></div>${optBtns(opts, '', r => ROOT[r])}`;
    } else if (q.t === 'mean') {
      const opts = meaningOpts(q.w, 4);
      ses.state = { t: 'opt', q, opts, ok: opts.indexOf(q.w) };
      body.innerHTML = `${head}<p class="prompt">选出它的意思</p><div class="wordrow"><span class="bigword">${h(W[q.w].w)}</span>${sayBtn(W[q.w].w)}</div>${tiles(W[q.w], false)}${optBtns(opts, '', id => W[id].d)}`;
    } else if (q.t === 'word') {
      const near = others(q.w, 2, ses.words), far = others(q.w, 4).filter(i => !near.includes(i));
      const opts = shuffle([q.w, ...near, ...far].slice(0, 4));
      ses.state = { t: 'opt', q, opts, ok: opts.indexOf(q.w) };
      body.innerHTML = `${head}<p class="prompt">哪个单词是这个意思？</p><p class="def">${h(W[q.w].d)}</p>${optBtns(opts, 'en', id => W[id].w)}`;
    } else if (q.t === 'asm') {
      const w = W[q.w], own = w.p.map(p => ({ t: p.t, k: p.k }));
      const have = new Set(own.map(p => p.t)), extra = [];
      for (const wi of shuffle([...ses.words, ...pick(W.map((_, i) => i), 12)])) for (const p of W[wi].p) if (!have.has(p.t) && p.t.length > 1 && extra.length < 3) { have.add(p.t); extra.push({ t: p.t, k: p.k }); }
      ses.state = { t: 'asm', q, pool: shuffle([...own, ...extra]), placed: [], done: false };
      body.innerHTML = `${head}<p class="prompt">用词块拼出这个单词</p><p class="def">${h(w.d)}</p><div class="slots" id="slots"></div><div class="pool" id="pool"></div>${legend}`;
      drawAsm();
    } else {
      const w = W[q.w], ri = w.p.findIndex(p => p.k === 'r');
      ses.state = { t: 'spell', q, ri, done: false };
      body.innerHTML = `${head}<p class="prompt">填上缺的词根</p><p class="def">${h(w.d)}</p>
        <form class="spell" id="spellForm">${w.p.map((p, i) => i === ri ? `<input id="spellIn" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="${p.t.length + 3}" aria-label="缺的词根" placeholder="${'·'.repeat(p.t.length)}">` : tile(p, false)).join('')}</form>
        <p class="muted" style="text-align:center">词根的意思：${h(w.p[ri].g || ROOT[w.r])}</p>`;
      $('#foot').innerHTML = '<button class="btn block" data-a="spellGo">检查</button>';
      $('#spellIn').focus();
    }
  }
  function drawAsm() {
    const s = ses.state;
    $('#slots').innerHTML = s.placed.length ? s.placed.map((pi, n) => `<button class="tile pick ${s.pool[pi].k}" data-a="unplace" data-n="${n}" ${s.done ? 'disabled style="opacity:1"' : ''}>${h(s.pool[pi].t)}</button>`).join('') : '<span class="hint">点下面的词块，按顺序拼起来</span>';
    $('#pool').innerHTML = s.pool.map((p, pi) => `<button class="tile pick ${p.k}" data-a="place" data-n="${pi}" ${s.placed.includes(pi) || s.done ? 'disabled' : ''}>${h(p.t)}</button>`).join('');
  }

  function settle(ok, q, shownWrong) {
    ses.tries++; P.total++;
    const w = q.w != null ? W[q.w] : null;
    if (ok) {
      ses.right++; P.right++; ses.combo++; ses.best = Math.max(ses.best, ses.combo);
      if (!q.retry) ses.first++;
      ses.xp += q.retry ? 4 : 10 + Math.min(ses.combo - 1, 5) * 2;
      if (w && ses.kind === 'review') { P.wrong[q.w] = (P.wrong[q.w] || 1) - 1; if (P.wrong[q.w] <= 0) delete P.wrong[q.w]; }
      sfx.ok();
    } else {
      ses.combo = 0; sfx.no();
      if (w) P.wrong[q.w] = Math.min(2, (P.wrong[q.w] || 0) + (ses.kind === 'review' ? 0 : 2) || 2);
      if (!q.retry) ses.queue.push(Object.assign({}, q, { retry: true }));
    }
    $('#combo').textContent = ses.combo >= 2 ? `连对 ×${ses.combo}` : '';
    const detail = w ? `<div class="ans"><div class="wordrow" style="margin-bottom:8px"><b style="font:800 1.3rem var(--f-word)">${h(w.w)}</b>${sayBtn(w.w)}<span>${h(w.d)}</span></div>${tiles(w)}</div>` : `<div class="ans">${h(rootName(q.r))}：${h(ROOT[q.r])}${RINFO[q.r].j ? `<br><span class="small">巧记：${h(RINFO[q.r].j)}</span>` : ''}</div>`;
    $('#foot').innerHTML = `<div class="fb ${ok ? 'right' : 'wrong'}" role="status"><strong>${ok ? (ses.combo >= 3 ? `连对 ${ses.combo} 题` : '答对了') : shownWrong || '答错了，正确答案：'}</strong>${ok && !w ? '' : detail}</div><button class="btn block ${ok ? '' : 'red'}" data-a="next" id="nextBtn">继续</button>`;
    $('#nextBtn').focus({ preventScroll: true });
    if (w && ok && q.t !== 'mean') speak(w.w);
  }

  function finish() {
    const acc = ses.asked ? ses.first / ses.asked : 1;
    let stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, passed = true, isNew = false, bonus = 0;
    const before = levelOf(P.xp).l, i = ses.i;
    if (ses.kind === 'level') {
      isNew = !P.stars[i]; bonus = (isNew ? 30 : 0) + (stars > (P.stars[i] || 0) ? 10 * (stars - (P.stars[i] || 0)) : 0);
      if (stars > (P.stars[i] || 0)) { P.stars[i] = stars; P.when[i] = day(); }
    } else if (ses.kind === 'boss') {
      passed = acc >= BOSS_PASS;
      if (passed) { isNew = !P.boss[i]; bonus = isNew ? 100 : 20; P.boss[i] = Math.max(P.boss[i] || 0, stars); }
    }
    const gain = ses.xp + bonus; P.xp += gain;
    const today = day(), y = day(new Date(Date.now() - 864e5));
    if (P.last !== today) { P.streak = P.last === y ? (P.streak || 0) + 1 : 1; P.last = today; }
    save();
    const after = levelOf(P.xp).l, pct = Math.round(acc * 100);
    let top, title, btns;
    if (ses.kind === 'level') {
      top = `<div class="page-slot"><div class="slam">${stampFor(i, true)}</div></div><div class="bigstars">${starsHTML(stars)}</div>`;
      title = isNew ? `${lvTitle(i)} 站，盖章通过` : `${lvTitle(i)} 站，再次通关`;
      const next = i + 1 < L.length;
      btns = `${next ? `<button class="btn red" data-a="level" data-i="${i + 1}">去下一站</button>` : ''}${stars < 3 ? `<button class="btn ghost" data-a="start" data-i="${i}" data-skip="1">再闯一次，冲三星</button>` : ''}<button class="btn ghost" data-a="close">回到路线</button>`;
    } else if (ses.kind === 'boss' && passed) {
      top = `<div class="page-slot"><div class="slam" style="width:86%">${sealFor(i, true)}</div></div><div class="bigstars">${starsHTML(stars)}</div>`;
      title = `得章节印「${CH_NAMES[i]}」`;
      btns = '<button class="btn red" data-a="close">回到路线</button>';
    } else if (ses.kind === 'boss') {
      top = ''; title = `正确率 ${pct}%，还差一点`;
      btns = `<button class="btn red" data-a="boss" data-i="${i}">再考一次</button><button class="btn ghost" data-a="close">先去复习</button>`;
    } else {
      top = ''; title = '错词回炉完成';
      btns = '<button class="btn red" data-a="close">好的</button>';
    }
    const sub = ses.kind === 'boss' && !passed ? '章节考验需要 80% 的首答正确率。错的词已经记进错词本。' : '';
    $('#bar').style.width = '100%'; $('#combo').textContent = ''; $('#foot').innerHTML = '';
    $('#body').innerHTML = `<div class="result">${top}<h1>${h(title)}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}
      <div class="gain"><span class="chip">经验 +${gain}</span><span class="chip">首答正确率 ${pct}%</span>${ses.best >= 3 ? `<span class="chip">最高连对 ${ses.best}</span>` : ''}</div>
      ${after > before ? `<div class="levelup">升到 Lv.${after}，${h(titleOf(after))}</div>` : ''}
      <div class="row">${btns}</div></div>`;
    if (top) setTimeout(sfx.thud, 480);
    if (after > before) setTimeout(sfx.up, 900);
    ses.state = { t: 'done' };
    render();
  }

  // ---------- events ----------
  const actions = {
    tab: el => { view = el.dataset.v; render(); window.scrollTo(0, 0); },
    authTab: el => { authTab = el.dataset.v; const u = $('#au').value; renderAuth(); $('#au').value = u; },
    ch: el => { const c = +el.dataset.i; if (el.getAttribute('aria-expanded') === 'true') { openCh.delete(c); el.parentNode.querySelector('.route')?.remove(); el.setAttribute('aria-expanded', 'false'); } else { openCh.add(c); render(); } },
    level: el => levelSheet(+el.dataset.i),
    boss: el => startBoss(+el.dataset.i),
    start: el => startLevel(+el.dataset.i, !!el.dataset.skip),
    review: startReview,
    stampView: el => stampView(+el.dataset.i),
    sealView: el => sealView(+el.dataset.i),
    cxRoot: el => codexList('r', el.dataset.v), cxP: el => codexList('p', el.dataset.v), cxS: el => codexList('s', el.dataset.v),
    close: () => { closeOverlay(); render(); },
    quit: () => { const mid = ses && ses.state && ses.state.t !== 'done'; closeOverlay(); render(); if (mid) toast('已退出，本关没有记分'); },
    say: el => speak(el.dataset.w),
    sound: () => { P.sound = !P.sound; save(); render(); sfx.ok(); },
    logout: async () => { await store.logout(); user = null; P = null; view = 'map'; render(); },
    opt: el => {
      const s = ses.state, k = +el.dataset.k, btns = [...el.parentNode.children];
      if (s.t === 'learn') {
        if (s.answered) return; s.answered = true;
        const ok = s.opts[k] === s.wi; btns.forEach((b, n) => { b.disabled = true; if (s.opts[n] === s.wi) b.classList.add('right'); }); if (!ok) el.classList.add('wrong');
        if (ok) { ses.xp += 2; sfx.ok(); } else sfx.tap();
        const r = $('#reveal'); r.innerHTML = note(W[s.wi]); r.hidden = false;
        $('#foot').innerHTML = `<button class="btn block" data-a="next" id="nextBtn">${ses.li + 1 < ses.learn.length ? '下一个' : '开始闯关'}</button>`;
        $('#nextBtn').focus({ preventScroll: true });
        return;
      }
      if (s.t !== 'opt' || s.answered) return; s.answered = true;
      btns.forEach((b, n) => { b.disabled = true; if (n === s.ok) b.classList.add('right'); }); if (k !== s.ok) el.classList.add('wrong');
      settle(k === s.ok, s.q);
    },
    place: el => {
      const s = ses.state; if (s.done) return; s.placed.push(+el.dataset.n); sfx.tap();
      const w = W[s.q.w].w, made = s.placed.map(i => s.pool[i].t).join('');
      if (made === w || made.length >= w.length || !w.startsWith(made)) {
        if (made === w) { s.done = true; drawAsm(); $('#slots').classList.add('right'); settle(true, s.q); }
        else if (made.length >= w.length) { s.done = true; drawAsm(); $('#slots').classList.add('wrong'); settle(false, s.q, `拼成了 ${made}，正确拼法：`); }
        else drawAsm(); // wrong prefix so far: let them fix it
      } else drawAsm();
    },
    unplace: el => { const s = ses.state; if (s.done) return; s.placed.splice(+el.dataset.n, 1); drawAsm(); },
    spellGo: () => {
      const s = ses.state; if (s.done) return; const inp = $('#spellIn'), val = inp.value.trim().toLowerCase(); if (!val) { inp.focus(); return; }
      s.done = true; inp.disabled = true; const ans = W[s.q.w].p[s.ri].t;
      settle(val === ans, s.q, `你填的是 ${val}，正确答案：`);
    },
    next: () => { const s = ses.state; if (s.t === 'learn') ses.li++; else ses.qi++; step(); },
  };
  document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (el && !el.disabled && actions[el.dataset.a]) actions[el.dataset.a](el); });
  document.addEventListener('submit', async e => {
    e.preventDefault();
    if (e.target.id === 'spellForm') return actions.spellGo();
    if (e.target.id !== 'authForm') return;
    const u = $('#au').value.trim(), p = $('#ap').value, err = $('#authErr'), go = $('#authGo');
    if (!u || !p) { err.textContent = '请填写用户名和密码'; return; }
    go.disabled = true; err.textContent = '';
    try { await store[authTab](u, p); view = 'map'; render(); }
    catch (ex) { err.textContent = ex.message === 'Failed to fetch' ? '连不上服务器，请检查网络后重试' : ex.message; go.disabled = false; }
  });
  document.addEventListener('keydown', e => {
    if (overlay.hidden || !ses || !ses.state || e.target.tagName === 'INPUT') return;
    if (/^[1-4]$/.test(e.key)) { const b = overlay.querySelectorAll('.opt')[+e.key - 1]; if (b && !b.disabled) b.click(); }
  });

  // ---------- boot ----------
  (async () => {
    try { if (window.claude && window.claude.use) store = await claudeStore(); } catch { store = null; }
    if (!store) { try { store = serverStore(await api('me')); } catch { store = localStore(); } }
    render();
  })();
})();
