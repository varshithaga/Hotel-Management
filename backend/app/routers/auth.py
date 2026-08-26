from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import create_access_token, create_refresh_token, decode_token, get_current_user
from ..database import get_db
from ..security import verify_password

router = APIRouter(prefix="/token", tags=["Auth"])


@router.post("/", response_model=schemas.TokenPair)
def login(credentials: schemas.TokenObtainRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == credentials.username).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return {
        "access": create_access_token(user),
        "refresh": create_refresh_token(user),
        "user": user,
    }


@router.post("/refresh/", response_model=schemas.TokenRefreshResponse)
def refresh(payload: schemas.TokenRefreshRequest, db: Session = Depends(get_db)):
    data = decode_token(payload.refresh)
    if data.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    user = db.query(models.User).filter(models.User.id == int(data.get("sub"))).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return {"access": create_access_token(user)}


me_router = APIRouter(prefix="/me", tags=["Auth"])


@me_router.get("/", response_model=schemas.UserOut)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user
