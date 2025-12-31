import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Load initial state from local storage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('riti_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      return [];
    }
  });

  // Update local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('riti_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item Logic (Handles same item with different sizes)
  const addToCart = (product, size, quantity) => {
    setCartItems((prevItems) => {
      // Create a unique ID based on product ID AND size
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        // Item exists with same size? Update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // New item or new size
        return [...prevItems, { ...product, selectedSize: size, quantity }];
      }
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems((prev) => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id, size, delta) => {
    setCartItems((prev) => 
      prev.map(item => {
        if (item.id === id && item.selectedSize === size) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  // Derived State (Totals)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartCount,
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};