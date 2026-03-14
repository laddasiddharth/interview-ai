# Interview AI - Quick Start Guide

Follow these steps to get the project running locally.

## Prerequisite: API Key
Ensure you have a `.env` file in the **root** directory with your Gemini API key:
```env
GEMINI_API_KEY=your_actual_key_here
```

---

## 🚀 1. Start the Backend

1. **Navigate to Backend**:
   ```powershell
   cd backend
   ```
2. **Activate Virtual Environment**:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
3. **Install Dependencies** (If not already done):
   ```powershell
   pip install -r requirements.txt
   ```
4. **Run the Server**:
   ```powershell
   python -m uvicorn app.main:app --reload
   ```
   *The API will be available at `http://localhost:8000`*

---

## 💻 2. Start the Frontend

1. **Open a NEW Terminal**.
2. **Navigate to Frontend**:
   ```powershell
   cd frontend
   ```
3. **Install Dependencies** (If not already done):
   ```powershell
   npm install
   ```
4. **Run the Dev Server**:
   ```powershell
   npm run dev
   ```
   *The app will be available at `http://localhost:3000`*

---

## 🛠️ Troubleshooting

- **Backend missing modules?** Run `pip install -r requirements.txt` again inside the activated venv.
- **Frontend port busy?** Next.js will usually pick the next available port, or you can run `npm run dev -- -p 3001`.
