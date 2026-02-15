import React, { useState, useEffect, useMemo } from 'react';
import HeroCarousel from '../components/HeroCarousel'; 
import ProductSection from '../components/ProductSection';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../firebase'; 

const HomePage = ({ activeTab }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(true); // <--- The silent guard

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllProducts(productsData);
      } catch (error) {
        console.error("Error fetching home page products:", error);
      } finally {
        setIsFetching(false); // <--- Tells React the data is finally here
      }
    };

    fetchAllProducts();
  }, []); 

  const filteredStrangerThings = useMemo(() => {
    return allProducts.filter(item => 
      item.theme === "Stranger Things" && 
      item.gender === activeTab
    );
  }, [allProducts, activeTab]);

  const filteredNewArrivals = useMemo(() => {
    return allProducts.filter(item => 
      item.collection === "New Arrivals" && 
      item.gender === activeTab
    );
  }, [allProducts, activeTab]);

  return (
    <div className="HomePage">
      
      {/* SECTION 1: Hero Carousel */}
      <HeroCarousel activeTab={activeTab} products={allProducts} />

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

      {/* Fallback Message */}
      {/* We added !isFetching so it quietly waits before showing this! */}
      {!isFetching && filteredStrangerThings.length === 0 && filteredNewArrivals.length === 0 && (
         <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <h3>Nothing here yet!</h3>
            <p>More {activeTab}'s collections are dropping next week.</p>
         </div>
      )}
      
    </div>
  );
};

export default HomePage;