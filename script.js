// Dinax Website JavaScript
let productsData = [];
let categoriesData = [];

// Load data from JSON file
async function loadProductsData() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        productsData = data.products;
        categoriesData = data.categories;
        return data;
    } catch (error) {
        console.error('Error loading products data:', error);
        // Fallback to sample data if JSON fails to load
        return {
            products: sampleProducts,
            categories: [
                { id: "electronics", name: "Electrónicos", description: "Los últimos dispositivos tecnológicos", image: "https://picsum.photos/300/200?random=2" },
                { id: "home", name: "Hogar", description: "Artículos para el hogar", image: "https://picsum.photos/300/200?random=3" },
                { id: "sports", name: "Deportes", description: "Equipamiento deportivo", image: "https://picsum.photos/300/200?random=4" },
                { id: "clothing", name: "Ropa", description: "Moda y vestimenta", image: "https://picsum.photos/300/200?random=5" }
            ]
        };
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    
    // Load products data
    const data = await loadProductsData();
    productsData = data.products;
    categoriesData = data.categories;
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Product Gallery Thumbnail Switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    if (thumbnails && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                this.classList.add('active');
                // Update main image
                mainImage.src = this.src.replace('100/100', '500/500');
            });
        });
    }

    // Product Options (Size, Color, Quantity)
    const sizeButtons = document.querySelectorAll('.size-btn');
    const colorButtons = document.querySelectorAll('.color-btn');
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');

    // Size selection
    if (sizeButtons) {
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Color selection
    if (colorButtons) {
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                colorButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Quantity controls
    if (decreaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }

    if (increaseBtn && quantityInput) {
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
    }

    // Product Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabButtons && tabPanels) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                this.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelectorAll('input[type="text"]')[1].value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            
            // Simulate form submission
            alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
            this.reset();
        });
    }

    // Add to Cart and Buy Now buttons
    const addToCartBtn = document.getElementById('add-to-cart');
    const buyNowBtn = document.getElementById('buy-now');
    const wishlistBtn = document.getElementById('add-to-wishlist');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = document.getElementById('quantity').value;
            const selectedSize = document.querySelector('.size-btn.active')?.textContent || 'N/A';
            const selectedColor = document.querySelector('.color-btn.active')?.style.backgroundColor || 'N/A';
            
            alert(`Información del producto:\n- Cantidad: ${quantity}\n- Talla: ${selectedSize}\n- Color: ${selectedColor}\n\n¡Contáctanos para más información!`);
        });
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            alert('¡Gracias por tu interés! Te contactaremos pronto con más información sobre este producto.');
        });
    }

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.style.backgroundColor = '#ff6b6b';
            this.style.color = '#ffffff';
            this.textContent = '❤️ Agregado';
            
            setTimeout(() => {
                this.style.backgroundColor = 'transparent';
                this.style.color = '#000000';
                this.textContent = '❤️ Lista de Deseos';
            }, 2000);
        });
    }

    // Generate Products for Catalog
    generateProducts();
    
    // Load product details if on product details page
    loadProductDetails();
    
    // Load related products
    loadRelatedProducts();
});

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "Smartphone Pro Max",
        price: 599.99,
        originalPrice: 699.99,
        category: "electronics",
        image: "https://picsum.photos/300/200?random=30",
        description: "El smartphone más avanzado del mercado"
    },
    {
        id: 2,
        name: "Sofá Moderno",
        price: 899.99,
        originalPrice: 1099.99,
        category: "home",
        image: "https://picsum.photos/300/200?random=31",
        description: "Sofá cómodo y elegante para tu hogar"
    },
    {
        id: 3,
        name: "Zapatillas Deportivas",
        price: 129.99,
        originalPrice: 159.99,
        category: "sports",
        image: "https://picsum.photos/300/200?random=32",
        description: "Zapatillas ideales para correr y entrenar"
    },
    {
        id: 4,
        name: "Camiseta Premium",
        price: 49.99,
        originalPrice: 69.99,
        category: "clothing",
        image: "https://picsum.photos/300/200?random=33",
        description: "Camiseta de algodón 100% orgánico"
    },
    {
        id: 5,
        name: "Laptop Gaming",
        price: 1299.99,
        originalPrice: 1499.99,
        category: "electronics",
        image: "https://picsum.photos/300/200?random=34",
        description: "Laptop de alto rendimiento para gaming"
    },
    {
        id: 6,
        name: "Mesa de Centro",
        price: 299.99,
        originalPrice: 399.99,
        category: "home",
        image: "https://picsum.photos/300/200?random=35",
        description: "Mesa de centro moderna y funcional"
    },
    {
        id: 7,
        name: "Pelota de Fútbol",
        price: 39.99,
        originalPrice: 49.99,
        category: "sports",
        image: "https://picsum.photos/300/200?random=36",
        description: "Pelota oficial para fútbol profesional"
    },
    {
        id: 8,
        name: "Chaqueta de Cuero",
        price: 199.99,
        originalPrice: 249.99,
        category: "clothing",
        image: "https://picsum.photos/300/200?random=37",
        description: "Chaqueta de cuero genuino de alta calidad"
    }
];

