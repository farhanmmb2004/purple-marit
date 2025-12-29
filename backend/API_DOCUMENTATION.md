# Authentication & User Management API Documentation

## Base URL
```
http://localhost:8000/api/v1/users
```

## Table of Contents
1. [Authentication](#authentication)
2. [User Profile Management](#user-profile-management)
3. [Admin Functions](#admin-functions)
4. [Error Handling](#error-handling)

---

## Authentication

### 1. Register User
Create a new user account with email and password.

**Endpoint:** `POST /register`

**Access:** Public

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `fullName`: Required, 2-100 characters
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters, must contain:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
  - At least one special character

**Success Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-12-29T10:00:00.000Z",
      "updatedAt": "2025-12-29T10:00:00.000Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User registered successfully",
  "success": true
}
```

**Cookies Set:**
- `accessToken` (httpOnly, secure in production)
- `refreshToken` (httpOnly, secure in production)

---

### 2. Login User
Authenticate existing user with email and password.

**Endpoint:** `POST /login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-12-29T10:00:00.000Z",
      "updatedAt": "2025-12-29T10:00:00.000Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User logged in successfully",
  "success": true
}
```

**Error Responses:**
- `401`: Invalid email or password
- `403`: Account deactivated

---

### 3. Logout User
Logout current user and clear tokens.

**Endpoint:** `POST /logout`

**Access:** Protected (Requires Authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```
OR cookies will be used automatically

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out successfully",
  "success": true
}
```

---

### 4. Get Current User
Get currently logged-in user information.

**Endpoint:** `GET /current-user`

**Access:** Protected (Requires Authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-12-29T10:00:00.000Z",
    "updatedAt": "2025-12-29T10:00:00.000Z"
  },
  "message": "User fetched successfully",
  "success": true
}
```

---

### 5. Refresh Access Token
Get a new access token using refresh token.

**Endpoint:** `POST /refresh-token`

**Access:** Public (but requires valid refresh token)

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```
OR refresh token from cookies

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  },
  "message": "Access token refreshed",
  "success": true
}
```

---

## User Profile Management

### 6. Get User Profile
Get own profile information.

**Endpoint:** `GET /profile`

**Access:** Protected (Requires Authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-12-29T10:00:00.000Z",
    "updatedAt": "2025-12-29T10:00:00.000Z"
  },
  "message": "Profile fetched successfully",
  "success": true
}
```

---

### 7. Update User Profile
Update own full name and/or email.

**Endpoint:** `PATCH /profile`

**Access:** Protected (Requires Authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "fullName": "John Updated Doe",
  "email": "john.updated@example.com"
}
```

**Notes:**
- At least one field (fullName or email) is required
- Email must be unique and not already in use

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Updated Doe",
    "email": "john.updated@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-12-29T10:00:00.000Z",
    "updatedAt": "2025-12-29T10:30:00.000Z"
  },
  "message": "Profile updated successfully",
  "success": true
}
```

**Error Responses:**
- `400`: At least one field required / Invalid email format
- `409`: Email already in use

---

### 8. Change Password
Change user password.

**Endpoint:** `POST /change-password`

**Access:** Protected (Requires Authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldSecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Validation Rules:**
- New password must meet same strength requirements as registration
- New password must be different from current password

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Password changed successfully",
  "success": true
}
```

**Error Responses:**
- `400`: Current password incorrect / New password same as current / Password strength validation failed

---

## Admin Functions

### 9. Get All Users
Get list of all users with pagination and filtering.

**Endpoint:** `GET /admin/users`

**Access:** Protected (Requires Admin Role)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `isActive` (optional): Filter by active status (true/false)
- `role` (optional): Filter by role (user/admin)
- `search` (optional): Search by name or email

**Example Request:**
```
GET /admin/users?page=1&limit=10&isActive=true&search=john
```

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "users": [
      {
        "_id": "user_id_1",
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2025-12-29T10:00:00.000Z",
        "updatedAt": "2025-12-29T10:00:00.000Z"
      },
      {
        "_id": "user_id_2",
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "role": "admin",
        "isActive": true,
        "createdAt": "2025-12-29T09:00:00.000Z",
        "updatedAt": "2025-12-29T09:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "limit": 10
    }
  },
  "message": "Users fetched successfully",
  "success": true
}
```

**Error Responses:**
- `403`: Access denied. Admin privileges required.

---

### 10. Activate User
Activate a deactivated user account.

**Endpoint:** `PATCH /admin/users/:userId/activate`

**Access:** Protected (Requires Admin Role)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `userId`: The ID of the user to activate

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-12-29T10:00:00.000Z",
    "updatedAt": "2025-12-29T11:00:00.000Z"
  },
  "message": "User activated successfully",
  "success": true
}
```

