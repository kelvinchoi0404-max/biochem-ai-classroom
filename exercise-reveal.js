(function(){
 'use strict';
 let active=null;
 const all=(root,selector)=>Array.from(root.querySelectorAll(selector));
 const sourceId=(chapter,page,n)=>`${chapter==='01'?'':'c'+chapter+'-'}p${String(page).padStart(2,'0')}-text${String(n).padStart(2,'0')}`;
 function tail(node,marker){
  const start=node.textContent.indexOf(marker);if(start<0)throw Error('Exercise answer marker not found: '+marker);
  const range=document.createRange(),walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);let offset=0;
  while(walker.nextNode()){const text=walker.currentNode;if(offset+text.length>start){range.setStart(text,start-offset);range.setEnd(node,node.childNodes.length);const span=document.createElement('span');span.className='exercise-answer-tail';span.append(range.extractContents());range.insertNode(span);return span;}offset+=text.length;}
 }
 function targets(root,rule,ctx){
  if(rule.selector)return all(root,rule.selector);
  if(rule.image!==undefined||rule.diagram!==undefined){const image=rule.image!==undefined?ctx.slide.images[rule.image]:ctx.slide.diagrams[rule.diagram];if(!image)throw Error('Exercise picture missing');const attr=rule.image!==undefined?'data-original-image':'data-native-diagram';return all(root,`[${attr}="${image.id}"]`).map(img=>img.closest('figure')||img.closest('button')||img);}
  const fragments=all(root,`[data-source-id="${sourceId(ctx.chapter.id,ctx.slide.n,rule.text)}"]`);
  if(!rule.paragraphs)return fragments;
  return fragments.flatMap(fragment=>rule.paragraphs.flatMap(i=>all(fragment,`[data-paragraph="${i}"]`))).map(node=>rule.from?tail(node,rule.from):node);
 }
 function mark(root,plan,ctx){
  const groups=plan.steps.map((rules,index)=>rules.flatMap(rule=>{
   const nodes=targets(root,rule,ctx);if(!nodes.length)throw Error(`Missing exercise target ${ctx.chapter.id}/${ctx.slide.n} step ${index+1}: ${JSON.stringify(rule)}`);return nodes;
  }));
  if(new Set(groups.flat()).size!==groups.flat().length)throw Error('Duplicate exercise target');
  groups.forEach((nodes,i)=>nodes.forEach(node=>{node.dataset.answerStep=i+1;node.classList.add('exercise-answer','exercise-concealed');node.setAttribute('aria-hidden','true');node.inert=true;}));
  return groups;
 }
 function controls(supplement=false){
  let bar=document.getElementById('exercise-controls');if(bar)bar.remove();
  bar=document.createElement('div');bar.id='exercise-controls';bar.className='exercise-controls';bar.hidden=true;
  bar.innerHTML='<span class="exercise-progress" aria-live="polite"></span><button type="button" data-exercise-action="question" hidden>查看題目</button><button type="button" data-exercise-action="reset" disabled>重新練習</button><button type="button" class="exercise-next" data-exercise-action="next">顯示下一步</button>';
  if(supplement){bar.classList.add('lesson-steps');bar.setAttribute('data-projection-ignore','');bar.innerHTML='<span class="exercise-progress lesson-step-progress" aria-live="polite"></span><div class="lesson-step-actions"><button type="button" data-exercise-action="reset" data-step-action="reset" disabled>重新開始</button><button type="button" data-exercise-action="prev" data-step-action="prev" disabled>上一步</button><button type="button" data-exercise-action="next" data-step-action="next">下一步</button></div>';}else document.querySelector('.course-footer').insertBefore(bar,document.querySelector('.page-controls'));return bar;
 }
 function clear(){active=null;const bar=document.getElementById('exercise-controls');if(bar)bar.hidden=true;document.body.classList.remove('has-exercise');}
 function paint(){
  const a=active;if(!a)return;
  a.groups.forEach((nodes,i)=>nodes.forEach(node=>{const hidden=i>=a.step;node.classList.toggle('exercise-concealed',hidden);node.inert=hidden;if(hidden)node.setAttribute('aria-hidden','true');else node.removeAttribute('aria-hidden');}));
  a.root.dataset.exerciseStep=a.step;
  const next=a.bar.querySelector('[data-exercise-action="next"]');next.disabled=a.step===a.groups.length;next.textContent=a.supplement?'下一步':next.disabled?'已全部顯示':a.plan.stepLabels?.[a.step]||(a.step===0?'顯示第一步':'顯示下一步');
  a.bar.querySelector('[data-exercise-action="reset"]').disabled=a.step===0;
  const previous=a.bar.querySelector('[data-exercise-action="prev"]');if(previous)previous.disabled=a.step===0;
  a.bar.querySelector('.exercise-progress').textContent=a.supplement?`${a.step+1} / ${a.groups.length+1}`:`${a.step} / ${a.groups.length}`;
  const questionButton=a.bar.querySelector('[data-exercise-action="question"]');if(questionButton)questionButton.hidden=!a.preview;
  if(a.preview){a.preview.hidden=a.step>0&&!a.showQuestion;questionButton.textContent=a.step===0?'題目已顯示':a.preview.hidden?'查看題目':'返回解題';questionButton.disabled=a.step===0;}
  if(a.hint)a.hint.hidden=a.step!==1;
  if(a.preview)for(const node of a.root.children){if(node===a.preview||node===a.hint||node===a.bar)continue;node.inert=!a.preview.hidden;if(a.preview.hidden)node.removeAttribute('aria-hidden');else node.setAttribute('aria-hidden','true');}
  const announce=document.getElementById('announcer');if(announce)announce.textContent=a.step?`已顯示第 ${a.step} 步，共 ${a.groups.length} 步`:'答案已隱藏，請先自行作答';
 }
 function cleanClone(root){
  for(const node of [root,...root.querySelectorAll('*')])for(const attr of [...node.attributes])if(attr.name==='id'||attr.name.startsWith('data-')||attr.name==='aria-labelledby')node.removeAttribute(attr.name);
  all(root,'[aria-hidden="true"]').forEach(n=>n.remove());
  all(root,'button').forEach(button=>{const div=document.createElement('div');div.className=button.className;div.append(...button.childNodes);button.replaceWith(div);});
 }
 function mount(lesson,ctx){
  clear();
  // An explicit display override preserves the original source dataset and PPT.
  if(ctx.slide.n===1)all(lesson,'.hero-body [data-paragraph]').forEach(node=>{if(node.textContent.trim()==='高一智能科學與技術實驗班'){node.textContent='高一生化班';node.closest('[data-source-id]').dataset.sourceDisplayOverride='class-name';}});
  const plan=window.COURSE_EXERCISE_PLANS[ctx.chapter.id+'/'+ctx.slide.n];if(!plan)return;
  const root=lesson.querySelector('.page'),groups=mark(root,plan,ctx),supplement=root.classList.contains('supplement'),bar=controls(supplement);
  if(supplement)root.append(bar);
  root.classList.add('exercise-page');root.dataset.exerciseSteps=groups.length;
  let preview=null;
  if(plan.questionPage){
   const template=document.createElement('template');template.innerHTML=ctx.renderPage(plan.questionPage);preview=template.content.firstElementChild;
   if(plan.questionPlan){const questionPlan=window.COURSE_EXERCISE_PLANS[ctx.chapter.id+'/'+plan.questionPage];mark(preview,questionPlan,{...ctx,slide:ctx.slides[plan.questionPage-1]});}
   cleanClone(preview);preview.classList.add('exercise-question-preview');preview.setAttribute('aria-label','本題題目');root.append(preview);
  }
  let hint=null;
  if(plan.hint){hint=document.createElement('aside');hint.className='exercise-hint';hint.textContent=plan.hint;hint.hidden=true;root.append(hint);groups.unshift([hint]);groups.forEach((nodes,i)=>nodes.forEach(node=>node.dataset.answerStep=i+1));}
  bar.hidden=false;bar.title=plan.instruction||'先自行作答，再逐步查看解答';document.body.classList.toggle('has-exercise',!supplement);
  active={root,bar,supplement,groups,preview,hint,plan,step:0,showQuestion:false};root.dataset.exerciseSteps=groups.length;paint();
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-exercise-action]');if(!button||!active)return;
  if(button.dataset.exerciseAction==='next')active.step=Math.min(active.groups.length,active.step+1);
  if(button.dataset.exerciseAction==='prev')active.step=Math.max(0,active.step-1);
  if(button.dataset.exerciseAction==='reset')active.step=0;
  active.showQuestion=button.dataset.exerciseAction==='question'?!active.showQuestion:false;paint();
  if(button.dataset.exerciseAction==='next'&&matchMedia('(max-width:760px)').matches){const visible=active.groups[active.step-1]?.find(node=>!node.hidden);visible?.scrollIntoView({block:'nearest',behavior:'auto'});}
 });
 window.CourseExercises={mount,clear,advance:()=>{if(!active?.plan.footerAdvance||!active.root.isConnected||active.step>=active.groups.length)return false;active.step++;active.showQuestion=false;paint();if(matchMedia('(max-width:760px)').matches)active.groups[active.step-1]?.find(node=>!node.hidden)?.scrollIntoView({block:'nearest',behavior:'auto'});return true;},hasHiddenAnswers:()=>!!active&&active.step<active.groups.length};
})();
