<div align="center">

# **TUTORS LINK PLATFORM SETUP GUIDE**

</div>

Complete step-by-step guide for setting up, configuring, and deploying the Tutors Link tutoring marketplace platform. This guide covers everything from installation to production deployment.

---

<div align="right">

## System Requirements
___

</div>

Before you begin, ensure you have the following installed and ready:

Node.js version 18 or higher
npm version 8 or higher
MongoDB Atlas account (free tier available)
Firebase account (free)
Discord account (optional, for notifications)
Git installed on your system
Text editor (VS Code, Sublime, etc.)

You can check your Node.js and npm versions:

```bash
node --version
npm --version
```

If you need to install Node.js, visit https://nodejs.org and download the LTS version.

---

<div align="right">

## Getting Started
___

</div>

Follow these steps to get a local copy of the project running on your machine.

**Step 1: Clone the Repository**

Open your terminal or command prompt and run:

```bash
git clone https://github.com/tutorslink/website.git
cd website
```

This downloads the project files to your computer and navigates into the project folder.

**Step 2: Install Dependencies**

Install all required packages:

```bash
npm install
```

This command reads the package.json file and installs all necessary libraries. It may take a few minutes.

**Step 3: Create Environment File**

Create a new file named `.env` in the root directory (where package.json is located).

Copy and paste the following template into your `.env` file:

```env
# MongoDB Configuration (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tutorslink?retryWrites=true&w=majority

# Server Configuration
PORT=3000

# Email Configuration (Optional - for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
STAFF_EMAIL=tutorslink001@gmail.com

# Discord Webhook (Optional - for Discord notifications)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL

# Security (Recommended for production)
ENCRYPTION_KEY=your-32-character-encryption-key-here
ENCRYPTION_SALT=your-secure-salt-here
```

Do not commit this file to version control. It is already listed in .gitignore.

---

<div align="right">

## Database Setup (MongoDB Atlas)
___

</div>

MongoDB Atlas provides free cloud database hosting. Follow these detailed steps:

**Step 1: Create MongoDB Atlas Account**

Navigate to https://www.mongodb.com/cloud/atlas in your web browser.

Click the "Start Free" or "Sign Up" button.

You can sign up using:
- Email address and password
- Google account
- GitHub account (recommended if you have GitHub Student Pack)

If you are a student, apply for the GitHub Student Developer Pack at https://education.github.com/pack to get additional free credits.

**Step 2: Create a New Cluster**

After logging in, you will see the MongoDB Atlas dashboard.

Click the "Build a Database" button.

Choose deployment option:
- Select "Shared" for the free tier
- This gives you 512 MB of storage for free

Choose your cloud provider and region:
- Select AWS, Google Cloud, or Azure (AWS recommended)
- Choose a region closest to your location or your users
- This affects latency and performance

Name your cluster:
- Enter "tutorslink" as the cluster name
- Or use any name you prefer

Click "Create" button and wait 3-5 minutes while your cluster is provisioned.

**Step 3: Configure Database Access**

On the left sidebar, click "Database Access" under the Security section.

Click "Add New Database User" button.

Fill in the user details:
- Authentication Method: Select "Password"
- Username: Choose a username (example: tutorslink_admin)
- Password: Click "Autogenerate Secure Password" or create your own
- IMPORTANT: Copy and save this password somewhere safe

Set database user privileges:
- Select "Read and write to any database"
- This allows the application to create and modify data

Click "Add User" button.

Wait a few seconds for the user to be created.

**Step 4: Configure Network Access**

On the left sidebar, click "Network Access" under the Security section.

Click "Add IP Address" button.

Configure access:
- Click "Allow Access from Anywhere" button
- This adds 0.0.0.0/0 to the IP whitelist
- Required for Railway and other cloud platforms with dynamic IPs
- For additional security in production, you can later restrict this

Add an optional comment: "Allow cloud platform access"

Click "Confirm" button.

**Step 5: Get Connection String**

On the left sidebar, click "Database" under the Deployment section.

Find your cluster and click the "Connect" button.

Choose connection method:
- Click "Connect your application"

Configure connection:
- Driver: Node.js
- Version: 4.1 or later

Copy the connection string:
- It looks like: mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
- Click the "Copy" button

Modify the connection string:
- Replace <password> with your actual database password
- Add the database name after .net/: change .net/ to .net/tutorslink
- Final format: mongodb+srv://username:actualpassword@cluster.mongodb.net/tutorslink?retryWrites=true&w=majority

Update your .env file:
- Open the .env file you created earlier
- Find the MONGODB_URI line
- Replace the placeholder with your actual connection string
- Save the file

---

<div align="right">

## Firebase Setup
___

</div>

Firebase provides authentication services. Follow these steps carefully:

**Step 1: Create Firebase Project**

Go to https://console.firebase.google.com in your web browser.

Click "Add project" or "Create a project" button.

