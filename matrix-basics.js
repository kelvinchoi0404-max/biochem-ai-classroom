(function () {
  'use strict';
  const title = '矩陣入門②：行列與計算';
  const html = `<section class="page supplement matrix-basics" data-page="125" aria-labelledby="page-title">
    <header class="supp-heading"><h1 id="page-title">${title}</h1></header>
    <p class="mb-intro">矩陣是按行、列排列的數表。本節的模糊矩陣以 0 到 1 表示隸屬度，各行不必合計為 1。</p>
    <div class="mb-grid">
      <section class="mb-card mb-reading">
        <h2>① 行、列與元素</h2>
        <div class="mb-reading-table"><span class="mb-math">M =</span><table aria-label="M，2行3列；第2行第3列為0.4"><thead><tr><th></th><th>第1列</th><th>第2列</th><th class="mb-location">第3列 ↓</th></tr></thead><tbody><tr><th>第1行 →</th><td>0.3</td><td>0.7</td><td>0.2</td></tr><tr><th class="mb-location">第2行 →</th><td>1</td><td>0</td><td class="mb-element">0.4</td></tr></tbody></table></div>
        <p><strong>大小記為「行數 × 列數」：</strong><span class="mb-math">2 × 3</span> 表示2行3列。</p>
        <p><span class="mb-math">m<sub>ij</sub></span> 表示第 <strong>i</strong> 行、第 <strong>j</strong> 列的元素；此處 <span class="mb-math">m<sub>23</sub> = 0.4</span>。</p>
      </section>
      <section class="mb-card" data-matrix-answer="transpose">
        <h2>② 行向量、列向量與轉置</h2>
        <div class="mb-vector-demo"><div><span class="mb-math">a = [0.2　0.6　0.9]</span><small>行向量：1 × 3</small></div><span class="mb-turn">轉置 →</span><div class="mb-column-vector"><span class="mb-math">a<sup>T</sup> =</span><span class="mb-bracket"><span>0.2</span><span>0.6</span><span>0.9</span></span><small>列向量：3 × 1</small></div></div>
        <p><strong>轉置</strong>把行與列互換，元素的值不變。</p>
        <p class="mb-note">右上角的 T 表示轉置；m × n 矩陣轉置後的大小為 n × m。</p>
      </section>
      <section class="mb-card" data-matrix-answer="dimensions">
        <h2>③ 合成矩陣的大小</h2>
        <div class="mb-dimensions"><span>R<sub>1</sub><small><b>4</b> × <em>3</em></small></span><span class="mb-op">∘</span><span>R<sub>2</sub><small><em>3</em> × <b>2</b></small></span><span class="mb-op">→</span><span>T<small><b>4</b> × <b>2</b></small></span></div>
        <p>前一個矩陣的<strong>列數</strong>須等於後一個矩陣的<strong>行數</strong>。</p>
        <p>結果保留前者的行數、後者的列數：<strong>4行2列</strong>。</p>
      </section>
      <section class="mb-card" data-matrix-answer="calculation">
        <h2>④ 最大—最小合成</h2>
        <p class="mb-pairing">行向量 <span class="mb-math">[0.3, 0.7, 0.2]</span> 與 <span class="mb-math">a<sup>T</sup></span> 逐項配對，先取 min。</p>
        <div class="mb-minima"><span>min(0.3, 0.2)<b>0.2</b></span><span>min(0.7, 0.6)<b>0.6</b></span><span>min(0.2, 0.9)<b>0.2</b></span></div>
        <p class="mb-max">再取最大值：<span class="mb-math">max(0.2, 0.6, 0.2) = <strong>0.6</strong></span></p>
      </section>
    </div>
  </section>`;
  const text = [title, '矩陣是按行、列排列的數表。本節的模糊矩陣以0到1表示隸屬度，各行不必合計為1。',
    '行、列與元素。M=[[0.3,0.7,0.2],[1,0,0.4]]；大小記為行數×列數，2×3表示2行3列。mᵢⱼ表示第i行第j列的元素；此處m₂₃=0.4。',
    '行向量a=[0.2,0.6,0.9]大小1×3，轉置aᵀ=[[0.2],[0.6],[0.9]]是3×1列向量。轉置把行列互換，元素的值不變。右上角T表示轉置；m×n矩陣轉置後的大小為n×m。',
    '合成矩陣的大小。R₁(4×3)∘R₂(3×2)得到T(4×2)。前一個矩陣的列數須等於後一個矩陣的行數；結果保留前者行數、後者列數。',
    '本節採最大—最小合成。行向量[0.3,0.7,0.2]與aᵀ=[0.2,0.6,0.9]ᵀ逐項配對，先取min：min(0.3,0.2)=0.2，min(0.7,0.6)=0.6，min(0.2,0.9)=0.2；再取max(0.2,0.6,0.2)=0.6。',
  ].join('\n');
  window.COURSE_SUPPLEMENTS = [...(window.COURSE_SUPPLEMENTS || []), {
    chapter: '03', page: 125, number: 16, after: 95, section: 85,
    slug: 'matrix-basics.html', title, text, html, images: [], kind: 'matrix-basics'
  }];
  window.COURSE_EXERCISE_PLANS = window.COURSE_EXERCISE_PLANS || {};
  window.COURSE_EXERCISE_PLANS['03/125'] = {
    instruction: '本節的模糊合成採用最大—最小法：一行與一列逐項取 min，再取 max。',
    steps: [[{selector: '[data-matrix-answer="transpose"]'}], [{selector: '[data-matrix-answer="dimensions"]'}], [{selector: '[data-matrix-answer="calculation"]'}]],
    stepLabels: ['向量與轉置', '合成矩陣的大小', '最大—最小合成'], footerAdvance: true
  };
})();
