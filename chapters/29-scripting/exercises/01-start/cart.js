// Runs in <head>, so it has to wait for the rest of the page to be parsed
document.addEventListener('DOMContentLoaded', function () {
  var rows = document.querySelectorAll('#cart tbody tr');
  var total = 0;
  for (var i = 0; i < rows.length; i++) {
    var price = parseFloat(rows[i].getAttribute('data-price'));
    var qty = parseInt(rows[i].getAttribute('data-qty'), 10);
    rows[i].cells[2].textContent = formatPrice(price * qty);
    total += price * qty;
  }
  document.getElementById('total').textContent = formatPrice(total);
});
