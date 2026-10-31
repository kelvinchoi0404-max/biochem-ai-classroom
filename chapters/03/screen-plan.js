/* One source PPT page per screen. Every range uses the unchanged source string. */
(function(){
 const hero=new Set([1,4,25,50,57,68,85,109]);
 const manualCuts={7:[0,2,5],8:[0,2,7],10:[0,1,4],11:[0,1,4],12:[0,5],14:[0,2],17:[0,2,6],20:[0,4],30:[0,5],31:[0,5],32:[0,4],33:[0,2,7],34:[0,2,6],35:[0,2,5],39:[0,4],42:[0,2],46:[0,8],48:[0,8],53:[0,8],54:[0,4],59:[0,4],60:[0,3],61:[0,4],62:[0,5],65:[0,7],66:[0,7],67:[0,5],73:[0,4],75:[0,4,8],77:[0,8],80:[0,6],81:[0,8],82:[0,7],83:[0,7],84:[0,5],86:[0,2,5],87:[0,5],89:[0,4],90:[0,8],91:[0,2],93:[0,6],94:[0,5],96:[0,6],99:[0,4],106:[0,5]};
 const range=(t,a=0,b=t.paragraphs.length)=>({id:t.id,start:t.paragraphs.slice(0,a).reduce((n,p)=>n+p.text.length+1,0),end:b>=t.paragraphs.length?t.text.length:t.paragraphs.slice(0,b).reduce((n,p)=>n+p.text.length+1,0)});
 window.CHAPTER_03_SCREENS=window.CHAPTER_03_SLIDES.map(s=>{
  const mapped=new Set((s.diagrams||[]).flatMap(d=>d.textIds||[])),mappedImages=new Set((s.diagrams||[]).flatMap(d=>d.imageIds||[])),mappedTables=new Set((s.diagrams||[]).flatMap(d=>d.tableIds||[]));
  const bodies=s.texts.filter(t=>t.id!==s.titleTextId&&t.sourceKind!=='tableCell'&&!mapped.has(t.id));
  const chars=bodies.reduce((n,t)=>n+t.text.length,0),main=bodies.find(t=>t.placeholder?.type==='body')||[...bodies].sort((a,b)=>b.text.length-a.text.length)[0];
  const result={page:s.n,part:1,total:1,layout:hero.has(s.n)?'hero':s.n===2?'agenda':s.n===3?'objectives':s.tables.some(t=>!mappedTables.has(t.id))?'table':s.diagrams.length?'diagram':s.images.length?'illustrated':'reading',fragments:bodies.map(t=>range(t)),groups:[],images:s.images.filter(im=>!mappedImages.has(im.id)).map(im=>im.id),tables:s.tables.filter(t=>!mappedTables.has(t.id)).map(t=>t.id),diagramTextIds:[...mapped],mainId:main?.id,density:chars>410?'dense':chars>270?'compact':'normal'};
  if(result.layout==='reading'&&main){
   let cuts=manualCuts[s.n];
   if(!cuts&&main.text.length>210){let total=0,best=1,distance=Infinity;const weights=main.paragraphs.map(p=>p.text?Math.max(20,p.text.length):1),half=weights.reduce((a,b)=>a+b,0)/2;weights.forEach((w,i)=>{total+=w;if(i<weights.length-1&&Math.abs(total-half)<distance){distance=Math.abs(total-half);best=i+1;}});cuts=[0,best];}
   cuts=[...new Set((cuts||[0]).filter(n=>n<main.paragraphs.length))];
   result.groups=cuts.map((a,i)=>({name:'g'+i,fragments:[range(main,a,cuts[i+1]??main.paragraphs.length)]}));
   for(const t of bodies.filter(t=>t!==main))result.groups.push({name:'g'+result.groups.length,fragments:[range(t)]});
   if([46,48].includes(s.n)) result.groups=[{name:'g0',fragments:[range(bodies[0])]},{name:'g1',fragments:[range(bodies[1])]},{name:'g2',fragments:bodies.slice(2).map(t=>range(t))}];
   if([93,94].includes(s.n)) result.groups=bodies.map((t,i)=>({name:'g'+i,fragments:[range(t)]}));
   result.columns=[46,48,86].includes(s.n)?3:result.groups.length>1?2:1;
   result.lead=result.groups.length===3&&result.columns===2;
   if(s.n===86)result.photo='assets/photos/lotfi-zadeh-2005-v7.jpg';
  }
  if(s.n===97){result.layout='matrix-derivation';result.groups=[{fragments:[range(main,0,3)]},{fragments:[range(main,3,7)]},{fragments:[range(main,7)]}];}
  if(s.n===98){result.layout='matrix-derivation';result.groups=[{fragments:[range(main,0,8)]},{fragments:[range(main,8)]}];}
  if(s.n===64){result.layout='formula-composition';result.groups=[{fragments:[range(main,0,5)]},{fragments:[range(main,5,9)]},{fragments:[range(main,9)]}];}
  if(s.n===38){result.layout='definition-diagram';result.groups=[{fragments:[range(main,0,7)]},{fragments:[range(main,7)]}];}
  if(s.n===45){result.layout='proof-diagram';result.groups=bodies.map(t=>({fragments:[range(t)]}));}
  if(result.layout==='diagram'&&!bodies.length)result.layout='diagram-full';
  if(s.n===99){result.layout='supplement';result.photo='assets/photos/nasa-thermocouple-probes-1977-v7.jpg';}
  return result;
 });
})();
