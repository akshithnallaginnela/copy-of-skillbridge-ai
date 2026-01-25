# Quick Deployment Steps

## What Was Fixed

### 1. **Google Maps API Routes** ✅

Added missing `/api/places/*` routes to the Vercel serverless function:

- `/api/places/nearby` - Search for nearby professionals
- `/api/places/search` - Text-based search
- `/api/places/details/:placeId` - Get place details
- `/api/places/categories` - Get available categories

### 2. **Debug Endpoint Enhanced** ✅

Added Google Maps API key status check to `/api/debug`

## Deploy Now (3 Steps)

### Step 1: Commit and Push Changes

```bash
git add .
git commit -m "Fix: Add Google Maps Places API routes to serverless function"
git push
```

### Step 2: Add Environment Variable in Vercel

1. Go to <https://vercel.com/dashboard>
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name:** `GOOGLE_MAPS_API_KEY`
   - **Value:** `AIzaSyBSDg50kKHhq1qUzgDyw53r9WUhxg7rLEg`
   - **Environments:** Select all (Production, Preview, Development)
6. Click **Save**

### Step 3: Redeploy

The deployment will trigger automatically when you push to Git.

OR manually redeploy:

1. Go to **Deployments** tab
2. Click **⋯** on the latest deployment
3. Select **Redeploy**

## Verify the Fix

After deployment, test these URLs (replace with your actual domain):

1. **Debug Check:**

   ```
   https://your-app.vercel.app/api/debug
   ```

   Should show `GOOGLE_MAPS_API_KEY: "set"`

2. **Categories:**

   ```
   https://your-app.vercel.app/api/places/categories
   ```

   Should return list of service categories

3. **Nearby Search:**

   ```
   https://your-app.vercel.app/api/places/nearby?lat=17.385044&lng=78.486671&category=electrician
   ```

   Should return nearby electricians

## Test Gig Posting

1. **PC 1 (Client):** Login and try to post a gig
2. **PC 2 (Professional):** Login and try to post a gig
3. Both should work without errors

## If Issues Persist

Check Vercel logs:

1. Go to your Vercel dashboard
2. Click on **Deployments**
3. Click on the latest deployment
4. Check **Build Logs** and **Function Logs**

Common issues:

- Environment variable not set → Add it in Vercel settings
- Old deployment cached → Force redeploy
- Browser cache → Clear cache or test in incognito mode
