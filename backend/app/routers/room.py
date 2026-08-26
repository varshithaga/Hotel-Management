from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..auth import get_current_user
from ..crud import room as room_crud
from ..database import get_db
from ..pagination import PageParams, PaginatedResponse, paginate_query

room_type_router = APIRouter(prefix="/room-types", tags=["Room Types"], dependencies=[Depends(get_current_user)])
amenity_router = APIRouter(prefix="/amenities", tags=["Amenities"], dependencies=[Depends(get_current_user)])
room_image_router = APIRouter(prefix="/room-images", tags=["Room Images"], dependencies=[Depends(get_current_user)])
room_router = APIRouter(prefix="/rooms", tags=["Rooms"], dependencies=[Depends(get_current_user)])


# --- RoomType ---

@room_type_router.get("/", response_model=PaginatedResponse[schemas.RoomTypeOut])
def list_room_types(params: PageParams = Depends(), db: Session = Depends(get_db)):
    query = room_crud.query_room_types(db, search=params.search)
    return paginate_query(query, params.page, params.limit)


@room_type_router.get("/all/", response_model=list[schemas.RoomTypeOut])
def list_all_room_types(search: str | None = None, db: Session = Depends(get_db)):
    return room_crud.query_room_types(db, search=search).all()


@room_type_router.get("/{room_type_id}", response_model=schemas.RoomTypeOut)
def get_room_type(room_type_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.get_room_type(db, room_type_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room type not found")
    return db_obj


@room_type_router.post("/", response_model=schemas.RoomTypeOut, status_code=status.HTTP_201_CREATED)
def create_room_type(room_type_in: schemas.RoomTypeCreate, db: Session = Depends(get_db)):
    return room_crud.create_room_type(db, room_type_in)


@room_type_router.put("/{room_type_id}", response_model=schemas.RoomTypeOut)
def update_room_type(room_type_id: int, room_type_in: schemas.RoomTypeUpdate, db: Session = Depends(get_db)):
    db_obj = room_crud.update_room_type(db, room_type_id, room_type_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room type not found")
    return db_obj


@room_type_router.delete("/{room_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room_type(room_type_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.delete_room_type(db, room_type_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room type not found")


# --- Amenity ---

@amenity_router.get("/", response_model=PaginatedResponse[schemas.AmenityOut])
def list_amenities(params: PageParams = Depends(), db: Session = Depends(get_db)):
    query = room_crud.query_amenities(db, search=params.search)
    return paginate_query(query, params.page, params.limit)


@amenity_router.get("/all/", response_model=list[schemas.AmenityOut])
def list_all_amenities(search: str | None = None, db: Session = Depends(get_db)):
    return room_crud.query_amenities(db, search=search).all()


@amenity_router.get("/{amenity_id}", response_model=schemas.AmenityOut)
def get_amenity(amenity_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.get_amenity(db, amenity_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Amenity not found")
    return db_obj


@amenity_router.post("/", response_model=schemas.AmenityOut, status_code=status.HTTP_201_CREATED)
def create_amenity(amenity_in: schemas.AmenityCreate, db: Session = Depends(get_db)):
    return room_crud.create_amenity(db, amenity_in)


@amenity_router.put("/{amenity_id}", response_model=schemas.AmenityOut)
def update_amenity(amenity_id: int, amenity_in: schemas.AmenityUpdate, db: Session = Depends(get_db)):
    db_obj = room_crud.update_amenity(db, amenity_id, amenity_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Amenity not found")
    return db_obj


@amenity_router.delete("/{amenity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_amenity(amenity_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.delete_amenity(db, amenity_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Amenity not found")


# --- RoomImage ---

@room_image_router.get("/", response_model=PaginatedResponse[schemas.RoomImageOut])
def list_room_images(room_id: int | None = None, params: PageParams = Depends(), db: Session = Depends(get_db)):
    query = room_crud.query_room_images(db, room_id=room_id)
    return paginate_query(query, params.page, params.limit)


@room_image_router.get("/all/", response_model=list[schemas.RoomImageOut])
def list_all_room_images(room_id: int | None = None, db: Session = Depends(get_db)):
    return room_crud.query_room_images(db, room_id=room_id).all()


@room_image_router.get("/{room_image_id}", response_model=schemas.RoomImageOut)
def get_room_image(room_image_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.get_room_image(db, room_image_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room image not found")
    return db_obj


@room_image_router.post("/", response_model=schemas.RoomImageOut, status_code=status.HTTP_201_CREATED)
def create_room_image(room_image_in: schemas.RoomImageCreate, db: Session = Depends(get_db)):
    return room_crud.create_room_image(db, room_image_in)


@room_image_router.put("/{room_image_id}", response_model=schemas.RoomImageOut)
def update_room_image(room_image_id: int, room_image_in: schemas.RoomImageUpdate, db: Session = Depends(get_db)):
    db_obj = room_crud.update_room_image(db, room_image_id, room_image_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room image not found")
    return db_obj


@room_image_router.delete("/{room_image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room_image(room_image_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.delete_room_image(db, room_image_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room image not found")


# --- Room ---

@room_router.get("/", response_model=PaginatedResponse[schemas.RoomOut])
def list_rooms(params: PageParams = Depends(), db: Session = Depends(get_db)):
    query = room_crud.query_rooms(db, search=params.search)
    return paginate_query(query, params.page, params.limit)


@room_router.get("/all/", response_model=list[schemas.RoomOut])
def list_all_rooms(search: str | None = None, db: Session = Depends(get_db)):
    return room_crud.query_rooms(db, search=search).all()


@room_router.get("/{room_id}", response_model=schemas.RoomOut)
def get_room(room_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.get_room(db, room_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return db_obj


@room_router.post("/", response_model=schemas.RoomOut, status_code=status.HTTP_201_CREATED)
def create_room(room_in: schemas.RoomCreate, db: Session = Depends(get_db)):
    return room_crud.create_room(db, room_in)


@room_router.put("/{room_id}", response_model=schemas.RoomOut)
def update_room(room_id: int, room_in: schemas.RoomUpdate, db: Session = Depends(get_db)):
    db_obj = room_crud.update_room(db, room_id, room_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return db_obj


@room_router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.delete_room(db, room_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")


@room_router.post("/{room_id}/amenities/{amenity_id}", response_model=schemas.RoomOut)
def add_amenity_to_room(room_id: int, amenity_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.add_amenity_to_room(db, room_id, amenity_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room or amenity not found")
    return db_obj


@room_router.delete("/{room_id}/amenities/{amenity_id}", response_model=schemas.RoomOut)
def remove_amenity_from_room(room_id: int, amenity_id: int, db: Session = Depends(get_db)):
    db_obj = room_crud.remove_amenity_from_room(db, room_id, amenity_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room or amenity not found")
    return db_obj
