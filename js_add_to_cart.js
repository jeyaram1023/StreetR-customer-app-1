// js_add_to_cart.js
let cart = [];

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartDisplay();
    saveCart();
}

function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalEl.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image_url || 'https://via.placeholder.com/60'}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="changeQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.id}', 1)">+</button>
            </div>
        `;
        container.appendChild(cartItemEl);
    });
    totalEl.textContent = total.toFixed(2);
}

function changeQuantity(itemId, amount) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.id !== itemId);
        }
    }
    updateCartDisplay();
    saveCart();
}

function saveCart() {
    localStorage.setItem('streetrCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('streetrCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
}

// Load cart on startup
document.addEventListener('DOMContentLoaded', loadCart);
