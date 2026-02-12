# Tutors Link - Backend API

Connect with tutors worldwide. Free for students, prices set by tutors. All payments secure through Tutors Link.

> **Note:** The frontend has been removed for a fresh restart. This repository currently contains only the backend API.

## 🚀 API Capabilities

The backend provides the following functionality through REST API endpoints:

- **Tutor Management:**
  - Browse available tutors by category
  - Add new tutors (for staff)
  - Retrieve tutor details

- **Booking System:**
  - Create booking requests
  - Store booking information in database

- **Support System:**
  - Submit support messages
  - Discord webhook notifications for support requests

- **Health Monitoring:**
  - Check server status
  - Monitor MongoDB connection

## 🏗️ Architecture

- **Frontend:** Removed - ready for fresh implementation
- **Backend:** Node.js/Express API hosted on Railway
- **Database:** MongoDB Atlas (free tier with GitHub Student Pack)
- **Authentication:** Ready to integrate with new frontend

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (free with [GitHub Student Developer Pack](https://education.github.com/pack))
- Railway account (for backend deployment)
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

## 🔥 Frontend Setup

**The frontend has been removed for a fresh restart.** When you're ready to build a new frontend:

1. Choose your preferred framework (React, Vue, Next.js, etc.)
2. Connect to the existing backend API at the endpoints listed below
3. Implement authentication as needed for your chosen stack
4. Deploy to your preferred hosting platform (GitHub Pages, Vercel, Netlify, etc.)

The backend API is fully functional and ready to support your new frontend.

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
   - Test the API: http://localhost:3000/api/health
   - API endpoints are ready for frontend integration

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
   - Open `index.html`
   - Find the line: `const API_BASE_URL = ...`
   - Update the production URL to your Railway URL:
     ```javascript
     const API_BASE_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000' 
       : 'https://your-app.railway.app';
     ```

## 📄 Frontend Deployment

The frontend has been removed. When you build your new frontend:

1. Choose your preferred hosting platform:
   - **GitHub Pages**: Great for static sites
   - **Vercel**: Excellent for Next.js, React, Vue
   - **Netlify**: Works with any static site generator
   - **Railway**: Can host frontend alongside or separately from backend

2. Configure your frontend to connect to the Railway backend API
3. Handle CORS by ensuring your frontend domain is allowed (CORS is currently configured for all origins)
4. Deploy and test the integration

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

**Note:** When you build your new frontend with authentication, configure it according to your chosen authentication provider's requirements.

## 📦 Dependencies

- **express** - Web framework for Node.js
- **mongoose** - MongoDB object modeling
- **cors** - Enable Cross-Origin Resource Sharing
- **dotenv** - Load environment variables from .env file

## 🎨 Backend API Features

- **RESTful API:** Clean, well-documented endpoints
- **MongoDB Integration:** Efficient data storage and retrieval
- **CORS Enabled:** Ready for cross-origin frontend requests
- **Health Checks:** Monitor server and database status
- **Discord Integration:** Support notifications via webhook
- **Error Handling:** Comprehensive error responses

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
