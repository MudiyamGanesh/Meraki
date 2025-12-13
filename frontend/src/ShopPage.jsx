import React from 'react';
import ProductShowcase from './components/ProductShowcase';

const ShowPage = () => {
  
  // 1. The Tabs (Categories)
  const categoryList = [
    "Oversized T-Shirts", 
    "Hoodies & Sweatshirts", 
    "Urban Cargo Joggers",
    "Summer Polos"
  ];

  // 2. The Products
  // Note: 'category' must match one of the strings in categoryList exactly.
  const productData = [
    // --- OVERSIZED T-SHIRTS ---
    {
      id: 1,
      name: "Naruto: Shippuden",
      subtitle: "Oversized T-Shirt",
      price: "1299",
      category: "Oversized T-Shirts",
      image: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_4.jpg?tr=w-500",
      hoverImage: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_1.jpg?tr=w-500", 
      overlayText: "BESTSELLER"
    },
    {
      id: 2,
      name: "Streetwear: Tokyo",
      subtitle: "Graphic Oversized Tee",
      price: "1199",
      category: "Oversized T-Shirts",
      image: "https://m.media-amazon.com/images/I/61d7pWJq51L._AC_UY1100_.jpg",
      hoverImage: "https://m.media-amazon.com/images/I/6122k6ZWMoL._AC_UY1100_.jpg",
      overlayText: "NEW ARRIVAL"
    },

    // --- HOODIES & SWEATSHIRTS ---
    {
      id: 3,
      name: "Official: Batman",
      subtitle: "Oversized Hoodie",
      price: "1999",
      category: "Hoodies & Sweatshirts",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1728111479_2989531.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1728111479_8323740.jpg?w=480&dpr=2",
      overlayText: null
    },
    {
      id: 4,
      name: "Marvel: Stark Industries",
      subtitle: "Premium Sweatshirt",
      price: "1499",
      category: "Hoodies & Sweatshirts",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1760937874_2503078.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1760937874_4016384.jpg?w=480&dpr=2",
      overlayText: null
    },

    // --- URBAN CARGO JOGGERS ---
    {
      id: 5,
      name: "Korean Joggers: Jet Black",
      subtitle: "Cargo Joggers",
      price: "1699",
      category: "Urban Cargo Joggers",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_9226731.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_8977352.jpg?w=480&dpr=2",
      overlayText: "KOREAN FIT"
    },
    {
      id: 6,
      name: "Textured Utility Pants: Military Olive",
      subtitle: "6-Pocket Joggers",
      price: "1899",
      category: "Urban Cargo Joggers",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1707563151_9459686.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1707563151_8456459.jpg?w=480&dpr=2",
      overlayText: "TRENDING"
    },

    // --- SUMMER POLOS ---
    {
      id: 7,
      name: "Solids: Navy Blue",
      subtitle: "Classic Polo",
      price: "999",
      category: "Summer Polos",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9185659.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9052147.jpg?w=480&dpr=2",
      overlayText: "BUY 2 AT 1499"
    },
    {
      id: 8,
      name: "FCB: Love of Football",
      subtitle: "Men rugby polos",
      price: "1499",
      category: "Oversized T-Shirts",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1713616797_5057742.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1713616797_4082806.jpg?w=480&dpr=2",
      overlayText: null
    },
    {
      id: 9,
      name: "Naruto: Shippuden",
      subtitle: "Oversized T-Shirt",
      price: "1299",
      category: "Oversized T-Shirts",
      image: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_4.jpg?tr=w-500",
      hoverImage: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_1.jpg?tr=w-500", 
      overlayText: "BESTSELLER"
    },
    {
      id: 10,
      name: "Streetwear: Tokyo",
      subtitle: "Graphic Oversized Tee",
      price: "1199",
      category: "Oversized T-Shirts",
      image: "https://m.media-amazon.com/images/I/61d7pWJq51L._AC_UY1100_.jpg",
      hoverImage: "https://m.media-amazon.com/images/I/6122k6ZWMoL._AC_UY1100_.jpg",
      overlayText: "NEW ARRIVAL"
    },

    // --- HOODIES & SWEATSHIRTS ---
    {
      id: 11,
      name: "Official: Batman",
      subtitle: "Oversized Hoodie",
      price: "1999",
      category: "Hoodies & Sweatshirts",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1728111479_2989531.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1728111479_8323740.jpg?w=480&dpr=2",
      overlayText: null
    },
    // --- URBAN CARGO JOGGERS ---
    {
      id: 12,
      name: "Korean Joggers: Jet Black",
      subtitle: "Cargo Joggers",
      price: "1699",
      category: "Urban Cargo Joggers",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_9226731.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_8977352.jpg?w=480&dpr=2",
      overlayText: "KOREAN FIT"
    },
    {
      id: 13,
      name: "Marvel: Stark Industries",
      subtitle: "Premium Sweatshirt",
      price: "1499",
      category: "Hoodies & Sweatshirts",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1760937874_2503078.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1760937874_4016384.jpg?w=480&dpr=2",
      overlayText: null
    },
    // --- SUMMER POLOS ---
    {
      id: 14,
      name: "Solids: Navy Blue",
      subtitle: "Classic Polo",
      price: "999",
      category: "Summer Polos",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9185659.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9052147.jpg?w=480&dpr=2",
      overlayText: "BUY 2 AT 1499"
    },
    {
      id: 15,
       name: "Textured Utility Pants: Military Olive",
      subtitle: "6-Pocket Joggers",
      price: "1899",
      category: "Urban Cargo Joggers",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1707563151_9459686.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1707563151_8456459.jpg?w=480&dpr=2",
      overlayText: "TRENDING"
    },
    {
      id: 16,
      name: "FCB: Love of Football",
      subtitle: "Men rugby polos",
      price: "1499",
      category: "Oversized T-Shirts",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1713616797_5057742.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1713616797_4082806.jpg?w=480&dpr=2",
      overlayText: null
    }
  ];

  return (
    <div className="category-wrapper">
      <div className="page-content">
        <ProductShowcase 
            title="Trending Now"
            products={productData}
            categories={categoryList}
        />
      </div>
    </div>
  );
};

export default ShowPage;