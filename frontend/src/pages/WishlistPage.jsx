import React, { useEffect } from 'react'; // 1. Import useEffect
import { Link } from 'react-router-dom';
import { useWishlist } from '../Context/WishlistContext';
import { Trash2, ShoppingCart, Heart, ArrowRight, Star } from 'lucide-react';
import '../css/WishlistPage.css'; 

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  // --- THE FIX ---
  // Scroll to top immediately when Wishlist Page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock data for suggestions
  const suggestions = [
    {
      id: 101,
      name: "Classic Denim Jacket",
      price: "₹2,499",
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=400&q=80",
      category: "Outerwear"
    },
    {
      id: 102,
      name: "Linen Summer Shirt",
      price: "₹1,899",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
      category: "Men"
    },
    {
      id: 103,
      name: "Boho Maxi Dress",
      price: "₹3,299",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80",
      category: "Women"
    }
  ];

  // --- EMPTY STATE VIEW ---
  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          
          <div className="empty-wishlist-state">
            <div className="empty-icon-wrapper">
              <Heart size={64} strokeWidth={1} fill="none" />
            </div>
            <h1>Your Wishlist is Empty</h1>
            <p>Save items you love here. Review them anytime <br />and easily move them to the bag.</p>
            
            <div className="empty-actions">
              <Link to="/" className="primary-btn">
                Start Shopping <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="wishlist-suggestions">
            <div className="section-header">
              <h2>Trending This Week</h2>
              <div className="line"></div>
            </div>
            
            <div className="suggestions-grid">
              {suggestions.map((item) => (
                <div key={item.id} className="suggestion-card">
                  <div className="card-image">
                    <img src={item.image} alt={item.name} />
                    <button className="card-add-btn">
                       <Heart size={16} />
                    </button>
                  </div>
                  <div className="card-info">
                    <span>{item.category}</span>
                    <h3>{item.name}</h3>
                    <div className="card-footer">
                      <span className="price">{item.price}</span>
                      <div className="rating">
                        <Star size={12} fill="currentColor" /> 4.5
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
  }

  // --- POPULATED WISHLIST VIEW ---
  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1 className="wishlist-title">My Wishlist ({wishlist.length})</h1>
        
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-img-box">
                <img src={item.image} alt={item.name} />
                <button 
                  className="btn-remove-icon"
                  onClick={() => removeFromWishlist(item.id)}
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="wishlist-details">
                <div className="details-top">
                    <h3>{item.name}</h3>
                    <p>{item.category}</p>
                </div>
                <div className="price">₹ {item.price}</div>
                
                <button className="btn-cart">
                  <ShoppingCart size={16} /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;