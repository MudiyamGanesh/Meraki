import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, ShoppingCart, Heart, User, X, ChevronRight, Sun, Moon, Lock, LogOut, UserPlus, LogIn, Settings, Bell, Globe } from 'lucide-react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';
import '../css/Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  
  // Theme State (Used in Settings Modal)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  // Helper to check active path for styling
  const isActive = (path) => location.pathname === path;

  // --- THEME EFFECT ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // --- OUTSIDE CLICK ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMobileLogout = () => {
    if (window.confirm("Sign out?")) {
      logout();
      setMobileMenuOpen(false);
      navigate('/'); 
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      alert(`Searching for: ${e.target.value}`);
      setShowMobileSearch(false);
    }
  };

  const openSettings = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setShowSettingsModal(true);
  };

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="nav-container">
           {/* LEFT SECTION */}
           <div className="nav-left">
             <button className="icon-btn mobile-only" onClick={() => setMobileMenuOpen(true)}>
               <Menu size={28} />
             </button>
             
             {/* DESKTOP LINKS */}
             <ul className="desktop-links desktop-only">
                <li className={isActive('/men') ? 'active-nav-item' : ''}>
                    <Link to="/men">MEN</Link>
                </li>
                <li className={isActive('/women') ? 'active-nav-item' : ''}>
                    <Link to="/women">WOMEN</Link>
                </li>
                <li className={`sneaker-nav-item ${isActive('/sneakers') ? 'active-nav-item' : ''}`}>
                    <Link to="/sneakers">SNEAKERS<span className="nav-badge"><Lock size={8} /> DROP</span></Link>
                </li>
                <li className={`highlight-link ${isActive('/design') ? 'active-nav-item' : ''}`}>
                    <Link to="/design">Design Studio</Link>
                </li>
             </ul>
           </div>
           
           {/* CENTER SECTION */}
           <div className="nav-center">
             <Link to="/" className="brand-logo">रीति</Link>
           </div>

           {/* RIGHT SECTION */}
           <div className="nav-right">
             <div className="desktop-search desktop-only">
               <input type="text" placeholder="Search..." />
               <button className="search-btn"><Search size={18}/></button>
             </div>
             
             <button className="icon-btn mobile-only" onClick={() => setShowMobileSearch(!showMobileSearch)}>
               {showMobileSearch ? <X size={26} /> : <Search size={26} />}
             </button>

             <div className="nav-icons">
               {/* --- THEME TOGGLE REMOVED FROM HERE --- */}

               {/* USER DROPDOWN */}
               <div className="user-dropdown-container">
                 <button className={`icon-btn desktop-only ${userMenuOpen ? 'active' : ''}`} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                   <User size={26} fill={user ? "currentColor" : "none"} />
                 </button>
                 {userMenuOpen && (
                   <div className="nav-dropdown-menu">
                     {user ? (
                       <>
                         <div className="dropdown-header">Hello, {user.name}</div>
                         <Link to="/account" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                         <button className="dropdown-item" onClick={openSettings}><Settings size={14} /> Settings</button>
                         <button className="dropdown-item logout" onClick={() => { logout(); setUserMenuOpen(false); }}>Sign Out <LogOut size={14} /></button>
                       </>
                     ) : (
                       <>
                         <Link to="/login" state={{ isRegistering: false }} className="dropdown-item" onClick={() => setUserMenuOpen(false)}><LogIn size={16} /> Sign In</Link>
                         <Link to="/login" state={{ isRegistering: true }} className="dropdown-item" onClick={() => setUserMenuOpen(false)}><UserPlus size={16} /> Create Account</Link>
                         <button className="dropdown-item" onClick={openSettings}><Settings size={16} /> Settings</button>
                       </>
                     )}
                   </div>
                 )}
               </div>

               <Link to="/wishlist" className="icon-btn">
                 <Heart size={26} fill={wishlist.length > 0 ? "#d32f2f" : "none"} color={wishlist.length > 0 ? "#d32f2f" : "currentColor"}/>
                 {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
               </Link>
               <Link to="/cart" className="icon-btn cart-btn">
                 <ShoppingCart size={26} />
               </Link>
             </div>
           </div>
         </div>
         
         {/* MOBILE SEARCH */}
         <div className={`mobile-search-container ${showMobileSearch ? 'active' : ''}`}>
            <div className="mobile-search-wrapper">
               <Search size={20} className="search-icon-marker" />
               <input type="text" placeholder="Search products..." autoFocus={showMobileSearch} onKeyDown={handleSearchSubmit} />
               <button className="mobile-search-close" onClick={() => setShowMobileSearch(false)}><X size={20} /></button>
            </div>
         </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
           <span className="drawer-title">MENU</span>
           <button className='drawer-close-btn' onClick={() => setMobileMenuOpen(false)}><X size={28}/></button>
        </div>

        <div className="drawer-content">
          {user ? (
            <div className="mobile-user-card">
              <div className="user-greeting">
                 <User size={24} className="greeting-icon" />
                 <div className="greeting-text"><small>Welcome back,</small><strong>{user.name}</strong></div>
              </div>
              <div className="mobile-auth-grid">
                <Link to="/account" className="mobile-auth-btn account-btn" onClick={() => setMobileMenuOpen(false)}><User size={16} /> Account</Link>
                <button onClick={handleMobileLogout} className="mobile-auth-btn logout-btn"><LogOut size={16} /> Sign Out</button>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-grid">
               <Link to="/login" state={{ isRegistering: false }} className="mobile-auth-btn login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
               <Link to="/login" state={{ isRegistering: true }} className="mobile-auth-btn register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
          
          <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)', opacity: 0.5 }} />

          <Link to="/" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Home <ChevronRight size={16} /></Link>
          
          <div className="mobile-nav-group">
            <Link to="/men" className="nav-card-btn" onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-card-text">MEN</span><ChevronRight size={18} className="nav-arrow" />
            </Link>
            <Link to="/women" className="nav-card-btn" onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-card-text">WOMEN</span><ChevronRight size={18} className="nav-arrow" />
            </Link>
            <Link to="/sneakers" className="nav-card-btn special" onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-card-text">SNEAKERS <span className="nav-tag">DROP <Lock size={8} /></span></span><ChevronRight size={18} className="nav-arrow" />
            </Link>
          </div>
          
          <Link to="/design" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Design Studio <ChevronRight size={16} /></Link>
          <Link to="/wishlist" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>My Wishlist ({wishlist.length}) <ChevronRight size={16} /></Link>
          
          <button className="drawer-link" onClick={openSettings}>
             <div style={{display:'flex', alignItems:'center', gap:'10px'}}>Settings</div>
             <Settings size={16} />
          </button>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="settings-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="settings-close-btn" onClick={() => setShowSettingsModal(false)}><X size={24}/></button>
            </div>
            
            <div className="settings-body">
              {/* Appearance */}
              <div className="setting-section">
                <h3>Appearance</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>App Theme</span>
                  </div>
                  <button className="theme-toggle-switch" onClick={toggleTheme}>
                    <span className="current-theme-name">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                    <div className={`toggle-track ${theme === 'dark' ? 'active' : ''}`}>
                      <div className="toggle-thumb"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* General */}
              <div className="setting-section">
                <h3>General</h3>
                <div className="setting-item"><div className="setting-info"><Bell size={20} /><span>Notifications</span></div><div className="toggle-track active"><div className="toggle-thumb"></div></div></div>
                <div className="setting-item"><div className="setting-info"><Globe size={20} /><span>Language</span></div><span className="setting-value">English (US)</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;