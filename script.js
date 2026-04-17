// ─── Custom Cursor ───────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('button, a, .product-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
  });
});

// ─── Products Data ────────────────────────────────────────────────────────────
const products = [
  { id: 1, brand: 'APEX', name: 'ProBook Air',    category: 'business', price: 899,  old: 1099, badge: 'sale', specs: ['Intel i7-14th', '16GB DDR5', '512GB NVMe', '14" FHD'],   color: '#e8ff00' },
  { id: 2, brand: 'APEX', name: 'Titan X Pro',    category: 'gaming',   price: 1599, old: 2299, badge: 'sale', specs: ['Intel i9-14th', '32GB DDR5', '2TB NVMe', '16" 240Hz'],   color: '#ff3c00' },
  { id: 3, brand: 'APEX', name: 'Studio 15',      category: 'creative', price: 1199, old: 1399, badge: 'new',  specs: ['Ryzen 9', '32GB DDR5', '1TB NVMe', 'OLED 4K'],           color: '#00f0ff' },
  { id: 4, brand: 'APEX', name: 'UltraSlim 13',   category: 'business', price: 799,  old: null, badge: '',     specs: ['Intel i5-13th', '8GB DDR5', '256GB SSD', '13.3" FHD'],   color: '#e8ff00' },
  { id: 5, brand: 'APEX', name: 'RazerEdge G16',  category: 'gaming',   price: 1349, old: 1599, badge: 'sale', specs: ['Intel i7-13th', '16GB DDR5', '1TB NVMe', '16" 165Hz'],   color: '#ff3c00' },
  { id: 6, brand: 'APEX', name: 'Flex 360',       category: 'creative', price: 1049, old: null, badge: 'new',  specs: ['AMD Ryzen 7', '16GB', '512GB NVMe', '14" OLED Touch'],   color: '#b06eff' },
  { id: 7, brand: 'APEX', name: 'WorkForce Pro',  category: 'business', price: 949,  old: 1149, badge: 'sale', specs: ['Intel i7-14th', '16GB DDR4', '512GB SSD', '15.6" FHD'], color: '#e8ff00' },
  { id: 8, brand: 'APEX', name: 'BudgetBook 14',  category: 'budget',   price: 499,  old: 599,  badge: 'sale', specs: ['Intel Celeron', '8GB DDR4', '256GB eMMC', '14" HD'],     color: '#888'    },
  { id: 9, brand: 'APEX', name: 'PowerFlex 15',   category: 'budget',   price: 649,  old: null, badge: '',     specs: ['AMD Ryzen 5', '8GB DDR5', '512GB NVMe', '15.6" FHD'],   color: '#e8ff00' },
];

// ─── Laptop SVG Icon ──────────────────────────────────────────────────────────
function laptopIcon(color = '#e8ff00') {
  return `<svg viewBox="0 0 120 85" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="60" width="110" height="18" rx="3" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="1"/>
    <rect x="5" y="57" width="110" height="6" rx="1" fill="#111"/>
    <rect x="10" y="10" width="100" height="50" rx="5" fill="#151515" stroke="#222" stroke-width="1.5"/>
    <rect x="14" y="14" width="92" height="42" rx="3" fill="#0a0a0a"/>
    <rect x="16" y="16" width="88" height="38" rx="2" fill="url(#g${color.replace('#', '')})"/>
    <defs>
      <linearGradient id="g${color.replace('#', '')}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    <circle cx="60" cy="7" r="1.5" fill="#111" stroke="#1f1f1f" stroke-width="0.5"/>
  </svg>`;
}

// ─── State ────────────────────────────────────────────────────────────────────
let cart = [];
let activeFilter = 'all';

// ─── Render Products ──────────────────────────────────────────────────────────
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    return `<div class="product-card reveal" data-category="${p.category}">
      ${p.badge ? `<div class="product-badge ${p.badge}">${p.badge === 'new' ? 'NEW' : 'SALE'}</div>` : ''}
      <div class="product-img-wrap">${laptopIcon(p.color)}</div>
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-specs">${p.specs.map(s => `<span class="spec-tag">${s}</span>`).join('')}</div>
      <div class="product-footer">
        <div>
          ${p.old ? `<div class="product-old-price">$${p.old.toLocaleString()}</div>` : ''}
          <div class="product-price">$${p.price.toLocaleString()}</div>
        </div>
        <button class="add-cart-btn${inCart ? ' added' : ''}" onclick="addToCart(${p.id})">
          ${inCart ? '✓ Added' : '+ Cart'}
        </button>
      </div>
    </div>`;
  }).join('');

  // Trigger reveal animations
  setTimeout(() => {
    document.querySelectorAll('.product-card').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  }, 50);
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
if (document.getElementById('filterBar')) {
  document.getElementById('filterBar').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts(activeFilter);
  });
}

// ─── Cart Logic ───────────────────────────────────────────────────────────────
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  if (!cart.find(c => c.id === id)) {
    cart.push({ ...product, qty: 1 });
    updateCartUI();
    renderProducts(activeFilter);
    // Flash cart count
    const cc = document.getElementById('cartCount');
    cc.style.transform = 'scale(1.5)';
    setTimeout(() => cc.style.transform = 'scale(1)', 200);
  }
}

function addDealToCart() {
  addToCart(2); // Titan X Pro
  toggleCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  renderProducts(activeFilter);
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="empty-cart">YOUR CART IS EMPTY</div>';
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${laptopIcon(item.color)}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toLocaleString()}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `).join('');
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cartTotal').textContent = '$' + total.toLocaleString();
    footerEl.style.display = 'block';
  }
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
if (document.getElementById('cdHours')) {
  let dealEnd = Date.now() + 8 * 3600 * 1000 + 24 * 60 * 1000;

  function updateCountdown() {
    const diff = dealEnd - Date.now();
    if (diff <= 0) {
      dealEnd = Date.now() + 24 * 3600 * 1000;
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Check for elements already in view on load
document.querySelectorAll('.reveal').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('visible');
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────
if (document.getElementById('productGrid')) {
  renderProducts();
}
