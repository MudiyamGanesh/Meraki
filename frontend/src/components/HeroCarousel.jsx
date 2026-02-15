import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- 1. IMPORT NAVIGATE
import "../css/HeroCarousel.css";

const HeroCarousel = ({ activeTab, products = [] }) => {
  const navigate = useNavigate(); // <-- 2. INITIALIZE HOOK
  
  // --- 1. DATA TRANSFORMATION (The Fix) ---
  const slides = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products
      .filter((product) => product.gender.toLowerCase() === activeTab.toLowerCase())
      .slice(0, 5) 
      .map((product) => ({
        id: product.id,
        title: product.name,
        price: `From ₹${product.price}`, 
        features: [
          product.subCategory || "Trending",
          product.fit || "Regular Fit",
          product.fabric || "Premium Cotton"
        ],
        image: product.images && product.images.length > 0 
          ? product.images[0] 
          : "https://via.placeholder.com/400x600?text=No+Image"
      }));
  }, [activeTab, products]);

  const [currentIndex, setCurrentIndex] = useState(0); 
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);
  const length = slides.length;

  // --- 2. FORCE SCROLL RESET ---
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0; 
    }
    setCurrentIndex(0);
    setMobileActiveIndex(0);
  }, [activeTab, slides]);


  // --- 3. MOBILE SCROLL OBSERVER ---
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setMobileActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: scrollRef.current,
      threshold: 0.5, 
    });

    const timeoutId = setTimeout(() => {
      cardRefs.current.forEach((card) => {
        if (card) observer.observe(card);
      });
    }, 150);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [slides]); 


  // --- DESKTOP NAVIGATION ---
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  if (slides.length === 0) return null;

  return (
    <div className="carousel-section">
      <div className="carousel-track-container" ref={scrollRef}>
        <button onClick={prevSlide} className="nav-arrow left-arrow">
          <ChevronLeft size={40} strokeWidth={2.5} />
        </button>

        <div className="cards-wrapper">
          {slides.map((item, index) => {
            const position = (index === currentIndex) ? "center" : 
                             (index === (currentIndex - 1 + length) % length) ? "left" : 
                             (index === (currentIndex + 1) % length) ? "right" : "hidden";
            
            const isMobile = window.innerWidth <= 900;
            const isActive = isMobile 
                ? index === mobileActiveIndex 
                : (hoveredIndex !== null ? hoveredIndex === index : index === currentIndex);

            return (
              <motion.div
                key={item.id}
                ref={(el) => (cardRefs.current[index] = el)}
                data-index={index}
                className={`card ${isActive ? "active" : "inactive"} ${position}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                // <-- 3. ADD ONCLICK ROUTING HERE
                onClick={() => navigate(`/product/${item.id}`)}
                layout
                style={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    minHeight: '400px',
                    cursor: 'pointer' // <-- AND THE POINTER CURSOR HERE
                }}
                animate={{ 
                  scale: isActive ? 1.05 : 0.95, 
                  zIndex: isActive ? 20 : 5 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* IMAGE BOX */}
                <div className="card-image-box" style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 
                }}>
                  <motion.img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                {/* CONTENT OVERLAY */}
                <div className="card-content" style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 10,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.1) 75%, transparent 100%)',
                    padding: '20px', boxSizing: 'border-box'
                }}>
                  <motion.h3 className="card-title" style={{ marginTop: 0 }}>
                    {item.title}
                  </motion.h3>
                  
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                          className="details-container"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="card-price">{item.price}</p>
                        <ul className="card-features">
                          {item.features.map((feature, i) => (
                            <li key={i}>• {feature}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button onClick={nextSlide} className="nav-arrow right-arrow">
          <ChevronRight size={40} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;