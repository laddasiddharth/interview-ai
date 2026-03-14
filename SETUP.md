# Interview AI - Complete Setup & Implementation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Running the Application](#running-the-application)
4. [Testing](#testing)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Windows 10+**, macOS, or Linux
- **Python 3.10+**
- **Node.js 16+** and **npm 8+**
- **Git** (optional, for version control)
- **Gemini API Key** (from https://aistudio.google.com/app/apikey)

### Verify Installations
```powershell
python --version   # Should be 3.10+
node --version     # Should be 16+
npm --version      # Should be 8+
```

If any are missing:
- **Python**: https://www.python.org/downloads/
- **Node.js**: https://nodejs.org/

---

## Local Development Setup

### Step 1: Navigate to Project
```powershell
cd "L:\Projects\Interview AI"
```

### Step 2: Setup Backend

#### Create Python Virtual Environment
```powershell
cd backend
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1
```

**Note:** If you get a script execution error, run this once:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Install Backend Dependencies
```powershell
pip install -r requirements.txt
```

**Dependencies installed:**
- FastAPI - Web framework
- Uvicorn - ASGI server
- SQLAlchemy - ORM
- google-genai - Google Gemini API
- pydantic - Data validation
- python-jose - JWT authentication
- passlib - Password hashing
- sentence-transformers - Embeddings
- pgvector - Vector database support

### Step 3: Setup Environment Variables

#### Navigate to Project Root
```powershell
cd "L:\Projects\Interview AI"
```

#### Copy Environment Template
```powershell
Copy-Item .env.example .env
```

#### Edit .env File
```powershell
notepad .env
```

#### Required Changes in .env
```env
# CRITICAL: Get your API key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=sk-proj-your_actual_key_here

# Database (SQLite for development - no changes needed)
DATABASE_URL=sqlite:///./sql_app.db

# JWT Secret (for production, use strong random key)
SECRET_KEY=your-secret-key-change-this-in-production

# Server Config (optional)
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

### Step 4: Setup Frontend

#### Navigate to Frontend Directory
```powershell
cd "L:\Projects\Interview AI\frontend"
```

#### Install Node Dependencies
```powershell
npm install
```

**Key dependencies:**
- Next.js - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Axios/Fetch - API calls
- React Query - State management

---

## Running the Application

### Terminal 1: Start Backend Server

```powershell
cd "L:\Projects\Interview AI\backend"

# Activate virtual environment (if not already activated)
.\venv\Scripts\Activate.ps1

# Start server with auto-reload
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Keep this terminal open!**

### Terminal 2: Start Frontend Server

**Open a NEW PowerShell terminal:**

```powershell
cd "L:\Projects\Interview AI\frontend"

# Start Next.js development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
✓ Ready in 3.2s
```

### Access the Application

Open your browser and visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## Testing

### Test 1: Verify Backend is Running

```powershell
curl http://localhost:8000

# Expected response:
# {"message":"Welcome to the Interview AI API"}
```

### Test 2: Create Account (Signup)

```powershell
curl -X POST http://localhost:8000/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected response:
# {"id":1,"email":"test@example.com"}
```

### Test 3: Login and Get Token

```powershell
$loginResponse = curl -X POST http://localhost:8000/auth/login `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=test@example.com&password=password123" | ConvertFrom-Json

# Save token for next requests
$token = $loginResponse.access_token
echo "Token: $token"
```

### Test 4: Protected Endpoints (Requires Token)

```powershell
# Get user profile
curl -X GET http://localhost:8000/auth/me `
  -H "Authorization: Bearer $token"

# Get analytics
curl -X GET http://localhost:8000/analytics/user `
  -H "Authorization: Bearer $token"
```

### Test 5: Interview Flow

```powershell
# Start interview
$interview = curl -X POST http://localhost:8000/interview/start `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{"topic": "arrays"}' | ConvertFrom-Json

$interviewId = $interview.id
echo "Interview ID: $interviewId"

# Get a question
curl -X GET "http://localhost:8000/interview/question?topic=arrays" `
  -H "Authorization: Bearer $token"

# Complete interview
curl -X POST "http://localhost:8000/interview/complete/$interviewId" `
  -H "Authorization: Bearer $token"
```

### Test 6: Access Frontend

Open browser: http://localhost:3000

You should see:
- ✅ Login page
- ✅ Signup button
- ✅ Navigation menu
- ✅ No console errors

Try signing up through the UI and logging in.

---

## Code Architecture Overview

### Backend Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI app initialization
│   ├── database/
│   │   └── database.py      # SQLalchemy database setup
│   ├── models/
│   │   └── models.py        # User, Interview, Answer, AnswerCache models
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints (signup, login, profile)
│   │   ├── interview.py     # Interview endpoints (start, complete, answer)
│   │   └── analytics.py     # Analytics endpoints (user stats, details)
│   ├── services/
│   │   ├── ai_evaluator.py  # Gemini AI integration & semantic search
│   │   ├── auth_service.py  # Password hashing & token generation
│   │   └── question_service.py  # Question retrieval
│   ├── schemas/
│   │   └── schemas.py       # Pydantic request/response models
│   └── utils/
│       └── config.py        # Settings from .env (centralized config)
├── routers/
│   ├── chat.py              # Chat endpoint (requires auth, uses new SDK)
│   └── evaluate.py          # Code evaluation endpoint (requires auth)
└── requirements.txt         # Python dependencies
```

### Key Implementation Details

#### 1. Authentication
- **JWT tokens** for stateless auth
- **OAuth2PasswordBearer** for token dependency
- **Endpoints protected** with `Depends(get_current_user)`
- **Password hashing** with bcrypt via passlib

#### 2. Database
- **SQLite** for local development (automatic, no setup needed)
- **PostgreSQL** support for production (with pgvector for vector search)
- **Schema switch** based on `DATABASE_URL` in config
- **pgvector integration** for semantic caching (fallback to in-memory for SQLite)

#### 3. AI Integration
- **New google-genai SDK** (not legacy `google.generativeai`)
- **Centralized API key** in `app.utils.config.settings`
- **JSON response parsing** for structured outputs
- **Error handling** for API failures

#### 4. Endpoints

**Auth Routes** (`/auth`)
- `POST /auth/signup` - Create new user
- `POST /auth/login` - Get JWT token
- `GET /auth/me` - Get current user profile

**Interview Routes** (`/interview`)
- `POST /interview/start` - Create new interview session
- `GET /interview/question` - Get random question by topic
- `POST /interview/answer` - Submit answer (requires eval)
- `POST /interview/complete/{interview_id}` - Finalize session
- `GET /interview/report/{interview_id}` - Get session report

**Analytics Routes** (`/analytics`)
- `GET /analytics/user` - Summary stats (total, average, best, trends)
- `GET /analytics/user/details` - Per-interview breakdown

**AI Routes** (`/chat`, `/evaluate`)
- `POST /chat` - Chat with AI interviewer (requires auth)
- `POST /evaluate` - Evaluate code solution (requires auth)

---

## Production Deployment

### Option 1: Render.com (Recommended - Easiest)

#### 1. Prepare for Production

**Update .env:**
```env
DEBUG=False
SECRET_KEY=your-super-strong-random-key-at-least-32-chars
GEMINI_API_KEY=sk-proj-production-key
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

#### 2. Add Production Server (Backend)

**Make sure `gunicorn` is in requirements.txt:**
```
gunicorn
```

#### 3. Push to GitHub

```powershell
cd "L:\Projects\Interview AI"
git add .
git commit -m "Production ready"
git push origin main
```

#### 4. Deploy Backend on Render

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   ```
   Name: interview-ai-backend
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
   ```
5. Set Environment Variables:
   ```
   GEMINI_API_KEY=your-production-key
   SECRET_KEY=your-strong-key
   DATABASE_URL=postgresql://...
   ```
6. Create PostgreSQL database on Render
7. Deploy!

#### 5. Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect GitHub repository
3. Configure:
   ```
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: .next
   ```
4. Set (if needed):
   ```
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com
   ```
5. Deploy!

### Option 2: AWS EC2 (More Control)

1. **Launch EC2 instance** (Ubuntu 22.04)
2. **SSH into instance**
3. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3.10 python3.10-venv nodejs npm postgresql
   ```
4. **Clone repository and setup same as local**
5. **Use systemd** to manage services
6. **Setup Nginx** as reverse proxy
7. **Install SSL certificate** (Let's Encrypt)

### Option 3: DigitalOcean (Middle Ground)

1. Create Droplet (similar to EC2)
2. Install same dependencies
3. Use App Platform for automatic deployment from GitHub
4. Configure PostgreSQL database

---

## Environment Variables Reference

### Required for All Environments
```env
GEMINI_API_KEY=sk-proj-xxxxx          # Get from https://aistudio.google.com/app/apikey
SECRET_KEY=your-secret-key            # For JWT signing
```

### Development (Default)
```env
DEBUG=True
DATABASE_URL=sqlite:///./sql_app.db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Production
```env
DEBUG=False
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=production-strong-key
ALLOW_ORIGINS=https://yourdomain.com
```

---

## Troubleshooting

### Backend Won't Start

**Error: `ModuleNotFoundError: No module named 'google'`**
```powershell
# Solution: Reinstall dependencies
cd backend
.\venv\Scripts\Activate.ps1
pip install --upgrade -r requirements.txt
```

**Error: `port 8000 already in use`**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F

# Or change port in startup command:
python -m uvicorn app.main:app --reload --port 8001
```

**Error: `SyntaxError in app files`**
```powershell
# Check Python version is 3.10+
python --version

# Reinstall dependencies with correct Python
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt --upgrade
```

### Frontend Won't Load

**Error: `Cannot find NEXT_PUBLIC_API_URL`**
```
Check .env.local in frontend directory has:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Error: `npm packages not found`**
```powershell
# Clean and reinstall
cd frontend
rm -r node_modules package-lock.json
npm install
```

**Error: `port 3000 already in use`**
```powershell
# Kill process or change port:
npm run dev -- -p 3001
```

### Database Issues

**Error: `database locked`** (SQLite)
```powershell
# Solution: Delete the database and restart
cd backend
rm sql_app.db

# Restart - new database will be created automatically
python -m uvicorn app.main:app --reload
```

**Error: `GEMINI_API_KEY not found`**
```
1. Check .env file exists in project root
2. Verify GEMINI_API_KEY=sk-proj-xxxxx is set
3. No quotes around the key
4. Restart backend after changing .env
```

### API Not Responding

**Test connectivity:**
```powershell
# Check if backend is running
curl http://localhost:8000

# Check if frontend can reach backend
curl http://localhost:3000/api/test  # May fail, but should connect

# Check logs in backend terminal for errors
```

### Authentication Issues

**Error: `401 Unauthorized`**
```
- Make sure you've signed up first (POST /auth/signup)
- Log in to get token (POST /auth/login)
- Include token in headers: Authorization: Bearer <token>
```

**Error: `Invalid token`**
```
- Token may have expired (default: 30 minutes)
- Sign out and log in again
- Get new token from POST /auth/login
```

---

## Development Workflow

### Making Changes

**Backend (Python):**
- Edit files in `backend/app/`
- Changes auto-reload (due to `--reload` flag)
- No restart needed
- Logs show in terminal

**Frontend (React/TypeScript):**
- Edit files in `frontend/app/` or `frontend/components/`
- Changes hot-reload automatically
- Browser refreshes automatically
- Check console for errors

### Testing Changes

```powershell
# Test backend endpoint
curl http://localhost:8000/endpoint

# Check frontend in browser
# Open DevTools (F12) to see console errors
```

### Adding New Dependencies

**Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install new-package
pip freeze > requirements.txt  # Update requirements
```

**Frontend:**
```powershell
cd frontend
npm install new-package
npm run build  # Test build before committing
```

---

## Next Steps

### Short Term (Local Development)
1. ✅ Run backend and frontend locally
2. ✅ Test all endpoints with curl or Postman
3. ✅ Try signup/login through UI
4. ✅ Test interview flow

### Before Production
1. Update `.env` with production values
2. Test with PostgreSQL locally (optional)
3. Run `npm run build` for frontend
4. Review and test all endpoints
5. Check for any hardcoded values or secrets

### Deploy to Production
1. Choose hosting (Render.com recommended)
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy backend service
5. Deploy frontend service
6. Test on production URLs

---

## FAQ

**Q: Can I use PostgreSQL locally?**
A: Yes! Install PostgreSQL locally, create database, update DATABASE_URL in .env.

**Q: Do I need Docker?**
A: No, completely optional. This setup runs without Docker.

**Q: How do I change the port?**
A: Backend: use `--port 8001` flag. Frontend: use `npm run dev -- -p 3001`

**Q: Where is the database file stored?**
A: SQLite: `backend/sql_app.db`. PostgreSQL: in the database server.

**Q: How do I reset the database?**
A: SQLite: delete `sql_app.db` file. PostgreSQL: drop and recreate database.

**Q: What if I forgot my password?**
A: Sign up with a new account in development mode.

**Q: Can I access the database directly?**
A: SQLite: no special tools needed. PostgreSQL: use `psql` command-line or pgAdmin GUI.

---

## Support

For issues:
1. Check **Troubleshooting** section above
2. Verify all prerequisites are installed
3. Check backend and frontend logs
4. Ensure .env file has correct values
5. Try restarting both servers

---

**Your Interview AI project is ready to run! 🚀**

Start with: 
```powershell
# Terminal 1 - Backend
cd backend && .\venv\Scripts\Activate.ps1 && python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend  
cd frontend && npm run dev
```
