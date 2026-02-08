// Firebase Configuration and Initialization
// Using Firebase Modular SDK (v10+)
// 
// IMPORTANT: Replace the placeholder values below with your actual Firebase config
// 
// To get your Firebase config:
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Select your project or create a new one
// 3. Enable Email/Password authentication in Authentication > Sign-in method
// 4. Click on Project Settings (gear icon)
// 5. Scroll down to "Your apps" section
// 6. Click on the Web app icon (</>)
// 7. Copy the config values and replace the placeholders below
//
// Note: These values are safe to commit to GitHub. Firebase uses security rules, not credential secrecy.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration
// REPLACE THESE PLACEHOLDER VALUES WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Validate configuration - check all fields, not just API key
const isConfigured = !Object.values(firebaseConfig).some(value => 
  typeof value === 'string' && value.startsWith('YOUR_')
);

if (!isConfigured) {
  console.error('❌ Firebase is not configured!');
  console.error('   Authentication will not work until you configure Firebase.');
  console.error('   Please update firebase-config.js with your actual Firebase credentials.');
  console.error('   See FIREBASE_SETUP.md for step-by-step instructions.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export
export const auth = getAuth(app);

// Export configuration status for debugging
export const isFirebaseConfigured = isConfigured;
