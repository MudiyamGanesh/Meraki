import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Search, ShoppingCart, Heart, User, X, ChevronRight, 
  Sun, Moon, Lock, LogOut, UserPlus, LogIn, Settings, 
  Bell, Globe, Mic 
} from 'lucide-react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';
import '../css/Navbar.css';

const Navbar = () => {
  // --- UI & DRAWER STATES ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  
  const [isScrolled, setIsScrolled] = useState(false);

  // --- SEARCH & VOICE STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Hooks & Context
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Mock Search Data
  const sampleProducts = [
    { id: 1, name: "Oversized Graphic Tee", category: "Men" },
    { id: 2, name: "Classic White Sneakers", category: "Sneakers" },
    { id: 3, name: "Premium Denim Jacket", category: "Women" },
    { id: 4, name: "High-top Streetwear", category: "Sneakers" },
    { id: 5, name: "Riti Signature Hoodie", category: "Unisex" },
  ];

  // --- THEME MANAGEMENT ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // --- SMART SCROLL LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      // Just check if the user has scrolled more than 20px to trigger the background change
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- DEBOUNCED SEARCH LOGIC ---
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      const filtered = sampleProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (showMobileSearch && mobileSearchInputRef.current) {
      // We use a tiny timeout to ensure the element is 
      // fully rendered and visible before focusing
      const timer = setTimeout(() => {
        mobileSearchInputRef.current.focus();
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [showMobileSearch]);



  // --- VOICE SEARCH ---
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        setSearchQuery(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (error) {
      setIsListening(false);
    }
  };

  // --- UTILITIES ---
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      alert(`Searching for: ${searchQuery}`);
      clearSearch();
      setShowMobileSearch(false);
    }
  };

  const handleMobileSearchClose = () => {
    setSearchQuery("");
    setSearchResults([]); 
    setShowMobileSearch(false);
  };

  const handleMobileLogout = () => {
    if (window.confirm("Sign out?")) {
      logout();
      setMobileMenuOpen(false);
      navigate('/'); 
    }
  };

  const openSettings = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setShowSettingsModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} ref={navRef}>
        <div className="nav-container">
           <div className="nav-left">
             <button className="icon-btn mobile-only" onClick={() => setMobileMenuOpen(true)}>
               <Menu size={28} />
             </button>
             <ul className="desktop-links desktop-only">
                <li className={isActive('/men') ? 'active-nav-item' : ''}><Link to="/men">MEN</Link></li>
                <li className={isActive('/women') ? 'active-nav-item' : ''}><Link to="/women">WOMEN</Link></li>
                <li className={`sneaker-nav-item ${isActive('/sneakers') ? 'active-nav-item' : ''}`}>
                    <Link to="/sneakers">SNEAKERS<span className="nav-badge"><Lock size={8} /> DROP</span></Link>
                </li>
             </ul>
           </div>
           
           <div className="nav-center">
             <Link to="/" className="brand-logo">रीति</Link>
           </div>

           <div className="nav-right">
             <div className="desktop-search desktop-only">
               <div className={`search-input-wrapper ${searchQuery.length > 0 ? 'active-glow' : ''}`}>
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchSubmit} />
                  <div className="search-actions">
                    <button className={`mic-btn ${isListening ? 'listening' : ''}`} onClick={handleVoiceSearch}><Mic size={18} /></button>
                    {searchQuery.length > 0 && <button className="clear-btn" onClick={clearSearch}><X size={16} /></button>}
                    <button className="search-btn">{isSearching ? <div className="spinner-small"></div> : <Search size={18}/>}</button>
                  </div>
               </div>
               {searchQuery.length >= 2 && (
                 <div className="search-results-dropdown">
                   {searchResults.length > 0 ? searchResults.map(result => (
                     <Link key={result.id} to={`/product/${result.id}`} className="result-item" onClick={clearSearch}>
                       <div className="result-info"><span className="result-name">{result.name}</span><span className="result-category">{result.category}</span></div>
                       <ChevronRight size={14} />
                     </Link>
                   )) : <div className="no-results"><p>No results for "<strong>{searchQuery}</strong>"</p></div>}
                 </div>
               )}
             </div>
             
             

             <div className="nav-icons">
               <div className="user-dropdown-container" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
                 <button className={`icon-btn desktop-only ${userMenuOpen ? 'active' : ''}`}><User size={26} fill={user ? "currentColor" : "none"} /></button>
                 {userMenuOpen && (
                   <div className="nav-dropdown-menu">
                     {user ? (
                       <>
                         <div className="dropdown-header">Hello, {user.name}</div>
                         <Link to="/account" className="dropdown-item" onClick={() => setUserMenuOpen(false)}><User size={16} /> My Account</Link>
                         <button className="dropdown-item" onClick={openSettings}><Settings size={16} /> Settings</button>
                         <button className="dropdown-item logout" onClick={() => { logout(); setUserMenuOpen(false); }}><LogOut size={16} /> Sign Out</button>
                       </>
                     ) : (
                       <><Link to="/login" className="dropdown-item" onClick={() => setUserMenuOpen(false)}><LogIn size={16} /> Sign In</Link><button className="dropdown-item" onClick={openSettings}><Settings size={16} /> Settings</button></>
                     )}
                   </div>
                 )}
               </div>
               <button className="icon-btn mobile-only" onClick={() => setShowMobileSearch(!showMobileSearch)}>
                  <Search size={26} />
                </button>
               <Link to="/wishlist" className="icon-btn">
                 <Heart size={26} fill={wishlist.length > 0 ? "#d32f2f" : "none"} color={wishlist.length > 0 ? "#d32f2f" : "currentColor"}/>
                 {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
               </Link>
               <Link to="/cart" className="icon-btn cart-btn"><ShoppingCart size={26} /></Link>
             </div>
           </div>
         </div>
         
         <div className={`mobile-search-container ${showMobileSearch ? 'active' : ''}`}>
         <div className="mobile-search-wrapper">
          <input 
              ref={mobileSearchInputRef}
              type="search" 
              placeholder="Search products..." 
              autoFocus={showMobileSearch} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit} 
            />
            <div className="mobile-search-actions">
              <button 
                type="button" 
                className={`mobile-mic-btn ${isListening ? 'listening' : ''}`} 
                onClick={handleVoiceSearch}
              >
                <Mic size={20} />
              </button>
              
              <div className="search-divider"></div>

              {/* This is your custom button that we will style and use for closing/clearing */}
              <button className="mobile-search-close" onClick={handleMobileSearchClose}>
                <X size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER FIX --- */}
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
               <Link to="/login" className="mobile-auth-btn login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
               <Link to="/login" className="mobile-auth-btn register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
          <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)', opacity: 0.5 }} />
          <Link to="/" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Home <ChevronRight size={16} /></Link>
          <div className="mobile-nav-group">
            <Link to="/men" className="nav-card-btn" onClick={() => setMobileMenuOpen(false)}><span className="nav-card-text">MEN</span><ChevronRight size={18} className="nav-arrow" /></Link>
            <Link to="/women" className="nav-card-btn" onClick={() => setMobileMenuOpen(false)}><span className="nav-card-text">WOMEN</span><ChevronRight size={18} className="nav-arrow" /></Link>
            <Link to="/sneakers" className="nav-card-btn special" onClick={() => setMobileMenuOpen(false)}><span className="nav-card-text">SNEAKERS <span className="nav-tag">DROP</span></span><ChevronRight size={18} className="nav-arrow" /></Link>
          </div>
          <Link to="/design" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Design Studio <ChevronRight size={16} /></Link>
          <Link to="/wishlist" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>My Wishlist ({wishlist.length}) <ChevronRight size={16} /></Link>
        </div>

        <div className="drawer-footer">
          <button className="drawer-link" onClick={openSettings}>
             <div style={{display:'flex', alignItems:'center', gap:'10px'}}><Settings size={18} /> Settings</div>
             <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* --- SETTINGS MODAL --- */}
      {showSettingsModal && (
        <div className="settings-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header"><h2>Settings</h2><button className="settings-close-btn" onClick={() => setShowSettingsModal(false)}><X size={24}/></button></div>
            <div className="settings-body">
              <div className="setting-section">
                <h3>Appearance</h3>
                <div className="setting-item"><div className="setting-info">{theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}<span>App Theme</span></div><button className="theme-toggle-switch" onClick={toggleTheme}><span className="current-theme-name">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span><div className={`toggle-track ${theme === 'dark' ? 'active' : ''}`}><div className="toggle-thumb"></div></div></button></div>
              </div>
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