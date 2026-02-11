// src/pages/LoginPage.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import '../css/LoginPage.css';

const LoginPage = () => {
  const { showToast } = useToast();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const containerRef = useRef(null);
  
  // Spotlight effect logic (Kept it, it looks premium)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty('--mouse-x', `${e.clientX - left}px`);
    containerRef.current.style.setProperty('--mouse-y', `${e.clientY - top}px`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = (type) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be 6+ chars.";
    }

    if (type === 'register') {
      if (!formData.name.trim()) newErrors.name = "Name is required.";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (isFlipped) { 
        // REGISTER
        if (!validateForm('register')) { setIsLoading(false); return; }
        await register(formData.name, formData.email, formData.password);
        showToast('Welcome to the inner circle.', 'success');
        navigate('/');
      } else { 
        // LOGIN
        if (!validateForm('login')) { setIsLoading(false); return; }
        await login(formData.email, formData.password);
        showToast("Style loaded.");
        navigate('/');
      }
    } catch (error) {
      const msg = error.message || "Authentication failed.";
      if (msg.includes("email-already-in-use")) setErrors({ email: "Email already registered." });
      else if (msg.includes("wrong-password") || msg.includes("user-not-found")) setErrors({ form: "Invalid credentials." });
      else showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="aurora-container">
      {/* Background Blobs - Subtle Atmosphere */}
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>

      <div className="flip-wrapper">
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          
          {/* ==============================
              FRONT SIDE: LOGIN 
          ============================== */}
          <div className="flip-card-front spotlight-card" ref={containerRef} onMouseMove={handleMouseMove}>
            <div className="brand-logo">
                {/* Replaced Icon with Hindi Text to match Header */}
                <h1>PARADOX</h1>
            </div>
            
            <h2>Member Login</h2>
            <p className="subtitle">Secure access to your collection.</p>

            <form onSubmit={handleSubmit}>
              {errors.form && <div className="error-banner"><AlertCircle size={16} style={{marginRight:8}}/> {errors.form}</div>}

              <div className="input-box">
                <Mail size={18} className="icon"/>
                <input type="email" name="email" placeholder="EMAIL ADDRESS" 
                  value={formData.email} onChange={handleChange} 
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-box">
                <Lock size={18} className="icon"/>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="PASSWORD" 
                  value={formData.password} onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button className="brand-btn" disabled={isLoading}>
                {isLoading ? <Loader2 className="spinner" /> : <>SIGN IN <ArrowRight size={18}/></>}
              </button>
            </form>

            <div className="switch-text">
              <span>Not a member?</span>
              <button type="button" className="text-btn" onClick={() => { setIsFlipped(true); setErrors({}); }}>
                Create Account
              </button>
            </div>
          </div>

          {/* ==============================
              BACK SIDE: REGISTER 
          ============================== */}
          <div className="flip-card-back spotlight-card">
            <div className="brand-logo">
                <h1>PARADOX</h1>
            </div>
            
            <h2>Join the Club</h2>
            <p className="subtitle">Early access to new drops.</p>

            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <User size={18} className="icon"/>
                <input type="text" name="name" placeholder="FULL NAME" 
                  value={formData.name} onChange={handleChange}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="input-box">
                <Mail size={18} className="icon"/>
                <input type="email" name="email" placeholder="EMAIL ADDRESS" 
                  value={formData.email} onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-box">
                <Lock size={18} className="icon"/>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="PASSWORD" 
                  value={formData.password} onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="input-box">
                <Lock size={18} className="icon"/>
                <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="CONFIRM PASSWORD" 
                  value={formData.confirmPassword} onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <button className="brand-btn" disabled={isLoading}>
                {isLoading ? <Loader2 className="spinner" /> : <>REGISTER <ArrowRight size={18}/></>}
              </button>
            </form>

            <div className="switch-text">
              <span>Already a member?</span>
              <button type="button" className="text-btn" onClick={() => { setIsFlipped(false); setErrors({}); }}>
                Sign In
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;