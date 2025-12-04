class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }
    
    addItem(id, title, price, image) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id,
                title,
                price,
                image,
                quantity: 1
            });
        }
        
        this.save();
        this.updateCartCount();
        this.showNotification(`${title} добавлена в корзину!`);
    }
    
    removeItem(index) {
        this.items.splice(index, 1);
        this.save();
        this.updateCartCount();
    }
    
    updateQuantity(index, quantity) {
        if (quantity < 1) {
            this.removeItem(index);
            return;
        }
        
        this.items[index].quantity = quantity;
        this.save();
        this.updateCartCount();
    }
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const count = this.getCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1002;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        const itemsTotal = document.getElementById('itemsTotal');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
            if (itemsTotal) itemsTotal.textContent = '0 руб.';
            if (cartTotal) cartTotal.textContent = '0 руб.';
            return;
        }
        
        let itemsHTML = '';
        let total = 0;
        
        this.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image || 'https://via.placeholder.com/80x120/ccc/fff?text=📖'}" alt="${item.title}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price} руб.</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        if (itemsTotal) itemsTotal.textContent = total + ' руб.';
        if (cartTotal) cartTotal.textContent = total + ' руб.';
        
        this.addCartEventListeners();
    }
    
    addCartEventListeners() {
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.removeItem(index);
                this.renderCartItems();
            });
        });
        
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                const newQuantity = this.items[index].quantity + 1;
                this.updateQuantity(index, newQuantity);
                this.renderCartItems();
            });
        });
        
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                const newQuantity = this.items[index].quantity - 1;
                this.updateQuantity(index, newQuantity);
                this.renderCartItems();
            });
        });
    }
}

const cart = new Cart();

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const title = this.dataset.title;
            const price = parseInt(this.dataset.price);
            const image = this.dataset.image;
            
            cart.addItem(id, title, price, image);
        });
    });
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.items.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            const total = cart.getTotal();
            alert(`Заказ оформлен! Общая сумма: ${total} руб.`);
            
            cart.items = [];
            cart.save();
            cart.updateCartCount();
            cart.renderCartItems();
        });
    }
    
    if (document.getElementById('cartItems')) {
        cart.renderCartItems();
    }
});