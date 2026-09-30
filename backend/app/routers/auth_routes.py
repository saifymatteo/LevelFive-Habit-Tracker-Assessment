from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User

router = APIRouter()


class LoginIn(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(body: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if user is None or user.password != body.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "token": str(user.id),
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }
