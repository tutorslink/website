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

// User Schema - Core user management with roles
const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['guest', 'student', 'tutor', 'admin'],
    default: 'guest'
  },
  displayName: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  preferredCurrency: {
    type: String,
    default: 'USD'
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'ar'],
    default: 'en'
  },
  discordId: {
    type: String,
    sparse: true
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

// Tutor Profile Schema - Extended tutor information
const tutorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  subjects: [{
    level: String, // e.g., 'IGCSE', 'AS/A Levels', 'University'
    subjectName: String,
    subjectCode: String
  }],
  bio: {
    type: String,
    maxlength: 1000
  },
  testimonials: [{
    text: String,
    author: String,
    date: Date
  }],
  pricing: {
    oneOnOneRate: Number, // stored in USD
    groupClassRate: Number,
    groupClassSize: Number,
    currency: String
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'limited', 'unavailable'],
      default: 'available'
    },
    schedule: String
  },
  languages: [String],
  timezone: String,
  examinationBoards: [String],
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
    documentLink: String
  }],
  teachingExperience: String,
  videoLink: String,
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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

// Legacy Tutor Schema (keeping for backward compatibility)
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

// Booking Schema (Demo class bookings)
const bookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
    ref: 'User',
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
  scheduledDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  cancelledAt: Date
});

// Enrollment Schema - Monthly subscription management
const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'completed'],
    default: 'active'
  },
  monthlyRate: {
    type: Number,
    required: true // stored in USD
  },
  commissionRate: {
    type: Number,
    required: true,
    default: 0.15 // 15% commission
  },
  firstClassDate: Date,
  nextBillingDate: Date,
  lastBillingDate: Date,
  totalPaid: {
    type: Number,
    default: 0
  },
  classesPerWeek: Number,
  classDuration: Number, // in minutes
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  cancelledAt: Date,
  cancellationReason: String
});

// Session Schema - Individual teaching sessions
const sessionSchema = new mongoose.Schema({
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  attendance: {
    tutorMarked: {
      type: String,
      enum: ['present', 'late', 'absent', 'postponed', null],
      default: null
    },
    studentMarked: {
      type: String,
      enum: ['present', 'late', 'absent', 'postponed', null],
      default: null
    },
    tutorMarkedAt: Date,
    studentMarkedAt: Date,
    finalStatus: {
      type: String,
      enum: ['present', 'late', 'absent', 'postponed', null],
      default: null
    }
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: String,
  comment: {
    type: String,
    maxlength: 1000
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  moderatorNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['booking', 'enrollment', 'session', 'payment', 'review', 'system', 'chat'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: String,
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days
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

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  senderType: {
    type: String,
    enum: ['user', 'staff', 'bot'],
    required: true
  },
  senderName: String,
  message: {
    type: String,
    required: true
  },
  isEscalated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Chat Conversation Schema
const chatConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userEmail: String,
  userName: String,
  status: {
    type: String,
    enum: ['open', 'closed', 'escalated'],
    default: 'open'
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  closedAt: Date,
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true // in USD
  },
  currency: {
    type: String,
    default: 'USD'
  },
  commissionAmount: Number,
  tutorPayout: Number,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  transactionId: String,
  billingPeriodStart: Date,
  billingPeriodEnd: Date,
  payoutStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  payoutDate: Date,
  payoutMethod: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: String,
  action: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    required: true
  },
  entityId: mongoose.Schema.Types.ObjectId,
  changes: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 7776000 // Auto-delete after 90 days
  }
});

// Platform Settings Schema
const platformSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: mongoose.Schema.Types.Mixed,
  description: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Guide/Documentation Schema
const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  contentAr: String, // Arabic translation
  category: {
    type: String,
    enum: ['getting-started', 'student-guide', 'tutor-guide', 'discord-guide', 'policies', 'faq'],
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
const TutorProfile = mongoose.model('TutorProfile', tutorProfileSchema);
const Tutor = mongoose.model('Tutor', tutorSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Session = mongoose.model('Session', sessionSchema);
const Review = mongoose.model('Review', reviewSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
const PlatformSettings = mongoose.model('PlatformSettings', platformSettingsSchema);
const Guide = mongoose.model('Guide', guideSchema);
const TutorApplication = mongoose.model('TutorApplication', tutorApplicationSchema);

// ============================================
// Authentication & Authorization Middleware
// ============================================

// Middleware to verify Firebase token and get user
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    // In production, verify with Firebase Admin SDK
    // For now, we'll extract the UID from the token (simplified)
    // TODO: Implement proper Firebase Admin SDK verification
    
    // For development, we'll decode the JWT manually (NOT SECURE FOR PRODUCTION)
    // This is a placeholder - implement proper Firebase Admin verification
    const decodedToken = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    const firebaseUid = decodedToken.user_id || decodedToken.sub;
    
    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    // Find user in database
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please complete registration.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

// Middleware to require specific role(s)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
}

// Check if user is admin (special check for tutorslink001@gmail.com)
function isAdmin(email) {
  return email === 'tutorslink001@gmail.com';
}

// Audit logging helper
async function createAuditLog(userId, action, entityType, entityId, changes, req) {
  try {
    const user = await User.findById(userId);
    await AuditLog.create({
      userId,
      userEmail: user ? user.email : 'unknown',
      action,
      entityType,
      entityId,
      changes,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });
  } catch (error) {
    console.error('Audit log error:', error);
    // Don't fail the request if audit logging fails
  }
}

// Notification helper
async function createNotification(userId, type, title, message, link = null) {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      link
    });
  } catch (error) {
    console.error('Notification creation error:', error);
  }
}

