# CRUD operations for: User
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db_utils import safe_delete
from ..security import hash_password


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def query_users(db: Session, search: str | None = None):
    query = db.query(models.User)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (models.User.username.ilike(like))
            | (models.User.email.ilike(like))
            | (models.User.full_name.ilike(like))
        )
    return query.order_by(models.User.id.desc())


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
    safe_delete(db, db_user)
    return db_user
