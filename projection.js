(function () {
  'use strict';

  const DESKTOP = '(min-width: 761px)';
  const TARGET = 1.22;
  const MAXIMUM = 1.28;
  const MINIMUM = 0.8;
  const TOLERANCE = 2;
  const OMIT = 'script,style,noscript,svg,canvas,dialog,.sr-only,.katex-mathml,[data-projection-ignore]';
  const UNSCALED = '.page-heading,.supp-heading,.supp-kicker,.supp-sources,.c02-rule-reference';
  const HERO = '.hero,.c02-hero,.c03-hero,.c04-hero,.c05-hero,.c06-hero';
  const OBSERVE = {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'hidden', 'style']};
  let active = null;
  let printing = false;
  let resizeTimer = 0;

  function restoreFonts(state) {
    for (const [element, saved] of state.originalFonts) {
      if (saved.value) element.style.setProperty('font-size', saved.value, saved.priority);
      else element.style.removeProperty('font-size');
    }
    if (state.originalScale.value) state.page.style.setProperty('--projection-scale', state.originalScale.value, state.originalScale.priority);
    else state.page.style.removeProperty('--projection-scale');
  }

  function prepareFonts(state) {
    const page = state.page;
    const elements = [page, ...page.querySelectorAll('*')].filter(element =>
      !element.closest(OMIT) && (!element.closest('math') || element.localName === 'math'));
    const sizes = new Map();
    const boxes = new Map();
    const targets = [];
    // Read all baseline sizes before writing any. Relative formula and subscript
    // sizes then become independent px values, so ancestors cannot scale them twice.
    for (const element of elements) {
      const style = getComputedStyle(element);
      sizes.set(element, parseFloat(style.fontSize));
      boxes.set(element, {
        element,
        display: style.display,
        clipsY: /^(hidden|clip|auto|scroll)$/.test(style.overflowY),
        fontSize: parseFloat(style.fontSize)
      });
    }
    for (const element of elements) {
      const size = sizes.get(element);
      const parentSize = sizes.get(element.parentElement);
      if (!Number.isFinite(size) || size <= 0 || (!element.textContent.trim() && element !== page)) continue;
      const unscaledRoot = element.matches(UNSCALED) && !element.parentElement?.closest(UNSCALED);
      if (element.closest(UNSCALED) && !unscaledRoot) continue;
      if (!unscaledRoot && element !== page && Number.isFinite(parentSize) && Math.abs(size - parentSize) < 0.05) continue;
      if (!state.originalFonts.has(element)) state.originalFonts.set(element, {
        value: element.style.getPropertyValue('font-size'),
        priority: element.style.getPropertyPriority('font-size')
      });
      targets.push([element, size, unscaledRoot]);
    }
    for (const [element, size, unscaledRoot] of targets) element.style.setProperty('font-size', unscaledRoot ? `${size}px` : `calc(${size}px * var(--projection-scale, 1))`, 'important');

    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.trim() && !node.parentElement.closest(OMIT)) texts.push(node);
    }
    // Native MathML handles its own script sizes and glyph em boxes. Scale and
    // measure its outer math element, never the mi/mrow/msub layout internals.
    state.measureElements = elements.map(element => {
      const box = boxes.get(element);
      box.layout = element === page || /^(inline-)?(grid|flex|table)/.test(box.display) ||
        Array.from(element.children).some(child => /^(block|flow-root|list-item|grid|flex|table)/.test(boxes.get(child)?.display || ''));
      return box;
    });
    state.measureTexts = texts;
  }

  function outside(rect, bounds) {
    return rect.left < bounds.left - TOLERANCE || rect.right > bounds.right + TOLERANCE ||
      rect.top < bounds.top - TOLERANCE || rect.bottom > bounds.bottom + TOLERANCE;
  }

  function fits(state) {
    state.lastBlocker = '';
    const round = value => Math.round(value * 10) / 10;
    const coordinates = rect => [rect.left, rect.top, rect.right, rect.bottom].map(round).join(',');
    const blocked = (element, reason, sizes) => {
      const name = (element?.localName || 'node') + Array.from(element?.classList || []).slice(0, 4).map(value => '.' + value).join('');
      state.lastBlocker = `${name} ${reason} ${sizes}`;
      return false;
    };
    const pageBox = state.page.getBoundingClientRect();
    const lessonBox = state.lesson.getBoundingClientRect();
    const bounds = {
      left: Math.max(pageBox.left, lessonBox.left, 0),
      top: Math.max(pageBox.top, lessonBox.top, 0),
      right: Math.min(pageBox.right, lessonBox.right, window.innerWidth),
      bottom: Math.min(pageBox.bottom, lessonBox.bottom, window.innerHeight)
    };
    if (bounds.right <= bounds.left || bounds.bottom <= bounds.top) return blocked(state.page, 'empty-bounds', coordinates(bounds));
    const scale = Number(state.page.style.getPropertyValue('--projection-scale')) || 1;
    for (const box of state.measureElements) {
      const element = box.element;
      const rects = element.getClientRects();
      if (!rects.length) continue; // display:none does not participate in this step.
      const rect = element.getBoundingClientRect();
      if (outside(rect, bounds)) return blocked(element, 'box-outside', `${coordinates(rect)} bounds=${coordinates(bounds)}`);
      // Include visibility:hidden exercise answers: they occupy real space and
      // must fit before the teacher reveals them. Check columns as well as the page.
      const inkAllowance = Math.max(6, box.fontSize * scale * 0.25);
      if (element.clientWidth > 0 && element.scrollWidth > element.clientWidth + inkAllowance) return blocked(element, 'scroll-x', `${element.clientWidth}/${element.scrollWidth} allowance=${round(inkAllowance)}`);
      // A line-height:1 glyph, arrow or subscript can paint beyond its line box
      // without overlapping the next block or being clipped. Only bounded layout
      // containers and actual clipping/scroll regions impose a vertical limit.
      // The authored flow connector intentionally extends into the gap below a step.
      const flowConnector = element.matches('.supp-flow li');
      if ((box.clipsY || (box.layout && !flowConnector)) && element.clientHeight > 0 &&
          element.scrollHeight > element.clientHeight + inkAllowance) return blocked(element, 'scroll-y', `${element.clientHeight}/${element.scrollHeight} allowance=${round(inkAllowance)}`);
    }
    const range = document.createRange();
    for (const node of state.measureTexts) {
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width && rect.height && outside(rect, bounds)) return blocked(node.parentElement, 'text-outside', `${coordinates(rect)} bounds=${coordinates(bounds)}`);
      }
    }
    return true;
  }

  function applyScale(state, scale) {
    state.page.style.setProperty('--projection-scale', String(scale));
    return fits(state);
  }

  function largestFit(state, low, high) {
    // Hundredth precision keeps the fit bounded to at most five extra layouts.
    while (high - low >= 0.01) {
      const middle = (low + high) / 2;
      if (applyScale(state, middle)) low = middle;
      else high = middle;
    }
    return Math.max(MINIMUM, Math.floor((low + 0.000001) * 100) / 100);
  }

  function fit(state) {
    if (active !== state || !state.page.isConnected) return;
    state.observer.disconnect();
    try {
      state.page.dataset.projectionStatus = 'fitting';
      delete state.page.dataset.projectionBlocker;
      restoreFonts(state);
      state.page.classList.remove('projection-compact', 'projection-scroll');
      if (printing || !matchMedia(DESKTOP).matches) {
        state.page.classList.remove('projection-page');
        state.page.dataset.projectionScale = '1.00';
        state.page.dataset.projectionStatus = printing ? 'print' : 'mobile';
        return;
      }
      state.page.classList.add('projection-page');
      prepareFonts(state);
      let targetFits = applyScale(state, TARGET);
      if (!targetFits) {
        state.page.classList.add('projection-compact');
        // Compact CSS can also adjust font rules. Read their unscaled baseline.
        restoreFonts(state);
        prepareFonts(state);
        targetFits = applyScale(state, TARGET);
      }
      let scale;
      let status;
      if (targetFits) {
        scale = applyScale(state, MAXIMUM) ? MAXIMUM : largestFit(state, TARGET, MAXIMUM);
      } else if (applyScale(state, 1)) {
        scale = largestFit(state, 1, TARGET);
      } else if (applyScale(state, MINIMUM)) {
        scale = largestFit(state, MINIMUM, 1);
        status = 'adapted';
      } else {
        // Keep oversized content reachable at unusually short or zoomed viewports.
        scale = MINIMUM;
        status = 'scroll-fallback';
        state.page.classList.add('projection-scroll');
      }
      state.page.style.setProperty('--projection-scale', String(scale));
      state.page.dataset.projectionScale = scale.toFixed(2);
      state.page.dataset.projectionStatus = status || (scale >= 1.18 ? 'enlarged' : scale > 1 ? 'fitted' : 'baseline');
      if (status === 'scroll-fallback') state.page.dataset.projectionBlocker = state.lastBlocker;
    } finally {
      if (active === state && state.page.isConnected) state.observer.observe(state.page, OBSERVE);
    }
  }

  function schedule(state = active) {
    if (!state || active !== state || state.frame) return;
    state.frame = requestAnimationFrame(() => {
      state.frame = 0;
      fit(state);
    });
  }

  function detach() {
    if (!active) return;
    const state = active;
    active = null;
    state.observer.disconnect();
    cancelAnimationFrame(state.frame);
    state.lesson.removeEventListener('load', state.imageLoaded, true);
    state.lesson.removeEventListener('error', state.imageLoaded, true);
    restoreFonts(state);
    state.page.classList.remove('projection-page', 'projection-compact', 'projection-scroll');
  }

  function mount(lesson) {
    detach();
    const page = lesson?.querySelector(':scope > .page');
    if (!page || page.matches(HERO) || page.matches('.clause-step-page, .resolution-principle-page, .matrix-concepts, .chapter-review, .fuzzy-control-experiment') || document.body.classList.contains('is-home')) return;
    const state = {
      lesson, page, frame: 0, originalFonts: new Map(),
      originalScale: {value: page.style.getPropertyValue('--projection-scale'), priority: page.style.getPropertyPriority('--projection-scale')},
      measureElements: [], measureTexts: []
    };
    state.observer = new MutationObserver(() => schedule(state));
    state.imageLoaded = event => { if (event.target instanceof HTMLImageElement) schedule(state); };
    active = state;
    page.dataset.projectionStatus = 'pending';
    lesson.addEventListener('load', state.imageLoaded, true);
    lesson.addEventListener('error', state.imageLoaded, true);
    fit(state);
    document.fonts?.ready.then(() => schedule(state));
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => schedule(), 100);
  });
  window.addEventListener('beforeprint', () => { printing = true; if (active) fit(active); });
  window.addEventListener('afterprint', () => { printing = false; schedule(); });
  window.CourseProjection = {mount, refresh: () => schedule()};
})();
