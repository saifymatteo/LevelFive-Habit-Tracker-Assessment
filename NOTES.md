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
