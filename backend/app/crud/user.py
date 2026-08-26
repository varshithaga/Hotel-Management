# CRUD operations for: User
from sqlalchemy.orm import Session

from .. import models, schemas
from ..security import hash_password


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user_in: schemas.UserCreate):
    data = user_in.model_dump(exclude={"password"})
    db_user = models.User(**data, hashed_password=hash_password(user_in.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_in: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    update_data = user_in.model_dump(exclude_unset=True)
    password = update_data.pop("password", None)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    if password:
        db_user.hashed_password = hash_password(password)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return db_user
