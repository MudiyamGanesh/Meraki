import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Settings, Palette, ShieldCheck, Truck, CreditCard, Save, RefreshCw, UserPlus, X, Check } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('theme'); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- CONFIGURATION STATE ---
  const [config, setConfig] = useState({
    storeMode: 'dark',
    accentColor: '#bb86fc',
    enableFreeShipping: true,
    flatShippingRate: 99,
    freeShippingThreshold: 1999,
    taxRate: 18,
    enableCOD: true,
    enableRazorpay: false,
    razorpayKey: '',
    googleAnalyticsId: ''
  });

  // --- STAFF STATE ---
  const [staff, setStaff] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'staff' });

  // --- 1. FETCH CONFIG & STAFF ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const configDoc = await getDoc(doc(db, "settings", "global"));
        if (configDoc.exists()) {
          const data = configDoc.data();
          setConfig(prev => ({ ...prev, ...data }));
          // Apply theme live on load
          applyThemeLive(data.storeMode, data.accentColor);
        }

        const usersSnap = await getDocs(collection(db, "users"));
        const staffMembers = [];
        usersSnap.forEach(d => {
          const user = { id: d.id, ...d.data() };
          if (user.role === 'admin' || user.role === 'staff' || user.email === 'ram@riti.com') {
            staffMembers.push(user);
          }
        });
        setStaff(staffMembers);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. LIVE THEME INJECTION ---
  // This physically changes the CSS variables of your app in real-time
  const applyThemeLive = (mode, color) => {
    document.documentElement.style.setProperty('--primary-color', color);
    if (mode === 'light') {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    } else {
      document.body.style.backgroundColor = '#0a0a0f';
      document.body.style.color = '#ffffff';
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      if (key === 'accentColor' || key === 'storeMode') {
        applyThemeLive(newConfig.storeMode, newConfig.accentColor);
      }
      return newConfig;
    });
  };

  // --- 3. SAVE GLOBAL CONFIG ---
  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "global"), config, { merge: true });
      alert("Settings saved to database successfully!");
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // --- 4. STAFF MANAGEMENT ---
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setStaff(prev => prev.map(s => s.id === userId ? { ...s, role: newRole } : s));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleInviteStaff = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would trigger a Firebase Function to send an invite email.
      // Here, we manually add them to the users collection as a placeholder.
      const docRef = await addDoc(collection(db, "users"), {
        ...newStaff,
        createdAt: new Date().toISOString(),
        isBlocked: false
      });
      setStaff([...staff, { id: docRef.id, ...newStaff }]);
      setShowInviteModal(false);
      setNewStaff({ name: '', email: '', role: 'staff' });
      alert("Staff member added successfully!");
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#a0a0a5' }}>Loading System Configuration...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* HEADER */}
      <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>Store Settings</h1>
          <p style={{ color: '#a0a0a5', margin: '8px 0 0 0' }}>Configure exactly how Riti operates globally.</p>
        </div>
        
        {activeTab !== 'roles' && (
          <button 
            onClick={handleSaveConfig} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: config.accentColor, color: '#000', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', transition: '0.2s' }}
          >
            {saving ? <RefreshCw size={18} className="spinner" /> : <Save size={18} />} 
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        )}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('theme')} style={tabStyle(activeTab === 'theme', config.accentColor)}><Palette size={18}/> Branding</button>
        <button onClick={() => setActiveTab('logistics')} style={tabStyle(activeTab === 'logistics', config.accentColor)}><Truck size={18}/> Shipping & Tax</button>
        <button onClick={() => setActiveTab('api')} style={tabStyle(activeTab === 'api', config.accentColor)}><CreditCard size={18}/> Payments & APIs</button>
        <button onClick={() => setActiveTab('roles')} style={tabStyle(activeTab === 'roles', config.accentColor)}><ShieldCheck size={18}/> Staff Roles</button>
      </div>

      {/* --- TAB 1: THEME CONTROLS --- */}
      {activeTab === 'theme' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '20px' }}>Storefront Appearance</h3>
          <p style={{ color: '#a0a0a5', fontSize: '13px', marginBottom: '20px' }}>Changes here instantly update the colors across your entire website.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
            <div>
              <label style={labelStyle}>Default Mode</label>
              <select value={config.storeMode} onChange={e => handleConfigChange('storeMode', e.target.value)} style={inputStyle}>
                <option value="dark">Dark Mode (Premium)</option>
                <option value="light">Light Mode (Classic)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Brand Accent Color</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="color" value={config.accentColor} 
                  onChange={e => handleConfigChange('accentColor', e.target.value)}
                  style={{ width: '50px', height: '45px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                />
                <input 
                  type="text" value={config.accentColor}
                  onChange={e => handleConfigChange('accentColor', e.target.value)}
                  style={{...inputStyle, flexGrow: 1}}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: SHIPPING & TAX --- */}
      {activeTab === 'logistics' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '20px' }}>Checkout Rules</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
            
            {/* Toggle Switch */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>Enable Free Shipping Threshold</div>
                <div style={{ color: '#888', fontSize: '12px' }}>Automatically waive shipping fees for large orders.</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={config.enableFreeShipping} onChange={e => handleConfigChange('enableFreeShipping', e.target.checked)} />
                <span className="slider" style={{ '--accent': config.accentColor }}></span>
              </label>
            </div>

            <div>
              <label style={labelStyle}>Standard Delivery Fee (₹)</label>
              <input type="number" value={config.flatShippingRate} onChange={e => handleConfigChange('flatShippingRate', Number(e.target.value))} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Free Shipping Threshold (₹)</label>
              <input type="number" value={config.freeShippingThreshold} onChange={e => handleConfigChange('freeShippingThreshold', Number(e.target.value))} disabled={!config.enableFreeShipping} style={{...inputStyle, opacity: config.enableFreeShipping ? 1 : 0.5}} />
            </div>

            <div>
              <label style={labelStyle}>Global GST Rate (%)</label>
              <input type="number" value={config.taxRate} onChange={e => handleConfigChange('taxRate', Number(e.target.value))} style={inputStyle} />
              <p style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>Applied inclusively to all products.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: PAYMENTS & APIs --- */}
      {activeTab === 'api' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '20px' }}>Integrations & Gateways</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Gateway Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: '#fff' }}>Cash on Delivery</strong>
                  <input type="checkbox" checked={config.enableCOD} onChange={e => handleConfigChange('enableCOD', e.target.checked)} />
                </div>
                <div style={{ color: '#888', fontSize: '12px' }}>Allow customers to pay upon receipt.</div>
              </div>
              
              <div style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: '#fff' }}>Razorpay (Prepaid)</strong>
                  <input type="checkbox" checked={config.enableRazorpay} onChange={e => handleConfigChange('enableRazorpay', e.target.checked)} />
                </div>
                <div style={{ color: '#888', fontSize: '12px' }}>Accept UPI, Cards, and Netbanking.</div>
              </div>
            </div>

            <div style={{ opacity: config.enableRazorpay ? 1 : 0.5, pointerEvents: config.enableRazorpay ? 'auto' : 'none' }}>
              <label style={labelStyle}>Razorpay Key ID (Live)</label>
              <input type="password" value={config.razorpayKey} onChange={e => handleConfigChange('razorpayKey', e.target.value)} style={inputStyle} placeholder="rzp_live_xxxxxxxxxxx" />
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '5px 0' }} />

            <div>
              <label style={labelStyle}>Google Analytics ID</label>
              <input type="text" value={config.googleAnalyticsId} onChange={e => handleConfigChange('googleAnalyticsId', e.target.value)} style={inputStyle} placeholder="G-XXXXXXXXXX" />
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: STAFF ROLES --- */}
      {activeTab === 'roles' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>System Access</h3>
            <button onClick={() => setShowInviteModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'transparent', color: config.accentColor, border: `1px solid ${config.accentColor}`, padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
              <UserPlus size={16}/> Invite Staff
            </button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a24', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px' }}>User</th>
                <th style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px' }}>Email</th>
                <th style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px', textAlign: 'right' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', color: '#fff', fontWeight: 'bold' }}>{user.name || 'Admin'}</td>
                  <td style={{ padding: '12px', color: '#a0a0a5', fontSize: '13px' }}>{user.email}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <select 
                      value={user.role || (user.email === 'ram@riti.com' ? 'admin' : 'staff')}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.email === 'ram@riti.com'} 
                      style={{ ...inputStyle, width: 'auto', padding: '6px 10px', fontSize: '12px', borderColor: user.email === 'ram@riti.com' ? 'transparent' : 'rgba(255,255,255,0.2)' }}
                    >
                      <option value="admin">Super Admin</option>
                      <option value="staff">Staff Member</option>
                      <option value="customer">Revoke Access</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- STAFF INVITE MODAL --- */}
      {showInviteModal && (
        <div style={modalOverlayStyle} onClick={() => setShowInviteModal(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#fff' }}>Add Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', color: '#a0a0a5', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleInviteStaff} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Full Name" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} style={inputStyle} />
              <input type="email" placeholder="Email Address" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} style={inputStyle} />
              <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} style={inputStyle}>
                <option value="staff">Staff (Cannot edit settings)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
              <button type="submit" style={{ padding: '12px', backgroundColor: config.accentColor, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Send Invite</button>
            </form>
          </div>
        </div>
      )}

      {/* CSS Configurations */}
      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Custom Toggle Switch */
        .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--accent); }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
};

// --- STYLES OBJECTS ---
const tabStyle = (isActive, accent) => ({
  display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
  backgroundColor: isActive ? `${accent}25` : 'transparent', // 25 is hex for ~15% opacity
  color: isActive ? accent : '#a0a0a5',
  border: 'none', padding: '10px 20px', borderRadius: '20px',
  cursor: 'pointer', fontWeight: 'bold', transition: '0.2s'
});

const cardStyle = { backgroundColor: '#16161e', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' };
const labelStyle = { display: 'block', color: '#a0a0a5', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px', backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', outline: 'none' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContentStyle = { backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' };

export default AdminSettings;