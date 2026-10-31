/* One original page, one screen. Source paragraph ranges remain exact. */
(function(){
 const heroes=new Set([1,4,9,36,38]);
 const cuts={5:[0,2],6:[0,2,5,7],8:[0,3],10:[0,3,6],16:[0,2],17:[0,2,4],18:[0,4,8],21:[0,3],22:[0,5,10],24:[0,3,6],26:[0,2],27:[0,2],31:[0,4,6],32:[0,3,6,9],33:[0,4,7],34:[0,3,6,10],35:[0,3],37:[0,2,3]};
 const range=(t,a=0,b=t.paragraphs.length)=>({id:t.id,start:t.paragraphs.slice(0,a).reduce((n,p)=>n+p.text.length+1,0),end:b>=t.paragraphs.length?t.text.length:t.paragraphs.slice(0,b).reduce((n,p)=>n+p.text.length+1,0)});
 window.CHAPTER_05_SCREENS=window.CHAPTER_05_SLIDES.map(s=>{
  const diagrams=s.diagrams||[],mapped=new Set(diagrams.flatMap(d=>d.textIds||[])),mi=new Set(diagrams.flatMap(d=>d.imageIds||[])),mt=new Set(diagrams.flatMap(d=>d.tableIds||[]));
  const bodies=s.texts.filter(t=>t.id!==s.titleTextId&&t.sourceKind!=='tableCell'&&!mapped.has(t.id)),main=bodies.find(t=>t.placeholder?.type==='body')||bodies[0],chars=bodies.reduce((n,t)=>n+t.text.length,0);
  const sc={page:s.n,part:1,total:1,layout:heroes.has(s.n)?'hero':s.n===2?'agenda':s.n===3?'objectives':s.tables.length?'tables':s.images.length||diagrams.length?'illustrated':'reading',fragments:bodies.map(t=>range(t)),groups:[],images:s.images.filter(im=>!mi.has(im.id)&&!['animated-answer-mask','animated-question-mask'].includes(im.sourcePurpose)).map(im=>im.id),tables:s.tables.filter(t=>!mt.has(t.id)).map(t=>t.id),density:chars>270?'compact':'normal',columns:2,mainId:main?.id};
  if(main){const c=cuts[s.n]||[0];sc.groups=c.map((a,i)=>({name:'g'+i,fragments:[range(main,a,c[i+1]??main.paragraphs.length)]}));for(const t of bodies.filter(t=>t!==main))sc.groups.push({name:'g'+sc.groups.length,fragments:[range(t)]});}
  if([10,17,22,31,37].includes(s.n))sc.columns=3;
  if([6,18,24,32,33,34].includes(s.n))sc.lead=true;
  if([13,14,15,19].includes(s.n))sc.layout='wide-illustration';
  if(s.n===11)sc.layout='comparison-table';
  if(s.n===12)sc.layout='model-photo';
  if(s.n===16)sc.layout='elements';
  if(s.n===20)sc.layout='gray-tables';
  if(s.n===23)sc.layout='fitness-mapping';
  if(s.n===25)sc.layout='linear-scaling';
  if(s.n===28)sc.layout='probability';
  if(s.n===29)sc.layout='ranking';
  if(s.n===30)sc.layout='roulette';
  if(s.n===27)sc.layout='selection-photo';
  if([32,33,34].includes(s.n))sc.layout='chromosomes';
  if(s.n===37)sc.layout='steps';
  return sc;
 });
})();
