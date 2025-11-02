// Product data using local images
const products = [
  { id: 1, title: "Red Dress", price: 49.99, image: "image01.jpg" },
  { id: 2, title: "Blue Gown", price: 59.99, image: "image02.jpg" },
  { id: 3, title: "Floral Dress", price: 79.99, image: "image03.jpg" },
  { id: 4, title: "Suit & Pant", price: 29.99, image: "image04.jpg" },
  { id: 5, title: "White T-Shirt", price: 99.99, image: "image05.png" },
  { id: 6, title: "Skirt", price: 19.99, image: "image06.jpg" },
  { id: 7, title: "Accessories", price: 129.99, image: "image07.jpg" },
  { id: 8, title: "Sport Sneakers", price: 39.99, image: "image08.jpeg" },
  { id: 9, title: "Leather Bags", price: 89.99, image: "image09.jpg" }
];

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart icon
function updateCartIcon() {
  const icon = document.getElementById("cart-icon");
  if (icon) {
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);
    icon.setAttribute("data-quantity", count);
  }
}

// Add product to cart
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  updateCartIcon();
}

// Render products on index.html
// Render products on index.html
function renderProducts() {
  const productList = document.getElementById("productList");
  if (!productList) return;

  productList.innerHTML = products
    .map(
      (p) => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button class="add-cart" onclick="addToCart(${p.id}); this.textContent='Added';">Add to Cart</button>
    </div>
  `
    )
    .join("");
}


// Render cart page
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "0.00";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}">
      <p>${item.title}</p>
      <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="quantity-input">
      <p>$${(item.price * item.quantity).toFixed(2)}</p>
      <button class="remove-btn" data-id="${item.id}">Remove</button>
    </div>
  `
    )
    .join("");

  // Remove item
  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => removeFromCart(parseInt(e.target.dataset.id)))
  );

  // Change quantity
  document.querySelectorAll(".quantity-input").forEach((input) =>
    input.addEventListener("change", (e) => {
      const id = parseInt(e.target.dataset.id);
      const val = parseInt(e.target.value);
      changeQuantity(id, val);
    })
  );

  // Update total
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cartTotal.textContent = total.toFixed(2);

  // Checkout
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      if (!cart.length) return alert("Cart is empty!");
      try {
        const res = await fetch("/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart }),
        });

        const data = await res.json();
        if (data.success) {
          alert("✅ Order placed successfully!");
          localStorage.removeItem("cart");
          window.location.href = "/success"; // redirect
        } else {
          alert("❌ Order failed: " + data.message);
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Server error. Try again later.");
      }
    });
  }
}

// Change quantity
function changeQuantity(id, qty) {
  if (qty < 1) return;
  const item = cart.find((i) => i.id === id);
  if (item) item.quantity = qty;
  saveCart();
  renderCart();
  updateCartIcon();
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
  updateCartIcon();
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("productList")) renderProducts();
  if (document.getElementById("cartItems")) renderCart();
  updateCartIcon();
});
