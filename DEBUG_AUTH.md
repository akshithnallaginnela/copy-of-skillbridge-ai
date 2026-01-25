# 🔍 Debugging "Not Authorized" Error

## Current Status

You're getting: `{success: false, message: 'Not authorized to access this route'}`

This means the backend is **NOT receiving your authentication token**.

## Immediate Action Required

### Step 1: Check if You're Actually Logged In

Open browser console (F12) and run these commands:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Check if user exists  
console.log('User:', localStorage.getItem('user'));
```

**Expected Results:**

- Token: Should be a long string (JWT token)
- User: Should be a JSON object with your user info

**If both are `null`:**

- ❌ You're NOT logged in
- 🔧 **Solution:** Login again

### Step 2: Verify Token is Being Sent

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try posting a gig
4. Click on the `/gigs` request (should show as failed/red)
5. Go to **Headers** tab
6. Look under "Request Headers"
7. Find `Authorization`

**What you should see:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If you DON'T see Authorization header:**

- ❌ Token is not being sent
- 🔧 **Solution:** Logout and login again

### Step 3: Check Vercel Logs (After Deployment)

I've added debug logging to the backend. After deployment (2-3 minutes):

1. Try posting a gig
2. Go to Vercel Dashboard
3. Click on your project
4. Go to **Deployments** → Latest deployment
5. Click **View Function Logs**
6. Look for these messages:

**If you see:**

- `❌ No token found in request` → Token not being sent from frontend
- `❌ Token verification failed` → Token is invalid/expired
- `❌ User not found for ID` → User was deleted from database
- `✅ User authenticated` → Auth is working (different issue)

## Most Likely Causes

### Cause 1: Not Logged In (90% probability)

**Symptoms:**

- `localStorage.getItem('token')` returns `null`
- No user info in top right corner

**Solution:**

1. Click "Login" or "Sign Up"
2. Enter credentials
3. Make sure you see success message
4. Try posting again

### Cause 2: Token Expired (5% probability)

**Symptoms:**

- Token exists in localStorage
- But still getting "Not authorized"

**Solution:**

1. Logout
2. Login again
3. Try posting again

### Cause 3: CORS/Header Issue (5% probability)

**Symptoms:**

- Token exists in localStorage
- But not showing in Network request headers

**Solution:**

1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache
3. Try in incognito mode

## Quick Test Script

Run this in browser console to diagnose:

```javascript
// Diagnostic script
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('=== DIAGNOSTIC REPORT ===');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length || 0);
console.log('User exists:', !!user);

if (user) {
    try {
        const userData = JSON.parse(user);
        console.log('User email:', userData.email);
        console.log('User role:', userData.role);
    } catch (e) {
        console.log('User data corrupted');
    }
}

if (!token) {
    console.log('❌ NOT LOGGED IN - Please login');
} else {
    console.log('✅ Token found - Check if it\'s being sent in requests');
}
```

## Step-by-Step Fix

### Fix 1: Logout and Login (Try This First)

1. **Logout:**
   - Click your profile/avatar
   - Click "Logout"
   - Verify localStorage is cleared:

     ```javascript
     console.log(localStorage.getItem('token')); // Should be null
     ```

2. **Login:**
   - Click "Login"
   - Enter email and password
   - Watch for success message
   - Verify token is saved:

     ```javascript
     console.log(localStorage.getItem('token')); // Should be a long string
     ```

3. **Test:**
   - Try posting a gig
   - Should work now!

### Fix 2: Hard Refresh

If logout/login doesn't work:

1. `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Login again
3. Try posting

### Fix 3: Clear Everything

If still not working:

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Storage** → **Clear site data**
4. Refresh page
5. Login again
6. Try posting

## After Deployment (2-3 minutes)

Once Vercel deploys the updated code with debug logging:

1. **Try posting a gig**
2. **Check Vercel Function Logs** to see exactly what's happening
3. **Share the log output** with me if it still fails

The logs will show:

- 🔐 Whether headers are present
- ✅/❌ Whether token was extracted
- ✅/❌ Whether token was verified
- ✅/❌ Whether user was found

## What to Share if Still Broken

If it still doesn't work after trying everything:

1. **Console output** from the diagnostic script above
2. **Network tab screenshot** showing the `/gigs` request headers
3. **Vercel function logs** after trying to post
4. **Any error messages** you see

---

**Most likely fix: Just logout and login again! 🔄**

The deployment with debug logging will be ready in 2-3 minutes. Try the fixes above first!
