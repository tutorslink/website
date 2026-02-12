// Firebase Authentication Functions
// Using Firebase Modular SDK (v10+)

import { auth } from './firebase-config.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// ============================================
// Sign Up Function
// ============================================
export async function signup(email, password) {
  try {
    const userCredential = 
    await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Account created successfully!'
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
}

// ============================================
// Login Function
// ============================================
export async function login(email, password) {
  

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Logged in successfully!'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
}

// ============================================
// Sign In with Google
// ============================================
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: userCredential.user,
      message: 'Signed in with Google successfully!'
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
}

// ============================================
// Logout Function
// ============================================
export async function logout() {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Logged out successfully!'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.code,
      message: 'Failed to log out. Please try again.'
    };
  }
}

// ============================================
// Send Password Reset Email
// ============================================
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent successfully!'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
}

// ============================================
// Auth State Observer
// ============================================
export function monitorAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// ============================================
// Get Current User
// ============================================
export function getCurrentUser() {
  return auth.currentUser;
}

// ============================================
// Helper: Convert Error Codes to User-Friendly Messages
// ============================================
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/operation-not-allowed': 'Email/password authentication is not enabled.',
    'auth/invalid-api-key': 'Invalid Firebase API key. Please check your configuration.',
    'auth/app-deleted': 'Firebase app has been deleted. Please check your configuration.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing. Please try again.',
    'auth/cancelled-popup-request': 'Multiple sign-in popups were opened. Please try again.',
    'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in method.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}
