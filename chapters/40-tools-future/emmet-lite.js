// A small Emmet subset: elements, #id, .class, [attr], {text}, > + ^ * ( ), $ numbering, aliases.
// The output follows Emmet's defaults: two-space indent, at most two inline elements on one line.
(function (root) {
  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  const INLINE = new Set(['a', 'abbr', 'acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'del', 'dfn', 'em', 'font', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'map', 'object', 'q', 's', 'samp', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var']);
  const BOOLEAN = new Set(['async', 'autofocus', 'autoplay', 'checked', 'controls', 'defer', 'disabled', 'hidden', 'loop', 'multiple', 'muted', 'novalidate', 'open', 'readonly', 'required', 'reversed', 'selected']);
  // Snippets: the tag name and the attributes Emmet adds by default, in order
  const SNIPPETS = {
    a: ['a', [['href', '']]], 'a:mail': ['a', [['href', 'mailto:']]],
    img: ['img', [['src', ''], ['alt', '']]],
    input: ['input', [['type', 'text']]],
    'input:submit': ['input', [['type', 'submit'], ['value', '']]],
    label: ['label', [['for', '']]],
    form: ['form', [['action', '']]],
    select: ['select', [['name', ''], ['id', '']]],
    option: ['option', [['value', '']]],
    textarea: ['textarea', [['name', ''], ['id', '']]],
    iframe: ['iframe', [['src', ''], ['frameborder', '0']]],
    link: ['link', [['rel', 'stylesheet'], ['href', '']]],
    'link:css': ['link', [['rel', 'stylesheet'], ['href', 'style.css']]],
    'script:src': ['script', [['src', '']]],
    'meta:vp': ['meta', [['name', 'viewport'], ['content', 'width=device-width, initial-scale=1.0']]],
    video: ['video', [['src', '']]], audio: ['audio', [['src', '']]],
    time: ['time', [['datetime', '']]],
    btn: ['button', []], bq: ['blockquote', []], fig: ['figure', []], figc: ['figcaption', []],
    pic: ['picture', []], src: ['source', []],
  };
  for (const t of ['email', 'checkbox', 'radio', 'search', 'password', 'number', 'tel', 'url', 'date']) {
    SNIPPETS['input:' + t] = ['input', [['type', t], ['name', ''], ['id', '']]];
  }
  const DOCUMENT = 'html[lang=en]>(head>meta[charset=UTF-8]+meta:vp+title{Document})+body';

  function implicit(parent) {
    if (!parent) return 'div';
    if (parent === 'ul' || parent === 'ol') return 'li';
    if (['table', 'thead', 'tbody', 'tfoot'].includes(parent)) return 'tr';
    if (parent === 'tr') return 'td';
    if (parent === 'select' || parent === 'optgroup') return 'option';
    return INLINE.has(parent) ? 'span' : 'div';
  }

  // ---- parser: builds a tree of { name, id, classes, attrs, text, repeat, children } ----
  function parse(src) {
    let i = 0;
    const fail = msg => { throw new Error(`${msg} at ${i + 1}`); };
    const peek = () => src[i];

    function readUntil(close) {
      const start = i;
      while (i < src.length && src[i] !== close) i++;
      if (i >= src.length) fail(`Missing ${close}`);
      return src.slice(start, i++);
    }
    function readName() {
      const m = /^[A-Za-z!][\w:!$@-]*/.exec(src.slice(i));
      if (!m) return '';
      i += m[0].length;
      return m[0];
    }
    function readAttrs(node) {
      const body = readUntil(']');
      const re = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]*)))?/g;
      let m;
      while ((m = re.exec(body))) { node.order.push(['attr', node.attrs.length]); node.attrs.push([m[1], m[2] ?? m[3] ?? m[4] ?? null]); }
    }
    function element() {
      if (peek() === '(') {
        i++;
        const group = { group: true, children: sequence(), repeat: 1 };
        if (src[i++] !== ')') fail('Missing )');
        multiplier(group);
        return group;
      }
      const node = { name: readName(), id: null, classes: [], attrs: [], order: [], text: null, repeat: 1, children: [] };
      for (;;) {
        const c = peek();
        if (c === '#') { i++; node.id = readName() || fail('Expected an id'); node.order.push(['id']); }
        else if (c === '.') { i++; if (!node.classes.length) node.order.push(['class']); node.classes.push(/^[\w$@-]+/.exec(src.slice(i))?.[0] || fail('Expected a class')); i += node.classes.at(-1).length; }
        else if (c === '[') { i++; readAttrs(node); }
        else if (c === '{') { i++; node.text = readUntil('}'); }
        else break;
      }
      if (!node.name && !node.id && !node.classes.length && !node.attrs.length) {
        if (node.text === null) fail('Unexpected character');
        node.textOnly = true;
      }
      multiplier(node);
      return node;
    }
    function multiplier(node) {
      if (peek() !== '*') return;
      i++;
      const m = /^\d+/.exec(src.slice(i)) || fail('Expected a number');
      node.repeat = +m[0];
      i += m[0].length;
    }
    // A sequence of siblings joined by + > ^, returned as the list of top-level nodes
    function sequence() {
      const top = [];
      const stack = [top];
      let last = null;
      for (;;) {
        const node = element();
        stack.at(-1).push(node);
        last = node;
        const op = peek();
        if (op === '+') { i++; continue; }
        if (op === '>') { i++; if (last.group) fail('Use > inside the group'); stack.push(last.children); continue; }
        if (op === '^') {
          while (peek() === '^') { i++; if (stack.length > 1) stack.pop(); }
          continue;
        }
        return top;
      }
    }
    const tree = sequence();
    if (i < src.length) fail('Unexpected character');
    return tree;
  }

  // ---- expansion: apply snippets, implicit tags, multiplication and numbering ----
  function number(text, index, count) {
    return text.replace(/(\$+)(@(-)?(\d+)?)?/g, (_, dollars, at, reverse, start) => {
      const base = start ? +start : 1;
      const n = reverse ? base + count - 1 - index : base + index;
      return String(n).padStart(dollars.length, '0');
    });
  }
  function expandNodes(nodes, parentName, counters) {
    const out = [];
    for (const node of nodes) {
      for (let k = 0; k < node.repeat; k++) {
        const ctx = node.repeat > 1 ? { index: k, count: node.repeat } : counters;
        const num = s => (ctx ? number(s, ctx.index, ctx.count) : s);
        if (node.group) { out.push(...expandNodes(node.children, parentName, ctx)); continue; }
        if (node.name === '!' || node.name === 'html:5') { out.push({ doctype: true }, ...expandNodes(parse(DOCUMENT), null, null)); continue; }
        if (node.textOnly) { out.push({ text: num(node.text) }); continue; }
        let name = node.name ? num(node.name) : implicit(parentName);
        let attrs = [];
        const snippet = node.name && SNIPPETS[name];
        if (snippet) { [name, attrs] = [snippet[0], snippet[1].map(a => [...a])]; }
        const set = (k, v) => { const hit = attrs.find(a => a[0] === k); if (hit) hit[1] = v; else attrs.push([k, v]); };
        // id, class and [attributes] come out in the order they were written
        for (const [kind, index] of node.order) {
          if (kind === 'id') set('id', num(node.id));
          else if (kind === 'class') set('class', node.classes.map(num).join(' '));
          else { const [k, v] = node.attrs[index]; set(k, v === null ? (BOOLEAN.has(k) ? k : '') : num(v)); }
        }
        const el = { name, attrs, children: [] };
        if (node.text !== null) el.children.push({ text: num(node.text) });
        el.children.push(...expandNodes(node.children, name, ctx));
        out.push(el);
      }
    }
    return out;
  }

  // ---- output ----
  const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const isInline = n => n.text !== undefined || INLINE.has(n.name);
  function inlineList(list) {
    return list.every(isInline) && list.filter(n => n.name).length < 3;
  }
  function render(list, depth) {
    const pad = '  '.repeat(depth);
    if (inlineList(list)) return pad + list.map(n => one(n, depth)).join('');
    return list.map(n => pad + one(n, depth)).join('\n');
  }
  function one(n, depth) {
    if (n.doctype) return '<!DOCTYPE html>';
    if (n.text !== undefined) return n.text;
    const open = `<${n.name}${n.attrs.map(([k, v]) => ` ${k}="${esc(v)}"`).join('')}>`;
    if (VOID.has(n.name)) return open;
    if (!n.children.length) return `${open}</${n.name}>`;
    if (inlineList(n.children)) return open + n.children.map(c => one(c, depth)).join('') + `</${n.name}>`;
    // Like Emmet, head and body are not indented inside html
    const inner = render(n.children, n.name === 'html' ? depth : depth + 1);
    return `${open}\n${inner}\n${'  '.repeat(depth)}</${n.name}>`;
  }
  function expand(abbr) {
    const nodes = expandNodes(parse(abbr.trim()), null, null);
    // The document snippet puts html at the top level, each part on its own line
    if (nodes[0] && nodes[0].doctype) return nodes.map(n => one(n, 0)).join('\n').replace('<body></body>', '<body>\n  \n</body>');
    return render(nodes, 0);
  }

  root.emmetLite = { expand };
})(typeof window !== 'undefined' ? window : globalThis);
