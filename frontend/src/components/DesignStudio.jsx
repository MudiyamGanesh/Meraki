import React, { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric'; 
import Cropper from 'react-easy-crop'; 
import { 
  Upload, Check, ArrowRight, X, RotateCw, RotateCcw, Scissors, 
  Type, Bold, Italic, Trash2, Move, Smile, Triangle, Circle as CircleIcon, 
  Square, Crop, Monitor, Shirt, Copy, FlipHorizontal, FlipVertical,
  ArrowUp, ArrowDown
} from 'lucide-react'; 
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

const GOOGLE_FONTS = [
  'Arial', 'Roboto', 'Oswald', 'Pacifico', 'Anton', 'Lobster', 'Dancing Script', 'Monoton', 'Bangers'
];

const EMOJI_LIST = [
  '🔥', '😎', '🤩', '💀', '👻', '👽', '🤖', '💩', '🤡',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '💔', '💯', '💢', '💥', '💫', '💦', '💤',
  '⭐', '🌟', '✨', '👑', '💎', '🏆', '🥇', '🎗️', '⚠️', '⛔', '✅',
  '🎓', '📚', '✏️', '🎨', '🎮', '🎧', '📸', '🚀', '🛸', '⚓',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🥊', '🛹', '🚴',
  '🌸', '🌹', '🌻', '🌵', '🌴', '⚡', '☀️', '🌙', '🍕', '🍔', '🍟', '🍺', '🍻'
];

// --- HELPER FUNCTION: CROP IMAGE ---
const getCroppedImg = (imageSrc, pixelCrop) => {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  return new Promise(async (resolve, reject) => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx || !pixelCrop) {
        reject(new Error("Missing crop data"));
        return;
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
      );

      resolve(canvas.toDataURL('image/png', 1.0));
    } catch (e) {
      console.error("Crop Error:", e);
      reject(e);
    }
  });
};

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

