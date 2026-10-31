/* Exact source strings and original page boundaries; semantic formula styling only. */
window.renderChapter04Inline=function(text,meta,t,paragraphIndex,offset){
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let at=0;const runs=(t.paragraphs[paragraphIndex]?.runs||[]).map(r=>{const v={start:at,end:at+r.text.length,style:r.style||{}};at=v.end;return v;});
 const marks=[...(meta.emphasis||[]).map(m=>({...m,kind:'key'})),...runs.filter(r=>r.style.verticalAlign==='sub'||r.style.verticalAlign==='super').map(r=>({start:Math.max(0,r.start-offset),end:Math.min(text.length,r.end-offset),kind:r.style.verticalAlign==='sub'?'sub':'sup'})).filter(r=>r.end>r.start)];
 const formulas=(window.CHAPTER_04_FORMULAS?.[t.id]?.[paragraphIndex]||[]).map(m=>({...m,start:Math.max(0,m.start-offset),end:Math.min(text.length,m.end-offset)})).filter(m=>m.end>m.start);
 const inline=(start,end,math=false)=>{
  const cuts=[...new Set([start,end,...marks.flatMap(m=>[m.start,m.end]).filter(x=>x>start&&x<end)])].sort((a,b)=>a-b);
  return cuts.slice(0,-1).map((a,i)=>{const b=cuts[i+1];let out=esc(text.slice(a,b));if(math)out=out.replace(/[¬∀∃⋁⋀→↔⇒⇔]/g,'<span class="math-glyph">$&</span>');for(const m of marks.filter(m=>m.start<=a&&m.end>=b))out=m.kind==='key'?'<strong class="key-term">'+out+'</strong>':'<'+m.kind+'>'+out+'</'+m.kind+'>';return out;}).join('');
 };
 const mathInline=(start,end)=>{
  const units=Array.from(text.slice(start,end).matchAll(/[A-Za-z][A-Za-z0-9]*\([^()]*\)|<[^<>]+>|-?(?:\d*\.\d+|\d+)(?:\/-?(?:[A-Za-z][A-Za-z0-9]*|\d+(?:\.\d+)?))?/g),m=>({start:start+m.index,end:start+m.index+m[0].length}));
  for(const m of marks.filter(m=>['sub','sup'].includes(m.kind)&&m.start>=start&&m.end<=end)){const base=text.slice(start,m.start).match(/(?:[A-Za-z]+|\d+(?:\.\d+)?|\))$/);if(base)units.push({start:m.start-base[0].length,end:m.end});}
  units.sort((a,b)=>a.start-b.start||b.end-a.end);const merged=[];
  for(const u of units){const last=merged.at(-1);if(last&&u.start<last.end)last.end=Math.max(last.end,u.end);else merged.push({...u});}
  let out='',cursor=start;for(const u of merged){out+=inline(cursor,u.start,true)+'<span class="math-unit">'+inline(u.start,u.end,true)+'</span>';cursor=u.end;}
  return out+inline(cursor,end,true);
 };
 let cursor=0,out='';for(const m of formulas){out+=inline(cursor,m.start);out+='<span class="math-'+m.kind+(m.display?' math-display':'')+'" data-formula-start="'+(m.start+offset)+'" data-formula-end="'+(m.end+offset)+'">'+mathInline(m.start,m.end)+'</span>';cursor=m.end;}return (out+inline(cursor,text.length));
};
window.renderChapter04=function(sc,ctx){
 const {slides,sourceMap,esc,titleText,icon,imageFigure}=ctx,s=slides[sc.page-1],typeMap=window.CHAPTER_04_TYPOGRAPHY||{},title=sourceMap[s.titleTextId];
 const rf=(f,extra='')=>{const t=sourceMap[f.id],start=f.start??0,end=f.end??t.text.length;let base=0,html='';t.paragraphs.forEach((p,i)=>{const finish=base+p.text.length,lf=i<t.paragraphs.length-1;
 if(finish>start&&base<end||!p.text.length&&base>=start&&base<end){const a=Math.max(0,start-base),b=Math.min(p.text.length,end-base),text=p.text.slice(a,b),meta=typeMap[t.id]?.[i]||{role:text?'body':'empty'},role=meta.role||'body',tag=role==='heading'?'h2':role==='subheading'?'h3':text?'p':'span';
 let content=window.renderChapter04Inline(text,{...meta,emphasis:(meta.emphasis||[]).filter(m=>m.start>=a&&m.end<=b).map(m=>({...m,start:m.start-a,end:m.end-a}))},t,i,a);
 if(s.n===31&&i===5&&a===0&&b===p.text.length){const cuts=[0,...['西洋跳棋','國際象棋','圍棋'].map(v=>p.text.indexOf(v)),p.text.length];content='<span class="c04-game-estimates">'+cuts.slice(0,-1).map((x,j)=>{const y=cuts[j+1];return '<span>'+window.renderChapter04Inline(p.text.slice(x,y),{...meta,emphasis:(meta.emphasis||[]).filter(m=>m.start>=x&&m.end<=y).map(m=>({...m,start:m.start-x,end:m.end-x}))},t,i,x)+'</span>';}).join('')+'</span>';}
 html+=s.n===2&&text?'<button class="agenda-item" data-page="'+[4,10,17,21,25,41][i]+'" data-paragraph="'+i+'">'+content+'</button>':'<'+tag+' class="paragraph type-'+role+(!text?' empty-paragraph':'')+'" data-paragraph="'+i+'">'+content+'</'+tag+'>';}
 if(lf&&finish>=start&&finish<end)html+='\n';base=finish+(lf?1:0);});return '<div class="source-fragment '+extra+'" data-source-id="'+t.id+'" data-source-start="'+start+'" data-source-end="'+end+'">'+html+'</div>';};
 const full=t=>rf({id:t.id});
 const diagram=d=>'<figure class="lesson-figure c04-diagram"><button class="image-button" data-image="'+esc(d.src)+'" aria-label="放大原課件圖形"><img data-native-diagram="'+d.id+'" data-diagram-text-ids="'+(d.textIds||[]).join(' ')+'" data-diagram-image-ids="'+(d.imageIds||[]).join(' ')+'" src="'+esc(d.src)+'" alt="'+esc((d.textIds||[]).map(id=>sourceMap[id].text).join('\n'))+'" width="'+d.intrinsicWidth+'" height="'+d.intrinsicHeight+'"></button></figure>';
 const table=t=>window.renderChapter04Board(t,sourceMap,full);
 const start=(t,i)=>t.paragraphs.slice(0,i).reduce((n,p)=>n+p.text.length+1,0);
 const pf=(t,a,b=t.paragraphs.length)=>rf({id:t.id,start:start(t,a),end:b>=t.paragraphs.length?t.text.length:start(t,b)});
 const pictures=()=>s.images.filter(im=>sc.images.includes(im.id)).map(im=>imageFigure(im)).join('');
 const visuals=()=>s.diagrams.map(diagram).join('')+pictures();
 const body=()=>sc.fragments.map(f=>rf(f)).join('');
 const groups=()=>sc.groups.map(g=>'<article class="c04-group '+g.name+'">'+g.fragments.map(f=>rf(f)).join('')+'</article>').join('');
 const heroPath='assets/generated/search-strategy-cover-v8.png';
 if(sc.layout==='hero')return '<section class="page hero c04-hero c04-page-'+s.n+'" data-page="'+s.n+'" data-part="1" aria-labelledby="page-title"><img class="hero-photo" src="'+heroPath+'" alt="AI生成的移動機器人與路徑規劃實驗台概念場景"><div class="hero-content"><span class="chapter-kicker">CHAPTER 04</span>'+titleText(title)+'<div class="hero-body">'+body()+'</div><button class="hero-action" '+(s.n===43?'data-home':'data-step="next"')+'><span>'+(s.n===43?'返回課程首頁':s.n===1?'開始探索':'繼續探索')+'</span>'+icon('arrow')+'</button></div></section>';
 let content='';
 if(['agenda','objectives'].includes(sc.layout))content=body();
 else if(['reading','state-definition','evaluation'].includes(sc.layout))content=groups();
 else if(sc.layout==='photo-reading')content='<article class="c04-photo-copy">'+groups()+'</article><div class="c04-visuals c04-photo">'+imageFigure({path:sc.photo})+'</div>';
 else if(sc.layout==='demonstration')content='<article>'+body()+'</article><div class="c04-visuals">'+imageFigure({path:heroPath.replace(/^assets\//,'')})+'</div>';
 else if(sc.layout==='puzzle'&&s.n===13){const t=sourceMap[sc.mainId],label=start(t,5),split=label+t.paragraphs[5].text.indexOf('\t')+1,cap=t.text.indexOf('八數碼狀態空間圖',start(t,11));content='<article class="c04-puzzle-copy">'+pf(t,0,5)+'<div class="c04-board-pair">'+s.tables.map((tab,i)=>'<div>'+table(tab)+rf({id:t.id,start:i?split:label,end:i?start(t,6):split},'c04-board-label')+'</div>').join('')+'</div>'+rf({id:t.id,start:start(t,6),end:cap})+'</article><div class="c04-puzzle-tree"><div class="c04-visuals">'+visuals()+'</div>'+rf({id:t.id,start:cap,end:t.text.length},'c04-figure-label')+'</div>';}
 else if(sc.layout==='puzzle'){const labels=sc.fragments.filter(f=>f.id!==sc.mainId),main=sourceMap[sc.mainId];content='<article class="c04-copy">'+full(main)+'</article><div class="c04-puzzle-visuals"><div class="c04-board-pair c04-has-arrow">'+s.tables.filter(t=>sc.tables.includes(t.id)).map((t,i)=>'<div>'+table(t)+(labels[i]?rf(labels[i],'c04-board-label'):'')+'</div>').join('')+'<span class="c04-board-arrow" aria-hidden="true" data-original-connector="'+s.nativeShapes.find(n=>n.kind==='connector')?.id+'">→</span></div>'+(s.images.length||s.diagrams.length?'<div class="c04-visuals">'+visuals()+'</div>':'')+'</div>';}
 else if(sc.layout==='boards')content='<article class="c04-copy">'+body()+'</article><div class="c04-board-pane">'+s.tables.filter(t=>sc.tables.includes(t.id)).map(table).join('')+'</div>';
 else if(sc.layout==='wide-illustration'&&s.n===18){const t=sourceMap[sc.mainId],caption=start(t,10),split=t.text.indexOf('回溯搜索示意圖',caption);content='<article class="c04-maze-intro"><div>'+pf(t,0,2)+'</div><div>'+pf(t,2,10)+'</div></article><div class="c04-maze-example"><div class="c04-dual-captions">'+rf({id:t.id,start:caption,end:split})+rf({id:t.id,start:split,end:t.text.length})+'</div><div class="c04-visuals">'+visuals()+'</div></div>';}
 else if(sc.layout==='wide-illustration')content='<article class="c04-copy">'+body()+'</article><div class="c04-visuals c04-visuals-'+(s.diagrams.length+sc.images.length)+'">'+visuals()+'</div>';
 else content='<article class="c04-copy">'+body()+'</article><div class="c04-visuals c04-visuals-'+(s.diagrams.length+sc.images.length)+'">'+visuals()+'</div>';
 return '<section class="page reading c04-page c04-page-'+s.n+' c04-layout-'+sc.layout+' c04-density-'+sc.density+' c04-columns-'+sc.columns+(sc.lead?' c04-has-lead':'')+'" data-page="'+s.n+'" data-part="1" aria-labelledby="page-title"><div class="page-heading">'+titleText(title)+'</div><div class="c04-composition">'+content+'</div></section>';
};
window.renderChapter04PrintText=function(t,s){return t.paragraphs.map((p,i)=>'<span data-paragraph="'+i+'">'+window.renderChapter04Inline(p.text,{},t,i,0)+'</span>').join('\n');};

window.renderChapter04Board=function(t,sourceMap,full){
 const colors=node=>[...(node?.tag==='srgbClr'?[node.attributes.val]:[]),...(node?.children||[]).flatMap(colors)];
 const render=t=>'<table class="c04-board" aria-label="原課件棋局"><tbody>'+t.rows.map((row,i)=>'<tr>'+row.map((id,j)=>{const cell=t.cells.find(c=>c.row===i&&c.column===j),redText=sourceMap[id].paragraphs.some(p=>p.runs.some(r=>colors(r.properties).includes('FF0000'))),sides={lnL:'left',lnR:'right',lnT:'top',lnB:'bottom'},borders=(cell.properties?.children||[]).filter(n=>sides[n.tag]&&colors(n).includes('FF0000')).map(n=>'border-'+sides[n.tag]+':3px solid #a50038').join(';');return '<td'+(redText?' class="c04-marked-cell"':'')+' style="'+borders+'">'+full(sourceMap[id])+'</td>';}).join('')+'</tr>').join('')+'</tbody></table>';
 return render(t);
};
window.renderChapter04PrintTables=function(s,textMap,sourceAttributes,printText){
 if(!s.tables.length)return '';
 const full=t=>'<span '+sourceAttributes(t)+'>'+printText(t)+'</span>',arrow=s.nativeShapes.find(n=>n.kind==='connector');
 return '<div class="c04-print-boards">'+s.tables.map((t,i)=>window.renderChapter04Board(t,textMap,full)+(i===0&&arrow?'<span class="c04-print-arrow" data-original-connector="'+arrow.id+'" aria-hidden="true">→</span>':'')).join('')+'</div>';
};