// ============================================
// API Routes
// ============================================

// ===== USER MANAGEMENT ROUTES =====

// POST /api/users/register - Register or update user after Firebase auth
app.post('/api/users/register', async (req, res) => {
  try {
    const { firebaseUid, email, displayName } = req.body;
    
    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        message: 'Firebase UID and email are required'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });
    
    if (user) {
      // Update existing user
      user.displayName = displayName || user.displayName;
      user.email = email;
      user.updatedAt = new Date();
      await user.save();
    } else {
      // Create new user with guest role by default
      const role = isAdmin(email) ? 'admin' : 'guest';
      user = await User.create({
        firebaseUid,
        email,
        displayName,
        role
      });
    }

    res.status(200).json({
      success: true,
      message: user ? 'User registered successfully' : 'User updated successfully',
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        timezone: user.timezone,
        preferredCurrency: user.preferredCurrency,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
});

// GET /api/users/me - Get current user profile
app.get('/api/users/me', authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    let tutorProfile = null;
    
    if (user.role === 'tutor') {
      tutorProfile = await TutorProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        timezone: user.timezone,
        preferredCurrency: user.preferredCurrency,
        preferredLanguage: user.preferredLanguage,
        tutorProfile
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
});

// PATCH /api/users/me - Update current user profile
app.patch('/api/users/me', authenticateUser, async (req, res) => {
  try {
    const { displayName, timezone, preferredCurrency, preferredLanguage } = req.body;
    const user = req.user;

    if (displayName) user.displayName = displayName;
    if (timezone) user.timezone = timezone;
    if (preferredCurrency) user.preferredCurrency = preferredCurrency;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    user.updatedAt = new Date();

    await user.save();

    await createAuditLog(user._id, 'update_profile', 'User', user._id, req.body, req);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// ===== NOTIFICATION ROUTES =====

// GET /api/notifications - Get user notifications
app.get('/api/notifications', authenticateUser, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read
app.patch('/api/notifications/:id/read', authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message
    });
  }
});

// ===== LEGACY TUTOR ROUTES (for backward compatibility) =====

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

// POST /api/tutors - Add a new tutor (Staff Portal)
app.post('/api/tutors', async (req, res) => {
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

// ===== ENROLLMENT ROUTES (Monthly Subscriptions) =====

// POST /api/enrollments - Create new enrollment (student enrolls with tutor)
app.post('/api/enrollments', authenticateUser, requireRole('student'), async (req, res) => {
  try {
    const { tutorId, monthlyRate, classesPerWeek, classDuration } = req.body;

    if (!tutorId || !monthlyRate) {
      return res.status(400).json({
        success: false,
        message: 'Tutor ID and monthly rate are required'
      });
    }

    // Check if tutor exists
    const tutor = await User.findOne({ _id: tutorId, role: 'tutor' });
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Check for existing active enrollment
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      tutorId,
      status: 'active'
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active enrollment with this tutor'
      });
    }

    // Get commission rate from platform settings
    let commissionRate = 0.15; // Default 15%
    const commissionSetting = await PlatformSettings.findOne({ key: 'commissionRate' });
    if (commissionSetting) {
      commissionRate = commissionSetting.value;
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      tutorId,
      monthlyRate,
      commissionRate,
      classesPerWeek,
      classDuration,
      status: 'active'
    });

    // Create notifications
    await createNotification(
      tutorId,
      'enrollment',
      'New Student Enrollment',
      `${req.user.displayName || req.user.email} has enrolled with you`,
      `/enrollments/${enrollment._id}`
    );

    // Send Discord notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `📝 **New Enrollment**\nStudent: ${req.user.email}\nTutor: ${tutor.email}\nMonthly Rate: $${monthlyRate}`
          })
        });
      } catch (err) {
        console.error('Discord webhook error:', err);
      }
    }

    await createAuditLog(req.user._id, 'create_enrollment', 'Enrollment', enrollment._id, req.body, req);

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: enrollment
    });
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create enrollment',
      error: error.message
    });
  }
});

