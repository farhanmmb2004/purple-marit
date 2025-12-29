# API Testing Guide

## Using Thunder Client / Postman

### Setup
1. Install Thunder Client extension in VS Code (or use Postman)
2. Create a new Collection called "Auth API"
3. Set base URL as environment variable: `http://localhost:8000/api/v1/users`

---

## Test Sequence

### 1. Register User
**Method:** POST  
**URL:** `{{baseUrl}}/register`  
**Body (JSON):**
```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Expected Response:** 201 Created
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Test User",
      "email": "test@example.com",
      "role": "user",
      "isActive": true
    },
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "User registered successfully",
  "success": true
}
```

**Save:** Copy `accessToken` for next requests

---

### 2. Test Weak Password (Should Fail)
**Method:** POST  
**URL:** `{{baseUrl}}/register`  
**Body:**
```json
{
  "fullName": "Test User 2",
  "email": "test2@example.com",
  "password": "weak"
}
```

**Expected Response:** 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Password must be at least 8 characters long, ...",
  "success": false
}
```

---

### 3. Login User
**Method:** POST  
**URL:** `{{baseUrl}}/login`  
**Body:**
```json
{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Expected Response:** 200 OK with user data and tokens

---

### 4. Get Current User (Protected)
**Method:** GET  
**URL:** `{{baseUrl}}/current-user`  
**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Expected Response:** 200 OK with user data

---

### 5. Update Profile
**Method:** PATCH  
**URL:** `{{baseUrl}}/profile`  
**Headers:**
```
Authorization: Bearer <your_access_token>
```
**Body:**
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com"
}
```

**Expected Response:** 200 OK with updated user

---

### 6. Change Password
**Method:** POST  
**URL:** `{{baseUrl}}/change-password`  
**Headers:**
```
Authorization: Bearer <your_access_token>
```
**Body:**
```json
{
  "currentPassword": "TestPass123!",
  "newPassword": "NewTestPass456!"
}
```

**Expected Response:** 200 OK

---

### 7. Logout
**Method:** POST  
**URL:** `{{baseUrl}}/logout`  
**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Expected Response:** 200 OK

---

## Admin Tests

### 8. Create Admin User
First, register a new user, then update in MongoDB:

**MongoDB Command:**
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or register then update your test user:
```javascript
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

---

### 9. Login as Admin
**Method:** POST  
**URL:** `{{baseUrl}}/login`  
**Body:**
```json
{
  "email": "test@example.com",
  "password": "NewTestPass456!"
}
```

**Save:** Admin access token

---

### 10. Get All Users (Admin Only)
**Method:** GET  
**URL:** `{{baseUrl}}/admin/users?page=1&limit=10`  
**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Expected Response:** 200 OK with paginated user list

---

### 11. Get All Users with Search
**Method:** GET  
**URL:** `{{baseUrl}}/admin/users?search=test&isActive=true`  
**Headers:**
```
Authorization: Bearer <admin_access_token>
```

---

### 12. Deactivate User (Admin)
**Method:** PATCH  
**URL:** `{{baseUrl}}/admin/users/<user_id>/deactivate`  
**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Expected Response:** 200 OK

---

### 13. Activate User (Admin)
**Method:** PATCH  
**URL:** `{{baseUrl}}/admin/users/<user_id>/activate`  
**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Expected Response:** 200 OK

---

## Error Tests

### 14. Access Protected Route Without Token
**Method:** GET  
**URL:** `{{baseUrl}}/current-user`  
**Headers:** (none)

**Expected Response:** 401 Unauthorized

---

### 15. Access Admin Route as Regular User
**Method:** GET  
**URL:** `{{baseUrl}}/admin/users`  
**Headers:**
```
Authorization: Bearer <regular_user_token>
```

**Expected Response:** 403 Forbidden

---

### 16. Login with Wrong Password
**Method:** POST  
**URL:** `{{baseUrl}}/login`  
**Body:**
```json
{
  "email": "test@example.com",
  "password": "WrongPassword123!"
}
```

**Expected Response:** 401 Unauthorized

---

### 17. Duplicate Email Registration
**Method:** POST  
**URL:** `{{baseUrl}}/register`  
**Body:**
```json
{
  "fullName": "Another User",
  "email": "test@example.com",
  "password": "AnotherPass123!"
}
```

**Expected Response:** 409 Conflict

---

## PowerShell Testing Scripts

### Register User
```powershell
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/users/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Login User
```powershell
$body = @{
    email = "test@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/users/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -SessionVariable session

$data = $response.Content | ConvertFrom-Json
$token = $data.data.accessToken
Write-Host "Access Token: $token"
```

### Get Current User
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/users/current-user" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}
```

### Get All Users (Admin)
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/users/admin/users?page=1&limit=10" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}
```

---

## Checklist

### Basic Authentication
- [ ] User can register with valid data
- [ ] Registration fails with weak password
- [ ] Registration fails with invalid email
- [ ] Registration fails with duplicate email
- [ ] User can login with correct credentials
- [ ] Login fails with wrong password
- [ ] User can logout
- [ ] User can get their own info

### User Profile
- [ ] User can view their profile
- [ ] User can update their name
- [ ] User can update their email
- [ ] Email update fails if email exists
- [ ] User can change password
- [ ] Password change fails with wrong current password
- [ ] Password change fails with weak new password

### Admin Functions
- [ ] Admin can view all users
- [ ] Pagination works correctly
- [ ] Search functionality works
- [ ] Filter by active status works
- [ ] Admin can activate user
- [ ] Admin can deactivate user
- [ ] Admin cannot deactivate themselves
- [ ] Regular user cannot access admin routes

### Security
- [ ] Protected routes require authentication
- [ ] Invalid token is rejected
- [ ] Admin routes require admin role
- [ ] Password is never in responses
- [ ] Deactivated user cannot login
- [ ] Tokens are stored in httpOnly cookies
- [ ] All errors have consistent format

---

## Notes

1. **Token Storage**: Tokens are automatically stored in httpOnly cookies. You can also use the Authorization header.

2. **Testing Tools**: 
   - Thunder Client (VS Code Extension)
   - Postman
   - cURL
   - PowerShell Invoke-WebRequest

3. **MongoDB GUI**: Use MongoDB Compass to view/edit data directly

4. **Environment**: Make sure MongoDB is running and .env is configured

5. **First Admin**: Must be created manually in database after registration

---

## Common Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Request succeeded |
| 201 | Created | User registered |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Not admin |
| 404 | Not Found | User doesn't exist |
| 409 | Conflict | Email exists |
| 500 | Server Error | Something broke |
