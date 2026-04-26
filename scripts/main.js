// luminary/scripts/main.js
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderProducts();
    initNavbar();
    initHero();
    initAnnouncement();
    initModal();
    initDrawer();
    initIntersectionObserver();
    initNewsletter();
    updateUI();

    window.addEventListener('cartUpdated', updateUI);
    window.addEventListener('wishlistUpdated', renderProducts);
}

function updateUI() {
    // Update Bag Count
    const bagCount = document.querySelectorAll('.bag-count');
    const count = window.store.getCartCount();
    bagCount.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });

    renderCart();
}

window.currentFilter = 'ALL';
window.showAllProducts = false;

function renderProducts(filter = window.currentFilter) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let filtered = window.PRODUCTS;
    if (filter !== 'ALL') {
        filtered = window.PRODUCTS.filter(p => {
            const cat = p.category;
            if (filter === 'SKINCARE') return ['SERUM', 'OIL', 'TONER', 'SPF', 'NIGHT'].includes(cat);
            if (filter === 'BODY') return ['BODY'].includes(cat);
            if (filter === 'WELLNESS') return ['CANDLE', 'SUPPLEMENT'].includes(cat);
            return true;
        });
    }

    let toShow = filtered;
    const viewAllBtnContainer = grid.nextElementSibling;
    if (filter === 'ALL' && !window.showAllProducts) {
        toShow = filtered.slice(0, 4);
        if (viewAllBtnContainer) viewAllBtnContainer.style.display = 'block';
    } else {
        if (viewAllBtnContainer) viewAllBtnContainer.style.display = 'none';
    }

    grid.innerHTML = toShow.map(product => `
        <div class="product-card animate-in visible">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <button class="wishlist-btn ${window.store.wishlist.has(product.id) ? 'active' : ''}" onclick="window.store.toggleWishlist(${product.id})">
                ${window.store.wishlist.has(product.id) ? '✦' : '♡'}
            </button>
            <div class="card-image-area" onclick="openModal(${product.id})" style="background-image: url('${product.image}'); background-size: cover; background-position: center;">
                <!-- Icon container removed as requested, replaced with background image -->
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 onclick="openModal(${product.id})">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">★★★★★</div>
                    <span class="review-count">(${product.reviewCount})</span>
                </div>
                <div class="product-benefits">${product.benefits.join(' · ')}</div>
                <div class="product-footer">
                    <div class="product-price">$${product.price}</div>
                </div>
            </div>
            <button class="pill-button pill-button-dark add-to-bag-btn" onclick="window.store.addToCart(${product.id})">
                Add to Bag
            </button>
        </div>
    `).join('');
}

window.filterProducts = (category) => {
    window.currentFilter = category;
    window.showAllProducts = category !== 'ALL';
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toUpperCase() === category) {
            btn.classList.add('active');
        }
    });

    renderProducts(category);

    // Scroll to the product section
    const grid = document.getElementById('product-grid');
    if (grid) {
        const sectionHeader = grid.parentElement.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};

window.viewAllProducts = () => {
    window.showAllProducts = true;
    renderProducts(window.currentFilter);
    const grid = document.getElementById('product-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Scroll Progress
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const progressEl = document.getElementById('scroll-progress');
        if (progressEl) progressEl.style.width = scrollPercent + '%';
    });
}

