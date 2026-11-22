// Smooth page scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger stays in step.
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from './fx.js';

export const lenis = { current: null };
export function startLenis() {
  if (reduced || lenis.current) return () => {};
  const l = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, autoRaf: false });
  const tick = t => l.raf(t * 1000);
  l.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenis.current = l;
  return () => { gsap.ticker.remove(tick); l.destroy(); lenis.current = null; };
}
export const scrollTop = () => { if (lenis.current) lenis.current.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0); };
