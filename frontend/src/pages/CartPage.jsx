import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../css/CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate(); 

  // Shipping Logic (Free over ₹999)
  const shippingCost = cartTotal > 999 ? 0 : 100;
  const finalTotal = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <ShoppingBag size={64} className="empty-icon" />
        <h2>YOUR BAG IS EMPTY</h2>
        <p>Looks like you haven't added any streetwear yet.</p>
        
        <button 
          onClick={() => navigate(-1)} 
          className="start-shopping-btn"
          style={{border:'none', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'10px', fontSize:'1rem'}}
        >
          <ArrowLeft size={20} /> CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1 className="cart-title">SHOPPING BAG ({cartItems.length})</h1>

      <div className="cart-layout">
        {/* --- CART ITEMS LIST --- */}
        <div className="cart-items-section">
          {cartItems.map((item) => {
            // FIREBASE DATA FIX: Safely grab the first image, or use fallback
            const mainImg = item.images?.[0] || item.image || "https://via.placeholder.com/300";
            
            // FIREBASE DATA FIX: Build a clean category string
            const itemCategory = item.gender 
              ? `${item.gender} • ${item.subCategory || item.articleType}` 
              : item.category;

            return (
              <div key={`${item.id}-${item.selectedSize}`} className="cart-item-card">
                <div className="cart-img-wrapper">
                  <Link to={`/product/${item.id}`}>
                    <img src={mainImg} alt={item.name} />
                  </Link>
                </div>
                
                <div className="cart-item-details">
                  <div className="item-header">
                    <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                    <button 
                      className="remove-btn" 
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <p className="item-variant">Size: {item.selectedSize} | {itemCategory}</p>
                  
                  <div className="item-footer">
                    <div className="qty-selector">
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)}><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)}><Plus size={14} /></button>
                    </div>
                    <div className="item-price">₹{item.price * item.quantity}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- SUMMARY SECTION --- */}
        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>ORDER SUMMARY</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping Estimate</span>
              <span>{shippingCost === 0 ? <span className="free-text">FREE</span> : `₹${shippingCost}`}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>TOTAL</span>
              <span>₹{finalTotal}</span>
            </div>

            <p className="tax-text">Inclusive of all taxes</p>

            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              CHECKOUT NOW <ArrowRight size={20} />
            </button>
            
            <div className="secure-badge">
              <span>🔒 Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;