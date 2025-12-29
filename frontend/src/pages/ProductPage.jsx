import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Heart, ShoppingBag, ArrowLeft, 
  Maximize2, Minimize2, Share2, Check,
  ChevronLeft, ChevronRight, ChevronDown, X 
} from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';
import { useToast } from '../context/ToastContext'; 
import { sampleProducts } from '../data/products'; 
import '../css/ProductPage.css';

// --- INTERNAL COMPONENT: Recommendation Card (Unchanged) ---
const ProductCard = ({ data }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(data.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) removeFromWishlist(data.id);
    else addToWishlist(data);
  };

  const handleCardClick = () => {
    navigate(`/product/${data.id}`);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="recommendation-card" onClick={handleCardClick}>
      <div className="rec-image-wrapper">
        <img src={data.image} alt={data.name} className="rec-img-main" />
        {data.hoverImage && (
          <img src={data.hoverImage} alt={data.name} className="rec-img-hover" />
        )}
        <button className="rec-wishlist-btn" onClick={handleWishlistClick}>
          <Heart 
            size={16}
            fill={isLiked ? "#dc2626" : "transparent"} 
            color={isLiked ? "#dc2626" : "#4A5568"} 
          />
        </button>
      </div>
      <div className="rec-details">
        <h3 className="rec-title">{data.name}</h3>
        <p className="rec-subtitle">{data.category}</p>
        <span className="rec-price">₹{data.price}</span>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast ? useToast() : { showToast: (msg) => alert(msg) };

  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cleanView, setCleanView] = useState(false); 
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // --- REFS ---
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  // NEW: Ref for Desktop Recommendations Scroll
  const desktopOthersScrollRef = useRef(null);

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
    setShowScrollIndicator(true);

    const foundProduct = sampleProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]); 

  // --- MEMO: Gallery & Recommendations ---
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const images = [product.image, product.image2, product.image3, product.image4, product.image5].filter(img => img && img.length > 0);
    return images.length > 0 ? images : ["https://dummyimage.com/600x800/e0e0e0/000000&text=No+Image"];
  }, [product]);

  // Used 8 items here to ensure scrolling is necessary for testing
  const recommendations = useMemo(() => {
    if (!product) return [];
    const otherProducts = sampleProducts.filter(p => p.id !== product.id);
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
    // Increased to 8 so scrolling is obvious on desktop
    return shuffled.slice(0, 8); 
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
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: 'Check this out!', url: window.location.href }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast ? showToast("Link copied!") : alert("Link copied!");
    }
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop > 50) {
      setShowScrollIndicator(false);
    } else {
      setShowScrollIndicator(true);
    }
  };

  // --- MAIN GALLERY NAVIGATION & SWIPE ---
  const nextImage = (e) => {
    if(e) e.stopPropagation();
    if (galleryImages.length > 0) setCurrentImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    if(e) e.stopPropagation();
    if (galleryImages.length > 0) setCurrentImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (!touchStartX.current || !touchStartY.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) nextImage();
        else prevImage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // --- NEW: DESKTOP RECOMMENDATION SCROLL HANDLERS ---
  const scrollDesktopOthersLeft = () => {
    if (desktopOthersScrollRef.current) {
      // Scroll left by roughly 2 card widths (240px + 20px gap) * 2 = 520
      desktopOthersScrollRef.current.scrollBy({ left: -520, behavior: 'smooth' });
    }
  };

  const scrollDesktopOthersRight = () => {
    if (desktopOthersScrollRef.current) {
       // Scroll right by roughly 2 card widths
      desktopOthersScrollRef.current.scrollBy({ left: 520, behavior: 'smooth' });
    }
  };


  // --- SIZE GUIDE MODAL COMPONENT (Unchanged) ---
  const SizeGuideModal = () => (
    <div className="size-guide-overlay" onClick={() => setShowSizeGuide(false)}>
      <div className="size-guide-content" onClick={(e) => e.stopPropagation()}>
        <div className="sg-header">
          <h3>Size Guide (Inches)</h3>
          <button onClick={() => setShowSizeGuide(false)}><X size={24} /></button>
        </div>
        <div className="sg-body">
          <table className="sg-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Length</th>
                <th>Shoulder</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>S</td><td>40</td><td>27</td><td>18</td></tr>
              <tr><td>M</td><td>42</td><td>28</td><td>19</td></tr>
              <tr><td>L</td><td>44</td><td>29</td><td>20</td></tr>
              <tr><td>XL</td><td>46</td><td>30</td><td>21</td></tr>
              <tr><td>XXL</td><td>48</td><td>31</td><td>22</td></tr>
            </tbody>
          </table>
          <p className="sg-note">Measurements are in inches. Tolerance +/- 0.5 inches.</p>
        </div>
      </div>
    </div>
  );

  // --- RENDER: MOBILE (Unchanged) ---
  const renderMobile = () => (
    <div className="mobile-product-container" onScroll={handleScroll}>
      <div className="mobile-hero-wrapper" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
          {!cleanView && galleryImages.length > 1 && (
            <div className="mobile-gallery-dots">
              {galleryImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`dot ${currentImgIndex === idx ? 'active' : ''}`} 
                  onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(idx); }}
                />
              ))}
            </div>
          )}
        </div>

        {!cleanView && (
          <div className="mobile-top-bar">
            <button className="icon-btn-glass" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
            <div className="top-actions">
              <button className="icon-btn-glass" onClick={handleShare}><Share2 size={20} /></button>
              <button className="icon-btn-glass" onClick={handleWishlist}>
                <Heart size={24} fill={isLiked ? "#dc2626" : "transparent"} color={isLiked ? "#dc2626" : "currentColor"} />
              </button>
            </div>
          </div>
        )}

        <button className="clean-view-toggle" onClick={() => setCleanView(!cleanView)}>
          {cleanView ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>

        {!cleanView && (
          <div className="mobile-hero-content">
            <div className="mobile-hero-text">
              <h1>{product.name}</h1>
              <p>{product.category} Collection</p>
            </div>
            <div className={`scroll-indicator ${showScrollIndicator ? 'visible' : 'hidden'}`}>
              <span className="scroll-text">Scroll for details</span>
              <ChevronDown size={16} className="bounce-anim" />
            </div>
          </div>
        )}
      </div>

      <div className="mobile-scroll-details">
        <div className="mobile-meta-header">
           <span className="brand-tag">RITI STREETWEAR</span>
        </div>
        <div className="details-header">
           <h2>Product Details</h2>
           <div className="details-price-row">
              <span className="d-price">₹{product.price}</span>
              <span className="d-original">₹{parseInt(product.price) * 1.4}</span>
              <span className="d-discount">40% OFF</span>
           </div>
           <p className="tax-note">inclusive of all taxes</p>
        </div>
        <p className="main-desc">{product.description || "Premium streetwear crafted for comfort and style."}</p>
        <ul className="feature-list mobile-feature-list">
          <li>• 100% Premium Cotton</li>
          <li>• 240 GSM Heavyweight Fabric</li>
          <li>• Puff Print / Screen Print Design</li>
          <li>• Unisex Oversized Fit</li>
        </ul>
        <div className="selector-block mobile-selector">
            <div className="label-row">
              <span>SELECT SIZE</span>
              <button className="size-guide-btn" onClick={() => setShowSizeGuide(true)}>Size Guide</button>
            </div>
            <div className="size-options">
              {sizes.map(size => (
                <button key={size} className={`d-size-btn ${selectedSize === size ? 'selected' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>
              ))}
            </div>
        </div>
        <div className="selector-block mobile-selector">
            <span>QUANTITY</span>
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
        </div>
        <div className="mobile-actions-grid">
           <button className="d-add-bag-btn mobile-btn"><ShoppingBag size={20} /> ADD TO BAG</button>
           <button className="d-buy-now-btn mobile-btn" onClick={handleBuyNow}>BUY NOW</button>
        </div>
        <div className="shipping-note">
           <Check size={16} color="var(--sale-green)" />
           <span>Fast delivery within 3-5 days</span>
        </div>
        <div className="others-bought-section">
          <h3>Others Also Bought</h3>
          <div className="others-grid">
            {recommendations.map(item => (<ProductCard key={item.id} data={item} />))}
          </div>
        </div>
      </div>
      
      {showSizeGuide && <SizeGuideModal />}
    </div>
  );

  // --- RENDER: DESKTOP (UPDATED WITH ARROWS) ---
  const renderDesktop = () => (
    <div className="desktop-product-container">
      <div className="desktop-breadcrumb">Home / {product.category} / {product.name}</div>
      <div className="desktop-grid">
        <div className="desktop-gallery">
          <div className="main-image-frame">
            <button className="gallery-arrow left" onClick={prevImage}><ChevronLeft size={24} /></button>
            <img src={galleryImages[currentImgIndex]} alt={product.name} className="fade-in-img" onError={(e) => { e.target.src = "https://dummyimage.com/600x800/e0e0e0/000000&text=Image+Error"; }} />
            <button className="gallery-arrow right" onClick={nextImage}><ChevronRight size={24} /></button>
          </div>
          <div className="thumbnail-row">
            {galleryImages.map((img, index) => (
              <img key={index} src={img} className={`thumb ${currentImgIndex === index ? 'active' : ''}`} onClick={() => setCurrentImgIndex(index)} />
            ))}
          </div>
        </div>
        <div className="desktop-info">
          <div className="info-header">
            <span className="brand-tag">RITI STREETWEAR</span>
            <button className="share-btn" onClick={handleShare}><Share2 size={20} /></button>
          </div>
          <h1 className="desktop-title">{product.name}</h1>
          <div className="rating-row"><span className="stars">★ 4.8</span><span className="reviews">| 120 Reviews</span></div>
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
              <button className="size-guide-btn" onClick={() => setShowSizeGuide(true)}>Size Guide</button>
            </div>
            <div className="size-options">
              {sizes.map(size => (
                <button key={size} className={`d-size-btn ${selectedSize === size ? 'selected' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>
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
            <button className="d-add-bag-btn"><ShoppingBag size={20} /> ADD TO BAG</button>
            <button className="d-buy-now-btn" onClick={handleBuyNow}>BUY NOW</button>
          </div>
          <button className="d-wishlist-btn" onClick={handleWishlist}>
            <Heart size={20} fill={isLiked ? "#dc2626" : "transparent"} color={isLiked ? "#dc2626" : "currentColor"} /> 
            {isLiked ? 'WISHLISTED' : 'ADD TO WISHLIST'}
          </button>
          <div className="delivery-info">
             <div className="delivery-item"><Check size={16} /> Fast delivery within 3-5 days</div>
          </div>
        </div>
      </div>
      
      {/* --- OTHERS ALSO BOUGHT (DESKTOP - UPDATED) --- */}
      <div className="desktop-others-section">
        <h3>Others Also Bought</h3>
        {/* New Wrapper for Relative Positioning of Arrows */}
        <div className="desktop-others-wrapper">
            <button className="d-others-arrow left" onClick={scrollDesktopOthersLeft}>
                <ChevronLeft size={24} />
            </button>
            
            {/* Attached Ref here */}
            <div className="others-grid desktop" ref={desktopOthersScrollRef}>
              {recommendations.map(item => (<ProductCard key={item.id} data={item} />))}
            </div>

            <button className="d-others-arrow right" onClick={scrollDesktopOthersRight}>
                <ChevronRight size={24} />
            </button>
        </div>
      </div>
      
      {showSizeGuide && <SizeGuideModal />}
    </div>
  );

  return isMobile ? renderMobile() : renderDesktop();
};

export default ProductPage;