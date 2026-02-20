import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { IndianRupee, ShoppingBag, Package, Activity, TrendingUp, AlertTriangle, ChevronRight, RefreshCw, X, Clock, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // UI States
  const [timeframe, setTimeframe] = useState('month'); 
  const [showConversionModal, setShowConversionModal] = useState(false);

  // --- REAL-TIME DATA SYNC ---
  useEffect(() => {
    const unsubscribeOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false); 
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeUsers();
    };
  }, []);

  // --- CALCULATE ALL METRICS & CHART DATA ---
  const { stats, chartData } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    // 1. Filter orders based on timeframe
    const filteredOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      const orderTime = new Date(order.createdAt).getTime();
      if (timeframe === 'today') return orderTime >= startOfToday;
      if (timeframe === 'month') return orderTime >= startOfMonth;
      return true; 
    });

    let revenue = 0;
    let totalOrders = 0;
    let pendingCount = 0;
    let returnCount = 0;

    // --- Analytics Data Structures ---
    const revenueByDayMap = {};
    const categorySalesMap = {};

    filteredOrders.forEach(order => {
      if (order.status !== 'Cancelled' && order.status !== 'Returned') {
        const orderTotal = order.orderSummary?.total || 0;
        revenue += orderTotal;
        totalOrders++;

        // Process data for Line Chart (Revenue Trend)
        if (order.createdAt) {
          const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
          revenueByDayMap[dateStr] = (revenueByDayMap[dateStr] || 0) + orderTotal;
        }

        // Process data for Bar Chart (Category Performance)
        if (order.items) {
          order.items.forEach(item => {
            const cat = item.subCategory || 'Other';
            categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.quantity;
          });
        }
      }
    });

    orders.forEach(order => {
      if (order.status === 'Processing' || order.status === 'Pending') pendingCount++;
      if (order.status === 'Returned' || order.status === 'Refunded') returnCount++;
    });

    const averageOrderValue = totalOrders > 0 ? (revenue / totalOrders) : 0;

    let inStock = 0;
    let outOfStock = 0;
    products.forEach(p => {
      const stockLevel = p.stock !== undefined ? p.stock : 10; 
      if (stockLevel > 0) inStock++;
      else outOfStock++;
    });

    const simulatedVisitors = timeframe === 'today' ? 150 : timeframe === 'month' ? 3400 : users.length * 15;
    const conversionRate = simulatedVisitors > 0 ? ((totalOrders / simulatedVisitors) * 100).toFixed(2) : 0;

    // --- Format Chart Data for Recharts ---
    // Line Chart Data
    const revenueTrendData = Object.keys(revenueByDayMap).map(date => ({
      date,
      revenue: revenueByDayMap[date]
    }));

    // Bar Chart Data (Top 5 Categories)
    const categoryData = Object.keys(categorySalesMap)
      .map(name => ({ name, sales: categorySalesMap[name] }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Dynamic Colors for Bar Chart
    const barColors = ['#bb86fc', '#38bdf8', '#4ade80', '#fbbf24', '#f87171'];

    return {
      stats: {
        revenue, totalOrders,
        pendingCount, returnCount,
        averageOrderValue,
        inStock, outOfStock,
        conversionRate, simulatedVisitors
      },
      chartData: { revenueTrendData, categoryData, barColors }
    };
  }, [orders, products, users, timeframe]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#bb86fc' }}>
        <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
        <h2 style={{ color: '#fff' }}>Syncing Live Data...</h2>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* HEADER & TIMEFRAME FILTER */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', color: '#fff', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Live Overview 
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', backgroundColor: 'rgba(22, 163, 74, 0.2)', color: '#4ade80', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid rgba(22, 163, 74, 0.3)' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div> Real-time
            </span>
          </h1>
          <p style={{ color: '#a0a0a5', marginTop: '8px', fontSize: '15px' }}>Command center data dynamically updates as customers shop.</p>
        </div>

        <div className="timeframe-filters" style={{ display: 'flex', backgroundColor: '#1a1a24', borderRadius: '8px', padding: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {['today', 'month', 'lifetime'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textTransform: 'capitalize', transition: 'all 0.2s',
                backgroundColor: timeframe === t ? '#bb86fc' : 'transparent',
                color: timeframe === t ? '#000' : '#a0a0a5'
              }}
            >
              {t === 'month' ? 'This Month' : t}
            </button>
          ))}
        </div>
      </div>

      {/* 6-CARD METRICS GRID */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '30px' }}>
        
        {/* 1. REVENUE CARD */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Total Revenue</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80' }}>
              <IndianRupee size={20} />
            </div>
          </div>
          <div style={{ ...cardValueStyle, marginTop: '10px' }}>₹{stats.revenue.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '13px', color: '#a0a0a5', marginTop: 'auto', paddingTop: '15px' }}>
            Earnings for <strong style={{color: '#fff', textTransform: 'capitalize'}}>{timeframe === 'month' ? 'this month' : timeframe}</strong>
          </div>
        </div>

        {/* 2. TOTAL ORDERS CARD */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Total Orders</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(187, 134, 252, 0.15)', color: '#bb86fc' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ ...cardValueStyle, marginTop: '10px' }}>{stats.totalOrders}</div>
          <div style={{ fontSize: '13px', color: '#a0a0a5', marginTop: 'auto', paddingTop: '15px' }}>
            Successful orders <strong style={{color: '#fff', textTransform: 'capitalize'}}>{timeframe === 'month' ? 'this month' : timeframe}</strong>
          </div>
        </div>

        {/* 3. AVERAGE ORDER VALUE (AOV) */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Average Order Value</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ ...cardValueStyle, marginTop: '10px' }}>₹{stats.averageOrderValue.toFixed(0)}</div>
          <div style={{ fontSize: '13px', color: '#a0a0a5', marginTop: 'auto', paddingTop: '15px' }}>
            Average spend per customer <strong style={{color: '#fff', textTransform: 'capitalize'}}>{timeframe === 'month' ? 'this month' : timeframe}</strong>
          </div>
        </div>

        {/* 4. ACTIONABLE ORDERS */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Action Required</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(248, 113, 113, 0.15)', color: '#f87171' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                <Clock size={16}/> Pending
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{stats.pendingCount}</div>
            </div>
            <div style={{ flex: 1, backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                <RotateCcw size={16}/> Returns
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{stats.returnCount}</div>
            </div>
          </div>
        </div>

        {/* 5. INVENTORY REDIRECTS */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Inventory Management</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#a0a0a5', marginTop: '10px', marginBottom: '15px' }}>
            Total catalog: <span style={{ color: '#fff', fontWeight: 'bold' }}>{products.length} Items</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
            <button 
              onClick={() => navigate('/admin/products?filter=instock')}
              style={{ padding: '10px 15px', fontSize: '14px', fontWeight: 'bold', backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{stats.inStock} Products In Stock</span> <ChevronRight size={16}/>
            </button>
            <button 
              onClick={() => navigate('/admin/products?filter=outofstock')}
              style={{ padding: '10px 15px', fontSize: '14px', fontWeight: 'bold', backgroundColor: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{stats.outOfStock} Products Out of Stock</span> <ChevronRight size={16}/>
            </button>
          </div>
        </div>

        {/* 6. CONVERSION RATE */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Conversion Rate</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ ...cardValueStyle, marginTop: '10px' }}>{stats.conversionRate}%</div>
          <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
            <button 
              onClick={() => setShowConversionModal(true)}
              style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', border: '1px solid rgba(187, 134, 252, 0.3)', color: '#bb86fc', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
            >
              View Full Funnel Details
            </button>
          </div>
        </div>
      </div>

      {/* --- PHASE 2: VISUAL ANALYTICS SECTION --- */}
      <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* LINE CHART: REVENUE TREND */}
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h3 style={{ color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#bb86fc" /> Revenue Trend ({timeframe})
          </h3>
          {chartData.revenueTrendData.length > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.revenueTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#a0a0a5" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a0a0a5" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#bb86fc', fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#bb86fc" strokeWidth={3} dot={{ r: 4, fill: '#bb86fc', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No revenue data for this timeframe.</div>
          )}
        </div>

        {/* BAR CHART: CATEGORY PERFORMANCE */}
        <div style={cardStyle}>
          <h3 style={{ color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="#38bdf8" /> Top Selling Categories
          </h3>
          {chartData.categoryData.length > 0 ? (
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.categoryData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#a0a0a5" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a0a0a5" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {chartData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartData.barColors[index % chartData.barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No category data found.</div>
          )}
        </div>
      </div>

      {/* --- CONVERSION DETAILS MODAL --- */}
      {showConversionModal && (
        <div className="custom-modal-overlay" onClick={() => setShowConversionModal(false)}>
          <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>Funnel Breakdown (<span style={{textTransform: 'capitalize'}}>{timeframe}</span>)</h2>
              <button onClick={() => setShowConversionModal(false)} style={{ background: 'none', border: 'none', color: '#a0a0a5', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={funnelRowStyle}>
                <span style={{fontWeight: 'bold', color: '#a0a0a5', fontSize: '14px'}}>1. Store Visitors (Est.)</span>
                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#fff'}}>{stats.simulatedVisitors}</span>
              </div>
              <div style={funnelRowStyle}>
                <span style={{fontWeight: 'bold', color: '#a0a0a5', fontSize: '14px'}}>2. Registered Users</span>
                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#fff'}}>{users.length}</span>
              </div>
              <div style={{...funnelRowStyle, borderBottom: 'none'}}>
                <span style={{fontWeight: 'bold', color: '#a0a0a5', fontSize: '14px'}}>3. Successful Orders</span>
                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#4ade80'}}>{stats.totalOrders}</span>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#888', lineHeight: '1.5', margin: 0 }}>
              <AlertTriangle size={12} style={{ display: 'inline', marginBottom: '-2px', color: '#fbbf24' }}/> Using simulated visitor traffic. Integrate Google Analytics in Phase 9 for precise tracking.
            </p>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE CSS --- */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }

        .custom-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
          z-index: 1000; display: flex; justify-content: center; align-items: center;
        }

        .custom-modal-content {
          background-color: #1a1a24; border: 1px solid rgba(255,255,255,0.1);
          padding: 30px; border-radius: 16px; width: 90%; max-width: 500px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        /* Mobile Breakpoints */
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 15px;
          }
          
          .timeframe-filters {
            width: 100%;
            justify-content: space-between;
          }
          .timeframe-filters button {
            flex: 1;
            padding: 8px 0;
          }

          .metrics-grid {
            grid-template-columns: 1fr !important; /* Stack 6 cards vertically */
            gap: 15px !important;
          }

          .analytics-grid {
            grid-template-columns: 1fr !important; /* Stack charts vertically */
            gap: 15px !important;
          }

          .custom-modal-content {
            padding: 20px;
            width: 95%;
          }
        }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const cardStyle = { 
  backgroundColor: '#16161e', borderRadius: '16px', padding: '24px', 
  border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', 
  transition: 'all 0.2s ease'
};
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const cardTitleStyle = { fontSize: '15px', fontWeight: '600', color: '#a0a0a5' };
const iconWrapperStyle = { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardValueStyle = { fontSize: '32px', fontWeight: '800', color: '#ffffff', letterSpacing: '-1px' };
const funnelRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' };

export default AdminDashboard;