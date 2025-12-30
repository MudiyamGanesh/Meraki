import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../css/ProductSection.css';

const ProductSection = ({ title, subtitle, products }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  // Reset to start when the product category/list changes
  useEffect(() => {
    setStartIndex(0);
  }, [products, title]);

  // Slice the data
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (startIndex + itemsPerPage < products.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <section className="product-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>

      <div className="carousel-container">
        {/* Left Arrow */}
        <button 
          className="nav-btn prev-btn" 
          onClick={handlePrev}
          disabled={startIndex === 0}
          aria-label="Previous products"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        {/* Product Grid */}
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <div key={product.id} className="product-card">
              
              {/* Image & Badge Wrapper */}
              <div className="image-wrapper">
                {/* 1. Map 'offerTag' from data to the badge */}
                {product.offerTag && (
                  <span className="product-badge">{product.offerTag}</span>
                )}
                
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image" 
                  // Optional: Add hover effect if you want to use the 2nd image
                  // onMouseOver={e => e.currentTarget.src = product.hoverImage || product.image}
                  // onMouseOut={e => e.currentTarget.src = product.image}
                />
              </div>
              
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                
                {/* 2. Use specific category details like 'T-Shirt' or 'Topwear' */}
                <p className="product-category">
                  {product.gender} • {product.articleType || product.subCategory}
                </p>
                
                {/* 3. New Pricing Structure */}
                <div className="price-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                  <span className="product-price">₹{product.price}</span>
                  
                  {/* Show MRP (Strikethrough) if it exists and is higher */}
                  {product.mrp && product.mrp > product.price && (
                    <span className="product-mrp" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em' }}>
                      ₹{product.mrp}
                    </span>
                  )}

                  {/* Show Discount Percentage */}
                  {product.discountDisplay && (
                    <span className="product-discount" style={{ color: '#e53935', fontSize: '0.85em', fontWeight: 'bold' }}>
                      ({product.discountDisplay})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          className="nav-btn next-btn" 
          onClick={handleNext}
          disabled={startIndex + itemsPerPage >= products.length}
          aria-label="Next products"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
};

export default ProductSection;