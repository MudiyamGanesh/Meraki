import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Trash2, Edit, Plus, Image as ImageIcon, Upload, AlertCircle, Download, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get URL parameters for the Dashboard redirects
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterParam = searchParams.get('filter'); // 'instock' or 'outofstock'

  // --- TEMPLATE GENERATOR STATE ---
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [rowCount, setRowCount] = useState(10);

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
        alert("Failed to delete product.");
      }
    }
  };

  // --- 3. DYNAMIC CSV TEMPLATE GENERATOR ---
  const handleDownloadTemplate = (e) => {
    e.preventDefault();
    
    const count = Math.min(Math.max(Number(rowCount), 1), 500); // Enforce max 500 for Firestore limits

    const headers = [
      "id", "name", "sku", "stock", "gender", "price", "mrp", 
      "sizes", "subCategory", "articleType", "color", "fabric", 
      "fit", "theme", "offerTag", "description", 
      "image1", "image2", "image3", "image4", "image5"
    ];

    const rows = [];
    const batchId = Math.random().toString(36).substring(2, 6).toUpperCase(); 

    for (let i = 1; i <= count; i++) {
      const uniqueId = `prod_${batchId}_${i}`;
      const uniqueSku = `RT-${batchId}-${i.toString().padStart(3, '0')}`;

      rows.push([
        uniqueId, "", uniqueSku, "10", "Unisex", "", "", 
        "S, M, L, XL", "", "", "", "", 
        "", "", "", "", 
        "", "", "", "", ""
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(row => row.map(item => `"${item}"`).join(",")).join("\n"); 

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `riti_template_${count}_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowTemplateModal(false); 
  };

  // --- 4. FILTER LOGIC ---
  const filteredProducts = useMemo(() => {
    if (filterParam === 'instock') return products.filter(p => (p.stock === undefined || p.stock > 0));
    if (filterParam === 'outofstock') return products.filter(p => p.stock === 0);
    return products;
  }, [products, filterParam]);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#a0a0a5' }}>Loading Inventory...</div>;
  }

  return (
    <div className="admin-products-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* HEADER */}
      <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>Inventory Manager</h1>
          {filterParam && (
            <div style={{ color: '#bb86fc', fontSize: '14px', marginTop: '5px' }}>
              Showing: {filterParam === 'instock' ? 'In Stock Only' : 'Out of Stock Only'} 
              <Link to="/admin/products" style={{ color: '#a0a0a5', marginLeft: '10px', textDecoration: 'underline' }}>Clear Filter</Link>
            </div>
          )}
        </div>
        
        {/* ADDED 'header-buttons' CLASS FOR MOBILE STACKING */}
        <div className="header-buttons" style={{ display: 'flex', gap: '15px' }}>
          
          <button 
            onClick={() => setShowTemplateModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              backgroundColor: 'transparent', color: '#38bdf8', padding: '10px 20px', 
              borderRadius: '8px', border: '1px solid #38bdf8', fontWeight: 'bold', cursor: 'pointer' 
            }}
          >
            <Download size={18} /> Template
          </button>

          <Link 
            to="/admin/products/bulk-upload"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: '10px 20px', 
              borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', cursor: 'pointer' 
            }}
          >
            <Upload size={18} /> Bulk Upload
          </Link>
          
          <Link 
            to="/admin/products/new" 
            className="add-product-btn"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              backgroundColor: '#bb86fc', color: '#000', padding: '10px 20px', 
              borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' 
            }}
          >
            <Plus size={20} /> Add Product
          </Link>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div style={{ backgroundColor: '#16161e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <table className="products-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a1a24', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Product</th>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Category & Variants</th>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Stock & SKU</th>
              <th style={{ padding: '16px', color: '#a0a0a5' }}>Price</th>
              <th style={{ padding: '16px', color: '#a0a0a5', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#a0a0a5' }}>
                  No products found. Time to add some gear!
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const stockQty = product.stock !== undefined ? product.stock : 10;
                
                return (
                  <tr key={product.id} className="product-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    
                    {/* IMAGE & NAME */}
                    <td className="td-product" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#1a1a24', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ImageIcon size={24} color="#555" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: '#a0a0a5', marginTop: '4px' }}>{product.offerTag || 'Standard'}</div>
                      </div>
                    </td>

                    {/* CATEGORY & VARIANTS */}
                    <td className="td-category" style={{ padding: '16px', color: '#a0a0a5', fontSize: '14px' }}>
                      <span className="mobile-label">Details: </span>
                      <div>
                        <div style={{ color: '#fff', marginBottom: '4px' }}>{product.gender} • {product.subCategory}</div>
                        <div style={{ fontSize: '12px' }}>Size: {product.sizes?.join(', ') || 'N/A'}</div>
                        {product.color && <div style={{ fontSize: '12px' }}>Color: {product.color}</div>}
                      </div>
                    </td>

                    {/* STOCK & SKU CONTROL */}
                    <td className="td-stock" style={{ padding: '16px' }}>
                      <span className="mobile-label">Inventory: </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', color: stockQty === 0 ? '#ef4444' : stockQty <= 5 ? '#fbbf24' : '#4ade80' }}>
                            {stockQty} in stock
                          </span>
                          {stockQty === 0 && <AlertCircle size={14} color="#ef4444"/>}
                          {stockQty > 0 && stockQty <= 5 && <AlertCircle size={14} color="#fbbf24"/>}
                        </div>
                        <div style={{ fontSize: '12px', color: '#a0a0a5' }}>SKU: {product.sku || product.id}</div>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="td-price" style={{ padding: '16px', fontWeight: 'bold', color: '#fff' }}>
                      <span className="mobile-label">Price: </span>
                      <div>
                        ₹{product.price}
                        {product.mrp > product.price && <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '12px', marginLeft: '8px', fontWeight: 'normal' }}>₹{product.mrp}</span>}
                      </div>
                    </td>

                    {/* ACTIONS (EDIT & DELETE) */}
                    <td className="td-actions" style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Link 
                          to={`/admin/products/edit/${product.id}`} 
                          style={{ padding: '8px', backgroundColor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex' }}
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- GENERATOR MODAL --- */}
      {showTemplateModal && (
        <div style={modalOverlayStyle} onClick={() => setShowTemplateModal(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#fff' }}>Generate Bulk Template</h2>
              <button onClick={() => setShowTemplateModal(false)} style={{ background: 'none', border: 'none', color: '#a0a0a5', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <p style={{ color: '#a0a0a5', fontSize: '14px', marginBottom: '20px' }}>
              How many blank products do you want to create? We will pre-fill the CSV with perfectly sequenced, unique SKUs (e.g. RT-A4F2-001) so you can easily name your images to match.
            </p>

            <form onSubmit={handleDownloadTemplate}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
                  Number of Products (Max 500)
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="500" 
                  value={rowCount}
                  onChange={(e) => setRowCount(e.target.value)}
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#16161e', color: '#fff', fontSize: '16px', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowTemplateModal(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#38bdf8', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Download CSV</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE CSS --- */}
      <style>{`
        .mobile-label { display: none; font-weight: bold; color: #a0a0a5; margin-right: 10px; }
        
        @media (max-width: 768px) {
          .admin-header-container { flex-direction: column; align-items: flex-start !important; }
          
          /* Force header buttons to stack to 100% width on small screens */
          .header-buttons { flex-direction: column; width: 100%; gap: 10px !important; }
          .header-buttons > a, .header-buttons > button { width: 100%; justify-content: center; box-sizing: border-box; }
          
          /* Table to Card conversion */
          .products-table, .products-table tbody, .products-table tr, .products-table td { display: block; width: 100%; box-sizing: border-box; }
          .products-table thead { display: none; }
          .product-row { padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05) !important; border-radius: 12px; position: relative; background: #1a1a24; }
          .products-table td { padding: 8px 0 !important; border-bottom: none !important; text-align: left !important; }
          
          /* Flex alignment for data rows */
          .td-category, .td-stock, .td-price { display: flex; align-items: flex-start; }
          .mobile-label { display: inline-block; width: 70px; flex-shrink: 0; }
          
          /* Absolute positioning for Action buttons */
          .td-actions { position: absolute; top: 15px; right: 15px; padding: 0 !important; width: auto !important; }
          .td-product { padding-right: 80px !important; border-bottom: 1px dashed rgba(255,255,255,0.1) !important; padding-bottom: 15px !important; margin-bottom: 10px; }
        }
      `}</style>
    </div>
  );
};

// MODAL STYLES
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContentStyle = { backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', boxSizing: 'border-box' };

export default AdminProducts;