import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT NAVIGATE
import '../css/ProductSection.css';

const ProductSection = ({ title, subtitle, products = [] }) => { 
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  
  const navigate = useNavigate(); // <-- 2. INITIALIZE HOOK

  // Reset to start when the product category/list changes
  useEffect(() => {
    setStartIndex(0);
  }, [products, title]);

  // Slice the data
  const visibleProducts = (products || []).slice(startIndex, startIndex + itemsPerPage);

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

  if (!products || products.length === 0) return null;

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
          {visibleProducts.map((product) => {
            const mainImg = product.images?.[0] || "https://via.placeholder.com/300";
            const hoverImg = product.images?.[1] || mainImg;

            return (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)} // <-- 3. ADD ONCLICK ROUTING
                style={{ cursor: 'pointer' }} // <-- 4. MAKE IT FEEL CLICKABLE
              >
                
                {/* Image & Badge Wrapper */}
                <div className="image-wrapper">
                  {/* 1. Offer Tag */}
                  {product.offerTag && (
                    <span className="product-badge">{product.offerTag}</span>
                  )}
                  
                  {/* 2. Image with Hover Swap Logic */}
                  <img 
                    src={mainImg} 
                    alt={product.name} 
                    className="product-image" 
                    onMouseEnter={(e) => { e.currentTarget.src = hoverImg; }}
                    onMouseLeave={(e) => { e.currentTarget.src = mainImg; }}
                  />
                </div>
                
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  
                  {/* 3. Category Details */}
                  <p className="product-category">
                    {product.gender} • {product.articleType || product.subCategory}
                  </p>
                  
                  {/* 4. Pricing Logic */}
                  <div className="price-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                    <span className="product-price">₹{product.price}</span>
                    
                    {/* MRP Strikethrough */}
                    {product.mrp && product.mrp > product.price && (
                      <span className="product-mrp" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em' }}>
                        ₹{product.mrp}
                      </span>
                    )}

                    {/* Discount % */}
                    {product.discountDisplay && (
                      <span className="product-discount" style={{ color: '#d32f2f', fontSize: '0.85em', fontWeight: 'bold' }}>
                        {product.discountDisplay}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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