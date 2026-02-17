// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup, 
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize the Google Provider
  const googleProvider = new GoogleAuthProvider();

  // --- 1. PERSISTENT SESSION LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDocSnap.data()
          });
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);

  // --- 2. EMAIL LOGIN LOGIC ---
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // --- 3. EMAIL REGISTER LOGIC ---
  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userData = {
        name: name,
        email: email,
        role: email === 'ram@riti.com' ? 'admin' : 'customer', 
        createdAt: new Date().toISOString(),
        provider: 'email'
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  // --- 4. GOOGLE AUTH LOGIC ---
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if this Google user is already in our Firestore database
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // If they don't exist, this is their first time logging in! Save them to the database.
        const userData = {
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email,
          role: firebaseUser.email === 'ram@riti.com' ? 'admin' : 'customer', 
          createdAt: new Date().toISOString(),
          provider: 'google'
        };
        await setDoc(userDocRef, userData);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Google Auth error:", error);
      return { success: false, error: error.message };
    }
  };

  // --- 5. LOGOUT LOGIC ---
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};