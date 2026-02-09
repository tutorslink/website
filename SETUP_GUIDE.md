# Tutors Link Platform - Complete Setup Guide

This guide covers the complete setup for the full-stack Tutors Link platform with all MVP features.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Firebase Setup](#firebase-setup)
5. [Running Locally](#running-locally)
6. [Deployment](#deployment)
7. [Initial Configuration](#initial-configuration)

## System Requirements

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **MongoDB**: Atlas account (free tier available)
- **Firebase**: Free account
- **Discord** (optional): For notifications

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/tutorslink/website.git
cd website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tutorslink?retryWrites=true&w=majority

# Server Configuration
PORT=3000

# Email Configuration (Optional - for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
STAFF_EMAIL=tutorslink001@gmail.com

# Discord Webhook (Optional - for Discord notifications)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL

# Security (Recommended for production)
ENCRYPTION_KEY=your-32-character-encryption-key-here
ENCRYPTION_SALT=your-secure-salt-here
```

## Database Setup

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up or use GitHub Student Pack for free credits

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select cloud provider and region
   - Name your cluster: `tutorslink`

3. **Configure Database Access**
   - Go to "Database Access"
   - Add new user with read/write permissions
   - Save username and password

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP: `0.0.0.0/0` (Allow from anywhere - required for Railway/cloud hosting)

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password
   - Add database name: `/tutorslink`

Example:
```
mongodb+srv://user:password@cluster.mongodb.net/tutorslink?retryWrites=true&w=majority
```

### Initial Database Seeding

After first run, the platform will automatically create collections. To set up an admin user:

1. Sign up with email: `tutorslink001@gmail.com`
2. The system will automatically grant admin role
3. Access admin panel at `/dashboard.html`

## Firebase Setup

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `Tutors Link`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Save changes

### 3. Add Authorized Domains

1. In Authentication → Settings → Authorized domains
2. Add:
   - `localhost` (for local development)
   - `tutorslink.github.io` (for GitHub Pages)
   - Your custom domain (if applicable)

### 4. Register Web App

1. In Project Settings (gear icon)
2. Under "Your apps", click web icon `</>`
3. Register app with nickname: `Tutors Link Web`
4. Copy the Firebase configuration

### 5. Update Firebase Config

Edit `firebase-config.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Note**: These values are safe to commit - they're public identifiers. Security is enforced through Firebase rules and authorized domains.

## Running Locally

### Start Development Server

```bash
npm start
```

The server will start on http://localhost:3000

### Access the Application

- **Main Site**: http://localhost:3000/
- **Dashboard**: http://localhost:3000/dashboard.html
- **Apply as Tutor**: http://localhost:3000/apply-as-tutor.html
- **API Health Check**: http://localhost:3000/api/health

### Testing Authentication

1. Open http://localhost:3000
2. Click "Sign Up" or "Login"
3. Create an account
4. You'll be redirected to the dashboard
5. Role will be "GUEST" by default (admin can change roles)

## Deployment

### Backend Deployment (Railway)

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `tutorslink/website`
   - Railway auto-detects Node.js

3. **Configure Environment Variables**
   - Go to project → Variables
   - Add all environment variables from `.env` (except PORT)
   - Railway provides PORT automatically

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Get deployment URL: `https://your-app.up.railway.app`

5. **Update Frontend Config**
   - Edit `api-client.js`
   - Update `API_BASE_URL` production URL

### Frontend Deployment (GitHub Pages)

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

2. **Access Site**
   - Your site: `https://tutorslink.github.io/website/`
   - Or custom domain if configured

## Initial Configuration

### 1. Create Admin Account

1. Sign up with email: `tutorslink001@gmail.com`
2. This email automatically gets admin role
3. Login and access dashboard

### 2. Configure Platform Settings

As admin, you can configure:

- **Commission Rate**: Default is 15% (0.15)
- **Currency Settings**: Base currency and conversion rates
- **Platform Policies**: Terms, privacy policy, etc.

### 3. Create Initial Content

**Guides/Documentation:**
1. Go to Admin Dashboard
2. Navigate to "Manage Guides"
3. Create guides for:
   - Getting Started
   - How Tutors Link Works
   - Student Guide
   - Tutor Guide
   - Discord Usage
   - Platform Policies

### 4. Test User Flows

**As Student:**
1. Sign up with test email
2. Browse tutors
3. Book demo class
4. Create enrollment (requires admin to set role to "student")

**As Tutor:**
1. Apply as tutor
2. Admin approves and sets role to "tutor"
3. Create tutor profile
4. Schedule sessions
5. Mark attendance

**As Admin:**
1. Manage users and roles
2. Moderate reviews
3. View audit logs
4. Configure platform settings

## Discord Integration (Optional)

### Setup Discord Webhook

1. **Create Discord Server** (if you don't have one)

2. **Create Webhook**
   - Server Settings → Integrations → Webhooks
   - Click "New Webhook"
   - Name: `Tutors Link Notifications`
   - Select channel for notifications
   - Copy webhook URL

3. **Add to Environment Variables**
   ```env
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
   ```

4. **Test Webhook**
   - Submit support message or tutor application
   - Check Discord channel for notification

### Notifications Sent to Discord

- New support messages
- New tutor applications
- New enrollments
- Chat escalations

## Email Configuration (Optional)

For email notifications, configure SMTP:

### Using Gmail

1. **Enable 2-Factor Authentication** on your Google account

2. **Create App Password**
   - Google Account → Security → 2-Step Verification
   - App passwords → Select app: Mail
   - Select device: Other (Custom name)
   - Generate password

3. **Add to .env**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   STAFF_EMAIL=tutorslink001@gmail.com
   ```

### Email Notifications Sent

- Tutor application confirmations
- Staff notifications for new applications
- (More features coming soon)

## Troubleshooting

### MongoDB Connection Fails
- Check connection string format
- Verify database user credentials
- Ensure IP whitelist includes `0.0.0.0/0`
- Check network connectivity

### Firebase Authentication Errors
- Verify Firebase config in `firebase-config.js`
- Check authorized domains in Firebase Console
- Ensure Email/Password auth is enabled
- Check browser console for specific errors

### Server Won't Start
- Check Node.js version: `node --version` (should be v18+)
- Install dependencies: `npm install`
- Check for port conflicts (default: 3000)
- Review error logs

### Frontend Can't Connect to Backend
- Verify `API_BASE_URL` in `api-client.js`
- Check CORS configuration in `server.js`
- Ensure backend server is running
- Check network/firewall settings

## Security Considerations

### Production Checklist

- ✅ Set strong `ENCRYPTION_KEY`
- ✅ Use environment variables, never commit secrets
- ✅ Enable HTTPS (automatic on Railway/GitHub Pages)
- ✅ Configure Firebase security rules
- ✅ Implement rate limiting for API endpoints
- ✅ Regular security audits
- ✅ Keep dependencies updated
- ✅ Monitor audit logs

## Support

For issues or questions:
- **Discord**: https://discord.gg/pe8TXPgkAe
- **Instagram**: @tutors.link
- **TikTok**: @tutors_link
- **Email**: tutorslink001@gmail.com

## License

ISC License - Copyright © 2026 Tutors Link
