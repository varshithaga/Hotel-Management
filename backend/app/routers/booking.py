from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..crud import booking as booking_crud
from ..database import get_db

booking_router = APIRouter(prefix="/bookings", tags=["Bookings"])
payment_router = APIRouter(prefix="/payments", tags=["Payments"])
review_router = APIRouter(prefix="/reviews", tags=["Reviews"])


# --- AllBooking ---

@booking_router.get("/", response_model=list[schemas.AllBookingOut])
def list_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return booking_crud.get_bookings(db, skip=skip, limit=limit)


@booking_router.get("/{booking_id}", response_model=schemas.AllBookingOut)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    db_obj = booking_crud.get_booking(db, booking_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return db_obj


@booking_router.post("/", response_model=schemas.AllBookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(booking_in: schemas.AllBookingCreate, db: Session = Depends(get_db)):
    return booking_crud.create_booking(db, booking_in)


@booking_router.put("/{booking_id}", response_model=schemas.AllBookingOut)
def update_booking(booking_id: int, booking_in: schemas.AllBookingUpdate, db: Session = Depends(get_db)):
    db_obj = booking_crud.update_booking(db, booking_id, booking_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return db_obj


@booking_router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    db_obj = booking_crud.delete_booking(db, booking_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")


# --- Payment ---

@payment_router.get("/", response_model=list[schemas.PaymentOut])
def list_payments(booking_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return booking_crud.get_payments(db, booking_id=booking_id, skip=skip, limit=limit)


@payment_router.get("/{payment_id}", response_model=schemas.PaymentOut)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    db_obj = booking_crud.get_payment(db, payment_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return db_obj


@payment_router.post("/", response_model=schemas.PaymentOut, status_code=status.HTTP_201_CREATED)
def create_payment(payment_in: schemas.PaymentCreate, db: Session = Depends(get_db)):
    return booking_crud.create_payment(db, payment_in)


@payment_router.put("/{payment_id}", response_model=schemas.PaymentOut)
def update_payment(payment_id: int, payment_in: schemas.PaymentUpdate, db: Session = Depends(get_db)):
    db_obj = booking_crud.update_payment(db, payment_id, payment_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return db_obj


@payment_router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    db_obj = booking_crud.delete_payment(db, payment_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")


# --- Review ---

@review_router.get("/", response_model=list[schemas.ReviewOut])
def list_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return booking_crud.get_reviews(db, skip=skip, limit=limit)


@review_router.get("/{review_id}", response_model=schemas.ReviewOut)
def get_review(review_id: int, db: Session = Depends(get_db)):
    db_obj = booking_crud.get_review(db, review_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    return db_obj


@review_router.post("/", response_model=schemas.ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(review_in: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return booking_crud.create_review(db, review_in)


@review_router.put("/{review_id}", response_model=schemas.ReviewOut)
def update_review(review_id: int, review_in: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    db_obj = booking_crud.update_review(db, review_id, review_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    return db_obj


@review_router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    db_obj = booking_crud.delete_review(db, review_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
