// src/context/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext'; // Make sure this path matches your structure!

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth(); // We need to know who is logged in

  // --- 1. FETCH WISHLIST ON LOAD OR LOGIN ---
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        // Fetch from Firebase for logged-in users
        try {
          const wishlistRef = doc(db, 'wishlists', user.uid);
          const wishlistSnap = await getDoc(wishlistRef);
          
          if (wishlistSnap.exists()) {
            setWishlist(wishlistSnap.data().items || []);
          } else {
            setWishlist([]); // No wishlist document found yet
          }
        } catch (error) {
          console.error("Error fetching wishlist from Firebase:", error);
        }
      } else {
        // Fetch from LocalStorage for guest users
        const localWishlist = localStorage.getItem('riti_guest_wishlist');
        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist));
        } else {
          setWishlist([]);
        }
      }
      setIsInitialized(true);
    };

    fetchWishlist();
  }, [user]);

  // --- 2. SAVE WISHLIST WHENEVER IT CHANGES ---
  useEffect(() => {
    // Prevent accidentally overwriting the database before it loads
    if (!isInitialized) return; 

    const saveWishlist = async () => {
      if (user) {
        try {
          const wishlistRef = doc(db, 'wishlists', user.uid);
          
          if (wishlist.length === 0) {
            // IF EMPTY: Completely delete the document to keep the database clean!
            await deleteDoc(wishlistRef);
          } else {
            // IF HAS ITEMS: Overwrite the items array in the database
            await setDoc(wishlistRef, { items: wishlist }); 
          }
        } catch (error) {
          console.error("Error saving wishlist to Firebase:", error);
        }
      } else {
        // Save to LocalStorage for guests
        localStorage.setItem('riti_guest_wishlist', JSON.stringify(wishlist));
        // Clear local storage if empty to keep it clean too
        if (wishlist.length === 0) localStorage.removeItem('riti_guest_wishlist');
      }
    };

    saveWishlist();
  }, [wishlist, user, isInitialized]);

  // --- ACTIONS ---
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      // Prevent duplicates
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter(item => item.id !== productId));
  };

  // Check if an item is already liked (returns true/false)
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};