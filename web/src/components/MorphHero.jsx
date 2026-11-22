import { useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, reduced } from '../lib/fx.js';

const PREFERRED = ['unpredictable', 'transportation', 'incredible', 'benefactor', 'interruption', 'supervision', 'manuscript', 'telegraph', 'irreversible', 'contradiction'];

// The landing page's word: shown whole, pulled apart into prefix / root / suffix, then pressed back together.
export default function MorphHero({ D }) {
  const words = useMemo(() => {
    const good = e => e && e.p.length >= 3 && e.p.length <= 5 && e.p.some(p => p.k === 'r') && e.p.every(p => p.k !== 'b') && e.w.length <= 15;
    const list = PREFERRED.map(w => D.entries[D.wordIndex.get(w)]).filter(good);
    for (let i = 0; list.length < 8 && i < D.entries.length; i += 97) if (good(D.entries[i]) && !list.includes(D.entries[i])) list.push(D.entries[i]);
    return list;
  }, [D]);
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const e = words[i % words.length];
  useGSAP(() => {
    const el = ref.current;
    const pieces = el.querySelectorAll('.morph-piece');
    const word = el.querySelector('.morph-word');
    const color = p => getComputedStyle(p).getPropertyValue('--k').trim();
    if (reduced) { gsap.set(word, { '--gap': '0.2em' }); gsap.set(el.querySelectorAll('.bg, .lab'), { opacity: 1, scale: 1 }); return; }
    const tl = gsap.timeline({ onComplete: () => setI(n => n + 1) });
    tl.set(word, { '--gap': '0em' })
      .from(pieces, { yPercent: 60, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' })
      .to(word, { '--gap': '0.22em', duration: 0.9, ease: 'elastic.out(1, 0.6)' }, '+=0.5')
      .to(el.querySelectorAll('.bg'), { opacity: 1, scale: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(2)' }, '<')
      .to([...pieces].map(p => p.querySelector('.txt')), { color: (n, t) => color(t.parentNode), duration: 0.3, stagger: 0.07 }, '<')
      .fromTo(el.querySelectorAll('.lab'), { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07 }, '<0.15')
      .fromTo(el.querySelector('.morph-caption'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, '<')
      .to({}, { duration: 2.2 })
      .to(el.querySelectorAll('.lab'), { opacity: 0, duration: 0.25 })
      .to(el.querySelectorAll('.bg'), { opacity: 0, scale: 0.9, duration: 0.3 }, '<')
      .to(word, { '--gap': '0em', duration: 0.45, ease: 'power3.inOut' }, '<')
      .to([...pieces].map(p => p.querySelector('.txt')), { color: 'var(--fg)', duration: 0.3 }, '<')
      .to(el.querySelector('.morph-caption'), { opacity: 0, duration: 0.3 }, '<')
      .to(pieces, { yPercent: -50, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, '+=0.5');
  }, { scope: ref, dependencies: [i] });
  if (!e) return null;
  return (
    <div className="morph-stage" ref={ref} aria-label={`${e.w}：${e.p.map(p => p.t).join(' + ')}`}>
      <div className="morph-word" key={i}>
        {e.p.map((p, n) => (
          <span key={n} className={`morph-piece ${p.k}`}>
            <span className="bg" aria-hidden="true" />
            <span className="txt">{p.t}</span>
            <span className="lab" aria-hidden="true">{p.g || ''}</span>
          </span>
        ))}
      </div>
      <p className="morph-caption">{e.d}</p>
    </div>
  );
}
