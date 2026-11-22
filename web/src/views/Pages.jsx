import { useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, reduced, speak } from '../lib/fx.js';
import { TRACKS, TRACK, KIND, stationGroups, entrySense } from '../lib/data.js';
import { levelOf, titleOf, clearedIn } from '../lib/progress.js';
import { Tiles, Stars, SayButton } from '../components/Tiles.jsx';
import { StationStamp, ChapterSeal } from '../components/Stamp.jsx';
import Overlay, { SheetTop } from '../components/Overlay.jsx';
import SplitText from '../components/rb/SplitText.jsx';
import CountUp from '../components/rb/CountUp.jsx';
import Magnet from '../components/rb/Magnet.jsx';

const WordList = ({ D, ids }) => (
  <ul className="wl">
    {ids.map(i => { const e = D.entries[i]; return <li key={i}><b>{e.w}<span className="stars">{'★'.repeat(e.st)}</span></b><span>{e.d}</span></li>; })}
  </ul>
);

// ---------- station sheet ----------
export function StationSheet({ D, P, s, onClose, onStart }) {
  const st = P.stars[s.k];
  const gs = stationGroups(D, s);
  return (
    <Overlay onClose={onClose} label={`第 ${s.no} 站`}>
      <div className="sheet">
        <SheetTop onClose={onClose}><span className={`badge ${s.c}`}>{TRACK[s.c].en} · 第 {s.no} 站</span></SheetTop>
        <div className="sheet-head">
          <div style={{ minWidth: 0 }}>
            <SplitText text={gs.map(g => g.m).join('  ·  ')} tag="h1" className={`morph-big ${s.c}`} splitType="chars" delay={30} duration={0.7} textAlign="left" threshold={0} rootMargin="0px" />
          </div>
          {st && <div className="mini"><StationStamp D={D} s={s} stars={st} date={P.when[s.k]} rough /></div>}
        </div>
        {gs.map(g => (
          <div key={g.m} className="g-card">
            <span className="badge" style={{ '--k': `var(--${g.c})` }}>{KIND[g.c]} {g.m}</span>
            {g.en && <span className="en">= {g.en}</span>}
            <span className="zh">{g.zh}</span>
            {g.ss.length > 0 && <ul className="senses">{g.ss.map((x, i) => <li key={i}>{x.t}</li>)}</ul>}
          </div>
        ))}
        <div className="row">
          <Magnet padding={40} magnetStrength={4}><button className="btn red" onClick={() => onStart(s, true)}>{st ? '重新学习并闯关' : '学习并闯关'}</button></Magnet>
          {st && <button className="btn ghost" onClick={() => onStart(s, false)}>直接闯关{st < 3 ? '，冲三星' : ''}</button>}
        </div>
        <div><h3 style={{ marginBottom: 6 }}>本站 {s.e.length} 个词</h3><WordList D={D} ids={s.e} /></div>
      </div>
    </Overlay>
  );
}