Enter project details:
- Project name: Enter "Tutors Link" or any name you prefer
- Click "Continue"

Configure Google Analytics (optional):
- You can disable this for now by toggling the switch off
- Click "Continue" or "Create project"

Wait for the project to be created (takes about 30 seconds).

Click "Continue" when the project is ready.

**Step 2: Enable Authentication**

On the left sidebar, click "Authentication" under the Build section.

If this is your first time, click "Get started" button.

Enable Email/Password authentication:
- Click on the "Sign-in method" tab at the top
- Find "Email/Password" in the list of providers
- Click on it to expand

Configure Email/Password:
- Toggle the "Enable" switch to ON
- Leave "Email link (passwordless sign-in)" disabled
- Click "Save" button

**Step 3: Add Authorized Domains**

Still in the Authentication section, click the "Settings" tab.

Scroll down to "Authorized domains" section.

You will see localhost is already authorized.

Add your production domains (you can add these later when deploying):
- Click "Add domain" button
- Enter your GitHub Pages domain: yourusername.github.io
- Click "Add" button
- Repeat for any custom domains you will use

**Step 4: Register Web Application**

Click the gear icon (Settings) next to "Project Overview" in the top left.

Click "Project settings" from the dropdown.

Scroll down to "Your apps" section.

Click the web icon (looks like </>) to add a web app.

Register your app:
- App nickname: Enter "Tutors Link Web App"
- Do NOT check "Also set up Firebase Hosting"
- Click "Register app" button

Copy the Firebase configuration:
- You will see a code snippet with firebaseConfig object
- Copy the entire configuration object
- It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Click "Continue to console" button.

**Step 5: Update Firebase Configuration File**

Open the file `firebase-config.js` in your project folder.

Find the firebaseConfig object (around line 6-12).

Replace the placeholder values with your actual Firebase configuration.

Your firebase-config.js should look like this:

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-actual-auth-domain",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-storage-bucket",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

Save the file.

IMPORTANT NOTE: These Firebase values are safe to commit to GitHub. They are public identifiers. Security is provided by Firebase's built-in security rules and authorized domains.

---

<div align="right">

## Running Locally
___

</div>

Now that everything is configured, start your local development server.

**Step 1: Start the Server**

In your terminal, make sure you are in the project directory, then run:

```bash
npm start
```

You should see output similar to:

```
Server is running on port 3000
API endpoints available at http://localhost:3000/api
Connected to MongoDB Atlas
```

If you see any errors, check the Troubleshooting section below.

**Step 2: Access the Application**

Open your web browser and navigate to:

Main website: http://localhost:3000
Dashboard: http://localhost:3000/dashboard.html
Apply as Tutor page: http://localhost:3000/apply-as-tutor.html
API health check: http://localhost:3000/api/health

**Step 3: Create Admin Account**

To create an admin account with full permissions:

Open http://localhost:3000 in your browser.

Click the "Sign Up" button in the header.

Enter the admin email: tutorslink001@gmail.com

Enter any password (minimum 6 characters).

Click "Sign Up" button.

The system automatically assigns admin role to this specific email.

You will be redirected to the dashboard.

You should see "ADMIN" role badge in the top right corner.

**Step 4: Test the Platform**

As an admin, you can:

View dashboard with platform statistics.
Manage users by going to admin panel.
Change user roles.
Moderate reviews.
Configure platform settings.
Create and edit guides.

To test other roles:

Click "Logout" button in the top right.
Click "Sign Up" again with a different email address.
You will have "GUEST" role by default.
Log back in as admin (tutorslink001@gmail.com).
Navigate to admin panel to change the new user's role to STUDENT or TUTOR.

---

<div align="right">

## Backend Deployment (Railway)
___

</div>

Deploy your backend server to Railway for production hosting.

**Step 1: Create Railway Account**

Visit https://railway.app in your web browser.

Click "Start a New Project" or "Sign Up" button.

Sign up using your GitHub account:
- Click "Login with GitHub"
- Authorize Railway to access your GitHub account

**Step 2: Create New Project**

On Railway dashboard, click "New Project" button.

Select deployment method:
- Click "Deploy from GitHub repo"

Connect your repository:
- If this is your first time, Railway will ask to install GitHub app
- Click "Configure GitHub App"
- Select your GitHub account
- Choose repositories to give Railway access to
- Select "Only select repositories"
- Choose the "tutorslink/website" repository
- Click "Install & Authorize"

Select the repository:
- Back on Railway, you should now see your repository listed
- Click on "tutorslink/website"

Railway will automatically detect your Node.js application.

**Step 3: Configure Environment Variables**

On your Railway project dashboard, click on your service.

Click the "Variables" tab at the top.

Add environment variables one by one:

Click "New Variable" button for each:

Variable name: MONGODB_URI
Value: Paste your MongoDB connection string from earlier
Click "Add" button

