import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Adjust path if needed

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // IMPORTANT: Change this to your actual Firebase Auth email!
  const ADMIN_EMAIL = "ram@riti.com"; 

  // If nobody is logged in, send them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in but aren't you, send them back to the home page
  if (user.email !== ADMIN_EMAIL) {
    alert("Access Denied. Admins only.");
    return <Navigate to="/" replace />;
  }

  // If they pass the checks, render the admin panel!
  return children;
};

export default AdminRoute;