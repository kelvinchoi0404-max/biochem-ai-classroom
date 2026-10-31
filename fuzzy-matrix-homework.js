(function () {
  'use strict';
  const title = '模糊集合與矩陣：基礎作業';
  const blank = '<span class="fmh-blank" aria-label="填空">＿＿</span>';
  const matrix = (rows, label) => `<span class="fmh-matrix"><table aria-label="${label}"><tbody>${rows.map(row => '<tr>' + row.map(value => `<td>${value}</td>`).join('') + '</tr>').join('')}</tbody></table></span>`;
  const question = (number, heading, body) => `<section class="fmh-question" data-fmh-question="${number}"><h3><span>${number}</span>${heading}</h3>${body}</section>`;
  const pair = (left, right) => `<div class="fmh-questions">${left}${right}</div>`;
  const vectors = `<div class="fmh-given"><div class="fmh-equation">u = ${matrix([['0.3'], ['0.8']], '列向量 u：上格0.3，下格0.8')}</div><div class="fmh-equation">v = ${matrix([['0.4', '0.9']], '行向量 v：左格0.4，右格0.9')}</div></div>`;
  const relations = `<div class="fmh-given"><div class="fmh-equation">R = ${matrix([['0.4', '0.8'], ['0.7', '0.3']], 'R：第一行0.4、0.8；第二行0.7、0.3')}</div><div class="fmh-equation">S = ${matrix([['0.6', '0.2'], ['0.5', '0.9']], 'S：第一行0.6、0.2；第二行0.5、0.9')}</div></div>`;
  const frames = [
    `<h2>隸屬度與集合運算</h2><p>論域 X = {a, b, c}，A、B 的隸屬度如下。</p>
    <table class="fmh-table fmh-given-table" aria-label="A與B的隸屬度"><thead><tr><th scope="col">元素</th><th scope="col">a</th><th scope="col">b</th><th scope="col">c</th></tr></thead><tbody><tr><th scope="row">μ<sub>A</sub></th><td>0.2</td><td>0.7</td><td>1</td></tr><tr><th scope="row">μ<sub>B</sub></th><td>0.6</td><td>0.4</td><td>0.8</td></tr></tbody></table>
    ${pair(
      question(1, '讀表填空。', `<p>μ<sub>A</sub>(a) = ${blank}</p><p>μ<sub>A</sub>(c) = ${blank}</p><p>A 中隸屬度最大的元素是 ${blank}。</p>`),
      question(2, '求交集、並集和 A 的補集。', `<table class="fmh-table" aria-label="填寫交並補的隸屬度"><thead><tr><th scope="col">元素</th><th scope="col">A ∩ B</th><th scope="col">A ∪ B</th><th scope="col">A<sup>c</sup></th></tr></thead><tbody>${['a', 'b', 'c'].map(value => `<tr><th scope="row">${value}</th><td>${blank}</td><td>${blank}</td><td>${blank}</td></tr>`).join('')}</tbody></table><p class="fmh-hint">交取 min，並取 max，補算 1 − 隸屬度。</p>`)
    )}`,
    `<h2>讀矩陣與計算 min／max</h2>${pair(
      question(3, '讀出 M 的大小、元素和行列。', `<div class="fmh-equation fmh-center">M = ${matrix([['0.2', '0.7'], ['0.5', '0.9']], 'M：第一行0.2、0.7；第二行0.5、0.9')}</div><p>M 有 ${blank} 行、${blank} 列。</p><p>大小：${blank} × ${blank}</p><p>m<sub>12</sub> = ${blank}，m<sub>21</sub> = ${blank}</p><p>依序寫出第2行、第1列的數值。</p>`),
      question(4, '計算 min 和 max。', `<div class="fmh-calculations"><p>min(0.6, 0.3) = ${blank}</p><p>min(0.8, 0.5) = ${blank}</p><p>max(0.2, 0.5, 0.4) = ${blank}</p><p>max(min(0.7, 0.3), 0.5) = ${blank}</p></div><p class="fmh-hint">min 取最小值，max 取最大值；最後一式先算括號內的 min。</p>`)
    )}`,
    `<h2>關係表與合成第一格</h2>${pair(
      question(5, '把兩組隸屬度排成關係表 H。', `${vectors}<p>每格取對應兩數的 min：</p><p class="fmh-formula">h<sub>ij</sub> = min(u<sub>i</sub>, v<sub>j</sub>)</p><table class="fmh-table" aria-label="填寫模糊關係表H"><thead><tr><th scope="col">H</th><th scope="col">v<sub>1</sub> = 0.4</th><th scope="col">v<sub>2</sub> = 0.9</th></tr></thead><tbody><tr><th scope="row">u<sub>1</sub> = 0.3</th><td>${blank}</td><td>${blank}</td></tr><tr><th scope="row">u<sub>2</sub> = 0.8</th><td>${blank}</td><td>${blank}</td></tr></tbody></table>`),
      question(6, '設 C = R ∘ S，先算 c₁₁。', `${relations}<p>R 的列數 = ${blank}，S 的行數 = ${blank}。</p><p>C 的大小是 ${blank} × ${blank}。</p><div class="fmh-calculations"><p>① min(0.4, 0.6) = ${blank}</p><p>② min(0.8, 0.5) = ${blank}</p><p>③ c<sub>11</sub> = max(${blank}, ${blank}) = ${blank}</p></div><p class="fmh-hint">第1行配第1列；①、②的結果放入③。</p>`)
    )}`,
    `<h2>完整合成與矩陣填空</h2>${pair(
      question(7, '完成 C = R ∘ S，並寫一句理由。', `${relations}<div class="fmh-equation fmh-center">C = ${matrix([[blank, blank], [blank, blank]], '填寫2行2列的合成矩陣C')}</div><p>其餘每格都先寫兩個 min，再取 max。</p><p>算 c<sub>11</sub> 得到兩個候選值後，為甚麼最後取 max？用一句話說明。</p>`),
      question(8, '按下標補齊矩陣 P。', `<div class="fmh-equation fmh-center">P = ${matrix([['0.3', 'x', '0.8'], ['y', '0.5', 'z']], 'P：第一行0.3、x、0.8；第二行y、0.5、z')}</div><p>已知 p<sub>12</sub> = 0.6，p<sub>21</sub> = 0.4，<br>p<sub>23</sub> = 0.9。</p><p>x = ${blank}，y = ${blank}，z = ${blank}</p><p>寫出完整的 P，並註明大小。</p><p class="fmh-hint">下標第一個數看行，第二個數看列。</p>`)
    )}`
  ];
  const html = `<section class="page supplement fuzzy-bridge fuzzy-matrix-homework" data-page="129" data-fb-page="129" aria-labelledby="page-title"><header class="supp-heading"><h1 id="page-title">${title}</h1></header><p class="fmh-instruction">在作業本按題號作答，保留計算過程。</p><div class="fmh-frames">${frames.map((content, index) => `<section class="fmh-frame" data-fb-frame="${index}"${index ? ' hidden' : ''}>${content}</section>`).join('')}</div><div data-fb-controls></div></section>`;
  const text = [title, '在作業本按題號作答，保留計算過程。', ...frames.map(frame => frame.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())].join('\n');
  window.COURSE_SUPPLEMENTS = [...(window.COURSE_SUPPLEMENTS || []), {
    chapter: '03', page: 129, number: 20, after: 96, section: 85,
    slug: 'fuzzy-matrix-homework.html', title, text, html, images: [], kind: 'fuzzy-matrix-homework'
  }];
})();
