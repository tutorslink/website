---
LAST UPDATED: Saturday 9th February 2026 09:34 PM

📋 WHAT YOU NEED TO DO:
1. Read through this entire guide to understand what you're building
2. Follow each numbered step carefully - don't skip ahead
3. Keep a notepad handy to save important information (passwords, URLs, API keys)
4. Expect the full setup to take 2-4 hours if you're new to web development

⏱️ ESTIMATED TIME: 2-4 hours for complete setup
---

# Complete Beginner's Guide to Setting Up Tutors Link

Welcome! This guide will take you from zero to having a fully working tutoring platform. **You don't need any coding experience** - we'll explain everything step by step.

## What is Tutors Link?

Tutors Link is a website where:
- **Students** can find and book tutors
- **Tutors** can offer their services and set their own prices
- **You (the admin)** can manage everything through a staff portal

Think of it like building your own Airbnb, but for tutoring instead of homes!

---

## PART 0: What You'll Need (No Installation Yet!)

Before we start downloading things, let's understand what each tool does. This is like gathering ingredients before cooking.

### 🧰 Tools Overview

**1. Node.js** (Think: The Engine)
- **What it does:** Runs the "behind-the-scenes" code (the backend) that handles data
- **Why you need it:** Your website needs to store tutors, bookings, and process requests
- **Cost:** Free
- **Version needed:** 18 or newer

**2. Git** (Think: Time Machine + Copy Machine)
- **What it does:** Downloads code from the internet and keeps track of changes
- **Why you need it:** To get the Tutors Link code onto your computer
- **Cost:** Free

**3. PostgreSQL** (Think: Super-Organized Filing Cabinet)
- **What it does:** Stores all your data (tutors, students, bookings) in organized tables
- **Why you need it:** Although this project currently uses MongoDB, we're documenting PostgreSQL as an alternative for future flexibility
- **Cost:** Free
- **Note:** For this guide, we'll actually use MongoDB Atlas (cloud database) which is also free

**4. MongoDB Atlas** (Think: Cloud Filing Cabinet)
- **What it does:** An online database that stores your data without needing to install anything
- **Why you need it:** Easier than running your own database, and it's free
- **Cost:** Free tier available (more than enough for starting)

**5. Visual Studio Code (VS Code)** (Think: Smart Notepad)
- **What it does:** A text editor designed for code, with helpful features
- **Why you need it:** Makes editing code files much easier than regular Notepad
- **Cost:** Free
- **Optional but highly recommended**

**6. Railway Account** (Think: Website Hosting Service)
- **What it does:** Puts your website online so others can use it (not just you)
- **Why you need it:** Your website needs to live somewhere on the internet
- **Cost:** Free tier available (upgradable later)

**7. Firebase Account** (Think: User Login System)
- **What it does:** Handles user accounts (sign up, log in, passwords)
- **Why you need it:** So students and tutors can create accounts securely
- **Cost:** Free

**8. Discord Account** (Think: Notification System - Optional)
- **What it does:** Sends you messages when students book tutors or need support
- **Why you need it:** Get instant notifications
- **Cost:** Free
- **Optional:** You can skip this if you don't want Discord notifications

### 💻 System Requirements

**Windows Users:**
- Windows 10 or newer
- At least 4GB of RAM
- At least 2GB of free disk space
- Internet connection

**Mac Users:**
- macOS 10.13 or newer
- At least 4GB of RAM
- At least 2GB of free disk space
- Internet connection

**Linux Users:**
- Any modern distribution (Ubuntu 20.04+, Fedora, etc.)
- At least 4GB of RAM
- At least 2GB of free disk space
- Internet connection

---

## PART 1: Installation (Step-by-Step)

Now let's actually download and install everything. Go slowly and verify each step!

### 1.1 Install Node.js

**What you're doing:** Installing the engine that runs JavaScript code on your computer.

**Steps:**

1. **Go to the Node.js website:**
   - Open your web browser
   - Visit: https://nodejs.org/

2. **Download Node.js:**
   - You'll see two big green buttons
   - Click the one that says "LTS" (Long Term Support)
   - This downloads a version that's stable and well-tested
   - The file will be around 50-70 MB

