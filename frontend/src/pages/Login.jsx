import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useSnackbar } from '../contexts/SnackbarContext.jsx';
import { firebaseAuth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext.jsx';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    console.log('Login page - Current user:', currentUser);
    console.log('Login page - Auth loading:', authLoading);
    if (currentUser) {
      console.log('User already logged in, redirecting to home');
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Show loading while Firebase auth initializes
  if (authLoading) {
    return (
      <div className="login" style={{ marginTop: '80px' }}>
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="loading-spinner"></div>
              <h1>Initializing...</h1>
              <p>Setting up your secure connection</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 handleSubmit called!');
    console.log('🚀 Form submitted. isLogin:', isLogin);
    console.log('🚀 Form data:', formData);
    console.log('🚀 isLogin value:', isLogin);
    console.log('🚀 Should go to registration:', !isLogin);
    
    // Check form validity
    const form = e.target;
    console.log('🚀 Form element:', form);
    console.log('🚀 Form checkValidity():', form.checkValidity());
    
    // Check each field individually
    const email = form.email?.value;
    const password = form.password?.value;
    const confirmPassword = form.confirmPassword?.value;
    const name = form.name?.value;
    
    console.log('🚀 Email:', email);
    console.log('🚀 Password:', password);
    console.log('🚀 Confirm Password:', confirmPassword);
    console.log('🚀 Name:', name);
    console.log('🚀 All fields present:', !!(email && password && confirmPassword && name));
    
    setLoading(true);
    
    if (isLogin) {
      // Handle Firebase login
      const result = await firebaseAuth.signIn(formData.email, formData.password);
      if (result.success) {
        showSnackbar('Login successful!', 'success');
        navigate('/');
      } else {
        showSnackbar(result.message || 'Login failed. Please try again.', 'error');
      }
    } else {
      // Handle Firebase registration with email OTP
      console.log('🔵 Starting registration process...');
      
      if (formData.password !== formData.confirmPassword) {
        console.log('❌ Passwords do not match');
        showSnackbar('Passwords do not match!', 'error');
        setLoading(false);
        return;
      }
      
      console.log('🟢 Passwords match, proceeding with registration');
      console.log('🟢 Starting registration with:', formData.email);
      
      try {
        // Send OTP to email
        console.log('📧 Calling firebaseAuth.sendEmailOTP...');
        const result = await firebaseAuth.sendEmailOTP(formData.email, formData.name);
        console.log('📧 OTP result:', result);
        
        if (result.success) {
          console.log('OTP sent successfully, navigating to OTP page');
          
          // Store registration data in sessionStorage
          const registrationData = {
            email: formData.email,
            name: formData.name,
            password: formData.password
          };
          
          console.log('Storing registration data:', registrationData);
          sessionStorage.setItem('registrationData', JSON.stringify(registrationData));
          
          showSnackbar('Verification code sent to your email!', 'success');
          // Navigate to OTP verification page
          console.log('Navigating to /registration-otp');
          navigate('/registration-otp');
          setLoading(false); // Fix: Set loading to false
        } else {
          console.log('OTP failed:', result.message);
          showSnackbar(result.message || 'Error sending verification code', 'error');
          setLoading(false);
        }
      } catch (error) {
        console.error('Registration error:', error);
        showSnackbar('Error sending verification code', 'error');
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login" style={{ marginTop: '80px' }}>
      <div className="login-container">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="login-header">
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p>
              {isLogin 
                ? 'Sign in to access your account' 
                : 'Join our community of innovators'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="password-icon" />
                  ) : (
                    <EyeIcon className="password-icon" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="password-icon" />
                    ) : (
                      <EyeIcon className="password-icon" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password" style={{margin: 0, padding: 0}}>Forgot password?</Link>
              </div>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary login-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <motion.button
              className="btn btn-secondary social-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue with Google
            </motion.button>
            <motion.button
              className="btn btn-secondary social-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue with LinkedIn
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="login-info"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Why Join PthinkS?</h2>
          <ul className="benefits-list">
            <li>Access to exclusive job opportunities</li>
            <li>Connect with industry professionals</li>
            <li>Track your application status</li>
            <li>Get personalized job recommendations</li>
            <li>Join our talent community</li>
          </ul>
          
          <div className="testimonial">
            <p>"PthinkS helped me find my dream job. The platform is intuitive and the opportunities are amazing!"</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div>
                <strong>Sarah Johnson</strong>
                <span>Senior Developer</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
