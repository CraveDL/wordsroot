import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, Flip, useGSAP, reduced, sfx, speak } from '../lib/fx.js';
import { stationQuiz, mixedQuiz, meaningOptions, groupOptions, tilePool, pick } from '../lib/quiz.js';
import { TRACK, KIND, entrySense } from '../lib/data.js';
import { titleOf } from '../lib/progress.js';
import { Tile, Tiles, Legend, SayButton, Stars } from '../components/Tiles.jsx';
import { StationStamp, ChapterSeal } from '../components/Stamp.jsx';
import Overlay from '../components/Overlay.jsx';
import ClickSpark from '../components/rb/ClickSpark.jsx';
import CountUp from '../components/rb/CountUp.jsx';
import ShinyText from '../components/rb/ShinyText.jsx';

const TRIAL_PASS = 0.8;

function Meta({ e }) {
  return <span className="row" style={{ gap: 10 }}>{e.ph && <span className="ph">/{e.ph}/</span>}<Stars n={e.st} /></span>;
}
function Note({ D, e }) {
  return (
    <div className="note">
      <p className="def">{e.d}</p>
      {e.s && <p className="story">记法：{e.s}</p>}
      {e.e && <><p className="ex">{e.e}</p><p className="small muted">{e.z}</p></>}
      {e.u && <p className="extra">搭配：{e.u}</p>}
      {e.y && <p className="extra">词源：{e.y}</p>}
      <p className="extra">所在分组：{D.groups[e.g].m}，{entrySense(D, e)}</p>
    </div>
  );
}
const Options = ({ items, label, onPick, picked, right, en }) => (
  <div className="opts">
    {items.map((id, k) => (
      <button key={k} className={`opt ${en ? 'en' : ''} ${picked != null && id === right ? 'right' : ''} ${picked === k && id !== right ? 'wrong' : ''}`} disabled={picked != null} onClick={ev => onPick(k, ev.currentTarget)}>
        {label(id)}
      </button>
    ))}
  </div>
);

