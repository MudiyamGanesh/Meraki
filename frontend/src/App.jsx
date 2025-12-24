import React, { useEffect, useState } from 'react'; // Added useState
import { sampleProducts } from './data/products';

// 1. USE HASHROUTER
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { WishlistProvider } from './Context/WishlistContext';
import { AuthProvider } from './Context/AuthContext';
import { ToastProvider } from './context/ToastContext.jsx';

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
import ProductPage from './pages/ProductPage';


// Scroll Helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

// --- NEW COMPONENT: CONDITIONAL NAVBAR ---
const ConditionalNavbar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Function to update state on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // LOGIC: If we are on '/login' AND it is mobile view -> Hide Navbar
  if (location.pathname === '/login' && isMobile) {
    return null;
  }

  // Otherwise -> Show Navbar
  return <Navbar />;
};

// --- CONDITIONAL FOOTER ---
const ConditionalFooter = () => {
  const location = useLocation();

  const noFooterPaths = [
    '/account', 
    '/cart', 
    '/wishlist', 
    '/design', 
    '/login' 
  ];

  if (noFooterPaths.includes(location.pathname)) {
    return null;
  }

  return <Footer />;
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
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <div className="app-container">
              
              <ConditionalNavbar />

              <Routes>
                <Route path="/" element={<LandingPage />} />
                
                {/* Static Shop Routes */}
                <Route path="/men" element={<ShopLayout category="Men" />} />
                <Route path="/women" element={<ShopLayout category="Women" />} />
                <Route path="/sneakers" element={<SneakerLayout />} />

                {/* Other Pages */}
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/design" element={<DesignStudio />} />

                {/* THE DYNAMIC PRODUCT ROUTE - PLACE THIS LAST */}
                {/* Ensure sampleProducts is actually defined and imported! */}
                <Route 
                  path="/:category/product/:id" 
                  element={<ProductPage products={sampleProducts} />} 
                />
              </Routes>
              
              <ConditionalFooter />
              
            </div>
          </Router>
        </ToastProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;