Variable name: DISCORD_WEBHOOK_URL
Value: Your Discord webhook URL (optional, see Discord Integration section)
Click "Add" button

Variable name: EMAIL_HOST
Value: smtp.gmail.com (if using email notifications)

Variable name: EMAIL_PORT
Value: 587

Variable name: EMAIL_USER
Value: your-email@gmail.com

Variable name: EMAIL_PASSWORD
Value: your-app-password (see Email Setup section for how to generate)

Variable name: STAFF_EMAIL
Value: tutorslink001@gmail.com

Variable name: ENCRYPTION_KEY
Value: Generate a random 32-character string for encryption

DO NOT add PORT variable. Railway automatically provides this.

DO NOT add Firebase variables. Firebase is client-side only.

**Step 4: Deploy**

Railway automatically deploys your application when you push to your main branch.

To trigger initial deployment:
- Railway should start building automatically
- Watch the deployment logs in the "Deployments" tab
- Wait for deployment to complete (2-5 minutes)

Get your deployment URL:
- Click on the "Settings" tab
- Scroll to "Domains" section
- You will see a URL like: your-app.up.railway.app
- Click "Generate Domain" if one is not created automatically
- Copy this URL for the next step

**Step 5: Update Frontend Configuration**

Open the file `api-client.js` in your project.

Find the line that defines API_BASE_URL (around line 6-8):

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://tutorslink.up.railway.app';
```

Replace 'https://tutorslink.up.railway.app' with your actual Railway URL.

Save the file.

Commit and push the change:

```bash
git add api-client.js
git commit -m "Update production API URL"
git push
```

Railway will automatically redeploy with the new configuration.

---

<div align="right">

## Frontend Deployment (GitHub Pages)
___

</div>

Deploy your frontend to GitHub Pages for free static hosting.

**Step 1: Enable GitHub Pages**

Go to your GitHub repository: https://github.com/tutorslink/website

Click on "Settings" tab at the top.

Scroll down and click "Pages" in the left sidebar.

Under "Source" section:
- Branch: Select "main" from the dropdown
- Folder: Select "/ (root)" from the dropdown
- Click "Save" button

GitHub will start deploying your site.

**Step 2: Wait for Deployment**

The first deployment takes 2-5 minutes.

You can check deployment status:
- Go to "Actions" tab in your repository
- You will see a workflow running called "pages-build-deployment"
- Wait for it to complete (green checkmark)

**Step 3: Access Your Website**

Once deployed, your site will be available at:

https://yourusername.github.io/website/

Or if you are using the tutorslink organization:

https://tutorslink.github.io/website/

Visit this URL in your browser to see your live site.

**Step 4: Configure Custom Domain (Optional)**

If you have a custom domain (like tutorslink.com):

In GitHub Pages settings, find "Custom domain" section.

Enter your domain name: tutorslink.com

Click "Save" button.

Configure DNS settings at your domain provider:
- Add a CNAME record pointing to yourusername.github.io
- Or add A records pointing to GitHub's IP addresses
- See GitHub Pages documentation for detailed DNS instructions

Wait for DNS propagation (can take up to 24-48 hours).

Check "Enforce HTTPS" box once DNS is configured.

---

<div align="right">

## Email Configuration (Optional)
___

</div>

Set up email notifications for tutor applications and support messages.

**Using Gmail**

Step 1: Enable 2-Factor Authentication
- Go to your Google Account settings: https://myaccount.google.com
- Click "Security" in the left sidebar
- Find "2-Step Verification" and turn it on
- Follow the prompts to set up 2FA with your phone

Step 2: Create App Password
- Still in Security settings, find "App passwords"
- You may need to verify your identity again
- Click "Select app" dropdown and choose "Mail"
- Click "Select device" dropdown and choose "Other (Custom name)"
- Enter "Tutors Link" as the name
- Click "Generate" button
- Copy the 16-digit app password (remove spaces if any)
- Save this password securely

Step 3: Update Environment Variables
- Add to your .env file (for local development):

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
STAFF_EMAIL=tutorslink001@gmail.com
```

- Add the same variables to Railway environment variables (for production)

Step 4: Test Email
- Restart your server: npm start
- Submit a tutor application or support message
- Check if you receive an email

**Using Other Email Providers**

For Outlook/Hotmail:
- EMAIL_HOST=smtp-mail.outlook.com
- EMAIL_PORT=587
- Use your Outlook password or app password

For Custom SMTP servers:
- Get SMTP credentials from your email provider
- Update EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD accordingly

---

<div align="right">

## Discord Integration (Optional)
___

</div>

Set up Discord webhooks to receive notifications in your Discord server.

**Step 1: Create Discord Server**

If you do not have a Discord server:
- Open Discord application or web version
- Click the plus icon on the left sidebar
- Click "Create My Own"
- Choose "For a club or community"
- Name your server: "Tutors Link Staff"
- Click "Create"

**Step 2: Create Webhook**

