import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext'; // Adjust path if your AuthContext is somewhere else

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth(); // We need to know who is logged in!

  // --- 1. FETCH CART ON LOAD OR LOGIN ---
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        // Fetch from Firebase for logged-in users
        try {
          // Assuming Firebase Auth uses 'uid'. If your custom auth uses 'id', change this!
          const cartRef = doc(db, 'carts', user.uid); 
          const cartSnap = await getDoc(cartRef);
          
          if (cartSnap.exists()) {
            setCartItems(cartSnap.data().items || []);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error fetching cart from Firebase:", error);
        }
      } else {
        // Fetch from LocalStorage for guest users
        const localCart = localStorage.getItem('riti_guest_cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        } else {
          setCartItems([]);
        }
      }
      setIsInitialized(true);
    };

    fetchCart();
  }, [user]);

  // --- 2. SAVE CART WHENEVER IT CHANGES ---
  useEffect(() => {
    if (!isInitialized) return; // Don't accidentally overwrite the DB before we've loaded it!

    const saveCart = async () => {
      if (user) {
        // Save to Firebase
        try {
          const cartRef = doc(db, 'carts', user.uid);
          await setDoc(cartRef, { items: cartItems }, { merge: true });
        } catch (error) {
          console.error("Error saving cart to Firebase:", error);
        }
      } else {
        // Save to LocalStorage
        localStorage.setItem('riti_guest_cart', JSON.stringify(cartItems));
      }
    };

    saveCart();
  }, [cartItems, user, isInitialized]);

  // --- ACTIONS ---
  const addToCart = (product, selectedSize, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.selectedSize === selectedSize);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, selectedSize, quantity }];
    });
  };

  const removeFromCart = (productId, selectedSize) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (productId, selectedSize, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId && item.selectedSize === selectedSize) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // NEW: We need this to wipe the cart clean after a successful checkout!
  const clearCart = () => {
    setCartItems([]);
  };

  // --- DERIVED STATE ---
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};