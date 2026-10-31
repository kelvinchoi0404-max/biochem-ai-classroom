/* Authored formal page numbers are separate from stable internal route IDs. */
(function(root){
 'use strict';
 const chapterId=value=>String(value).padStart(2,'0');
 const catalogChapter=chapter=>(root.COURSE_CHAPTERS||[]).find(c=>c.id===chapterId(chapter));
 function find(chapter,page){return catalogChapter(chapter)?.formalLessons?.find(p=>p.page===Number(page));}
 function number(chapter,page){return find(chapter,page)?.displayPage??catalogChapter(chapter)?.pageLabels?.[Number(page)]??Number(page);}
 function label(chapter,page){return find(chapter,page)||Object.hasOwn(catalogChapter(chapter)?.pageLabels||{},Number(page))?'第'+number(chapter,page)+'頁':null;}
 function href(chapter,page){
  const c=catalogChapter(chapter),lesson=find(chapter,page),route=lesson?.slug||root.CourseSupplements?.find(chapterId(chapter),page)?.slug||'index.html';
  const ambiguous=route==='index.html'&&!Object.hasOwn(c?.pageLabels||{},Number(page))&&Object.values(c?.pageLabels||{}).includes(Number(page));
  return route+'?chapter='+chapterId(chapter)+'&page='+number(chapter,page)+(ambiguous?'&sourcePage='+Number(page):'');
 }
 function resolve(chapter,page,pathname,sourcePage=null){
  const c=catalogChapter(chapter),source=Number(sourcePage);
  if(sourcePage!==null&&Number.isInteger(source)&&source>0&&source<=Number(c?.pages))return source;
  const name=String(pathname||'').split('/').pop();
  const lesson=c?.formalLessons?.find(p=>p.slug===name&&[p.displayPage,p.page,...(p.legacyDisplayPages||[])].includes(Number(page)));
  if(lesson)return lesson.page;
  const supplement=root.CourseSupplements?.defs.find(p=>p.chapter===chapterId(chapter)&&p.slug===name&&!p.formal);
  if(supplement&&supplement.page===Number(page))return supplement.page;
  const mapped=Object.entries(c?.pageLabels||{}).find(([,display])=>display===Number(page));
  return mapped?Number(mapped[0]):Number(page);
 }
 root.CoursePageLabels={find,number,label,href,resolve};
})(typeof window!=='undefined'?window:globalThis);
