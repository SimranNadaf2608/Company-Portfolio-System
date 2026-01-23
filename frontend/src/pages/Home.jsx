import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/solid';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Welcome to PthinkS</h1>
            <p>Innovating the future with cutting-edge technology solutions</p>
            <div className="hero-buttons">
              <Link to="/careers" className="btn btn-primary">
                Explore Careers <ArrowRightIcon className="btn-icon" />
              </Link>
              <motion.button 
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXc', '_blank')}
              >
                <PlayIcon className="btn-icon" /> Watch Video
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section vision-mission">
        <div className="container">
          <motion.div 
            className="vision-mission-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="vision-card"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="vision-icon">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=80&h=80&fit=crop&crop=center"
                  alt="Vision"
                  className="vision-image"
                />
              </div>
              <h3>Our Vision</h3>
              <p>To be a global leader in technological innovation, transforming businesses and improving lives through cutting-edge solutions that shape the future of digital transformation.</p>
            </motion.div>

            <motion.div
              className="mission-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="mission-icon">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=80&fit=crop&crop=center"
                  alt="Mission"
                  className="mission-image"
                />
              </div>
              <h3>Our Mission</h3>
              <p>To empower organizations with innovative technology solutions, fostering growth and efficiency while maintaining the highest standards of integrity, excellence, and customer satisfaction.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose PthinkS?</h2>
            <p>We're more than just a company - we're a community of innovators</p>
          </motion.div>

          <div className="features-grid">
            {[
              {
                title: "Innovation",
                description: "Cutting-edge technology and creative solutions",
                color: "#ff6b6b",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=center"
              },
              {
                title: "Growth",
                description: "Endless opportunities for professional development",
                color: "#4facfe",
                image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=180&h=180&fit=crop&crop=center"
              },
              {
                title: "Culture",
                description: "Inclusive environment where everyone thrives",
                color: "#43e97b",
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=180&h=180&fit=crop&crop=center"
              },
              {
                title: "Impact",
                description: "Make a difference in the world",
                color: "#fa709a",
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=180&h=180&fit=crop&crop=center"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="feature-icon">
                  <img src={feature.image} alt={feature.title} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section stats">
        <div className="container">
          <div className="section-header">
            <h2>Our Achievements</h2>
            <p>A few numbers that speak for us</p>
          </div>
          <div className="stats-grid">
            {[
              { number: "500+", label: "Employees" },
              { number: "50+", label: "Countries" },
              { number: "1000+", label: "Projects" },
              { number: "99%", label: "Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
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

export default Home;
