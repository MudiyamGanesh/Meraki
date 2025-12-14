import React, { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric'; 
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropUtils'; 
import { Upload, Check, ArrowRight, X, RotateCw, Scissors, Eraser } from 'lucide-react'; 
import '../css/DesignStudio.css'; 

// --- IMPORT IMAGES ---
import tWhiteFront from '../images/design/tshirt-white-front.png';
import tWhiteBack from '../images/design/tshirt-white-back.png';
import tBlackFront from '../images/design/tshirt-black-front.png';
import tBlackBack from '../images/design/tshirt-black-back.png';

import hWhiteFront from '../images/design/hoodie-white-front.png';
import hWhiteBack from '../images/design/hoodie-white-back.png';
import hBlackFront from '../images/design/hoodie-black-front.png';
import hBlackBack from '../images/design/hoodie-black-back.png';

const productData = {
  tshirt: {
    white: { front: tWhiteFront, back: tWhiteBack },
    black: { front: tBlackFront, back: tBlackBack }
  },
  hoodie: {
    white: { front: hWhiteFront, back: hWhiteBack },
    black: { front: hBlackFront, back: hBlackBack }
  }
};

const DesignStudio = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  
  // UI States
  const [showModal, setShowModal] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // --- CROPPER STATES ---
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  // Design Selection
  const [productType, setProductType] = useState('tshirt'); 
  const [selectedColor, setSelectedColor] = useState('white'); 
  const [viewSide, setViewSide] = useState('front'); 

  // Data Persistence
  const [designData, setDesignData] = useState({ front: null, back: null });
  const [previewImages, setPreviewImages] = useState({ front: null, back: null });
  const [rawUpload, setRawUpload] = useState(null);

  // Selected Object State
  const [activeObject, setActiveObject] = useState(null);

  // --- 1. INIT CANVAS ---
  useEffect(() => {
    if (showModal || !canvasRef.current) return;

    // Dispose old canvas if it exists to prevent duplicates
    if (canvas) {
      canvas.dispose();
    }

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      height: 500,
      width: 500,
      backgroundColor: '#f3f3f3', 
      preserveObjectStacking: true, 
    });

    // Listen for object selection
    const updateActiveObject = () => setActiveObject(initCanvas.getActiveObject());
    
    initCanvas.on('selection:created', updateActiveObject);
    initCanvas.on('selection:updated', updateActiveObject);
    initCanvas.on('selection:cleared', () => setActiveObject(null));

    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
    };
  }, [showModal]);

  // --- SAVE & HELPERS ---
  const saveCurrentView = () => {
    if (!canvas) return;
    const json = canvas.toJSON();
    const dataURL = canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 1 });
    setDesignData(prev => ({ ...prev, [viewSide]: json }));
    setPreviewImages(prev => ({ ...prev, [viewSide]: dataURL }));
  };

  const switchView = (newSide) => {
    if (viewSide === newSide) return;
    saveCurrentView();
    setViewSide(newSide);
  };

  const changeColor = (newColor) => {
    if (selectedColor === newColor) return;
    setSelectedColor(newColor);
    setDesignData({ front: null, back: null });
    setPreviewImages({ front: null, back: null });
    if (canvas) {
        canvas.clear();
        canvas.backgroundImage = null;
        canvas.requestRenderAll();
    }
  };

  // --- FIX: ADDED MISSING SELECT PRODUCT FUNCTION ---
  const selectProduct = (type) => {
    setProductType(type);
    setSelectedColor('white');
    setViewSide('front');
    // Reset design data for new product
    setDesignData({ front: null, back: null });
    setPreviewImages({ front: null, back: null });
    // This closes the modal!
    setShowModal(false);
  };

  // --- UPDATE BACKGROUND ---
  useEffect(() => {
    if (canvas && !showModal) {
      const imgUrl = productData[productType]?.[selectedColor]?.[viewSide];
      if (imgUrl) {
        fabric.Image.fromURL(imgUrl).then((img) => {
            const canvasSize = 500;
            const imgSize = Math.max(img.width, img.height);
            const scaleFactor = (canvasSize * 0.9) / imgSize; 
            const shirtConfig = {
              originX: 'center', originY: 'center',
              left: 250, top: 250,
              scaleX: scaleFactor, scaleY: scaleFactor,
              selectable: false, evented: false,    
            };
            img.set(shirtConfig);
            canvas.backgroundImage = null;
            canvas.backgroundImage = img;
            
            // Masking Logic
            img.clone().then((maskImg) => {
                maskImg.set({ ...shirtConfig, absolutePositioned: true });
                canvas.clipPath = maskImg;
                
                if (designData[viewSide]) {
                    canvas.loadFromJSON(designData[viewSide], () => canvas.requestRenderAll());
                } else {
                    canvas.clear();
                    canvas.backgroundImage = img;
                    canvas.clipPath = maskImg;
                    canvas.requestRenderAll();
                }
            });
        });
      }
    }
  }, [viewSide, productType, selectedColor, showModal, canvas]); 

  // --- HANDLERS: UPLOAD & CROP ---
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImage(reader.result); 
        setShowCropModal(true);      
      });
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = ''; // Reset input to allow re-uploading same file
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropAndAdd = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(tempImage, croppedAreaPixels);
      
      setRawUpload(croppedImageBase64);

      fabric.Image.fromURL(croppedImageBase64).then((img) => {
        const scale = 150 / img.width;
        img.set({ scaleX: scale, scaleY: scale });
        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      });
      
      setShowCropModal(false);
      setTempImage(null);
    } catch (e) {
      console.error(e);
    }
  };

  // --- EDITING TOOLS ---
  const handleRemoveBackground = () => {
    if (!activeObject || activeObject.type !== 'image') return;
    const filter = new fabric.Image.filters.RemoveColor({
      threshold: 0.2,
      distance: 0.5 
    });
    activeObject.filters.push(filter);
    activeObject.applyFilters();
    canvas.requestRenderAll();
  };

  const handleRotate = (e) => {
    if (!activeObject) return;
    activeObject.set('angle', parseInt(e.target.value));
    activeObject.setCoords();
    canvas.requestRenderAll();
  };

  // --- ORDER LOGIC ---
  const handleConfirmDesign = () => {
      saveCurrentView();
      setShowPreviewModal(true);
  };

  const handlePlaceOrder = () => {
    const frontDownload = previewImages.front || productData[productType][selectedColor].front;
    const backDownload = previewImages.back || productData[productType][selectedColor].back;
    downloadImage(frontDownload, `design-front-${selectedColor}.png`);
    downloadImage(backDownload, `design-back-${selectedColor}.png`);
    if (rawUpload) downloadImage(rawUpload, 'original-upload-asset.png');
    alert("Order Placed! Files have been downloaded.");
    setShowPreviewModal(false);
  };

  const downloadImage = (dataUrl, filename) => {
      if (!dataUrl) return;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const getThumb = (side) => productData[productType]?.[selectedColor]?.[side];

  // --- RENDER ---
  return (
    <div className="design-wrapper">
      
      {/* --- CROP MODAL --- */}
      {showCropModal && (
        <div className="modal-overlay" style={{zIndex: 4000}}>
           <div className="modal-content" style={{ width: '500px', height: '500px' }}>
              <h3 className="mb-4 font-bold">Crop Your Image</h3>
              <div style={{ position: 'relative', width: '100%', height: '300px', background: '#333' }}>
                <Cropper
                  image={tempImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="flex gap-4 mt-6 w-full">
                 <button 
                   className="flex-1 py-2 border rounded hover:bg-gray-100"
                   onClick={() => setShowCropModal(false)}
                 >
                   Cancel
                 </button>
                 <button 
                   className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800"
                   onClick={handleCropAndAdd}
                 >
                   <Scissors size={16} className="inline mr-2"/> Crop & Add
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- PRODUCT SELECTION MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Start Designing</h2>
            <div className="modal-options">
              <div className="option-card" onClick={() => selectProduct('tshirt')}>
                <img src={tBlackFront} alt="T-Shirt" className="modal-product-img" />
                <span className="option-label">T-Shirt</span>
              </div>
              <div className="option-card" onClick={() => selectProduct('hoodie')}>
                <img src={hWhiteFront} alt="Hoodie" className="modal-product-img" />
                <span className="option-label">Hoodie</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {showPreviewModal && (
        <div className="modal-overlay" style={{zIndex: 3000}}>
          <div className="modal-content" style={{maxWidth: '800px', width: '90%'}}>
            <div className="preview-header">
                <h2 style={{margin: 0}}>Review Your Design</h2>
                <button className="close-btn" onClick={() => setShowPreviewModal(false)}><X size={24} /></button>
            </div>
            <div className="preview-container">
                <div className="preview-box">
                    <h3>Front View</h3>
                    <div className="preview-frame">
                        {previewImages.front ? <img src={previewImages.front} alt="Front" className="preview-img" /> : <img src={getThumb('front')} alt="Front" className="preview-img" style={{opacity: 0.8}} />}
                    </div>
                </div>
                <div className="preview-box">
                    <h3>Back View</h3>
                    <div className="preview-frame">
                        {previewImages.back ? <img src={previewImages.back} alt="Back" className="preview-img" /> : <img src={getThumb('back')} alt="Back" className="preview-img" style={{opacity: 0.8}} />}
                    </div>
                </div>
            </div>
            <button className="btn-place-order" onClick={handlePlaceOrder}>
                <Check size={24} /> Place Order & Download Files
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN EDITOR --- */}
      {!showModal && (
        <>
          <div className="view-sidebar">
            <div className={`view-option ${viewSide === 'front' ? 'active' : ''}`} onClick={() => switchView('front')}>
              <img src={getThumb('front')} className="view-thumb" alt="Front" />
              <span className="view-label">Front</span>
            </div>
            <div className={`view-option ${viewSide === 'back' ? 'active' : ''}`} onClick={() => switchView('back')}>
              <img src={getThumb('back')} className="view-thumb" alt="Back" />
              <span className="view-label">Back</span>
            </div>
            <button onClick={() => setShowModal(true)} className="changeProduct">Change Product</button>
          </div>

          <div className="canvas-area">
            <div className="canvas-box">
              <canvas ref={canvasRef} />
            </div>
          </div>

          <div className="tools-panel">
            <h2 className="text-xl font-bold mb-4 capitalize">{productType} Editor</h2>

            <div className="tool-group">
              <h3>Select Color</h3>
              <div className="color-options">
                <button className={`color-btn ${selectedColor === 'white' ? 'selected' : ''}`} style={{backgroundColor: '#fff'}} onClick={() => changeColor('white')} title="White" />
                <button className={`color-btn ${selectedColor === 'black' ? 'selected' : ''}`} style={{backgroundColor: '#000'}} onClick={() => changeColor('black')} title="Black" />
              </div>
            </div>

            <div className="tool-group">
              <h3>Graphics</h3>
              <label className="upload-btn">
                <input type="file" hidden accept="image/*" onChange={onSelectFile} />
                <Upload size={20} /> Upload Image
              </label>
            </div>

            {/* --- DYNAMIC IMAGE TOOLS --- */}
            {activeObject && activeObject.type === 'image' && (
              <div className="tool-group" style={{padding: '10px', background: '#f0f0f0', borderRadius: '8px'}}>
                <h3 style={{color: '#333'}}>Image Tools</h3>
                
                <div className="mb-3">
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <RotateCw size={12}/> Rotate
                  </label>
                  <input 
                    type="range" min="0" max="360" 
                    value={activeObject.angle || 0} 
                    onChange={handleRotate}
                    className="w-full"
                  />
                </div>

                <button 
                  className="w-full py-2 bg-white border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2"
                  onClick={handleRemoveBackground}
                >
                  <Eraser size={14} /> Remove White BG
                </button>
              </div>
            )}

            <button className="btn-confirm" onClick={handleConfirmDesign}>
              <ArrowRight size={18} /> Confirm Design
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DesignStudio;