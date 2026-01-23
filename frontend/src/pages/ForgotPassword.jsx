import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSnackbar } from '../contexts/SnackbarContext.jsx';
import { firebaseAuth } from '../firebase/config.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showSnackbar('Please enter your email address', 'error');
      return;
    }

    if (!email.includes('@')) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending password reset OTP to:', email);
      
      // Send OTP for password reset using Firebase
      const result = await firebaseAuth.sendEmailOTP(email, 'Password Reset');
      
      console.log('Password reset OTP result:', result);
      
      if (result.success) {
        // Store email in sessionStorage for reset page
        sessionStorage.setItem('resetEmail', email);
        sessionStorage.setItem('resetOTP', result.otp);
        
        showSnackbar('Password reset OTP sent to your email! Please check your inbox.', 'success');
        
        // Redirect to reset password page
        setTimeout(() => {
          navigate('/reset-password');
        }, 1500);
      } else {
        showSnackbar(result.message || 'Error sending password reset OTP', 'error');
      }
    } catch (error) {
      console.error('Password reset OTP error:', error);
      showSnackbar('Error sending password reset OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password-container">
        <motion.div
          className="forgot-password-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="forgot-password-header">
            <Link to="/login" className="back-link">
              <ArrowLeftIcon className="back-icon" />
              Back to Login
            </Link>
            
            <div className="forgot-password-icon">
              <EnvelopeIcon className="icon" />
            </div>
            
            <h1>Reset Password</h1>
            <p>
              Enter your email address below and we'll send you an OTP to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
            </div>

            <motion.button
              type="submit"
              className="forgot-password-btn"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                'Send Reset OTP'
              )}
            </motion.button>
          </form>

          <div className="forgot-password-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="login-link">
                Back to Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
