# Tutors Link - Full-Stack Web Application

Connect with tutors worldwide. Free for students, prices set by tutors. All payments secure through Tutors Link.

## 🚀 Features

- **Student Features:**
  - Browse available tutors by category
  - Book demo classes
  - Submit support messages
  - Secure payment processing

- **Tutor Features:**
  - Apply to become a tutor
  - Set your own prices
  - Manage availability

- **Staff Portal:**
  - Add and manage tutors
  - View booking requests
  - Receive support messages via Discord

## 🏗️ Architecture

- **Frontend:** Static HTML/CSS/JS hosted on GitHub Pages
- **Backend:** Node.js/Express API hosted on Railway
- **Database:** MongoDB Atlas (free tier with GitHub Student Pack)
- **Authentication:** Firebase Authentication (client-side)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free with [GitHub Student Developer Pack](https://education.github.com/pack))
- Railway account (for backend deployment)
- Firebase account (free) for authentication
- Discord webhook URL (optional, for support notifications)

## 🎓 Setting Up MongoDB Atlas (GitHub Student Pack)

1. **Get the GitHub Student Developer Pack:**
   - Visit [education.github.com/pack](https://education.github.com/pack)
   - Apply with your student email
   - Get approved (usually within 24-48 hours)

2. **Activate MongoDB Atlas Credits:**
   - From your Student Pack dashboard, find MongoDB
   - Click "Get access" to receive $200 in credits
   - Sign up for MongoDB Atlas or connect your existing account

3. **Create a Database Cluster:**
   - Log into [MongoDB Atlas](https://cloud.mongodb.com)
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "tutorslink")
   - Click "Create"

4. **Configure Database Access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

5. **Configure Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Railway to connect (Railway uses dynamic IPs)
   - Click "Confirm"

6. **Get Your Connection String:**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add a database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/tutorslink?retryWrites=true&w=majority`

## 🔥 Setting Up Firebase Authentication

Firebase Authentication handles user sign-up and login for the website. Follow these steps to configure it:

### Quick Setup

1. **Create a Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "Tutors Link")
   - Follow the wizard to create your project

2. **Enable Email/Password authentication:**
   - In Firebase Console, go to "Authentication" > "Sign-in method"
   - Enable "Email/Password"
   - Save changes

3. **Add authorized domains:**
   - In "Authentication" > "Settings" > "Authorized domains"
   - Add your domains:
     - `tutorslink.github.io` (or your GitHub Pages domain)
     - `localhost` (for local testing)
   - This prevents CORS errors

4. **Register your web app:**
   - Go to Project Settings (gear icon)
   - Under "Your apps", click Web icon (`</>`)
   - Register app with a nickname
   - Copy the Firebase configuration

5. **Update firebase-config.js:**
   - Open `firebase-config.js` in the repository
   - Replace placeholder values with your Firebase config:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSyC...",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789012",
       appId: "1:123456789012:web:abc..."
     };
     ```
   - Commit and push the changes

**Note:** Firebase credentials are safe to commit - they're public identifiers, not secrets. Security comes from Firebase rules and authorized domains.

**For detailed instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)**

## 🛠️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tutorslink/website.git
   cd website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tutorslink?retryWrites=true&w=majority
   PORT=3000
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

6. **Open your browser:**
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:3000 (serves index.html)
   - Test the API: http://localhost:3000/api/health

## 🚢 Deploying to Railway (Backend)

1. **Create a Railway account:**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create a new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your `tutorslink/website` repository
   - Railway will automatically detect Node.js

3. **Configure environment variables:**
   - Go to your project's "Variables" tab
   - Add the following variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `DISCORD_WEBHOOK_URL`: Your Discord webhook URL (optional)
   - Railway automatically provides `PORT` - don't set it manually
   - **Note:** Do NOT add Firebase variables here - Firebase is client-side only

4. **Deploy:**
   - Railway automatically deploys on push to main branch
   - Wait for the build to complete
   - Get your deployment URL from the Railway dashboard
   - It will look like: `https://your-app.railway.app`

5. **Update frontend configuration:**
   - Open `index.html` and `apply-as-tutor.html`
   - Find the line: `const API_BASE_URL = ...` in both files
   - Update the production URL to your Railway URL:
     ```javascript
     const API_BASE_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000' 
       : 'https://your-app.railway.app';
     ```

## 📄 Deploying Frontend to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "main" branch
   - Select "/" (root) folder
   - Click "Save"

2. **Access your website:**
   - Your site will be available at: `https://tutorslink.github.io/website/`
   - May take a few minutes for the first deployment

## 🔌 API Endpoints

### Tutors
- `GET /api/tutors` - Get all tutors
- `POST /api/tutors` - Add a new tutor (Staff Portal)

### Bookings
- `POST /api/bookings` - Create a booking request

### Support
- `POST /api/support` - Submit a support message

### Health Check
- `GET /api/health` - Check if the server is running

## 📝 API Usage Examples

### Get All Tutors
```bash
curl https://your-app.railway.app/api/tutors
```

### Add a New Tutor
```bash
curl -X POST https://your-app.railway.app/api/tutors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "subjects": "Math, Physics",
    "price": "$20/hour",
    "timezone": "GMT+5",
    "languages": "English, Spanish",
    "category": "IGCSE"
  }'
```

### Create a Booking
```bash
curl -X POST https://your-app.railway.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Jane Smith",
    "studentEmail": "jane@example.com",
    "tutorId": "65abc123def456789",
    "message": "I need help with calculus"
  }'
```

### Submit Support Message
```bash
curl -X POST https://your-app.railway.app/api/support \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Student Name",
    "email": "student@example.com",
    "message": "I have a question about payment"
  }'
```

## 🔧 Environment Variables

### Backend Environment Variables (Railway)

These are configured in Railway dashboard under "Variables" tab:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `PORT` | Server port (auto-provided by Railway) | No (Railway sets this) |
| `DISCORD_WEBHOOK_URL` | Discord webhook for support notifications | No |

### Frontend Configuration (Firebase)

Firebase configuration is **NOT** set in Railway environment variables. Instead:

- Edit `firebase-config.js` directly with your Firebase credentials
- These values are safe to commit to GitHub (they're public identifiers)
- See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for instructions

**Why not use environment variables?** The frontend is static HTML/CSS/JS hosted on GitHub Pages, which doesn't have access to server-side environment variables. Firebase config must be in the client-side JavaScript code.

## 📦 Dependencies

- **express** - Web framework for Node.js
- **mongoose** - MongoDB object modeling
- **cors** - Enable Cross-Origin Resource Sharing
- **dotenv** - Load environment variables from .env file

## 🎨 Frontend Features

- **Modern UI:** Gradient colors, hover effects, smooth transitions
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Real-time Updates:** Fetches tutors from database on page load
- **Booking Modal:** Simple popup form for booking demo classes
- **Loading States:** Visual feedback during API calls
- **Error Handling:** User-friendly error messages

## 🔒 Security Features

- CORS configured for secure cross-origin requests
- Environment variables for sensitive data
- MongoDB connection with authentication
- Input validation on backend
- Secure Discord webhook integration

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for Railway)
- Check that your connection string is correct
- Verify database user has proper permissions

### Railway Deployment Issues
- Check the build logs in Railway dashboard
- Ensure all environment variables are set
- Verify `package.json` has correct start script

### CORS Issues
- Ensure backend URL is correctly configured in `index.html`
- Check that Railway deployment is using CORS middleware
- Verify frontend domain is allowed in CORS configuration

### Frontend Not Loading Tutors
- Check browser console for errors
- Verify backend API is accessible
- Ensure API_BASE_URL is correctly configured

## 📞 Support

For issues or questions:
- Join our [Discord server](https://discord.gg/pe8TXPgkAe)
- Follow us on [Instagram](https://instagram.com/tutors.link)
- Check us on [TikTok](https://tiktok.com/@tutors_link)

## 📄 License

ISC License - Copyright © 2026 Tutors Link

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Made with ❤️ by the Tutors Link Team**
