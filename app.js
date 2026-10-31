'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const catalog=window.COURSE_CHAPTERS;
let chapter=catalog[0],slides=window.ORIGINAL_SLIDES||[],media=window.COURSE_MEDIA||[],notes=[],sections=chapter.sections,heroes=chapter.heroes;
let typeMap=window.COURSE_TYPOGRAPHY||{},screens=window.COURSE_SCREENS||[],sourceMap=Object.fromEntries(slides.flatMap(s=>s.texts.map(t=>[t.id,t])));
let current=1,screenIndex=0,onHome=false,opener=null,navigationRequest=0,contextReady=false;
const lesson=$('#lesson'),dialog=$('#drawer'),loadedScripts=new Map();
const iconPaths={arrow:'M4 12h16m-6-6 6 6-6 6',back:'M9 5 3 11l6 6M3 11h11a6 6 0 0 1 6 6v2',left:'M20 12H4m6-6-6 6 6 6',down:'M12 4v16m-6-6 6 6 6-6',search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',zoom:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0M6 10h8m-4-4v8',menu:'M4 6h16M4 12h16M4 18h16',expand:'M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5'};
function icon(name){return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${iconPaths[name]||iconPaths.arrow}"/></svg>`;}
function inlineText(text,meta={}){
 let ranges=(meta.emphasis||[]).filter(r=>text.slice(r.start,r.end)===r.text).map(r=>({...r,cls:'key-term'+(Array.from(r.text).length<=12?' keep-term':'')}));
 const colon=text.indexOf('：');if(colon>0&&colon<23&&!['heading','subheading','quote','attribution','question'].includes(meta.role)){ranges=ranges.filter(r=>r.start>colon);ranges.push({start:0,end:colon+1,cls:'term-label'});}
 ranges.sort((a,b)=>a.start-b.start||b.end-a.end);let cursor=0,html='';for(const r of ranges){if(r.start<cursor)continue;html+=esc(text.slice(cursor,r.start))+`<strong class="${r.cls}">${esc(text.slice(r.start,r.end))}</strong>`;cursor=r.end;}return (html+esc(text.slice(cursor))).replace(/核心是思維|產生的知識|經濟|潛在風險。|人工智能技術|知識的表示|邏輯思維之中|智能的學科。|物質基礎。|重大損失。/g,x=>'<span class="keep-term">'+x+'</span>');
}

function mediaByPath(path){return media.find(m=>m.path===path)||{path,alt:'教學配圖'};}
function sourceAttributes(t,start=0,end=t.text.length,role='body'){return `data-source-id="${t.id}" data-source-start="${start}" data-source-end="${end}" data-source-role="${role}"`;}
function titleText(t){const m=t.text.match(/^(\d+(?:\.\d+)+)\s/);return `<h1 ${sourceAttributes(t,0,t.text.length,'title')} id="page-title">${m?`<span class="heading-number">${esc(m[0])}</span><span class="heading-name">${esc(t.text.slice(m[0].length))}</span>`:esc(t.text)}</h1>`;}
function renderFragment(f,extra=''){
 const t=sourceMap[f.id],start=f.start??0,end=f.end??t.text.length,value=t.text.slice(start,end);let at=start;
 const pieces=value.match(/[^\n]*\n|[^\n]+$/g)||[];
 const html=pieces.map(piece=>{const hasLF=piece.endsWith('\n'),text=hasLF?piece.slice(0,-1):piece;const before=t.text.slice(0,at),i=(before.match(/\n/g)||[]).length,base=before.lastIndexOf('\n')+1,offset=at-base;
 const meta=typeMap[t.id]?.[i]||{role:text?'body':'empty'};const local={...meta,emphasis:(meta.emphasis||[]).filter(x=>x.start>=offset&&x.end<=offset+text.length).map(x=>({...x,start:x.start-offset,end:x.end-offset}))};
 const role=meta.role||'body',tag=role==='heading'?'h2':role==='subheading'?'h3':role==='empty'?'span':'p';let content=chapter.id==='02'&&window.renderChapter02Inline?window.renderChapter02Inline(text,local,t,i,offset):inlineText(text,local),out='';
 if((t.id==='p02-text02'||t.id==='c02-p02-text02')&&text)out=`<button class="agenda-item" data-page="${chapter.sections[i]?.n||1}" data-paragraph="${i}">${content}</button>`;
 else if(t.id==='p23-text02'&&i===1){out=`<p class="paragraph question-comparison" data-paragraph="${i}"><span class="question-choice"><strong>弱人工智能</strong><span>(Weak AI)</span></span><span class="question-join">和</span><span class="question-choice"><strong>強人工智能</strong><span>(Strong AI)</span></span><span class="question-tail">是什麼？有什麼區別？</span></p>`;}
 else if(t.id==='p05-text02'&&i===0&&offset===0)out=`<p class="paragraph year-line type-${role}" data-paragraph="${i}"><span class="year-focus">${esc(text.slice(0,4))}</span><span>${esc(text.slice(4))}</span></p>`;
 else out=`<${tag} class="paragraph type-${role}${!text?' empty-paragraph':''}" data-paragraph="${i}">${content}</${tag}>`;
 at+=piece.length;return out+(hasLF?'\n':'');}).join('');
 return `<div class="source-fragment ${extra}" ${sourceAttributes(t,start,end)}>${html}</div>`;
}
function imageFigure(im,caption){const original=!!im.src,path=im.src||'assets/'+im.path,m=original?im:mediaByPath(im.path);return `<figure class="lesson-figure ${original?'from-ppt':'photograph'}"><button class="image-button" data-image="${esc(path)}" aria-label="放大圖片"><img ${original?`data-original-image="${im.id}"`:''} src="${esc(path)}" alt="${esc(im.alt||m.alt||'原課件配圖')}" width="${im.intrinsicWidth||m.width||1600}" height="${im.intrinsicHeight||m.height||1000}" loading="eager"></button>${caption?renderFragment(caption,'source-caption'):''}</figure>`;}
function sourcePagesFor(n){return chapter.id==='03'&&[30,31,32].includes(Number(n))?[30,31,32]:[Number(n)];}
function canonicalPage(n){return sourcePagesFor(n)[0];}
function pageNumberLabel(n){return sourcePagesFor(n).length>1?'30–32':String(window.CoursePageLabels?.number(chapter.id,n)??n).padStart(2,'0');}
function sectionFor(n){return sections.find(s=>n>=s.n&&n<=s.end);}
function baseSceneHTML(sc){if(chapter.rendererKey)return window[chapter.rendererKey](sc,{slides,sourceMap,renderFragment,imageFigure,titleText,esc,icon,chapter});if(chapter.id==='01'){const videoPage=window.renderChapter01VideoPage?.(sc,{slides,sourceMap,renderFragment,imageFigure,titleText,esc});if(videoPage)return videoPage;}const s=slides[sc.page-1],hero=heroes[s.n],end=s.n===slides.length;let fs=sc.fragments||[];
 if(hero||end){const m=mediaByPath(hero);return `<section class="page hero ${end?'ch-end':''}" data-page="${s.n}" data-screen="${screenIndex+1}" data-part="${sc.part}" aria-labelledby="page-title">${hero?`<img class="hero-photo" src="assets/${hero}" alt="${esc(m.alt)}">`:''}<div class="hero-content"><span class="chapter-kicker">CHAPTER ${chapter.id}</span>${titleText(s.texts[0])}<div class="hero-body">${fs.map(f=>renderFragment(f)).join('')}</div><button class="hero-action" ${end?'data-home':"data-step=\"next\""}><span>${end?'返回課程首頁':s.n===1?'開始探索':'繼續探索'}</span>${icon('arrow')}</button></div></section>`;}
 const renderGroup=g=>{
  const originalImages=(g.images||[]).map(id=>s.images.find(im=>im.id===id)).filter(Boolean);
  const isCaption=s.n===13&&g.name.startsWith('abc-');
  const text=g.fragments.map(f=>renderFragment(f,isCaption?'source-caption':'')).join('');
  const pictures=originalImages.map(im=>imageFigure(im)).join('')+(g.supplement?imageFigure({path:g.supplement}):'');
  return '<div class="content-group group-'+g.name+'">'+(isCaption?pictures+text:text+pictures)+'</div>';
 };
 const images=(sc.images||[]).map(id=>s.images.find(im=>im.id===id)).filter(Boolean);
 const visuals=images.map(im=>imageFigure(im)).join('')+(sc.supplement?imageFigure({path:sc.supplement}):'');
 const content=sc.groups?sc.groups.map(renderGroup).join(''):'<article class="text-flow">'+fs.map(f=>renderFragment(f)).join('')+'</article>'+(visuals?'<div class="visual-flow">'+visuals+'</div>':'');
 return '<section class="page reading page-'+s.n+' layout-'+sc.layout+(sc.groups?' grouped':visuals?' with-images':'')+'" data-page="'+s.n+'" data-screen="'+(screenIndex+1)+'" data-part="1" aria-labelledby="page-title"><div class="page-heading">'+titleText(s.texts[0])+'</div><div class="composition">'+content+'</div></section>';
}

function sceneHTML(sc){const extra=window.CourseSupplements?.render(chapter.id,sc.page);if(extra)return extra;return window.CourseImages.render(window.CourseReadability.render(window.CourseInformation.render(window.CourseIllustrations.render(baseSceneHTML(sc),{chapter,scene:sc}),{chapter,scene:sc,slide:slides[sc.page-1]}),{chapter,scene:sc,slide:slides[sc.page-1]}));}
function announce(t){$('#announcer').textContent=t;}
function writeRoute(chapterId,page,mode='push'){
 if(mode==='none')return;const url=new URL(location.href);['part','print-preview','sourcePage'].forEach(k=>url.searchParams.delete(k));const routePage=window.CoursePageLabels?.number(chapterId,page)??page;
 url.pathname=url.pathname.replace(/[^/]*$/,window.CourseSupplements?.route(chapterId,page)||'index.html');
 if(chapterId){url.searchParams.set('chapter',chapterId);url.searchParams.set('page',String(routePage));url.hash='slide-'+routePage;}
 else{url.searchParams.delete('chapter');url.searchParams.delete('page');url.hash='home';}
 const depth=mode==='push'?(history.state?.courseDepth||0)+1:(history.state?.courseDepth||0);
 history[mode==='push'?'pushState':'replaceState']({courseDepth:depth},'',url);$('#back').disabled=depth===0;
}
function setContextReady(ready){contextReady=ready;document.body.dataset.contextReady=String(ready);window.dispatchEvent(new CustomEvent('course-context-ready',{detail:{ready}}));}
function markReady(){const request=navigationRequest;document.body.dataset.ready='false';Promise.all([document.fonts.ready,...$$('#lesson img').map(im=>im.decode().catch(()=>{}))]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{if(request===navigationRequest)document.body.dataset.ready='true';})));}
function renderHeader(){
 $('.main-nav').innerHTML=onHome?catalog.filter(c=>c.available).map(c=>'<button data-chapter="'+c.id+'">第'+c.number+'章</button>').join(''):sections.map(s=>'<button data-page="'+s.n+'">'+esc(s.name)+'</button>').join('');
 $('#home').setAttribute('aria-label','返回課程首頁');$('#contents').setAttribute('aria-label',onHome?'開啟課程章節':'開啟目錄與工具');
 $('#chapter-label').textContent='第'+chapter.number+'章';
}
function showHome(mode='push'){
 setContextReady(false);window.CourseVideo?.stopAll();window.CourseMatrixConcepts?.cleanup();window.CourseFuzzyBridge?.cleanup();
 window.CourseExercises?.clear();document.body.classList.remove('has-supplement','has-course-page');++navigationRequest;onHome=true;if(dialog.open)dialog.close();document.body.classList.add('is-home');document.body.classList.remove('print-preview');document.body.dataset.chapter='home';document.body.dataset.screenCount='0';
 lesson.innerHTML=window.CourseImages.render(window.renderCourseHome(catalog));window.CourseProjection?.mount(lesson);renderHeader();document.title='生化 AI · 高一11';writeRoute(null,null,mode);lesson.focus({preventScroll:true});announce('生化AI課程首頁');setContextReady(true);markReady();
}
const chapterScriptURL=src=>src+'?v='+(src.startsWith('chapters/03/')?'60':'49');
function loadScript(src){
 if(!loadedScripts.has(src))loadedScripts.set(src,new Promise((resolve,reject)=>{
  // Fetch the chapter bundle together while preserving its declared evaluation order.
  const el=document.createElement('script');el.async=false;el.src=chapterScriptURL(src);el.onload=resolve;
  el.onerror=()=>{loadedScripts.delete(src);el.remove();reject(new Error(src));};document.head.appendChild(el);
 }));return loadedScripts.get(src);
}
async function loadChapterScripts(chapter){
 const scripts=chapter.scripts||[],results=await Promise.allSettled(scripts.map(loadScript));
 const failed=results.find(result=>result.status==='rejected');
 if(failed){
  // A missing data script can invalidate dependent scripts that still downloaded.
  // Discard the whole chapter batch so a retry evaluates it again in the right order.
  for(const src of scripts){loadedScripts.delete(src);for(const el of document.scripts)if(el.getAttribute('src')===chapterScriptURL(src))el.remove();}
  throw failed.reason;
 }
}
async function openChapter(id,page=1,mode='push'){
 window.CourseVideo?.stopAll();window.CourseMatrixConcepts?.cleanup();window.CourseFuzzyBridge?.cleanup();
 const next=catalog.find(c=>c.id===String(id).padStart(2,'0')&&c.available);if(!next)return;
 const request=++navigationRequest;setContextReady(false);document.body.dataset.ready='false';if(dialog.open)dialog.close();
 try{await loadChapterScripts(next);}catch(error){if(request===navigationRequest){lesson.innerHTML='<section class="load-error"><h1>本章暫時未能開啟</h1><p>請重新整理頁面，或返回課程首頁。</p><button data-home>返回課程首頁</button></section>';announce('本章未能開啟');}console.error(error);return;}
 if(request!==navigationRequest)return;
 chapter=next;slides=window[next.slidesKey];screens=window[next.planKey];typeMap=window[next.typographyKey]||{};notes=[];media=window[next.mediaKey]||[];sections=next.sections;heroes=next.heroes||{};
 const extended=window.CourseSupplements?.extend(next,slides,screens);if(extended){slides=extended.slides;screens=extended.screens;}
 screens=screens.filter(sc=>canonicalPage(sc.page)===sc.page);
 sourceMap=Object.fromEntries(slides.flatMap(s=>s.texts.map(t=>[t.id,t])));onHome=false;document.body.classList.remove('is-home','print-preview');document.body.dataset.chapter=next.id;renderHeader();
 const requested=canonicalPage(Math.max(1,Math.min(slides.length,Number(page)||1)));goScreen(Math.max(0,screens.findIndex(sc=>sc.page===requested)),false,mode==='none'&&requested!==Number(page)?'replace':mode);
}
function goScreen(index,remember=true,routeMode){index=Number(index);if(!screens[index])return;setContextReady(false);window.CourseVideo?.stopAll();++navigationRequest;screenIndex=index;current=screens[index].page;lesson.innerHTML=sceneHTML(screens[index]);window.CourseExercises?.mount(lesson,{chapter,slide:slides[current-1],slides,renderPage:n=>sceneHTML(screens.find(sc=>sc.page===n))});window.CourseSupplements?.mount();window.CourseClauseSteps?.mount(lesson);window.CourseResolutionPrinciple?.mount(lesson);window.CourseMatrixConcepts?.mount(lesson);window.CourseFuzzyBridge?.mount(lesson);window.CourseProjection?.mount(lesson);lesson.focus({preventScroll:true});
 const extra=window.CourseSupplements?.find(chapter.id,current),isSupplement=extra&&!extra.formal;$('#position').textContent=isSupplement?'補充 '+extra.number+' / '+window.CourseSupplements.defs.filter(s=>s.chapter===chapter.id&&!s.formal).length:pageNumberLabel(current)+' / '+(chapter.formalPages||chapter.originalPages||slides.length);$('#progress').style.width=(index+1)/screens.length*100+'%';$('#prev').disabled=index===0;
 const last=index===screens.length-1;$('#next').disabled=false;$('#next').setAttribute('aria-label',last?'開始本章自測':'下一畫面');$('#next').innerHTML='<span>'+(last?'章末自測':'下一頁')+'</span>'+icon('arrow');
 const sec=sectionFor(extra?.section||current);$$('.main-nav [data-page]').forEach(b=>b.setAttribute('aria-current',sec?.n===Number(b.dataset.page)?'page':'false'));
 writeRoute(chapter.id,current,routeMode||(remember?'push':'replace'));$('#back').disabled=!(history.state?.courseDepth);document.body.dataset.screenCount=screens.length;document.title=(extra?extra.title:chapter.title)+' · 生化 AI';announce('第'+chapter.number+'章，'+(isSupplement?'補充'+extra.number:'第'+pageNumberLabel(current)+'頁')+'，'+slides[current-1].title);setContextReady(true);markReady();
}
function go(n,remember=true){const index=screens.findIndex(sc=>sc.page===canonicalPage(n));if(index>=0)goScreen(index,remember);}
function advance(){if(window.CourseFuzzyBridge?.advance())return;if(window.CourseMatrixConcepts?.advance())return;if(window.CourseResolutionPrinciple?.advance())return;if(window.CourseExercises?.advance())return;if(window.CourseClauseSteps?.advance())return;if(window.CourseSupplements?.advance())return;if(screenIndex<screens.length-1)goScreen(screenIndex+1);else window.CoursePractice?.open(chapter.id);}
async function readRoute(mode='none'){const q=new URLSearchParams(location.search),supplementRoute=window.CourseSupplements?.initialRoute();if(supplementRoute&&!q.has('chapter')&&!q.has('page')&&location.hash!=='#home'){q.set('chapter',supplementRoute.chapter);q.set('page',supplementRoute.page);}const hasPage=q.has('page')||/^#slide-/.test(location.hash);if(location.hash==='#home'||(!q.has('chapter')&&!hasPage)){showHome(mode);return;}const id=q.get('chapter')||'01',requestedPage=+(q.get('page')||location.hash.match(/^#slide-(\d+)$/)?.[1]||1),page=window.CoursePageLabels?.resolve(id,requestedPage,location.pathname,q.get('sourcePage'))??requestedPage;if(!catalog.some(c=>c.id===id&&c.available)){showHome('replace');return;}await openChapter(id,page,mode);if(q.get('print-preview')==='1'){buildPrint();document.body.classList.add('print-preview');}}
function closeDrawer(){dialog.close();opener?.focus();}
function openDrawer(type,value){if(type==='notes')return;window.CourseVideo?.stopAll();if(!dialog.open)opener=document.activeElement;let title='',html='';if(onHome){type='chapters';}const s=slides[current-1];
 if(type==='chapters'){title='課程章節';html='<div class="chapter-menu">'+catalog.map(c=>c.available?'<button data-chapter="'+c.id+'"><span>'+c.id+'</span><strong>'+esc(c.title)+'</strong><span>進入 ↗</span></button>':'<div aria-disabled="true"><span>'+c.id+'</span><strong>'+esc(c.title)+'</strong><span>待加入</span></div>').join('')+'</div>';}
 if(type==='contents'){title='第'+chapter.number+'章 · 頁面目錄';html=`<p class="lead">${chapter.id==='02'?'保留原課件頁碼，補充解說穿插於相關知識點之後。':chapter.id==='03'?'保留原課件頁碼；第95頁後為矩陣入門與練習，第94頁代數運算後移至本章結束頁前。第30–32頁合併為九步總覽；第109頁為溫室自動灌溉實驗，從隸屬函數、規則走到面積重心。':'每頁完整呈現一張原課件，依原順序閱讀。'}</p><div class="toc">${screens.map(sc=>slides[sc.page-1]).map(s=>`<button data-page="${s.n}" class="${s.supplement?'supp-toc':''}" ${s.n===current?'aria-current="page"':''}><span>${s.supplement?'補充 '+s.supplement:pageNumberLabel(s.n)}</span>${esc(s.title)}</button>`).join('')}</div><div class="dialog-actions"><button data-home>課程首頁</button><button data-drawer="chapters">切換章節</button><button data-page="1">本章封面</button><button data-drawer="search">搜尋課文</button><button data-drawer="original">原頁對照</button><button data-drawer="media">圖片來源</button><button data-drawer="videos">科普短片</button>${window.CourseInformation.hasReadings(chapter.id)?'<button data-drawer="reading">延伸閱讀</button>':''}<button data-practice>章末自測</button><button data-ai>AI答疑</button><button id="print">列印本章</button></div>`;}
 if(type==='videos'){title='第'+chapter.number+'章 · 科普短片';html=window.CourseVideo.directory(chapter.id);}
 if(type==='reading'){title='第'+chapter.number+'章 · 延伸閱讀';html=window.CourseInformation.readingDirectory(chapter.id);}
 if(type==='reading-detail'){title='延伸閱讀 · 第'+value+'頁';html=window.CourseInformation.readingDetail(chapter.id,value);}
 if(type==='original'&&s.formal){title='第'+pageNumberLabel(current)+'頁 · '+s.title;html='<p>本頁以課程內的分步內容呈現。</p><button data-page="'+current+'">返回本頁</button>';}else if(type==='original'&&s.supplement){const extra=window.CourseSupplements.find(chapter.id,current);title='補充解說';html='<p>這是本課程新增的補充頁，對應第'+chapter.number+'章原第'+extra.after+'頁。</p><button class="supplement-original-link" data-page="'+extra.after+'">返回相關原頁</button>';}else if(type==='original'&&window.CourseExercises?.hasHiddenAnswers()){title='先完成本頁練習';html='<p>本頁原圖包含完整解答。請先返回課件，使用「顯示下一步」逐步核對；全部揭示後便可查看原頁。</p>';}else if(type==='original'&&sourcePagesFor(current).length>1){title='原PPT · 第30–32頁';html=sourcePagesFor(current).map(n=>{const original=slides[n-1],src=original.originalPage;return '<h3>第'+n+'頁</h3><img class="original-preview" src="'+esc(typeof src==='string'?src:src?.src||original.preview||src?.path)+'" alt="原PPT第'+n+'頁完整預覽">';}).join('');}else if(type==='original'){title='原PPT · 第'+current+'頁';html=`<img class="original-preview" src="${esc(typeof s.originalPage==='string'?s.originalPage:s.originalPage?.src||s.preview||s.originalPage?.path)}" alt="原PPT第${current}頁完整預覽"><p class="lead">本頁文字及原圖均保留。原版裁切及圖文位置可在此對照。${chapter.id==='04'?'此預覽由本機轉換；部分原PNG的透明色效果可能留白，完整圖像已在課件正文保留。':''}</p>`;}
 if(type==='image'&&!window.CourseInformation.canExplainImage(chapter.id,current,value))return;
 if(type==='image'){const note=window.CourseInformation.imageNote(chapter.id,current,value);title=note.title;html=window.CourseInformation.imageDialog(value,note);}
 if(type==='media'){title='圖片與來源';const ms=media.filter(m=>(m.pages||[]).includes(current)).concat(window.CourseIllustrations.media(chapter.id,current));html=`<p class="lead">原PPT圖片、真實照片及AI生成插圖分開標示。所有運行配圖為本地點陣圖片。</p>${s.images.map(im=>`<article class="media-record"><span class="label">原PPT內嵌圖片</span><h3>原第${current}頁 · ${esc(im.id)}</h3><p>${im.blankSource?'原始WMF預覽沒有繪製記錄，保留空白PNG及原OLE檔，沒有猜補內容。':im.requiresRasterization?'原始WMF保留在本機；依原記錄轉為PNG顯示。':'直接保留原始圖片檔案，沒有重畫或去除水印。'}</p><small>原PPT未提供完整授權鏈。本教學網站依原課件保留；來源標示不等於已核實完整出版授權。</small></article>`).join('')}${ms.map(m=>`<article class="media-record"><span class="label">${m.generated?'AI生成插圖':'真實照片'}</span><h3>${esc(m.title)}</h3><p>${esc(m.creator||'OpenAI內置圖像生成工具')} · ${esc(m.license||'AI-generated illustration')}</p>${m.credit?`<p class="image-credit">${esc(m.credit)}</p>`:''}${m.note?`<p>${esc(m.note)}</p>`:''}${m.source_page?`<a href="${esc(m.source_page)}" target="_blank" rel="noopener noreferrer">來源頁 ↗</a>`:''}${m.license_url?` · <a href="${esc(m.license_url)}" target="_blank" rel="noopener noreferrer">授權說明 ↗</a>`:''}</article>`).join('')}${(s.diagrams||[]).map(d=>`<article class="media-record"><span class="label">原PPT原生圖形</span><h3>流程與關係圖</h3><p>由原PPT的文字、圖形及連線轉為本地PNG，保留原有關係。原頁對照使用本機替代字體渲染。${chapter.id==='02'?'第40頁顯示圖另將一個節點字級由20pt微調至19pt，保持完整文字在框內；原圖與原頁仍保留。':chapter.id==='06'&&[20,30,31].includes(current)?'本頁指定條件標籤的文字框加寬20%，避免替代字型造成換行；原文字、字級與位置保留，原圖及衍生差異另有記錄。':''}</p></article>`).join('')}${(s.mathObjects||[]).map(m=>`<article class="media-record"><span class="label">原PPT公式物件</span><h3>${esc(m.id)}</h3><p>依原OMML公式結構在本機轉為PNG；原始XML、上下標、分數及積分結構均有保留。</p></article>`).join('')}${!s.images.length&&!ms.length&&!s.diagrams?.length&&!s.mathObjects?.length?'<p>本頁沒有配圖。</p>':''}<p class="lead">照片與生成插圖的來源及授權資訊見各項說明；原始工作檔不包含在學生網站。</p>`;}
 if(type==='media'&&s.formal){title='教學圖表';html='<p>本頁圖表隨解題步驟呈現。</p>';}
 if(type==='media'&&s.supplement){const images=window.CourseSupplements.find(chapter.id,current).images||[];title='教學配圖';html=images.length?images.map(im=>'<article class="media-record"><span class="label">'+esc(im.sourceLabel||'AI 生成教學示意圖 · PNG')+'</span><h3>'+esc(im.title)+'</h3><p>'+esc(im.explanation)+'</p><button class="supplement-original-link" data-supp-picture="'+esc(im.path)+'">放大閱讀</button></article>').join(''):'<p>本頁使用文字與數學公式呈現，沒有另附圖片。</p>';}
 if(type==='search'){title='搜尋本章課文';html=`<label class="sr-only" for="search-input">輸入課文關鍵字</label><input class="search-field" id="search-input" type="search" placeholder="輸入本章課文關鍵字" autocomplete="off"><div id="search-results" aria-live="polite"><p class="lead">搜尋本章課文與補充解說。</p></div>`;}
 if(type==='supp-picture'){const im=window.CourseSupplements.imageInfo(value);if(!im)return;title=im.title;html='<img class="image-full" src="'+esc(im.path)+'" alt="'+esc(im.title)+'"><p><strong>圖片解釋</strong>　'+esc(im.explanation)+'</p>';}
 dialog.classList.toggle('reading-guide-dialog',type==='reading-detail');dialog.classList.toggle('supp-picture-dialog',type==='supp-picture');dialog.classList.toggle('image-explainer',type==='image');dialog.classList.toggle('c03-illustration-drawer',type==='image'&&!!window.CourseIllustrations.find(value));$('#drawer-title').textContent=title;$('#drawer-body').innerHTML=html;if(!dialog.open)dialog.showModal();$('#close-drawer').focus();
 $('#reduce-motion')?.addEventListener('click',()=>{document.body.classList.toggle('motion-off');$('#reduce-motion').setAttribute('aria-pressed',String(document.body.classList.contains('motion-off')));});
 $('#print')?.addEventListener('click',()=>{buildPrint();window.print();});
 const search=$('#search-input');if(search){search.focus();search.addEventListener('input',()=>{const q=search.value.trim().toLocaleLowerCase();const matches=q?screens.map(sc=>slides[sc.page-1]).filter(s=>sourcePagesFor(s.n).some(n=>slides[n-1].texts.some(t=>t.text.toLocaleLowerCase().includes(q))||(window['CHAPTER_'+chapter.id+'_TEACHING_ADDITIONS']?.[n]||'').toLocaleLowerCase().includes(q))):[];$('#search-results').innerHTML=q?(matches.length?matches.map(s=>`<button class="search-result" data-page="${s.n}"><span>${s.supplement?'補充 '+s.supplement:pageNumberLabel(s.n)}</span>${esc(s.title)}</button>`).join(''):'<p>找不到相符的課文。</p>'):'<p class="lead">搜尋本章課文與補充解說。</p>';});}
}

async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{announce('瀏覽器未能進入全屏；仍可使用一般視窗。');}}
$('#home').onclick=()=>showHome();$('#prev').onclick=()=>goScreen(screenIndex-1);$('#next').onclick=advance;$('#back').onclick=()=>history.back();$('#fullscreen').onclick=fullscreen;$('#contents').onclick=()=>openDrawer(onHome?'chapters':'contents');$('#close-drawer').onclick=closeDrawer;
dialog.addEventListener('cancel',()=>opener?.focus());document.addEventListener('fullscreenchange',()=>$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'離開全屏':'切換全屏'));
document.addEventListener('click',e=>{const home=e.target.closest('[data-home]');if(home){showHome();return;}const ch=e.target.closest('button[data-chapter]');if(ch){openChapter(ch.dataset.chapter);return;}const p=e.target.closest('button[data-page]');if(p){if(dialog.open)dialog.close();go(p.dataset.page);return;}const reading=e.target.closest('[data-reading-page]');if(reading){openDrawer('reading-detail',Number(reading.dataset.readingPage));return;}const d=e.target.closest('[data-drawer]');if(d)openDrawer(d.dataset.drawer);const supplementImage=e.target.closest('[data-supp-picture]');if(supplementImage){openDrawer('supp-picture',supplementImage.dataset.suppPicture);return;}const im=e.target.closest('[data-image]');if(im)openDrawer('image',im.dataset.image);const step=e.target.closest('[data-step]');if(step)advance();});
document.addEventListener('keydown',e=>{if(onHome||document.querySelector('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.target.closest('button,a')&&[' ','Enter'].includes(e.key))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();advance();}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();if(!window.CourseFuzzyBridge?.retreat())goScreen(screenIndex-1);}if(e.key==='Home'){e.preventDefault();go(1);}if(e.key==='End'){e.preventDefault();goScreen(screens.length-1);}if(e.key.toLowerCase()==='f')fullscreen();});
function buildPrint(){
 window.CourseVideo?.stopAll();
 if(onHome||document.querySelector('#learning-dialog[open]'))return;
 $('#print-root').innerHTML=screens.map(sc=>slides[sc.page-1]).map(s=>{
  if(sourcePagesFor(s.n).length>1)return baseSceneHTML(screens.find(sc=>sc.page===s.n)).replace('class="page reading ', 'class="print-page reading ');
  if(s.supplement||s.formal)return window.CourseSupplements.render(chapter.id,s.n).replace('class="page ', 'class="print-page ');
  const textMap=Object.fromEntries(s.texts.map(t=>[t.id,t])),diagramIds=new Set((s.diagrams||[]).flatMap(d=>d.textIds||[])),imageIds=new Set((s.diagrams||[]).flatMap(d=>d.imageIds||[])),tableIds=new Set((s.diagrams||[]).flatMap(d=>d.tableIds||[]));
  const title=textMap[s.titleTextId]||s.texts[0];
  const printRenderer=window['renderChapter'+chapter.id+'PrintText'];
  const printText=t=>s.n===1&&t.text.trim()==='高一智能科學與技術實驗班'?'高一生化班':printRenderer?printRenderer(t,s):esc(t.text);
  const raster=d=>'<img src="'+esc(d.src)+'" data-native-diagram="'+d.id+'" data-diagram-text-ids="'+(d.textIds||[]).join(' ')+'" data-diagram-image-ids="'+(d.imageIds||[]).join(' ')+'" alt="'+esc((d.textIds||[]).map(id=>textMap[id].text).join('\n'))+'">';
  const body=s.texts.filter(t=>t!==title&&t.sourceKind!=='tableCell'&&!diagramIds.has(t.id)).map(t=>'<div class="print-text" '+sourceAttributes(t)+'>'+printText(t)+'</div>').join('');
  const printTables=window['renderChapter'+chapter.id+'PrintTables'];
  const tables=printTables?printTables(s,textMap,sourceAttributes,printText):(s.tables||[]).filter(t=>!tableIds.has(t.id)).map(table=>'<table class="print-table">'+table.rows.map((row,i)=>'<tr>'+row.map((id,j)=>{const native=(s.diagrams||[]).find(d=>d.tableHeaderCell?.tableId===table.id&&d.tableHeaderCell.row===i&&d.tableHeaderCell.column===j);return '<'+(i?'td':'th')+'><span '+sourceAttributes(textMap[id])+'>'+printText(textMap[id])+'</span>'+(native?raster(native):'')+'</'+(i?'td':'th')+'>';}).join('')+'</tr>').join('')+'</table>').join('');
  const images=s.images.filter(im=>!['animated-answer-mask','animated-question-mask'].includes(im.sourcePurpose)&&!imageIds.has(im.id));
  const diagrams=(s.diagrams||[]).filter(d=>!d.tableHeaderCell).map(raster).join('');
  return '<article class="print-page" data-page="'+s.n+'"><h1 '+sourceAttributes(title,0,title.text.length,'title')+'>'+esc(title.text)+'</h1>'+body+tables+(window['renderChapter'+chapter.id+'TeachingAddition']?.(s.n)||'')+((images.length||diagrams)?'<div class="print-images">'+images.map(im=>'<img data-original-image="'+im.id+'" src="'+esc(im.src)+'" alt="原課件配圖">').join('')+diagrams+'</div>':'')+'</article>';
 }).join('');
}
for(const[id,name,label]of[['contents','menu','目錄'],['back','back',''],['prev','left',''],['fullscreen','expand','']])$('#'+id).innerHTML=icon(name)+(label?'<span>'+label+'</span>':'');
window.CourseNavigation={isContextReady:()=>contextReady,getContext:()=>({chapter:chapter.id,chapterTitle:chapter.title,page:current,pageLabel:sourcePagesFor(current).length>1?'第30–32頁':window.CourseSupplements?.label(chapter.id,current),title:slides[current-1]?.title||chapter.title,home:onHome}),openChapter,go,showHome};
window.addEventListener('beforeprint',buildPrint);window.addEventListener('popstate',()=>readRoute('none'));
if(new URLSearchParams(location.search).get('motion')==='off')document.body.classList.add('motion-off');readRoute('replace');
