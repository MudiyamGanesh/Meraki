import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { WishlistProvider } from './Context/WishlistContext';
import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext.jsx';
// Data
import { sampleProducts } from './data/products';
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
import ProductPage from './pages/ProductPage.jsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

// --- LOGIC TO HIDE NAVBAR ---
const ConditionalNavbar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <Navbar />;
};

// --- LOGIC TO HIDE FOOTER ---
const ConditionalFooter = () => {
  const location = useLocation();
  
  const noFooterPaths = [
    '/account', 
    '/cart', 
    '/wishlist', 
    '/design', 
    '/login',
  ];

  // FIX: Check if the current path is in the exclusion list
  if (noFooterPaths.includes(location.pathname)) {
    return null;
  }

  return <Footer />;
};

// Shop Layout Wrapper
const ShopLayout = ({ category }) => (
  <>
    <SubNavbar activeCategory={category} />
    <HeroCarousel activeTab={category} />
    <HomePage activeTab={category} />
    <ShowPage activeTab={category} />
  </>
);

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
        <CartProvider>
          <ToastProvider>
            <Router>
              <ScrollToTop />
              <div className="app-container">
                
                <ConditionalNavbar />

                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Shop Routes */}
                  <Route path="/men" element={<ShopLayout category="Men" />} />
                  <Route path="/women" element={<ShopLayout category="Women" />} />
                  <Route path="/sneakers" element={<SneakerLayout />} />

                  {/* Pages */}
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/design" element={<DesignStudio />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                </Routes>
                
                <ConditionalFooter />
                
              </div>
            </Router>
          </ToastProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;