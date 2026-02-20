import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Ticket, Megaphone, Timer, Trash2, Plus, Save, Image as ImageIcon, UploadCloud } from 'lucide-react';

const AdminMarketing = () => {
  const [activeTab, setActiveTab] = useState('coupons'); // 'coupons', 'banners', 'flashsale'
  const [loading, setLoading] = useState(true);

  // --- STATES ---
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [flashSale, setFlashSale] = useState({ isActive: false, endTime: '', message: '' });

  // Forms
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'percent', expiry: '' });
  const [newBanner, setNewBanner] = useState({ image: '', title: '', link: '/men' });
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // --- CLOUDINARY CONFIG ---
  const CLOUD_NAME = "dyevbrysx"; 
  const UPLOAD_PRESET = "riti_store"; 

  // --- 1. FETCH ALL DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Coupons
        const couponsSnap = await getDocs(collection(db, "coupons"));
        setCoupons(couponsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Banners
        const bannersSnap = await getDocs(collection(db, "banners"));
        setBanners(bannersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Flash Sale Config (Real-time listener for this one)
        const unsubscribeFlash = onSnapshot(doc(db, "marketing", "flashSale"), (doc) => {
          if (doc.exists()) setFlashSale(doc.data());
        });

        setLoading(false);
        return () => unsubscribeFlash();
      } catch (error) {
        console.error("Error loading marketing data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. COUPON LOGIC ---
  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "coupons"), {
        ...newCoupon,
        createdAt: new Date().toISOString()
      });
      alert("Coupon Created!");
      // Refresh list manually or use real-time listener
      const snap = await getDocs(collection(db, "coupons"));
      setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setNewCoupon({ code: '', discount: '', type: 'percent', expiry: '' });
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      await deleteDoc(doc(db, "coupons", id));
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  // --- 3. BANNER LOGIC ---
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBanner(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const img = await res.json();
      setNewBanner(prev => ({ ...prev, image: img.secure_url }));
    } catch (err) {
      alert("Banner upload failed");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!newBanner.image) return alert("Please upload an image");
    await addDoc(collection(db, "banners"), newBanner);
    alert("Banner Added to Homepage!");
    // Refresh
    const snap = await getDocs(collection(db, "banners"));
    setBanners(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setNewBanner({ image: '', title: '', link: '/men' });
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("Remove this banner from homepage?")) {
      await deleteDoc(doc(db, "banners", id));
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  // --- 4. FLASH SALE LOGIC ---
  const handleSaveFlashSale = async () => {
    await setDoc(doc(db, "marketing", "flashSale"), flashSale);
    alert("Flash Sale Updated!");
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#a0a0a5' }}>Loading Marketing Tools...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* HEADER */}
      <div className="admin-header-container" style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>Marketing Control Panel</h1>
        <p style={{ color: '#a0a0a5', margin: '8px 0 0 0' }}>Drive sales with coupons, banners, and urgency timers.</p>
      </div>

      {/* TABS (Added swipeable classes for mobile) */}
      <div className="tabs-container" style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveTab('coupons')} style={tabStyle(activeTab === 'coupons')}><Ticket size={18}/> Coupons</button>
        <button onClick={() => setActiveTab('banners')} style={tabStyle(activeTab === 'banners')}><Megaphone size={18}/> Home Banners</button>
        <button onClick={() => setActiveTab('flashsale')} style={tabStyle(activeTab === 'flashsale')}><Timer size={18}/> Flash Sale</button>
      </div>

      {/* --- TAB 1: COUPONS --- */}
      {activeTab === 'coupons' && (
        <div className="marketing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* Create Coupon Form */}
          <div style={cardStyle}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Create New Coupon</h3>
            <form onSubmit={handleSaveCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" placeholder="Code (e.g. SUMMER50)" 
                value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                required style={inputStyle}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number" placeholder="Value" 
                  value={newCoupon.discount} onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})}
                  required style={{...inputStyle, flex: 1}}
                />
                <select 
                  value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                  style={{...inputStyle, flex: 1}}
                >
                  <option value="percent">% Off</option>
                  <option value="flat">₹ Off</option>
                </select>
              </div>
              <input 
                type="date" 
                value={newCoupon.expiry} onChange={e => setNewCoupon({...newCoupon, expiry: e.target.value})}
                required style={inputStyle}
              />
              <button type="submit" style={btnStyle}>Create Coupon</button>
            </form>
          </div>

          {/* Coupon List */}
          <div style={cardStyle}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Active Coupons</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {coupons.length === 0 ? <p style={{color:'#666'}}>No active coupons.</p> : coupons.map(c => (
                <div key={c.id} style={listItemStyle}>
                  <div>
                    <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '16px' }}>{c.code}</div>
                    <div style={{ color: '#a0a0a5', fontSize: '12px' }}>
                      {c.type === 'percent' ? `${c.discount}% OFF` : `₹${c.discount} OFF`} • Expires: {c.expiry}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCoupon(c.id)} style={iconBtnStyle}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: BANNERS --- */}
      {activeTab === 'banners' && (
        <div className="marketing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* Upload Banner Form */}
          <div style={cardStyle}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Upload Hero Banner</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ border: '1px dashed rgba(255,255,255,0.2)', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
                <input type="file" accept="image/*" onChange={handleBannerUpload} style={{ display: 'none' }} id="banner-upload" />
                <label htmlFor="banner-upload" style={{ cursor: 'pointer', color: '#bb86fc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  {uploadingBanner ? <div className="spinner"></div> : <UploadCloud size={30} />}
                  {uploadingBanner ? "Uploading..." : "Click to Upload Image"}
                </label>
              </div>
              
              {newBanner.image && (
                <img src={newBanner.image} alt="Preview" style={{ width: '100%', borderRadius: '8px', border: '1px solid #333' }} />
              )}

              <input 
                type="text" placeholder="Title / Alt Text" 
                value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                style={inputStyle}
              />
              <input 
                type="text" placeholder="Link (e.g. /women)" 
                value={newBanner.link} onChange={e => setNewBanner({...newBanner, link: e.target.value})}
                style={inputStyle}
              />
              <button onClick={handleSaveBanner} disabled={uploadingBanner} style={btnStyle}>Save to Homepage</button>
            </div>
          </div>

          {/* Banner List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {banners.map(b => (
              <div key={b.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={b.image} alt={b.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <div style={{ padding: '10px', backgroundColor: '#1a1a24' }}>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{b.title || 'Untitled'}</div>
                  <div style={{ color: '#a0a0a5', fontSize: '11px' }}>Link: {b.link}</div>
                </div>
                <button 
                  onClick={() => handleDeleteBanner(b.id)}
                  style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: FLASH SALE --- */}
      {activeTab === 'flashsale' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Global Flash Sale Timer</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <span style={{ color: flashSale.isActive ? '#4ade80' : '#666', fontWeight: 'bold', fontSize: '14px' }}>
                {flashSale.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
              <div 
                onClick={() => setFlashSale(prev => ({ ...prev, isActive: !prev.isActive }))}
                style={{ width: '50px', height: '26px', backgroundColor: flashSale.isActive ? '#4ade80' : '#333', borderRadius: '20px', position: 'relative', transition: '0.3s' }}
              >
                <div style={{ width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: flashSale.isActive ? '27px' : '3px', transition: '0.3s' }} />
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
            <div>
              <label style={{ color: '#a0a0a5', display: 'block', marginBottom: '8px' }}>Announcement Message</label>
              <input 
                type="text" 
                value={flashSale.message} 
                onChange={e => setFlashSale({...flashSale, message: e.target.value})}
                placeholder="e.g. FLASH SALE: 50% OFF EVERYTHING!" 
                style={inputStyle} 
              />
            </div>
            
            <div>
              <label style={{ color: '#a0a0a5', display: 'block', marginBottom: '8px' }}>End Date & Time</label>
              <input 
                type="datetime-local" 
                value={flashSale.endTime} 
                onChange={e => setFlashSale({...flashSale, endTime: e.target.value})}
                style={inputStyle} 
              />
            </div>

            <button onClick={handleSaveFlashSale} style={btnStyle}>Update Store Timer</button>
          </div>
        </div>
      )}

      {/* STYLES & MOBILE OVERRIDES */}
      <style>{`
        .spinner { border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top: 3px solid #fff; width: 20px; height: 20px; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Hide scrollbar for swipable tabs but keep functionality */
        .tabs-container::-webkit-scrollbar { display: none; }
        .tabs-container { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 768px) {
          .admin-header-container { flex-direction: column; align-items: flex-start !important; }
          
          /* Stack the forms and lists vertically */
          .marketing-grid { grid-template-columns: 1fr !important; }
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
const btnStyle = { padding: '12px', backgroundColor: '#bb86fc', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', width: '100%' };
const listItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#1a1a24', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' };
const iconBtnStyle = { background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '8px' };

export default AdminMarketing;