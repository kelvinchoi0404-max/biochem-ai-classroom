(function () {
  'use strict';
  function keepPhrase(paragraph, phrase) {
    const start = paragraph.textContent.indexOf(phrase);
    if (start < 0) return;
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let offset = 0, foundStart = false;
    while (walker.nextNode()) {
      const node = walker.currentNode, end = offset + node.length;
      if (!foundStart && start < end) {
        range.setStart(node, start - offset);
        foundStart = true;
      }
      if (foundStart && start + phrase.length <= end) {
        range.setEnd(node, start + phrase.length - offset);
        const group = document.createElement('span');
        group.className = 'keep-term';
        group.append(range.extractContents());
        range.insertNode(group);
        return;
      }
      offset = end;
    }
  }
  function render(html, {chapter}) {
    const template = document.createElement('template');
    template.innerHTML = html;
    const page = template.content.querySelector('.page');
    if (!page) return html;
    page.classList.add('readability-page');
    page.dataset.readabilityChapter = chapter.id;
    if (chapter.id === '01') {
      const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
      const candidates = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement.closest('.paragraph') && !node.parentElement.closest('.keep-term,.math-unit') && /深度學習|機器學習|人工智能技術|知識圖譜|社會影響/.test(node.data)) candidates.push(node);
      }
      candidates.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.data.split(/(深度學習|機器學習|人工智能技術|知識圖譜|社會影響)/).forEach((part, index) => {
          if (index % 2) {
            const term = document.createElement('span');
            term.className = 'keep-term';
            term.textContent = part;
            fragment.append(term);
          } else fragment.append(document.createTextNode(part));
        });
        node.replaceWith(fragment);
      });
    }
    if (chapter.id === '03' && page.dataset.page === '99') {
      page.querySelectorAll('.paragraph').forEach(paragraph => {
        ['如果  （條件）', '則  （結論）', '如果  壓力較高', '溫度在慢慢上升', '則  閥門略開'].forEach(phrase => keepPhrase(paragraph, phrase));
      });
    }
    page.querySelectorAll('.paragraph').forEach(paragraph => {
      if (paragraph.querySelector('.math-display')) paragraph.classList.add('has-display-formula');
      const text = paragraph.textContent.trim();
      if (paragraph.querySelector('.math-formula,.math-term,.math-operator,.c03-native-math,.c06-native-math') && !/[\u3400-\u9fff]/.test(text)) paragraph.classList.add('formula-only-line');
      if (paragraph.querySelector(':scope > .term-label')) paragraph.classList.add('labelled-paragraph');
    });
    if (chapter.id === '06') window.applyChapter06Readability?.(page);
    return template.innerHTML;
  }
  window.CourseReadability = {render};
})();