**Error Responses:**
- `400`: User is already active
- `403`: Access denied. Admin privileges required.
- `404`: User not found

---

### 11. Deactivate User
Deactivate an active user account.

**Endpoint:** `PATCH /admin/users/:userId/deactivate`

**Access:** Protected (Requires Admin Role)

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `userId`: The ID of the user to deactivate

**Success Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": false,
    "createdAt": "2025-12-29T10:00:00.000Z",
    "updatedAt": "2025-12-29T11:00:00.000Z"
  },
  "message": "User deactivated successfully",
  "success": true
}
```

**Error Responses:**
- `400`: User is already deactivated / Cannot deactivate own account
- `403`: Access denied. Admin privileges required.
- `404`: User not found

---

## Error Handling

### Error Response Format
All errors follow this consistent format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "success": false,
  "errors": [],
  "data": null
}
```

### Common HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input/validation error |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Access denied (insufficient permissions) |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

### Common Error Messages

**Authentication Errors:**
- "Unauthorized request" - No token provided
- "Invalid Access Token" - Token invalid or expired
- "Invalid email or password" - Login credentials incorrect
- "Account is deactivated" - User account has been disabled

**Validation Errors:**
- "Missing required fields: ..." - Required fields not provided
- "Invalid email format" - Email doesn't match required pattern
- "Password must be at least 8 characters long" - Password too short
- Plus other password strength requirements

**Authorization Errors:**
- "Access denied. Admin privileges required." - User is not admin

**Resource Errors:**
- "User not found" - User ID doesn't exist
- "Email is already in use" - Email already registered

---

## Authentication Flow

### 1. Using Cookies (Recommended)
Tokens are automatically sent via httpOnly cookies. No manual token management needed in frontend.

### 2. Using Authorization Header
Send token in header:
```
Authorization: Bearer <access_token>
```

### 3. Token Expiry
- **Access Token**: Expires in 1 day (configurable)
- **Refresh Token**: Expires in 7 days (configurable)

When access token expires, use the refresh token endpoint to get new tokens.

---

## Security Features Implemented

✅ Password hashing with bcrypt (10 rounds)
✅ JWT-based authentication
✅ HTTP-only cookies for token storage
✅ Role-based access control (admin/user)
✅ Email format validation
✅ Strong password validation
✅ Input sanitization
✅ Protected routes with authentication middleware
✅ Refresh token rotation
✅ Account activation/deactivation
✅ Consistent error responses
✅ Environment variables for secrets

---

## Setup Instructions

1. **Install Dependencies:**
```bash
cd backend
npm install
```

2. **Configure Environment Variables:**
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI`: MongoDB connection string
- `ACCESS_TOKEN_SECRET`: Secret for access tokens (use long random string)
- `REFRESH_TOKEN_SECRET`: Secret for refresh tokens (use different long random string)
- `ACCESS_TOKEN_EXPIRY`: e.g., "1d"
- `REFRESH_TOKEN_EXPIRY`: e.g., "7d"
- `CORS_ORIGIN`: Frontend URL
- `PORT`: Server port (default: 8000)

3. **Start Server:**
```bash
npm run dev
```

4. **Create First Admin User:**
You need to manually create the first admin user in MongoDB:
```javascript
// In MongoDB shell or compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```

**Get Current User:**
```bash
curl -X GET http://localhost:8000/api/v1/users/current-user \
  -b cookies.txt
```

### Using Postman or Thunder Client

1. Import the API endpoints
2. For authenticated requests, either:
   - Enable cookie storage in settings, OR
   - Copy the `accessToken` from login response and add to headers:
     ```
     Authorization: Bearer <your_access_token>
     ```

---

## Notes

- All timestamps are in ISO 8601 format
- Password is never returned in API responses
- Refresh tokens are cleared on logout and deactivation
- Deactivated users cannot login until reactivated by admin
- Admins cannot deactivate their own accounts
- All inputs are trimmed and sanitized before processing
