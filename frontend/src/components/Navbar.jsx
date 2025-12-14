import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingCart, Heart, User, X, ChevronRight, Sun, Moon, Lock } from 'lucide-react'; // Added Lock
import { Link } from 'react-router-dom';
import { useWishlist } from '../Context/WishlistContext';
import '../css/Navbar.css';

// 1. Accept props
const Navbar = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { wishlist } = useWishlist();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // ... (Keep existing Theme Effects and Body Scroll Effects) ...
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));


  // HELPER: Handles click on desktop nav items
  const handleNavClick = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          
          <div className="nav-left">
            {/* Mobile Hamburger */}
            <button 
              className="icon-btn mobile-only" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>

            <button className="icon-btn theme-toggle mobile-only" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={26} /> : <Sun size={26} />}
            </button>

            {/* --- DESKTOP TABS (MOVED FROM SUBNAVBAR) --- */}
            <ul className="desktop-links desktop-only">
              
              {/* MEN */}
              <li className={activeTab === 'Men' ? 'active-nav-item' : ''}>
                <button onClick={() => handleNavClick('Men')}>
                  MEN
                </button>
              </li>

              {/* WOMEN */}
              <li className={activeTab === 'Women' ? 'active-nav-item' : ''}>
                <button onClick={() => handleNavClick('Women')}>
                  WOMEN
                </button>
              </li>

              {/* SNEAKERS (Special Style) */}
              <li className={`sneaker-nav-item ${activeTab === 'Sneakers' ? 'active-nav-item' : ''}`}>
                <button onClick={() => handleNavClick('Sneakers')}>
                  SNEAKERS
                  <span className="nav-badge">
                     <Lock size={8} /> DROP
                  </span>
                </button>
              </li>

              <li className="highlight-link"><a href="#sale">SALE</a></li> 
            </ul>
          </div>

          <div className="nav-center">
            <Link to="/Meraki" className="brand-logo">रीति</Link>
          </div>

          {/* ... (Keep Right Section & Mobile Drawer EXACTLY as they were) ... */}
          <div className="nav-right">
             {/* ... Search, Icons, etc ... */}
             <div className="desktop-search desktop-only">
               <input type="text" placeholder="Search..." />
               <button className="search-btn"><Search size={18}/></button>
             </div>
             
             {/* Mobile Search Btn */}
             <button className="icon-btn mobile-only" onClick={() => setShowMobileSearch(!showMobileSearch)}>
               <Search size={26} />
             </button>

             <div className="nav-icons">
               <button className="icon-btn theme-toggle desktop-only" onClick={toggleTheme}>
                 {theme === 'light' ? <Moon size={26} /> : <Sun size={26} />}
               </button>
               <button className="icon-btn desktop-only"><User size={26}/></button>
               
               <Link to="/wishlist" className="icon-btn">
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
        
        {/* Mobile Search Bar */}
        <div className={`mobile-search-container ${showMobileSearch ? 'active' : ''}`}>
           <input type="text" placeholder="Search..." />
           <Search size={20} />
        </div>
      </nav>

      {/* Mobile Drawer (Keep as is) */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
         {/* ... Drawer Content ... */}
         {/* (You can keep the drawer content code from before) */}
         <div className="drawer-header">
            <span className="drawer-title">MENU</span>
            <button className='drawer-close-btn' onClick={() => setMobileMenuOpen(false)}><X size={28}/></button>
         </div>
         <div className="drawer-content">
             {/* Note: In mobile drawer, we still use the SubNavbar visually, 
                 so we don't strictly need buttons here, but standard links are fine. */}
             <Link to="/" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
             <Link to="/wishlist" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>My Wishlist</Link>
         </div>
      </div>
    </>
  );
};

export default Navbar;