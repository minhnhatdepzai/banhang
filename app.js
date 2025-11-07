const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ===== Scroll menu ===== */
$$('a[data-link]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.startsWith('#')) {
            e.preventDefault();
            document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== Footer year ===== */
$("#y") && ($("#y").textContent = new Date().getFullYear());

/* ===== Back to top (chỉ nếu tồn tại) ===== */
const topBtn = $("#backToTop");
if (topBtn) {
    window.addEventListener('scroll', () => {
        (window.scrollY > 300)
            ? topBtn.classList.add('show')
            : topBtn.classList.remove('show');
    });
    topBtn.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: 'smooth' })
    );
}

/* ===== Reveal on scroll ===== */
const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
        if (en.isIntersecting) {
            en.target.classList.add('reveal-visible');
            io.unobserve(en.target);
        }
    });
}, { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

/* ===== Hero: click thiết bị đổi ảnh demo ===== */
const tabletImg = $("#tabletImg");
const mobileImg = $("#mobileImg");
if (tabletImg && mobileImg) {
    const tabletImgs = ["img/hero-tablet.jpg", "img/hero-mobile.jpg"];
    const mobileImgs = ["img/hero-mobile.jpg", "img/hero-tablet.jpg"];
    let ti = 0, mi = 0;
    tabletImg.addEventListener("click", () => {
        ti = (ti + 1) % tabletImgs.length;
        tabletImg.src = tabletImgs[ti];
    });
    mobileImg.addEventListener("click", () => {
        mi = (mi + 1) % mobileImgs.length;
        mobileImg.src = mobileImgs[mi];
    });
}

/* ===== About: Xem thêm ===== */
const aboutClamp = $("#aboutClamp");
const btnMore = $("#btnMore");
if (btnMore && aboutClamp) {
    btnMore.addEventListener('click', () => {
        const expanded = aboutClamp.classList.toggle('expanded');
        btnMore.textContent = expanded ? "Thu gọn ▴" : "Xem thêm ▾";
    });
}

/* ===== About: nhiều ảnh tương tác ===== */
function makeSparkles(box) {
    const wrap = document.createElement('div');
    wrap.className = 'sparkles';
    const icons = ['✨', '⭐', '🧸', '🍯'];
    for (let i = 0; i < 9; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.textContent = icons[Math.floor(Math.random() * icons.length)];
        s.style.left = (8 + Math.random() * 84) + '%';
        s.style.bottom = (4 + Math.random() * 22) + 'px';
        wrap.appendChild(s);
    }
    box.appendChild(wrap);
    setTimeout(() => wrap.remove(), 900);
}
const toyImages = {
    stem: ["img/about-stem-1.jpg", "img/about-stem-2.jpg", "img/about-stem-3.jpg"],
    plush: ["img/about-plush-1.jpg", "img/about-plush-2.jpg", "img/about-plush-3.jpg"],
    figure: ["img/about-figure-1.jpg", "img/about-figure-2.jpg", "img/about-figure-3.jpg"]
};
const toyState = {};
$$(".toy-card").forEach(card => {
    const key = card.dataset.toy;
    const img = $("img", card);
    toyState[key] = 0;
    card.addEventListener("click", () => {
        $$(".toy-card").forEach(c => c.classList.remove("glow"));
        card.classList.add("glow");
        const imgs = toyImages[key] || [];
        if (imgs.length > 1) {
            toyState[key] = (toyState[key] + 1) % imgs.length;
            img.src = imgs[toyState[key]];
        }
        makeSparkles(card);
    });
});

/* ===== PRODUCTS DATA (trang index) ===== */
const PRODUCTS = [
    {
        id: "sp1",
        name: "Xe điều khiển RC BeeCar",
        price: 390000,
        images: ["img/sp1-1.jpg", "img/sp1-2.jpg", "img/sp1-3.jpg"],
        tags: ["RC", "Pin sạc"]
    },
    {
        id: "sp2",
        name: "Bộ lắp ráp Robot Mini",
        price: 450000,
        images: ["img/sp2-1.jpg", "img/sp2-2.jpg", "img/sp2-3.jpg"],
        tags: ["STEM", "8+"]
    },
    {
        id: "sp3",
        name: "Gấu bông HoneyBear",
        price: 220000,
        images: ["img/sp3-1.jpg", "img/sp3-2.jpg", "img/sp3-3.jpg"],
        tags: ["Mềm mịn", "Quà tặng"]
    },
    {
        id: "sp4",
        name: "Xếp hình City Blocks",
        price: 310000,
        images: ["img/sp4-1.jpg", "img/sp4-2.jpg", "img/sp4-3.jpg"],
        tags: ["Gỗ", "Tư duy"]
    },
    {
        id: "sp5",
        name: "Bộ nấu ăn mini",
        price: 180000,
        images: ["img/sp5-1.jpg", "img/sp5-2.jpg", "img/sp5-3.jpg"],
        tags: ["Gia đình", "Nhập vai"]
    },
    {
        id: "sp6",
        name: "Khủng long phát sáng",
        price: 275000,
        images: ["img/sp6-1.jpg", "img/sp6-2.jpg", "img/sp6-3.jpg"],
        tags: ["LED", "3+"]
    },
    {
        id: "sp7",
        name: "Búp bê BeeDoll",
        price: 260000,
        images: ["img/sp7-1.jpg", "img/sp7-2.jpg", "img/sp7-3.jpg"],
        tags: ["Trang phục", "Phụ kiện"]
    }
];

const viewport = $("#viewport");
const runningSlides = new Map();

function money(v) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
}

