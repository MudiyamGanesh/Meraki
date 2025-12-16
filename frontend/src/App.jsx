import React, { useEffect } from 'react';
// 1. USE HASHROUTER
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { WishlistProvider } from './Context/WishlistContext';
import { AuthProvider } from './Context/AuthContext';

// Components
import SneakerDrop from './components/SneakerDrop';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';
import HeroCarousel from './components/HeroCarousel';
import Footer from './components/Footer.jsx';
import DesignStudio from './components/DesignStudio';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ShowPage from './pages/ShopPage.jsx'; 
import WishlistPage from './pages/WishlistPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AccountPage from './pages/AccountPage.jsx';

// Scroll Helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

// Shop Layout
const ShopLayout = ({ category }) => (
  <>
    <SubNavbar activeCategory={category} />
    <HeroCarousel activeTab={category} />
    <HomePage activeTab={category} />
    <ShowPage activeTab={category} />
  </>
);

// Sneaker Layout
const SneakerLayout = () => (
  <>
    <SubNavbar activeCategory="Sneakers" />
    <SneakerDrop />
  </>
);

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          <div className="app-container">
            <Navbar />
            <Routes>
              {/* REMOVED '/Meraki' FROM ALL PATHS */}
              <Route path="/" element={<LandingPage />} />
              
              <Route path="/men" element={<ShopLayout category="Men" />} />
              <Route path="/women" element={<ShopLayout category="Women" />} />
              <Route path="/sneakers" element={<SneakerLayout />} />

              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/design" element={<DesignStudio />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;