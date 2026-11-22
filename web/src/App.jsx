import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, reduced, setSound, setTts, sfx } from './lib/fx.js';
import { startLenis, scrollTop } from './lib/scroll.js';
import { loadData, TRACK } from './lib/data.js';
import { openStore } from './lib/stores.js';
import { normalize, toSaved, day, levelOf } from './lib/progress.js';
import { InkFilter } from './components/Stamp.jsx';
import Landing from './views/Landing.jsx';
import Journey from './views/Journey.jsx';
import Play from './views/Play.jsx';
import { StationSheet, Album, SealSheet, Codex, GroupSheet, Me, BindSheet } from './views/Pages.jsx';
import { pick } from './lib/quiz.js';

const TABS = [['journey', '旅程'], ['album', '集章册'], ['codex', '图鉴'], ['me', '我的']];
const ICONS = {
  journey: <path d="M5 19c3-1 4-4 7-4s4 3 7 1M6 5.5a2 2 0 1 0 0 .01M18 12.5a2 2 0 1 0 0 .01M6 7.5c0 3 12 1 12 5" />,
  album: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" strokeDasharray="2 2" /></>,
  codex: <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5zM5 20.5A2.5 2.5 0 0 0 7.5 23H19M9 8h6M9 11.5h4" />,
  me: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5" /></>,
};
const TRIAL_PASS = 0.8;

function Nav({ view, setView }) {
  const ref = useRef(null);
  const [w, setW] = useState(0); // re-place the indicator when the layout switches between top tabs and bottom bar
  useEffect(() => { const f = () => setW(innerWidth); addEventListener('resize', f); return () => removeEventListener('resize', f); }, []);
  useLayoutEffect(() => {
    const el = ref.current, cur = el.querySelector('[aria-current="page"]'), bar = el.querySelector('.bar');
    if (!cur) return;
    const phone = matchMedia('(max-width: 640px)').matches;
    const to = phone ? { x: cur.offsetLeft + cur.offsetWidth / 2 - 14, width: 28 } : { x: cur.offsetLeft + 10, width: cur.offsetWidth - 20 };
    if (reduced || !bar.dataset.ready) { gsap.set(bar, to); bar.dataset.ready = 1; } else gsap.to(bar, { ...to, duration: 0.45, ease: 'power3.out' });
  }, [view, w]);
  return (
    <nav className="nav" ref={ref} aria-label="主导航">
      {TABS.map(([k, t]) => (
        <button key={k} aria-current={view === k ? 'page' : undefined} onClick={() => setView(k)}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k]}</svg>
          <span>{t}</span>
        </button>
      ))}
      <span className="bar" aria-hidden="true" />
    </nav>
  );
}
function Hud({ P }) {
  const lv = levelOf(P.xp);
  const bar = useRef(null);
  useEffect(() => { gsap.to(bar.current, { width: `${(lv.cur / lv.need) * 100}%`, duration: reduced ? 0 : 1, ease: 'power3.out' }); }, [P.xp]);
  return (
    <div className="hud" title={`还差 ${lv.need - lv.cur} 经验升级`}>
      {P.streak > 1 && <span className="streak">连续 {P.streak} 天</span>}
      <span className="lvl">Lv.{lv.l}</span>
      <span className="xpbar" aria-hidden="true"><i ref={bar} /></span>
    </div>
  );
}

