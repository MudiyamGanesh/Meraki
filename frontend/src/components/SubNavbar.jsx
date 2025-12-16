import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import '../css/SubNavbar.css';

const SubNavbar = ({ activeCategory }) => {
  return (
    <div className="sub-navbar">
      <div className="sub-nav-container">
        
        <Link 
          to="/men" 
          className={`sub-nav-item ${activeCategory === 'Men' ? 'active' : ''}`}
        >
          MEN
        </Link>

        <Link 
          to="/women" 
          className={`sub-nav-item ${activeCategory === 'Women' ? 'active' : ''}`}
        >
          WOMEN
        </Link>

        <Link 
          to="/sneakers" 
          className={`sub-nav-item ${activeCategory === 'Sneakers' ? 'active' : ''}`}
        >
          <span>SNEAKERS</span>
          <span className="hype-badge">
            <Lock size={10} style={{ marginRight: '3px' }} /> 
            DROPPING SOON
          </span>
        </Link>

      </div>
    </div>
  );
};

export default SubNavbar;