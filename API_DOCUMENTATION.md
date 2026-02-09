# Tutors Link API Documentation

Complete API reference for the Tutors Link platform backend.

## Base URL

- **Local Development**: `http://localhost:3000`
- **Production**: `https://tutorslink.up.railway.app`

## Authentication

Most endpoints require authentication using Firebase ID tokens.

### Headers

```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

### Getting the Token

Firebase tokens are obtained automatically when users log in through the frontend. The `api-client.js` handles token management automatically.

## User Management

### Register/Update User

**POST** `/api/users/register`

Register a new user or update existing user after Firebase authentication.

**Request Body:**
```json
{
  "firebaseUid": "string",
  "email": "string",
  "displayName": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "string",
    "email": "string",
    "displayName": "string",
    "role": "guest|student|tutor|admin",
    "timezone": "string",
    "preferredCurrency": "string",
    "preferredLanguage": "en|ar"
  }
}
```

### Get Current User Profile

**GET** `/api/users/me`

Requires authentication.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "displayName": "string",
    "role": "string",
    "timezone": "string",
    "preferredCurrency": "string",
    "preferredLanguage": "string",
    "tutorProfile": {} // if role is tutor
  }
}
```

### Update User Profile

**PATCH** `/api/users/me`

Requires authentication.

**Request Body:**
```json
{
  "displayName": "string (optional)",
  "timezone": "string (optional)",
  "preferredCurrency": "string (optional)",
  "preferredLanguage": "en|ar (optional)"
}
```

## Notifications

### Get User Notifications

**GET** `/api/notifications`

Requires authentication.

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "string",
        "type": "booking|enrollment|session|payment|review|system|chat",
        "title": "string",
        "message": "string",
        "link": "string",
        "isRead": false,
        "createdAt": "date"
      }
    ],
    "unreadCount": 5
  }
}
```

### Mark Notification as Read

**PATCH** `/api/notifications/:id/read`

Requires authentication.

## Tutors (Legacy)

### Get All Tutors

**GET** `/api/tutors`

Public endpoint.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "subjects": "string",
      "price": "string",
      "timezone": "string",
      "languages": "string",
      "category": "string",
      "availability": "string",
      "createdAt": "date"
    }
  ]
}
```

### Add New Tutor

**POST** `/api/tutors`

Staff portal endpoint.

**Request Body:**
```json
{
  "name": "string",
  "subjects": "string",
  "price": "string",
  "timezone": "string",
  "languages": "string",
  "category": "IGCSE|AS/A Levels|University|Test Preparation|Other",
  "availability": "string (optional)"
}
```

## Bookings (Demo Classes)

### Create Booking

**POST** `/api/bookings`

**Request Body:**
```json
{
  "studentName": "string",
  "studentEmail": "string",
  "tutorId": "string",
  "message": "string (optional)",
  "scheduledDate": "date (optional)"
}
```

## Enrollments (Monthly Subscriptions)

### Create Enrollment

**POST** `/api/enrollments`

Requires authentication. Student role required.

**Request Body:**
```json
{
  "tutorId": "string",
  "monthlyRate": 100,
  "classesPerWeek": 2,
  "classDuration": 60
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enrolled successfully",
  "data": {
    "_id": "string",
    "studentId": "string",
    "tutorId": "string",
    "monthlyRate": 100,
    "commissionRate": 0.15,
    "status": "active",
    "createdAt": "date"
  }
}
```

### Get My Enrollments

**GET** `/api/enrollments/my`

Requires authentication. Returns enrollments based on user role (student or tutor).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "studentId": {},
      "tutorId": {},
      "monthlyRate": 100,
      "commissionRate": 0.15,
      "status": "active|paused|cancelled|completed",
      "firstClassDate": "date",
      "nextBillingDate": "date",
      "createdAt": "date"
    }
  ]
}
```

## Sessions (Teaching Sessions)

### Create Session

**POST** `/api/sessions`

Requires authentication. Tutor role required.

**Request Body:**
```json
{
  "enrollmentId": "string",
  "scheduledDate": "2026-02-15T10:00:00Z",
  "duration": 60,
  "notes": "string (optional)"
}
```

### Get My Sessions

**GET** `/api/sessions/my`

Requires authentication. Returns sessions based on user role.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "enrollmentId": {},
      "tutorId": {},
      "studentId": {},
      "scheduledDate": "date",
      "duration": 60,
      "status": "scheduled|completed|cancelled",
      "attendance": {
        "tutorMarked": "present|late|absent|postponed",
        "studentMarked": "present|late|absent|postponed",
        "tutorMarkedAt": "date",
        "studentMarkedAt": "date",
        "finalStatus": "string"
      },
      "notes": "string",
      "createdAt": "date"
    }
  ]
}
```

### Mark Attendance

**PATCH** `/api/sessions/:id/attendance`

Requires authentication. Both tutor and student can mark attendance.

**Request Body:**
```json
{
  "status": "present|late|absent|postponed"
}
```

## Reviews

### Create Review

**POST** `/api/reviews`

Requires authentication. Student role required. Must have active enrollment with tutor.

**Request Body:**
```json
{
  "tutorId": "string",
  "enrollmentId": "string",
  "rating": 5,
  "title": "string (optional)",
  "comment": "string (optional, max 1000 chars)"
}
```

### Get Tutor Reviews

**GET** `/api/reviews/tutor/:tutorId`

