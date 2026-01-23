import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  CpuChipIcon,
  CloudIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Transform Your Business with <span className="highlight">PthinkS</span></h1>
            <p className="hero-subtitle">
              Leading digital transformation through innovative technology solutions, 
              expert consulting, and cutting-edge software development
            </p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">
                Our Services <ArrowRightIcon className="btn-icon" />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get Started <ArrowRightIcon className="btn-icon" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section services-preview">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Our Services</h2>
            <p>Comprehensive solutions to drive your business forward</p>
          </motion.div>

          <div className="services-grid">
            {[
              {
                icon: <CpuChipIcon className="service-icon" />,
                title: "Software Development",
                description: "Custom software solutions tailored to your business needs",
                features: ["Web Applications", "Mobile Apps", "Enterprise Software"]
              },
              {
                icon: <CloudIcon className="service-icon" />,
                title: "Cloud Solutions",
                description: "Scalable cloud infrastructure and migration services",
                features: ["Cloud Migration", "DevOps", "Cloud Security"]
              },
              {
                icon: <ShieldCheckIcon className="service-icon" />,
                title: "Cybersecurity",
                description: "Protect your digital assets with advanced security",
                features: ["Security Audits", "Compliance", "Threat Detection"]
              },
              {
                icon: <ChartBarIcon className="service-icon" />,
                title: "Data Analytics",
                description: "Transform data into actionable business insights",
                features: ["Business Intelligence", "Data Visualization", "Predictive Analytics"]
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="service-icon-wrapper">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <CheckCircleIcon className="feature-check" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose PthinkS?</h2>
            <p>Partner with industry leaders for your digital transformation</p>
          </motion.div>

          <div className="why-grid">
            {[
              {
                title: "Expert Team",
                description: "Seasoned professionals with deep industry expertise",
                icon: <UserGroupIcon className="why-icon" />
              },
              {
                title: "Proven Results",
                description: "Track record of successful project deliveries",
                icon: <ChartBarIcon className="why-icon" />
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock technical support and maintenance",
                icon: <ShieldCheckIcon className="why-icon" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="why-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="why-icon-wrapper">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Transform Your Business?</h2>
            <p>Let's discuss how PthinkS can help you achieve your digital goals</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">
                Schedule Consultation
              </Link>
              <Link to="/portfolio" className="btn btn-outline btn-large">
                View Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats">
        <div className="container">
          <div className="stats-grid">
            {[
              { number: "500+", label: "Happy Clients" },
              { number: "1200+", label: "Projects Completed" },
              { number: "15+", label: "Years Experience" },
              { number: "98%", label: "Client Satisfaction" }
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
    </div>
  );
};

export default Landing;
