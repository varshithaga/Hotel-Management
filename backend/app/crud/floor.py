# CRUD operations for: Floor
from sqlalchemy.orm import Session

from .. import models, schemas


def get_floor(db: Session, floor_id: int):
    return db.query(models.Floor).filter(models.Floor.id == floor_id).first()


def get_floors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Floor).offset(skip).limit(limit).all()


def create_floor(db: Session, floor_in: schemas.FloorCreate):
    db_floor = models.Floor(**floor_in.model_dump())
    db.add(db_floor)
    db.commit()
    db.refresh(db_floor)
    return db_floor


def update_floor(db: Session, floor_id: int, floor_in: schemas.FloorUpdate):
    db_floor = get_floor(db, floor_id)
    if not db_floor:
        return None
    for field, value in floor_in.model_dump(exclude_unset=True).items():
        setattr(db_floor, field, value)
    db.commit()
    db.refresh(db_floor)
    return db_floor


def delete_floor(db: Session, floor_id: int):
    db_floor = get_floor(db, floor_id)
    if not db_floor:
        return None
    db.delete(db_floor)
    db.commit()
    return db_floor
