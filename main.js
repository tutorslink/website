// main.js
// Frontend entry point for Firebase authentication

import { signup, login, logout, monitorAuthState } from './auth.js';

// Grab inputs
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Grab buttons
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// SIGN UP
if (signupBtn) {
  signupBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const result = await signup(email, password);
    alert(result.message);
  });
}

// LOGIN
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const result = await login(email, password);
    alert(result.message);
  });
}

// LOGOUT (optional button)
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const result = await logout();
    alert(result.message);
  });
}

// AUTH STATE (persists login across refresh)
monitorAuthState((user) => {
  if (user) {
    console.log('Logged in as:', user.email);
  } else {
    console.log('Logged out');
  }
});
