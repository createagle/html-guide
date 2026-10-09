// 35-2 · every inline script is blocked by this page's policy, so all the code lives here
const log = document.getElementById('log');
function note(kind, text) {
  const li = document.createElement('li');
  li.className = kind;
  li.textContent = text;
  log.prepend(li);
}

// Every violation of the policy is reported as an event
document.addEventListener('securitypolicyviolation', (e) => {
  note('good', `Blocked by CSP: ${e.effectiveDirective}${e.blockedURI ? ` (${e.blockedURI})` : ''}`);
});

// Trusted Types: strings can reach innerHTML and script.src only through a named policy
const policy = window.trustedTypes
  ? trustedTypes.createPolicy('demo', {
    createHTML: (s) => s, // careless on purpose: shows that CSP still stops inline handlers
    createScriptURL: (s) => {
      const url = new URL(s, location.href);
      if (url.origin !== location.origin) throw new TypeError(`Script URL not allowed: ${url}`);
      return url.href;
    },
  })
  : { createHTML: (s) => s, createScriptURL: (s) => s };

const out = document.getElementById('out');
const INTEGRITY = 'sha384-xMMhAj+xc6tNGBL1FfhalcdIl2VF9CW97n8R37tAKplTJeAz//O0mTfPPkIBWaqa';
const tests = {
  handler() {
    out.innerHTML = policy.createHTML('<img src="data:," alt="" onerror="document.title = \'hacked\'">');
    setTimeout(() => note(document.title === 'hacked' ? 'bad' : 'good', `Image inserted. Its onerror handler ${document.title === 'hacked' ? 'ran' : 'did not run'}.`), 100);
  },
  string() {
    out.innerHTML = '<b>Plain string</b>';
    note('good', 'innerHTML accepted a plain string (this browser has no Trusted Types enforcement).');
  },
  eval() {
    const result = eval('1 + 1');
    note('bad', `eval() ran and returned ${result}.`);
  },
  image() {
    const img = new Image(40, 40);
    img.alt = 'A photo from another site';
    img.onload = () => note('bad', 'The image from another site loaded.');
    img.src = 'https://example.com/photo.jpg';
    out.replaceChildren(img);
  },
  async fetch() {
    await fetch('https://example.com/data.json');
    note('bad', 'fetch() to another site succeeded.');
  },
  sri(good) {
    const script = document.createElement('script');
    script.src = policy.createScriptURL('csp/extra.js');
    script.integrity = good ? INTEGRITY : 'sha384-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    script.onerror = () => note('good', 'The script was blocked: its contents do not match the integrity hash.');
    document.head.append(script);
  },
};
window.addEventListener('extra-loaded', () => note('good', 'The script ran: its contents match the integrity hash.'));

document.getElementById('tests').addEventListener('click', async (e) => {
  const button = e.target.closest('button[data-test]');
  if (!button) return;
  const [name, arg] = button.dataset.test.split(':');
  try {
    await tests[name](arg === 'good');
  } catch (err) {
    note('good', `${err.name}: ${err.message}`);
  }
});
document.getElementById('clear').addEventListener('click', () => { log.replaceChildren(); out.replaceChildren(); document.title = '35-2 Content Security Policy'; });
