// A tiny stand-in for a framework's hydration step: walk the server DOM and the client tree together
// and list every place where they disagree. Whitespace-only text nodes are ignored, as frameworks do.
(() => {
  const problems = [];
  const describe = (node) => typeof node === 'string' ? `text "${node.trim()}"` : `<${node[0]}>`;
  const domChildren = (el) => [...el.childNodes].filter((n) => n.nodeType === Node.ELEMENT_NODE || n.data.trim());

  function compare(dom, vnode, where) {
    if (typeof vnode === 'string') {
      if (dom.nodeType !== Node.TEXT_NODE) problems.push(`${where}: the server has <${dom.localName}>, the client renders ${describe(vnode)}`);
      else if (dom.data.trim() !== vnode.trim()) problems.push(`${where}: the server says "${dom.data.trim()}", the client says "${vnode.trim()}"`);
      return;
    }
    const [tag, , children] = vnode;
    if (dom.nodeType !== Node.ELEMENT_NODE || dom.localName !== tag) {
      problems.push(`${where}: the server has ${dom.nodeType === Node.ELEMENT_NODE ? `<${dom.localName}>` : `text "${dom.data.trim()}"`}, the client renders <${tag}>`);
      return;
    }
    const kids = domChildren(dom);
    children.forEach((child, i) => {
      if (kids[i]) compare(kids[i], child, `${where} > ${describe(child)}`);
      else problems.push(`${where}: the client renders ${describe(child)}, the server has nothing there`);
    });
    for (const extra of kids.slice(children.length)) {
      problems.push(`${where}: the server has an extra ${extra.nodeType === Node.ELEMENT_NODE ? `<${extra.localName}>` : `text "${extra.data.trim()}"`}`);
    }
  }

  const app = document.getElementById('app');
  const roots = domChildren(app);
  compare(roots[0], component, '<article>');
  for (const extra of roots.slice(1)) problems.push(`#app: the server has an extra <${extra.localName}>`);

  const verdict = document.getElementById('verdict');
  verdict.className = problems.length ? 'bad' : 'good';
  verdict.textContent = problems.length
    ? `${problems.length} mismatch${problems.length === 1 ? '' : 'es'}: a framework would warn and re-render`
    : 'The server HTML matches the client: hydration can reuse every node';
  document.getElementById('problems').replaceChildren(...problems.map((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }));
})();
