// Motion setup (GSAP plugins, reduced motion), sounds and speech.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, Flip, DrawSVGPlugin, SplitText, useGSAP);
export const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) gsap.globalTimeline.timeScale(20);
export { gsap, ScrollTrigger, Flip, useGSAP };

let ac = null, soundOn = true, tts = null;
export const setSound = on => { soundOn = on; };
export const setTts = t => { tts = t; };
function tone(freqs, dur = 0.12, type = 'triangle', vol = 0.12) {
  if (!soundOn) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * dur * 0.9;
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur);
    });
  } catch { /* no audio */ }
}
export const sfx = {
  ok: () => tone([660, 880]), no: () => tone([220, 160], 0.16, 'sawtooth', 0.07), tap: () => tone([520], 0.05, 'sine', 0.06),
  thud: () => tone([90, 60], 0.18, 'sine', 0.35), up: () => tone([523, 659, 784, 1046], 0.13), click: () => tone([880], 0.03, 'square', 0.03),
};
export function speak(text) {
  if (tts) { tts.speak(text, { language: 'en' }).catch(() => {}); return; }
  try { const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch { /* no speech here */ }
}
