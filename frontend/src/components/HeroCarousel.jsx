import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../css/HeroCarousel.css";

// --- DATA SETS ---
const menSlides = [
  {
    id: 1,
    title: "Summer Linen",
    price: "From ₹999",
    features: ["Breathable Fabric", "Relaxed Fit", "Eco-Friendly"],
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Casual Denim",
    price: "From ₹1,499",
    features: ["Durable Stitch", "Vintage Wash", "All Sizes"],
    image: "https://www.urbanofashion.com/cdn/shop/files/shirtden2pc-iceblue-1.jpg?v=1736093532",
  },
  {
    id: 3,
    title: "Urban Street",
    price: "From ₹2,499",
    features: ["Heavy Cotton", "Oversized", "Graphic Prints"],
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
  }
];

const womenSlides = [
  {
    id: 101,
    title: "Boho Chic",
    price: "From ₹1,299",
    features: ["Flowy Silhouette", "Floral Patterns", "Lightweight"],
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 102,
    title: "Power Suits",
    price: "From ₹3,999",
    features: ["Tailored Fit", "Premium Blend", "Office Ready"],
    image: "https://si.wsj.net/public/resources/images/BN-VB698_SUITS0_M_20170912112340.jpg",
  },
  {
    id: 103,
    title: "Evening Elegance",
    price: "From ₹2,499",
    features: ["Silk Satin", "Maxi Length", "Bold Colors"],
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
  }
];

// Receive activeTab prop
const HeroCarousel = ({ activeTab = 'Men' }) => {
  const categories = activeTab === 'Women' ? womenSlides : menSlides;
  
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);
  const length = categories.length;

  // --- 1. FORCE SCROLL RESET ON MOUNT & TAB CHANGE ---
  // useLayoutEffect runs BEFORE the paint, preventing visual glitching
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0; // Hard reset DOM property
    }
    setCurrentIndex(0);
    setMobileActiveIndex(0);
  }, [activeTab, categories]);


  // --- 2. MOBILE SCROLL OBSERVER ---
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          // Safety: ensure index is a valid number
          if (!isNaN(index)) {
            setMobileActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: scrollRef.current,
      threshold: 0.5, // 50% visibility required
    });

    // Small timeout ensures DOM is fully painted before observing
    const timeoutId = setTimeout(() => {
      cardRefs.current.forEach((card) => {
        if (card) observer.observe(card);
      });
    }, 150);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [categories]); // Re-run when data changes


  // --- DESKTOP NAVIGATION ---
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  return (
    <div className="carousel-section">
      <div className="carousel-track-container" ref={scrollRef}>
        <button onClick={prevSlide} className="nav-arrow left-arrow">
          <ChevronLeft size={40} strokeWidth={2.5} />
        </button>

        <div className="cards-wrapper">
          {categories.map((item, index) => {
            // Calculate Desktop Position
            const position = (index === currentIndex) ? "center" : 
                             (index === (currentIndex - 1 + length) % length) ? "left" : 
                             (index === (currentIndex + 1) % length) ? "right" : "hidden";
            
            // LOGIC:
            // Mobile: use mobileActiveIndex
            // Desktop: use Hover or CurrentIndex
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
                layout
                animate={{ 
                  scale: isActive ? 1.05 : 0.95, 
                  zIndex: isActive ? 20 : 5 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Image */}
                <div className="card-image-box">
                  <motion.img 
                    src={item.image} 
                    alt={item.title} 
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                {/* Content */}
                <div className="card-content">
                  <motion.h3 className="card-title">{item.title}</motion.h3>
                  
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