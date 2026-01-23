import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AIPortfolio = () => {
  const aiProjects = [
    {
      title: "AI-Powered Analytics",
      description: "Advanced analytics platform using machine learning for predictive insights and automated reporting",
      image: "https://images.unsplash.com/photo-1551288049-3d27b0955067?w=400&h=250&fit=crop&crop=center",
      technologies: ["Python", "TensorFlow", "React", "D3.js"],
      category: "Data Science",
      featured: true
    },
    {
      title: "Intelligent Chatbot",
      description: "Conversational AI assistant with natural language processing and contextual understanding",
      image: "https://images.unsplash.com/photo-15317467828-7e6f5f27?w=400&h=250&fit=crop&crop=center",
      technologies: ["Node.js", "OpenAI", "TypeScript", "WebSocket"],
      category: "AI/ML",
      featured: true
    },
    {
      title: "Computer Vision System",
      description: "Real-time image recognition and analysis system for security and quality control",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop&crop=center",
      technologies: ["Python", "PyTorch", "OpenCV", "Flask"],
      category: "Computer Vision",
      featured: false
    },
    {
      title: "Predictive Maintenance",
      description: "IoT system with AI-powered predictive maintenance scheduling and failure prevention",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop&crop=center",
      technologies: ["Python", "Scikit-learn", "React", "MQTT"],
      category: "IoT",
      featured: false
    },
    {
      title: "Natural Language Processor",
      description: "Advanced NLP system for text analysis, sentiment analysis, and language translation",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center",
      technologies: ["Python", "NLTK", "spaCy", "FastAPI"],
      category: "NLP",
      featured: false
    },
    {
      title: "AI Recommendation Engine",
      description: "Machine learning-based recommendation system for personalized content delivery and user engagement",
      image: "https://images.unsplash.com/photo-1556738332-5e527a5045e4?w=400&h=250&fit=crop&crop=center",
      technologies: ["Python", "Pandas", "Redis", "React"],
      category: "Data Science",
      featured: false
    }
  ];

  return (
    <div className="ai-portfolio">
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>AI Portfolio</h1>
            <p>Showcasing our cutting-edge artificial intelligence and machine learning projects</p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-primary">
                Discuss Your Project
              </Link>
              <Link to="/portfolio" className="btn btn-secondary">
                View All Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section ai-projects">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>AI & Machine Learning Projects</h2>
            <p>Explore our innovative artificial intelligence solutions</p>
          </motion.div>

          <div className="ai-projects-grid">
            {aiProjects.map((project, index) => (
              <motion.div
                key={index}
                className={`ai-project-card ${project.featured ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  {project.featured && <div className="featured-badge">Featured</div>}
                </div>
                <div className="project-content">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <div className="project-category">{project.category}</div>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    <motion.button
                      className="btn btn-outline"
                      style={{ padding: '12px 24px' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      className="btn btn-primary"
                      style={{ padding: '12px 24px' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Interested in AI Solutions?</h2>
            <p>Let's discuss how our AI expertise can transform your business</p>
            <div className="cta-buttons">
              <motion.button 
                className="btn btn-primary btn-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start AI Project
              </motion.button>
              <motion.button 
                className="btn btn-secondary btn-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
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
                <li><a href="/ai-portfolio">AI Portfolio</a></li>
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

export default AIPortfolio;
