// Import required packages
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests from GitHub Pages
app.use(express.json()); // Parse JSON request bodies

// Serve static files only in development
// In production, the frontend will be hosted on GitHub Pages separately
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('.'));
}

// ============================================
// MongoDB Connection
// ============================================
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ============================================
// Mongoose Schemas and Models
// ============================================

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

// Create models from schemas
const Tutor = mongoose.model('Tutor', tutorSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);

// ============================================
// API Routes
// ============================================

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
