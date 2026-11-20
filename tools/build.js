// Turn raw parsed entries into the game dataset (public/data.js)
const fs=require('fs');
const dict=new Set(require(process.argv[2]));
const VOL=process.argv[3]||'1';
const raw=require('../data/raw'+(VOL==='1'?'':VOL)+'.json'), rootsRaw=require('../data/roots_raw'+(VOL==='1'?'':VOL)+'.json');
// ---- roots by page (headings found in the text + ones the OCR lost) ----
const CFG={
 '1':{max:410,
  fix:{'at':'lat','ud,lus':'lud,lus','lav,luy,lut':'lav,luv,lut','ac(u)':'ac,acu','agog(o)':'agog','bi(o)':'bio','cur(r),curs,cour(s)':'cur,curs,cour','doc(t)':'doc,doct','duc(t)':'duc,duct','equ(i)':'equ','log(u)':'log,logu','mag(n),maj,max':'mag,magn,maj,max','man(u)':'man,manu','mun(i)':'mun','nom(y)':'nom','arch,archy':'arch','idea,ideo':'ide'},
  mfix:{366:['mir','惊奇，看'],312:['leg','法律，读'],328:['log,logu','说话；学科'],68:['cap,cip,cup','头；拿，抓'],140:['cur,curs,cour','跑，流']},
  add:[[80,'ceiv,cept','拿，抓'],[106,'clos,clus,clud','关闭'],[202,'ferv','沸，热'],[220,'flor,flour','花'],[222,'flu','流动'],[224,'form','形状'],[384,'mot','移动']]},
 '2':{max:416,
  fix:{'patr(i)':'patr','the(a)':'the','ten(u)':'tenu','proper,proper':'proper,propri','spin':'spir','quest':'quest,quer','tang':'tang,tact'},
  mfix:{54:['pens,pend','花费，称量'],58:['pend,pens','悬挂'],294:['tend,tent,tens','伸展'],366:['vari','变化'],36:['pass','感情，忍受'],300:['terr','土地，恐惧'],212:['sol','单独；太阳'],286:['temper,tempor','时间；脾气'],136:['rad,radic','根；放射']},
  add:[[44,'ped','脚'],[104,'prehens,prehend','抓住'],[362,'vail,val','价值，强壮'],[414,'zoo','动物']]}
}[VOL];
const fix=CFG.fix,mfix=CFG.mfix;
let roots=rootsRaw.filter(r=>r.page%2===0&&r.page<CFG.max).map(r=>({page:r.page,r:fix[r.r]||r.r,m:r.m.replace(/,\s*/g,'，').replace(/、/g,'，').replace(/。$/,'')}));
for(const [p,[r,m]] of Object.entries(mfix)){const x=roots.find(o=>o.page==p);if(x){x.r=r;x.m=m;}}
CFG.add.forEach(([page,r,m])=>roots.push({page,r,m}));
roots.sort((a,b)=>a.page-b.page);

