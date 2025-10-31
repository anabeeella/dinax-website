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

        };
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

    // Generate Products for Catalog
    generateProducts();
    
    // Load product details if on product details page
    loadProductDetails();
    
    // Load related products
    loadRelatedProducts();
});

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

    // Filter out incomplete products (those missing description, details, or features)
    const completeProducts = products.filter(product => isProductComplete(product));

    if (completeProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    // Generate product cards
    completeProducts.forEach(product => {
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
            <img src="${product.images && product.images.length > 0 ? product.images.find(img => img.includes('_main')) || product.images[0] : product.image || ''}" alt="${product.name}" onerror="this.src='https://picsum.photos/400/300?random=${product.id}'">
            <div class="product-category-badge">${getCategoryName(product.category)}</div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            ${product.description ? `<p>${product.description}</p>` : ''}
            <div class="product-features-preview">
                ${product.details ? product.details.slice(0, 3).map(detail => `<span class="feature-tag">${detail}</span>`).join('') : ''}
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

// Helper function to check if a product should be displayed
// Products with empty description, details, or features will be hidden
function isProductComplete(product) {
    // Check description - must exist and not be empty/whitespace
    if (!product.description || typeof product.description !== 'string' || product.description.trim() === '') {
        return false;
    }
    
    // Check details - must exist and be a non-empty array with at least one non-empty item
    if (!product.details || !Array.isArray(product.details) || product.details.length === 0) {
        return false;
    }
    const hasValidDetails = product.details.some(detail => detail && String(detail).trim() !== '');
    if (!hasValidDetails) {
        return false;
    }
    
    // Check features - must exist and be a non-empty array with at least one non-empty item
    if (!product.features || !Array.isArray(product.features) || product.features.length === 0) {
        return false;
    }
    const hasValidFeatures = product.features.some(feature => feature && String(feature).trim() !== '');
    if (!hasValidFeatures) {
        return false;
    }
    
    return true;
}

// Helper function to get category name
function getCategoryName(categoryId) {
    const category = categoriesData.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
}

// Helper function to convert image path to _main version for product cards
function getMainImagePath(imagePath) {
    if (!imagePath) return imagePath;
    
    // Extract directory, base name, and extension
    const parts = imagePath.split('/');
    const filename = parts[parts.length - 1];
    const directory = parts.slice(0, parts.length - 1).join('/');
    
    // Remove any number at the end and extension (e.g., "cam-ip1.png" -> "cam-ip")
    const baseMatch = filename.match(/^(.+?)(\d*)(\.[^.]+)$/);
    if (!baseMatch) return imagePath;
    
    const baseName = baseMatch[1];
    const extension = baseMatch[3];
    
    // Create _main version
    const mainFilename = `${baseName}_main${extension}`;
    return `${directory}/${mainFilename}`;
}

// Helper function to get all image variants for product details
function getImageVariants(images) {
    // If images is already an array, return it directly (excluding _main images)
    if (Array.isArray(images)) {
        // Filter out _main images and return the rest
        return images.filter(img => !img.includes('_main'));
    }
    
    // Legacy: if it's a single image path string, try to generate variants
    if (!images) return [];
    
    // Extract directory, base name, and extension
    const parts = images.split('/');
    const filename = parts[parts.length - 1];
    const directory = parts.slice(0, parts.length - 1).join('/');
    
    // Remove any number at the end and extension (e.g., "cam-ip1.png" -> "cam-ip")
    const baseMatch = filename.match(/^(.+?)(\d*)(\.[^.]+)$/);
    if (!baseMatch) return [images];
    
    const baseName = baseMatch[1];
    const extension = baseMatch[3];
    
    // Build array of possible variants: base, base1, base2, etc.
    const variants = [];
    
    // Add base version (name.png)
    variants.push(`${directory}/${baseName}${extension}`);
    
    // Add numbered variants (name1.png, name2.png, etc.) up to 10
    for (let i = 1; i <= 10; i++) {
        variants.push(`${directory}/${baseName}${i}${extension}`);
    }
    
    return variants;
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

    // Filter out incomplete products first
    const completeProducts = productsData.filter(p => isProductComplete(p));

    // Get related products (same category first, then others)
    let relatedProducts = completeProducts
        .filter(p => p.category === currentProduct.category && p.id != currentProductId)
        .slice(0, 4); // Try to get 4 from same category

    // If we don't have enough products from same category, add from other categories
    if (relatedProducts.length < 4) {
        const otherProducts = completeProducts
            .filter(p => p.category !== currentProduct.category && p.id != currentProductId)
            .slice(0, 4 - relatedProducts.length);
        
        relatedProducts = [...relatedProducts, ...otherProducts];
    }

    // If still not enough, add any remaining products (excluding current)
    if (relatedProducts.length < 4) {
        const remainingProducts = completeProducts
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
            <img src="${product.images && product.images.length > 0 ? product.images.find(img => img.includes('_main')) || product.images[0] : product.image || ''}" alt="${product.name}" onerror="this.src='https://picsum.photos/400/300?random=${product.id}'">
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
    
    // Check if product is complete - if not, redirect to catalog
    if (!isProductComplete(product)) {
        console.warn('Product is incomplete (missing description, details, or features). Redirecting to catalog.');
        window.location.href = 'catalog.html';
        return;
    }
    
    // Update product information
    document.getElementById('product-title').textContent = product.name;
    
    // Update description only if it exists
    const productDescriptionElement = document.getElementById('product-description');
    if (productDescriptionElement) {
        if (product.description) {
            productDescriptionElement.textContent = product.description;
            productDescriptionElement.parentElement.style.display = 'block';
        } else {
            productDescriptionElement.parentElement.style.display = 'none';
        }
    }
    
    // Update features (details)
    const featuresList = document.getElementById('product-features');
    if (featuresList && product.details) {
        featuresList.innerHTML = '';
        product.details.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            featuresList.appendChild(li);
        });
    }
    
    // Update specifications table (features)
    const specificationsContent = document.getElementById('specifications-content');
    if (specificationsContent) {
        if (product.features && product.features.length > 0) {
            const table = document.createElement('table');
            table.className = 'specifications-table';
            table.id = 'specifications-table';
            
            product.features.forEach(feature => {
                const row = document.createElement('tr');
                const cells = feature.split(':').map(text => text.trim());
                
                if (cells.length === 2) {
                    // If feature has "Key: Value" format, split into two columns
                    row.innerHTML = `
                        <td>${cells[0]}</td>
                        <td>${cells[1]}</td>
                    `;
                } else {
                    // Otherwise, show in single cell
                    row.innerHTML = `<td colspan="2">${feature}</td>`;
                }
                
                table.appendChild(row);
            });
            
            specificationsContent.innerHTML = '';
            specificationsContent.appendChild(table);
        } else {
            specificationsContent.innerHTML = '<p>No hay especificaciones técnicas disponibles</p>';
        }
    }
    
    // Get all images for product details (INCLUDE _main images)
    const allImages = product.images && product.images.length > 0 ? product.images : 
                     (product.image ? [product.image] : []);
    
    // Get the product images container
    const productImagesContainer = document.querySelector('.product-images');
    const mainImage = document.getElementById('main-product-image');
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    
    if (!productImagesContainer) {
        return; // Container doesn't exist, skip
    }
    
    // Hide container initially
    productImagesContainer.style.display = 'none';
    
    // Get images to check (include ALL images including _main)
    const imagesToCheck = allImages;
    
    if (imagesToCheck.length === 0) {
        // No images to check, keep container hidden
        return;
    }
    
    // Remove onerror handlers to prevent fallback images
    if (mainImage) {
        mainImage.removeAttribute('onerror');
        mainImage.style.display = 'none';
    }
    
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = '';
    }
    
    // Track which images successfully load
    const validImages = [];
    let checkedCount = 0;
    
    // Check each image to see if it exists
    const checkImageExists = (imagePath, callback) => {
        const img = new Image();
        img.onload = function() {
            callback(true, imagePath);
        };
        img.onerror = function() {
            callback(false, imagePath);
        };
        img.src = imagePath;
    };
    
    // Check all images
    imagesToCheck.forEach((imagePath) => {
        checkImageExists(imagePath, (exists) => {
            checkedCount++;
            if (exists) {
                validImages.push(imagePath);
            }
            
            // When all images have been checked
            if (checkedCount === imagesToCheck.length) {
                if (validImages.length > 0) {
                    // Show container and display images
                    productImagesContainer.style.display = '';
                    
                    // Set main image
                    if (mainImage) {
                        mainImage.src = validImages[0];
                        mainImage.style.display = 'block';
                    }
                    
                    // Create thumbnails
                    if (thumbnailContainer) {
                        validImages.forEach((imagePath, index) => {
                            const thumbnail = document.createElement('img');
                            thumbnail.className = 'thumbnail';
                            thumbnail.src = imagePath;
                            thumbnail.alt = `${product.name} - Vista ${index + 1}`;
                            
                            // Set first thumbnail as active
                            if (index === 0) {
                                thumbnail.classList.add('active');
                            }
                            
                            // Add click event to switch main image
                            thumbnail.addEventListener('click', function() {
                                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                                this.classList.add('active');
                                if (mainImage) {
                                    mainImage.src = this.src;
                                }
                            });
                            
                            thumbnailContainer.appendChild(thumbnail);
                        });
                    }
                }
                // If no valid images, container stays hidden (display: none)
            }
        });
    });
    
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
    const searchInput = document.getElementById('search-input');
    
    if (!activeCategoryBtn || !sortFilter || !productsData.length) return;

    let filteredProducts = [...productsData];

    // Filter by category
    const selectedCategory = activeCategoryBtn.getAttribute('data-category');
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
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

    // Render filtered products (renderProducts will filter out incomplete products)
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
            filterProducts();
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
