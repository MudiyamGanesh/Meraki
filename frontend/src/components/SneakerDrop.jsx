import React, { useState } from 'react';
import { Timer, Bell, Lock } from 'lucide-react';
import '../css/SneakerDrop.css';

const SneakerDrop = () => {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if(email) setNotified(true);
  };

  return (
    <div className="sneaker-drop-container">
      <div className="glitch-wrapper">
        <h1 className="glitch-text" data-text="SNEAKER HEADS">SNEAKER HEADS</h1>
      </div>
      
      <div className="drop-card">
        <div className="drop-status">
          <Lock size={16} /> LOCKED ACCESS
        </div>
        
        <img 
          src="https://images-static.nykaa.com/media/catalog/product/a/6/a6c2321TSSPA258492_1.jpg?tr=w-500" 
          alt="Mystery Sneaker" 
          className="mystery-shoe"
        />
        
        <div className="timer-box">
          <div className="time-unit">
            <span>04</span>
            <label>DAYS</label>
          </div>
          <span className="colon">:</span>
          <div className="time-unit">
            <span>12</span>
            <label>HRS</label>
          </div>
          <span className="colon">:</span>
          <div className="time-unit">
            <span>30</span>
            <label>MINS</label>
          </div>
        </div>

        {!notified ? (
          <form className="notify-form" onSubmit={handleNotify}>
            <input 
              type="email" 
              placeholder="Enter email for early access" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">
              <Bell size={18} /> NOTIFY ME
            </button>
          </form>
        ) : (
          <div className="success-msg">
            You're on the list! Watch your inbox. 👟
          </div>
        )}
      </div>
    </div>
  );
};

export default SneakerDrop;