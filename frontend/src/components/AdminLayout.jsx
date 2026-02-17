import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- NEW: Mobile Sidebar State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleExitAdmin = () => {
    navigate('/'); 
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  // Helper to close sidebar on mobile after clicking a link
  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f5f7', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* --- NEW: MOBILE TOP BAR --- */}
      <div className="mobile-admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
          >
            <Menu size={28} />
          </button>
          <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '2px' }}>
            RITI <span style={{ color: '#bb86fc' }}>ADMIN</span>
          </div>
        </div>
      </div>

      {/* --- NEW: MOBILE OVERLAY --- */}
      <div 
        className={`admin-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* --- SIDEBAR --- */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
          <div className="sidebar-brand" style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '3px', textAlign: 'center', width: '100%' }}>
            RITI <span style={{ color: '#bb86fc' }}>ADMIN</span>
          </div>
          {/* Mobile close button inside the drawer */}
          <button 
            className="mobile-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link 
                key={item.name}
                to={item.path} 
                onClick={handleLinkClick}
                className={`admin-nav-link ${active ? 'active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  padding: '14px 18px', borderRadius: '10px', 
                  textDecoration: 'none', transition: 'all 0.2s ease',
                  backgroundColor: active ? 'rgba(187, 134, 252, 0.15)' : 'transparent',
                  color: active ? '#bb86fc' : '#a0a0a5',
                  fontWeight: active ? '600' : '500'
                }}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: 'auto' }}>
          <button 
            onClick={handleExitAdmin} 
            className="admin-logout-btn"
            style={{ 
              backgroundColor: 'transparent', color: '#a0a0a5', border: 'none', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', 
              padding: '14px 18px', width: '100%', borderRadius: '10px',
              fontSize: '15px', fontWeight: '600', transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={20} /> Back to Store
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="admin-main-content" style={{ flexGrow: 1, overflowY: 'auto', backgroundColor: '#f4f5f7' }}>
        <Outlet />
      </main>

      {/* --- RESPONSIVE CSS --- */}
      <style>{`
        /* Desktop Default */
        .admin-sidebar {
          width: 260px;
          background-color: #111118;
          color: #fff;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 15px rgba(0,0,0,0.05);
          z-index: 50;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        .mobile-admin-header {
          display: none;
        }
        .admin-overlay {
          display: none;
        }
        .mobile-close-btn {
          display: none !important;
        }
        .admin-main-content {
          padding: 40px;
        }

        /* Hover Effects */
        .admin-nav-link:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #fff !important;
        }
        .admin-nav-link.active:hover {
          background-color: rgba(187, 134, 252, 0.2) !important;
          color: #bb86fc !important;
        }
        .admin-logout-btn:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #fff !important;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .mobile-admin-header {
            display: flex;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 70px;
            background-color: #111118;
            color: white;
            align-items: center;
            padding: 0 20px;
            z-index: 40;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          
          .admin-sidebar {
            position: fixed;
            height: 100vh;
            left: 0;
            top: 0;
            transform: translateX(-100%);
          }
          
          .admin-sidebar.open {
            transform: translateX(0);
          }
          
          .admin-overlay.open {
            display: block;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(2px);
            z-index: 45;
          }
          
          .sidebar-brand {
            display: none !important; /* Hide the big logo to make room for the X button */
          }
          
          .mobile-close-btn {
            display: flex !important;
            margin-left: auto; /* Push X to the right */
          }
          
          .admin-main-content {
            padding: 20px;
            padding-top: 90px !important; /* Push content below the fixed header */
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;