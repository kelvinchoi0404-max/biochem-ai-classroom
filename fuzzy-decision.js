(function () {
  'use strict';
  const title = '模糊決策：三種取值方法';
  const equations = {
  "maxSet": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><msup><mi>U</mi><mo mathvariant=\"normal\" lspace=\"0em\" rspace=\"0em\">′</mo></msup><mo>=</mo><mn>0.5</mn><mi mathvariant=\"normal\">/</mi><mo stretchy=\"false\">(</mo><mo>−</mo><mn>3</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mn>0.5</mn><mi mathvariant=\"normal\">/</mi><mo stretchy=\"false\">(</mo><mo>−</mo><mn>2</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mn>0.5</mn><mi mathvariant=\"normal\">/</mi><mo stretchy=\"false\">(</mo><mo>−</mo><mn>1</mn><mo stretchy=\"false\">)</mo></mrow><annotation encoding=\"application/x-tex\">U&#x27;=0.5/(-3)+0.5/(-2)+0.5/(-1)</annotation></semantics></math></span>",
  "maxMean": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mi>U</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mn>3</mn><mo>+</mo><mo stretchy=\"false\">(</mo><mo>−</mo><mn>2</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mo stretchy=\"false\">(</mo><mo>−</mo><mn>1</mn><mo stretchy=\"false\">)</mo></mrow><mn>3</mn></mfrac><mo>=</mo><menclose notation=\"box\"><mstyle scriptlevel=\"0\" displaystyle=\"false\"><mstyle scriptlevel=\"0\" displaystyle=\"false\"><mstyle scriptlevel=\"0\" displaystyle=\"true\"><mrow><mo>−</mo><mn>2</mn></mrow></mstyle></mstyle></mstyle></menclose></mrow><annotation encoding=\"application/x-tex\">U=\\frac{-3+(-2)+(-1)}{3}=\\boxed{-2}</annotation></semantics></math></span>",
  "weighted": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mi>U</mi><mo>=</mo><mfrac><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msub><mi>x</mi><mi>i</mi></msub><mi>μ</mi><mo stretchy=\"false\">(</mo><msub><mi>x</mi><mi>i</mi></msub><mo stretchy=\"false\">)</mo></mrow><mrow><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><mi>μ</mi><mo stretchy=\"false\">(</mo><msub><mi>x</mi><mi>i</mi></msub><mo stretchy=\"false\">)</mo></mrow></mfrac></mrow><annotation encoding=\"application/x-tex\">U=\\frac{\\sum_{i=1}^{n}x_i\\mu(x_i)}{\\sum_{i=1}^{n}\\mu(x_i)}</annotation></semantics></math></span>",
  "products": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mi>U</mi><mo>=</mo><mfrac><mrow><mn>0.1</mn><mo stretchy=\"false\">(</mo><mn>2</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mn>0.6</mn><mo stretchy=\"false\">(</mo><mn>3</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mn>0.5</mn><mo stretchy=\"false\">(</mo><mn>4</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mn>0.4</mn><mo stretchy=\"false\">(</mo><mn>5</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mn>0.2</mn><mo stretchy=\"false\">(</mo><mn>6</mn><mo stretchy=\"false\">)</mo></mrow><mrow><mn>0.1</mn><mo>+</mo><mn>0.6</mn><mo>+</mo><mn>0.5</mn><mo>+</mo><mn>0.4</mn><mo>+</mo><mn>0.2</mn></mrow></mfrac></mrow><annotation encoding=\"application/x-tex\">U=\\frac{0.1(2)+0.6(3)+0.5(4)+0.4(5)+0.2(6)}{0.1+0.6+0.5+0.4+0.2}</annotation></semantics></math></span>",
  "weightedResult": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mi>U</mi><mo>=</mo><mfrac><mn>7.2</mn><mn>1.8</mn></mfrac><mo>=</mo><menclose notation=\"box\"><mstyle scriptlevel=\"0\" displaystyle=\"false\"><mstyle scriptlevel=\"0\" displaystyle=\"false\"><mstyle scriptlevel=\"0\" displaystyle=\"true\"><mn>4</mn></mstyle></mstyle></mstyle></menclose></mrow><annotation encoding=\"application/x-tex\">U=\\frac{7.2}{1.8}=\\boxed{4}</annotation></semantics></math></span>",
  "medianLeft": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><munder><munder><mrow><mn>0.1</mn><mo>+</mo><mn>0.5</mn><mo>+</mo><mn>0.1</mn><mo>+</mo><mn>0</mn><mo>+</mo><mn>0.1</mn><mo>+</mo><mn>0.2</mn></mrow><mo stretchy=\"true\">⏟</mo></munder><mrow><mo>−</mo><mn>4</mn><mtext> 至 </mtext><mn>1</mn></mrow></munder><mo>=</mo><mn>1</mn></mrow><annotation encoding=\"application/x-tex\">\\underbrace{0.1+0.5+0.1+0+0.1+0.2}_{-4\\text{ 至 }1}=1</annotation></semantics></math></span>",
  "medianRight": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><munder><munder><mrow><mn>0.4</mn><mo>+</mo><mn>0.5</mn><mo>+</mo><mn>0.1</mn></mrow><mo stretchy=\"true\">⏟</mo></munder><mrow><mn>2</mn><mtext> 至 </mtext><mn>4</mn></mrow></munder><mo>=</mo><mn>1</mn></mrow><annotation encoding=\"application/x-tex\">\\underbrace{0.4+0.5+0.1}_{2\\text{ 至 }4}=1</annotation></semantics></math></span>",
  "medianResult": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mi>U</mi><mo>=</mo><menclose notation=\"box\"><mstyle scriptlevel=\"0\" displaystyle=\"false\"><mstyle scriptlevel=\"0\" displaystyle=\"false\"><mstyle scriptlevel=\"0\" displaystyle=\"true\"><mn>1</mn></mstyle></mstyle></mstyle></menclose></mrow><annotation encoding=\"application/x-tex\">U=\\boxed{1}</annotation></semantics></math></span>",
  "output": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><msup><mi>B</mi><mo mathvariant=\"normal\" lspace=\"0em\" rspace=\"0em\">′</mo></msup><mo>=</mo><mo stretchy=\"false\">[</mo><mn>0</mn><mo separator=\"true\">,</mo><mn>0</mn><mo separator=\"true\">,</mo><mn>0.3</mn><mo separator=\"true\">,</mo><mn>0.6</mn><mo separator=\"true\">,</mo><mn>0.8</mn><mo stretchy=\"false\">]</mo></mrow><annotation encoding=\"application/x-tex\">B&#x27;=[0,0,0.3,0.6,0.8]</annotation></semantics></math></span>",
  "fanMean": "<span class=\"katex\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mi>U</mi><mo>=</mo><mfrac><mrow><mn>3</mn><mo stretchy=\"false\">(</mo><mn>0.3</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mn>4</mn><mo stretchy=\"false\">(</mo><mn>0.6</mn><mo stretchy=\"false\">)</mo><mo>+</mo><mn>5</mn><mo stretchy=\"false\">(</mo><mn>0.8</mn><mo stretchy=\"false\">)</mo></mrow><mrow><mn>0.3</mn><mo>+</mo><mn>0.6</mn><mo>+</mo><mn>0.8</mn></mrow></mfrac><mo>=</mo><mfrac><mn>7.3</mn><mn>1.7</mn></mfrac><mo>≈</mo><mn>4.29</mn></mrow><annotation encoding=\"application/x-tex\">U=\\frac{3(0.3)+4(0.6)+5(0.8)}{0.3+0.6+0.8}=\\frac{7.3}{1.7}\\approx4.29</annotation></semantics></math></span>"
};
  const M = key => `<div class="fd-equation">${equations[key]}</div>`;
  const weightedX = [2,3,4,5,6], weightedMu = [.1,.6,.5,.4,.2];
  const medianX = [-4,-3,-2,-1,0,1,2,3,4], medianMu = [.1,.5,.1,0,.1,.2,.4,.5,.1];
  const fanX = [1,2,3,4,5], fanMu = [0,0,.3,.6,.8];
  const fmt = n => String(Number(n.toFixed(2)));
  const sum = a => a.reduce((s,n)=>s+n,0);
  function decide(xs,mu) {
    const total=sum(mu), peak=Math.max(...mu), winners=xs.filter((_,i)=>mu[i]===peak);
    let cumulative=0, median=null;
    for(let i=0;i<xs.length;i++){cumulative+=mu[i];if(median===null&&cumulative>=total/2-1e-10)median=xs[i];}
    return {maximum:sum(winners)/winners.length,weighted:sum(xs.map((x,i)=>x*mu[i]))/total,median,total};
  }
  function bars(xs,mu,{selected=[],interactive=false,prefix='',marker=null}={}) {
    const first=xs[0],last=xs.at(-1),width=100/xs.length;
    return `<div class="fd-plot" aria-label="各數值的隸屬度"><div class="fd-axis-title">隸屬度 μ</div><div class="fd-y"><span>1</span><span>0.5</span><span>0</span></div><div class="fd-bars" style="--columns:${xs.length}">${xs.map((x,i)=>`<${interactive?'button':'div'} ${interactive?`type="button" data-fd-cumulative="${i}" aria-pressed="${selected.includes(i)}" aria-label="數值 ${x}，隸屬度 ${fmt(mu[i])}"`:''} class="fd-column${selected.includes(i)?' fd-selected':''}" style="--weight:${mu[i]};--delay:${i*45}ms"><span class="fd-value">${fmt(mu[i])}</span><span class="fd-bar"></span><span class="fd-x">${prefix}${x}</span></${interactive?'button':'div'}>`).join('')}${marker===null?'':`<span class="fd-marker" style="left:${width/2+(marker-first)/(last-first)*(100-width)}%"><b>${fmt(marker)}</b></span>`}</div></div>`;
  }
  const table=(heads,rows)=>`<div class="fd-table-wrap"><table><thead><tr>${heads.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>i?`<td>${x}</td>`:`<th scope="row">${x}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const note=t=>`<p class="fd-note">${t}</p>`;
  function medianPanel(index, interactive=true) {
    const cumulative=sum(medianMu.slice(0,index+1));
    return `<div class="fd-median" data-fd-median>${bars(medianX,medianMu,{interactive,selected:Array.from({length:index+1},(_,i)=>i)})}<div class="fd-cumulative" aria-live="polite"><span>累計至 <b data-fd-current>${medianX[index]}</b></span><span data-fd-total>${fmt(cumulative)} / 2</span><div class="fd-track"><span data-fd-fill style="width:${cumulative/2*100}%"></span><i></i></div><span data-fd-status>${cumulative<1?'尚未達到一半':cumulative===1?'剛好達到一半':'已超過一半'}</span><small>一半 = 1</small></div></div>`;
  }
  const fanMethods={
    maximum:{label:'最大隸屬度法',value:'5',detail:'最高隸屬度為 0.8，對應數值 5。',selected:[4]},
    weighted:{label:'加權平均法',value:'4.29',detail:M('fanMean'),selected:[2,3,4]},
    median:{label:'中位數法',value:'4',detail:'總權重 1.7，一半為 0.85。累計至 3 為 0.3，至 4 為 0.9；首次越過一半，取 4。',selected:[0,1,2,3]}
  };
  function comparison(method='maximum') {
    const item=fanMethods[method];
    return `<div class="fd-compare" data-fd-compare><div class="fd-tabs" role="group" aria-label="選擇模糊決策方法">${Object.entries(fanMethods).map(([key,v])=>`<button type="button" data-fd-method="${key}" aria-pressed="${key===method}">${v.label}</button>`).join('')}</div><div class="fd-compare-layout"><div data-fd-comparison-chart>${bars(fanX,fanMu,{selected:item.selected,marker:Number(item.value)})}</div><div class="fd-result" aria-live="polite"><span data-fd-method-name>${item.label}</span><strong data-fd-answer>${method==='weighted'?'≈ ':''}${item.value}</strong></div></div><div class="fd-explanation" data-fd-explanation>${item.detail}</div></div>`;
  }
  const frames=[
    {title:'一組隸屬度，怎樣變成一個輸出值？',text:'模糊推理保留了多個候選值。模糊決策（解模糊）把這組結果轉成裝置可以執行的一個數值。',body:bars(weightedX,weightedMu)+`<div class="fd-conversion"><span>模糊輸出：每個候選值各有隸屬度</span><b>→</b><span>確定輸出：U = ?</span></div>`},
    {title:'最大隸屬度法：先找最高值',text:'只選隸屬度最大的候選值；若有多個並列，本例取它們的算術平均。',body:M('maxSet')+bars([-3,-2,-1],[.5,.5,.5],{selected:[0,1,2]})},
    {title:'三個值並列最高，取平均 −2',text:'−3、−2、−1 的隸屬度都是 0.5，三個值一起納入平均。',body:M('maxMean')+bars([-3,-2,-1],[.5,.5,.5],{selected:[0,1,2],marker:-2})+note('較低的隸屬度不參與計算。若最高峰相距很遠，平均值可能落在支持度很低的位置。')},
    {title:'加權平均法：每個值都參與',text:'把隸屬度當作權重。候選值的隸屬度越大，對結果的影響越大。',body:M('weighted')+bars(weightedX,weightedMu,{selected:[0,1,2,3,4]})+note('xᵢ 是候選值，μ(xᵢ) 是對應隸屬度，Σ 表示加總。隸屬度是這裡的權重，不是概率。')},
    {title:'先相乘，再把結果加起來',text:'分子加總「數值 × 隸屬度」，分母加總隸屬度。',body:table(['數值 xᵢ',...weightedX],[['隸屬度 μ(xᵢ)',...weightedMu],['乘積 xᵢμ(xᵢ)',...weightedX.map((x,i)=>fmt(x*weightedMu[i]))]])+M('products')+M('weightedResult')},
    {title:'加權平均是權重的平衡中心',text:'把候選值放在數軸上，隸屬度看作重量。本例的平衡中心在 4。',body:bars(weightedX,weightedMu,{selected:[0,1,2,3,4],marker:4})+M('weightedResult')+note('所有候選值都保留在計算中；距離很遠的數值，也可能拉動平均位置。')},
    {title:'中位數法：從小到大累計權重',text:'總隸屬度為 2，一半是 1。依數值順序累計，取首次達到或超過 1 的位置。',body:medianPanel(0)+note('點選柱子查看累計值。這裡既不是取數值序列的中間一項，也不是對隸屬度排序。')},
    {title:'累計至 1，剛好達到一半',text:'−4 至 1 的權重合計為 1；剩下 2 至 4 的權重也合計為 1。',body:`<div class="fd-split">${M('medianLeft')}${M('medianRight')}</div>`+medianPanel(5,false)+`<div class="fd-median-answer">${M('medianResult')}${note('1 至 2 之間都可作權重分界；本例取左側首次達到一半的數值 1。')}</div>`},
    {title:'三種方法，使用的資訊不同',text:'按輸出需求選定方法；連續控制與離散等級，不一定採用相同的取值規則。',body:table(['比較','最大隸屬度法','加權平均法','中位數法'],[
      ['怎樣取值','選最高峰；並列取平均','找加權中心','找一半權重的分界'],
      ['用到的資訊','最高隸屬度','全部數值與權重','由小到大的累計權重'],
      ['常見用途','代表值、等級選擇','連續數值控制','權重分界；較不受遠端值影響'],
      ['限制','忽略其他支持度','容易受遠端值拉動','不一定落在最高峰'],
      ['計算','比較最高值','乘加與除法','按數值排序並累計']
    ])},
    {title:'用風門題的輸出比較三種方法',text:'直接採用風門例推理後的 B′，只比較最後的取值。選擇下方方法，查看圖上的輸出位置。',body:M('output')+comparison()+note('4.29 是未取整的理論值。若裝置只接受整數等級，仍須按既定規則取整或映射。')}
  ];
  const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  const html=`<section class="page supplement fuzzy-bridge fuzzy-decision" data-page="131" data-fb-page="131" aria-labelledby="page-title"><header class="supp-heading"><h1 id="page-title">${title}</h1></header><div class="fd-frames" data-projection-ignore data-step-scroll tabindex="0" role="region" aria-label="模糊決策內容">${frames.map((f,i)=>`<section class="fd-frame" data-fb-frame="${i}" data-fb-title="${esc(f.title)}"${i?' hidden':''}><h2>${f.title}</h2><p class="fd-intro" data-fb-description>${f.text}</p><div class="fd-body">${f.body}</div></section>`).join('')}</div><div data-fb-controls></div></section>`;
  const plain=s=>s.replace(/<annotation[\s\S]*?<\/annotation>/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  window.COURSE_SUPPLEMENTS=[...(window.COURSE_SUPPLEMENTS||[]),{chapter:'03',page:131,number:21,after:105,section:85,slug:'fuzzy-decision.html',title,text:frames.map(f=>`${f.title}\n${f.text}\n${plain(f.body)}`).join('\n'),html,images:[],kind:'fuzzy-decision'}];
  window.CourseFuzzyDecision={decide,weightedX,weightedMu,medianX,medianMu,fanX,fanMu,frames:frames.length};
  if(typeof document==='undefined')return;
  document.addEventListener('click',event=>{
    const choice=event.target.closest('.fuzzy-decision [data-fd-cumulative]');
    if(choice){const panel=choice.closest('[data-fd-median]'),index=Number(choice.dataset.fdCumulative),total=sum(medianMu.slice(0,index+1));
      panel.querySelectorAll('[data-fd-cumulative]').forEach((b,i)=>{b.classList.toggle('fd-selected',i<=index);b.setAttribute('aria-pressed',String(i<=index));});
      panel.querySelector('[data-fd-current]').textContent=medianX[index];panel.querySelector('[data-fd-total]').textContent=`${fmt(total)} / 2`;
      panel.querySelector('[data-fd-fill]').style.width=`${total/2*100}%`;panel.querySelector('[data-fd-status]').textContent=total<1-1e-10?'尚未達到一半':Math.abs(total-1)<1e-10?'剛好達到一半':'已超過一半';
    }
    const method=event.target.closest('.fuzzy-decision [data-fd-method]');
    if(method){const panel=method.closest('[data-fd-compare]'),key=method.dataset.fdMethod,item=fanMethods[key];
      panel.querySelectorAll('[data-fd-method]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fdMethod===key)));
      panel.querySelector('[data-fd-comparison-chart]').innerHTML=bars(fanX,fanMu,{selected:item.selected,marker:Number(item.value)});
      panel.querySelector('[data-fd-method-name]').textContent=item.label;panel.querySelector('[data-fd-answer]').textContent=(key==='weighted'?'≈ ':'')+item.value;panel.querySelector('[data-fd-explanation]').innerHTML=item.detail;
    }
    if(event.target.closest('.fuzzy-decision [data-step-action="reset"]')){
      const page=event.target.closest('.fuzzy-decision');
      page.querySelectorAll('[data-fd-median]').forEach((p,i)=>p.outerHTML=medianPanel(i?5:0,!i));
      const panel=page.querySelector('[data-fd-compare]');if(panel)panel.outerHTML=comparison();
    }
  });
})();
