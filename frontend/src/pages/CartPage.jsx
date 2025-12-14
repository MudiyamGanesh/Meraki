import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, Plus } from 'lucide-react';
import '../css/CartPage.css';

const CartPage = () => {
  // Mock data to make the empty page effective/engaging
  const trendingItems = [
    {
      id: 1,
      name: "Urban Oversized Tee",
      price: "₹1,299",
      category: "Men",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Floral Summer Dress",
      price: "₹2,499",
      category: "Women",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Streetwear Hoodie",
      price: "₹3,999",
      category: "Unisex",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      name: "Classic Beige Chinos",
      price: "₹1,899",
      category: "Men",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="cart-page">
      <div className="cart-container">
        
        {/* --- EMPTY STATE HERO --- */}
        <div className="empty-cart-state">
          <div className="empty-icon-circle">
            <ShoppingBag size={64} strokeWidth={1} />
          </div>
          <h1 className="empty-title">Your Cart is Empty</h1>
          <p className="empty-text">
            Looks like you haven't added anything yet.<br />
            Explore our collections and find something you love.
          </p>
          
          <div className="empty-actions">
            <Link to="/Meraki" className="btn-primary">
              Start Shopping <ArrowRight size={18} />
            </Link>
            <Link to="/Meraki/design" className="btn-secondary">
              Design Your Own
            </Link>
          </div>
        </div>

        {/* --- RECOMMENDATIONS (To reduce bounce rate) --- */}
        <div className="cart-suggestions">
          <div className="section-header">
            <h2>Trending Now</h2>
            <div className="header-line"></div>
          </div>

          <div className="suggestions-grid">
            {trendingItems.map((item) => (
              <div key={item.id} className="suggestion-card">
                <div className="card-image-box">
                  <img src={item.image} alt={item.name} />
                  <button className="card-add-btn" title="Add to Cart">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="card-details">
                  <span className="card-cat">{item.category}</span>
                  <h3 className="card-name">{item.name}</h3>
                  <div className="card-footer">
                    <span className="card-price">{item.price}</span>
                    <div className="card-rating">
                      <Star size={12} fill="currentColor" /> 4.8
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;