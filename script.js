// Custom Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

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

// Products Data
const products = [
  {
    id: 1,
    brand: 'LENOVO',
    name: 'ThinkPad X1 Carbon Gen 12',
    category: 'business',
    price: 2099,
    old: 2299,
    badge: 'sale',
    description: 'Premium ultrabook for executives and hybrid teams.',
    specs: ['Intel Core Ultra 7', '16GB LPDDR5X', '1TB NVMe SSD', '14" 2.8K OLED'],
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 2,
    brand: 'ASUS',
    name: 'ROG Strix G16',
    category: 'gaming',
    price: 1899,
    old: 2099,
    badge: 'sale',
    description: 'High-refresh gaming laptop built for esports and AAA titles.',
    specs: ['Intel Core i9', '32GB DDR5', '1TB NVMe SSD', '16" 240Hz QHD'],
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 3,
    brand: 'APPLE',
    name: 'MacBook Pro 14 (M3 Pro)',
    category: 'creative',
    price: 2399,
    old: null,
    badge: 'new',
    description: 'Color-accurate performance notebook for creators and editors.',
    specs: ['Apple M3 Pro', '18GB Unified', '1TB SSD', '14.2" Liquid Retina XDR'],
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 4,
    brand: 'DELL',
    name: 'Latitude 5440',
    category: 'business',
    price: 1199,
    old: null,
    badge: '',
    description: 'Reliable business laptop with strong battery life and security.',
    specs: ['Intel Core i5-13th', '16GB DDR5', '512GB SSD', '14" FHD'],
    image: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 5,
    brand: 'ACER',
    name: 'Predator Helios Neo 16',
    category: 'gaming',
    price: 1699,
    old: 1849,
    badge: 'sale',
    description: 'Powerful gaming machine with advanced cooling and GPU headroom.',
    specs: ['Intel Core i7-14th', '16GB DDR5', '1TB NVMe SSD', '16" 165Hz WQXGA'],
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 6,
    brand: 'HP',
    name: 'Spectre x360 14',
    category: 'creative',
    price: 1599,
    old: null,
    badge: 'new',
    description: 'Convertible OLED laptop for design, sketching, and daily work.',
    specs: ['Intel Core Ultra 7', '16GB LPDDR5', '1TB SSD', '14" 2.8K OLED Touch'],
    image: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 7,
    brand: 'MICROSOFT',
    name: 'Surface Laptop 6',
    category: 'business',
    price: 1499,
    old: 1649,
    badge: 'sale',
    description: 'Professional productivity laptop with clean design and AI features.',
    specs: ['Intel Core Ultra 7', '16GB LPDDR5X', '512GB SSD', '15" PixelSense'],
    image: 'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 8,
    brand: 'LENOVO',
    name: 'IdeaPad Slim 3',
    category: 'budget',
    price: 699,
    old: 799,
    badge: 'sale',
    description: 'Affordable everyday laptop for students and office basics.',
    specs: ['AMD Ryzen 5', '8GB DDR4', '512GB SSD', '15.6" FHD'],
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 9,
    brand: 'HP',
    name: 'Pavilion 15',
    category: 'budget',
    price: 849,
    old: null,
    badge: '',
    description: 'Balanced value laptop for browsing, school, and multitasking.',
    specs: ['Intel Core i5', '16GB DDR4', '512GB SSD', '15.6" FHD'],
    image: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900'
  }
];

const USD_TO_NGN = 1600;

function naira(valueInUsd) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(valueInUsd * USD_TO_NGN);
}

// State
let cart = [];
let activeFilter = 'all';
const navRoot = document.querySelector('nav');
const navMenuBtn = document.getElementById('navMenuBtn');

function closeMenu() {
  if (!navRoot || !navMenuBtn) return;
  navRoot.classList.remove('nav-open');
  navMenuBtn.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  if (!navRoot || !navMenuBtn) return;
  const isOpen = navRoot.classList.toggle('nav-open');
  navMenuBtn.setAttribute('aria-expanded', String(isOpen));
}

if (navRoot) {
  navRoot.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

// Render Products
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    return `<div class="product-card reveal" data-category="${p.category}">
      ${p.badge ? `<div class="product-badge ${p.badge}">${p.badge === 'new' ? 'NEW' : 'SALE'}</div>` : ''}
      <div class="product-img-wrap"><img class="product-image" src="${p.image}" alt="${p.brand} ${p.name}"></div>
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.description}</div>
      <div class="product-specs">${p.specs.map(s => `<span class="spec-tag">${s}</span>`).join('')}</div>
      <div class="product-footer">
        <div>
          ${p.old ? `<div class="product-old-price">${naira(p.old)}</div>` : ''}
          <div class="product-price">${naira(p.price)}</div>
        </div>
        <button class="add-cart-btn${inCart ? ' added' : ''}" onclick="addToCart(${p.id})">
          ${inCart ? 'Added' : '+ Cart'}
        </button>
      </div>
    </div>`;
  }).join('');

  setTimeout(() => {
    document.querySelectorAll('.product-card').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  }, 50);
}

// Filter Bar
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

// Cart Logic
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  if (!cart.find(c => c.id === id)) {
    cart.push({ ...product, qty: 1 });
    updateCartUI();
    renderProducts(activeFilter);
    const cc = document.getElementById('cartCount');
    cc.style.transform = 'scale(1.5)';
    setTimeout(() => {
      cc.style.transform = 'scale(1)';
    }, 200);
  }
}

function addDealToCart() {
  addToCart(2);
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
        <div class="cart-item-icon"><img class="cart-item-image" src="${item.image}" alt="${item.name}"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${naira(item.price)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">x</button>
      </div>
    `).join('');

    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cartTotal').textContent = naira(total);
    footerEl.style.display = 'block';
  }
}

function toggleCart() {
  closeMenu();
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// Countdown Timer
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

// Scroll Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.reveal').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('visible');
  }
});

// Init
if (document.getElementById('productGrid')) {
  renderProducts();
}