/* ===== CART STORAGE HELPERS ===== */
function loadCart() {
    return JSON.parse(localStorage.getItem('toybee_cart') || '[]');
}
function saveCart(cart) {
    localStorage.setItem('toybee_cart', JSON.stringify(cart));
}

/* ===== LOGIN CHECK ===== */
function isLoggedIn() {
    return !!localStorage.getItem('toybee_current');
}

/* ===== CART PANEL ELEMENTS (dùng chung tất cả trang) ===== */
const cartPanel = $("#cartPanel");
const cartOverlay = $("#cartOverlay");

/* ===== MINI CART RENDER + COUNT ===== */
function updateCartCount() {
    const el = $("#cartCount");
    if (!el) return;
    const cart = loadCart();
    const total = cart.reduce((s, i) => s + i.qty, 0);
    if (total > 0) {
        el.textContent = total;
        el.style.display = 'flex';
    } else {
        el.textContent = '0';
        el.style.display = 'none';
    }
}

function renderMiniCart() {
    const box = $("#cartItems");
    const subEl = $("#cartSubtotal");
    if (!box || !subEl) return; // trang không có panel thì thôi

    const cart = loadCart();
    box.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        box.innerHTML = '<p class="cart-list-empty">Giỏ hàng trống. Hãy chọn vài món đáng yêu nhé 🧸</p>';
    } else {
        cart.forEach(it => {
            subtotal += it.price * it.qty;
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <div class="ci-img"><img src="${it.img}" alt=""></div>
                <div class="ci-info">
                    <div class="ci-name">${it.name}</div>
                    <div class="ci-price">${money(it.price)}</div>
                    <div class="ci-qty">
                        <button data-act="dec">-</button>
                        <span>${it.qty}</span>
                        <button data-act="inc">+</button>
                    </div>
                </div>
                <button class="ci-remove">&times;</button>
            `;
            const [decBtn, incBtn] = row.querySelectorAll('.ci-qty button');
            decBtn.addEventListener('click', () => changeQty(it.id, -1));
            incBtn.addEventListener('click', () => changeQty(it.id, 1));
            row.querySelector('.ci-remove').addEventListener('click', () => removeItem(it.id));
            box.appendChild(row);
        });
    }

    subEl.textContent = money(subtotal);
    updateCartCount();
}

/* ===== CART OPERATIONS ===== */
function addToCart(p) {
    if (!isLoggedIn()) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
        window.location.href = 'login/login.html';
        return false;
    }

    const cart = loadCart();
    let item = cart.find(i => i.id === p.id);
    if (item) item.qty += 1;
    else cart.push({ id: p.id, name: p.name, price: p.price, img: p.images[0], qty: 1 });
    saveCart(cart);
    renderMiniCart();
    openCart();
    return true;
}

function changeQty(id, delta) {
    const cart = loadCart();
    const it = cart.find(i => i.id === id);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) {
        const idx = cart.indexOf(it);
        cart.splice(idx, 1);
    }
    saveCart(cart);
    renderMiniCart();
}
function removeItem(id) {
    const cart = loadCart().filter(i => i.id !== id);
    saveCart(cart);
    renderMiniCart();
}

function openCart() {
    if (!cartPanel || !cartOverlay) return;
    cartPanel.classList.add('open');
    cartOverlay.classList.add('show');
}
function closeCart() {
    if (!cartPanel || !cartOverlay) return;
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('show');
}

/* ===== CART UI EVENTS ===== */
$("#cartClose")?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);

$("#viewCartBtn")?.addEventListener('click', () => {
    location.href = 'cart.html';
});
$("#checkoutBtn")?.addEventListener('click', () => {
    location.href = 'cart.html';
});

$("#cartToggle")?.addEventListener('click', () => {
    openCart();
});

/* ===== INDEX: render carousel nếu có ===== */
function makeCard(p) {
    const wrap = document.createElement('div');
    wrap.className = 'card';
    wrap.dataset.id = p.id;
    wrap.innerHTML = `
        <div class="pic">
            <img alt="${p.name}" src="${p.images[0]}">
        </div>
        <div class="info">
            <div class="name">${p.name}</div>
            <div class="tags">${p.tags.join(' • ')}</div>
            <div class="price">${money(p.price)}</div>
            <div class="card-actions">
                <button class="btn add-cart-btn">Thêm giỏ hàng</button>
                <button class="btn buy-btn ghost">Mua ngay</button>
            </div>
        </div>
    `;

    const img = $('img', wrap);
    const addBtn = $('.add-cart-btn', wrap);
    const buyBtn = $('.buy-btn', wrap);

    let hoverTimer = null;
    let slideTimer = null;
    let idx = 0;

    wrap.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
            if (p.images.length <= 1) return;
            slideTimer = setInterval(() => {
                idx = (idx + 1) % p.images.length;
                img.src = p.images[idx];
            }, 1000);
        }, 1000);
    });

    wrap.addEventListener('mouseleave', () => {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
        idx = 0;
        img.src = p.images[0];
    });

    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(p);
    });

    buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (addToCart(p)) {
            window.location.href = 'cart.html';
        }
    });

    return wrap;
}

let ring = PRODUCTS.slice();
function renderProducts() {
    if (!viewport) return;
    viewport.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'cards';
    ring.forEach(p => list.appendChild(makeCard(p)));
    viewport.appendChild(list);
}
renderProducts();
$("#prevBtn")?.addEventListener('click', () => {
    ring.unshift(ring.pop());
    renderProducts();
});
$("#nextBtn")?.addEventListener('click', () => {
    ring.push(ring.shift());
    renderProducts();
});

/* ===== AUTH: default user + avatar ===== */
function ensureDefaultUser() {
    const users = JSON.parse(localStorage.getItem('toybee_users') || '[]');
    if (!users.find(u => u.account === '0901234567')) {
        users.push({
            account: '0901234567',
            password: 'matkhaune123',
            name: 'Lê Minh Nhật',
            email: 'nhat@example.com'
        });
        localStorage.setItem('toybee_users', JSON.stringify(users));
    }
}

function updateAuthUI() {
    const current = JSON.parse(localStorage.getItem('toybee_current') || 'null');
    const box = $("#authArea");
    if (!box) return;

    if (current) {
        const initials = (current.name || current.account || 'U')
            .trim().split(' ')
            .map(x => x[0])
            .slice(-2)
            .join('')
            .toUpperCase();
        box.innerHTML = `
            <div class="user-chip">
                <div class="avatar">${initials}</div>
                <div>
                    <div style="font-weight:800">${current.name || current.account}</div>
                    <button id="logoutBtn" class="btn tiny ghost">Đăng xuất</button>
                </div>
            </div>
        `;
        $("#logoutBtn")?.addEventListener('click', () => {
            localStorage.removeItem('toybee_current');
            updateAuthUI();
            renderMiniCart();
        });
    } else {
        box.innerHTML = `
            <a class="btn ghost" href="login/login.html">Đăng nhập</a>
            <a class="btn" href="login/register.html">Đăng ký</a>
        `;
    }
}

ensureDefaultUser();
updateAuthUI();

/* ===== INIT CART LÚC LOAD ===== */
window.addEventListener('load', () => {
    renderMiniCart();
});
