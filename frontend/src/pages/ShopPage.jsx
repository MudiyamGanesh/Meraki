// src/pages/ShopPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FilterDrawer from '../components/FilterDrawer';

const ShowPage = ({ activeTab }) => {
  const navigate = useNavigate();

  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Infinite Scroll State
  const [lastVisible, setLastVisible] = useState(null);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  // Filter Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({ sort: 'newest', sizes: [], colors: [] });

  // --- 1. INITIAL FETCH (Loads first 8 items) ---
  const fetchInitialProducts = async () => {
    setLoading(true);
    try {
      // NOTE: For complex filtering with Firebase, you will need composite indexes.
      // For now, we fetch by gender and handle basic sorting.
      let q = query(
        collection(db, "products"), 
        where("gender", "==", activeTab),
        limit(8)
      );

      const querySnapshot = await getDocs(q);
      
      const fetchedData = querySnapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
      }));

      setProducts(fetchedData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 8); 

    } catch (error) {
      console.error("Error fetching initial products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run initial fetch when tab changes or filters are applied
  useEffect(() => {
    fetchInitialProducts();
  }, [activeTab]);

  // --- 2. INFINITE SCROLL FETCH (Loads next batch) ---
  const fetchNextBatch = async () => {
    if (!lastVisible || !hasMore || fetchingMore) return;
    setFetchingMore(true);

    try {
      const q = query(
        collection(db, "products"),
        where("gender", "==", activeTab),
        startAfter(lastVisible),
        limit(8)
      );

      const querySnapshot = await getDocs(q);
      const nextData = querySnapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
      }));

      setProducts(prev => [...prev, ...nextData]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      
      // If we got fewer than 8 items back, there's nothing left in the database!
      if (querySnapshot.docs.length < 8) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setFetchingMore(false);
    }
  };

  // --- 3. INTERSECTION OBSERVER (The Invisible Sentry) ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // If the invisible div at the bottom enters the screen, fetch more!
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchNextBatch();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget, hasMore, loading, lastVisible]);


  // Apply filters trigger
  const applyFilters = () => {
    // In a production app, this would modify the Firebase query.
    // For now, it just re-triggers the initial fetch to simulate reloading.
    fetchInitialProducts(); 
  };

  return (
    <div className="shop-wrapper" style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER ROW: Title & Filter Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, letterSpacing: '1px' }}>
          {activeTab.toUpperCase()}
        </h1>
        
        <button 
          onClick={() => setIsDrawerOpen(true)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
            backgroundColor: 'transparent', border: '1px solid var(--border-color)', 
            color: 'var(--text-primary)', borderRadius: '30px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#bb86fc'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <SlidersHorizontal size={16} /> Filter & Sort
        </button>
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: '#888' }}>
          <Loader2 className="spinner" size={40} />
        </div>
      ) : (
        <>
          <div className="infinite-grid">
            {products.map(item => {
              const mainImg = item.images?.[0] || item.image || "https://via.placeholder.com/400x500";
              return (
                <div 
                  key={item.id} 
                  className="product-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="card-img-box">
                    <img src={mainImg} alt={item.name} />
                    {item.offerTag && <span className="offer-badge">{item.offerTag}</span>}
                  </div>
                  <div className="card-info">
                    <div className="card-brand">{item.subCategory || item.articleType}</div>
                    <h3 className="card-title">{item.name}</h3>
                    <div className="card-price">₹{item.price}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* THE INVISIBLE TRIGGER FOR INFINITE SCROLL */}
          <div 
            ref={observerTarget} 
            style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}
          >
            {fetchingMore && <Loader2 className="spinner" size={24} color="#bb86fc" />}
            {!hasMore && products.length > 0 && <span style={{ color: '#888', fontSize: '14px' }}>You've seen everything!</span>}
          </div>
        </>
      )}

      {/* THE HIDDEN DRAWER COMPONENT */}
      <FilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />

      {/* GRID CSS */}
      <style>{`
        .infinite-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }
        .product-card {
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        .card-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          background: #f0f0f0;
          overflow: hidden;
          border-radius: 12px;
          margin-bottom: 15px;
        }
        .card-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .card-img-box img {
          transform: scale(1.05);
        }
        .offer-badge {
          position: absolute;
          top: 15px; left: 15px;
          background: #000; color: #fff;
          padding: 6px 12px; border-radius: 4px;
          font-size: 11px; font-weight: bold; letter-spacing: 1px;
        }
        .card-brand { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .card-title { font-size: 16px; margin: 0 0 8px 0; font-weight: 500; }
        .card-price { font-size: 16px; font-weight: bold; }
        
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .infinite-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .card-title { font-size: 14px; }
          .card-price { font-size: 14px; }
        }
      `}</style>
    </div>
  );
};

export default ShowPage;