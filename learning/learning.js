(function () {
  'use strict';
  const E = window.CoursePracticeEngine;
  const learningScriptUrl = document.currentScript?.src || new URL('learning/learning.js', location.href).href;
  let rendererLoading = null;
  function loadScript(name) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL(name + '?v=16', learningScriptUrl).href;
      script.onload = () => resolve();
      script.onerror = () => { script.remove(); reject(new Error('format unavailable')); };
      document.head.append(script);
    });
  }
  async function loadChatRenderer() {
    if (window.CourseChatRenderer) return true;
    if (!rendererLoading) rendererLoading = (async () => {
      await Promise.all([
        window.marked ? null : loadScript('vendor/marked.js'),
        window.DOMPurify ? null : loadScript('vendor/dompurify.js'),
        window.katex ? null : loadScript('vendor/katex.js')
      ]);
      await loadScript('chat-renderer.js');
    })().catch(() => { rendererLoading = null; throw new Error('format unavailable'); });
    try {
      await rendererLoading; chat.formatError = ''; return true;
    } catch {
      chat.formatError = '文字排版未能載入，目前以分段文字顯示。可按「重新連線」重試。'; return false;
    }
  }
  function renderAnswer(text, host) {
    if (window.CourseChatRenderer) return window.CourseChatRenderer.render(text, host);
    for (const paragraph of text.split(/\n\s*\n/)) host.append(node('p', { class: 'ai-plain-text' }, paragraph));
  }
  function node(tag, attrs = {}, text = '') {
    const n = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'class') n.className = val;
      else n.setAttribute(key, String(val));
    }
    if (text) n.textContent = text;
    return n;
  }
  function button(text, action, cls = 'learning-secondary') {
    const b = node('button', { type: 'button', class: cls }, text);
    b.addEventListener('click', action); return b;
  }
  function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
  const modal = node('dialog', { id: 'learning-dialog', class: 'learning-dialog', 'aria-labelledby': 'learning-title' });
  const head = node('header', { class: 'learning-head' });
  const heading = node('div'), kicker = node('span', { class: 'learning-kicker' });
  const title = node('h2', { id: 'learning-title' });
  heading.append(kicker, title);
  head.append(heading, button('關閉 ×', () => modal.close(), 'learning-close'));
  head.lastElementChild.setAttribute('aria-label', '關閉學習面板');
  const body = node('div', { class: 'learning-body' });
  modal.append(head, body); document.body.append(modal);
  let returnFocus = null, active = '', context = null;
  modal.addEventListener('close', () => {
    cancelQuestion(); active = '';
    returnFocus?.focus({ preventScroll: true });
  });
  function open(kind, label, ctx) {
    if (active === 'ai') cancelQuestion();
    window.CourseVideo?.stopAll();
    returnFocus = document.activeElement;
    document.querySelector('#drawer[open]')?.close();
    context = ctx; active = kind;
    kicker.textContent = '第 ' + Number(ctx.chapter) + ' 章 · ' + (kind === 'ai' ? (ctx.pageLabel || '第 ' + ctx.page + ' 頁') : '理解與應用');
    title.textContent = label;
    modal.classList.toggle('is-ai', kind === 'ai');
    body.className = 'learning-body' + (kind === 'ai' ? ' ai-body' : '');
    body.replaceChildren();
    if (!modal.open) modal.showModal();
    head.querySelector('button').focus();
  }
  function refs(parent, chapter, pages) {
    const row = node('div', { class: 'practice-reference' });
    for (const page of pages || []) {
      if (!Number.isInteger(page) || page < 1 || page > (window.COURSE_CHAPTERS.find(c => c.id === chapter)?.pages || 0)) continue;
      row.append(button('回看' + (window.CoursePageLabels?.label(chapter,page) || '第 ' + page + ' 頁') + ' ↗', () => {
        modal.close(); window.CourseNavigation.openChapter(chapter, page);
      }, 'ai-source'));
    }
    parent.append(row);
  }
  function nextChapter(parent, ch) {
    const next = window.COURSE_CHAPTERS.find(c => c.number === Number(ch) + 1 && c.available);
    parent.append(button(next ? '繼續下一章 →' : '返回課程首頁', () => {
      modal.close();
      if (next) window.CourseNavigation.openChapter(next.id, 1);
      else window.CourseNavigation.showHome();
    }));
  }
  let state = null, bank = [], selected = null, savingFailed = false;
  const keyFor = ch => 'biochem.practice.v1.' + ch;
  function savePractice() { savingFailed = !write(keyFor(state.chapter), state); }
  function begin(ch, resume) {
    bank = window.COURSE_QUESTION_BANK?.chapters[ch] || [];
    if (!bank.length) return;
    state = resume || E.create(bank, ch, window.COURSE_QUESTION_BANK.version, 8);
    selected = null; savePractice(); renderQuestion();
  }
  function intro(ch) {
    const section = node('section', { class: 'practice-intro' });
    section.append(node('h3', {}, '學完這一章，試著自己判斷。'));
    section.append(node('p', {}, '每次隨機抽取 8 題，包含概念辨析與應用。先選答案，再查看解析與相關課文。'));
    const stats = node('div', { class: 'practice-stats' });
    for (const [value, label] of [[bank.length, '題可抽選'], [Math.min(8, bank.length), '題一組'], ['不限時', '依自己的節奏']]) {
      const item = node('div'); item.append(node('strong', {}, String(value)), node('span', {}, label)); stats.append(item);
    }
    section.append(stats);
    section.append(node('p', { class: 'learning-notice' }, '目前題目依本章課件與概念校核編寫，尚待書本全文覆核。這是章末自練，不計作正式考試成績。'));
    const saved = read(keyFor(ch));
    const valid = E.valid(saved, bank, ch, window.COURSE_QUESTION_BANK.version);
    const actions = node('div', { class: 'learning-actions' });
    if (valid) {
      actions.append(button(saved.completed ? '查看上次結果' : '繼續上次練習', () => {
        state = saved; selected = null;
        saved.completed ? renderResult() : renderQuestion();
      }, 'learning-primary'));
    }
    actions.append(button(valid ? '重新抽一組' : '開始隨機自測', () => {
      if (valid && !saved.completed) restartPrompt(ch);
      else begin(ch);
    }, valid ? 'learning-secondary' : 'learning-primary'));
    nextChapter(actions, ch); section.append(actions);
    section.append(node('p', { class: 'learning-muted' }, '練習進度只保存在此瀏覽器；不會提交給老師。'));
    body.replaceChildren(section);
  }
  function restartPrompt(ch) {
    const box = node('section', { class: 'practice-restart' });
    box.append(node('h3', {}, '重新抽題'), node('p', {}, '開始新一組會取代這一章目前保存的練習進度。'));
    const actions = node('div', { class: 'learning-actions' });
    actions.append(button('開始新一組', () => begin(ch), 'learning-primary'), button('保留目前進度', () => intro(ch)));
    box.append(actions); body.replaceChildren(box);
  }
  function renderQuestion() {
    const q = bank.find(x => x.id === state.ids[state.cursor]);
    if (!q) return intro(state.chapter);
    const locked = Object.hasOwn(state.answers, q.id);
    selected = locked ? state.answers[q.id] : null;
    const wrap = node('section', { class: 'practice-question', 'aria-label': '第 ' + (state.cursor + 1) + ' 題' });
    const line = node('div', { class: 'practice-topline' });
    line.append(node('strong', {}, String(state.cursor + 1).padStart(2, '0') + ' / ' + state.ids.length), node('span', {}, q.topic));
    const meter = node('div', { class: 'practice-meter', 'aria-hidden': 'true' }), fill = node('span');
    fill.style.width = ((state.cursor + 1) / state.ids.length * 100) + '%'; meter.append(fill);
    wrap.append(line, meter, node('h3', { class: 'practice-stem', id: 'practice-stem' }, q.stem));
    if (q.prerequisites?.length) {
      const conditions = node('div', { class: 'practice-conditions' });
      conditions.append(node('strong', {}, '作答條件'), node('span', {}, q.prerequisites.join(' ')));
      wrap.append(conditions);
    }
    const options = node('div', { class: 'practice-options', role: 'radiogroup', 'aria-labelledby': 'practice-stem' });
    const optionButtons = [];
    state.orders[q.id].forEach((oid, i) => {
      const option = q.options.find(o => o.id === oid);
      const b = button('', () => {
        if (locked) return;
        selected = oid;
        optionButtons.forEach(item => item.setAttribute('aria-checked', String(item.dataset.optionId === oid)));
        confirm.disabled = false;
      }, 'practice-option');
      b.dataset.optionId = oid; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(selected === oid));
      b.append(node('span', { class: 'option-letter', 'aria-hidden': 'true' }, 'ABCD'[i]), node('span', {}, option.text));
      if (locked) {
        b.disabled = true;
        if (oid === q.answer) { b.classList.add('is-correct'); b.append(node('span', { class: 'sr-only' }, '正確答案')); }
        else if (oid === selected) { b.classList.add('is-wrong'); b.append(node('span', { class: 'sr-only' }, '你的答案，需要訂正')); }
      }
      optionButtons.push(b); options.append(b);
    });
    options.addEventListener('keydown', e => {
      if (locked || !['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault();
      const at = optionButtons.indexOf(document.activeElement);
      const delta = ['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : -1;
      const b = optionButtons[(at + delta + optionButtons.length) % optionButtons.length];
      b.focus(); b.click();
    });
    wrap.append(options);
    if (locked) {
      const feedback = node('div', { class: 'practice-status', role: 'status' });
      feedback.append(node('h4', {}, selected === q.answer ? '答對了' : '一起看看這一步'), node('p', {}, q.explanation));
      if (selected !== q.answer) feedback.prepend(node('p', { class: 'practice-picked' }, '正確答案：' + q.options.find(o => o.id === q.answer).text));
      refs(feedback, state.chapter, q.pages); wrap.append(feedback);
    }
    const stepbar = node('div', { class: 'practice-stepbar' });
    const previous = button('← 上一題', () => { state.cursor--; savePractice(); renderQuestion(); });
    previous.disabled = state.cursor === 0;
    const confirm = button(locked ? (state.cursor === state.ids.length - 1 ? '查看本次結果' : '下一題 →') : '確認答案', () => {
      if (!locked) {
        if (!selected) return;
        state.answers[q.id] = selected; savePractice(); renderQuestion();
      } else if (state.cursor < state.ids.length - 1) {
        state.cursor++; savePractice(); renderQuestion();
      } else {
        const missing = state.ids.findIndex(id => !Object.hasOwn(state.answers, id));
        if (missing >= 0) { state.cursor = missing; savePractice(); renderQuestion(); }
        else { state.completed = true; savePractice(); renderResult(); }
      }
    }, 'learning-primary');
    confirm.disabled = !locked;
    const actions = node('div', { class: 'learning-actions' });
    actions.append(confirm); stepbar.append(previous, actions); wrap.append(stepbar);
    if (savingFailed) wrap.append(node('p', { class: 'learning-notice', role: 'status' }, '瀏覽器未能保存進度。這次仍可作答，關閉或重新整理後可能需要重新開始。'));
    body.replaceChildren(wrap); body.scrollTop = 0;
  }
  function renderResult() {
    const result = E.grade(state, bank), wrap = node('section', { class: 'practice-result' });
    wrap.append(node('h3', {}, '把答案連回你的理解。'));
    const score = node('div', { class: 'practice-result-score' }, String(result.correct));
    score.append(node('span', {}, ' / ' + result.total + ' 題')); wrap.append(score);
    wrap.append(node('p', {}, result.correct === result.total ? '這一組全部答對。可以再抽一組，檢查不同知識點。' : '展開題目，看看是哪個條件、符號或步驟需要再確認。'));
    const actions = node('div', { class: 'learning-actions' });
    actions.append(button('再抽一組', () => begin(state.chapter), 'learning-primary'));
    nextChapter(actions, state.chapter); wrap.append(actions);
    result.results.forEach((r, i) => {
      const q = bank.find(x => x.id === r.id), detail = node('details', { class: 'practice-review' });
      detail.append(node('summary', {}, (r.correct ? '✓ ' : '↺ ') + (i + 1) + '. ' + q.stem));
      if (q.prerequisites?.length) detail.append(node('p', { class: 'practice-picked' }, '作答條件：' + q.prerequisites.join(' ')));
      detail.append(node('p', { class: 'practice-picked' }, '你的答案：' + (q.options.find(o => o.id === r.selected)?.text || '未作答')));
      detail.append(node('p', {}, '正確答案：' + q.options.find(o => o.id === q.answer).text), node('p', {}, q.explanation));
      refs(detail, state.chapter, q.pages); wrap.append(detail);
    });
    wrap.append(node('p', { class: 'learning-muted' }, '本次結果保存在此裝置，未提交給老師。'));
    body.replaceChildren(wrap); body.scrollTop = 0;
  }
  window.CoursePractice = { open(ch) {
    const ctx = window.CourseNavigation.getContext();
    ch = ch || ctx.chapter;
    const chapter = window.COURSE_CHAPTERS.find(c => c.id === ch);
    if (!chapter) return;
    bank = window.COURSE_QUESTION_BANK?.chapters[ch] || [];
    open('practice', '章末自測', { ...ctx, chapter: ch, page: chapter.lastPage??chapter.pages });
    if (!bank.length) { body.append(node('p', {}, '本章題目正在整理中。')); return; }
    intro(ch);
  } };
  const storedChat = read('biochem.ai.local.v1');
  const chat = {
    messages: (Array.isArray(storedChat?.messages) ? storedChat.messages : []).filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').slice(-30).map(m => ({
      role: m.role, content: m.content.slice(0, 30000), sources: Array.isArray(m.sources) ? m.sources.slice(0, 12) : [],
      kind: m.kind === 'image' ? 'image' : 'chat', truncated: m.truncated === true,
      followups: cleanFollowups(m.followups),
      imageIds: Array.isArray(m.imageIds) ? m.imageIds.filter(x => typeof x.id === 'string').slice(0, 1).map(x => ({ id: x.id, alt: String(x.alt || '').slice(0, 1500) })) : []
    })),
    draft: typeof storedChat?.draft === 'string' ? storedChat.draft.slice(0, 4000) : '',
    busy: false, partial: '', startedAt: 0, capabilities: null, error: '', formatError: '', controller: null, pending: null
  };
  let conversation, draftInput, send, cancelButton, status, capStatus, checkButton;
  let chatReturnView = null;
  function visitChatSource(chapter, page) {
    chatReturnView = {
      context: { ...context }, children: [...body.childNodes],
      scrollTop: conversation.scrollTop, renderer: window.CourseChatRenderer,
      hadPending: chat.busy
    };
    syncAIEntryAvailability();
    modal.close();
    window.CourseNavigation.openChapter(chapter, page);
  }
  function resumeChat() {
    const saved = chatReturnView;
    chatReturnView = null;
    open('ai', 'AI 答疑', window.CourseNavigation.getContext());
    body.append(...saved.children);
    syncChatContext();
    conversation.scrollTop = saved.scrollTop;
    // Reuse the existing conversation and composer, including loaded images.
    // Only rebuild if an answer was cancelled or formatting became ready away.
    if (saved.hadPending || saved.renderer !== window.CourseChatRenderer) renderMessages('preserve');
    refreshStatus();
    syncAIEntryAvailability();
  }
  function saveChat() {
    return write('biochem.ai.local.v1', { messages: chat.messages.slice(-30).map(({ images, ...m }) => m), draft: chat.draft });
  }
  function syncChatContext() {
    if (!window.CourseNavigation.isContextReady()) return null;
    const current = window.CourseNavigation.getContext();
    if (current.home) return null;
    context = { ...current };
    kicker.textContent = '第 ' + Number(current.chapter) + ' 章 · ' + (current.pageLabel || '第 ' + current.page + ' 頁');
    const strip = body.querySelector('.ai-context');
    if (strip) {
      strip.replaceChildren(node('strong', {}, '當前課文'), node('span', {}, (current.chapterTitle || '') + ' · ' + current.title));
      strip.dataset.chapter = current.chapter;
      strip.dataset.page = current.page;
    }
    return { ...current };
  }
  let imageDB;
  function openImageDB() {
    if (!imageDB) imageDB = new Promise((resolve, reject) => {
      const request = indexedDB.open('biochem.ai.images.v1', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('images');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    }).catch(() => { imageDB = null; return null; });
    return imageDB;
  }
  async function readImage(id) {
    const db = await openImageDB(); if (!db) return null;
    return new Promise(resolve => {
      const request = db.transaction('images').objectStore('images').get(id);
      request.onsuccess = () => resolve(request.result); request.onerror = () => resolve(null);
    });
  }
  async function clearImages() {
    const db = await openImageDB(); if (db) db.transaction('images', 'readwrite').objectStore('images').clear();
  }
  function restoreQuestion(pending) {
    if (!pending) return;
    chat.draft = pending.message;
    if (draftInput) draftInput.value = pending.message;
    const at = chat.messages.indexOf(pending.entry);
    if (at >= 0) chat.messages.splice(at, 1);
    saveChat();
  }
  function cancelQuestion() {
    if (!chat.controller) return;
    if (chat.pending) chat.pending.cancelled = true;
    chat.controller.abort();
    restoreQuestion(chat.pending);
  }
  function safeImageUrl(value) {
    return typeof value === 'string' && value.length < 16000000 && /^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+=*$/.test(value) ? value : null;
  }
  function appendImage(image, figure) {
    const src = safeImageUrl(image?.url);
    if (!src) { figure.replaceChildren(node('p', { class: 'learning-muted' }, '此歷史圖片未保存在裝置。')); return; }
    const img = node('img', { src, alt: image.alt || 'AI 生成的教學示意圖', loading: 'lazy' });
    const caption = node('figcaption', {}, 'AI 生成示意圖；標籤、公式與步驟請對照課文核對。');
    const download = node('a', { href: src, download: '生化AI-教學示意圖.' + (src.startsWith('data:image/jpeg') ? 'jpg' : src.slice(11, src.indexOf(';'))), class: 'ai-image-download' }, '下載圖片 ↓');
    figure.replaceChildren(img, caption, download);
  }
  function cleanFollowups(values) {
    return [...new Set((Array.isArray(values) ? values : []).filter(x => typeof x === 'string').map(x => x.trim()).filter(x => x.length >= 2 && x.length <= 64 && !/[<>\n\r\x00-\x1f]|https?:\/\//i.test(x)))].slice(0, 4);
  }
  function suggestedQuestions(message) {
    const supplied = cleanFollowups(message.followups);
    if (supplied.length >= 2) return supplied;
    // Older conversations and interrupted replies still offer answer-specific follow-ups.
    const concept = [...message.content.matchAll(/\*\*([^*\n]{2,24})\*\*/g)].map(m => m[1]).find(x => !/[：:，,。？?]/.test(x))
      || message.content.match(/人工智能|圖靈測試|模糊推理|隸屬度|知識圖譜|廣度優先搜索|深度優先搜索|遺傳算法|適應度|粒子群|蟻群|[A-Z][A-Za-z*]{1,8}/)?.[0];
    const topic = concept ? '「' + concept + '」' : '剛才的解釋';
    return ['用生活例子說明' + topic, '理解' + topic + '時容易犯甚麼錯？', '根據' + topic + '出一道小練習'];
  }
  function clearChat() {
    // Invalidate the request before aborting so its catch/finally cannot restore cleared data.
    const controller = chat.controller;
    chat.pending = null; chat.controller = null; chat.busy = false; chat.partial = '';
    controller?.abort(); chatReturnView = null; chat.messages = []; chat.draft = ''; chat.error = '';
    draftInput.value = ''; saveChat(); clearImages().catch(() => {});
    renderMessages(); refreshStatus(); syncAIEntryAvailability(); draftInput.focus();
  }
  function visiblePartial(text) {
    let value = text.split(/<followups\b/i)[0];
    const tail = value.lastIndexOf('<');
    if (tail >= 0 && '<followups>'.startsWith(value.slice(tail).toLowerCase())) value = value.slice(0, tail);
    return value.replace(/\n?```(?:json)?\s*$/i, '');
  }
  function showPartial() {
    const target = conversation?.querySelector('.ai-stream-content');
    if (!target || active !== 'ai') return;
    const nearBottom = conversation.scrollHeight - conversation.scrollTop - conversation.clientHeight < 100;
    target.textContent = visiblePartial(chat.partial);
    target.hidden = !target.textContent;
    if (nearBottom) conversation.scrollTop = conversation.scrollHeight;
  }
  function updateWaitLabel() {
    const label = conversation?.querySelector('.ai-wait-label');
    if (!label || !chat.busy) return;
    const seconds = Math.floor((Date.now() - chat.startedAt) / 1000);
    label.textContent = (chat.partial ? '正在回答' : seconds >= 20 ? '模型仍在處理，可繼續等候或取消' : '正在查閱課文') + ' · ' + seconds + ' 秒';
  }
  function renderMessages(position = 'latest') {
    if (!conversation) return;
    const previousScroll = conversation.scrollTop;
    conversation.replaceChildren();
    if (!chat.messages.length) {
      const welcome = node('section', { class: 'ai-welcome' });
      welcome.append(node('h3', {}, '從這一頁，問清楚每一步。'), node('p', {}, '解釋概念、拆解符號與計算，用例子理解課文。'));
      const suggestions = node('div', { class: 'ai-suggestions' });
      for (const prompt of ['用簡單的例子解釋這一頁。', '這一頁的符號各代表甚麼？', '給我一步提示，先不要直接說答案。', '這個方法在甚麼情況下會失效？']) {
        suggestions.append(button(prompt, () => { if (chat.busy) return; draftInput.value = prompt; chat.draft = prompt; saveChat(); draftInput.focus(); }, ''));
      }
      welcome.append(suggestions, node('p', { class: 'learning-muted' }, '回答可作學習參考；公式與重要結論仍應對照課件及老師的講解。'));
      conversation.append(welcome);
    }
    for (const m of chat.messages) {
      const article = node('article', { class: 'ai-message' + (m.role === 'user' ? ' is-user' : '') });
      const content = node('div', { class: 'ai-message-content' });
      if (m.role === 'assistant') renderAnswer(m.content, content);
      else content.append(node('p', { class: 'ai-plain-text' }, m.content));
      article.append(node('div', { class: 'ai-message-label' }, m.role === 'user' ? (m.kind === 'image' ? '你 · 生成圖片' : '你') : 'AI 學習助手'), content);
      if (m.role === 'assistant') {
        const sourceRow = node('div', { class: 'practice-reference' });
        for (const source of m.sources || []) {
          const ch = String(source.chapter).padStart(2, '0'), page = Number(source.page);
          if (!window.COURSE_CHAPTERS.some(c => c.id === ch && page >= 1 && page <= c.pages && Number.isInteger(page))) continue;
          sourceRow.append(button('第 ' + Number(ch) + ' 章 · ' + (window.CourseSupplements?.label(ch,page) || '第 ' + page + ' 頁') + ' ↗', () => {
            visitChatSource(ch, page);
          }, 'ai-source'));
        }
        article.append(sourceRow);
        if (m.truncated) article.append(button('回答未完，繼續 →', () => {
          if (chat.busy) return;
          draftInput.value = '請接著這一頁的上一則回答，從未完成的部分繼續，不要重複已說明的內容。';
          ask();
        }, 'ai-continue'));
        if (m.images?.length) {
          for (const image of m.images) { const figure = node('figure', { class: 'ai-generated-image' }); appendImage(image, figure); article.append(figure); }
        } else for (const item of m.imageIds || []) {
          const figure = node('figure', { class: 'ai-generated-image' });
          figure.append(node('p', { class: 'learning-muted' }, '讀取已保存的圖片…')); article.append(figure);
          readImage(item.id).then(image => appendImage(image, figure));
        }
      }
      if (m.role === 'assistant') {
        const followups = node('div', { class: 'ai-followups', 'aria-label': '快捷追問' });
        followups.append(node('span', { class: 'ai-followups-label' }, '接著聊'));
        for (const prompt of suggestedQuestions(m)) followups.append(button(prompt, () => {
          if (chat.busy || !chat.capabilities?.chat?.available) return;
          draftInput.value = '請接著上一則回答：' + prompt;
          ask(null, m);
        }, 'ai-followup'));
        article.append(followups);
      }
      conversation.append(article);
    }
    if (chat.busy) {
      const partial = node('article', { class: 'ai-message ai-streaming' });
      partial.append(node('p', {class:'learning-muted ai-wait-label', role:'status'}), node('div', {class:'ai-message-content ai-plain-text ai-stream-content'}));
      conversation.append(partial); showPartial(); updateWaitLabel();
    }
    const latest = conversation.querySelector('.ai-message:last-of-type');
    if (position === 'preserve') conversation.scrollTop = previousScroll;
    else if (latest && !latest.classList.contains('is-user') && !chat.busy) {
      conversation.scrollTop = latest.getBoundingClientRect().top - conversation.getBoundingClientRect().top + conversation.scrollTop - 12;
    } else conversation.scrollTop = chat.messages.length || chat.busy ? conversation.scrollHeight : 0;
  }
  function refreshStatus() {
    if (!send || active !== 'ai') return;
    const available = !!chat.capabilities?.chat?.available;
    send.disabled = chat.busy || !available;
    if (draftInput) draftInput.disabled = chat.busy;
    send.textContent = chat.busy ? '回答中…' : '傳送問題 ↑';
    cancelButton.hidden = !chat.busy;
    capStatus.textContent = available ? 'AI 已啟用' : 'AI 暫停服務';
    status.textContent = chat.error || chat.formatError || (available ? '' : 'AI 服務尚未連接。問題可先保存在此裝置，接通後再傳送。');
    status.hidden = !status.textContent;
    checkButton.disabled = chat.busy;
    conversation?.querySelectorAll('.ai-followup').forEach(b => { b.disabled = chat.busy || !available; });
  }
  async function checkCapabilities() {
    chat.capabilities = null;
    chat.error = '此備援網站可閱讀課件及完成練習；AI 答疑暫停服務。';
    loadChatRenderer().then(() => { if (active === 'ai') { renderMessages('preserve'); refreshStatus(); } });
    refreshStatus();
  }
  async function ask(e, followupTarget = null) {
    e?.preventDefault();
    const message = draftInput.value.trim();
    if (chat.busy || !message || !chat.capabilities?.chat?.available) return;
    const ctx = syncChatContext();
    if (!ctx) { chat.error = '課文正在載入，請稍候再傳送。'; refreshStatus(); return; }
    if (message.length > 4000) { chat.error = '請把問題控制在 4,000 字以內。'; refreshStatus(); return; }
    const limits = chat.capabilities.limits || {};
    const maxMessages = Math.min(8, limits.maxHistoryMessages || 8);
    let remaining = Math.min(8000, limits.maxHistoryChars || 8000);
    const history = [];
    const targetIndex = followupTarget ? chat.messages.indexOf(followupTarget) : -1;
    const historyMessages = targetIndex >= 0 ? chat.messages.slice(0, targetIndex + 1) : chat.messages;
    for (const m of historyMessages.filter(m => m.kind !== 'image').slice(-maxMessages).reverse()) {
      const content = m.content.slice(-Math.min(4000, remaining));
      if (!content) break;
      history.unshift({ role: m.role, content }); remaining -= content.length;
    }
    const entry = { role: 'user', content: message, sources: [], kind: 'chat' };
    const pending = { entry, message };
    chat.pending = pending;
    chat.messages.push(entry);
    chat.busy = true; chat.partial = ''; chat.startedAt = Date.now(); chat.error = ''; chat.draft = ''; draftInput.value = '';
    saveChat(); renderMessages(); refreshStatus();
    const controller = new AbortController(); chat.controller = controller;
    const idleLimit = Math.min(130000, (chat.capabilities.chat?.idleTimeoutMs || 90000) + 10000);
    let timeout = setTimeout(() => controller.abort(), idleLimit);
    const totalTimeout = setTimeout(() => controller.abort(), Math.min(250000, (chat.capabilities.chat?.totalTimeoutMs || 180000) + 10000));
    const waiting = setInterval(() => { if (chat.pending === pending) updateWaitLabel(); }, 1000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' }, credentials: 'same-origin',
        body: JSON.stringify({ message, history, chapter: ctx.chapter, page: ctx.page }), signal: controller.signal
      });
      let data = {};
      if (response.ok && response.headers.get('content-type')?.includes('application/x-ndjson')) {
        const reader = response.body.getReader(), decoder = new TextDecoder();
        let buffer = '', bytes = 0, complete = false;
        const consume = line => {
          if (!line.trim()) return;
          const event = JSON.parse(line);
          if (event.type === 'delta' && typeof event.text === 'string') {
            chat.partial = (chat.partial + event.text).slice(0, 24000); showPartial(); updateWaitLabel();
          } else if (event.type === 'done') { data = event; complete = true; }
          else if (event.type === 'error') { data = event; complete = true; }
        };
        try {
          while (true) {
            const {done, value} = await reader.read();
            if (chat.pending !== pending) return;
            if (done) { buffer += decoder.decode(); if (buffer.trim()) consume(buffer); break; }
            bytes += value.byteLength;
            if (bytes > 1500000) throw new Error('回答內容過大，已停止接收。');
            clearTimeout(timeout); timeout = setTimeout(() => controller.abort(), idleLimit);
            buffer += decoder.decode(value, {stream:true});
            let end; while ((end = buffer.indexOf('\n')) >= 0) { consume(buffer.slice(0, end)); buffer = buffer.slice(end + 1); }
            if (complete) break;
          }
        } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
        if (!complete) throw new Error('連線中斷，已收到的文字會保留。');
      } else data = await response.json().catch(() => ({}));
      if (chat.pending !== pending) return;
      if (controller.signal.aborted) throw new DOMException('Cancelled', 'AbortError');
      if (!response.ok || data.error) {
        const codes = {
          PROVIDER_NOT_CONFIGURED: 'AI 服務尚未連接，請稍後再試。',
          RATE_LIMITED: '提問較密集，請稍後再試。',
          RATE_LIMIT: '提問較密集，請稍後再試。',
          DAILY_LIMIT: '今日 AI 額度已用完，請稍後向老師確認。',
          INVALID_REQUEST: '問題未能傳送，請檢查內容後重試。',
          INVALID_HISTORY: '對話較長，請清除舊對話後再試。',
          ACCESS_DENIED: '服務設定正在更新，請重新連線後再試。',
          ACCESS_REQUIRED: '服務設定正在更新，請重新連線後再試。',
          UNAUTHORIZED: '服務設定正在更新，請重新連線後再試。',
          INVALID_PAGE: '未能對應目前課文，請重新開啟這一頁後再試。',
          MEDICAL_BOUNDARY: '可以討論課堂中的生化模型；個人的診斷或用藥問題請諮詢醫護人員。',
          PRIVATE_MATERIAL: 'AI 可以解釋課文，無法提供教師私人備註、未公開答案或服務密鑰。',
          OUT_OF_SCOPE: '請就目前六章人工智能課件提問。',
          PROVIDER_TIMEOUT: 'AI 回答逾時，問題已保留，請稍後重試。'
        };
        throw new Error(codes[data.error?.code] || 'AI 服務暫時未能回答。問題已保留，可以稍後重試。');
      }
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('AI 未傳回可讀的答案，請稍後重試。');
      chat.messages.push({ role: 'assistant', content: data.reply, followups: cleanFollowups(data.followups), kind: 'chat', truncated: data.truncated === true, sources: Array.isArray(data.sources) ? data.sources : [] });
    } catch (error) {
      if (chat.pending !== pending) return;
      chat.error = error.name === 'AbortError' ? '這次等候已結束。問題已保留，可再試一次。' : error.message;
      // Unanswered requests remain in the composer, not in model history.
      const partial = visiblePartial(chat.partial).trim();
      if (partial && !pending.cancelled) {
        chat.messages.push({role:'assistant',content:partial,kind:'chat',truncated:true,sources:[ctx]});
        chat.error = '回答中途停止，已收到的文字已保留。可以按「回答未完，繼續」。';
      } else restoreQuestion(pending);
    } finally {
      clearTimeout(timeout); clearTimeout(totalTimeout); clearInterval(waiting);
      if (chat.pending === pending) {
        chat.busy = false; chat.partial = ''; chat.controller = null; chat.pending = null;
        saveChat(); if (active === 'ai' && modal.open) { renderMessages(); refreshStatus(); }
      }
    }
  }
  function openAI() {
    if (!window.CourseNavigation.isContextReady()) return;
    if (chatReturnView) { resumeChat(); return; }
    const ctx = window.CourseNavigation.getContext();
    if (ctx.home) { window.CourseNavigation.openChapter('01', 1).then(openAI); return; }
    open('ai', 'AI 答疑', ctx);
    const strip = node('div', { class: 'ai-context' });
    strip.append(node('strong', {}, '當前課文'), node('span', {}, ctx.title));
    body.append(strip);
    conversation = node('div', { class: 'ai-conversation', 'aria-label': '對話記錄' });
    const composer = node('form', { class: 'ai-composer' });
    status = node('p', { class: 'ai-response-status', role: 'status' });
    cancelButton = button('取消等候', cancelQuestion, 'ai-cancel'); cancelButton.hidden = true;
    draftInput = node('textarea', { id: 'ai-question', rows: '2', maxlength: '4000', placeholder: '輸入你對這一頁的疑問…', 'aria-label': '向 AI 提問' });
    draftInput.value = chat.draft;
    draftInput.addEventListener('input', () => { chat.draft = draftInput.value; if (!saveChat()) { chat.error = '瀏覽器未能保存草稿，請先自行保留問題。'; refreshStatus(); } });
    let composing = false;
    draftInput.addEventListener('compositionstart', () => { composing = true; });
    draftInput.addEventListener('compositionend', () => { composing = false; });
    draftInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && !composing && e.keyCode !== 229 && !e.repeat) {
        e.preventDefault(); ask();
      }
    });
    const bottom = node('div', { class: 'ai-composer-bottom' }), left = node('div');
    const network = node('div', { class: 'ai-network-actions' });
    capStatus = node('span', { class: 'learning-muted' }, '檢查連線中…');
    checkButton = button('重新連線', checkCapabilities, '');
    const clear = button('清除對話', clearChat, 'ai-clear');
    network.append(capStatus, checkButton, clear, cancelButton); left.append(network, node('div', { class: 'learning-muted' }, 'Enter 傳送 · Shift＋Enter 換行 · 對話保存在此瀏覽器'));
    send = button('傳送問題 ↑', () => {}, 'learning-primary'); send.type = 'submit';
    bottom.append(left, send); composer.append(status, draftInput, bottom);
    composer.addEventListener('submit', ask); body.append(conversation, composer);
    syncChatContext(); renderMessages(); refreshStatus(); checkCapabilities();
  }
  window.CourseAI = { open: openAI };
  const footer = document.querySelector('.course-footer'), controls = footer.querySelector('.page-controls');
  const tools = node('div', { class: 'footer-learning' });
  const ai = button('', openAI, '');
  ai.id = 'open-ai'; ai.setAttribute('aria-haspopup', 'dialog'); ai.setAttribute('aria-controls', 'learning-dialog');
  const aiLabel = node('span', {}, 'AI 答疑');
  ai.append(node('img', { src: 'assets/optimized/biochem-ai-brand-128.png', alt: '', width: 24, height: 24 }), aiLabel);
  tools.append(ai); footer.insertBefore(tools, controls);
  function syncAIEntryAvailability() {
    const ready = window.CourseNavigation.isContextReady();
    aiLabel.textContent = chatReturnView ? '返回 AI 對話' : 'AI 答疑';
    ai.classList.toggle('is-return', !!chatReturnView);
    for (const entry of document.querySelectorAll('#open-ai, [data-ai]')) {
      entry.disabled = !ready;
      entry.setAttribute('aria-busy', String(!ready));
    }
    if (!ready && active === 'ai' && modal.open) modal.close();
  }
  window.addEventListener('course-context-ready', syncAIEntryAvailability);
  syncAIEntryAvailability();
  document.addEventListener('click', e => {
    if (e.target.closest('[data-practice]')) window.CoursePractice.open();
    if (e.target.closest('[data-ai]')) openAI();
  });
})();
