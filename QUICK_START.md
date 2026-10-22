# Quick Start - Frontend-Backend-Database Integration

## What's Connected?

✅ **Frontend** → **Backend** → **Database**

### APIs Ready to Use:

**Authentication**
```
POST /api/auth/register
POST /api/auth/login
```

**Farmer Profile**
```
GET /api/farmer/profile
PUT /api/farmer/profile
```

**Schemes**
```
GET /api/schemes
```

## Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open: http://localhost:5173

- **Register**: http://localhost:5173/register
- **Login**: http://localhost:5173/login

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  createdAt TEXT,
  updatedAt TEXT
)
```

### Farmer Profiles Table
```sql
CREATE TABLE farmer_profiles (
  id INTEGER PRIMARY KEY,
  userId INTEGER NOT NULL UNIQUE,
  location TEXT,
  cropType TEXT,
  landArea REAL,
  phone TEXT,
  createdAt TEXT,
  updatedAt TEXT,
  FOREIGN KEY(userId) REFERENCES users(id)
)
```

### Schemes Table
```sql
CREATE TABLE schemes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  eligibility TEXT,
  benefits TEXT,
  createdAt TEXT
)
```

## Testing Registration

1. Go to http://localhost:5173/register
2. Fill in:
   - Name: `John Farmer`
   - Email: `john@example.com`
   - Password: `password123`
   - Phone: `9999999999`
   - State: `Maharashtra`
   - District: `Pune`
3. Click "Create Account"
4. Check console (F12) for API response

## Testing Login

1. Go to http://localhost:5173/login
2. Fill in:
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Sign In"
4. Check console for API response

## API Examples

### Register
```bash
curl -X POST http://localhost:5173/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123",
    "name": "Farmer John"
  }'
```

### Login
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123"
  }'
```

### Get Schemes
```bash
curl http://localhost:5173/api/schemes
```

## Deploy to Cloudflare

```bash
# Build
npm run build

# Deploy
wrangler deploy
```

## Important Files

| File | Purpose |
|------|---------|
| `src/shared/types.ts` | Shared TypeScript types and Zod schemas |
| `src/worker/index.ts` | Backend API routes (Hono) |
| `src/react-app/lib/api.ts` | Frontend API client |
| `src/react-app/pages/Login.tsx` | Login page (connected to API) |
| `src/react-app/pages/Register.tsx` | Register page (connected to API) |
| `wrangler.json` | D1 database configuration |

## Next: What to Add

- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] JWT authentication tokens
- [ ] Proper password hashing (bcrypt)
- [ ] More farmer data endpoints
- [ ] Schemes management (CRUD)
- [ ] Weather data integration
- [ ] Market prices integration
- [ ] Crop recommendations

## Troubleshooting

**API not responding?**
- Ensure dev server is running: `npm run dev`
- Check browser console (F12) for errors
- Check network tab for failed requests

**Database errors?**
- First request initializes tables automatically
- Check browser console for SQL errors

**Build failing?**
- Run `npm run lint` to check for errors
- Run `tsc` to check TypeScript compilation

## File Locations

```
Frontend: src/react-app/
Backend: src/worker/
Types: src/shared/
Config: wrangler.json
```

---

You're all set! The frontend, backend, and database are now connected and ready to use.
