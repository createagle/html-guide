// A module runs after the document is parsed, like defer, so no DOMContentLoaded wrapper
import { formatPrice } from 'money';

let total = 0;
for (const row of document.querySelectorAll('#cart tbody tr')) {
  const subtotal = Number(row.dataset.price) * Number(row.dataset.qty);
  row.cells[2].textContent = formatPrice(subtotal);
  total += subtotal;
}
document.getElementById('total').textContent = formatPrice(total);
