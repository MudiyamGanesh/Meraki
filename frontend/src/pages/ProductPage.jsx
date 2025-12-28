import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Heart, ShoppingBag, ArrowLeft, Info, 
  Maximize2, Minimize2, Share2, Check,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';
import { useToast } from '../context/ToastContext'; 
import { sampleProducts } from '../data/products'; 
import '../css/ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast ? useToast() : { showToast: (msg) => alert(msg) };

  // --- STATE ---
  const [product, setProduct] = useState(null);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [cleanView, setCleanView] = useState(false); 
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- EFFECT: Handle Window Resize ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- EFFECT: Load Data ---
  useEffect(() => {
    window.scrollTo(0, 0); 
    setCurrentImgIndex(0);
    setQuantity(1);
    setSelectedSize(''); 

    const foundProduct = sampleProducts.find(p => p.id === parseInt(id));
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      console.log("Product not found via ID:", id);
    }
  }, [id]); 

  // --- MEMO: Gallery ---
  const galleryImages = useMemo(() => {
    if (!product) return [];
    
    const images = [
      product.image,
      product.image2,
      product.image3,
      product.image4,
    ].filter(img => img && img.length > 0);

    if (images.length === 0) {
      return ["https://dummyimage.com/600x800/e0e0e0/000000&text=No+Image"];
    }

    return images;
  }, [product]);

  if (!product) return <div className="loading-screen">Loading Product #{id}...</div>;

  const isLiked = isInWishlist(product.id);
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // --- HANDLERS ---
  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isLiked) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: product.name,
      text: `Check out this ${product.name} on Riti Streetwear!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast ? showToast("Link copied to clipboard!") : alert("Link copied!");
    }
  };

  const nextImage = (e) => {
    if(e) e.stopPropagation();
    if (galleryImages.length > 0) {
      setCurrentImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = (e) => {
    if(e) e.stopPropagation();
    if (galleryImages.length > 0) {
      setCurrentImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    }
  };

  // --- RENDER: MOBILE ---
  const renderMobile = () => (
    <div className="mobile-product-container">
      <div className="mobile-bg-image">
        <img 
          src={galleryImages[currentImgIndex]} 
          alt={product.name} 
          key={currentImgIndex} 
          className="fade-in-img"
          onError={(e) => { e.target.src = "https://dummyimage.com/600x800/e0e0e0/000000&text=Image+Error"; }}
        />
        
        <div className={`mobile-overlay-gradient ${cleanView ? 'hidden' : ''}`} />

        <div className="mobile-nav-zone left" onClick={prevImage}></div>
        <div className="mobile-nav-zone right" onClick={nextImage}></div>

        {/* CLICKABLE DOTS */}
        {!cleanView && galleryImages.length > 1 && (
          <div className="mobile-gallery-dots">
            {galleryImages.map((_, idx) => (
              <div 
                key={idx} 
                className={`dot ${currentImgIndex === idx ? 'active' : ''}`} 
                onClick={(e) => {
                  e.stopPropagation(); // Stop click from hitting the background nav zones
                  setCurrentImgIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {!cleanView && (
        <div className="mobile-top-bar">
          <button className="icon-btn-glass" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          
          <div className="top-actions">
            <button className="icon-btn-glass" onClick={handleShare}>
              <Share2 size={20} />
            </button>
            <button className="icon-btn-glass" onClick={handleWishlist}>
              <Heart 
                size={24} 
                fill={isLiked ? "#dc2626" : "transparent"} 
                color={isLiked ? "#dc2626" : "currentColor"} 
              />
            </button>
          </div>
        </div>
      )}

      <button 
        className="clean-view-toggle" 
        onClick={() => setCleanView(!cleanView)}
      >
        {cleanView ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

      {!cleanView && (
        <div className="mobile-content-layer">
          <div className="mobile-hero-text">
            <h1>{product.name}</h1>
            <p>{product.category} Collection</p>
          </div>
          <div className="mobile-bottom-actions">
            <div className="action-row">
              <button 
                className="details-trigger-btn"
                onClick={() => setShowMobileDetails(true)}
              >
                <Info size={20} /> Details
              </button>
              <button className="mobile-buy-btn" onClick={handleBuyNow}>
                Buy Now — ₹{product.price}
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className={`mobile-details-overlay ${showMobileDetails ? 'active' : ''}`} 
        onClick={() => setShowMobileDetails(false)}
      />

      <div className={`mobile-details-sheet ${showMobileDetails ? 'active' : ''}`}>
        <div className="sheet-handle" onClick={() => setShowMobileDetails(false)} />
        <div className="sheet-content">
          <div className="sheet-header">
            <h3>Select Options</h3>
            <button className="close-sheet-btn" onClick={() => setShowMobileDetails(false)}>Close</button>
          </div>
          <div className="sheet-body">
            <p className="sheet-price">₹{product.price} <span className="discount">40% OFF</span></p>
            
            <div className="sheet-rich-details">
              <p className="sheet-desc">{product.description || "Premium streetwear crafted for comfort and style."}</p>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Material</span>
                  <span className="value">100% Cotton (240 GSM)</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fit</span>
                  <span className="value">Oversized / Boxy</span>
                </div>
                <div className="detail-item">
                  <span className="label">Care</span>
                  <span className="value">Cold Wash Only</span>
                </div>
              </div>
            </div>
            
            <div className="size-selector">
              <span>Select Size:</span>
              <div className="size-grid">
                {sizes.map(size => (
                  <button 
                    key={size} 
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="sheet-qty-section">
              <span>Quantity:</span>
              <div className="sheet-qty-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button className="sheet-add-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER: DESKTOP ---
  const renderDesktop = () => (
    <div className="desktop-product-container">
      <div className="desktop-breadcrumb">
        Home / {product.category} / {product.name}
      </div>

      <div className="desktop-grid">
        <div className="desktop-gallery">
          <div className="main-image-frame">
            <button className="gallery-arrow left" onClick={prevImage}>
              <ChevronLeft size={24} />
            </button>
            
            <img 
              src={galleryImages[currentImgIndex]} 
              alt={product.name} 
              className="fade-in-img"
              onError={(e) => { e.target.src = "https://dummyimage.com/600x800/e0e0e0/000000&text=Image+Error"; }}
            />

            <button className="gallery-arrow right" onClick={nextImage}>
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="thumbnail-row">
            {galleryImages.map((img, index) => (
              <img 
                key={index}
                src={img} 
                className={`thumb ${currentImgIndex === index ? 'active' : ''}`} 
                alt={`view ${index}`}
                onClick={() => setCurrentImgIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="desktop-info">
          <div className="info-header">
            <span className="brand-tag">RITI STREETWEAR</span>
            <button className="share-btn" onClick={handleShare}>
              <Share2 size={20} />
            </button>
          </div>

          <h1 className="desktop-title">{product.name}</h1>
          
          <div className="rating-row">
            <span className="stars">★ 4.8</span> 
            <span className="reviews">| 120 Reviews</span>
          </div>

          <div className="desktop-price-block">
            <span className="current-price">₹{product.price}</span>
            <span className="original-price">₹{parseInt(product.price) * 1.4}</span>
            <span className="discount-tag">(40% OFF)</span>
            <p className="tax-note">inclusive of all taxes</p>
          </div>

          <div className="desktop-description">
            <p>{product.description || "Premium heavyweight cotton tee designed for the modern fit."}</p>
            <ul className="feature-list">
              <li>• 100% Premium Cotton</li>
              <li>• 240 GSM Heavyweight Fabric</li>
              <li>• Puff Print / Screen Print Design</li>
              <li>• Unisex Oversized Fit</li>
            </ul>
          </div>

          <div className="selector-block">
            <div className="label-row">
              <span>SELECT SIZE</span>
              <button className="size-guide-btn">Size Guide</button>
            </div>
            <div className="size-options">
              {sizes.map(size => (
                <button 
                  key={size}
                  className={`d-size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-block">
            <span>QUANTITY</span>
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="desktop-actions">
            <button className="d-add-bag-btn">
              <ShoppingBag size={20} /> ADD TO BAG
            </button>
            <button className="d-buy-now-btn" onClick={handleBuyNow}>
              BUY NOW
            </button>
          </div>

          <button className="d-wishlist-btn" onClick={handleWishlist}>
            <Heart 
              size={20} 
              fill={isLiked ? "#dc2626" : "transparent"} 
              color={isLiked ? "#dc2626" : "currentColor"} 
            /> 
            {isLiked ? 'WISHLISTED' : 'ADD TO WISHLIST'}
          </button>

          <div className="delivery-info">
             <div className="delivery-item">
               <Check size={16} /> Fast delivery within 3-5 days
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isMobile ? renderMobile() : renderDesktop();
};

export default ProductPage;