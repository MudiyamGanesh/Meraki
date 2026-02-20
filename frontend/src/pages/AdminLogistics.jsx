import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Truck, Warehouse, TrendingUp, Users, ArrowDownRight, ArrowUpRight, Plus, Trash2, MapPin, Phone } from 'lucide-react';

const AdminLogistics = () => {
  const [activeTab, setActiveTab] = useState('movements'); // 'movements', 'suppliers', 'shipping'
  const [loading, setLoading] = useState(true);

  // --- STATES ---
  const [movements, setMovements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Forms
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', phone: '', leadTime: '', categories: '' });

  // --- 1. REAL-TIME DATA FETCH ---
  useEffect(() => {
    // Fetch Stock Movements (History of items coming in and going out)
    const unsubscribeMovements = onSnapshot(collection(db, "stock_movements"), (snapshot) => {
      let moves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      moves.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMovements(moves);
    });

    // Fetch Suppliers
    const unsubscribeSuppliers = onSnapshot(collection(db, "suppliers"), (snapshot) => {
      setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => { unsubscribeMovements(); unsubscribeSuppliers(); };
  }, []);

  // --- 2. SUPPLIER LOGIC ---
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "suppliers"), {
        ...newSupplier,
        createdAt: new Date().toISOString()
      });
      setNewSupplier({ name: '', contact: '', phone: '', leadTime: '', categories: '' });
      alert("Supplier added!");
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm("Remove this supplier?")) {
      await deleteDoc(doc(db, "suppliers", id));
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#a0a0a5' }}>Loading Logistics Engine...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* HEADER */}
      <div className="admin-header-container" style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>Inventory & Logistics</h1>
        <p style={{ color: '#a0a0a5', margin: '8px 0 0 0' }}>Track stock movement, manage suppliers, and configure shipping.</p>
      </div>

      {/* TABS (Added swipeable classes) */}
      <div className="tabs-container" style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveTab('movements')} style={tabStyle(activeTab === 'movements')}><TrendingUp size={18}/> Stock Movements</button>
        <button onClick={() => setActiveTab('suppliers')} style={tabStyle(activeTab === 'suppliers')}><Users size={18}/> Suppliers</button>
        <button onClick={() => setActiveTab('shipping')} style={tabStyle(activeTab === 'shipping')}><Truck size={18}/> Shipping Partners</button>
        <button onClick={() => setActiveTab('warehouse')} style={tabStyle(activeTab === 'warehouse')}><Warehouse size={18}/> Warehouse Map</button>
      </div>

      {/* --- TAB 1: STOCK MOVEMENTS (Audit Trail) --- */}
      {activeTab === 'movements' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Stock Movement Log</h3>
            <span style={{ fontSize: '12px', color: '#a0a0a5' }}>Records of all manual restocks, order deductions, and returns.</span>
          </div>
          
          <table className="movements-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a24', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px' }}>Date</th>
                <th style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px' }}>Product SKU</th>
                <th style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px' }}>Type</th>
                <th style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px', textAlign: 'right' }}>Qty Change</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No movements recorded yet.</td></tr>
              ) : (
                movements.map(move => (
                  <tr key={move.id} className="movement-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="td-cell" style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px' }}>
                      <span className="mobile-label">Date: </span>
                      {new Date(move.date).toLocaleString()}
                    </td>
                    <td className="td-cell" style={{ padding: '12px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                      <span className="mobile-label">SKU: </span>
                      {move.sku}
                    </td>
                    <td className="td-cell" style={{ padding: '12px' }}>
                      <span className="mobile-label">Type: </span>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                        backgroundColor: move.type === 'Restock' ? 'rgba(74, 222, 128, 0.1)' : move.type === 'Return' ? 'rgba(187, 134, 252, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                        color: move.type === 'Restock' ? '#4ade80' : move.type === 'Return' ? '#bb86fc' : '#f87171' 
                      }}>
                        {move.type} {move.orderId ? `(#${move.orderId})` : ''}
                      </span>
                    </td>
                    <td className="td-cell td-qty" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px', color: move.qty > 0 ? '#4ade80' : '#f87171' }}>
                      <span className="mobile-label" style={{marginRight: 'auto'}}>Change: </span>
                      {move.qty > 0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                      {Math.abs(move.qty)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB 2: SUPPLIERS --- */}
      {activeTab === 'suppliers' && (
        <div className="suppliers-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* Add Supplier Form */}
          <div style={cardStyle}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Add Supplier</h3>
            <form onSubmit={handleAddSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Company Name" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} required style={inputStyle} />
              <input type="text" placeholder="Contact Person" value={newSupplier.contact} onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})} required style={inputStyle} />
              <input type="tel" placeholder="Phone / Email" value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} required style={inputStyle} />
              <input type="text" placeholder="Categories Provided (e.g. T-Shirts, Denim)" value={newSupplier.categories} onChange={e => setNewSupplier({...newSupplier, categories: e.target.value})} required style={inputStyle} />
              <input type="text" placeholder="Avg Lead Time (e.g. 14 Days)" value={newSupplier.leadTime} onChange={e => setNewSupplier({...newSupplier, leadTime: e.target.value})} style={inputStyle} />
              <button type="submit" style={btnStyle}><Plus size={18}/> Add Vendor</button>
            </form>
          </div>

          {/* Supplier Directory */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', alignContent: 'start' }}>
            {suppliers.length === 0 ? <div style={{ color: '#666' }}>No suppliers added.</div> : suppliers.map(sup => (
              <div key={sup.id} style={{ ...cardStyle, padding: '20px', position: 'relative' }}>
                <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '16px' }}>{sup.name}</h4>
                <div style={{ color: '#bb86fc', fontSize: '12px', marginBottom: '15px', fontWeight: 'bold' }}>{sup.categories}</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0a5', fontSize: '13px', marginBottom: '8px' }}>
                  <Users size={14}/> {sup.contact}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0a5', fontSize: '13px', marginBottom: '8px' }}>
                  <Phone size={14}/> {sup.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0a5', fontSize: '13px' }}>
                  <Truck size={14}/> Lead Time: {sup.leadTime}
                </div>

                <button onClick={() => handleDeleteSupplier(sup.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: SHIPPING PARTNERS --- */}
      {activeTab === 'shipping' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {['Delhivery', 'BlueDart', 'Ecom Express'].map(partner => (
            <div key={partner} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} color="#fff" />
                </div>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>{partner}</h4>
                  <span style={{ fontSize: '11px', color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>API Configured</span>
                </div>
              </div>
              <button style={{ padding: '8px 12px', backgroundColor: 'transparent', border: '1px solid #bb86fc', color: '#bb86fc', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Edit Keys</button>
            </div>
          ))}
        </div>
      )}

      {/* --- TAB 4: WAREHOUSE MAP --- */}
      {activeTab === 'warehouse' && (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
          <MapPin size={40} color="#38bdf8" style={{ marginBottom: '15px', margin: '0 auto 15px auto' }} />
          <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>Warehouse Zone Mapping</h3>
          <p style={{ color: '#a0a0a5', maxWidth: '400px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
            Assign specific Rack and Bin numbers to your SKUs to optimize picking and packing times for your fulfillment team.
          </p>
          <button style={{ ...btnStyle, margin: '0 auto' }}>Configure Zones (Coming Soon)</button>
        </div>
      )}

      {/* STYLES & MOBILE OVERRIDES */}
      <style>{`
        .mobile-label { display: none; font-weight: bold; color: #a0a0a5; margin-right: 5px; }

        /* Hide scrollbar for swipable tabs but keep functionality */
        .tabs-container::-webkit-scrollbar { display: none; }
        .tabs-container { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 768px) {
          .admin-header-container { flex-direction: column; align-items: flex-start !important; }
          
          /* Suppliers Form and Directory Stack */
          .suppliers-grid { grid-template-columns: 1fr !important; }

          /* Stock Movements Table to Cards */
          .movements-table, .movements-table tbody, .movements-table tr, .movements-table td { display: block; width: 100%; box-sizing: border-box; }
          .movements-table thead { display: none; }
          .movement-row { padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05) !important; border-radius: 12px; background: #1a1a24; }
          
          .movements-table td.td-cell { 
            padding: 10px 0 !important; 
            border-bottom: 1px dashed rgba(255,255,255,0.05) !important; 
            text-align: left !important;
            display: flex;
            align-items: center;
          }
          
          /* Remove border on the last item in the card */
          .movements-table td.td-qty { border-bottom: none !important; }
          
          .mobile-label { display: inline-block; width: 65px; flex-shrink: 0; }
        }
      `}</style>
    </div>
  );
};

// --- STYLES OBJECTS ---
const tabStyle = (isActive) => ({
  display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
  backgroundColor: isActive ? '#bb86fc' : 'transparent',
  color: isActive ? '#000' : '#a0a0a5',
  border: 'none', padding: '10px 20px', borderRadius: '20px',
  cursor: 'pointer', fontWeight: 'bold', transition: '0.2s'
});

const cardStyle = { backgroundColor: '#16161e', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px', backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', outline: 'none' };
const btnStyle = { padding: '12px', backgroundColor: '#bb86fc', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' };

export default AdminLogistics;