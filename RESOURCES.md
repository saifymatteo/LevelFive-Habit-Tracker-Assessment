# Habit Tracker assessment Resources

## Knowledge

- [FastAPI official documentation — tutorial](https://fastapi.tiangolo.com/tutorial/)
  The canonical source. Use for: path/query params, request bodies, `Depends`, error handling, the auto `/docs` page. Every lesson cites this first.
- [SQLAlchemy 2.0 ORM tutorial](https://docs.sqlalchemy.org/en/20/tutorial/)
  Official tutorial for the ORM this repo uses (`Mapped`, `mapped_column`, `Session`, `query/filter/commit`). Use for: models, sessions, N+1 query issues.
- [Pydantic v2 docs — models](https://docs.pydantic.dev/latest/concepts/models/)
  Request-body validation in this repo is plain Pydantic. Use for: `BaseModel`, field defaults, `Optional`/`| None`, automatic 422 errors.
- [PostgreSQL 16 manual](https://www.postgresql.org/docs/16/tutorial.html)
  Official tutorial + SQL reference. Use for: `psql` basics, `ILIKE`, `JOIN`, constraints (e.g. why a unique index on `(habit_id, log_date)` matters).
- [React official docs — quick start](https://react.dev/learn)
  Use for: `useState`/`useEffect` refreshers only where this repo's components use them (they do: state, effects, `Promise.all`).
- [Vite guide](https://vite.dev/guide/)
  Use for: the dev-server proxy that makes `/api` hit `localhost:8000` during development.
- [Docker Compose file reference](https://docs.docker.com/reference/compose-file/)
  User already knows Docker. Use for: `depends_on: condition: service_healthy` and named `pgdata` volume only.

## Wisdom (Communities)

- [r/FastAPI](https://www.reddit.com/r/FastAPI/)
  Active, beginner-tolerant. Use for: "is this pattern idiomatic" questions about routers/dependencies.
- [FastAPI GitHub Discussions](https://github.com/fastapi/fastapi/discussions)
  Maintainer-adjacent, high signal-to-noise. Use for: subtle `Depends`/lifespan behaviour.
- [r/PostgreSQL](https://www.reddit.com/r/PostgreSQL/)
  Use for: query-performance questions (e.g. the 62k-row seed and full-table loads).
- [Python Discord (#web-development)](https://discord.com/invite/python)
  Real-time help when stuck mid-assessment prep.

## Gaps

- Exact task type within the live hour unknown (bug-fix vs add-feature vs both). Lesson 5 simulates the most likely: one small feature end-to-end + one planted bug spotted and fixed.
