# CRUD operations for: AllBooking, Payment, Review
import datetime

from sqlalchemy.orm import Session

from .. import models, schemas
from ..db_utils import safe_delete


# --- AllBooking ---

def get_booking(db: Session, booking_id: int):
    return db.query(models.AllBooking).filter(models.AllBooking.id == booking_id).first()


def query_bookings(db: Session, search: str | None = None):
    query = db.query(models.AllBooking)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (models.AllBooking.user_name.ilike(like))
            | (models.AllBooking.user_email.ilike(like))
            | (models.AllBooking.user_phone.ilike(like))
        )
    return query.order_by(models.AllBooking.id.desc())


def create_booking(db: Session, booking_in: schemas.AllBookingCreate):
    db_obj = models.AllBooking(**booking_in.model_dump(), created_at=datetime.datetime.utcnow())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_booking(db: Session, booking_id: int, booking_in: schemas.AllBookingUpdate):
    db_obj = get_booking(db, booking_id)
    if not db_obj:
        return None
    for field, value in booking_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_booking(db: Session, booking_id: int):
    db_obj = get_booking(db, booking_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


# --- Payment ---

def get_payment(db: Session, payment_id: int):
    return db.query(models.Payment).filter(models.Payment.id == payment_id).first()


def query_payments(db: Session, booking_id: int | None = None, search: str | None = None):
    query = db.query(models.Payment)
    if booking_id is not None:
        query = query.filter(models.Payment.booking_id == booking_id)
    if search:
        query = query.filter(models.Payment.transaction_ref.ilike(f"%{search}%"))
    return query.order_by(models.Payment.id.desc())


def create_payment(db: Session, payment_in: schemas.PaymentCreate):
    db_obj = models.Payment(**payment_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_payment(db: Session, payment_id: int, payment_in: schemas.PaymentUpdate):
    db_obj = get_payment(db, payment_id)
    if not db_obj:
        return None
    for field, value in payment_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_payment(db: Session, payment_id: int):
    db_obj = get_payment(db, payment_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


# --- Review ---

def get_review(db: Session, review_id: int):
    return db.query(models.Review).filter(models.Review.id == review_id).first()


def query_reviews(db: Session, search: str | None = None):
    query = db.query(models.Review)
    if search:
        query = query.filter(models.Review.comment.ilike(f"%{search}%"))
    return query.order_by(models.Review.id.desc())


def create_review(db: Session, review_in: schemas.ReviewCreate):
    db_obj = models.Review(**review_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_review(db: Session, review_id: int, review_in: schemas.ReviewUpdate):
    db_obj = get_review(db, review_id)
    if not db_obj:
        return None
    for field, value in review_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_review(db: Session, review_id: int):
    db_obj = get_review(db, review_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj
