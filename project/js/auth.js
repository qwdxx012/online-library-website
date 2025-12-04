class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.users = JSON.parse(localStorage.getItem('users')) || [
            { name: 'Демо Пользователь', email: 'demo@test.ru', password: '123456' }
        ];
        
        this.initAuth();
    }
    
    initAuth() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const authModal = document.getElementById('authModal');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showAuthModal('login'));
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.showAuthModal('register'));
        }
        
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                authModal.classList.remove('active');
            });
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        const submitLogin = document.getElementById('submitLogin');
        const submitRegister = document.getElementById('submitRegister');
        
        if (submitLogin) {
            submitLogin.addEventListener('click', () => this.handleLogin());
        }
        
        if (submitRegister) {
            submitRegister.addEventListener('click', () => this.handleRegister());
        }
        
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    authModal.classList.remove('active');
                }
            });
        }
        
        this.checkAuthState();
    }
    
    showAuthModal(defaultTab = 'login') {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            this.switchTab(defaultTab);
            authModal.classList.add('active');
        }
    }
    
    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        document.getElementById(`${tab}Form`).classList.add('active');
    }
    
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            alert('Заполните все поля');
            return;
        }
        
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            document.getElementById('authModal').classList.remove('active');
            this.checkAuthState();
            alert(`Добро пожаловать, ${user.name}!`);
        } else {
            alert('Неверный email или пароль');
        }
    }
    
    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        if (!name || !email || !password) {
            alert('Заполните все поля');
            return;
        }
        
        if (this.users.find(u => u.email === email)) {
            alert('Пользователь с таким email уже существует');
            return;
        }
        
        const newUser = { name, email, password };
        this.users.push(newUser);
        this.currentUser = newUser;
        
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        document.getElementById('authModal').classList.remove('active');
        this.checkAuthState();
        
        alert(`Регистрация успешна! Добро пожаловать, ${name}!`);
    }
    
    checkAuthState() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (this.currentUser && loginBtn && registerBtn) {
            loginBtn.textContent = this.currentUser.name;
            registerBtn.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new Auth();
});