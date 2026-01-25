# Production Issues Fix Guide

## Issues Identified

### 1. **Google Maps API Routes Missing in Production**

The `/api/places/*` routes were not implemented in the Vercel serverless function (`api/index.js`), causing server errors when trying to use the maps functionality.

### 2. **Missing Environment Variable**

The `GOOGLE_MAPS_API_KEY` was not configured in Vercel's environment variables.

### 3. **Gig Posting Issue**

Users on different PCs (client and professional) were unable to post gigs successfully.

## Fixes Applied

### ✅ 1. Added Google Maps API Routes to Serverless Function

- Added `@googlemaps/google-maps-services-js` import
- Implemented `/api/places/nearby` route
- Implemented `/api/places/search` route
- Implemented `/api/places/details/:placeId` route
- Implemented `/api/places/categories` route
- Added Google Maps API key status to debug endpoint

### ✅ 2. Updated Debug Endpoint

The `/api/debug` endpoint now shows the status of `GOOGLE_MAPS_API_KEY`.

## Required Actions in Vercel

### Step 1: Add Environment Variable

You **MUST** add the following environment variable in your Vercel project settings:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following:

```
Name: GOOGLE_MAPS_API_KEY
Value: AIzaSyBSDg50kKHhq1qUzgDyw53r9WUhxg7rLEg
Environment: Production, Preview, Development (select all)
```

### Step 2: Redeploy

After adding the environment variable:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **⋯** (three dots) menu
4. Select **Redeploy**

OR simply push the updated code to trigger a new deployment.

## Testing the Fix

### Test 1: Check Debug Endpoint

Visit: `https://your-app.vercel.app/api/debug`

Expected response should show:

```json
{
  "success": true,
  "environment": {
    "MONGODB_URI": "set",
    "JWT_SECRET": "set",
    "GOOGLE_MAPS_API_KEY": "set"  // ← Should be "set", not "missing"
  },
  "database": {
    "status": "connected"
  }
}
```

### Test 2: Test Maps API

Visit: `https://your-app.vercel.app/api/places/categories`

Expected response:

```json
{
  "success": true,
  "data": [
    {
      "id": "electrician",
      "name": "Electrician",
      "description": "electrician"
    },
    // ... more categories
  ]
}
```

### Test 3: Test Nearby Search

Visit: `https://your-app.vercel.app/api/places/nearby?lat=17.385044&lng=78.486671&category=electrician&radius=5000`

Should return professionals near the location.

### Test 4: Test Gig Posting

1. Login as a CLIENT user on one PC
2. Login as a PROFESSIONAL user on another PC
3. Try posting a gig from both accounts
4. Both should work without errors

## Common Issues & Solutions

### Issue: "Google Maps API key not configured"

**Solution:** Make sure you added `GOOGLE_MAPS_API_KEY` to Vercel environment variables and redeployed.

### Issue: Gig posting still fails

**Possible causes:**

1. Authentication token expired - Ask user to logout and login again
2. Network/CORS issue - Check browser console for errors
3. Database connection issue - Check `/api/debug` endpoint

### Issue: Maps showing coordinates but giving errors

**Solution:** This was because the Places API routes were missing. After deploying the updated code with the new routes, this should be resolved.

## Code Changes Summary

### File: `api/index.js`

- ✅ Added Google Maps client import
- ✅ Added CATEGORY_MAPPINGS constant
- ✅ Added getPlaceDetails helper function
- ✅ Added 4 new API routes for Places API
- ✅ Updated debug endpoint to show Google Maps API key status

## Deployment Checklist

- [ ] Code changes committed and pushed to repository
- [ ] `GOOGLE_MAPS_API_KEY` added to Vercel environment variables
- [ ] Application redeployed on Vercel
- [ ] `/api/debug` endpoint checked - all keys show "set"
- [ ] `/api/places/categories` endpoint tested
- [ ] Maps functionality tested in the app
- [ ] Gig posting tested from both CLIENT and PROFESSIONAL accounts
- [ ] Cross-PC testing completed

## Support

If issues persist after following this guide:

1. Check Vercel deployment logs for errors
2. Check browser console for client-side errors
3. Test the `/api/debug` endpoint to verify all environment variables are set
4. Verify the Google Maps API key is valid and has the required APIs enabled:
   - Places API
   - Maps JavaScript API
   - Geocoding API

## Next Steps

After deploying, monitor the application for:

- Successful gig creation from both user types
- Maps loading correctly with professional listings
- No server errors in Vercel logs
- Proper geolocation functionality
