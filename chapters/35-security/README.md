# Chapter 35 · HTML Security · Demos

**English** | [简体中文](README.zh-CN.md)

| Demo | Live | Notes |
| --- | --- | --- |
| 35-1 Escaping vs sanitizing | [01-escape-sanitize.html](https://createagle.github.io/html-guide/chapters/35-security/01-escape-sanitize.html) | The same visitor text through textContent, an escape function, raw innerHTML and a sanitizer, with harmless samples that only report whether injected code ran |
| 35-2 Content Security Policy | [02-csp.html](https://createagle.github.io/html-guide/chapters/35-security/02-csp.html) | A page with a strict CSP and Trusted Types: try inline handlers, eval, foreign images and fetches, and scripts with right and wrong integrity hashes, and see each one blocked or allowed |
| 35-3 iframe sandbox | [03-sandbox.html](https://createagle.github.io/html-guide/chapters/35-security/03-sandbox.html) | Turn sandbox flags on and off and see what an embedded page can do: run scripts, keep its origin, use storage, read the parent, submit forms and open popups |

Starter and finished code for the exercises lives in [exercises/](exercises/README.md).
