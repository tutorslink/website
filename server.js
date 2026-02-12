// Import required packages
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests from GitHub Pages
app.use(express.json()); // Parse JSON request bodies

// Serve static files in all environments
// This allows Railway to serve the frontend for testing/verification
// In production deployments, GitHub Pages serves the main frontend
app.use(express.static('.'));

// ============================================
// MongoDB Connection
// ============================================
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.warn('⚠️  Server will continue running without database connection');
  });
} else {
  console.warn('⚠️  MONGODB_URI not set. Server running without database connection.');
  console.warn('⚠️  Database-dependent API routes will fail until MONGODB_URI is configured.');
}

// ============================================
// Email Configuration
// ============================================
let emailTransporter = null;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  console.log('✅ Email transporter configured');
} else {
  console.warn('⚠️  Email not configured. Email notifications will be skipped.');
}

// ============================================
// Encryption Utilities
// ============================================
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-cbc';
// Generate a unique salt for this application (in production, use a securely stored value)
const APP_SALT = process.env.ENCRYPTION_SALT || 'tutorslink-secure-salt-2026';

if (!ENCRYPTION_KEY) {
  console.warn('⚠️  ENCRYPTION_KEY not set. Data will be stored without encryption.');
  console.warn('⚠️  Please set ENCRYPTION_KEY in .env for production use.');
}

function encrypt(text) {
  if (!ENCRYPTION_KEY) {
    return text; // Return unencrypted if key not set
  }
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY, APP_SALT, 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  if (!ENCRYPTION_KEY) {
    return encryptedText; // Return as-is if key not set
  }
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const key = crypto.scryptSync(ENCRYPTION_KEY, APP_SALT, 32);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// ============================================
// Mongoose Schemas and Models
// ============================================

// User Schema with Role System
const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    default: 'guest',
    enum: ['guest', 'student', 'tutor', 'staff', 'admin']
  },
  displayName: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Tutor Schema
const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subjects: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  languages: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['IGCSE', 'AS/A Levels', 'University', 'Test Preparation', 'Other']
  },
  availability: {
    type: String,
    default: 'Available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'completed', 'cancelled']
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Support Message Schema
const supportMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tutor Application Schema
const tutorApplicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  discordUsername: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true
  },
  subjectCode: {
    type: String,
    required: true
  },
  examinationBoard: {
    type: String,
    required: true
  },
  academicResult: {
    type: String,
    required: true
  },
  teachingLevel: {
    type: String,
    required: true
  },
  teachingExperience: {
    type: String,
    required: true
  },
  languagesSpoken: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true
  },
  teachingFormat: {
    type: String,
    required: true,
    enum: ['One-on-one', 'Group classes', 'Both']
  },
  oneOnOneRate: {
    type: String,
    required: true
  },
  groupClassRate: {
    type: String,
    required: true
  },
  groupClassSize: {
    type: String,
    required: true
  },
  classesPerWeekMonth: {
    type: String,
    required: true
  },
  classDuration: {
    type: String,
    required: true
  },
  highestQualification: {
    type: String,
    required: true,
    enum: ['High School / IGCSE / O Levels', 'A Levels / AS Levels', 'Bachelors Degree', 'Masters Degree', 'PhD / Doctorate']
  },
  qualificationDocumentLink: {
    type: String,
    required: true
  },
  teachingVideoLink: {
    type: String,
    required: true
  },
  academicResultsLink: {
    type: String,
    required: true
  },
  professionalBio: {
    type: String,
    required: true,
    maxlength: 500
  },
  agreeToTerms: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models from schemas
const User = mongoose.model('User', userSchema);
const Tutor = mongoose.model('Tutor', tutorSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);
const TutorApplication = mongoose.model('TutorApplication', tutorApplicationSchema);

// ============================================
// API Routes
// ============================================

