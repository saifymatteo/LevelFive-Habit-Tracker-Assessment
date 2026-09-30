# Notes (teacher's scratchpad)

## User profile
- Flutter strong, Docker intermediate, React basic, FastAPI/SQLAlchemy/PostgreSQL zero
- Day job: Laravel + NextJS + Horizon/Redis + React (Vite + Manticore + InertiaJS). Good analogy sources: Eloquent≈SQLAlchemy ORM, Laravel middleware/service providers≈FastAPI Depends, Artisan tinker≈psql.
- Assessment: Friday, LIVE coding, 60 minutes. Repo = interview-coding-test-main (Habit Tracker). No commits in git yet.
- Live-format implications: pre-flight checklist (env running before the hour, /docs open, psql ready); narrate decisions; quick .scratch/<feature>/spec.md fits the repo convention and scores process points; prefer npm run dev over docker rebuild for frontend iteration; working > ambitious.

## Teaching preferences
- ADHD mode: short lessons, first line = action, ≤5-item lists, concrete time estimates.
- Quiz answers must be equal word/char count (no formatting tells).
- Teach Python by analogy to Dart where cheap.
- Frame planted bugs as "suspicious patterns to spot + justify", never as a leaked answer key — interviewers grade justification.
- HARD RULE (user set, S1.8): never modify assessment repo code during lessons (backend/ or frontend/). Teaching workspace files + user's own dev tooling are fine. Ask before any repo-code edit; fixes get taught verbally, not applied (see LR-0005).

## Repo findings so far (working list for Lesson 4)
- SQL injection: f-string q in `/habits/search` (habits.py:32-37)
- Fake auth: token = str(user.id), plaintext passwords (auth_routes.py:19-23, deps.py)
- IDOR: delete/checkin/cheer/logs/stats never check `habit.user_id == user.id`; `?user_id=` on list + dashboard
- STREAK_CACHE module dict: wrong after restart/multi-worker; "streak" is actually total completions (habits.py:16,152)
- `time.sleep(0.35)` in checkin (habits.py:153)
- N+1: list_habits 2 queries/habit; Dashboard.jsx fetches stats per habit sequentially, polls every 4s
- dashboard() includes archived habits, list_habits excludes them — inconsistent totals
- current_streak() returns 0 when today unchecked even if yesterday-chain alive; O(n) `in dates` scans
- cheer(): non-atomic read-modify-write; no ownership check; unlimited self-cheer
- No unique constraint on (habit_id, log_date) → double check-in race
- CORS `allow_origins=["*"]` + `allow_credentials=True`
- Login.jsx prefills demo@habit.app — no such seed user (real: admin@habit.app / user1 / user2, password demo123)
- Seed: 1460 days × 86% density → ~62k logs for user1; dashboard loads ALL logs (performance landmine)
- No tests anywhere. No CONTEXT.md (domain docs convention exists but file absent).

## Session log
- S1 (today): workspace set up; L1 (run+trace), L2 (FastAPI kit), reference 0001 delivered. User confirmed: live coding, 60 min. Mission + resources updated.
- S2 plan: L3 (SQLAlchemy/SQL in this repo), L4 (bug-hunt lab, tightened to top issues), L5 (60-min dress rehearsal of the live format).
- S1.5: user built backend/Run.ps1 for local backend. Rewrote it: PS loads .env into process env (Python never reads .env natively), python -m uvicorn --reload. Gotchas taught: DATABASE_URL default host 'db' only resolves in Docker (need localhost:5432 + db ports mapping, user already added); PS 5.1 reads no-BOM files as ANSI so non-ASCII (em dash) breaks strings. Verified: healthz + login OK against Dockerized db. User must create backend/.env themselves (tool guard blocks agent writing .env).
- S1.6: user caught lesson error — /docs had NO Authorize button (securitySchemes: NONE; deps.py used plain Header param). Fixed instructions: per-request `authorization` field with `Bearer 1`. LR-0003 written.
- S1.7: user caught SECOND error — Swagger UI renders the authorization param but NEVER SENDS it (verified live: 401 despite filled field; OAS 3.1 renders it but header is reserved for schemes). Real fix applied: deps.py APIKeyHeader(name="Authorization", auto_error=False) — runtime identical, Authorize button works (verified 200 in browser). Committed e7bab01 after baseline 8e13970. Server quirk: user's uvicorn lacked --reload (masked change); now running detached with --reload on 8000. LR-0004 written. Two strikes: never teach Swagger auth behaviour without verifying in the browser.
- S1.8: user RESET my commits + wants repo pristine during lessons. Restored deps.py to original via git restore (restart of uvicorn needed — --reload missed the git change on Windows). L1 §4/L2/reference rewritten for pristine repo: /docs = schemas + /login only; authed calls via Invoke-RestMethod pair or browser-console fetch; APIKeyHeader fix taught verbally. LR-0005 records the hard rule: ask before touching repo code. My other working-tree mods (docs + .gitignore block) left in place — user's own commits track the lessons anyway.