In your Discord server:
- Right-click on the channel where you want notifications (example: general or notifications channel)
- Click "Edit Channel"
- Click "Integrations" in the left sidebar
- Click "Webhooks" section
- Click "New Webhook" button

Configure webhook:
- Name: Enter "Tutors Link Notifications"
- Channel: Ensure correct channel is selected
- Upload an icon (optional): You can add a logo
- Click "Copy Webhook URL" button
- Save this URL securely

Click "Save Changes" button.

**Step 3: Add Webhook to Environment**

Update your .env file:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1234567890/abcdefghijklmnop
```

Replace with your actual webhook URL.

Update Railway environment variables:
- Go to Railway project
- Add DISCORD_WEBHOOK_URL variable with your webhook URL

**Step 4: Test Webhook**

Restart your server.

Trigger a notification:
- Submit a support message
- Submit a tutor application
- Create a new enrollment

Check your Discord channel for the notification.

**Notifications Sent to Discord**

The platform sends notifications for:
- New support messages
- New tutor applications (with detailed information)
- New student enrollments
- Chat escalations to staff

---

<div align="right">

## Initial Platform Configuration
___

</div>

Configure your platform for first use after deployment.

**Step 1: Set Commission Rate**

Log in as admin (tutorslink001@gmail.com).

Navigate to admin panel.

Click "Platform Settings" section.

Find "Commission Rate" setting.

Default is 0.15 (15 percent).

To change:
- Enter new value (example: 0.20 for 20 percent)
- Click "Update" button

This rate applies to all new enrollments.

**Step 2: Create Initial Content**

Create guides for users:

Go to admin dashboard.

Click "Manage Guides" section.

Click "Create New Guide" button.

Fill in guide details:
- Title: "Getting Started with Tutors Link"
- Category: Select "getting-started"
- Content: Write helpful content for new users
- Publish: Check the box to make it visible
- Click "Save" button

Repeat for other important guides:
- How Tutors Link Works
- Student Guide
- Tutor Guide
- Platform Policies

**Step 3: Configure Platform Settings**

Review and configure:
- Supported subjects and levels
- Payment methods information
- Terms and conditions
- Privacy policy

**Step 4: Test User Flows**

Test as different user types:

As Guest:
- Browse tutors
- Book demo class
- View guides

As Student (after admin assigns role):
- View dashboard
- Enroll with tutor
- View sessions
- Mark attendance
- Submit review

As Tutor (after admin assigns role):
- View dashboard
- See enrolled students
- Schedule sessions
- Mark attendance

As Admin:
- Manage users
- Moderate reviews
- View audit logs
- Update platform settings

---

<div align="right">

## API Reference
___

</div>

The platform provides 40+ RESTful API endpoints.

**Base URLs**

Local Development: http://localhost:3000
Production: https://your-app.up.railway.app

**Authentication**

Most endpoints require authentication using Firebase ID tokens.

Headers format:

```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

The frontend api-client.js handles token management automatically.

**User Management Endpoints**

POST /api/users/register
- Register new user or update existing user
- Required fields: firebaseUid, email
- Optional: displayName

GET /api/users/me
- Get current user profile
- Requires authentication
- Returns user data and role

PATCH /api/users/me
- Update user profile
- Requires authentication
- Fields: displayName, timezone, preferredCurrency, preferredLanguage

**Tutor Endpoints**

GET /api/tutors
- Get all tutors (public)
- No authentication required
- Returns array of tutor profiles

POST /api/tutors
- Add new tutor (staff only)
- Required: name, subjects, price, timezone, languages, category

**Booking Endpoints**

POST /api/bookings
- Create demo class booking
- Required: studentName, studentEmail, tutorId
- Optional: message

**Enrollment Endpoints**

POST /api/enrollments
- Create monthly subscription
- Requires authentication (student role)
- Required: tutorId, monthlyRate

GET /api/enrollments/my
- Get user's enrollments
- Requires authentication
- Returns different data for students vs tutors

**Session Endpoints**

POST /api/sessions
- Create teaching session
- Requires authentication (tutor role)
- Required: enrollmentId, scheduledDate, duration

GET /api/sessions/my
- Get user's sessions
- Requires authentication
- Filtered by role

PATCH /api/sessions/:id/attendance
- Mark attendance
- Requires authentication
- Status: present, late, absent, postponed

**Review Endpoints**

POST /api/reviews
- Submit review
- Requires authentication (student role)
- Must have enrollment with tutor
- Required: tutorId, enrollmentId, rating (1-5)

GET /api/reviews/tutor/:tutorId
- Get tutor reviews (public)
- Returns visible reviews only

**Notification Endpoints**

GET /api/notifications
- Get user notifications
- Requires authentication
- Returns unread count

PATCH /api/notifications/:id/read
- Mark notification as read
- Requires authentication

**Chat Endpoints**

POST /api/chat/start
- Start new chat conversation
- Required: userName, userEmail

