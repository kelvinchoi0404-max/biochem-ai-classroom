/* Public Chapter 03 illustrations: supplementary models, with source pages intact. */
(function () {
  'use strict';
  const illustrations = [
  {
    "chapter": "03",
    "page": 6,
    "path": "assets/generated/ch03-01-reasoning-v38.png",
    "title": "推理方式：演繹、歸納與溯因",
    "explanation": "本節介紹演繹、歸納和默認推理。圖中另外示範溯因：根據觀察提出可能原因，之後還要驗證。",
    "sourceUrl": "assets/generated/ch03-01-reasoning-v38.png",
    "sourceLabel": "原尺寸圖片"
  },
  {
    "chapter": "03",
    "page": 13,
    "path": "assets/generated/ch03-02-chaining-v38.png",
    "title": "正向與逆向推理",
    "explanation": "正向從已知事實套用規則；逆向從目標追查需要成立的條件。逆向是在檢查前提，並非把「若P則Q」倒寫成「若Q則P」。",
    "sourceUrl": "assets/generated/ch03-02-chaining-v38.png",
    "sourceLabel": "原尺寸圖片"
  },
  {
    "chapter": "03",
    "page": 29,
    "path": "assets/generated/ch03-03-clauses-v38.png",
    "title": "子句與子句集",
    "explanation": "一條子句內用「或」，多條子句同時成立用「且」；圖右另加入已知事實P，整組並不等價於左側單獨的P→Q。",
    "sourceUrl": "assets/generated/ch03-03-clauses-v38.png",
    "sourceLabel": "原尺寸圖片"
  },
  {
    "chapter": "03",
    "page": 44,
    "path": "assets/generated/ch03-04-resolution-v38.png",
    "title": "歸結反演：加入否定，找到矛盾",
    "explanation": "把待證結論Q的否定¬Q加入已知前提；若歸結得到空子句，就證明前提推出Q。圖中是命題邏輯的例子；含變量時，還要先作合一。",
    "sourceUrl": "assets/generated/ch03-04-resolution-v38.png",
    "sourceLabel": "原尺寸圖片"
  },
  {
    "chapter": "03",
    "page": 30,
    "path": "assets/generated/ch03-05-skolem-v38.png",
    "title": "量詞次序與Skolem見證",
    "explanation": "∃y∀x可用同一個見證c；∀x∃y的見證可依x而定，用f(x)表示，但不強制不同x有不同見證。Skolem化保持可滿足性。",
    "sourceUrl": "assets/generated/ch03-05-skolem-v38.png",
    "sourceLabel": "原尺寸圖片"
  },
  {
    "chapter": "03",
    "page": 91,
    "path": "assets/generated/ch03-06-membership-v38.png",
    "title": "隸屬度：28°C有多符合「熱」？",
    "explanation": "本圖另設溫度模型：28°C對「熱」的隸屬度為0.8、對「暖」為0.7；隸屬度表示符合概念的程度，不是發生機率。",
    "sourceUrl": "assets/generated/ch03-06-membership-v38.png",
    "sourceLabel": "原尺寸圖片"
  },
  {
    "chapter": "03",
    "page": 98,
    "path": "assets/generated/ch03-07-relation-v38.png",
    "title": "模糊關係合成：先min，再max",
    "explanation": "圖中兩條示範路徑先取min，再取max，得到0.6；本頁矩陣例題採另一組數值。",
    "sourceUrl": "assets/generated/ch03-07-relation-v38.png",
    "sourceLabel": "原尺寸圖片"
  },
  {
    "chapter": "03",
    "page": 106,
    "path": "assets/generated/ch03-08-mamdani-v38.png",
    "title": "模糊控制：從溫度到風扇速度",
    "explanation": "此圖是另設的28°C風速模型，五個離散輸出點為0／25／50／75／100%，隸屬度為0／0.5／0.7／0.5／0.8，加權平均66%。本頁風門例題須依原題資料另算。",
    "sourceUrl": "assets/generated/ch03-08-mamdani-v38.png",
    "sourceLabel": "原尺寸圖片"
  }
];
  window.COURSE_CHAPTER03_ILLUSTRATIONS = illustrations;
  window.COURSE_IMAGE_NOTES = (window.COURSE_IMAGE_NOTES || []).concat(illustrations);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.CourseIllustrations = {
    find: path => illustrations.find(item => item.path === path),
    render(html, {chapter, scene}) {
      const item = illustrations.find(item => item.chapter === chapter.id && item.page === scene.page);
      if (!item) return html;
      const template = document.createElement('template');
      template.innerHTML = html;
      const page = template.content.querySelector('.c03-page');
      const source = page?.querySelector(':scope > .c03-composition, :scope > .clause-columns');
      if (!source) return html;
      page.classList.add('c03-inline-page');
      page.dataset.illustrationPage = String(item.page);
      const layout = document.createElement('div');
      layout.className = 'c03-inline-layout';
      const copy = document.createElement('div');
      copy.className = 'c03-inline-source';
      source.replaceWith(layout);
      copy.append(source);
      layout.append(copy);
      layout.insertAdjacentHTML('beforeend', '<figure class="c03-inline-figure" data-projection-ignore><button class="c03-illustration" data-generated-illustration data-image="'+esc(item.path)+'" aria-label="放大圖解：'+esc(item.title)+'"><img src="'+esc(item.path)+'" alt="'+esc(item.title)+'" width="'+([91,106].includes(item.page)?1774:1536)+'" height="'+([91,106].includes(item.page)?887:1024)+'" decoding="async"></button></figure>');
      return template.innerHTML;
    },
    media: (chapter, page) => illustrations.filter(item => item.chapter === chapter && item.page === page).map(item => ({...item, generated:true, creator:'OpenAI內置圖像生成工具', note:item.explanation, pages:[item.page]}))
  };
})();
