import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import "../css/HeroCarousel.css";

const categories = [
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
    title: "Festive Silk",
    price: "From ₹2,999",
    features: ["Hand Embroidered", "Pure Silk", "Limited Edition"],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Winter Wool",
    price: "From ₹2,499",
    features: ["Merino Wool", "Thermal lining", "Classic Cuts"],
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Active Wear",
    price: "From ₹799",
    features: ["Sweat Wicking", "4-Way Stretch", "High Impact"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPE7ngAJZqfTdFlyJaBa8CbStXjWQAAFgOtA&s",
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Desktop Active
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0); // Mobile Active
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Refs for mobile scroll detection
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);

  const length = categories.length;

  // --- DESKTOP NAVIGATION ---
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  // --- MOBILE SCROLL DETECTION ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setMobileActiveIndex(index);
          }
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.6,
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);


  // --- HELPER LOGIC ---
  const getCardPosition = (index) => {
    const prevIndex = (currentIndex - 1 + length) % length;
    const nextIndex = (currentIndex + 1) % length;
    if (index === currentIndex) return "center";
    if (index === prevIndex) return "left";
    if (index === nextIndex) return "right";
    return "hidden";
  };

  const isCardActive = (index) => {
    if (window.innerWidth <= 900) {
      return index === mobileActiveIndex;
    }
    if (hoveredIndex !== null) return hoveredIndex === index;
    return index === currentIndex;
  };

  return (
    <div className="carousel-section">
      
      <div className="carousel-track-container" ref={scrollRef}>
        <button onClick={prevSlide} className="nav-arrow left-arrow">
          <ChevronLeft size={40} strokeWidth={2.5} />
        </button>

        <div className="cards-wrapper">
          {categories.map((item, index) => {
            const position = getCardPosition(index);
            const isActive = isCardActive(index); 

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
                {/* --- IMAGE LAYER --- */}
                <div className="card-image-box">
                  <motion.img 
                    src={item.image} 
                    alt={item.title} 
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                 {isActive}

                {/* --- TEXT LAYER --- */}
                <div className="card-content">
                  <motion.h3 className="card-title" layout>
                    {item.title}
                  </motion.h3>
                  
                  {/* --- ANIMATED DETAILS --- */}
                  {/* AnimatePresence ensures exit animations play when switching cards */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                         className="details-container"
                         // Animation: Fade In + Slide Up
                         initial={{ opacity: 0, y: 15, height: 0 }}
                         animate={{ opacity: 1, y: 0, height: "auto" }}
                         exit={{ opacity: 0, y: 10, height: 0 }}
                         transition={{ duration: 0.4, ease: "easeOut" }}
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

                {isActive && (
                  <motion.div 
                    className="active-border" 
                    layoutId="activeBorder"
                    style={{ zIndex: 30 }}
                  />
                )}
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