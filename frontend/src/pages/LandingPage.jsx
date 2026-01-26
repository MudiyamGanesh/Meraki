import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import '../css/LandingPage.css';

const SplitSection = ({ side, title, image, route, onClick, isHovered, isDimmed, isActive, hasClicked, onHover, onLeave }) => {
  
  // LOGIC: If a click happened (hasClicked), and this is NOT the active side,
  // we must kill it instantly.
  const isLoser = hasClicked && !isActive;

  return (
    <motion.div 
      className={`split-pane ${side} ${isHovered ? 'hover-active' : ''} ${isDimmed ? 'dimmed' : ''} ${isActive ? 'clicked-active' : ''}`}
      onClick={() => !hasClicked && onClick(route, side)} // Prevent double clicks
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      
      // FRAMER MOTION LOGIC FIX
      animate={{ 
        // 1. If I am the loser: Go to 0 width (or flex 0) and 0 opacity
        // 2. If I am the winner: Grow huge (flex 10)
        // 3. Normal hover: flex 2
        flex: isLoser ? 0.01 : (isActive || isHovered ? 2 : 1), 
        opacity: isLoser ? 0 : (isDimmed ? 0.4 : 1) 
      }}
      
      transition={{ 
        // If I am the loser, die FAST (0.3s). 
        // If I am the winner/hovering, move LUXURIOUSLY (0.8s).
        duration: isLoser ? 0.3 : 0.8, 
        ease: [0.33, 1, 0.68, 1] 
      }}
    >
      <motion.div 
        className="bg-image" 
        style={{ backgroundImage: `url(${image})` }}
        animate={{ 
            scale: isHovered || isActive ? 1.15 : 1,
            filter: isDimmed ? 'grayscale(100%) brightness(0.4)' : 'grayscale(0%) brightness(0.9)'
        }}
        transition={{ duration: 0.8 }}
      />
      
      <div className="content">
        <motion.div 
            className="label-card"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <div className="overflow-hidden">
                <motion.h2>
                    {title}
                </motion.h2>
            </div>
            
            <div className="cta-link">
                <span className="cta-text">View Collection</span>
                <ArrowRight size={16} />
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredSide, setHoveredSide] = useState(null);
  const [clickedSide, setClickedSide] = useState(null); 

  useEffect(() => {
    // 1. Lock scroll when this component mounts
    document.body.style.overflow = 'hidden';
    
    // 2. Unlock scroll when this component unmounts (leaving the page)
    return () => {
        document.body.style.overflow = 'auto';
        document.body.style.overflowX = 'hidden'; // Keep horizontal scroll hidden
    };
  }, []);

  const handleNavigate = (path, side) => {
    setClickedSide(side);
    // Navigation happens after 1 second, giving animation time to finish
    setTimeout(() => navigate(path), 1000);
  };

  return (
    <div className={`landing-gateway ${clickedSide ? 'navigating' : ''}`}>
        <div className="texture-overlay"></div>

      {/* MEN */}
      <SplitSection 
        side="left"
        title="MEN"
        image="https://images.bewakoof.com/t1080/men-s-taupe-brown-take-home-graphic-printed-oversized-t-shirt-681698-1751960002-1.jpg"
        route="/men"
        onClick={handleNavigate}
        isHovered={hoveredSide === 'left'}
        isDimmed={hoveredSide === 'right'}
        isActive={clickedSide === 'left'}
        hasClicked={clickedSide !== null} // Pass the global click state
        onHover={() => setHoveredSide('left')}
        onLeave={() => setHoveredSide(null)}
      />

      {/* WOMEN */}
      <SplitSection 
        side="right"
        title="WOMEN"
        image="https://images.bewakoof.com/t1080/534839_2025-12-26t11-49-12_1.jpg"
        route="/women"
        onClick={handleNavigate}
        isHovered={hoveredSide === 'right'}
        isDimmed={hoveredSide === 'left'}
        isActive={clickedSide === 'right'}
        hasClicked={clickedSide !== null} // Pass the global click state
        onHover={() => setHoveredSide('right')}
        onLeave={() => setHoveredSide(null)}
      />
      
      {/* BRANDING */}
      <motion.div className="brand-center">
        <h1 className="sanskrit-logo">रीती</h1>
        <p className="brand-subtitle">TIMELESS TRADITION</p>
      </motion.div>
    </div>
  );
}