POST /api/chat/:conversationId/message
- Send message in conversation
- Required: message, senderType, senderName

GET /api/chat/:conversationId/messages
- Get conversation messages
- Returns message history

POST /api/chat/:conversationId/escalate
- Escalate to human staff
- Updates conversation status

**Guide Endpoints**

GET /api/guides
- Get published guides
- Query params: category, lang (en or ar)

GET /api/guides/:slug
- Get single guide by slug
- Query param: lang

**Admin Endpoints**

All admin endpoints require admin role.

GET /api/admin/users
- Get all users
- Query params: role, page, limit

PATCH /api/admin/users/:id/role
- Update user role
- Required: role (guest, student, tutor, admin)

GET /api/admin/platform-settings
- Get platform settings

PUT /api/admin/platform-settings/:key
- Update setting
- Required: value, description

GET /api/admin/reviews
- Get all reviews
- Query param: flagged (true/false)

PATCH /api/admin/reviews/:id/moderate
- Moderate review
- Fields: isVisible, isFlagged, moderatorNotes

GET /api/admin/audit-logs
- Get audit logs
- Query params: page, limit, action, entityType

POST /api/admin/guides
- Create guide
- Required: title, slug, content, category

PUT /api/admin/guides/:id
- Update guide

DELETE /api/admin/guides/:id
- Delete guide

**Support Endpoints**

POST /api/support
- Submit support message
- Required: name, email, message

POST /api/tutor-applications
- Submit tutor application
- Required: All application form fields

**Health Check**

GET /api/health
- Check server health
- Returns server status and database connection

**Error Responses**

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

<div align="right">

## Platform Features
___

</div>

Overview of all implemented features and their status.

**Authentication and User Management**

Implemented:
- Firebase Authentication with email and password
- Four user roles: Guest, Student, Tutor, Admin
- Automatic admin assignment for tutorslink001@gmail.com
- User profile management with preferences
- Role-based UI rendering
- Protected routes and API endpoints

**Tutor Discovery**

Implemented:
- Browse all available tutors
- Filter by category (IGCSE, AS/A Levels, University, Test Prep, Other)
- View tutor profiles with pricing and availability
- Display tutor ratings and review count

Planned:
- Advanced filtering by price range, timezone, specific subjects
- Hierarchical navigation (Level to Subject to Tutor)
- Rich profiles with video introductions

**Demo Class Booking**

Implemented:
- Book free demo classes from website
- Capture student information
- Store in database with status tracking
- Discord webhook notifications to staff

Planned:
- Email notifications to tutors
- Calendar integration
- Confirmation prompts

**Monthly Subscriptions**

Implemented:
- Enrollment management system
- Students can enroll with multiple tutors simultaneously
- Configurable commission rate (platform setting)
- Track monthly rates and billing cycles
- Calculate tutor earnings after commission
- Manual admin payout tracking

Planned:
- Automated payment processing
- Invoice generation
- Payment history

**Session Scheduling**

Implemented:
- Tutors create and manage teaching sessions
- Link sessions to enrollments
- Students view their scheduled sessions
- Duration and notes for each session

Planned:
- Interactive calendar view
- Recurring session templates
- Session rescheduling
- Automatic reminders

**Attendance Tracking**

Implemented:
- Dual attendance marking (both tutor and student mark)
- Four states: Present, Late, Absent, Postponed
- Timestamps for all markings
- Complete audit trail
- Final status determination

Planned:
- Automatic notifications for unmarked attendance
- Attendance reports
- Conflict resolution interface

**Review System**

Implemented:
- Students review tutors they studied with
- Must have enrollment to submit review
- 5-star rating with optional title and comment
- One review per enrollment
- Public display on tutor profiles
- Average rating calculation
- Admin moderation interface
- Flag and hide inappropriate reviews

Planned:
- Review helpfulness voting
- Report review feature

**Communication System**

Implemented:
- Support message form
- Chat conversation system
- Message history storage
- Escalate to staff functionality
- In-app notifications with 30-day retention
- Discord webhook notifications
- Read/unread notification tracking

Planned:
- Real-time WebSocket chat
- AI chatbot for FAQs
- Canned responses for staff
- File sharing in chat

**Tutor Applications**

Implemented:
- Comprehensive application form (20+ fields)
- Document link requirements
- Professional bio (500 character limit)
- Terms agreement
- Confirmation email to applicant
- Staff notification via email and Discord
- Rich Discord embeds with application details
- Database storage with status tracking

Planned:
- Admin review interface
- Accept/reject workflow
- Automatic role assignment on acceptance
- Document upload instead of links

**Admin Portal**

Implemented:
- User management (view all users, update roles)
- Review moderation (view, flag, hide reviews)
- Platform settings configuration
- Audit log viewing (90-day retention)
- Guide management (create, edit, delete)
- Dashboard with platform statistics

Planned:
- Visual charts and graphs
- Booking management interface
- Payment management
- Bulk user operations
- Export functionality

