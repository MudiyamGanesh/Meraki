import React, { useState, useMemo, useEffect } from 'react';
import { Heart } from 'lucide-react'; 
import { useWishlist } from '../Context/WishlistContext'; 
import { Link } from 'react-router-dom';
import '../css/ProductShowcase.css';

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
    <Link 
      to={`/product/${data.id}`} 
      state={{ product: data }} 
      className="showcase-card-link"
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div className="showcase-card">
        <div className="showcase-image-wrapper">
          <img 
            src={data.image} 
            alt={data.name} 
            className="product-img-main"
          />
          {data.hoverImage && (
            <img 
              src={data.hoverImage} 
              alt={data.name} 
              className="product-img-hover"
            />
          )}
          {data.overlayText && (
            <div className="image-overlay">
              {data.overlayText}
            </div>
          )}
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
        
        {/* UPDATED CLASSES HERE */}
        <div className="showcase-details">
          <h3 className="showcase-title">{data.name}</h3>
          <p className="showcase-subtitle">{data.subtitle}</p>
          <span className="showcase-price">₹ {data.price}</span>
        </div>
      </div>
    </Link>
  );
};

const ProductShowcase = ({ title = "Our Collection", products = [], categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setActiveCategory('All');
  }, [products, categories]);

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

      <div className="showcase-grid">
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