# SkillBridge Firebase Real-Time Sync Setup Guide

This guide will help you set up Firebase Firestore for real-time gig synchronization between clients and professionals.

## Issue: Gigs Not Syncing in Real-Time

If gigs posted by clients are not showing up for professionals, the most likely causes are:

1. **Missing Composite Index** in Firestore
2. **Restrictive Security Rules** blocking reads
3. **Firebase Configuration** not properly set up

## Step 1: Create Composite Index (MOST IMPORTANT)

The real-time query uses both `status` and `createdAt` fields. Firestore requires a composite index for this.

### Option A: Automatic (Recommended)
1. Open your browser's Developer Console (F12)
2. Look for an error message containing a link like:
   ```
   https://console.firebase.google.com/v1/r/project/YOUR_PROJECT/firestore/indexes?create_composite=...
   ```
3. Click the link - it will take you directly to Firebase Console to create the index

### Option B: Manual
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Configure:
   - **Collection ID**: `gigs`
   - **Fields**:
     - `status` - Ascending
     - `createdAt` - Descending
   - **Query scope**: Collection
6. Click **Create Index** and wait for it to build (may take a few minutes)

### Required Indexes for SkillBridge:

| Collection | Fields | Order |
|------------|--------|-------|
| gigs | status, createdAt | Ascending, Descending |
| gigs | clientId, createdAt | Ascending, Descending |
| professionals | isAvailable, category | Ascending, Ascending |

## Step 2: Update Security Rules

Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Gigs - readable by all, writable by authenticated users
    match /gigs/{gigId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.clientId == request.auth.uid;
    }
    
    // Professionals - readable by all
    match /professionals/{professionalId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **For testing/development**, you can temporarily use more permissive rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
**WARNING**: Do NOT use this in production!

## Step 3: Verify Firebase Configuration

Make sure your `.env.local` file has the correct Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

You can find these values in:
1. Firebase Console → Project Settings (gear icon) → General
2. Scroll down to "Your apps" → Select your web app
3. Copy the config values

## Step 4: Start the Backend Server

The application requires the backend server for authentication:

```bash
cd backend
npm install
npm start
```

The backend should run on `http://localhost:5001`

## Step 5: Verify Real-Time Sync

1. Open two browser windows
2. In Window 1: Log in as a **Customer** and post a gig
3. In Window 2: Log in as a **Professional** and go to "Find Work"
4. The gig should appear in real-time (within 1-2 seconds)

## Troubleshooting

### Error: "Missing Firestore Index"
- Check browser console for the index creation link
- Create the index as described in Step 1

### Error: "Permission Denied"
- Update your Firestore security rules
- Make sure the user is authenticated

### Gigs not appearing
1. Check browser console for any Firebase errors
2. Verify the gig was created (check Firestore Database in Console)
3. Ensure the `status` field is set to `'open'`

### Console logs to look for:
```
[Firebase] Creating gig: ...
[Firebase] Gig created successfully with ID: ...
[FindWork] Setting up real-time subscription...
[Firebase] Received gigs update: X documents
```

## Firebase Spark Plan Limitations

The Spark (free) plan supports:
- ✅ Real-time listeners (onSnapshot)
- ✅ Firestore reads/writes (50K reads/day, 20K writes/day)
- ✅ Authentication
- ❌ Cloud Functions (requires Blaze plan)

Real-time sync works perfectly on the Spark plan!

## Need More Help?

1. Check the browser console (F12) for detailed error messages
2. Verify your Firebase project is correctly configured
3. Ensure indexes are created and active (green checkmark in Firebase Console)
