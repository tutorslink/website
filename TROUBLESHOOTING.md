# Troubleshooting Guide

This guide helps you diagnose and fix common issues with the Tutors Link website.

## Firebase Authentication Issues

### Issue: "Firebase: Error (auth/configuration-not-found)"

**Symptoms:**
- Authentication doesn't work
- Browser console shows "configuration-not-found" error
- Login/Sign Up buttons don't respond

**Cause:** Firebase configuration in `firebase-config.js` still has placeholder values.

**Solution:**
1. Check `firebase-config.js` - if you see values like `YOUR_API_KEY`, you need to configure Firebase
2. Follow the [Firebase Setup Guide](FIREBASE_SETUP.md) to:
   - Create a Firebase project
   - Enable Email/Password authentication
   - Get your Firebase configuration
   - Update `firebase-config.js` with real values
3. Commit and push changes
4. Wait for GitHub Pages to deploy (1-2 minutes)
5. Clear browser cache and try again

### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Symptoms:**
- Authentication works locally but fails in production
- Error message mentions "unauthorized domain"

**Cause:** Your production domain is not authorized in Firebase Console.

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Authentication > Settings > Authorized domains
4. Click "Add domain"
5. Add your production domain (e.g., `tutorslink.github.io`)
6. If testing on Railway, also add your Railway domain
7. Click "Save"
8. Wait 1-2 minutes for changes to propagate
9. Try authentication again

**Important domains to add:**
- `tutorslink.github.io` (GitHub Pages)
- `localhost` (for local testing)
- Your Railway domain if applicable

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Symptoms:**
- Authentication fails immediately
- Console shows "invalid-api-key" error

**Cause:** The API key in `firebase-config.js` is incorrect or the Firebase project has been deleted.

**Solution:**
1. Go to Firebase Console > Project Settings
2. Scroll down to "Your apps" section
3. Find your web app
4. Copy the correct `apiKey` value
5. Update `firebase-config.js`
6. Commit and deploy

### Issue: Module/Import Errors

**Symptoms:**
- Browser console shows "Module not found" or similar errors
- Firebase functions don't load
- Blank page or JavaScript errors

**Cause:** Page is opened with `file://` protocol, which doesn't support ES6 modules.

**Solution:**

Use a local HTTP server instead of opening files directly:

**Option 1: Python**
```bash
cd /path/to/website
python3 -m http.server 8080
```
Then open `http://localhost:8080`

**Option 2: Node.js**
```bash
npx serve
```
Then open the URL it provides

**Option 3: VS Code**
- Install "Live Server" extension
- Right-click `index.html` > "Open with Live Server"

### Issue: Authentication Works but Users Can't Login After Signing Up

**Symptoms:**
- Sign up succeeds
- Login with same credentials fails
- Error: "No account found with this email"

**Cause:** Possible issues with Firebase user management.

**Solution:**
1. Go to Firebase Console > Authentication > Users
2. Check if the user appears in the list
3. Verify the user is not disabled
4. Check the email address is correct
5. Try creating a new test account with a different email
6. Check browser console for specific error codes

## MongoDB Connection Issues

### Issue: No Tutors Displayed on Website

**Symptoms:**
- Website loads but no tutors appear
- "Loading tutors..." message persists
- Browser console shows network errors

**Cause:** Backend API is not accessible or MongoDB connection failed.

**Solution:**

1. **Check backend API:**
   ```bash
   curl https://your-railway-url.up.railway.app/api/health
   ```
   Should return server status

2. **Check MongoDB connection:**
   - Go to Railway dashboard
   - Check application logs
   - Look for MongoDB connection errors

