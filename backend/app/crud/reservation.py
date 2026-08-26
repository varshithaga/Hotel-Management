# CRUD operations for: Reservation, ReservationRoom
from sqlalchemy.orm import Session

from .. import models, schemas
import datetime


def get_reservation(db: Session, reservation_id: int):
    return db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()


def get_reservations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reservation).offset(skip).limit(limit).all()


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
    db.delete(db_obj)
    db.commit()
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
