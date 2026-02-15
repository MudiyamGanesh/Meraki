import React, { useState, useEffect, useMemo } from 'react';
import ProductShowcase from '../components/ProductShowcase';
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from '../firebase'; // Ensure this points to your firebase config

const ShowPage = ({ activeTab }) => {
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM FIREBASE ---
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // Create a query: "Get everything in 'products' where gender equals activeTab"
        const q = query(
          collection(db, "products"), 
          where("gender", "==", activeTab)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRawProducts(fetchedData);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [activeTab]); // Re-run this fetch whenever the user switches tabs!

  // --- TRANSFORM DATA FOR UI ---
  const { products, categories } = useMemo(() => {
    // 1. We skip filtering by gender here because our Firebase query already did it!

    // 2. Transform Data for the UI
    const formattedProducts = rawProducts.map(item => ({
      ...item,
      // Filter buttons will now be broad groups (Topwear, Bottomwear, etc.)
      category: item.subCategory, 
      
      // Card text will now be specific (e.g., "Oversized T-Shirt")
      subtitle: item.articleType, 
      
      overlayText: item.offerTag
    }));

    // 3. Generate Unique Categories for Filter Buttons
    // Added .filter(Boolean) just in case an item is missing a category in the DB
    const uniqueCategories = [...new Set(formattedProducts.map(p => p.category))].filter(Boolean);

    return { products: formattedProducts, categories: uniqueCategories };
  }, [rawProducts]);

  return (
    <div className="category-wrapper">
      <div className="page-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>
            Loading {activeTab}'s Collection...
          </div>
        ) : (
          <ProductShowcase 
            title={`${activeTab}'s Collection`}
            products={products}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

export default ShowPage;