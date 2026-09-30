# Repo must stay pristine during lessons — teach workarounds, never patch assessment code

User reverted the deps.py change and reset the associated commits: the assessment repo's code must not be modified during lessons. Fix I had applied (APIKeyHeader security scheme) is preserved as *knowledge* (see LR-0004), not as code — the interview value is in describing the fix verbally. Working-tree rule going forward: before touching anything under `backend/` or `frontend/` outside the teaching workspace files, ask first.

**Implications:** lessons teach tooling that works on the unmodified repo (PowerShell Invoke-RestMethod pairs, browser-console fetch, /docs for schemas + unauthenticated /login). The /docs Authorize story is taught as a decoy-trap + verbal fix ("assessment gold"). Also learned operationally: `--reload` on Windows can miss git-restore mtime changes — restart uvicorn to be sure; uvicorn `--reload` must be present in any server start (user's manual start lacked it once).
