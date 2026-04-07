// ---------- GLOBAL / STATE ----------
let cart = JSON.parse(localStorage.getItem('cakeOrders')) || [];
let appliedCoupon = null; // { code: 'SWEET30', type: 'percent'|'fixed'|'freedel', value: 30 } or null

const cartItems = document.getElementById('cart-items');
const totalItems = document.getElementById('total-items');
const subTotalEl = document.getElementById('sub-total');
const shippingEl = document.getElementById('shipping');
const taxesEl = document.getElementById('taxes');
const discountEl = document.getElementById('discount');
const totalEl = document.getElementById('total');

const discountMsg = document.getElementById('discountMsg'); // make sure this exists in HTML

const receiptModal = document.getElementById('receiptModal');
const receiptDetails = document.getElementById('receipt-details');
const closeModal = document.querySelector('.close');

// ---------- COUPON LIST (edit here) ----------
const COUPONS = {
  'SWEET30': { type: 'percent', value: 30 },
  'CAKE10': { type: 'percent', value: 10 },
  'SWEET10': { type: 'percent', value: 10 }, // keep backwards compat
  'FREEDEL': { type: 'freedel', value: 0 },
  'FLAT5': { type: 'fixed', value: 5 } // example fixed $5 off
};

// ---------- RENDER / CALC ----------
function calculateSubTotal() {
  return cart.reduce((sum, it) => sum + (it.price * it.quantity), 0);
}

function getShippingFor(subTotal, appliedCoupon) {
  // default: free if subTotal > 50, else $5. If FREEDEL coupon used -> 0
  if (appliedCoupon && appliedCoupon.type === 'freedel') return 0;
  return subTotal > 50 ? 0 : 5;
}

function renderCart() {
  cartItems.innerHTML = '';
  let subTotal = calculateSubTotal();
  let itemsCount = cart.reduce((s, it) => s + it.quantity, 0);

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    const card = document.createElement('div');
    card.className = 'cake-card';
    card.innerHTML = `
      <div class="cake-info">
        <img src="${item.img}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div class="cake-quantity">
        <button onclick="updateQuantity(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${index}, 1)">+</button>
      </div>
      <div class="cake-subtotal">$${subtotal.toFixed(2)}</div>
      <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
    `;
    cartItems.appendChild(card);
  });

  totalItems.textContent = itemsCount;
  subTotalEl.textContent = subTotal.toFixed(2);

  // recalc shipping/taxes/discount/total
  const shipping = getShippingFor(subTotal, appliedCoupon);
  shippingEl.textContent = shipping.toFixed(2);

  const taxes = +(subTotal * 0.05).toFixed(2);
  taxesEl.textContent = taxes.toFixed(2);

  // discount calculation based on appliedCoupon
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = +(subTotal * (appliedCoupon.value / 100)).toFixed(2);
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(appliedCoupon.value, subTotal); // don't go below 0
    } else if (appliedCoupon.type === 'freedel') {
      discountAmount = 0;
    }
  }
  discountEl.textContent = discountAmount.toFixed(2);

  const total = +(subTotal - discountAmount + shipping + taxes).toFixed(2);
  totalEl.textContent = total.toFixed(2);

  // update coupon message UI
  if (appliedCoupon) {
    if (appliedCoupon.type === 'freedel') {
      discountMsg.textContent = `🎉 ${appliedCoupon.code} applied: FREE delivery`;
    } else if (appliedCoupon.type === 'percent') {
      discountMsg.textContent = `🎉 ${appliedCoupon.code} applied: ${appliedCoupon.value}% OFF (${discountAmount.toFixed(2)} saved)`;
    } else {
      discountMsg.textContent = `🎉 ${appliedCoupon.code} applied: $${discountAmount.toFixed(2)} off`;
    }
    discountMsg.style.color = 'green';
  } else {
    discountMsg.textContent = '';
  }
}

// ---------- CART MUTATIONS ----------
function updateQuantity(index, change) { 
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function deleteItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cakeOrders', JSON.stringify(cart));
}

// ---------- CLEAR CART ----------
document.getElementById('clearCart').addEventListener('click', () => {
  cart = [];
  appliedCoupon = null;
  saveCart();
  renderCart();
});

// ---------- APPLY COUPON (single handler) ----------
function applyCouponHandler() {
  const codeRaw = document.getElementById('coupon').value.trim().toUpperCase();
  if (!codeRaw) {
    discountMsg.textContent = 'Enter a coupon code.';
    discountMsg.style.color = 'red';
    return;
  }

  const found = COUPONS[codeRaw];
  if (!found) {
    appliedCoupon = null;
    discountMsg.textContent = '❌ Invalid coupon code!';
    discountMsg.style.color = 'red';
    renderCart(); // reset totals
    return;
  }

  // set appliedCoupon object with code included
  appliedCoupon = { code: codeRaw, ...found };

  // Re-render so totals update correctly
  renderCart();

  // Save applied coupon in localStorage so it persists if you want
  localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));

  // friendly alert (optional)
  alert('Coupon Applied! 🎉');
}

document.getElementById('applyCoupon').addEventListener('click', applyCouponHandler);

// restore coupon on load if you want
const savedCoupon = JSON.parse(localStorage.getItem('appliedCoupon'));
if (savedCoupon) appliedCoupon = savedCoupon;

document.getElementById('checkout').addEventListener('click', () => {
  if (cart.length === 0) return alert("Cart is empty! 🛒");

  let receiptHTML = "<ul>";
  cart.forEach(item => {
    receiptHTML += `<li>${item.name} x${item.quantity} - $${(item.price*item.quantity).toFixed(2)}</li>`;
  });
  receiptHTML += `</ul>
  <p>Subtotal: $${subTotalEl.textContent}</p>
  <p>Shipping: $${shippingEl.textContent}</p>
  <p>Taxes: $${taxesEl.textContent}</p>
  <p>Discount: $${discountEl.textContent}</p>
  <h3>Total: $${totalEl.textContent}</h3>`;

  receiptDetails.innerHTML = receiptHTML;
  receiptModal.style.display = 'flex';

  // Clear cart after checkout
  cart = [];
  appliedCoupon = null;
  saveCart();
  localStorage.removeItem('appliedCoupon');
  renderCart();
});

closeModal.onclick = function() {
  receiptModal.style.display = 'none';
}

window.onclick = function(e) {
  if (e.target == receiptModal) receiptModal.style.display = 'none';
}

renderCart();
