import React from 'react';
import { Lock } from 'lucide-react';
import '../css/SubNavbar.css';

const SubNavbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sub-navbar">
      <div className="sub-nav-container">
        <button 
          className={`sub-nav-item ${activeTab === 'Men' ? 'active' : ''}`}
          onClick={() => setActiveTab('Men')}
        >
          MEN
        </button>

        <button 
          className={`sub-nav-item ${activeTab === 'Women' ? 'active' : ''}`}
          onClick={() => setActiveTab('Women')}
        >
          WOMEN
        </button>

        <button 
          className={`sub-nav-item ${activeTab === 'Sneakers' ? 'active' : ''}`}
          onClick={() => setActiveTab('Sneakers')}
        >
          <span>SNEAKERS</span>
          <span className="hype-badge">
            <Lock size={10} style={{ marginRight: '3px' }} /> 
            DROPPING SOON
          </span>
        </button>

      </div>
    </div>
  );
};

export default SubNavbar;