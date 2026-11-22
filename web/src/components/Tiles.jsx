import { useRef } from 'react';
import { gsap, useGSAP, reduced } from '../lib/fx.js';
import { KIND } from '../lib/data.js';

export function Tile({ p, gloss = true, className = '', ...rest }) {
  const label = gloss ? p.g || (p.k !== 'c' ? KIND[p.k] : '') : '';
  return (
    <span className={`tile ${p.k} ${p.f ? 'focus' : ''} ${className}`} {...rest}>
      {p.t}{label ? <small>{label}</small> : null}
    </span>
  );
}

// A word's tiles. With `burst`, the tiles start pressed together and spring apart, labels rising in.
export function Tiles({ entry, gloss = true, burst = false, center = false }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (!burst || reduced) return;
    const el = ref.current;
    const tl = gsap.timeline();
    tl.fromTo(el, { '--gap': '0px' }, { '--gap': '6px', duration: 0.7, ease: 'elastic.out(1, 0.55)' })
      .from(el.querySelectorAll('.tile'), { scale: 0.86, duration: 0.5, stagger: 0.06, ease: 'back.out(2.4)' }, 0)
      .from(el.querySelectorAll('.tile small'), { opacity: 0, y: 6, duration: 0.35, stagger: 0.06 }, 0.2);
  }, { scope: ref, dependencies: [entry, burst] });
  return (
    <div ref={ref} className={`tiles ${center ? 'center' : ''}`}>
      {entry.p.map((p, i) => <Tile key={i} p={p} gloss={gloss} />)}
    </div>
  );
}

export const Legend = () => (
  <div className="legend">
    <span><i style={{ background: 'var(--p)' }} />前缀</span>
    <span><i style={{ background: 'var(--r)' }} />词根</span>
    <span><i style={{ background: 'var(--s)' }} />后缀</span>
    <span><i style={{ background: 'var(--b)' }} />词干</span>
  </div>
);

export function SayButton({ word, onSay }) {
  return (
    <button className="say" onClick={() => onSay(word)} aria-label={`朗读 ${word}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
    </button>
  );
}

export const Stars = ({ n, max = 3 }) => <span className="stars-inline" aria-label={`${n} 星`}>{'★'.repeat(n)}<span style={{ color: 'var(--line)' }}>{'★'.repeat(Math.max(0, max - n))}</span></span>;
