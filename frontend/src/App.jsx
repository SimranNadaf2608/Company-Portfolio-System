import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Careers from './pages/Careers.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import AIPortfolio from './pages/AIPortfolio.jsx';
import GetStarted from './pages/GetStarted.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import RegistrationOTP from './pages/RegistrationOTP.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import { SnackbarProvider } from './contexts/SnackbarContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './styles/global.css';
import './styles/snackbar.css';
import './styles/Navbar.css';
import './styles/login.css';
import './styles/otp.css';
import './styles/pages.css';
import './styles/password-reset.css';
import './styles/password-visibility.css';
import './styles/loading-spinner.css';
import './styles/phone-auth.css';
import './styles/forgot-password.css';
import './styles/landing.css';

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <Router>
          <div className="App" style={{ scrollMarginTop: 0, scrollPaddingTop: 0 }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/ai-portfolio" element={<AIPortfolio />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/registration-otp" element={<RegistrationOTP />} />
            </Routes>
          </div>
        </Router>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
