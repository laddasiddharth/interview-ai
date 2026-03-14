# Interview AI - Testing Guide

This guide provides comprehensive instructions for testing both the backend and frontend components of the Interview AI project.

## 1. Backend Testing

### 🧪 Automated Tests (Pytest)
We use `pytest` for backend testing. I've optimized these tests with lazy loading and mocks, so they should run very fast.

1. **Activate Virtual Environment**:
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   ```
2. **Run Tests**:
   ```powershell
   pytest tests/ -v
   ```
   *Note: Real model loading is bypassed in tests to ensure speed.*

### 🔍 Static Analysis (Linting)
1. **Pylint (Errors only)**:
   ```powershell
   pylint app/ --errors-only
   ```
2. **Flake8 (Code style)**:
   ```powershell
   flake8 app/ --count --select=E9,F63,F7,F82 --show-source --statistics
   ```

---

## 2. Frontend Testing

### 🟢 Linting (ESLint)
We use ESLint 9 with a flat configuration.
```powershell
cd frontend
npm run lint
```

### 🔷 Type Checking (TypeScript)
Ensure there are no type mismatches across the project.
```powershell
cd frontend
npx tsc --noEmit
```

### 🏗️ Build Verification
Test the Next.js production build process.
```powershell
cd frontend
npm run build
```

---

## 3. Manual Smoke Tests

### 🛠️ API Connectivity
Verify the backend is responding:
```powershell
curl http://localhost:8000/
# Expected: {"message": "Welcome to the Interview AI API"}
```

### 🖥️ UI Verification
1. Start the dev server: `npm run dev` in `frontend/`.
2. Open `http://localhost:3000`.
3. **Verify**:
   - Signup/Login pages load correctly.
   - Interview flow starts without console errors.
   - Theme switching works.

---

## 4. CI/CD Verification

Whenever you push to GitHub, the following pipelines run automatically:
1. **Full CI Pipeline** (`ci.yml`): Runs everything (Backend, Frontend, Security).
2. **Frontend CI** (`frontend-ci.yml`): Runs on changes to the `frontend/` directory.
3. **Backend CI** (`backend-ci.yml`): Runs on changes to the `backend/` directory.

**To check results**:
1. Go to your GitHub repository.
2. Click the **Actions** tab.
3. Select the latest run to see detailed logs for each job.
