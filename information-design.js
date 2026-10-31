(function () {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const readingsFor = chapter => (window.COURSE_READINGS || []).filter(r => (r.chapter || '01') === chapter);
  const reading = (chapter, page) => readingsFor(chapter).find(r => r.page === page);
  // Presentation-only imagery stays visible without an interactive affordance.
  const decorativePaths = new Set([
    'assets/photos/robot-arm-research-v3.jpg',
    'assets/photos/microlab.jpg',
    'assets/photos/human-neuron-v3.jpg',
    'assets/photos/nasa-thermocouple-probes-1977-v7.jpg',
    'assets/photos/road-interchange-v8.jpg',
    'assets/photos/cadre-mars-yard-v8.jpg',
    'assets/photos/maize-diversity-v9.jpg',
    'assets/generated/ai-lab-hero.png',
    'assets/generated/machine-vision-bench.png',
    'assets/generated/rule-model-v6.png',
    'assets/generated/knowledge-model-cover.png',
    'assets/generated/fuzzy-control-cover-v7.png',
    'assets/generated/search-strategy-cover-v8.png',
    'assets/generated/genetic-algorithm-cover-v9.png',
    'assets/generated/swarm-intelligence-cover-v10.png'
  ]);
  function canExplainImage(chapter, page, path) {
    return !decorativePaths.has(path) && !!imageNote(chapter, page, path).explanation;
  }
  function readingCard(r) {
    if (r.chapter === '02') return `<button class="reading-link reading-guide-trigger" data-reading-page="${r.page}" aria-haspopup="dialog"><span class="reading-eyebrow">延伸閱讀 · ${esc(r.publisher)}</span><strong>${esc(r.title)}<span aria-hidden="true">＋</span></strong></button>`;
    return `<a class="reading-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="延伸閱讀：${esc(r.title)}（${esc(r.language)}，新視窗）"><span class="reading-eyebrow">延伸閱讀 · ${esc(r.language)}</span><strong>${esc(r.title)}<span aria-hidden="true">↗</span></strong></a>`;
  }
  function render(html, {chapter, scene, slide}) {
    const template = document.createElement('template');
    template.innerHTML = html;
    let page = template.content.querySelector('.page');
    const video = (window.COURSE_VIDEOS || []).find(v => v.chapter === chapter.id && v.page === scene.page);
    if (video && chapter.id !== '01') {
      const title = page.querySelector('#page-title').outerHTML;
      const composition = page.querySelector('[class$="-composition"],.composition');
      const body = composition ? composition.innerHTML : (page.querySelector('.hero-body')?.innerHTML || '');
      const titleOnly = slide.texts.length === 1;
      template.innerHTML = `<section class="page reading resource-video-page resource-video-${chapter.id}-${scene.page}${titleOnly?' resource-video-intro':''}" data-page="${scene.page}" data-screen="${scene.page}" data-part="1" aria-labelledby="page-title"><div class="page-heading">${title}</div><div class="resource-video-composition"><article class="resource-source c${chapter.id}-page">${body}</article>${window.CourseVideo.card(video)}</div></section>`;
      page = template.content.querySelector('.page');
      if (titleOnly) {
        const introduction = chapter.id === '02' ? '找出「如果……就……」中的條件，再看條件成立時會執行甚麼動作。' : '同樣由前提得到結論，演繹與歸納對結論的保證程度有何不同？';
        page.querySelector('.resource-source').innerHTML = `<div class="watch-prompt"><span>帶着問題觀看</span><h2>${esc(video.focus)}</h2><p>${esc(introduction)}</p></div>`;
      }
      if (chapter.id === '05' && scene.page === 12) {
        const model = page.querySelector('.c05-model-copy');
        const photo = page.querySelector('.c05-photo');
        const table = model?.querySelector('table');
        if (model && photo && table) {
          const row = document.createElement('div');
          row.className = 'model-visual-row';
          row.append(table,photo);
          model.append(row);
        }
      }
    }
    page.classList.add('information-page');
    const r = reading(chapter.id, scene.page);
    if (r && page.querySelector('.page-heading')) {
      page.querySelector('.page-heading').classList.add('with-reading');
      page.querySelector('.page-heading').insertAdjacentHTML('beforeend', readingCard(r));
    }
    // Preserve source nodes and offsets. Frames follow existing concept groups.
    page.querySelectorAll('.content-group,.c02-group,.c03-group,.c04-group,.c05-group,.c06-group').forEach(group => {
      if (group.querySelector('.type-heading,.type-subheading') && group.querySelectorAll('.paragraph:not(.empty-paragraph)').length > 1) group.classList.add('concept-frame');
    });
    page.querySelectorAll('.type-heading,.type-subheading').forEach(heading => {
      const text = heading.textContent.trim();
      if (/例|應用|案例/.test(text)) heading.classList.add('heading-example');
      else if (/定義|概念|基本思想|基本原理/.test(text)) heading.classList.add('heading-concept');
      else if (/優點|缺點|特點|相同|不同/.test(text)) heading.classList.add('heading-comparison');
    });
    page.querySelectorAll('[data-image]').forEach(button => {
      const path = button.dataset.image;
      if (!canExplainImage(chapter.id,scene.page,path) || button.closest('.c03-source-blank,.c06-source-blank')) {
        const picture = document.createElement('div');
        picture.className = button.className + ' image-static';
        picture.dataset.imageRole = 'decorative';
        picture.append(...button.childNodes);
        button.replaceWith(picture);
        return;
      }
      const note = imageNote(chapter.id,scene.page,path);
      button.setAttribute('aria-label','查看圖片解釋：'+note.title);
    });
    return template.innerHTML;
  }
  function imageNote(chapter,page,path) {
    const notes = window.COURSE_IMAGE_NOTES || [];
    return notes.find(n => n.chapter === chapter && Number(n.page) === page && n.path === path) || notes.find(n => n.chapter === chapter && n.path === path) || {title:'圖片解釋',explanation:''};
  }
  function imageDialog(path,note) {
    return `<div class="image-explanation-layout"><div class="image-stage"><img class="image-full" src="${esc(path)}" alt="${esc(note.title)}"></div><article class="image-explanation"><span class="explanation-label">圖片解釋</span><p>${esc(note.explanation)}</p>${note.sourceUrl?`<a class="image-evidence" href="${esc(note.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(note.sourceLabel||'相關資料')} ↗</a>`:''}</article></div>`;
  }
  function readingDetail(chapter, page) {
    const r = reading(chapter, Number(page));
    if (!r) return '<p>本頁暫無延伸閱讀。</p>';
    return `<article class="reading-guide"><p class="reading-guide-meta">${esc(r.publisher)} · ${esc(r.language)} · ${esc(r.readingTime || '延伸閱讀')}</p><h3>${esc(r.title)}</h3><p>${esc(r.focus)}</p>${r.example ? `<p class="reading-guide-example">${esc(r.example)}</p>` : ''}<p class="reading-guide-note">${esc(r.note)}</p><div class="reading-guide-actions"><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">閱讀原文 ↗</a>${(r.related || []).map(link => `<a class="reading-related" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.title)} ↗</a>`).join('')}</div></article>`;
  }
  function readingDirectory(chapter = '01') {
    return '<p class="lead">按本章知識點選讀；外部資料會在新視窗開啟。</p>' + readingsFor(chapter).map(r=>`<article class="reading-record"><span class="label">第 ${r.page} 頁 · ${esc(r.language)}${r.readingTime ? ' · '+esc(r.readingTime) : ''}</span><h3><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)} ↗</a></h3><p class="reading-publisher">${esc(r.publisher)}</p><p>${esc(r.focus)}</p><p class="lead">${esc(r.note)}</p>${(r.related || []).map(link => `<p><a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.title)} ↗</a></p>`).join('')}<button data-page="${r.page}">回到知識點 →</button></article>`).join('');
  }
  document.addEventListener('click',event=>{if(event.target.closest('.reading-link,.image-evidence'))window.CourseVideo?.stopAll();});
  window.CourseInformation = {render,imageNote,imageDialog,canExplainImage,readingDirectory,readingDetail,hasReadings:chapter=>readingsFor(chapter).length>0};
})();
