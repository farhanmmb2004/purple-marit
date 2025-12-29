# Unit & Integration Tests for Backend APIs

## 📚 Overview

This document provides comprehensive information about unit and integration testing for the Purple Merit Technologies backend API. It covers testing strategies, frameworks, setup instructions, and example test cases.

---

## 🎯 Testing Strategy

### Testing Pyramid
```
        /\
       /  \
      / E2E \         End-to-End Tests (10%)
     /______\
    /        \
   /Integration\      Integration Tests (30%)
  /____________\
 /              \
/  Unit Tests    \    Unit Tests (60%)
/__________________\
```

### Test Coverage Goals
- **Unit Tests:** 80%+ code coverage
- **Integration Tests:** All API endpoints
- **Critical Paths:** 100% coverage for authentication & authorization

---

## 🛠 Testing Frameworks & Tools

### Core Testing Stack
- **Test Runner:** Jest / Mocha
- **Assertion Library:** Chai / Jest Assertions
- **HTTP Testing:** Supertest
- **Mocking:** Sinon / Jest Mocks
- **Code Coverage:** Istanbul (NYC)
- **Test Database:** MongoDB Memory Server

### Installation

```bash
cd backend
npm install --save-dev jest supertest @types/jest
npm install --save-dev mongodb-memory-server
npm install --save-dev @shelf/jest-mongodb
```

Or for Mocha/Chai setup:
```bash
npm install --save-dev mocha chai supertest
npm install --save-dev sinon
npm install --save-dev nyc
```

---

## ⚙️ Configuration

### Jest Configuration (jest.config.js)

```javascript
export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/constants.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:coverage": "jest --coverage --coverageReporters=html",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

---

## 📁 Test Structure

```
backend/
├── tests/
│   ├── setup.js                    # Test setup and teardown
│   ├── fixtures/                   # Test data
│   │   ├── users.js
│   │   └── tokens.js
│   ├── unit/                       # Unit tests
│   │   ├── utils/
│   │   │   ├── ApiError.test.js
│   │   │   ├── ApiResponse.test.js
│   │   │   ├── validation.test.js
│   │   │   └── asyncHandler.test.js
│   │   ├── models/
│   │   │   └── user.model.test.js
│   │   └── middlewares/
│   │       └── auth.middleware.test.js
│   └── integration/                # Integration tests
│       ├── auth.test.js
│       ├── profile.test.js
│       └── admin.test.js
```

---

## 🧪 Unit Tests

### 1. Testing Utility Functions

#### Example: ApiError Utility Test

**File:** `tests/unit/utils/ApiError.test.js`

```javascript
import { ApiError } from '../../../src/utils/ApiError.js';

describe('ApiError Utility', () => {
  test('should create error with correct status code', () => {
    const error = new ApiError(404, 'Resource not found');
    
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Resource not found');
    expect(error.success).toBe(false);
  });

  test('should create error with default values', () => {
    const error = new ApiError(500);
    
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Something went wrong');
    expect(error.errors).toEqual([]);
  });

  test('should include errors array', () => {
    const errors = ['Error 1', 'Error 2'];
    const error = new ApiError(400, 'Validation failed', errors);
    
    expect(error.errors).toEqual(errors);
  });

  test('should have Error prototype', () => {
    const error = new ApiError(400, 'Bad request');
    
    expect(error instanceof Error).toBe(true);
    expect(error.name).toBe('Error');
  });
});
```

#### Example: Validation Utility Test

**File:** `tests/unit/utils/validation.test.js`

```javascript
import { validateEmail, validatePassword } from '../../../src/utils/validation.js';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    test('should accept valid email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should accept strong password', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
    });

    test('should reject password without uppercase', () => {
      const result = validatePassword('weakpass123!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    test('should reject password without numbers', () => {
      const result = validatePassword('WeakPassword!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('number');
    });

    test('should reject short password', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('8 characters');
    });
  });
});
```

### 2. Testing Models

#### Example: User Model Test

**File:** `tests/unit/models/user.model.test.js`

```javascript
import mongoose from 'mongoose';
import { User } from '../../../src/models/user.model.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('User Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('should create user with valid data', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    };

    const user = await User.create(userData);

    expect(user.fullName).toBe(userData.fullName);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Should be hashed
    expect(user.role).toBe('user'); // Default role
    expect(user.isActive).toBe(true); // Default active
  });

  test('should hash password before saving', async () => {
    const user = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'PlainPassword123!'
    });

    await user.save();

    expect(user.password).not.toBe('PlainPassword123!');
    expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
  });

  test('should validate password correctly', async () => {
    const password = 'TestPass123!';
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: password
    });

    const isValid = await user.isPasswordCorrect(password);
    expect(isValid).toBe(true);

    const isInvalid = await user.isPasswordCorrect('WrongPassword');
    expect(isInvalid).toBe(false);
  });

  test('should generate access token', async () => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    });

    const token = user.generateAccessToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT format
  });

  test('should generate refresh token', async () => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    });

    const token = user.generateRefreshToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should reject duplicate email', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    };

    await User.create(userData);

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should require fullName', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'TestPass123!'
    });

    await expect(user.save()).rejects.toThrow();
  });
});
```

### 3. Testing Middleware

#### Example: Auth Middleware Test

**File:** `tests/unit/middlewares/auth.middleware.test.js`

```javascript
import jwt from 'jsonwebtoken';
import { verifyJWT, isAdmin } from '../../../src/middlewares/auth.middleware.js';
import { User } from '../../../src/models/user.model.js';
import { ApiError } from '../../../src/utils/ApiError.js';

