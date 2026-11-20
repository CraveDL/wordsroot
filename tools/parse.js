// Parse OCR markdown of the roots book into raw entries
const fs=require('fs');
const src=process.argv[2];
const lines=fs.readFileSync(src,'utf8').split('\n');
let page=0; const out=[]; let cur=null;
const clean=s=>s.replace(/\\\(\s*\\rightarrow\s*\\\)/g,'→').replace(/\\\(|\\\)|\\mathrm\{([^}]*)\}/g,(m,a)=>a||'').replace(/\\rightarrow/g,'→').replace(/\s+/g,' ').trim();
const headRe=/^([A-Za-z][A-Za-z-]{2,})\s*[\[［\/]([^\]］]*)[\]］\/]\s*(.+)$/;
let mode=null,root=null;const roots=[];
for(const raw of lines){
  const l=raw.trim();
  let m;
  if((m=l.match(/PAGE_BREAK: Page (\d+)/))){page=+m[1];continue;}
  if(page>9 && (m=l.match(/^(?:#\s*)?词根\s*([a-zA-Z（）()，, ]+?)\s*[，,]?\s*表示\s*[“"]?(.+?)[”"]?\s*$/))){root={r:m[1].replace(/\s/g,'').replace(/，/g,',').replace(/（/g,'(').replace(/）/g,')').toLowerCase(),m:m[2].replace(/[“”"]/g,''),page};roots.push(root);mode=null;cur=null;continue;}
  if(!l||l.startsWith('---')||l.startsWith('![')||/TopSage|^#|^\*|^-\d+-$/.test(l)){ if(/^#|TopSage|^!\[/.test(l)) mode=null; continue;}
  if((m=l.match(headRe)) && /[一-龥]/.test(m[3])){
    cur={root:root&&root.r,w:m[1].toLowerCase(),def:clean(m[3]),page,ji:'',ex:'',exzh:''};out.push(cur);mode='def';continue;
  }
  if(!cur) continue;
  if(l.startsWith('【记】')){cur.ji=l.slice(3);mode='ji';continue;}
  if(l.startsWith('【例句】')){cur.ex=l.slice(4);mode='ex';continue;}
  if(mode==='ji'){
    if(/^(前缀|后缀|词根)/.test(l)||/^[a-z]+$/.test(l)||/^[a-zA-Z]{1,4}\.\s*[一-龥]/.test(l)){mode=null;continue;}
    cur.ji+=' '+l;continue;}
  if(mode==='ex'){
    if(/^(前缀|后缀|词根)/.test(l)||/^[a-z]+$/.test(l)||/^[a-zA-Z]{1,4}\.\s*[一-龥]/.test(l)||/^（/.test(l)){mode=null;continue;}
    if(/[一-龥]/.test(l)){ if(!cur.exzh){cur.exzh=l;} mode=null; continue;}
    cur.ex+=' '+l;continue;}
}
for(const e of out){e.ji=clean(e.ji);e.ex=clean(e.ex).replace(/- /g,'');e.exzh=clean(e.exzh);}
const TAG=process.argv[3]||'';fs.writeFileSync('data/raw'+TAG+'.json',JSON.stringify(out,null,0));
console.log(out.length, out.filter(e=>e.ji.startsWith('拆')).length, out.filter(e=>e.ex&&e.exzh).length);
fs.writeFileSync('data/roots_raw'+TAG+'.json',JSON.stringify(roots));const c={};out.forEach(e=>c[e.root]=(c[e.root]||0)+1);console.log(roots.map(r=>r.page+' '+r.r+'='+r.m+' #'+(c[r.r]||0)).join(' | '));
