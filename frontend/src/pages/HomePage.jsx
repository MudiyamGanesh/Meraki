import React, { useMemo } from 'react';
import HeroCarousel from '../components/HeroCarousel'; // Import the carousel
import ProductSection from '../components/ProductSection';
import { sampleProducts } from '../data/products.js'; 

const HomePage = ({ activeTab }) => {
  
  // 1. Filter Stranger Things Logic
  // We check if the product has the theme "Stranger Things" AND matches the activeTab (Men/Women)
  const filteredStrangerThings = useMemo(() => {
    return sampleProducts.filter(item => 
      item.theme === "Stranger Things" && 
      item.gender === activeTab
    );
  }, [activeTab]);

  // 2. Filter New Arrivals Logic
  // We check if the collection is "New Arrivals" AND matches the activeTab
  const filteredNewArrivals = useMemo(() => {
    return sampleProducts.filter(item => 
      item.collection === "New Arrivals" && 
      item.gender === activeTab
    );
  }, [activeTab]);

  return (
    <div className="HomePage">
      
      {/* SECTION 1: Hero Carousel */}
      {/* We pass the full data set; the carousel handles its own filtering/slicing */}
      <HeroCarousel activeTab={activeTab} products={sampleProducts} />

      {/* SECTION 2: Stranger Things */}
      {filteredStrangerThings.length > 0 && (
        <ProductSection 
          title={`Stranger Things (${activeTab})`} 
          subtitle="Limited Edition Collection"
          products={filteredStrangerThings} 
        />
      )}

      {/* SECTION 3: New Arrivals */}
      {filteredNewArrivals.length > 0 && (
        <ProductSection 
          title={`New Arrivals for ${activeTab}`} 
          subtitle="Fresh Drops & Trending Styles"
          products={filteredNewArrivals} 
        />
      )}

      {/* Fallback Message (Only shows if BOTH sections are empty) */}
      {filteredStrangerThings.length === 0 && filteredNewArrivals.length === 0 && (
         <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <h3>Nothing here yet!</h3>
            <p>More {activeTab}'s collections are dropping next week.</p>
         </div>
      )}
      
    </div>
  );
};

export default HomePage;