jest.mock('../../../src/models/user.model.js');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {},
      user: null
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyJWT', () => {
    test('should authenticate valid token from header', async () => {
      const userId = 'user123';
      const token = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;
      
      const mockUser = {
        _id: userId,
        fullName: 'Test User',
        email: 'test@example.com'
      };
      
      User.findById.mockResolvedValue(mockUser);

      await verifyJWT(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledWith();
    });

    test('should authenticate valid token from cookies', async () => {
      const userId = 'user123';
      const token = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET);
      
      req.cookies.accessToken = token;
      
      const mockUser = { _id: userId };
      User.findById.mockResolvedValue(mockUser);

      await verifyJWT(req, res, next);

      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalledWith();
    });

    test('should reject request without token', async () => {
      await verifyJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    test('should reject invalid token', async () => {
      req.headers.authorization = 'Bearer invalid_token';

      await verifyJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  describe('isAdmin', () => {
    test('should allow admin users', async () => {
      req.user = { role: 'admin' };

      await isAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should reject non-admin users', async () => {
      req.user = { role: 'user' };

      await isAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(403);
    });
  });
});
```

---

## 🔗 Integration Tests

### Test Setup

**File:** `tests/setup.js`

```javascript
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const setupTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
};

export const teardownTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

afterEach(async () => {
  await clearTestDB();
});
```

### Test Fixtures

**File:** `tests/fixtures/users.js`

```javascript
export const validUser = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123!'
};

export const adminUser = {
  fullName: 'Admin User',
  email: 'admin@example.com',
  password: 'AdminPass123!',
  role: 'admin'
};

export const invalidPasswords = [
  'short',           // Too short
  'nouppercase1!',   // No uppercase
  'NOLOWERCASE1!',   // No lowercase
  'NoNumbers!',      // No numbers
  'NoSpecial123'     // No special char
];
```

### 1. Authentication API Tests

**File:** `tests/integration/auth.test.js`

```javascript
import request from 'supertest';
import app from '../../src/app.js';
import { User } from '../../src/models/user.model.js';
import { validUser, adminUser } from '../fixtures/users.js';

