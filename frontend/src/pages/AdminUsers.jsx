import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { User, Mail, Calendar, ShieldCheck, Star, Crown, Ban, Eye, MapPin, ShoppingBag, RefreshCw, X, AlertTriangle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [activeFilter, setActiveFilter] = useState('All'); // All, Customers, VIPs, Blocked
  const [selectedUser, setSelectedUser] = useState(null); // For the Profile Modal

  // --- 1. REAL-TIME FETCH: USERS & ORDERS ---
  useEffect(() => {
    // Listen to Users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      let usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    });

    // Listen to Orders (to calculate spending and get addresses)
    const unsubscribeOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      let ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersList);
      setLoading(false);
    });

    return () => { unsubscribeUsers(); unsubscribeOrders(); };
  }, []);

  // --- 2. DATA MERGING & CALCULATIONS ---
  const enrichedUsers = useMemo(() => {
    return users.map(user => {
      // Find all orders belonging to this user (matching by ID or Email)
      const userOrders = orders.filter(o => o.userId === user.id || o.customerDetails?.email === user.email);
      
      // Calculate Lifetime Value
      let totalSpent = 0;
      let validOrderCount = 0;
      let lastKnownAddress = null;

      userOrders.forEach(order => {
        if (order.status !== 'Cancelled' && order.status !== 'Returned') {
          totalSpent += (order.orderSummary?.total || 0);
          validOrderCount++;
          // Grab the address from their most recent valid order
          if (order.customerDetails?.address) lastKnownAddress = order.customerDetails;
        }
      });

      // Calculate Loyalty Points (1 point per ₹100 spent)
      const loyaltyPoints = Math.floor(totalSpent / 100);

      // Smart Segmentation
      let segment = 'Registered'; // Has account, no purchases
      if (validOrderCount > 0) segment = 'Customer';
      if (totalSpent >= 10000 || validOrderCount >= 3) segment = 'VIP'; // Spent > ₹10k OR bought 3+ times
      if (user.role === 'admin') segment = 'Admin';

      return {
        ...user,
        totalSpent,
        orderCount: validOrderCount,
        loyaltyPoints,
        segment,
        userOrders, // Keep history attached for the modal
        lastKnownAddress
      };
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [users, orders]);

  // --- 3. FILTER LOGIC ---
  const filteredUsers = useMemo(() => {
    if (activeFilter === 'All') return enrichedUsers;
    if (activeFilter === 'Customers') return enrichedUsers.filter(u => u.segment === 'Customer' || u.segment === 'VIP');
    if (activeFilter === 'VIPs') return enrichedUsers.filter(u => u.segment === 'VIP');
    if (activeFilter === 'Blocked') return enrichedUsers.filter(u => u.isBlocked);
    return enrichedUsers;
  }, [enrichedUsers, activeFilter]);

  // --- 4. BLOCK / UNBLOCK USER ---
  const toggleBlockStatus = async (userId, currentStatus) => {
    const confirmMsg = currentStatus 
      ? "Unblock this user? They will be able to log in again." 
      : "Block this user? They will be locked out of their account.";
    
    if (window.confirm(confirmMsg)) {
      try {
        await updateDoc(doc(db, "users", userId), { isBlocked: !currentStatus });
      } catch (error) {
        console.error("Error updating block status:", error);
        alert("Failed to update user status.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#bb86fc' }}>
        <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
        <h2 style={{ color: '#fff' }}>Syncing CRM Data...</h2>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* HEADER & FILTERS */}
      <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>Customer Management</h1>
          <p style={{ color: '#a0a0a5', margin: '8px 0 0 0' }}>Track spending, manage loyalty, and monitor activity.</p>
        </div>
        
        <div style={{ display: 'flex', backgroundColor: '#1a1a24', borderRadius: '8px', padding: '4px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto', maxWidth: '100%' }}>
          {['All', 'Customers', 'VIPs', 'Blocked'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s', whiteSpace: 'nowrap',
                backgroundColor: activeFilter === filter ? '#bb86fc' : 'transparent',
                color: activeFilter === filter ? '#000' : '#a0a0a5'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* USERS TABLE */}
      <div style={{ backgroundColor: '#16161e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a1a24', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>User / Contact</th>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Segmentation</th>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Lifetime Value</th>
              <th style={{ padding: '16px', color: '#a0a0a5', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#a0a0a5' }}>
                  No users found for this filter.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="user-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: user.isBlocked ? 0.5 : 1 }}>
                  
                  {/* 1. CUSTOMER INFO */}
                  <td className="td-cell" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', backgroundColor: user.segment === 'Admin' ? 'rgba(187, 134, 252, 0.2)' : '#1a1a24', color: user.segment === 'Admin' ? '#bb86fc' : '#a0a0a5', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {user.name || 'Anonymous User'} 
                        {user.isBlocked && <span style={{backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px'}}>BLOCKED</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a0a0a5', fontSize: '12px', marginTop: '4px' }}>
                        <Mail size={12} /> {user.email}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Joined: {new Date(user.createdAt || 0).toLocaleDateString()}</div>
                    </div>
                  </td>

                  {/* 2. SEGMENTATION BADGE */}
                  <td className="td-cell" style={{ padding: '16px' }}>
                    <span className="mobile-label">Status: </span>
                    {user.segment === 'Admin' && <div style={badgeStyle('#9333ea', 'rgba(147, 51, 234, 0.15)')}><ShieldCheck size={14} /> Admin</div>}
                    {user.segment === 'VIP' && <div style={badgeStyle('#fbbf24', 'rgba(251, 191, 36, 0.15)')}><Crown size={14} /> VIP Spender</div>}
                    {user.segment === 'Customer' && <div style={badgeStyle('#4ade80', 'rgba(74, 222, 128, 0.15)')}><ShoppingBag size={14} /> Customer</div>}
                    {user.segment === 'Registered' && <div style={badgeStyle('#a0a0a5', 'rgba(255, 255, 255, 0.05)')}><User size={14} /> Registered</div>}
                  </td>

                  {/* 3. LIFETIME VALUE */}
                  <td className="td-cell" style={{ padding: '16px' }}>
                    <span className="mobile-label">Lifetime: </span>
                    <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>₹{user.totalSpent.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '12px', color: '#a0a0a5', marginTop: '4px' }}>{user.orderCount} Orders</div>
                    {user.loyaltyPoints > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#fbbf24', marginTop: '6px' }}>
                        <Star size={12} fill="currentColor"/> {user.loyaltyPoints} Points
                      </div>
                    )}
                  </td>

                  {/* 4. ACTIONS */}
                  <td className="td-actions" style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button 
                        onClick={() => setSelectedUser(user)}
                        title="View Profile"
                        style={{ padding: '8px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex' }}
                      >
                        <Eye size={18} />
                      </button>
                      
                      {user.email !== 'ram@riti.com' && ( // Prevent admin from blocking themselves
                        <button 
                          onClick={() => toggleBlockStatus(user.id, user.isBlocked)}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                          style={{ padding: '8px', backgroundColor: user.isBlocked ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)', color: user.isBlocked ? '#4ade80' : '#f87171', border: `1px solid ${user.isBlocked ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`, borderRadius: '6px', cursor: 'pointer', display: 'inline-flex' }}
                        >
                          <Ban size={18} />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- CUSTOMER PROFILE MODAL --- */}
      {selectedUser && (
        <div style={modalOverlayStyle} onClick={() => setSelectedUser(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {selectedUser.name || 'Anonymous User'}
                  {selectedUser.segment === 'VIP' && <Crown size={18} color="#fbbf24" />}
                </h2>
                <div style={{ color: '#a0a0a5', fontSize: '13px' }}>ID: {selectedUser.id}</div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: '#a0a0a5', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            {/* Address Management Extract */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#a0a0a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16}/> Last Known Address
              </h3>
              {selectedUser.lastKnownAddress ? (
                <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.6' }}>
                  <strong>{selectedUser.lastKnownAddress.fullName}</strong><br />
                  {selectedUser.lastKnownAddress.phone}<br />
                  {selectedUser.lastKnownAddress.address}<br />
                  {selectedUser.lastKnownAddress.city}, {selectedUser.lastKnownAddress.state} - {selectedUser.lastKnownAddress.pincode}
                </div>
              ) : (
                <div style={{ color: '#666', fontStyle: 'italic', fontSize: '13px' }}>No address data on file (No completed orders).</div>
              )}
            </div>

            {/* Order History Extract */}
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#a0a0a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={16}/> Order History ({selectedUser.userOrders?.length || 0})
            </h3>
            
            <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
              {selectedUser.userOrders?.length > 0 ? (
                selectedUser.userOrders.map(order => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>#{order.id.slice(0, 8).toUpperCase()}</div>
                      <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>₹{order.orderSummary?.total}</div>
                      <div style={{ color: order.status === 'Cancelled' ? '#f87171' : '#4ade80', fontSize: '11px', marginTop: '4px' }}>{order.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#666', fontStyle: 'italic', fontSize: '13px' }}>No orders found for this user.</div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- RESPONSIVE CSS --- */}
      <style>{`
        .mobile-label { display: none; font-weight: bold; color: #a0a0a5; margin-right: 5px; }

        @media (max-width: 768px) {
          .admin-header-container { flex-direction: column; align-items: flex-start !important; }
          .users-table, .users-table tbody, .users-table tr, .users-table td { display: block; width: 100%; }
          .users-table thead { display: none; }
          .user-row { padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05) !important; border-radius: 12px; position: relative; background: #1a1a24; }
          .users-table td.td-cell { padding: 8px 0 !important; border-bottom: none !important; text-align: left !important; }
          .td-actions { position: absolute; top: 15px; right: 15px; padding: 0 !important; width: auto !important; }
          .mobile-label { display: inline-block !important; }
        }
      `}</style>
    </div>
  );
};

// --- HELPER STYLES ---
const badgeStyle = (color, bg) => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px', 
  backgroundColor: bg, color: color, padding: '4px 10px', 
  borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
  border: `1px solid ${color}40` // Adds a subtle 25% opacity border matching the color
});

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContentStyle = { backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' };

export default AdminUsers;