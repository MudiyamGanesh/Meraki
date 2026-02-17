import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { IndianRupee, ShoppingBag, Package, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // 1. Fetch Orders & Calculate Revenue
        const ordersSnap = await getDocs(collection(db, "orders"));
        let totalRevenue = 0;
        ordersSnap.forEach(doc => {
          const orderData = doc.data();
          // Make sure we only count revenue from orders that aren't cancelled!
          if (orderData.status !== 'Cancelled' && orderData.orderSummary?.total) {
            totalRevenue += orderData.orderSummary.total;
          }
        });

        // 2. Fetch Products Count
        const productsSnap = await getDocs(collection(db, "products"));
        
        // 3. Fetch Users Count
        const usersSnap = await getDocs(collection(db, "users"));

        setStats({
          revenue: totalRevenue,
          orders: ordersSnap.size,
          products: productsSnap.size,
          users: usersSnap.size
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>Crunching the numbers...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', color: '#111118', letterSpacing: '-0.5px' }}>Overview</h1>
        <p style={{ color: '#666', marginTop: '8px', fontSize: '15px' }}>Welcome back. Here is what's happening with your store today.</p>
      </div>

      {/* METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        
        {/* REVENUE CARD */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Total Revenue</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: '#f3e8ff', color: '#bb86fc' }}>
              <IndianRupee size={20} />
            </div>
          </div>
          <div style={cardValueStyle}>₹{stats.revenue.toLocaleString('en-IN')}</div>
          <div style={cardFooterStyle}>
            <TrendingUp size={14} color="#00c853" />
            <span style={{ color: '#00c853', fontWeight: '600' }}>Lifetime Earnings</span>
          </div>
        </div>

        {/* ORDERS CARD */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Total Orders</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: '#eef2ff', color: '#4f46e5' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={cardValueStyle}>{stats.orders}</div>
          <div style={cardFooterStyle}>
            <span style={{ color: '#888' }}>Across all statuses</span>
          </div>
        </div>

        {/* PRODUCTS CARD */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Active Products</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={cardValueStyle}>{stats.products}</div>
          <div style={cardFooterStyle}>
            <span style={{ color: '#888' }}>Live in your catalog</span>
          </div>
        </div>

        {/* USERS CARD */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Registered Users</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={cardValueStyle}>{stats.users}</div>
          <div style={cardFooterStyle}>
            <span style={{ color: '#888' }}>Growing community</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- STYLES ---
const cardStyle = { 
  backgroundColor: '#fff', 
  borderRadius: '16px', 
  padding: '24px', 
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  transition: 'transform 0.2s ease',
  cursor: 'default'
};
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const cardTitleStyle = { fontSize: '15px', fontWeight: '600', color: '#666' };
const iconWrapperStyle = { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardValueStyle = { fontSize: '32px', fontWeight: '800', color: '#111118', letterSpacing: '-1px' };
const cardFooterStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' };

export default AdminDashboard;