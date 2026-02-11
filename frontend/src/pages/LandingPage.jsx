import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import '../css/LandingPage.css';

// --- CONFIGURATION ---
const SLIDES = {
  men: {
    id: 'men',
    title: "THE GENTLEMAN'S CODE",
    subtitle: "Modern Armor for the Urban Soul",
    image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1765520729_9075484.jpg?w=480&dpr=2", 
    route: '/men'
  },
  women: {
    id: 'women',
    title: "DIVINE FEMININE",
    subtitle: "Grace Woven into Every Thread",
    image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1734938241_2142540.jpg?w=480&dpr=2", 
    route: '/women'
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('women'); 
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // If we are currently navigating to a new page, don't start the timer
    if (isNavigating) return;

    const interval = setInterval(() => {
      setActiveTab(prev => prev === 'women' ? 'men' : 'women');
    }, 6000); 

    // This cleanup function runs every time activeTab changes or the component unmounts
    // It "kills" the old timer so a new 6-second cycle can start fresh
    return () => clearInterval(interval);
  }, [activeTab, isNavigating]); // Adding activeTab here is the key fix

  const handleNavigate = (path) => {
    setIsNavigating(true);
    setTimeout(() => navigate(path), 800); 
  };

  const currentSlide = SLIDES[activeTab];

  return (
    <div className="cine-container">
      
      {/* BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          className="cine-background"
          style={{ backgroundImage: `url(${currentSlide.image})` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </AnimatePresence>

      <div className="cine-overlay"></div>
      
      {/* MAIN CONTENT */}
      <div className="cine-content">
        <motion.div 
          key={activeTab + "-text"} 
          initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-wrapper"
        >
          <h2 className="cine-subtitle">{currentSlide.subtitle}</h2>
          <h1 className="cine-title">{currentSlide.title}</h1>
          
          <button 
            className="explore-btn"
            onClick={() => handleNavigate(currentSlide.route)}
          >
            <span>Explore Collection</span>
            <ArrowUpRight size={20} />
          </button>
        </motion.div>
      </div>

      {/* BRAND HEADER - Renamed Class Here */}
      <div className="cine-header">
        <h2 className="eclipse-brand-logo">रीती</h2>
      </div>

      {/* DOCK */}
      <div className="cine-dock-wrapper">
        <div className="cine-dock">
          {Object.values(SLIDES).map((slide) => (
            <button
              key={slide.id}
              className={`dock-item ${activeTab === slide.id ? 'active' : ''}`}
              onClick={() => setActiveTab(slide.id)}
            >
              {slide.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CURTAIN */}
      <motion.div 
        className="transition-curtain"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isNavigating ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'bottom' }}
      >
        <h1 className="curtain-text">रीती</h1>
      </motion.div>

    </div>
  );
}