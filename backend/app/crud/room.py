# CRUD operations for: RoomType, Room, RoomImage, Amenity, RoomAmenity
from sqlalchemy.orm import Session

from .. import models, schemas


# --- RoomType ---

def get_room_type(db: Session, room_type_id: int):
    return db.query(models.RoomType).filter(models.RoomType.id == room_type_id).first()


def get_room_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.RoomType).offset(skip).limit(limit).all()


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
    db.delete(db_obj)
    db.commit()
    return db_obj


# --- Amenity ---

def get_amenity(db: Session, amenity_id: int):
    return db.query(models.Amenity).filter(models.Amenity.id == amenity_id).first()


def get_amenities(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Amenity).offset(skip).limit(limit).all()


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
    db.delete(db_obj)
    db.commit()
    return db_obj


# --- RoomImage ---

def get_room_image(db: Session, room_image_id: int):
    return db.query(models.RoomImage).filter(models.RoomImage.id == room_image_id).first()


def get_room_images(db: Session, room_id: int | None = None, skip: int = 0, limit: int = 100):
    query = db.query(models.RoomImage)
    if room_id is not None:
        query = query.filter(models.RoomImage.room_id == room_id)
    return query.offset(skip).limit(limit).all()


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
    db.delete(db_obj)
    db.commit()
    return db_obj


# --- Room ---

def get_room(db: Session, room_id: int):
    return db.query(models.Room).filter(models.Room.id == room_id).first()


def get_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Room).offset(skip).limit(limit).all()


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
    db.delete(db_obj)
    db.commit()
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
