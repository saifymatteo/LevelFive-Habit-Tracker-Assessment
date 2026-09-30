# Swagger's Authorize button needs a declared security scheme; raw Header params don't create one

Corrected a lesson error: Lesson 1 told the user to click "Authorize" in /docs, but this app has no security scheme — `deps.py` reads the token via a plain `Header(default=None)` parameter, so the OpenAPI spec has `securitySchemes: NONE` (verified live) and Swagger shows the auth header as an ordinary per-request parameter instead. The working instruction: fill each endpoint's `authorization` field with `Bearer 1` — bare `1` returns 401 because the code requires the literal `Bearer ` prefix.

**Implications:** the user now knows FastAPI's Authorize button is generated from security classes (`HTTPBearer`, `OAuth2PasswordBearer`), not from arbitrary header reads — a strong interview observation ("I'd declare HTTPBearer so /docs self-documents"). All lesson/reference docs updated to the corrected instructions.
