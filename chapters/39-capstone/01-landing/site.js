// Open Web Day · registration form and confirmation dialog
const form = document.getElementById('registration');
const errors = document.getElementById('errors');
const extras = document.getElementById('extras');
const dialog = document.getElementById('done');

// One message per field and problem, shown next to the field and in the summary
const messages = {
  name: { valueMissing: 'Enter your full name' },
  email: { valueMissing: 'Enter your email address', typeMismatch: 'Enter an email address like name@example.com' },
  attend: { valueMissing: 'Choose how you will attend' },
  conduct: { valueMissing: 'Agree to the code of conduct to register' },
};

// Without this script the browser's own validation still runs
form.noValidate = true;

function messageFor(input) {
  const text = messages[input.name];
  for (const problem in text) if (input.validity[problem]) return text[problem];
  return '';
}

// Radios share one message, attached to their fieldset
function describe(name, input, text) {
  const target = name === 'attend' ? document.getElementById('attend-field') : input;
  const id = name + '-error';
  let error = document.getElementById(id);
  if (!error) {
    error = document.createElement('p');
    error.className = 'error';
    error.id = id;
    if (name === 'attend') target.querySelector('legend').after(error);
    else if (input.type === 'checkbox') input.closest('label').before(error);
    else input.before(error);
  }
  error.textContent = text;
  error.hidden = !text;
  const ids = (target.getAttribute('aria-describedby') || '').split(' ').filter(x => x && x !== id);
  if (text) ids.unshift(id);
  if (ids.length) target.setAttribute('aria-describedby', ids.join(' '));
  else target.removeAttribute('aria-describedby');
  for (const el of name === 'attend' ? form.elements.attend : [input]) {
    if (text) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  }
}

function check() {
  const problems = [];
  for (const name in messages) {
    const field = form.elements[name];
    const input = field instanceof RadioNodeList ? field[0] : field;
    const text = messageFor(input);
    describe(name, input, text);
    if (text) problems.push({ id: input.id, text });
  }
  return problems;
}

function showSummary(problems) {
  errors.querySelector('h3').textContent = problems.length === 1 ? 'There is a problem' : `There are ${problems.length} problems`;
  errors.querySelector('ul').replaceChildren(...problems.map(({ id, text }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = text;
    li.append(a);
    return li;
  }));
  errors.hidden = false;
  errors.focus();
}

// A fragment link scrolls to the field but does not focus it
errors.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  e.preventDefault();
  document.getElementById(link.hash.slice(1)).focus();
});

form.addEventListener('change', e => {
  if (e.target.name === 'attend') extras.disabled = e.target.value === 'online';
  if (form.dataset.checked) check();
});
form.addEventListener('input', () => { if (form.dataset.checked) check(); });

form.addEventListener('submit', e => {
  e.preventDefault();
  form.dataset.checked = 'true';
  const problems = check();
  if (problems.length) return showSummary(problems);
  errors.hidden = true;
  showConfirmation();
});

function showConfirmation() {
  const data = new FormData(form);
  const rows = [
    ['Name', data.get('name').trim()],
    ['Email', data.get('email').trim()],
    ['Attending', data.get('attend') === 'online' ? 'Online stream' : 'In person'],
  ];
  if (!extras.disabled) {
    rows.push(['Workshop', form.elements.workshop.selectedOptions[0].text]);
    rows.push(['Lunch', form.elements.diet.selectedOptions[0].text]);
  }
  document.getElementById('summary').replaceChildren(...rows.flatMap(([term, value]) => {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = term;
    dd.textContent = value;
    return [dt, dd];
  }));
  dialog.showModal();
}

// Start again after the dialog closes; focus goes back to the Register button
dialog.addEventListener('close', () => {
  form.reset();
  extras.disabled = false;
  delete form.dataset.checked;
  for (const name in messages) {
    const field = form.elements[name];
    describe(name, field instanceof RadioNodeList ? field[0] : field, '');
  }
});

// Open a FAQ answer when a link points at it, e.g. the code of conduct
function openTarget(hash) {
  const target = hash && document.getElementById(hash.slice(1));
  if (target instanceof HTMLDetailsElement) target.open = true;
}
document.addEventListener('click', e => openTarget(e.target.closest('a[href^="#"]')?.hash));
addEventListener('hashchange', () => openTarget(location.hash));
openTarget(location.hash);
