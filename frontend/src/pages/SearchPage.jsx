import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this points to your firebase config
import ProductShowcase from '../components/ProductShowcase';

const SearchPage = () => {
  // Grab the "?q=something" from the URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH ENTIRE CATALOG ONCE ---
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllProducts(productsData);
      } catch (error) {
        console.error("Error fetching products for search:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []); // Only runs once when the page loads

  // --- FILTER THE CATALOG ---
  const { filteredProducts, categories } = useMemo(() => {
    if (!searchQuery) return { filteredProducts: [], categories: [] };

    const lowerQuery = searchQuery.toLowerCase().trim();

    // 1. Find matching products
    const matched = allProducts.filter(product => {
      // Check all the important fields
      const matchName = product.name?.toLowerCase().includes(lowerQuery);
      const matchCategory = product.subCategory?.toLowerCase().includes(lowerQuery);
      const matchArticle = product.articleType?.toLowerCase().includes(lowerQuery);
      const matchGender = product.gender?.toLowerCase().includes(lowerQuery);
      
      // Remember that 'keywords' array we made in your original helper function? 
      // It pays off massively right here!
      const matchKeywords = product.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery));

      return matchName || matchCategory || matchArticle || matchGender || matchKeywords;
    });

    // 2. Format them so ProductShowcase can read them correctly (just like ShowPage.jsx)
    const formattedProducts = matched.map(item => ({
      ...item,
      category: item.subCategory, // Broad grouping for the filter tabs
      subtitle: item.articleType, // Specific text for the card
      overlayText: item.offerTag
    }));

    // 3. Generate dynamic categories from the search results!
    const uniqueCategories = [...new Set(formattedProducts.map(p => p.category))].filter(Boolean);

    return { filteredProducts: formattedProducts, categories: uniqueCategories };
  }, [allProducts, searchQuery]);

  return (
    <div className="search-page-wrapper" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div className="page-content" style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div className="search-header" style={{ marginBottom: '30px' }}>
            <h1 style={{ marginBottom: '10px' }}>Search Results</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
            Showing results for: <strong>"{searchQuery}"</strong>
            </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>
            Searching...
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductShowcase 
            title={`Found ${filteredProducts.length} Item${filteredProducts.length !== 1 ? 's' : ''}`}
            products={filteredProducts}
            categories={categories}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--bg-card)', borderRadius: '12px' }}>
            <h2>No matches found</h2>
            <p style={{ color: '#888', marginTop: '10px' }}>Try checking your spelling or searching for a different term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;