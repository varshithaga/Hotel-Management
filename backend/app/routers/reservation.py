from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..crud import reservation as reservation_crud
from ..database import get_db

router = APIRouter(prefix="/reservations", tags=["Reservations"])


@router.get("/", response_model=list[schemas.ReservationOut])
def list_reservations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return reservation_crud.get_reservations(db, skip=skip, limit=limit)


@router.get("/{reservation_id}", response_model=schemas.ReservationOut)
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_obj = reservation_crud.get_reservation(db, reservation_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
    return db_obj


@router.post("/", response_model=schemas.ReservationOut, status_code=status.HTTP_201_CREATED)
def create_reservation(reservation_in: schemas.ReservationCreate, db: Session = Depends(get_db)):
    return reservation_crud.create_reservation(db, reservation_in)


@router.put("/{reservation_id}", response_model=schemas.ReservationOut)
def update_reservation(reservation_id: int, reservation_in: schemas.ReservationUpdate, db: Session = Depends(get_db)):
    db_obj = reservation_crud.update_reservation(db, reservation_id, reservation_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
    return db_obj


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_obj = reservation_crud.delete_reservation(db, reservation_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")


@router.post("/{reservation_id}/rooms/{room_id}", response_model=schemas.ReservationOut)
def add_room_to_reservation(reservation_id: int, room_id: int, db: Session = Depends(get_db)):
    db_obj = reservation_crud.add_room_to_reservation(db, reservation_id, room_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation or room not found")
    return db_obj


@router.delete("/{reservation_id}/rooms/{room_id}", response_model=schemas.ReservationOut)
def remove_room_from_reservation(reservation_id: int, room_id: int, db: Session = Depends(get_db)):
    db_obj = reservation_crud.remove_room_from_reservation(db, reservation_id, room_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation or room not found")
    return db_obj