// ---------- the build question: tiles fly from the pool into the slots (GSAP Flip) ----------
function Assemble({ D, e, near, onDone }) {
  const pool = useMemo(() => tilePool(D, e, near), [e]);
  const [placed, setPlaced] = useState([]);
  const [verdict, setVerdict] = useState(null);
  const ref = useRef(null);
  const flip = useRef(null);
  const word = D.entries[e].w.toLowerCase();
  useLayoutEffect(() => {
    if (!flip.current) return;
    Flip.from(flip.current, { duration: reduced ? 0 : 0.38, ease: 'power3.inOut', absolute: true, scale: true });
    flip.current = null;
  }, [placed]);
  const move = next => { flip.current = Flip.getState(ref.current.querySelectorAll('[data-flip-id]')); setPlaced(next); };
  const place = id => {
    if (verdict) return;
    sfx.tap();
    const next = [...placed, id];
    const made = next.map(x => pool.find(p => p.id === x).t).join('').toLowerCase();
    move(next);
    if (made === word) { setVerdict('right'); onDone(true, null); }
    else if (made.length >= word.length) { setVerdict('wrong'); onDone(false, `拼成了 ${made}，正确拼法：`); }
  };
  const remove = id => { if (!verdict) move(placed.filter(x => x !== id)); };
  useEffect(() => { if (verdict === 'wrong' && !reduced) gsap.fromTo(ref.current.querySelector('.slots'), { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.3)' }); }, [verdict]);
  return (
    <div ref={ref} style={{ display: 'grid', gap: 18 }}>
      <div className={`slots ${verdict || ''}`}>
        {placed.length ? placed.map(id => { const p = pool.find(x => x.id === id); return <button key={id} data-flip-id={id} className={`tile pick ${p.k}`} onClick={() => remove(id)} disabled={!!verdict}>{p.t}</button>; })
          : <span className="hint">点下面的词块，按顺序拼起来</span>}
      </div>
      <div className="pool">
        {pool.map(p => placed.includes(p.id)
          ? <span key={p.id} className={`tile pick ${p.k} ghosted`} aria-hidden="true">{p.t}</span>
          : <button key={p.id} data-flip-id={p.id} className={`tile pick ${p.k}`} onClick={() => place(p.id)} disabled={!!verdict}>{p.t}</button>)}
      </div>
      <Legend />
    </div>
  );
}

function Fill({ D, e, onDone }) {
  const en = D.entries[e];
  const fi = en.p.findIndex(p => p.f);
  const [val, setVal] = useState('');
  const [done, setDone] = useState(false);
  const input = useRef(null);
  useEffect(() => { input.current?.focus(); }, [e]);
  const check = ev => {
    ev.preventDefault();
    if (done || !val.trim()) return;
    setDone(true);
    const ok = val.trim().toLowerCase() === en.p[fi].t.toLowerCase();
    onDone(ok, `你填的是 ${val.trim()}，正确答案：`);
  };
  const g = D.groups[en.g];
  return (
    <form onSubmit={check} style={{ display: 'grid', gap: 14 }}>
      <div className={`fill fill-wrap ${g.c}`}>
        {en.p.map((p, i) => i === fi
          ? <input key={i} ref={input} value={val} onChange={x => setVal(x.target.value)} disabled={done} autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={p.t.length + 3} aria-label={`缺的${KIND[g.c]}`} placeholder={'·'.repeat(p.t.length)} />
          : <Tile key={i} p={p} gloss={false} />)}
      </div>
      <p className="muted" style={{ textAlign: 'center' }}>缺的是{KIND[g.c]}，意思是「{entrySense(D, en)}」，属于 {g.m}</p>
      <button className="btn block" disabled={done || !val.trim()}>检查</button>
    </form>
  );
}

// ---------- result: the stamp lands ----------
function Result({ D, mode, res, onNext, onRetry, onClose, onTrialAgain }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (reduced) return;
    const tl = gsap.timeline({ delay: 0.15 });
    const slam = ref.current.querySelector('.slam');
    if (slam) {
      tl.fromTo(slam, { scale: 2.8, rotate: -26, opacity: 0, filter: 'blur(6px)' }, { scale: 0.94, rotate: -8, opacity: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power4.in' })
        .add(() => sfx.thud())
        .to(slam, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
        .fromTo(ref.current.querySelector('.page-slot'), { y: 0 }, { y: 6, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '<')
        .from(ref.current.querySelectorAll('.bigstars .on'), { scale: 0, rotate: -90, duration: 0.45, stagger: 0.12, ease: 'back.out(3)' }, '-=0.3');
    }
    tl.from(ref.current.querySelectorAll('.r-in'), { y: 18, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' }, slam ? '-=0.2' : 0);
    if (res.levelUp) tl.add(() => sfx.up(), '-=0.1');
  }, { scope: ref });
  const stars = n => <div className="bigstars" aria-label={`${n} 星`}>{[1, 2, 3].map(i => <span key={i} className={i <= n ? 'on' : ''}>★</span>)}</div>;
  let top = null, title, sub = '', buttons;
  if (mode.kind === 'station') {
    const s = mode.station;
    top = <><div className="page-slot"><div className="slam" style={{ transform: 'rotate(-8deg)' }}><StationStamp D={D} s={s} stars={res.stars} date={res.date} rough /></div></div>{stars(res.stars)}</>;
    title = res.isNew ? `第 ${s.no} 站，盖章通过` : `第 ${s.no} 站，再次通关`;
    buttons = <>{res.next && <button className="btn red" onClick={onNext}>去下一站</button>}{res.stars < 3 && <button className="btn ghost" onClick={onRetry}>再闯一次，冲三星</button>}<button className="btn ghost" onClick={onClose}>回到路线</button></>;
  } else if (mode.kind === 'trial' && res.passed) {
    top = <><div className="page-slot"><div className="slam" style={{ width: '84%' }}><ChapterSeal ch={mode.ch} stars={res.stars} rough /></div></div>{stars(res.stars)}</>;
    title = `得到${TRACK[mode.ch.c].name}第 ${mode.ch.n + 1} 章章节印`;
    buttons = <button className="btn red" onClick={onClose}>回到路线</button>;
  } else if (mode.kind === 'trial') {
    title = `首答正确率 ${res.pct}%，还差一点`;
    sub = '章节考验需要 80% 的首答正确率。答错的词已经记进错词本。';
    buttons = <><button className="btn red" onClick={onTrialAgain}>再考一次</button><button className="btn ghost" onClick={onClose}>先去复习</button></>;
  } else {
    title = '错词回炉完成';
    buttons = <button className="btn red" onClick={onClose}>好的</button>;
  }
  return (
    <ClickSpark sparkColor={['#D2361F', '#2650C8', '#0E7F6C', '#B07A00']} sparkCount={10} sparkRadius={36} shape="star">
      <div className="result" ref={ref}>
        {top}
        <h1 className="r-in">{title}</h1>
        {sub && <p className="muted r-in">{sub}</p>}
        <div className="gain r-in">
          <span className="chip">经验 +<CountUp to={res.gain} duration={1.2} delay={0.6} /></span>
          <span className="chip">首答正确率 {res.pct}%</span>
          {res.best >= 3 && <span className="chip">最高连对 {res.best}</span>}
        </div>
        {res.levelUp && <div className="levelup r-in"><ShinyText text={`升到 Lv.${res.level}，${titleOf(res.level)}`} color="#9a6400" shineColor="#ffe08a" speed={2.4} /></div>}
        <div className="row r-in" style={{ justifyContent: 'center' }}>{buttons}</div>
      </div>
    </ClickSpark>
  );
}

// ---------- the play screen ----------
export default function Play({ D, mode, onCommit, onClose, onAgain, onNext, onTrialAgain, onWrong }) {
  const near = mode.entries;
  const [qs] = useState(() => mode.kind === 'station' ? stationQuiz(D, mode.station) : mixedQuiz(D, mode.kind === 'trial' ? pick(near, 20) : near));
  const [queue, setQueue] = useState(qs);
  const learn = mode.learn ? near : [];
  const [li, setLi] = useState(0);
  const [qi, setQi] = useState(0);
  const [st, setSt] = useState({ step: null, picked: null, verdict: null, msg: null, opts: null });
  const [score, setScore] = useState({ first: 0, combo: 0, best: 0, xp: 0 });
  const [res, setRes] = useState(null);
  const body = useRef(null);
  const spark = useRef(null);
  const learning = li < learn.length;
  const q = learning ? null : queue[qi];
  const total = learn.length + queue.length, done = li + qi;
  const step = learning ? 'l' + li : 'q' + qi;
  const ready = st.step === step; // options built for this step (they are set right after it renders)

  // options for the current step
  useEffect(() => {
    if (res) return;
    if (learning) { setSt({ step, picked: null, verdict: null, msg: null, opts: meaningOptions(D, learn[li], 3, near) }); speak(D.entries[learn[li]].w); }
    else if (q) {
      const opts = q.t === 'group' ? groupOptions(D, q.g) : q.t === 'mean' ? meaningOptions(D, q.e, 4, near) : q.t === 'word' ? meaningOptions(D, q.e, 4, near) : null;
      setSt({ step, picked: null, verdict: null, msg: null, opts });
    } else finish();
    if (!reduced && body.current) gsap.fromTo(body.current, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' });
    body.current?.closest('.overlay')?.scrollTo({ top: 0 });
  }, [li, qi, res]);

  function settle(ok, el, msg) {
    const retry = q.retry;
    setScore(s => {
      const combo = ok ? s.combo + 1 : 0;
      return { first: s.first + (ok && !retry ? 1 : 0), combo, best: Math.max(s.best, combo), xp: s.xp + (ok ? (retry ? 4 : 10 + Math.min(combo, 6) * 2) : 0) };
    });
    if (ok) {
      sfx.ok();
      const root = body.current && body.current.parentElement; // the ClickSpark wrapper
      if (el && root && spark.current) { const r = el.getBoundingClientRect(), o = root.getBoundingClientRect(); spark.current.spark(r.left - o.left + r.width / 2, r.top - o.top + r.height / 2); }
    } else {
      sfx.no();
      if (!retry) setQueue(qq => [...qq, { ...q, retry: true }]);
      if (!reduced && body.current) gsap.fromTo(body.current, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.3)' });
    }
    if (q.e != null) onWrong(D.entries[q.e].w, ok, mode.kind);
    setSt(s => ({ ...s, verdict: ok ? 'right' : 'wrong', msg }));
    if (q.e != null && ok && q.t !== 'mean') speak(D.entries[q.e].w);
  }

  function finish() {
    const asked = qs.length;
    setRes(onCommit({ asked, first: score.first, xp: score.xp, best: score.best }));
  }
  const next = () => { if (learning) setLi(i => i + 1); else setQi(i => i + 1); };

  const head = learning ? `认识新词 ${li + 1}/${learn.length}` : `${mode.kind === 'trial' ? '章节考验' : mode.kind === 'review' ? '错词回炉' : '闯关'} ${qi + 1}/${queue.length}${q && q.retry ? '，再来一次' : ''}`;
  let content = null;
  if (res) content = <Result D={D} mode={mode} res={res} onNext={onNext} onRetry={onAgain} onClose={onClose} onTrialAgain={onTrialAgain} />;
  else if (learning) {
    const ei = learn[li], e = D.entries[ei];
    content = (
      <>
        <span className="phase">{head}</span>
        <div className="wordrow"><span className="bigword">{e.w}</span><SayButton word={e.w} onSay={speak} /><Meta e={e} /></div>
        <Tiles entry={e} burst />
        {ready && st.opts && <div><p className="prompt" style={{ marginBottom: 10 }}>看拆解，猜猜它的意思</p>
          <Options items={st.opts} label={i => D.entries[i].d} picked={st.picked} right={ei} onPick={(k, el) => { setSt(s => ({ ...s, picked: k, verdict: 'learn' })); if (st.opts[k] === ei) { sfx.ok(); setScore(s => ({ ...s, xp: s.xp + 2 })); } else sfx.tap(); }} /></div>}
        {ready && st.picked != null && <Note D={D} e={e} />}
      </>
    );
  } else if (q) {
    const e = q.e != null ? D.entries[q.e] : null;
    const pickOpt = (k, el, right) => { setSt(s => ({ ...s, picked: k })); settle(st.opts[k] === right, el); };
    let inner;
    if (q.t === 'group') {
      const g = D.groups[q.g];
      inner = <><p className="prompt">这个{KIND[g.c]}是什么意思？</p><div className="tiles center"><span className={`tile ${g.c}`} style={{ fontSize: '2rem', padding: '12px 22px' }}>{g.m}</span></div>
        {ready && st.opts && <Options items={st.opts} label={i => D.groups[i].zh || D.groups[i].d} picked={st.picked} right={q.g} onPick={(k, el) => pickOpt(k, el, q.g)} />}</>;
    } else if (q.t === 'mean') {
      inner = <><p className="prompt">选出它的意思</p><div className="wordrow"><span className="bigword">{e.w}</span><SayButton word={e.w} onSay={speak} /></div><Tiles entry={e} gloss={false} />
        {ready && st.opts && <Options items={st.opts} label={i => D.entries[i].d} picked={st.picked} right={q.e} onPick={(k, el) => pickOpt(k, el, q.e)} />}</>;
    } else if (q.t === 'word') {
      inner = <><p className="prompt">哪个单词是这个意思？</p><p className="def">{e.d}</p>
        {ready && st.opts && <Options en items={st.opts} label={i => D.entries[i].w} picked={st.picked} right={q.e} onPick={(k, el) => pickOpt(k, el, q.e)} />}</>;
    } else if (q.t === 'asm') {
      inner = <><p className="prompt">用词块拼出这个单词</p><p className="def">{e.d}</p><Assemble key={qi} D={D} e={q.e} near={near} onDone={(ok, msg) => settle(ok, body.current?.querySelector('.slots'), msg)} /></>;
    } else {
      inner = <><p className="prompt">填上缺的{KIND[D.groups[e.g].c]}</p><p className="def">{e.d}</p><Fill key={qi} D={D} e={q.e} onDone={(ok, msg) => settle(ok, body.current?.querySelector('.fill'), msg)} /></>;
    }
    content = <><span className="phase">{head}</span>{inner}</>;
  }

  const fb = !res && ready && st.verdict && st.verdict !== 'learn' && q ? (() => {
    const e = q.e != null ? D.entries[q.e] : null, g = q.t === 'group' ? D.groups[q.g] : null;
    const ok = st.verdict === 'right';
    return (
      <div className={`fb ${st.verdict}`} role="status">
        <strong>{ok ? (score.combo >= 3 ? `连对 ${score.combo} 题` : '答对了') : st.msg || '答错了，正确答案：'}</strong>
        {e && (!ok || q.t !== 'mean') && <div className="ans"><div className="wordrow"><b className="word-font" style={{ fontSize: '1.3rem' }}>{e.w}</b><SayButton word={e.w} onSay={speak} /><span>{e.d}</span></div><Tiles entry={e} /></div>}
        {g && !ok && <div className="ans">{g.m}：{g.zh}</div>}
      </div>
    );
  })() : null;

  return (
    <Overlay onClose={onClose} label="闯关">
      <div className="play" style={{ '--k': `var(--${mode.track})` }}>
        <div className="play-top">
          <button className="x" onClick={() => onClose(!res)} aria-label="退出">×</button>
          <div className="pbar" role="progressbar" aria-valuenow={res ? 100 : Math.round((done / total) * 100)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${res ? 100 : (done / total) * 100}%`, transition: 'width .4s cubic-bezier(.2,.8,.2,1)' }} /></div>
          <div className="combo">{!res && score.combo >= 2 ? `连对 ×${score.combo}` : ''}</div>
        </div>
        <ClickSpark ref={spark} sparkColor={['#D2361F', '#2650C8', '#0E7F6C', '#B07A00']} sparkCount={9} sparkRadius={34} style={{ height: 'auto' }}>
          <div className="play-body" ref={body}>{content}</div>
        </ClickSpark>
        <div className="play-foot">
          {fb}
          {!res && ready && ((learning && st.picked != null) || (!learning && st.verdict)) && <button className={`btn block ${st.verdict === 'wrong' ? 'red' : ''}`} onClick={next} autoFocus>{learning ? (li + 1 < learn.length ? '下一个' : '开始闯关') : '继续'}</button>}
        </div>
      </div>
    </Overlay>
  );
}
