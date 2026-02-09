// main.js
import { signup, login, logout, monitorAuthState, getCurrentUser } from './auth.js';
import { registerUser } from './api-client.js';

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
if (authForm) {
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
        // Register with backend
        try {
          await registerUser(result.user.uid, result.user.email, result.user.displayName);
          console.log('User registered with backend');
        } catch (backendError) {
          console.error('Backend registration error:', backendError);
          // Continue anyway - user is authenticated with Firebase
        }

        alert(result.message);
        closeAuthModal();
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
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
  window.location.href = 'index.html';
};

// ===============================
// Auth State Listener
// ===============================
monitorAuthState(async (user) => {
  const status = document.getElementById('auth-status');
  const email = document.getElementById('user-email-display');

  if (user) {
    if (email) email.textContent = `Welcome, ${user.email}`;
    if (status) status.style.display = 'block';
    
    // Register with backend if not already
    try {
      await registerUser(user.uid, user.email, user.displayName);
    } catch (error) {
      console.error('Backend sync error:', error);
    }
  } else {
    if (status) status.style.display = 'none';
  }
});

console.log('Firebase Auth loaded via main.js');

// Auth state bootstrapping 
const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");

if (authSection && appSection) {
  monitorAuthState((user) => {
    if (user) {
      console.log("✅ Logged in:", user.uid);

      authSection.style.display = "none";
      appSection.style.display = "block";
    } else {
      console.log("🚪 Logged out");

      authSection.style.display = "block";
      appSection.style.display = "none";
    }
  });
}

// Protect dashboard page (logged out user can't access)
if (window.location.pathname.includes('dashboard')) {
  monitorAuthState((user) => {
    if (!user) {
      window.location.href = 'index.html';
    }
  });
}

