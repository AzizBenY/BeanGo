const openCart = document.getElementById('openCart');
const closeCart = document.getElementById('closeCart');
const cartPopup = document.getElementById('cartPopup');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const emptyMessage = document.getElementById('emptyMessage');

// Mock data pour tester
let cartItems = [
  { id: 1, name: 'Creamy Latte', price: 8, quantity: 1, image: 'images/creamy-latte.png' },
  { id: 2, name: 'Cappuccino Latte', price: 10, quantity: 1, image: 'images/cappuccino-latte.png' },
  { id: 3, name: 'Espresso Delight', price: 9, quantity: 1, image: 'images/Espresso Delight.png' },
  { id: 4, name: 'Mocha Bliss', price: 15, quantity: 1, image: 'images/Mocha Bliss.png' }
];

// Ouvrir / Fermer le panier avec overlay
openCart.onclick = () => {
  cartPopup.classList.add('open');
  overlay.classList.add('show');
};

closeCart.onclick = () => {
  cartPopup.classList.remove('open');
  overlay.classList.remove('show');
};

// Affichage dynamique des items dans le panier
function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cartItems.length === 0) {
    emptyMessage.style.display = 'block';
    cartTotal.textContent = 'Rp. 0dt';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  } else {
    emptyMessage.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    itemDiv.innerHTML = `
      <div class="image-wrapper">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="item-info">
        <p>${item.name}</p>
        <p class="price">Rp. ${item.price * item.quantity}dt</p>
        <div class="quantity-control">
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">&times;</button>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotal.textContent = `Rp. ${total}dt`;
  if (checkoutBtn) checkoutBtn.disabled = (cartItems.length === 0);
}

// Gérer la quantité d'articles
function updateQuantity(index, change) {
  cartItems[index].quantity += change;
  if (cartItems[index].quantity < 1) {
    removeItem(index);
  } else {
    renderCart();
  }
}

// Supprimer un produit avec animation
function removeItem(index) {
  const itemElements = document.querySelectorAll('.cart-item');
  const itemToRemove = itemElements[index];

  if (!itemToRemove) return;

  itemToRemove.classList.add('removing');

  setTimeout(() => {
    cartItems.splice(index, 1);
    renderCart();
  }, 300);
}

// Gestion du scroll et fixation des boutons
const cartTotalSection = document.querySelector('.cart-total');
const orderBtn = document.querySelector('.order-btn');
const backMenu = document.querySelector('.back-menu');

cartPopup.addEventListener('scroll', () => {
  const scrollPosition = cartPopup.scrollTop;
  const totalHeight = cartPopup.scrollHeight - cartPopup.offsetHeight;
  if (scrollPosition < totalHeight - cartTotalSection.offsetHeight) {
    orderBtn.style.position = 'absolute';
    orderBtn.style.bottom = '20px';
    backMenu.style.position = 'absolute';
    backMenu.style.bottom = '60px';
  } else {
    orderBtn.style.position = 'fixed';
    orderBtn.style.bottom = '20px';
    backMenu.style.position = 'fixed';
    backMenu.style.bottom = '60px';
  }
});

renderCart(); // Affichage initial

function showCartPopup() {
  cartPopup.classList.add('open');
  overlay.classList.add('show');
  renderCart();
}

function hideCartPopup() {
  cartPopup.classList.remove('open');
  overlay.classList.remove('show');
}

// Attach to window for global access
window.showCartPopup = showCartPopup;
window.hideCartPopup = hideCartPopup;

// Checkout and Continue Shopping logic
const checkoutBtn = document.getElementById('checkoutBtn');
const continueBtn = document.getElementById('continueBtn');

if (checkoutBtn) {
  checkoutBtn.onclick = function() {
    if (cartItems.length === 0) return;
    cartItems = [];
    renderCart();
    hideCartPopup();
    // Optionally show a success message
  };
}
if (continueBtn) {
  continueBtn.onclick = function() {
    hideCartPopup();
  };
}
