import { useEffect, useRef } from 'react';
import { gsap, reduced } from '../lib/fx.js';
import { lenis } from '../lib/scroll.js';

// Full-screen sheet over the page. Pauses smooth scrolling underneath and scrolls natively itself.
export default function Overlay({ children, onClose, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    lenis.current?.stop();
    document.documentElement.style.overflow = 'hidden';
    if (!reduced) gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' });
    const key = e => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', key);
    const first = el.querySelector('button, [href], input');
    first?.focus({ preventScroll: true });
    return () => { document.removeEventListener('keydown', key); document.documentElement.style.overflow = ''; lenis.current?.start(); };
  }, []);
  return <div ref={ref} className="overlay" role="dialog" aria-modal="true" aria-label={label} data-lenis-prevent>{children}</div>;
}

export const SheetTop = ({ onClose, children }) => (
  <div className="sheet-top"><button className="x" onClick={onClose} aria-label="关闭">×</button>{children}</div>
);
