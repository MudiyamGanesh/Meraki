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
  
  // --- SMART SCROLL STATES ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);

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

  const isActive = (path) => location.pathname === path;

  // Mock Search Data (Replace with your API/DB results)
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
      const currentScrollPos = window.scrollY;
      setIsScrolled(currentScrollPos > 20);
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

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
      recognition.continuous = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Voice error:", event.error);
        setIsListening(false);
        if(event.error === 'not-allowed') {
            alert("Microphone permission denied. Check your settings.");
        }
      };

      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } catch (error) {
      console.error("Voice setup error:", error);
      setIsListening(false);
    }
  };

  // --- SEARCH UTILITIES ---
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

  // --- NEW HANDLER: Clears text AND Closes Mobile Bar ---
  const handleMobileSearchClose = () => {
    clearSearch(); // Clears the text
    setShowMobileSearch(false); // Hides the bar
  };

  // --- UTILITY HANDLERS ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openSettings = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setShowSettingsModal(true);
  };

  return (
    <>
      <nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''} ${visible ? '' : 'nav-hidden'}`} 
        ref={navRef}
      >
        <div className="nav-container">
           {/* LEFT: NAV LINKS */}
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
           
           {/* CENTER: LOGO */}
           <div className="nav-center">
             <Link to="/" className="brand-logo">रीति</Link>
           </div>

           {/* RIGHT: SEARCH & ICONS */}
           <div className="nav-right">
             
             {/* --- DESKTOP SEARCH --- */}
             <div className="desktop-search desktop-only">
               <div className={`search-input-wrapper ${searchQuery.length > 0 ? 'active-glow' : ''}`}>
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                  />
                  
                  <div className="search-actions">
                    <button 
                      className={`mic-btn ${isListening ? 'listening' : ''}`} 
                      onClick={handleVoiceSearch}
                      title="Search by voice"
                    >
                      <Mic size={18} />
                    </button>

                    {searchQuery.length > 0 && (
                      <button className="clear-btn" onClick={clearSearch} title="Clear search">
                        <X size={16} />
                      </button>
                    )}

                    <button className="search-btn">
                      {isSearching ? <div className="spinner-small"></div> : <Search size={18}/>}
                    </button>
                  </div>
               </div>

               {/* DESKTOP RESULTS */}
               {searchQuery.length >= 2 && (
                 <div className="search-results-dropdown">
                   {searchResults.length > 0 ? (
                     searchResults.map(result => (
                       <Link 
                         key={result.id} 
                         to={`/product/${result.id}`} 
                         className="result-item"
                         onClick={clearSearch}
                       >
                         <div className="result-info">
                           <span className="result-name">{result.name}</span>
                           <span className="result-category">{result.category}</span>
                         </div>
                         <ChevronRight size={14} />
                       </Link>
                     ))
                   ) : (
                     <div className="no-results">
                       <p>No results for "<strong>{searchQuery}</strong>"</p>
                     </div>
                   )}
                 </div>
               )}
             </div>
             
             {/* MOBILE SEARCH TRIGGER ICON */}
             <button className="icon-btn mobile-only" onClick={() => setShowMobileSearch(!showMobileSearch)}>
               <Search size={26} />
             </button>

             {/* ICONS & USER MENU */}
             <div className="nav-icons">
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
        
        {/* --- MOBILE SEARCH BAR (FIXED) --- */}
        <div className={`mobile-search-container ${showMobileSearch ? 'active' : ''}`}>
           <div className="mobile-search-wrapper">
              <Search size={20} className="search-icon-marker" />
              
              <input 
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
                
                <div style={{width: '1px', height: '20px', background: 'var(--border-color)'}}></div>

                {/* UPDATED CLOSE BUTTON: Now clears text AND closes bar */}
                <button className="mobile-search-close" onClick={handleMobileSearchClose}>
                   <X size={22} />
                </button>
              </div>
           </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;