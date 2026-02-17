import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Save, ArrowLeft, Image as ImageIcon, UploadCloud } from 'lucide-react';

const AdminProductForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // --- CLOUDINARY CONFIG (Put your details here!) ---
  const CLOUD_NAME = "dyevbrysx"; 
  const UPLOAD_PRESET = "riti_store"; 

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  
  // New states to show a loading spinner while images upload
  const [uploadingImg1, setUploadingImg1] = useState(false);
  const [uploadingImg2, setUploadingImg2] = useState(false);

  const [formData, setFormData] = useState({
    id: '', 
    name: '',
    gender: 'Unisex',
    price: '',
    mrp: '',
    subCategory: 'Topwear',
    articleType: 'T-Shirt',
    fit: 'Regular Fit',
    fabric: '100% Cotton',
    theme: '',
    offerTag: '',
    sizes: 'S, M, L, XL, XXL', 
    image1: '', 
    image2: '',
    description: ''
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
              image1: data.images?.[0] || '',
              image2: data.images?.[1] || '',
              description: data.description || '', 
              theme: data.theme || '',             
              offerTag: data.offerTag || '',       
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

  // --- THE CLOUDINARY UPLOAD MAGIC ---
  const handleImageUpload = async (e, imageField) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set the correct loading state
    if (imageField === 'image1') setUploadingImg1(true);
    if (imageField === 'image2') setUploadingImg2(true);

    // Build the payload for Cloudinary
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
      // POST the image directly to Cloudinary's API
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });

      const uploadedImage = await response.json();

      if (uploadedImage.secure_url) {
        // Drop the new URL into our form data so it gets saved to Firebase!
        setFormData(prev => ({ ...prev, [imageField]: uploadedImage.secure_url }));
      } else {
        alert("Failed to upload image to Cloudinary.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong uploading the image.");
    } finally {
      if (imageField === 'image1') setUploadingImg1(false);
      if (imageField === 'image2') setUploadingImg2(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const priceNum = Number(formData.price);
      const mrpNum = Number(formData.mrp);
      const discountVal = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

      const searchKeywords = [
        ...formData.name.toLowerCase().split(" "),
        formData.gender.toLowerCase(),
        formData.subCategory.toLowerCase(),
        formData.articleType.toLowerCase(),
        formData.theme.toLowerCase()
      ].filter(Boolean);

      const finalProductData = {
        name: formData.name,
        gender: formData.gender,
        price: priceNum,
        mrp: mrpNum,
        discountDisplay: discountVal > 0 ? `${discountVal}% OFF` : null,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        images: [formData.image1, formData.image2].filter(Boolean),
        subCategory: formData.subCategory,
        articleType: formData.articleType,
        fit: formData.fit,
        fabric: formData.fabric,
        theme: formData.theme || '',
        offerTag: formData.offerTag || '',
        description: formData.description || '',
        keywords: searchKeywords,
        inStock: true,
        updatedAt: new Date().toISOString()
      };

      if (!isEditMode) {
        finalProductData.createdAt = new Date().toISOString();
      }

      const targetId = isEditMode ? id : formData.id;
      
      if (!targetId) {
        alert("Please provide a Product ID!");
        setSaving(false);
        return;
      }

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

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Product Data...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '50px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>
          {isEditMode ? `Edit Product: ${formData.name}` : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* SECTION 1: Basic Info */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Basic Information</h3>
          <div style={gridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product ID (Unique)*</label>
              <input type="text" name="id" value={formData.id} onChange={handleChange} required disabled={isEditMode} style={inputStyle} placeholder="e.g., 15" />
              {isEditMode && <small style={{color: '#888'}}>ID cannot be changed after creation.</small>}
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
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
              <label style={labelStyle}>Available Sizes (Comma separated)</label>
              <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} style={inputStyle} placeholder="S, M, L, XL" />
            </div>
          </div>
        </div>

        {/* SECTION 3: Metadata */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Classification & Details</h3>
          <div style={gridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Sub-Category (e.g. Topwear)</label>
              <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Article Type (e.g. T-Shirt, Jeans)</label>
              <input type="text" name="articleType" value={formData.articleType} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Theme/Collection</label>
              <input type="text" name="theme" value={formData.theme} onChange={handleChange} style={inputStyle} placeholder="e.g. Stranger Things" />
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
              <label style={labelStyle}>Offer Tag (Badge)</label>
              <input type="text" name="offerTag" value={formData.offerTag} onChange={handleChange} style={inputStyle} placeholder="e.g. Bestseller" />
            </div>
          </div>
        </div>

        {/* SECTION 4: CLOUDINARY FILE UPLOADS */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Product Images</h3>
          <div style={gridStyle}>
            
            {/* Main Image Uploader */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Main Image {uploadingImg1 && <span style={{color: '#bb86fc'}}>(Uploading...)</span>}
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'image1')} 
                style={inputStyle} 
              />
              {/* Fallback to paste URL if needed */}
              <input type="url" name="image1" value={formData.image1} onChange={handleChange} style={{...inputStyle, marginTop: '8px', fontSize: '12px'}} placeholder="Or paste image URL here..." />
            </div>

            {/* Hover Image Uploader */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Hover Image {uploadingImg2 && <span style={{color: '#bb86fc'}}>(Uploading...)</span>}
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'image2')} 
                style={inputStyle} 
              />
              <input type="url" name="image2" value={formData.image2} onChange={handleChange} style={{...inputStyle, marginTop: '8px', fontSize: '12px'}} placeholder="Or paste image URL here..." />
            </div>
          </div>
          
          {/* Quick Image Preview */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            {formData.image1 && (
              <div style={{position: 'relative'}}>
                <img src={formData.image1} alt="Main" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #eee' }} />
                <div style={{position: 'absolute', bottom: -20, left: 0, fontSize: '12px', color: '#666'}}>Main</div>
              </div>
            )}
            {formData.image2 && (
              <div style={{position: 'relative'}}>
                <img src={formData.image2} alt="Hover" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #eee' }} />
                <div style={{position: 'absolute', bottom: -20, left: 0, fontSize: '12px', color: '#666'}}>Hover</div>
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button 
            type="submit" 
            disabled={saving || uploadingImg1 || uploadingImg2}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              backgroundColor: '#bb86fc', color: '#000', padding: '15px 30px', 
              borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px',
              cursor: (saving || uploadingImg1 || uploadingImg2) ? 'not-allowed' : 'pointer', 
              opacity: (saving || uploadingImg1 || uploadingImg2) ? 0.7 : 1
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
const sectionStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const sectionTitleStyle = { margin: '0 0 20px 0', fontSize: '18px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#444' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', backgroundColor: '#fafafa' };

export default AdminProductForm;