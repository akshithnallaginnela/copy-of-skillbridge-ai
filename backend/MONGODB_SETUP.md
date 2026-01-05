# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign In"
3. Create an account or log in

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click "Create Cluster" (takes 3-5 minutes)

## Step 3: Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `skillbridge_user` (or your choice)
5. Password: Generate a secure password (SAVE THIS!)
6. User Privileges: Select "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, use specific IP addresses
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js
5. Version: 5.5 or later
6. Copy the connection string

It will look like:
```
mongodb+srv://skillbridge_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update Backend .env File

1. Open `backend/.env`
2. Replace `<password>` with your actual password
3. Add database name after `.net/`:

```env
MONGODB_URI=mongodb+srv://skillbridge_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority
```

**Example:**
```env
MONGODB_URI=mongodb+srv://skillbridge_user:MySecurePass123@cluster0.abc123.mongodb.net/skillbridge?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Step 7: Test Connection

Run the backend server:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5000
```

## Troubleshooting

### Connection Error
- Check if password has special characters (URL encode them)
- Verify IP address is whitelisted
- Ensure cluster is fully deployed

### Authentication Failed
- Double-check username and password
- Verify user has correct permissions

### Network Timeout
- Check firewall settings
- Try different network/VPN

## Security Best Practices

1. **Never commit `.env` to git**
2. Use strong passwords
3. Rotate credentials regularly
4. Use specific IP addresses in production
5. Enable MongoDB Atlas alerts

## Next Steps

Once connected:
1. Backend will automatically create collections
2. Test signup/login endpoints
3. Verify data in MongoDB Atlas dashboard
