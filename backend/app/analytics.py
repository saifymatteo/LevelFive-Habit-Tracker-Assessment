from datetime import date, timedelta


def current_streak(dates):
    streak = 0
    day = date.today()
    while day in dates:
        streak += 1
        day -= timedelta(days=1)
    return streak


def best_streak(dates):
    ordered = sorted(dates)
    best = 0
    run = 0
    prev = None
    for d in ordered:
        if prev is not None and (d - prev).days == 1:
            run += 1
        elif prev == d:
            continue
        else:
            run = 1
        best = max(best, run)
        prev = d
    return best


def completion_rate(dates, days=30):
    today = date.today()
    hits = 0
    for i in range(days):
        if (today - timedelta(days=i)) in dates:
            hits += 1
    return hits / days