// Middleware to check if user has staff or admin role
async function requireStaffOrAdmin(req, res, next) {
  try {
    const firebaseUid = req.headers['x-firebase-uid'];
    
    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const user = await User.findOne({ firebaseUid });
    
    if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Staff or admin role required.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
}

// POST /api/users/register - Register or update user
app.post('/api/users/register', async (req, res) => {
  try {
    const { firebaseUid, email, displayName } = req.body;
    
    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        message: 'Firebase UID and email are required'
      });
    }
    
    // Check if user exists
    let user = await User.findOne({ firebaseUid });
    
    if (user) {
      // Update existing user
      user.email = email;
      user.displayName = displayName || user.displayName;
      user.updatedAt = Date.now();
      await user.save();
    } else {
      // Create new user with default 'guest' role
      user = new User({
        firebaseUid,
        email,
        displayName,
        role: 'guest'
      });
      await user.save();
    }
    
    res.json({
      success: true,
      data: {
        firebaseUid: user.firebaseUid,
        email: user.email,
        role: user.role,
        displayName: user.displayName
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
});

// GET /api/users/me - Get current user info
app.get('/api/users/me', async (req, res) => {
  try {
    const firebaseUid = req.headers['x-firebase-uid'];
    
    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        firebaseUid: user.firebaseUid,
        email: user.email,
        role: user.role,
        displayName: user.displayName
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// GET /api/tutors - Fetch all tutors
// Note: Consider adding rate limiting in production (e.g., express-rate-limit)
// to prevent abuse of this endpoint
app.get('/api/tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: tutors
    });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tutors',
      error: error.message
    });
  }
});

// POST /api/tutors - Add a new tutor (Staff Portal - Protected)
app.post('/api/tutors', requireStaffOrAdmin, async (req, res) => {
  try {
    const { name, subjects, price, timezone, languages, category, availability } = req.body;
    
    // Validate required fields
    if (!name || !subjects || !price || !timezone || !languages || !category) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Create new tutor
    const newTutor = new Tutor({
      name,
      subjects,
      price,
      timezone,
      languages,
      category,
      availability: availability || 'Available'
    });

    await newTutor.save();
    
    res.status(201).json({
      success: true,
      message: 'Tutor added successfully',
      data: newTutor
    });
  } catch (error) {
    console.error('Error adding tutor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add tutor',
      error: error.message
    });
  }
});

// POST /api/bookings - Create a new booking request
app.post('/api/bookings', async (req, res) => {
  try {
    const { studentName, studentEmail, tutorId, message } = req.body;
    
    // Validate required fields
    if (!studentName || !studentEmail || !tutorId) {
      return res.status(400).json({
        success: false,
        message: 'Student name, email, and tutor ID are required'
      });
    }

    // Check if tutor exists
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Create new booking
    const newBooking = new Booking({
      studentName,
      studentEmail,
      tutorId,
      message: message || '',
      status: 'pending'
    });

    await newBooking.save();
    
    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      data: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// POST /api/support - Save support message and trigger Discord webhook
// Note: Consider adding rate limiting in production (e.g., express-rate-limit)
// to prevent spam and abuse of the support form
app.post('/api/support', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Save to database
    const newSupportMessage = new SupportMessage({
      name,
      email,
      message
    });

    await newSupportMessage.save();

    // Send to Discord webhook if configured
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        const discordMessage = {
          content: `🆘 **New Support Message**\n\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}\n\n*Timestamp: ${new Date().toLocaleString()}*`
        };

        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(discordMessage)
        });
      } catch (webhookError) {
        console.error('Discord webhook error:', webhookError);
        // Don't fail the request if webhook fails
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Support message sent successfully'
    });
  } catch (error) {
    console.error('Error saving support message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send support message',
      error: error.message
    });
  }
});