3. **Install Node.js:**
   - **Windows:** Double-click the downloaded `.msi` file
     - Click "Next" through the installer
     - Accept the license agreement
     - Keep all default settings (don't change the installation path)
     - Click "Install" and wait (takes 2-3 minutes)
     - Click "Finish"
   
   - **Mac:** Double-click the downloaded `.pkg` file
     - Click "Continue" through the installer
     - Accept the license
     - Click "Install" and enter your Mac password if asked
     - Wait for installation to complete (2-3 minutes)
     - Click "Close"
   
   - **Linux (Ubuntu/Debian):** Open Terminal and run:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

4. **Verify Installation:**
   - Open a command window:
     - **Windows:** Press Windows key, type "cmd", press Enter
     - **Mac:** Press Cmd+Space, type "terminal", press Enter
     - **Linux:** Press Ctrl+Alt+T
   
   - Type this command and press Enter:
     ```bash
     node --version
     ```
   
   - You should see something like `v18.17.0` (version number)
   
   - Also check npm (comes with Node.js):
     ```bash
     npm --version
     ```
   
   - You should see something like `9.6.7`

**✅ Success looks like:** You see version numbers when you run the commands above.

**❌ If it doesn't work:**
- Windows: Try restarting your computer and running the commands again
- Make sure you opened a NEW command window after installation
- The PATH might not be set - try reinstalling Node.js

### 1.2 Install Git

**What you're doing:** Installing the tool that downloads and manages code.

**Steps:**

1. **Go to the Git website:**
   - Visit: https://git-scm.com/

2. **Download Git:**
   - Click the big "Download" button
   - It should automatically detect your operating system
   - The file will be around 50 MB

3. **Install Git:**
   - **Windows:** 
     - Double-click the downloaded `.exe` file
     - Click "Next" through most screens
     - **Important:** When you see "Choosing the default editor", select "Use Visual Studio Code" if you have it, or keep "Use Vim" (we'll rarely use this)
     - Keep all other default settings
     - Click "Install" and wait (2-3 minutes)
     - Click "Finish"
   
   - **Mac:**
     - Double-click the downloaded `.pkg` file
     - Click "Continue" and "Install"
     - Enter your Mac password if asked
     - Click "Close" when done
   
   - **Linux (Ubuntu/Debian):**
     ```bash
     sudo apt-get update
     sudo apt-get install git
     ```

4. **Verify Installation:**
   - Open a command window (same as before)
   - Type:
     ```bash
     git --version
     ```
   
   - You should see something like `git version 2.40.0`

**✅ Success looks like:** You see a git version number.

### 1.3 Install Visual Studio Code (Optional but Recommended)

**What you're doing:** Installing a smart text editor for code.

**Steps:**

1. **Go to VS Code website:**
   - Visit: https://code.visualstudio.com/

2. **Download:**
   - Click the big "Download" button
   - Select your operating system if needed

3. **Install:**
   - **Windows:** Run the `.exe` file, click through the installer
   - **Mac:** Open the `.dmg` file, drag VS Code to Applications folder
   - **Linux:** Follow the instructions for your distribution

4. **Verify:**
   - Open VS Code
   - You should see a welcome screen

**✅ Success looks like:** VS Code opens with a welcome screen.

### 1.4 Set Up MongoDB Atlas (Cloud Database)

**What you're doing:** Creating a free online database to store your tutors and bookings.

**Steps:**

1. **Create a MongoDB Atlas account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Click "Sign up"
   - Enter your email, create a password
   - Or sign up with Google (easier)

2. **Choose the free tier:**
   - After signing in, click "Build a Database"
   - Select "M0" (Free tier) - it says "FREE" in green
   - Choose a cloud provider (AWS is fine)
   - Choose a region close to you (for better speed)
   - Scroll down and click "Create"

3. **Create a database user:**
   - You'll see "Security Quickstart"
   - Under "How would you like to authenticate", keep "Username and Password"
   - Create a username (e.g., "tutorslink")
   - Click "Autogenerate Secure Password" and **COPY IT IMMEDIATELY**
   - Paste it in a safe place (notepad, password manager)
   - Click "Create User"

4. **Set up network access:**
   - You'll see "Where would you like to connect from?"
   - Click "Add My Current IP Address" first
   - Then click "Add a Different IP Address"
   - Enter `0.0.0.0/0` (this allows access from anywhere, needed for Railway)
   - Add description: "Allow from anywhere"
   - Click "Add Entry"
   - Click "Finish and Close"

5. **Get your connection string:**
   - Click "Connect" on your cluster (the main screen)
   - Select "Drivers"
   - Keep "Node.js" selected
   - Copy the connection string (looks like: `mongodb+srv://tutorslink:<password>@cluster0.xxxxx.mongodb.net/`)
   - **IMPORTANT:** Replace `<password>` with the password you copied earlier
   - Add the database name at the end: `mongodb+srv://tutorslink:YOURPASSWORD@cluster0.xxxxx.mongodb.net/tutorslink?retryWrites=true&w=majority`
   - **Save this complete string** - you'll need it soon!

**✅ Success looks like:** You have a complete connection string saved somewhere safe.

---

## PART 2: Getting the Code

Now let's download the Tutors Link code to your computer.

### 2.1 Clone the Repository

**What you're doing:** Downloading all the website files to your computer.

1. **Choose where to save the project:**
   - I recommend creating a folder like `C:\Projects` (Windows) or `~/Projects` (Mac/Linux)
   - Open your command window
   - Navigate to your chosen folder:
     ```bash
     cd C:\Projects
     ```
     or on Mac/Linux:
     ```bash
     cd ~/Projects
     ```
     (If the folder doesn't exist, create it first with `mkdir Projects`)

2. **Clone the repository:**
   - Type this command and press Enter:
     ```bash
     git clone https://github.com/tutorslink/website.git
     ```
   
   - Git will download all the files (takes 30-60 seconds)
   - You'll see messages like "Receiving objects: 100%"

3. **Navigate into the project:**
   ```bash
   cd website
   ```

4. **See what's inside:**
   ```bash
   dir
   ```
   (Windows) or `ls` (Mac/Linux)
   
   You should see files like:
   - `index.html` - The main homepage
   - `server.js` - The backend code
   - `package.json` - List of dependencies
   - `README.md` - Documentation
   - And more!

### 2.2 Understanding the File Structure

Here's what the important files do:

```
website/
├── index.html              ← Main homepage (what students see)
├── apply-as-tutor.html     ← Form for tutors to apply
├── server.js               ← Backend code (handles data)
├── auth.js                 ← Handles user login/signup
├── firebase-config.js      ← Firebase settings
├── package.json            ← List of tools needed
├── .env.example            ← Template for secret settings
└── README.md               ← Documentation
```

**Don't be overwhelmed!** You won't need to edit most of these files.

---

## PART 3: Environment Configuration

### 3.1 What is a .env File?

Think of a `.env` file as a **secret notebook** where you store sensitive information like:
- Database passwords
- API keys
- Secret tokens

**Why keep it secret?** So hackers can't steal your passwords if they see your code online.

### 3.2 Create Your .env File

1. **Open your project in VS Code:**
   - Open VS Code
   - Click File → Open Folder
   - Select the `website` folder you just downloaded
   - Click "Select Folder"

2. **Copy the template:**
   - In VS Code's file explorer (left side), you'll see `.env.example`
   - Right-click it → "Copy"
   - Right-click in the empty space → "Paste"
   - Rename the copy to `.env` (just `.env`, no `.example`)

3. **Open the .env file:**
   - Click on `.env` to open it
   - You'll see a template with placeholders

### 3.3 Fill in Your .env File

Now we'll fill in each value. Open your `.env` file and update these values:

```env
# MongoDB Connection (YOU MUST CHANGE THIS)
MONGODB_URI=mongodb+srv://tutorslink:YOURPASSWORD@cluster0.xxxxx.mongodb.net/tutorslink?retryWrites=true&w=majority

# Server Port (Keep as-is for local development)
PORT=3000

# Discord Webhook (Optional - we'll set this up later)
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here

# Email Settings (Optional - we'll set this up later)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
STAFF_EMAIL=staff@tutorslink.com

# Security Keys (Generate random strings)
ENCRYPTION_KEY=your_32_character_random_string
ENCRYPTION_SALT=another_random_string_here
```

**For now, only update the `MONGODB_URI`** with the connection string you saved earlier. We'll fill in the rest as we go!

**Save the file** (Ctrl+S or Cmd+S)

---

## PART 4: Setting Up External Services

These are online services that add features to your website.

### 4a: Discord Bot Setup (Optional)

**What it does:** Sends you instant messages when students contact support or book tutors.

**Skip this if:** You don't use Discord or don't want notifications.

**Steps:**

1. **Create a Discord Server (if you don't have one):**
   - Open Discord (or download it from https://discord.com)
   - Click the "+" button on the left sidebar
   - Click "Create My Own"
   - Choose "For me and my friends"
   - Name it "Tutors Link Support"
   - Click "Create"

2. **Create a Webhook:**
   - In your Discord server, click the server name → "Server Settings"
   - Click "Integrations" in the left menu
   - Click "Create Webhook"
   - Name it "Tutors Link Bot"
   - Select the channel where you want notifications (e.g., #general)
   - Click "Copy Webhook URL"

3. **Add to .env file:**
   - Open your `.env` file in VS Code
   - Find the line `DISCORD_WEBHOOK_URL=...`
   - Replace it with your webhook URL:
     ```env
     DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/123456789/abcdefghijklmnop
     ```
   - Save the file

**✅ Success looks like:** You have a webhook URL saved in your `.env` file.

### 4b: Email Service Setup (Optional)

**What it does:** Sends confirmation emails to students when they book a tutor.

**For beginners:** You can skip this initially and add it later.

**If you want to set it up now:**

1. **Using Gmail (easiest option):**
   - You need a Gmail account
   - Go to your Google Account settings: https://myaccount.google.com/
   - Click "Security" → "2-Step Verification" (set this up if you haven't)
   - Then go to "App passwords": https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Tutors Link"
   - Click "Generate"
   - **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

2. **Update .env file:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   STAFF_EMAIL=youremail@gmail.com
   ```

**Alternative: SendGrid (more reliable for production):**
- Visit: https://sendgrid.com/
- Sign up for free account (100 emails/day free)
- Create an API key
- Update EMAIL_HOST to `smtp.sendgrid.net`
- Use `apikey` as EMAIL_USER
- Use your API key as EMAIL_PASSWORD

### 4c: Firebase Authentication Setup

**What it does:** Handles user accounts (students and tutors can sign up and log in).

**This is REQUIRED** - your website won't work without it.

**Steps:**

1. **Create a Firebase project:**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account
   - Click "Add project"
   - Enter project name: "Tutors Link"
   - Click "Continue"
   - Disable Google Analytics (you can enable it later)
   - Click "Create project"
   - Wait 30-60 seconds
   - Click "Continue"

2. **Enable Email/Password authentication:**
   - In your Firebase project, click "Authentication" in the left menu
   - Click "Get started"
   - Click "Sign-in method" tab
   - Click "Email/Password"
   - Toggle ON the first switch (Email/Password)
   - Click "Save"

3. **Add authorized domains:**
   - Still in Authentication, click "Settings" tab
   - Scroll to "Authorized domains"
   - `localhost` should already be there (for local testing)
   - Click "Add domain"
   - Add: `tutorslink.github.io` (or your GitHub Pages domain)
   - Click "Add domain" again
   - Add your Railway domain (we'll get this later)

4. **Register your web app:**
   - Click the gear icon (⚙️) next to "Project Overview" at the top
   - Click "Project settings"
   - Scroll down to "Your apps"
   - Click the web icon (`</>`)
   - Enter app nickname: "Tutors Link Website"
   - Keep "Firebase Hosting" unchecked
   - Click "Register app"

5. **Copy your Firebase config:**
   - You'll see a code block with your config
   - It looks like:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSyC...",
       authDomain: "tutors-link-xxxxx.firebaseapp.com",
       projectId: "tutors-link-xxxxx",
       storageBucket: "tutors-link-xxxxx.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abcdef"
     };
     ```
   - Copy all the values

6. **Update firebase-config.js:**
   - In VS Code, open `firebase-config.js`
   - Replace the placeholder values with your Firebase config:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_ACTUAL_API_KEY",
       authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
       projectId: "YOUR_ACTUAL_PROJECT_ID",
       storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
       messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
       appId: "YOUR_ACTUAL_APP_ID"
     };
     ```
   - Save the file

**Important Note:** Firebase values are NOT secrets! It's safe to share them. Security comes from Firebase rules and authorized domains, not from hiding these values.

---

## PART 5: Database Setup

Your database is already set up on MongoDB Atlas! But let's verify it's working.

### 5.1 Verify Database Connection

We'll test this when we run the server in the next section. The server will automatically create the necessary collections (tables) when you first use them.

**MongoDB automatically creates:**
- `tutors` collection - stores tutor profiles
- `bookings` collection - stores booking requests
- `users` collection - stores user data

**No manual setup needed!** That's the beauty of MongoDB - it creates what it needs automatically.

---

## PART 6: Running Locally (Development)

Now the exciting part - let's see your website in action!

### 6.1 Install Project Dependencies

**What you're doing:** Downloading all the tools (packages) that the website needs.

1. **Open your command window** (if it's not still open)
   - Navigate to your project folder:
     ```bash
     cd C:\Projects\website
     ```
     (or wherever you saved it)

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   - This reads `package.json` and downloads all required packages
   - Takes 1-3 minutes
   - You'll see lots of text flying by - this is normal!
   - You'll see "added XXX packages"

**✅ Success looks like:** You see "added XXX packages" and no red ERROR messages.

**❌ If you see errors:**
- Make sure you're in the correct folder (where `package.json` is)
- Make sure Node.js is installed (`node --version` should work)
- Try running `npm cache clean --force` then `npm install` again

### 6.2 Start the Backend Server

1. **Start the server:**
   ```bash
   npm start
   ```

2. **What you should see:**
   ```
   ✅ Connected to MongoDB Atlas
   🚀 Server running on port 3000
   ```

   If you see `⚠️ MONGODB_URI not set`, check your `.env` file!

3. **Keep this window open!** The server needs to keep running.

### 6.3 Open in Browser

1. **Open your web browser** (Chrome, Firefox, etc.)

2. **Visit:** http://localhost:3000

3. **You should see:** The Tutors Link homepage with:
   - A header saying "Tutors Link"
   - Browse tutors section
   - Login/Sign up buttons

**🎉 Congratulations!** Your website is running locally!

### 6.4 Create Test Accounts

Let's create some test accounts to try out the features.

1. **Create a student account:**
   - Click "Sign Up / Log In" button
   - Click "Sign Up"
   - Enter email: `student@test.com`
   - Enter password: `TestPassword123`
   - Click "Sign Up"
   - You'll be logged in automatically

2. **Create a tutor account:**
   - Log out (click your email → Log Out)
   - Sign up again with: `tutor@test.com` / `TestPassword123`

3. **Create an admin account:**
   - Log out
   - Sign up with: `admin@test.com` / `TestPassword123`

**Note:** For now, all accounts have the same permissions. You'll configure admin access separately.

---

## PART 7: Testing the Application

Let's test all the main features!

### 7.1 Test Tutor Discovery

1. **Go to the homepage:** http://localhost:3000

2. **You should see:**
   - "No tutors available yet" (because we haven't added any)

3. **Add a test tutor:**
   - We'll use the API directly for now
   - Open a NEW command window (keep the server running!)
   - Run this command:
     ```bash
     curl -X POST http://localhost:3000/api/tutors -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"subjects\":\"Math, Physics\",\"price\":\"$20/hour\",\"timezone\":\"GMT+0\",\"languages\":\"English\",\"category\":\"IGCSE\"}"
     ```
   
   - **Windows users:** If curl doesn't work, use PowerShell instead:
     ```powershell
     Invoke-WebRequest -Uri http://localhost:3000/api/tutors -Method POST -ContentType "application/json" -Body '{"name":"John Doe","subjects":"Math, Physics","price":"$20/hour","timezone":"GMT+0","languages":"English","category":"IGCSE"}'
     ```

4. **Refresh your browser** - you should now see John Doe in the tutors list!

### 7.2 Test Booking Flow

1. **Click on a tutor card** (John Doe)
2. **Fill in the booking form:**
   - Your name: "Test Student"
   - Your email: "student@test.com"
   - Message: "I need help with calculus"
3. **Click "Book Demo Class"**
4. **You should see:** "Booking request sent successfully!"

### 7.3 Test Discord Notifications (if set up)

1. **Check your Discord server**
2. **You should see:** A message from "Tutors Link Bot" about the booking
3. **If you don't see it:**
   - Check your webhook URL in `.env`
   - Make sure you restarted the server after adding the webhook

### 7.4 Test Support Messages

1. **Scroll to the bottom** of the homepage
2. **Fill in the contact form:**
   - Name: "Test Student"
   - Email: "student@test.com"
   - Message: "I have a question about payments"
3. **Click "Send Message"**
4. **Check Discord** for the support notification

**✅ If everything works, you're ready to deploy to production!**

---

## PART 8: Deploying to Production (Railway)

Now let's put your website online so anyone can access it!

### 8.1 Create a Railway Account

1. **Visit:** https://railway.app/
2. **Click "Login"**
3. **Sign up with GitHub** (click "Login with GitHub")
4. **Authorize Railway** to access your GitHub account
5. **Complete your profile** if asked

### 8.2 Deploy the Backend

1. **Create a new project:**
   - On Railway dashboard, click "New Project"
   - Click "Deploy from GitHub repo"
   - Select "tutorslink/website" repository
   - Click "Deploy Now"

2. **Railway automatically detects:**
   - Node.js project
   - Reads `package.json`
   - Knows to run `npm start`

3. **Wait for deployment:**
   - First build takes 2-3 minutes
   - You'll see logs in real-time
   - Look for: "✅ Connected to MongoDB" and "🚀 Server running"

4. **Get your public URL:**
   - Click on your service/project
   - Click "Settings" tab
   - Scroll to "Domains"
   - Click "Generate Domain"
   - You'll get a URL like: `your-app.up.railway.app`
   - **Copy this URL** - you'll need it!

### 8.3 Configure Environment Variables on Railway

1. **Click "Variables" tab** in your Railway project

2. **Add these variables** (click "New Variable" for each):
   
   ```
   MONGODB_URI = mongodb+srv://tutorslink:YOURPASSWORD@cluster0.xxxxx.mongodb.net/tutorslink
   DISCORD_WEBHOOK_URL = https://discord.com/api/webhooks/...
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = youremail@gmail.com
   EMAIL_PASSWORD = your_app_password
   STAFF_EMAIL = youremail@gmail.com
   ENCRYPTION_KEY = your_32_char_key
   ENCRYPTION_SALT = your_salt
   ```

   **Important:** 
   - Don't add `PORT` - Railway sets this automatically
   - Don't add Firebase variables - those go in `firebase-config.js`

3. **Click "Deploy"** to restart with new variables

### 8.4 Deploy the Frontend (GitHub Pages)

1. **Update API URL in index.html:**
   - Open `index.html` in VS Code
   - Find the line with `API_BASE_URL` (around line 224)
   - Update it:
     ```javascript
     const API_BASE_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000' 
       : 'https://your-app.up.railway.app';  // ← Your Railway URL here
     ```

2. **Also update apply-as-tutor.html:**
   - Open `apply-as-tutor.html`
   - Find similar `API_BASE_URL` line
   - Update with your Railway URL

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

4. **Enable GitHub Pages:**
   - Go to your repository on GitHub: https://github.com/tutorslink/website
   - Click "Settings"
   - Click "Pages" in left menu
   - Under "Source", select "main" branch
   - Select "/" (root) folder
   - Click "Save"

5. **Wait for deployment:**
   - Takes 1-2 minutes
   - You'll see a green checkmark when ready
   - Your site will be at: `https://tutorslink.github.io/website/`

### 8.5 Update Firebase Authorized Domains

1. **Go back to Firebase Console**
2. **Authentication → Settings → Authorized domains**
3. **Add these domains:**
   - Your GitHub Pages URL: `tutorslink.github.io`
   - Your Railway URL: `your-app.up.railway.app`
4. **Click "Add"** for each

### 8.6 Test Your Production Site

1. **Visit:** `https://tutorslink.github.io/website/`
2. **Test all features:**
   - Sign up with a new account
   - View tutors
   - Make a booking
   - Send a support message
3. **Check Discord** for notifications

**🎉 CONGRATULATIONS!** Your website is now LIVE on the internet!

### 8.7 Set Up Custom Domain (Optional)

**If you want:** `www.tutorslink.com` instead of the long GitHub URL

1. **Buy a domain:**
   - Go to Namecheap, GoDaddy, or Google Domains
   - Search for your desired domain
   - Buy it (costs ~$10-15/year)

2. **Configure DNS for GitHub Pages:**
   - In your domain registrar, add these DNS records:
     ```
     A Record    185.199.108.153
     A Record    185.199.109.153
     A Record    185.199.110.153
     A Record    185.199.111.153
     CNAME www   tutorslink.github.io
     ```

3. **Configure in GitHub:**
   - Settings → Pages → Custom domain
   - Enter your domain: `www.tutorslink.com`
   - Click "Save"
   - Wait for DNS check (can take up to 24 hours)
   - Enable "Enforce HTTPS"

4. **Update Firebase authorized domains** with your new domain

---

## PART 9: Post-Launch Checklist

### 9.1 Test Everything in Production

**Make a checklist:**
- [ ] Homepage loads correctly
- [ ] User sign up works
- [ ] User login works
- [ ] Tutors display correctly
- [ ] Booking form submits
- [ ] Discord notifications arrive
- [ ] Support form works
- [ ] All links work (no 404 errors)

### 9.2 Set Up Monitoring

**Railway provides automatic monitoring:**
- Go to your Railway project
- Click "Metrics" tab
- You can see:
  - CPU usage
  - Memory usage
  - Request counts
  - Response times

**Set up alerts:**
- Click "Settings" → "Notifications"
- Add your email
- Get notified if your app goes down

### 9.3 Database Backup Strategy

**MongoDB Atlas automatic backups:**
- Free tier doesn't include automatic backups
- Manual backup process:
  1. Go to MongoDB Atlas
  2. Click your cluster
  3. Click "..." → "Command Line Tools"
  4. Use `mongodump` to create backups
  5. Run weekly: `mongodump --uri="your_connection_string" --out=/backup/location`

**Recommended:**
- Back up weekly if you have important data
- Store backups in Dropbox or Google Drive
- Test restoring from backup occasionally

### 9.4 How to Update Code

**When you want to add features or fix bugs:**

1. **Make changes locally:**
   - Edit files in VS Code
   - Test locally (`npm start`)
   - Make sure everything works

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

3. **Railway auto-deploys:**
   - Railway watches your GitHub repo
   - Automatically rebuilds and deploys
   - Takes 2-3 minutes

4. **GitHub Pages auto-updates:**
   - Frontend updates automatically
   - May take 1-2 minutes

### 9.5 Common Maintenance Tasks

**Restart your server (if it's slow):**
- Railway dashboard → Your project → "Restart"

**Check logs (if something's broken):**
- Railway dashboard → "Deployments" → Click latest deployment
- View real-time logs

**Update dependencies (monthly):**
```bash
npm update
npm audit fix
git add package-lock.json
git commit -m "Update dependencies"
git push
```

---

## TROUBLESHOOTING GUIDE

### Problem: "Port 3000 already in use"

**Solution:**
- Another program is using port 3000
- **Windows:** 
  ```bash
  netstat -ano | findstr :3000
  taskkill /PID [PID_NUMBER] /F
  ```
- **Mac/Linux:**
  ```bash
  lsof -ti:3000 | xargs kill -9
  ```
- Or change port in `.env`: `PORT=3001`

### Problem: "Cannot connect to MongoDB"

**Possible causes:**
1. **Wrong connection string**
   - Check `.env` file
   - Make sure password is correct (no special characters causing issues)
   - Make sure you replaced `<password>` with actual password

2. **IP not whitelisted**
   - Go to MongoDB Atlas
   - Network Access → Add `0.0.0.0/0`

3. **Database user doesn't exist**
   - Database Access → Make sure user exists
   - Check username and password match `.env`

### Problem: "Discord bot not sending messages"

**Solutions:**
1. **Check webhook URL**
   - Copy it again from Discord
   - Make sure no extra spaces in `.env`

2. **Restart server**
   - Stop server (Ctrl+C)
   - Start again (`npm start`)

3. **Test webhook directly**
   - Use this command:
     ```bash
     curl -X POST "YOUR_WEBHOOK_URL" -H "Content-Type: application/json" -d "{\"content\":\"Test message\"}"
     ```

### Problem: "Firebase authentication not working"

**Solutions:**
1. **Check authorized domains**
   - Firebase Console → Authentication → Settings
   - Make sure your domain is listed

2. **Check firebase-config.js**
   - Make sure values are correct
   - No extra quotes or spaces

3. **Clear browser cache**
   - Sometimes old cached files cause issues
   - Press Ctrl+Shift+Delete → Clear cache

### Problem: "Application won't start"

**Check these:**
1. **Node.js installed?** 
   - Run `node --version`
   
2. **Dependencies installed?** 
   - Run `npm install`
   
3. **.env file exists?** 
   - Should be in project root
   - Check it's named `.env` not `.env.txt`
   
4. **Syntax errors?**
   - Check server logs for error messages
   - Common: missing comma in JSON, missing quotes

### Problem: "Railway deployment failed"

**Solutions:**
1. **Check build logs**
   - Railway dashboard → Deployments → Click failed deployment
   - Read error message

2. **Common issues:**
   - Missing environment variables
   - Wrong Node.js version (should be 18+)
   - Package.json errors

3. **Try redeploying:**
   - Make a small change
   - Push to GitHub
   - Railway rebuilds automatically

### Problem: "GitHub Pages shows 404"

**Solutions:**
1. **Wait longer** - First deployment takes up to 10 minutes
2. **Check GitHub Actions** - Repository → Actions tab → See if build succeeded
3. **Check Pages settings** - Settings → Pages → Make sure source is "main" branch

---

## WHERE TO GET HELP

### Documentation Resources
- **This guide:** You're reading it! Bookmark it.
- **README.md:** Technical overview
- **FIREBASE_SETUP.md:** Detailed Firebase instructions
- **TROUBLESHOOTING.md:** More troubleshooting tips

### Online Communities
- **Discord:** https://discord.gg/pe8TXPgkAe
- **GitHub Issues:** https://github.com/tutorslink/website/issues
- **Stack Overflow:** Tag your questions with `tutors-link`

### Official Documentation
- **Node.js:** https://nodejs.org/docs/
- **MongoDB:** https://docs.mongodb.com/
- **Railway:** https://docs.railway.app/
- **Firebase:** https://firebase.google.com/docs/

### When Asking for Help
**Always include:**
1. What you were trying to do
2. What you expected to happen
3. What actually happened
4. Error messages (copy-paste the full message)
5. Your operating system
6. Node.js version (`node --version`)

**Example good question:**
> "I'm trying to start the server but getting error 'Cannot find module express'. I ran `npm install` and it seemed to work. I'm on Windows 10, Node v18.17.0. Here's the full error: [paste error]"

---

## APPENDIX: Quick Command Reference

### Development Commands
```bash
# Install dependencies
npm install

# Start server locally
npm start

# Check Node.js version
node --version

# Check npm version
npm --version

# Check git version
git --version
```

### Git Commands
```bash
# See changed files
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull

# See commit history
git log --oneline
```

### MongoDB Commands (if using MongoDB Compass)
```bash
# Connect to your database
mongodb+srv://username:password@cluster.mongodb.net/tutorslink

# List all databases
show dbs

# Use tutorslink database
use tutorslink

# See all tutors
db.tutors.find()

# See all bookings
db.bookings.find()

# Count tutors
db.tutors.count()
```

---

## CONGRATULATIONS! 🎉

You've successfully set up and deployed Tutors Link! You now have:

✅ A fully functional tutoring platform  
✅ User authentication with Firebase  
✅ A MongoDB database storing your data  
✅ A live website accessible to anyone  
✅ Real-time Discord notifications  
✅ Understanding of how everything works  

### What's Next?

**Immediate next steps:**
1. Add real tutors (not just test data)
2. Customize the styling (colors, fonts, layout)
3. Add your own logo and branding
4. Set up a custom domain
5. Share with your first users!

**Future improvements:**
- Add payment processing (Stripe integration)
- Build an admin dashboard
- Add tutor availability calendars
- Implement video chat for lessons
- Create mobile apps

### You Did It!

Building and deploying a full-stack web application is no small feat. You should be proud! You've learned about:
- Frontend and backend development
- Databases and data modeling
- API design and REST principles
- Cloud deployment and DevOps
- Authentication and security
- And much more!

**Keep learning, keep building, and most importantly - have fun!** 🚀

---

**Questions? Feedback? Improvements?**  
Open an issue on GitHub or join our Discord community!

**Happy tutoring!** 📚✨
