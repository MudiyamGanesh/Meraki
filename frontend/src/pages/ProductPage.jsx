import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Truck, ShieldCheck, Star, 
  ChevronRight, Share2, Ruler, Minus, Plus, ChevronLeft,
  CreditCard
} from 'lucide-react';
// Assuming you have these contexts based on your App.jsx
import { useWishlist } from '../Context/WishlistContext';
import ProductShowcase from '../components/ProductShowcase';
import '../css/ProductPage.css';

const ProductPage = ({ products }) => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Component States
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(null);
  const [demoImages, setDemoImages] = useState([]);
  const scrollRef = useRef(null);
  const isLiked = product ? isInWishlist(product.id) : false;
  const [selectedVariant, setSelectedVariant] = useState(null);


  const handleImageNav = (direction) => {
    const currentIndex = demoImages.indexOf(activeImg);
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % demoImages.length;
      setActiveImg(demoImages[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + demoImages.length) % demoImages.length;
      setActiveImg(demoImages[prevIndex]);
    }
  };

  // --- BUTTON ACTIONS ---

  const handleQuantity = (type) => {
    if (type === 'plus') setQuantity(prev => prev + 1);
    if (type === 'minus' && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleWishlistToggle = () => {
    if (isLiked) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `रीति | ${product.name}`,
        text: product.subtitle,
        url: window.location.href,
      });
    } catch (err) {
      alert("Link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    // Logic for Cart context would go here
    alert(`Added ${quantity} ${product.name} (Size: ${selectedSize}) to bag!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    // Logic to add to cart and immediately navigate to checkout
    navigate('/cart'); 
  };

  // --- GALLERY & DATA LOGIC ---

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 180;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  useEffect(() => {
    const foundProduct = products.find((p) => String(p.id) === String(id));
    if (foundProduct) {
      setProduct(foundProduct);
      // Initialize with the first variant if available
      if (foundProduct.variants) {
        setSelectedVariant(foundProduct.variants[0]);
        setActiveImg(foundProduct.variants[0].mainImg);
      } else {
        setActiveImg(foundProduct.image);
      }
    }
  }, [id, products]);

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    setActiveImg(variant.mainImg);
    // You could also update the demoImages array here if each color has different angles
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = products.find((p) => String(p.id) === String(id));
    
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImg(foundProduct.image);
      const images = [
        foundProduct.image,
        foundProduct.image2,
        foundProduct.image3,
        foundProduct.image4,
      ].filter(img => img && img.trim() !== ""); 
      setDemoImages(images);
    }
  }, [id, products]);

  const suggestedProducts = useMemo(() => {
    if (!category) return [];
    return products
      .filter((p) => 
        p.category?.toLowerCase() === category.toLowerCase() && 
        String(p.id) !== String(id)
      )
      .slice(0, 4);
  }, [category, id, products]);

  if (!product) return <div className="loading-state">Loading Riti Collection...</div>;

  return (
    <div className="pdp-wrapper">
      <nav className="pdp-breadcrumb">
        <Link to="/">Home</Link> 
        <ChevronRight size={12} />
        <span className="breadcrumb-back" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
          {category?.toUpperCase()}
        </span> 
        <ChevronRight size={12} />
        <span>{product.name}</span>
      </nav>

      <div className="pdp-grid">
        <div className="pdp-media-gallery">
          <div className="pdp-main-frame">
            {demoImages.length > 1 && (
              <>
                <button 
                  className="main-img-nav-btn prev" 
                  onClick={() => handleImageNav('prev')}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  className="main-img-nav-btn next" 
                  onClick={() => handleImageNav('next')}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <img src={activeImg} alt={product.name} />
          </div>
        </div>

        <div className="pdp-details">
          {product.variants && (
            <div className="pdp-selection">
              <div className="select-label">
                <span>AVAILABLE COLORS: <strong>{selectedVariant?.color}</strong></span>
              </div>
              <div className="variant-grid">
                {product.variants.map((variant) => (
                  <div 
                    key={variant.id}
                    className={`variant-thumb ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                    onClick={() => handleVariantClick(variant)}
                  >
                    <img src={variant.thumb} alt={variant.color} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="pdp-header">
            <div className="brand-share-row">
              <span className="pdp-brand">रीति / RITI STREETWEAR</span>
              <button className="share-btn-icon" onClick={handleShare}><Share2 size={18} /></button>
            </div>
            <h1 className="pdp-title">{product.name}</h1>
            <div className="pdp-rating-row">
              <div className="stars-box">
                <Star size={14} fill="#000" /> <span>4.8</span>
              </div>
              <span className="review-count">| 120 Reviews</span>
            </div>
          </div>

          <div className="pdp-price-box">
            <div className="price-main">
              <span className="price-now">₹{product.price}</span>
              <span className="price-was">₹{product.price + 500}</span>
              <span className="price-off">(40% OFF)</span>
            </div>
            <p className="tax-info">inclusive of all taxes</p>
          </div>
          
          <div className="pdp-selection">
            <div className="select-label">
              <span>SELECT SIZE</span>
              <button className="guide-link" onClick={() => alert("Size Guide Coming Soon!")}><Ruler size={14} /> Size Guide</button>
            </div>
            <div className="size-grid">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="qty-selector">
            <span>QUANTITY</span>
            <div className="qty-controls">
              <button onClick={() => handleQuantity('minus')}><Minus size={16}/></button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => handleQuantity('plus')}><Plus size={16}/></button>
            </div>
          </div>

          <div className="pdp-actions">
            <div className="main-buy-btns">
              <button className="btn-primary" onClick={handleAddToBag}>
                <ShoppingBag size={20} /> ADD TO BAG
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow}>
                <CreditCard size={20} /> BUY NOW
              </button>
            </div>
            <button className={`btn-secondary ${isLiked ? 'liked' : ''}`} onClick={handleWishlistToggle}>
              <Heart size={20} fill={isLiked ? "var(--sale-red)" : "none"} color={isLiked ? "var(--sale-red)" : "currentColor"} /> 
              {isLiked ? "WISHLISTED" : "WISHLIST"}
            </button>
          </div>

          <div className="pdp-trust">
            <div className="trust-item"><Truck size={20} /> <span>Fast delivery within 3-5 days</span></div>
            <div className="trust-item"><ShieldCheck size={20} /> <span>7 days easy return & exchange</span></div>
          </div>
        </div>
      </div>

      {suggestedProducts.length > 0 && (
        <section className="pdp-suggestions">
          <h2 className="section-title">YOU MIGHT ALSO LIKE</h2>
          <ProductShowcase products={suggestedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductPage;