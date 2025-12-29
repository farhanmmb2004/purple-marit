# Purple Merit Technologies - User Authentication & Management System

## 📖 Project Overview

Purple Merit Technologies is a comprehensive full-stack web application featuring secure user authentication and role-based access control. The platform provides an intuitive interface for user management with distinct admin and user roles, complete profile management capabilities, and a modern, responsive design.

### Purpose
This application serves as a robust foundation for web applications requiring:
- Secure user authentication and authorization
- Role-based access control (Admin/User)
- User profile management
- Administrative dashboard for user oversight
- Real-time notifications and feedback

### Key Features
- ✅ JWT-based authentication with automatic token refresh
- ✅ Role-based access control (Admin & User roles)
- ✅ Secure password encryption using bcrypt
- ✅ Profile management with email and password updates
- ✅ Admin dashboard for user management (activate/deactivate users)
- ✅ Image upload to Cloudinary for avatars
- ✅ Real-time toast notifications
- ✅ Responsive design for all devices
- ✅ Server wake-up notification for Render hosting

---

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Encryption:** bcrypt
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **Security:** CORS, Cookie Parser
- **Validation:** Custom validation utilities
- **Development Tools:** Nodemon, Prettier

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Styling:** CSS3 with modular component styles
- **Linting:** ESLint
- **State Management:** Context API (AuthContext)

### DevOps & Deployment
- **Backend Hosting:** Render (with auto-sleep on free tier)
- **Frontend Hosting:** Vercel
- **Version Control:** Git
- **Environment Management:** dotenv

---

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account (for image uploads)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment variables file:**
   Create a `.env` file in the backend directory (see [Environment Variables](#environment-variables-backend) section below)

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The backend server will start at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API configuration (if needed):**
   Edit `frontend/src/config/api.js` to point to your backend URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000/api/v1';
   // or for production: 'https://your-backend-url.onrender.com/api/v1'
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will start at `http://localhost:5173`

### Running Both Servers

**Option 1: Separate Terminals**
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

**Option 2: Windows PowerShell**
```powershell
# Terminal 1 - Backend
cd "path\to\project\backend"
npm run dev

# Terminal 2 - Frontend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
cd "path\to\project\frontend"
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT Secrets (use strong, random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend

No environment variables required. API configuration is managed in `frontend/src/config/api.js`

**Production Configuration:**
Update `frontend/src/config/api.js`:
```javascript
const API_BASE_URL = 'https://purple-marit.onrender.com/api/v1';
```

---

## 🚀 Deployment Instructions

### Backend Deployment (Render)

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service:**
   - Connect your GitHub repository
   - Select the `backend` directory as root
   - Configure build settings:
     - **Build Command:** `npm install`
     - **Start Command:** `npm start` or `node src/index.js`
     - **Environment:** Node

3. **Add Environment Variables:**
   - Go to Environment tab in Render dashboard
   - Add all variables from `.env` file
   - Update `CORS_ORIGIN` to your frontend URL (e.g., `https://your-app.vercel.app`)

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend

5. **Note on Free Tier:**
   - Render free tier puts inactive services to sleep after 15 minutes
   - First request after sleep may take 30-50 seconds
   - The frontend includes automatic notification for server wake-up

### Frontend Deployment (Vercel)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import project:**
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root directory

3. **Configure build settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Update API URL:**
   - Before deploying, update `frontend/src/config/api.js` with your Render backend URL
   - Or add as environment variable in Vercel

5. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get your production URL (e.g., `https://your-app.vercel.app`)

6. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update `CORS_ORIGIN` environment variable with your Vercel URL
   - Redeploy backend if needed

### Deployment Checklist
- ✅ MongoDB Atlas database created and accessible
- ✅ Cloudinary account configured
- ✅ Backend deployed on Render with all environment variables
- ✅ Frontend deployed on Vercel
- ✅ Backend CORS_ORIGIN updated with frontend URL
- ✅ Frontend API_BASE_URL updated with backend URL
- ✅ Test registration, login, and all features

---

## 📡 API Documentation

### Base URL
**Development:** `http://localhost:8000/api/v1`  
**Production:** `https://purple-marit.onrender.com/api/v1`

All API endpoints are prefixed with `/api/v1/users`

### Authentication Endpoints

#### 1. Register User
**POST** `/users/register`

Creates a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Validation:**
- `fullName`: 2-100 characters
- `email`: Valid email format
- `password`: Min 8 chars (uppercase, lowercase, number, special character)

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User registered successfully",
  "success": true
}
```

---

#### 2. Login User
**POST** `/users/login`

Authenticates user with email and password.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User logged in successfully",
  "success": true
}
```

**Error Responses:**
- `401`: Invalid email or password
- `403`: Account deactivated by admin

---

#### 3. Logout User
**POST** `/users/logout`

Logs out current user and clears tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out successfully",
  "success": true
}
```

---

#### 4. Get Current User
**GET** `/users/current-user`

Retrieves currently logged-in user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isActive": true,
    "avatar": "cloudinary_url"
  },
  "message": "User fetched successfully",
  "success": true
}
```

---

#### 5. Refresh Access Token
**POST** `/users/refresh-token`

Generates new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_jwt_refresh_token"
  },
  "message": "Access token refreshed",
  "success": true
}
```

---

### User Profile Endpoints

#### 6. Get User Profile
**GET** `/users/profile`

Get detailed profile information for logged-in user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "avatar": "cloudinary_url",
    "isActive": true,
    "createdAt": "2025-12-29T10:00:00.000Z",
    "updatedAt": "2025-12-29T10:00:00.000Z"
  },
  "message": "Profile fetched successfully",
  "success": true
}
```