Public endpoint.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "studentId": {
        "displayName": "string"
      },
      "rating": 5,
      "title": "string",
      "comment": "string",
      "isVisible": true,
      "createdAt": "date"
    }
  ]
}
```

## Chat System

### Start Chat Conversation

**POST** `/api/chat/start`

**Request Body:**
```json
{
  "userName": "string",
  "userEmail": "string",
  "userId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat started successfully",
  "data": {
    "conversationId": "string"
  }
}
```

### Send Message

**POST** `/api/chat/:conversationId/message`

**Request Body:**
```json
{
  "message": "string",
  "senderType": "user|staff|bot",
  "senderName": "string"
}
```

### Get Conversation Messages

**GET** `/api/chat/:conversationId/messages`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "conversationId": "string",
      "senderType": "user|staff|bot",
      "senderName": "string",
      "message": "string",
      "isEscalated": false,
      "createdAt": "date"
    }
  ]
}
```

### Escalate to Human Staff

**POST** `/api/chat/:conversationId/escalate`

Escalates bot conversation to human support.

## Guides/Documentation

### Get Published Guides

**GET** `/api/guides?category=string&lang=en|ar`

Public endpoint.

**Query Parameters:**
- `category` (optional): Filter by category
- `lang` (optional): Language (default: en)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "title": "string",
      "slug": "string",
      "category": "getting-started|student-guide|tutor-guide|discord-guide|policies|faq",
      "order": 0,
      "createdAt": "date"
    }
  ]
}
```

### Get Single Guide

**GET** `/api/guides/:slug?lang=en|ar`

Public endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "string",
    "content": "markdown content",
    "category": "string",
    "updatedAt": "date"
  }
}
```

## Support Messages

### Submit Support Message

**POST** `/api/support`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

## Tutor Applications

### Submit Application

**POST** `/api/tutor-applications`

**Request Body:**
```json
{
  "userId": "string",
  "email": "string",
  "discordUsername": "string",
  "subject": "string",
  "subjectCode": "string",
  "examinationBoard": "string",
  "academicResult": "string",
  "teachingLevel": "string",
  "teachingExperience": "string",
  "languagesSpoken": "string",
  "country": "string",
  "reference": "string",
  "teachingFormat": "One-on-one|Group classes|Both",
  "oneOnOneRate": "string",
  "groupClassRate": "string",
  "groupClassSize": "string",
  "classesPerWeekMonth": "string",
  "classDuration": "string",
  "highestQualification": "string",
  "qualificationDocumentLink": "string",
  "teachingVideoLink": "string",
  "academicResultsLink": "string",
  "professionalBio": "string (max 500 chars)",
  "agreeToTerms": true
}
```

## Admin Endpoints

All admin endpoints require authentication and admin role.

### Get All Users

**GET** `/api/admin/users?role=string&page=1&limit=50`

### Update User Role

**PATCH** `/api/admin/users/:id/role`

**Request Body:**
```json
{
  "role": "guest|student|tutor|admin"
}
```

### Get Platform Settings

**GET** `/api/admin/platform-settings`

### Update Platform Setting

**PUT** `/api/admin/platform-settings/:key`

**Request Body:**
```json
{
  "value": "any",
  "description": "string"
}
```

### Get All Reviews (with moderation)

**GET** `/api/admin/reviews?flagged=true|false`

### Moderate Review

**PATCH** `/api/admin/reviews/:id/moderate`

**Request Body:**
```json
{
  "isVisible": true,
  "isFlagged": false,
  "moderatorNotes": "string"
}
```

### Get Audit Logs

**GET** `/api/admin/audit-logs?page=1&limit=100&action=string&entityType=string`

### Create Guide

**POST** `/api/admin/guides`

**Request Body:**
```json
{
  "title": "string",
  "slug": "string",
  "content": "markdown content",
  "contentAr": "arabic content (optional)",
  "category": "getting-started|student-guide|tutor-guide|discord-guide|policies|faq",
  "isPublished": true,
  "order": 0
}
```

### Update Guide

**PUT** `/api/admin/guides/:id`

### Delete Guide

**DELETE** `/api/admin/guides/:id`

## Health Check

### Server Health

**GET** `/api/health`

Public endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Server is running, healthy",
  "timestamp": "2026-02-09T21:30:00.000Z",
  "mongodb": "connected|disconnected"
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

⚠️ **Note**: Rate limiting is not yet implemented. For production use, add rate limiting middleware to prevent abuse.

Recommended limits:
- Public endpoints: 100 requests/hour per IP
- Authenticated endpoints: 1000 requests/hour per user
- Admin endpoints: Unlimited (logged for audit)

## Webhooks

### Discord Notifications

When `DISCORD_WEBHOOK_URL` is configured, the following events trigger Discord notifications:

- New support messages
- New tutor applications  
- New enrollments
- Chat escalations

Format:
```json
{
  "content": "message text"
}
```

Or with embeds:
```json
{
  "embeds": [{
    "title": "Event Title",
    "color": 16711935,
    "fields": [...],
    "timestamp": "ISO date"
  }]
}
```

## Best Practices

### Frontend Integration

1. Use the provided `api-client.js` for all API calls
2. Handle loading states
3. Display user-friendly error messages
4. Implement proper error recovery
5. Cache responses where appropriate

### Security

1. Never expose Firebase private keys
2. Always validate user inputs
3. Use HTTPS in production
4. Implement CSRF protection for state-changing operations
5. Regularly rotate encryption keys
6. Monitor audit logs for suspicious activity

### Performance

1. Implement pagination for large datasets
2. Use MongoDB indexes for frequently queried fields
3. Cache static content (guides, platform settings)
4. Minimize API calls - batch where possible
5. Use CDN for static assets

## Support

For API issues or questions:
- Check server logs for errors
- Review audit logs for security issues
- Contact: tutorslink001@gmail.com
