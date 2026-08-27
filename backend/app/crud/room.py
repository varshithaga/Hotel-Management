# CRUD operations for: RoomType, Room, RoomImage, Amenity, RoomAmenity
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db_utils import safe_delete


# --- RoomType ---

def get_room_type(db: Session, room_type_id: int):
    return db.query(models.RoomType).filter(models.RoomType.id == room_type_id).first()


def query_room_types(db: Session, search: str | None = None):
    query = db.query(models.RoomType)
    if search:
        query = query.filter(models.RoomType.name.ilike(f"%{search}%"))
    return query.order_by(models.RoomType.id.desc())


def create_room_type(db: Session, room_type_in: schemas.RoomTypeCreate):
    db_obj = models.RoomType(**room_type_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_room_type(db: Session, room_type_id: int, room_type_in: schemas.RoomTypeUpdate):
    db_obj = get_room_type(db, room_type_id)
    if not db_obj:
        return None
    for field, value in room_type_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_room_type(db: Session, room_type_id: int):
    db_obj = get_room_type(db, room_type_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


# --- Amenity ---

def get_amenity(db: Session, amenity_id: int):
    return db.query(models.Amenity).filter(models.Amenity.id == amenity_id).first()


def query_amenities(db: Session, search: str | None = None):
    query = db.query(models.Amenity)
    if search:
        query = query.filter(models.Amenity.name.ilike(f"%{search}%"))
    return query.order_by(models.Amenity.id.desc())


def create_amenity(db: Session, amenity_in: schemas.AmenityCreate):
    db_obj = models.Amenity(**amenity_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_amenity(db: Session, amenity_id: int, amenity_in: schemas.AmenityUpdate):
    db_obj = get_amenity(db, amenity_id)
    if not db_obj:
        return None
    for field, value in amenity_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_amenity(db: Session, amenity_id: int):
    db_obj = get_amenity(db, amenity_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


# --- RoomImage ---

def get_room_image(db: Session, room_image_id: int):
    return db.query(models.RoomImage).filter(models.RoomImage.id == room_image_id).first()


def query_room_images(db: Session, room_id: int | None = None):
    query = db.query(models.RoomImage)
    if room_id is not None:
        query = query.filter(models.RoomImage.room_id == room_id)
    return query.order_by(models.RoomImage.id.desc())


def create_room_image(db: Session, room_image_in: schemas.RoomImageCreate):
    db_obj = models.RoomImage(**room_image_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_room_image(db: Session, room_image_id: int, room_image_in: schemas.RoomImageUpdate):
    db_obj = get_room_image(db, room_image_id)
    if not db_obj:
        return None
    for field, value in room_image_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_room_image(db: Session, room_image_id: int):
    db_obj = get_room_image(db, room_image_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


# --- Room ---

def get_room(db: Session, room_id: int):
    return db.query(models.Room).filter(models.Room.id == room_id).first()


def query_rooms(db: Session, search: str | None = None):
    query = db.query(models.Room)
    if search:
        query = query.filter(models.Room.name.ilike(f"%{search}%"))
    return query.order_by(models.Room.id.desc())


def query_public_rooms(db: Session, room_type_id: int | None = None, min_capacity: int | None = None):
    """Active rooms only, cheapest first — used by the guest website."""
    query = db.query(models.Room).filter(models.Room.is_active.is_(True))
    if room_type_id is not None:
        query = query.filter(models.Room.room_type_id == room_type_id)
    if min_capacity is not None:
        query = query.filter(models.Room.capacity >= min_capacity)
    return query.order_by(models.Room.price_per_night.asc())


def reserved_room_ids(db: Session, check_in, check_out) -> set[int]:
    """Room ids held by a non-canceled reservation overlapping [check_in, check_out)."""
    rows = (
        db.query(models.ReservationRoom.room_id)
        .join(models.Reservation, models.Reservation.id == models.ReservationRoom.reservation_id)
        .filter(
            models.Reservation.is_it_canceled.is_(False),
            models.Reservation.reserved_check_in_date < check_out,
            models.Reservation.reserved_check_out_date > check_in,
        )
        .all()
    )
    return {row[0] for row in rows}


def create_room(db: Session, room_in: schemas.RoomCreate):
    db_obj = models.Room(**room_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_room(db: Session, room_id: int, room_in: schemas.RoomUpdate):
    db_obj = get_room(db, room_id)
    if not db_obj:
        return None
    for field, value in room_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_room(db: Session, room_id: int):
    db_obj = get_room(db, room_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


def add_amenity_to_room(db: Session, room_id: int, amenity_id: int):
    room = get_room(db, room_id)
    amenity = get_amenity(db, amenity_id)
    if not room or not amenity:
        return None
    if amenity not in room.amenities:
        room.amenities.append(amenity)
        db.commit()
        db.refresh(room)
    return room


def remove_amenity_from_room(db: Session, room_id: int, amenity_id: int):
    room = get_room(db, room_id)
    amenity = get_amenity(db, amenity_id)
    if not room or not amenity:
        return None
    if amenity in room.amenities:
        room.amenities.remove(amenity)
        db.commit()
        db.refresh(room)
    return room
