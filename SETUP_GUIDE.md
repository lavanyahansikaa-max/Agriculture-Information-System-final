# KrishiSetu Frontend-Backend-Database Connection Guide

## Overview
This document describes how the frontend, backend, and database are connected in the KrishiSetu Agriculture Information System.

## Architecture

```
Frontend (React/Vite)
    ↓
API Client (src/react-app/lib/api.ts)
    ↓
Backend (Hono.js on Cloudflare Workers)
    ↓
Database (Cloudflare D1 SQLite)
```

## Components

### 1. **Database Layer** (Cloudflare D1)
- **Location**: Configured in `wrangler.json`
- **Type**: SQLite database
- **Tables**:
  - `users` - User accounts and authentication
  - `farmer_profiles` - Farmer-specific information
  - `schemes` - Government agricultural schemes

### 2. **Backend Layer** (Hono.js)
- **Location**: `src/worker/index.ts`
- **Type**: Cloudflare Workers serverless function
- **Framework**: Hono.js (lightweight web framework)

#### API Endpoints:

**Authentication**
- `POST /api/auth/register` - Register new user
  - Request: `{ email, password, name }`
  - Response: `{ success, message, user }`

- `POST /api/auth/login` - Login user
  - Request: `{ email, password }`
  - Response: `{ success, message, user }`

**Farmer Profile**
- `GET /api/farmer/profile` - Get farmer profile
  - Headers: `X-User-ID: <userId>`
  - Response: `{ success, data }`

- `PUT /api/farmer/profile` - Update farmer profile
  - Headers: `X-User-ID: <userId>`
  - Request: `{ location, cropType, landArea, phone }`
  - Response: `{ success, message }`

**Schemes**
- `GET /api/schemes` - Get all agricultural schemes
  - Response: Array of schemes

**Health Check**
- `GET /api/health` - Health check
  - Response: `{ status: "ok" }`

### 3. **Frontend Layer** (React/Vite)
- **Location**: `src/react-app/`
- **API Client**: `src/react-app/lib/api.ts`

#### API Service Functions:

```typescript
// Authentication
authApi.register({ email, password, name })
authApi.login({ email, password })

// Farmer Profile
farmerApi.getProfile(userId)
farmerApi.updateProfile(userId, data)

// Schemes
schemesApi.getAll()

// Health Check
healthCheck()
```

### 4. **Shared Types** (TypeScript)
- **Location**: `src/shared/types.ts`
- **Purpose**: Shared schemas and types between frontend and backend
- **Includes**:
  - `RegisterSchema`, `RegisterInput`
  - `LoginSchema`, `LoginInput`
  - `AuthResponseSchema`, `AuthResponse`
  - `FarmerProfileSchema`, `FarmerProfile`
  - `SchemeSchema`, `Scheme`

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Cloudflare account (for deployment)

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Vite dev server (Frontend): http://localhost:5173
   - Hono backend on same URL (via Vite proxy)

3. **Database Initialization**
   - Database tables are automatically created on first API request
   - See `initializeDatabase()` function in `src/worker/index.ts`

### Deployment to Cloudflare Workers

1. **Authenticate with Cloudflare**
   ```bash
   wrangler login
   ```

2. **Deploy**
   ```bash
   npm run build
   ```
   - This builds both frontend and backend
   - Backend is deployed as Cloudflare Worker

3. **Verify Deployment**
   - Check `wrangler.json` for your worker URL
   - Test endpoints using the deployed URL

## Data Flow Examples

### Registration Flow
1. User fills registration form on `/register` page
2. Form submission calls `authApi.register()`
3. API client sends POST to `/api/auth/register`
4. Backend validates input with Zod schemas
5. Backend creates user in D1 database
6. Backend creates farmer_profile for user
7. Response returned to frontend
8. User info stored in localStorage
9. User redirected to home page

### Login Flow
1. User fills login form on `/login` page
2. Form submission calls `authApi.login()`
3. API client sends POST to `/api/auth/login`
4. Backend queries D1 for user
5. Backend verifies password
6. Response returned with user data
7. User info stored in localStorage
8. User redirected to home page

### Getting Schemes Flow
1. Component calls `schemesApi.getAll()`
2. API client sends GET to `/api/schemes`
3. Backend queries all schemes from D1
4. Backend returns array of schemes
5. Component displays schemes to user

## Authentication

Currently using simple password storage (plain text). **For production:**

1. **Install bcrypt**
   ```bash
   npm install bcrypt
   ```

2. **Update password hashing** in `src/worker/index.ts`:
   ```typescript
   import bcrypt from 'bcrypt';
   
   async function hashPassword(password: string): Promise<string> {
     return bcrypt.hash(password, 10);
   }
   
   async function verifyPassword(password: string, hash: string): Promise<boolean> {
     return bcrypt.compare(password, hash);
   }
   ```

## Environment Variables

For local development, environment variables are handled by Wrangler:
- **wrangler.json** - Contains D1 database bindings
- D1 database binding: `DB`
- R2 bucket binding: `R2_BUCKET`

For Cloudflare deployment, these are set in `wrangler.json`.

## Error Handling

The API client includes error handling:
- Network errors are caught and displayed to user
- API responses with error status codes throw errors
- Error messages are shown in UI alerts

## Validation

- **Frontend**: Form inputs validated by User (basic HTML validation)
- **Backend**: Input validated using Zod schemas
- **Database**: Constraints (unique emails, foreign keys)

## Testing Locally

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:5173
3. Test registration: `/register` page
4. Test login: `/login` page
5. Check console for API responses

## Troubleshooting

### Database not initializing
- Check browser console for errors
- Verify `wrangler.json` has correct D1 binding
- Check backend logs for SQL errors

### API endpoints not responding
- Verify Hono server is running
- Check network tab in browser DevTools
- Verify correct API endpoints in `src/react-app/lib/api.ts`

### CORS issues
- Hono handles CORS by default for same-origin requests
- For cross-origin, add CORS middleware to Hono

### Password verification failing
- Currently uses plain text comparison
- Implement proper bcrypt hashing for security

## Next Steps

1. Add JWT token-based authentication
2. Implement proper password hashing with bcrypt
3. Add email verification for registration
4. Add password reset functionality
5. Implement role-based access control (RBAC)
6. Add more API endpoints for farmer data management
7. Implement caching for scheme data
8. Add input validation error messages in UI
9. Setup automated tests
10. Add monitoring and logging

## File Structure

```
src/
├── shared/
│   └── types.ts              # Shared schemas and types
├── worker/
│   └── index.ts              # Backend (Hono routes, DB queries)
└── react-app/
    ├── lib/
    │   └── api.ts            # API client service
    └── pages/
        ├── Login.tsx         # Connected to API
        ├── Register.tsx      # Connected to API
        ├── Home.tsx
        └── Schemes.tsx
```

## References

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Zod Validation](https://zod.dev/)
- [React Router](https://reactrouter.com/)
