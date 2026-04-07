const orderButtons = document.querySelectorAll('.order-btn');
orderButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.cake-card');
    const name = card.querySelector('h3').innerText;
    const priceText = card.querySelector('p').innerText;
    const price = parseFloat(priceText.replace(/[^0-9\.]+/g,""));
    const img = card.querySelector('img').src;

    let cart = JSON.parse(localStorage.getItem('cakeOrders')) || [];

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, img });
    }

    localStorage.setItem('cakeOrders', JSON.stringify(cart));

    alert('Thank you for your order! We will contact you soon.');

    window.location.href = "order.html";
  });
});
