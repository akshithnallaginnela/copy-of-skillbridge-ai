<div align="center">

# 🌉 SkillBridge AI

### *The LinkedIn for Skilled Labor*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-API-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

<br/>

**Connect skilled workers with customers. Showcase portfolios. Build trust with AI.**

<br/>



</div>

---

## 🎯 What is SkillBridge?

**SkillBridge** is a revolutionary marketplace platform connecting **blue-collar professionals** (electricians, plumbers, painters, beauticians, and more) with customers who need their services. Think of it as **LinkedIn meets Urban Company** – but powered by cutting-edge **Google AI technologies**.

### 💡 The Problem We Solve

> *"Finding a trustworthy electrician or plumber is hard. Verifying their work quality is even harder."*

SkillBridge solves this by:

- 🤖 **AI-powered profile creation** from voice descriptions
- 📸 **Work photo verification** using Gemini AI
- 📍 **Real-time nearby search** with Google Maps
- ⭐ **Verified ratings & reviews** from Google Places
- ⚡ **Instant gig matching** with Firebase real-time sync

---

## 🔵 Google Technologies Powering SkillBridge

<div align="center">

| Technology | Integration | Purpose |
|:----------:|:-----------:|:--------|
| ![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=googlegemini&logoColor=white) | `@google/genai` | AI profile generation, gig refinement, image verification |
| ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) | `firebase` | Authentication, Firestore database, real-time sync |
| ![Maps](https://img.shields.io/badge/Maps_Platform-4285F4?style=flat-square&logo=googlemaps&logoColor=white) | `@googlemaps/*` | Places API, Geocoding, Distance Matrix, Interactive Maps |

</div>

### 🧠 Gemini AI Features

```
┌─────────────────────────────────────────────────────────────────┐
│                    GEMINI AI INTEGRATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎤 VOICE TO PROFILE                                           │
│     Worker speaks → AI generates professional portfolio         │
│     Model: gemini-3-flash-preview                              │
│                                                                 │
│  ✍️ GIG REFINEMENT                                              │
│     Raw request → Professional job listing with budget          │
│     Model: gemini-3-flash-preview                              │
│                                                                 │
│  🔍 NEARBY SEARCH + GROUNDING                                   │
│     AI-powered local service discovery                          │
│     Model: gemini-2.5-flash + Google Maps Tools                │
│                                                                 │
│  🖼️ WORK IMAGE VERIFICATION                                     │
│     Photo → Authenticity score + Trust comment                  │
│     Model: gemini-3-flash-preview (Vision)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 🔥 Firebase Services

| Service | Usage |
|---------|-------|
| **Authentication** | Email/password sign-in with role-based access (Worker/Customer) |
| **Cloud Firestore** | Real-time NoSQL database for gigs, users, professionals |
| **Real-time Listeners** | Instant sync when gigs are posted or accepted |
| **Security Rules** | Role-based data access control |

### 🗺️ Google Maps Platform APIs

| API | Functionality |
|-----|---------------|
| **Places Nearby Search** | Find electricians, plumbers, beauticians near you |
| **Places Text Search** | Flexible search like "AC repair near Koramangala" |
| **Place Details** | Phone, website, hours, reviews for each business |
| **Place Photos** | Display real business photos |
| **Geocoding** | Convert addresses ↔ coordinates |
| **Distance Matrix** | Calculate distance & travel time |
| **Maps JavaScript** | Interactive map with custom markers & radius |

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👤 For Customers

- 🔍 **Browse Professionals** by category
- 📍 **Find Nearby** within 1-25 km radius
- 📝 **Post Gigs** with AI-refined descriptions
- 📊 **Track Jobs** and their status
- ⭐ **View Ratings** from Google
- 📞 **Click-to-Call** professionals
- 🧭 **Get Directions** via Google Maps

</td>
<td width="50%">

### 🔧 For Workers

- 🤖 **AI Profile Creator** from voice/text
- 📸 **Work Gallery** to showcase projects
- ✅ **AI Verification** of work photos
- 💼 **Real-time Gig Feed**
- 🎯 **Accept Jobs** instantly
- 💰 **Wallet Dashboard**
- 📈 **Performance Insights**

</td>
</tr>
</table>

### 🏠 Platform Features

| Feature | Description |
|---------|-------------|
| 🔐 **Dual Authentication** | MongoDB backend + Firebase Auth |
| 👥 **Role-based Dashboards** | Different UX for workers vs customers |
| 🔔 **Toast Notifications** | Real-time feedback on actions |
| 🗺️ **Interactive Maps** | Full Google Maps with markers, info windows |
| ⚡ **Real-time Sync** | Instant updates across devices |
| 📱 **Mobile-first Design** | Responsive with bottom navigation |

---

## 🛠️ Service Categories

<div align="center">

| ⚡ Electrician | 🔧 Plumber | 🎨 Painter | 💇 Beautician | 🚗 Mechanic |
|:-------------:|:----------:|:----------:|:-------------:|:-----------:|
| 🪵 Carpenter | ✨ Cleaning | 🍳 Cook/Chef | ❄️ AC Repair | 🌿 Gardener |

</div>

---

## 🏗️ Tech Stack

### Frontend

```
React 19.2  →  UI Framework
TypeScript  →  Type Safety
Vite 6.2    →  Build Tool
Lucide      →  Icons
Recharts    →  Charts
Axios       →  HTTP Client
```

### Backend

```
Node.js     →  Runtime
Express 4   →  API Server
MongoDB     →  Database
Mongoose 8  →  ODM
JWT         →  Auth Tokens
bcryptjs    →  Password Hashing
```

### Google Cloud

```
Gemini AI   →  Generative AI
Firebase    →  Auth + Database
Maps APIs   →  Location Services
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB** running locally or Atlas connection
- **Google Cloud** API keys (Gemini, Maps, Firebase)

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/skillbridge-ai.git
cd skillbridge-ai

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2️⃣ Configure Environment

Create `.env.local` in root:

```env
# Gemini AI
API_KEY=your_gemini_api_key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create `backend/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### 3️⃣ Run the Application

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev
```

🎉 **Open <http://localhost:5173> in your browser!**

---

## 📂 Project Structure

```
skillbridge-ai/
├── 📁 backend/
│   ├── 📁 config/         # Database configuration
│   ├── 📁 middleware/     # Auth middleware
│   ├── 📁 models/         # Mongoose schemas
│   ├── 📁 routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── gigs.js        # Gig CRUD operations
│   │   ├── location.js    # Distance & geocoding
│   │   └── places.js      # Google Places integration
│   ├── 📁 services/
│   │   ├── locationService.js   # Maps API wrapper
│   │   └── placesService.js     # Places API wrapper
│   └── server.js          # Express server
│
├── 📁 components/
│   ├── Landing.tsx        # Home page
│   ├── Login.tsx          # Authentication
│   ├── Marketplace.tsx    # Browse professionals
│   ├── NearbyProfessionals.tsx  # Google Places search
│   ├── ProfessionalMap.tsx      # Interactive map
│   ├── FindWork.tsx       # Real-time gig feed
│   ├── PostGig.tsx        # AI-powered gig creation
│   ├── MyGigs.tsx         # Manage gigs
│   ├── WorkGallery.tsx    # Portfolio with AI verification
│   ├── ProfileCreator.tsx # AI profile generator
│   └── ...more components
│
├── 📁 services/
│   ├── authService.ts     # Auth API calls
│   ├── firebaseService.ts # Firebase integration
│   └── geminiService.ts   # Gemini AI integration
│
├── App.tsx                # Main application
├── types.ts               # TypeScript types
└── package.json
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/auth/me` | Get current user |
| `PUT` | `/api/auth/profile` | Update profile |

### Gigs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/gigs` | List user's gigs |
| `POST` | `/api/gigs` | Create new gig |
| `PUT` | `/api/gigs/:id` | Update gig |
| `DELETE` | `/api/gigs/:id` | Delete gig |

### Location Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/places/nearby` | Search Google Places |
| `GET` | `/api/location/nearby-professionals` | Find nearby workers |

---

## 📊 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Landing  │  │Marketplace│  │ Find Work │  │  Maps   │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │                │
│       └─────────────┼─────────────┼─────────────┘                │
│                     │             │                              │
└─────────────────────┼─────────────┼──────────────────────────────┘
                      │             │
        ┌─────────────┴─────────────┴─────────────┐
        │                                         │
        ▼                                         ▼
┌───────────────────┐                   ┌───────────────────┐
│  EXPRESS BACKEND  │                   │     FIREBASE      │
│  ┌─────────────┐  │                   │  ┌─────────────┐  │
│  │   Auth      │  │                   │  │  Firestore  │◄─┼─── Real-time Sync
│  │   Gigs      │  │                   │  │   Auth      │  │
│  │   Places    │  │                   │  └─────────────┘  │
│  │   Location  │  │                   └───────────────────┘
│  └─────────────┘  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐      ┌───────────────────┐
│     MONGODB       │      │   GOOGLE CLOUD    │
│  ┌─────────────┐  │      │  ┌─────────────┐  │
│  │   Users     │  │      │  │  Gemini AI  │  │
│  │   Gigs      │  │      │  │  Maps APIs  │  │
│  │   Profiles  │  │      │  │  Places API │  │
│  └─────────────┘  │      │  └─────────────┘  │
└───────────────────┘      └───────────────────┘
```

---

## 📖 Documentation

- 📘 [Firebase Setup Guide](./FIREBASE_SETUP.md)
- 📗 [Authentication Setup](./AUTHENTICATION_SETUP.md)
- 📙 [MongoDB Setup](./backend/MONGODB_SETUP.md)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the ISC License.

---

<div align="center">

### 🌟 Built with Google Technologies

<img src="https://img.shields.io/badge/Powered_by-Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Powered by Google Cloud" />

**Made with ❤️ for the Skilled Workers of India**

[⬆ Back to Top](#-skillbridge-ai)

</div>
