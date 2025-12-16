import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, ShieldCheck, Zap, MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import Navigation
import '../css/LandingPage.css';

// Mock Data
const curatedPicks = [
  { id: 1, name: "Essentials Oversized Hoodie", category: "Streetwear", price: "₹3,499", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80", badge: "HOT" },
  { id: 2, name: "Air Jordan 1 High", category: "Sneakers", price: "₹16,999", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80", badge: "GRAIL" },
  { id: 3, name: "Summer Linen Set", category: "Women", price: "₹2,899", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80", badge: "NEW" },
  { id: 4, name: "Varsity Bomber Jacket", category: "Men", price: "₹4,599", image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&w=600&q=80", badge: "" }
];

const LandingPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="landing-page">
      
      {/* HERO */}
      <section className="hero-fullscreen">
        <div className="hero-overlay"></div>
        <div className="hero-video-bg">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80" alt="Hero" />
        </div>
        
        <motion.div 
          className="hero-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="hero-tag">EST. 2025 • PREMIUM WEAR</span>
          <h1>Wear Your<br /><span className="outline-text">Vibe.</span></h1>
          <p>Curated fashion that speaks before you do.</p>
          
          <div className="cta-group">
            <button onClick={() => navigate('/men')} className="btn-primary-glow">
              Shop Collection
            </button>
            <button onClick={() => navigate('/sneakers')} className="btn-text-only">
              View Drops <MoveRight size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>NEW DROPS EVERY FRIDAY • FREE SHIPPING ON ORDERS ABOVE ₹2000 • AUTHENTICITY GUARANTEED •</span>
          <span>NEW DROPS EVERY FRIDAY • FREE SHIPPING ON ORDERS ABOVE ₹2000 • AUTHENTICITY GUARANTEED •</span>
        </div>
      </div>

      {/* BENTO GRID */}
      <section className="bento-section">
        <div className="section-header center">
          <h2>Shop By Category</h2>
          <div className="header-underline"></div>
        </div>

        <div className="bento-grid">
          {/* Sneakers */}
          <motion.div 
            className="bento-item item-large"
            onClick={() => navigate('/sneakers')}
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/5/e5d8daf214854_1.jpg?rnd=20200526195200&tr=w-512" alt="Sneakers" />
            <div className="bento-overlay">
              <h3>Sneaker Lab</h3>
              <p>Limited Editions & Hype Drops</p>
              <span className="btn-circle"><ArrowRight size={20}/></span>
            </div>
          </motion.div>

          {/* Men */}
          <motion.div 
            className="bento-item item-medium"
            onClick={() => navigate('/men')}
            whileHover={{ scale: 0.98 }}
          >
            <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/a/aadb9f5248141A_1.jpg?tr=w-512" alt="Men" />
            <div className="bento-overlay">
              <h3>Men's Edit</h3>
              <p>Street & Formal</p>
            </div>
          </motion.div>

          {/* Women */}
          <motion.div 
            className="bento-item item-medium"
            onClick={() => navigate('/women')}
            whileHover={{ scale: 0.98 }}
          >
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="Women" />
            <div className="bento-overlay">
              <h3>Women's Edit</h3>
              <p>Chic & Timeless</p>
            </div>
          </motion.div>
          
           {/* Design Studio */}
           <motion.div 
            className="bento-item item-wide"
            onClick={() => navigate('/design')}
            whileHover={{ scale: 0.98 }}
          >
            <div className="design-studio-bg">
                <h3>Design Studio <span>BETA</span></h3>
                <p>Customize your own fit.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <div className="trust-strip">
        <div className="trust-item">
          <Truck size={24} strokeWidth={1.5} />
          <div><h4>Fast Shipping</h4><p>Within 3-5 Days</p></div>
        </div>
        <div className="trust-item">
          <ShieldCheck size={24} strokeWidth={1.5} />
          <div><h4>100% Authentic</h4><p>Verified Products</p></div>
        </div>
        <div className="trust-item">
          <Zap size={24} strokeWidth={1.5} />
          <div><h4>Member Exclusives</h4><p>Early Access Drops</p></div>
        </div>
      </div>

      {/* CURATED COLLECTION */}
      <section className="curated-section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <button className="view-all-btn">View All</button>
        </div>

        <div className="curated-grid">
          {curatedPicks.map((item) => (
            <div key={item.id} className="curated-card">
              <div className="curated-img-box">
                {item.badge && <span className="badge-overlay">{item.badge}</span>}
                <img src={item.image} alt={item.name} />
                <button className="quick-add-btn">Add to Bag</button>
              </div>
              <div className="curated-info">
                <span>{item.category}</span>
                <h3>{item.name}</h3>
                <div className="price-row">
                  <span className="price">{item.price}</span>
                  <div className="rating"><Star size={12} fill="currentColor" /> 4.9</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="vibe-section">
        <div className="vibe-content">
          <h2>Don't Miss The Drop.</h2>
          <p>Join the community. Get exclusive access to limited sneakers and sales.</p>
          <div className="input-group">
            <input type="email" placeholder="Enter your email" />
            <button>JOIN US</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;