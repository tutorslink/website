# Deployment Checklist

## Before You Deploy

- [ ] Read the complete README.md file
- [ ] Understand the architecture (Frontend on GitHub Pages, Backend on Railway, Database on MongoDB Atlas)

## Step 1: MongoDB Atlas Setup (15-20 minutes)

- [ ] Sign up for GitHub Student Developer Pack at education.github.com/pack
- [ ] Activate MongoDB Atlas $200 credit from Student Pack
- [ ] Create a MongoDB Atlas account
- [ ] Create a new cluster (choose Free Shared tier)
- [ ] Create a database user with username and password
- [ ] Add Network Access: Allow from anywhere (0.0.0.0/0)
- [ ] Get your connection string from "Connect" button
- [ ] Save the connection string (you'll need it for Railway)

## Step 2: Railway Deployment (10 minutes)

- [ ] Sign up for Railway account at railway.app
- [ ] Create a new project from GitHub repository
- [ ] Select tutorslink/website repository
- [ ] Go to Variables tab and add:
  - `MONGODB_URI`: Your MongoDB connection string from Step 1
  - `DISCORD_WEBHOOK_URL`: (Optional) Your Discord webhook URL
  - NOTE: Do NOT set PORT - Railway provides it automatically
- [ ] Wait for automatic deployment to complete
- [ ] Copy your Railway deployment URL (looks like: https://yourapp.railway.app)
- [ ] Test your API at: https://yourapp.railway.app/api/health

## Step 3: Update Frontend Configuration (5 minutes)

- [ ] Open index.html in your repository
- [ ] Find line with: `const API_BASE_URL = ...`
- [ ] Replace `https://your-backend-url.railway.app` with your actual Railway URL
- [ ] Commit and push the change:
  ```bash
  git add index.html
  git commit -m "Update backend URL for production"
  git push origin main
  ```

## Step 4: GitHub Pages Deployment (5 minutes)

- [ ] Go to your GitHub repository settings
- [ ] Click on "Pages" in the left sidebar
- [ ] Under "Source", select "main" branch
- [ ] Select "/" (root) folder
- [ ] Click "Save"
- [ ] Wait 2-3 minutes for deployment
- [ ] Visit your site at: https://tutorslink.github.io/website/

## Step 5: Testing (10 minutes)

- [ ] Visit your GitHub Pages URL
- [ ] Test the "Add Tutor" form in Staff Portal section
- [ ] Verify tutors appear on the page
- [ ] Click "Book a Demo" on a tutor card
- [ ] Fill out the booking form and submit
- [ ] Test the Support form at the bottom
- [ ] Check your Discord for support message (if webhook configured)

## Step 6: Optional - Discord Webhook (5 minutes)

If you want support messages to appear in Discord:

- [ ] Go to your Discord server settings
- [ ] Navigate to Integrations > Webhooks
- [ ] Create a new webhook
- [ ] Copy the webhook URL
- [ ] Add it to Railway environment variables as `DISCORD_WEBHOOK_URL`
- [ ] Test by submitting a support message

## Troubleshooting

### MongoDB Connection Fails
- Check if IP whitelist includes 0.0.0.0/0
- Verify connection string is correct
- Ensure password doesn't contain special characters (or is URL-encoded)

### Railway Deployment Fails
- Check build logs in Railway dashboard
- Verify all environment variables are set
- Ensure package.json has correct start script

### Frontend Can't Connect to Backend
- Verify Railway URL in index.html is correct
- Check browser console for CORS errors
- Ensure Railway deployment is running

### Tutors Not Appearing
- Check browser console for errors
- Verify backend API is responding at /api/tutors
- Test the API directly: https://yourapp.railway.app/api/tutors

## Estimated Total Time: 45-60 minutes

## Need Help?

- Join Discord: https://discord.gg/pe8TXPgkAe
- Instagram: @tutors.link
- TikTok: @tutors_link
- GitHub Issues: https://github.com/tutorslink/website/issues

## Success Checklist

You've successfully completed the deployment when:
- ✅ Your website is live on GitHub Pages
- ✅ You can add tutors via the Staff Portal
- ✅ Tutors appear on the page
- ✅ Book a Demo button opens a modal
- ✅ Support form submits successfully
- ✅ No console errors in browser
