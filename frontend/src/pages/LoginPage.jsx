// src/pages/LoginPage.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import '../css/LoginPage.css';

// Custom SVG for the authentic Google logo
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" style={{ display: 'block' }}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const LoginPage = () => {
  const { showToast } = useToast();
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const containerRef = useRef(null);
  
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

  const handleAuthError = (errorMessage) => {
    const msg = errorMessage || "Authentication failed.";
    if (msg.includes("email-already-in-use")) {
      setErrors({ email: "Email already registered." });
    } else if (msg.includes("wrong-password") || msg.includes("user-not-found") || msg.includes("invalid-credential")) {
      setErrors({ form: "Invalid credentials." });
    } else if (msg.includes("popup-closed-by-user")) {
      // Do nothing, the user just closed the Google window
    } else {
      showToast(msg, "error");
    }
  };

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    
    const result = await loginWithGoogle();
    
    if (result.success) {
      showToast("Style loaded.", "success");
      navigate('/');
    } else {
      handleAuthError(result.error);
    }
    setIsGoogleLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (isFlipped) { 
      if (!validateForm('register')) { 
        setIsLoading(false); 
        return; 
      }
      const result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        showToast('Welcome to the inner circle.', 'success');
        navigate('/');
      } else {
        handleAuthError(result.error);
      }
    } else { 
      if (!validateForm('login')) { 
        setIsLoading(false); 
        return; 
      }
      const result = await login(formData.email, formData.password);
      if (result.success) {
        showToast("Style loaded.");
        navigate('/');
      } else {
        handleAuthError(result.error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="aurora-container">
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>

      <div className="flip-wrapper">
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          
          {/* ==============================
              FRONT SIDE: LOGIN 
          ============================== */}
          <div className="flip-card-front spotlight-card" ref={containerRef} onMouseMove={handleMouseMove}>
            <div className="brand-logo">
                <h1>रीति</h1>
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

              <button className="brand-btn" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="spinner" /> : <>SIGN IN <ArrowRight size={18}/></>}
              </button>
            </form>

            {/* --- GOOGLE BUTTON (LOGIN) --- */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '15px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            </div>
            
            <button 
              type="button" 
              onClick={handleGoogleAuth} 
              disabled={isLoading || isGoogleLoading}
              style={{ 
                width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s ease', outline: 'none'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            >
              {isGoogleLoading ? <Loader2 className="spinner" size={20} /> : <><GoogleIcon /> Continue with Google</>}
            </button>

            <div className="switch-text" style={{ marginTop: '25px' }}>
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
                <h1>रीति</h1>
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

              <button className="brand-btn" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="spinner" /> : <>REGISTER <ArrowRight size={18}/></>}
              </button>
            </form>

            {/* --- GOOGLE BUTTON (REGISTER) --- */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '15px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            </div>
            
            <button 
              type="button" 
              onClick={handleGoogleAuth} 
              disabled={isLoading || isGoogleLoading}
              style={{ 
                width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s ease', outline: 'none'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            >
              {isGoogleLoading ? <Loader2 className="spinner" size={20} /> : <><GoogleIcon /> Continue with Google</>}
            </button>

            <div className="switch-text" style={{ marginTop: '25px' }}>
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