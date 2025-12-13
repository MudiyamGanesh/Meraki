import React, { useMemo } from 'react';
import ProductShowcase from './components/ProductShowcase';

const ShowPage = ({ activeTab }) => {
  
  // 1. Define Categories specific to Men vs Women
  const menCategories = ["Oversized T-Shirts", "Hoodies", "Cargo Joggers", "Summer Polos"];
  const womenCategories = ["Crop Tops", "Dresses", "High-Waist Jeans", "Co-ord Sets"];

  // 2. Select the correct category list based on the tab
  const currentCategories = activeTab === 'Women' ? womenCategories : menCategories;

  // 3. The Products Data (Now strictly tagged with 'gender')
  const productData = [
    // --- MEN'S DATA ---
    {
      id: 1,
      name: "Naruto: Shippuden",
      subtitle: "Oversized T-Shirt",
      price: "1299",
      category: "Oversized T-Shirts",
      gender: "Men",
      image: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_4.jpg?tr=w-500",
      hoverImage: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_1.jpg?tr=w-500", 
      overlayText: "BESTSELLER"
    },
    {
      id: 2,
      name: "Jet Black Cargos",
      subtitle: "Utility Joggers",
      price: "1699",
      category: "Cargo Joggers",
      gender: "Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_9226731.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_8977352.jpg?w=480&dpr=2",
      overlayText: "TRENDING"
    },
    {
      id: 3,
      name: "Classic Polo: Navy",
      subtitle: "Summer Fit",
      price: "999",
      category: "Summer Polos",
      gender: "Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9185659.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9052147.jpg?w=480&dpr=2",
    },
    {
      id: 4,
      name: "Oversized Basic White",
      subtitle: "Oversized T-Shirt",
      price: "1199",
      category: "Oversized T-Shirts",
      gender: "Men",
      image: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_4.jpg?tr=w-500",
      hoverImage: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_1.jpg?tr=w-500",
      overlayText: "SALE"
    },
    {
      id: 5,
      name: "Grey Hoodie",
      subtitle: "Comfort Hoodie",
      price: "1499",
      category: "Hoodies",
      gender: "Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_9226731.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_8977352.jpg?w=480&dpr=2",
    },
    {
      id: 6,
      name: "Charcoal Cargo Pants",
      subtitle: "Premium Joggers",
      price: "1799",
      category: "Cargo Joggers",
      gender: "Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_9226731.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_8977352.jpg?w=480&dpr=2",
      overlayText: "NEW"
    },
    {
      id: 7,
      name: "White Polo Classic",
      subtitle: "Summer Collection",
      price: "1099",
      category: "Summer Polos",
      gender: "Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9185659.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9052147.jpg?w=480&dpr=2",
      overlayText: "BESTSELLER"
    },
    {
      id: 8,
      name: "Dragon Ball Oversized",
      subtitle: "Graphic T-Shirt",
      price: "1399",
      category: "Oversized T-Shirts",
      gender: "Men",
      image: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_4.jpg?tr=w-500",
      hoverImage: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_1.jpg?tr=w-500",
    },
    {
      id: 9,
      name: "Black Zip Hoodie",
      subtitle: "Premium Hoodie",
      price: "1599",
      category: "Hoodies",
      gender: "Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_9226731.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_8977352.jpg?w=480&dpr=2",
      overlayText: "TRENDING"
    },
    {
      id: 10,
      name: "Olive Green Cargos",
      subtitle: "Street Joggers",
      price: "1899",
      category: "Cargo Joggers",
      gender: "Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_9226731.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1729078899_8977352.jpg?w=480&dpr=2",
    },
    {
      id: 11,
      name: "Striped Polo Shirt",
      subtitle: "Casual Fit",
      price: "1199",
      category: "Summer Polos",
      gender: "Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9185659.jpg?w=480&dpr=2",
      hoverImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1727338850_9052147.jpg?w=480&dpr=2",
      overlayText: "SALE"
    },
    {
      id: 12,
      name: "Minimalist Oversized",
      subtitle: "Basic Wear",
      price: "1099",
      category: "Oversized T-Shirts",
      gender: "Men",
      image: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_4.jpg?tr=w-500",
      hoverImage: "https://images-static.nykaa.com/media/catalog/product/5/e/5e9140f284749_1.jpg?tr=w-500",
      overlayText: "NEW"
    },

    // --- WOMEN'S DATA ---
    {
      id: 50,
      name: "Floral Summer",
      subtitle: "Maxi Dress",
      price: "1999",
      category: "Dresses",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      hoverImage: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      overlayText: "NEW"
    },
    {
      id: 51,
      name: "Lavender Haze",
      subtitle: "Cropped Hoodie",
      price: "1199",
      category: "Crop Tops",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241023/jme9/6718fed6f9b8ef490bd83b44/-473Wx593H-469707813-jetblack-MODEL.jpg", 
      overlayText: null
    },
    {
      id: 52,
      name: "Sky High Skinny",
      subtitle: "Denim Jeans",
      price: "2199",
      category: "High-Waist Jeans",
      gender: "Women",
      image: "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
    },
    {
      id: 53,
      name: "Blush Pink Dress",
      subtitle: "Evening Dress",
      price: "2299",
      category: "Dresses",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      hoverImage: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      overlayText: "TRENDING"
    },
    {
      id: 54,
      name: "Black Crop Top",
      subtitle: "Basic Crop",
      price: "899",
      category: "Crop Tops",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241023/jme9/6718fed6f9b8ef490bd83b44/-473Wx593H-469707813-jetblack-MODEL.jpg",
    },
    {
      id: 55,
      name: "Emerald Evening Gown",
      subtitle: "Party Dress",
      price: "2599",
      category: "Dresses",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      hoverImage: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      overlayText: "BESTSELLER"
    },
    {
      id: 56,
      name: "Mint Green Crop",
      subtitle: "Summer Top",
      price: "799",
      category: "Crop Tops",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241023/jme9/6718fed6f9b8ef490bd83b44/-473Wx593H-469707813-jetblack-MODEL.jpg",
      overlayText: "SALE"
    },
    {
      id: 57,
      name: "Dark Denim Highrise",
      subtitle: "Premium Jeans",
      price: "2399",
      category: "High-Waist Jeans",
      gender: "Women",
      image: "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
      overlayText: "NEW"
    },
    {
      id: 58,
      name: "Peach Linen Dress",
      subtitle: "Casual Dress",
      price: "1899",
      category: "Dresses",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      hoverImage: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
    },
    {
      id: 59,
      name: "White Crop Tankini",
      subtitle: "Beach Top",
      price: "699",
      category: "Crop Tops",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241023/jme9/6718fed6f9b8ef490bd83b44/-473Wx593H-469707813-jetblack-MODEL.jpg",
      overlayText: "TRENDING"
    },
    {
      id: 60,
      name: "Blue Vintage Jeans",
      subtitle: "Retro Fit",
      price: "2099",
      category: "High-Waist Jeans",
      gender: "Women",
      image: "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
    },
    {
      id: 61,
      name: "Purple Pleated Dress",
      subtitle: "Formal Dress",
      price: "2799",
      category: "Dresses",
      gender: "Women",
      image: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      hoverImage: "https://assets.ajio.com/medias/sys_master/root/20241106/x7xO/672b4695260f9c41e8c2cf7d/-473Wx593H-700708629-beige-MODEL.jpg",
      overlayText: "NEW"
    }
  ];

  // 4. Filter the data dynamically
  const filteredData = useMemo(() => {
    return productData.filter(item => item.gender === activeTab);
  }, [activeTab]);

  return (
    <div className="category-wrapper">
      <div className="page-content">
        <ProductShowcase 
          // 5. Dynamic Title
          title={activeTab === 'Sneakers' ? 'Sneaker Drop' : `${activeTab}'s Collection`}
          
          // 6. Pass filtered products
          products={filteredData}
          
          // 7. Pass dynamic category pills (filters)
          categories={currentCategories}
        />
      </div>
    </div>
  );
};

export default ShowPage;