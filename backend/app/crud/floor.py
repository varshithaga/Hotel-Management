# CRUD operations for: Floor
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db_utils import safe_delete


def get_floor(db: Session, floor_id: int):
    return db.query(models.Floor).filter(models.Floor.id == floor_id).first()


def query_floors(db: Session, search: str | None = None):
    query = db.query(models.Floor)
    if search:
        query = query.filter(models.Floor.name.ilike(f"%{search}%"))
    return query.order_by(models.Floor.id.asc())


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
    safe_delete(db, db_floor)
    return db_floor
