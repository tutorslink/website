// main.js
import { signup, login, logout, monitorAuthState, getCurrentUser, signInWithGoogle } from './auth.js';

// Track mode
let currentAuthMode = 'login';

// ===============================
// Open Auth Modal
// ===============================
window.openAuthModal = function (mode) {
  currentAuthMode = mode;

  const modal = document.getElementById('auth-modal');
  const title = document.getElementById('auth-title');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleLink = document.getElementById('auth-toggle-link');

const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");

  if (mode === 'login') {
    title.textContent = 'Login';
    submitBtn.textContent = 'Login';
    toggleText.textContent = "Don't have an account?";
    toggleLink.textContent = 'Sign Up';
  } else {
    title.textContent = 'Sign Up';
    submitBtn.textContent = 'Sign Up';
    toggleText.textContent = 'Already have an account?';
    toggleLink.textContent = 'Login';
  }

  modal.style.display = 'flex';
  document.getElementById('auth-form').reset();
};

// ===============================
// Close Auth Modal
// ===============================
window.closeAuthModal = function () {
  document.getElementById('auth-modal').style.display = 'none';
  document.getElementById('auth-form').reset();
};

// ===============================
// Toggle Login / Signup
// ===============================
window.toggleAuthMode = function () {
  currentAuthMode = currentAuthMode === 'login' ? 'signup' : 'login';
  openAuthModal(currentAuthMode);
};

// ===============================
// Handle Auth Submit
// ===============================
const authForm = document.getElementById('auth-form');
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const btn = document.getElementById('auth-submit-btn');

  btn.disabled = true;
  const oldText = btn.textContent;
  btn.textContent = 'Processing...';

  try {
    const result =
      currentAuthMode === 'login'
        ? await login(email, password)
        : await signup(email, password);

    if (result.success) {
      alert(result.message);
      closeAuthModal();
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);
    alert('Unexpected error. Try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = oldText;
  }
});

// ===============================
// Handle Google Sign In
// ===============================
const googleSignInBtn = document.getElementById('google-signin-btn');
if (googleSignInBtn) {
  googleSignInBtn.addEventListener('click', async () => {
    const btn = googleSignInBtn;
    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'Signing in...';

    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        alert(result.message);
        closeAuthModal();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Unexpected error. Try again.');
    } finally {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  });
}

// ===============================
// Logout
// ===============================
window.handleLogout = async function () {
  const result = await logout();
  alert(result.message);
};

// ===============================
// Auth State Listener
// ===============================
monitorAuthState(async (user) => {
  if (user) {
    console.log("✅ Logged in:", user.uid);

    authSection.style.display = "none";
    appSection.style.display = "block";

    // Register/fetch user role
    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const userData = await window.registerUser?.(user.uid, user.email, displayName);
    
    if (!userData) {
      // Fallback: fetch user data if register fails
      const fetchedData = await window.fetchUserRole?.(user.uid);
      if (fetchedData) {
        window.updateUIForRole?.(user, fetchedData);
      } else {
        // Default to guest if all fails
        window.updateUIForRole?.(user, { role: 'guest', email: user.email, displayName });
      }
    } else {
      window.updateUIForRole?.(user, userData);
    }

  } else {
    console.log("🚪 Logged out");

    authSection.style.display = "block";
    appSection.style.display = "none";
    
    // Update UI for logged out state
    window.updateUIForRole?.(null, null);
  }
});

