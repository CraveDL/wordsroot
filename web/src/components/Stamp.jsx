import { station as stationSvg, seal as sealSvg } from '../lib/stamps.js';
import { TRACK, stationLabel, stationMeaning, sealText } from '../lib/data.js';

// Ink texture used by stamps drawn with rough: true
export const InkFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -6 4.7" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" />
      </filter>
    </defs>
  </svg>
);

export function StationStamp({ D, s, stars = 1, date, rough = false, className = '' }) {
  const svg = stationSvg({ label: stationLabel(D, s), sub: stationMeaning(D, s), no: s.no, stars, ink: TRACK[s.c].ink, top: TRACK[s.c].top, date, rough });
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
export function ChapterSeal({ ch, stars = 1, rough = false, className = '' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: sealSvg({ text: sealText(ch), stars, rough }) }} />;
}
