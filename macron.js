let cart = JSON.parse(localStorage.getItem('cakeOrders')) || [];

function addToCart(name, price, img) {
  const item = cart.find(i => i.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      img: img,       // Store image in cart
      quantity: 1
    });
  }

  localStorage.setItem('cakeOrders', JSON.stringify(cart));
  alert(name + " added to cart!");
}
