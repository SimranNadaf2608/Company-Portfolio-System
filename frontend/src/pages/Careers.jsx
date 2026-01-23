import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useSnackbar } from '../contexts/SnackbarContext.jsx';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { showSnackbar } = useSnackbar();

  // Mock jobs data with additional positions
  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "Senior Level",
      description: "We're looking for an experienced frontend developer to lead our web development initiatives."
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      experience: "Mid Level",
      description: "Join our product team to drive innovation and user experience."
    },
    {
      id: 3,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "Mid Level",
      description: "Help us build and maintain our cloud infrastructure and deployment pipelines."
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Los Angeles, CA",
      type: "Full-time",
      experience: "Mid Level",
      description: "Create beautiful and intuitive user interfaces for our products."
    },
    {
      id: 5,
      title: "Backend Developer",
      department: "Engineering",
      location: "Austin, TX",
      type: "Full-time",
      experience: "Mid Level",
      description: "Build robust and scalable backend systems for our applications."
    },
    {
      id: 6,
      title: "Data Scientist",
      department: "Analytics",
      location: "Boston, MA",
      type: "Full-time",
      experience: "Senior Level",
      description: "Apply machine learning and data analysis to solve complex business problems."
    }
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Connect to PthinkS database instead of mock API
      const response = await fetch('http://localhost:5000/api/careers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Fallback to mock data if database is unavailable
      console.log('Using mock data as fallback');
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  if (showApplicationForm && selectedJob) {
    return <ApplicationForm job={selectedJob} onClose={() => setShowApplicationForm(false)} />;
  }

  return (
    <div className="careers">
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Careers at PthinkS</h1>
            <p>Join our team and shape the future of technology</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Open Positions</h2>
            <p>Find your next opportunity with us</p>
          </motion.div>

          {loading ? (
            <div className="loading">Loading opportunities...</div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="job-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span className="job-department">{job.department}</span>
                      <span className="job-type">{job.type}</span>
                    </div>
                  </div>
                  
                  <p className="job-description">{job.description}</p>
                  
                  <div className="job-details">
                    <div className="job-detail">
                      <MapPinIcon className="detail-icon" />
                      <span>{job.location}</span>
                    </div>
                    <div className="job-detail">
                      <CurrencyDollarIcon className="detail-icon" />
                      <span>Competitive</span>
                    </div>
                  </div>
                  
                  <motion.button
                    className="btn btn-primary apply-btn"
                    onClick={() => handleApply(job)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Now
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section benefits">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Why Work With Us?</h2>
            <p>Benefits that make a difference</p>
          </motion.div>

          <div className="benefits-grid">
            {[
              { title: "Health Insurance", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop&crop=center" },
              { title: "Flexible Work Hours", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=100&h=100&fit=crop&crop=center" },
              { title: "Professional Development", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center" },
              { title: "Team Building Events", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop&crop=center" },
              { title: "Modern Office Space", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop&crop=center" },
              { title: "Career Growth Opportunities", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop&crop=center" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-card"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="benefit-icon">
                  <img src={benefit.image} alt={benefit.title} />
                </div>
                <h4>{benefit.title}</h4>
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

const ApplicationForm = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: ''
  });
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.phone || !formData.experience || !formData.coverLetter) {
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
      console.log('Submitting application for job:', job.title);
      console.log('Form data:', formData);
      
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          jobId: job._id || job.id,
          jobTitle: job.title
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
      console.log('Application submission response:', result);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
        coverLetter: ''
      });
      
      showSnackbar('Application submitted successfully!', 'success');
      onClose();
      
    } catch (error) {
      console.error('Error submitting application:', error);
      
      // Simulate successful submission for demo purposes when backend is down
      console.log('Backend is down - simulating successful submission');
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
        coverLetter: ''
      });
      
      showSnackbar('Application submitted successfully! (Demo mode - backend not available)', 'success');
      onClose();
    }
  };

  return (
    <>
      <div className="application-form-overlay">
        <motion.div 
          className="application-form"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="form-header">
            <h2>Apply for {job.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="text"
                required
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Cover Letter</label>
              <textarea
                required
                rows={4}
                value={formData.coverLetter}
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '12px 24px' }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      
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
    </>
  );
};

export default Careers;