// GET /api/enrollments/my - Get current user's enrollments
app.get('/api/enrollments/my', authenticateUser, async (req, res) => {
  try {
    const query = req.user.role === 'student'
      ? { studentId: req.user._id }
      : { tutorId: req.user._id };

    const enrollments = await Enrollment.find(query)
      .populate('studentId', 'email displayName')
      .populate('tutorId', 'email displayName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
});

// ===== SESSION ROUTES (Teaching Sessions) =====

// POST /api/sessions - Create new session (tutor only)
app.post('/api/sessions', authenticateUser, requireRole('tutor'), async (req, res) => {
  try {
    const { enrollmentId, scheduledDate, duration, notes } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      tutorId: req.user._id,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found or inactive'
      });
    }

    const session = await Session.create({
      enrollmentId,
      tutorId: req.user._id,
      studentId: enrollment.studentId,
      scheduledDate,
      duration,
      notes
    });

    // Notify student
    await createNotification(
      enrollment.studentId,
      'session',
      'New Session Scheduled',
      `A new session has been scheduled for ${new Date(scheduledDate).toLocaleString()}`,
      `/sessions/${session._id}`
    );

    await createAuditLog(req.user._id, 'create_session', 'Session', session._id, req.body, req);

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
      error: error.message
    });
  }
});

// GET /api/sessions/my - Get current user's sessions
app.get('/api/sessions/my', authenticateUser, async (req, res) => {
  try {
    const query = req.user.role === 'student'
      ? { studentId: req.user._id }
      : { tutorId: req.user._id };

    const sessions = await Session.find(query)
      .populate('studentId', 'email displayName')
      .populate('tutorId', 'email displayName')
      .populate('enrollmentId')
      .sort({ scheduledDate: -1 });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error.message
    });
  }
});

// PATCH /api/sessions/:id/attendance - Mark attendance
app.patch('/api/sessions/:id/attendance', authenticateUser, async (req, res) => {
  try {
    const { status } = req.body; // present, late, absent, postponed

    if (!['present', 'late', 'absent', 'postponed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid attendance status'
      });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is part of this session
    const isStudent = session.studentId.toString() === req.user._id.toString();
    const isTutor = session.tutorId.toString() === req.user._id.toString();

    if (!isStudent && !isTutor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark attendance for this session'
      });
    }

    // Mark attendance based on role
    if (isStudent) {
      session.attendance.studentMarked = status;
      session.attendance.studentMarkedAt = new Date();
    } else {
      session.attendance.tutorMarked = status;
      session.attendance.tutorMarkedAt = new Date();
    }

    // If both marked, determine final status
    if (session.attendance.studentMarked && session.attendance.tutorMarked) {
      // If both agree, use that status
      if (session.attendance.studentMarked === session.attendance.tutorMarked) {
        session.attendance.finalStatus = session.attendance.studentMarked;
      } else {
        // If they disagree, admin needs to resolve (default to tutor's marking for now)
        session.attendance.finalStatus = session.attendance.tutorMarked;
      }
    }

    session.updatedAt = new Date();
    await session.save();

    await createAuditLog(req.user._id, 'mark_attendance', 'Session', session._id, { status }, req);

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: session
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
});

// ===== REVIEW ROUTES =====

// POST /api/reviews - Create review (student only, must have enrollment)
app.post('/api/reviews', authenticateUser, requireRole('student'), async (req, res) => {
  try {
    const { tutorId, enrollmentId, rating, title, comment } = req.body;

    if (!tutorId || !enrollmentId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Tutor ID, enrollment ID, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Verify enrollment exists and belongs to student
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      studentId: req.user._id,
      tutorId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You can only review tutors you have studied with'
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      studentId: req.user._id,
      tutorId,
      enrollmentId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tutor for this enrollment'
      });
    }

    // Create review
    const review = await Review.create({
      studentId: req.user._id,
      tutorId,
      enrollmentId,
      rating,
      title,
      comment
    });

    // Update tutor's average rating
    const tutorProfile = await TutorProfile.findOne({ userId: tutorId });
    if (tutorProfile) {
      const reviews = await Review.find({ tutorId, isVisible: true });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      tutorProfile.rating.average = avgRating;
      tutorProfile.rating.count = reviews.length;
      await tutorProfile.save();
    }

    // Notify tutor
    await createNotification(
      tutorId,
      'review',
      'New Review Received',
      `You received a ${rating}-star review`,
      `/reviews/${review._id}`
    );

    await createAuditLog(req.user._id, 'create_review', 'Review', review._id, req.body, req);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
});

