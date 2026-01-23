import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { firebaseAuth } from '../firebase/config.js';

export default function Navbar() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

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
            PthinkS
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
      </nav>
    </header>
  );
}
