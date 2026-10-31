(function () {
  'use strict';

  const title = 'A ∘ B：最大—最小合成';
  const A = [[0.2, 0.7], [0.6, 0.4]];
  const B = [[0.5, 0.8], [0.3, 0.9]];
  const C = A.map(row => B[0].map((_, j) => Math.max(...row.map((a, k) => Math.min(a, B[k][j])))));
  const fmt = value => typeof value === 'number' ? value.toFixed(1) : value;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const sub = (letter, index) => `${letter}<tspan baseline-shift="sub" font-size="17">${index}</tspan>`;
  const svgText = (x, y, value, cls = '', anchor = 'middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${value}</text>`;
  const compose = (x, baseline) => `<g role="img" aria-label="合成符號 ∘"><circle cx="${x}" cy="${baseline - 10}" r="6" fill="none" stroke="currentColor" stroke-width="2"/></g>`;
  const svg = (id, label, content, height = 350) => `<svg class="fcl-graphic" viewBox="0 0 1100 ${height}" role="img" aria-labelledby="fcl-${id}-title"><title id="fcl-${id}-title">${esc(label)}</title>${content}</svg>`;

  function matrix(values, x, y, name, rowLabels, colLabels, options = {}) {
    const cw = options.cellWidth || 72;
    const ch = 47;
    const gx = x + (rowLabels.length ? 60 : 0);
    const gy = y + 60;
    let out = svgText(gx + values[0].length * cw / 2, y + 1, esc(name), 'fcl-matrix-title');
    colLabels.forEach((label, j) => { out += svgText(gx + j * cw + cw / 2, gy - 15, label, 'fcl-axis-label'); });
    values.forEach((row, i) => {
      if (rowLabels[i]) out += svgText(gx - 23, gy + i * ch + 31, rowLabels[i], 'fcl-axis-label');
      row.forEach((value, j) => {
        const selected = options.row === i || options.col === j || (options.cell && options.cell[0] === i && options.cell[1] === j);
        const route = options.routeBy === 'col' ? j : i;
        const routeClass = selected && options.routeBy ? ` fcl-route-${route + 1}` : '';
        const active = selected ? ' fcl-cell-active' : '';
        out += `<g class="fcl-matrix-cell${active}${routeClass}" data-fcl-matrix="${esc(options.key || name)}" data-fcl-row="${i + 1}" data-fcl-col="${j + 1}" data-fcl-value="${esc(value)}"><rect x="${gx + j * cw}" y="${gy + i * ch}" width="${cw}" height="${ch}" rx="5"/>${svgText(gx + j * cw + cw / 2, gy + i * ch + 32, esc(fmt(value)))}</g>`;
      });
    });
    return out;
  }

  function matrixStrip(i, j, revealed, currentAnswer) {
    const values = C.map((row, r) => row.map((v, c) => r * 2 + c < revealed ? v : '·'));
    if (i !== null && revealed <= i * 2 + j) values[i][j] = currentAnswer ? C[i][j] : '?';
    return matrix(A, 18, 22, 'A：X 到 Y', [sub('x', 1), sub('x', 2)], [sub('y', 1), sub('y', 2)], {row: i, routeBy: 'col', key: 'A'}) +
      compose(312, 119) +
      matrix(B, 342, 22, 'B：Y 到 Z', [sub('y', 1), sub('y', 2)], [sub('z', 1), sub('z', 2)], {col: j, routeBy: 'row', key: 'B'}) +
      svgText(670, 119, '=', 'fcl-operation') +
      matrix(values, 730, 22, 'C：X 到 Z', [sub('x', 1), sub('x', 2)], [sub('z', 1), sub('z', 2)], {cell: i === null ? null : [i, j], key: 'C'});
  }

  function routeGraph(i, j, focus, candidates, answer, id) {
    const routeValues = [0, 1].map(k => Math.min(A[i][k], B[k][j]));
    let out = `<defs>${['#8b294f', '#8b5800'].map((color, k) => `<marker id="fcl-arrow-${id}-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`).join('')}</defs>`;
    const route = (k, my) => {
      const dim = focus !== null && focus !== k ? ' fcl-dim-route' : '';
      const leftLabel = k === 0 ? 222 : 326;
      const label = (x, y, value) => `<rect x="${x - 32}" y="${y - 23}" width="64" height="29" rx="7" class="fcl-number-back"/>${svgText(x, y, fmt(value), 'fcl-path-number')}`;
      return `<g class="fcl-route-${k + 1}${dim}" data-fcl-route="${k + 1}"><path class="fcl-path" d="M 105 275 L 273 ${my} M 327 ${my} L 495 275" marker-end="url(#fcl-arrow-${id}-${k})" data-fcl-middle="y${k + 1}"/>${label(193, leftLabel, A[i][k])}${label(407, leftLabel, B[k][j])}<circle cx="300" cy="${my}" r="26" class="fcl-node"/>${svgText(300, my + 8, sub('y', k + 1), 'fcl-node-label')}</g>`;
    };
    out += route(0, 222) + route(1, 326);
    [[80, sub('x', i + 1)], [520, sub('z', j + 1)]].forEach(([x, label]) => {
      out += `<circle cx="${x}" cy="275" r="26" class="fcl-end-node"/>${svgText(x, 283, label, 'fcl-node-label')}`;
    });
    if (!candidates) {
      out += svgText(680, 247, '經過 y₁ 或 y₂', 'fcl-path-prompt', 'start');
      out += svgText(680, 292, '每條路都有兩段關係', 'fcl-small', 'start');
    } else {
      [0, 1].forEach(k => {
        if (candidates.includes(k)) {
          out += svgText(630, 233 + k * 43, `${sub('y', k + 1)}：min(${fmt(A[i][k])}, ${fmt(B[k][j])}) = ${fmt(routeValues[k])}`, `fcl-calculation fcl-route-${k + 1}`, 'start');
        }
      });
      if (answer) out += svgText(630, 328, `max(${fmt(routeValues[0])}, ${fmt(routeValues[1])}) = ${fmt(C[i][j])}`, 'fcl-final-calculation', 'start');
    }
    return out;
  }

  function worked(id, i, j, options = {}) {
    const label = `計算 C 第${i + 1}行第${j + 1}列，從 x${i + 1} 經 y1 或 y2 到 z${j + 1}。` +
      (options.answer ? `兩路的最小值為 ${fmt(Math.min(A[i][0], B[0][j]))} 和 ${fmt(Math.min(A[i][1], B[1][j]))}，取最大值得 ${fmt(C[i][j])}。` : '');
    return svg(id, label, matrixStrip(i, j, options.revealed || 0, options.answer) + routeGraph(i, j, options.focus ?? null, options.candidates || null, options.answer, id), 365);
  }

  const single = svg('single', 'U 是 2行1列，數值0.8、0.4；V 是1行2列，數值0.6、0.9。逐對取 min，得到[[0.6,0.8],[0.4,0.4]]。',
    matrix([[0.8], [0.4]], 50, 34, 'U（2 × 1）', [], [], {cell: [0, 0], key: 'U'}) +
    compose(260, 143) +
    matrix([[0.6, 0.9]], 310, 34, 'V（1 × 2）', [], [], {cell: [0, 0], key: 'V'}) +
    svgText(607, 143, '=', 'fcl-operation') +
    matrix([[0.6, 0.8], [0.4, 0.4]], 690, 34, '配對結果（2 × 2）', [], [], {cell: [0, 0], key: 'UV'}) +
    svgText(550, 266, '左上格：min(0.8, 0.6) = 0.6', 'fcl-final-calculation') +
    svgText(550, 316, '一格只有一個候選值：max(0.6) = 0.6', 'fcl-small'), 350);

  function model() {
    let out = '';
    const boxes = [
      [30, 'X：起點', `${sub('x', 1)}、${sub('x', 2)}`],
      [435, 'Y：中間點', `${sub('y', 1)}、${sub('y', 2)}`],
      [840, 'Z：終點', `${sub('z', 1)}、${sub('z', 2)}`]
    ];
    boxes.forEach(([x, label, contents]) => { out += `<rect x="${x}" y="8" width="220" height="88" rx="12" class="fcl-domain"/>${svgText(x + 110, 38, label, 'fcl-domain-title')}${svgText(x + 110, 75, contents, 'fcl-domain-elements')}`; });
    out += svgText(340, 39, 'A', 'fcl-matrix-title') + svgText(340, 83, '→', 'fcl-operation');
    out += svgText(745, 39, 'B', 'fcl-matrix-title') + svgText(745, 83, '→', 'fcl-operation');
    out += matrix(A, 170, 147, 'A：行是 X，列是 Y', [sub('x', 1), sub('x', 2)], [sub('y', 1), sub('y', 2)], {key: 'A'});
    out += matrix(B, 670, 147, 'B：行是 Y，列是 Z', [sub('y', 1), sub('y', 2)], [sub('z', 1), sub('z', 2)], {key: 'B'});
    return svg('model', '三個集合各有兩個元素。A記錄X到Y的關係，B記錄Y到Z的關係。A的兩列與B的兩行都依y1、y2排列。', out, 350);
  }

  const frames = [
    {
      title: '先看列向量與行向量配對',
      description: '沿用上一頁的方法，另設兩個模糊集合 U、V，把隸屬度排成一列、一行。結果每格只配一對數，取 min（較小值）便算好；若再取 max（最大值），也只有這一個候選值。',
      graphic: single
    },
    {
      title: '現在把兩張關係表接起來',
      description: '現在 A、B 是兩張關係表：A 記 X 到 Y，B 記 Y 到 Z。兩表共用同一個 Y，次序都按 y₁、y₂；表內 0 到 1 表示關係程度，數值越大，關係越強。',
      graphic: model()
    },
    {
      title: '先找 C 左上格要算哪兩點',
      description: '把 A、B 合成後，C 記錄 X 經 Y 到 Z 的關係。左上格是 x₁ 到 z₁：取 A 第一行、B 第一列；沿圖看，經 y₁、經 y₂ 各有一條路。',
      graphic: worked('locate', 0, 0)
    },
    {
      title: '先算經過 y₁ 的這條路',
      description: '先沿 x₁ → y₁ → z₁ 走一次，兩段程度是 0.2 和 0.5。這條路的兩段都要用，按本課的 min 規則，整條路取較小的 0.2。',
      graphic: worked('route-one', 0, 0, {focus: 0, candidates: [0]})
    },
    {
      title: '再算經過 y₂ 的另一條路',
      description: '保持起點 x₁、終點 z₁ 不變，這次改經 y₂。兩段程度是 0.7 和 0.3，所以這條路取 min 得 0.3；前一條路的 0.2 先保留。',
      graphic: worked('route-two', 0, 0, {focus: 1, candidates: [0, 1]})
    },
    {
      title: '兩條路都算過，再取 max',
      description: '現在已有兩個候選值：經 y₁ 是 0.2，經 y₂ 是 0.3。它們都連到同一個終點；本課用 max 保留較強的一條，因此 C 左上格填 0.3。',
      graphic: worked('first-answer', 0, 0, {candidates: [0, 1], answer: true})
    },
    {
      title: '換終點，算右上格',
      description: '起點仍是 x₁，終點改成 z₂，所以保留 A 第一行，改取 B 第二列。仍經 y₁、y₂ 分別取 min，再比較這兩個候選值，右上格填 0.7。',
      graphic: worked('top-right', 0, 1, {revealed: 1, candidates: [0, 1], answer: true})
    },
    {
      title: '換起點，算左下格',
      description: '現在從 x₂ 到 z₁，改取 A 第二行、B 第一列。經 y₁ 取 min 得 0.5，經 y₂ 得 0.3；再取 max，左下格填 0.5。',
      graphic: worked('bottom-left', 1, 0, {revealed: 2, candidates: [0, 1], answer: true})
    },
    {
      title: '最後算右下格',
      description: '還差 x₂ 到 z₂：取 A 第二行、B 第二列。兩條路分別得到 0.6 和 0.4，再取 max 得 0.6；現在四個起點、終點配對都有結果。',
      graphic: worked('bottom-right', 1, 1, {revealed: 3, candidates: [0, 1], answer: true})
    },
    {
      title: '每格都做同一件事',
      description: 'm、n、p 分別是 X、Y、Z 的元素個數。中間的 n 必須對應同一個 Y，次序也相同；結果保留 X 的行數、Z 的列數。',
      graphic: svg('complete', 'A與B的最大最小合成為C=[[0.3,0.7],[0.5,0.6]]。同一路徑的兩段取min，不同中間路徑所得的候選值取max。', matrixStrip(null, null, 4, false) +
        svgText(329, 223, '(m × n)', 'fcl-summary-line') + compose(430, 223) +
        svgText(528, 223, '(n × p)', 'fcl-summary-line') + svgText(647, 223, '→', 'fcl-summary-line') +
        svgText(763, 223, '(m × p)', 'fcl-summary-line') +
        svgText(550, 277, '同一條路的兩段 → min', 'fcl-summary-line') +
        svgText(550, 331, '各條路的候選值 → max', 'fcl-summary-line'), 360)
    }
  ];

  const html = `<section class="page supplement fuzzy-bridge fuzzy-composition-lesson" data-page="128" data-fb-page="128" aria-labelledby="page-title">
    <header class="supp-heading"><h1 id="page-title">${title}</h1></header>
    <div class="fcl-frames">${frames.map((frame, index) => `<section class="fcl-frame" data-fb-frame="${index}" data-fb-title="${esc(frame.title)}"${index ? ' hidden' : ''}>
      <div class="fcl-copy"><h2>${frame.title}</h2><p data-fb-description>${frame.description}</p></div>
      <div class="fcl-figure" role="region" aria-label="圖解；窄畫面可左右滑動" tabindex="0">${frame.graphic}</div>
    </section>`).join('')}</div>
    <div data-fb-controls></div>
  </section>`;
  const text = [title, 'U=[[0.8],[0.4]]，V=[[0.6,0.9]]；逐對取min得[[0.6,0.8],[0.4,0.4]]。',
    'A=[[0.2,0.7],[0.6,0.4]]，B=[[0.5,0.8],[0.3,0.9]]。C=A∘B，採最大—最小合成。',
    ...frames.map((frame, index) => `${index + 1}. ${frame.title}\n${frame.description}`),
    'C第1行第1列=max(min(0.2,0.5),min(0.7,0.3))=max(0.2,0.3)=0.3。',
    'C第1行第2列=max(min(0.2,0.8),min(0.7,0.9))=max(0.2,0.7)=0.7。',
    'C第2行第1列=max(min(0.6,0.5),min(0.4,0.3))=max(0.5,0.3)=0.5。',
    'C第2行第2列=max(min(0.6,0.8),min(0.4,0.9))=max(0.6,0.4)=0.6。',
    'C=[[0.3,0.7],[0.5,0.6]]。'
  ].join('\n');
  window.COURSE_SUPPLEMENTS = [...(window.COURSE_SUPPLEMENTS || []), {
    chapter: '03', page: 128, number: 19, after: 96, section: 85,
    slug: 'fuzzy-composition-lesson.html', title, text, html, images: [], kind: 'fuzzy-composition-lesson'
  }];
})();
