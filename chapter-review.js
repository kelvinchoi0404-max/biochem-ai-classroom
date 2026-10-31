(function () {
  'use strict';
  const questions = window.COURSE_REVIEW_QUESTIONS || [];
  if (questions.length !== 15 || questions.filter(q => q.level === 'basic').length !== 12 ||
      questions.filter(q => q.level === 'advanced').length !== 3 ||
      questions.some((q, i) => q.id !== i + 1)) throw Error('Invalid notebook review questions');
  const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const plain = html => html.replace(/<\/[^>]+>/g, '\n').replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const list = level => questions.filter(q => q.level === level).map(q =>
    '<li class="review-question' + (q.id === 1 ? ' is-current' : '') + '" id="review-question-' + q.id + '" data-review-question="' + q.id + '" data-review-level="' + q.level + '">' +
    '<h3><span class="review-number">' + q.id + '.</span> ' + escape(q.title) + '</h3><div class="review-prompt">' + q.html + '</div></li>'
  ).join('');
  const title = '第二、三章課後作業';
  const instructions = '請在作業本寫下題號、答案及必要過程，不必抄題目。';
  const html = '<section class="page supplement chapter-review" data-page="122" aria-labelledby="page-title">' +
    '<header class="review-heading"><h1 id="page-title">' + title + '</h1><p>' + instructions + '</p></header>' +
    '<div class="review-scroll" tabindex="0" role="region" aria-label="課後作業題目">' +
    '<section class="review-group" aria-labelledby="review-basic-title"><h2 id="review-basic-title">基礎題 <span>12 題 · 80%</span></h2><ol class="review-list">' + list('basic') + '</ol></section>' +
    '<section class="review-group" aria-labelledby="review-advanced-title"><h2 id="review-advanced-title">深入題 <span>3 題 · 20%</span></h2><ol class="review-list" start="13">' + list('advanced') + '</ol></section></div>' +
    '<nav class="review-navigation" aria-label="切換作業題目"><label>題目 <select data-review-select aria-label="選擇題號">' + questions.map(q => '<option value="' + q.id + '">' + q.id + ' / 15</option>').join('') + '</select></label><div><button type="button" data-review-prev disabled>上一題</button><button type="button" data-review-next>下一題</button></div></nav></section>';
  const text = [title, instructions, '基礎題12題（80%），深入題3題（20%）', ...questions.map(q => q.id + '. ' + q.title + '\n' + plain(q.html))].join('\n\n');
  window.COURSE_SUPPLEMENTS = [...(window.COURSE_SUPPLEMENTS || []), {
    chapter: '03', page: 122, number: 13, after: 49, section: 25,
    slug: 'chapter-review.html', title, text, html, images: [], kind: 'notebook-review'
  }];
  function selectQuestion(page, id) {
    const selected = Math.max(1, Math.min(questions.length, id));
    page.querySelectorAll('[data-review-question]').forEach(q => q.classList.toggle('is-current', Number(q.dataset.reviewQuestion) === selected));
    page.querySelector('[data-review-select]').value = String(selected);
    page.querySelector('[data-review-prev]').disabled = selected === 1;
    page.querySelector('[data-review-next]').disabled = selected === questions.length;
    page.querySelector('.review-scroll').scrollTop = 0;
    page.dataset.reviewQuestion = String(selected);
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-review-prev],[data-review-next]');
      if (!button) return;
      const page = button.closest('.chapter-review');
      selectQuestion(page, Number(page.querySelector('[data-review-select]').value) + (button.hasAttribute('data-review-next') ? 1 : -1));
    });
    document.addEventListener('change', event => {
      if (event.target.matches('[data-review-select]')) selectQuestion(event.target.closest('.chapter-review'), Number(event.target.value));
    });
    document.addEventListener('keydown', event => {
      const page = document.querySelector('#lesson .chapter-review');
      if (!page || document.querySelector('dialog[open]') || event.altKey || event.ctrlKey || event.metaKey ||
          event.target.closest('input,textarea,select,[contenteditable],button,a')) return;
      if (!['PageDown','PageUp',' ','Home','End'].includes(event.key)) return;
      event.preventDefault();event.stopImmediatePropagation();
      const current = Number(page.querySelector('[data-review-select]').value);
      selectQuestion(page, event.key === 'Home' ? 1 : event.key === 'End' ? 15 : current + (event.key === 'PageUp' || event.shiftKey ? -1 : 1));
    }, true);
  }
})();
