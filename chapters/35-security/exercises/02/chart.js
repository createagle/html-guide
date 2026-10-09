// Exercise 35-2 · stands in for a charting library loaded from a CDN
for (const chart of document.querySelectorAll('[data-chart]')) {
  const values = chart.dataset.chart.split(',').map(Number);
  const max = Math.max(...values);
  chart.replaceChildren(...values.map((v) => {
    const bar = document.createElement('span');
    bar.style.blockSize = `${(v / max) * 100}%`;
    bar.title = `${v} km`;
    return bar;
  }));
}
