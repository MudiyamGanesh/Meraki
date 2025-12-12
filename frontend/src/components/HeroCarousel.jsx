import React, { useState } from "react";
import { motion } from "framer-motion";
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
    image: "https://images.unsplash.com/photo-1542272617-08f08630329f?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80",
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const length = categories.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  const getCardPosition = (index) => {
    const prevIndex = (currentIndex - 1 + length) % length;
    const nextIndex = (currentIndex + 1) % length;

    if (index === currentIndex) return "center";
    if (index === prevIndex) return "left";
    if (index === nextIndex) return "right";
    return "hidden";
  };

  const isCardActive = (index) => {
    if (hoveredIndex !== null) return hoveredIndex === index;
    return index === currentIndex;
  };

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <span className="header-subtitle">Discover Collections</span>
        <h2 className="header-title">Shop By Category</h2>
      </div>

      <div className="carousel-track-container">
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
                className={`card ${isActive ? "active" : "inactive"} ${position}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                layout
                animate={{ 
                  scale: isActive ? 1.05 : 0.9, 
                  zIndex: isActive ? 20 : 5 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="card-image-box">
                  <img src={item.image} alt={item.title} />
                </div>

                 {isActive}

                {/* Removed background color style here for a cleaner look */}
                <div className="card-content">
                  <motion.h3 className="card-title" layout>
                    {item.title}
                  </motion.h3>
                  
                  <motion.div
                     className="details-container"
                     initial={false}
                     animate={isActive ? { opacity: 1, height: "auto", marginTop: 8 } : { opacity: 0, height: 0, marginTop: 0 }}
                  >
                    <p className="card-price">{item.price}</p>
                    <ul className="card-features">
                      {item.features.map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                  </motion.div>
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