import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { WishlistProvider } from './Context/WishlistContext';
import { AuthProvider } from './Context/AuthContext';

// Components
import SneakerDrop from './components/SneakerDrop';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';
import HeroCarousel from './components/HeroCarousel';
import Footer from './components/Footer.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ShowPage from './pages/ShopPage.jsx'; 
import WishlistPage from './pages/WishlistPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import DesignStudio from './components/DesignStudio';

// Helper component to scroll to top on ROUTE change (e.g. going from Cart -> Home)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Home Component wrapper
const MainHome = ({ activeTab, setActiveTab }) => {
  
  // 2. Add this Effect: Scroll to top whenever activeTab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" // Use "smooth" if you want a scrolling animation
    });
  }, [activeTab]);

  return (
    <>
      <SubNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'Sneakers' ? (
        <SneakerDrop />
      ) : (
        <>
          <HeroCarousel activeTab={activeTab} />
          <HomePage activeTab={activeTab} />
          <ShowPage activeTab={activeTab} />
        </>
      )}
    </>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('Men');

  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          {/* 3. Add ScrollToTop here to handle route changes (like clicking Back) */}
          <ScrollToTop />
          
          <div className="app-container">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <Routes>
              <Route path="/Meraki/" element={<MainHome activeTab={activeTab} setActiveTab={setActiveTab} />} />
              
              <Route path="/Meraki/wishlist" element={<WishlistPage />} />
              <Route path="/Meraki/cart" element={<CartPage />} />

              <Route path="/Meraki/login" element={<LoginPage />} />
              <Route path="/Meraki/account" element={<AccountPage />} />
              <Route path="/Meraki/design" element={<DesignStudio />} />
            </Routes>

            <Footer />
          </div>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;