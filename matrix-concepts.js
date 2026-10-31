(function () {
  'use strict';
  const title = "矩陣入門①：從函數到圖形變換";
  const frames = [
  {
    "scene": "doubling",
    "caption": "先讀懂集合 X、集合 Y 和箭頭",
    "detail": "X={1,2,3} 列出這次可以選的數，Y={2,4,6,8} 列出允許的結果。按「乘2」計算，1→2 就表示 1×2=2；另外兩條箭頭表示 2→4、3→6。Y 裡的 8 可以保留，這次沒有算到它。",
    "visual": "X={1,2,3}, Y={2,4,6,8}；三條箭頭分次畫出，8沒有箭頭。規則乘2保持可見。",
    "bridge": "先看懂一個數到另一個數的對應，稍後再把輸入換成一組坐標。"
  },
  {
    "scene": "mapping-rule",
    "caption": "每個輸入都有唯一結果，叫函數，也叫映射",
    "detail": "把乘二規則取名為 f。X 裡的每個數都連到唯一的結果，因此 f 是函數，也叫映射。用右邊的按鈕比較：若有輸入沒有結果，或同一輸入連到兩個不同結果，就不符合要求；不同輸入共用一個結果則可以。",
    "visual": "可切三個例子：X={-1,0,1},Y={0,1,2}；valid -1→1,0→0,1→1，different inputs same output valid；double另加1→2，invalid；missing移除0的箭頭，invalid。同步一句普通說明，不能只用綠紅色。",
    "bridge": "上一幅圖記下了三次乘二的計算；現在看這些箭頭共同符合甚麼條件。"
  },
  {
    "scene": "notation",
    "caption": "f：X → Y、x ↦ 2x，分別在說甚麼？",
    "detail": "f：X → Y 說明輸入從 X 選，結果在 Y 中。小寫 x 代表選到的數；x ↦ 2x 說明算法，其中 2x 就是 2×x。f(1)=2 則記下一次實際計算：把 1 交給 f，得到 2。",
    "visual": "回到step0同組數與箭頭。X標輸入從這裡選，Y標結果落在這裡；f規則、x↦2x與f(1)=2分層標示。",
    "bridge": "數、箭頭和乘二規則都沒有改，這一步把同一件事寫成數學符號。"
  },
  {
    "scene": "number-line",
    "caption": "把乘二規則用到整條數線",
    "detail": "把輸入和結果的範圍都擴大到實數 ℝ，也就是數線上的所有數。上面選原來的數 x，下面找結果 2x：1 對應 2，−1 對應 −2，0 仍是 0。兩條數線刻度相同，可以看出結果離 0 的距離變成兩倍。",
    "visual": "兩條平行數線標原位置x／新位置f(x)=2x，滑桿-2..2每格.5，點從原位置連向新位置。不要使用y=2x平面圖，避免把(輸入,輸出)數對與後面坐標混淆。可註f:ℝ→ℝ，ℝ是全體實數。",
    "bridge": "乘二也能算負數、0 和小數，所以現在不再只從 1、2、3 中選數。"
  },
  {
    "scene": "plane-task",
    "caption": "從數線上的位置，走到平面上的位置",
    "detail": "橫線是 x 軸，直線是 y 軸，交點 O=(0,0)。點 (x,y) 的第一個數是橫坐標，第二個數是縱坐標。現在把三角形每個頂點的 x 乘2、y 保持不變：點離 y 軸的距離加倍，圖形就橫向拉長。",
    "visual": "同一坐標平面上三角形(1,1),(1,2),(2,1)與橫向拉長後輪廓，先原圖再動畫拉寬；明顯水平×2／高度不變。",
    "bridge": "數線上一個數就能定位；平面上的點，還要交代它有多高。"
  },
  {
    "scene": "point-move",
    "caption": "挑出 P(1,2)，算清楚它怎樣移動",
    "detail": "P 是點的名字。P(1,2) 表示從 O 向右1格、向上2格。把橫坐標1乘2得到2，縱坐標仍是2，所以新位置是 (2,2)。對照兩個點：它只向右移，沒有升高，正好符合剛才的拉長規則。",
    "visual": "x/y軸，原點到P水平1及垂直2分量，P沿水平從(1,2)到(2,2)。原點位置保留淡點，不把坐標標成函數圖上輸入輸出。",
    "bridge": "三角形是由點組成的；先算一個點，再把同樣做法用到其他點。"
  },
  {
    "scene": "vector",
    "caption": "把同一個點的兩個坐標合成一個向量",
    "detail": "把橫坐標1寫在上面、縱坐標2寫在下面，加上括號，這種直排的一組數叫列向量，取名為 v。兩格也表示從 O 指向 P 的箭頭：橫向走1、縱向走2。次序不能隨意換；上2、下1會表示另一個位置 (2,1)。",
    "visual": "(1,2)的兩個數移到列向量[1;2]；水平酒紅、垂直金色對應箭頭；明示上x下y，上下對調，就會變成另一個向量。",
    "bridge": "1 和 2 都屬於 P，接下來需要把這整組坐標一起放進算式。"
  },
  {
    "scene": "vector-function",
    "caption": "函數的輸入，也可以是一整個向量",
    "detail": "f 處理一個數；現在用 T 處理一整組坐標。T 的規則是「第一格乘2，第二格保留」，所以 [1;2] 變成 [2;2]。結果叫 v′（讀作 v 撇），表示新向量。每組輸入仍有唯一一組結果，因此 T 也是函數，也叫映射。",
    "visual": "小行1→f乘2→2，主行v=[1;2]→T橫向乘2→v′=[2;2]。輸入是一整組，不是同一輸入得到兩個不確定結果。T:ℝ²→ℝ²，ℝ²表示平面上所有的坐標對(x,y)。",
    "bridge": "v 已把 P 的兩個坐標放在一起，現在把整組坐標交給規則計算。"
  },
  {
    "scene": "coordinate-rules",
    "caption": "兩條公式合起來，才是 T 的完整規則",
    "detail": "原坐標叫 x、y，新坐標叫 x′、y′，撇號表示計算後的新值。第一行 x′=2x 算新橫坐標，第二行 y′=y 算新縱坐標。代入 P 的 x=1、y=2，就得到 x′=2、y′=2，正是上一幅圖的結果。",
    "visual": "同一P水平/垂直分量對應兩行x′=2x,y′=y，輸入(1,2)和新點(2,2)不換例子。",
    "bridge": "已經算過 P；為了也能算其他點，現在用 x、y 代替某一次選到的坐標。"
  },
  {
    "scene": "zero-coefficients",
    "caption": "把每行對 x、y 的用法都寫出來",
    "detail": "x′=2x 可寫成 2x+0y，加上0不改變答案。y′=y 可寫成 0x+1y，因為 0x=0、1y=y。乘在 x、y 前面的數叫係數：第一行是2、0，第二行是0、1。這裡 y 仍可等於2；0y=0 並不是把 y 改成0。",
    "visual": "x′=2x+0y；y′=0x+1y由前一步逐項移動/補出。強調0y=0並不是y=0；1y=y。",
    "bridge": "兩行都拿同一組 x、y 來算，我們要看清各自把這兩個數乘了多少。"
  },
  {
    "scene": "fixed-coefficients",
    "caption": "換了輸入，規則的四個係數仍然相同",
    "detail": "選 Q(2,1)，把 x=2、y=1 代入：第一行 2×2+0×1=4，第二行 0×2+1×1=1，所以新位置是 (4,1)。切回 P 再比較：改變的是代入的坐標，四個係數2、0、0、1始終相同。",
    "visual": "P/Q可切按鈕；兩條數值公式中輸入值移動更換，係數固定位置固定顏色；同圖顯示對應原/新點。",
    "bridge": "坐標和係數已經分清楚，現在換一個點，看看哪一部分會變。"
  },
  {
    "scene": "coefficient-table",
    "caption": "把兩條公式的係數，按原來次序排成表",
    "detail": "上面一行算新橫坐標 x′，按 2x+0y 填入2、0；下面一行算新縱坐標 y′，按 0x+1y 填入0、1。每行都先放 x 的係數，再放 y 的係數。看清表頭和行的位置，就能把這張表讀回原來的兩條公式。",
    "visual": "從兩條完整公式的2,0,0,1飛入係數表，列頭x的係數/y的係數，行頭算x′/算y′。此步先不要全用矩陣括號替代表頭。",
    "bridge": "同一組係數可以反覆算不同的點，我們把它們整理在一起。"
  },
  {
    "scene": "matrix",
    "caption": "這張按行、列排列的數表，就叫矩陣",
    "detail": "橫著看是一行，直著看是一列。省去表格線，四個數照原位保留，加上括號，把這個矩陣取名為 D。它有2行、2列，大小寫成 2×2（先行、後列）。第一行仍然算 x′，第二行仍然算 y′，數字的位置意思沒有改。",
    "visual": "有標籤表格變成D=[[2,0],[0,1]]，保留淡色行列意義；此時才正式引入矩陣名稱。",
    "bridge": "剛才的係數表已記下規則，現在把它換成數學上常用的寫法。"
  },
  {
    "scene": "first-row",
    "caption": "D 的第一行，算出新橫坐標",
    "detail": "第一行2、0對應原公式 x′=2x+0y。輸入向量的上格是 x=1、下格是 y=2，因此先算 2×1 和 0×2，再相加得到2。這個2是新橫坐標，填入結果的上格；下格還沒算。",
    "visual": "D第一行高亮，各係數沿線對應輸入向量兩格，移到乘加式再放入輸出向量第一格2，第二格暫?。",
    "bridge": "矩陣只留下數字；現在用回 P(1,2)，把省去的計算讀回來。"
  },
  {
    "scene": "second-row",
    "caption": "D 的第二行，算出新縱坐標",
    "detail": "第二行0、1仍依次對上輸入的1、2，算出 0×1+1×2=2，填入結果的下格。這樣就得到 v′=[2;2]。每行依次相乘再相加，叫矩陣乘法；D×v 通常省略乘號寫成 Dv，所以整個計算是 v′=Dv。",
    "visual": "D第二行高亮，結果放第二格2，完整D[1;2]=[2;2]，標明矩陣乘法就是按這兩條公式算。",
    "bridge": "上格已有新橫坐標，還要用第二行算出下格，才有完整的新位置。"
  },
  {
    "scene": "stretch-interactive",
    "caption": "只改 y，看看哪個結果跟著改",
    "detail": "滑桿改的是原坐標 x、y，矩陣 D 保持不變。先固定 x，只拖動 y：第一行 x′=2x+0y 的結果不變，因為 y 乘了0；第二行 y′=0x+1y 會跟著改，因為 y 乘了1。看下方兩條算式，再對照原、新位置。",
    "visual": "雙滑桿x/y -1..2 step.5，D固定，輸入輸出向量/點/箭頭/兩行算式同步；默認(1,2)→(2,2)。",
    "bridge": "剛才用 D 算固定的一個點；現在動手改輸入，檢查兩行係數的作用。"
  },
  {
    "scene": "mixed-rules",
    "caption": "換一條規則，就要換相應的係數",
    "detail": "新規則是 x′=2x+y、y′=x+2y：算新橫坐標時，把 x 的兩倍加上 y；算新縱坐標時，把 y 的兩倍加上 x。仍先寫 x 的係數，再寫 y 的係數，得到兩行2、1及1、2，把新矩陣取名為 A。這次是改用另一條規則。",
    "visual": "新規則兩條公式，係數2,1,1,2逐項入表再成A，對照D中兩個0現在變1，右下角1也變2，三格一起改變；明說現在T換了規則，不是假稱由D推得A。",
    "bridge": "D 每行都有一個0；我們再試一種每個新坐標都需要 x、y 的算法。"
  },
  {
    "scene": "compare-interactive",
    "caption": "同一個輸入，D 和 A 算出的結果不同",
    "detail": "以 P(1,2) 為例，D 算得 (2,2)，A 的兩行則算出 2×1+1×2=4、1×1+2×2=5，得到 (4,5)。選 A 後只改 y，兩個結果都會改，因為兩行中 y 的係數分別是1和2，都不是0。",
    "visual": "D橫向拉長/A兩坐標互相影響兩個按鈕，defaultA；雙滑桿+實際點向量+矩陣值+兩行算式全部同步。切D時顯示D結果，caption保留比較語境避免把D標A。",
    "bridge": "新矩陣 A 已經寫好；保持輸入不變，才能看清換規則造成的差別。"
  },
  {
    "scene": "whole-plane",
    "caption": "把同一個矩陣，用到三角形的每個點",
    "detail": "用 A 計算，(1,1)、(1,2)、(2,1) 分別到達 (3,3)、(4,5)、(5,4)。把三個新頂點照原來次序連起來，就得到新三角形。網格上的點也逐個照 A 計算，彩色網格顯示的就是它們一起變換後的位置。",
    "visual": "可切D/A，默認A；網格/三角形/選定點/向量同步I→當前矩陣，圖形與箭頭/圓點保形，支持本步重播及中途重播。",
    "bridge": "上一幅只算一個點；要知道整個三角形變成甚麼樣，其他頂點也要算。"
  },
  {
    "scene": "connections",
    "caption": "函數是規則，向量是輸入和結果，矩陣記下係數",
    "detail": "左邊 v=[1;2] 是原位置，右邊 v′=[4;5] 是新位置。T 是從原位置到新位置的函數，也叫映射；A 記下這條規則的四個係數。T(v) 表示把 v 交給 T 計算，在這個例子中就是 Av，因此 T(v)=Av=v′。",
    "visual": "清楚標輸入向量v→函數/映射T→輸出向量v′，A係數表在T內或下面連起，主例A[1;2]=[4;5]。不是只並排四張名詞卡。",
    "bridge": "我們已算過點和圖形，現在把這個計算裡的幾個名稱對在同一張圖上。"
  },
  {
    "scene": "limits",
    "caption": "固定矩陣可以算乘加，平移還要另加一個向量",
    "detail": "若 x′=2x+1、y′=y，就先算 Dv，再給橫坐標加1、縱坐標加0，寫成 Dv+[1;0]。若改為 x′=x²、y′=y，1要變1、2要變4，所需倍率會隨 x 改變，不能只用固定的2×2矩陣直接乘原來的 [x;y]。",
    "visual": "完整列主例A[ x;y ]、平移例x′=2x+1,y′=y且v′=Dv+[1;0]、平方例x′=x²,y′=y不能直接用同維度固定矩陣乘法表示。不要把固定A混用為D。不加基向量/特徵值/行列式，不說非線性不能用矩陣。",
    "bridge": "A、D 都用固定係數乘原坐標，再相加；有些規則還需要其他運算。"
  },
  {
    "scene": "fuzzy-relation",
    "caption": "模糊關係也用矩陣，但每格記的是關係程度",
    "detail": "a、b 是第一組對象，p、q、r 是第二組對象，這張關係表叫 R。找 b 行和 r 列，交會格0.8就是這一對的關係程度，記作 μ_R(b,r)=0.8。之後合成模糊關係，本章會用 min 取小、max 取大，計算方法在後面的例題再講。",
    "visual": "保留R=[[.2,.7,.4],[.5,.1,.8]]，rows a,b cols p,q,r；高亮b/r得.8。μR把一對對象(b,r)對應到程度.8，回扣對應含義但不要暗示R就是普通線性變換係數。",
    "bridge": "剛才每格是計算坐標的係數；回到模糊推理，先重新看清行、列和數字的意思。"
  }
];
  const matrix = (rows, extra = '') => `<span class="mcc-inline-matrix ${extra}" style="--mcc-cols:${rows[0].length}">${rows.map(row => row.map((value, j) => `<span class="${rows[0].length > 1 ? 'mcc-c' + j : ''}">${value}</span>`).join('')).join('')}</span>`;
  const column = (values, extra = '') => matrix(values.map(value => [value]), extra);
  const equation = content => `<div class="mcc-equation"><span class="mcc-expression">${content}</span></div>`;
  const D = [[2,0],[0,1]], A = [[2,1],[1,2]];
  const ruleButtons = (selected='A') => `<div class="mcc-rule-buttons"><button type="button" data-matrix-rule="D" aria-pressed="${selected==='D'}">D：橫向拉長</button><button type="button" data-matrix-rule="A" aria-pressed="${selected==='A'}">A：每個結果都用到 x、y</button></div>`;
  const sliders = () => `<div class="mcc-slider-pair">${['x','y'].map((name,i)=>`<label>${i?'原縱坐標':'原橫坐標'} ${name} = <output data-matrix-component-value="${i}">${i+1}</output><input data-matrix-component="${i}" type="range" min="-1" max="2" step="0.5" value="${i+1}" aria-label="${name}坐標，負1至2，每格0.5"></label>`).join('')}</div><div class="mcc-live-equations"><p data-matrix-sum="0"></p><p data-matrix-sum="1"></p></div>`;
  const formulas = [
    equation('乘二')+'<p>1 → 2<br>2 → 4<br>3 → 6</p><p class="mcc-note">右邊的 8 沒有用到。</p>',
    `<div class="mcc-mapping-buttons"><button type="button" data-matrix-mapping-mode="valid" aria-pressed="true">乘二規則 f</button><button type="button" data-matrix-mapping-mode="double" aria-pressed="false">讓 1 同時指向 2、4</button><button type="button" data-matrix-mapping-mode="missing" aria-pressed="false">讓 2 沒有結果</button><button type="button" data-matrix-mapping-mode="many" aria-pressed="false">另一條規則：全部對應 2</button></div><p data-mapping-status>符合：1→2、2→4、3→6，每個輸入都有唯一結果。</p>`,
    equation('f：X → Y')+equation('x ↦ 2x')+equation('f(1) = 2')+'<p class="mcc-note">X：輸入從這裡選<br>Y：結果落在這裡</p>',
    equation('f：ℝ → ℝ')+'<p>ℝ 是全體實數。</p><label class="mcc-numberline-slider">原位置 x = <output data-numberline-value>1</output><input data-matrix-numberline type="range" min="-2" max="2" step="0.5" value="1" aria-label="數線原位置，負2至2"></label>'+equation('<span data-numberline-result>f(1) = 2</span>'),
    equation('橫向 × 2')+equation('高度不變')+'<p class="mcc-note">同一個平面上，<br>灰色是原圖形。</p>',
    equation('P(1, 2) → (2, 2)')+'<p class="mcc-c0">橫坐標：1 × 2 = 2</p><p class="mcc-c1">縱坐標：2 保持不變</p>',
    equation(`v = ${column([1,2])}`)+'<p class="mcc-c0">上面：橫坐標 x</p><p class="mcc-c1">下面：縱坐標 y</p><p class="mcc-note">先橫、後縱，次序固定。</p>',
    equation('T：ℝ² → ℝ²')+equation(`v = ${column([1,2])} → v′ = ${column([2,2])}`)+'<p class="mcc-note">ℝ² 表示平面上所有的坐標對 (x, y)。<br>一整組坐標是一個輸入。</p>',
    equation('x′ = 2x')+equation('y′ = y')+'<p class="mcc-note">x、y：原坐標<br>x′、y′：新坐標</p>',
    equation('x′ = 2x + 0y')+equation('y′ = 0x + 1y')+'<p class="mcc-note">0y = 0，並不是 y = 0。<br>1y = y。</p>',
    '<div class="mcc-point-buttons"><button type="button" data-matrix-point-choice="P" aria-pressed="false">P(1, 2)</button><button type="button" data-matrix-point-choice="Q" aria-pressed="true">Q(2, 1)</button></div><div class="mcc-live-equations"><p data-fixed-formula="0">x′ = 2 × 2 + 0 × 1 = 4</p><p data-fixed-formula="1">y′ = 0 × 2 + 1 × 1 = 1</p></div><p class="mcc-note">係數始終是 2、0、0、1。</p>',
    '<p>每行先寫 x 的係數，<br>再寫 y 的係數。</p><p class="mcc-note">第一行算 x′。<br>第二行算 y′。</p>',
    equation(`D = ${matrix(D)}`)+'<p>2 行 × 2 列</p><p class="mcc-note">表頭省去，次序保留：<br>上行算 x′，下行算 y′。</p>',
    equation('x′ = 2 × 1 + 0 × 2')+equation('= 2')+'<p class="mcc-note">第一行給出新橫坐標。</p>',
    equation('y′ = 0 × 1 + 1 × 2')+equation('= 2')+equation(`v′ = Dv = ${column([2,2])}`),
    equation('D：橫向拉長')+sliders(),
    equation('x′ = 2x + y')+equation('y′ = x + 2y')+equation(`A = ${matrix(A)}`)+'<p class="mcc-note">現在換了一條規則。</p>',
    ruleButtons('A')+sliders(),
    ruleButtons('A')+equation('<span data-plane-rule-name>A</span> = <span data-plane-rule-matrix></span>')+equation('<span data-plane-coordinate-result>(1, 2) → (4, 5)</span>')+'<p class="mcc-note">灰色是原網格與原三角形。</p>',
    equation(`T(v) = Av = v′`)+equation(`v′ = ${column([4,5])}`)+'<p>v、v′：原、新坐標</p><p>T：函數，也叫映射</p><p>A：T 用到的係數</p>',
    '<p>坐標乘係數，再相加：</p>'+equation('Av')+equation(`平移後：v′ = Dv + ${column([1,0])}`)+'<p class="mcc-note">含 x² 時，只把原坐標乘固定係數，<br>再相加，無法算出平方。</p>',
    equation('μ<sub>R</sub>(b, r) = 0.8')+'<p>輸入一對對象 (b, r)，<br>得到關係程度 0.8。</p><p class="mcc-note">這裡每格記的是隸屬度。<br>本章按 min、max 做合成。</p>'
  ];
  frames.forEach((f,i)=>{f.concept=i<4?'mapping':i<8?'vector':i<15?'matrix':i<19?'explore':'connections';f.formula=formulas[i];});
  const esc = value => String(value).replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
  const number = value => String(Number(value.toFixed(2))).replace('-', '−');
  const txt = (x, y, text, attrs = '') => `<text x="${x}" y="${y}" ${attrs}>${text}</text>`;
  const path = (d, attrs = '') => `<path d="${d}" ${attrs}/>`;
  const sub = (letter, index) => `${letter}<tspan baseline-shift="sub" font-size="65%">${index}</tspan>`;
  function brackets(left, top, right, bottom) {return path(`M${left + 12} ${top} H${left} V${bottom} H${left + 12} M${right - 12} ${top} H${right} V${bottom} H${right - 12}`, 'class="mcc-bracket"');}
  function svgMatrix(rows, cx, cy, dx = 78, dy = 62, options = {}) {
    const cols = rows[0].length, r = rows.length, left = cx - (cols - 1) * dx / 2, top = cy - (r - 1) * dy / 2;
    const padding = Math.max(31, ...rows.flat().map(value => String(value).length * 10 + 8));
    let result = brackets(left - padding, top - 29, left + (cols - 1) * dx + padding, top + (r - 1) * dy + 29);
    rows.forEach((row, i) => row.forEach((v, j) => {
      const color = options.colors === false ? '' : options.columnColor ? 'mcc-c' + options.columnColor[j] : cols > 1 ? 'mcc-c' + j : options.componentColors ? 'mcc-c' + i : '';
      const attr = options.attrs ? options.attrs(i, j) : '';
      result += txt(left + j * dx, top + i * dy + 12, v, `class="mcc-number ${color}" text-anchor="middle" ${attr}`);
    }));
    return result;
  }
  function arrow(x1, y1, x2, y2, key, color = 'ink', attrs = '') {return path(`M${x1} ${y1} L${x2} ${y2}`, `class="mcc-arrow mcc-stroke-${color}" marker-end="url(#${key}-${color})" ${attrs}`);}
  function curve(d, key, color, attrs = '') {return path(d, `class="mcc-arrow mcc-stroke-${color}" marker-end="url(#${key}-${color})" ${attrs}`);}
  function flow(points, color, delay = 0) {return `<circle cx="0" cy="0" r="7" class="mcc-flow mcc-fill-${color}" data-flow="${points}" data-delay="${delay}"/>`;}
  function axes(key, ox, oy, unit, opts = {}) {
    const {left = ox - unit * 1.4, right = ox + unit * 3.2, top = oy - unit * 3.2, bottom = oy + unit * .6, xs = [1, 2, 3], ys = [1, 2, 3], grid = true, originLabelY = oy+22} = opts;
    let result = '';
    if (grid) {xs.forEach(x => {const px = ox + x * unit;if(px>left&&px<right)result += path(`M${px} ${top} V${bottom}`, 'class="mcc-grid"');});ys.forEach(y => {const py=oy-y*unit;if(py>top&&py<bottom)result += path(`M${left} ${py} H${right}`, 'class="mcc-grid"');});}
    result += arrow(left, oy, right, oy, key, 'axis') + arrow(ox, bottom, ox, top, key, 'axis');
    xs.forEach(x=>{const px=ox+x*unit;if(px>left&&px<right)result += txt(px,oy+22,number(x),'class="mcc-tick" text-anchor="middle"');});
    ys.forEach(y=>{const py=oy-y*unit;if(py>top&&py<bottom)result += txt(ox-12,py+6,number(y),'class="mcc-tick" text-anchor="end"');});
    return result + txt(ox-10,originLabelY,'O','class="mcc-tick" text-anchor="end"') + txt(right+12,oy+6,'x','class="mcc-axis-name"') + txt(ox+9,top+5,'y','class="mcc-axis-name"');
  }
  function mapping(key,notation=false,mode=null) {
    const interactive=mode!==null, xs=[1,2,3], ys=[2,4,6,8];
    const xi=[135,225,315], yi=[110,180,250,320];
    let result='<ellipse cx="145" cy="220" rx="80" ry="145" class="mcc-set"/><ellipse cx="520" cy="220" rx="85" ry="155" class="mcc-set"/>'
      +txt(145,25,'集合 X','class="mcc-label" text-anchor="middle"')
      +txt(520,25,'集合 Y','class="mcc-label" text-anchor="middle"')
      +txt(145,53,'可以選的數','class="mcc-small" text-anchor="middle"')
      +txt(520,53,'允許的結果','class="mcc-small" text-anchor="middle"');
    xs.forEach((v,i)=>result+=txt(145,xi[i]+10,String(v),'class="mcc-number" text-anchor="middle"'));
    ys.forEach((v,i)=>result+=txt(520,yi[i]+10,String(v),'class="mcc-number" text-anchor="middle"'));
    const pairs=[
      [1,2,'valid double missing many'],
      [2,4,'valid double'],
      [3,6,'valid double missing'],
      [1,4,'double'],
      [2,2,'many'],
      [3,2,'many']
    ];
    let trace=0;
    pairs.forEach(([a,b,modes])=>{
      if(!interactive&&!modes.split(' ').includes('valid'))return;
      const visible=!interactive||modes.split(' ').includes(mode), i=xs.indexOf(a), j=ys.indexOf(b);
      result+=curve(`M188 ${xi[i]} C290 ${xi[i]} 365 ${yi[j]} 475 ${yi[j]}`,key,a===1&&b===4?'c1':'ink',`data-trace="${visible?trace++:0}" data-mapping-input="${a}" data-mapping-output="${b}" data-mapping-modes="${modes}" ${visible?'':'hidden'}`);
    });
    result+=txt(330,83,interactive?'f：乘 2':notation?'x ↦ 2x':'乘 2',`class="mcc-label" text-anchor="middle" ${interactive?'data-mapping-rule-label':''}`);
    if(interactive)result+=txt(330,111,'','class="mcc-small" text-anchor="middle" data-mapping-rule-subtitle');
    return result+txt(340,403,interactive?'Y 中沒有用到的數可以保留':'8：允許，但這次沒有算到','class="mcc-small" text-anchor="middle"');
  }
  function numberLine(key) {
    let result='';[130,290].forEach((y,i)=>{result+=arrow(65,y,615,y,key,'axis');for(let n=-4;n<=4;n++){result+=path(`M${340+n*55} ${y-5} V${y+5}`,'class="mcc-grid-tick"')+txt(340+n*55,y+27,String(n).replace('-','−'),'class="mcc-tick" text-anchor="middle"');}result+=txt(70,y-37,i?'新位置 f(x) = 2x':'原位置 x','class="mcc-small"');});
    return result+curve('M395 140 C395 190 450 230 450 280',key,'ink','data-numberline-link data-trace="0"')+'<circle cx="395" cy="130" r="7" class="mcc-point" data-numberline-input-point/><circle cx="450" cy="290" r="7" class="mcc-point" data-numberline-output-point data-from="-55,-160"/>'+txt(395,112,'1','class="mcc-number mcc-c0" text-anchor="middle" data-numberline-input-label')+txt(470,270,'2','class="mcc-number mcc-c0" text-anchor="start" data-numberline-output-label');
  }
  function planeTask(key,pointOnly=false) {
    const ox=140,oy=335,u=75;
    let result=axes(key,ox,oy,u,{left:85,right:565,top:50,bottom:370,xs:[1,2,3,4,5],ys:[1,2,3]});
    if(!pointOnly)result+=path('M215 260 L215 185 L290 260 Z','class="mcc-original-shape"')+path('M290 260 L290 185 L440 260 Z','class="mcc-shape" data-path-from="M215 260 L215 185 L290 260 Z"');
    else result+=arrow(140,335,215,335,key,'c0','data-trace="0"')+arrow(215,335,215,185,key,'c1','data-trace="1"')+'<circle cx="215" cy="185" r="6" class="mcc-old-point"/>'+arrow(225,185,280,185,key,'ink','data-trace="2"')+'<circle cx="290" cy="185" r="7" class="mcc-point" data-from="-75,0"/>'+txt(203,165,'P(1, 2)','class="mcc-point-label" text-anchor="end"')+txt(307,165,'(2, 2)','class="mcc-point-label"');
    return result;
  }
  function vectorDiagram(key) {
    return axes(key,135,330,80,{left:85,right:345,top:75,bottom:370,xs:[1,2],ys:[1,2,3]})+arrow(135,330,215,330,key,'c0','data-trace="0"')+arrow(215,330,215,170,key,'c1','data-trace="1"')+arrow(135,330,215,170,key,'ink','data-trace="2"')+txt(228,140,'P(','class="mcc-small"')+txt(270,140,'1','class="mcc-number mcc-c0"')+txt(292,140,',','class="mcc-small"')+txt(308,140,'2','class="mcc-number mcc-c1"')+txt(330,140,')','class="mcc-small"')+arrow(355,205,425,205,key,'ink','data-trace="3"')+txt(485,220,'v =','class="mcc-label" text-anchor="end"')+svgMatrix([[1],[2]],535,215,78,80,{componentColors:true,attrs:i=>`data-from="${i?-227:-265},${i?-127:-47}" data-delay="${i*220}"`})+txt(600,190,'x','class="mcc-label mcc-c0"')+txt(600,270,'y','class="mcc-label mcc-c1"');
  }
  function vectorFunction(key) {
    return txt(100,90,'1','class="mcc-number" text-anchor="middle"')+arrow(150,78,235,78,key,'ink','data-trace="0"')+txt(330,88,'f：乘 2','class="mcc-label" text-anchor="middle"')+arrow(420,78,505,78,key,'ink','data-trace="1"')+txt(560,90,'2','class="mcc-number" text-anchor="middle"')+svgMatrix([[1],[2]],100,275,78,70,{componentColors:true})+arrow(150,275,230,275,key,'ink','data-trace="2"')+txt(330,250,'T','class="mcc-big" text-anchor="middle"')+txt(330,290,'橫向乘 2','class="mcc-small" text-anchor="middle"')+arrow(430,275,510,275,key,'ink','data-trace="3"')+svgMatrix([[2],[2]],560,275,78,70,{colors:false,attrs:i=>`data-from="-460,0" data-delay="${500+i*150}"`})+txt(100,385,'v','class="mcc-label" text-anchor="middle"')+txt(560,385,'v′','class="mcc-label" text-anchor="middle"');
  }
  function formulaRows(key,full=false,values=D) {
    let r='';[0,1].forEach(i=>{const y=95+i*95;r+=txt(115,y,i?'y′ =':'x′ =','class="mcc-label"')+txt(280,y,String(values[i][0]),`class="mcc-number mcc-c0" text-anchor="middle" ${full&&i===1?'data-from="180,0"':''}`)+txt(310,y,'x','class="mcc-label mcc-c0"');if(full)r+=txt(370,y,'+','class="mcc-label"')+txt(430,y,String(values[i][1]),`class="mcc-number mcc-c1" text-anchor="middle" ${i===0?'data-from="120,0"':''}`)+txt(460,y,'y','class="mcc-label mcc-c1"');});
    if(!full)r=r.replace(txt(280,190,'0','class="mcc-number mcc-c0" text-anchor="middle" ')+txt(310,190,'x','class="mcc-label mcc-c0"'),txt(280,190,'y','class="mcc-number mcc-c1" text-anchor="middle"'));
    return r+svgMatrix([[1],[2]],180,320,78,52,{componentColors:true})+arrow(245,320,445,320,key,'ink','data-trace="0"')+svgMatrix([[2],[2]],520,320,78,52,{colors:false});
  }
  function fixedPoint(key) {
    return axes(key,170,330,65,{left:105,right:560,top:65,bottom:370,xs:[1,2,3,4,5],ys:[1,2,3]})+'<circle cx="300" cy="265" r="6" class="mcc-old-point" data-fixed-input-point/>'+arrow(310,265,420,265,key,'ink','data-fixed-link data-trace="0"')+'<circle cx="430" cy="265" r="7" class="mcc-point" data-fixed-output-point/>'+txt(290,245,'Q(2, 1)','class="mcc-point-label" text-anchor="end" data-fixed-input-label')+txt(445,245,'(4, 1)','class="mcc-point-label" data-fixed-output-label');
  }
  function coefficientTable(key,asMatrix=false,values=D,name='D') {
    if(asMatrix)return txt(110,240,`${name} =`,'class="mcc-big" text-anchor="middle"')+txt(290,100,'x 的係數','class="mcc-small mcc-muted" text-anchor="middle"')+txt(420,100,'y 的係數','class="mcc-small mcc-muted" text-anchor="middle"')+txt(172,207,'算 x′','class="mcc-small mcc-muted" text-anchor="middle"')+txt(172,287,'算 y′','class="mcc-small mcc-muted" text-anchor="middle"')+svgMatrix(values,355,235,130,80,{attrs:(i,j)=>`data-from="${j?40:30},${i?63:78}" data-delay="${(i*2+j)*120}"`})+txt(355,365,'兩行、兩列','class="mcc-label" text-anchor="middle"');
    let r='';[0,1].forEach(i=>{const y=65+i*65;r+=txt(100,y,i?'y′ =':'x′ =','class="mcc-small"')+txt(270,y,String(values[i][0]),'class="mcc-number mcc-c0" text-anchor="middle"')+txt(300,y,'x +','class="mcc-small"')+txt(430,y,String(values[i][1]),'class="mcc-number mcc-c1" text-anchor="middle"')+txt(460,y,'y','class="mcc-small"');});
    r+=txt(320,214,'x 的係數','class="mcc-small mcc-c0" text-anchor="middle"')+txt(465,214,'y 的係數','class="mcc-small mcc-c1" text-anchor="middle"')+'<rect x="250" y="240" width="285" height="140" class="mcc-table-box"/>'+path('M392 240 V380 M250 310 H535','class="mcc-table-line"')+txt(170,286,'算 x′','class="mcc-label" text-anchor="middle"')+txt(170,356,'算 y′','class="mcc-label" text-anchor="middle"');values.forEach((row,i)=>row.forEach((v,j)=>r+=txt(j?465:320,i?356:286,String(v),`class="mcc-number mcc-c${j}" text-anchor="middle" data-from="${j?-35:-50},${i?-226:-221}" data-delay="${(i*2+j)*160}"`)));return r;
  }
  function rowProduct(key,second=false) {
    const row=second?1:0,y=160+row*80;
    return `<rect x="85" y="${y-34}" width="195" height="70" rx="3" class="mcc-selected-row"/>`+txt(180,65,'D','class="mcc-label" text-anchor="middle"')+txt(365,65,'v','class="mcc-label" text-anchor="middle"')+txt(570,65,'v′','class="mcc-label" text-anchor="middle"')+svgMatrix(D,180,200,95,80)+svgMatrix([[1],[2]],365,200,78,80,{componentColors:true})+txt(460,211,'=','class="mcc-big" text-anchor="middle"')+svgMatrix([[2],[second?2:'?']],570,200,78,80,{colors:false,attrs:i=>i===row?`data-from="-30,${365-(160+i*80+12)}" data-delay="1200"`:''})+arrow(410,y,520,y,key,'ink','data-trace="0"')+txt(180,365,second?'0 × 1':'2 × 1','class="mcc-number mcc-c0" text-anchor="middle" data-from="-47,-160"')+txt(290,365,'+','class="mcc-number" text-anchor="middle"')+txt(400,365,second?'1 × 2':'0 × 2','class="mcc-number mcc-c1" text-anchor="middle" data-from="-172,-160" data-delay="180"')+txt(540,365,'= 2','class="mcc-number" text-anchor="middle"');
  }
  function pipeline(key,rule='A') {
    const values=rule==='D'?D:A,out=rule==='D'?[2,2]:[4,5];
    let r=txt(100,30,'v','class="mcc-label" text-anchor="middle"')+svgMatrix([[1],[2]],100,106,78,56,{componentColors:true,attrs:i=>`data-matrix-input-value="${i}"`})+arrow(160,105,240,105,key,'ink','data-trace="0"')+txt(325,30,rule,'class="mcc-label" text-anchor="middle" data-matrix-rule-name')+svgMatrix(values,325,106,74,56,{attrs:(i,j)=>`data-matrix-coefficient="${i}-${j}"`})+arrow(410,105,500,105,key,'ink','data-trace="1"')+txt(570,30,`v′ = ${rule}v`,'class="mcc-label" text-anchor="middle" data-matrix-output-heading')+svgMatrix(out.map(v=>[v]),570,106,78,56,{colors:false,attrs:i=>`data-matrix-output-value="${i}"`});
    r+=txt(165,190,'原位置','class="mcc-small" text-anchor="middle"')+txt(470,190,'新位置','class="mcc-small" text-anchor="middle"')+axes(key,145,330,18,{left:80,right:275,top:215,bottom:390,xs:[-2,2,4,6],ys:[-2,2,4,6],grid:false,originLabelY:315})+axes(key,440,330,18,{left:375,right:570,top:215,bottom:390,xs:[-2,2,4,6],ys:[-2,2,4,6],grid:false,originLabelY:315})+arrow(145,330,163,294,key,'ink','data-matrix-input-vector')+arrow(440,330,440+out[0]*18,330-out[1]*18,key,'ink','data-matrix-output-vector')+`<circle cx="163" cy="294" r="5" class="mcc-point" data-matrix-input-point/><circle cx="${440+out[0]*18}" cy="${330-out[1]*18}" r="5" class="mcc-point" data-matrix-output-point/>`+txt(174,285,'(1, 2)','class="mcc-point-label mcc-compact-label" data-matrix-input-label')+txt(451+out[0]*18,321-out[1]*18,`(${out[0]}, ${out[1]})`,'class="mcc-point-label mcc-compact-label" data-matrix-output-label');return r;
  }
  function wholePlane(key) {
    let grid='';[-1,0,1,2].forEach(n=>grid+=path(`M${n*35} 35 V-70 M-35 ${-n*35} H70`,'class="mcc-plane-grid"'));
    const triangle='M35 -35 L35 -70 L70 -35 Z';
    return axes(key,300,260,35,{left:165,right:555,top:25,bottom:380,xs:[-2,2,4,6],ys:[-2,2,4,6],grid:false})+`<g transform="translate(300 260)"><g class="mcc-original-grid">${grid}${path(triangle,'class="mcc-original-shape"')}</g><g data-matrix-plane data-origin="300,260" data-unit="35" data-final-transform="2,-1,-1,2,0,0" style="transform:matrix(2,-1,-1,2,0,0)">${grid}${path(triangle,'class="mcc-shape" data-matrix-plane-shape data-math-points="1,1;1,2;2,1"')}</g><g data-matrix-plane-overlay>${arrow(0,0,140,-175,key,'ink','data-plane-start="35,-70" data-plane-end="140,-175"')}<circle cx="140" cy="-175" r="6" class="mcc-point" data-matrix-plane-point data-start="35,-70" data-end="140,-175"/></g></g>`+txt(330,205,'P(1, 2)','class="mcc-small mcc-muted"')+txt(454,77,'(4, 5)','class="mcc-point-label" data-plane-label')+txt(330,397,'A：每個結果都用到 x、y','class="mcc-small" text-anchor="middle" data-plane-diagram-title');
  }
  function connections(key) {
    return txt(100,70,'輸入向量 v','class="mcc-small" text-anchor="middle"')+svgMatrix([[1],[2]],100,220,78,75,{componentColors:true})+arrow(155,220,235,220,key,'ink','data-trace="0"')+'<rect x="245" y="95" width="195" height="250" rx="3" class="mcc-function-box"/>'+txt(342,136,'函數／映射 T','class="mcc-small" text-anchor="middle"')+svgMatrix(A,342,225,75,60)+txt(342,320,'係數矩陣 A','class="mcc-small" text-anchor="middle"')+arrow(450,220,510,220,key,'ink','data-trace="1"')+txt(575,70,'輸出向量 v′','class="mcc-small" text-anchor="middle"')+svgMatrix([[4],[5]],575,220,78,75,{colors:false})+txt(342,397,'按 A 裡的係數，計算每個新坐標','class="mcc-small" text-anchor="middle"');
  }
  function limits() {
    return txt(65,55,'坐標乘係數，再相加','class="mcc-small"')+txt(65,105,'x′ = 2x + y，y′ = x + 2y','class="mcc-label"')+txt(555,105,'Av','class="mcc-big" text-anchor="middle"')+path('M60 140 H620','class="mcc-table-line"')+txt(65,185,'再加一個平移量','class="mcc-small"')+txt(65,235,'x′ = 2x + 1，y′ = y','class="mcc-label"')+txt(470,232,'Dv +','class="mcc-label" text-anchor="end"')+svgMatrix([[1],[0]],535,220,78,40,{colors:false})+path('M60 280 H620','class="mcc-table-line"')+txt(65,325,'如果出現平方','class="mcc-small"')+txt(65,375,'x′ = x²，y′ = y','class="mcc-label"')+txt(450,355,'固定係數的乘加','class="mcc-small"')+txt(450,385,'不足以記下這條規則','class="mcc-small"');
  }
  function mixedRules(key) {
    let r=txt(340,35,'x′ = 2x + y，y′ = x + 2y','class="mcc-label" text-anchor="middle"');
    r+=txt(115,85,'原規則 D','class="mcc-small" text-anchor="middle"')+svgMatrix(D,115,168,70,65)+arrow(185,195,245,195,key,'ink','data-trace="0"');
    r+=txt(340,85,'新規則的係數','class="mcc-small" text-anchor="middle"')+txt(305,118,'x','class="mcc-small mcc-c0" text-anchor="middle"')+txt(375,118,'y','class="mcc-small mcc-c1" text-anchor="middle"')+'<rect x="270" y="130" width="140" height="130" class="mcc-table-box"/>'+path('M340 130 V260 M270 195 H410','class="mcc-table-line"')+txt(255,172,'x′','class="mcc-small" text-anchor="end"')+txt(255,237,'y′','class="mcc-small" text-anchor="end"');
    A.forEach((row,i)=>row.forEach((v,j)=>{const x=305+j*70,y=172+i*65;r+=txt(x,y,String(v),`class="mcc-number mcc-c${j}" text-anchor="middle" data-from="${-225},0" data-delay="${i*320+j*160}" data-matrix-change="${i}-${j}"`);}));
    r+=arrow(430,195,480,195,key,'ink','data-trace="1"')+txt(565,85,'矩陣 A','class="mcc-small" text-anchor="middle"')+svgMatrix(A,565,195,70,65,{attrs:(i,j)=>`data-from="-225,0" data-delay="${900+i*180+j*90}"`});
    return r+txt(340,330,'右上：0 → 1　左下：0 → 1　右下：1 → 2','class="mcc-small" text-anchor="middle"')+txt(340,380,'左上仍是 2，另外三格都變了。','class="mcc-small" text-anchor="middle"');
  }

  function fuzzy() {
    let r='<rect x="157" y="230" width="390" height="74" class="mcc-selected-row"/><rect x="447" y="124" width="98" height="180" class="mcc-selected-column"/>';
    ['p','q','r'].forEach((v,i)=>r+=txt(210+i*140,80,v,'class="mcc-label" text-anchor="middle"'));['a','b'].forEach((v,i)=>r+=txt(100,175+i*100,v,'class="mcc-label" text-anchor="middle"'));return r+svgMatrix([['0.2','0.7','0.4'],['0.5','0.1','0.8']],350,217,140,100,{colors:false})+txt(350,370,'(b, r) → 0.8','class="mcc-label" text-anchor="middle"');
  }
  function diagram(i,prefix='live') {
    const key=`mcc-${prefix}-${i}`,scene=frames[i].scene;let content='';
    if(scene==='doubling'||scene==='notation')content=mapping(key,scene==='notation');else if(scene==='mapping-rule')content=mapping(key,false,'valid');else if(scene==='number-line')content=numberLine(key);else if(scene==='plane-task'||scene==='point-move')content=planeTask(key,scene==='point-move');else if(scene==='vector')content=vectorDiagram(key);else if(scene==='vector-function')content=vectorFunction(key);else if(scene==='coordinate-rules'||scene==='zero-coefficients')content=formulaRows(key,scene==='zero-coefficients');else if(scene==='fixed-coefficients')content=fixedPoint(key);else if(scene==='coefficient-table'||scene==='matrix')content=coefficientTable(key,scene==='matrix');else if(scene==='first-row'||scene==='second-row')content=rowProduct(key,scene==='second-row');else if(scene==='stretch-interactive'||scene==='compare-interactive')content=pipeline(key,scene==='stretch-interactive'?'D':'A');else if(scene==='mixed-rules')content=mixedRules(key);else if(scene==='whole-plane')content=wholePlane(key);else if(scene==='connections')content=connections(key);else if(scene==='limits')content=limits();else content=fuzzy();
    return `<svg class="mcc-diagram" viewBox="0 0 680 410" role="img" aria-label="${esc(frames[i].caption)}"><title>${esc(frames[i].caption)}</title><defs>${['ink','c0','c1','axis'].map(c=>`<marker id="${key}-${c}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="${c==='axis'?5:7}" markerHeight="${c==='axis'?5:7}" orient="auto"><path d="M0 1 L9 5 L0 9" class="mcc-marker mcc-stroke-${c}"/></marker>`).join('')}</defs>${content}</svg>`;
  }
  function printFormula(i){const scene=frames[i].scene;if(scene==='mapping-rule')return '<p>每個輸入都要有而且只有一個結果。不同輸入可以有相同結果。</p>';if(scene==='number-line')return equation('1 → 2；−1 → −2；0 → 0');if(scene==='stretch-interactive'||scene==='compare-interactive')return equation(`${matrix(scene==='stretch-interactive'?D:A)}${column([1,2])} = ${column(scene==='stretch-interactive'?[2,2]:[4,5])}`);if(scene==='whole-plane')return equation(`A = ${matrix(A)}`)+equation('(1, 2) → (4, 5)');return frames[i].formula.replace(/<button[\s\S]*?<\/button>/g,'').replace(/data-[\w-]+(?:=\"[^\"]*\")?/g,'');}
  const html=`<section class="page supplement matrix-concepts" data-page="127" data-matrix-step="0" data-matrix-total="${frames.length}" data-matrix-concept="mapping" aria-labelledby="page-title">
    <header class="mcc-heading"><h1 id="page-title">矩陣入門①</h1><nav class="mcc-concepts" aria-label="課程進度">${[[0,'mapping','對應與函數'],[4,'vector','圖形與向量'],[8,'matrix','公式與矩陣'],[15,'explore','動手試一試'],[19,'connections','回看與應用']].map(([i,c,t])=>`<button type="button" data-matrix-jump="${i}" data-matrix-tab="${c}" aria-pressed="${i===0}">${t}</button>`).join('')}</nav></header>
    <div class="mcc-caption-wrap" aria-live="polite" aria-atomic="true"><h2 data-matrix-caption>${frames[0].caption}</h2><p class="mcc-bridge" data-matrix-bridge>${frames[0].bridge||''}</p><p class="mcc-explanation" data-matrix-detail>${frames[0].detail}</p></div>
    <div class="mcc-stage"><div class="mcc-canvas">${frames.map((f,i)=>`<section class="mcc-scene" data-matrix-scene="${f.scene}" data-matrix-frame="${i}" ${i?'hidden aria-hidden="true"':'aria-hidden="false"'}><div class="mcc-graphic">${diagram(i)}</div><aside class="mcc-formulas">${f.formula}</aside></section>`).join('')}</div></div>
    <div class="mcc-controls lesson-steps" data-projection-ignore><span class="mcc-progress lesson-step-progress" data-matrix-progress>1 / ${frames.length}</span><div class="lesson-step-actions"><button type="button" data-matrix-reset data-step-action="reset" disabled>重新開始</button><button type="button" data-matrix-prev data-step-action="prev" disabled>上一步</button><button type="button" data-matrix-next data-step-action="next">下一步</button></div></div>
    <article class="mcc-print-script"><h2>教學摘要</h2><ol>${frames.map((f,i)=>`<li><h3>${f.caption}</h3><p>${f.bridge||''}</p><p>${f.detail}</p><div class="mcc-print-example">${diagram(i,'print')}<div>${printFormula(i)}</div></div></li>`).join('')}</ol></article></section>`;
  const text=[title,...frames.flatMap(f=>[f.caption,f.bridge||'',f.detail]),'D=[[2,0],[0,1]]，D[1;2]=[2;2]；A=[[2,1],[1,2]]，A[1;2]=[4;5]。v與v′是列向量，T是函數，也叫映射。','0y=0並不表示y=0。輸入向量的分量是x與y，輸出分量是x′與y′。','模糊關係R=[[.2,.7,.4],[.5,.1,.8]]，行a,b；列p,q,r；μ_R(b,r)=.8。每格記關係隸屬度，本章採min、max合成。'].join('\n');
  window.COURSE_SUPPLEMENTS=[...(window.COURSE_SUPPLEMENTS||[]),{chapter:'03',page:127,number:18,after:95,section:85,slug:'matrix-concepts.html',title,text,html,images:[],kind:'matrix-concepts'}];

  let active=null;
  const reduced=()=>typeof document==='undefined'||document.body?.classList.contains('motion-off')||!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const usable=s=>!!s&&active===s&&s.page.isConnected&&s.lesson.contains(s.page);
  const current=s=>s.page.querySelector(`[data-matrix-scene="${frames[s.index].scene}"]`);
  const matrixFor=rule=>rule==='D'?D:A;
  function track(s,node,keyframes,options={}){if(reduced()||!node?.animate)return;const a=node.animate(keyframes,{duration:1050,easing:'cubic-bezier(.22,.62,.36,1)',fill:'backwards',...options});s.animations.add(a);a.finished.then(()=>s.animations.delete(a),()=>s.animations.delete(a));return a;}
  function cancelMotion(s){s.planeRun=(s.planeRun||0)+1;s.page.dataset.matrixTransform='complete';s.animations.forEach(a=>a.cancel());s.animations.clear();}
  function cleanup(){if(!active)return;const s=active;active=null;s.observer?.disconnect();s.motionObserver?.disconnect();s.motionQuery?.removeEventListener?.('change',s.onMotionChange);cancelAnimationFrame(s.frame);cancelMotion(s);}
  function fit(s=active){if(!usable(s))return;s.canvas.style.transform='';s.canvas.style.left='';s.canvas.style.top='';}
  function animateScene(s){if(reduced())return;const scene=current(s);scene.querySelectorAll('[data-trace]:not([hidden])').forEach(n=>{const length=n.getTotalLength();n.style.strokeDasharray=String(length);n.style.strokeDashoffset='0';track(s,n,[{strokeDashoffset:length},{strokeDashoffset:0}],{duration:800,delay:Number(n.dataset.trace)*180});});scene.querySelectorAll('[data-from]').forEach(n=>{const [dx,dy]=n.dataset.from.split(',').map(Number);track(s,n,[{transform:`translate(${dx}px, ${dy}px)`},{transform:'translate(0px, 0px)'}],{delay:Number(n.dataset.delay||0)});});scene.querySelectorAll('[data-path-from]').forEach(n=>track(s,n,[{d:`path("${n.dataset.pathFrom}")`},{d:`path("${n.getAttribute('d')}")`}],{duration:1500}));if(frames[s.index].scene==='whole-plane')animatePlane(s);}
  function setMapping(s,mode){
    const copy={
      valid:{
        valid:true,label:'f：乘 2',subtitle:'',
        detail:frames[s.index].detail,
        status:'符合：1→2、2→4、3→6，每個輸入都有唯一結果。'
      },
      double:{
        valid:false,label:'改動箭頭',subtitle:'1 有兩個結果',
        detail:'沿用同一個 X 和 Y，在 1→2 之外再加一條 1→4。現在輸入 1 同時指向 2 和 4，結果不唯一，因此這幅對應圖不符合函數的條件。圖中以不同顏色標出多加的箭頭。',
        status:'不符合：輸入 1 同時指向 2 和 4，結果不唯一。'
      },
      missing:{
        valid:false,label:'改動箭頭',subtitle:'2 沒有結果',
        detail:'保留 1→2、3→6，拿掉 2→4。2 仍在可選的集合 X 裡，卻沒有對應結果，因此這幅圖不符合函數的條件。問題是輸入 2 沒有結果；Y 裡的 8 沒有用到，則沒有影響。',
        status:'不符合：2 在可選輸入 X 裡，卻沒有任何對應結果。'
      },
      many:{
        valid:true,label:'另一條規則',subtitle:'全部對應 2',
        detail:'現在改用另一條規則：把 1、2、3 全部對應到 2。三個不同輸入共用同一個結果，但每個輸入仍有唯一結果，所以這仍是函數，也叫映射。Y 裡的 4、6、8 沒有用到也可以。',
        status:'符合：1、2、3 各有唯一結果 2。不同輸入可以共用結果。'
      }
    };
    mode=Object.prototype.hasOwnProperty.call(copy,mode)?mode:'valid';
    const selected=copy[mode],scene=current(s);
    s.mappingMode=mode;
    scene.dataset.mappingMode=mode;
    scene.dataset.mappingValid=String(selected.valid);
    let trace=0;
    scene.querySelectorAll('[data-mapping-input]').forEach(n=>{
      const visible=n.dataset.mappingModes.split(' ').includes(mode);
      n.toggleAttribute('hidden',!visible);
      if(visible)n.dataset.trace=String(trace++);
    });
    scene.querySelectorAll('[data-matrix-mapping-mode]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.matrixMappingMode===mode)));
    scene.querySelector('[data-mapping-rule-label]').textContent=selected.label;
    scene.querySelector('[data-mapping-rule-subtitle]').textContent=selected.subtitle;
    scene.querySelector('[data-mapping-status]').textContent=selected.status;
    s.page.querySelector('[data-matrix-detail]').textContent=selected.detail;
  }
  function setNumberLine(s,value){s.numberLine=value;const scene=current(s),x=340+value*55,y=340+2*value*55;scene.querySelector('[data-matrix-numberline]').value=String(value);scene.querySelector('[data-numberline-value]').textContent=number(value);scene.querySelector('[data-numberline-result]').textContent=`f(${number(value)}) = ${number(2*value)}`;for(const [name,cx,v,cy]of[['input',x,value,130],['output',y,2*value,290]]){const p=scene.querySelector(`[data-numberline-${name}-point]`),label=scene.querySelector(`[data-numberline-${name}-label]`);p.setAttribute('cx',cx);p.dataset.value=String(v);label.setAttribute('x',cx+(name==='output'?20:0));label.textContent=number(v);}scene.querySelector('[data-numberline-output-point]').dataset.from=`${x-y},-160`;scene.querySelector('[data-numberline-link]').setAttribute('d',`M${x} 140 C${x} 190 ${y} 230 ${y} 280`);}
  function setFixedPoint(s,name){s.pointChoice=name;const v=name==='Q'?[2,1]:[1,2],out=[2*v[0],v[1]],scene=current(s);scene.dataset.pointChoice=name;scene.querySelectorAll('[data-matrix-point-choice]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.matrixPointChoice===name)));['input','output'].forEach((type,i)=>{const values=i?out:v,cx=170+65*values[0],cy=330-65*values[1],p=scene.querySelector(`[data-fixed-${type}-point]`),label=scene.querySelector(`[data-fixed-${type}-label]`);p.setAttribute('cx',cx);p.setAttribute('cy',cy);p.dataset.coordinates=values.join(',');label.setAttribute('x',cx+(i?15:-10));label.setAttribute('y',cy-20);label.textContent=`${i?'':name}(${values.join(', ')})`;});scene.querySelector('[data-fixed-link]').setAttribute('d',`M${180+65*v[0]} ${330-65*v[1]} L${160+65*out[0]} ${330-65*out[1]}`);scene.querySelector('[data-fixed-formula="0"]').textContent=`x′ = 2 × ${v[0]} + 0 × ${v[1]} = ${out[0]}`;scene.querySelector('[data-fixed-formula="1"]').textContent=`y′ = 0 × ${v[0]} + 1 × ${v[1]} = ${out[1]}`;s.page.querySelector('[data-matrix-detail]').textContent=`選 ${name}(${v.join(',')})，把 x=${v[0]}、y=${v[1]} 代入：第一行 2×${v[0]}+0×${v[1]}=${out[0]}，第二行 0×${v[0]}+1×${v[1]}=${out[1]}，所以新位置是 (${out.join(',')})。切換另一個點再比較：改變的是代入的坐標，四個係數2、0、0、1始終相同。`;}
  function updatePipeline(s){const scene=current(s),rule=s.rule,coeff=matrixFor(rule),[x,y]=s.values,out=coeff.map(r=>r[0]*x+r[1]*y);if(frames[s.index].scene==='compare-interactive')s.page.querySelector('[data-matrix-detail]').textContent=`現在輸入是 (${number(x)},${number(y)})。D 算得 (${number(2*x)},${number(y)})，A 算得 (${number(2*x+y)},${number(x+2*y)})；圖中選用 ${rule}。固定 x、只改 y 時，${rule==='D'?'D 的第一行含 0y，新橫坐標不變，只有新縱坐標跟著改。':'A 的兩行分別含 1y、2y，兩個結果都會跟著改。'}`;s.page.dataset.matrixInput=s.values.join(',');s.page.dataset.matrixOutput=out.join(',');scene.dataset.matrixRule=rule;scene.querySelector('[data-matrix-rule-name]').textContent=rule;scene.querySelector('[data-matrix-output-heading]').textContent=`v′ = ${rule}v`;scene.querySelectorAll('[data-matrix-rule]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.matrixRule===rule)));coeff.forEach((row,i)=>row.forEach((value,j)=>scene.querySelector(`[data-matrix-coefficient="${i}-${j}"]`).textContent=String(value)));s.values.forEach((v,i)=>{scene.querySelector(`[data-matrix-component="${i}"]`).value=String(v);scene.querySelector(`[data-matrix-component-value="${i}"]`).textContent=number(v);scene.querySelector(`[data-matrix-input-value="${i}"]`).textContent=number(v);scene.querySelector(`[data-matrix-output-value="${i}"]`).textContent=number(out[i]);});const signed=v=>v<0?'('+number(v)+')':number(v);coeff.forEach((r,i)=>scene.querySelector(`[data-matrix-sum="${i}"]`).textContent=`${i?'y':'x'}′ = ${r[0]} × ${signed(x)} + ${r[1]} × ${signed(y)} = ${number(out[i])}`);[['input',145,330,18,s.values],['output',440,330,18,out]].forEach(([name,ox,oy,u,v])=>{const px=ox+v[0]*u,py=oy-v[1]*u,p=scene.querySelector(`[data-matrix-${name}-point]`),label=scene.querySelector(`[data-matrix-${name}-label]`);p.setAttribute('cx',px);p.setAttribute('cy',py);p.dataset.coordinates=v.join(',');scene.querySelector(`[data-matrix-${name}-vector]`).setAttribute('d',`M${ox} ${oy} L${px} ${py}`);label.setAttribute('x',px+11);label.setAttribute('y',py>360?py-14:py-9);label.textContent=`(${number(v[0])}, ${number(v[1])})`;});}
  function setPlane(s){const scene=current(s),rule=s.rule,coeff=matrixFor(rule),out=[coeff[0][0]+2*coeff[0][1],coeff[1][0]+2*coeff[1][1]],transform=rule==='D'?'2,0,0,1,0,0':'2,-1,-1,2,0,0',plane=scene.querySelector('[data-matrix-plane]'),p=scene.querySelector('[data-matrix-plane-point]'),v=scene.querySelector('[data-plane-start]'),label=scene.querySelector('[data-plane-label]'),end=[out[0]*35,-out[1]*35];s.page.querySelector('[data-matrix-detail]').textContent=`用 ${rule} 計算，(1,1)、(1,2)、(2,1) 分別到達 ${rule==='A'?'(3,3)、(4,5)、(5,4)':'(2,1)、(2,2)、(4,1)'}。把三個新頂點照原來次序連起來，就得到新三角形。網格上的點也逐個照 ${rule} 計算，彩色網格顯示的就是它們一起變換後的位置。`;scene.dataset.matrixRule=rule;plane.dataset.finalTransform=transform;plane.style.transform=`matrix(${transform})`;p.setAttribute('cx',end[0]);p.setAttribute('cy',end[1]);p.dataset.end=end.join(',');p.dataset.coordinates=out.join(',');v.setAttribute('d',`M0 0 L${end[0]} ${end[1]}`);v.dataset.planeEnd=end.join(',');label.setAttribute('x',300+end[0]+14);label.setAttribute('y',260+end[1]-8);label.textContent=`(${out.join(', ')})`;scene.querySelector('[data-plane-rule-name]').textContent=rule;scene.querySelector('[data-plane-rule-matrix]').innerHTML=matrix(coeff);scene.querySelector('[data-plane-coordinate-result]').textContent=`(1, 2) → (${out.join(', ')})`;scene.querySelector('[data-plane-diagram-title]').textContent=rule==='D'?'D：橫向拉長':'A：每個結果都用到 x、y';scene.querySelectorAll('[data-matrix-rule]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.matrixRule===rule)));}
  function animatePlane(s){const run=s.planeRun,scene=current(s),grid=scene.querySelector('[data-matrix-plane]'),p=scene.querySelector('[data-matrix-plane-point]'),from=p.dataset.start.split(',').map(Number),to=p.dataset.end.split(',').map(Number);s.page.dataset.matrixTransform='complete';if(reduced())return;const opts={duration:2200,easing:'cubic-bezier(.4,0,.2,1)'},a=track(s,grid,[{transform:'matrix(1,0,0,1,0,0)'},{transform:`matrix(${grid.dataset.finalTransform})`}],opts);scene.querySelectorAll('[data-plane-start]').forEach(n=>{const f=n.dataset.planeStart.split(',').map(Number),t=n.dataset.planeEnd.split(',').map(Number);track(s,n,[{d:`path("M0 0 L${f[0]} ${f[1]}")`},{d:`path("M0 0 L${t[0]} ${t[1]}")`}],opts);});track(s,p,[{transform:`translate(${from[0]-to[0]}px, ${from[1]-to[1]}px)`},{transform:'translate(0px, 0px)'}],opts);track(s,scene.querySelector('[data-plane-label]'),[{opacity:0},{opacity:1}],{duration:250,delay:1950});if(a){s.page.dataset.matrixTransform='playing';a.finished.then(()=>{if(usable(s)&&s.planeRun===run)s.page.dataset.matrixTransform='complete';},()=>{if(usable(s)&&s.planeRun===run)s.page.dataset.matrixTransform='complete';});}}
  function paint(s,animate){if(!usable(s))return;cancelMotion(s);const f=frames[s.index];s.page.dataset.matrixStep=String(s.index);s.page.dataset.matrixConcept=f.concept;s.page.querySelectorAll('[data-matrix-frame]').forEach(n=>{const show=+n.dataset.matrixFrame===s.index;n.hidden=!show;n.inert=!show;n.setAttribute('aria-hidden',String(!show));});s.page.querySelectorAll('[data-matrix-tab]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.matrixTab===f.concept)));s.page.querySelector('[data-matrix-caption]').textContent=f.caption;s.page.querySelector('[data-matrix-bridge]').textContent=f.bridge||'';s.page.querySelector('[data-matrix-detail]').textContent=f.detail;s.page.querySelector('[data-matrix-progress]').textContent=`${s.index+1} / ${frames.length}`;s.page.querySelector('[data-matrix-prev]').disabled=s.index===0;s.page.querySelector('[data-matrix-reset]').disabled=s.index===0;const next=s.page.querySelector('[data-matrix-next]');next.disabled=s.index===frames.length-1;next.textContent='下一步';if(f.scene==='mapping-rule')setMapping(s,s.mappingMode);else if(f.scene==='number-line')setNumberLine(s,s.numberLine);else if(f.scene==='fixed-coefficients')setFixedPoint(s,s.pointChoice);else if(['stretch-interactive','compare-interactive'].includes(f.scene))updatePipeline(s);else if(f.scene==='whole-plane')setPlane(s);fit(s);if(animate)animateScene(s);const announcer=document.getElementById('announcer');if(announcer)announcer.textContent=`第 ${s.index+1} 步，共 ${frames.length} 步：${f.caption}`;}
  function go(index){const s=active;if(!usable(s)||!Number.isFinite(Number(index)))return false;s.index=Math.max(0,Math.min(frames.length-1,Math.trunc(Number(index))));s.values=[1,2];s.rule=frames[s.index].scene==='stretch-interactive'?'D':'A';s.mappingMode='valid';s.numberLine=1;s.pointChoice='Q';paint(s,true);return true;}
  function reset(){if(usable(active))go(0);}
  function mount(lesson){if(typeof document==='undefined')return;cleanup();const page=lesson?.querySelector(':scope > .matrix-concepts');if(!page)return;const s={lesson,page,canvas:page.querySelector('.mcc-canvas'),stage:page.querySelector('.mcc-stage'),index:0,values:[1,2],rule:'A',mappingMode:'valid',numberLine:1,pointChoice:'Q',frame:0,animations:new Set(),observer:null,motionObserver:null,motionQuery:null};active=s;paint(s,false);if(typeof ResizeObserver!=='undefined'){s.observer=new ResizeObserver(()=>{if(!usable(s))return;cancelAnimationFrame(s.frame);s.frame=requestAnimationFrame(()=>fit(s));});s.observer.observe(s.stage);}s.onMotionChange=()=>{if(usable(s)&&reduced())cancelMotion(s);};if(typeof MutationObserver!=='undefined'){s.motionObserver=new MutationObserver(s.onMotionChange);s.motionObserver.observe(document.body,{attributes:true,attributeFilter:['class']});}s.motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');s.motionQuery?.addEventListener?.('change',s.onMotionChange);document.fonts?.ready.then(()=>{if(usable(s))fit(s);});}
  function advance(){if(typeof document==='undefined'||!usable(active)||document.querySelector('dialog[open]')||active.index>=frames.length-1)return false;return go(active.index+1);}
  if(typeof document!=='undefined'){
    document.addEventListener('click',event=>{if(!usable(active)||!active.page.contains(event.target))return;const b=event.target.closest('button');if(!b)return;const scene=frames[active.index].scene;if(b.hasAttribute('data-matrix-next'))advance();else if(b.hasAttribute('data-matrix-prev'))go(active.index-1);else if(b.hasAttribute('data-matrix-reset'))reset();else if(b.hasAttribute('data-matrix-jump'))go(b.dataset.matrixJump);else if(b.hasAttribute('data-matrix-mapping-mode')&&scene==='mapping-rule'){cancelMotion(active);setMapping(active,b.dataset.matrixMappingMode);animateScene(active);}else if(b.hasAttribute('data-matrix-point-choice')&&scene==='fixed-coefficients'){cancelMotion(active);setFixedPoint(active,b.dataset.matrixPointChoice);animateScene(active);}else if(b.hasAttribute('data-matrix-rule')&&['compare-interactive','whole-plane'].includes(scene)){cancelMotion(active);active.rule=b.dataset.matrixRule;if(scene==='whole-plane'){setPlane(active);animatePlane(active);}else updatePipeline(active);}});
    document.addEventListener('input',event=>{if(!usable(active)||!active.page.contains(event.target))return;const n=event.target,scene=frames[active.index].scene;if(n.matches('[data-matrix-numberline]')&&scene==='number-line'){cancelMotion(active);setNumberLine(active,Number(n.value));}else if(n.matches('[data-matrix-component]')&&['stretch-interactive','compare-interactive'].includes(scene)){const i=+n.dataset.matrixComponent,v=Number(n.value);if(![0,1].includes(i)||!Number.isFinite(v))return;cancelMotion(active);active.values[i]=Math.max(-1,Math.min(2,v));updatePipeline(active);}});
    window.addEventListener('resize',()=>fit());window.addEventListener('beforeprint',()=>{if(active){cancelMotion(active);}});
  }
  window.CourseMatrixConcepts={mount,advance,cleanup,frames};
})();
