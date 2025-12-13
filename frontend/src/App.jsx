import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './Context/WishlistContext';
import SneakerDrop from './components/SneakerDrop';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar'; // Import new component
import HeroCarousel from './components/HeroCarousel';
import HomePage from './HomePage.jsx';
import Footer from './components/Footer.jsx';
import ShowPage from './ShopPage.jsx';
import WishlistPage from './WishlistPage.jsx';

// Main Home Component wrapper to handle props passing
const MainHome = ({ activeTab, setActiveTab }) => (
  <>
    <SubNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    
    {activeTab === 'Sneakers' ? (
      <SneakerDrop />
    ) : (
      <>
        {/* Pass activeTab to HeroCarousel so images change */}
        <HeroCarousel activeTab={activeTab} />
        
        <HomePage activeTab={activeTab}/>
        <ShowPage activeTab={activeTab} />
      </>
    )}
  </>
);

function App() {
  // State for Men/Women tabs (Default to 'Men')
  const [activeTab, setActiveTab] = useState('Men');

  return (
    <WishlistProvider>
      <Router>
        <div>
          <Navbar />
          
          <Routes>
            {/* Pass state to MainHome */}
            <Route path="/Meraki" element={<MainHome activeTab={activeTab} setActiveTab={setActiveTab} />} />
            <Route path="/Meraki/wishlist" element={<WishlistPage />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </WishlistProvider>
  );
}

export default App;