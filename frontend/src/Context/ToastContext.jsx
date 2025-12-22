import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import '../css/Toast.css'; // We will create this next

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* The Popup Component */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};