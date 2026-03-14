# Interview AI

A full-stack AI-powered technical interview practice platform. Users select a topic, answer questions in a real interview room with a professional live code editor, and receive instant AI-graded feedback. A performance dashboard tracks progress over time using real session analytics.

---

## 🚀 Recent Updates
- **Professional Editor**: Integrated Monaco Editor (VS Code's engine) with multi-language support and smart sizing.
- **Dynamic Timers**: Replaced fixed timers with difficulty-based limits (Easy: 20m, Medium: 45m, Hard: 60m) that persist across refreshes.
- **Real Analytics**: Connected the dashboard to real backend endpoints with optimized database queries.
- **pgvector Support**: Added robust PostgreSQL vector extension support with automatic fallback for other databases.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)

---

## Features

- **JWT Authentication** — signup, login, and protected state management.
- **Topic-based Interviews** — Real-time sessions for Algorithms, Databases, ML, and Behavioral questions.
- **AI Evaluation** — Instant per-answer scoring (1–10) with detailed feedback (strengths/weaknesses) powered by Gemini 1.5 Flash.
- **Semantic Response Cache** — Optimized caching using MiniLM embeddings to reduce API costs.
- **Monaco Code Editor** — Professional editing experience with support for Python, JavaScript, Java, C++, and Go.
- **Real-time AI Chat** — Multi-turn assistance during interviews.
- **Performance Analytics** — Dynamic charts tracking your progress and topic mastery.

---

## Architecture

```
┌─────────────────────┐        HTTPS / JSON         ┌──────────────────────────────┐
│   Next.js Frontend  │  ─────────────────────────▶  │   FastAPI Backend            │
│   (React 19, TS)    │                               │   backend/app/main.py        │
│   Port 3000         │  ◀─────────────────────────  │   Port 8000                  │
└─────────────────────┘                               └──────────────┬───────────────┘
                                                                       │
                                                ┌──────────────────────┼──────────────────────┐
                                                │                      │                      │
                                      ┌─────────▼──────┐  ┌───────────▼──────┐  ┌────────────▼────────┐
                                      │  PostgreSQL/SQL │  │  Gemini 1.5 Flash │  │  SentenceTransformer│
                                      │  (pgvector sup) │  │  (google-genai)   │  │  Semantic Cache     │
                                      └────────────────┘  └──────────────────┘  └─────────────────────┘
```

The backend is a high-performance FastAPI application using an asynchronous architecture and optimized SQLAlchemy queries.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 15 (App Router), React 19, TypeScript |
| Code Editor | `@monaco-editor/react` (Monaco Editor) |
| UI Components | shadcn/ui, Tailwind CSS v4, Lucide, Recharts |
| Backend Framework | FastAPI, Uvicorn |
| Database ORM | SQLAlchemy 2.0+ |
| AI / LLM | Google Gemini 1.5 Flash |
| Semantic Cache | `sentence-transformers` (all-MiniLM-L6-v2) |

---

## Project Structure

```
interview-ai/
├── .gitignore
├── package.json              # Monorepo workspaces
│
├── backend/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py           # Entry point & Router integration
│   │   ├── database/         # DB connection & Session management
│   │   ├── models/           # SQLAlchemy Models (pgvector-ready)
│   │   ├── routes/           # API Endpoints (Auth, Interview, Analytics)
│   │   ├── schemas/          # Pydantic V2 Models
│   │   ├── services/         # AI Logic & Evaluation
│   │   └── utils/            # Shared configuration (env handler)
│   └── tests/                # Pytest suite
│
└── frontend/
    ├── app/                  # Next.js Pages & Layouts
    ├── components/           # UI & Feature components (Monaco Editor)
    ├── lib/                  # Auth Context & Centralized Config
    └── styles/               # Global CSS & Tailwind config
```

---

## Setup & Installation

### 1. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

### 2. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env.local  # If applicable
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/interview_ai
SECRET_KEY=your-secret
GEMINI_API_KEY=your-key
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Running the App

Run both from the root:
```bash
npm run dev
```

Or individually:
- **Backend**: `uvicorn app.main:app --reload`
- **Frontend**: `npm run dev`

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/me` | GET | Current user profile |
| `/interview/start` | POST | Start session with topic |
| `/interview/answer` | POST | Submit answer for AI scoring |
| `/analytics/user/details` | GET | Comprehensive performance data |

*Detailed docs available at `http://localhost:8000/docs`*
