import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LockClosedIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useSnackbar } from '../contexts/SnackbarContext.jsx';
import { firebaseAuth } from '../firebase/config.js';

const ResetPassword = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isExpired, setIsExpired] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(true);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve reset email from sessionStorage
    const email = sessionStorage.getItem('resetEmail');
    const otpData = sessionStorage.getItem('resetOTP');
    
    console.log('ResetPassword - Retrieved email:', email);
    console.log('ResetPassword - Retrieved OTP data:', otpData);
    
    if (email) {
      setResetEmail(email);
    } else {
      console.log('ResetPassword - No reset email found, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isExpired && showOtpForm) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && showOtpForm) {
      setIsExpired(true);
      showSnackbar('OTP expired. Please request a new one.', 'error');
    }
  }, [timeLeft, isExpired, showOtpForm, showSnackbar]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`reset-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    console.log('Reset Password OTP Verification - Entered code:', otpCode);
    
    if (otpCode.length !== 6) {
      showSnackbar('Please enter all 6 digits', 'error');
      return;
    }

    setLoading(true);

    try {
      // Verify OTP (for demo, we'll just check if it matches stored OTP)
      const storedOtp = sessionStorage.getItem('resetOTP');
      
      if (otpCode === storedOtp) {
        console.log('OTP verified successfully');
        showSnackbar('OTP verified! Please enter your new password.', 'success');
        setShowOtpForm(false);
        setTimeLeft(30); // Reset timer for password form
        setIsExpired(false);
      } else {
        showSnackbar('Invalid OTP. Please enter the correct code.', 'error');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      showSnackbar('Error verifying OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showSnackbar('Passwords do not match!', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showSnackbar('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      console.log('Resetting password for:', resetEmail);
      
      // In production, you would call Firebase password reset function
      // For demo, we'll just simulate success
      const result = { success: true, message: 'Password reset successful!' };
      
      if (result.success) {
        showSnackbar('Password reset successful! Please login with your new password.', 'success');
        
        // Clear session storage
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetOTP');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showSnackbar(result.message || 'Error resetting password', 'error');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      showSnackbar('Error resetting password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    // Redirect back to forgot password to resend OTP
    navigate('/forgot-password');
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
              {showOtpForm ? <KeyIcon className="icon" /> : <LockClosedIcon className="icon" />}
            </div>
            
            <h1>{showOtpForm ? 'Verify OTP' : 'Reset Password'}</h1>
            <p>
              {showOtpForm 
                ? `Enter the 6-digit code sent to ${resetEmail}`
                : 'Enter your new password below'
              }
            </p>
          </div>

          {showOtpForm ? (
            <form onSubmit={handleOtpSubmit} className="forgot-password-form">
              <div className="otp-inputs">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    key={index}
                    id={`reset-otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={otp[index] || ''}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input"
                    disabled={loading}
                  />
                ))}
              </div>

              <div className="timer-info">
                {timeLeft > 0 && !isExpired ? (
                  <p>OTP expires in {timeLeft} seconds</p>
                ) : (
                  <p className="expired">OTP expired</p>
                )}
              </div>

              <motion.button
                type="submit"
                className="forgot-password-btn"
                disabled={loading || isExpired}
                whileHover={{ scale: loading || isExpired ? 1 : 1.02 }}
                whileTap={{ scale: loading || isExpired ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="loading-spinner-small"></div>
                ) : (
                  'Verify OTP'
                )}
              </motion.button>

              <div className="resend-otp">
                <p>
                  Didn't receive the code?{' '}
                  <button type="button" onClick={handleResendOTP} className="resend-btn">
                    Resend OTP
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter new password"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    required
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
                  'Reset Password'
                )}
              </motion.button>
            </form>
          )}

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

export default ResetPassword;
