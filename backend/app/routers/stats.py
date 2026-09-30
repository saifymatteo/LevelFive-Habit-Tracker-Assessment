from collections import defaultdict
from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..analytics import best_streak, completion_rate, current_streak
from ..database import get_db
from ..deps import get_current_user
from ..models import Habit, HabitLog, User

router = APIRouter()


@router.get("/dashboard")
def dashboard(
    user_id: int | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    owner_id = user_id if user_id is not None else user.id
    owner = db.get(User, owner_id)
    habits = (
        db.query(Habit)
        .filter(Habit.user_id == owner_id)
        .order_by(Habit.id)
        .all()
    )
    logs = (
        db.query(HabitLog)
        .join(Habit, HabitLog.habit_id == Habit.id)
        .filter(Habit.user_id == owner_id)
        .all()
    )

    dates_by_habit = defaultdict(list)
    count_by_date = defaultdict(int)
    for log in logs:
        dates_by_habit[log.habit_id].append(log.log_date)
        count_by_date[log.log_date] += 1

    today = date.today()
    per_habit = []
    for h in habits:
        ds = dates_by_habit.get(h.id, [])
        per_habit.append(
            {
                "id": h.id,
                "name": h.name,
                "emoji": h.emoji,
                "current_streak": current_streak(ds),
                "best_streak": best_streak(ds),
                "today_done": today in ds,
                "week": [
                    (today - timedelta(days=i)) in ds
                    for i in range(6, -1, -1)
                ],
                "rate30": completion_rate(ds),
            }
        )

    heatmap = []
    for i in range(83, -1, -1):
        d = today - timedelta(days=i)
        heatmap.append(
            {"date": d.isoformat(), "count": count_by_date.get(d, 0)}
        )

    return {
        "user": {
            "id": owner_id,
            "name": owner.name if owner else "Unknown",
            "email": owner.email if owner else "",
        },
        "totals": {
            "habits": len(habits),
            "checkins": len(logs),
            "today": count_by_date.get(today, 0),
        },
        "habits": per_habit,
        "heatmap": heatmap,
    }
