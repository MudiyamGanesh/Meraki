// ==========================================
// 1. THE HELPER FUNCTION
// ==========================================
const createProduct = (id, name, gender, price, mrp, images, meta = {}) => {
  // 1. Auto-Calculate Discount
  const discountVal = Math.round(((mrp - price) / mrp) * 100);
  
  return {
    id, 
    name, 
    gender, 
    price, 
    mrp, 
    discountDisplay: `${discountVal}% OFF`,
    
    // 2. Image Logic (Expects 4 images, handles fallbacks)
    image: images[0],                 // Main Card Image
    hoverImage: images[1],
    image1: images[0],
    image2: images[1],
    image3: images[2],
    image4: images[3],
    gallery: images,                  // Full Gallery (4 Images)

    // 3. Meta Data & Categories
    subCategory: meta.subCategory || "Topwear",
    articleType: meta.articleType || "T-Shirt",
    fit:         meta.fit         || "Regular Fit",
    fabric:      meta.fabric      || "100% Cotton",
    collection:  meta.collection  || "General",
    theme:       meta.theme       || "Modern",
    offerTag:    meta.offerTag    || null, 
    
    // Legacy support
    variants: meta.variants || [
        { id: `v${id}`, color: 'Default', thumb: images[0], mainImg: images[0] }
    ]
  };
};

// ==========================================
// 2. YOUR CENTRAL DATA STORE
// ==========================================
export const sampleProducts = [

  // ==========================================
  // MEN'S CATEGORY
  // ==========================================

  // --- Men: Topwear ---
  createProduct(1, "Cyberpunk Oversized Tee", "Men", 899, 1499, 
    [
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1", // Front
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1", // Back
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1", // Detail
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1"  // Lifestyle
    ], 
    { subCategory: "Topwear", articleType: "Oversized T-Shirt", theme: "Streetwear", offerTag: "Trending" }
  ),
  createProduct(2, "Classic Polo Navy", "Men", 1299, 2999, 
    [
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg"
    ], 
    { subCategory: "Topwear", articleType: "Polo T-Shirt", fit: "Slim Fit" }
  ),
  createProduct(3, "Varsity Bomber Jacket", "Men", 2499, 4999, 
    [
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg"
    ], 
    { subCategory: "Winterwear", articleType: "Jacket", offerTag: "Winter Essential" }
  ),

  // --- Men: Bottomwear ---
  createProduct(4, "Tactical Cargo Pants", "Men", 1899, 3299, 
    [
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg", 
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg"
    ], 
    { subCategory: "Bottomwear", articleType: "Cargo Pants", fit: "Relaxed Fit" }
  ),
  createProduct(5, "Urban Distressed Jeans", "Men", 2199, 3499, 
    [
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71pp0HTPCwL._AC_UY1100_.jpg"
    ], 
    { subCategory: "Bottomwear", articleType: "Jeans", fit: "Skinny Fit" }
  ),

  // --- Men: Footwear ---
  createProduct(6, "Retro High Sneakers", "Men", 3499, 6999, 
    [
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg",
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg",
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg",
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg"
    ], 
    { subCategory: "Footwear", articleType: "Sneakers", theme: "Streetwear" }
  ),

  // ==========================================
  // WOMEN'S CATEGORY
  // ==========================================

  // --- Women: Topwear ---
  createProduct(7, "Lavender Crop Hoodie", "Women", 1299, 2199, 
    [
      "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg",
      "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg",
      "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg",
      "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg"
    ], 
    { subCategory: "Topwear", articleType: "Sweatshirt", offerTag: "Bestseller" }
  ),
  createProduct(8, "Floral Summer Dress", "Men", 1899, 3299, 
    [
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg"
    ], 
    { subCategory: "Topwear", articleType: "Dress", theme: "Stranger Things" }
  ),
  createProduct(9, "Graphic Boyfriend Tee", "Women", 799, 1299, 
    [
      "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg",
      "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg",
      "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg",
      "https://www.bigw.com.au/medias/sys_master/images/images/hf4/h18/99180837109790.jpg"
    ], 
    { subCategory: "Topwear", articleType: "T-Shirt", fit: "Oversized", theme: "Stranger Things" }
  ),

  // --- Women: Bottomwear ---
  createProduct(10, "Wide Leg Denim", "Women", 2199, 3999, 
    [
      "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg"
    ], 
    { subCategory: "Bottomwear", articleType: "Jeans", fit: "Wide Leg" }
  ),
  createProduct(11, "Pleated Formal Trousers", "Women", 1599, 2499, 
    [
      "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/71chfiWGY0L._AC_UY1100_.jpg"
    ], 
    { subCategory: "Bottomwear", articleType: "Trousers", fit: "Regular Fit" }
  ),

  // --- Women: Accessories ---
  createProduct(12, "Chunky Platform Clogs", "Women", 1299, 2999, 
    [
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg",
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg",
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg",
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/JULY/29/6xDjrKNT_1c000df180b841b690cd7ac98984e554.jpg"
    ], 
    { subCategory: "Footwear", articleType: "Clogs", offerTag: "New Arrival" }
  ),
  
  // --- Stranger Things Special ---
  createProduct(13, "Hawkins High Tee", "Women", 1199, 1799, 
    [
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg",
      "https://assets.ajio.com/medias/sys_master/root/20230802/tmkK/64ca72dceebac147fca19c8a/-473Wx593H-469519486-greymarl-MODEL.jpg"
    ], 
    { subCategory: "Topwear", articleType: "Oversized T-Shirt", theme: "Stranger Things", offerTag: "Selling Fast" }
  ),
  createProduct(14, "Mind Flayer Full Sleeve", "Men", 1299, 2199, 
    [
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1",
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1",
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1",
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1761303563_1292253.jpg?w=300&dpr=1"
    ], 
    { subCategory: "Topwear", articleType: "Full Sleeve", theme: "Stranger Things" }
  )

];