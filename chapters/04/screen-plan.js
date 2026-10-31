/* Exact source ranges; one source page stays on one desktop screen. */
(function(){
 const heroes=new Set([1,4,10,17,21,25,41,43]);
 const cuts={5:[0,2,4,6],6:[0,2],7:[0,2,3,4],8:[0,1,2,3],9:[0,2,4],11:[0,3,6],19:[0,2,4],20:[0,2,4],22:[0,2],26:[0,3,6],27:[0,2,3],31:[0,4],32:[0,2,7],33:[0,4,7],38:[0,2],39:[0,5,10],40:[0,2]};
 const range=(t,a=0,b=t.paragraphs.length)=>({id:t.id,start:t.paragraphs.slice(0,a).reduce((n,p)=>n+p.text.length+1,0),end:b>=t.paragraphs.length?t.text.length:t.paragraphs.slice(0,b).reduce((n,p)=>n+p.text.length+1,0)});
 window.CHAPTER_04_SCREENS=window.CHAPTER_04_SLIDES.map(s=>{
  const mapped=new Set(s.diagrams.flatMap(d=>d.textIds||[])),mi=new Set(s.diagrams.flatMap(d=>d.imageIds||[])),mt=new Set(s.diagrams.flatMap(d=>d.tableIds||[]));
  const bodies=s.texts.filter(t=>t.id!==s.titleTextId&&t.sourceKind!=='tableCell'&&!mapped.has(t.id)),main=bodies.find(t=>t.placeholder?.type==='body')||bodies[0],chars=bodies.reduce((n,t)=>n+t.text.length,0);
  const sc={page:s.n,part:1,total:1,layout:heroes.has(s.n)?'hero':s.n===2?'agenda':s.n===3?'objectives':s.tables.length?'boards':s.images.length||s.diagrams.length?'illustrated':'reading',fragments:bodies.map(t=>range(t)),groups:[],images:s.images.filter(im=>!mi.has(im.id)).map(im=>im.id),tables:s.tables.filter(t=>!mt.has(t.id)).map(t=>t.id),density:chars>250?'compact':'normal',columns:2,mainId:main?.id};
  if(sc.layout==='reading'&&main){const c=cuts[s.n]||[0];sc.groups=c.map((a,i)=>({name:'g'+i,fragments:[range(main,a,c[i+1]??main.paragraphs.length)]}));for(const t of bodies.filter(t=>t!==main))sc.groups.push({name:'g'+sc.groups.length,fragments:[range(t)]});sc.columns=[7,8,19,26].includes(s.n)?3:sc.groups.length===1?1:2;sc.lead=[5,6,7,8,9,20,27,32].includes(s.n);}
  if(s.n===11){sc.layout='state-definition';sc.columns=2;}
  if(s.n===33){sc.layout='evaluation';sc.columns=2;}
  if([14,15,16,18,29,30,37].includes(s.n))sc.layout='wide-illustration';
  if([13,34,36].includes(s.n))sc.layout='puzzle';
  if([6,9].includes(s.n)){sc.layout='photo-reading';sc.photo=s.n===6?'photos/road-interchange-v8.jpg':'photos/cadre-mars-yard-v8.jpg';}
  if(s.n===42)sc.layout='demonstration';
  return sc;
 });
})();
