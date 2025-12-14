// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Check local storage for existing session
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    // SIMULATED LOGIN LOGIC
    // In a real app, you would fetch from an API here.
    if (email && password) {
      const fakeUser = { name: "Ram", email: email };
      setUser(fakeUser);
      localStorage.setItem('user', JSON.stringify(fakeUser));
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    // SIMULATED REGISTER LOGIC
    const newUser = { name: name, email: email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};