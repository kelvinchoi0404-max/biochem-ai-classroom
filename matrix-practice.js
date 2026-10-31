(function () {
  'use strict';
  const title = '矩陣入門：堂上練習';
  const matrix = (rows, label) => '<div class="mp-matrix"><table aria-label="' + label + '"><tbody>' + rows.map(row => '<tr>' + row.map(value => '<td>' + value + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const a = [['0.2', '0.7', '0.4'], ['1', '0', '0.6']];
  const b = [['0.5', '0.8'], ['0.3', '0.9'], ['0.7', '0.1']];
  const html = `<section class="page supplement matrix-practice" data-page="126" aria-labelledby="page-title">
    <header class="supp-heading"><h1 id="page-title">${title}</h1></header>
    <p class="mp-intro">在作業本作答，完成後逐題核對。<span>第1–5題必做，第6題選做。</span></p>
    <div class="mp-given" aria-label="以下六題共用的矩陣">
      <div class="mp-given-item"><span class="mp-symbol">A =</span>${matrix(a, '矩陣 A：第一行 0.2、0.7、0.4；第二行 1、0、0.6')}</div>
      <div class="mp-given-item"><span class="mp-symbol">B =</span>${matrix(b, '矩陣 B：第一行 0.5、0.8；第二行 0.3、0.9；第三行 0.7、0.1')}</div>
    </div>
    <div class="mp-questions">
      <section class="mp-question">
        <h2><span class="mp-number">1</span> A 是幾行幾列？寫出大小。</h2>
        <div class="mp-answer" data-matrix-practice-answer="1"><p>2行3列，大小為 <strong class="mp-math">2 × 3</strong>。</p></div>
      </section>
      <section class="mp-question">
        <h2><span class="mp-number">2</span> 寫出 <span class="mp-math">a<sub>12</sub>、a<sub>23</sub>、a<sub>21</sub></span> 的值。</h2>
        <div class="mp-answer" data-matrix-practice-answer="2"><p class="mp-math">a<sub>12</sub> = <strong>0.7</strong>，a<sub>23</sub> = <strong>0.6</strong>，a<sub>21</sub> = <strong>1</strong></p></div>
      </section>
      <section class="mp-question">
        <h2><span class="mp-number">3</span> 依序寫出 A 第2行、B 第1列的數值。</h2>
        <div class="mp-answer mp-vectors" data-matrix-practice-answer="3">
          <div class="mp-equation"><span>A 第2行：</span>${matrix([['1', '0', '0.6']], 'A 的第2行：1、0、0.6')}</div>
          <div class="mp-equation"><span>B 第1列：</span>${matrix([['0.5'], ['0.3'], ['0.7']], 'B 的第1列：0.5、0.3、0.7')}</div>
        </div>
      </section>
      <section class="mp-question">
        <h2><span class="mp-number">4</span> 寫出 <span class="mp-math">A<sup>T</sup></span>，並註明大小。</h2>
        <div class="mp-answer mp-equation mp-transpose" data-matrix-practice-answer="4">
          <span class="mp-symbol">A<sup>T</sup> =</span>${matrix([['0.2', '1'], ['0.7', '0'], ['0.4', '0.6']], 'A 的轉置：第一行 0.2、1；第二行 0.7、0；第三行 0.4、0.6')}
          <span>大小為 <strong class="mp-math">3 × 2</strong>。</span>
        </div>
      </section>
      <section class="mp-question">
        <h2><span class="mp-number">5</span> 判斷下列矩陣能否作最大—最小合成。</h2>
        <p class="mp-prompt"><span class="mp-math">A ∘ B</span>；<span class="mp-math">A ∘ A</span>。若可合成，只寫結果矩陣的大小。</p>
        <div class="mp-answer" data-matrix-practice-answer="5">
          <p><span class="mp-math">A ∘ B</span> 可合成，結果為 <strong class="mp-math">2 × 2</strong>。</p>
          <p><span class="mp-math">A ∘ A</span> 不能合成：前者3列，後者2行，<strong class="mp-math">3 ≠ 2</strong>。</p>
        </div>
      </section>
      <section class="mp-question mp-optional">
        <h2><span class="mp-number">6</span> <span class="mp-optional-label">選做</span> 求 <span class="mp-math">(A ∘ B)<sub>11</sub></span>。</h2>
        <p class="mp-prompt">將 A 第1行與 B 第1列配對，各取 min，再取 max。</p>
        <div class="mp-answer" data-matrix-practice-answer="6">
          <p class="mp-calculation"><span>max(</span><wbr><span>min(0.2, 0.5), </span><wbr><span>min(0.7, 0.3), </span><wbr><span>min(0.4, 0.7))</span></p>
          <p class="mp-math">= max(0.2, 0.3, 0.4) = <strong>0.4</strong></p>
        </div>
      </section>
    </div>
  </section>`;
  const text = [title,
    '在作業本作答，完成後逐題核對。第1–5題必做，第6題選做。',
    '六題共用 A=[[0.2,0.7,0.4],[1,0,0.6]]，B=[[0.5,0.8],[0.3,0.9],[0.7,0.1]]。',
    '第1題：A是幾行幾列？寫出大小。答案：2行3列，大小2×3。',
    '第2題：寫出a₁₂、a₂₃、a₂₁的值。答案：a₁₂=0.7，a₂₃=0.6，a₂₁=1。',
    '第3題：依序寫出A第2行、B第1列的數值。答案：A第2行為[1,0,0.6]；B第1列為[[0.5],[0.3],[0.7]]。',
    '第4題：寫出Aᵀ並註明大小。答案：Aᵀ=[[0.2,1],[0.7,0],[0.4,0.6]]，大小3×2。',
    '第5題：判斷下列矩陣能否作最大—最小合成：A∘B及A∘A。若可合成，只寫結果矩陣的大小。答案：A∘B可合成，結果2×2；A∘A不能合成，因前者3列不等於後者2行，即3≠2。',
    '第6題（選做）：使用最大—最小合成求(A∘B)₁₁。將A第1行與B第1列配對，各取min，再取max。答案：max(min(0.2,0.5),min(0.7,0.3),min(0.4,0.7))=max(0.2,0.3,0.4)=0.4。'
  ].join('\n');
  window.COURSE_SUPPLEMENTS = [...(window.COURSE_SUPPLEMENTS || []), {
    chapter: '03', page: 126, number: 17, after: 95, section: 85,
    slug: 'matrix-practice.html', title, text, html, images: [], kind: 'matrix-practice'
  }];
  window.COURSE_EXERCISE_PLANS = window.COURSE_EXERCISE_PLANS || {};
  window.COURSE_EXERCISE_PLANS['03/126'] = {
    instruction: '第1–5題必做，第6題選做。在作業本作答，完成後逐題核對。',
    steps: Array.from({length: 6}, (_, index) => [{selector: '[data-matrix-practice-answer="' + (index + 1) + '"]'}]),
    stepLabels: ['核對第1題', '核對第2題', '核對第3題', '核對第4題', '核對第5題', '核對第6題'],
    footerAdvance: true
  };
})();
