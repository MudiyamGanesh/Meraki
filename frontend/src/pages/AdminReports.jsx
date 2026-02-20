import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 
import { FileSpreadsheet, Download, IndianRupee, TrendingUp, Percent, RotateCcw, Calendar } from 'lucide-react';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('sales'); // 'sales', 'tax', 'profit', 'refunds'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. REAL-TIME FETCH ---
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      let ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort newest first
      ordersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. FINANCIAL CALCULATIONS ---
  const financials = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let dailySales = 0;
    let monthlySales = 0;
    let totalRevenue = 0;
    let totalRefunds = 0;
    let refundCount = 0;

    // GST Calculation (Assuming 18% inclusive GST for apparel)
    let totalTax = 0; 

    // Profit Margin (Simulating 40% Cost of Goods Sold -> 60% Gross Margin)
    let estimatedProfit = 0;

    // Arrays for our specific reports
    const completedOrders = [];
    const refundedOrders = [];

    orders.forEach(order => {
      if (!order.createdAt) return;
      const orderTime = new Date(order.createdAt).getTime();
      const orderTotal = order.orderSummary?.total || 0;

      if (order.status === 'Returned' || order.status === 'Refunded' || order.status === 'Cancelled') {
        totalRefunds += orderTotal;
        refundCount++;
        refundedOrders.push(order);
      } else {
        // Valid Sales
        totalRevenue += orderTotal;
        completedOrders.push(order);
        
        // Tax & Profit on valid sales
        const taxAmount = orderTotal - (orderTotal / 1.18);
        totalTax += taxAmount;
        estimatedProfit += (orderTotal - taxAmount) * 0.60; // 60% margin after tax

        // Timeframes
        if (orderTime >= startOfMonth) monthlySales += orderTotal;
        if (orderTime >= startOfToday) dailySales += orderTotal;
      }
    });

    return {
      dailySales, monthlySales, totalRevenue, 
      totalTax, estimatedProfit, 
      totalRefunds, refundCount,
      completedOrders, refundedOrders
    };
  }, [orders]);

  // --- 3. EXPORT TO CSV ENGINE ---
  const downloadReport = () => {
    let headers = [];
    let rows = [];
    let filename = "";

    if (activeTab === 'sales' || activeTab === 'profit') {
      headers = ["Order ID", "Date", "Customer", "Items", "Gross Total (INR)", "Estimated Profit (INR)"];
      filename = "Riti_Sales_Report.csv";
      rows = financials.completedOrders.map(o => {
        const estProfit = ((o.orderSummary?.total || 0) / 1.18) * 0.60;
        return [
          o.id, new Date(o.createdAt).toLocaleDateString(), 
          o.customerDetails?.fullName || 'Guest', 
          o.items?.length || 0, o.orderSummary?.total || 0, estProfit.toFixed(2)
        ];
      });
    } else if (activeTab === 'tax') {
      headers = ["Order ID", "Date", "Gross Total (INR)", "Taxable Value (INR)", "GST @ 18% (INR)"];
      filename = "Riti_GST_Tax_Report.csv";
      rows = financials.completedOrders.map(o => {
        const gross = o.orderSummary?.total || 0;
        const taxable = gross / 1.18;
        const tax = gross - taxable;
        return [
          o.id, new Date(o.createdAt).toLocaleDateString(), 
          gross, taxable.toFixed(2), tax.toFixed(2)
        ];
      });
    } else if (activeTab === 'refunds') {
      headers = ["Order ID", "Date", "Customer", "Status", "Lost Revenue (INR)"];
      filename = "Riti_Refunds_Report.csv";
      rows = financials.refundedOrders.map(o => [
        o.id, new Date(o.createdAt).toLocaleDateString(), 
        o.customerDetails?.fullName || 'Guest', o.status, o.orderSummary?.total || 0
      ]);
    }

    // Generate CSV String
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(row => row.map(item => `"${item}"`).join(",")).join("\n"); 

    // Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#a0a0a5' }}>Crunching Numbers...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* HEADER */}
      <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>Reports & Finance</h1>
          <p style={{ color: '#a0a0a5', margin: '8px 0 0 0' }}>Monitor margins, download tax reports, and track refunds.</p>
        </div>
        
        <button 
          onClick={downloadReport}
          className="export-btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#bb86fc', color: '#000', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <Download size={18} /> Export {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} CSV
        </button>
      </div>

      {/* 4-CARD FINANCIAL SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a0a0a5', fontWeight: 'bold', marginBottom: '10px' }}>
            <Calendar size={18} color="#bb86fc"/> Monthly Revenue
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>₹{financials.monthlySales.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#4ade80', marginTop: '5px' }}>₹{financials.dailySales.toLocaleString('en-IN')} Today</div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a0a0a5', fontWeight: 'bold', marginBottom: '10px' }}>
            <Percent size={18} color="#38bdf8"/> Est. Net Profit
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>₹{Math.round(financials.estimatedProfit).toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Assuming 40% COGS</div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a0a0a5', fontWeight: 'bold', marginBottom: '10px' }}>
            <FileSpreadsheet size={18} color="#fbbf24"/> GST Collected (18%)
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>₹{Math.round(financials.totalTax).toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Included in Gross Sales</div>
        </div>

        <div style={{...cardStyle, border: '1px solid rgba(248, 113, 113, 0.3)'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171', fontWeight: 'bold', marginBottom: '10px' }}>
            <RotateCcw size={18} /> Refunds & Cancellations
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>₹{financials.totalRefunds.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#f87171', marginTop: '5px' }}>Across {financials.refundCount} orders</div>
        </div>
      </div>

      {/* TABS (Added swipeable classes) */}
      <div className="tabs-container" style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveTab('sales')} style={tabStyle(activeTab === 'sales')}>Sales Ledger</button>
        <button onClick={() => setActiveTab('tax')} style={tabStyle(activeTab === 'tax')}>GST Report</button>
        <button onClick={() => setActiveTab('profit')} style={tabStyle(activeTab === 'profit')}>Profit Margins</button>
        <button onClick={() => setActiveTab('refunds')} style={tabStyle(activeTab === 'refunds')}>Refund History</button>
      </div>

      {/* DATA TABLE */}
      <div style={{ backgroundColor: '#16161e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <table className="reports-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a1a24', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px' }}>Order ID & Date</th>
              <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px' }}>Customer</th>
              {activeTab === 'tax' ? (
                <>
                  <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px' }}>Taxable Value</th>
                  <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px' }}>GST (18%)</th>
                </>
              ) : activeTab === 'profit' ? (
                <>
                  <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px' }}>Est. COGS (40%)</th>
                  <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px' }}>Net Profit</th>
                </>
              ) : activeTab === 'refunds' ? (
                <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px' }}>Status</th>
              ) : (
                <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px' }}>Items</th>
              )}
              <th style={{ padding: '16px', color: '#a0a0a5', fontSize: '13px', textAlign: 'right' }}>Total (INR)</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'refunds' ? financials.refundedOrders : financials.completedOrders).length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No data available for this report.</td></tr>
            ) : (
              (activeTab === 'refunds' ? financials.refundedOrders : financials.completedOrders).map(order => {
                const total = order.orderSummary?.total || 0;
                const taxable = total / 1.18;
                const tax = total - taxable;
                const cogs = taxable * 0.40;
                const profit = taxable - cogs;

                return (
                  <tr key={order.id} className="report-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <span className="mobile-label">Order: </span>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>#{order.id.slice(0,8).toUpperCase()}</div>
                        <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#a0a0a5', fontSize: '14px' }}>
                      <span className="mobile-label">Customer: </span>
                      {order.customerDetails?.fullName || 'Guest'}
                    </td>
                    
                    {activeTab === 'tax' ? (
                      <>
                        <td style={{ padding: '16px', color: '#a0a0a5', fontSize: '14px' }}>
                          <span className="mobile-label">Taxable: </span>
                          ₹{taxable.toFixed(2)}
                        </td>
                        <td style={{ padding: '16px', color: '#fbbf24', fontSize: '14px', fontWeight: 'bold' }}>
                          <span className="mobile-label">GST (18%): </span>
                          ₹{tax.toFixed(2)}
                        </td>
                      </>
                    ) : activeTab === 'profit' ? (
                      <>
                        <td style={{ padding: '16px', color: '#f87171', fontSize: '14px' }}>
                          <span className="mobile-label">Est. COGS: </span>
                          ₹{cogs.toFixed(2)}
                        </td>
                        <td style={{ padding: '16px', color: '#4ade80', fontSize: '14px', fontWeight: 'bold' }}>
                          <span className="mobile-label">Net Profit: </span>
                          ₹{profit.toFixed(2)}
                        </td>
                      </>
                    ) : activeTab === 'refunds' ? (
                      <td style={{ padding: '16px', color: '#f87171', fontSize: '14px', fontWeight: 'bold' }}>
                        <span className="mobile-label">Status: </span>
                        {order.status}
                      </td>
                    ) : (
                      <td style={{ padding: '16px', color: '#a0a0a5', fontSize: '14px' }}>
                        <span className="mobile-label">Items: </span>
                        {order.items?.length || 0}
                      </td>
                    )}
                    
                    <td style={{ padding: '16px', textAlign: 'right', color: activeTab === 'refunds' ? '#f87171' : '#fff', fontWeight: 'bold' }} className="td-total">
                      <span className="mobile-label" style={{marginRight: 'auto', textAlign: 'left'}}>Total: </span>
                      ₹{total.toLocaleString('en-IN')}
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
        .mobile-label { display: none; font-weight: bold; color: #a0a0a5; margin-right: 10px; width: 100px; flex-shrink: 0; }
        
        /* Hide scrollbar for swipable tabs */
        .tabs-container::-webkit-scrollbar { display: none; }
        .tabs-container { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 768px) {
          .admin-header-container { flex-direction: column; align-items: flex-start !important; }
          .export-btn { width: 100%; margin-top: 10px; }

          /* Table to Card conversion */
          .reports-table, .reports-table tbody, .reports-table tr, .reports-table td { display: block; width: 100%; box-sizing: border-box; }
          .reports-table thead { display: none; }
          .report-row { padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05) !important; border-radius: 12px; position: relative; background: #1a1a24; }
          
          .reports-table td { 
            padding: 8px 0 !important; 
            border-bottom: 1px dashed rgba(255,255,255,0.05) !important; 
            text-align: left !important;
            display: flex;
            align-items: center;
          }
          
          .reports-table td:last-child { border-bottom: none !important; }
          .td-total { justify-content: flex-end; }
          
          .mobile-label { display: inline-block; }
        }
      `}</style>
    </div>
  );
};

// --- STYLES OBJECTS ---
const tabStyle = (isActive) => ({
  backgroundColor: isActive ? 'rgba(187, 134, 252, 0.15)' : 'transparent',
  color: isActive ? '#bb86fc' : '#a0a0a5',
  border: isActive ? '1px solid rgba(187, 134, 252, 0.3)' : '1px solid transparent', 
  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', whiteSpace: 'nowrap'
});

const cardStyle = { backgroundColor: '#1a1a24', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' };

export default AdminReports;