(function () {
  'use strict';

  const title = '溫室自動灌溉';
  const labels = ['VS', 'S', 'M', 'L', 'VL'];
  const names = {VS: '很短', S: '短', M: '中等', L: '長', VL: '很長'};
  const ranges = {VS: [0, 20], S: [20, 40], M: [40, 60], L: [60, 80], VL: [80, 120]};
  const ruleOutputs = [['VS', 'M', 'L'], ['S', 'M', 'L'], ['M', 'L', 'VL']];
  const inputNames = ['低', '中', '高'];
  const colors = ['#42747b', '#842b50', '#a76b08'];
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const fmt = value => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
  const text = (x, y, value, cls = '', anchor = 'middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${value}</text>`;

  function membership(value) {
    if (!Number.isFinite(value) || value < 0 || value > 100) throw new RangeError('輸入須在0至100之間');
    const low = Math.max(0, 1 - value / 50);
    const mid = value <= 50 ? value / 50 : (100 - value) / 50;
    const high = Math.max(0, (value - 50) / 50);
    return [low, mid, high];
  }

  function infer(x, y) {
    const dryness = membership(x), sunlight = membership(y);
    const rules = ruleOutputs.flatMap((row, i) => row.map((output, j) => ({
      number: i * 3 + j + 1, dryness: i, sunlight: j, output,
      alpha: Math.min(dryness[i], sunlight[j])
    })));
    const beta = Object.fromEntries(labels.map(label => [label, Math.max(...rules.filter(rule => rule.output === label).map(rule => rule.alpha))]));
    const pieces = labels.map(label => {
      const [left, right] = ranges[label], height = beta[label];
      const area = (right - left) * height, center = (left + right) / 2;
      return {label, left, right, height, area, center, moment: area * center};
    });
    const area = pieces.reduce((sum, piece) => sum + piece.area, 0);
    const moment = pieces.reduce((sum, piece) => sum + piece.moment, 0);
    return {x, y, dryness, sunlight, rules, beta, pieces, area, moment, centroid: area ? moment / area : null};
  }

  const example = infer(25, 75);
  const svg = (id, label, content, height = 220) => `<svg class="fce-graphic" viewBox="0 0 1080 ${height}" role="img" aria-labelledby="fce-${id}-title"><title id="fce-${id}-title">${esc(label)}</title>${content}</svg>`;
  function axes(max = 100, height = 220) {
    const left = 78, right = 1020, top = 42, bottom = height - 65;
    const sx = value => left + value / max * (right - left);
    const sy = value => bottom - value * (bottom - top);
    const ticks = max === 120 ? [0, 20, 40, 60, 80, 120] : [0, 25, 50, 75, 100];
    let markup = `<path d="M ${left} ${top - 12} V ${bottom} H ${right + 12}" class="fce-axis"/>`;
    [0.5, 1].forEach(value => { markup += `<path d="M ${left} ${sy(value)} H ${right}" class="fce-grid"/>${text(left - 20, sy(value) + 6, fmt(value), 'fce-axis-label', 'end')}`; });
    ticks.forEach(value => { markup += `<path d="M ${sx(value)} ${bottom} v 7" class="fce-axis"/>${text(sx(value), bottom + 29, value, 'fce-axis-label')}`; });
    markup += text(31, 27, '隸屬度 μ', 'fce-axis-label', 'start');
    markup += text(right, height - 9, max === 120 ? 'z（分鐘）' : '指標值 u', 'fce-axis-label', 'end');
    return {markup, sx, sy, bottom};
  }

  function inputPlot() {
    const ax = axes(); let out = ax.markup;
    const points = [[[0, 1], [50, 0], [100, 0]], [[0, 0], [50, 1], [100, 0]], [[0, 0], [50, 0], [100, 1]]];
    points.forEach((line, i) => {
      out += `<polyline points="${line.map(([x, y]) => `${ax.sx(x)},${ax.sy(y)}`).join(' ')}" fill="none" stroke="${colors[i]}" stroke-width="4"/>`;
      out += text([ax.sx(10), ax.sx(50), ax.sx(90)][i], 25, inputNames[i], `fce-input-label fce-color-${i}`);
    });
    return svg('inputs', '低從0處的1直線下降至50處的0；中在0與100為0，在50為1；高從50處的0直線上升至100處的1。', out);
  }

  function outputPlot(id, showCentroid = false) {
    const ax = axes(120, 220); let out = ax.markup;
    for (const piece of example.pieces) {
      if (piece.height <= 0) continue;
      const fill = piece.label === 'L' ? '#e9c471' : '#b66c88';
      out += `<rect x="${ax.sx(piece.left)}" y="${ax.sy(piece.height)}" width="${ax.sx(piece.right) - ax.sx(piece.left)}" height="${ax.bottom - ax.sy(piece.height)}" fill="${fill}" fill-opacity=".75" stroke="${piece.label === 'L' ? '#9a650c' : '#842b50'}" stroke-width="2"/>`;
      out += text(ax.sx(piece.center), ax.sy(piece.height) - 13, `${piece.label}：${fmt(piece.height)}`, 'fce-degree-label');
      out += text(ax.sx(piece.center), ax.sy(piece.height) + 35, `中心 ${fmt(piece.center)}`, 'fce-area-label');
    }
    if (showCentroid) {
      const cx = ax.sx(example.centroid);
      out += `<path d="M ${cx} 30 V ${ax.bottom + 8}" class="fce-centroid-mark"/>${text(cx + 12, 25, '面積重心 60', 'fce-centroid-label', 'start')}`;
    }
    return svg(id, `M在40至60分鐘高0.5，L在60至80分鐘高0.5，兩片面積各10，中心分別為50與70。${showCentroid ? '面積重心為60分鐘。' : ''}`, out);
  }

  function table(head, rows, cls = '') {
    return `<div class="fce-table-scroll" data-step-horizontal tabindex="0" role="region" aria-label="教學表格"><table class="fce-table ${cls}"><thead><tr>${head.map(cell => `<th scope="col">${cell}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  const formula = content => `<div class="fce-formula">${content}</div>`;
  const plot = content => `<div class="fce-figure" data-step-horizontal tabindex="0" role="region" aria-label="隸屬函數圖">${content}</div>`;
  const ruleTable = table(['乾燥度 x ＼ 日照 y', '弱 SL', '中 SM', '強 SH'], ruleOutputs.map((row, i) => [`${inputNames[i]} ${['DL', 'DM', 'DH'][i]}`, ...row.map((output, j) => `<span class="fce-rule-number">r${i * 3 + j + 1}</span> ${output}`)]));
  const activeTable = table(['規則', '啟動度α', '輸出'], [
    ['r₂：DL且SM', 'min(0.5,0.5)=0.5', 'M'],
    ['r₃：DL且SH', 'min(0.5,0.5)=0.5', 'L'],
    ['r₅：DM且SM', 'min(0.5,0.5)=0.5', 'M'],
    ['r₆：DM且SH', 'min(0.5,0.5)=0.5', 'L']
  ], 'fce-active-rules-table');

  const frames = [
    {
      title: '題目：設計並計算灌溉時間',
      description: '溫室根據土壤乾燥度和日照強度調整灌溉時間。乾燥度較高或日照較強時，規則安排較長的灌溉時間。',
      body: table(['變量', '意思', '論域'], [['x', '土壤乾燥度', '[0,100]'], ['y', '日照強度', '[0,100]'], ['z', '灌溉時間（分鐘）', '[0,120]']], 'fce-domain-table') + `<ol class="fce-task-list"><li>設計輸入隸屬函數，列出九條模糊控制規則。</li><li>當x=25、y=75時，以面積重心法求灌溉時間。</li></ol>`
    },
    {
      title: '選定三個輸入隸屬函數',
      description: '兩個輸入使用同一組函數。乾燥度的低、中、高分別記作DL、DM、DH；日照的弱、中、強分別記作SL、SM、SH。',
      body: plot(inputPlot()) + formula('低／弱：μ(u)=max(0, 1−u/50)<br>中：μ(u)=u/50（0≤u≤50）；(100−u)/50（50&lt;u≤100）<br>高／強：μ(u)=max(0, (u−50)/50)')
    },
    {
      title: '列出九條規則與輸出集合',
      description: '每格代表一條規則。例如r₆：乾燥度中等且日照強，則灌溉時間長。VS、S、M、L、VL依次表示很短、短、中等、長、很長。',
      body: `<div class="fce-definition-grid"><div><h3>九條規則</h3>${ruleTable}</div><div class="fce-output-def"><h3>灌溉時間的隸屬函數</h3>${table(['集合', 'μ = 1的區間'], [['VS', '[0,20)'], ['S', '[20,40)'], ['M', '[40,60)'], ['L', '[60,80)'], ['VL', '[80,120]']], 'fce-output-table')}<p class="fce-note">區間外μ = 0。</p></div></div>`
    },
    {
      title: '代入x = 25、y = 75',
      description: '將兩個輸入分別代入三個函數，得到下列隸屬度。',
      body: formula('乾燥度x=25：<br>DL=(50−25)/50=0.5；DM=25/50=0.5；DH=0<br>所以(DL,DM,DH)=(0.5,0.5,0)。') + formula('日照強度y=75：<br>SL=0；SM=(100−75)/50=0.5；SH=(75−50)/50=0.5<br>所以(SL,SM,SH)=(0,0.5,0.5)。')
    },
    {
      title: '先取min，再合併相同輸出',
      description: '每條規則對兩個條件取min，得到啟動度；指向同一輸出的規則再取max。',
      body: activeTable + `<p class="fce-note">其餘r₁、r₄、r₇、r₈、r₉的啟動度均為0；VS、S、VL的聚合高度為0。</p>` + formula('β<sub>M</sub>=max(α₂,α₅,α₇)=max(0.5,0.5,0)=0.5<br>β<sub>L</sub>=max(α₃,α₆,α₈)=max(0.5,0.5,0)=0.5')
    },
    {
      title: '畫出輸出，計算兩片面積',
      description: 'M和L各截在高度0.5，再逐點取max，得到下圖。兩片矩形各寬20分鐘，面積均為10。',
      body: plot(outputPlot('areas')) + formula('A<sub>M</sub>=(60−40)×0.5=10；中心c<sub>M</sub>=(40+60)/2=50。<br>A<sub>L</sub>=(80−60)×0.5=10；中心c<sub>L</sub>=(60+80)/2=70。<br>總面積A=10+10=20。')
    },
    {
      title: '用面積重心求出60分鐘',
      description: '把各片面積乘以其中心位置，相加後除以總面積。',
      body: formula('z* = (Σ 面積×中心) / Σ 面積<br>= (A<sub>M</sub>c<sub>M</sub>+A<sub>L</sub>c<sub>L</sub>)/(A<sub>M</sub>+A<sub>L</sub>)<br>= (10×50+10×70)/(10+10) = 60分鐘。') + plot(outputPlot('centroid', true))
    },
    {
      title: '作答示範與自測',
      description: '採用上述函數和九條規則，可把計算寫成以下四步。',
      body: `<div class="fce-final-grid"><ol class="fce-solution-steps fce-short-solution"><li><h3>輸入隸屬度</h3><p>x=25→(0.5,0.5,0)；y=75→(0,0.5,0.5)。</p></li><li><h3>啟動與聚合</h3><p>r₂、r₃、r₅、r₆各為0.5；取max得β<sub>M</sub>=β<sub>L</sub>=0.5。</p></li><li><h3>面積與中心</h3><p>A<sub>M</sub>=A<sub>L</sub>=20×0.5=10；c<sub>M</sub>=50，c<sub>L</sub>=70。</p></li><li><h3>面積重心</h3><p>z*=(10×50+10×70)/(10+10)=60分鐘。</p></li></ol><div class="fce-self-test"><h3>自測</h3><p>當x=50、y=25時，灌溉時間是多少？</p><details class="fce-practice-answer" data-step-reset-details><summary>參考解答</summary><p>x=50→(0,1,0)；y=25→(0.5,0.5,0)。<br>r₄輸出S，r₅輸出M，啟動度均為0.5。<br>S、M各面積10，中心分別為30、50。<br>z*=(10×30+10×50)/(10+10)=40分鐘。</p></details><a class="fce-review-link" href="exam-review.html">考試題庫練習 →</a></div></div>`
    }
  ];

  const html = `<section class="page supplement fuzzy-bridge fuzzy-control-experiment" data-page="130" data-fb-page="130" aria-labelledby="page-title"><header class="supp-heading"><h1 id="page-title">${title}</h1></header><div class="fce-frames" data-step-scroll tabindex="0" role="region" aria-label="課件內容">${frames.map((frame, index) => `<section class="fce-frame" data-fb-frame="${index}" data-fb-title="${esc(frame.title)}"${index ? ' hidden' : ''}><div class="fce-copy"><h2>${frame.title}</h2><p data-fb-description>${frame.description}</p></div><div class="fce-body">${frame.body}</div></section>`).join('')}</div><div data-fb-controls></div></section>`;
  const plain = value => value.replace(/<[^>]*>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const lessonText = [title, '輸入土壤乾燥度x及日照強度y的論域[0,100]；輸出灌溉時間z的論域[0,120]分鐘。完整算例x=25、y=75。', ...frames.map((frame, index) => `${index + 1}. ${frame.title}\n${plain(frame.description)}\n${plain(frame.body)}`)].join('\n');
  window.COURSE_SUPPLEMENTS = [...(window.COURSE_SUPPLEMENTS || []), {
    chapter: '03', page: 130, number: 21, after: 108, section: 85, formal: true, displayPage: 109,
    slug: 'fuzzy-control-experiment.html', title, text: lessonText, html, images: [], kind: 'fuzzy-control-experiment'
  }];
  window.CourseFuzzyControlExperiment = {membership, infer, example, ruleOutputs, ranges, frames: frames.length};
})();