function initHero() {
    const heroProducts = [
        { name: "Radiance Serum", price: "$64", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800", nature: "nature." },
        { name: "Velvet Rose Oil", price: "$89", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800", nature: "purity." },
        { name: "Forest Candle", price: "$48", image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800", nature: "ritual." }
    ];
    let index = 0;
    const heroVisual = document.getElementById('hero-visual-icon');
    const heroName = document.getElementById('hero-product-name');
    const heroPrice = document.getElementById('hero-product-price');
    const heroNature = document.getElementById('hero-nature-text');

    if (!heroVisual) return;

    // Set initial image
    heroVisual.style.backgroundImage = `url('${heroProducts[0].image}')`;
    heroVisual.style.backgroundSize = 'cover';
    heroVisual.style.backgroundPosition = 'center';
    heroVisual.style.borderRadius = '24px';

    setInterval(() => {
        index = (index + 1) % heroProducts.length;
        const p = heroProducts[index];
        
        heroVisual.style.opacity = 0;
        heroName.style.opacity = 0;
        
        setTimeout(() => {
            heroVisual.style.backgroundImage = `url('${p.image}')`;
            heroName.textContent = p.name;
            heroPrice.textContent = p.price;
            heroNature.textContent = p.nature;
            
            heroVisual.style.opacity = 1;
            heroName.style.opacity = 1;
        }, 500);
    }, 4000);
}

function initAnnouncement() {
    const bar = document.getElementById('announcement-bar');
    if (window.store.announcementDismissed && bar) {
        bar.style.display = 'none';
    }
}

window.dismissAnnouncement = () => {
    const bar = document.getElementById('announcement-bar');
    if (bar) bar.classList.add('hidden');
    localStorage.setItem('luminary_announcement_dismissed', 'true');
};

function initModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }
}

window.openModal = (productId) => {
    const product = window.PRODUCTS.find(p => p.id === productId);
    const modal = document.getElementById('modal-overlay');
    const content = modal.querySelector('.modal-details');
    const imageContainer = modal.querySelector('.modal-image');

    imageContainer.style.backgroundImage = `url('${product.image}')`;
    imageContainer.style.backgroundSize = 'cover';
    imageContainer.style.backgroundPosition = 'center';
    imageContainer.innerHTML = ''; // Clear icon

    content.innerHTML = `
        <div class="product-category">${product.category}</div>
        <h2>${product.name}</h2>
        <div class="product-rating">
            <div class="stars">★★★★★</div>
            <span class="review-count">${product.reviewCount} reviews</span>
        </div>
        <div class="product-price" style="margin: 20px 0; font-size: 28px;">$${product.price}</div>
        <p style="margin-bottom: 24px; color: var(--color-mole);">${product.description}</p>
        <div style="display: flex; gap: 8px; margin-bottom: 32px;">
            ${product.benefits.map(b => `<span style="border: 1px solid var(--color-gold-border); padding: 4px 12px; border-radius: 100px; font-size: 11px; color: var(--color-gold); font-weight: 600;">${b}</span>`).join('')}
        </div>
        <div style="margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase;">Select Size</div>
            <div style="display: flex; gap: 10px;">
                ${product.variants.map(v => `<button class="pill-button pill-button-ghost" style="padding: 8px 20px;">${v}</button>`).join('')}
            </div>
        </div>
        <button class="pill-button pill-button-dark" style="width: 100%; margin-top: 20px;" onclick="window.store.addToCart(${product.id}); closeModal();">Add to Bag</button>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: var(--color-mole);">
            Free shipping on orders over $80 · 30-day returns
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeModal = () => {
    document.getElementById('modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
};

function initDrawer() {
    const overlay = document.getElementById('drawer-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeCart();
        });
    }
}

window.openCart = () => {
    document.getElementById('drawer-overlay').classList.add('active');
    document.getElementById('cart-drawer').classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeCart = () => {
    document.getElementById('drawer-overlay').classList.remove('active');
    document.getElementById('cart-drawer').classList.remove('active');
    document.body.style.overflow = '';
};

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    if (window.store.cart.length === 0) {
        container.innerHTML = '<div style="text-align: center; margin-top: 100px; color: var(--color-mole);">Your bag is empty.</div>';
        const footer = document.getElementById('cart-footer');
        if (footer) footer.style.display = 'none';
        return;
    }

    const footer = document.getElementById('cart-footer');
    if (footer) footer.style.display = 'block';
    container.innerHTML = window.store.cart.map(item => {
        const product = window.PRODUCTS.find(p => p.id === item.id);
        return `
            <div style="display: flex; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 0.5px solid var(--color-stone-border);">
                <div style="width: 80px; height: 80px; background-image: url('${product.image}'); background-size: cover; background-position: center; border-radius: 12px;"></div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h4 style="font-family: 'Inter', sans-serif; font-size: 15px;">${item.name}</h4>
                        <button onclick="window.store.removeFromCart(${item.id}, '${item.variant}')" style="font-size: 12px; color: var(--color-mole);">✕</button>
                    </div>
                    <div style="font-size: 12px; color: var(--color-mole); margin: 4px 0;">${item.variant}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                        <div style="display: flex; align-items: center; border: 0.5px solid var(--color-stone-border); border-radius: 100px; padding: 4px 12px;">
                            <button onclick="window.store.updateQty(${item.id}, '${item.variant}', -1)">−</button>
                            <span style="margin: 0 12px; font-size: 13px; font-weight: 600;">${item.qty}</span>
                            <button onclick="window.store.updateQty(${item.id}, '${item.variant}', 1)">+</button>
                        </div>
                        <div style="font-weight: 700; color: var(--color-ink);">$${item.price * item.qty}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const total = window.store.getCartTotal();
    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = `$${total}`;
    
    // Gift Progress
    const threshold = 80;
    const progress = Math.min(100, (total / threshold) * 100);
    const progressText = total >= threshold ? '✦ You earned a free gift!' : `You're $${threshold - total} away from a free gift!`;
    
    const giftTextEl = document.getElementById('gift-text');
    const giftBarEl = document.getElementById('gift-bar-fill');
    if (giftTextEl) giftTextEl.textContent = progressText;
    if (giftBarEl) giftBarEl.style.width = progress + '%';
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const container = form.parentElement;
        container.innerHTML = `
            <div class="animate-in visible" style="text-align: center; padding: 40px 0;">
                <h3 style="font-size: 32px; margin-bottom: 12px;">✦ Welcome to the family.</h3>
                <p>Your first ritual guide is on its way to your inbox.</p>
            </div>
        `;
    });
}