---

#### 7. Update User Profile
**PATCH** `/users/profile`

Update user's full name and email.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user",
    "isActive": true
  },
  "message": "Profile updated successfully",
  "success": true
}
```

**Error Responses:**
- `400`: Email already in use
- `400`: Validation error

---

#### 8. Change Password
**POST** `/users/change-password`

Change user's password with current password verification.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Password changed successfully",
  "success": true
}
```

**Error Responses:**
- `400`: Current password is incorrect
- `400`: New password doesn't meet requirements

---

### Admin Endpoints

#### 9. Get All Users (Admin Only)
**GET** `/users/admin/users`

Retrieve all users with pagination and filtering.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role (user/admin)
- `isActive`: Filter by status (true/false)
- `search`: Search by name or email

**Example Request:**
```
GET /users/admin/users?page=1&limit=10&role=user&search=john
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2025-12-29T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 47,
      "limit": 10
    }
  },
  "message": "Users fetched successfully",
  "success": true
}
```

---

#### 10. Activate User (Admin Only)
**PATCH** `/users/admin/users/:userId/activate`

Activate a deactivated user account.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**URL Parameters:**
- `userId`: MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "isActive": true
  },
  "message": "User activated successfully",
  "success": true
}
```

---

#### 11. Deactivate User (Admin Only)
**PATCH** `/users/admin/users/:userId/deactivate`

Deactivate a user account (prevent login).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**URL Parameters:**
- `userId`: MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "isActive": false
  },
  "message": "User deactivated successfully",
  "success": true
}
```

**Error Responses:**
- `403`: Cannot deactivate admin accounts
- `404`: User not found

---

### Error Response Format

All errors follow this format:

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message describing what went wrong",
  "success": false,
  "errors": []
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate email)
- `500`: Internal Server Error

---

## 📁 Project Structure

```
purple-marit/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   └── user.controller.js
│   │   ├── models/            # Database schemas
│   │   │   └── user.model.js
│   │   ├── routes/            # API routes
│   │   │   └── user.routes.js
│   │   ├── middlewares/       # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── cloudinary.js
│   │   │   └── validation.js
│   │   ├── db/                # Database connection
│   │   │   └── index.js
│   │   ├── constants.js       # App constants
│   │   ├── app.js            # Express app setup
│   │   └── index.js          # Entry point
│   ├── public/temp/          # Temporary file uploads
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Navbar/
│   │   │   ├── ProtectedRoute/
│   │   │   └── Spinner/
│   │   ├── pages/             # Page components
│   │   │   ├── Login/
│   │   │   ├── Signup/
│   │   │   ├── Dashboard/
│   │   │   └── Profile/
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   ├── config/            # Configuration
│   │   │   └── api.js
│   │   ├── assets/            # Static assets
│   │   ├── App.jsx            # Root component
│   │   ├── App.css
│   │   ├── main.jsx           # Entry point
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── README.md                  # This file
```

---

## 🎯 Features in Detail

### Authentication System
- **JWT Token Management:** Dual-token system (access + refresh) for enhanced security
- **Auto Token Refresh:** Automatic token refresh on expiration using interceptors
- **Secure Storage:** httpOnly cookies for token storage in production
- **Password Security:** bcrypt hashing with salt rounds for password protection

### Role-Based Access Control
- **Admin Role:** Full access to user management dashboard
- **User Role:** Access to personal profile and settings
- **Protected Routes:** Client-side route protection using React Router
- **API Authorization:** Server-side middleware for endpoint protection

### User Profile Management
- **Profile Viewing:** Display user information and statistics
- **Profile Editing:** Update name and email with validation
- **Password Change:** Secure password update with current password verification
- **Avatar Upload:** Image upload to Cloudinary with automatic optimization

### Admin Dashboard
- **User List:** Paginated view of all registered users
- **Search & Filter:** Search users by name/email, filter by role/status
- **User Management:** Activate or deactivate user accounts
- **Statistics:** Overview of total users, active users, admins

### User Experience
- **Toast Notifications:** Real-time feedback for all actions
- **Loading States:** Spinners and disabled states during API calls
- **Error Handling:** Graceful error messages with helpful information
- **Responsive Design:** Mobile-first design approach
- **Server Wake-up Alert:** Notification when Render backend is starting (5-second threshold)

---

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server with nodemon
```

**Frontend:**
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Testing
- Test all authentication flows (register, login, logout)
- Verify token refresh mechanism
- Test role-based access control
- Validate form inputs and error handling
- Test admin user management features
- Verify responsive design on multiple devices

---

## 🤝 Contributing

This is a private project for Purple Merit Technologies. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

ISC License - Purple Merit Technologies

---

## 👥 Author

**Purple Merit Technologies Team**

---

## 📞 Support

For issues or questions regarding this application, please contact the Purple Merit Technologies development team.

---

## 🎓 Learning Resources

This project demonstrates:
- Modern React development with Vite
- Express.js REST API development
- MongoDB integration with Mongoose
- JWT authentication implementation
- Role-based access control
- Cloud file storage with Cloudinary
- Deployment on Render and Vercel
- Environment-based configuration
- Error handling best practices
- Security best practices for web applications

---

**Last Updated:** December 29, 2025
