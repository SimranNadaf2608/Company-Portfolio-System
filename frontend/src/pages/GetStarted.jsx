import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSnackbar } from '../contexts/SnackbarContext.jsx';

const GetStarted = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    description: ''
  });
  const { showSnackbar } = useSnackbar();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.projectType || !formData.description) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    try {
      // Send to backend
      const response = await fetch('http://localhost:5000/api/project-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSnackbar('Project request submitted successfully! We will contact you within 24 hours.', 'success');
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          budget: '',
          description: ''
        });
      } else {
        showSnackbar('Error submitting project request. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting project request:', error);
      showSnackbar('Project request submitted successfully! (Demo mode - backend not available)', 'success');
      // Clear form even in demo mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        description: ''
      });
    }
  };
  return (
    <div className="get-started">
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Get Started</h1>
            <p>Ready to bring your ideas to life? Let's create something amazing together</p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary btn-large">
                View Our Services
              </Link>
              <Link to="/portfolio" className="btn btn-secondary btn-large">
                View Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section process">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>How It Works</h2>
            {/* <p>Simple steps to get your project started</p> */}
          </motion.div>

          <div className="process-grid">
            {[
              {
                step: "1",
                title: "Consultation",
                description: "We discuss your requirements and goals"
              },
              {
                step: "2", 
                title: "Planning",
                description: "Creating a detailed project roadmap"
              },
              {
                step: "3",
                title: "Development",
                description: "Building your solution with expertise"
              },
              {
                step: "4",
                title: "Launch",
                description: "Deploying and supporting your success"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="process-step"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="step-number">{step.step}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="section contact-form">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Start Your Project</h2>
            <p>Tell us about your project and we'll get back to you within 24 hours</p>
          </motion.div> */}

          {/* <motion.div 
            className="form-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form className="project-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="project-type">Project Type *</label>
                  <select 
                    id="project-type" 
                    name="projectType" 
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a project type</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="design">UI/UX Design</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select 
                    id="budget" 
                    name="budget" 
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="">Select budget range</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k+">$50,000+</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Project Description *</label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows="5" 
                  value={formData.description}
                  onChange={handleInputChange}
                  required 
                  placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary btn-large submit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Project Request
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section> */}

      <section className="section cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Have Questions?</h2>
            <p>Our team is here to help you every step of the way</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">
                Contact Support
              </Link>
              <Link to="/services" className="btn btn-secondary btn-large">
                Learn More
              </Link>
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
                <li><a href="/services">Services</a></li>
                <li><a href="/portfolio">Portfolio</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>hello@PthinkS.com</p>
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

export default GetStarted;
