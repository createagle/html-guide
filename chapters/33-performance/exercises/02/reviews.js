// Exercise 33-2 · stands in for a large reviews widget (imagine 200 KB of script).
window.renderReviews = function renderReviews(container) {
  const reviews = [
    ['Ana', 5, 'The ridge at sunrise was worth the early start.'],
    ['Tom', 4, 'Well marked. The lake path gets muddy after rain.'],
    ['Mei', 5, 'Our kids (8 and 11) managed the whole loop.'],
  ];
  const list = document.createElement('ul');
  list.className = 'reviews';
  for (const [name, stars, text] of reviews) {
    const li = document.createElement('li');
    const who = document.createElement('strong');
    who.textContent = `${name} · ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}`;
    const p = document.createElement('p');
    p.textContent = text;
    li.append(who, p);
    list.append(li);
  }
  container.replaceChildren(list);
};
