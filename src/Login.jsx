import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig.js";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css"; // Import the CSS file

function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
    resetEmail: false
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate fields before submission
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError("Invalid email or password");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateEmail(resetEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccessMessage("Password reset link sent! Check your email.");
      setTimeout(() => {
        setShowReset(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Reset error:", error);
      if (error.code === 'auth/user-not-found') {
        setError("No account found with this email");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field, value) => {
    if (!touchedFields[field]) return null;
    
    switch (field) {
      case 'email':
      case 'resetEmail':
        return !validateEmail(value) ? "Please enter a valid email address" : null;
      case 'password':
        return !validatePassword(value) ? "Password must be at least 6 characters" : null;
      default:
        return null;
    }
  };

  if (showReset) {
    return (
      <div className="container-login">
        <div className="card-login">
          <h2>Reset Password</h2>
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <form onSubmit={handleResetPassword}>
            <div className={`input-group ${getFieldError('resetEmail', resetEmail) ? 'error' : ''}`}>
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                onBlur={() => handleBlur('resetEmail')}
                required
                disabled={isLoading}
              />
            </div>
            {getFieldError('resetEmail', resetEmail) && (
              <div className="error-message">
                {getFieldError('resetEmail', resetEmail)}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={isLoading ? 'button-loading' : ''}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <p 
            onClick={() => !isLoading && setShowReset(false)}
            tabIndex="0"
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && setShowReset(false)}
            role="button"
            aria-label="Back to login"
          >
            ← Back to Login
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-login">
      <div className="card-login">
        <h2>Welcome Back</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className={`input-group ${getFieldError('email', email) ? 'error' : ''}`}>
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              required
              disabled={isLoading}
              aria-label="Email address"
            />
          </div>
          {getFieldError('email', email) && (
            <div className="error-message">
              {getFieldError('email', email)}
            </div>
          )}
          
          <div className={`input-group ${getFieldError('password', password) ? 'error' : ''}`}>
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              required
              disabled={isLoading}
              aria-label="Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {getFieldError('password', password) && (
            <div className="error-message">
              {getFieldError('password', password)}
            </div>
          )}
          
          <p 
            onClick={() => !isLoading && setShowReset(true)}
            tabIndex="0"
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && setShowReset(true)}
            role="button"
            aria-label="Forgot password"
          >
            Forgot Password?
          </p>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'button-loading' : ''}
          >
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        

       
      </div>
    </div>
  );
}

export default Login;