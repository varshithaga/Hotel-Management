import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..crud import room as room_crud
from ..database import get_db

# No auth dependency here: these endpoints power the public guest website.
router = APIRouter(prefix="/public", tags=["Public"])


def _serialize_room(room: models.Room) -> schemas.PublicRoomOut:
    return schemas.PublicRoomOut(
        id=room.id,
        name=room.name,
        price_per_night=room.price_per_night,
        capacity=room.capacity,
        no_of_beds=room.no_of_beds,
        description=room.description,
        is_active=bool(room.is_active),
        is_it_reserved=bool(room.is_it_reserved),
        floor_id=room.floor_id,
        room_type_id=room.room_type_id,
        room_type_name=room.room_type.name if room.room_type else None,
        floor_name=room.floor.name if room.floor else None,
        images=[schemas.RoomImageOut.model_validate(img) for img in room.images],
        amenities=[schemas.AmenityOut.model_validate(a) for a in room.amenities],
    )


@router.get("/rooms/", response_model=list[schemas.PublicRoomOut])
def list_public_rooms(
    room_type_id: int | None = None,
    guests: int | None = Query(None, ge=1),
    db: Session = Depends(get_db),
):
    rooms = room_crud.query_public_rooms(db, room_type_id=room_type_id, min_capacity=guests).all()
    return [_serialize_room(r) for r in rooms]


@router.get("/rooms/{room_id}", response_model=schemas.PublicRoomOut)
def get_public_room(room_id: int, db: Session = Depends(get_db)):
    room = room_crud.get_room(db, room_id)
    if not room or not room.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return _serialize_room(room)


@router.get("/room-types/", response_model=list[schemas.RoomTypeOut])
def list_public_room_types(db: Session = Depends(get_db)):
    return room_crud.query_room_types(db).all()


@router.get("/amenities/", response_model=list[schemas.AmenityOut])
def list_public_amenities(db: Session = Depends(get_db)):
    return room_crud.query_amenities(db).all()


@router.get("/availability/", response_model=schemas.AvailabilityOut)
def check_availability(
    check_in: datetime.date = Query(...),
    check_out: datetime.date = Query(...),
    guests: int | None = Query(None, ge=1),
    room_type_id: int | None = None,
    db: Session = Depends(get_db),
):
    if check_out <= check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="check_out must be after check_in",
        )

    ci = datetime.datetime.combine(check_in, datetime.time.min)
    co = datetime.datetime.combine(check_out, datetime.time.min)

    taken = room_crud.reserved_room_ids(db, ci, co)
    rooms = room_crud.query_public_rooms(db, room_type_id=room_type_id, min_capacity=guests).all()
    available = [r for r in rooms if r.id not in taken]

    return schemas.AvailabilityOut(
        check_in=check_in,
        check_out=check_out,
        nights=(check_out - check_in).days,
        guests=guests,
        count=len(available),
        available_rooms=[_serialize_room(r) for r in available],
    )
