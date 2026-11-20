// Join the per-volume datasets into public/data.js. Volume 1 always comes first so saved progress keeps pointing at the same levels and words.
const fs=require('fs');
const vols=['1','2'].map(v=>require('../data/vol'+v+'.json'));
const roots=[],words=[],levels=[],starts=[];const names=new Set(),seen=new Set();
for(const v of vols){
  const off=words.length, map=[];starts.push(levels.length);
  v.roots.forEach(r=>{if(names.has(r.r))throw new Error('root name used twice: '+r.r);names.add(r.r);roots.push(r);});
  const keep=new Set();
  v.words.forEach((w,i)=>{if(seen.has(w.w)){map[i]=-1;return;}seen.add(w.w);map[i]=words.length;words.push(w);});
  v.levels.forEach(l=>levels.push({roots:l.roots,words:l.words.map(i=>map[i]).filter(i=>i>=0)}));
}
const aff={p:{},s:{}};words.forEach(o=>o.p.forEach(p=>{if((p.k==='p'||p.k==='s')&&p.g&&!/谐音|形似|联想|单词/.test(p.g)&&p.g.length<=12){const m=aff[p.k][p.t]=aff[p.k][p.t]||{};m[p.g]=(m[p.g]||0)+1;}}));
const top=m=>Object.entries(m).map(([t,g])=>({t,n:Object.values(g).reduce((a,b)=>a+b,0),g:Object.entries(g).sort((a,b)=>b[1]-a[1])[0][0]})).filter(x=>x.n>=3).sort((a,b)=>b.n-a.n);
const affixes={p:top(aff.p),s:top(aff.s)};
fs.writeFileSync('public/data.js','window.RQ_DATA='+JSON.stringify({roots,words,levels,starts,affixes})+';');
console.log('roots',roots.length,'words',words.length,'levels',levels.length,'prefixes',affixes.p.length,'suffixes',affixes.s.length,'bytes',fs.statSync('public/data.js').size);