describe('Authentication API', () => {
  describe('POST /api/v1/users/register', () => {
    test('should register new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send(validUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(validUser.email);
      expect(res.body.data.user.fullName).toBe(validUser.fullName);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      
      // Verify user in database
      const user = await User.findOne({ email: validUser.email });
      expect(user).toBeDefined();
    });

    test('should set cookies on registration', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send(validUser);

      expect(res.headers['set-cookie']).toBeDefined();
    });

    test('should reject duplicate email', async () => {
      await User.create(validUser);

      const res = await request(app)
        .post('/api/v1/users/register')
        .send(validUser)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    test('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          ...validUser,
          password: 'weak'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          ...validUser,
          email: 'invalid-email'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: validUser.email
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/users/login', () => {
    beforeEach(async () => {
      await User.create(validUser);
    });

    test('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: validUser.email,
          password: validUser.password
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(validUser.email);
      expect(res.body.data.accessToken).toBeDefined();
    });

    test('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: validUser.email,
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    test('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: validUser.password
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    test('should reject login for deactivated user', async () => {
      await User.findOneAndUpdate(
        { email: validUser.email },
        { isActive: false }
      );

      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: validUser.email,
          password: validUser.password
        })
        .expect(403);

      expect(res.body.message).toContain('deactivated');
    });
  });

  describe('POST /api/v1/users/logout', () => {
    let accessToken;

    beforeEach(async () => {
      const user = await User.create(validUser);
      accessToken = user.generateAccessToken();
    });

    test('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    test('should reject logout without token', async () => {
      await request(app)
        .post('/api/v1/users/logout')
        .expect(401);
    });
  });

  describe('GET /api/v1/users/current-user', () => {
    let accessToken;

    beforeEach(async () => {
      const user = await User.create(validUser);
      accessToken = user.generateAccessToken();
    });

    test('should get current user data', async () => {
      const res = await request(app)
        .get('/api/v1/users/current-user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.email).toBe(validUser.email);
    });

    test('should reject without token', async () => {
      await request(app)
        .get('/api/v1/users/current-user')
        .expect(401);
    });
  });

  describe('POST /api/v1/users/refresh-token', () => {
    let refreshToken;

    beforeEach(async () => {
      const user = await User.create(validUser);
      refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save();
    });

    test('should refresh access token', async () => {
      const res = await request(app)
        .post('/api/v1/users/refresh-token')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    test('should reject invalid refresh token', async () => {
      await request(app)
        .post('/api/v1/users/refresh-token')
        .send({ refreshToken: 'invalid_token' })
        .expect(401);
    });
  });
});
```

### 2. Profile API Tests

**File:** `tests/integration/profile.test.js`

```javascript
import request from 'supertest';
import app from '../../src/app.js';
import { User } from '../../src/models/user.model.js';
import { validUser } from '../fixtures/users.js';

describe('Profile API', () => {
  let accessToken;
  let userId;

  beforeEach(async () => {
    const user = await User.create(validUser);
    userId = user._id;
    accessToken = user.generateAccessToken();
  });

  describe('GET /api/v1/users/profile', () => {
    test('should get user profile', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.email).toBe(validUser.email);
      expect(res.body.data.fullName).toBe(validUser.fullName);
    });

    test('should reject without authentication', async () => {
      await request(app)
        .get('/api/v1/users/profile')
        .expect(401);
    });
  });

  describe('PATCH /api/v1/users/profile', () => {
    test('should update profile successfully', async () => {
      const updates = {
        fullName: 'Updated Name',
        email: 'updated@example.com'
      };

      const res = await request(app)
        .patch('/api/v1/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updates)
        .expect(200);

      expect(res.body.data.fullName).toBe(updates.fullName);
      expect(res.body.data.email).toBe(updates.email);

      // Verify in database
      const user = await User.findById(userId);
      expect(user.fullName).toBe(updates.fullName);
    });

    test('should reject duplicate email', async () => {
      await User.create({
        fullName: 'Other User',
        email: 'other@example.com',
        password: 'Test123!'
      });

      await request(app)
        .patch('/api/v1/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'other@example.com' })
        .expect(400);
    });
  });

  describe('POST /api/v1/users/change-password', () => {
    test('should change password successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: validUser.password,
          newPassword: 'NewPassword123!'
        })
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify can login with new password
      const loginRes = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: validUser.email,
          password: 'NewPassword123!'
        })
        .expect(200);

      expect(loginRes.body.success).toBe(true);
    });

    test('should reject wrong current password', async () => {
      await request(app)
        .post('/api/v1/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewPassword123!'
        })
        .expect(400);
    });

    test('should reject weak new password', async () => {
      await request(app)
        .post('/api/v1/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: validUser.password,
          newPassword: 'weak'
        })
        .expect(400);
    });
  });
});
```

### 3. Admin API Tests

**File:** `tests/integration/admin.test.js`

```javascript
import request from 'supertest';
import app from '../../src/app.js';
import { User } from '../../src/models/user.model.js';
import { validUser, adminUser } from '../fixtures/users.js';

