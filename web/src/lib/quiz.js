// Question building for a station, a chapter trial and wrong-word review.
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const pick = (a, n) => shuffle(a).slice(0, n);
export { shuffle };

const canAssemble = e => e.p.length >= 2 && e.p.length <= 6;
const canFill = e => e.p.some(p => p.f && p.t.length >= 2) && e.p.length >= 2;

// station: one question per word about its meaning or build, one about each group's meaning, then a second round on half the words
export function stationQuiz(D, station) {
  const ws = station.e;
  const groups = station.g.map(g => ({ t: 'group', g }));
  const first = ws.map((ei, n) => ({ t: canAssemble(D.entries[ei]) && n % 3 !== 2 ? 'asm' : 'mean', e: ei }));
  const extra = pick(ws, Math.ceil(ws.length / 2)).map((ei, n) => ({ t: n % 2 === 0 && canFill(D.entries[ei]) ? 'fill' : 'word', e: ei }));
  return [...groups, ...shuffle(first), ...shuffle(extra)];
}
export function mixedQuiz(D, entryIds) {
  return shuffle(entryIds).map((ei, n) => {
    const e = D.entries[ei], t = ['mean', 'asm', 'word', 'fill'][n % 4];
    return { t: (t === 'asm' && !canAssemble(e)) || (t === 'fill' && !canFill(e)) ? 'mean' : t, e: ei };
  });
}

// distractors: prefer the same station, then the same track
export function meaningOptions(D, ei, n, near) {
  const e = D.entries[ei];
  const ok = i => i !== ei && D.entries[i].d !== e.d && D.entries[i].w.toLowerCase() !== e.w.toLowerCase();
  const a = pick(near.filter(ok), 1);
  const track = D.groups[e.g].c;
  const pool = [];
  for (let k = 0; k < 40 && pool.length < n; k++) { const i = Math.floor(Math.random() * D.entries.length); if (ok(i) && !a.includes(i) && !pool.includes(i) && D.groups[D.entries[i].g].c === track) pool.push(i); }
  return shuffle([ei, ...a, ...pool].slice(0, n));
}
export function groupOptions(D, gi) {
  const g = D.groups[gi];
  const same = D.groups.map((x, i) => i).filter(i => i !== gi && D.groups[i].c === g.c && D.groups[i].zh && D.groups[i].zh !== g.zh);
  return shuffle([gi, ...pick(same, 3)]);
}
// extra tiles for the build question: other morphemes of the same kinds
export function tilePool(D, ei, near) {
  const e = D.entries[ei];
  const own = e.p.map((p, i) => ({ id: 'o' + i, t: p.t, k: p.k }));
  const have = new Set(own.map(p => p.t.toLowerCase()));
  const extra = [];
  for (const i of shuffle([...near, ...pick(D.entries.map((_, k) => k), 10)])) {
    for (const p of D.entries[i].p) {
      const low = p.t.toLowerCase();
      if (!have.has(low) && p.t.length > 1 && p.k !== 'b' && extra.length < 3) { have.add(low); extra.push({ id: 'x' + extra.length, t: p.t, k: p.k }); }
    }
    if (extra.length >= 3) break;
  }
  return shuffle([...own, ...extra]);
}
