(function () {
  'use strict';
  let active = null;
  function usable() { return active && active.page.isConnected; }
  function paint(index) {
    if (!usable()) return false;
    const s = active;
    s.index = Math.max(0, Math.min(s.frames.length - 1, index));
    s.page.dataset.fbStep = String(s.index);
    s.frames.forEach((frame, i) => {
      frame.hidden = i !== s.index;
      frame.setAttribute('aria-hidden', String(i !== s.index));
    });
    const scrollRegion = s.page.querySelector('[data-step-scroll]');
    if (scrollRegion) {
      scrollRegion.scrollTop = 0;
      if (s.page.parentElement?.id === 'lesson') s.page.parentElement.scrollTop = 0;
    }
    if (s.index === 0) s.page.querySelectorAll('[data-step-reset-details]').forEach(detail => { detail.open = false; });
    s.controls.querySelector('.lesson-step-progress').textContent = `${s.index + 1} / ${s.frames.length}`;
    s.controls.querySelector('[data-step-action="prev"]').disabled = s.index === 0;
    s.controls.querySelector('[data-step-action="reset"]').disabled = s.index === 0;
    s.controls.querySelector('[data-step-action="next"]').disabled = s.index === s.frames.length - 1;
    const announcer = document.getElementById('announcer');
    if (announcer) announcer.textContent = `第 ${s.index + 1} 步，共 ${s.frames.length} 步`;
    return true;
  }
  function mount(lesson) {
    active = null;
    const page = lesson?.querySelector(':scope > .fuzzy-bridge');
    if (!page) return;
    const frames = [...page.querySelectorAll('[data-fb-frame]')];
    if (!frames.length) return;
    const controls = page.querySelector('[data-fb-controls]') || document.createElement('div');
    controls.className = 'lesson-steps';
    controls.setAttribute('data-projection-ignore', '');
    controls.innerHTML = '<span class="lesson-step-progress" aria-live="polite"></span><div class="lesson-step-actions"><button type="button" data-step-action="reset">重新開始</button><button type="button" data-step-action="prev">上一步</button><button type="button" data-step-action="next">下一步</button></div>';
    page.append(controls);
    active = {page, frames, controls, index: 0};
    paint(0);
    const scrollRegion = page.querySelector('[data-step-scroll]');
    scrollRegion?.addEventListener('keydown', event => {
      const readingKey = ['Home', 'End', 'PageUp', 'PageDown', ' '].includes(event.key);
      const horizontalKey = event.target.closest('[data-step-horizontal]') && ['ArrowLeft', 'ArrowRight'].includes(event.key);
      if (readingKey || horizontalKey) event.stopPropagation();
    });
  }
  function advance() {
    if (!usable() || active.index >= active.frames.length - 1) return false;
    return paint(active.index + 1);
  }
  function retreat() {
    if (!usable() || active.index === 0) return false;
    return paint(active.index - 1);
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('.fuzzy-bridge [data-step-action]');
    if (!button || !usable() || !active.page.contains(button)) return;
    if (button.dataset.stepAction === 'next') advance();
    else if (button.dataset.stepAction === 'prev') retreat();
    else { paint(0); active.controls.querySelector('[data-step-action="next"]').focus({preventScroll:true}); }
  });
  window.CourseFuzzyBridge = {mount, advance, retreat, cleanup() {active = null;}};
})();
