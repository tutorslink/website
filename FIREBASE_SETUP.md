# Firebase Authentication Setup Guide

This guide will help you configure Firebase Authentication for the Tutors Link website.

## Overview

The website uses Firebase Authentication (Modular SDK v10+) for user sign-up and login. Firebase handles authentication only - all other data (tutors, bookings, etc.) is stored in MongoDB.

## Quick Start

### Prerequisites
- A Google account (for Firebase Console access)
- Your website's production domain (e.g., `tutorslink.github.io`)
- Your Railway backend URL (e.g., `tutorslink.up.railway.app`)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name (e.g., "Tutors Link")
4. Disable Google Analytics (optional) or keep it enabled
5. Click "Create project" and wait for it to be ready
6. Click "Continue"

### Step 2: Enable Email/Password Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started" if this is your first time
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the **first toggle** (Email/Password) - keep "Email link" disabled
6. Click "Save"

### Step 3: Configure Authorized Domains

**IMPORTANT:** This step is critical to prevent CORS errors!

1. While still in "Authentication", click on the "Settings" tab
2. Scroll down to "Authorized domains"
3. Add your production domains:
   - `tutorslink.github.io` (or your GitHub Pages domain)
   - `tutorslink.up.railway.app` (or your Railway domain)
   - `localhost` (should already be there for local testing)
4. Click "Add domain" for each one

**Why this matters:** Firebase will reject authentication requests from domains not in this list. This is a security feature to prevent unauthorized use of your Firebase project.

### Step 4: Register Your Web App

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the Web icon (`</>`) to add a web app
5. Enter a nickname for your app (e.g., "Tutors Link Website")
6. **Do NOT** check "Also set up Firebase Hosting"
7. Click "Register app"
8. You'll see a configuration object - **copy this entire object**

### Step 5: Update firebase-config.js

Open `firebase-config.js` in your repository and replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",                          // Replace with your actual API key
  authDomain: "your-project.firebaseapp.com",    // Replace with your auth domain
  projectId: "your-project",                      // Replace with your project ID
  storageBucket: "your-project.appspot.com",     // Replace with your storage bucket
  messagingSenderId: "123456789012",              // Replace with your sender ID
  appId: "1:123456789012:web:abc123..."          // Replace with your app ID
};
```

**Important Notes:**
- These values are **safe to commit to GitHub** - they are public identifiers, not secrets
- Firebase security comes from security rules and authorized domains, not from hiding these values
- The API key is a client identifier, not a secret key

### Step 6: Commit and Deploy

1. Save your changes to `firebase-config.js`
2. Commit and push to GitHub:
   ```bash
   git add firebase-config.js
   git commit -m "Configure Firebase authentication"
   git push
   ```
3. GitHub Pages will automatically deploy your updated site
4. Wait 1-2 minutes for the deployment to complete

### Step 7: Test Authentication

1. Open your website (GitHub Pages URL)
2. Click "Sign Up" button
3. Enter an email and password (minimum 6 characters)
4. Click "Sign Up"
5. If successful, you should see "Welcome, your-email@example.com"
6. Click "Logout" to test logout functionality
7. Click "Login" and use the same credentials to test login

## Alternative: Using Environment Variables (Advanced)

If you want to use environment variables (e.g., for automated builds), use the provided build script:

```bash
# Set environment variables
export FIREBASE_API_KEY="AIzaSyC..."
export FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
export FIREBASE_PROJECT_ID="your-project"
export FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
export FIREBASE_MESSAGING_SENDER_ID="123456789012"
export FIREBASE_APP_ID="1:123456789012:web:abc123..."

# Run build script
node build-firebase-config.js
```

This will automatically generate `firebase-config.js` with your environment variables injected.

## Railway Configuration (Backend)

**Note:** Firebase is a **client-side** service. You do **NOT** need to configure Firebase environment variables in Railway.

Railway environment variables are only for your backend (MongoDB, Discord webhook, etc.):
- `MONGODB_URI` - Your MongoDB connection string (required)
- `DISCORD_WEBHOOK_URL` - Discord webhook for notifications (optional)
- `PORT` - Automatically provided by Railway (don't set this)

Firebase configuration lives in the frontend code (`firebase-config.js`), not in Railway environment variables.

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"

**Cause:** Firebase configuration hasn't been updated with real values.

**Solution:**
1. Follow Steps 1-5 above to get your Firebase configuration
2. Update `firebase-config.js` with real values
3. Commit and deploy the changes

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Cause:** Your website domain is not authorized in Firebase Console.

**Solution:**
1. Go to Firebase Console > Authentication > Settings > Authorized domains
2. Add your production domain (e.g., `tutorslink.github.io`)
3. Add your Railway domain if testing there (e.g., `tutorslink.up.railway.app`)
4. Save and wait 1-2 minutes for changes to propagate
5. Try authentication again

### Error: "Module not found" or import errors

**Cause:** Page is opened with `file://` protocol, which doesn't support ES6 modules.

