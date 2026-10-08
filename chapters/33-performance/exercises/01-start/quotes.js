// Exercise 33-1 · cycles through the reviews. It needs the DOM, so it waits for it.
function startQuotes() {
  const quotes = ['“The Ridge Loop was the best day of our trip.” Ana', '“Clear signs, great views, easy parking.” Tom', '“We came back the next weekend.” Mei'];
  const text = document.getElementById('quote');
  let i = 0;
  document.getElementById('next-quote').addEventListener('click', () => {
    i = (i + 1) % quotes.length;
    text.textContent = quotes[i];
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startQuotes);
else startQuotes();
