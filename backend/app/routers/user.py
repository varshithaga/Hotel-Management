from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..crud import user as user_crud
from ..database import get_db

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[schemas.UserOut])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_crud.get_users(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.post("/", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user_in)


@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user_in: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = user_crud.update_user(db, user_id, user_in)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.delete_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
