const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const EmailService = require('./services/emailService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection with fallback
const connectDB = async () => {
  try {
    // Try MongoDB Atlas first
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pthinkS');
    console.log('🔗 Connected to MongoDB Atlas database');
  } catch (atlasError) {
    console.log('⚠️ MongoDB Atlas connection failed, trying local MongoDB...');
    console.log('Atlas error:', atlasError.message);
    
    try {
      // Fallback to local MongoDB
      await mongoose.connect('mongodb://localhost:27017/pthinkS');
      console.log('🔗 Connected to local MongoDB database');
    } catch (localError) {
      console.log('❌ Local MongoDB connection failed, running without database...');
      console.log('Local error:', localError.message);
      
      // Continue without database - forms will be logged but not saved
      console.log('📝 Note: Contact forms and applications will be logged to console only');
    }
  }
};

connectDB();

// Schemas
const JobSchema = new mongoose.Schema({
  title: String,
  department: String,
  location: String,
  type: String,
  experience: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const ApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  experience: String,
  coverLetter: String,
  jobId: String,
  jobTitle: String,
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  subject: String,
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const ProjectRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  projectType: String,
  budget: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

// Models
const Job = mongoose.model('Job', JobSchema);
const Application = mongoose.model('Application', ApplicationSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const User = mongoose.model('User', UserSchema);
const ProjectRequest = mongoose.model('ProjectRequest', ProjectRequestSchema);

// In-memory storage for OTP only (users now stored in database)
const otpStore = {};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize Email Service
const emailService = new EmailService();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Utility functions
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = generateToken({ id: user._id, email: user.email });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ id: user._id, email: user.email });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiry (5 minutes)
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    // Send OTP email using EmailService
    try {
      const emailResult = await emailService.sendOTPEmail(email, otp);
      console.log(`✅ OTP email sent to ${email}:`, emailResult);
    } catch (emailError) {
      console.log('⚠️ Failed to send OTP email, falling back to console:', emailError.message);
      console.log(`OTP for ${email}: ${otp}`);
    }

    // For demo, return OTP in response (remove in production)
    res.json({
      message: 'OTP sent successfully',
      otp // Remove this in production
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    // Get stored OTP
    const storedOTP = otpStore[email];
    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check expiry
    if (Date.now() > storedOTP.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP
    delete otpStore[email];

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    // Send password reset email using EmailService
    try {
      const emailResult = await emailService.sendPasswordResetEmail(email, otp);
      console.log(`✅ Password reset email sent to ${email}:`, emailResult);
    } catch (emailError) {
      console.log('⚠️ Failed to send password reset email, falling back to console:', emailError.message);
      console.log(`Password reset OTP for ${email}: ${otp}`);
    }

    res.json({
      message: 'Password reset OTP sent',
      otp // Remove in production
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP
    const storedOTP = otpStore[email];
    if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password in database
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Clear OTP
    delete otpStore[email];

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Careers endpoints
app.get('/api/careers', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Seed sample jobs (for development)
app.post('/api/seed-jobs', async (req, res) => {
  try {
    // Clear existing jobs
    await Job.deleteMany({});
    
    const sampleJobs = [
      {
        title: "Senior Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        experience: "3-5 years",
        description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks."
      },
      {
        title: "Backend Developer",
        department: "Engineering", 
        location: "Hybrid",
        type: "Full-time",
        experience: "2-4 years",
        description: "Join our backend team to build scalable APIs and services. Experience with Node.js, Express, MongoDB, and cloud platforms required."
      },
      {
        title: "UI/UX Designer",
        department: "Design",
        location: "Remote",
        type: "Full-time", 
        experience: "2-3 years",
        description: "We need a creative UI/UX Designer to create beautiful and intuitive user interfaces. Proficiency in Figma, Adobe Creative Suite, and design systems required."
      },
      {
        title: "DevOps Engineer",
        department: "Infrastructure",
        location: "On-site",
        type: "Full-time",
        experience: "3-6 years",
        description: "Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, Kubernetes, and Jenkins essential."
      },
      {
        title: "Product Manager",
        department: "Product",
        location: "Hybrid",
        type: "Full-time",
        experience: "4-7 years",
        description: "We need a Product Manager to drive product strategy and development. Strong analytical skills and experience with agile methodologies required."
      }
    ];
    
    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Seeded ${insertedJobs.length} sample jobs`);
    
    res.json({
      message: 'Sample jobs seeded successfully',
      count: insertedJobs.length,
      jobs: insertedJobs
    });
  } catch (error) {
    console.error('Error seeding jobs:', error);
    res.status(500).json({ message: 'Error seeding jobs' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { name, email, phone, experience, coverLetter, jobId, jobTitle } = req.body;
    
    const application = new Application({
      name,
      email,
      phone,
      experience,
      coverLetter,
      jobId,
      jobTitle
    });
    
    await application.save();
    console.log('✅ Application saved to database:', application);
    
    // Send email notifications
    const emailResults = await emailService.sendApplicationNotifications(application);
    
    if (emailResults.success) {
      console.log('✅ All email notifications sent successfully');
    } else {
      console.log('⚠️ Some email notifications failed:', emailResults);
    }
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application,
      emailNotifications: emailResults
    });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ message: 'Error submitting application' });
  }
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📝 Contact form (no DB):', { name, email, subject, message: message.substring(0, 100) + '...' });
      
      // Still try to send email if email service is available
      try {
        // Create a mock contact object for email
        const contactData = { name, email, message, subject, createdAt: new Date() };
        const emailResult = await emailService.sendContactNotification(contactData);
        
        return res.status(200).json({
          message: 'Contact form submitted successfully (saved to console)',
          warning: 'Database not connected - data logged to console',
          emailNotification: emailResult
        });
      } catch (emailError) {
        console.log('Email service also failed:', emailError.message);
        return res.status(200).json({
          message: 'Contact form submitted (logged to console only)',
          warning: 'Database and email service not available'
        });
      }
    }
    
    // Database is connected - save normally
    const contact = new Contact({
      name,
      email,
      message,
      subject
    });
    
    await contact.save();
    console.log('✅ Contact form saved to database:', contact);
    
    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact
    });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ message: 'Error submitting contact form' });
  }
});

// Project requests endpoint
app.post('/api/project-requests', async (req, res) => {
  try {
    const { name, email, phone, company, projectType, budget, description } = req.body;
    
    const projectRequest = new ProjectRequest({
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      description
    });
    
    await projectRequest.save();
    console.log('✅ Project request saved to database:', projectRequest);
    
    res.status(201).json({
      message: 'Project request submitted successfully',
      projectRequest
    });
  } catch (error) {
    console.error('Error saving project request:', error);
    res.status(500).json({ message: 'Error submitting project request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints available:`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/send-otp`);
  console.log(`   POST /api/auth/verify-otp`);
  console.log(`   POST /api/auth/forgot-password`);
  console.log(`   POST /api/auth/reset-password`);
  console.log(`   GET  /api/auth/me`);
  console.log(`💼 Careers endpoints available:`);
  console.log(`   GET  /api/careers`);
  console.log(`   POST /api/applications`);
  console.log(`📧 Contact endpoint available:`);
  console.log(`   POST /api/contact`);
  console.log(`🚀 Project requests endpoint available:`);
  console.log(`   POST /api/project-requests`);
});

module.exports = app;
