# Habit Tracker

A small habit tracking app. React frontend, FastAPI backend, PostgreSQL, everything wired up with Docker Compose.

## Demo accounts

| User     | Email             | Password  |
| -------- | ----------------- | --------- |
| Admin    | admin@habit.app   | `demo123` |
| User One | user1@habit.app   | `demo123` |
| User Two | user2@habit.app   | `demo123` |

## What's inside

| Service  | Port | Tech                        |
| -------- | ---- | --------------------------- |
| frontend | 5173 | React 18, Vite, nginx       |
| backend  | 8000 | FastAPI, SQLAlchemy, Pydantic |
| db       | 5432 | PostgreSQL 16               |

## Features

- Email/password login
- Habit cards with streaks, 30-day completion rate and cheers from other users
- 12-week activity heatmap
- Cross-user habit search
- Full log history per habit

The seed is deterministic, so every fresh start produces the same demo data.
