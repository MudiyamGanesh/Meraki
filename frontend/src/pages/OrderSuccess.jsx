import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const navigate = useNavigate();

  // Scroll to top when it loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '150px 20px', 
      minHeight: '70vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <CheckCircle size={80} color="#00c853" style={{ marginBottom: '20px' }} />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: '36px', marginBottom: '10px' }}
      >
        Order Confirmed!
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '40px', maxWidth: '500px' }}
      >
        Thanks for shopping with Riti. We've received your order and our team is getting your gear ready for the drop.
      </motion.p>
      
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/')} 
        style={{ 
          backgroundColor: '#bb86fc', color: '#000', padding: '15px 40px', 
          borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' 
        }}
      >
        <ShoppingBag size={20} /> Back to Store
      </motion.button>
    </div>
  );
};

export default OrderSuccess;