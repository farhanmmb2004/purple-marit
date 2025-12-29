# Quick Start - Authentication System

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js installed (v14 or higher)
- [ ] MongoDB installed and running
- [ ] A code editor (VS Code recommended)

## 5-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
cd backend
npm install
```

### Step 2: Configure Environment (1 min)
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your MongoDB URI
# Minimum required:
# MONGODB_URI=mongodb://localhost:27017/your-database-name
# ACCESS_TOKEN_SECRET=<run command below>
# REFRESH_TOKEN_SECRET=<run command below>
```

**Generate Secrets:**
```bash
# Run this twice to get two different secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Start Server (30 sec)
```bash
npm run dev
```

You should see:
```
Server running on port 8000
MongoDB connected
```

### Step 4: Test Registration (1 min)
```powershell
# Register your first user
$body = @{
    fullName = "Admin User"
    email = "admin@example.com"
    password = "Admin123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/users/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Step 5: Make User Admin (1 min)
Open MongoDB Compass or shell:
```javascript
use your-database-name
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Step 6: Test Login (30 sec)
```powershell
$body = @{
    email = "admin@example.com"
    password = "Admin123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/users/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

## ✅ You're Ready!

Your authentication system is now running. You can:

1. **Register users** at `/register`
2. **Login** at `/login`
3. **Manage users** (admin) at `/admin/users`
4. **Update profiles** at `/profile`
5. **Change passwords** at `/change-password`

## Next Steps

1. **Read Documentation**
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Full API reference
   - [TESTING_GUIDE.md](./TESTING_GUIDE.md) - How to test endpoints
   - [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What's implemented

2. **Test All Endpoints**
   - Install Thunder Client in VS Code
   - Follow [TESTING_GUIDE.md](./TESTING_GUIDE.md)

3. **Integrate with Frontend**
   - Use `http://localhost:8000/api/v1/users` as base URL
   - Tokens handled automatically via cookies
   - Or use Authorization header

## Troubleshooting

### Server won't start
- Check MongoDB is running
- Check `.env` file exists and has correct values
- Check port 8000 is not in use

### Cannot connect to MongoDB
- Ensure MongoDB service is running:
  ```bash
  # Check if MongoDB is running
  Get-Service -Name MongoDB
  ```
- Check MONGODB_URI in `.env`

### Invalid token errors
- Generate new secrets in `.env`
- Restart server
- Login again to get new tokens

### "Unauthorized request"
- Include token in Authorization header: `Bearer <token>`
- Or ensure cookies are enabled in your HTTP client

## Quick Commands Reference

```bash
# Start server
npm run dev

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Check MongoDB connection (PowerShell)
mongosh --eval "db.adminCommand('ping')"
```

## API Base URL
```
http://localhost:8000/api/v1/users
```

## Default Configuration
- Port: 8000
- Access Token Expiry: 1 day
- Refresh Token Expiry: 7 days
- Password Hash Rounds: 10

---

**Need Help?** Check the full documentation files in the backend directory.
