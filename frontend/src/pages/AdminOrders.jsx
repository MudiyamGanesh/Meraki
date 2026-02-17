import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH ALL ORDERS ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        let ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort orders so the newest ones are always at the top
        ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- 2. UPDATE ORDER STATUS ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status.");
    }
  };

  // --- HELPER: GET STATUS BADGE COLOR ---
  const getStatusColor = (status) => {
    switch(status) {
      case 'Processing': return { bg: '#fff7ed', text: '#c2410c', icon: <Clock size={14} /> };
      case 'Shipped': return { bg: '#eff6ff', text: '#1d4ed8', icon: <Truck size={14} /> };
      case 'Delivered': return { bg: '#f0fdf4', text: '#15803d', icon: <CheckCircle size={14} /> };
      case 'Cancelled': return { bg: '#fef2f2', text: '#b91c1c', icon: <Package size={14} /> };
      default: return { bg: '#f3f4f6', text: '#374151', icon: <Package size={14} /> };
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Orders...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>Order Management</h1>
        <div className="total-badge" style={{ backgroundColor: '#bb86fc', color: '#000', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
          Total Orders: {orders.length}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '16px', color: '#666' }}>Order Info</th>
              <th style={{ padding: '16px', color: '#666' }}>Customer</th>
              <th style={{ padding: '16px', color: '#666' }}>Items</th>
              <th style={{ padding: '16px', color: '#666' }}>Total</th>
              <th style={{ padding: '16px', color: '#666', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  No orders yet. Keep hustling!
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                
                return (
                  <tr key={order.id} className="order-row" style={{ borderBottom: '1px solid #eee' }}>
                    
                    {/* ORDER INFO (ID & DATE) */}
                    <td className="td-order-info" style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* CUSTOMER INFO */}
                    <td className="td-customer" style={{ padding: '16px' }}>
                      <span className="mobile-label">Customer: </span>
                      <div style={{ display: 'inline-block' }}>
                        <div style={{ fontWeight: '500', color: '#333', fontSize: '14px' }}>{order.customerDetails?.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{order.customerDetails?.city}, {order.customerDetails?.state}</div>
                      </div>
                    </td>

                    {/* ITEMS SUMMARY */}
                    <td className="td-items" style={{ padding: '16px', fontSize: '14px', color: '#555' }}>
                      <span className="mobile-label">Items: </span>
                      <div style={{ display: 'inline-block' }}>
                        {order.items?.length || 0} items
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                          {order.items?.map(i => i.name).join(', ').slice(0, 30)}...
                        </div>
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="td-total" style={{ padding: '16px', fontWeight: 'bold', color: '#333' }}>
                      <span className="mobile-label">Total: </span>
                      ₹{order.orderSummary?.total}
                    </td>

                    {/* STATUS DROPDOWN */}
                    <td className="td-status" style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px', 
                        backgroundColor: statusStyle.bg, color: statusStyle.text, 
                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' 
                      }}>
                        {statusStyle.icon}
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{ 
                            background: 'transparent', border: 'none', color: 'inherit', 
                            fontWeight: 'bold', cursor: 'pointer', outline: 'none' 
                          }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- RESPONSIVE CSS --- */}
      <style>{`
        .mobile-label {
          display: none;
          font-weight: bold;
          color: #888;
          margin-right: 5px;
        }

        @media (max-width: 768px) {
          /* Stack the header */
          .admin-header-container {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 15px;
          }
          .total-badge {
            align-self: flex-start;
          }

          /* Force table to block layout */
          .orders-table, 
          .orders-table tbody, 
          .orders-table tr, 
          .orders-table td {
            display: block;
            width: 100%;
          }

          /* Hide table headers */
          .orders-table thead {
            display: none;
          }

          /* Turn rows into cards */
          .order-row {
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid #eaeaea !important;
            border-radius: 12px;
            position: relative;
            background: #fff;
          }

          /* Adjust cells inside the card */
          .orders-table td {
            padding: 8px 0 !important;
            border-bottom: none !important;
            text-align: left !important;
          }

          /* Anchor the Status dropdown to the top right of the card */
          .td-status {
            position: absolute;
            top: 15px;
            right: 15px;
            padding: 0 !important;
            width: auto !important;
          }

          /* Prevent Order ID from hiding underneath the status badge */
          .td-order-info {
            padding-right: 140px !important;
            border-bottom: 1px dashed #eee !important;
            margin-bottom: 8px;
            padding-bottom: 12px !important;
          }

          /* Show mobile labels */
          .mobile-label {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;