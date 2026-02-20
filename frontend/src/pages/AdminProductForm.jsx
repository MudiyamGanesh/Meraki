import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const AdminProductForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // --- CLOUDINARY CONFIG ---
  const CLOUD_NAME = "dyevbrysx"; 
  const UPLOAD_PRESET = "riti_store"; 

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  
  // Cleaned up the uploading states into a single object
  const [uploadingImg, setUploadingImg] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false });

  const [formData, setFormData] = useState({
    id: '', name: '', sku: '', stock: 10, gender: 'Unisex', price: '', mrp: '',
    subCategory: 'Topwear', articleType: 'T-Shirt', fit: 'Regular Fit',
    fabric: '100% Cotton', color: '', theme: '', offerTag: '',
    sizes: 'S, M, L, XL, XXL', description: '',
    image1: '', image2: '', image3: '', image4: '', image5: '' // 5 Images!
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              ...data,
              id: docSnap.id,
              sizes: data.sizes ? data.sizes.join(', ') : 'S, M, L, XL, XXL',
              // Map array back to individual states
              image1: data.images?.[0] || '',
              image2: data.images?.[1] || '',
              image3: data.images?.[2] || '',
              image4: data.images?.[3] || '',
              image5: data.images?.[4] || '',
              description: data.description || '', theme: data.theme || '',             
              offerTag: data.offerTag || '', sku: data.sku || '',
              stock: data.stock !== undefined ? data.stock : 10,
              color: data.color || ''
            });
          } else {
            alert("Product not found!");
            navigate('/admin/products');
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, navigate, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- SMART CLOUDINARY UPLOAD ---
  const handleImageUpload = async (e, imageNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(prev => ({ ...prev, [imageNumber]: true }));

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });

      const uploadedImage = await response.json();

      if (uploadedImage.secure_url) {
        setFormData(prev => ({ ...prev, [`image${imageNumber}`]: uploadedImage.secure_url }));
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong uploading the image.");
    } finally {
      setUploadingImg(prev => ({ ...prev, [imageNumber]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const priceNum = Number(formData.price);
      const mrpNum = Number(formData.mrp);
      const stockNum = Number(formData.stock); 
      const discountVal = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

      const searchKeywords = [
        ...formData.name.toLowerCase().split(" "),
        formData.gender.toLowerCase(), formData.subCategory.toLowerCase(),
        formData.articleType.toLowerCase(), formData.theme.toLowerCase(),
        formData.color.toLowerCase()
      ].filter(Boolean);

      const finalProductData = {
        name: formData.name,
        sku: formData.sku || formData.id, 
        stock: stockNum,
        gender: formData.gender,
        price: priceNum,
        mrp: mrpNum,
        discountDisplay: discountVal > 0 ? `${discountVal}% OFF` : null,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        // Combines all 5 images, filtering out any empty slots!
        images: [formData.image1, formData.image2, formData.image3, formData.image4, formData.image5].filter(Boolean),
        subCategory: formData.subCategory,
        articleType: formData.articleType,
        fit: formData.fit,
        fabric: formData.fabric,
        color: formData.color,
        theme: formData.theme || '',
        offerTag: formData.offerTag || '',
        description: formData.description || '',
        keywords: searchKeywords,
        inStock: stockNum > 0, 
        updatedAt: new Date().toISOString()
      };

      if (!isEditMode) {
        finalProductData.createdAt = new Date().toISOString();
      }

      const targetId = isEditMode ? id : formData.id;
      if (!targetId) { alert("Please provide a Product ID!"); setSaving(false); return; }

      const docRef = doc(db, "products", targetId.toString());
      await setDoc(docRef, finalProductData, { merge: true });

      alert(`Product successfully ${isEditMode ? 'updated' : 'added'}!`);
      navigate('/admin/products');

    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#a0a0a5' }}>Loading Product Data...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#fff' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#fff' }}>
          {isEditMode ? `Edit Product: ${formData.name}` : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* SECTION 1: Basic Info */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Basic Information</h3>
          <div style={gridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product ID (Unique Database ID)*</label>
              <input type="text" name="id" value={formData.id} onChange={handleChange} required disabled={isEditMode} style={inputStyle} placeholder="e.g., prod_123" />
              {isEditMode && <small style={{color: '#888', fontSize: '12px'}}>ID cannot be changed after creation.</small>}
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>SKU (Stock Keeping Unit)</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} style={inputStyle} placeholder="e.g., RT-M-TS-BLK-01" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Target Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>
          <div style={{...inputGroupStyle, marginTop: '15px'}}>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={{...inputStyle, minHeight: '100px'}} />
          </div>
        </div>

        {/* SECTION 2: Pricing & Inventory */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Pricing & Inventory</h3>
          <div style={gridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Selling Price (₹)*</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Original MRP (₹)*</label>
              <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Stock Quantity*</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={inputStyle} min="0" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Available Sizes (Comma separated)</label>
              <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} style={inputStyle} placeholder="S, M, L, XL" />
            </div>
          </div>
        </div>

        {/* SECTION 3: Metadata */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Classification & Variants</h3>
          <div style={gridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Sub-Category</label>
              <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} style={inputStyle} placeholder="e.g. Topwear" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Article Type</label>
              <input type="text" name="articleType" value={formData.articleType} onChange={handleChange} style={inputStyle} placeholder="e.g. T-Shirt, Jeans" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Color Family</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} style={inputStyle} placeholder="e.g. Black" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Fabric</label>
              <input type="text" name="fabric" value={formData.fabric} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Fit</label>
              <input type="text" name="fit" value={formData.fit} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Theme/Collection</label>
              <input type="text" name="theme" value={formData.theme} onChange={handleChange} style={inputStyle} placeholder="e.g. Stranger Things" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Offer Tag (Badge)</label>
              <input type="text" name="offerTag" value={formData.offerTag} onChange={handleChange} style={inputStyle} placeholder="e.g. Bestseller, 20% OFF" />
            </div>
          </div>
        </div>

        {/* SECTION 4: DYNAMIC 5-IMAGE UPLOADER */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Product Images (Up to 5)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <div style={inputGroupStyle} key={`img-upload-${num}`}>
                <label style={labelStyle}>
                  Image {num} {num === 1 ? '(Main)' : num === 2 ? '(Hover)' : ''} 
                  {uploadingImg[num] && <span style={{color: '#bb86fc', marginLeft: '5px'}}>(Uploading...)</span>}
                </label>
                <input 
                  type="file" accept="image/*" 
                  onChange={(e) => handleImageUpload(e, num)} 
                  style={inputStyle} 
                />
                <input 
                  type="url" name={`image${num}`} 
                  value={formData[`image${num}`]} 
                  onChange={handleChange} 
                  style={{...inputStyle, marginTop: '4px', fontSize: '12px'}} 
                  placeholder="Or paste URL..." 
                />
              </div>
            ))}
          </div>
          
          {/* Quick Image Preview Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              formData[`image${num}`] ? (
                <div key={`img-preview-${num}`} style={{position: 'relative', width: '90px'}}>
                  <img 
                    src={formData[`image${num}`]} 
                    alt={`Preview ${num}`} 
                    style={{ width: '90px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} 
                  />
                  <div style={{position: 'absolute', bottom: -22, left: 0, width: '100%', textAlign: 'center', fontSize: '11px', color: '#a0a0a5', fontWeight: 'bold'}}>
                    IMG {num}
                  </div>
                </div>
              ) : null
            ))}
            {/* Show a placeholder if no images exist yet */}
            {!formData.image1 && !formData.image2 && !formData.image3 && !formData.image4 && !formData.image5 && (
              <div style={{ color: '#555', fontSize: '14px', fontStyle: 'italic', padding: '10px' }}>No images uploaded yet.</div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button 
            type="submit" 
            disabled={saving || Object.values(uploadingImg).some(status => status)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              backgroundColor: '#bb86fc', color: '#000', padding: '15px 30px', 
              borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px',
              cursor: (saving || Object.values(uploadingImg).some(status => status)) ? 'not-allowed' : 'pointer', 
              opacity: (saving || Object.values(uploadingImg).some(status => status)) ? 0.7 : 1
            }}
          >
            {saving ? 'Saving to Database...' : <><Save size={20} /> Save Product</>}
          </button>
        </div>

      </form>
    </div>
  );
};

// --- STYLES ---
const sectionStyle = { backgroundColor: '#16161e', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' };
const sectionTitleStyle = { margin: '0 0 20px 0', fontSize: '18px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#a0a0a5' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '15px', outline: 'none', backgroundColor: '#1a1a24', color: '#fff' };

export default AdminProductForm;