describe('Admin API', () => {
  let adminToken;
  let userToken;
  let regularUserId;

  beforeEach(async () => {
    const admin = await User.create(adminUser);
    adminToken = admin.generateAccessToken();

    const user = await User.create(validUser);
    userToken = user.generateAccessToken();
    regularUserId = user._id;
  });

  describe('GET /api/v1/users/admin/users', () => {
    test('should get all users for admin', async () => {
      const res = await request(app)
        .get('/api/v1/users/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.users).toHaveLength(2);
      expect(res.body.data.pagination).toBeDefined();
    });

    test('should support pagination', async () => {
      // Create multiple users
      for (let i = 0; i < 15; i++) {
        await User.create({
          fullName: `User ${i}`,
          email: `user${i}@example.com`,
          password: 'Test123!'
        });
      }

      const res = await request(app)
        .get('/api/v1/users/admin/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.users.length).toBeLessThanOrEqual(10);
      expect(res.body.data.pagination.totalPages).toBeGreaterThan(1);
    });

    test('should support filtering by role', async () => {
      const res = await request(app)
        .get('/api/v1/users/admin/users?role=admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.users).toHaveLength(1);
      expect(res.body.data.users[0].role).toBe('admin');
    });

    test('should reject non-admin users', async () => {
      await request(app)
        .get('/api/v1/users/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('PATCH /api/v1/users/admin/users/:userId/deactivate', () => {
    test('should deactivate user', async () => {
      const res = await request(app)
        .patch(`/api/v1/users/admin/users/${regularUserId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.isActive).toBe(false);

      // Verify user cannot login
      await request(app)
        .post('/api/v1/users/login')
        .send({
          email: validUser.email,
          password: validUser.password
        })
        .expect(403);
    });

    test('should reject deactivating admin', async () => {
      const admin = await User.findOne({ role: 'admin' });

      await request(app)
        .patch(`/api/v1/users/admin/users/${admin._id}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });
  });

  describe('PATCH /api/v1/users/admin/users/:userId/activate', () => {
    beforeEach(async () => {
      await User.findByIdAndUpdate(regularUserId, { isActive: false });
    });

    test('should activate deactivated user', async () => {
      const res = await request(app)
        .patch(`/api/v1/users/admin/users/${regularUserId}/activate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.isActive).toBe(true);

      // Verify user can login
      await request(app)
        .post('/api/v1/users/login')
        .send({
          email: validUser.email,
          password: validUser.password
        })
        .expect(200);
    });
  });
});
```

---

## ▶️ Running Tests

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Tests for CI/CD
```bash
npm run test:ci
```

---

## 📊 Coverage Reports

### View Coverage
After running tests with coverage:
```bash
open coverage/index.html  # macOS
start coverage/index.html  # Windows
```

### Coverage Thresholds

Add to `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

---

## 🎯 Best Practices

### 1. Test Organization
- ✅ One test file per source file
- ✅ Group related tests using `describe`
- ✅ Use clear, descriptive test names
- ✅ Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Independence
- ✅ Each test should run independently
- ✅ Clean up database after each test
- ✅ Don't rely on test execution order
- ✅ Use `beforeEach` and `afterEach` for setup/teardown

### 3. Test Data
- ✅ Use fixtures for reusable test data
- ✅ Don't use production data in tests
- ✅ Create minimal data needed for each test

### 4. Mocking
- ✅ Mock external dependencies
- ✅ Don't mock what you're testing
- ✅ Use real database for integration tests
- ✅ Mock third-party services (Cloudinary, email)

### 5. Assertions
- ✅ Test one thing per test
- ✅ Use specific assertions
- ✅ Test both success and failure cases
- ✅ Verify side effects (database changes, etc.)

---

## 🐛 Debugging Tests

### Run Single Test File
```bash
npm test -- auth.test.js
```

### Run Single Test
```bash
npm test -- -t "should register new user"
```

### Debug with Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome.

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          directory: ./backend/coverage
```

---

## 📚 Additional Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

### Testing Guides
- [Testing Node.js Applications](https://nodejs.org/en/docs/guides/testing/)
- [Integration Testing Best Practices](https://testingjavascript.com/)

---

## ✅ Testing Checklist

- [ ] Unit tests for all utilities
- [ ] Unit tests for all models
- [ ] Unit tests for all middleware
- [ ] Integration tests for all API endpoints
- [ ] Test authentication flows
- [ ] Test authorization (role-based access)
- [ ] Test error handling
- [ ] Test input validation
- [ ] Test edge cases
- [ ] Achieve 80%+ code coverage
- [ ] Set up CI/CD pipeline
- [ ] Document all test cases

---

**Last Updated:** December 29, 2025
