// luminary/scripts/store.js
const store = {
    cart: JSON.parse(localStorage.getItem('luminary_cart')) || [],
    wishlist: new Set(JSON.parse(localStorage.getItem('luminary_wishlist')) || []),
    announcementDismissed: localStorage.getItem('luminary_announcement_dismissed') === 'true',

    saveCart() {
        localStorage.setItem('luminary_cart', JSON.stringify(this.cart));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    saveWishlist() {
        localStorage.setItem('luminary_wishlist', JSON.stringify(Array.from(this.wishlist)));
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    },

    addToCart(productId, variant = null, qty = 1) {
        const product = window.PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId && item.variant === variant);
        if (existingItem) {
            existingItem.qty += qty;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                type: product.type,
                variant: variant || (product.variants ? product.variants[0] : null),
                qty: qty
            });
        }
        this.saveCart();
        this.showToast(`✦ Added ${product.name} to bag`);
    },

    removeFromCart(productId, variant) {
        this.cart = this.cart.filter(item => !(item.id === productId && item.variant === variant));
        this.saveCart();
    },

    updateQty(productId, variant, delta) {
        const item = this.cart.find(item => item.id === productId && item.variant === variant);
        if (item) {
            item.qty = Math.max(1, Math.min(10, item.qty + delta));
            this.saveCart();
        }
    },

    toggleWishlist(productId) {
        if (this.wishlist.has(productId)) {
            this.wishlist.delete(productId);
        } else {
            this.wishlist.add(productId);
            this.showToast("✦ Added to your rituals");
        }
        this.saveWishlist();
    },

    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.qty), 0);
    },

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.qty, 0);
    }
};

window.store = store;
