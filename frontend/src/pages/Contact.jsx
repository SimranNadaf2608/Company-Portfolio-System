import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useSnackbar } from '../contexts/SnackbarContext.jsx';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: 'Contact Form Submission'
        }),
      });
      
      // Check if response is ok and contains JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server is not responding correctly');
      }
      
      const result = await response.json();
      console.log('Contact form submission response:', result);
      
      showSnackbar('Thank you for your message! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Simulate successful submission for demo purposes when backend is down
      console.log('Backend is down - simulating successful contact submission');
      setFormData({ name: '', email: '', message: '' });
      
      showSnackbar('Thank you for your message! We will get back to you soon. (Demo mode - backend not available)', 'success');
    }
  };

  return (
    <div className="contact">
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Contact Us</h1>
            <p>Get in touch with our team</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-content">
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="get-in-touch">Get in Touch</h2>
              <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <EnvelopeIcon className="contact-icon" />
                  <div>
                    <h3>Email</h3>
                    <p>hello@pthinks.com</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <PhoneIcon className="contact-icon" />
                  <div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <MapPinIcon className="contact-icon" />
                  <div>
                    <h3>Office</h3>
                    <p>123 Tech Street, Silicon Valley, CA 94025</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="contact-form"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="form" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  className="btn btn-primary send-btn"
                  style={{ padding: '0.3rem 0.2rem' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section map-section">
        <div className="container">
          <motion.div 
            className="map-placeholder"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="visit-office">Visit Our Office</h2>
            <div className="map-container">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRWKk3vcpApF9s_reD6HkpClRRFRlRMArKYw&s"
                alt="TPthinkS Office Location"
                className="map-img"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>PthinkS</h3>
              <p>Building the future of technology</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>hello@pthinks.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PthinkS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;