**Guides and Documentation**

Implemented:
- Public guides system
- Six categories: Getting Started, Student Guide, Tutor Guide, Discord Guide, Policies, FAQs
- Multi-language support (English and Arabic ready)
- Admin CRUD interface
- Publish/unpublish control
- Order management

Planned:
- Search functionality
- Rich media support (images, videos)
- Version history

**Discord Integration**

Implemented:
- Webhook notifications for support messages
- Webhook notifications for tutor applications
- Webhook notifications for enrollments
- Webhook notifications for chat escalations
- Rich embeds with detailed information

Planned:
- Full Discord bot
- Slash commands for admin operations
- Two-way communication
- Tutor ad sync from Discord to website

**Security Features**

Implemented:
- Firebase Authentication
- Role-based access control
- Server-side authorization
- Audit logging for admin actions
- IP address tracking
- User agent tracking
- CORS configuration
- Environment variables for secrets

Needs Implementation:
- Rate limiting
- Firebase Admin SDK token verification
- Security headers
- CSRF protection

**Internationalization**

Database Ready:
- User language preference
- Guide translation support
- API accepts language parameter

Needs Implementation:
- Complete UI translation
- RTL layout for Arabic
- Language switcher interface
- Translation management

**Multi-Currency**

Database Ready:
- User currency preference
- Base currency storage (USD)
- Schema supports conversion

Needs Implementation:
- Live currency conversion
- Display in user's preferred currency
- Exchange rate management

---

<div align="right">

## Troubleshooting
___

</div>

Common issues and their solutions.

**Server Issues**

Problem: Server won't start

Solution:
- Check if port 3000 is already in use
- Kill any process using port 3000: lsof -ti:3000 | xargs kill (Mac/Linux) or netstat -ano | findstr :3000 (Windows)
- Ensure all dependencies are installed: npm install
- Check for syntax errors: node -c server.js

Problem: MONGODB_URI not set warning

Solution:
- Verify .env file exists in root directory
- Check .env file has correct MONGODB_URI line
- Ensure no extra spaces in .env file
- Restart server after updating .env

Problem: Cannot connect to MongoDB

Solution:
- Verify MongoDB connection string is correct
- Check password has no special characters that need encoding
- Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Verify database user has read/write permissions
- Check internet connection

**Authentication Issues**

Problem: Firebase authentication error

Solution:
- Verify firebase-config.js has correct credentials
- Check Firebase Console, ensure Authentication is enabled
- Add localhost to authorized domains in Firebase
- Clear browser cache and cookies
- Check browser console for specific error messages

Problem: User cannot log in

Solution:
- Verify email and password are correct
- Check Firebase Console for user account
- Ensure account is not disabled
- Try password reset if needed

Problem: Token verification fails

Solution:
- Clear browser local storage
- Log out and log back in
- Ensure Firebase ID token is being sent correctly
- Check Authorization header format

**Database Issues**

Problem: Collections not created

Solution:
- Ensure server has started successfully
- Check MongoDB connection is established
- Verify database name in connection string
- Collections are created automatically on first data insertion

Problem: Data not saving

Solution:
- Check server logs for error messages
- Verify all required fields are provided
- Ensure user has correct permissions
- Check database connection status

**Deployment Issues**

Problem: Railway deployment fails

Solution:
- Check Railway build logs for errors
- Verify package.json has start script
- Ensure all environment variables are set in Railway
- Check Node.js version compatibility

Problem: GitHub Pages not updating

Solution:
- Wait 5-10 minutes for deployment to complete
- Check Actions tab for deployment status
- Clear browser cache
- Verify branch and folder settings in GitHub Pages

Problem: Frontend cannot connect to backend

Solution:
- Verify API_BASE_URL in api-client.js is correct
- Check CORS is enabled on backend
- Ensure Railway backend is running
- Test backend URL directly in browser
- Check browser console for CORS errors

**Email Issues**

Problem: Emails not sending

Solution:
- Verify email credentials are correct
- Check app password is used (not regular password)
- Ensure EMAIL_HOST and EMAIL_PORT are correct
- Check email service is not blocking SMTP
- Review server logs for email errors

Problem: Emails going to spam

Solution:
- Configure SPF and DKIM records for custom domain
- Use reputable email service
- Avoid spam trigger words in email content
- Ask recipients to mark as "Not Spam"

**Discord Issues**

Problem: Discord notifications not appearing

Solution:
- Verify webhook URL is correct
- Check webhook is not deleted in Discord
- Ensure channel exists and webhook has permissions
- Test webhook with curl or Postman
- Check server logs for webhook errors

Problem: Discord embeds not displaying correctly

Solution:
- Verify embed format is correct
- Check field values are not too long
- Ensure proper JSON structure
- Test with Discord Webhook Tester tool

**Frontend Issues**

Problem: Dashboard not loading

