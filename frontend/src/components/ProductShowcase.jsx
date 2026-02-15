import React, { useState, useMemo, useEffect } from 'react';
import { Heart } from 'lucide-react'; 
import { useWishlist } from '../Context/WishlistContext'; 
import { Link } from 'react-router-dom';
import '../css/ProductShowcase.css';

const ProductCard = ({ data }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Safety Check: Ensure data exists to prevent crashes
  if (!data) return null;

  const isLiked = isInWishlist(data.id);

  // --- 1. NEW IMAGE LOGIC ---
  // Safely access the array. Fallback to placeholder if empty.
  const mainImg = data.images?.[0] || "https://via.placeholder.com/300";
  const hoverImg = data.images?.[1] || mainImg;

  // --- 2. DYNAMIC SUBTITLE ---
  // Since 'subtitle' isn't in your DB format, we build it from metadata
  const displaySubtitle = data.articleType || data.subCategory || "Premium Collection";

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
          {/* Main Image */}
          <img 
            src={mainImg} 
            alt={data.name} 
            className="product-img-main"
          />
          
          {/* Hover Image (Only render if distinct hover image exists) */}
          <img 
            src={hoverImg} 
            alt={data.name} 
            className="product-img-hover"
          />

          {/* Offer Tag Overlay */}
          {data.offerTag && (
            <div className="image-overlay">
              {data.offerTag}
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
        
        <div className="showcase-details">
          <h3 className="showcase-title">{data.name}</h3>
          
          {/* Updated Subtitle */}
          <p className="showcase-subtitle">{displaySubtitle}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="showcase-price">₹ {data.price}</span>
            {data.mrp && data.mrp > data.price && (
                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem' }}>
                    ₹{data.mrp}
                </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductShowcase = ({ title = "Our Collection", products = [], categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Reset category if products change (e.g. switching Men/Women tabs)
  useEffect(() => {
    setActiveCategory('All');
  }, [products]);

  // --- 3. UPDATED FILTER LOGIC ---
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === 'All') return products;
    
    // Filter by 'subCategory' (e.g. Topwear) or 'articleType' (e.g. T-Shirt)
    // This allows you to pass categories like ["Topwear", "Bottomwear"] OR ["T-Shirt", "Jeans"]
    return products.filter(product => 
        (product.subCategory === activeCategory) || 
        (product.articleType === activeCategory)
    );
  }, [activeCategory, products]);

  // Don't render empty sections
  if (!products || products.length === 0) return null;

  return (
    <div className="product-showcase-section">
      {/* Filter Tabs */}
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

      {/* Grid */}
      <div className="showcase-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No products found for "{activeCategory}".
        </div>
      )}
    </div>
  );
};

export default ProductShowcase;