// Firebase Configuration and Initialization
// Using Firebase Modular SDK (v10+)

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration
// REPLACE THESE PLACEHOLDER VALUES WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBnwIVmod25Y-sZVYRnMif6eJVhqXXRvRA",
  authDomain: "tutors-link.firebaseapp.com",
  projectId: "tutors-link",
  storageBucket: "tutors-link.firebasestorage.app",
  messagingSenderId: "495466917430",
  appId: "1:495466917430:web:a6a01860f14eed63b07297"
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
