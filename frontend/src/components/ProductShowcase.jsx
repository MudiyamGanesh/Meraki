import React, { useState, useMemo } from 'react';
import { Heart } from 'lucide-react'; // Import Heart Icon
import { useWishlist } from '../Context/WishlistContext'; // Import Context
import '../css/ProductShowcase.css';

// ProductShowcase.jsx

const ProductCard = ({ data }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(data.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      removeFromWishlist(data.id);
    } else {
      addToWishlist(data);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        
        {/* --- IMAGES FIRST --- */}
        
        {/* 1. Main Image */}
        <img 
          src={data.image} 
          alt={data.name} 
          className="product-img-main"
        />

        {/* 2. Hover Image */}
        {data.hoverImage && (
          <img 
            src={data.hoverImage} 
            alt={data.name} 
            className="product-img-hover"
          />
        )}
        
        {/* Overlay Badge */}
        {data.overlayText && (
          <div className="image-overlay">
            {data.overlayText}
          </div>
        )}

        {/* --- BUTTON LAST (Fixes disappearing issue) --- */}
        <button 
          className="wishlist-btn" 
          onClick={handleWishlistClick}
        >
          <Heart 
            size={20}
            fill={isLiked ? "#dc2626" : "transparent"} 
            color={isLiked ? "#dc2626" : "#4A5568"} 
            strokeWidth={2}
          />
        </button>

      </div>
      
      <div className="product-details">
        <h3 className="product-title">{data.name}</h3>
        <p className="product-subtitle">{data.subtitle}</p>
        <span className="product-price">₹ {data.price}</span>
      </div>
    </div>
  );
};

// ... (Keep the rest of your ProductShowcase component exactly as it is) ...
const ProductShowcase = ({ title = "Our Collection", products = [], categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(product => product.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="product-showcase-section">
      {categories.length > 0 && (
        <div className="filter-container">
          <button 
            className={`filter-chip ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No products found in this category.
        </div>
      )}
    </div>
  );
};

export default ProductShowcase;