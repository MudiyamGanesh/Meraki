import React, { useMemo } from 'react';
import ProductShowcase from '../components/ProductShowcase';
import { sampleProducts } from '../data/products.js'; 

const ShowPage = ({ activeTab }) => {
  
  const { products, categories } = useMemo(() => {
    
    // 1. Filter by Gender
    const rawData = sampleProducts.filter(item => item.gender === activeTab);

    // 2. Transform Data for the UI
    const formattedProducts = rawData.map(item => ({
      ...item,
      // FIX: Swapped the mapping for better UX
      // Filter buttons will now be broad groups (Topwear, Bottomwear, etc.)
      category: item.subCategory, 
      
      // Card text will now be specific (e.g., "Oversized T-Shirt")
      subtitle: item.articleType, 
      
      overlayText: item.offerTag
    }));

    // 3. Generate Unique Categories for Filter Buttons
    const uniqueCategories = [...new Set(formattedProducts.map(p => p.category))];

    return { products: formattedProducts, categories: uniqueCategories };
  }, [activeTab]);

  return (
    <div className="category-wrapper">
      <div className="page-content">
        <ProductShowcase 
          title={`${activeTab}'s Collection`}
          products={products}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default ShowPage;