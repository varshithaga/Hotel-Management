# CRUD operations for: Reservation, ReservationRoom
import datetime

from sqlalchemy.orm import Session

from .. import models, schemas
from ..db_utils import safe_delete


def get_reservation(db: Session, reservation_id: int):
    return db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()


def query_reservations(db: Session, search: str | None = None):
    query = db.query(models.Reservation)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (models.Reservation.user_name.ilike(like))
            | (models.Reservation.user_email.ilike(like))
            | (models.Reservation.user_phone.ilike(like))
        )
    return query.order_by(models.Reservation.id.asc())


def create_reservation(db: Session, reservation_in: schemas.ReservationCreate):
    data = reservation_in.model_dump(exclude={"room_ids"})
    db_obj = models.Reservation(**data, created_at=datetime.datetime.utcnow())
    if reservation_in.room_ids:
        rooms = db.query(models.Room).filter(models.Room.id.in_(reservation_in.room_ids)).all()
        db_obj.rooms = rooms
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_reservation(db: Session, reservation_id: int, reservation_in: schemas.ReservationUpdate):
    db_obj = get_reservation(db, reservation_id)
    if not db_obj:
        return None
    update_data = reservation_in.model_dump(exclude_unset=True)
    room_ids = update_data.pop("room_ids", None)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    if room_ids is not None:
        db_obj.rooms = db.query(models.Room).filter(models.Room.id.in_(room_ids)).all()
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_reservation(db: Session, reservation_id: int):
    db_obj = get_reservation(db, reservation_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


def add_room_to_reservation(db: Session, reservation_id: int, room_id: int):
    reservation = get_reservation(db, reservation_id)
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not reservation or not room:
        return None
    if room not in reservation.rooms:
        reservation.rooms.append(room)
        db.commit()
        db.refresh(reservation)
    return reservation


def remove_room_from_reservation(db: Session, reservation_id: int, room_id: int):
    reservation = get_reservation(db, reservation_id)
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not reservation or not room:
        return None
    if room in reservation.rooms:
        reservation.rooms.remove(room)
        db.commit()
        db.refresh(reservation)
    return reservation
