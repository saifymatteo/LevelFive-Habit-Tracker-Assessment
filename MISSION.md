# Mission: Pass Friday's fullstack assessment on this Habit Tracker repo

## Why
The user has a live assessment this Friday (2 days) on this exact repo — a Habit Tracker built with FastAPI + React + PostgreSQL. They expect to be asked to add or modify functionality in the existing codebase. Performance in it directly affects the hiring outcome for their new fullstack role.

## Success looks like
- Can, in a live 60-minute session: restate the task, file a quick spec, implement an endpoint + UI change end-to-end, and demo it — narrating decisions as they go
- Can run the whole stack with `docker compose up --build` and explain what each of the 3 services does
- Can trace one request (login → check-in) through every layer: JSX → api.js → FastAPI route → Depends → SQLAlchemy → Postgres
- Can add or modify an endpoint + its UI end-to-end unaided, in about an hour, matching the repo's existing patterns
- Can spot the deliberately planted bugs (security, correctness, performance) and *justify* each fix the way an interviewer wants to hear it
- Can inspect and query Postgres directly via `docker compose exec db psql` when debugging

## Constraints
- Deadline: Friday. ~2 days of preparation, part-time
- Format confirmed: LIVE coding, 60 minutes total — speed and narration matter as much as correctness; no lookup time, patterns must be muscle memory
- Strengths: Flutter, Docker (intermediate) — skip teaching these
- Basic React; zero FastAPI / SQLAlchemy / PostgreSQL
- Day job uses Laravel + NextJS + Horizon/Redis + React (Vite + Manticore + InertiaJS) — analogies to that stack help
- ADHD-friendly: short lessons, one tangible win each, concrete next actions

## Out of scope
- Alembic migrations (repo creates tables via `Base.metadata.create_all`)
- Long refactor campaigns — a 60-min live format rewards one tight, working change over ambition
- Deep JWT/OAuth theory (beyond spotting that this repo's token is fake)
- Test frameworks beyond a minimal smoke test
- Kubernetes/deployment concerns
- Anything about Laravel/NextJS beyond using them as mental analogies
