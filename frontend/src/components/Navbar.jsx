import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, ShoppingCart, Heart, User, X, ChevronRight, Sun, Moon, Lock, LogOut, UserPlus, LogIn, Settings } from 'lucide-react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';
import '../css/Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  // Helper: Check if we are strictly on the Home Page
  const isHomePage = location.pathname === '/Meraki/' || location.pathname === '/Meraki';

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      if (setActiveTab) {
        setActiveTab(location.state.activeTab);
      }
    }
  }, [location, setActiveTab]);

  // --- 2. CLOSE MENUS ON OUTSIDE CLICK ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 3. THEME TOGGLE ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // --- 4. NAVIGATION HANDLER ---
  const handleNavClick = (tab) => {
    if (isHomePage) {
      // If already on Home, just switch the tab content
      if (setActiveTab) setActiveTab(tab);
    } else {
      // If on Cart/Wishlist, go Home AND pass the tab to open
      navigate('/Meraki/', { state: { activeTab: tab } });
    }
    setMobileMenuOpen(false); // Close drawer
  };

  const handleMobileLogout = () => {
    if (window.confirm("Sign out?")) {
      logout();
      setMobileMenuOpen(false);
      navigate('/Meraki/'); 
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      alert(`Searching for: ${e.target.value}`);
      setShowMobileSearch(false);
    }
  };

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="nav-container">
           {/* --- LEFT SECTION --- */}
           <div className="nav-left">
             <button className="icon-btn mobile-only" onClick={() => setMobileMenuOpen(true)}>
               <Menu size={28} />
             </button>
             <button className="icon-btn theme-toggle mobile-only" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={26} /> : <Sun size={26} />}
             </button>
             
             {/* DESKTOP LINKS */}
             <ul className="desktop-links desktop-only">
                {/* Only show active underline if on Home Page */}
                <li className={isHomePage && activeTab === 'Men' ? 'active-nav-item' : ''}>
                    <button onClick={() => handleNavClick('Men')}>MEN</button>
                </li>
                <li className={isHomePage && activeTab === 'Women' ? 'active-nav-item' : ''}>
                    <button onClick={() => handleNavClick('Women')}>WOMEN</button>
                </li>
                <li className={`sneaker-nav-item ${isHomePage && activeTab === 'Sneakers' ? 'active-nav-item' : ''}`}>
                    <button onClick={() => handleNavClick('Sneakers')}>SNEAKERS<span className="nav-badge"><Lock size={8} /> DROP</span></button>
                </li>
                <li className={`highlight-link ${location.pathname.includes('/Meraki/design') ? 'active-nav-item' : ''}`}>
                    <Link to="/Meraki/design">Design Studio</Link>
                </li>
             </ul>
           </div>
           
           {/* --- CENTER SECTION --- */}
           <div className="nav-center">
             <Link to="/" className="brand-logo">रीति</Link>
           </div>

           {/* --- RIGHT SECTION --- */}
           <div className="nav-right">
             <div className="desktop-search desktop-only">
               <input type="text" placeholder="Search..." />
               <button className="search-btn"><Search size={18}/></button>
             </div>
             
             <button className="icon-btn mobile-only" onClick={() => setShowMobileSearch(!showMobileSearch)}>
               {showMobileSearch ? <X size={26} /> : <Search size={26} />}
             </button>

             <div className="nav-icons">
               <button className="icon-btn theme-toggle desktop-only" onClick={toggleTheme}>
                 {theme === 'light' ? <Moon size={26} /> : <Sun size={26} />}
               </button>

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
                         <Link to="/Meraki/account" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                         <button className="dropdown-item logout" onClick={() => { logout(); setUserMenuOpen(false); }}>Sign Out <LogOut size={14} /></button>
                       </>
                     ) : (
                       <>
                         <Link to="/Meraki/login" state={{ isRegistering: false }} className="dropdown-item" onClick={() => setUserMenuOpen(false)}><LogIn size={16} /> Sign In</Link>
                         <Link to="/Meraki/login" state={{ isRegistering: true }} className="dropdown-item" onClick={() => setUserMenuOpen(false)}><UserPlus size={16} /> Create Account</Link>
                       </>
                     )}
                   </div>
                 )}
               </div>

               <Link to="/Meraki/wishlist" className="icon-btn">
                 <Heart size={26} fill={wishlist.length > 0 ? "#d32f2f" : "none"} color={wishlist.length > 0 ? "#d32f2f" : "currentColor"}/>
                 {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
               </Link>
               <Link to="/Meraki/cart" className="icon-btn cart-btn">
                 <ShoppingCart size={26} />
               </Link>
             </div>
           </div>
         </div>
         
         {/* --- MOBILE SEARCH BAR --- */}
         <div className={`mobile-search-container ${showMobileSearch ? 'active' : ''}`}>
            <div className="mobile-search-wrapper">
               <Search size={20} className="search-icon-marker" />
               <input type="text" placeholder="Search products..." autoFocus={showMobileSearch} onKeyDown={handleSearchSubmit} />
               <button className="mobile-search-close" onClick={() => setShowMobileSearch(false)}><X size={20} /></button>
            </div>
         </div>
      </nav>

      {/* --- MOBILE DRAWER (SIDEBAR) --- */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
           <span className="drawer-title">MENU</span>
           <button className='drawer-close-btn' onClick={() => setMobileMenuOpen(false)}><X size={28}/></button>
        </div>

        <div className="drawer-content">
          {/* USER INFO CARD */}
          {user ? (
            <div className="mobile-user-card">
              <div className="user-greeting">
                 <User size={24} className="greeting-icon" />
                 <div className="greeting-text">
                    <small>Welcome back,</small><strong>{user.name}</strong>
                 </div>
              </div>
              <div className="mobile-auth-grid">
                <Link to="/Meraki/account" className="mobile-auth-btn account-btn" onClick={() => setMobileMenuOpen(false)}>
                   <Settings size={16} /> My Account
                </Link>
                <button onClick={handleMobileLogout} className="mobile-auth-btn logout-btn">
                   <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-grid">
               <Link to="/Meraki/login" state={{ isRegistering: false }} className="mobile-auth-btn login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
               <Link to="/Meraki/login" state={{ isRegistering: true }} className="mobile-auth-btn register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
          
          <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)', opacity: 0.5 }} />

          <Link to="/Meraki" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Home <ChevronRight size={16} /></Link>
          
          {/* PREMIUM CATEGORY CARDS (Only show if NOT on Home) */}
          {!isHomePage && (
            <div className="mobile-nav-group">
              <button className="nav-card-btn" onClick={() => handleNavClick('Men')}>
                <span className="nav-card-text">MEN</span>
                <ChevronRight size={18} className="nav-arrow" />
              </button>
              
              <button className="nav-card-btn" onClick={() => handleNavClick('Women')}>
                <span className="nav-card-text">WOMEN</span>
                <ChevronRight size={18} className="nav-arrow" />
              </button>
              
              <button className="nav-card-btn special" onClick={() => handleNavClick('Sneakers')}>
                <span className="nav-card-text">
                  SNEAKERS <span className="nav-tag">DROP <Lock size={8} /></span>
                </span>
                <ChevronRight size={18} className="nav-arrow" />
              </button>
            </div>
          )}
          
          <Link to="/Meraki/design" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Design Studio <ChevronRight size={16} /></Link>
          <Link to="/Meraki/wishlist" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>My Wishlist ({wishlist.length}) <ChevronRight size={16} /></Link>
        </div>
      </div>
    </>
  );
};
export default Navbar;