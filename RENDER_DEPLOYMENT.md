# Deploy MobFix to Render - Complete Guide

This guide walks you through deploying the MobFix application (backend + frontend) to Render.com.

## Prerequisites

✅ GitHub account with the MobFix repository  
✅ Render.com account (free tier works)  
✅ MongoDB Atlas account (free tier works) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

---

## Step 1: Set Up MongoDB Atlas (Database)

1. **Create a MongoDB Atlas account** at https://www.mongodb.com/cloud/atlas/register
2. **Create a new cluster** (free M0 tier is sufficient):
   - Click "Build a Database"
   - Choose "FREE" Shared cluster
   - Select a cloud provider and region (choose one closest to your Render deployment region)
   - Name your cluster (e.g., "MobFix")
   - Click "Create"

3. **Create a database user**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `mobfix_user` (or your choice)
   - Password: Click "Autogenerate Secure Password" and **COPY IT** - you'll need this
   - Built-in Role: "Atlas admin" (or "Read and write to any database")
   - Click "Add User"

4. **Whitelist IP addresses**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - Click "Confirm"
   - ⚠️ Note: For production, you should restrict this to specific IPs

5. **Get your connection string**:
   - Go back to "Database" (Deployments → Database)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string (looks like: `mongodb+srv://mobfix_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - **IMPORTANT:** Replace `<password>` with the actual password you copied in step 3
   - Add a database name before the `?` (e.g., `mongodb+srv://mobfix_user:yourpassword@cluster0.xxxxx.mongodb.net/mobfix?retryWrites=true&w=majority`)
   - **Save this connection string** - you'll need it for Render

---

## Step 2: Connect GitHub to Render

1. **Sign in to Render**: Go to https://dashboard.render.com
2. **Connect GitHub**:
   - Click your profile icon (top right)
   - Go to "Account Settings"
   - Under "Connected Accounts", click "Connect" next to GitHub
   - Authorize Render to access your repositories
   - Choose to give access to "All repositories" or select "MobFix" specifically

---

## Step 3: Deploy Backend (Web Service)

1. **Create the backend service**:
   - From Render Dashboard, click "New +" → "Blueprint"
   - Select your GitHub account and the "MobFix" repository
   - Render will detect `render.yaml` and show you the services it will create
   - You should see:
     - `mobfix-backend` (Web Service)
     - `mobfix-frontend` (Static Site)
   - Click "Apply" to create both services

2. **Configure backend environment variables**:
   - After the services are created, click on the `mobfix-backend` service
   - Go to "Environment" tab (left sidebar)
   - Add/update these environment variables:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `MONGO_URI` | Your Atlas connection string from Step 1 | ⚠️ Must be the full `mongodb+srv://...` string |
   | `JWT_SECRET` | Click "Generate" in Render or use a random 64-char string | Keep this secret! |
   | `PORT` | `5000` | Optional - Render auto-assigns but backend expects 5000 |
   | `NODE_ENV` | `production` | Already set in render.yaml |
   | `ADMIN_USERNAME` | `admin` | Or your preferred admin username |
   | `ADMIN_PASSWORD` | `SecurePassword123!` | ⚠️ Change from default! |
   | `FRONTEND_URL` | (leave empty for now, add after frontend deploys) | Will be like `https://mobfix-frontend.onrender.com` |

3. **Save and deploy**:
   - Click "Save Changes"
   - Render will automatically redeploy the backend
   - Wait for the deploy to complete (check the "Logs" tab)
   - Look for: `Server started on port 5000` and `MongoDB connected`

4. **Get your backend URL**:
   - On the backend service page, copy the URL at the top (e.g., `https://mobfix-backend.onrender.com`)
   - **Save this URL** - you'll need it for the frontend

5. **Test your backend**:
   - Open `https://your-backend-url.onrender.com` in a browser
   - You should see: `{"message":"MobFix API running"}`
   - Test the API: `https://your-backend-url.onrender.com/api/services`

---

## Step 4: Seed the Database

You need to add sample services to your database. You can do this in two ways:

### Option A: Using Render Shell (Recommended)

1. Go to your `mobfix-backend` service in Render Dashboard
2. Click "Shell" tab (left sidebar)
3. Run the seed command:
   ```bash
   node scripts/seedServices.js
   ```
4. You should see: "Inserted: Screen Replacement... Done. Inserted: 6"

### Option B: Run Locally

1. Open PowerShell on your machine
2. Navigate to the backend folder:
   ```powershell
   cd C:\23eg107b46\mobfix\backend
   ```
3. Set the Atlas connection string:
   ```powershell
   $env:MONGO_URI = "your-atlas-connection-string-here"
   ```
4. Run the seed script:
   ```powershell
   node scripts/seedServices.js
   ```

---

## Step 5: Deploy Frontend (Static Site)

1. **Configure frontend environment variables**:
   - Go to Render Dashboard
   - Click on the `mobfix-frontend` service
   - Go to "Environment" tab
   - Add this environment variable:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `API_URL` | `https://your-backend-url.onrender.com/api` | ⚠️ Replace with YOUR actual backend URL from Step 3 |

   Example: `https://mobfix-backend.onrender.com/api`

2. **Save and deploy**:
   - Click "Save Changes"
   - Render will rebuild and deploy the frontend
   - The build command in `render.yaml` will automatically inject this `API_URL` into `assets/env.js`

3. **Wait for deployment**:
   - Check the "Logs" tab
   - Wait for "Build successful" and "Your site is live"
   - This may take 3-5 minutes for the first deploy

4. **Get your frontend URL**:
   - Copy the URL at the top (e.g., `https://mobfix-frontend.onrender.com`)

---

## Step 6: Update Backend with Frontend URL

1. Go back to the `mobfix-backend` service
2. Go to "Environment" tab
3. Update the `FRONTEND_URL` variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-frontend-url.onrender.com` (from Step 5)
4. Click "Save Changes"
5. Backend will redeploy automatically

---

## Step 7: Test Your Deployed Application

1. **Open your frontend URL** in a browser (from Step 5)
2. You should see the MobFix application
3. **Test the services page**:
   - Navigate to the services/booking page
   - You should see the list of services (Screen Replacement, Battery Replacement, etc.)
4. **Check browser console** (F12 → Console):
   - Should see API calls to your backend URL
   - Should NOT see any CORS errors
   - Should see successful responses with service data

---

## Troubleshooting

### Backend Issues

**Problem:** Backend shows "MongooseError: The `uri` parameter to `openUri()` must be a string"
- **Solution:** Check that `MONGO_URI` is set correctly in Render environment variables
- Make sure you replaced `<password>` with your actual password
- Verify the connection string includes the database name: `.../mobfix?retryWrites=...`

**Problem:** "MongoNetworkError" or "Connection timeout"
- **Solution:** Check MongoDB Atlas Network Access settings
- Ensure `0.0.0.0/0` is in the IP whitelist
- Wait a few minutes for Atlas to update the whitelist

**Problem:** Backend logs show "Server started" but API returns 404
- **Solution:** Check that routes are properly mounted in `backend/server.js`
- Verify the backend URL you're using is correct

### Frontend Issues

**Problem:** Frontend shows empty services list or "No services available"
- **Solution:** Check browser console (F12) for errors
- Verify `API_URL` environment variable is set correctly in Render
- Check that the backend URL in `API_URL` ends with `/api` (not just the root)
- Ensure services were seeded in the database (Step 4)

**Problem:** CORS errors in browser console
- **Solution:** Backend has CORS enabled globally, but if you changed it:
  - Ensure `FRONTEND_URL` is set in backend environment
  - Check backend `server.js` CORS configuration

**Problem:** Frontend build fails
- **Solution:** Check Render logs for specific error
- Common issues: Node version mismatch, missing dependencies
- Verify `buildCommand` in `render.yaml` is correct

### Database Issues

**Problem:** No services showing even after seeding
- **Solution:** 
  - Go to MongoDB Atlas → Browse Collections
  - Check if `services` collection exists and has documents
  - If empty, re-run the seed script
  - Verify backend `MONGO_URI` points to the correct database

---

## Post-Deployment Checklist

✅ Backend is deployed and returns `{"message":"MobFix API running"}`  
✅ Backend `/api/services` returns JSON array with services  
✅ Database has been seeded with services  
✅ Frontend is deployed and accessible  
✅ Frontend shows services list (not empty state)  
✅ No CORS errors in browser console  
✅ All environment variables are set correctly  
✅ `FRONTEND_URL` is set in backend  
✅ `API_URL` is set in frontend  

---

## Important Security Notes

⚠️ **Before going to production:**

1. **Rotate Atlas password** if you shared it in chat/logs
2. **Change `ADMIN_PASSWORD`** from the default
3. **Restrict MongoDB Network Access** to specific IPs (not 0.0.0.0/0)
4. **Use strong JWT_SECRET** (64+ random characters)
5. **Enable MongoDB Atlas encryption at rest**
6. **Set up monitoring** in Render dashboard
7. **Review backend CORS settings** - consider restricting to your frontend URL only

---

## Updating Your Deployment

When you push changes to the `main` branch on GitHub, Render will automatically:
- Rebuild and redeploy the backend
- Rebuild and redeploy the frontend

To manually trigger a deploy:
1. Go to Render Dashboard
2. Select the service
3. Click "Manual Deploy" → "Deploy latest commit"

---

## Cost Estimate

**Free Tier (Sufficient for demo/testing):**
- MongoDB Atlas: Free M0 cluster (512MB storage)
- Render Backend: Free web service (spins down after 15min inactivity)
- Render Frontend: Free static site hosting

**Note:** Free tier backend will have cold starts (15-30 seconds to wake up). For production, upgrade to a paid plan ($7/month for backend).

---

## Support

If you encounter issues:
1. Check Render service logs (Logs tab)
2. Check MongoDB Atlas monitoring
3. Review browser console for frontend errors
4. Verify all environment variables are set correctly

---

## Quick Reference: Environment Variables

### Backend (`mobfix-backend`)
```
MONGO_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/mobfix?retryWrites=true&w=majority
JWT_SECRET=your-64-char-random-string
PORT=5000
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend (`mobfix-frontend`)
```
API_URL=https://your-backend.onrender.com/api
```

---

**🎉 Congratulations!** Your MobFix application is now live on Render!

Frontend: `https://mobfix-frontend.onrender.com`  
Backend API: `https://mobfix-backend.onrender.com/api`
