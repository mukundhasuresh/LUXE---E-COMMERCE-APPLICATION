
// ========================================
// LIQUID ETHER BACKGROUND
// ========================================
class LiquidEther {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
        
        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 150 + 50,
                hue: Math.random() * 60 + 180, // Blue to cyan range
                saturation: 70 + Math.random() * 30,
                lightness: 50 + Math.random() * 20,
                alpha: Math.random() * 0.15 + 0.05,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    drawParticle(p) {
        const pulse = Math.sin(this.time * p.pulseSpeed + p.pulsePhase) * 0.3 + 0.7;
        const gradient = this.ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.radius * pulse
        );
        
        gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.alpha * 0.8})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.alpha * 0.3})`);
        gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    update() {
        this.particles.forEach(p => {
            // Base movement
            p.x += p.vx;
            p.y += p.vy;
            
            // Mouse interaction - subtle attraction
            const dx = this.mouseX - p.x;
            const dy = this.mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 300) {
                const force = (300 - dist) / 300 * 0.02;
                p.vx += dx / dist * force;
                p.vy += dy / dist * force;
            }
            
            // Slow down
            p.vx *= 0.99;
            p.vy *= 0.99;
            
            // Add some randomness
            p.vx += (Math.random() - 0.5) * 0.1;
            p.vy += (Math.random() - 0.5) * 0.1;
            
            // Wrap around edges
            if (p.x < -p.radius) p.x = this.canvas.width + p.radius;
            if (p.x > this.canvas.width + p.radius) p.x = -p.radius;
            if (p.y < -p.radius) p.y = this.canvas.height + p.radius;
            if (p.y > this.canvas.height + p.radius) p.y = -p.radius;
            
            // Slowly shift hue
            p.hue += 0.05;
            if (p.hue > 240) p.hue = 180;
        });
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.globalCompositeOperation = 'lighter';
        this.particles.forEach(p => this.drawParticle(p));
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    animate() {
        this.time++;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// NAVBAR
// ========================================
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.lastScroll = 0;
        
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu on link click
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }
    
    handleScroll() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }
    
    toggleMobileMenu() {
        this.mobileMenuBtn.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        this.mobileMenuBtn.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// MAGNETIC BUTTONS
// ========================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic');
        this.bindEvents();
    }
    
    bindEvents() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMouseMove(e, btn));
            btn.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, btn));
        });
    }
    
    handleMouseMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }
    
    handleMouseLeave(e, btn) {
        btn.style.transform = 'translate(0, 0)';
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.observer = null;
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => this.observer.observe(el));
    }
}

// ========================================
// PRODUCT FILTERS
// ========================================
class ProductFilters {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.products = document.querySelectorAll('.product-card');
        this.bindEvents();
    }
    
    bindEvents() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterProducts(btn));
        });
    }
    
    filterProducts(clickedBtn) {
        const filter = clickedBtn.dataset.filter;
        
        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
        
        // Filter products
        this.products.forEach(product => {
            const category = product.dataset.category;
            
            if (filter === 'all' || category === filter) {
                product.style.display = 'block';
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 50);
            } else {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ========================================
// CART DRAWER
// ========================================
class CartDrawer {
    constructor() {
        this.cartBtn = document.getElementById('cart-btn');
        this.cartDrawer = document.getElementById('cart-drawer');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.closeCartBtn = document.getElementById('close-cart');
        this.continueBtn = document.querySelector('.btn-continue');
        
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.cartBtn) {
            this.cartBtn.addEventListener('click', () => this.openCart());
        }
        
        if (this.closeCartBtn) {
            this.closeCartBtn.addEventListener('click', () => this.closeCart());
        }
        
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCart());
        }
        
        if (this.continueBtn) {
            this.continueBtn.addEventListener('click', () => this.closeCart());
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeCart();
        });
    }
    
    openCart() {
        this.cartDrawer.classList.add('active');
        this.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeCart() {
        this.cartDrawer.classList.remove('active');
        this.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// QUICK VIEW MODAL
// ========================================
class QuickViewModal {
    constructor() {
        this.modal = document.getElementById('quick-view-modal');
        this.overlay = document.getElementById('modal-overlay');
        this.closeBtn = document.getElementById('close-modal');
        this.quickViewBtns = document.querySelectorAll('.quick-view');
        
        // Modal content elements
        this.modalImage = document.getElementById('modal-product-image');
        this.modalTitle = document.getElementById('modal-title');
        this.modalCategory = document.getElementById('modal-category');
        this.modalPrice = document.getElementById('modal-price');
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal(btn);
            });
        });
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeModal());
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }
    
    openModal(btn) {
        const card = btn.closest('.product-card');
        if (card) {
            const img = card.querySelector('.product-image img');
            const name = card.querySelector('.product-name');
            const category = card.querySelector('.product-category');
            const price = card.querySelector('.product-price .current');
            
            if (this.modalImage && img) this.modalImage.src = img.src;
            if (this.modalTitle && name) this.modalTitle.textContent = name.textContent;
            if (this.modalCategory && category) this.modalCategory.textContent = category.textContent;
            if (this.modalPrice && price) this.modalPrice.textContent = price.textContent;
        }
        
        this.modal.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// ADD TO CART ANIMATION
// ========================================
class AddToCart {
    constructor() {
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toast-message');
        this.addToCartBtns = document.querySelectorAll('.btn-add-cart');
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAddToCart(btn);
            });
        });
    }
    
    handleAddToCart(btn) {
        // Button animation
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Added!</span>';
        btn.style.background = 'var(--accent-emerald)';
        btn.style.color = 'var(--bg-primary)';
        btn.style.borderColor = 'var(--accent-emerald)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 1500);
        
        // Show toast
        this.showToast('Added to cart!');
    }
    
    showToast(message) {
        if (this.toastMessage) {
            this.toastMessage.textContent = message;
        }
        
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// ========================================
// WISHLIST
// ========================================
class Wishlist {
    constructor() {
        this.wishlistBtns = document.querySelectorAll('.action-btn.wishlist');
        this.bindEvents();
    }
    
    bindEvents() {
        this.wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleWishlist(btn);
            });
        });
    }
    
    toggleWishlist(btn) {
        btn.classList.toggle('active');
        
        if (btn.classList.contains('active')) {
            btn.style.background = 'rgba(255, 100, 100, 0.2)';
            btn.style.color = '#ff6464';
            btn.querySelector('svg').style.fill = '#ff6464';
        } else {
            btn.style.background = '';
            btn.style.color = '';
            btn.querySelector('svg').style.fill = 'none';
        }
    }
}

// ========================================
// NEWSLETTER FORM
// ========================================
class NewsletterForm {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const input = this.form.querySelector('input[type="email"]');
        const btn = this.form.querySelector('button[type="submit"]');
        
        if (input.value) {
            // Success animation
            btn.innerHTML = '<span>Subscribed! ✓</span>';
            btn.style.background = 'var(--accent-emerald)';
            
            setTimeout(() => {
                input.value = '';
                btn.innerHTML = '<span>Subscribe</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>';
                btn.style.background = '';
            }, 3000);
        }
    }
}

// ========================================
// COLOR OPTIONS
// ========================================
class ColorOptions {
    constructor() {
        this.options = document.querySelectorAll('.color-option');
        this.bindEvents();
    }
    
    bindEvents() {
        this.options.forEach(option => {
            option.addEventListener('click', () => {
                this.options.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.bindEvents();
    }
    
    bindEvents() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// ========================================
// PARALLAX EFFECT
// ========================================
class Parallax {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrolled = window.scrollY;
        
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const speed = 0.1;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                const img = el.querySelector('img');
                if (img) {
                    img.style.transform = `translateY(${yPos}px) scale(1.1)`;
                }
            }
        });
    }
}

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Liquid Ether Background
    const canvas = document.getElementById('liquid-ether');
    if (canvas) {
        new LiquidEther(canvas);
    }
    
    // Initialize all components
    new Navbar();
    new MagneticButtons();
    new ScrollAnimations();
    new ProductFilters();
    new CartDrawer();
    new QuickViewModal();
    new AddToCart();
    new Wishlist();
    new NewsletterForm();
    new ColorOptions();
    new SmoothScroll();
    new Parallax();
    
    // Trigger initial animations for hero section
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 100);
        });
    }, 300);
});

// ========================================
// LOADING ANIMATION
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