// ---------- album ----------
export function Album({ D, P, onStation, onSeal }) {
  const ref = useRef(null);
  const [track, setTrack] = useState('p');
  useGSAP(() => {
    if (reduced) return;
    ScrollTrigger.batch('.album .slot:not(.empty)', { start: 'top 92%', once: true, onEnter: els => gsap.from(els, { scale: 1.8, rotate: () => gsap.utils.random(-25, 25), opacity: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(1.7)' }) });
  }, { scope: ref, dependencies: [track] });
  const chs = D.chapters[track];
  const sealed = chs.filter(ch => P.boss[ch.key]).length;
  const stamps = clearedIn(P, D.byTrack[track]);
  return (
    <div ref={ref}>
      <div className="seg" role="group" aria-label="选择路线" style={{ marginBottom: 18 }}>
        {TRACKS.map(t => <button key={t.c} aria-pressed={track === t.c} onClick={() => setTrack(t.c)}>{t.name} <span className="num small">{clearedIn(P, D.byTrack[t.c])}</span></button>)}
      </div>
      <div className="section-h"><h2>章节印</h2><span className="num muted">{sealed}/{chs.length}</span></div>
      <div className="album">
        {chs.map(ch => P.boss[ch.key]
          ? <button key={ch.key} className="slot" onClick={() => onSeal(ch)} aria-label={`第 ${ch.n + 1} 章章节印`}><ChapterSeal ch={ch} stars={P.boss[ch.key]} /></button>
          : <div key={ch.key} className="slot empty">第 {ch.n + 1} 章</div>)}
      </div>
      <div className="section-h"><h2>站章</h2><span className="num muted">{stamps}/{D.byTrack[track].length}</span></div>
      {!stamps && <p className="muted" style={{ marginBottom: 12 }}>这条路线还没有站章。通关第 1 站，第一枚章就盖在这里。</p>}
      {chs.map(ch => clearedIn(P, ch.stations) > 0 && (
        <div key={ch.key} style={{ marginBottom: 18 }}>
          <p className="small muted" style={{ margin: '6px 0 8px' }}>第 {ch.n + 1} 章</p>
          <div className="album">
            {ch.stations.map(s => P.stars[s.k]
              ? <button key={s.k} className="slot" onClick={() => onStation(s)} aria-label={`第 ${s.no} 站站章`}><StationStamp D={D} s={s} stars={P.stars[s.k]} date={P.when[s.k]} /></button>
              : <div key={s.k} className="slot empty">{String(s.no).padStart(3, '0')}</div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SealSheet({ D, P, ch, onClose, onTrial }) {
  return (
    <Overlay onClose={onClose} label="章节印">
      <div className="sheet">
        <SheetTop onClose={onClose} />
        <div className="result" style={{ paddingTop: 0 }}>
          <div className="page-slot"><div style={{ width: '84%', transform: 'rotate(-4deg)' }}><ChapterSeal ch={ch} stars={P.boss[ch.key]} rough /></div></div>
          <h2>{TRACK[ch.c].name}第 {ch.n + 1} 章章节印</h2>
          <Stars n={P.boss[ch.key]} />
          <p className="muted">{P.boss[ch.key] < 3 ? '考验拿到三星，朱文印会换成满红的白文印。' : '三星白文印。'}</p>
          <button className="btn red" onClick={() => onTrial(ch)}>再考一次</button>
        </div>
      </div>
    </Overlay>
  );
}

// ---------- codex ----------
export function Codex({ D, P, onGroup }) {
  const [track, setTrack] = useState('p');
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const seen = useMemo(() => { const set = new Set(); D.stations.forEach(s => { if (P.stars[s.k]) s.g.forEach(g => set.add(g)); }); return set; }, [D, P]);
  // with a search, look through all three kinds; without one, list the chosen kind
  const groups = useMemo(() => D.groups.map((g, i) => [g, i]).filter(([g]) => (query ? g.m.toLowerCase().includes(query) || (g.zh || '').includes(query) || (g.en || '').toLowerCase().includes(query) : g.c === track)), [D, track, query]);
  const words = useMemo(() => {
    if (!query) return [];
    const out = [];
    for (let i = 0; i < D.entries.length && out.length < 40; i++) { const e = D.entries[i]; if (e.w.toLowerCase().startsWith(query) || (query.length > 1 && /[一-龥]/.test(query) && e.d.includes(query))) out.push(i); }
    return out;
  }, [D, query]);
  return (
    <div>
      <input className="search" type="search" placeholder="搜单词、词缀或中文意思，比如 spect、看、transport" value={q} onChange={e => setQ(e.target.value)} aria-label="搜索" />
      {!query && <div className="seg" role="group" aria-label="选择类别" style={{ margin: '14px 0' }}>
        {TRACKS.map(t => <button key={t.c} aria-pressed={track === t.c} onClick={() => setTrack(t.c)}>{t.name}</button>)}
      </div>}
      {words.length > 0 && <>
        <div className="section-h"><h2>单词</h2><span className="num muted">{words.length}{words.length >= 40 ? '+' : ''}</span></div>
        <ul className="wl">{words.map(i => { const e = D.entries[i], g = D.groups[e.g]; return <li key={i}><b>{e.w}</b><span>{e.d}<br /><button className="link small" onClick={() => onGroup(e.g)}>{KIND[g.c]} {g.m}</button></span></li>; })}</ul>
      </>}
      <div className="section-h"><h2>{query ? '构词分组' : TRACK[track].name}</h2><span className="num muted">{groups.length}</span></div>
      {query && !groups.length && !words.length && <p className="muted">没有找到「{q.trim()}」。试试词缀本身（如 spect、-tion），或者中文意思（如 看）。</p>}
      <div className="g-list">
        {groups.map(([g, i]) => (
          <button key={i} className={`g-item ${g.c}`} onClick={() => onGroup(i)} style={seen.has(i) ? { borderColor: `var(--${g.c})` } : undefined}>
            <b>{g.m}</b><span>{g.zh || g.d}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export function GroupSheet({ D, gi, onClose }) {
  const g = D.groups[gi];
  const ids = useMemo(() => D.entries.map((e, i) => (e.g === gi ? i : -1)).filter(i => i >= 0), [D, gi]);
  return (
    <Overlay onClose={onClose} label={g.m}>
      <div className="sheet">
        <SheetTop onClose={onClose}><span className={`badge ${g.c}`}>{TRACK[g.c].en} · {KIND[g.c]}</span></SheetTop>
        <h1 className={`morph-big ${g.c}`}>{g.m}</h1>
        <div className="g-card">
          {g.en && <span className="en">= {g.en}</span>}
          <span className="zh">{g.zh}</span>
          {g.d && g.d !== g.zh && <span className="small muted">{g.d}</span>}
          {g.ss.length > 0 && <ul className="senses">{g.ss.map((x, i) => <li key={i}>{x.t}</li>)}</ul>}
        </div>
        <ul className="wl">
          {ids.map(i => { const e = D.entries[i]; return (
            <li key={i}><b>{e.w}<span className="stars">{'★'.repeat(e.st)}</span></b>
              <span style={{ display: 'grid', gap: 6 }}>{e.d}<Tiles entry={e} /></span></li>
          ); })}
        </ul>
      </div>
    </Overlay>
  );
}

// ---------- me ----------
export function Me({ D, P, user, store, onReview, onToggleSound, onLogout, onBind }) {
  const lv = levelOf(P.xp);
  const wrong = Object.keys(P.wrong).filter(w => D.wordIndex.has(w));
  const learned = D.stations.reduce((n, s) => n + (P.stars[s.k] ? s.e.length : 0), 0);
  const stamps = Object.keys(P.stars).length;
  const acc = P.total ? Math.round((P.right / P.total) * 100) : 0;
  return (
    <div className="narrow" style={{ margin: '0 auto' }}>
      <div className="profile">
        <span className="small muted">{titleOf(lv.l)}</span>
        <h2 style={{ fontSize: '1.7rem' }}>{user.name}</h2>
        <div className="row"><span className="lvl">Lv.{lv.l}</span><span className="xpbar" style={{ flex: 1, width: 'auto' }}><i style={{ width: `${(lv.cur / lv.need) * 100}%` }} /></span><span className="num small muted">{lv.cur}/{lv.need}</span></div>
      </div>
      <div className="statgrid" style={{ marginTop: 12 }}>
        <div className="statbox"><b><CountUp to={learned} separator="," duration={1.2} /></b><span className="small muted">已学词条，共 {D.entries.length}</span></div>
        <div className="statbox"><b><CountUp to={stamps} duration={1.2} /></b><span className="small muted">站章，共 {D.stations.length}</span></div>
        <div className="statbox"><b>{P.total ? <CountUp to={acc} duration={1.2} suffix="%" /> : '暂无'}</b><span className="small muted">答题正确率</span></div>
        <div className="statbox"><b><CountUp to={P.streak || 0} duration={1} /></b><span className="small muted">连续学习天数</span></div>
      </div>
      <div className="section-h"><h2>错词本</h2><span className="num muted">{wrong.length}</span></div>
      {wrong.length ? <>
        <button className="btn red" onClick={onReview}>错词回炉，练 {Math.min(12, wrong.length)} 个</button>
        <ul className="wl" style={{ marginTop: 12 }}>{wrong.slice(0, 80).map(w => { const e = D.entries[D.wordIndex.get(w)]; return <li key={w}><b>{e.w}</b><span>{e.d}</span></li>; })}</ul>
      </> : <p className="muted">答错的单词会记在这里，答对两次后移出。</p>}
      <div className="section-h"><h2>设置</h2></div>
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <button className="btn ghost" onClick={onToggleSound}>音效：{P.sound ? '开' : '关'}</button>
        {store.email && <p>邮箱：{user.email || <span className="muted">未绑定</span>}</p>}
        {store.email && !user.email && <button className="btn ghost" onClick={onBind}>绑定邮箱，用于登录和找回密码</button>}
        <p className="small muted">{store.note}</p>
        {store.logout && <button className="btn ghost" onClick={onLogout}>退出登录</button>}
      </div>
    </div>
  );
}

export function BindSheet({ store, onClose, onBound }) {
  const [email, setEmail] = useState(''), [code, setCode] = useState(''), [err, setErr] = useState(''), [hint, setHint] = useState(''), [busy, setBusy] = useState(false);
  const send = async () => {
    setErr('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErr('请先填写正确的邮箱地址'); return; }
    try { const j = await store.sendCode(email.trim(), 'bind'); setHint(j.mailReady ? `验证码已发到 ${email.trim()}，10 分钟内有效。` : '测试模式：验证码打印在服务器日志里。'); }
    catch (ex) { setErr(ex.message); }
  };
  const submit = async e => {
    e.preventDefault();
    if (!email.trim() || !code.trim()) { setErr('请填写邮箱和验证码'); return; }
    setBusy(true); setErr('');
    try { onBound(await store.bindEmail(email.trim(), code.trim())); } catch (ex) { setErr(ex.message); setBusy(false); }
  };
  return (
    <Overlay onClose={onClose} label="绑定邮箱">
      <div className="sheet">
        <SheetTop onClose={onClose} />
        <form className="form" onSubmit={submit} noValidate>
          <div><h2 style={{ fontSize: '1.3rem' }}>绑定邮箱</h2><p className="small muted">绑定后可以用邮箱登录，忘记密码时也能用邮箱找回。</p></div>
          <label htmlFor="be">邮箱<input id="be" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
          <div className="code-row"><label htmlFor="bc">验证码<input id="bc" inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value)} /></label><button type="button" className="btn ghost" onClick={send}>发送验证码</button></div>
          {hint && <p className="small muted">{hint}</p>}
          <p className="err" role="alert">{err}</p>
          <button className="btn red" disabled={busy}>绑定邮箱</button>
        </form>
      </div>
    </Overlay>
  );
}
