let cart = JSON.parse(localStorage.getItem('cakeOrders')) || [];

function addToCart(name, price, img) {
  const item = cart.find(i => i.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      img: img,
      quantity: 1
    });
  }

  localStorage.setItem('cakeOrders', JSON.stringify(cart));
  alert(name + " added to cart!");
}

function performSearch() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let cards = document.querySelectorAll(".icecream-card");

  cards.forEach(card => {
    let name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(input) ? "block" : "none";
  });
}
