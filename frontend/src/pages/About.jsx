import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="about">
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>About PthinkS</h1>
            <p>Leading innovation in technology since 2010</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div 
            className="about-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="about-text">
              <h2 className="our-story">Our Story</h2>
              <p>
                Founded in 2010, PthinkS has been at the forefront of technological innovation. 
                We started with a small team of passionate developers and have grown into a 
                global leader in cutting-edge solutions.
              </p>
              <p>
                Our mission is to transform businesses through innovative technology solutions 
                that drive growth, efficiency, and success in the digital age.
              </p>
            </div>
            <div className="about-image">
              <img 
                src="https://www.shutterstock.com/image-photo/photo-taken-waving-hands-many-600nw-2652046733.jpg"
                alt="PthinkS Office"
                className="about-img"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section values">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </motion.div>

          <div className="values-grid">
            {[
              {
                title: "Innovation",
                description: "We push boundaries and challenge the status quo",
                color: "#ff6b6b",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=center"
              },
              {
                title: "Integrity",
                description: "We operate with honesty and transparency",
                color: "#4facfe",
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=180&h=180&fit=crop&crop=center"
              },
              {
                title: "Excellence",
                description: "We strive for the highest quality in everything",
                color: "#43e97b",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=180&h=180&fit=crop&crop=center"
              },
              {
                title: "Collaboration",
                description: "We work together to achieve great things",
                color: "#fa709a",
                image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=180&h=180&fit=crop&crop=center"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="value-icon">
                  <img src={value.image} alt={value.title} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
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

export default About;
