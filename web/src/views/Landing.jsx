import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, reduced } from '../lib/fx.js';
import { TRACKS } from '../lib/data.js';
import { day } from '../lib/progress.js';
import MorphHero from '../components/MorphHero.jsx';
import { Tile } from '../components/Tiles.jsx';
import { StationStamp } from '../components/Stamp.jsx';
import SplitText from '../components/rb/SplitText.jsx';
import CountUp from '../components/rb/CountUp.jsx';
import SpotlightCard from '../components/rb/SpotlightCard.jsx';
import Magnet from '../components/rb/Magnet.jsx';
import AuthForm from './AuthForm.jsx';

const dark = () => typeof matchMedia === 'function' && (document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches));

export default function Landing({ D, store, onSignedIn }) {
  const ref = useRef(null);
  const formRef = useRef(null);
  const [tab, setTab] = useState('register');
  const count = c => D.byTrack[c].reduce((n, s) => n + s.e.length, 0);
  const examples = useMemo(() => {
    const out = {};
    for (const t of TRACKS) {
      const gs = D.groups.map((g, i) => [g, i]).filter(([g]) => g.c === t.c).slice(0, 60);
      const picks = [];
      for (const [, gi] of gs) {
        const e = D.entries.find(x => x.g === gi && x.p.length >= 2 && x.p.length <= 3 && x.p.every(p => p.k !== 'c' && p.k !== 'b'));
        if (e && !picks.some(x => x.w === e.w)) picks.push(e);
        if (picks.length >= 3) break;
      }
      out[t.c] = picks;
    }
    return out;
  }, [D]);
  const wall = useMemo(() => {
    const out = [];
    for (const t of TRACKS) D.byTrack[t.c].slice(0, 40).filter((_, i) => i % 9 === 3).slice(0, 4).forEach(s => out.push(s));
    return out;
  }, [D]);

  useGSAP(() => {
    if (reduced) return;
    gsap.from('.hero-copy > *:not(h1)', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.25 });
    gsap.from('.auth-card', { y: 40, opacity: 0, rotate: 1.5, duration: 0.9, ease: 'power3.out', delay: 0.4 });
    ScrollTrigger.batch('.reveal', { start: 'top 88%', once: true, onEnter: els => gsap.from(els, { y: 36, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }) });
    ScrollTrigger.batch('.stamp-wall > div', {
      start: 'top 90%', once: true,
      onEnter: els => gsap.from(els, { scale: 2.2, rotate: () => gsap.utils.random(-30, 30), opacity: 0, duration: 0.55, stagger: 0.07, ease: 'back.out(1.6)' }),
    });
  }, { scope: ref });

  // phones: a fixed "sign up" bar while the form is off screen
  const [formSeen, setFormSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([en]) => setFormSeen(en.isIntersecting), { threshold: 0.15 });
    if (formRef.current) io.observe(formRef.current);
    return () => io.disconnect();
  }, []);
  const goForm = t => { setTab(t); formRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); };

  return (
    <div className="landing" ref={ref}>
      <header className="wrap l-top">
        <span className="brand"><span className="brand-seal">根</span>词根驿站</span>
        <button className="link" onClick={() => goForm('login')}>登录</button>
      </header>

      <section className="wrap hero">
        <div className="hero-copy">
          <h1 aria-label={`拆开 ${D.words} 个单词，一站盖一枚章`}>
            <SplitText text={`拆开 ${D.words} 个单词，`} tag="span" splitType="chars" delay={28} duration={0.9} effect="rise" textAlign="left" threshold={0} rootMargin="0px" />
            <br />
            <SplitText text="一站盖一枚章" tag="span" splitType="chars" delay={28} duration={0.9} effect="rise" textAlign="left" threshold={0} rootMargin="0px" />
          </h1>
          <p className="lede">前缀、词根、后缀分成三条路线，{D.groups.length} 个构词分组变成 {D.stations.length} 个驿站。每站先看单词怎样拆开，再闯关，通关就盖一枚站章。</p>
          <MorphHero D={D} />
          <div className="stats">
            <div className="stat"><b><CountUp to={D.words} separator="," duration={1.6} /></b><span>个单词</span></div>
            <div className="stat"><b><CountUp to={D.groups.length} duration={1.4} /></b><span>个构词分组</span></div>
            <div className="stat"><b><CountUp to={D.stations.length} separator="," duration={1.5} /></b><span>个驿站</span></div>
          </div>
        </div>
        <div className="auth-card" ref={formRef}>
          <SpotlightCard theme={dark() ? 'dark' : 'light'} spotlightColor="rgba(210, 54, 31, 0.18)" style={{ background: 'var(--paper)', boxShadow: 'var(--shadow)' }}>
            <AuthForm store={store} tab={tab} setTab={setTab} onSignedIn={onSignedIn} />
          </SpotlightCard>
        </div>
      </section>

      <section className="l-section">
        <div className="wrap">
          <h2 className="reveal">三条路线，随时切换</h2>
          <p className="sub reveal">每条路线按书里的顺序排好驿站，各自解锁。哪条路线都可以先走。</p>
          <div className="track-cards">
            {TRACKS.map(t => (
              <div key={t.c} className={`track-card ${t.c} reveal`}>
                <span className="badge" style={{ '--k': `var(--${t.c})` }}>{t.en}</span>
                <h3 style={{ fontSize: '1.5rem' }}>{t.name}</h3>
                <div className="big num">{D.byTrack[t.c].length}<span className="small muted" style={{ fontFamily: 'var(--f-zh)', fontWeight: 600 }}> 站 · {count(t.c)} 词</span></div>
                <p className="muted">{t.blurb}</p>
                <div className="eg">{(examples[t.c] || []).map(e => <span key={e.w} className="eg-word" title={e.d}>{e.p.map((p, i) => <Tile key={i} p={p} gloss={false} />)}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="l-section">
        <div className="wrap">
          <h2 className="reveal">一站怎么走</h2>
          <div className="steps" style={{ marginTop: 20 }}>
            <div className="step reveal"><span className="n">01</span><h3>看拆解</h3><p className="muted">每个词拆成彩色词块，蓝是前缀，红是词根，绿是后缀，先猜词义再看记法。</p></div>
            <div className="step reveal"><span className="n">02</span><h3>闯关</h3><p className="muted">拼词块、选词义、填词缀，答错的题本站末尾再考一次，也会记进错词本。</p></div>
            <div className="step reveal"><span className="n">03</span><h3>盖章升级</h3><p className="muted">通关盖站章，三星换满纹章；一章十站全通，再过章节考验拿章节印。</p></div>
          </div>
        </div>
      </section>

      <section className="l-section">
        <div className="wrap">
          <h2 className="reveal">集章册</h2>
          <p className="sub reveal">每枚站章的纹样由词缀生成，没有两枚相同。</p>
          <div className="stamp-wall">
            {wall.map((s, i) => <div key={s.k} style={{ transform: `rotate(${(i % 3 - 1) * 6}deg)` }}><StationStamp D={D} s={s} stars={(i % 3) + 1} date={day()} rough /></div>)}
          </div>
        </div>
      </section>

      {D.quotes.length >= 2 && (
        <section className="l-section">
          <div className="wrap">
            <p className="quote reveal">{D.quotes[0]}</p>
            <p className="muted reveal" style={{ marginTop: 8 }}>{D.quotes[1]} {D.quotes[2] || ''}</p>
            <div className="reveal" style={{ marginTop: 28 }}>
              <Magnet padding={60} magnetStrength={3}><button className="btn red" onClick={() => goForm('register')}>注册，从第一站出发</button></Magnet>
            </div>
          </div>
        </section>
      )}
      <div className={`m-cta ${formSeen ? 'hide' : ''}`} aria-hidden={formSeen}>
        <button className="btn red block" tabIndex={formSeen ? -1 : 0} onClick={() => goForm('register')}>注册，开始闯关</button>
        <button className="btn ghost" tabIndex={formSeen ? -1 : 0} onClick={() => goForm('login')}>登录</button>
      </div>
      <footer className="wrap l-foot">词库来自《词根词缀》整理表，共 {D.entries.length} 个词条。</footer>
    </div>
  );
}
