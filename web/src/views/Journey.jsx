import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, useGSAP, reduced } from '../lib/fx.js';
import { TRACKS, TRACK, chapterRange, stationLabel, stationMeaning } from '../lib/data.js';
import { isOpen, clearedIn } from '../lib/progress.js';
import { StationStamp, ChapterSeal } from '../components/Stamp.jsx';

const ROW = 104;            // vertical distance between stations
const XS = [0.5, 0.74, 0.5, 0.26]; // winding road: horizontal positions, repeating

function Route({ D, P, ch, onStation, onTrial }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el); setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const list = ch.stations;
  const narrow = w < 520;
  const pts = list.map((s, i) => ({ x: narrow ? 40 + [0, 30, 60, 30][i % 4] : XS[i % 4] * w, y: ROW / 2 + i * ROW }));
  const d = pts.map((p, i) => {
    if (!i) return `M${p.x} ${p.y}`;
    const a = pts[i - 1];
    return `C${a.x} ${a.y + ROW * 0.55} ${p.x} ${p.y - ROW * 0.55} ${p.x} ${p.y}`;
  }).join(' ');
  const done = clearedIn(P, list);
  // the coloured part of the road runs up to the first station not yet cleared
  const firstOpen = list.findIndex(s => !P.stars[s.k]);
  const doneFrac = list.length > 1 ? (firstOpen < 0 ? 1 : firstOpen / (list.length - 1)) : 0;
  useGSAP(() => {
    if (!w) return;
    const el = ref.current;
    if (reduced) return;
    gsap.fromTo(el.querySelector('.road'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power2.inOut' });
    gsap.fromTo(el.querySelector('.done'), { drawSVG: '0%' }, { drawSVG: `${doneFrac * 100}%`, duration: 1.2, ease: 'power3.out', delay: 0.2 });
    gsap.from(el.querySelectorAll('.stop, .stop-label'), { scale: 0.4, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'back.out(2)', delay: 0.1 });
    const now = el.querySelector('.pulse');
    if (now) gsap.fromTo(now, { scale: 0.9, opacity: 0.9 }, { scale: 1.7, opacity: 0, duration: 1.4, repeat: -1, ease: 'power1.out' });
  }, { scope: ref, dependencies: [w, ch.key, done] });
  return (
    <div className="route" ref={ref} style={{ height: list.length * ROW, '--k': `var(--${ch.c})` }}>
      {w > 0 && (
        <svg viewBox={`0 0 ${w} ${list.length * ROW}`} aria-hidden="true">
          <path className="road" d={d} />
          <path className="done" d={d} style={{ opacity: done ? 1 : 0 }} />
        </svg>
      )}
      {w > 0 && list.map((s, i) => {
        const st = P.stars[s.k], open = isOpen(D, P, s), now = open && !st;
        const p = pts[i], left = !narrow && p.x > w / 2;
        return (
          <div key={s.k}>
            <button className={`stop ${now ? 'now' : ''}`} style={{ left: p.x, top: p.y }} disabled={!open} onClick={() => onStation(s)} aria-label={`第 ${s.no} 站 ${stationLabel(D, s)}${st ? `，${st} 星` : open ? '' : '，未解锁'}`}>
              {now && <span className="pulse" />}
              {st ? <StationStamp D={D} s={s} stars={st} date={P.when[s.k]} /> : <span className="dot">{s.no}</span>}
            </button>
            <div className={`stop-label ${left ? 'left' : ''} ${open ? '' : 'locked'}`} style={left ? { right: w - p.x + 40, top: p.y } : { left: p.x + 40, top: p.y, maxWidth: narrow ? w - p.x - 44 : undefined }} aria-hidden="true">
              <b>{stationLabel(D, s)}</b>
              <span>{stationMeaning(D, s)} · {s.e.length} 词</span>
              {st ? <span className="stars">{'★'.repeat(st)}<em>{'★'.repeat(3 - st)}</em></span> : now ? <span style={{ color: 'var(--k)', fontWeight: 700 }}>下一站</span> : null}
            </div>
          </div>
        );
      })}
      <span className="sr">本章 {done}/{list.length} 站已通关</span>
    </div>
  );
}

function Chapter({ D, P, ch, open, onToggle, onStation, onTrial }) {
  const body = useRef(null);
  const done = clearedIn(P, ch.stations), n = ch.stations.length, all = done === n;
  useEffect(() => {
    if (!open || reduced || !body.current) return;
    gsap.fromTo(body.current, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out' });
  }, [open]);
  return (
    <section className="chapter">
      <button className="ch-head" onClick={onToggle} aria-expanded={open}>
        {P.boss[ch.key] ? <ChapterSeal ch={ch} stars={P.boss[ch.key]} className="ch-seal" /> : <span className="ch-seal empty">{ch.n + 1}</span>}
        <span style={{ minWidth: 0 }}><span className="small muted">{TRACK[ch.c].name} · 第 {ch.n + 1} 章</span><h3 className="range" style={{ fontFamily: 'var(--f-word)', color: 'var(--fg)' }}>{chapterRange(D, ch)}</h3></span>
        <span className="num" style={{ fontWeight: 800 }}>{done}/{n}</span>
      </button>
      {open && (
        <div className="ch-body" ref={body}>
          <Route D={D} P={P} ch={ch} onStation={onStation} />
          <button className="trial" style={{ '--k': `var(--${ch.c})` }} disabled={!all} onClick={() => onTrial(ch)}>
            {P.boss[ch.key] ? <ChapterSeal ch={ch} stars={P.boss[ch.key]} className="seal-mini" /> : <span className="ch-seal empty" style={{ width: 40 }}>印</span>}
            <span><b style={{ fontFamily: 'var(--f-head)' }}>章节考验</b><br /><span className="small muted">混考本章 20 题，首答正确率 80% 得章节印</span></span>
            <span className="small" style={{ fontWeight: 700 }}>{P.boss[ch.key] ? '★'.repeat(P.boss[ch.key]) : all ? '挑战' : '通关本章后开放'}</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default function Journey({ D, P, track, setTrack, onStation, onTrial }) {
  const chapters = D.chapters[track];
  const firstOpen = () => { const i = chapters.findIndex(ch => ch.stations.some(s => !P.stars[s.k])); return i < 0 ? chapters.length - 1 : i; };
  const [openSet, setOpenSet] = useState(() => new Set([firstOpen()]));
  const ref = useRef(null);
  useEffect(() => { setOpenSet(new Set([firstOpen()])); }, [track]);
  useGSAP(() => { if (!reduced) gsap.from('.chapter', { y: 20, opacity: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out', clearProps: 'all' }); }, { scope: ref, dependencies: [track] });
  const t = TRACK[track];
  const total = D.byTrack[track].length, done = clearedIn(P, D.byTrack[track]);
  return (
    <div ref={ref}>
      <div className="tracks" role="group" aria-label="选择路线">
        {TRACKS.map(x => {
          const n = D.byTrack[x.c].length, c = clearedIn(P, D.byTrack[x.c]);
          return (
            <button key={x.c} className={`track-tab ${x.c}`} aria-pressed={track === x.c} onClick={() => setTrack(x.c)}>
              <span className="t-en">{x.en}</span>
              <span className="t-name">{x.name}</span>
              <span className="t-prog num">{c}/{n} 站</span>
              <span className="meter"><i style={{ width: `${(c / n) * 100}%` }} /></span>
            </button>
          );
        })}
      </div>
      <div className="track-intro">
        <h2 style={{ fontSize: '1.4rem' }}>{t.name}路线 <span className="num muted" style={{ fontSize: '1rem' }}>{done}/{total}</span></h2>
        <p className="small">{t.blurb}</p>
      </div>
      {chapters.map((ch, i) => (
        <Chapter key={ch.key} D={D} P={P} ch={ch} open={openSet.has(i)} onStation={onStation} onTrial={onTrial}
          onToggle={() => setOpenSet(s => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; })} />
      ))}
    </div>
  );
}
