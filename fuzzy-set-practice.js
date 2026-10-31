(function () {
  'use strict';
  const title = '例：模糊集合的聯集、交集與補集';
  const pair = (i, value) => '<span class="fsp-pair">(x<sub>' + i + '</sub>, ' + value + ')</span>';
  const set = values => '{' + values.map((value, i) => pair(i + 1, value)).join(', ') + '}';
  const a = set(['0.6', '0.5', '1', '0.4']);
  const b = set(['0.5', '0.6', '0.3', '0.4']);
  const union = set(['0.6', '0.6', '1', '0.4']);
  const intersection = set(['0.5', '0.5', '0.3', '0.4']);
  const complement = set(['0.4', '0.5', '0', '0.6']);
  const html = `<section class="page supplement fuzzy-set-practice" data-page="123" aria-labelledby="page-title">
    <header class="supp-heading"><h1 id="page-title">${title}</h1></header>
    <div class="fsp-question">
      <p>設論域 <span class="fsp-math">X = {x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub>, x<sub>4</sub>}</span> 為一個4人集合。</p>
      <p><span class="fsp-label">A 表示「高個子」：</span><span class="fsp-math">A = ${a}</span></p>
      <p><span class="fsp-label">B 表示「胖子」：</span><span class="fsp-math">B = ${b}</span></p>
      <p class="fsp-task">分別求模糊集合「高或胖」、「又高又胖」、「個子不高」。</p>
    </div>
    <div class="fsp-solutions">
      <section class="fsp-answer" data-fuzzy-answer="union">
        <h2>「高或胖」 <span>聯集：取較大值</span></h2>
        <p class="fsp-math fsp-expansion">A ∪ B = ${set(['0.6 ∨ 0.5', '0.5 ∨ 0.6', '1 ∨ 0.3', '0.4 ∨ 0.4'])}</p>
        <p class="fsp-math fsp-result">= ${union}</p>
      </section>
      <section class="fsp-answer" data-fuzzy-answer="intersection">
        <h2>「又高又胖」 <span>交集：取較小值</span></h2>
        <p class="fsp-math">A ∩ B = ${intersection}</p>
      </section>
      <section class="fsp-answer" data-fuzzy-answer="complement">
        <h2>「個子不高」 <span>補集：1 − 隸屬度</span></h2>
        <p class="fsp-math">Ā = ${complement}</p>
      </section>
    </div>
  </section>`;
  const text = [title,
    '設論域 X={x₁,x₂,x₃,x₄} 為一個4人集合。X上的模糊集合A表示「高個子」，B表示「胖子」。',
    'A={(x₁,0.6),(x₂,0.5),(x₃,1),(x₄,0.4)}。B={(x₁,0.5),(x₂,0.6),(x₃,0.3),(x₄,0.4)}。',
    '分別求模糊集合「高或胖」、「又高又胖」、「個子不高」。',
    '「高或胖」：A∪B={(x₁,0.6∨0.5),(x₂,0.5∨0.6),(x₃,1∨0.3),(x₄,0.4∨0.4)}={(x₁,0.6),(x₂,0.6),(x₃,1),(x₄,0.4)}。',
    '「又高又胖」：A∩B={(x₁,0.5),(x₂,0.5),(x₃,0.3),(x₄,0.4)}。',
    '「個子不高」：Ā={(x₁,0.4),(x₂,0.5),(x₃,0),(x₄,0.6)}。'
  ].join('\n');
  window.COURSE_SUPPLEMENTS = [...(window.COURSE_SUPPLEMENTS || []), {
    chapter: '03', page: 123, number: 14, after: 93, section: 85,
    slug: 'fuzzy-set-practice.html', title, text, html, images: [], kind: 'fuzzy-set-practice'
  }];
  window.COURSE_EXERCISE_PLANS = window.COURSE_EXERCISE_PLANS || {};
  window.COURSE_EXERCISE_PLANS['03/123'] = {
    instruction: '先自行作答，再依次核對聯集、交集與補集。',
    steps: [
      [{selector: '[data-fuzzy-answer="union"]'}],
      [{selector: '[data-fuzzy-answer="intersection"]'}],
      [{selector: '[data-fuzzy-answer="complement"]'}]
    ],
    stepLabels: ['顯示「高或胖」', '顯示「又高又胖」', '顯示「個子不高」'],
    footerAdvance: true
  };
})();
