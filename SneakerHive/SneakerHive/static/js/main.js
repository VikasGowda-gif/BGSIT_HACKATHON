// DOM Elements
const headerElement = document.getElementById('header');
const loadingScreen = document.getElementById('loadingScreen');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const wishlistCounter = document.getElementById('wishlistCounter');
const cartCounter = document.getElementById('cartCounter');
const productsGrid = document.getElementById('productsGrid');
const newsletterForm = document.getElementById('newsletterForm');

// State Management
let wishlistItems = [];
let cartItems = [];
let products = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after content loads
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000);

    // Fetch products
    fetchProducts();

    // Setup event listeners
    setupEventListeners();
});

// Fetch Products from API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        showNotification('Failed to load products', 'error');
    }
}

// Display Products in Grid
function displayProducts(products) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}" data-brand="${product.brand}">
            <div class="product-image">
                <img src="/static/images/products/${product.image}" alt="${product.name}" onerror="this.src='/static/images/placeholder.jpg'">
                <div class="product-actions">
                    <button class="action-btn" onclick="toggleWishlist(${product.id})" aria-label="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="addToCart(${product.id})" aria-label="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-brand">${product.brand}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Menu Toggle
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Search Modal
    searchBtn?.addEventListener('click', () => {
        searchModal.style.display = 'flex';
    });

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterProducts(filter);
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Newsletter Form
    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value;
        // Here you would typically send this to your backend
        showNotification('Thank you for subscribing!', 'success');
        newsletterForm.reset();
    });

    // Scroll Events
    window.addEventListener('scroll', () => {
        // Add header shadow on scroll
        if (window.scrollY > 0) {
            headerElement.classList.add('scrolled');
        } else {
            headerElement.classList.remove('scrolled');
        }
    });

    // Close Modals
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Filter Products
function filterProducts(filter) {
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.brand === filter);
    displayProducts(filteredProducts);
}

// Wishlist Management
function toggleWishlist(productId) {
    const index = wishlistItems.indexOf(productId);
    if (index === -1) {
        wishlistItems.push(productId);
        showNotification('Added to wishlist', 'success');
    } else {
        wishlistItems.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    }
    updateWishlistCounter();
}

// Cart Management
function addToCart(productId) {
    cartItems.push(productId);
    updateCartCounter();
    showNotification('Added to cart', 'success');
}

// Update Counters
function updateWishlistCounter() {
    if (wishlistCounter) {
        wishlistCounter.textContent = wishlistItems.length;
    }
}

function updateCartCounter() {
    if (cartCounter) {
        cartCounter.textContent = cartItems.length;
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const notifications = document.querySelector('.notifications') || (() => {
        const container = document.createElement('div');
        container.className = 'notifications';
        document.body.appendChild(container);
        return container;
    })();
    
    notifications.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth Scroll
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}