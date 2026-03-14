# Interview AI

A full-stack AI-powered technical interview practice platform. Users select a topic, answer questions in a real interview room with a live code editor and AI chat, and receive instant AI-graded feedback. A performance dashboard tracks progress over time.

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
- [Known Limitations & Roadmap](#known-limitations--roadmap)

---

## Features

- **JWT Authentication** — signup, login, and protected routes
- **Topic-based Interview Sessions** — Algorithms, Databases, Machine Learning, Behavioral
- **AI Evaluation** — per-answer scoring (1–10) with feedback, strengths, weaknesses, and a follow-up question powered by Gemini 1.5 Flash
- **Semantic Response Cache** — avoids redundant Gemini API calls by comparing new answers against cached ones using MiniLM sentence embeddings and cosine similarity
- **Live Code Editor** — in-browser editor with code submission and AI code review
- **AI Chat** — multi-turn Gemini-powered chat assistant during the interview
- **Final Session Report** — aggregate score and summary after completing a session
- **Performance Dashboard** — charts for scores over time and by category
- **Rate Limiting** — per-IP rate limits on all API routes via slowapi

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
                                     │  PostgreSQL DB  │  │  Gemini 1.5 Flash │  │  SentenceTransformer│
                                     │  (SQLAlchemy)   │  │  (google-genai)   │  │  Semantic Cache     │
                                     └────────────────┘  └──────────────────┘  └─────────────────────┘
```

The backend is a single FastAPI application (`backend/app/main.py`) that serves five router groups: `auth`, `interview`, `analytics`, `chat`, and `evaluate`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 15 (App Router), React 19, TypeScript |
| UI Components | shadcn/ui, Tailwind CSS v4, Radix UI, Recharts |
| Backend Framework | FastAPI, Uvicorn |
| Database ORM | SQLAlchemy, PostgreSQL (psycopg2) |
| Auth | JWT (python-jose), bcrypt (passlib) |
| AI / LLM | Google Gemini 1.5 Flash via `google-genai` SDK |
| Semantic Cache | `sentence-transformers` (all-MiniLM-L6-v2), scikit-learn |
| Rate Limiting | slowapi |
| Monorepo | npm workspaces |

---

## Project Structure

```
interview-ai/
├── .gitignore
├── package.json              # Root monorepo — npm workspaces
├── Leetcode.csv              # Question seed data
│
├── backend/
│   ├── requirements.txt
│   ├── import_csv.py         # One-time CSV → DB seeder script
│   ├── app/
│   │   ├── main.py           # FastAPI entry point (CORS, rate limiting, all routers)
│   │   ├── database/
│   │   │   └── database.py   # SQLAlchemy engine + session factory
│   │   ├── models/
│   │   │   └── models.py     # ORM: User, InterviewSession, Question, Answer, AnswerCache
│   │   ├── routes/
│   │   │   ├── auth.py       # /auth — signup, login, /me
│   │   │   ├── interview.py  # /interview — start, question, answer, report
│   │   │   └── analytics.py  # /analytics — user stats
│   │   ├── schemas/
│   │   │   └── schemas.py    # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── ai_evaluator.py   # Gemini evaluation + semantic cache
│   │   │   ├── auth_service.py   # Token creation + user lookup
│   │   │   └── question_service.py
│   │   └── utils/
│   │       └── config.py     # Pydantic settings (reads .env)
│   └── routers/
│       ├── chat.py           # /chat — multi-turn AI chat
│       └── evaluate.py       # /evaluate — code review
│
└── frontend/
    ├── package.json
    ├── next.config.mjs
    ├── app/
    │   ├── page.tsx                     # Landing page
    │   ├── login/page.tsx               # Login
    │   ├── signup/page.tsx              # Sign up
    │   ├── dashboard/page.tsx           # Performance dashboard
    │   └── interview/
    │       ├── select/page.tsx          # Topic picker
    │       └── room/[id]/page.tsx       # Interview room (chat + editor)
    ├── components/
    │   ├── nav.tsx                      # Navigation bar
    │   ├── code-editor.tsx              # Code submission editor
    │   └── ui/                          # shadcn/ui component library
    ├── hooks/
    └── lib/
        ├── auth-context.tsx             # JWT auth context + localStorage
        ├── interview-questions.ts       # Static question list
        └── mock-data.ts                 # Dashboard chart placeholder data
```

---

## Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- **PostgreSQL** 14+ running locally (or a connection string to a hosted instance)
- A **Google Gemini API key** — get one at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd "interview-ai"
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy the environment template and fill in your values
cp .env.example .env
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Or from the root (installs all workspaces at once):

```bash
npm install
```

---

## Environment Variables

Create `backend/.env` with the following keys (never commit this file):

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/interview_ai

# JWT — change this to a long random string in production
SECRET_KEY=your-super-secret-key-here

# Google Gemini API key
GEMINI_API_KEY=your-gemini-api-key-here
```

> The app will **refuse to start** if `GEMINI_API_KEY` is missing or empty.

---

## Running the App

### Backend (FastAPI)

```bash
cd backend
source venv/bin/activate   # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### Frontend (Next.js)

```bash
cd frontend
npm run dev
```

App available at: `http://localhost:3000`

### Both simultaneously (from root)

```bash
npm run dev
```

> This runs both dev servers in parallel using `npm-run-all`. Add the individual `dev:backend` / `dev:frontend` scripts to the root `package.json` if not already present.

### Seed the question database

After the backend is running and tables are created, seed interview questions from `Leetcode.csv`:

```bash
cd backend
python import_csv.py
```

---

## API Reference

All endpoints are served from `http://localhost:8000`. Interactive docs: `/docs`.

### Auth — `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | — | Register a new user. Body: `{email, password}` |
| POST | `/auth/login` | — | Login. Returns `{access_token, token_type}` |
| GET | `/auth/me` | Bearer JWT | Returns the current user's profile |

### Interview — `/interview`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/interview/start` | Bearer JWT | Start a new session. Body: `{topic}` |
| GET | `/interview/question` | — | Get a random question. Query: `?topic=algorithms` |
| POST | `/interview/answer` | — | Submit an answer. Returns AI score + feedback |
| GET | `/interview/report/{id}` | Bearer JWT | Get full session report |

### Chat — `/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat/` | — | Multi-turn AI chat. Body: `{messages, question_context?}` |

### Code Evaluation — `/evaluate`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/evaluate/` | — | AI code review. Body: `{code, explanation, question_context}`. Returns `{correctness, time_complexity, space_complexity, feedback, improvements}` |

### Analytics — `/analytics`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/user` | Bearer JWT | Returns `{total_interviews}` for the current user |

---

## Known Limitations & Roadmap

### Current Limitations

- **Dashboard uses mock data** — the performance charts and recent interviews list are hardcoded. The analytics API is a stub that only returns `total_interviews`.
- **No auth on `/chat` and `/evaluate`** — these endpoints are open and can be called by anyone, consuming Gemini API quota.
- **Semantic cache is in-memory** — cosine similarity is computed in Python across up to 50 cached rows per question. At scale, this should move to a vector database (e.g., `pgvector` for PostgreSQL).
- **`interview.end_time` is never set** — session end time stays `null`; needs to be populated on report fetch or explicit session close.
- **TypeScript build errors are suppressed** — `next.config.mjs` sets `ignoreBuildErrors: true`.

### Roadmap

- [ ] Wire dashboard charts to real analytics endpoints
- [ ] Add authentication to `/chat` and `/evaluate`
- [ ] Replace in-Python cosine similarity with pgvector for scalable semantic caching
- [ ] Add `end_time` update logic when a session is completed
- [ ] Add Docker + docker-compose setup for one-command local dev
- [ ] Add GitHub Actions CI pipeline (lint, test, build)
- [ ] Add `.env.example` file with placeholder values
- [ ] Migrate `backend/routers/` to the new `google-genai` SDK (currently uses legacy `google.generativeai`)