Solution:
- Check browser console for errors
- Verify user is logged in
- Ensure API endpoints are accessible
- Clear browser cache
- Check network tab for failed requests

Problem: Role-based features not showing

Solution:
- Verify user role in database
- Log out and log back in
- Check role assignment in admin panel
- Ensure role-based rendering logic is correct

**Performance Issues**

Problem: Slow API responses

Solution:
- Check database query performance
- Add indexes to frequently queried fields
- Optimize database queries
- Consider caching for static data
- Check server resources (CPU, memory)

Problem: Frontend loading slowly

Solution:
- Optimize images and assets
- Minimize JavaScript bundle size
- Enable browser caching
- Consider CDN for static assets
- Check network latency

**Security Issues**

Problem: npm audit shows vulnerabilities

Solution:
- Run npm audit fix to auto-fix
- Update dependencies: npm update
- Check for breaking changes before updating
- Consider alternative packages if issues persist

Problem: Unauthorized access attempts

Solution:
- Check audit logs for suspicious activity
- Verify authentication middleware is working
- Ensure role-based authorization is enforced
- Implement rate limiting
- Monitor for unusual patterns

---

<div align="right">

## Testing
___

</div>

How to test the platform and verify everything works.

**Manual Testing Checklist**

Authentication:
- Sign up with new account
- Log in with existing account
- Log out
- Password validation (minimum 6 characters)
- Role assignment (check tutorslink001@gmail.com gets admin)

Guest Features:
- Browse tutors
- View tutor profiles
- Book demo class
- View guides
- Submit support message

Student Features:
- View dashboard
- Create enrollment with tutor
- View sessions
- Mark attendance
- Submit review

Tutor Features:
- View enrolled students
- Create session
- Mark attendance
- View earnings
- See ratings

Admin Features:
- View all users
- Change user roles
- Moderate reviews
- Update platform settings
- View audit logs
- Create/edit guides

**API Testing**

Use tools like Postman or curl to test API endpoints.

Example health check:

```bash
curl http://localhost:3000/api/health
```