// POST /api/tutor-applications - Submit tutor application
app.post('/api/tutor-applications', async (req, res) => {
  try {
    const applicationData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'userId', 'email', 'discordUsername', 'subject', 'subjectCode',
      'examinationBoard', 'academicResult', 'teachingLevel', 'teachingExperience',
      'languagesSpoken', 'country', 'reference', 'teachingFormat',
      'oneOnOneRate', 'groupClassRate', 'groupClassSize', 'classesPerWeekMonth',
      'classDuration', 'highestQualification', 'qualificationDocumentLink',
      'teachingVideoLink', 'academicResultsLink', 'professionalBio', 'agreeToTerms'
    ];
    
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate terms agreement
    if (applicationData.agreeToTerms !== true) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the Tutors Link commission terms'
      });
    }

    // Create new application
    const newApplication = new TutorApplication({
      ...applicationData,
      status: 'pending'
    });

    await newApplication.save();

    // Send confirmation email to applicant
    if (emailTransporter) {
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: applicationData.email,
          subject: 'Tutor Application Received - Tutors Link',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff00ff;">Thank You for Applying to Tutors Link!</h2>
              <p>Dear Applicant,</p>
              <p>We have successfully received your tutor application for <strong>${applicationData.subject}</strong>.</p>
              <p>Our team will review your application and get back to you within 3-5 business days.</p>
              <h3>Application Summary:</h3>
              <ul>
                <li><strong>Subject:</strong> ${applicationData.subject} (${applicationData.subjectCode})</li>
                <li><strong>Teaching Level:</strong> ${applicationData.teachingLevel}</li>
                <li><strong>Teaching Format:</strong> ${applicationData.teachingFormat}</li>
                <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
              </ul>
              <p>If you have any questions, feel free to reach out to us on Discord or Instagram.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>Tutors Link Team</strong></p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Error sending applicant email:', emailError);
      }
    }

    // Send notification email to staff
    if (emailTransporter && process.env.STAFF_EMAIL) {
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.STAFF_EMAIL,
          subject: `New Tutor Application - ${applicationData.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff00ff;">🎓 New Tutor Application</h2>
              <p><strong>Email:</strong> ${applicationData.email}</p>
              <p><strong>Discord:</strong> ${applicationData.discordUsername}</p>
              <p><strong>Subject:</strong> ${applicationData.subject} (${applicationData.subjectCode})</p>
              <p><strong>Board:</strong> ${applicationData.examinationBoard}</p>
              <p><strong>Level:</strong> ${applicationData.teachingLevel}</p>
              <p><strong>Academic Result:</strong> ${applicationData.academicResult}</p>
              <p><strong>Teaching Format:</strong> ${applicationData.teachingFormat}</p>
              <p><strong>Country:</strong> ${applicationData.country}</p>
              <p><strong>Languages:</strong> ${applicationData.languagesSpoken}</p>
              <p><strong>Qualification:</strong> ${applicationData.highestQualification}</p>
              <hr>
              <p><strong>Professional Bio:</strong></p>
              <p>${applicationData.professionalBio}</p>
              <hr>
              <p><strong>Links:</strong></p>
              <ul>
                <li><a href="${applicationData.qualificationDocumentLink}">Qualification Document</a></li>
                <li><a href="${applicationData.teachingVideoLink}">Teaching Video</a></li>
                <li><a href="${applicationData.academicResultsLink}">Academic Results</a></li>
              </ul>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Error sending staff email:', emailError);
      }
    }

    // Send Discord notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        const discordMessage = {
          embeds: [{
            title: '🎓 New Tutor Application',
            color: 0xff00ff,
            fields: [
              { name: 'Email', value: applicationData.email, inline: true },
              { name: 'Discord', value: applicationData.discordUsername, inline: true },
              { name: 'Subject', value: `${applicationData.subject} (${applicationData.subjectCode})`, inline: false },
              { name: 'Board', value: applicationData.examinationBoard, inline: true },
              { name: 'Level', value: applicationData.teachingLevel, inline: true },
              { name: 'Result', value: applicationData.academicResult, inline: true },
              { name: 'Format', value: applicationData.teachingFormat, inline: true },
              { name: 'Country', value: applicationData.country, inline: true },
              { name: 'Qualification', value: applicationData.highestQualification, inline: false },
              { name: 'Bio', value: applicationData.professionalBio.length > 200 ? applicationData.professionalBio.substring(0, 197) + '...' : applicationData.professionalBio, inline: false },
              { name: 'Qualification Doc', value: `[View](${applicationData.qualificationDocumentLink})`, inline: true },
              { name: 'Teaching Video', value: `[Watch](${applicationData.teachingVideoLink})`, inline: true },
              { name: 'Academic Results', value: `[View](${applicationData.academicResultsLink})`, inline: true }
            ],
            timestamp: new Date().toISOString()
          }]
        };

        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordMessage)
        });
      } catch (webhookError) {
        console.error('Discord webhook error:', webhookError);
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Check your email for confirmation.'
    });
  } catch (error) {
    console.error('Error submitting tutor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
});

// GET /api/tutor-applications - Get tutor applications (Staff/Admin only)
app.get('/api/tutor-applications', requireStaffOrAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build query filter
    const query = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }
    
    // Fetch applications sorted by creation date (newest first)
    const applications = await TutorApplication.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      data: applications,
      count: applications.length
    });
  } catch (error) {
    console.error('Error fetching tutor applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

// PUT /api/tutor-applications/:id - Update application status (Staff/Admin only)
app.put('/api/tutor-applications/:id', requireStaffOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }
    
    // Update application
    const application = await TutorApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Send notification email if status changed to approved or rejected
    if (emailTransporter && (status === 'approved' || status === 'rejected')) {
      try {
        const subject = status === 'approved' 
          ? 'Congratulations! Your Tutor Application Has Been Approved'
          : 'Update on Your Tutor Application';
        
        const htmlContent = status === 'approved'
          ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00ff00;">Congratulations! 🎉</h2>
              <p>Dear ${application.email},</p>
              <p>We are pleased to inform you that your tutor application for <strong>${application.subject}</strong> has been <strong>approved</strong>!</p>
              <p>You can now start teaching on Tutors Link. Our team will contact you via Discord at <strong>${application.discordUsername}</strong> with next steps.</p>
              <p>Welcome to the Tutors Link family!</p>
              <br>
              <p>Best regards,<br>The Tutors Link Team</p>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff6b6b;">Application Update</h2>
              <p>Dear ${application.email},</p>
              <p>Thank you for your interest in becoming a tutor with Tutors Link.</p>
              <p>After careful review, we are unable to approve your application for <strong>${application.subject}</strong> at this time.</p>
              <p>We encourage you to reapply in the future or reach out to us if you have any questions.</p>
              <br>
              <p>Best regards,<br>The Tutors Link Team</p>
            </div>
          `;
        
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: application.email,
          subject: subject,
          html: htmlContent
        });
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    res.json({
      success: true,
      data: application,
      message: `Application status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running, healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint for quick verification
app.get('/', (req, res) => {
  // Check if index.html exists, if not provide a simple response
  const indexPath = path.join(__dirname, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>TutorsLink API Server</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #333; }
          .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
          .success { background-color: #d4edda; color: #155724; }
          .warning { background-color: #fff3cd; color: #856404; }
        </style>
      </head>
      <body>
        <h1>🚀 TutorsLink API Server</h1>
        <div class="status success">
          <strong>✅ Server Status:</strong> Running
        </div>
        <div class="status ${isDbConnected ? 'success' : 'warning'}">
          <strong>${isDbConnected ? '✅' : '⚠️'} Database:</strong> 
          ${isDbConnected ? 'Connected' : 'Disconnected'}
        </div>
        <h2>Available Endpoints:</h2>
        <ul>
          <li><code>GET /api/health</code> - Health check</li>
          <li><code>GET /api/tutors</code> - Fetch all tutors</li>
          <li><code>POST /api/tutors</code> - Add a new tutor</li>
          <li><code>POST /api/bookings</code> - Create a booking</li>
          <li><code>POST /api/support</code> - Submit support message</li>
        </ul>
        <p><small>Time: ${new Date().toISOString()}</small></p>
      </body>
      </html>
    `);
  }
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
