// Reports what the browser did with the hero image: which file, how big, and whether the page jumped
const report = document.getElementById('report');
const img = document.querySelector('.hero img');
let shift = 0;
if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
  new PerformanceObserver(list => {
    for (const e of list.getEntries()) if (!e.hadRecentInput) shift += e.value;
    show();
  }).observe({ type: 'layout-shift', buffered: true });
}

// naturalWidth is divided by the srcset density, so read the file's own size from a plain copy
const filePixels = {};
function measure(src) {
  if (src in filePixels) return filePixels[src];
  filePixels[src] = null;
  const probe = new Image();
  probe.onload = () => { filePixels[src] = probe.naturalWidth; show(); };
  probe.src = src;
  return null;
}

function show() {
  if (!img.currentSrc) return;
  const pixels = measure(img.currentSrc);
  const file = img.currentSrc.split('/').pop();
  const entry = performance.getEntriesByName(img.currentSrc)[0];
  const kb = entry && entry.encodedBodySize ? `${(entry.encodedBodySize / 1024).toFixed(1)} KB` : 'unknown';
  const box = img.getBoundingClientRect();
  const needed = Math.round(box.width * devicePixelRatio);
  const rows = [
    ['Screen', `${innerWidth} px wide, ${devicePixelRatio}× pixels`],
    ['File loaded', file],
    ['File size', kb],
    ['Image pixels', `${pixels ?? '…'} wide; this screen needs about ${needed}`],
    ['loading', img.loading],
    ['fetchpriority', img.getAttribute('fetchpriority') || 'auto'],
    ['Layout shift', shift ? shift.toFixed(3) + ' (the text jumped when the image arrived)' : '0'],
  ];
  report.replaceChildren(...rows.flatMap(([k, v]) => {
    const dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = k; dd.textContent = v; return [dt, dd];
  }));
}

img.addEventListener('load', () => setTimeout(show, 50));
if (img.complete) show();
addEventListener('resize', () => { clearTimeout(show.t); show.t = setTimeout(show, 300); });
