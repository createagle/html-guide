// Exercise 33-1 · cycles through the reviews. Loaded with defer, so the DOM is ready when it runs.
function startQuotes() {
  const quotes = ['“The Ridge Loop was the best day of our trip.” Ana', '“Clear signs, great views, easy parking.” Tom', '“We came back the next weekend.” Mei'];
  const text = document.getElementById('quote');
  let i = 0;
  document.getElementById('next-quote').addEventListener('click', () => {
    i = (i + 1) % quotes.length;
    text.textContent = quotes[i];
  });
}
startQuotes();
