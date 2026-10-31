/* One source slide per desktop screen; exact UTF-16 paragraph boundaries. */
(function(){
 const heroes=new Set([1,4,8,18,22,36,39]),cuts={5:[0,2],6:[0,3,9],7:[0,3],10:[0,3],16:[0,3,6],24:[0,3,5],25:[0,2,5],33:[0,3],34:[0,6],35:[0,1,2,3]};
 const range=(t,a=0,b=t.paragraphs.length)=>({id:t.id,start:t.paragraphs.slice(0,a).reduce((n,p)=>n+p.text.length+1,0),end:b>=t.paragraphs.length?t.text.length:t.paragraphs.slice(0,b).reduce((n,p)=>n+p.text.length+1,0)});
 window.CHAPTER_06_SCREENS=window.CHAPTER_06_SLIDES.map(s=>{
  const diagrams=s.diagrams||[],mapped=new Set(diagrams.flatMap(d=>d.textIds||[])),mi=new Set(diagrams.flatMap(d=>d.imageIds||[])),mt=new Set(diagrams.flatMap(d=>d.tableIds||[]));
  const bodies=s.texts.filter(t=>t.id!==s.titleTextId&&t.sourceKind!=='tableCell'&&!mapped.has(t.id)),main=bodies.find(t=>t.placeholder?.type==='body')||bodies[0],chars=bodies.reduce((n,t)=>n+t.text.length,0);
  const sc={page:s.n,part:1,total:1,layout:heroes.has(s.n)?'hero':s.n===2?'agenda':s.n===3?'objectives':'reading',fragments:bodies.map(t=>range(t)),groups:[],images:s.images.filter(im=>!mi.has(im.id)).map(im=>im.id),tables:s.tables.filter(t=>!mt.has(t.id)).map(t=>t.id),density:chars>260?'compact':'normal',columns:2,mainId:main?.id};
  if(main){const c=cuts[s.n]||[0];sc.groups=c.map((a,i)=>({name:'g'+i,fragments:[range(main,a,c[i+1]??main.paragraphs.length)]}));for(const t of bodies.filter(t=>t!==main))sc.groups.push({name:'g'+sc.groups.length,fragments:[range(t)]});}
  if([6,24,25,35].includes(s.n))sc.lead=true;
  if([9,23].includes(s.n))sc.layout='photo';
  if(s.n===11)sc.layout='vectors';
  if([12,13,14,17].includes(s.n))sc.layout='pso-equation';
  if(s.n===15)sc.layout='steps';
  if(s.n===16)sc.columns=3;
  if(s.n===19)sc.layout='applications';
  if(s.n===20)sc.layout='vrp-definition';
  if(s.n===21)sc.layout='vrp-model';
  if(s.n===26)sc.layout='aco-parameters';
  if(s.n===27)sc.layout='aco-probability';
  if([28,32].includes(s.n))sc.layout='comparison-table';
  if(s.n===29)sc.layout='pheromone-update';
  if([30,31].includes(s.n))sc.layout='deposit-models';
  if(s.n===37)sc.layout='data-table-image';
  if(s.n===38)sc.layout='gantt';
  return sc;
 });
})();