3. **Verify environment variables:**
   - Go to Railway > Variables
   - Ensure `MONGODB_URI` is set correctly
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/tutorslink`

4. **Check MongoDB Atlas:**
   - Ensure cluster is running (not paused)
   - Verify network access allows 0.0.0.0/0 (for Railway)
   - Check database user has correct permissions

### Issue: "MongoNetworkError" or Connection Timeout

**Symptoms:**
- Backend starts but can't connect to MongoDB
- Logs show network timeout errors

**Cause:** MongoDB Atlas network access restrictions or incorrect connection string.

**Solution:**
1. Go to MongoDB Atlas
2. Navigate to "Network Access"
3. Ensure "0.0.0.0/0" is in the IP Access List (required for Railway)
4. If not, click "Add IP Address" > "Allow Access from Anywhere"
5. Wait a few minutes for changes to propagate
6. Restart your Railway deployment

## CORS Issues

### Issue: "CORS policy blocked" Errors

**Symptoms:**
- Browser console shows CORS errors
- API requests fail with CORS policy messages
- Network tab shows preflight OPTIONS requests failing

**Cause:** Frontend domain is not allowed by backend CORS configuration.

**Solution:**

1. **Verify frontend URL configuration:**
   Check `index.html` and `apply-as-tutor.html` have correct `API_BASE_URL`:
   ```javascript
   const API_BASE_URL = window.location.hostname === 'localhost' 
     ? 'http://localhost:3000' 
     : 'https://your-railway-url.up.railway.app';
   ```

2. **Check backend CORS configuration:**
   The `server.js` should have CORS enabled for your domains
   
3. **For local testing:**
   - Ensure you're using `localhost` (not `127.0.0.1`)
   - Check both frontend and backend are running
   - Backend should be on port 3000

## Deployment Issues

### Issue: GitHub Pages Shows 404 Error

**Symptoms:**
- GitHub Pages URL shows "404 Not Found"
- Files are committed but not visible

**Cause:** GitHub Pages not properly configured or needs time to deploy.

**Solution:**
1. Go to repository Settings > Pages
2. Ensure "main" branch is selected as source
3. Ensure "/" (root) folder is selected
4. Wait 2-3 minutes for deployment
5. Check "Actions" tab to see if deployment is in progress
6. Clear browser cache and try again

### Issue: Railway Deployment Fails

**Symptoms:**
- Railway shows "Build failed" or "Crashed"
- Application doesn't start

**Cause:** Missing dependencies, environment variables, or build errors.

**Solution:**

1. **Check Railway logs:**
   - Go to Railway dashboard
   - Click on "Deployments"
   - View latest deployment logs

2. **Common fixes:**
   - Ensure `package.json` has correct `start` script
   - Verify all environment variables are set
   - Check Node.js version compatibility
   - Ensure `package-lock.json` is committed

3. **Rebuild:**
   - In Railway, trigger a manual redeploy
   - Or push a small change to trigger auto-deploy

## Local Development Issues

### Issue: "Cannot find module" Errors

**Symptoms:**
- `npm start` fails
- Error about missing modules

**Cause:** Dependencies not installed.

**Solution:**
```bash
npm install
```

### Issue: Port Already in Use

**Symptoms:**
- Error: "Port 3000 is already in use"
- Server won't start

**Solution:**

**Option 1: Kill the process**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Or on Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Option 2: Use a different port**
```bash
PORT=3001 npm start
```

## General Debugging Tips

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to "Console" tab
3. Look for red error messages
4. Red errors indicate JavaScript issues
5. Yellow warnings can usually be ignored

### Check Network Tab

1. Open Developer Tools (F12)
2. Go to "Network" tab
3. Reload the page
4. Look for failed requests (red status)
5. Click on failed requests to see details
6. Check if it's a 404, 500, or CORS error

### Clear Cache

Sometimes old cached files cause issues:

1. **Hard reload:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear cache:**
   - Chrome: Settings > Privacy > Clear browsing data
   - Firefox: Settings > Privacy > Clear Data
   - Safari: Develop > Empty Caches

### Check Railway Logs

For backend issues:
1. Go to Railway dashboard
2. Click on your project
3. Click "View Logs"
4. Look for error messages
5. Check startup logs for configuration issues

### Verify Configuration Files

Make sure these files are properly configured:

- ✅ `firebase-config.js` - Real Firebase values, not placeholders
- ✅ `.env` (local) - MongoDB URI and other secrets
- ✅ Railway Variables - MongoDB URI set correctly
- ✅ `index.html` and `apply-as-tutor.html` - Correct API_BASE_URL
- ✅ Firebase Console - Authorized domains configured

## Still Having Issues?

If you've tried all the above and still have problems:

1. **Check the logs:**
   - Browser console (F12)
   - Railway application logs
   - MongoDB Atlas logs

2. **Verify your setup:**
   - Review [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Review [README.md](README.md)
   - Double-check all configuration values

3. **Get help:**
   - Join the [Discord server](https://discord.gg/pe8TXPgkAe)
   - Create a GitHub issue with:
     - What you're trying to do
     - What's happening instead
     - Error messages (from console)
     - Steps you've already tried

## Quick Checklist

Before asking for help, verify:

- [ ] Firebase is configured with real values (not placeholders)
- [ ] Firebase authorized domains include your production domain
- [ ] MongoDB URI is set in Railway environment variables
- [ ] Website is served via HTTP/HTTPS (not file://)
- [ ] Browser console has no red errors
- [ ] Railway deployment is active and not crashed
- [ ] GitHub Pages is enabled and deployed
- [ ] You've cleared your browser cache
- [ ] You've waited a few minutes after making changes