const rootOf=p=>{let x=null;for(const r of roots){if(r.page<=p)x=r;else break;}return x;};
// ---- helpers ----
const lev=(a,b)=>{const d=[...Array(a.length+1)].map((_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]!==b[j-1]));return d[a.length][b.length];};
function align(word,parts){ // split word into parts.length contiguous segments, min edit distance
  const k=parts.length,n=word.length,INF=1e9;
  const dp=[...Array(k+1)].map(()=>Array(n+1).fill(INF)),bk=[...Array(k+1)].map(()=>Array(n+1).fill(0));dp[0][0]=0;
  for(let i=1;i<=k;i++)for(let e=i;e<=n;e++)for(let s=i-1;s<e;s++){if(dp[i-1][s]>=INF)continue;const c=dp[i-1][s]+lev(word.slice(s,e),parts[i-1]);if(c<dp[i][e]){dp[i][e]=c;bk[i][e]=s;}}
  if(dp[k][n]>=INF)return null;const segs=[];let e=n;for(let i=k;i>=1;i--){segs.unshift(word.slice(bk[i][e],e));e=bk[i][e];}
  return {cost:dp[k][n],segs};
}
const zh=s=>/[一-龥]/.test(s);
const tidy=s=>s.replace(/\s+/g,' ').replace(/\s*([，；。：、（）“”])\s*/g,'$1').replace(/\(/g,'（').replace(/\)/g,'）').trim();
function cleanDef(d){
  d=d.replace(/\\nu/g,' v.').replace(/\._?\{[^}]*\}/g,'. ').replace(/_?\{\\[a-z]+\}/g,'').replace(/【.*$/,'').replace(/-?\d+-?$/,'');
  d=d.replace(/\b(vt|vi|v|n|a|ad|adj|adv|prep|conj|pron)\s*[\.．,]?\s*(?=[一-龥（(\[<“])/gi,(m,p)=>({adj:'a',adv:'ad'}[p.toLowerCase()]||p.toLowerCase())+'. ');
  d=d.replace(/[（(][^（）()]*$/,''); // unclosed bracket tail
  return tidy(d).replace(/[；;,，。\s]+$/,'');
}
const out=[];const seen=new Set(VOL==='1'?[]:require('../data/vol1.json').words.map(o=>o.w));const stats={nodict:0,dup:0,nodef:0,nosplit:0};
for(const e of raw){
  let {w,def,ji,ex,exzh,page}=e;
  if(/【记】/.test(def)&&!ji){ji=def.slice(def.indexOf('【记】')+3);}
  if(!dict.has(w)){stats.nodict++;continue;}
  if(seen.has(w)){stats.dup++;continue;}
  def=cleanDef(def);
  if(!zh(def)||def.length>46||!/^(vt|vi|v|n|a|ad|prep|conj|pron)\. /.test(def)){stats.nodef++;continue;}
  const root=rootOf(page);if(!root)continue;
  const variants=root.r.split(',');
  // --- morpheme breakdown ---
  let parts=null,story='',alignCost=0,mismatch=false;
  const body=ji.replace(/^拆[：:]\s*/,'');
  const cut=body.search(/→/);const head=(cut<0?body:body.slice(0,cut)).replace(/十/g,'+').replace(/\^/g,'');
  story=cut<0?'':body.slice(cut);
  if(/\+/.test(head)){
    const ps=head.split('+').map(s=>s.trim()).filter(Boolean).map(s=>{const m=s.match(/^([A-Za-z]+)\s*(?:[（(](.*?)[）)]?)?\s*$/);return m?{t:m[1].toLowerCase(),g:(m[2]||'').trim()}:null;});
    if(ps.every(Boolean)&&ps.length<=5){
      const al=align(w,ps.map(p=>p.t));
      if(al&&al.cost<=Math.min(2,Math.floor(w.length/4))&&al.segs.every(s=>s.length)){
        alignCost=al.cost;parts=ps.map((p,i)=>{
          let g=p.g,k='x';
          if(/前缀/.test(g))k='p';else if(/后缀/.test(g))k='s';
          g=g.replace(/(名词|动词|形容词|副词)?(前缀|后缀)[：:]?/,(m,a)=>a?a+'后缀 ':'').replace(/表示?/g,'').replace(/[“”"]/g,'').replace(/^[：:\s]+|[：:\s]+$/g,'').replace(/拼音[：:]?/,'谐音 ').replace(/连接字母/,'连接');
          return {t:al.segs[i],g:tidy(g),k};
        });
      }
    }
  }
  if(parts){
    // locate the root tile
    let ri=parts.findIndex(p=>p.k==='x'&&variants.some(v=>p.t===v||p.t.startsWith(v)&&p.t.length<=v.length+2));
    if(ri<0)ri=parts.findIndex(p=>p.k==='x'&&variants.some(v=>p.t.includes(v)));
    if(ri>=0){parts[ri].k='r';
      parts.forEach((p,i)=>{if(p.k!=='x')return;if(/连接/.test(p.g)||(p.t.length<=1&&(i>0||!p.g))){p.k='c';return;}p.k=i<ri?'p':'s';});
    } else parts.forEach(p=>{if(p.k==='x')p.k=(p.t.length<=1||/连接/.test(p.g))?'c':'x';});
    if(parts.length<2)parts=null;
  }
  if(!parts){
    // fall back: mark the root inside the word
    const v=variants.slice().sort((a,b)=>b.length-a.length).find(v=>w.includes(v));
    if(!v){stats.nosplit++;continue;}
    const i=w.indexOf(v);parts=[];
    if(i>0)parts.push({t:w.slice(0,i),g:'',k:'p'});
    parts.push({t:v,g:root.m,k:'r'});
    if(i+v.length<w.length)parts.push({t:w.slice(i+v.length),g:'',k:'s'});
    story=/^(联想|读)/.test(ji)?'':story; if(/→/.test(ji)&&!story)story=ji.slice(ji.indexOf('→'));
  }
  parts.forEach(p=>{if(p.k==='r'&&!p.g)p.g=root.m;});
  story=tidy(story.replace(/-?\d+-?\s*$/,'').replace(/\s[a-z]+ (n|a|v|vt|vi)\..*$/,'')).replace(/^→/,'').replace(/→/g,' → ').trim();
  story=story.replace(/(。)?[（(\s]*注意[^。→]*$/,'$1');
  if(story.length>60||!zh(story))story='';
  const cjk=x=>new Set((x.match(/[\u4e00-\u9fa5]/g)||[]).filter(c=>!'的地得使了人物不'.includes(c)));
  if(story){const a=cjk(story),b=cjk(def);if(![...a].some(c=>b.has(c))){story='';if(alignCost>0){mismatch=true;}}}
  if(mismatch){const v=variants.slice().sort((a,b)=>b.length-a.length).find(v=>w.includes(v));if(!v){stats.nosplit++;continue;}const i=w.indexOf(v);parts=[];if(i>0)parts.push({t:w.slice(0,i),g:'',k:'p'});parts.push({t:v,g:root.m,k:'r'});if(i+v.length<w.length)parts.push({t:w.slice(i+v.length),g:'',k:'s'});}
  // --- example ---
  ex=(ex||'').trim();exzh=tidy(exzh||'');
  const stem=w.slice(0,Math.max(3,w.length-3));
  const okEx=ex&&exzh&&ex.split(' ').length>=3&&ex.length<130&&ex.toLowerCase().includes(stem)&&/[.!?]$/.test(ex)&&ex.split(/[^A-Za-z']+/).filter(t=>t.length>2).every(t=>dict.has(t.toLowerCase())||/^[A-Z]/.test(t)||dict.has(t.toLowerCase().replace(/'s$/,'')));
  seen.add(w);
  out.push({w,d:def,r:root.r,p:parts,s:story,e:okEx?ex:'',z:okEx?exzh:''});
}

// ---- pick 1000 ----
const score=o=>(o.e?2:0)+(o.s?1:0)+(o.p.length>1&&o.p.some(p=>p.g&&p.k!=='r')?1:0);
let words=out.slice();
while(words.length>1000){
  const cnt={};words.forEach(o=>cnt[o.r]=(cnt[o.r]||0)+1);
  let bi=-1,bv=1e9;words.forEach((o,i)=>{const v=score(o)*100-cnt[o.r];if(v<bv){bv=v;bi=i;}});
  words.splice(bi,1);
}
// ---- levels: 8–12 words, one or two neighbouring roots each ----
const by={};words.forEach((o,i)=>{(by[o.r]=by[o.r]||[]).push(i);});
const levels=[];let buf={roots:[],words:[]};
const flush=()=>{if(buf.words.length){levels.push(buf);buf={roots:[],words:[]};}};
const doneR=new Set();
for(const r of roots){const ws=by[r.r];if(!ws||doneR.has(r.r))continue;doneR.add(r.r);
  if(ws.length>=13){flush();const k=Math.ceil(ws.length/10),sz=Math.ceil(ws.length/k);for(let i=0;i<ws.length;i+=sz)levels.push({roots:[r.r],words:ws.slice(i,i+sz)});continue;}
  if(buf.words.length+ws.length>12)flush();
  buf.roots.push(r.r);buf.words.push(...ws);
  if(buf.words.length>=8)flush();
}
flush();
for(let i=levels.length-1;i>0;i--){if(levels[i].words.length<6&&levels[i-1].words.length+levels[i].words.length<=14){levels[i-1].roots.push(...levels[i].roots.filter(r=>!levels[i-1].roots.includes(r)));levels[i-1].words.push(...levels[i].words);levels.splice(i,1);}}
const used=new Set(words.map(o=>o.r));
const R=roots.filter((r,i)=>used.has(r.r)&&roots.findIndex(x=>x.r===r.r)===i).map(r=>({r:r.r,m:r.m}));
const sizes=levels.map(l=>l.words.length);
console.log('vol',VOL,'kept',out.length,'words',words.length,'levels',levels.length,'min',Math.min(...sizes),'max',Math.max(...sizes),'ex',words.filter(o=>o.e).length,'story',words.filter(o=>o.s).length);
fs.writeFileSync('data/vol'+VOL+'.json',JSON.stringify({roots:R,words,levels}));
