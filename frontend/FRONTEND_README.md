# Frontend - Purple Merit Technologies

Complete React frontend application with authentication, user management, and admin dashboard.

## Features Implemented

### Authentication
✅ Login page with email/password  
✅ Signup page with full validation  
✅ Client-side form validation  
✅ Email format validation  
✅ Password strength validation (8+ chars, uppercase, lowercase, number, special char)  
✅ Password confirmation matching  
✅ Server-side error display  
✅ Auto-redirect on success/failure  
✅ Links between login/signup  

### Admin Dashboard
✅ Table displaying all users  
✅ Columns: email, full name, role, status, actions, created date  
✅ Pagination (10 users per page)  
✅ Search functionality (name/email)  
✅ Filter by status (active/inactive)  
✅ Activate user button  
✅ Deactivate user button  
✅ Confirmation dialog before actions  
✅ Success/error notifications  

### User Profile Page
✅ Display user information  
✅ Edit full name and email  
✅ Change password section  
✅ Current password verification  
✅ Password strength indicator  
✅ Save and cancel buttons  
✅ Success/error messages  

### Navigation Bar
✅ Display logged-in user name  
✅ Display user role badge  
✅ Role-based navigation links  
✅ Admin-only dashboard link  
✅ Profile link for all users  
✅ Logout button  
✅ Redirect to login after logout  

### Protected Routes
✅ Prevent unauthenticated access  
✅ Admin-only pages restricted to admins  
✅ Auto-redirect to login for unauthorized users  
✅ Auto-redirect admins/users to appropriate pages  

### UI Components
✅ Input fields with validation messages  
✅ Password visibility toggle  
✅ Primary action buttons  
✅ Secondary action buttons  
✅ Destructive action buttons (danger)  
✅ Loading spinners during API calls  
✅ Toast notifications (success/error/info)  
✅ Modal dialogs for confirmations  
✅ Pagination for tables  
✅ Clear error messages  
✅ Responsive design (desktop & mobile)  

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Button/              # Reusable button component
│   │   ├── Input/               # Input with validation
│   │   ├── Modal/               # Confirmation modals
│   │   ├── Spinner/             # Loading indicators
│   │   ├── Navbar/              # Navigation bar
│   │   └── ProtectedRoute/      # Route protection
│   ├── pages/
│   │   ├── Login/               # Login page
│   │   ├── Signup/              # Signup page
│   │   ├── Dashboard/           # Admin dashboard
│   │   └── Profile/             # User profile
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── config/
│   │   └── api.js               # API configuration
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # Global styles
│   ├── main.jsx                 # Entry point
│   └── index.css                # Base styles
├── package.json
└── README.md
```

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:5173
   ```

## Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "react-toastify": "^10.x"
}
```

## API Integration

### Base URL Configuration
File: `src/config/api.js`
```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

### Authentication
- Automatic token management via localStorage
- HTTP-only cookies support
- Token refresh on 401 errors
- Auto-logout on refresh failure

### API Services

**Auth Service:**
- `register(userData)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Logout user
- `getCurrentUser()` - Get current user

**User Service:**
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update profile
- `changePassword(data)` - Change password

**Admin Service:**
- `getAllUsers(params)` - Get all users with pagination
- `activateUser(userId)` - Activate user
- `deactivateUser(userId)` - Deactivate user

## Pages

### Login (`/login`)
- Email and password inputs
- Form validation
- Error messages
- Link to signup
- Auto-redirect to dashboard on success

### Signup (`/signup`)
- Full name, email, password, confirm password
- Real-time password strength indicator
- All validations
- Link to login
- Auto-redirect to login on success

### Dashboard (`/dashboard`) - Admin Only
- User management table
- Search by name/email
- Filter by status
- Activate/deactivate users
- Pagination

### Profile (`/profile`) - All Users
- View/edit profile information
- Change password
- Role and status badges
- Success/error notifications

## Routing

```javascript
/ → /login (redirect)
/login → Login page
/signup → Signup page
/dashboard → Admin dashboard (protected, admin only)
/profile → User profile (protected)
* → /login (404 redirect)
```

## Protected Routes

```javascript
<ProtectedRoute>           // Requires authentication
<ProtectedRoute adminOnly> // Requires admin role
```

## Usage Examples

### 1. Register New User
1. Go to `/signup`
2. Fill in all fields
3. Password must meet requirements
4. Click "Sign Up"
5. Redirected to login

### 2. Login
1. Go to `/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected to dashboard (admin) or profile (user)

### 3. Admin - Manage Users
1. Login as admin
2. Go to `/dashboard`
3. Search/filter users
4. Click Activate/Deactivate
5. Confirm action in modal

### 4. Update Profile
1. Go to `/profile`
2. Click "Edit Profile"
3. Update name/email
4. Click "Save Changes"

### 5. Change Password
1. Go to `/profile`
2. Scroll to "Change Password"
3. Enter current and new password
4. Click "Change Password"

## Validation Rules

### Email
- Required field
- Must match email format: `user@domain.com`

### Password (Signup/Change Password)
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

### Full Name
- Required field
- Minimum 2 characters
- Maximum 100 characters

## Responsive Design

- **Desktop:** Full-width tables, side-by-side buttons
- **Tablet:** Adjusted spacing, flexible columns
- **Mobile:** Stacked layouts, full-width buttons, scrollable tables

## Toast Notifications

```javascript
toast.success('Operation successful!');
toast.error('Operation failed!');
toast.info('Information message');
```

## Error Handling

- Network errors → Error toast
- Validation errors → Field-level error messages
- 401 Unauthorized → Auto-redirect to login
- 403 Forbidden → Redirect to profile
- Server errors → User-friendly messages

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment

The frontend connects to the backend at:
```
http://localhost:8000/api/v1
```

Make sure backend is running before starting frontend!

## Testing Flow

1. **Start Backend:** `cd backend && npm run dev`
2. **Start Frontend:** `cd frontend && npm run dev`
3. **Create Admin User:** (See backend documentation)
4. **Test Features:**
   - Register new user
   - Login as user
   - View/update profile
   - Login as admin
   - Manage users in dashboard
   - Activate/deactivate users
   - Search and filter

## Features Highlights

### Real-time Feedback
- Loading states on all async operations
- Instant validation feedback
- Progress indicators

### User Experience
- Smooth animations and transitions
- Clear error messages
- Confirmation dialogs for destructive actions
- Auto-save on successful operations

### Security
- Protected routes
- Role-based access control
- Automatic token refresh
- Secure logout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps

1. Start both backend and frontend servers
2. Create an admin user in MongoDB
3. Login and test all features
4. Customize colors and branding as needed

---

**Purple Merit Technologies** - Complete Authentication & User Management System
