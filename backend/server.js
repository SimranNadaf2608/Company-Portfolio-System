const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pthinkS')
.then(() => {
  console.log('🔗 Connected to pthinkS database');
}).catch((error) => {
  console.error('❌ Database connection error:', error);
});

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

// In-memory database (replace with actual database in production)
const users = [];
const otpStore = {};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
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

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
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

    // Send email (in production, use actual email service)
    console.log(`OTP for ${email}: ${otp}`);

    // For demo, return OTP in response
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
app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email }
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

    // Check if user exists
    const user = users.find(u => u.email === email);
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

    console.log(`Password reset OTP for ${email}: ${otp}`);

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

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);

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
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application
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
