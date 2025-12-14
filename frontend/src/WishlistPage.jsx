// src/pages/WishlistPage.jsx
import React from 'react';
import { useWishlist } from './Context/WishlistContext';
import { Trash2, ShoppingCart } from 'lucide-react';
import './css/WishlistPage.css'; 

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>Your Wishlist is Empty</h2>
        <p>Explore our collections and add some items!</p>
        <a href="/Meraki/" className="btn-primary">Go Shopping</a>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">My Wishlist ({wishlist.length})</h1>
      
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div key={item.id} className="wishlist-card">
            <div className="wishlist-img-box">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="wishlist-details">
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <div className="price">₹ {item.price}</div>
              
              <div className="wishlist-actions">
                <button className="btn-cart">
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button 
                  className="btn-remove"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;