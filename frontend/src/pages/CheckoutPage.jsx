import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Shipping Form State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Calculate Totals
  const shippingCost = cartTotal > 999 ? 0 : 100;
  const finalTotal = cartTotal + shippingCost;

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // --- THE CHECKOUT ACTION ---
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Build the Order Payload
      const newOrder = {
        userId: user ? user.uid : 'guest',
        customerDetails: shippingInfo,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.images?.[0] || item.image || "https://via.placeholder.com/150"
        })),
        orderSummary: {
          subtotal: cartTotal,
          shipping: shippingCost,
          total: finalTotal
        },
        status: 'Processing', // Default status for the admin panel
        createdAt: new Date().toISOString()
      };

      // 2. Push to Firebase 'orders' collection
      await addDoc(collection(db, "orders"), newOrder);

      // 3. Wipe the cart clean
      clearCart();

      // 4. Send them to the success screen
      navigate('/order-success');

    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an issue processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Security check: Don't let them checkout an empty cart
  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '150px 20px', minHeight: '70vh' }}>
        <h2>Your bag is empty.</h2>
        <button onClick={() => navigate('/cart')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#bb86fc', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Go Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px 60px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <button onClick={() => navigate('/cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Secure Checkout</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* LEFT COLUMN: SHIPPING FORM */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="#bb86fc" /> Delivery Details
          </h2>
          
          <form id="checkout-form" onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Full Name*</label>
              <input type="text" name="fullName" value={shippingInfo.fullName} onChange={handleChange} required style={inputStyle} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email*</label>
                <input type="email" name="email" value={shippingInfo.email} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Phone Number*</label>
                <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Street Address*</label>
              <textarea name="address" value={shippingInfo.address} onChange={handleChange} required style={{ ...inputStyle, minHeight: '80px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>City*</label>
                <input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>State*</label>
                <input type="text" name="state" value={shippingInfo.state} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Pincode*</label>
                <input type="text" name="pincode" value={shippingInfo.pincode} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div style={{ alignSelf: 'start', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '25px' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px', maxHeight: '300px', overflowY: 'auto' }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '80px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>Size: {item.selectedSize} | Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 'bold' }}>₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? <span style={{ color: '#00c853' }}>FREE</span> : `₹${shippingCost}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 'bold', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <button 
            form="checkout-form" // This targets the form ID on the left!
            type="submit" 
            disabled={isProcessing}
            style={{ 
              width: '100%', marginTop: '30px', padding: '16px', backgroundColor: '#bb86fc', color: '#000', 
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', opacity: isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? 'Processing Order...' : <><CheckCircle size={20} /> PLACE ORDER</>}
          </button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '15px' }}>Cash on Delivery (COD) available.</p>
        </div>
        
      </div>
    </div>
  );
};

// --- STYLES ---
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '15px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' };

export default CheckoutPage;