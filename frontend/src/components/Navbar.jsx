import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingCart, Heart, User, X, ChevronRight, Sun, Moon } from 'lucide-react';
import '../css/Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Effect to apply theme to document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          
          {/* --- LEFT SECTION --- */}
          <div className="nav-left">
            {/* Mobile: Hamburger */}
            <button 
              className="icon-btn mobile-only" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={28} />
            </button>

            {/* Desktop: Navigation Links */}
            <ul className="desktop-links desktop-only">
              <li><a href="#men">MEN</a></li>
              <li><a href="#women">WOMEN</a></li>
              <li><a href="#kids">KIDS</a></li>
              {/* Added distinct red link typical of sales */}
              <li className="highlight-link"><a href="#sale">SALE</a></li> 
            </ul>
          </div>

          {/* --- CENTER SECTION (LOGO) --- */}
          <div className="nav-center">
            <a href="/" className="brand-logo">रीति</a>
          </div>

          {/* --- RIGHT SECTION --- */}
          <div className="nav-right">
            
            {/* Desktop Search Bar */}
            <div className="desktop-search desktop-only">
              <input type="text" placeholder="Search for products..." />
              <button className="search-btn"><Search size={18} /></button>
            </div>

            {/* Mobile Search Icon */}
            <button 
              className="icon-btn mobile-only" 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search size={26} />
            </button>

            {/* Icons (Wishlist, Cart, Profile, THEME TOGGLE) */}
            <div className="nav-icons">
              
              {/* Theme Toggle Button */}
              <button className="icon-btn theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                {theme === 'light' ? <Moon size={26} /> : <Sun size={26} />}
              </button>

              <button className="icon-btn desktop-only">
                <User size={26} />
              </button>
              <button className="icon-btn">
                <Heart size={26} />
              </button>
              <button className="icon-btn cart-btn">
                <ShoppingCart size={26} />
                <span className="badge">3</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE SEARCH BAR (Conditional Render) --- */}
        <div className={`mobile-search-container ${showMobileSearch ? 'active' : ''}`}>
          <input type="text" placeholder="What are you looking for?" autoFocus />
          <Search size={20} className="mobile-search-submit"/>
        </div>
      </nav>

      {/* --- MOBILE SIDE DRAWER --- */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">MENU</span>
          <button className='drawer-close-btn' onClick={() => setMobileMenuOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <div className="drawer-content">
          <a href="#login" className="drawer-link user-link">
            <User size={20} /> Login / Register
          </a>
          <hr />
          <a href="#home" className="drawer-link">Home <ChevronRight size={16} /></a>
          <a href="#men" className="drawer-link">Men <ChevronRight size={16} /></a>
          <a href="#women" className="drawer-link">Women <ChevronRight size={16} /></a>
          <a href="#kids" className="drawer-link">Kids <ChevronRight size={16} /></a>
          <a href="#sale" className="drawer-link highlight">Exclusive Sale <ChevronRight size={16} /></a>
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