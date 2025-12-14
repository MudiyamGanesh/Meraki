import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, Settings, CreditCard, ChevronRight } from 'lucide-react';
import '../css/AccountPage.css';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      navigate('/Meraki');
    }
  };

  // --- RENDER CONTENT BASED ON TAB ---
  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersSection />;
      case 'addresses':
        return <AddressSection />;
      case 'settings':
        return <SettingsSection user={user} />;
      default:
        return <OverviewSection user={user} setActiveTab={setActiveTab} />;
    }
  };

  if (!user) {
    navigate('/Meraki/login');
    return null;
  }

  return (
    <div className="account-page">
      <div className="account-container">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <aside className="account-sidebar">
          <div className="user-mini-profile">
            <div className="avatar-circle">{user.name.charAt(0)}</div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <nav className="account-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => setActiveTab('overview')}
            >
              <User size={20} /> Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} 
              onClick={() => setActiveTab('orders')}
            >
              <Package size={20} /> My Orders
            </button>
            <button 
              className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`} 
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={20} /> Addresses
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} 
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} /> Account Settings
            </button>
            
            <div className="nav-divider"></div>
            
            <button className="nav-item logout" onClick={handleLogout}>
              <LogOut size={20} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="account-content">
          {renderContent()}
        </main>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (For cleaner code) ---

const OverviewSection = ({ user, setActiveTab }) => (
  <div className="tab-content fade-in">
    <div className="section-header">
      <h2>Hello, {user.name.split(' ')[0]}</h2>
      <p>From your dashboard you can view your recent orders, manage your shipping addresses and edit your password and account details.</p>
    </div>

    <div className="stats-grid">
      <div className="stat-card" onClick={() => setActiveTab('orders')}>
        <div className="icon-box blue"><Package size={24} /></div>
        <div className="stat-info">
          <span>Total Orders</span>
          <h3>12</h3>
        </div>
      </div>
      <div className="stat-card">
        <div className="icon-box green"><CreditCard size={24} /></div>
        <div className="stat-info">
          <span>Wallet Balance</span>
          <h3>₹0.00</h3>
        </div>
      </div>
      <div className="stat-card" onClick={() => setActiveTab('addresses')}>
        <div className="icon-box purple"><MapPin size={24} /></div>
        <div className="stat-info">
          <span>Saved Addresses</span>
          <h3>2</h3>
        </div>
      </div>
    </div>

    <div className="recent-orders-preview">
      <div className="preview-header">
        <h3>Recent Orders</h3>
        <button onClick={() => setActiveTab('orders')}>View All</button>
      </div>
      {/* Mock Order Item */}
      <div className="order-preview-item">
        <div className="order-info">
          <span className="order-id">#ORD-29384</span>
          <span className="order-date">Placed on Oct 24, 2024</span>
        </div>
        <div className="order-status badge-success">Delivered</div>
        <ChevronRight size={18} className="arrow" />
      </div>
    </div>
  </div>
);

const OrdersSection = () => (
  <div className="tab-content fade-in">
    <h2>My Orders</h2>
    <div className="empty-state-box">
      <Package size={48} className="text-gray" />
      <p>No active orders found.</p>
    </div>
  </div>
);

const AddressSection = () => (
  <div className="tab-content fade-in">
    <h2>Saved Addresses</h2>
    <div className="address-grid">
      <div className="address-card">
        <div className="tag">DEFAULT</div>
        <h4>Home</h4>
        <p>123, Fashion Street,<br />Indiranagar, Bangalore - 560038</p>
        <div className="card-actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
      <div className="add-new-card">
        <div className="plus-icon">+</div>
        <span>Add New Address</span>
      </div>
    </div>
  </div>
);

const SettingsSection = ({ user }) => (
  <div className="tab-content fade-in">
    <h2>Account Settings</h2>
    <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" defaultValue={user.name} />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" defaultValue={user.email} disabled />
      </div>
      <div className="form-group">
        <label>Current Password</label>
        <input type="password" placeholder="••••••••" />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input type="password" placeholder="Leave blank to keep same" />
      </div>
      <button className="btn-save">Save Changes</button>
    </form>
  </div>
);

export default AccountPage;