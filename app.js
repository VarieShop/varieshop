// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Datos iniciales
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Elementos del DOM
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Event Listeners
    document.getElementById('btn-login').addEventListener('click', showLogin);
    document.getElementById('btn-register').addEventListener('click', showRegister);
    document.getElementById('btn-do-login').addEventListener('click', login);
    document.getElementById('btn-do-register').addEventListener('click', register);
    document.getElementById('btn-add-product').addEventListener('click', showAddProductForm);
    
    // Funciones de autenticación
    function showLogin() {
        authModal.classList.remove('hidden');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }

    function showRegister() {
        authModal.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }

    function login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUI();
            authModal.classList.add('hidden');
        } else {
            alert('Credenciales incorrectas');
        }
    }

    function register() {
        const newUser = {
            id: Date.now(),
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value,
            type: document.getElementById('user-type').value
        };
        
        if (users.some(u => u.email === newUser.email)) {
            alert('El usuario ya existe');
            return;
        }
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registro exitoso!');
        showLogin();
    }

    // Sistema de productos
    function showAddProductForm() {
        const productName = prompt('Nombre del producto:');
        const productPrice = prompt('Precio:');
        const productDescription = prompt('Descripción:');
        
        const newProduct = {
            id: Date.now(),
            name: productName,
            price: parseFloat(productPrice),
            description: productDescription,
            seller: currentUser.id,
            date: new Date().toISOString()
        };
        
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        renderSellerProducts();
    }

    function renderProducts() {
        const grid = document.querySelector('.products-grid');
        grid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
            </div>
        `).join('');
    }

    // Actualizar UI según estado
    function updateUI() {
        if (currentUser) {
            document.getElementById('btn-login').style.display = 'none';
            document.getElementById('btn-register').style.display = 'none';
            document.getElementById('btn-logout').style.display = 'block';
            
            if (currentUser.type === 'seller') {
                document.getElementById('seller-dashboard').classList.remove('hidden');
                renderSellerProducts();
            }
        }
        renderProducts();
    }

    // Inicialización
    updateUI();
});
