import React, { useState } from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  ChevronDown, 
  MapPin, 
  Mail, 
  Phone 
} from 'lucide-react';
import '../css/Footer.css';

const Footer = () => {
  // State to toggle the footer expansion
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFooter = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top Header */}
        <div className="footer-header">
          <p>Over <span className="highlight-text">500+</span> Happy Customers</p>
        </div>

        {/* The Trigger Button (Visible on Mobile, Hidden on Desktop) */}
        <div className="know-more-section" onClick={toggleFooter}>
          <span className="font-medium">Know more about RITI</span>
          {/* Replaced SVG with Lucide ChevronDown */}
          <ChevronDown 
            className={`chevron-icon ${isExpanded ? 'rotate-180' : ''}`} 
            size={20}
          />
        </div>

        {/* Collapsible Content Wrapper */}
        <div className={`footer-collapsible ${isExpanded ? 'open' : ''}`}>
          
          {/* Main Links Grid */}
          <div className="footer-links-grid">
            {/* Need Help */}
            <div className="footer-column">
              <h4>NEED HELP</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Track Order</a></li>
                <li><a href="#">Returns & Refunds</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">My Account</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-column">
              <h4>COMPANY</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Investor Relation</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Gift Vouchers</a></li>
                <li><a href="#">Community Initiatives</a></li>
              </ul>
            </div>

            {/* More Info */}
            <div className="footer-column">
              <h4>MORE INFO</h4>
              <ul>
                <li><a href="#">T&C</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Sitemap</a></li>
                <li><a href="#">Get Notified</a></li>
                <li><a href="#">Blogs</a></li>
              </ul>
            </div>

            {/* Store Near Me */}
            <div className="footer-column">
              <h4>STORE NEAR ME</h4>
              <ul>
                <li className="feature-row"><MapPin size={16} className="feature-icon"/> <a href="#">Mumbai</a></li>
                <li className="feature-row"><MapPin size={16} className="feature-icon"/> <a href="#">Pune</a></li>
                <li className="feature-row"><MapPin size={16} className="feature-icon"/> <a href="#">Bangalore</a></li>
                <li className="feature-row"><MapPin size={16} className="feature-icon"/> <a href="#">Hubbali</a></li>
                <li><a href="#" className="view-more">View More</a></li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="social-section">
            <span style={{ marginRight: '10px' }}>Follow Us:</span>
            
            <a href="#" className="social-icon-wrapper bg-fb">
              <Facebook size={20} strokeWidth={1.5} fill="currentColor" />
            </a>
            
            <a href="#" className="social-icon-wrapper bg-insta">
              <Instagram size={20} strokeWidth={2} />
            </a>
            
            {/* Snapchat (Custom SVG preserved as no Lucide equivalent exists) */}
            <a href="#" className="social-icon-wrapper bg-snap">
              <svg className="social-svg" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.385c-3.535 0-6.385-2.85-6.385-6.385 0-3.535 2.85-6.385 6.385-6.385 3.535 0 6.385 2.85 6.385 6.385 0 3.535-2.85 6.385-6.385 6.385zm3.744-8.176a1.247 1.247 0 11-2.494 0 1.247 1.247 0 012.494 0z"/>
              </svg>
            </a>
            
            <a href="#" className="social-icon-wrapper bg-twitter">
              <Twitter size={20} strokeWidth={0} fill="currentColor" />
            </a>
          </div>

          {/* Copyright Section */}
          <div className="copyright">© रीति</div>
        
        </div> {/* End of Collapsible */}
      </div>
    </footer>
  );
};

export default Footer;