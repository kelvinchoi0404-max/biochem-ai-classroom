/* Exact source strings and original page boundaries; semantic formula styling only. */
window.renderChapter02Inline=function(text,meta,t,paragraphIndex,offset){
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let at=0;const runs=(t.paragraphs[paragraphIndex]?.runs||[]).map(r=>{const v={start:at,end:at+r.text.length,style:r.style||{}};at=v.end;return v;});
 const marks=[...(meta.emphasis||[]).map(m=>({...m,kind:'key'})),...runs.filter(r=>r.style.verticalAlign==='sub'||r.style.verticalAlign==='super').map(r=>({start:Math.max(0,r.start-offset),end:Math.min(text.length,r.end-offset),kind:r.style.verticalAlign==='sub'?'sub':'sup'})).filter(r=>r.end>r.start)];
 if(t.id==='c02-p38-text02'&&paragraphIndex>0){const then=text.indexOf('THEN');if(then>=0)marks.push({start:then,end:text.length,kind:'key'});}
 const formulas=(window.CHAPTER_02_FORMULAS?.[t.id]?.[paragraphIndex]||[]).map(m=>({...m,start:Math.max(0,m.start-offset),end:Math.min(text.length,m.end-offset)})).filter(m=>m.end>m.start);
 const inlineSegment=(start,end,math=false)=>{
  const cuts=[...new Set([start,end,...marks.flatMap(m=>[m.start,m.end]).filter(x=>x>start&&x<end)])].sort((a,b)=>a-b);
  return cuts.slice(0,-1).map((a,i)=>{const b=cuts[i+1];let out=esc(text.slice(a,b));if(math)out=out.replace(/[¬∀∃⋁⋀→↔⇒⇔]/g,'<span class="math-glyph">$&</span>');for(const m of marks.filter(m=>m.start<=a&&m.end>=b))out=m.kind==='key'?'<strong class="key-term">'+out+'</strong>':'<'+m.kind+'>'+out+'</'+m.kind+'>';return out;}).join('');
 };
 const inline=(start,end,math=false)=>{
  if(t.id!=='c02-p39-text02')return inlineSegment(start,end,math);
  // Wrap the source phrase before emphasis splits its characters into styled runs.
  let out='',cursor=start;for(const match of text.slice(start,end).matchAll(/長腿/g)){const a=start+match.index,b=a+match[0].length;out+=inlineSegment(cursor,a,math)+'<span class="c02-intact-phrase">'+inlineSegment(a,b,math)+'</span>';cursor=b;}return out+inlineSegment(cursor,end,math);
 };
 const mathInline=(start,end)=>{let out='',cursor=start;for(const match of text.slice(start,end).matchAll(/[A-Za-z][A-Za-z0-9]*\([^()]*\)|<[^<>]+>/g)){const a=start+match.index,b=a+match[0].length;out+=inline(cursor,a,true)+'<span class="math-unit">'+inline(a,b,true)+'</span>';cursor=b;}return out+inline(cursor,end,true);};
 let cursor=0,out='';for(const m of formulas){out+=inline(cursor,m.start);out+='<span class="math-'+m.kind+(m.display?' math-display':'')+'" data-formula-start="'+(m.start+offset)+'" data-formula-end="'+(m.end+offset)+'">'+mathInline(m.start,m.end)+'</span>';cursor=m.end;}return (out+inline(cursor,text.length)).replace(/置信度/g,'<span class="keep-term">置信度</span>');
};
window.renderChapter02=function(sc,ctx){
 const {slides,sourceMap,renderFragment:rf,imageFigure:figure,titleText,esc,icon}=ctx,s=slides[sc.page-1],main=s.texts[1];
 const range=(t,a,b=t.paragraphs.length)=>({id:t.id,start:t.paragraphs.slice(0,a).reduce((n,p)=>n+p.text.length+1,0),end:b>=t.paragraphs.length?t.text.length:t.paragraphs.slice(0,b).reduce((n,p)=>n+p.text.length+1,0)});
 const p=(a,b,cls='',t=main)=>rf(range(t,a,b),cls),full=t=>rf({id:t.id,start:0,end:t.text.length});
 const diag=()=>{const d=s.diagrams[0],displaySrc=s.n===40?'chapters/02/assets/original/p40-layout-diagram.png':d.src,text=d.textIds.map(id=>sourceMap[id].text).join('\n');return '<figure class="lesson-figure native-diagram"><button class="image-button" data-image="'+esc(displaySrc)+'" aria-label="放大原課件流程圖"><img src="'+esc(displaySrc)+'" width="'+d.intrinsicWidth+'" height="'+d.intrinsicHeight+'" data-native-diagram="'+d.id+'" data-native-rendering="'+(s.n===40?'layout-derivative':'source-render')+'" data-diagram-text-ids="'+d.textIds.join(' ')+'" alt="'+esc(text)+'"></button></figure>';};
 const photo=(path='generated/knowledge-model-cover.png')=>figure({path});
 if(sc.layout==='hero'){const heading=s.n===1?titleText(s.texts[0]).replace(esc(s.texts[0].text),'<span class="c02-cover-number">第2章 </span><span class="c02-cover-line">知識表示</span><span class="c02-cover-line">與知識圖譜</span>'):titleText(s.texts[0]);return '<section class="page hero c02-hero c02-page-'+s.n+'" data-page="'+s.n+'" data-part="1" aria-labelledby="page-title"><img class="hero-photo" src="assets/'+(s.n===29?'generated/rule-model-v6.png':'generated/knowledge-model-cover.png')+'" alt="'+(s.n===29?'AI 生成的規則推理實物模型':'AI 生成的知識表示概念場景')+'"><div class="hero-content"><span class="chapter-kicker">CHAPTER 02</span>'+heading+(main?'<div class="hero-body">'+full(main)+'</div>':'')+'<button class="hero-action" '+(s.n===56?'data-home':'data-step="next"')+'><span>'+(s.n===56?'返回課程首頁':s.n===1?'開始探索':'繼續探索')+'</span>'+icon('arrow')+'</button></div></section>';}
 let content='';
 if(sc.layout==='truth'){
  const table=s.tables[0];content=full(main)+'<table class="truth-table"><tbody>'+table.rows.map((row,i)=>'<tr>'+row.map((id,j)=>{const t=sourceMap[id],masks=s.images.filter(im=>im.tableCell?.row===i&&im.tableCell?.column===j),tag=i===0?'th':'td';return '<'+tag+(i===0?' scope="col"':'')+'>'+masks.map(im=>'<img class="source-answer-mask" src="'+esc(im.src)+'" data-original-image="'+im.id+'" alt="原PPT答案格底圖" width="'+im.intrinsicWidth+'" height="'+im.intrinsicHeight+'">').join('')+full(t)+'</'+tag+'>';}).join('')+'</tr>').join('')+'</tbody></table>';
 }else if(sc.layout==='exercise'){
  content=p(0,1,'exercise-heading')+'<div class="exercise-pairs">'+[1,2,3,4,5,6].map((i)=>'<div class="exercise-pair">'+p(i,i===6?8:i+1,'exercise-question')+p(i+7,i+8,'exercise-answer')+'</div>').join('')+'</div>';
 }else if(sc.layout==='rules'){
  content=p(0,1,'rule-heading')+'<div class="rule-columns">'+[[1,7],[7,11],[11,16]].map(([a,b])=>'<div class="rule-column">'+p(a,b)+'</div>').join('')+'</div>';
 }else if(sc.layout==='frames'){
  content=s.texts.slice(1).map(t=>{
   let html=full(t);
   if(s.n===45){
    // The template and example have different slot boundaries. Preserve every source character.
    const template=t.id==='c02-p45-text02';
    const facets=template?[2,3,4,5,8,9,10]:[2,3,5,6,7,9,10];
    const lastFacets=template?[5,10]:[3,7,10];
    html=html.replace(/data-paragraph="(\d+)"/g,(attribute,index)=>{
     const n=Number(index),level=n===0?'frame':n===12?'constraint':n===11?'spacer':facets.includes(n)?'facet':'slot';
     return attribute+' data-frame-level="'+level+'"'+(lastFacets.includes(n)?' data-frame-facet-end="true"':'');
    });
   }
   if(s.n===46){
    const facets=t.id==='c02-p46-text02'?[4,6,12]:[];
    html=html.replace(/data-paragraph="(\d+)"/g,(attribute,index)=>{
     const n=Number(index),facet=facets.includes(n);
     return attribute+' data-frame-level="'+(n===0?'frame':facet?'facet':'slot')+'"'+(facet?' data-frame-facet-end="true"':'');
    });
    html=html.replace(/&lt;[^&<>]+框架&gt;/g,value=>'<span class="frame-reference-value">'+value+'</span>');
   }
   return '<article class="frame-model">'+html+'</article>';
  }).join('');
 }else if(s.n===40){
  const rules=slides[37].texts[1];
  const reference=[[1,7],[7,11],[11,16]].map(([a,b])=>'<div class="c02-reference-column">'+p(a,b,'',rules)+'</div>').join('');
  content=diag()+'<aside class="c02-rule-reference" aria-label="第38頁規則庫"><h2>規則庫 <span>第38頁</span></h2><div class="c02-reference-grid">'+reference+'</div></aside>';
 }else if(sc.layout==='diagram'||sc.layout==='diagram-text'){
  content=(main&&!(sc.diagramTextIds||[]).includes(main.id)?'<article class="diagram-copy">'+full(main)+'</article>':'')+diag();
 }else if(sc.layout==='animals'){
  content=full(main)+'<div class="animal-gallery">'+s.images.map(im=>figure(im)).join('')+'</div>';
 }else if(sc.layout==='knowledge-image'){
  content='<article>'+full(main)+'</article><div class="knowledge-visual">'+figure(s.images[0])+full(s.texts[2])+'</div>';
 }else if(sc.layout==='construction'){
  content='<article class="construction-copy">'+p(0,14)+p(14,16)+'</article>'+figure(s.images[0]);
 }else if(sc.layout==='photo-steps'){
  content='<article>'+full(main)+'</article>'+photo();
 }else if(s.n===7){
  content=sc.groups.slice(0,3).map(g=>'<article class="c02-group '+g.name+'">'+g.fragments.map(f=>rf(f)).join('')+'</article>').join('')+'<article class="c02-group g3">'+p(9,10,'uncertainty-title')+p(10,11,'uncertainty-example')+photo('photos/mars-whale-rock-v6.jpg')+'</article>';
 }else if(s.n===26){
  content=sc.groups.map(g=>'<article class="c02-group '+g.name+'">'+g.fragments.map(f=>rf(f)).join('')+'</article>').join('')+photo('photos/shakey-sri-1972-v6.jpg');
 }else if(s.n===25){
  content='<article class="reasoning-steps-copy">'+full(main)+'</article>'+photo('generated/rule-model-v6.png');
 }else if(s.n===54){
  content='<article class="graph-copy">'+sc.groups.map(g=>'<div class="graph-part">'+g.fragments.map(f=>rf(f)).join('')+'</div>').join('')+'</article>'+figure(s.images[0]);
 }else if(s.n===39){
  content=sc.groups.map((g,i)=>'<article class="c02-group c02-inference-stage '+g.name+'" aria-label="推理步驟 '+(i+1)+'"><span class="c02-stage-number" aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span>'+g.fragments.map(f=>rf(f)).join('')+'</article>').join('');
 }else if(sc.groups.length){
  content=sc.groups.map(g=>'<article class="c02-group '+g.name+'">'+g.fragments.map(f=>rf(f)).join('')+(s.n===7&&g.name==='g3'?photo('photos/mars-whale-rock-v6.jpg'):s.n===26&&g.name==='g2'?photo('photos/shakey-sri-1972-v6.jpg'):'')+'</article>').join('');
 }else content=sc.fragments.map(f=>rf(f)).join('');
 return '<section class="page reading c02-page c02-page-'+s.n+' c02-layout-'+sc.layout+'" data-page="'+s.n+'" data-part="1" aria-labelledby="page-title"><div class="page-heading">'+titleText(s.texts[0])+'</div><div class="c02-composition">'+content+'</div></section>';
};
