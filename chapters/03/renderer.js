/* v41 display-only alignment with the teacher's v17 PPT. The original source dataset stays intact. */
(function(){
 const paragraphs={
  33:{5:'化爲前束形：(∀x)(∃y)(∃z)(¬P(x, y)⋁(Q(x, z)⋀¬R(x, z)))',6:'消去存在量詞：(∀x)(¬P(x, f(x))⋁(Q(x, g(x))⋀¬R(x, g(x))))',8:'消去全稱量詞：(¬P(x, f(x))⋁Q(x, g(x)))⋀(¬P(x, f(x))⋁¬R(x, g(x)))',10:'更換變量名稱：{¬P(x, f(x))⋁Q(x, g(x)), ¬P(y, f(y))⋁¬R(y, g(y))}'},
  34:{5:'(∀x)(∃y)(∀w){{[P(x)⋀Q(x)]⋁[S(x, y)⋀Q(x)]}⋀[P(w)⋁B(w)]}'}
 };
 const example3Prenex='(∃x)(∀y)(∃z)(¬P(z)⋁Q(x, z)⋁R(x, y, f(a)))';
 const overview=[
  {page:30,start:12,end:60}, {page:30,start:62,end:184}, {page:30,start:186,end:238},
  {page:31,start:192,end:234,lines:['化爲前束形','前束形 =（前綴）{母式}','前綴：量詞串（∀、∃）','母式：不含量詞的謂詞公式','量詞前移，保持原有次序。']},
  {page:31,start:12,end:190,lines:['消去存在量詞','前面沒有全稱量詞：','用新的個體常量替換。','前面有全稱量詞：','用新的 Skolem 函數替換。','(∀x₁)…(∀xₙ)(∃y)','P(x₁, x₂, …, xₙ, y)','y = f(x₁, x₂, …, xₙ)','Skolem化：用上述新項替換','存在量詞量化的變量。']},
  {page:32,start:12,end:121,lines:['化爲Skolem標準形','Skolem標準形：','(∀x₁)(∀x₂)…(∀xₙ)M','M：子句的合取式，稱爲','Skolem標準形的母式。','P⋁(Q⋀R) ⇔ (P⋁Q)⋀(P⋁R)']},
  {page:32,start:123,end:129,lines:['消去全稱量詞']},
  {page:32,start:131,end:136,lines:['消去合取詞']},
  {page:32,start:138,end:145,lines:['更換變量名稱']}
 ];
 const source=page=>window.CHAPTER_03_SLIDES?.find(s=>s.n===Number(page));
 const visibleBody=(page,t)=>{
  if(Number(page)===30)return '謂詞公式化爲子句集步驟\n'+overview.map((step,i)=>{
   const original=source(step.page)?.texts.find(text=>text.id==='c03-p'+step.page+'-text02');
   return (i+1)+'　'+(step.lines?step.lines.join('\n'):original?.text.slice(step.start,step.end).replace(/ {3,}/g,'\n')||'');
  }).join('\n');
  return t.paragraphs.flatMap((p,i)=>Number(page)===35&&i===5?[example3Prenex,p.text]:[paragraphs[page]?.[i]??p.text]).join('\n');
 };
 window.renderChapter03VisibleText=(page,sourceTextId)=>{
  if(![30,33,34,35].includes(Number(page)))return null;
  const slide=source(page);if(!slide)return null;
  const texts=sourceTextId?slide.texts.filter(t=>t.id===sourceTextId):slide.texts;
  return texts.map(t=>t.id.endsWith('-text02')?visibleBody(page,t):t.text).join('\n');
 };
 Object.defineProperty(window,'CHAPTER_03_VISIBLE_TEXT_OVERRIDES',{configurable:true,enumerable:true,get:()=>Object.fromEntries([30,33,34,35].map(page=>[page,window.renderChapter03VisibleText(page)]))});
 window.CHAPTER_03_DISPLAY_ORDER={paragraphs,example3Prenex,overview};
 window.renderChapter03DisplayInline=text=>{
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const styled=value=>esc(value).replace(/[₁₂ₙ]/g,c=>'<sub>'+({'₁':'1','₂':'2','ₙ':'n'}[c])+'</sub>').replace(/[¬∀∃⋁⋀→↔⇒⇔]/g,'<span class="math-glyph">$&</span>');
  const colon=text.indexOf('：');
  if(colon>=0&&/^[（(]?∀|^[（(]?∃|^[¬{]/.test(text.slice(colon+1)))return esc(text.slice(0,colon+1))+'<span class="math-formula">'+styled(text.slice(colon+1))+'</span>';
  return /[∀∃¬⋁⋀⇔]/.test(text)?'<span class="math-formula">'+styled(text)+'</span>':styled(text);
 };
})();

/* Authored examples accompany source pages; original PPT data is untouched. */
(function(){
 const fuzzyExamples=[
  ['包含','A=(0.7,0.8)、B=(0.3,0.5)，則 A⊇B。'],
  ['相等','A=(0.3,0.7)、B=(0.3,0.7)，則 A=B。'],
  ['交','A=(0.3,0.8)、B=(0.6,0.5)，則 A∩B=(0.3,0.5)。'],
  ['並','A=(0.3,0.8)、B=(0.6,0.5)，則 A∪B=(0.6,0.8)。'],
  ['補','A=(0.3,0.8)，則 Aᶜ=(0.7,0.2)。']
 ];
 const domain='以下各例均以 U={x₁,x₂}，按次序列出隸屬度。';
 window.CHAPTER_03_TEACHING_ADDITIONS={38:'即堂練習\nC₁ = P ∨ Q\nC₂ = ¬P ∨ R\n求 C₁ 與 C₂ 的歸結式。\n答案：C₁₂ = Q ∨ R\n消去互補文字 P 與 ¬P，將剩餘的 Q 與 R 析取。',93:'模糊集合運算例子\n'+domain+'\n'+fuzzyExamples.map(([label,text])=>label+'例：'+text).join('\n')};
 window.renderChapter03TeachingAddition=function(page,index){
 if(Number(page)===93){
  const example=i=>'<p class="c03-fuzzy-example" data-teaching-addition="fuzzy-example-'+i+'"><span class="c03-fuzzy-example-label">'+(i===0?'例（U={x₁,x₂}）：':'例：')+'</span>'+fuzzyExamples[i][1]+'</p>';
  if(Number.isInteger(index)&&fuzzyExamples[index])return example(index);
  return '<aside class="c03-fuzzy-print-examples" data-teaching-addition="fuzzy-examples"><h2>模糊集合運算例子</h2><p>'+domain+'</p>'+fuzzyExamples.map(([label,text])=>'<p><strong>'+label+'：</strong>'+text+'</p>').join('')+'</aside>';
 }
 if(Number(page)!==38)return '';
 return '<aside class="c03-resolution-practice" data-teaching-addition="resolution-practice"><h2>即堂練習</h2><div class="c03-resolution-practice-grid"><div data-resolution-question><p class="resolution-practice-formula">C<sub>1</sub> = P ∨ Q</p><p class="resolution-practice-formula">C<sub>2</sub> = ¬P ∨ R</p><p class="resolution-practice-prompt">求 C<sub>1</sub> 與 C<sub>2</sub> 的歸結式。</p></div><div data-resolution-answer><p class="resolution-practice-formula resolution-practice-result">C<sub>12</sub> = Q ∨ R</p><p class="resolution-practice-explanation">消去互補文字 <strong>P</strong> 與 <strong>¬P</strong>，<br>將剩餘的 Q 與 R 析取。</p></div></div></aside>';
 };
})();

/* Exact source strings and original page boundaries; semantic formula styling only. */
window.renderChapter03Inline=function(text,meta,t,paragraphIndex,offset){
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let at=0;const runs=(t.paragraphs[paragraphIndex]?.runs||[]).map(r=>{const v={start:at,end:at+r.text.length,style:r.style||{}};at=v.end;return v;});
 const marks=[...(meta.emphasis||[]).map(m=>({...m,kind:'key'})),...runs.filter(r=>r.style.verticalAlign==='sub'||r.style.verticalAlign==='super').map(r=>({start:Math.max(0,r.start-offset),end:Math.min(text.length,r.end-offset),kind:r.style.verticalAlign==='sub'?'sub':'sup'})).filter(r=>r.end>r.start)];
 const formulas=(window.CHAPTER_03_FORMULAS?.[t.id]?.[paragraphIndex]||[]).map(m=>({...m,start:Math.max(0,m.start-offset),end:Math.min(text.length,m.end-offset)})).filter(m=>m.end>m.start);
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
 let cursor=0,out='';for(const m of formulas){out+=inline(cursor,m.start);out+='<span class="math-'+m.kind+(m.display?' math-display':'')+'" data-formula-start="'+(m.start+offset)+'" data-formula-end="'+(m.end+offset)+'">'+mathInline(m.start,m.end)+'</span>';cursor=m.end;}return (out+inline(cursor,text.length)).replace(/置信度/g,'<span class="keep-term">置信度</span>');
};
window.renderChapter03=function(sc,ctx){
 const {slides,sourceMap,esc,titleText,icon,imageFigure}=ctx,s=slides[sc.page-1],typeMap=window.CHAPTER_03_TYPOGRAPHY||{},title=sourceMap[s.titleTextId]||s.texts[0];
 const sourceAttr=(t,a,b)=>'data-source-id="'+t.id+'" data-source-start="'+a+'" data-source-end="'+b+'"';
 const mathImage=m=>'<button class="c03-native-math" data-image="'+esc(m.src)+'" aria-label="放大原課件公式"><img data-original-math="'+m.id+'" src="'+esc(m.src)+'" alt="'+esc(m.mathText||'原課件公式')+'" width="'+(m.intrinsicWidth||m.width||250)+'" height="'+(m.intrinsicHeight||m.height||80)+'"></button>';
 const rf=(f,extra='')=>{
  const t=sourceMap[f.id],start=f.start??0,end=f.end??t.text.length;let base=0,html='';
  t.paragraphs.forEach((p,i)=>{
   const length=p.text.length,finish=base+length,hasLF=i<t.paragraphs.length-1;
   const mo=(s.mathObjects||[]).filter(m=>m.textId===t.id&&m.paragraphIndex===i&&m.offsetUTF16>=start&&m.offsetUTF16<=end);
   if((finish>start&&base<end)||(length===0&&base>=start&&base<=end&&(mo.length||hasLF&&base<end))){
    const a=Math.max(0,start-base),b=Math.min(length,end-base),text=p.text.slice(a,b),meta=typeMap[t.id]?.[i]||{role:text?'body':'empty'};
    const part=(x,y)=>window.renderChapter03Inline(p.text.slice(x,y),{...meta,emphasis:(meta.emphasis||[]).filter(m=>m.start>=x&&m.end<=y).map(m=>({...m,start:m.start-x,end:m.end-x}))},t,i,x);
    let cursor=a,content='';for(const m of mo.sort((a,b)=>a.paragraphOffsetUTF16-b.paragraphOffsetUTF16)){const at=m.paragraphOffsetUTF16;if(at<a||at>b)continue;content+=part(cursor,at)+mathImage(m);cursor=at;}content+=part(cursor,b);
    if(s.n===92&&i===9&&a===0&&b===length){content='<span class="c03-formula-pair">'+part(0,4)+mathImage(mo[0])+part(4,6)+'</span><span class="c03-formula-pair">'+part(6,length)+mathImage(mo[1])+'</span>';}
    if(s.n===107&&i===3&&a===0&&b===length){const cut=p.text.indexOf('B =');content='<span class="c03-line-group">'+part(0,cut)+'</span><span class="c03-line-group">'+part(cut,length)+'</span>';}
    const displayOrder=window.CHAPTER_03_DISPLAY_ORDER,override=t.id==='c03-p'+s.n+'-text02'?displayOrder.paragraphs[s.n]?.[i]:undefined;
    if(override!==undefined&&a===0&&b===length)content=window.renderChapter03DisplayInline(override);
    const solutionStep=[33,34,35].includes(s.n)&&t.id==='c03-p'+s.n+'-text02'&&i>=2?(s.n===35&&i===5?5:i-1):null;
    if(s.n===35&&t.id==='c03-p35-text02'&&i===5&&a===0)html+='<p class="paragraph type-body clause-solution-added" data-clause-solution-step="4" data-source-display-override="clause-order-v17">'+window.renderChapter03DisplayInline(displayOrder.example3Prenex)+'</p>';
    const displayAttrs=(solutionStep?' data-clause-solution-step="'+solutionStep+'"':'')+(override!==undefined?' data-source-display-override="clause-order-v17"':'');
    const role=meta.role||'body' ,tag=role==='heading'?'h2':role==='subheading'?'h3':role==='empty'&&!mo.length?'span':'p';
    if(s.n===2&&text)html+='<button class="agenda-item" data-page="'+[4,25,50,57,68,85][i]+'" data-paragraph="'+i+'">'+content+'</button>';
    else html+='<'+tag+' class="paragraph type-'+role+(!text&&!mo.length?' empty-paragraph':'')+(mo.length?' with-native-math':'')+'" data-paragraph="'+i+'"'+displayAttrs+'>'+content+'</'+tag+'>';
   }
   if(hasLF&&finish>=start&&finish<end)html+='\n';base=finish+(hasLF?1:0);
  });
  const overridden=t.id==='c03-p'+s.n+'-text02'&&[33,34,35].includes(s.n);
  return '<div class="source-fragment '+extra+'" '+sourceAttr(t,start,end)+(overridden?' data-source-display-override="clause-order-v17"':'')+'>'+html+'</div>';
 };
 const full=t=>rf({id:t.id,start:0,end:t.text.length});
 if(s.n===30){
  // Display the updated v17 order while retaining the original source coordinates.
  const steps=window.CHAPTER_03_DISPLAY_ORDER.overview,numbers=['①','②','③','④','⑤','⑥','⑦','⑧','⑨'];
  const renderStep=(step,index)=>{
   let fragment;
   if(step.lines){
    const t=sourceMap['c03-p'+step.page+'-text02'];
    fragment='<div class="source-fragment" '+sourceAttr(t,step.start,step.end)+' data-source-display-override="clause-order-v17">'+step.lines.map((line,i)=>'<'+(i?'p':'h2')+' class="paragraph type-'+(i?'body':'heading')+'">'+window.renderChapter03DisplayInline(line)+'</'+(i?'p':'h2')+'>').join('')+'</div>';
   }else fragment=rf({id:'c03-p'+step.page+'-text02',start:step.start,end:step.end}).replace(/ {3,}/g,'<br>');
   fragment=fragment.replace(/(<h2\b[^>]*>)/,'$1<span class="clause-number" aria-hidden="true">'+numbers[index]+'</span>');
   return '<article class="clause-step" data-clause-step="'+(index+1)+'" aria-label="步驟'+(index+1)+'">'+fragment+'</article>';
  };
  const columns=[[0,1,2],[3,4],[5,6,7,8]].map(indices=>'<div class="clause-column">'+indices.map(i=>renderStep(steps[i],i)).join('')+'</div>').join('');
  return '<section class="page reading c03-page clause-overview clause-order-v17" data-page="30" data-source-pages="30 31 32" data-part="1" aria-labelledby="page-title"><div class="page-heading">'+titleText(title)+'</div><div class="clause-columns">'+columns+'</div></section>';
 }
 const diagram=d=>'<figure class="lesson-figure c03-diagram"><button class="image-button" data-image="'+esc(d.src)+'" aria-label="放大原課件圖形"><img data-native-diagram="'+d.id+'" data-diagram-text-ids="'+(d.textIds||[]).join(' ')+'" data-diagram-image-ids="'+(d.imageIds||[]).join(' ')+'" src="'+esc(d.src)+'" alt="'+esc((d.textIds||[]).map(id=>sourceMap[id].text).join('\n'))+'" width="'+d.intrinsicWidth+'" height="'+d.intrinsicHeight+'"></button></figure>';
 const table=t=>'<table class="c03-source-table"><tbody>'+t.rows.map((row,i)=>'<tr>'+row.map((id,j)=>{const native=s.diagrams.find(d=>d.tableHeaderCell?.tableId===t.id&&d.tableHeaderCell.row===i&&d.tableHeaderCell.column===j);return '<'+(i===0?'th':'td')+(i===0?' scope="col"':'')+'>'+full(sourceMap[id])+(native?diagram(native):'')+'</'+(i===0?'th':'td')+'>';}).join('')+'</tr>').join('')+'</tbody></table>';
 const pictures=()=>s.images.filter(im=>sc.images.includes(im.id)&&im.sourcePurpose!=='animated-answer-mask').map(im=>im.blankSource?'<div class="c03-source-blank">'+imageFigure(im)+'</div>':imageFigure(im)).join('');
 const diagrams=()=>s.diagrams.filter(d=>!d.tableHeaderCell).map(diagram).join('');
 const masks=()=>s.images.filter(im=>im.sourcePurpose==='animated-answer-mask').map(im=>'<img class="c03-answer-mask" data-original-image="'+im.id+'" src="'+esc(im.src)+'" alt="原課件動畫遮罩">').join('');
 const body=()=>sc.fragments.map(f=>rf(f)).join('');
 if(sc.layout==='hero'){
  const readingOnly=[50,57,68].includes(s.n);
  const chapterEnd=s.n===109;
  const notice=readingOnly?'<aside class="c03-reading-notice" aria-label="本部分教學安排"><strong>選讀材料</strong><p>本部分不在課堂講授；有興趣可自行閱讀。</p><p>目前預計不納入考核，最終以老師公布範圍為準。</p></aside>':'';
  return '<section class="page hero c03-hero c03-page-'+s.n+(readingOnly?' c03-reading-hero':'')+'" data-page="'+s.n+'" data-part="1" aria-labelledby="page-title"><img class="hero-photo" src="assets/generated/fuzzy-control-cover-v7.png" alt="AI生成的溫控設備與連續色樣概念場景"><div class="hero-content"><span class="chapter-kicker">CHAPTER 03</span>'+titleText(title)+'<div class="hero-body">'+body()+'</div>'+notice+'<button class="hero-action" '+'data-step="next"'+'><span>'+(chapterEnd?'章末自測':s.n===1?'開始探索':'繼續探索')+'</span>'+icon('arrow')+'</button></div></section>';
 }
 let content='';
 if(['agenda','objectives'].includes(sc.layout))content=body();
 else if(sc.layout==='reading')content=sc.groups.map(g=>{
  if(s.n===93&&g.name==='g0'){
   const t=sourceMap['c03-p93-text02'],ends=[3,6,9,11,13];let start=0;
   const examples=ends.map((end,index)=>{const finish=end===t.paragraphs.length?t.text.length:t.paragraphs.slice(0,end).reduce((n,p)=>n+p.text.length+1,0);const html='<div class="c03-fuzzy-rule">'+rf({id:t.id,start,end:finish})+window.renderChapter03TeachingAddition(93,index)+'</div>';start=finish;return html;}).join('');
   return '<article class="c03-group g0 c03-fuzzy-rules" aria-label="模糊集合規則與例子；各例在同一兩元素論域，向量依次列出隸屬度">'+examples+'</article>';
  }
  return '<article class="c03-group '+g.name+'">'+g.fragments.map(f=>rf(f)).join('')+(sc.photo&&g.name==='g0'?imageFigure({path:sc.photo.replace(/^assets\//,'')}):'')+'</article>';
 }).join('');
 else if(sc.layout==='supplement')content='<article class="c03-picture-copy">'+body()+'</article><div class="c03-visuals">'+imageFigure({path:sc.photo.replace(/^assets\//,'')})+'</div>';
 else if(sc.layout==='matrix-derivation'&&s.n===97)content=sc.groups.slice(0,2).map(g=>'<article>'+g.fragments.map(f=>rf(f)).join('')+'</article>').join('')+'<div class="c03-matrix-derivation">'+sc.groups[2].fragments.map(f=>rf(f)).join('')+'<div class="c03-visuals">'+masks()+imageFigure(s.images[0])+'</div></div>';
 else if(sc.layout==='matrix-derivation'&&s.n===98)content='<article>'+sc.groups[0].fragments.map(f=>rf(f)).join('')+'</article>'+s.images.slice(0,2).map(im=>'<div class="c03-matrix-input">'+imageFigure(im)+'</div>').join('')+'<div class="c03-matrix-derivation">'+sc.groups[1].fragments.map(f=>rf(f)).join('')+'<div class="c03-visuals">'+masks()+imageFigure(s.images[2])+'</div></div>';
 else if(sc.layout==='formula-composition')content=sc.groups.slice(0,2).map(g=>'<article>'+g.fragments.map(f=>rf(f)).join('')+'</article>').join('')+'<div class="c03-merged-formula">'+sc.groups[2].fragments.map(f=>rf(f)).join('')+'<div class="c03-visuals">'+pictures()+'</div></div>';
 else if(sc.layout==='definition-diagram')content='<article class="c03-definition">'+sc.groups[0].fragments.map(f=>rf(f)).join('')+window.renderChapter03TeachingAddition(s.n)+'</article><div class="c03-example-diagram"><article>'+sc.groups[1].fragments.map(f=>rf(f)).join('')+'</article><div class="c03-visuals">'+diagrams()+'</div></div>';
 else if(sc.layout==='proof-diagram')content=sc.groups.map((g,i)=>'<article class="c03-proof-column">'+g.fragments.map(f=>rf(f)).join('')+(i===2?'<div class="c03-visuals">'+diagrams()+'</div>':'')+'</article>').join('');
 else if(sc.layout==='table'&&s.n===95)content='<div class="c03-table-copy">'+full(sourceMap['c03-p95-text43'])+'</div><div class="c03-table-pane">'+full(sourceMap['c03-p95-text41'])+'<div class="c03-table-wrap">'+s.tables.map(table).join('')+'</div></div><div class="c03-matrix-pane">'+full(sourceMap['c03-p95-text42'])+'<div class="c03-visuals">'+pictures()+'</div></div>';
 else if(sc.layout==='table')content='<div class="c03-table-copy">'+body()+'</div><div class="c03-table-wrap">'+s.tables.filter(t=>sc.tables.includes(t.id)).map(table).join('')+'</div><div class="c03-visuals">'+diagrams()+pictures()+'</div>';
 else if(sc.layout==='diagram-full')content='<div class="c03-visuals">'+diagrams()+pictures()+'</div>';
 else if(sc.layout==='diagram')content='<article class="c03-diagram-copy">'+body()+'</article><div class="c03-visuals">'+diagrams()+pictures()+'</div>';
 else content='<article class="c03-picture-copy">'+body()+'</article><div class="c03-visuals c03-pictures-'+s.images.filter(im=>sc.images.includes(im.id)&&!im.blankSource).length+'">'+pictures()+'</div>';
 const imageFocus=[15,18].includes(s.n);
 const heading=titleText(title)+(imageFocus?'<div class="projection-image-label">'+body()+'</div>':'');
 if(imageFocus)content='<div class="c03-visuals">'+pictures()+'</div>';
 return '<section class="page reading c03-page c03-page-'+s.n+(imageFocus?' projection-image-page':'')+' c03-layout-'+sc.layout+' c03-density-'+sc.density+' c03-columns-'+(sc.columns||1)+(sc.lead?' c03-has-lead':'')+'" data-page="'+s.n+'" data-part="1" aria-labelledby="page-title"><div class="page-heading">'+heading+'</div><div class="c03-composition">'+content+'</div></section>';
};

window.renderChapter03PrintText=function(t,s){
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 if(t.id==='c03-p'+s.n+'-text02'&&[33,34,35].includes(s.n)){
  const order=window.CHAPTER_03_DISPLAY_ORDER;
  return '<span data-source-display-override="clause-order-v17">'+t.paragraphs.flatMap((p,i)=>{
   const text=order.paragraphs[s.n]?.[i]??p.text;
   const line='<span data-paragraph="'+i+'">'+(order.paragraphs[s.n]?.[i]!==undefined?window.renderChapter03DisplayInline(text):window.renderChapter03Inline(text,{},t,i,0))+'</span>';
   return s.n===35&&i===5?['<span data-clause-solution-step="4">'+window.renderChapter03DisplayInline(order.example3Prenex)+'</span>',line]:[line];
  }).join('\n')+'</span>';
 }
 return t.paragraphs.map((p,i)=>{let at=0,html='';const maths=(s.mathObjects||[]).filter(m=>m.textId===t.id&&m.paragraphIndex===i).sort((a,b)=>a.paragraphOffsetUTF16-b.paragraphOffsetUTF16);
  const part=(a,b)=>window.renderChapter03Inline(p.text.slice(a,b),{},t,i,a);
  for(const m of maths){const end=m.paragraphOffsetUTF16;html+=part(at,end)+'<img class="print-native-math" data-original-math="'+m.id+'" src="'+esc(m.src)+'" alt="'+esc(m.mathText)+'">';at=end;}
  return '<span data-paragraph="'+i+'">'+html+part(at,p.text.length)+'</span>';
 }).join('\n');
};
