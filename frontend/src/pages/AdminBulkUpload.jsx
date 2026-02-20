import React, { useState } from 'react';
import Papa from 'papaparse';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { UploadCloud, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminBulkUpload = () => {
  const navigate = useNavigate();

  // --- CLOUDINARY CONFIG ---
  const CLOUD_NAME = "dyevbrysx"; 
  const UPLOAD_PRESET = "riti_store"; 

  // --- STATES ---
  const [csvData, setCsvData] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState({ current: 0, total: 0, log: '' });

  // 1. HANDLE CSV UPLOAD
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Filter out any rows that don't have an SKU (safeguard)
        const validRows = results.data.filter(row => row.sku);
        setCsvData(validRows);
      }
    });
  };

  // 2. HANDLE MULTIPLE IMAGES UPLOAD
  const handleImageUpload = (e) => {
    // Convert FileList object into a standard array
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  // 3. UPLOAD SINGLE IMAGE TO CLOUDINARY (Helper Function)
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result.secure_url;
  };

  // 4. THE MASTER SYNC FUNCTION
  const startSmartSync = async () => {
    if (csvData.length === 0) {
      alert("Please upload a valid CSV file first.");
      return;
    }

    setStatus('processing');
    setProgress({ current: 0, total: csvData.length, log: 'Initializing batch...' });

    try {
      // Create a Firestore batch (allows up to 500 writes at once securely)
      const batch = writeBatch(db);
      
      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        const currentSku = row.sku.trim();
        setProgress({ current: i + 1, total: csvData.length, log: `Processing: ${row.name || currentSku}` });

        // A. Find all local images that start with this SKU
        const matchedImages = imageFiles.filter(img => img.name.startsWith(currentSku));
        
        // Sort them so -1.jpg is before -2.jpg
        matchedImages.sort((a, b) => a.name.localeCompare(b.name));

        // B. Upload matched images to Cloudinary
        const cloudinaryUrls = [];
        for (const img of matchedImages) {
          const url = await uploadToCloudinary(img);
          if (url) cloudinaryUrls.push(url);
        }

        // C. Format numbers and keywords for Firebase
        const priceNum = Number(row.price) || 0;
        const mrpNum = Number(row.mrp) || 0;
        const discountVal = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
        const stockNum = Number(row.stock) || 0;

        const searchKeywords = [
          ...row.name.toLowerCase().split(" "),
          row.gender?.toLowerCase(),
          row.subCategory?.toLowerCase(),
          row.articleType?.toLowerCase(),
          row.color?.toLowerCase()
        ].filter(Boolean);

        // D. Build the final product document
        const finalProduct = {
          name: row.name,
          sku: currentSku,
          stock: stockNum,
          gender: row.gender || 'Unisex',
          price: priceNum,
          mrp: mrpNum,
          discountDisplay: discountVal > 0 ? `${discountVal}% OFF` : null,
          sizes: row.sizes ? row.sizes.split(',').map(s => s.trim()) : [],
          images: cloudinaryUrls, // Dynamic array of uploaded images!
          subCategory: row.subCategory || '',
          articleType: row.articleType || '',
          fit: row.fit || '',
          fabric: row.fabric || '',
          color: row.color || '',
          theme: row.theme || '',
          offerTag: row.offerTag || '',
          description: row.description || '',
          keywords: searchKeywords,
          inStock: stockNum > 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // E. Add to Firestore Batch (Using an auto-generated ID)
        const newProductRef = doc(collection(db, "products"));
        batch.set(newProductRef, finalProduct);
      }

      // F. Commit the massive batch to the database all at once!
      setProgress(prev => ({ ...prev, log: 'Committing to database...' }));
      await batch.commit();

      setStatus('success');
      setProgress(prev => ({ ...prev, log: 'Upload Complete!' }));

    } catch (error) {
      console.error("Bulk Upload Error:", error);
      setStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '50px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UploadCloud color="#bb86fc" /> Smart Batch Uploader
        </h1>
        <p style={{ color: '#a0a0a5', marginTop: '8px' }}>Upload a CSV data file and all your raw images. We will automatically match the SKUs, upload media to Cloudinary, and sync to Firebase.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* DROPZONE 1: CSV FILE */}
        <div style={dropzoneStyle}>
          <FileText size={40} color="#38bdf8" style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>1. Upload CSV Data</h3>
          <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ width: '100%', color: '#a0a0a5' }} />
          {csvData.length > 0 && (
            <div style={{ marginTop: '15px', color: '#4ade80', fontSize: '13px', fontWeight: 'bold' }}>
              <CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }}/> Found {csvData.length} valid products
            </div>
          )}
        </div>

        {/* DROPZONE 2: IMAGES */}
        <div style={dropzoneStyle}>
          <ImageIcon size={40} color="#fbbf24" style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>2. Upload Local Images</h3>
          <p style={{ fontSize: '12px', color: '#888', marginTop: 0 }}>Images must start with the exact SKU (e.g. SKU-1.jpg, SKU-2.jpg)</p>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ width: '100%', color: '#a0a0a5' }} />
          {imageFiles.length > 0 && (
            <div style={{ marginTop: '15px', color: '#4ade80', fontSize: '13px', fontWeight: 'bold' }}>
              <CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }}/> Loaded {imageFiles.length} images ready for matching
            </div>
          )}
        </div>
      </div>

      {/* SYNC BUTTON & PROGRESS */}
      <div style={{ backgroundColor: '#16161e', padding: '30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        
        {status === 'idle' && (
          <button 
            onClick={startSmartSync}
            disabled={csvData.length === 0}
            style={{ 
              backgroundColor: csvData.length > 0 ? '#bb86fc' : '#333', color: csvData.length > 0 ? '#000' : '#888', 
              padding: '15px 40px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', 
              cursor: csvData.length > 0 ? 'pointer' : 'not-allowed', transition: '0.2s'
            }}
          >
            Start Smart Sync
          </button>
        )}

        {status === 'processing' && (
          <div>
            <Loader2 className="spinner" size={40} color="#bb86fc" style={{ margin: '0 auto 20px auto', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ color: '#fff', margin: 0 }}>Syncing... Do not close window.</h3>
            <p style={{ color: '#a0a0a5', fontSize: '14px' }}>Product {progress.current} of {progress.total}</p>
            <div style={{ color: '#bb86fc', fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#0a0a0f', padding: '10px', borderRadius: '6px', width: 'fit-content', margin: '15px auto 0' }}>
                {progress.log}
            </div>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle size={50} color="#4ade80" style={{ margin: '0 auto 20px auto' }} />
            <h3 style={{ color: '#4ade80', margin: '0 0 10px 0' }}>Upload Successful!</h3>
            <p style={{ color: '#a0a0a5', fontSize: '14px' }}>Successfully added {csvData.length} products to your database.</p>
            <button 
              onClick={() => navigate('/admin/products')}
              style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #4ade80', color: '#4ade80', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              View Inventory
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <AlertTriangle size={50} color="#f87171" style={{ margin: '0 auto 20px auto' }} />
            <h3 style={{ color: '#f87171', margin: '0 0 10px 0' }}>Upload Failed</h3>
            <p style={{ color: '#a0a0a5', fontSize: '14px' }}>Check the developer console for exact error details.</p>
            <button 
              onClick={() => setStatus('idle')}
              style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #f87171', color: '#f87171', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Try Again
            </button>
          </div>
        )}

      </div>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// --- STYLES ---
const dropzoneStyle = {
  backgroundColor: '#1a1a24',
  border: '2px dashed rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '30px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.2s ease'
};

export default AdminBulkUpload;