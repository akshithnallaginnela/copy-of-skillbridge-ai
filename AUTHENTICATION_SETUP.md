# SkillBridge Authentication Setup Guide

## 🚀 Quick Start

### 1. MongoDB Atlas Setup

**Follow the detailed guide:** `backend/MONGODB_SETUP.md`

**Quick Steps:**
1. Create free MongoDB Atlas account
2. Create cluster (M0 Free tier)
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string

### 2. Configure Backend Environment

Edit `backend/.env`:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5000
📍 Environment: development
```

### 4. Start Frontend

In a new terminal:

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 📋 Features Implemented

### ✅ Backend
- Express server with MongoDB Atlas
- User authentication (signup/login)
- JWT token-based sessions
- Password hashing with bcrypt
- Role-based access (WORKER/CUSTOMER)
- Protected API routes
- Gig CRUD operations

### ✅ Frontend
- Updated Login/Signup component
- Real API integration
- Role selection during signup
- Error handling and display
- JWT token management
- Auth service layer

---

## 🧪 Testing the Authentication

### Test Signup (New User)

1. Go to `http://localhost:5173`
2. Click "Login" or navigate to login page
3. Click "Don't have an account? Create one"
4. Select role: **"I want to Work"** (WORKER) or **"I want to Hire"** (CUSTOMER)
5. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
6. Click "Join as Pro" or "Join as Customer"

**Expected Result:**
- User created in MongoDB
- Redirected to dashboard
- Role-based dashboard displayed

### Test Login (Existing User)

1. Go to login page
2. Enter credentials from signup
3. Click "Sign In"

**Expected Result:**
- JWT token stored in localStorage
- User logged in
- Redirected to role-based dashboard

### Verify in MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select `skillbridge` database
4. Check `users` collection
5. You should see your user with hashed password

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Gigs
- `GET /api/gigs` - Get user's gigs (protected)
- `POST /api/gigs` - Create gig (protected)
- `PUT /api/gigs/:id` - Update gig (protected)
- `DELETE /api/gigs/:id` - Delete gig (protected)

### Health Check
- `GET /api/health` - Server status

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Verify MongoDB Atlas IP whitelist
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Check browser console for errors

### Login/Signup fails
- Check backend logs for errors
- Verify MongoDB connection
- Check network tab in browser DevTools

### "Cannot find module 'axios'" error
- Run `npm install` in frontend directory
- Restart frontend dev server

---

## 📁 Project Structure

```
skillbridge/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Gig.js             # Gig schema
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   └── gigs.js            # Gig endpoints
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env                   # Environment variables
├── services/
│   ├── authService.ts         # Frontend auth API
│   └── geminiService.ts       # AI service
├── components/
│   ├── Login.tsx              # Login/Signup UI
│   └── MyGigs.tsx             # Role-based gigs
└── App.tsx                    # Main app
```

---

## 🔄 Next Steps

1. **Test Authentication Flow**
   - Create WORKER account
   - Create CUSTOMER account
   - Test login for both roles

2. **Connect MyGigs to Database**
   - Update MyGigs component to use gigService
   - Fetch real gigs from MongoDB
   - Create/update/delete gigs

3. **Add Google OAuth** (Phase 2)
   - Setup Google Cloud Console
   - Implement OAuth flow
   - Update Login component

---

## 💡 Tips

- Keep backend and frontend running in separate terminals
- Check MongoDB Atlas for data verification
- Use browser DevTools Network tab to debug API calls
- Check backend console for server logs
- JWT tokens are stored in localStorage

---

## 🎉 Success Indicators

✅ Backend server running without errors
✅ MongoDB connected successfully
✅ Can create new user accounts
✅ Can login with created accounts
✅ Role-based dashboards display correctly
✅ JWT tokens stored in localStorage
✅ User data persists in MongoDB

---

**Need Help?** Check the logs in:
- Backend: Terminal running `npm run dev` in backend/
- Frontend: Browser console (F12)
- MongoDB: Atlas dashboard → Browse Collections
