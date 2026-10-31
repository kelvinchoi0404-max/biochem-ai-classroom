/* Click-controlled reconstruction of the supplied video diagrams. */
(function(){
'use strict';
const captions=[
 '想要證明什麼問題','就先把這個問題的結論否定','並且把這個結論的否定加到子句集裡面',
 '這樣就是一個新的子句集 S′','就是相對於原來的子句集','多了一個結論的否定',
 '然後拼命的去證明','新的這個子句集 S′ 是假的','如果最終證明出是假的',
 '那麼就說明這個否定的結論是假的','然後從邏輯上來說','原來的肯定的結論就是','原來的子句集是真的',
 '換句話說','就是要檢查一個子句集裡有沒有空子句','如果有，那這個子句集就是不可滿足的',
 '如果沒有','就繼續拼命證明這個子句集 S′ 是假的','直到實在沒法證明為止'
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const frames=captions.map((caption,i)=>({caption,source:'assets/refutation-principle/frame'+String(i+1).padStart(2,'0')+'.png'}));
const pages=[
 {chapter:'03',page:120,number:11,after:37,section:25,slug:'resolution-principle.html',title:'歸結演繹推理的基本思想',kind:'principle',frames:frames.slice(0,13),note:'影片用「真／假」作直觀說明。這裡要證明的是：若原前提成立，待證結論也成立。'},
 {chapter:'03',page:121,number:12,after:37,section:25,slug:'resolution-empty-clause.html',title:'歸結與空子句',kind:'empty',frames:frames.slice(13),note:'暫未導出空子句，不等於已證明可滿足；一階歸結的搜尋可能一直進行。'}
];
function diagram(kind){
 if(kind==='principle')return `<div class="rp-box rp-premises"></div><div class="rp-positive rp-actor">她喜歡我</div><div class="rp-negative rp-actor" aria-hidden="true">她不喜歡我</div><div class="rp-set-label rp-actor">S</div><div class="rp-stamp rp-false" aria-hidden="true">假</div><div class="rp-stamp rp-true" aria-hidden="true">真</div><div class="rp-formula rp-actor" aria-hidden="true">S′ = S ∪ {¬G}</div><div class="rp-reason rp-actor" aria-hidden="true">歸結推理 → □</div>`;
 return `<div class="rp-box rp-small-box"><span>她喜歡我<br>她不喜歡我</span></div><div class="rp-small-label">S′</div><div class="rp-flow-link rp-flow-start rp-actor" aria-hidden="true">⟶</div><div class="rp-check rp-actor" aria-hidden="true">有沒有空子句<span>檢查／繼續歸結</span></div><div class="rp-branch rp-branch-yes rp-actor" aria-hidden="true"><span class="rp-branch-label">有</span><span class="rp-arrow">↗</span><strong>不可滿足</strong><small>□</small></div><div class="rp-branch rp-branch-no rp-actor" aria-hidden="true"><span class="rp-branch-label">沒有</span><span class="rp-arrow">↘</span><strong>拼命<span class="rp-tired">／累了</span></strong><small>繼續歸結</small></div>`;
}
function pageHTML(d){return `<section class="page supplement resolution-principle-page rp-${d.kind}" data-page="${d.page}" data-rp-page="${d.page}" data-rp-stage="1" aria-labelledby="page-title"><header class="rp-heading"><h1 id="page-title">${esc(d.title)}</h1><img src="assets/haojiang-school-logo.png" alt="濠江中學" width="318" height="87"></header><div class="rp-stage"><div class="rp-canvas" role="img" aria-label="${d.kind==='principle'?'方框內是她喜歡我，標記為 S。':'子句集 S′ 中有她喜歡我和她不喜歡我。'}">${diagram(d.kind)}</div></div><div class="rp-caption-wrap"><p class="rp-caption" aria-live="polite" aria-atomic="true">${esc(d.frames[0].caption)}</p></div><p class="rp-note">${esc(d.note)}</p><div class="rp-controls lesson-steps" data-projection-ignore><span class="lesson-step-progress" data-rp-progress aria-live="polite"></span><div class="rp-tools"><button type="button" data-rp-transcript>全部字幕</button><button type="button" data-rp-source>原截圖</button></div><div class="rp-playback lesson-step-actions"><button type="button" data-rp-reset data-step-action="reset" disabled>重新開始</button><button type="button" data-rp-prev data-step-action="prev" disabled>上一步</button><button type="button" data-rp-next data-step-action="next">下一步</button></div></div><div class="rp-print-transcript"><h2>完整字幕</h2><ol>${d.frames.map(f=>'<li>'+esc(f.caption)+'</li>').join('')}</ol><p>${esc(d.note)}</p></div></section>`;}
for(const d of pages){d.html=pageHTML(d);d.images=d.frames.map((f,i)=>({path:f.source,alt:'影片截圖：'+f.caption,title:'動畫原截圖 '+(i+1)}));d.text=[d.title,...d.frames.map(f=>f.caption),d.note,'S 是已知前提，G 是待證結論。S′ = S ∪ {¬G}；S′ 不可滿足，則 S ⊨ G。她喜歡我；她不喜歡我。',d.kind==='empty'?'有沒有空子句？有：不可滿足。沒有：繼續歸結。':''].join('\n');}
window.COURSE_SUPPLEMENTS=(window.COURSE_SUPPLEMENTS||[]).concat(pages);
let active=null,observer=null,dialog=null,dialogOpener=null;
function visible(selector,show){const e=active.page.querySelector(selector);if(!e)return;e.classList.toggle('rp-visible',show);e.setAttribute('aria-hidden',String(!show));}
function pulse(selector){const e=active.page.querySelector(selector);if(!e||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;e.animate([{filter:'brightness(1)',transform:'scale(1)'},{filter:'brightness(.75)',transform:'scale(1.045)'},{filter:'brightness(1)',transform:'scale(1)'}],{duration:480});}
function paint(animate=true){
 if(!active)return;
 const {page,definition,index}=active,step=index+1,caption=page.querySelector('.rp-caption'),old=caption.textContent;
 page.dataset.rpStage=String(step);
 if(animate&&old!==definition.frames[index].caption&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const ghost=caption.cloneNode(true);ghost.className='rp-caption-out';ghost.removeAttribute('aria-live');ghost.setAttribute('aria-hidden','true');caption.parentNode.appendChild(ghost);
  ghost.animate([{opacity:1},{opacity:0}],{duration:170,fill:'forwards'}).finished.then(()=>ghost.remove(),()=>ghost.remove());
  caption.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:230,delay:70,fill:'backwards'});
 }
 caption.textContent=definition.frames[index].caption;
 page.querySelector('[data-rp-prev]').disabled=index===0;page.querySelector('[data-rp-reset]').disabled=index===0;
 const next=page.querySelector('[data-rp-next]');next.disabled=index===definition.frames.length-1;next.textContent='下一步';page.querySelector('[data-rp-progress]').textContent=(index+1)+' / '+definition.frames.length;
 if(definition.kind==='principle'){
  page.classList.toggle('rp-neg-outside',step===2);page.classList.toggle('rp-neg-inside',step>=3&&step<13);page.classList.toggle('rp-false-on-negation',step>=10&&step<13);
  visible('.rp-negative',step>=2&&step<13);visible('.rp-false',step>=9&&step<13);visible('.rp-true',step===13);
  visible('.rp-formula',step>=4&&step<=8);visible('.rp-reason',step>=7&&step<=9);
  page.querySelector('.rp-set-label').textContent=step>=4&&step<13?'S′':'S';
  page.querySelector('.rp-canvas').setAttribute('aria-label',step===13?'移除否定句，肯定結論蓋上真印。':step>=9?'新子句集 S′ 顯示矛盾，紅色假印'+(step>=10?'移至否定句。':'蓋在集合上。'):step>=3?'否定句移入框內，兩句形成新子句集。':step===2?'否定句她不喜歡我出現在方框外。':'方框內是她喜歡我，標記為 S。');
  if(animate)pulse(step===5?'.rp-set-label':step===6?'.rp-negative':step===7?'.rp-reason':step===8?'.rp-formula':step===11?'.rp-negative':step===12?'.rp-positive':'.rp-premises');
 }else{
  visible('.rp-flow-start',step>=2);visible('.rp-check',step>=2);visible('.rp-branch-yes',step>=3);visible('.rp-branch-no',step>=4);
  page.classList.toggle('rp-continue',step>=5);page.classList.toggle('rp-exhausted',step===6);
  page.querySelector('.rp-canvas').setAttribute('aria-label','子句集 S′'+(step>=2?'：檢查有沒有空子句。':'。')+(step>=3?'有空子句，則不可滿足。':'')+(step>=4?'暫未導出空子句，繼續歸結。':''));
  if(animate)pulse(step>=4?'.rp-branch-no':step===3?'.rp-branch-yes':'.rp-check');
 }
}
function fit(){if(!active)return;const viewport=active.page.querySelector('.rp-stage'),canvas=active.page.querySelector('.rp-canvas');if(window.matchMedia('(max-width:760px)').matches){canvas.style.transform='';return;}const scale=Math.max(.1,Math.min(viewport.clientWidth/1000,viewport.clientHeight/360));canvas.style.transform='translate(-50%,-50%) scale('+scale+')';}
function closeDialog(){if(dialog){dialog.close();dialog.remove();dialog=null;}const opener=dialogOpener;dialogOpener=null;if(opener?.isConnected)opener.focus({preventScroll:true});}
function openDialog(kind,opener){
 if(!active)return;closeDialog();dialogOpener=opener;const d=active.definition;
 dialog=document.createElement('dialog');dialog.className='rp-dialog';dialog.dataset.rpDialog=kind;dialog.setAttribute('aria-labelledby','rp-dialog-title');
 const body=kind==='transcript'?`<ol class="rp-transcript">${d.frames.map((f,i)=>'<li'+(i===active.index?' aria-current="step"':'')+'>'+esc(f.caption)+'</li>').join('')}</ol><div class="rp-explanation"><p>S 是已知前提，G 是待證結論。把 ¬G 加入 S，得到 S′ = S ∪ {¬G}。</p><p>若 S′ 歸結出空子句 □，便證明 S′ 不可滿足，因此 S ⊨ G。這並非另行證明原前提 S 為真。</p><p>尚未導出空子句，不能直接判定可滿足；一階歸結搜尋可能不停止。</p><a href="https://logical.stanford.edu/intrologic/sections/section_14.html?section=4" target="_blank" rel="noopener noreferrer">原理參考：Stanford Introduction to Logic</a></div>`:`<div class="rp-source-view"><img class="rp-source-image" src="${d.frames[active.index].source}" alt="${esc(d.frames[active.index].caption)}"><div class="rp-source-navigation"><button type="button" data-rp-source-prev>上一張</button><span data-rp-source-caption></span><button type="button" data-rp-source-next>下一張</button></div></div>`;
 dialog.innerHTML=`<div class="rp-dialog-heading"><h2 id="rp-dialog-title">${kind==='transcript'?'全部字幕':'原截圖'}</h2><button type="button" data-rp-close aria-label="關閉">×</button></div>${body}`;
 document.body.appendChild(dialog);dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog();});dialog.showModal();
 if(kind==='source'){dialog.dataset.sourceIndex=String(active.index);paintSource();}
}
function paintSource(){if(!dialog||!active)return;const i=Number(dialog.dataset.sourceIndex),f=active.definition.frames[i];const img=dialog.querySelector('.rp-source-image');img.src=f.source;img.alt=f.caption;dialog.querySelector('[data-rp-source-caption]').textContent=(i+1)+' / '+active.definition.frames.length;dialog.querySelector('[data-rp-source-prev]').disabled=i===0;dialog.querySelector('[data-rp-source-next]').disabled=i===active.definition.frames.length-1;}
function mount(lesson){if(observer)observer.disconnect();observer=null;closeDialog();active=null;const page=lesson.querySelector('.resolution-principle-page');if(!page)return;const definition=pages.find(d=>d.page===Number(page.dataset.rpPage));if(!definition)return;active={page,definition,index:0};paint(false);fit();observer=new ResizeObserver(fit);observer.observe(page.querySelector('.rp-stage'));document.fonts?.ready.then(fit);}
function advance(){if(!active||!active.page.isConnected||!document.querySelector('#lesson')?.contains(active.page)||document.querySelector('dialog[open]')||active.index>=active.definition.frames.length-1)return false;active.index++;paint();return true;}
if(typeof document!=='undefined'){
 document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-rp-close')){closeDialog();return;}
  if(dialog&&(button.hasAttribute('data-rp-source-prev')||button.hasAttribute('data-rp-source-next'))){dialog.dataset.sourceIndex=String(Number(dialog.dataset.sourceIndex)+(button.hasAttribute('data-rp-source-next')?1:-1));paintSource();return;}
  if(!active||!active.page.contains(button))return;
  if(button.hasAttribute('data-rp-next'))advance();
  if(button.hasAttribute('data-rp-prev')&&active.index>0){active.index--;paint();}
  if(button.hasAttribute('data-rp-reset')){active.index=0;paint();active.page.querySelector('[data-rp-next]').focus({preventScroll:true});}
  if(button.hasAttribute('data-rp-transcript'))openDialog('transcript',button);
  if(button.hasAttribute('data-rp-source'))openDialog('source',button);
 });
 window.addEventListener('resize',fit);
}
window.CourseResolutionPrinciple={mount,advance,pages};
})();