const YourOwnDesign = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [, setForceUpdate] = useState(0); 
  
  // UI States
  const [showModal, setShowModal] = useState(true);
  const [hasStarted, setHasStarted] = useState(false); 
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  
  // Cropper States
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState(null); 
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(1); 
  const [isRecropping, setIsRecropping] = useState(false);
  
  // Design Selection
  const [productType, setProductType] = useState('tshirt'); 
  const [selectedColor, setSelectedColor] = useState('black'); 
  const [viewSide, setViewSide] = useState('front'); 

  // Data
  const [designData, setDesignData] = useState({ front: null, back: null });
  const [previewImages, setPreviewImages] = useState({ front: null, back: null });
  const [rawUpload, setRawUpload] = useState(null);

  // Active Object
  const [activeObject, setActiveObject] = useState(null);
  const [currentAngle, setCurrentAngle] = useState(0); 

  // --- 1. MOBILE CHECK ---
  useEffect(() => {
    if (window.innerWidth < 1024) setShowMobileWarning(true);
  }, []);

  // --- LOAD FONTS ---
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Bangers&family=Dancing+Script&family=Lobster&family=Monoton&family=Oswald:wght@400;700&family=Pacifico&family=Roboto:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // --- INIT CANVAS ---
  useEffect(() => {
    if (!canvasRef.current) return;
    
    if (canvas) canvas.dispose();

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      height: 500,
      width: 500,
      backgroundColor: null, 
      preserveObjectStacking: true, 
      allowTouchScrolling: true, 
    });

    initCanvas.on('touch:gesture', (e) => {
        if (e.e.preventDefault) e.e.preventDefault();
        const activeObj = initCanvas.getActiveObject();
        if (!activeObj) return;

        if (e.self.state === 'start') {
            activeObj.startScale = activeObj.scaleX;
            activeObj.startAngle = activeObj.angle;
        } else if (e.self.state === 'change') {
            const newScale = activeObj.startScale * e.self.scale;
            activeObj.scale(newScale);
            const newAngle = activeObj.startAngle + e.self.rotation;
            activeObj.rotate(newAngle);
            setCurrentAngle(Math.round(newAngle));
            initCanvas.requestRenderAll();
        }
    });

    const handleSelection = (e) => {
        const selected = e.selected ? e.selected[0] : null;
        setActiveObject(selected);
        if (selected) setCurrentAngle(Math.round(selected.angle));
        setForceUpdate(prev => prev + 1);
    };

    const handleRotation = (e) => {
        if (e.target) setCurrentAngle(Math.round(e.target.angle));
    };

    initCanvas.on('selection:created', handleSelection);
    initCanvas.on('selection:updated', handleSelection);
    initCanvas.on('selection:cleared', () => {
        setActiveObject(null);
        setCurrentAngle(0);
    });
    initCanvas.on('object:rotating', handleRotation);

    setCanvas(initCanvas);
    
    return () => {
        initCanvas.dispose();
        setCanvas(null);
    }
  }, []); 

  // --- HELPER: SAVE VIEW ---
  const saveCurrentView = () => {
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 1 });
    
    const objects = canvas.getObjects();
    const hasUserObjects = objects.length > 0;

    let json = null;
    if (hasUserObjects) {
        const originalBg = canvas.backgroundImage;
        const originalClip = canvas.clipPath;
        canvas.backgroundImage = null;
        canvas.clipPath = null;
        
        json = canvas.toJSON(['data']); 
        
        canvas.backgroundImage = originalBg;
        canvas.clipPath = originalClip;
    } 

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
    saveCurrentView(); 
    setSelectedColor(newColor);
  };

  // --- RENDER ENGINE ---
  useEffect(() => {
    if (!canvas || !canvas.getElement()) return;

    const imgUrl = productData[productType]?.[selectedColor]?.[viewSide];
    
    if (imgUrl) {
        const applyBackground = () => {
            fabric.Image.fromURL(imgUrl, { crossOrigin: 'anonymous' }).then((img) => {
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

                img.clone().then((maskImg) => {
                    maskImg.set({ ...shirtConfig, absolutePositioned: true });
                    
                    canvas.backgroundImage = img;
                    canvas.clipPath = maskImg;
                    canvas.requestRenderAll();
                });
            });
        };

        canvas.clear(); 
        
        if (designData[viewSide]) {
            canvas.loadFromJSON(designData[viewSide], () => {
                applyBackground();
            });
        } else {
            applyBackground();
        }
    }
  }, [viewSide, productType, selectedColor, canvas]); 

  // --- HANDLERS ---
  const selectProduct = (type) => {
    setProductType(type);
    setSelectedColor('black'); 
    setViewSide('front');      
    setShowModal(false);
    setHasStarted(true); 
    setDesignData({ front: null, back: null });
    setPreviewImages({ front: null, back: null });
  };

  const handleCancel = () => {
    if (hasStarted) {
        setShowModal(false);
    } else {
        window.history.back(); 
    }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImage(reader.result);
        setAspect(1); 
        setIsRecropping(false);
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    e.target.value = ''; 
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels);

  const handleCropAndAdd = async () => {
    if (!croppedAreaPixels || !tempImage) {
        alert("Crop failed: No image data.");
        return;
    }

    try {
      const croppedImageBase64 = await getCroppedImg(tempImage, croppedAreaPixels);
      
      if (isRecropping && activeObject && activeObject.type === 'image') {
          activeObject.setSrc(croppedImageBase64, () => {
              canvas.requestRenderAll();
              setIsRecropping(false);
          });
      } else {
          setRawUpload(croppedImageBase64);
          fabric.Image.fromURL(croppedImageBase64, { crossOrigin: 'anonymous' }).then((img) => {
            const scale = 150 / img.width;
            img.set({ 
                scaleX: scale, scaleY: scale, originX: 'center', originY: 'center',
                data: { originalSrc: tempImage } 
            });
            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            setCurrentAngle(0);
          });
      }
      setShowCropModal(false);
      setTempImage(null);
    } catch (e) { 
        console.error("Crop error:", e);
        alert("Could not crop image.");
    }
  };

  const handleRecropInitiate = () => {
    if (!activeObject || activeObject.type !== 'image' || !activeObject.data?.originalSrc) return;
    setTempImage(activeObject.data.originalSrc);
    setAspect(1);
    setIsRecropping(true);
    setShowCropModal(true);
  };

  const handleAddText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Your Text', {
      left: 250, top: 250, 
      fontFamily: 'Roboto', 
      fill: selectedColor === 'white' ? '#000000' : '#ffffff',
      fontSize: 40, originX: 'center', originY: 'center',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    setCurrentAngle(0);
  };

  const handleAddSticker = (type, value) => {
    if (!canvas) return;
    let obj;
    const color = selectedColor === 'white' ? '#000000' : '#ffffff';

    if (type === 'emoji') {
        obj = new fabric.IText(value, {
            left: 250, top: 250, fontSize: 70, originX: 'center', originY: 'center',
            fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji'
        });
    } else if (type === 'rect') {
        obj = new fabric.Rect({
            left: 250, top: 250, width: 60, height: 60, fill: color, originX: 'center', originY: 'center'
        });
    } else if (type === 'circle') {
        obj = new fabric.Circle({
            left: 250, top: 250, radius: 35, fill: color, originX: 'center', originY: 'center'
        });
    } else if (type === 'triangle') {
        obj = new fabric.Triangle({
            left: 250, top: 250, width: 70, height: 70, fill: color, originX: 'center', originY: 'center'
        });
    }

    if (obj) {
        canvas.add(obj);
        canvas.centerObject(obj);
        canvas.setActiveObject(obj);
        setCurrentAngle(0);
        setShowStickerModal(false);
    }
  };

  const updateTextProperty = (prop, value) => {
    if (!activeObject || activeObject.type !== 'i-text') return;
    activeObject.set(prop, value);
    canvas.requestRenderAll();
  };

  // --- TOOL HANDLERS (UPDATED for Fabric v6 + Class Names) ---

  const handleLayer = (action) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj) return;

      if (action === 'forward') {
          if (typeof canvas.bringObjectToFront === 'function') {
              canvas.bringObjectToFront(activeObj);
          } else if (typeof canvas.bringToFront === 'function') {
              canvas.bringToFront(activeObj);
          } else if (typeof activeObj.bringToFront === 'function') {
              activeObj.bringToFront();
          }
      } else if (action === 'backward') {
          if (typeof canvas.sendObjectToBack === 'function') {
              canvas.sendObjectToBack(activeObj);
          } else if (typeof canvas.sendToBack === 'function') {
              canvas.sendToBack(activeObj);
          } else if (typeof activeObj.sendToBack === 'function') {
              activeObj.sendToBack();
          }
      }
      canvas.requestRenderAll();
  };

  const handleOpacity = (e) => {
      if (!activeObject) return;
      const val = parseFloat(e.target.value);
      activeObject.set('opacity', val);
      canvas.requestRenderAll();
      setForceUpdate(prev => prev + 1); 
  };

  const handleDuplicate = () => {
    if (!activeObject || !canvas) return;
    activeObject.clone().then((clonedObj) => {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 20,
            top: clonedObj.top + 20,
            evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
            clonedObj.canvas = canvas;
            clonedObj.forEachObject((obj) => canvas.add(obj));
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
  };

  const handleFlip = (axis) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj) return;

      if (axis === 'X') {
          activeObj.set('flipX', !activeObj.flipX);
      } else if (axis === 'Y') {
          activeObj.set('flipY', !activeObj.flipY);
      }
      activeObj.setCoords(); 
      canvas.requestRenderAll();
  };

  const handleRotateSlider = (e) => {
    if (!activeObject) return;
    const val = parseInt(e.target.value);
    setCurrentAngle(val); 
    activeObject.set('angle', val);
    activeObject.setCoords(); 
    canvas.requestRenderAll();
  };

  const rotate90 = (direction) => {
    if (!activeObject) return;
    const current = Math.round(activeObject.angle);
    const newVal = direction === 'cw' ? current + 90 : current - 90;
    setCurrentAngle(newVal); 
    activeObject.rotate(newVal);
    canvas.requestRenderAll();
  };

  const handleCenter = () => {
      if(!activeObject) return;
      canvas.centerObject(activeObject);
      activeObject.setCoords();
      canvas.requestRenderAll();
  };

  const handleDelete = () => {
    if (!activeObject) return;
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const handleConfirmDesign = () => { saveCurrentView(); setShowPreviewModal(true); };

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
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const getThumb = (side) => productData[productType]?.[selectedColor]?.[side];
  const boxBackgroundColor = selectedColor === 'white' ? '#222222' : '#ffffff';

  return (
    <div className="design-wrapper">
      
      {/* --- MOBILE WARNING --- */}
      {showMobileWarning && (
        <div className="modal-overlay" style={{zIndex: 5000}}>
            <div className="modal-content" style={{maxWidth:'400px', height: 'auto', padding:'30px'}}>
                <div style={{marginBottom:'20px', color:'var(--text-main)'}}>
                    <Monitor size={48} style={{margin:'0 auto 15px auto', display:'block', color:'var(--accent-active)'}} />
                    <h3 style={{fontSize:'1.2rem', marginBottom:'10px'}}>Desktop Recommended</h3>
                    <p style={{fontSize:'0.9rem', color:'var(--text-secondary)'}}>
                        For the best design experience, please use a laptop or desktop computer. Editing on mobile screens is limited.
                    </p>
                </div>
                <button className="btn-primary" style={{width:'100%'}} onClick={() => setShowMobileWarning(false)}>
                    Ignore & Continue
                </button>
            </div>
        </div>
      )}

      {/* --- CROP MODAL --- */}
      {showCropModal && (
        <div className="modal-overlay" style={{zIndex: 4000}}>
           <div className="crop-modal-content">
              <div className="crop-header">
                <h3>{isRecropping ? "Re-Crop Image" : "Crop Image"}</h3>
                <button onClick={() => setShowCropModal(false)}><X size={20} /></button>
              </div>
              <div className="crop-area">
                <Cropper
                  image={tempImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect} 
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              
              <div style={{display:'flex', justifyContent:'center', gap:'10px', padding:'10px', background:'var(--bg-primary)', borderTop:'1px solid var(--border-color)'}}>
                  <button className={`studio-btn ${aspect === 1 ? 'active' : ''}`} onClick={() => setAspect(1)}>Square</button>
                  <button className={`studio-btn ${aspect === 16/9 ? 'active' : ''}`} onClick={() => setAspect(16/9)}>Landscape</button>
                  <button className={`studio-btn ${aspect === 3/4 ? 'active' : ''}`} onClick={() => setAspect(3/4)}>Portrait</button>
              </div>

              <div className="crop-footer">
                 <button className="btn-secondary" onClick={() => setShowCropModal(false)}>Cancel</button>
                 <button className="btn-primary" onClick={handleCropAndAdd}>
                   <Scissors size={18} /> {isRecropping ? "Update" : "Crop & Add"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- STICKER MODAL --- */}
      {showStickerModal && (
        <div className="modal-overlay" style={{zIndex: 4000}}>
           <div className="crop-modal-content" style={{maxWidth:'600px', height: '500px'}}>
              <div className="crop-header">
                <h3>Add Sticker</h3>
                <button onClick={() => setShowStickerModal(false)}><X size={20} /></button>
              </div>
              <div style={{padding: '20px', overflowY: 'auto', background: 'var(--bg-input)'}}>
                 <h4 style={{margin:'0 0 10px 0', color:'var(--text-secondary)', fontSize:'0.8rem', textTransform:'uppercase'}}>Basic Shapes</h4>
                 <div className="sticker-grid" style={{marginBottom: '20px'}}>
                     <div className="sticker-item" onClick={() => handleAddSticker('rect')}><Square size={30} /></div>
                     <div className="sticker-item" onClick={() => handleAddSticker('circle')}><CircleIcon size={30} /></div>
                     <div className="sticker-item" onClick={() => handleAddSticker('triangle')}><Triangle size={30} /></div>
                 </div>
                 <h4 style={{margin:'0 0 10px 0', color:'var(--text-secondary)', fontSize:'0.8rem', textTransform:'uppercase'}}>Emoji Library</h4>
                 <div className="sticker-grid">
                     {EMOJI_LIST.map((emoji, index) => (
                        <div key={index} className="sticker-item" onClick={() => handleAddSticker('emoji', emoji)}>
                            {emoji}
                        </div>
                     ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- PRODUCT SELECT MODAL (With Smart Cancel) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ position: 'relative' }}>
            
            <button 
                className="modal-close-btn" 
                onClick={handleCancel}
                title={hasStarted ? "Cancel Change" : "Go Back Home"}
            >
                <X size={24} />
            </button>

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
                <h2 style={{margin:0}}>Review Your Design</h2>
                <button className="close-btn" onClick={() => setShowPreviewModal(false)}><X size={24} /></button>
            </div>
            <div className="preview-container">
                <div className="preview-box">
                    <h3>Front View</h3>
                    <div className="preview-frame" style={{backgroundColor: '#e2e8f0'}}>
                        {previewImages.front ? <img src={previewImages.front} alt="Front" className="preview-img" /> : <img src={getThumb('front')} alt="Front" className="preview-img" style={{opacity: 0.8}} />}
                    </div>
                </div>
                <div className="preview-box">
                    <h3>Back View</h3>
                    <div className="preview-frame" style={{backgroundColor: '#e2e8f0'}}>
                        {previewImages.back ? <img src={previewImages.back} alt="Back" className="preview-img" /> : <img src={getThumb('back')} alt="Back" className="preview-img" style={{opacity: 0.8}} />}
                    </div>
                </div>
            </div>
            <button className="btn-confirm" onClick={handlePlaceOrder}>
                <Check size={24} /> Place Order & Download Files
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN EDITOR --- */}
      
          <div className="view-sidebar">
            <div className={`view-option ${viewSide === 'front' ? 'active' : ''}`} onClick={() => switchView('front')}>
              <img src={getThumb('front')} className="view-thumb" alt="Front" />
              <span className="view-label">Front</span>
            </div>
            <div className={`view-option ${viewSide === 'back' ? 'active' : ''}`} onClick={() => switchView('back')}>
              <img src={getThumb('back')} className="view-thumb" alt="Back" />
              <span className="view-label">Back</span>
            </div>
            
            <button onClick={() => setShowModal(true)} className="changeProduct">
                <Shirt size={20} />
                <span>Change Product</span>
            </button>
          </div>

          <div className="canvas-area">
            <div className="canvas-box" style={{ backgroundColor: boxBackgroundColor }}>
              <canvas ref={canvasRef} />
            </div>
          </div>

          <div className="tools-panel">
            <div className="tools-header">
               <h2 className="text-xl font-bold capitalize">{productType} Editor</h2>
            </div>

            <div className="tools-scroll">
                <div className="tool-group">
                  <h3>Select Color</h3>
                  <div className="color-options">
                    <button className={`color-btn ${selectedColor === 'white' ? 'selected' : ''}`} style={{backgroundColor: '#fff'}} onClick={() => changeColor('white')} title="White" />
                    <button className={`color-btn ${selectedColor === 'black' ? 'selected' : ''}`} style={{backgroundColor: '#0f172a'}} onClick={() => changeColor('black')} title="Black" />
                  </div>
                </div>

                <div className="tool-group">
                  <h3>Add Elements</h3>
                  <div style={{display:'flex', gap:'10px'}}>
                      <label className="upload-btn flex-1">
                        <input type="file" hidden accept="image/*" onChange={onSelectFile} />
                        <Upload size={18} /> Image
                      </label>
                      <button className="upload-btn flex-1" onClick={handleAddText}>
                        <Type size={18} /> Text
                      </button>
                      <button className="upload-btn" style={{flex: '0.5'}} onClick={() => setShowStickerModal(true)}>
                        <Smile size={18} />
                      </button>
                  </div>
                </div>

                {/* --- UNIVERSAL TOOLS (Visible when anything is selected) --- */}
                {activeObject && (
                  <div className="edit-card" style={{marginBottom: '20px'}}>
                    <div className="card-header">
                        <span className="card-title">Tools</span>
                        <div style={{display:'flex', gap:'10px'}}>
                            <button onClick={handleDuplicate} className="text-blue-500 hover:text-blue-700" title="Duplicate"><Copy size={16}/></button>
                            <button onClick={handleDelete} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16}/></button>
                        </div>
                    </div>

                    <div className="slider-container">
                      <div className="slider-label"><span>Opacity</span><span>{Math.round((activeObject.opacity ?? 1) * 100)}%</span></div>
                      <input 
                        type="range" min="0" max="1" step="0.1"
                        value={activeObject.opacity ?? 1} 
                        onChange={handleOpacity}
                      />
                    </div>

                    <div className="studio-btn-row">
                        <button className="studio-btn" onClick={() => handleFlip('X')} title="Flip Horizontal">
                            <FlipHorizontal size={16} />
                        </button>
                        <button className="studio-btn" onClick={() => handleFlip('Y')} title="Flip Vertical">
                            <FlipVertical size={16} />
                        </button>
                    </div>
                  </div>
                )}

                {/* --- SPECIFIC TOOLS (Text Only) --- */}
                {activeObject && (activeObject.type === 'i-text') && (
                  <div className="edit-card">
                    <div className="card-header">
                        <span className="card-title">Text Style</span>
                    </div>
                    
                    <div className="slider-container">
                        <div className="slider-label"><span>Color</span></div>
                        <div className="color-dot-row">
                            {['#000000', '#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ec4899', '#8b5cf6'].map(color => (
                                <div 
                                    key={color} className="color-dot"
                                    style={{backgroundColor: color}}
                                    onClick={() => updateTextProperty('fill', color)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="slider-container">
                        <div className="slider-label"><span>Font</span></div>
                        <select className="custom-select" onChange={(e) => updateTextProperty('fontFamily', e.target.value)} value={activeObject.fontFamily}>
                            {GOOGLE_FONTS.map(font => (
                                <option key={font} value={font} style={{fontFamily: font}}>{font}</option>
                            ))}
                        </select>
                    </div>

                    <div className="studio-btn-row">
                        <button className={`studio-btn ${activeObject.fontWeight==='bold'?'active':''}`} onClick={() => updateTextProperty('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold')}>
                            <Bold size={16} />
                        </button>
                        <button className={`studio-btn ${activeObject.fontStyle==='italic'?'active':''}`} onClick={() => updateTextProperty('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic')}>
                            <Italic size={16} />
                        </button>
                        <button className="studio-btn" onClick={handleCenter} title="Center">
                            <Move size={16} />
                        </button>
                    </div>

                    <div className="slider-container" style={{marginTop:'15px'}}>
                      <div className="slider-label">
                        <span>Rotation</span>
                        <span>{currentAngle}°</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <button className="studio-btn" onClick={() => rotate90('ccw')}><RotateCcw size={14}/></button>
                          <input 
                            type="range" min="0" max="360" 
                            value={currentAngle} 
                            onChange={handleRotateSlider}
                          />
                          <button className="studio-btn" onClick={() => rotate90('cw')}><RotateCw size={14}/></button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- SPECIFIC TOOLS (Image/Shapes Only) --- */}
                {activeObject && (activeObject.type === 'image' || activeObject.type === 'rect' || activeObject.type === 'circle' || activeObject.type === 'triangle') && (
                  <div className="edit-card">
                    <div className="card-header">
                        <span className="card-title">Object Adjust</span>
                    </div>
                    
                    {activeObject.type !== 'image' && (
                        <div className="slider-container">
                            <div className="slider-label"><span>Color</span></div>
                            <div className="color-dot-row">
                                {['#000000', '#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ec4899', '#8b5cf6'].map(color => (
                                    <div 
                                        key={color} className="color-dot"
                                        style={{backgroundColor: color}}
                                        onClick={() => { activeObject.set('fill', color); canvas.requestRenderAll(); }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="slider-container">
                      <div className="slider-label">
                        <span>Rotation</span>
                        <span>{currentAngle}°</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <button className="studio-btn" onClick={() => rotate90('ccw')}><RotateCcw size={14}/></button>
                          <input 
                            type="range" min="0" max="360" 
                            value={currentAngle} 
                            onChange={handleRotateSlider}
                          />
                          <button className="studio-btn" onClick={() => rotate90('cw')}><RotateCw size={14}/></button>
                      </div>
                    </div>

                    <div className="studio-btn-row" style={{marginBottom:'15px'}}>
                        <button className="studio-btn" onClick={handleCenter} style={{width:'100%'}}>
                            <Move size={16} /> <span style={{fontSize:'0.75rem', marginLeft:'5px'}}>Center Object</span>
                        </button>
                    </div>
                    
                    {activeObject.type === 'image' && (
                      <button className="tool-action-btn mb-2" onClick={handleRecropInitiate}>
                          <Crop size={16} /> Re-Crop Image
                      </button>
                    )}
                  </div>
                )}
            </div>

            <div className="tools-footer">
               <button className="btn-confirm" onClick={handleConfirmDesign}>
                 <ArrowRight size={20} /> Confirm Design
               </button>
            </div>
          </div>
    </div>
  );
};

export default YourOwnDesign;