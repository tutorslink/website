# Quick Start Guide

Get the Tutors Link platform running in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- MongoDB Atlas account (free)
- Firebase account (free)

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Create `.env` file:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tutorslink?retryWrites=true&w=majority
PORT=3000
```

Replace with your actual MongoDB connection string from Atlas.

## 3. Configure Firebase

Edit `firebase-config.js` with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... rest of config
};
```

Get these from Firebase Console → Project Settings → Your Apps → Web App

## 4. Start Server

```bash
npm start
```

Server runs on http://localhost:3000

## 5. Test the Platform

### Create Admin Account
1. Open http://localhost:3000
2. Click "Sign Up"
3. Use email: `tutorslink001@gmail.com`
4. Any password (min 6 chars)
5. You now have admin access!

### Access Dashboard
1. After signup, you're redirected to dashboard
2. Or click "Dashboard" in the top nav
3. See your role badge (ADMIN)

### Test Features

**As Admin:**
- Dashboard shows platform stats
- Access admin management features
- Can manage users, reviews, settings

**Create Test Student:**
1. Logout (click Logout button)
2. Sign up with different email
3. Dashboard shows as GUEST
4. Login as admin to change role to STUDENT

**Create Test Tutor:**
1. Apply as tutor via "Apply as Tutor" page
2. Login as admin
3. Approve application and set role to TUTOR

## Common Issues

### "MONGODB_URI not set"
- Check `.env` file exists in root directory
- Verify environment variable syntax
- Restart server after changes

### "Firebase auth error"
- Verify `firebase-config.js` has correct credentials
- Check Firebase Console → Authentication is enabled
- Add `localhost` to authorized domains

### "Can't connect to database"
- Verify MongoDB Atlas connection string
- Check IP whitelist includes `0.0.0.0/0`
- Verify database user has correct permissions

## Next Steps

1. **Read Full Docs**: See `SETUP_GUIDE.md` for complete setup
2. **API Reference**: Check `API_DOCUMENTATION.md` for endpoints
3. **Features**: Review `FEATURES.md` for capabilities
4. **Deploy**: Follow deployment guide in `SETUP_GUIDE.md`

## Quick Links

- **Main Site**: http://localhost:3000/
- **Dashboard**: http://localhost:3000/dashboard.html
- **Apply as Tutor**: http://localhost:3000/apply-as-tutor.html
- **API Health**: http://localhost:3000/api/health
- **API Docs**: See `API_DOCUMENTATION.md`

## Project Structure

```
tutorslink/website/
├── server.js              # Main backend server
├── api-client.js          # Frontend API wrapper
├── dashboard.html         # User dashboard
├── index.html             # Landing page
├── apply-as-tutor.html   # Tutor application
├── auth.js                # Firebase auth functions
├── main.js                # Frontend main logic
├── firebase-config.js     # Firebase configuration
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
└── docs/
    ├── SETUP_GUIDE.md           # Complete setup guide
    ├── API_DOCUMENTATION.md     # API reference
    ├── FEATURES.md              # Feature overview
    └── QUICKSTART.md            # This file
```

## Key Features to Test

1. **Sign Up/Login** - Test authentication
2. **Dashboard** - See role-based views
3. **Apply as Tutor** - Submit application
4. **Book Demo** - Create booking (as guest)
5. **Admin Panel** - Manage users (as admin)
6. **Sessions** - Schedule and mark attendance (as tutor/student)
7. **Reviews** - Submit and view reviews

## Support

- **Documentation**: See `/docs` folder
- **Issues**: Open issue on GitHub
- **Email**: tutorslink001@gmail.com
- **Discord**: https://discord.gg/pe8TXPgkAe

---

**Ready to deploy?** See `SETUP_GUIDE.md` for production deployment instructions!
