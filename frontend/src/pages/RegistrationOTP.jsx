import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { KeyIcon, ArrowLeftIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useSnackbar } from '../contexts/SnackbarContext.jsx';
import { firebaseAuth } from '../firebase/config.js';

const RegistrationOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isExpired, setIsExpired] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve registration data from sessionStorage
    const data = sessionStorage.getItem('registrationData');
    console.log('RegistrationOTP - Raw sessionStorage data:', data);
    
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('RegistrationOTP - Parsed registration data:', parsedData);
      setRegistrationData(parsedData);
    } else {
      // Redirect to login if no registration data
      console.log('RegistrationOTP - No registration data found, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
      showSnackbar('OTP expired. Please request a new one.', 'error');
    }
  }, [timeLeft, isExpired]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`reg-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reg-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    console.log('OTP Verification - Entered code:', otpCode);
    console.log('OTP Verification - Registration data:', registrationData);
    
    if (otpCode.length !== 6) {
      showSnackbar('Please enter all 6 digits', 'error');
      return;
    }

    if (!registrationData) {
      showSnackbar('Registration data not found', 'error');
      return;
    }

    console.log('OTP Verification - Password from registrationData:', registrationData.password);
    console.log('OTP Verification - Password length:', registrationData.password?.length);

    setLoading(true);

    try {
      console.log('Verifying OTP:', otpCode, 'for:', registrationData.email);
      
      // Verify OTP and create user with Firebase
      const result = await firebaseAuth.verifyEmailOTP(
        registrationData.email, 
        otpCode, 
        registrationData.password, 
        registrationData.name
      );
      
      console.log('OTP Verification - Firebase result:', result);
      
      if (result.success) {
        console.log('OTP Verification - Success, preparing to navigate');
        if (result.userExists) {
          showSnackbar('Account already exists! Redirecting to home...', 'success');
        } else {
          showSnackbar('Registration successful! Welcome to PthinkS!', 'success');
        }
        
        // Clear registration data
        sessionStorage.removeItem('registrationData');
        
        // Add small delay to ensure snackbar shows before navigation
        setTimeout(() => {
          console.log('OTP Verification - Navigating to home page');
          navigate('/'); // Navigate to home page instead of login
        }, 1500);
      } else {
        showSnackbar(result.message || 'Invalid verification code', 'error');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      showSnackbar('Error verifying code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!registrationData) return;

    try {
      console.log('Resending OTP to:', registrationData.email);
      
      const result = await firebaseAuth.sendEmailOTP(registrationData.email, registrationData.name);
      
      if (result.success) {
        showSnackbar('New verification code sent!', 'success');
        setOtp(['', '', '', '', '', '']);
        setTimeLeft(30); // Reset timer
        setIsExpired(false); // Reset expired state
        console.log('New OTP for demo:', result.otp);
      } else {
        showSnackbar('Error resending code', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Error resending code', 'error');
    }
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

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
            <Link to="/login" className="back-link">
              <ArrowLeftIcon className="back-icon" />
              Back to Registration
            </Link>
            <div className="registration-icon">
              <UserPlusIcon className="icon-large" />
            </div>
            <h1>Verify Your Email</h1>
            <p>We've sent a 6-digit code to <strong>{registrationData.email}</strong></p>
            <p className="sub-text">Enter it below to complete your registration</p>
            
            {/* Timer Display */}
            <div className="timer-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
              {isExpired ? (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>OTP Expired</span>
              ) : (
                <span style={{ color: timeLeft <= 10 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                  Time remaining: {timeLeft}s
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="otp-container">
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`reg-otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input"
                    required
                  />
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <motion.button
                type="submit"
                className="btn btn-primary btn-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || isExpired}
              >
                {loading ? 'Verifying...' : 'Complete Registration'}
              </motion.button>
            </div>
          </form>

          <div className="login-footer">
            <p>
              Didn't receive the code?{' '}
              <button type="button" className="link" onClick={handleResendOTP}>
                Resend Code
              </button>
            </p>
            <p>
              Wrong email?{' '}
              <Link to="/login" className="link">
                Start Over
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationOTP;
