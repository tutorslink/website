# Firebase Authentication Setup Guide

This guide will help you configure Firebase Authentication for the Tutors Link website.

## Overview

The website now has Firebase Authentication integrated using the Modular SDK (v10+). The authentication system works alongside the existing MongoDB backend, which continues to handle all data storage for tutors, bookings, and support messages.

## Files Added

1. **firebase-config.js** - Firebase initialization and configuration
2. **auth.js** - Authentication functions (signup, login, logout, auth state monitoring)

## Files Modified

1. **package.json** - Added Firebase v10.7.1 dependency
2. **index.html** - Added authentication UI components and integration
3. **.env.example** - Added Firebase configuration documentation

## Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Click "Continue" when prompted

### Step 2: Enable Email/Password Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started" if this is your first time
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first toggle (Email/Password)
6. Click "Save"

### Step 3: Register Your Web App

1. In Firebase Console, click the gear icon (Project Settings)
2. Scroll down to "Your apps" section
3. Click the Web icon (`</>`) to add a web app
4. Enter a nickname for your app (e.g., "Tutors Link Website")
5. Click "Register app"
6. Copy the Firebase configuration object

### Step 4: Update firebase-config.js

Replace the placeholder values in `firebase-config.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Important:** These values are safe to commit to your repository. Firebase uses security rules to protect your data, not credential secrecy. The API key is a public identifier, not a secret.

### Step 5: Configure Firebase Security Rules (Optional but Recommended)

Since we're only using Firebase for authentication (not Firestore or Storage), you don't need to configure additional security rules. However, if you later add Firestore or other Firebase services, make sure to set up appropriate security rules.

## Features Implemented

### User Interface
- **Login/Sign Up Buttons**: Added to the header section for easy access
- **Authentication Modal**: Clean modal dialog for login and signup
- **Auth Status Display**: Shows "Welcome, [Email]" when logged in with a Logout button
- **Toggle Between Modes**: Easy switch between login and signup within the modal

### Functionality
- **Sign Up**: Create new accounts with email and password
- **Login**: Authenticate existing users
- **Logout**: Sign out users and clear session
- **Auth State Monitoring**: Automatically updates UI when auth state changes
- **Error Handling**: User-friendly error messages for common auth issues

### Accessibility
- ARIA labels on all interactive elements
- Semantic HTML with proper roles and attributes
- Keyboard navigation support
- Screen reader friendly

## How Authentication Works

1. **User clicks "Login" or "Sign Up"**: Opens the authentication modal
2. **User enters credentials**: Email and password
3. **Firebase validates**: Checks credentials against Firebase Authentication
4. **Auth state changes**: Firebase triggers the auth state observer
5. **UI updates automatically**: Welcome message appears, modal closes
6. **User can logout**: Clicking logout signs out and hides the welcome message

## Integration with MongoDB

Firebase Authentication handles **only user authentication** (who the user is). Your existing MongoDB backend continues to handle:
- Tutor profiles and listings
- Booking requests
- Support messages
- All other data storage

You can optionally link Firebase user IDs with MongoDB records for user-specific data in future enhancements.

## Security Considerations

✅ **Client-side authentication tokens** are managed securely by Firebase SDK
✅ **No credentials stored locally** except in browser's secure storage (managed by Firebase)
✅ **Password requirements**: Minimum 6 characters enforced
✅ **HTTPS required** in production for secure communication
✅ **No vulnerable dependencies** detected

## Testing Locally

1. Ensure you've updated `firebase-config.js` with real credentials
2. Open `index.html` in a modern browser
3. Click "Sign Up" to create a test account
4. Use the credentials to log in
5. Verify the welcome message appears
6. Test the logout functionality

**Note:** Firebase Authentication requires the page to be served over HTTP/HTTPS. Opening `index.html` directly with `file://` protocol may not work. Use a local development server like:
- `python3 -m http.server 8080`
- `npx serve`
- VS Code Live Server extension

## Common Issues

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution:** You haven't updated the Firebase config with real values. Follow Step 4 above.

### Issue: Authentication modal doesn't open
**Solution:** Check browser console for errors. Ensure Firebase CDN is not blocked by ad-blockers.

### Issue: "Module not found" errors
**Solution:** Ensure you're serving the files via HTTP server, not opening directly with file:// protocol.

## Future Enhancements

Consider these optional improvements:
- Add password reset functionality
- Implement email verification
- Add social login (Google, GitHub, etc.)
- Store user preferences in Firestore
- Link Firebase UID with MongoDB user records
- Add user profile management

## Support

For Firebase-specific issues, refer to:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

For website-specific issues, contact the development team through the Discord server.
