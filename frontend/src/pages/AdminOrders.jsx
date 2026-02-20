import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Package, Truck, CheckCircle, Clock, FileText, MapPin, CreditCard, RefreshCw, XCircle, RotateCcw, Save } from 'lucide-react';

// REMOVED 'async' from the component definition!
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [trackingInputs, setTrackingInputs] = useState({});

  // --- 1. REAL-TIME ORDERS FETCH ---
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      let ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      ordersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. UPDATE ORDER STATUS & INVENTORY LOGGING ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // If the order is marked as 'Returned', automatically log it in the stock_movements!
      if (newStatus === 'Returned') {
        const targetOrder = orders.find(o => o.id === orderId);
        
        // Loop through the items in the returned order and add them back to inventory logs
        if (targetOrder && targetOrder.items) {
          for (const item of targetOrder.items) {
            await addDoc(collection(db, "stock_movements"), {
              date: new Date().toISOString(),
              sku: item.sku || "UNKNOWN-SKU", // Fallback if SKU is missing
              type: "Return",
              qty: item.quantity, 
              orderId: orderId
            });
          }
        }
      }

    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status.");
    }
  };

  // --- 3. UPDATE TRACKING NUMBER ---
  const handleSaveTracking = async (orderId) => {
    const trackingNo = trackingInputs[orderId];
    if (!trackingNo) return;
    
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { trackingNumber: trackingNo });
      alert("Tracking updated successfully!");
    } catch (error) {
      console.error("Error saving tracking:", error);
    }
  };

  // --- 4. GENERATE PDF INVOICE ---
  const generateInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} <br><small>Size: ${item.size}</small></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice_RITI_${order.id.slice(0,8)}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 30px; }
            .brand { font-size: 32px; font-weight: 800; letter-spacing: 2px; margin: 0; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 10px; background: #f8f9fa; border-bottom: 2px solid #ddd; }
            .total-row { font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div><h1 class="brand">RITI</h1><p style="margin:5px 0 0 0; color:#888;">Premium Fashion Label</p></div>
            <div style="text-align: right;">
              <h2 style="margin:0 0 5px 0;">INVOICE</h2>
              <div>Order: #${order.id.slice(0, 8).toUpperCase()}</div>
              <div>Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div class="details">
            <div>
              <strong>Billed To:</strong><br>
              ${order.customerDetails?.fullName}<br>
              ${order.customerDetails?.address}<br>
              ${order.customerDetails?.city}, ${order.customerDetails?.state} - ${order.customerDetails?.pincode}<br>
              Phone: ${order.customerDetails?.phone}
            </div>
            <div style="text-align: right;">
              <strong>Payment Method:</strong><br>
              ${order.paymentMethod || 'Cash on Delivery'}<br><br>
              <strong>Order Status:</strong><br>
              ${order.status}
            </div>
          </div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th style="text-align:right;">Total</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="text-align: right; font-size: 14px;">
            <p>Subtotal: ₹${order.orderSummary?.subtotal}</p>
            <p>Shipping: ${order.orderSummary?.shipping === 0 ? 'FREE' : `₹${order.orderSummary?.shipping}`}</p>
            <p class="total-row">Grand Total: ₹${order.orderSummary?.total}</p>
          </div>
          <div style="margin-top: 60px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            Thank you for shopping with Riti! For any returns or queries, email support@riti.com.
          </div>
          <script>
            window.onload = function() { window.print(); setTimeout(function(){ window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': 
      case 'Processing': return { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', icon: <Clock size={14} /> };
      case 'Shipped': return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', icon: <Truck size={14} /> };
      case 'Delivered': return { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', icon: <CheckCircle size={14} /> };
      case 'Cancelled': return { bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171', icon: <XCircle size={14} /> };
      case 'Returned':
      case 'Refunded': return { bg: 'rgba(187, 134, 252, 0.15)', text: '#bb86fc', icon: <RotateCcw size={14} /> };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', text: '#a0a0a5', icon: <Package size={14} /> };
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return orders;
    if (activeFilter === 'Pending') return orders.filter(o => o.status === 'Processing' || o.status === 'Pending');
    if (activeFilter === 'Returns') return orders.filter(o => o.status === 'Returned' || o.status === 'Refunded');
    return orders.filter(o => o.status === activeFilter);
  }, [orders, activeFilter]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#bb86fc' }}>
        <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
        <h2 style={{ color: '#fff' }}>Syncing Order Data...</h2>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* HEADER & FILTERS */}
      <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>Order Management</h1>
          <p style={{ color: '#a0a0a5', margin: '8px 0 0 0' }}>Process shipments, track deliveries, and manage returns.</p>
        </div>
        
        <div style={{ display: 'flex', backgroundColor: '#1a1a24', borderRadius: '8px', padding: '4px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto', maxWidth: '100%' }}>
          {['All', 'Pending', 'Shipped', 'Delivered', 'Returns', 'Cancelled'].map(filter => (
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

      {/* ORDERS TABLE */}
      <div style={{ backgroundColor: '#16161e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a1a24', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Order Details</th>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Customer & Payment</th>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Logistics Status</th>
              <th style={{ padding: '16px', color: '#a0a0a5', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#a0a0a5' }}>
                  No orders found for this filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                
                return (
                  <tr key={order.id} className="order-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    
                    {/* 1. ORDER DETAILS & TOTAL */}
                    <td className="td-cell" style={{ padding: '20px 16px' }}>
                      <span className="mobile-label">Order: </span>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#a0a0a5', marginTop: '4px', marginBottom: '10px' }}>
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '13px', color: '#a0a0a5' }}>
                          {order.items?.length || 0} items • <strong style={{ color: '#fff' }}>₹{order.orderSummary?.total}</strong>
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '6px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.items?.map(i => i.name).join(', ')}
                        </div>
                      </div>
                    </td>

                    {/* 2. CUSTOMER & PAYMENT */}
                    <td className="td-cell" style={{ padding: '20px 16px' }}>
                      <span className="mobile-label">Customer: </span>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{order.customerDetails?.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#a0a0a5', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <MapPin size={12}/> {order.customerDetails?.city}, {order.customerDetails?.state}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '10px', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '11px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <CreditCard size={12} color="#bb86fc" /> {order.paymentMethod || 'COD'}
                        </div>
                      </div>
                    </td>

                    {/* 3. LOGISTICS STATUS */}
                    <td className="td-cell" style={{ padding: '20px 16px' }}>
                      <span className="mobile-label">Status: </span>
                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                          {statusStyle.icon}
                          <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Returned">Returned (Approve)</option>
                            <option value="Refunded">Refund Processed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        
                        {(order.status === 'Shipped' || order.status === 'Delivered') && (
                          <div style={{ marginTop: '12px', display: 'flex', gap: '5px', maxWidth: '220px' }}>
                            <input 
                              type="text" 
                              placeholder="Tracking Link"
                              defaultValue={order.trackingNumber || ''}
                              onChange={(e) => setTrackingInputs(prev => ({...prev, [order.id]: e.target.value}))}
                              style={{ width: '100%', padding: '6px 10px', fontSize: '11px', backgroundColor: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', outline: 'none' }}
                            />
                            <button 
                              onClick={() => handleSaveTracking(order.id)}
                              style={{ padding: '6px', backgroundColor: 'rgba(187,134,252,0.1)', color: '#bb86fc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              <Save size={14} />
                            </button>
                          </div>
                        )}
                        {order.trackingNumber && order.status !== 'Shipped' && order.status !== 'Delivered' && (
                          <div style={{ fontSize: '11px', color: '#a0a0a5', marginTop: '6px' }}>Tracking: {order.trackingNumber}</div>
                        )}
                      </div>
                    </td>

                    {/* 4. ACTIONS */}
                    <td className="td-actions" style={{ padding: '20px 16px', textAlign: 'right', verticalAlign: 'top' }}>
                      <button 
                        onClick={() => generateInvoice(order)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: '0.2s' }}
                      >
                        <FileText size={14} /> PDF Invoice
                      </button>
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
        .mobile-label { display: none; font-weight: bold; color: #a0a0a5; margin-right: 10px; width: 80px; flex-shrink: 0; }

        @media (max-width: 768px) {
          .orders-table, .orders-table tbody, .orders-table tr, .orders-table td { display: block; width: 100%; box-sizing: border-box; }
          .orders-table thead { display: none; }
          .order-row { padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05) !important; border-radius: 12px; position: relative; background: #1a1a24; }
          
          /* Align data cells for mobile cards */
          .orders-table td.td-cell { 
            padding: 10px 0 !important; 
            border-bottom: 1px dashed rgba(255,255,255,0.05) !important; 
            text-align: left !important;
            display: flex;
            align-items: flex-start;
          }
          
          /* Invoice Button Full Width */
          .orders-table td.td-actions { padding: 15px 0 0 0 !important; border-bottom: none !important; text-align: left !important; }
          .orders-table td.td-actions button { width: 100%; justify-content: center; }
          
          .mobile-label { display: block; }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;