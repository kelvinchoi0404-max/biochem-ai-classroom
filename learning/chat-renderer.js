(function () {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mathTags = 'math semantics annotation mrow mi mn mo ms mtext mspace mfrac msqrt mroot msub msup msubsup munder mover munderover mtable mtr mtd mstyle mpadded mphantom menclose'.split(' ');
  function math(source, display) {
    try {
      return '<span class="' + (display ? 'ai-math-block' : 'ai-math-inline') + '">' + window.katex.renderToString(source, {
        output: 'mathml', displayMode: display, throwOnError: false, trust: false,
        strict: 'ignore', maxExpand: 500, maxSize: 20, macros: {}
      }) + '</span>';
    } catch { return '<code class="ai-math-fallback">' + escape(source) + '</code>'; }
  }
  const markdown = new window.marked.Marked({ gfm: true, breaks: true });
  markdown.use({
    renderer: {
      html(token) { return escape(token.text); },
      image(token) { return escape(token.text || '圖片'); },
      heading(token) {
        const level = Math.min(5, token.depth + 2);
        return '<h' + level + '>' + this.parser.parseInline(token.tokens) + '</h' + level + '>\n';
      }
    },
    extensions: [{
      name: 'courseMathBlock', level: 'block',
      start(src) { const i = src.search(/\$\$|\\\[/); return i < 0 ? undefined : i; },
      tokenizer(src) {
        const m = /^(?:\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\])(?:[ \t]*\n|$)/.exec(src);
        if (m) return { type: 'courseMathBlock', raw: m[0], text: (m[1] || m[2]).trim() };
      },
      renderer(token) { return math(token.text, true); }
    }, {
      name: 'courseMathInline', level: 'inline',
      start(src) { const i = src.search(/\$|\\\(/); return i < 0 ? undefined : i; },
      tokenizer(src) {
        const m = /^(?:\$([^$\n]+?)\$|\\\(([^\n]+?)\\\))/.exec(src);
        if (m) return { type: 'courseMathInline', raw: m[0], text: m[1] || m[2] };
      },
      renderer(token) { return math(token.text, false); }
    }, {
      // CommonMark delimiter rules reject **「…」** next to a CJK letter.
      // Match only a quoted/bracketed span at the inline token boundary;
      // code and math are consumed by their own tokenizers, never rewritten.
      name: 'courseCjkStrong', level: 'inline',
      start(src) { const i = src.search(/\*\*[「『（【《〈“‘]/); return i < 0 ? undefined : i; },
      tokenizer(src) {
        if (!src.startsWith('**')) return;
        const end = src.indexOf('**', 2);
        if (end < 0 || src[end + 2] === '*') return;
        const text = src.slice(2, end);
        if (!/^[「『（【《〈“‘][^\n]*[」』）】》〉”’]$/.test(text)) return;
        return { type: 'courseCjkStrong', raw: src.slice(0, end + 2), tokens: this.lexer.inlineTokens(text) };
      },
      renderer(token) { return '<strong>' + this.parser.parseInline(token.tokens) + '</strong>'; }
    }]
  });
  function fallback(text, host) {
    host.replaceChildren();
    for (const paragraph of String(text).split(/\n\s*\n/)) {
      const p = document.createElement('p');
      p.className = 'ai-plain-text'; p.textContent = paragraph; host.append(p);
    }
  }
  function render(text, host) {
    try {
      const fragment = window.DOMPurify.sanitize(markdown.parse(String(text)), {
        RETURN_DOM_FRAGMENT: true,
        ALLOWED_TAGS: ['p', 'div', 'span', 'h3', 'h4', 'h5', 'strong', 'em', 'del', 's', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', ...mathTags],
        ALLOWED_ATTR: ['href', 'title', 'class', 'start', 'colspan', 'rowspan', 'scope', 'display', 'mathvariant', 'encoding', 'stretchy', 'fence', 'separator', 'accent', 'accentunder', 'columnalign', 'rowalign', 'columnspacing', 'rowspacing', 'columnlines', 'rowlines', 'frame', 'framespacing', 'linethickness', 'lspace', 'rspace', 'minsize', 'maxsize', 'width', 'height', 'depth', 'voffset', 'notation', 'movablelimits', 'displaystyle', 'scriptlevel'],
        ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false, SANITIZE_DOM: true
      });
      for (const a of fragment.querySelectorAll('a')) {
        let url;
        try { url = new URL(a.getAttribute('href')); } catch {}
        if (!url || !['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
          a.replaceWith(...a.childNodes); continue;
        }
        a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      }
      for (const p of fragment.querySelectorAll('p')) {
        const strong = p.firstElementChild;
        if (strong?.tagName === 'STRONG' && strong.textContent.length <= 80 && p.firstChild === strong) {
          if (p.childNodes.length === 1) {
            const h = document.createElement('h4'); h.append(...strong.childNodes); p.replaceWith(h);
          } else if (strong.nextSibling?.nodeName === 'BR') {
            const h = document.createElement('h4'); h.append(...strong.childNodes);
            strong.nextSibling.remove(); strong.remove(); p.before(h);
          }
        }
      }
      for (const table of fragment.querySelectorAll('table')) {
        const scroll = document.createElement('div'); scroll.className = 'ai-table-scroll';
        scroll.tabIndex = 0; scroll.setAttribute('role', 'region'); scroll.setAttribute('aria-label', '答案比較表，可左右捲動');
        table.replaceWith(scroll); scroll.append(table);
      }
      host.replaceChildren(fragment);
    } catch { fallback(text, host); }
  }
  window.CourseChatRenderer = { render, fallback };
})();
