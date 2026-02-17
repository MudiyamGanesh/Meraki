import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Trash2, Edit, Plus, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. READ: Fetch all products from Firebase ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- 2. DELETE: Remove product from Firebase ---
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete "${name}"?`);
    
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter(product => product.id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Check console.");
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Inventory...</div>;
  }

  return (
    <div className="admin-products-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>Inventory Manager</h1>
        
        <Link 
          to="/admin/products/new" 
          className="add-product-btn"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            backgroundColor: '#bb86fc', color: '#000', padding: '10px 20px', 
            borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' 
          }}
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      {/* PRODUCTS TABLE */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table className="products-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '16px', color: '#666' }}>Product</th>
              <th style={{ padding: '16px', color: '#666' }}>Category</th>
              <th style={{ padding: '16px', color: '#666' }}>Price</th>
              <th style={{ padding: '16px', color: '#666', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  No products found. Time to add some gear!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="product-row" style={{ borderBottom: '1px solid #eee' }}>
                  
                  {/* IMAGE & NAME */}
                  <td className="td-product" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ImageIcon size={24} color="#ccc" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>{product.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>ID: {product.id}</div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="td-category" style={{ padding: '16px', color: '#555' }}>
                    <span className="mobile-label">Category: </span>
                    {product.gender} • {product.subCategory || product.articleType}
                  </td>

                  {/* PRICE */}
                  <td className="td-price" style={{ padding: '16px', fontWeight: 'bold', color: '#333' }}>
                    <span className="mobile-label">Price: </span>
                    ₹{product.price}
                  </td>

                  {/* ACTIONS (EDIT & DELETE) */}
                  <td className="td-actions" style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <Link 
                        to={`/admin/products/edit/${product.id}`} 
                        style={{ padding: '8px', backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex' }}
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        style={{ padding: '8px', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- RESPONSIVE CSS --- */}
      <style>{`
        .mobile-label {
          display: none;
          font-weight: bold;
          color: #888;
          margin-right: 5px;
        }

        @media (max-width: 768px) {
          /* Stack the header */
          .admin-header-container {
            flex-direction: column;
            align-items: stretch !important;
            gap: 15px;
          }
          .add-product-btn {
            justify-content: center;
          }

          /* Force table to not behave like a table */
          .products-table, 
          .products-table tbody, 
          .products-table tr, 
          .products-table td {
            display: block;
            width: 100%;
          }

          /* Hide table headers (but not display: none, for accessibility) */
          .products-table thead {
            display: none;
          }

          /* Turn rows into cards */
          .product-row {
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid #eaeaea !important;
            border-radius: 12px;
            position: relative;
            background: #fff;
          }

          /* Adjust cells inside the card */
          .products-table td {
            padding: 8px 0 !important;
            border-bottom: none !important;
            text-align: left !important;
          }

          /* Position Actions in the top right corner of the card */
          .td-actions {
            position: absolute;
            top: 15px;
            right: 15px;
            padding: 0 !important;
            width: auto !important;
          }

          /* Prevent product name from overlapping actions */
          .td-product {
            padding-right: 80px !important;
          }

          /* Show the mobile labels (e.g., "Price: ₹2000") */
          .mobile-label {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProducts;