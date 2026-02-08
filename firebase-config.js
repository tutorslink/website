// Firebase Configuration and Initialization
// Using Firebase Modular SDK (v10+)

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration with placeholder values
// Replace these with your actual Firebase project credentials from Firebase Console
// These values are safe to expose in client-side code as Firebase security rules protect your data
// 
// To get your Firebase config:
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Select your project or create a new one
// 3. Click on Project Settings (gear icon)
// 4. Scroll down to "Your apps" section
// 5. Click on the Web app icon (</>)
// 6. Copy the config values below
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export
export const auth = getAuth(app);