Example create user:

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test123","email":"test@example.com"}'
```

Example authenticated request:

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

**Database Testing**

Connect to MongoDB Atlas:
- Use MongoDB Compass GUI tool
- Or use mongosh CLI
- Verify collections are created
- Check data integrity
- Review indexes

**Integration Testing**

Test complete user flows:
- Student enrollment to session attendance
- Tutor application to session scheduling
- Review submission to moderation
- Support message to Discord notification

**Security Testing**

Verify authentication:
- Try accessing protected routes without token
- Attempt role escalation
- Test with invalid tokens

Test authorization:
- Student trying to access admin routes
- Guest trying to create sessions
- Verify audit logging

---

<div align="right">

## Security Best Practices
___

</div>

Important security considerations for production.

**Before Production Launch**

Run npm audit fix:
- Update dependencies with known vulnerabilities
- Review and apply security patches

Implement rate limiting:
- Install express-rate-limit package
- Limit API requests per IP
- Prevent brute force attacks

Add security headers:
- Install helmet package
- Enable HTTPS only
- Configure CSP headers

Set encryption key:
- Generate strong random key (32 characters)
- Add to environment variables
- Never commit to version control

Implement Firebase Admin SDK:
- Replace basic token verification
- Verify tokens server-side properly
- Prevent token forgery

**Environment Security**

Protect environment variables:
- Never commit .env file
- Use Railway's environment variables
- Rotate secrets regularly

Use strong passwords:
- Database passwords
- Admin accounts
- API keys

Enable HTTPS:
- Enforce SSL/TLS
- Use Railway's automatic HTTPS
- Configure custom domain certificates

**Database Security**

Restrict IP access:
- Update MongoDB whitelist for production
- Use specific IPs when possible
- Monitor access logs

Use strong credentials:
- Long, random database passwords
- Separate users for different environments
- Principle of least privilege

Enable encryption:
- Encryption at rest (MongoDB Atlas)
- Encryption in transit (TLS)

**Application Security**

Validate all inputs:
- Server-side validation
- Sanitize user inputs
- Prevent SQL/NoSQL injection

Implement CSRF protection:
- Use tokens for state-changing operations
- Validate origin headers

Log security events:
- Failed login attempts
- Role changes
- Unauthorized access attempts
- Review audit logs regularly

**Monitoring**

Set up alerts:
- Failed authentication attempts
- Database connection issues
- Server errors
- Unusual activity patterns

Regular security audits:
- Review code for vulnerabilities
- Check dependencies
- Penetration testing
- Update security measures

**User Data Protection**

Comply with regulations:
- GDPR for European users
- CCPA for California users
- Implement data retention policies

Allow data export:
- Users can download their data
- Provide data deletion

Encrypt sensitive data:
- Personal information
- Payment details
- Use ENCRYPTION_KEY

**Incident Response**

Have a plan:
- Document response procedures
- Identify key personnel
- Establish communication channels

In case of breach:
- Take affected systems offline
- Preserve evidence and logs
- Notify affected users
- Document the incident
- Implement fixes
- Review and improve security

---

<div align="right">

## Maintenance
___

</div>

Ongoing tasks to keep the platform running smoothly.

**Daily Tasks**

Check server status:
- Verify backend is running
- Check database connection
- Review error logs

Monitor notifications:
- Check Discord for alerts
- Review support messages
- Respond to user inquiries

**Weekly Tasks**

Review audit logs:
- Check for suspicious activity
- Verify admin actions
- Monitor failed login attempts

Moderate content:
- Review flagged reviews
- Check reported content
- Update guides as needed

Database maintenance:
- Check database size
- Review performance
- Optimize queries if needed

**Monthly Tasks**

Update dependencies:
- Run npm update
- Check for security patches
- Test after updates

Review platform settings:
- Verify commission rate
- Update policies if needed
- Check email templates

Backup database:
- Export important data
- Store backups securely
- Test restore procedures

**Quarterly Tasks**

Security audit:
- Review access logs
- Update passwords
- Check permissions

Performance review:
- Analyze server metrics
- Optimize slow queries
- Review user feedback

Content updates:
- Update guides
- Refresh documentation
- Improve help resources

**Annual Tasks**

Major updates:
- Plan new features
- Upgrade dependencies
- Refactor code

Legal compliance:
- Review terms and conditions
- Update privacy policy
- Check regulatory requirements

Infrastructure review:
- Evaluate hosting costs
- Consider scaling options
- Plan for growth

**Backup Procedures**

Database backups:
- MongoDB Atlas automatic backups
- Manual exports for critical data
- Store in multiple locations

Code backups:
- GitHub version control
- Tag stable releases
- Document deployment process

Configuration backups:
- Save environment variables securely
- Document all settings
- Keep deployment notes

**Monitoring Tools**

Set up monitoring:
- Server uptime monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics

Create dashboards:
- Server health
- API response times
- Database performance
- User activity

**Documentation Updates**

Keep documentation current:
- Update this guide as needed
- Document new features
- Fix outdated information
- Add troubleshooting entries

---

<div align="right">

## Support
___

</div>

Where to get help and additional resources.

**Official Resources**

Documentation:
- This setup guide
- API documentation in code comments
- Feature documentation in codebase

GitHub Repository:
- https://github.com/tutorslink/website
- Open issues for bugs
- Submit pull requests for improvements

**Community Support**

Discord Server:
- Join: https://discord.gg/pe8TXPgkAe
- Ask questions
- Share feedback
- Connect with other users

Social Media:
- Instagram: @tutors.link
- TikTok: @tutors_link
- Follow for updates and tips

**Email Support**

Contact: tutorslink001@gmail.com
- Technical issues
- Feature requests
- General inquiries

**External Resources**

MongoDB Atlas Documentation:
- https://docs.atlas.mongodb.com

Firebase Documentation:
- https://firebase.google.com/docs

Railway Documentation:
- https://docs.railway.app

GitHub Pages Documentation:
- https://docs.github.com/pages

Node.js Documentation:
- https://nodejs.org/docs

Express.js Documentation:
- https://expressjs.com

**Learning Resources**

For beginners learning web development:
- MDN Web Docs: https://developer.mozilla.org
- freeCodeCamp: https://www.freecodecamp.org
- W3Schools: https://www.w3schools.com

For Node.js and backend:
- Node.js official tutorials
- Express.js getting started guide
- MongoDB University (free courses)

For Firebase:
- Firebase official documentation
- Firebase YouTube channel
- Firebase blog

**Reporting Issues**

When reporting an issue, include:
- Clear description of the problem
- Steps to reproduce
- Expected behavior vs actual behavior
- Error messages or logs
- Screenshots if applicable
- Your environment (OS, Node version, browser)

**Feature Requests**

To request a new feature:
- Check if it already exists or is planned
- Describe the feature clearly
- Explain the use case
- Consider providing implementation ideas
- Be patient, prioritization takes time

---

<div align="right">

## License and Credits
___

</div>

**License**

This project is licensed under the ISC License.

Copyright 2026 Tutors Link

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

**Credits**

Developed by Tutors Link Team

Built with:
- Node.js
- Express.js
- MongoDB
- Firebase
- Railway
- GitHub Pages

**Contributing**

Contributions are welcome. Please:
- Fork the repository
- Create a feature branch
- Make your changes
- Submit a pull request
- Follow coding standards
- Include tests if applicable

**Acknowledgments**

Thanks to all contributors and users who help make Tutors Link better.

Special thanks to:
- GitHub Student Developer Pack
- MongoDB Atlas free tier
- Firebase free tier
- Railway free tier
- Open source community

---

<div align="center">

**END OF SETUP GUIDE**

For questions or support, contact tutorslink001@gmail.com

</div>
