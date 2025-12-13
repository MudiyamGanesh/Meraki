import React, { useMemo } from 'react';
import ProductSection from './components/ProductSection';

// 1. Tag Data with Gender ('Men' or 'Women')
const strangerThingsData = [
  { id: 1, name: "Upside Down Tee", category: "Oversized T-Shirts", price: 899, gender: "Women", image: "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg", badge: "Limited Edition" },
  { id: 2, name: "Demogorgon News", category: "Oversized T-Shirts", price: 1199, gender: "Women", image: "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg", badge: "Limited Edition" },
  { id: 3, name: "Max's Backpack", category: "Accessories", price: 3199, gender: "Men", image: "https://assets.ajio.com/medias/sys_master/root/20241115/fPXR/6736eb9cc148fa1b30c9bb37/-473Wx593H-469685579-washedblack-MODEL.jpg", badge: "Limited Edition" },
  { id: 4, name: "Eleven's Power", category: "Full Sleeve", price: 1299, gender: "Men", image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1", badge: "Limited Edition" },
  { id: 5, name: "Hellfire Club", category: "Oversized T-Shirts", price: 899, gender: "Women", image: "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg", badge: "Limited Edition" },
  { id: 6, name: "Starcourt Mall", category: "Tote Bag", price: 3199, gender: "Men", image: "https://assets.ajio.com/medias/sys_master/root/20241115/fPXR/6736eb9cc148fa1b30c9bb37/-473Wx593H-469685579-washedblack-MODEL.jpg", badge: "Limited Edition" },
  { id: 7, name: "Hawkins High", category: "Oversized T-Shirts", price: 1199, gender: "Women", image: "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg", badge: "Limited Edition" },
  { id: 8, name: "Mind Flayer", category: "Full Sleeve", price: 1299, gender: "Men", image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1", badge: "Limited Edition" },
];

const newArrivalsData = [
  { id: 9, name: "Hydros: Sasuke", category: "Men Clogs", price: 1499, gender: "Women", image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg", badge: "New" },
  { id: 10, name: "Hustlin' Taz", category: "Oversized Full Sleeve", price: 1299, gender: "Men", image: "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg", badge: "Hot" },
  { id: 11, name: "Cute Pets", category: "Oversized T-Shirts", price: 1049, gender: "Men", image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg" },
  { id: 12, name: "Platinum Pleated", category: "Trousers", price: 2499, gender: "Women", image: "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg" },
  { id: 13, name: "Urban Cargo", category: "Cargo Pants", price: 1299, gender: "Men", image: "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg", badge: "Hot" },
  { id: 14, name: "Floral Summer", category: "Dress", price: 1049, gender: "Men", image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg" },
  { id: 15, name: "Ninja slides", category: "Men Clogs", price: 1499, gender: "Women", image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg", badge: "New" },
  { id: 16, name: "Wide Leg Jeans", category: "Denim", price: 2499, gender: "Women", image: "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg" },
];

// 2. Accept activeTab prop
const HomePage = ({ activeTab }) => {
  
  // 3. Filter Logic using useMemo for performance
  const filteredStrangerThings = useMemo(() => {
    return strangerThingsData.filter(item => item.gender === activeTab);
  }, [activeTab]);

  const filteredNewArrivals = useMemo(() => {
    return newArrivalsData.filter(item => item.gender === activeTab);
  }, [activeTab]);

  return (
    <div className="HomePage">
      
      {/* 4. Only render the section if there are items for that gender */}
      {filteredStrangerThings.length > 0 && (
        <ProductSection 
          title={`Stranger Things (${activeTab})`} 
          subtitle="Limited Edition"
          products={filteredStrangerThings} 
        />
      )}

      {filteredNewArrivals.length > 0 && (
        <ProductSection 
          title={`New Arrivals for ${activeTab}`} 
          subtitle="Fresh Drops"
          products={filteredNewArrivals} 
        />
      )}

      {/* 5. Fallback if no items exist for a category */}
      {filteredStrangerThings.length === 0 && filteredNewArrivals.length === 0 && (
         <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>More {activeTab}'s collections dropping next week!</p>
         </div>
      )}
      
    </div>
  );
};

export default HomePage;