// Function to render products in the catalog
function renderProducts(products = productsData) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) {
        console.warn('Products grid not found');
        return;
    }

    // Clear existing products
    productsGrid.innerHTML = '';

    if (!products || products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    // Generate product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Function to create individual product card
function createProductCard(product) {
    const productCard = document.createElement('button');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    productCard.setAttribute('data-name', product.name.toLowerCase());
    
    productCard.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://picsum.photos/400/300?random=${product.id}'">
            <div class="product-category-badge">${getCategoryName(product.category)}</div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-features-preview">
                ${product.features ? product.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('') : ''}
            </div>
            <span class="category-link">Ver Detalles</span>
        </div>
    `;

    // Add click event to the entire card
    productCard.addEventListener('click', function(e) {
        window.location.href = `product-details.html?id=${product.id}`;
    });

    return productCard;
}

// Helper function to get category name
function getCategoryName(categoryId) {
    const category = categoriesData.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
}

// Legacy function for backward compatibility
function generateProducts() {
    renderProducts();
}

// Function to load related products
function loadRelatedProducts() {
    const relatedProductsGrid = document.querySelector('.related-products-grid');
    if (!relatedProductsGrid || !productsData.length) return;

    // Get current product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentProductId = urlParams.get('id');
    
    if (!currentProductId) return;

    // Get current product
    const currentProduct = productsData.find(p => p.id == currentProductId);
    if (!currentProduct) return;

    // Get related products (same category first, then others)
    let relatedProducts = productsData
        .filter(p => p.category === currentProduct.category && p.id != currentProductId)
        .slice(0, 4); // Try to get 4 from same category

    // If we don't have enough products from same category, add from other categories
    if (relatedProducts.length < 4) {
        const otherProducts = productsData
            .filter(p => p.category !== currentProduct.category && p.id != currentProductId)
            .slice(0, 4 - relatedProducts.length);
        
        relatedProducts = [...relatedProducts, ...otherProducts];
    }

    // If still not enough, add any remaining products (excluding current)
    if (relatedProducts.length < 4) {
        const remainingProducts = productsData
            .filter(p => p.id != currentProductId && !relatedProducts.some(rp => rp.id === p.id))
            .slice(0, 4 - relatedProducts.length);
        
        relatedProducts = [...relatedProducts, ...remainingProducts];
    }

    // Clear existing related products
    relatedProductsGrid.innerHTML = '';

    if (relatedProducts.length === 0) {
        relatedProductsGrid.innerHTML = '<p>No hay productos relacionados disponibles</p>';
        return;
    }

    // Render related products
    relatedProducts.forEach(product => {
        const relatedCard = document.createElement('button');
        relatedCard.className = 'related-product-card';
        relatedCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://picsum.photos/400/300?random=${product.id}'">
            <h3>${product.name}</h3>
        `;
        
        // Add click event
        relatedCard.addEventListener('click', function() {
            window.location.href = `product-details.html?id=${product.id}`;
        });
        
        relatedProductsGrid.appendChild(relatedCard);
    });
}

// Load product details for product details page
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId || !productsData.length) return;
    
    const product = productsData.find(p => p.id == productId);
    if (!product) return;
    
    // Update product information
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    
    // Update features
    const featuresList = document.getElementById('product-features');
    if (featuresList && product.features) {
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    }
    
    // Update main image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = product.image;
    }
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (thumbnails.length > 0 && product.image) {
        thumbnails[0].src = product.image;
        thumbnails[0].classList.add('active');
    }
    
    // Update breadcrumb
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
}

// Filter Products
function filterProducts() {
    const activeCategoryBtn = document.querySelector('.category-btn.active');
    const sortFilter = document.getElementById('sort-select');
    
    if (!activeCategoryBtn || !sortFilter || !productsData.length) return;

    let filteredProducts = [...productsData];

    // Filter by category
    const selectedCategory = activeCategoryBtn.getAttribute('data-category');
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // Sort products
    const sortBy = sortFilter.value;
    switch (sortBy) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'category':
            filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'newest':
            // Keep original order for newest
            break;
    }

    // Render filtered products
    renderProducts(filteredProducts);
}

// Search products function
function searchProducts(searchTerm) {
    if (!searchTerm || !productsData.length) {
        renderProducts();
        return;
    }

    const filteredProducts = productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    renderProducts(filteredProducts);
}

// Add event listeners for filters
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sortFilter = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');

    // Category button event listeners
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter products
            filterProducts();
        });
    });

    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchProducts(this.value);
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