// GET /api/reviews/tutor/:tutorId - Get reviews for a tutor
app.get('/api/reviews/tutor/:tutorId', async (req, res) => {
  try {
    const reviews = await Review.find({
      tutorId: req.params.tutorId,
      isVisible: true
    })
      .populate('studentId', 'displayName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// ===== ADMIN ROUTES =====

// GET /api/admin/users - Get all users (admin only)
app.get('/api/admin/users', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;
    
    const query = role ? { role } : {};
    const users = await User.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// PATCH /api/admin/users/:id/role - Update user role (admin only)
app.patch('/api/admin/users/:id/role', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['guest', 'student', 'tutor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldRole = user.role;
    user.role = role;
    user.updatedAt = new Date();
    await user.save();

    await createAuditLog(req.user._id, 'update_user_role', 'User', user._id, { oldRole, newRole: role }, req);
    
    await createNotification(
      user._id,
      'system',
      'Role Updated',
      `Your role has been changed to ${role}`,
      null
    );

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
});

// GET /api/admin/platform-settings - Get all platform settings (admin only)
app.get('/api/admin/platform-settings', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const settings = await PlatformSettings.find().sort({ key: 1 });
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
});

// PUT /api/admin/platform-settings/:key - Update platform setting (admin only)
app.put('/api/admin/platform-settings/:key', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const { value, description } = req.body;
    
    let setting = await PlatformSettings.findOne({ key: req.params.key });
    
    if (setting) {
      const oldValue = setting.value;
      setting.value = value;
      setting.description = description || setting.description;
      setting.updatedBy = req.user._id;
      setting.updatedAt = new Date();
      await setting.save();
      
      await createAuditLog(req.user._id, 'update_setting', 'PlatformSettings', setting._id, { oldValue, newValue: value }, req);
    } else {
      setting = await PlatformSettings.create({
        key: req.params.key,
        value,
        description,
        updatedBy: req.user._id
      });
      
      await createAuditLog(req.user._id, 'create_setting', 'PlatformSettings', setting._id, { value }, req);
    }

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update setting',
      error: error.message
    });
  }
});

// GET /api/admin/reviews - Get all reviews with moderation (admin only)
app.get('/api/admin/reviews', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const { flagged } = req.query;
    const query = flagged === 'true' ? { isFlagged: true } : {};
    
    const reviews = await Review.find(query)
      .populate('studentId', 'email displayName')
      .populate('tutorId', 'email displayName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// PATCH /api/admin/reviews/:id/moderate - Moderate review (admin only)
app.patch('/api/admin/reviews/:id/moderate', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const { isVisible, isFlagged, moderatorNotes } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (isVisible !== undefined) review.isVisible = isVisible;
    if (isFlagged !== undefined) review.isFlagged = isFlagged;
    if (moderatorNotes) review.moderatorNotes = moderatorNotes;
    review.updatedAt = new Date();
    
    await review.save();

    await createAuditLog(req.user._id, 'moderate_review', 'Review', review._id, req.body, req);

    res.json({
      success: true,
      message: 'Review moderated successfully',
      data: review
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to moderate review',
      error: error.message
    });
  }
});

// GET /api/admin/audit-logs - Get audit logs (admin only)
app.get('/api/admin/audit-logs', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 100, action, entityType } = req.query;
    
    const query = {};
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    
    const logs = await AuditLog.find(query)
      .populate('userId', 'email displayName')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
});

// ===== CHAT ROUTES =====

// POST /api/chat/start - Start new chat conversation
app.post('/api/chat/start', async (req, res) => {
  try {
    const { userName, userEmail, userId } = req.body;
    
    // Create conversation
    const conversation = await ChatConversation.create({
      userId: userId || null,
      userName,
      userEmail,
      status: 'open'
    });

    // Send Discord notification to staff
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '💬 New Chat Request',
              color: 0x00f0ff,
              fields: [
                { name: 'Name', value: userName, inline: true },
                { name: 'Email', value: userEmail, inline: true },
                { name: 'Conversation ID', value: conversation._id.toString(), inline: false }
              ],
              timestamp: new Date().toISOString()
            }]
          })
        });
      } catch (err) {
        console.error('Discord notification error:', err);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Chat started successfully',
      data: { conversationId: conversation._id }
    });
  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start chat',
      error: error.message
    });
  }
});

