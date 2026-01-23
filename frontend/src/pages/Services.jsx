import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies and best practices",
      icon: "🌐",
      features: ["Responsive Design", "SEO Optimization", "Fast Performance", "Modern Frameworks"]
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android",
      icon: "📱",
      features: ["iOS Development", "Android Development", "Cross-Platform", "UI/UX Design"]
    },
    {
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and services for modern businesses",
      icon: "☁️",
      features: ["Cloud Migration", "DevOps", "Server Management", "Data Backup"]
    },
    {
      title: "AI & Machine Learning",
      description: "Cutting-edge artificial intelligence solutions to automate and optimize processes",
      icon: "🤖",
      features: ["Predictive Analytics", "Natural Language Processing", "Computer Vision", "Automation"]
    },
    {
      title: "Digital Transformation",
      description: "Comprehensive digital strategy and transformation consulting",
      icon: "🔄",
      features: ["Process Optimization", "Digital Strategy", "Change Management", "Training"]
    },
    {
      title: "Cybersecurity",
      description: "Advanced security solutions to protect your digital assets",
      icon: "🔒",
      features: ["Security Audits", "Threat Detection", "Data Protection", "Compliance"]
    }
  ];

  return (
    <div className="services">
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Our Services</h1>
            <p>Comprehensive solutions to power your digital transformation</p>
            <div className="hero-buttons">
              <Link to="/get-started" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/portfolio" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section services-overview">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>What We Offer</h2>
            <p>Comprehensive services tailored to your business needs</p>
          </motion.div>

          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="service-icon">
                  <span className="icon-emoji">{service.icon}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-features">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="feature-tag">
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
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
            <h2>Our Process</h2>
            <p>How we deliver exceptional results</p>
          </motion.div>

          <div className="process-grid">
            {[
              {
                step: "1",
                title: "Discovery",
                description: "Understanding your needs and goals"
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
                title: "Delivery",
                description: "Launching and supporting your success"
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

      <section className="section cta">
        <div className="container">
          <div className="cta-content" style={{ margin: 0 }}>
            <h2>Ready to Get Started?</h2>
            <p>Let's discuss how our services can transform your business</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">
                Contact Us
              </Link>
              <Link to="/portfolio" className="btn btn-secondary btn-large">
                View Portfolio
              </Link>
            </div>
          </div>
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

export default Services;