export default function App() {
  const [D, setD] = useState(null);
  const [store, setStore] = useState(null);
  const [user, setUser] = useState(null);
  const [P, setP] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('journey');
  const [track, setTrack] = useState(() => { try { return localStorage.getItem('rq_track') || 'p'; } catch { return 'p'; } });
  const [sheet, setSheet] = useState(null); // {type, ...}
  const [play, setPlay] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const saveTimer = useRef(null);
  const PRef = useRef(null);
  PRef.current = P;

  const say = msg => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 2800); };
  useEffect(() => startLenis(), []);
  useEffect(() => { try { localStorage.setItem('rq_track', track); } catch { /* ignore */ } }, [track]);
  useEffect(() => {
    (async () => {
      try {
        const [data, st] = await Promise.all([loadData(), openStore()]);
        setD(data); setStore(st); setTts(st.tts || null);
        if (st.session) signIn(data, st.session);
      } catch (e) { setError(e.message || '加载失败，请刷新重试'); }
    })();
  }, []);

  function signIn(data, session) {
    const p = normalize(data, session.saved);
    setUser(session.user); setP(p); setSound(p.sound);
    if (p.migrated) setTimeout(() => say('词库换新了，旧进度已按单词换算到新路线'), 400);
  }
  // save shortly after each change
  useEffect(() => {
    if (!P || !store) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { store.save(toSaved(D, P)).catch(() => say('进度没有保存成功，请检查网络后再闯一关')); }, 400);
  }, [P]);

  const update = fn => setP(p => { const n = { ...p, stars: { ...p.stars }, when: { ...p.when }, boss: { ...p.boss }, wrong: { ...p.wrong } }; fn(n); return n; });

  if (error) return <div className="loading">{error}</div>;
  if (!D || !store) return <div className="loading">正在打开集章册…</div>;
  if (!user || !P) return <><InkFilter /><Landing D={D} store={store} onSignedIn={(session, how) => { signIn(D, session); scrollTop(); if (how === 'reset') say('密码已重设，其他设备上的登录已退出'); }} />{toast && <div className="toast" role="status">{toast}</div>}</>;

  // ---------- starting things ----------
  const startStation = (s, learn) => { setSheet(null); setPlay({ kind: 'station', station: s, track: s.c, entries: s.e, learn, id: Date.now() }); };
  const startTrial = ch => { setSheet(null); setPlay({ kind: 'trial', ch, track: ch.c, entries: ch.stations.flatMap(s => s.e), learn: false, id: Date.now() }); };
  const startReview = () => {
    const ids = pick(Object.keys(P.wrong).filter(w => D.wordIndex.has(w)).map(w => D.wordIndex.get(w)), 12);
    if (ids.length) setPlay({ kind: 'review', track: D.groups[D.entries[ids[0]].g].c, entries: ids, learn: false, id: Date.now() });
  };

  // a finished round: score it, update progress, and tell the result screen what happened
  function commit(mode, { asked, first, xp, best }) {
    const acc = asked ? first / asked : 1, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
    const before = levelOf(P.xp).l;
    let bonus = 0, isNew = false, passed = true, next = null;
    const date = day();
    const n = { ...P, stars: { ...P.stars }, when: { ...P.when }, boss: { ...P.boss }, wrong: { ...P.wrong } };
    if (mode.kind === 'station') {
      const k = mode.station.k, old = n.stars[k] || 0;
      isNew = !old; bonus = (isNew ? 30 : 0) + Math.max(0, stars - old) * 10;
      if (stars > old) { n.stars[k] = stars; n.when[k] = date; }
      const list = D.byTrack[mode.station.c]; next = list[mode.station.no] || null;
    } else if (mode.kind === 'trial') {
      passed = acc >= TRIAL_PASS;
      if (passed) { isNew = !n.boss[mode.ch.key]; bonus = isNew ? 100 : 20; n.boss[mode.ch.key] = Math.max(n.boss[mode.ch.key] || 0, stars); }
    }
    const gain = xp + bonus;
    n.xp += gain;
    const y = day(new Date(Date.now() - 864e5));
    if (n.last !== date) { n.streak = n.last === y ? (n.streak || 0) + 1 : 1; n.last = date; }
    setP(n);
    const after = levelOf(n.xp).l;
    return { stars: mode.kind === 'trial' ? (passed ? n.boss[mode.ch.key] : stars) : stars, isNew, passed, gain, pct: Math.round(acc * 100), best, date, next, levelUp: after > before, level: after };
  }
  const onWrong = (word, ok, kind) => update(n => {
    const w = word.toLowerCase();
    n.total = (n.total || 0) + 1;
    if (ok) { n.right = (n.right || 0) + 1; if (kind === 'review' && n.wrong[w]) { n.wrong[w] -= 1; if (n.wrong[w] <= 0) delete n.wrong[w]; } }
    else n.wrong[w] = 2;
  });

  return (
    <>
      <InkFilter />
      <header className="top">
        <div className="wrap">
          <div className="top-row">
            <span className="brand"><span className="brand-seal">根</span>词根驿站</span>
            <Hud P={P} />
          </div>
          <Nav view={view} setView={v => { setView(v); scrollTop(); sfx.click(); }} />
        </div>
      </header>
      <main className="wrap" key={view}>
        {view === 'journey' && <Journey D={D} P={P} track={track} setTrack={setTrack} onStation={s => setSheet({ type: 'station', s })} onTrial={startTrial} />}
        {view === 'album' && <Album D={D} P={P} onStation={s => setSheet({ type: 'station', s })} onSeal={ch => setSheet({ type: 'seal', ch })} />}
        {view === 'codex' && <Codex D={D} P={P} onGroup={gi => setSheet({ type: 'group', gi })} />}
        {view === 'me' && <Me D={D} P={P} user={user} store={store} onReview={startReview}
          onToggleSound={() => update(n => { n.sound = !n.sound; setSound(n.sound); })}
          onLogout={async () => { await store.logout(); setUser(null); setP(null); setView('journey'); scrollTop(); }}
          onBind={() => setSheet({ type: 'bind' })} />}
      </main>

      {sheet && sheet.type === 'station' && <StationSheet D={D} P={P} s={sheet.s} onClose={() => setSheet(null)} onStart={startStation} />}
      {sheet && sheet.type === 'seal' && <SealSheet D={D} P={P} ch={sheet.ch} onClose={() => setSheet(null)} onTrial={startTrial} />}
      {sheet && sheet.type === 'group' && <GroupSheet D={D} gi={sheet.gi} onClose={() => setSheet(null)} />}
      {sheet && sheet.type === 'bind' && <BindSheet store={store} onClose={() => setSheet(null)} onBound={u => { setUser(u); setSheet(null); say('邮箱已绑定'); }} />}
      {play && <Play key={play.id} D={D} mode={play}
        onCommit={r => commit(play, r)}
        onWrong={onWrong}
        onClose={mid => { setPlay(null); if (mid === true) say('已退出，本关没有记分'); }}
        onAgain={() => startStation(play.station, false)}
        onTrialAgain={() => startTrial(play.ch)}
        onNext={() => { const list = D.byTrack[play.station.c]; const nx = list[play.station.no]; setPlay(null); if (nx) { setTrack(nx.c); setView('journey'); setSheet({ type: 'station', s: nx }); } }} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
