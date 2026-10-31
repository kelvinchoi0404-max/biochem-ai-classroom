/* Exact source strings and original page boundaries; semantic formula styling only. */
window.renderChapter06Inline=function(text,meta,t,paragraphIndex,offset){
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let at=0;const runs=(t.paragraphs[paragraphIndex]?.runs||[]).map(r=>{const v={start:at,end:at+r.text.length,style:r.style||{}};at=v.end;return v;});
 const marks=[...(meta.emphasis||[]).map(m=>({...m,kind:'key'})),...runs.filter(r=>r.style.verticalAlign==='sub'||r.style.verticalAlign==='super').map(r=>({start:Math.max(0,r.start-offset),end:Math.min(text.length,r.end-offset),kind:r.style.verticalAlign==='sub'?'sub':'sup'})).filter(r=>r.end>r.start),...runs.filter(r=>r.style.colorRGB&&r.style.colorRGB!=='000000').map(r=>({start:Math.max(0,r.start-offset),end:Math.min(text.length,r.end-offset),kind:'color',color:r.style.colorRGB})).filter(r=>r.end>r.start)];
 const formulas=(window.CHAPTER_06_FORMULAS?.[t.id]?.[paragraphIndex]||[]).map(m=>({...m,start:Math.max(0,m.start-offset),end:Math.min(text.length,m.end-offset)})).filter(m=>m.end>m.start);
 const inline=(start,end,math=false)=>{
  const cuts=[...new Set([start,end,...marks.flatMap(m=>[m.start,m.end]).filter(x=>x>start&&x<end)])].sort((a,b)=>a-b);
  return cuts.slice(0,-1).map((a,i)=>{const b=cuts[i+1];let out=esc(text.slice(a,b)).replace(/粒子|最優解|信息素|群智能|加速度/g,'<span class="keep-term">$&</span>').replace(/\d+(?:\.\d+)?[-~–]\d+(?:\.\d+)?/g,'<span class="number-range">$&</span>');if(math)out=out.replace(/[¬∀∃⋁⋀→↔⇒⇔]/g,'<span class="math-glyph">$&</span>');for(const m of marks.filter(m=>m.start<=a&&m.end>=b))out=m.kind==='color'?'<span data-source-color="'+m.color+'" style="color:#'+({FF0000:'a50038','0000FF':'174b9b','00B050':'167345'}[m.color]||m.color)+'">'+out+'</span>':m.kind==='key'?'<strong class="key-term">'+out+'</strong>':'<'+m.kind+'>'+out+'</'+m.kind+'>';return out;}).join('');
 };
 const mathInline=(start,end)=>{
  const units=Array.from(text.slice(start,end).matchAll(/\[[^\[\]]+\]|[A-Za-z][A-Za-z0-9]*\([^()]*\)|<[^<>]+>|-?(?:\d*\.\d+|\d+)(?:\/-?(?:[A-Za-z][A-Za-z0-9]*|\d+(?:\.\d+)?))?/g),m=>({start:start+m.index,end:start+m.index+m[0].length}));
  for(const m of text.slice(start,end).matchAll(/\d+(?:\.\d+)?[-~–]\d+(?:\.\d+)?/g))units.push({start:start+m.index,end:start+m.index+m[0].length});
  for(const m of marks.filter(m=>['sub','sup'].includes(m.kind)&&m.start>=start&&m.end<=end)){const base=text.slice(start,m.start).match(/(?:[A-Za-z]+|\d+(?:\.\d+)?|\))$/);if(base)units.push({start:m.start-base[0].length,end:m.end});}
  units.sort((a,b)=>a.start-b.start||b.end-a.end);const merged=[];
  for(const u of units){const last=merged.at(-1);if(last&&u.start<last.end)last.end=Math.max(last.end,u.end);else merged.push({...u});}
  let out='',cursor=start;for(const u of merged){out+=inline(cursor,u.start,true)+'<span class="math-unit">'+inline(u.start,u.end,true)+'</span>';cursor=u.end;}
  return out+inline(cursor,end,true);
 };
 let cursor=0,out='';for(const m of formulas){out+=inline(cursor,m.start);out+='<span class="math-'+m.kind+(m.display?' math-display':'')+'" data-formula-start="'+(m.start+offset)+'" data-formula-end="'+(m.end+offset)+'">'+mathInline(m.start,m.end)+'</span>';cursor=m.end;}return (out+inline(cursor,text.length));
};
window.renderChapter06=function(sc,ctx){
 const {slides,sourceMap,esc,titleText,icon,imageFigure}=ctx,s=slides[sc.page-1],typeMap=window.CHAPTER_06_TYPOGRAPHY||{},title=sourceMap[s.titleTextId];
 const sourceAttr=(t,a,b)=>'data-source-id="'+t.id+'" data-source-start="'+a+'" data-source-end="'+b+'"';
 const mathImage=m=>'<button class="c06-native-math" data-image="'+esc(m.src)+'" aria-label="放大原課件公式"><img data-original-math="'+m.id+'" src="'+esc(m.src)+'" alt="'+esc(m.mathText||'原課件公式')+'" width="'+(m.intrinsicWidth||m.width||250)+'" height="'+(m.intrinsicHeight||m.height||80)+'"></button>';
 const rf=(f,extra='')=>{
  const t=sourceMap[f.id],start=f.start??0,end=f.end??t.text.length;let base=0,html='';
  t.paragraphs.forEach((p,i)=>{
   const length=p.text.length,finish=base+length,hasLF=i<t.paragraphs.length-1;
   const mo=(s.mathObjects||[]).filter(m=>m.textId===t.id&&m.paragraphIndex===i&&m.offsetUTF16>=start&&m.offsetUTF16<=end);
   if((finish>start&&base<end)||(length===0&&base>=start&&base<=end&&(mo.length||hasLF&&base<end))){
    const a=Math.max(0,start-base),b=Math.min(length,end-base),text=p.text.slice(a,b),meta=typeMap[t.id]?.[i]||{role:text?'body':'empty'};
    const part=(x,y)=>window.renderChapter06Inline(p.text.slice(x,y),{...meta,emphasis:(meta.emphasis||[]).filter(m=>m.start>=x&&m.end<=y).map(m=>({...m,start:m.start-x,end:m.end-x}))},t,i,x);
    let cursor=a,content='';for(const m of mo.sort((a,b)=>a.paragraphOffsetUTF16-b.paragraphOffsetUTF16)){const at=m.paragraphOffsetUTF16;if(at<a||at>b)continue;content+=part(cursor,at)+mathImage(m);cursor=at;}content+=part(cursor,b);
    const role=meta.role||'body' ,tag=role==='heading'?'h2':role==='subheading'?'h3':role==='empty'&&!mo.length?'span':'p';
    if(s.n===2&&text)html+='<button class="agenda-item" data-page="'+[4,8,18,22,36][i]+'" data-paragraph="'+i+'">'+content+'</button>';
    else html+='<'+tag+' class="paragraph type-'+role+(!text&&!mo.length?' empty-paragraph':'')+(mo.length?' with-native-math':'')+'" data-paragraph="'+i+'">'+content+'</'+tag+'>';
   }
   if(hasLF&&finish>=start&&finish<end)html+='\n';base=finish+(hasLF?1:0);
  });
  return '<div class="source-fragment '+extra+'" '+sourceAttr(t,start,end)+'>'+html+'</div>';
 };
 const full=t=>rf({id:t.id,start:0,end:t.text.length});

 const start=(t,i)=>t.paragraphs.slice(0,i).reduce((n,p)=>n+p.text.length+1,0),pf=(t,a,b=t.paragraphs.length)=>rf({id:t.id,start:start(t,a),end:b>=t.paragraphs.length?t.text.length:start(t,b)}),main=sourceMap[sc.mainId];
 const diagram=d=>'<figure class="lesson-figure c06-diagram"><button class="image-button" data-image="'+esc(d.src)+'" aria-label="放大原課件圖形"><img data-native-diagram="'+d.id+'" data-diagram-text-ids="'+(d.textIds||[]).join(' ')+'" data-diagram-image-ids="'+(d.imageIds||[]).join(' ')+'" src="'+esc(d.src)+'" alt="'+esc((d.textIds||[]).map(id=>sourceMap[id].text).join('\n'))+'" width="'+d.intrinsicWidth+'" height="'+d.intrinsicHeight+'"></button></figure>';
 const table=t=>window.renderChapter06Table(t,sourceMap,full);
 const pictures=()=>s.images.filter(im=>sc.images.includes(im.id)&&!im.blankSource).map(im=>imageFigure(im)).join(''),diagrams=()=>s.diagrams.map(diagram).join(''),visuals=()=>diagrams()+pictures(),body=()=>sc.fragments.map(f=>rf(f)).join('');
 const blanks=()=>s.images.filter(im=>sc.images.includes(im.id)&&im.blankSource).map(im=>'<div class="c06-source-blank">'+imageFigure(im)+'</div>').join('');
 const groups=()=>sc.groups.map(g=>'<article class="c06-group '+g.name+'">'+g.fragments.map(f=>rf(f)).join('')+'</article>').join('');
 const group=(a,b,cls='')=>'<article class="c06-group '+cls+'">'+pf(main,a,b)+'</article>';
 if(sc.layout==='hero')return '<section class="page hero c06-hero c06-page-'+s.n+'" data-page="'+s.n+'" data-part="1" aria-labelledby="page-title"><img class="hero-photo" src="assets/generated/swarm-intelligence-cover-v10.png" alt="AI生成的群體機器人協作研究概念場景"><div class="hero-content"><span class="chapter-kicker">CHAPTER 06</span>'+titleText(title)+'<div class="hero-body">'+body()+'</div><button class="hero-action" '+(s.n===39?'data-home':'data-step="next"')+'><span>'+(s.n===39?'返回課程首頁':s.n===1?'開始探索':'繼續探索')+'</span>'+icon('arrow')+'</button></div></section>';
 let content='';
 if(['agenda','objectives'].includes(sc.layout))content=body();
 else if(sc.layout==='reading')content=groups();
 else if(sc.layout==='photo'){const photo=window.CHAPTER_06_MEDIA?.find(m=>!m.generated&&(m.pages||[]).includes(s.n));content='<article class="c06-photo-copy">'+body()+'</article><div class="c06-visuals c06-photo">'+(photo?imageFigure(photo):'')+'</div>';}
 else if(sc.layout==='vectors')content='<div class="c06-vector-intro">'+pf(main,0,3)+'</div><div class="c06-vector-list">'+pf(main,3)+'</div>';
 else if(sc.layout==='pso-equation'){
  const leadEnd=s.n===12?4:3;content='<div class="c06-equation-band">'+pf(main,0,leadEnd)+'</div>';
  if(s.n===12)content=[content,'<div class="c06-three-parts">',group(4,5),group(5,6),group(6),'</div>'].join('');
  if(s.n===13)content+='<div class="c06-three-parts">'+group(3,4)+group(4,5)+group(5,7)+'</div><div class="c06-equation-foot">'+pf(main,7)+'</div>';
  if(s.n===14)content='<div class="c06-equation-band">'+pf(main,0,4)+'</div><div class="c06-four-parts">'+[4,5,6,7].map((a,i)=>group(a,i===3?main.paragraphs.length:a+1)).join('')+'</div>';
  if(s.n===17)content+='<div class="c06-four-parts">'+[3,4,5,6].map((a,i)=>group(a,i===3?main.paragraphs.length:a+1)).join('')+'</div>';
 }
 else if(sc.layout==='steps')content='<article class="c06-step-copy">'+body()+'</article><div class="c06-visuals">'+visuals()+'</div>';
 else if(sc.layout==='applications')content='<div class="c06-application-intro">'+pf(main,0,2)+'</div><div class="c06-application-list">'+pf(main,2)+'</div>';
 else if(sc.layout==='vrp-definition')content='<article class="c06-model-intro">'+body()+'</article><div class="c06-visuals c06-definitions-figure">'+visuals()+blanks()+'</div>';
 else if(sc.layout==='vrp-model')content='<div class="c06-model-title">'+full(main)+'</div><div class="c06-visuals">'+visuals()+blanks()+'</div><article class="c06-model-copy">'+sc.fragments.filter(f=>f.id!==main.id).map(f=>rf(f)).join('')+'</article>';
 else if(sc.layout==='aco-parameters')content=body();
 else if(sc.layout==='aco-probability')content='<div class="c06-probability-intro">'+full(main)+'</div><div class="c06-probability-figure c06-visuals">'+visuals()+'</div><article class="c06-symbols">'+sc.fragments.filter(f=>f.id!==main.id).map(f=>rf(f)).join('')+'</article>';
 else if(sc.layout==='comparison-table')content='<div class="c06-table-intro">'+body()+'</div>'+(s.images.length?'<div class="c06-table-formula c06-visuals">'+visuals()+'</div>':'')+s.tables.map(table).join('');
 else if(sc.layout==='pheromone-update')content='<article class="c06-update-law">'+pf(main,0,8)+'</article><article class="c06-update-sum">'+pf(main,8)+'</article>';
 else if(sc.layout==='deposit-models'&&s.n===30)content='<div class="c06-deposit-heading">'+pf(main,0,6)+'</div><div class="c06-visuals">'+visuals()+'</div><div class="c06-deposit-legend">'+pf(main,6)+'</div>';
 else if(sc.layout==='deposit-models'&&s.n===31)content='<article class="c06-deposit-row">'+pf(main,0,5)+'<div class="c06-visuals">'+(s.diagrams[0]?diagram(s.diagrams[0]):'')+'</div>'+pf(main,5,8)+'</article><article class="c06-deposit-row">'+pf(main,8)+'<div class="c06-visuals">'+(s.diagrams[1]?diagram(s.diagrams[1]):'')+'</div></article>';
 else if(sc.layout==='data-table-image')content='<article class="c06-data-intro">'+body()+'</article><div class="c06-visuals">'+visuals()+'</div>';
 else if(sc.layout==='gantt')content='<article class="c06-gantt-copy">'+full(main)+'</article><div class="c06-gantt-figure">'+sc.fragments.filter(f=>f.id!==main.id).map(f=>rf(f)).join('')+'<div class="c06-visuals">'+visuals()+'</div></div>';
 return '<section class="page reading c06-page c06-page-'+s.n+' c06-layout-'+sc.layout+' c06-density-'+sc.density+' c06-columns-'+sc.columns+(sc.lead?' c06-has-lead':'')+'" data-page="'+s.n+'" data-part="1" aria-labelledby="page-title"><div class="page-heading">'+titleText(title)+'</div><div class="c06-composition">'+content+'</div></section>';
};
window.renderChapter06Table=function(t,sourceMap,full){return '<table class="c06-table" data-original-table="'+t.id+'"><tbody>'+t.rows.map(row=>'<tr>'+row.map((id,j)=>'<'+(j===0?'th scope="row"':'td')+'>'+full(sourceMap[id])+'</'+(j===0?'th':'td')+'>').join('')+'</tr>').join('')+'</tbody></table>';};
window.renderChapter06PrintTables=function(s,textMap,sourceAttributes,printText){const full=t=>'<span '+sourceAttributes(t)+'>'+printText(t)+'</span>';return s.tables.map(t=>window.renderChapter06Table(t,textMap,full)).join('');};

window.renderChapter06PrintText=function(t,s){
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return t.paragraphs.map((p,i)=>{let at=0,html='';const maths=(s.mathObjects||[]).filter(m=>m.textId===t.id&&m.paragraphIndex===i).sort((a,b)=>a.paragraphOffsetUTF16-b.paragraphOffsetUTF16);
  const part=(a,b)=>window.renderChapter06Inline(p.text.slice(a,b),{},t,i,a);
  for(const m of maths){const end=m.paragraphOffsetUTF16;html+=part(at,end)+'<img class="print-native-math" data-original-math="'+m.id+'" src="'+esc(m.src)+'" alt="'+esc(m.mathText)+'">';at=end;}
  return '<span data-paragraph="'+i+'">'+html+part(at,p.text.length)+'</span>';
 }).join('\n');
};
