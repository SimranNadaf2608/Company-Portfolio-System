import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Modern online shopping platform with advanced features and seamless user experience",
      image: "https://picsum.photos/400/250?random=7",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      category: "Web Development",
      featured: true
    },
    {
      title: "Task Management App",
      description: "Productivity application with intuitive interface and powerful collaboration features",
      image: "https://picsum.photos/400/250?random=7",
      technologies: ["React Native", "Firebase", "Redux", "TypeScript"],
      category: "Mobile Development",
      featured: false                     
    },
    {
      title: "AI Analytics Dashboard",
      description: "Data visualization platform with machine learning insights and predictive analytics",
      image: "https://picsum.photos/400/250?random=7",
      technologies: ["Python", "TensorFlow", "D3.js", "Flask"],
      category: "Data Science",
      featured: true
    },
    {
      title: "Banking Website",
      description: "Secure and responsive banking platform with modern UI and comprehensive features",
      image: "https://picsum.photos/400/250?random=7",
      technologies: ["Vue.js", "Laravel", "MySQL", "JWT"],
      category: "Web Development",
      featured: false
    },
    {
      title: "Social Media Dashboard",
      description: "Analytics and management platform for social media marketing and engagement",
      image: "https://picsum.photos/400/250?random=7",
      technologies: ["Angular", "Node.js", "PostgreSQL", "Chart.js"],
      category: "Web Development",
      featured: false
    },
    {
      title: "Healthcare Portal",
      description: "Patient management system with telemedicine capabilities and secure data handling",
      image: "https://picsum.photos/400/250?random=7",
      technologies: ["React", "Python", "Django", "AWS"],
      category: "Web Development",
      featured: false
    }
  ];

  const categories = ["All", "Web Development", "Mobile Development", "Data Science"];

  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="portfolio">
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Our Portfolio</h1>
            <p>Showcasing our best work and innovative solutions</p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section filters">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Filter by Category</h2>
          </motion.div>

          <div className="filter-buttons">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="section projects-grid">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Featured Projects</h2>
            <p>Explore our recent and notable work</p>
          </motion.div>

          <div className="projects-container">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                className={`project-card ${project.featured ? 'featured' : ''}`}
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

      {/* <section className="section cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Have a Project in Mind?</h2>
            <p>Let's bring your ideas to life with our expertise</p>
            <div className="cta-buttons">
              <Link to="/get-started" className="btn btn-primary btn-large">
                Start Your Project
              </Link>
            </div>
          </motion.div>
        </div>
      </section> */}

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
                <li><a href="/portfolio">Portfolio</a></li>
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

export default Portfolio;
