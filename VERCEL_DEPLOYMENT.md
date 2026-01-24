# 🚀 SkillBridge AI - Vercel Deployment Guide

## 📋 Overview

This guide will walk you through deploying SkillBridge AI to Vercel with both frontend (React) and backend (Express API) running as serverless functions.

## ✅ Prerequisites

- GitHub account
- Vercel account (free tier works perfectly)
- MongoDB Atlas account (free tier)
- All API keys ready (Firebase, Google Maps, Gemini AI)

## 🏗️ Architecture

```
Vercel Deployment
├── Frontend (React + Vite) → served at /
└── Backend (Express API) → served at /api/*
```

- **Frontend**: Static React SPA built with Vite
- **Backend**: Express routes converted to Vercel serverless functions
- **Database**: MongoDB Atlas (connection pooling implemented)
- **Same Domain**: No CORS issues! Everything runs on same domain

## 📝 Step-by-Step Deployment

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Go to **Network Access** → Add IP Address → **0.0.0.0/0** (Allow from anywhere)
4. Go to **Database Access** → Create a database user
5. Get your connection string:

   ```
   mongodb+srv://username:password@cluster.mongodb.net/skillbridge
   ```

### Step 2: Push to GitHub

```bash
# If not already a git repo, initialize
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/skillbridge-ai.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Vercel Website (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Select settings (auto-detected)
```

### Step 4: Configure Environment Variables in Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add ALL of these (for Production, Preview, and Development):

#### Backend Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=30d
NODE_ENV=production
```

#### Frontend Variables

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
API_KEY=your_gemini_api_key
```

**Important**: Make sure to add these to **ALL environments** (Production, Preview, Development)

### Step 5: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Check **Use existing Build Cache** (optional)
4. Click **Redeploy**

### Step 6: Verify Deployment

Once deployed, test these URLs:

#### Frontend

```
https://your-app.vercel.app
```

#### Backend Health Check

```
https://your-app.vercel.app/api/health
```

Should return:

```json
{
  "success": true,
  "message": "SkillBridge API is running on Vercel",
  "timestamp": "2026-01-24T...",
  "environment": "production"
}
```

#### Test Auth Endpoints

```
POST https://your-app.vercel.app/api/auth/login
POST https://your-app.vercel.app/api/auth/signup
```

## 🔍 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoNetworkError` or `ECONNRESET`

**Solution**:

- Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
- Check connection string is correct (no spaces, correct password)
- Ensure environment variables are set in Vercel

### API Routes Not Working

**Error**: `404 Not Found` on `/api/*`

**Solution**:

- Check `vercel.json` is in root directory
- Verify `api/index.js` exists
- Check Vercel build logs for errors

### Environment Variables Not Loading

**Error**: `undefined` for environment variables

**Solution**:

- Ensure variables are added to **ALL** environments in Vercel
- Redeploy after adding variables
- Frontend variables MUST start with `VITE_`

### Build Failures

**Error**: Build fails on Vercel

**Solution**:

- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Try local build: `npm run build`

## 🎯 Performance Tips

1. **Connection Pooling**: Already implemented in `/api/lib/db.js`
2. **Cold Starts**: First request may be slow (~500ms), subsequent requests are fast
3. **Caching**: Vercel automatically caches static assets
4. **Edge Network**: Your app is served from Vercel's global CDN

## 🔒 Security Best Practices

1. ✅ Never commit `.env` or `.env.local` files
2. ✅ Use strong JWT secrets (min 32 characters)
3. ✅ Rotate API keys if exposed
4. ✅ Enable MongoDB IP whitelist (or use 0.0.0.0/0 for Vercel)
5. ✅ Set up Firebase security rules

## 📊 Monitoring

### Vercel Dashboard

- View real-time logs
- Monitor function invocations
- Track performance metrics

### Check Logs

```bash
vercel logs your-app.vercel.app --follow
```

## 🚀 Continuous Deployment

Every push to `main` branch will automatically:

1. Trigger a new Vercel build
2. Run tests (if configured)
3. Deploy to production
4. Previous deployment remains accessible

---

## 🎉 You're Live

Your SkillBridge AI app is now:

- ✅ Deployed globally on Vercel's Edge Network
- ✅ Running serverless backend functions
- ✅ Connected to MongoDB Atlas
- ✅ Using Firebase Authentication
- ✅ Integrated with Google Maps & Gemini AI

Share your live URL: `https://your-app.vercel.app` 🎊

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

## 🆘 Need Help?

If you encounter issues:

1. Check Vercel build logs
2. Verify environment variables
3. Test API endpoints with `/api/health`
4. Review MongoDB Atlas connection settings
