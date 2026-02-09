// API Client for Tutors Link Platform
// Handles all API interactions with proper error handling

import { auth } from './firebase-config.js';

// Determine API base URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://tutorslink.up.railway.app';

// ============================================
// Helper Functions
// ============================================

async function getAuthToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}

async function apiRequest(endpoint, options = {}) {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// ============================================
// User Management
// ============================================

export async function registerUser(firebaseUid, email, displayName) {
  return await apiRequest('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({ firebaseUid, email, displayName })
  });
}

export async function getCurrentUser() {
  return await apiRequest('/api/users/me');
}

export async function updateUserProfile(updates) {
  return await apiRequest('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
}

// ============================================
// Notifications
// ============================================

export async function getNotifications() {
  return await apiRequest('/api/notifications');
}

export async function markNotificationRead(notificationId) {
  return await apiRequest(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH'
  });
}

// ============================================
// Tutors
// ============================================

export async function getTutors() {
  return await apiRequest('/api/tutors');
}

export async function createTutor(tutorData) {
  return await apiRequest('/api/tutors', {
    method: 'POST',
    body: JSON.stringify(tutorData)
  });
}

// ============================================
// Bookings (Demo Classes)
// ============================================

export async function createBooking(bookingData) {
  return await apiRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
}

// ============================================
// Enrollments (Monthly Subscriptions)
// ============================================

export async function createEnrollment(enrollmentData) {
  return await apiRequest('/api/enrollments', {
    method: 'POST',
    body: JSON.stringify(enrollmentData)
  });
}

export async function getMyEnrollments() {
  return await apiRequest('/api/enrollments/my');
}

// ============================================
// Sessions
// ============================================

export async function createSession(sessionData) {
  return await apiRequest('/api/sessions', {
    method: 'POST',
    body: JSON.stringify(sessionData)
  });
}

export async function getMySessions() {
  return await apiRequest('/api/sessions/my');
}

export async function markAttendance(sessionId, status) {
  return await apiRequest(`/api/sessions/${sessionId}/attendance`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

// ============================================
// Reviews
// ============================================

export async function createReview(reviewData) {
  return await apiRequest('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
}

export async function getTutorReviews(tutorId) {
  return await apiRequest(`/api/reviews/tutor/${tutorId}`);
}

// ============================================
// Support & Chat
// ============================================

export async function submitSupportMessage(name, email, message) {
  return await apiRequest('/api/support', {
    method: 'POST',
    body: JSON.stringify({ name, email, message })
  });
}

export async function startChat(userName, userEmail, userId = null) {
  return await apiRequest('/api/chat/start', {
    method: 'POST',
    body: JSON.stringify({ userName, userEmail, userId })
  });
}

export async function sendChatMessage(conversationId, message, senderType, senderName) {
  return await apiRequest(`/api/chat/${conversationId}/message`, {
    method: 'POST',
    body: JSON.stringify({ message, senderType, senderName })
  });
}

export async function getChatMessages(conversationId) {
  return await apiRequest(`/api/chat/${conversationId}/messages`);
}

export async function escalateChat(conversationId) {
  return await apiRequest(`/api/chat/${conversationId}/escalate`, {
    method: 'POST'
  });
}

// ============================================
// Guides
// ============================================

export async function getGuides(category = null, lang = 'en') {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  params.append('lang', lang);
  
  return await apiRequest(`/api/guides?${params.toString()}`);
}

export async function getGuide(slug, lang = 'en') {
  return await apiRequest(`/api/guides/${slug}?lang=${lang}`);
}

// ============================================
// Tutor Applications
// ============================================

export async function submitTutorApplication(applicationData) {
  return await apiRequest('/api/tutor-applications', {
    method: 'POST',
    body: JSON.stringify(applicationData)
  });
}

// ============================================
// Admin Functions
// ============================================

export async function adminGetUsers(role = null, page = 1, limit = 50) {
  const params = new URLSearchParams({ page, limit });
  if (role) params.append('role', role);
  
  return await apiRequest(`/api/admin/users?${params.toString()}`);
}

export async function adminUpdateUserRole(userId, role) {
  return await apiRequest(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role })
  });
}

export async function adminGetPlatformSettings() {
  return await apiRequest('/api/admin/platform-settings');
}

export async function adminUpdatePlatformSetting(key, value, description) {
  return await apiRequest(`/api/admin/platform-settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value, description })
  });
}

export async function adminGetReviews(flaggedOnly = false) {
  const params = flaggedOnly ? '?flagged=true' : '';
  return await apiRequest(`/api/admin/reviews${params}`);
}

export async function adminModerateReview(reviewId, moderationData) {
  return await apiRequest(`/api/admin/reviews/${reviewId}/moderate`, {
    method: 'PATCH',
    body: JSON.stringify(moderationData)
  });
}

export async function adminGetAuditLogs(page = 1, limit = 100, filters = {}) {
  const params = new URLSearchParams({ page, limit, ...filters });
  return await apiRequest(`/api/admin/audit-logs?${params.toString()}`);
}

export async function adminCreateGuide(guideData) {
  return await apiRequest('/api/admin/guides', {
    method: 'POST',
    body: JSON.stringify(guideData)
  });
}

export async function adminUpdateGuide(guideId, guideData) {
  return await apiRequest(`/api/admin/guides/${guideId}`, {
    method: 'PUT',
    body: JSON.stringify(guideData)
  });
}

export async function adminDeleteGuide(guideId) {
  return await apiRequest(`/api/admin/guides/${guideId}`, {
    method: 'DELETE'
  });
}
