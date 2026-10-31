/* 第二、三章課後練習；學生在作業本作答。 */
window.COURSE_REVIEW_QUESTIONS = [
  {
    "id": 1,
    "level": "basic",
    "chapter": "02",
    "title": "辨認命題",
    "html": "<p>按經典二值邏輯，以下哪一句是可以判斷真假的命題？選出一個答案。</p><ol type=\"A\"><li>請關上電腦。</li><li>你完成練習了嗎？</li><li><span class=\"review-formula\">3 &lt; 5</span></li><li><span class=\"review-formula\">x &lt; 5</span>（x 未指定數值，也沒有量詞）</li></ol>"
  },
  {
    "id": 2,
    "level": "basic",
    "chapter": "02",
    "title": "計算真值",
    "html": "<p>已知 <span class=\"review-formula\">P = F</span>、<span class=\"review-formula\">Q = T</span>，求以下兩式的真值，以 T 或 F 作答。</p><p class=\"review-formula\">① P → Q　② P ↔ Q</p>"
  },
  {
    "id": 3,
    "level": "basic",
    "chapter": "02",
    "title": "使用量詞",
    "html": "<p>論域為所有對象。令 <span class=\"review-formula\">S(x)</span> 表示「x 是學生」，<span class=\"review-formula\">H(x)</span> 表示「x 交了作業」。用量詞及邏輯連接詞寫出：</p><ol><li>所有學生都交了作業。</li><li>至少有一名學生交了作業。</li></ol>"
  },
  {
    "id": 4,
    "level": "basic",
    "chapter": "02",
    "title": "寫出產生式",
    "html": "<p>把「如果電池電量低於 20%，就顯示充電提醒」寫成一條 IF–THEN 產生式。</p>"
  },
  {
    "id": 5,
    "level": "basic",
    "chapter": "02",
    "title": "產生式系統的組成",
    "html": "<p>從「規則庫」「綜合數據庫」「控制系統」中，選出與以下兩項描述對應的名稱。</p><ol><li>存放某個領域的產生式規則集合。</li><li>存放問題求解過程中的當前事實。</li></ol>"
  },
  {
    "id": 6,
    "level": "basic",
    "chapter": "02",
    "title": "讀取框架",
    "html": "<p>閱讀以下設備框架：</p><div class=\"review-frame\"><p>&lt;設備&gt;</p><p>名稱：平板 A</p><p>電量：75%</p><ul><li>類型：百分比</li><li>範圍：0–100%</li><li>預設：100%</li></ul></div><ol><li>「電量」是槽名、槽值，還是側面名？</li><li>按此框架，若新設備未填寫電量，會讀取甚麼值？</li></ol>"
  },
  {
    "id": 7,
    "level": "basic",
    "chapter": "02",
    "title": "寫出知識圖譜三元組",
    "html": "<p>以下是虛構書本資料：「作者甲寫了書本 A；書本 A 有 120 頁。」</p><ol><li>用一個關係三元組表示作者與書本的關係。</li><li>用一個屬性三元組表示書本的頁數。</li></ol>"
  },
  {
    "id": 8,
    "level": "basic",
    "chapter": "03",
    "title": "辨認文字與子句",
    "html": "<p>a 是常量，P、Q 是謂詞。閱讀以下三式：</p><p class=\"review-formula\">① P(a)　② ¬P(a)　③ P(a) ∨ Q(a)</p><ol><li>哪些是「文字」？</li><li>哪些是「子句」？</li></ol><p>各小題可以選多項；同一式也可以符合兩種分類。</p>"
  },
  {
    "id": 9,
    "level": "basic",
    "chapter": "03",
    "title": "公式的基本變換",
    "html": "<p>分別完成以下指定的一步變換：</p><ol><li>只消去 <span class=\"review-formula\">P(x) → Q(x)</span> 中的 →。</li><li>把 <span class=\"review-formula\">¬(∀x(H(x)))</span> 的否定移到謂詞前。</li></ol>"
  },
  {
    "id": 10,
    "level": "basic",
    "chapter": "03",
    "title": "分配與分句",
    "html": "<p>a 是常量。使用分配律，把以下公式化為子句集。</p><p class=\"review-formula\">P(a) ∨ (Q(a) ∧ R(a))</p>"
  },
  {
    "id": 11,
    "level": "basic",
    "chapter": "03",
    "title": "消去存在量詞",
    "html": "<p>以下兩式分開處理，各自使用新的常量或 Skolem 函數消去存在量詞，保留全稱量詞。</p><p class=\"review-formula\">① ∃y(∀x(H(x, y)))</p><p class=\"review-formula\">② ∀x(∃y(H(x, y)))</p>"
  },
  {
    "id": 12,
    "level": "basic",
    "chapter": "03",
    "title": "歸結與合一",
    "html": "<p>a、b 是常量，x、y 是變元。完成以下兩小題：</p><ol><li>求 <span class=\"review-formula\">P(a) ∨ Q(a)</span> 與 <span class=\"review-formula\">¬P(a)</span> 的歸結式。</li><li>求 <span class=\"review-formula\">H(x, a)</span> 與 <span class=\"review-formula\">H(b, y)</span> 的合一替換，可以用文字或箭頭表示。</li></ol>"
  },
  {
    "id": 13,
    "level": "advanced",
    "chapter": "02",
    "title": "檢查推理是否成立",
    "html": "<p>一名學生說：「已知 <span class=\"review-formula\">P → Q</span> 為真，而且 Q 為真，所以可以斷言 P 為真。」</p><p>判斷這個推理是否成立，並用一組反例真值作簡短說明。</p>"
  },
  {
    "id": 14,
    "level": "advanced",
    "chapter": "02",
    "title": "追蹤前向推理",
    "html": "<p>只按以下虛構活動規則進行前向推理：</p><ul><li>r₁：IF 已報名 AND 帶學生證 THEN 可簽到</li><li>r₂：IF 可簽到 AND 已到場 THEN 已簽到</li><li>r₃：IF 已簽到 THEN 領取活動資料</li></ul><p>初始事實為「已報名」「帶學生證」「已到場」。依次列出每一步的規則編號與新增事實。</p>"
  },
  {
    "id": 15,
    "level": "advanced",
    "chapter": "03",
    "title": "用歸結反證法證明",
    "html": "<p>論域為所有對象。令 <span class=\"review-formula\">Student(x)</span> 表示「x 是學生」，<span class=\"review-formula\">Ready(x)</span> 表示「x 準備好了」；a 是常量，x 是變元。</p><p>已知以下兩個前提：</p><p class=\"review-formula\">∀x(Student(x) → Ready(x))</p><p class=\"review-formula\">Student(a)</p><p>用歸結反證法證明 <span class=\"review-formula\">Ready(a)</span>。寫出前提子句、否定目標、所用替換與兩步歸結。</p>"
  }
];
