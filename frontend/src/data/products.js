// ==========================================
// 1. DATA POOLS (The raw materials)
// ==========================================

const imageSets = [
  // Set A: Black Tee (Your original)
  [
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_4788883.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_3493128.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_6004455.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1711950406_1673107.jpg?w=480&dpr=2"
  ],
  // Set B: White/Light Variant
  [
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_4788883.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_3493128.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_6004455.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1711950406_1673107.jpg?w=480&dpr=2"
  ],
  // Set C: Blue/Dark Variant
  [
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_4788883.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_3493128.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_6004455.jpg?w=480&dpr=2",
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1711950406_1673107.jpg?w=480&dpr=2"
  ]
];

const genders = ['Men', 'Women', 'Unisex'];
const articleTypes = ['T-Shirt', 'Oversized Tee', 'Hoodie', 'Sweatshirt'];
const fits = ['Oversized', 'Regular', 'Slim', 'Boxy'];
const themes = ['Anime', 'Marvel', 'Streetwear', 'Minimalist', 'Pop Culture'];
const fabrics = ['100% Cotton', 'Cotton Blend', 'Heavy Duty Cotton'];
const offerTags = ["Buy 2 Get 1", "Flat 20% Off", "New Arrival", null];
const basePrices = [799, 999, 1299, 1499];

// ==========================================
// 2. THE GENERATOR
// ==========================================

const createProduct = (index) => {
  const getCyclicValue = (array, i) => array[i % array.length];
  const seed = index * 1337; 
  const getRandomInRange = (min, max) => (seed % (max - min + 1)) + min;

  // Select attributes
  const selectedImages = getCyclicValue(imageSets, index);
  const gender = getCyclicValue(genders, index);
  const fit = getCyclicValue(fits, index);
  const theme = getCyclicValue(themes, index);
  const articleType = getCyclicValue(articleTypes, index);
  
  // Math for price
  const price = getCyclicValue(basePrices, index);
  const mrp = Math.round(price * 1.4);
  const discountPercent = Math.round(((mrp - price) / mrp) * 100);

  return {
    id: index + 1,
    
    // --- YOUR REQUESTED IMAGE STRUCTURE ---
    // Flattened directly onto the object
    image: selectedImages[0],
    image2: selectedImages[1],
    image3: selectedImages[2] || selectedImages[0], // Fallback if image 3 doesn't exist
    image4: selectedImages[3] || selectedImages[1],

    // --- YOUR REQUESTED VARIANTS STRUCTURE ---
    variants: [
        { 
            id: `v${index}-1`, 
            color: 'Black', 
            thumb: selectedImages[0], 
            mainImg: selectedImages[1] 
        },
        { 
            id: `v${index}-2`, 
            color: 'White', 
            thumb: selectedImages[0], // In a real app, these would change URL
            mainImg: selectedImages[1] 
        },
        { 
            id: `v${index}-3`, 
            color: 'Beige', 
            thumb: selectedImages[0], 
            mainImg: selectedImages[1] 
        }
    ],

    // --- CORE DETAILS (For Filtering) ---
    name: `${fit} ${theme} ${articleType}`,
    category: gender, // Matches your original "Men"
    price: price,
    
    // --- EXTRA METADATA (For Advanced Filtering) ---
    subtitle: `Premium ${fit} Collection`,
    description: `Crafted from ${getCyclicValue(fabrics, index)}...`,
    
    mrp: mrp,
    discountDisplay: `${discountPercent}% OFF`,
    offerTag: getCyclicValue(offerTags, index),
    
    fit: fit,
    theme: theme,
    fabric: getCyclicValue(fabrics, index),
    
    rating: (getRandomInRange(35, 50) / 10).toFixed(1),
    reviewCount: getRandomInRange(50, 500)
  };
};

export const sampleProducts = Array.from({ length: 100 }, (_, i) => createProduct(i));