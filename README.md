# Dinax E-commerce Website

A modern, responsive e-commerce website built with HTML, CSS, and JavaScript.

## 📁 Project Structure

```
dinax/
├── index.html              # Home page
├── catalog.html            # Product catalog page
├── product-details.html    # Product details page
├── styles.css             # Main stylesheet
├── script.js              # JavaScript functionality
├── data/
│   └── products.json      # Product data and categories
└── assets/
    └── images/
        ├── hero/          # Hero section images
        ├── categories/    # Category images
        ├── products/      # Product images
        └── about/         # About us images
```

## 🚀 Features

### Pages
- **Home Page**: Hero section, categories, about us, services, contact
- **Catalog Page**: Product filtering, sorting, pagination
- **Product Details**: Image gallery, product options, reviews, specifications

### Design
- **Typography**: Montserrat font family
- **Color Scheme**: Light gray background (#f8f9fa) with black text
- **Dark Sections**: About us, contact, divider sections with light text
- **Responsive**: Mobile-first design with breakpoints

### Interactive Features
- Mobile navigation with hamburger menu
- Product image gallery with thumbnails
- Product filtering and sorting
- Contact form validation
- Dynamic product loading from JSON
- Smooth scrolling navigation

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: ES6+ features, async/await, DOM manipulation
- **JSON**: Product data storage

## 📱 Responsive Design

- **Desktop**: Full layout with side-by-side sections
- **Tablet**: Adjusted grid layouts and navigation
- **Mobile**: Hamburger menu, stacked layouts, touch-friendly buttons

## 🎨 Design System

### Colors
- Primary Background: `#f8f9fa` (Light gray)
- Text: `#000000` (Black)
- Button Background: `#000000` (Black)
- Button Text: `#f8f9fa` (Light gray)
- Dark Sections: `#000000` background with light text

### Typography
- Font Family: Montserrat (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800
- Hierarchy: Clear heading and body text sizes

## 📦 Product Data Structure

The `data/products.json` file contains:
- Product information (name, price, description, features)
- Product specifications
- Category data
- Image paths
- Ratings and reviews

## 🔧 Setup

1. Clone or download the project
2. Open `index.html` in a web browser
3. For local development, use a local server to avoid CORS issues with JSON loading

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- Images are stored locally in the `assets/images/` folder
- Product data is loaded dynamically from `data/products.json`
- Fallback images are provided if local images fail to load
- The site is fully functional without external dependencies
