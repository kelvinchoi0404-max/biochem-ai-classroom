/* The application owns routing, the common header and delegated click handling. */
(function () {
  'use strict';
  const escapeHTML = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function chapterRow(chapter, index) {
    const number = String(chapter.number || index + 1).padStart(2, '0');
    const title = escapeHTML(chapter.title);
    const available = chapter.available === true;
    const pageCount = chapter.formalPages ? chapter.formalPages + ' 頁 · ' + chapter.supplementPages + ' 補充' : chapter.pages + ' 頁';
    const count = Number.isInteger(chapter.pages) && chapter.pages > 0
      ? '<span class="home-chapter-pages">' + pageCount + '</span>' : '';
    const content = '<span class="home-chapter-number" aria-hidden="true">' + escapeHTML(number) + '</span>' +
      '<span class="home-chapter-copy"><span class="home-chapter-title">' + title + '</span>' +
      (available ? '<span class="home-chapter-meta">' + count + '<span>進入章節</span></span>' : '') + '</span>' +
      (available ? '<span class="home-chapter-arrow" aria-hidden="true">↗</span>' : '<span class="home-chapter-pending">待加入</span>');
    return '<li class="home-chapter ' + (available ? 'is-available' : 'is-pending') + '">' +
      (available
        ? '<button type="button" class="home-chapter-entry" data-chapter="' + escapeHTML(chapter.id) +
          '" aria-label="第 ' + escapeHTML(number) + ' 章：' + title + '，進入章節">' + content + '</button>'
        : '<div class="home-chapter-entry" aria-disabled="true" aria-label="第 ' + escapeHTML(number) +
          ' 章：' + title + '，待加入">' + content + '</div>') + '</li>';
  }

  window.renderCourseHome = function (catalog) {
    const chapters = Array.isArray(catalog) ? catalog : [];
    return '<section id="course-home" class="course-home" aria-label="課程首頁">' +
      '<div class="home-cover">' +
        '<div class="home-cover-main">' +
          '<img class="home-cover-photo" src="assets/generated/ai-lab-hero.png" alt="AI 生成的機器人研究實驗室概念場景" width="1672" height="941" fetchpriority="high">' +
          '<div class="home-cover-copy"><p class="home-cover-kicker">高一11</p>' +
            '<h1><span class="home-cover-name">生化 <span lang="en">AI</span></span><span class="home-cover-subject">人工智能課程</span></h1>' +
            '<p class="home-cover-intro">理解智能，探索生命科學。</p>' +
          '</div>' +
        '</div>' +
        '<div class="home-cover-foot">' +
          '<img class="home-model-photo" src="assets/generated/knowledge-model-cover.png" alt="AI 生成的知識表示概念場景：分子教具與相連的實體節點" width="1672" height="941">' +
          '<p>從知識到模型，<br>從模型到行動。</p>' +
        '</div>' +
      '</div>' +
      '<div class="home-directory" aria-labelledby="home-directory-title">' +
        '<a class="home-exam-entry" href="exam-review.html"><span><strong>考試複習題庫</strong><small>第一段範圍 · 選擇、是非與解答 · 隨機練習</small></span><span aria-hidden="true">↗</span></a>' +
        '<div class="home-directory-heading"><h2 id="home-directory-title">章節目錄</h2><span class="home-directory-count">' + chapters.length + ' 章</span></div>' +
        '<ol class="home-chapter-list">' + chapters.map(chapterRow).join('') + '</ol>' +
      '</div>' +
    '</section>';
  };
}());
