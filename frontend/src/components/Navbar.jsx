import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { firebaseAuth } from '../firebase/config.js';

export default function Navbar() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      
      // Call Firebase logout
      const result = await firebaseAuth.signOut();
      
      if (result.success) {
        console.log('Logout successful');
        navigate('/login');
      } else {
        console.error('Logout failed:', result.message);
        // Still navigate to login even if Firebase logout fails
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if there's an error
      navigate('/login');
    }
  };

  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="nav-left">
          <NavLink to="/services" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Services</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>About</NavLink>
          <NavLink to="/careers" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Careers</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Contact</NavLink>
        </div>

        <div className="nav-center">
          <Link className="logo" to="/">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="url(#gradient1)"/>
                <path d="M12 20L18 26L28 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3182ce"/>
                    <stop offset="100%" stop-color="#805ad5"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">PthinkS</span>
          </Link>
        </div>

        <div className="nav-right">
          {loading ? (
            <div className="loading-spinner-small"></div>
          ) : currentUser ? (
            <>
              <span className="user-welcome">Welcome, {currentUser.displayName || currentUser.email}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btn-outline" to="/login">Login</Link>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className="hamburger-menu" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu - Only Navigation Links */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <NavLink 
            to="/services" 
            className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink 
            to="/careers" 
            className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Careers
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </NavLink>
        </div>
      </div>
    </header>
  );
}
