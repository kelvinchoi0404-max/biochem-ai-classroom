(function(){
 'use strict';
 const defs=window.COURSE_SUPPLEMENTS||[];
 const find=(chapter,page)=>defs.find(s=>s.chapter===chapter&&s.page===Number(page));
 for(const chapter of window.COURSE_CHAPTERS){
  const authored=defs.filter(s=>s.chapter===chapter.id),formal=authored.filter(s=>s.formal);
  if(authored.length){chapter.originalPages=chapter.originalPages||chapter.pages;chapter.pages=chapter.originalPages+authored.length;}
  if(formal.length){chapter.authoredFormalPages=formal.length;chapter.formalPages=chapter.originalPages+formal.length;chapter.supplementPages=authored.length-formal.length;}
 }
 function extend(chapter,slides,screens){
  const chapterDefs=defs.filter(s=>s.chapter===chapter.id);
  if(!chapterDefs.length)return {slides,screens};
  const extra=chapterDefs.map(s=>({n:s.page,title:s.title,...(s.formal?{formal:true,displayPage:s.displayPage}:{supplement:s.number}),texts:[{id:'supp-'+s.chapter+'-'+s.page+'-title',text:s.title},{id:'supp-'+s.chapter+'-'+s.page+'-body',text:s.text}],images:[],diagrams:[],mathObjects:[],tables:[]}));
  const sequence=screens.flatMap(sc=>[sc,...chapterDefs.filter(s=>s.after===sc.page).map(s=>({page:s.page,part:1,layout:s.formal?'course-lesson':'supplement'}))]);
  // Preserve source page identities; algebraic variants follow the main fuzzy-inference lesson.
  if(chapter.id==='03'){
   const original94=sequence.findIndex(sc=>sc.page===94),end=sequence.findIndex(sc=>sc.page===109);
   if(original94>=0&&end>=0){const [screen]=sequence.splice(original94,1);sequence.splice(sequence.findIndex(sc=>sc.page===109),0,screen);}
   const experiment=sequence.findIndex(sc=>sc.page===130);
   if(experiment>=0&&sequence.some(sc=>sc.page===109)){const [screen]=sequence.splice(experiment,1);sequence.splice(sequence.findIndex(sc=>sc.page===109),0,screen);}
  }
  return {slides:[...slides,...extra].sort((a,b)=>a.n-b.n),screens:sequence};
 }
 function render(chapter,page){const s=find(chapter,page);return s?.formal?s.html.replace('page supplement ','page course-lesson ').replace('data-page="'+s.page+'"','data-page="'+s.page+'" data-formal-page="'+s.displayPage+'"'):s?.html;}
 function route(chapter,page){return find(chapter,page)?.slug||'index.html';}
 function initialRoute(){const name=location.pathname.split('/').pop(),extra=defs.find(s=>s.slug===name);return extra?{chapter:extra.chapter,page:extra.page}:undefined;}
 function initialPage(){return initialRoute()?.page;}
 function imageInfo(path){return defs.flatMap(s=>s.images||[]).find(im=>im.path===path);}
 function label(chapter,page){const s=find(chapter,page);return s?.formal?'第'+s.displayPage+'頁':s?'補充 '+s.number:window.CoursePageLabels?.label(chapter,page)||'第 '+page+' 頁';}
 function stepControls(topic,kind){
  let bar=topic.querySelector('.nested-controls');
  if(!bar){bar=document.createElement('div');bar.className='nested-controls';}
  bar.classList.add('lesson-steps');bar.setAttribute('data-projection-ignore','');
  bar.innerHTML='<span class="nested-stage-status lesson-step-progress" aria-live="polite"></span><div class="lesson-step-actions"><button type="button" data-'+kind+'-reset data-step-action="reset" disabled>重新開始</button><button type="button" data-'+kind+'-prev data-step-action="prev" disabled>上一步</button><button type="button" data-'+kind+'-next data-step-action="next">下一步</button></div>';
  topic.append(bar);
 }
 function paintControls(topic,kind,count,total){
  topic.querySelector('[data-'+kind+'-next]').disabled=count===total;
  topic.querySelector('[data-'+kind+'-prev]').disabled=count===0;
  topic.querySelector('[data-'+kind+'-reset]').disabled=count===0;
  topic.querySelector('.lesson-step-progress').textContent=(count+1)+' / '+(total+1);
 }
 function updateMini(topic,count){
  const answers=[...topic.querySelectorAll('[data-mini-answer]')];
  topic.dataset.miniStage=String(count);
  answers.forEach((answer,index)=>answer.hidden=index>=count);
  paintControls(topic,'mini',count,answers.length);
 }
 function updateTruth(topic,count){
  const stage=topic.querySelector('[data-truth-stage]'),total=Number(stage.dataset.truthTotal);
  stage.dataset.truthStage=String(count);
  const rows=[...stage.querySelectorAll('[data-truth-row]')];
  rows.forEach(row=>{
   const step=Number(row.dataset.truthRow),visible=step<=count;
   row.classList.toggle('is-current',step===count);
   row.classList.toggle('is-revealed',visible);
   row.querySelectorAll('[data-truth-answer]').forEach(answer=>answer.hidden=!visible);
  });
  const explanations=[...stage.querySelectorAll('[data-truth-case]')];
  explanations.forEach(panel=>panel.hidden=Number(panel.dataset.truthCase)!==count);
  paintControls(topic,'nested',count,total);
 }
 function updateNested(topic,count){
  const panels=[...topic.querySelectorAll('[data-nested-reveal]')];
  topic.querySelector('[data-nested-stage]').dataset.nestedStage=String(count);
  panels.forEach(panel=>{const visible=Number(panel.dataset.nestedReveal)<=count;panel.inert=!visible;panel.setAttribute('aria-hidden',String(!visible));panel.classList.toggle('is-revealed',visible);});
  paintControls(topic,'nested',count,panels.length);
 }
 function advance(){
  const truth=document.querySelector('#lesson .supplement [data-truth-stage]');
  if(truth){const count=Number(truth.dataset.truthStage);if(count>=Number(truth.dataset.truthTotal))return false;updateTruth(truth.closest('.supplement'),count+1);return true;}
  const topic=document.querySelector('#lesson .supplement'),stage=topic?.querySelector('[data-nested-stage]');
  if(!stage){if(topic?.hasAttribute('data-mini-stage')){const count=Number(topic.dataset.miniStage),total=topic.querySelectorAll('[data-mini-answer]').length;if(count>=total)return false;updateMini(topic,count+1);return true;}return false;}
  const count=Number(stage.dataset.nestedStage),total=topic.querySelectorAll('[data-nested-reveal]').length;
  if(count>=total)return false;
  updateNested(topic,count+1);return true;
 }
 function mount(){
  const topic=document.querySelector('#lesson>.supplement, #lesson>.course-lesson'),formal=topic?.hasAttribute('data-formal-page');
  document.body.classList.toggle('has-supplement',!!topic&&!formal);
  document.body.classList.toggle('has-course-page',!!formal);
  if(topic?.querySelector('[data-nested-stage],[data-truth-stage]'))stepControls(topic,'nested');
  if(topic?.querySelector('[data-mini-answer]')){topic.querySelectorAll('[data-mini-next],[data-mini-reset]').forEach(button=>button.remove());stepControls(topic,'mini');updateMini(topic,0);}
  if(topic?.querySelector('[data-nested-stage]'))updateNested(topic,0);
  if(topic?.querySelector('[data-truth-stage]'))updateTruth(topic,0);
  if(topic)document.querySelector('#lesson').setAttribute('aria-label',formal?'正式課程：第'+topic.dataset.formalPage+'頁':'課程補充解說');
  else document.querySelector('#lesson').setAttribute('aria-label','原PPT逐頁課件');
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-nested-next],[data-nested-prev],[data-nested-reset],[data-mini-next],[data-mini-prev],[data-mini-reset]');
  const topic=button?.closest('#lesson>.supplement');if(!topic)return;
  const action=button.dataset.stepAction;
  if(action==='next'){advance();return;}
  const truth=topic.querySelector('[data-truth-stage]'),nested=topic.querySelector('[data-nested-stage]');
  const count=Number(truth?.dataset.truthStage??nested?.dataset.nestedStage??topic.dataset.miniStage);
  const value=action==='reset'?0:Math.max(0,count-1);
  if(truth)updateTruth(topic,value);else if(nested)updateNested(topic,value);else updateMini(topic,value);
  if(action==='reset')topic.querySelector('[data-step-action="next"]').focus({preventScroll:true});
 });
 window.CourseSupplements={defs,find,extend,render,route,initialRoute,initialPage,imageInfo,label,mount,advance};
})();
