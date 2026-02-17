import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { WishlistProvider } from './Context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext.jsx';

// Components
import SneakerDrop from './components/SneakerDrop';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';
import HeroCarousel from './components/HeroCarousel';
import Footer from './components/Footer.jsx';
import DesignStudio from './components/DesignStudio';
import AdminLayout from './components/AdminLayout.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ShowPage from './pages/ShopPage.jsx'; 
import WishlistPage from './pages/WishlistPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminProductForm from './pages/AdminProductForm.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';

// --- SCROLL TO TOP ON ROUTE CHANGE ---
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

  const noNavbarPaths = ['/', '/login'];

  // FIX: Also hide if the URL starts with /admin
  if (noNavbarPaths.includes(location.pathname) || location.pathname.startsWith('/admin')) {
    return null;
  }

  return <Navbar />;
};

// --- LOGIC TO HIDE FOOTER ---
const ConditionalFooter = () => {
  const location = useLocation();
  
  const noFooterPaths = [
    '/',
    '/account', 
    '/cart', 
    '/wishlist', 
    '/design', 
    '/login',
  ];

  // FIX: Also hide if the URL starts with /admin
  if (noFooterPaths.includes(location.pathname) || location.pathname.startsWith('/admin')) {
    return null;
  }

  return <Footer />;
};

const BodyClassManager = () => {
  const location = useLocation();
  
  useEffect(() => {
    const noNavbarPaths = ['/', '/login'];
    const isNavbarHidden = noNavbarPaths.includes(location.pathname) || location.pathname.startsWith('/admin');

    if (isNavbarHidden) {
      document.body.classList.add('no-nav');
    } else {
      document.body.classList.remove('no-nav');
    }
  }, [location]);

  return null;
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
              <BodyClassManager />
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
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccess />} />

                  {/* PROTECTED ADMIN ROUTES */}
                  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    {/* These render INSIDE the <Outlet /> of AdminLayout */}
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/edit/:id" element={<AdminProductForm />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                  </Route> {/* <--- CRITICAL FIX: The missing closing tag! */}
                  
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