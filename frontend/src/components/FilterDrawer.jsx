// src/components/FilterDrawer.jsx
import React from 'react';
import { X } from 'lucide-react';

const FilterDrawer = ({ isOpen, onClose, filters, setFilters, applyFilters }) => {
  
  const handleSortChange = (e) => setFilters({ ...filters, sort: e.target.value });
  
  // Quick toggle for array-based filters like Size and Color
  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const currentList = prev[type];
      if (currentList.includes(value)) {
        return { ...prev, [type]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...currentList, value] };
      }
    });
  };

  return (
    <>
      {/* Overlay that darkens the background */}
      <div 
        className={`filter-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>

      {/* The actual sliding drawer */}
      <div className={`filter-drawer ${isOpen ? 'open' : ''}`}>
        
        <div className="drawer-header">
          <h2>Filter & Sort</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <div className="drawer-content">
          {/* SORTING */}
          <div className="filter-section">
            <h3>Sort By</h3>
            <select value={filters.sort} onChange={handleSortChange} className="premium-select">
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* SIZES */}
          <div className="filter-section">
            <h3>Size</h3>
            <div className="pill-group">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button 
                  key={size}
                  className={`filter-pill ${filters.sizes.includes(size) ? 'active' : ''}`}
                  onClick={() => toggleFilter('sizes', size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COLORS */}
          <div className="filter-section">
            <h3>Color</h3>
            <div className="color-group">
              {['Black', 'White', 'Red', 'Blue', 'Green', 'Grey'].map(color => (
                <button 
                  key={color}
                  className={`color-swatch ${filters.colors.includes(color) ? 'active' : ''}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                  onClick={() => toggleFilter('colors', color)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button 
            className="clear-btn" 
            onClick={() => setFilters({ sort: 'newest', sizes: [], colors: [] })}
          >
            Clear All
          </button>
          <button className="apply-btn" onClick={() => { applyFilters(); onClose(); }}>
            View Results
          </button>
        </div>

      </div>

      <style>{`
        .filter-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);
          opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
          z-index: 100;
        }
        .filter-overlay.open { opacity: 1; pointer-events: auto; }

        .filter-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; width: 400px;
          max-width: 100%; background: #111118; color: #fff;
          transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 101; display: flex; flex-direction: column;
          box-shadow: -5px 0 25px rgba(0,0,0,0.2);
        }
        .filter-drawer.open { transform: translateX(0); }

        .drawer-header { display: flex; justify-content: space-between; padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .drawer-header h2 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 1px; }
        .close-btn { background: none; border: none; color: #fff; cursor: pointer; }

        .drawer-content { flex-grow: 1; overflow-y: auto; padding: 25px; display: flex; flex-direction: column; gap: 30px; }
        .filter-section h3 { margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px; }
        
        .premium-select { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-size: 16px; outline: none; }
        .premium-select option { background: #111118; color: #fff; }

        .pill-group { display: flex; flex-wrap: wrap; gap: 10px; }
        .filter-pill { padding: 8px 16px; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 20px; cursor: pointer; transition: 0.2s; }
        .filter-pill.active { background: #bb86fc; border-color: #bb86fc; color: #000; font-weight: bold; }

        .color-group { display: flex; flex-wrap: wrap; gap: 12px; }
        .color-swatch { width: 36px; height: 36px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: 0.2s; }
        .color-swatch.active { border-color: #bb86fc; transform: scale(1.1); box-shadow: 0 0 10px rgba(187,134,252,0.4); }

        .drawer-footer { display: flex; gap: 15px; padding: 25px; border-top: 1px solid rgba(255,255,255,0.1); }
        .clear-btn { flex: 1; padding: 15px; background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; font-weight: bold; }
        .apply-btn { flex: 2; padding: 15px; background: #bb86fc; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
      `}</style>
    </>
  );
};

export default FilterDrawer;