// POST /api/chat/:conversationId/message - Send message
app.post('/api/chat/:conversationId/message', async (req, res) => {
  try {
    const { message, senderType, senderName } = req.body;
    
    const conversation = await ChatConversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const chatMessage = await ChatMessage.create({
      conversationId: req.params.conversationId,
      userId: conversation.userId,
      senderType: senderType || 'user',
      senderName: senderName || conversation.userName,
      message
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// GET /api/chat/:conversationId/messages - Get conversation messages
app.get('/api/chat/:conversationId/messages', async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      conversationId: req.params.conversationId
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// POST /api/chat/:conversationId/escalate - Escalate to human staff
app.post('/api/chat/:conversationId/escalate', async (req, res) => {
  try {
    const conversation = await ChatConversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    conversation.status = 'escalated';
    await conversation.save();

    // Create escalation message
    await ChatMessage.create({
      conversationId: req.params.conversationId,
      senderType: 'bot',
      senderName: 'System',
      message: 'This conversation has been escalated to our support team. A human agent will assist you shortly.',
      isEscalated: true
    });

    // Notify staff via Discord
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `⚠️ **Chat Escalated**\nConversation ID: ${conversation._id}\nUser: ${conversation.userName} (${conversation.userEmail})\nAction required!`
          })
        });
      } catch (err) {
        console.error('Discord notification error:', err);
      }
    }

    res.json({
      success: true,
      message: 'Conversation escalated to staff'
    });
  } catch (error) {
    console.error('Escalate chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to escalate conversation',
      error: error.message
    });
  }
});

// ===== GUIDE/DOCUMENTATION ROUTES =====

// GET /api/guides - Get published guides
app.get('/api/guides', async (req, res) => {
  try {
    const { category, lang = 'en' } = req.query;
    
    const query = { isPublished: true };
    if (category) query.category = category;
    
    const guides = await Guide.find(query)
      .select(lang === 'ar' ? '-content' : '-contentAr')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: guides
    });
  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guides',
      error: error.message
    });
  }
});

// GET /api/guides/:slug - Get single guide
app.get('/api/guides/:slug', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    
    const guide = await Guide.findOne({
      slug: req.params.slug,
      isPublished: true
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    res.json({
      success: true,
      data: {
        title: guide.title,
        content: lang === 'ar' ? (guide.contentAr || guide.content) : guide.content,
        category: guide.category,
        updatedAt: guide.updatedAt
      }
    });
  } catch (error) {
    console.error('Get guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guide',
      error: error.message
    });
  }
});

// POST /api/admin/guides - Create guide (admin only)
app.post('/api/admin/guides', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const { title, slug, content, contentAr, category, isPublished, order } = req.body;
    
    // Check if slug already exists
    const existing = await Guide.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A guide with this slug already exists'
      });
    }

    const guide = await Guide.create({
      title,
      slug,
      content,
      contentAr,
      category,
      isPublished: isPublished || false,
      order: order || 0,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await createAuditLog(req.user._id, 'create_guide', 'Guide', guide._id, req.body, req);

    res.status(201).json({
      success: true,
      message: 'Guide created successfully',
      data: guide
    });
  } catch (error) {
    console.error('Create guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create guide',
      error: error.message
    });
  }
});

// PUT /api/admin/guides/:id - Update guide (admin only)
app.put('/api/admin/guides/:id', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    const { title, content, contentAr, category, isPublished, order } = req.body;
    
    if (title) guide.title = title;
    if (content) guide.content = content;
    if (contentAr !== undefined) guide.contentAr = contentAr;
    if (category) guide.category = category;
    if (isPublished !== undefined) guide.isPublished = isPublished;
    if (order !== undefined) guide.order = order;
    
    guide.updatedBy = req.user._id;
    guide.updatedAt = new Date();
    await guide.save();

    await createAuditLog(req.user._id, 'update_guide', 'Guide', guide._id, req.body, req);

    res.json({
      success: true,
      message: 'Guide updated successfully',
      data: guide
    });
  } catch (error) {
    console.error('Update guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update guide',
      error: error.message
    });
  }
});

// DELETE /api/admin/guides/:id - Delete guide (admin only)
app.delete('/api/admin/guides/:id', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    await guide.deleteOne();

    await createAuditLog(req.user._id, 'delete_guide', 'Guide', guide._id, {}, req);

    res.json({
      success: true,
      message: 'Guide deleted successfully'
    });
  } catch (error) {
    console.error('Delete guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete guide',
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
