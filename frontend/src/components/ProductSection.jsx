import React, { useState } from 'react';
import '../css/ProductSection.css'; // Make sure this path matches your folder structure

const ProductSection = ({ title, subtitle, products }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  // Slice the data to show only 4 items at a time
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    // Only go next if there are more products to show
    if (startIndex + itemsPerPage < products.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    // Only go prev if we are not at the start
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
        {/* Left Arrow Button - Disabled if at start */}
        <button 
          className="nav-btn prev-btn" 
          onClick={handlePrev}
          disabled={startIndex === 0}
          aria-label="Previous products"
        >
          &#10094;
        </button>

        {/* Product Grid - Displays 4 items (Desktop) or 2x2 (Mobile) */}
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="image-wrapper">
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
              
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₹ {product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button - Disabled if no more products */}
        <button 
          className="nav-btn next-btn" 
          onClick={handleNext}
          disabled={startIndex + itemsPerPage >= products.length}
          aria-label="Next products"
        >
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default ProductSection;