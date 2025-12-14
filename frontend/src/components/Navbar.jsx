import React, { useState, useEffect } from 'react';
// 1. ADD 'LogOut' to imports
import { Menu, Search, ShoppingCart, Heart, User, X, ChevronRight, Sun, Moon, Lock, LogOut } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirect after logout
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';
import '../css/Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  // ... (Keep all existing state and hooks) ...
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

  // ... (Keep existing useEffects and toggleTheme) ...
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const handleNavClick = (tab) => {
    if (setActiveTab) setActiveTab(tab);
  };

  // Helper to close menu and redirect
  const handleMobileLogout = () => {
    if (window.confirm("Sign out?")) {
      logout();
      setMobileMenuOpen(false);
      navigate('/Meraki'); 
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* ... (Keep existing Navbar Desktop/Tablet code exactly as is) ... */}
         <div className="nav-container">
           {/* ... nav-left, nav-center, nav-right ... */}
           <div className="nav-left">
            <button className="icon-btn mobile-only" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
            <button className="icon-btn theme-toggle mobile-only" onClick={toggleTheme}>
               {theme === 'light' ? <Moon size={26} /> : <Sun size={26} />}
            </button>
            {/* ... Desktop Links ... */}
            <ul className="desktop-links desktop-only">
               {/* ... (Keep your tabs) ... */}
               <li className={activeTab === 'Men' ? 'active-nav-item' : ''}><button onClick={() => handleNavClick('Men')}>MEN</button></li>
               <li className={activeTab === 'Women' ? 'active-nav-item' : ''}><button onClick={() => handleNavClick('Women')}>WOMEN</button></li>
               <li className={`sneaker-nav-item ${activeTab === 'Sneakers' ? 'active-nav-item' : ''}`}><button onClick={() => handleNavClick('Sneakers')}>SNEAKERS<span className="nav-badge"><Lock size={8} /> DROP</span></button></li>
               <li className="highlight-link"><a href="#sale">SALE</a></li>
            </ul>
           </div>
           
           <div className="nav-center">
             <Link to="/Meraki/" className="brand-logo">रीति</Link>
           </div>

           <div className="nav-right">
             <div className="desktop-search desktop-only">
               <input type="text" placeholder="Search..." />
               <button className="search-btn"><Search size={18}/></button>
             </div>
             <button className="icon-btn mobile-only" onClick={() => setShowMobileSearch(!showMobileSearch)}>
               <Search size={26} />
             </button>
             <div className="nav-icons">
               <button className="icon-btn theme-toggle desktop-only" onClick={toggleTheme}>
                 {theme === 'light' ? <Moon size={26} /> : <Sun size={26} />}
               </button>
               {user ? (
                <button className="icon-btn desktop-only" onClick={() => { if(window.confirm("Sign out?")) logout(); }} title={`Signed in as ${user.name}`}>
                  <User size={26} fill="currentColor" />
                </button>
               ) : (
                <Link to="/login" className="icon-btn desktop-only"><User size={26} /></Link>
               )}
               <Link to="/Meraki/wishlist" className="icon-btn">
                 <Heart size={26} fill={wishlist.length > 0 ? "#d32f2f" : "none"} color={wishlist.length > 0 ? "#d32f2f" : "currentColor"}/>
                 {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
               </Link>
               <button className="icon-btn cart-btn">
                 <ShoppingCart size={26} />
                 <span className="badge">3</span>
               </button>
             </div>
           </div>
         </div>
         
         <div className={`mobile-search-container ${showMobileSearch ? 'active' : ''}`}>
           <input type="text" placeholder="Search..." />
           <Search size={20} />
         </div>
      </nav>

      {/* --- UPDATED MOBILE DRAWER --- */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">MENU</span>
          <button className='drawer-close-btn' onClick={() => setMobileMenuOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <div className="drawer-content">
          
          {/* 1. DYNAMIC LOGIN/LOGOUT SECTION */}
          {user ? (
            <div className="user-profile-section">
              <div className="drawer-link user-link" style={{ cursor: 'default' }}>
                <User size={20} fill="currentColor" /> 
                <span>Hi, {user.name}</span>
              </div>
              <button onClick={handleMobileLogout} className="drawer-link logout-btn" style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}>
                 <LogOut size={20} /> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="drawer-link user-link" onClick={() => setMobileMenuOpen(false)}>
              <User size={20} /> Login / Register
            </Link>
          )}
          
          <hr style={{ margin: '10px 0', borderColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* 2. NAVIGATION LINKS */}
          <Link to="/Meraki/" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
            Home <ChevronRight size={16} />
          </Link>
          
          <Link to="/Meraki/wishlist" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
            My Wishlist ({wishlist.length}) <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="drawer-footer">
          <a href="#orders">Track Order</a>
          <a href="#contact">Contact Us</a>
        </div>
      </div>
    </>
  );
};

export default Navbar;