(function () {
  'use strict';
  const title = '例5.10：模糊關係的合成';
  const matrix = (rows, name) => '<span class="frp-matrix"><table aria-label="' + name + '"><tbody>' +
    rows.map((row, i) => '<tr data-matrix-row="' + (i + 1) + '">' + row.map((value, j) =>
      '<td data-matrix-col="' + (j + 1) + '">' + value + '</td>').join('') + '</tr>').join('') + '</tbody></table></span>';
  const r1 = matrix([[0.3, 0.7, 0.2], [1, 0, 0.4], [0, 0.5, 1], [0.6, 0.7, 0.8]], 'R1，4行3列');
  const r2 = matrix([[0.2, 0.8], [0.6, 0.4], [0.9, 0.1]], 'R2，3行2列');
  const result = matrix([[0.6, 0.4], [0.4, 0.8], [0.9, 0.4], [0.8, 0.6]], '合成結果T，4行2列');
  const html = `<section class="page supplement fuzzy-relation-practice" data-page="124" aria-labelledby="page-title">
    <header class="supp-heading"><h1 id="page-title">${title}</h1></header>
    <p class="frp-prompt">設有如下兩個模糊關係，求 <span class="frp-math">R<sub>1</sub> ∘ R<sub>2</sub></span>。</p>
    <div class="frp-inputs">
      <div class="frp-equation frp-r1"><span class="frp-math">R<sub>1</sub> =</span>${r1}</div>
      <div class="frp-equation frp-r2"><span class="frp-math">R<sub>2</sub> =</span>${r2}</div>
    </div>
    <p class="frp-rule"><span class="frp-math">T = R<sub>1</sub> ∘ R<sub>2</sub></span><span>∧ 取小，∨ 取大：先逐項取小，再取最大值。</span></p>
    <div class="frp-work">
      <div class="frp-calculations">
        <section class="frp-step" data-relation-answer="first">
          <h2>第1行 × 第1列</h2>
          <p class="frp-math">t<sub>11</sub> = <span>(0.3 ∧ 0.2)</span> ∨ <span>(0.7 ∧ 0.6)</span> ∨ <span>(0.2 ∧ 0.9)</span></p>
          <p class="frp-math frp-result-line">= 0.2 ∨ 0.6 ∨ 0.2 = <strong>0.6</strong></p>
        </section>
        <section class="frp-step" data-relation-answer="second">
          <h2>第2行 × 第1列</h2>
          <p class="frp-math">t<sub>21</sub> = <span>(1 ∧ 0.2)</span> ∨ <span>(0 ∧ 0.6)</span> ∨ <span>(0.4 ∧ 0.9)</span></p>
          <p class="frp-math frp-result-line">= 0.2 ∨ 0 ∨ 0.4 = <strong>0.4</strong></p>
        </section>
      </div>
      <section class="frp-final" data-relation-answer="result">
        <h2>合成結果</h2>
        <div class="frp-equation"><span class="frp-math">T =</span>${result}</div>
      </section>
    </div>
  </section>`;
  const text = [title, '設有如下兩個模糊關係，求R₁∘R₂。',
    'R₁=[[0.3,0.7,0.2],[1,0,0.4],[0,0.5,1],[0.6,0.7,0.8]]；R₂=[[0.2,0.8],[0.6,0.4],[0.9,0.1]]。',
    'T=R₁∘R₂，採最大最小合成：∧取小，∨取大。',
    't₁₁=(0.3∧0.2)∨(0.7∧0.6)∨(0.2∧0.9)=0.2∨0.6∨0.2=0.6。',
    't₂₁=(1∧0.2)∨(0∧0.6)∨(0.4∧0.9)=0.2∨0∨0.4=0.4。',
    'T=[[0.6,0.4],[0.4,0.8],[0.9,0.4],[0.8,0.6]]。'
  ].join('\n');
  window.COURSE_SUPPLEMENTS = [...(window.COURSE_SUPPLEMENTS || []), {
    chapter: '03', page: 124, number: 15, after: 98, section: 85,
    slug: 'fuzzy-relation-practice.html', title, text, html, images: [], kind: 'fuzzy-relation-practice'
  }];
  window.COURSE_EXERCISE_PLANS = window.COURSE_EXERCISE_PLANS || {};
  window.COURSE_EXERCISE_PLANS['03/124'] = {
    instruction: '依次查看第一格、第二行第一格及完整合成矩陣。',
    steps: [
      [{selector: '[data-relation-answer="first"]'}],
      [{selector: '[data-relation-answer="second"]'}],
      [{selector: '[data-relation-answer="result"]'}]
    ],
    stepLabels: ['顯示第一格', '顯示第二行第一格', '顯示完整矩陣'], footerAdvance: true
  };
})();
