import ProductSection from './components/ProductSection';

// Example Data for Category 1
const strangerThingsData = [
  { id: 1, name: "Upside Down Tee", category: "Oversized T-Shirts", price: 899, image: "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg", badge: "Limited Edition" },
  { id: 2, name: "Demogorgon News", category: "Oversized T-Shirts", price: 1199, image: "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg", badge: "Limited Edition" },
  { id: 3, name: "Collector's Edition", category: "Backpack", price: 3199, image: "https://assets.ajio.com/medias/sys_master/root/20241115/fPXR/6736eb9cc148fa1b30c9bb37/-473Wx593H-469685579-washedblack-MODEL.jpg", badge: "Limited Edition" },
  { id: 4, name: "Vecna Full Sleeve", category: "Full Sleeve T-shirts", price: 1299, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1", badge: "Limited Edition" },
  { id: 5, name: "Upside Down Tee", category: "Oversized T-Shirts", price: 899, image: "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg", badge: "Limited Edition" },
  { id: 6, name: "Collector's Edition", category: "Backpack", price: 3199, image: "https://assets.ajio.com/medias/sys_master/root/20241115/fPXR/6736eb9cc148fa1b30c9bb37/-473Wx593H-469685579-washedblack-MODEL.jpg", badge: "Limited Edition" },
  { id: 7, name: "Demogorgon News", category: "Oversized T-Shirts", price: 1199, image: "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg", badge: "Limited Edition" },
  { id: 8, name: "Vecna Full Sleeve", category: "Full Sleeve T-shirts", price: 1299, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1", badge: "Limited Edition" },
];

// Example Data for Category 2
const newArrivalsData = [
  { id: 9, name: "Hydros: Sasuke", category: "Men Clogs", price: 1499, image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg", badge: "New" },
  { id: 10, name: "Hustlin' Taz", category: "Oversized Full Sleeve", price: 1299, image: "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg", badge: "Hot" },
  { id: 11, name: "Pets on Prints", category: "Oversized T-Shirts", price: 1049, image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg" },
  { id: 12, name: "Platinum Pleated", category: "Men Pants", price: 2499, image: "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg" },
  { id: 13, name: "Hustlin' Taz", category: "Oversized Full Sleeve", price: 1299, image: "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg", badge: "Hot" },
  { id: 14, name: "Pets on Prints", category: "Oversized T-Shirts", price: 1049, image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg" },
  { id: 15, name: "Hydros: Sasuke", category: "Men Clogs", price: 1499, image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg", badge: "New" },
  { id: 16, name: "Platinum Pleated", category: "Men Pants", price: 2499, image: "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg" },
];

function App() {
  return (
    <div className="App">
      
      {/* Row 1: Stranger Things */}
      <ProductSection 
        title="Stranger Things Collection" 
        subtitle="Limited Edition"
        products={strangerThingsData} 
      />

      {/* Row 2: New Arrivals */}
      <ProductSection 
        title="New Arrivals" 
        subtitle=""
        products={newArrivalsData} 
      />
      
    </div>
  );
}

export default App;