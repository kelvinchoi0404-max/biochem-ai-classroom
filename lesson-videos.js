/* Short, optional classroom films. Remote players are created only on request. */
(function () {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const videos = () => window.COURSE_VIDEOS || window.CHAPTER_01_VIDEOS || [];
  const find = id => videos().find(video => video.id === id);
  const time = seconds => Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  function poster(video) {
    return `<button class="film-poster" data-load-video="${escape(video.id)}" aria-label="載入影片：${escape(video.title)}"><img src="${escape(video.poster)}" alt="" width="1280" height="720"><span class="film-load"><span class="film-play" aria-hidden="true">▶</span><span>載入影片</span></span></button>`;
  }
  function card(video) {
    return `<aside class="lesson-film" data-video-id="${escape(video.id)}" aria-label="延伸短片：${escape(video.title)}"><div class="film-frame">${poster(video)}</div><div class="film-caption"><div class="film-title-row"><h2 class="film-title">${escape(video.title)}</h2><span class="film-duration">${time(video.durationSeconds)}</span></div><p class="film-language">${escape(video.languageLabel)}${video.segmentLabel ? ' · ' + escape(video.segmentLabel) : ''}${video.notice?'<span class="film-notice"> · 1:52–1:56 有閃光畫面</span>':''}</p><p class="film-focus">${escape(video.focus)}</p><div class="film-actions"><a href="${escape(video.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(video.publisher)} · 原站觀看 ↗</a><button data-close-video="${escape(video.id)}" hidden>收起影片</button></div></div></aside>`;
  }
  function reset(card, restoreFocus = false) {
    const video = find(card.dataset.videoId);
    if (!video) return;
    card.querySelector('.film-frame').innerHTML = poster(video);
    card.querySelector('[data-close-video]').hidden = true;
    card.removeAttribute('data-loaded');
    if (restoreFocus) card.querySelector('[data-load-video]').focus({preventScroll:true});
  }
  function stopAll() {
    document.querySelectorAll('.lesson-film[data-loaded]').forEach(card => reset(card));
  }
  document.addEventListener('click', event => {
    if (event.target.closest('.film-actions a')) { stopAll(); return; }
    const close = event.target.closest('[data-close-video]');
    if (close) { reset(close.closest('.lesson-film'), true); return; }
    const button = event.target.closest('[data-load-video]');
    if (!button) return;
    const video = find(button.dataset.loadVideo);
    if (!video) return;
    const url = new URL(video.embedUrl);
    if (!['https://embed.ted.com', 'https://www.youtube-nocookie.com'].includes(url.origin)) return;
    stopAll();
    const card = button.closest('.lesson-film');
    const iframe = document.createElement('iframe');
    iframe.title = video.title + ' — ' + video.publisher;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allow = 'encrypted-media; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.src = url.href;
    card.querySelector('.film-frame').replaceChildren(iframe);
    card.dataset.loaded = 'true';
    iframe.focus({preventScroll:true});
    card.querySelector('[data-close-video]').hidden = false;
    document.getElementById('announcer').textContent = '已載入影片播放器。請按播放器的播放鍵；' + video.languageLabel;
  });
  function directory(chapterId = '01') {
    return '<p class="lead">按知識點選用；影片須連線，播放及字幕由原平台提供。若播放器未能載入，可開啟片名下的原網站連結。</p>' + videos().filter(v => (v.chapter || '01') === chapterId).map(v => `<article class="film-record"><div><span class="label">第 ${v.page} 頁 · ${time(v.durationSeconds)}</span><h3>${escape(v.title)}</h3><p>${escape(v.languageLabel)}${v.segmentLabel ? ' · ' + escape(v.segmentLabel) + (v.fullDurationSeconds ? ' · 原片 ' + time(v.fullDurationSeconds) : '') : ''}</p>${v.notice?'<p class="film-notice">'+escape(v.notice)+'</p>':''}<p>${escape(v.why)}</p><a href="${escape(v.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(v.publisher)} · 原影片 ↗</a></div><button data-page="${v.page}">前往本頁 →</button></article>`).join('');
  }
  window.CourseVideo = {card, stopAll, directory};
  window.addEventListener('pagehide', stopAll);
  window.renderChapter01VideoPage = function (scene, context) {
    const video = videos().find(v => (v.chapter || '01') === '01' && v.page === scene.page);
    if (!video) return null;
    const {slides, renderFragment, imageFigure, titleText} = context;
    const slide = slides[scene.page - 1];
    const fragments = scene.fragments.map(f => renderFragment(f));
    const originals = slide.images.map(im => imageFigure(im)).join('');
    let content = '';
    if (scene.page === 9) {
      content = `<article class="film-text">${fragments.join('')}</article><div class="film-side">${card(video)}<div class="film-originals turing-originals">${originals}</div></div>`;
    } else if (scene.page === 19) {
      content = `<div class="film-intro game-quote">${fragments[0]}</div><article class="film-text game-body">${fragments.slice(1).join('')}</article>${card(video)}`;
    } else if (scene.page === 22) {
      content = `<article class="film-text">${fragments.join('')}</article>${card(video)}<div class="film-originals learning-originals">${originals}</div>`;
    } else if (scene.page === 29) {
      content = `<div class="film-intro">${fragments[0]}</div><article class="film-text">${fragments.slice(1).join('')}</article>${card(video)}`;
    } else if (scene.page === 31) {
      content = `<article class="film-text ethics-columns">${fragments.join('')}</article>${card(video)}`;
    } else {
      content = `<article class="film-text">${fragments.join('')}</article>${card(video)}`;
    }
    return `<section class="page reading page-${slide.n} video-lesson video-page-${slide.n}" data-page="${slide.n}" data-screen="${slide.n}" data-part="1" aria-labelledby="page-title"><div class="page-heading">${titleText(slide.texts[0])}</div><div class="video-composition">${content}</div></section>`;
  };
})();
