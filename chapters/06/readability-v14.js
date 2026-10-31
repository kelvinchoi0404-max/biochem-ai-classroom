/* Chapter 06: retain every original character while aligning five tabbed definitions. */
(function () {
  'use strict';
  window.applyChapter06Readability = function (page) {
    if (!page.classList.contains('c06-page-26')) return;
    page.querySelectorAll('[data-source-id="c06-p26-text02"] > [data-paragraph]').forEach(paragraph => {
      const index = Number(paragraph.dataset.paragraph);
      if (index < 1 || index > 5 || paragraph.classList.contains('parameter-row')) return;
      const originalText = paragraph.textContent;
      const tabs = originalText.match(/\t+/);
      if (!tabs) return;
      const boundary = tabs.index + tabs[0].length;
      const doc = paragraph.ownerDocument;
      const walker = doc.createTreeWalker(paragraph, 4);
      let consumed = 0, endNode = null, endOffset = 0, node;
      while ((node = walker.nextNode())) {
        if (consumed + node.nodeValue.length >= boundary) {
          endNode = node; endOffset = boundary - consumed; break;
        }
        consumed += node.nodeValue.length;
      }
      if (!endNode) return;
      const originalHTML = paragraph.innerHTML;
      const range = doc.createRange();
      range.setStart(paragraph, 0);
      range.setEnd(endNode, endOffset);
      const symbol = doc.createElement('span');
      symbol.className = 'parameter-symbol';
      symbol.append(range.extractContents());
      const definition = doc.createElement('span');
      definition.className = 'parameter-definition';
      while (paragraph.firstChild) definition.append(paragraph.firstChild);
      paragraph.append(symbol, definition);
      if (paragraph.textContent !== originalText) { paragraph.innerHTML = originalHTML; return; }
      paragraph.classList.add('parameter-row');
    });
  };
})();