**Solution:**
Serve the files via a local HTTP server:
```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: npx
npx serve

# Option 3: VS Code Live Server extension
```

Then open `http://localhost:8080` in your browser.

### Error: "Firebase: Error (auth/invalid-api-key)"

**Cause:** API key is incorrect or the Firebase project has been deleted.

**Solution:**
1. Go to Firebase Console > Project Settings
2. Verify your Web app configuration
3. Copy the correct API key
4. Update `firebase-config.js`

### Authentication modal doesn't open

**Cause:** JavaScript error or ad-blocker blocking Firebase CDN.

**Solution:**
1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Disable ad-blockers temporarily
4. Check Network tab to see if Firebase SDK is loading
5. Try a different browser

### Users can sign up but can't login

**Cause:** User account might be disabled or there's a problem with password.

**Solution:**
1. Go to Firebase Console > Authentication > Users
2. Check if the user is listed
3. Check if "Disabled" column is checked
4. Try resetting the password or creating a new test account
5. Check browser console for specific error messages

## Security Best Practices

✅ **DO:**
- Keep Firebase configuration in your repository (it's safe)
- Use authorized domains to restrict where authentication works
- Enable only the authentication methods you need
- Set up password requirements (Firebase enforces 6+ characters by default)
- Use HTTPS in production (required by Firebase)

❌ **DON'T:**
- Don't commit Firebase Admin SDK credentials (service account JSON files)
- Don't disable authorized domain checks in production
- Don't use Firebase for storing sensitive data without proper security rules
- Don't share Firebase Admin SDK credentials publicly

## Features Implemented

### User Interface
- **Login/Sign Up Buttons**: Added to header for easy access
- **Authentication Modal**: Clean modal dialog for login and signup
- **Auth Status Display**: Shows "Welcome, [Email]" when logged in
- **Toggle Between Modes**: Easy switch between login and signup
- **Logout Button**: Accessible when logged in

### Functionality
- **Sign Up**: Create new accounts with email and password
- **Login**: Authenticate existing users
- **Logout**: Sign out users and clear session
- **Auth State Monitoring**: UI updates automatically on auth state changes
- **Error Handling**: User-friendly error messages for common auth issues
- **Input Validation**: Email format and password length validation

### Accessibility
- ARIA labels on all interactive elements
- Semantic HTML with proper roles
- Keyboard navigation support
- Screen reader friendly
- Focus management in modal

## How It Works

1. **User clicks "Login" or "Sign Up"**: Opens authentication modal
2. **User enters credentials**: Email and password (6+ characters)
3. **Firebase validates**: Checks credentials with Firebase Authentication service
4. **Auth state changes**: Firebase triggers auth state observer
5. **UI updates**: Welcome message appears, modal closes
6. **User can logout**: Clicking logout signs out and updates UI

## Integration with MongoDB Backend

Firebase handles **only authentication** (verifying who the user is). Your MongoDB backend continues to handle:
- Tutor profiles and listings
- Booking requests  
- Support messages
- All application data

**Future enhancement:** You can link Firebase UIDs with MongoDB user records for user-specific features.

## Testing Locally

1. Update `firebase-config.js` with real credentials
2. Serve files via HTTP server (see Troubleshooting section)
3. Open in browser (e.g., `http://localhost:8080`)
4. Click "Sign Up" to create a test account
5. Use credentials to test login
6. Verify welcome message appears
7. Test logout functionality

**Note:** Opening `index.html` with `file://` protocol won't work due to ES6 module restrictions.

## Production Deployment Checklist

- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Production domains added to authorized domains
- [ ] Web app registered in Firebase
- [ ] `firebase-config.js` updated with real values
- [ ] Changes committed and pushed to GitHub
- [ ] GitHub Pages deployed successfully
- [ ] Tested sign up on production site
- [ ] Tested login on production site
- [ ] Tested logout on production site

## Future Enhancements

Consider these optional improvements:
- Password reset functionality (Firebase provides `sendPasswordResetEmail`)
- Email verification (Firebase provides `sendEmailVerification`)
- Social login (Google, GitHub, Facebook, etc.)
- User profile management
- Store user preferences in Firestore
- Link Firebase UID with MongoDB user records
- Role-based access control (admin, tutor, student)

## Support

For Firebase-specific issues:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Status Page](https://status.firebase.google.com/)

For website-specific issues:
- Check browser console for error messages
- Review this setup guide
- Contact the development team via Discord
