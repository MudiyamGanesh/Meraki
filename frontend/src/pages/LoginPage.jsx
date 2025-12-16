// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import '../css/LoginPage.css';

const LoginPage = () => {
  
  const location = useLocation();

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (location.state && location.state.isRegistering !== undefined) {
      setIsRegistering(location.state.isRegistering);
    }
  }, [location]);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegistering) {
      register(name, email, password);
    } else {
      login(email, password);
    }
    
    // Redirect to Home after success
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* LEFT SIDE: IMAGE */}
        <div className="auth-image-side">
          <div className="auth-overlay">
            <h1>{isRegistering ? "Join the Revolution." : "Welcome Back."}</h1>
            <p>Experience the new era of fashion with RITI.</p>
          </div>
          <img 
            src={isRegistering 
              ? "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?auto=format&fit=crop&w=800&q=80" 
              : "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
            } 
            alt="Fashion" 
          />
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="auth-form-side">
          <div className="form-wrapper">
            <h2>{isRegistering ? "Create Account" : "Sign In"}</h2>
            <p className="subtitle">
              {isRegistering ? "Enter your details below" : "Enter your email and password"}
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name Field (Only for Register) */}
              {isRegistering && (
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="input-group">
                <Mail size={20} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <Lock size={20} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-btn">
                {isRegistering ? "Sign Up" : "Login"} <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
                <button 
                  className="toggle-link" 
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;