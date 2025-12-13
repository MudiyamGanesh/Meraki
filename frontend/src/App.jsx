import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './Context/WishlistContext.jsx';

import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import HomePage from './HomePage.jsx';
import Footer from './components/Footer.jsx';
import ShowPage from './ShopPage.jsx';
import WishlistPage from './WishlistPage.jsx'; 

// Create a component for the main Home Page content to keep App clean
const MainHome = () => (
  <>
    <HeroCarousel />
    <HomePage />
    <ShowPage />
  </>
);

function App() {
  return (
    <WishlistProvider>
      <Router>
        <div>
          <Navbar />
          
          <Routes>
            <Route path="/Meraki" element={<MainHome />} />
            <Route path="/Meraki/wishlist" element={<WishlistPage />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </WishlistProvider>
  );
}

export default App;