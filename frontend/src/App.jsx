import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Main Home Component wrapper
const MainHome = ({ activeTab, setActiveTab }) => (
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

function App() {
  const [activeTab, setActiveTab] = useState('Men');

  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <div className="app-container">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <Routes>
              <Route path="/Meraki" element={<MainHome activeTab={activeTab} setActiveTab={setActiveTab} />} />
              
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