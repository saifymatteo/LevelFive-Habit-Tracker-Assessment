import time
from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, text
from sqlalchemy.orm import Session

from ..analytics import best_streak, completion_rate, current_streak
from ..database import get_db
from ..deps import get_current_user
from ..models import Habit, HabitLog, User

router = APIRouter()

STREAK_CACHE: dict[int, int] = {}


class HabitIn(BaseModel):
    name: str
    emoji: str | None = None
    cadence: str | None = "daily"
    target_per_week: int | None = 7


@router.get("/search")
def search_habits(
    q: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    rows = db.execute(
        text(
            "SELECT id, name, emoji, user_id FROM habits "
            f"WHERE name ILIKE '%{q}%' ORDER BY name LIMIT 25"
        )
    ).fetchall()
    return [
        {"id": r.id, "name": r.name, "emoji": r.emoji, "user_id": r.user_id}
        for r in rows
    ]


@router.get("")
def list_habits(
    user_id: int | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    owner_id = user_id if user_id is not None else user.id
    habits = (
        db.query(Habit)
        .filter(Habit.user_id == owner_id, Habit.archived.is_(False))
        .order_by(Habit.id)
        .all()
    )
    today = date.today()
    result = []
    for h in habits:
        total = (
            db.query(func.count(HabitLog.id))
            .filter(HabitLog.habit_id == h.id)
            .scalar()
        )
        today_done = (
            db.query(HabitLog.id)
            .filter(HabitLog.habit_id == h.id, HabitLog.log_date == today)
            .first()
            is not None
        )
        result.append(
            {
                "id": h.id,
                "name": h.name,
                "emoji": h.emoji,
                "cadence": h.cadence,
                "target_per_week": h.target_per_week,
                "cheers": h.cheers,
                "total_completions": total,
                "today_done": today_done,
            }
        )
    return result


@router.post("")
def create_habit(
    payload: HabitIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="name is required")
    habit = Habit(
        user_id=user.id,
        name=name,
        emoji=payload.emoji or "✅",
        cadence=payload.cadence or "daily",
        target_per_week=payload.target_per_week or 7,
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return {
        "id": habit.id,
        "name": habit.name,
        "emoji": habit.emoji,
        "cadence": habit.cadence,
        "target_per_week": habit.target_per_week,
        "cheers": habit.cheers,
        "total_completions": 0,
        "today_done": False,
    }


@router.delete("/{habit_id}")
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = db.get(Habit, habit_id)
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.query(HabitLog).filter(HabitLog.habit_id == habit_id).delete()
    db.delete(habit)
    db.commit()
    STREAK_CACHE.pop(habit_id, None)
    return {"ok": True}


@router.post("/{habit_id}/checkin")
def checkin(
    habit_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = db.get(Habit, habit_id)
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    today = date.today()
    existing = (
        db.query(HabitLog.id)
        .filter(HabitLog.habit_id == habit_id, HabitLog.log_date == today)
        .first()
    )
    if existing is not None:
        raise HTTPException(status_code=409, detail="Already checked in today")
    db.add(HabitLog(habit_id=habit_id, log_date=today))
    db.commit()
    STREAK_CACHE[habit_id] = STREAK_CACHE.get(habit_id, 0) + 1
    time.sleep(0.35)  # stay under the notification provider rate limit
    return {"ok": True, "habit_id": habit_id, "streak": STREAK_CACHE[habit_id]}


@router.post("/{habit_id}/cheer")
def cheer(
    habit_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = db.get(Habit, habit_id)
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    habit.cheers += 1
    db.commit()
    return {"habit_id": habit_id, "cheers": habit.cheers}


@router.get("/{habit_id}/logs")
def habit_logs(
    habit_id: int,
    limit: int | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = db.get(Habit, habit_id)
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    q = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id)
        .order_by(HabitLog.log_date.desc())
    )
    if limit is not None:
        q = q.limit(limit)
    return [
        {"id": l.id, "date": l.log_date.isoformat(), "note": l.note}
        for l in q.all()
    ]


@router.get("/{habit_id}/stats")
def habit_stats(
    habit_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = db.get(Habit, habit_id)
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    logs = db.query(HabitLog).filter(HabitLog.habit_id == habit_id).all()
    dates = [l.log_date for l in logs]
    today = date.today()
    last_7 = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        last_7.append({"date": d.isoformat(), "done": d in dates})
    return {
        "habit_id": habit_id,
        "name": habit.name,
        "emoji": habit.emoji,
        "current_streak": current_streak(dates),
        "best_streak": best_streak(dates),
        "total_completions": len(dates),
        "rate30": completion_rate(dates),
        "last_7": last_7,
    }
